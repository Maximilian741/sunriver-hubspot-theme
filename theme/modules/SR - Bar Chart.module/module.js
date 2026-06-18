/* SR - Bar Chart.
   HubSpot's HubL can't take a numeric max of the bar values (see module.html),
   so this script is what makes auto-scaled charts correct: on load it reads the
   numeric data-value of every bar, finds the real max, and sets each bar's
   height. It also counts the numbers up when the chart scrolls into view, with a
   setTimeout safety net so a number can never stick on "0".

   No-JS fallback: the server renders a best-effort height (correct when the
   chart_max param is set), so the bars are never invisible. */
(function () {
  function setHeights(root) {
    var bars = root.querySelectorAll('.sr-barchart__bar');
    if (!bars.length) return;
    var max = 0;
    Array.prototype.forEach.call(bars, function (b) {
      var v = parseFloat(b.getAttribute('data-value'));
      if (isFinite(v) && v > max) max = v;
    });
    if (max <= 0) max = 1;
    Array.prototype.forEach.call(bars, function (b) {
      var v = parseFloat(b.getAttribute('data-value'));
      if (!isFinite(v)) v = 0;
      var pct = v / max * 100;
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;
      b.style.height = pct.toFixed(2) + '%';
    });
  }

  function countUp(bar) {
    var num = bar.querySelector('.sr-barchart__num');
    if (!num) return;
    var target = parseFloat(bar.getAttribute('data-value'));
    if (!isFinite(target)) return;
    var root = bar.closest('.sr-barchart');
    var suffix = (root && root.getAttribute('data-suffix')) || '';
    var dur = 900, start = null, done = false;
    var fin = function () { return Math.round(target) + suffix; };
    var safety = setTimeout(function () { if (!done) { done = true; num.textContent = fin(); } }, dur + 600);
    num.textContent = '0' + suffix;
    function tick(now) {
      if (done) return;
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      num.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else { done = true; clearTimeout(safety); num.textContent = fin(); }
    }
    requestAnimationFrame(tick);
  }

  function boot() {
    var roots = document.querySelectorAll('.sr-barchart');
    if (!roots.length) return;
    Array.prototype.forEach.call(roots, setHeights);

    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(document.querySelectorAll('.sr-barchart__bar'), function (b) { io.observe(b); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
