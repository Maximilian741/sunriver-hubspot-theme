(function () {
  'use strict';

  function clampInt(v, def) {
    var n = parseInt(v, 10);
    return isFinite(n) ? n : def;
  }

  function formatNumber(value, decimals, grouping) {
    var fixed = value.toFixed(decimals);
    if (!grouping) return fixed;
    var parts = fixed.split('.');
    var neg = parts[0].charAt(0) === '-';
    var intPart = neg ? parts[0].slice(1) : parts[0];
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var out = (neg ? '-' : '') + intPart;
    if (parts.length > 1) out += '.' + parts[1];
    return out;
  }

  function animate(root) {
    var numEl = root.querySelector('.sr-odometer__number');
    if (!numEl) return;

    var target = parseFloat(root.getAttribute('data-value'));
    if (!isFinite(target)) {
      return;
    }

    var decimals = clampInt(root.getAttribute('data-decimals'), 0);
    if (decimals < 0) decimals = 0;
    if (decimals > 6) decimals = 6;

    var grouping = root.getAttribute('data-grouping') !== 'false';
    var duration = clampInt(root.getAttribute('data-duration'), 1600);
    if (duration < 200) duration = 200;
    if (duration > 8000) duration = 8000;

    var style = root.getAttribute('data-style') === 'count' ? 'count' : 'roll';

    var reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var finalText = formatNumber(target, decimals, grouping);

    if (reduce) {
      numEl.textContent = finalText;
      return;
    }

    if (style === 'roll') {
      root.classList.add('is-rolling');
    }

    var start = null;

    function tick(now) {
      if (start === null) start = now;
      var elapsed = now - start;
      var t = Math.min(1, elapsed / duration);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - t, 3);
      var current = target * eased;
      numEl.textContent = formatNumber(current, decimals, grouping);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        numEl.textContent = finalText;
        root.classList.remove('is-rolling');
        root.classList.add('is-done');
      }
    }

    numEl.textContent = formatNumber(0, decimals, grouping);
    requestAnimationFrame(tick);
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.45 });
      io.observe(root);
    } else {
      animate(root);
    }
  }

  function boot() {
    var nodes = document.querySelectorAll('.sr-odometer');
    var i;
    for (i = 0; i < nodes.length; i++) {
      init(nodes[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
