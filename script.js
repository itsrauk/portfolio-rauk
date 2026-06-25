/* ===================================================================
   rauk.dev — Portfolio
   GSAP animations, custom cursor, interactions
   =================================================================== */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Custom cursor ---------- */
const cursor = document.getElementById('cursor');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice && cursor) {
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ---------- Menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const navOverlay = document.getElementById('navOverlay');

function openNav() {
  navOverlay.classList.add('show');
  menuBtn.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navOverlay.classList.remove('show');
  menuBtn.classList.remove('active');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', () => {
  navOverlay.classList.contains('show') ? closeNav() : openNav();
});

navOverlay.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', closeNav);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

/* ---------- Back to top ---------- */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
backTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- GSAP Animations ---------- */

/* Hero entrance */
gsap.from('.hero__status', {
  opacity: 0,
  x: -20,
  duration: 0.8,
  delay: 0.3,
  ease: 'power3.out'
});

gsap.from('.hero__line', {
  y: 120,
  opacity: 0,
  duration: 1.2,
  stagger: 0.15,
  delay: 0.5,
  ease: 'power4.out'
});

gsap.from('.hero__desc', {
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 1,
  ease: 'power3.out'
});

gsap.from('.hero__actions', {
  opacity: 0,
  y: 20,
  duration: 0.8,
  delay: 1.2,
  ease: 'power3.out'
});

/* Stats */
gsap.from('.stat', {
  scrollTrigger: {
    trigger: '.stats',
    start: 'top 85%',
  },
  opacity: 0,
  y: 30,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power3.out'
});

/* Stats counter */
document.querySelectorAll('.stat strong').forEach((el) => {
  const text = el.textContent;
  const num = parseInt(text, 10);
  const suffix = text.replace(/[0-9]/g, '');

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(el,
        { innerText: 0 },
        {
          innerText: num,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            el.textContent = Math.round(gsap.getProperty(el, 'innerText')) + suffix;
          }
        }
      );
    }
  });
});

/* About */
const aboutTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.about',
    start: 'top 70%',
  }
});

aboutTl.from('.about__left .kicker', { opacity: 0, x: -20, duration: 0.6 })
  .from('.about__title', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.3')
  .from('.about__text p', { opacity: 0, y: 20, stagger: 0.15, duration: 0.6 }, '-=0.4')
  .from('.tool', { opacity: 0, y: 15, stagger: 0.05, duration: 0.4 }, '-=0.3')
  .from('.about__meta-item', { opacity: 0, y: 15, stagger: 0.1, duration: 0.5 }, '-=0.2');

/* Services */
gsap.from('.service-row', {
  scrollTrigger: {
    trigger: '.services__list',
    start: 'top 80%',
  },
  opacity: 0,
  y: 30,
  stagger: 0.12,
  duration: 0.8,
  ease: 'power3.out'
});

/* Portfolio */
gsap.from('.portfolio-card', {
  scrollTrigger: {
    trigger: '.portfolio__grid',
    start: 'top 80%',
  },
  opacity: 0,
  y: 40,
  stagger: 0.1,
  duration: 0.8,
  ease: 'power3.out'
});

/* Contact */
const contactTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.contact',
    start: 'top 70%',
  }
});

contactTl.from('.contact__left', { opacity: 0, x: -30, duration: 0.8 })
  .from('.contact__link', { opacity: 0, x: -20, stagger: 0.1, duration: 0.5 }, '-=0.4')
  .from('.contact__form', { opacity: 0, x: 30, duration: 0.8 }, '-=0.6');

/* Formulário */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.reset();
    showToast('mensagem enviada! entrarei em contato em breve.');
    const note = document.getElementById('formNote');
    if (note) note.textContent = 'obrigado! responderemos em breve.';
  });
}

/* Toast */
let toastTimer;
function showToast(msg) {
  let toastEl = document.getElementById('toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.id = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  void toastEl.offsetWidth;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
}

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
