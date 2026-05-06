/* ── MODE SWITCH ── */
let currentMode = 'ux';

function updateNav() {
  const heroHeight = window.innerHeight;
  const pastHero = window.scrollY > heroHeight - 80;
  if (currentMode === 'ux') {
    nav.classList.toggle('light', !pastHero);
  } else {
    nav.classList.toggle('light', pastHero);
  }
}

function setMode(mode) {
  if (mode === currentMode) return;
  currentMode = mode;

  document.getElementById('view-ux').classList.toggle('active', mode === 'ux');
  document.getElementById('view-graphic').classList.toggle('active', mode === 'graphic');
  document.getElementById('btnUX').classList.toggle('active', mode === 'ux');
  document.getElementById('btnG').classList.toggle('active', mode === 'graphic');
  document.getElementById('navProcess').style.display = mode === 'ux' ? '' : 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => { updateNav(); initReveals(); }, 100);
}

/* ── SMOOTH SCROLL ── */
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ── NAV LIGHT/DARK ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', updateNav);
nav.classList.add('light');

/* ── SCROLL REVEAL ── */
let revealObserver;
function initReveals() {
  if (revealObserver) revealObserver.disconnect();
  const activeView = document.querySelector('.view.active');
  activeView.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
  });
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
  activeView.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

initReveals();

/* ── CAROUSEL SYSTEM ── */
let carouselState = {};

function carouselNav(carousel, dir) {
  const track = document.getElementById(carousel + 'Track');
  if (!track) return;
  
  const slides = track.querySelectorAll('.carousel-slide').length;
  carouselState[carousel] = (carouselState[carousel] + dir + slides) % slides;
  track.style.transform = `translateX(-${carouselState[carousel] * 100}%)`;
  updateCarouselDots(carousel);
}

function updateCarouselDots(carousel) {
  const dotsContainer = document.getElementById(carousel + 'Dots');
  if (!dotsContainer) return;
  
  const dots = dotsContainer.querySelectorAll('div');
  dots.forEach((d, i) => {
    d.style.background = i === carouselState[carousel] ? 'var(--ink)' : 'var(--rule)';
  });
}

function initCarousel(carouselName, slideCount) {
  carouselState[carouselName] = 0;
  const dotsContainer = document.getElementById(carouselName + 'Dots');
  if (!dotsContainer) return;
  
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `width:8px; height:8px; border-radius:50%; background:${i===0?'var(--ink)':'var(--rule)'}; cursor:pointer; transition:all 0.2s;`;
    dot.onclick = () => {
      carouselState[carouselName] = i;
      updateCarouselDots(carouselName);
      document.getElementById(carouselName + 'Track').style.transform = `translateX(-${i * 100}%)`;
    };
    dotsContainer.appendChild(dot);
  }
  updateCarouselDots(carouselName);
}

// Initialize carousels with correct slide counts
initCarousel('maintenance', 9);  // 9 images
initCarousel('restart', 4);      // 4 images
initCarousel('meli', 2);  // 2 images
