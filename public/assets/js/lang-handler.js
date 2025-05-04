
document.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('zen0_lang') || 'en';

  function applyTranslations(lang) {
    const t = translations[lang] || translations['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });
  }

  applyTranslations(lang);

  // Optional toggle
  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const newLang = lang === 'en' ? 'it' : 'en';
      localStorage.setItem('zen0_lang', newLang);
      location.reload();
    });
  }
});
