// Counter animation (keep)
if (typeof ScrollReveal !== 'undefined') {
  ScrollReveal().reveal('.atmc-counter', {
    duration: 500,
    reset: false,
    afterReveal: atomic_counter
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.atmc-counter').forEach(atomic_counter);
  });
}

function atomic_counter(el) {
  const counterEl = (window.jQuery && window.jQuery(el).find)
    ? window.jQuery(el).find('.atmc-counter_number')[0]
    : el.querySelector('.atmc-counter_number');

  if (!counterEl) return;
  if (counterEl.dataset.animated === 'true') return;
  counterEl.dataset.animated = 'true';

  const raw = counterEl.getAttribute('data-count');
  const target = Number(raw);
  if (!Number.isFinite(target)) {
    counterEl.textContent = raw;
    return;
  }

  const duration = 1600;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const format = (v) => new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(v);

  const startTime = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = easeOutCubic(t);
    const current = Math.floor(target * eased);
    counterEl.textContent = format(current);
    if (t < 1) requestAnimationFrame(tick);
    else counterEl.textContent = format(target);
  }

  counterEl.textContent = '0';
  requestAnimationFrame(tick);
}

// Slider parent detection (NO :has, no guessing)
(function () {
  function init() {
    const cards = Array.from(document.querySelectorAll('.sr-mission-counters'));
    if (cards.length < 2) return;

    // group counters by their nearest "column-like" wrapper
    const groups = new Map();

    cards.forEach(card => {
      const col = card.closest('.dnd-column, .hs_cos_wrapper_type_dnd_column, .hs_cos_wrapper');
      if (!col) return;
      if (!groups.has(col)) groups.set(col, []);
      groups.get(col).push(card);
    });

    // add slider class to any wrapper containing 2+ counters
    groups.forEach((items, wrapper) => {
      if (items.length >= 2) wrapper.classList.add('sr-counter-slider-parent');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
