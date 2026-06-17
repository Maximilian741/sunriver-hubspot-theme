(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmt(num, decimals) {
    var d = decimals > 0 ? decimals : 0;
    var fixed = num.toFixed(d);
    var parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function setFinal(el, target, decimals) {
    el.textContent = fmt(target, decimals);
  }

  function animateValue(el) {
    if (el.getAttribute('data-sr-done') === '1') return;
    el.setAttribute('data-sr-done', '1');

    var raw = (el.getAttribute('data-target') || '').replace(/,/g, '').trim();
    var target = parseFloat(raw);
    var decimals = parseInt(el.getAttribute('data-decimals'), 10);
    if (!isFinite(decimals) || decimals < 0) decimals = 0;

    if (!isFinite(target)) {
      el.textContent = raw;
      return;
    }

    var root = el.closest ? el.closest('.sr-countup') : null;
    var duration = root ? parseInt(root.getAttribute('data-duration'), 10) : 1600;
    if (!isFinite(duration) || duration <= 0) duration = 1600;

    if (reduce || !window.requestAnimationFrame) {
      setFinal(el, target, decimals);
      return;
    }

    var start = null;

    function tick(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      var current = target * eased;
      el.textContent = fmt(current, decimals);
      if (t < 1) {
        window.requestAnimationFrame(tick);
      } else {
        setFinal(el, target, decimals);
      }
    }

    el.textContent = fmt(0, decimals);
    window.requestAnimationFrame(tick);
  }

  function initRoot(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var values = root.querySelectorAll('.sr-countup__value');
    if (!values.length) return;

    if (reduce) {
      Array.prototype.forEach.call(values, function (el) {
        el.setAttribute('data-sr-done', '1');
        var raw = (el.getAttribute('data-target') || '').replace(/,/g, '').trim();
        var target = parseFloat(raw);
        var decimals = parseInt(el.getAttribute('data-decimals'), 10);
        if (!isFinite(decimals) || decimals < 0) decimals = 0;
        if (isFinite(target)) setFinal(el, target, decimals);
        else el.textContent = raw;
      });
      return;
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateValue(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(values, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(values, animateValue);
    }
  }

  function boot() {
    var roots = document.querySelectorAll('.sr-countup');
    Array.prototype.forEach.call(roots, initRoot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
