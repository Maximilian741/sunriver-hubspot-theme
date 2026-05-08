(function () {
  function animate(el) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    var raw = (el.getAttribute('data-target') || '').trim().replace(/,/g, '');
    var match = raw.match(/-?\d+(\.\d+)?/);
    var target = match ? Number(match[0]) : NaN;

    if (!isFinite(target)) {
      el.textContent = raw;
      return;
    }

    var duration = 1400;
    var start = performance.now();
    var prefix = raw.slice(0, raw.indexOf(match[0]));
    var suffix = raw.slice(raw.indexOf(match[0]) + match[0].length);

    function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target + suffix;
    }

    el.textContent = '0';
    requestAnimationFrame(tick);
  }

  function boot() {
    var nodes = document.querySelectorAll('.sr-stats .sr-stat__value');
    if (!nodes.length) return;

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      nodes.forEach(function (n) { io.observe(n); });
    } else {
      nodes.forEach(animate);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
