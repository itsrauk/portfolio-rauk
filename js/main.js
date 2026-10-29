/* ================================================================
   RAUK — Portfolio JS
   Language toggle · Smooth scroll · Mobile menu · Scroll reveal · Active nav
================================================================ */

/* ----------------------------------------------------------------
   LANGUAGE TOGGLE
---------------------------------------------------------------- */
let currentLang = 'en';

const langToggleBtn = document.getElementById('langToggle');
const langOpts      = langToggleBtn.querySelectorAll('.lang-toggle__opt');

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

  langOpts.forEach(opt => opt.classList.toggle('is-active', opt.dataset.lang === lang));

  document.querySelectorAll('[data-' + lang + ']').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text !== null) el.textContent = text;
  });

  document.title = lang === 'en'
    ? 'Raul Aguilera · Web Designer & Developer'
    : 'Raul Aguilera · Web Designer & Desenvolvedor';

  try { localStorage.setItem('lang', lang); } catch (e) {}
  placeMoon();
}

/* ----------------------------------------------------------------
   HERO MOON — keep it just right of the title (title width varies by language)
---------------------------------------------------------------- */
function placeMoon() {
  const title = document.getElementById('heroTitle');
  if (title) title.parentElement.style.setProperty('--title-w', title.offsetWidth + 'px');
}

window.addEventListener('resize', placeMoon);
if (document.fonts) document.fonts.ready.then(placeMoon);


langToggleBtn.addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'pt' : 'en');
});

// Saved choice first, then browser language
(function () {
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  const browserLang = (navigator.language || '').toLowerCase();
  applyLanguage(saved || (browserLang.startsWith('pt') ? 'pt' : 'en'));
})();

/* ----------------------------------------------------------------
   SMOOTH SCROLL (Lenis) — skipped for reduced motion or if the CDN fails
---------------------------------------------------------------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null;

if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ lerp: 0.09 });
  requestAnimationFrame(function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  });
}

// In-page links glide to their section
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target || !lenis) return;
    e.preventDefault();
    lenis.start();   // the mobile menu stops scrolling while open
    lenis.scrollTo(target, { duration: 1.4 });
  });
});

/* ----------------------------------------------------------------
   SCROLL EFFECTS — progress bar, hero parallax, line-art rotation
---------------------------------------------------------------- */
const root        = document.documentElement;
const hero        = document.querySelector('.hero');
const progressBar = document.getElementById('progressBar');

function onScroll(y) {
  const max = root.scrollHeight - window.innerHeight;
  progressBar.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
  hero.style.setProperty('--hp', Math.min(y / hero.offsetHeight, 1).toFixed(4));
  root.style.setProperty('--sy', Math.round(y));
}

if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
onScroll(window.scrollY);

/* ----------------------------------------------------------------
   INTRO — start the hero entrance once the fonts are in
---------------------------------------------------------------- */
function startIntro() { requestAnimationFrame(() => root.classList.add('is-ready')); }

if (document.fonts) {
  Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(startIntro);
} else {
  startIntro();
}

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
  if (lenis) lenis.start();
}

hamburger.addEventListener('click', () => {
  if (navMenu.classList.contains('open')) {
    closeMenu();
  } else {
    hamburger.classList.add('active');
    navMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ----------------------------------------------------------------
   SCROLL REVEAL (IntersectionObserver)
---------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger siblings inside the same parent
    const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
    const delay = Math.min(siblings.indexOf(entry.target) * 90, 450);

    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ----------------------------------------------------------------
   ACTIVE NAV LINK (highlight on scroll)
---------------------------------------------------------------- */
const navLinks = document.querySelectorAll('.nav__link');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  });
}, {
  // A section is active while it crosses the middle of the viewport
  rootMargin: '-50% 0px -50% 0px',
});

document.querySelectorAll('section[id]').forEach(s => activeObserver.observe(s));
