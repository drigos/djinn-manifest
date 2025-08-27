(function () {
  const root = document.getElementById('langMenu');
  if (!root) return;

  const btn = document.getElementById('langBtn');
  const list = document.getElementById('langList');
  const current = root.querySelector('.lang__current');
  const items = Array.from(list.querySelectorAll('a'));

  const template = root.dataset.labelTemplate || 'Select language (current: {lang})';
  const fallback = root.dataset.fallbackLabel || 'Language';

  function selectedAnchor() {
    return list.querySelector('a[aria-current="page"]') || null;
  }
  function selectedLabel() {
    const sel = selectedAnchor();
    return (sel ? sel.textContent.trim() : fallback);
  }
  function setButtonLabel() {
    const labelText = selectedLabel();
    if (current) current.textContent = labelText;
    if (btn) btn.setAttribute('aria-label', template.replace('{lang}', labelText));
  }

  function isOpen() { return root.getAttribute('data-open') === 'true'; }
  function openMenu() {
    root.setAttribute('data-open', 'true');
    btn.setAttribute('aria-expanded', 'true');
    items[0].focus({ preventScroll: true });
  }
  function closeMenu() {
    root.removeAttribute('data-open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() { isOpen() ? closeMenu() : openMenu(); }

  // Toggle
  btn.addEventListener('click', (e) => { e.preventDefault(); toggleMenu(); });
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); openMenu();
    }
  });

  // Close with outside click
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) closeMenu();
  });

  // Keyboard on list
  list.addEventListener('keydown', (e) => {
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); btn.focus(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); (items[idx + 1] || items[0]).focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); (items[idx - 1] || items[items.length - 1]).focus(); }
  });

  // Persistence on language selection
  items.forEach(a => {
    a.addEventListener('click', () => {
      const lang = (a.getAttribute('lang') || '').toLowerCase();
      try {
        if (lang) localStorage.setItem('langPreferred', lang);
        document.cookie = 'langChosen=1; max-age=31536000; path=/';
      } catch {}
      // Follow usually navigation
    });
  });

  setButtonLabel();
})();