(function () {
  function fmtMoney(n) {
    var v = Math.round(n);
    if (!isFinite(v) || v < 0) v = 0;
    return '$' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;

    var s1 = root.querySelector('[data-slider="1"]');
    var s2 = root.querySelector('[data-slider="2"]');
    var s3 = root.querySelector('[data-slider="3"]');
    var out1 = root.querySelector('[data-out="1"]');
    var out2 = root.querySelector('[data-out="2"]');
    var out3 = root.querySelector('[data-out="3"]');
    var amountEl = root.querySelector('[data-amount]');
    if (!s1 || !s2 || !amountEl) return;

    var weeksFixed = parseFloat(root.getAttribute('data-weeks-fixed')) || 0;

    function num(el, fallback) {
      var v = parseFloat(el && el.value);
      return isFinite(v) ? v : fallback;
    }

    function fill(el) {
      if (!el) return;
      var min = parseFloat(el.min), max = parseFloat(el.max), val = parseFloat(el.value);
      var pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
      el.style.setProperty('--sr-fill', pct + '%');
    }

    var raf = 0, lastTarget = 0, lastShown = 0;

    function target() {
      var hours = num(s1, 0);
      var rate = num(s2, 0);
      var weeks = s3 ? num(s3, weeksFixed || 52) : (weeksFixed || 52);
      return hours * rate * weeks;
    }

    function paint() {
      if (out1) out1.textContent = Math.round(num(s1, 0)) + (s1.getAttribute('data-suffix') || '');
      if (out2) out2.textContent = (s2.getAttribute('data-prefix') || '') + Math.round(num(s2, 0));
      if (out3 && s3) out3.textContent = Math.round(num(s3, 0)) + (s3.getAttribute('data-suffix') || '');
      fill(s1); fill(s2); fill(s3);
    }

    function animateTo(end) {
      lastTarget = end;
      if (reduce) { lastShown = end; amountEl.textContent = fmtMoney(end); return; }
      if (raf) return;
      var start = lastShown;
      var t0 = null;
      var dur = 420;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        var cur = start + (lastTarget - start) * eased;
        amountEl.textContent = fmtMoney(cur);
        if (p < 1) { raf = window.requestAnimationFrame(frame); }
        else { raf = 0; lastShown = lastTarget; amountEl.textContent = fmtMoney(lastTarget); }
      }
      raf = window.requestAnimationFrame(frame);
    }

    function recalc() {
      paint();
      animateTo(target());
    }

    [s1, s2, s3].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', recalc);
      el.addEventListener('change', recalc);
    });

    lastShown = target();
    paint();
    amountEl.textContent = fmtMoney(lastShown);
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-savings')).forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
