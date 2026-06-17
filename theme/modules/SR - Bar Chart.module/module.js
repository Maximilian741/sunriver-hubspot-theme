(function () {
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function animateBar(bar, reduce) {
    var pct = parseFloat(bar.getAttribute('data-pct'));
    if (!isFinite(pct)) pct = 0;
    pct = Math.max(0, Math.min(100, pct));

    var num = bar.querySelector('.sr-barchart__num');
    var rawValue = parseFloat(bar.getAttribute('data-value'));
    var target = isFinite(rawValue) ? rawValue : 0;
    var suffix = '';
    var root = bar.closest('.sr-barchart');
    if (root) suffix = root.getAttribute('data-suffix') || '';

    if (reduce) {
      bar.style.height = pct + '%';
      if (num) num.textContent = Math.round(target) + suffix;
      bar.classList.add('is-shown');
      return;
    }

    bar.style.height = '0%';
    if (num) num.textContent = '0' + suffix;
    bar.classList.add('is-shown');

    var duration = 1200;
    var start = null;

    function tick(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / duration);
      var eased = ease(t);
      bar.style.height = (pct * eased) + '%';
      if (num) num.textContent = Math.round(target * eased) + suffix;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        bar.style.height = pct + '%';
        if (num) num.textContent = Math.round(target) + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  function initRoot(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var bars = root.querySelectorAll('.sr-barchart__bar');
    if (!bars.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(bars, function (b) { animateBar(b, reduce); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateBar(entry.target, false);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    Array.prototype.forEach.call(bars, function (b) { io.observe(b); });
  }

  function boot() {
    var roots = document.querySelectorAll('.sr-barchart');
    Array.prototype.forEach.call(roots, initRoot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
