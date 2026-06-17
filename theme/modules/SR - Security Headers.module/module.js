(function () {
  function gradeFor(p) {
    if (p >= 95) return ['A+', 'Locked down tight.'];
    if (p >= 85) return ['A', 'Strong. A couple of gaps left.'];
    if (p >= 70) return ['B', 'Solid, with room to harden.'];
    if (p >= 55) return ['C', 'Partly covered. Worth a pass.'];
    if (p >= 40) return ['D', 'Exposed in a few real ways.'];
    return ['F', 'Wide open. Let us fix that.'];
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var boxes = Array.prototype.slice.call(root.querySelectorAll('.sr-headers__check input'));
    var letter = root.querySelector('.sr-headers__letter');
    var pctEl = root.querySelector('.sr-headers__pct');
    var capEl = root.querySelector('.sr-headers__cap');
    if (!boxes.length || !letter) return;

    var totalW = boxes.reduce(function (s, b) { return s + (parseFloat(b.getAttribute('data-weight')) || 0); }, 0) || 1;

    function update() {
      var got = boxes.reduce(function (s, b) { return s + (b.checked ? (parseFloat(b.getAttribute('data-weight')) || 0) : 0); }, 0);
      var pct = Math.round(got / totalW * 100);
      var g = gradeFor(pct);
      letter.textContent = g[0];
      letter.setAttribute('data-grade', g[0].charAt(0));
      if (pctEl) pctEl.textContent = pct;
      if (capEl) capEl.textContent = g[1];
    }

    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll('.sr-headers'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
