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
