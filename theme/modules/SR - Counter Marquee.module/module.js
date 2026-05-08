(function () {
  function setCardWidths(marquee) {
    const minw = Number(marquee.getAttribute('data-minw')) || 300;
    const maxw = Number(marquee.getAttribute('data-maxw')) || 420;

    marquee.querySelectorAll('.sr-counter-card').forEach(card => {
      card.style.width = `clamp(${minw}px, 33vw, ${maxw}px)`;
    });
  }

  function measureLoopDistance(marquee) {
    const track = marquee.querySelector('.sr-counter-track');
    const groupA = marquee.querySelector('.sr-counter-group--a');
    if (!track || !groupA) return;

    const w = Math.round(groupA.getBoundingClientRect().width);
    if (w > 0) track.style.setProperty('--sr-loop-distance', `${w}px`);
  }

  function setSpeed(marquee) {
    const speed = Number(marquee.getAttribute('data-speed')) || 26;
    const track = marquee.querySelector('.sr-counter-track');
    if (track) track.style.animationDuration = `${speed}s`;
  }

  function animateCounter(card) {
    const num = card.querySelector('.sr-counter-number');
    if (!num) return;
    if (num.dataset.animated === 'true') return;
    num.dataset.animated = 'true';

    const raw = (num.getAttribute('data-count') || '').trim();
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

    const suffix = raw.replace(match[0], '');

    function tick(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = easeOutCubic(t);
      const current = Math.floor(target * eased);
      num.textContent = `${current}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
      else num.textContent = `${target}${suffix}`;
    }

    num.textContent = '0';
    requestAnimationFrame(tick);
  }

  function initOne(marquee) {
    if (marquee.dataset.srInit === 'true') return;
    marquee.dataset.srInit = 'true';

    setCardWidths(marquee);
    setSpeed(marquee);
    measureLoopDistance(marquee);

    window.addEventListener('load', () => {
      setCardWidths(marquee);
      measureLoopDistance(marquee);
    }, { once: true });

    let raf = null;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setCardWidths(marquee);
        measureLoopDistance(marquee);
      });
    });

    // Counters: only observe group A so clones don’t double-trigger
    const groupA = marquee.querySelector('.sr-counter-group--a');
    if (!groupA) return;

    const cards = groupA.querySelectorAll('.sr-counter-card');

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateCounter(entry.target);
        });
      }, { threshold: 0.25 });

      cards.forEach(c => io.observe(c));
    } else {
      cards.forEach(animateCounter);
    }
  }

  function boot() {
    document.querySelectorAll('.sr-counter-marquee').forEach(initOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
