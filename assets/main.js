(() => {
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const langBtn = document.querySelector('[data-lang-toggle]');
  const dictionary = window.LIA_TRANSLATIONS || {};

  const readSetting = (key) => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const saveSetting = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

  const savedTheme = readSetting('lia-theme');
  root.dataset.theme = savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const updateThemeBtn = () => {
    if (!themeBtn) return;
    themeBtn.textContent = root.dataset.theme === 'dark' ? '☀' : '☾';
    themeBtn.setAttribute('aria-label', root.dataset.theme === 'dark' ? '切换浅色模式' : '切换深色模式');
  };
  updateThemeBtn();
  if (themeBtn) themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    saveSetting('lia-theme', root.dataset.theme);
    updateThemeBtn();
  });

  // Keep the author's original Chinese HTML as the default, and store the
  // original text nodes once so switching languages is always reversible.
  const originals = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.nodeValue.trim() || !node.parentElement || node.parentElement.closest('script,style,noscript,[data-lang-toggle],[data-theme-toggle]')) continue;
    originals.set(node, node.nodeValue);
  }
  const initialTitle = document.title;
  const pageTitles = {
    '公共文化课程运营智能助手': 'Public Culture Course Operations AI Assistant',
    '城市生命体征 AI 智库助手': 'Urban Vital Signs AI Knowledge Assistant',
    'AI 公文起草辅助方案': 'AI-Assisted Document Drafting Concept',
    'AI 解决方案在各行各业的应用': 'AI Applications Across Industries',
    'Agent 和 Workflow，什么时候该选哪一个？': 'Agent or Workflow: Which Should You Choose?',
    '把“智能排课”变成一个可验证的产品': 'Turning Smart Scheduling into a Testable Product',
    '知识库不是“把文件丢给大模型”': 'A Knowledge Base Is More Than Uploading Files to an LLM'
  };

  function switchLanguage(lang) {
    const english = lang === 'en';
    for (const [node, original] of originals) {
      // Controls can replace their own text nodes; never process detached nodes.
      if (!node.isConnected) continue;
      const source = original.trim();
      const target = english && Object.prototype.hasOwnProperty.call(dictionary, source)
        ? dictionary[source] : source;
      if (target !== source) {
        const start = original.indexOf(source);
        node.nodeValue = original.slice(0, start) + target + original.slice(start + source.length);
      } else {
        node.nodeValue = original;
      }
    }
    root.lang = english ? 'en' : 'zh-CN';
    root.dataset.lang = english ? 'en' : 'zh';
    if (langBtn) {
      langBtn.textContent = english ? '中文' : 'English';
      langBtn.setAttribute('aria-label', english ? '切换为中文' : 'Switch to English');
      langBtn.setAttribute('title', english ? '切换为中文' : 'Switch to English');
    }
    document.title = english
      ? Object.entries(pageTitles).reduce((t, [zh, en]) => t.replace(zh, en), initialTitle)
      : initialTitle;
    const avatar = document.querySelector('.avatar-image');
    if (avatar) avatar.alt = english ? 'Black cat under a striped beach umbrella by the sea' : '海边遮阳伞下的黑猫头像';
  }

  const savedLang = readSetting('lia-language');
  switchLanguage(savedLang === 'en' ? 'en' : 'zh');
  if (langBtn) langBtn.addEventListener('click', () => {
    const next = root.dataset.lang === 'en' ? 'zh' : 'en';
    saveSetting('lia-language', next);
    switchLanguage(next);
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
