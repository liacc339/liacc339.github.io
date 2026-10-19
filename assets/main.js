(() => {
  const root=document.documentElement;
  const btn=document.querySelector('[data-theme-toggle]');
  let saved;
  try{saved=localStorage.getItem('lia-theme')}catch(e){}
  root.dataset.theme=saved==='dark'||saved==='light'? saved: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  const update=()=>{ if(btn){btn.textContent=root.dataset.theme==='dark'?'☀':'☾';btn.setAttribute('aria-label',root.dataset.theme==='dark'?'切换浅色模式':'切换深色模式');}};
  update();
  if(btn)btn.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('lia-theme',root.dataset.theme)}catch(e){}update()});
  const year=document.querySelector('[data-year]');if(year)year.textContent=new Date().getFullYear();
})();
