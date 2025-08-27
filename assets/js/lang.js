(function () {
  const root = document.getElementById('langMenu');
  if (!root) return;

  const btn = document.getElementById('langBtn');
  const list = document.getElementById('langList');
  const current = root.querySelector('.lang__current');
  const items = Array.from(list.querySelectorAll('li[role="option"] a'));
  const docLang = (document.documentElement.lang || '').toLowerCase();

  // Map lang attribute => label
  const labelByLang = {
    'pt-br': 'Português',
    'pt': 'Português',
    'en': 'English',
    'en-us': 'English',
    'es': 'Español',
    'es-es': 'Español'
  };

  function setButtonLabel() {
    // 1) da página; 2) do item aria-selected; 3) fallback de storage
    const selected = list.querySelector('li[aria-selected="true"]');
    const liLang = selected ? selected.dataset.lang : null;
    const stored = localStorage.getItem('langPreferred') || '';
    const guess = labelByLang[liLang || docLang] || labelByLang[stored] || 'Idioma';
    current.textContent = guess;
  }

  function openMenu() {
    root.setAttribute('data-open', 'true');
    btn.setAttribute('aria-expanded', 'true');
    // focus on first item
    items[0].focus({preventScroll:true});
  }
  function closeMenu() {
    root.removeAttribute('data-open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    const open = root.getAttribute('data-open') === 'true';
    open ? closeMenu() : openMenu();
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) closeMenu();
  });

  // Keyboard on button
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); openMenu();
    }
  });

  // Keyboard on list
  list.addEventListener('keydown', (e) => {
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); btn.focus(); }
    if (e.key === 'ArrowDown') {
      e.preventDefault(); (items[idx + 1] || items[0]).focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault(); (items[idx - 1] || items[items.length - 1]).focus();
    }
  });

  // Persistence + navigation on language click
  items.forEach(a => {
    a.addEventListener('click', () => {
      const li = a.closest('li[role="option"]');
      const lang = li?.dataset.lang || '';
      try {
        localStorage.setItem('langPreferred', lang);
        document.cookie = "langChosen=1; max-age=31536000; path=/";
      } catch {}
      // navigation via href (real links => SEO ok)
    });
  });

  setButtonLabel();
})();