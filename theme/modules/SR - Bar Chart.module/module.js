/* SR - Bar Chart.
   Bars and their numbers render fully from HTML + CSS — nothing here is required
   for the chart to be visible. This is an OPTIONAL enhancement that counts the
   numbers up as each chart scrolls into view. A setTimeout safety net always
   restores the real value, so a stalled requestAnimationFrame can never leave a
   number stuck on "0". */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) return;

  function finalText(target, suffix) { return Math.round(target) + suffix; }

  function countUp(bar) {
    var num = bar.querySelector('.sr-barchart__num');
    if (!num) return;
    var target = parseFloat(bar.getAttribute('data-value'));
    if (!isFinite(target)) return;
    var root = bar.closest('.sr-barchart');
    var suffix = (root && root.getAttribute('data-suffix')) || '';
    var dur = 900, start = null, done = false;

    var safety = setTimeout(function () { if (!done) { done = true; num.textContent = finalText(target, suffix); } }, dur + 600);

    num.textContent = '0' + suffix;
    function tick(now) {
      if (done) return;
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      num.textContent = Math.round(target * eased) + suffix;
      if (t < 1) { requestAnimationFrame(tick); }
      else { done = true; clearTimeout(safety); num.textContent = finalText(target, suffix); }
    }
    requestAnimationFrame(tick);
  }

  function boot() {
    var bars = document.querySelectorAll('.sr-barchart__bar');
    if (!bars.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(bars, function (b) { io.observe(b); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
