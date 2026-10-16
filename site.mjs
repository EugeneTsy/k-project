import { telegramUsername, telegramUrl } from './config.mjs';

const link = telegramUrl();
for (const anchor of document.querySelectorAll('[data-telegram-link]')) {
  if (link) {
    anchor.href = link;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  }
}
for (const handle of document.querySelectorAll('[data-telegram-handle]')) {
  handle.textContent = link ? `@${telegramUsername}` : '[НУЖНО ДОБАВИТЬ: username]';
}

const portrait = document.querySelector('.hero-image');
const portraitSpacer = document.querySelector('.hero-image-spacer');
const mobilePortrait = window.matchMedia('(max-width: 899px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
let portraitMetrics;
let portraitFrame = 0;

function drawPortrait() {
  portraitFrame = 0;
  if (!portraitMetrics) return;

  const scroll = Math.max(0, window.scrollY);
  const progress = Math.min(1, scroll / portraitMetrics.distance);
  const { top, left, size, viewport, stripHeight } = portraitMetrics;
  root.style.setProperty('--mobile-photo-top', `${Math.max(0, top - scroll)}px`);
  root.style.setProperty('--mobile-photo-left', `${left * (1 - progress)}px`);
  root.style.setProperty('--mobile-photo-width', `${size + (viewport - size) * progress}px`);
  root.style.setProperty('--mobile-photo-height', `${size + (stripHeight - size) * progress}px`);
}

function queuePortraitDraw() {
  if (portraitFrame || !portraitMetrics) return;
  portraitFrame = requestAnimationFrame(drawPortrait);
}

function measurePortrait() {
  if (!portrait || !portraitSpacer || !mobilePortrait.matches || reducedMotion.matches) {
    root.classList.remove('has-portrait-scroll');
    portraitMetrics = undefined;
    for (const name of ['--mobile-photo-top', '--mobile-photo-left', '--mobile-photo-width', '--mobile-photo-height']) {
      root.style.removeProperty(name);
    }
    return;
  }

  if (!root.classList.contains('has-portrait-scroll')) {
    const initial = portrait.getBoundingClientRect();
    root.style.setProperty('--mobile-photo-top', `${initial.top}px`);
    root.style.setProperty('--mobile-photo-left', `${initial.left}px`);
    root.style.setProperty('--mobile-photo-width', `${initial.width}px`);
    root.style.setProperty('--mobile-photo-height', `${initial.height}px`);
    root.classList.add('has-portrait-scroll');
  }

  const square = portraitSpacer.getBoundingClientRect();
  const viewport = root.clientWidth;
  const top = square.top + window.scrollY;
  const stripHeight = Math.min(118, Math.max(88, viewport * 0.28));
  portraitMetrics = {
    top,
    left: square.left,
    size: square.width,
    viewport,
    stripHeight,
    distance: Math.max(240, square.width - stripHeight + top),
  };
  drawPortrait();
}

measurePortrait();
window.addEventListener('scroll', queuePortraitDraw, { passive: true });
window.addEventListener('resize', measurePortrait);
window.addEventListener('pageshow', measurePortrait);
mobilePortrait.addEventListener('change', measurePortrait);
reducedMotion.addEventListener('change', measurePortrait);
document.fonts?.ready.then(measurePortrait);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  for (const section of document.querySelectorAll('[data-reveal]')) observer.observe(section);
  document.documentElement.classList.add('has-motion');
}
