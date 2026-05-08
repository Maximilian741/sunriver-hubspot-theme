(function () {
  function measureAndSet(marquee) {
    const speed = Number(marquee.getAttribute('data-speed')) || 26;
    const track = marquee.querySelector('.sr-counter-track');
    const group1 = marquee.querySelector('.sr-counter-group:not([aria-hidden="true"])');

    if (!track || !group1) return;

    // Set speed
    track.style.animationDuration = `${speed}s`;

    // Measure group 1 width precisely (includes its internal gap)
    const width = Math.round(group1.getBoundingClientRect().width);

    // If width is 0, layout/fonts may not be ready yet
    if (width > 0) {
      track.style.setProperty('--sr-loop-distance', `${width}px`);
    }
  }

  // Counter animation (only for the visible / first group)
  function animateCounter(card) {
    const num = card.querySelector('.sr-counter-number');
    if (!num) return;

    if (num.dataset.animated === 'true') return;
    num.dataset.animated = 'true';

    const raw = (num.getAttribute('data-count') || '').trim();

    // Allow things like "1,200" or "1200+" by extracting the number part
    const cleaned = raw.replace(/,/g, '');
    const match = cleaned.match(/-?\d+(\.\d+)?/);
    const target = match ? Number(match[0]) : NaN;

    if (!Number.isFinite(target)) {
      num.textContent = raw;
      return;
    }

    const duration = 1400;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const startTime = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = easeOutCubic(t);
      const current = Math.floor(target * eased);

      // Preserve any suffix like "+" if you use it
      const suffix = raw.replace(match[0], '');
      num.textContent = `${current}${suffix}`;

      if (t < 1) requestAnimationFrame(tick);
      else num.textContent = `${target}${suffix}`;
    }

    num.textContent = '0';
    requestAnimationFrame(tick);
  }

  function initOne(marquee) {
    // measure now
    measureAndSet(marquee);

    // measure again after fonts/images settle
    window.addEventListener('load', () => measureAndSet(marquee), { once: true });

    // keep it correct on resize
    let raf = null;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => measureAndSet(marquee));
    });

    // Counters: observe only the first (non aria-hidden) group
    const group1 = marquee.querySelector('.sr-counter-group:not([aria-hidden="true"])');
    if (!group1) return;

    const cards = group1.querySelectorAll('.sr-counter-card');
    if (!cards.length) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateCounter(entry.target);
        });
      }, { threshold: 0.25 });

      cards.forEach((c) => io.observe(c));
    } else {
      cards.forEach(animateCounter);
    }
  }

  document.querySelectorAll('.sr-counter-marquee').forEach(initOne);
})();
