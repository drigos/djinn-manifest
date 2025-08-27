(function () {
  const STORAGE_KEY = 'themePreferred';
  const root = document.documentElement;
  const btn = document.getElementById('themeBtn');
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  if (!btn) return;

  const COLORS = {
    dark: '#0b0b10',
    light:'#f6f7fb'
  };

  function applyTheme(mode){
    if (mode === 'dark' || mode === 'light') {
      root.setAttribute('data-theme', mode);
      if (metaTheme) metaTheme.setAttribute('content', COLORS[mode]);
      btn.setAttribute('aria-pressed', 'true');
      const label = mode === 'dark'
        ? (btn.dataset.labelDark  || 'Switch to light theme')
        : (btn.dataset.labelLight || 'Switch to dark theme');
      btn.setAttribute('aria-label', label);
    } else {
      // No explicit preference: follow the system (remove attribute)
      root.removeAttribute('data-theme');
      // Adjust meta theme-color according to current media query
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (metaTheme) metaTheme.setAttribute('content', prefersDark ? COLORS.dark : COLORS.light);
      btn.setAttribute('aria-pressed', 'false');
      const label = prefersDark
        ? (btn.dataset.labelDark  || 'Switch to light theme')
        : (btn.dataset.labelLight || 'Switch to dark theme');
      btn.setAttribute('aria-label', label);
    }
  }

  function getStored(){ try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } }
  function setStored(v){ try { v ? localStorage.setItem(STORAGE_KEY, v) : localStorage.removeItem(STORAGE_KEY); } catch {} }

  // Initial state
  const initial = getStored(); // 'dark' | 'light' | null
  applyTheme(initial);

  // Click: Toggles between dark and light (no "auto" as requested)
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const current = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    setStored(next);
    applyTheme(next);
  });

  // If the user did NOT choose anything and the OS changes, reflect (auto)
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', () => {
    if (!getStored()) applyTheme(null);
  });
})();