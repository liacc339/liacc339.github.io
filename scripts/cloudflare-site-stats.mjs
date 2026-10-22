/**
 * Public site stats; API credentials remain private in GitHub Actions secrets.
 * CF_ACCOUNT_ID: Cloudflare 32-char account ID
 * CF_API_TOKEN: token with Account / Account Analytics / Read permission
 */
import fs from "node:fs";
const siteTag="1029e329949f418ba91fe590e9050219";
const hostname="liacc339.github.io";
const out="data/site-stats.json";
const id=(process.env.CF_ACCOUNT_ID||"").trim();
const token=(process.env.CF_API_TOKEN||"").trim();
if(!id||!token){console.error("Missing CF_ACCOUNT_ID or CF_API_TOKEN secrets.");process.exit(2);}
if(!/^[a-fA-F0-9]{32}$/.test(id)){console.error("CF_ACCOUNT_ID must be 32 hex chars.");process.exit(2);}
const now=new Date();
const from=new Date(new Date(now.toISOString().slice(0,10)+"T00:00:00.000Z").getTime()-29*86400000);
const query=[
 "query Dashboard($accountTag:string,$filter:AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject){",
 "  viewer { accounts(filter:{accountTag:$accountTag}) {",
 "    rumPageloadEventsAdaptiveGroups(limit:5000,orderBy:[date_ASC],filter:$filter) {",
 "      count",
 "      dimensions { date requestPath requestHost }",
 "    }",
 "  } }",
 "}"
].join("\n");
const response=await fetch("https://api.cloudflare.com/client/v4/graphql",{
  method:"POST",
  headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json","Accept":"application/json"},
  body:JSON.stringify({
    query,
    variables:{
      accountTag:id,
      filter:{siteTag,datetime_geq:from.toISOString(),datetime_leq:now.toISOString()}
    }
  })
});
if(!response.ok)throw Error("Cloudflare HTTP "+response.status);
const body=await response.json();
if(body.errors&&body.errors.length)throw Error("Cloudflare GraphQL: "+body.errors.map(x=>x.message).join("; "));
const accounts=(body.data&&body.data.viewer&&body.data.viewer.accounts)||[];
if(accounts.length!==1)throw Error("Unexpected account count: "+accounts.length);
const rows=accounts[0].rumPageloadEventsAdaptiveGroups;
if(!Array.isArray(rows))throw Error("Cloudflare returned no valid RUM dataset.");
// Query by the Web Analytics property tag, then validate observed hostnames.
const observedHosts=new Map();
for(const row of rows){
 const host=String(row.dimensions?.requestHost||"(missing)").toLowerCase();
 observedHosts.set(host,(observedHosts.get(host)||0)+Number(row.count||0));
}
console.log("RUM groups for Web Analytics property: "+rows.length);
console.log("RUM host distribution: "+JSON.stringify(Object.fromEntries(observedHosts)));
if(rows.length===0){
 console.warn("No RUM events returned for this siteTag; verify the beacon token against Cloudflare Web Analytics > JS Snippet installation.");
}
if(rows.length>0 && !observedHosts.has(hostname)){
 console.warn("RUM returned events, but none for "+hostname+"; check hostnames printed above.");
}
if(rows.length>=5000)throw Error("5000 group limit reached; refusing incomplete data.");
const byDate=new Map(),byPath=new Map();
for(const row of rows){
 if(!row.dimensions||String(row.dimensions.requestHost||"").toLowerCase()!==hostname)continue;
 const date=row.dimensions.date, count=Number(row.count||0);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(count)||count<0)continue;
 byDate.set(date,(byDate.get(date)||0)+count);
 let path=row.dimensions.requestPath||"/";
 if(path==="/index.html")path="/";
 if(path.includes("?"))path=path.split("?")[0];
 byPath.set(path,(byPath.get(path)||0)+count);
}
const currentDay=now.toISOString().slice(0,10);
const midnight=new Date(currentDay+"T00:00:00.000Z").getTime();
const daily=[];
for(let n=29;n>=0;n--){
 const date=new Date(midnight-n*86400000).toISOString().slice(0,10);
 daily.push({date,views:Math.round(byDate.get(date)||0)});
}
const start30=daily[0].date;
const pages=[];
for(const [path,views] of byPath)pages.push({path,views:Math.round(views)});
pages.sort((a,b)=>b.views-a.views);
const payload={
 status:"ok",
 source:"Cloudflare Web Analytics (browser-beacon estimates)",
 timezone:"UTC",
 updatedAt:now.toISOString(),
 daily,
 pages:pages.slice(0,20),
 readingDuration:null,
 note:"Pageviews may be sampled, are not unique visitors; active reading time requires separate tracking."
};
fs.mkdirSync("data",{recursive:true});
fs.writeFileSync(out,JSON.stringify(payload,null,2)+"\n","utf8");
console.log("Wrote "+out+"; "+rows.length+" groups; "+daily.reduce((a,d)=>a+d.views,0)+" pageviews (30d).");
