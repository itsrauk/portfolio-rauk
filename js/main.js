/* ================================================================
   RAUK.DEV — Portfolio JS
   Language toggle · Sticky header · Mobile menu · Scroll reveal · Active nav
================================================================ */

/* ----------------------------------------------------------------
   LANGUAGE TOGGLE
---------------------------------------------------------------- */
let currentLang = 'en';

const langToggleBtn = document.getElementById('langToggle');
const langLabel     = document.getElementById('langLabel');

function applyLanguage(lang) {
  currentLang = lang;
  langLabel.textContent = lang.toUpperCase();
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

  document.querySelectorAll('[data-' + lang + ']').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text !== null) el.textContent = text;
  });

  // Update page title
  document.title = lang === 'en'
    ? 'Raul Aguilera — Web Designer & Developer'
    : 'Raul Aguilera — Web Designer & Desenvolvedor';
}

langToggleBtn.addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'pt' : 'en');
});

// Detect browser language on load
(function () {
  const browserLang = navigator.language || navigator.userLanguage || '';
  if (browserLang.toLowerCase().startsWith('pt')) {
    applyLanguage('pt');
  }
})();

/* ----------------------------------------------------------------
   STICKY HEADER
---------------------------------------------------------------- */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ----------------------------------------------------------------
   MOBILE MENU
---------------------------------------------------------------- */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

function closeMenu() {
  hamburger.classList.remove('active');
  navMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.contains('open');
  if (isOpen) {
    closeMenu();
  } else {
    hamburger.classList.add('active');
    navMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
});

// Close on link click
navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ----------------------------------------------------------------
   SCROLL REVEAL (IntersectionObserver)
---------------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger siblings inside the same parent
    const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
    const idx = siblings.indexOf(entry.target);
    const delay = Math.min(idx * 90, 450); // cap stagger at 450ms

    setTimeout(() => {
      entry.target.classList.add('visible');
    }, delay);

    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px',
});

revealEls.forEach(el => revealObserver.observe(el));

/* ----------------------------------------------------------------
   ACTIVE NAV LINK (highlight on scroll)
---------------------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  });
}, {
  threshold: 0.35,
  rootMargin: '-80px 0px 0px 0px',
});

sections.forEach(s => activeObserver.observe(s));
