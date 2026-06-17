(function () {
  function clamp(n, lo, hi) { return n < lo ? lo : (n > hi ? hi : n); }

  function getScrollTarget(root) {
    if (root.getAttribute('data-target') === 'main') {
      return document.querySelector('main') ||
             document.querySelector('.body-container__page') ||
             document.querySelector('.body-container--body') ||
             null;
    }
    return null;
  }

  function computeProgress(root) {
    var doc = document.documentElement;
    var body = document.body;
    var target = getScrollTarget(root);

    var scrolled = window.pageYOffset || doc.scrollTop || 0;

    if (target) {
      var rect = target.getBoundingClientRect();
      var startAbs = rect.top + scrolled;
      var height = target.offsetHeight || rect.height || 0;
      var viewport = window.innerHeight || doc.clientHeight || 0;
      var span = height - viewport;
      if (span <= 0) return scrolled >= startAbs ? 1 : 0;
      var into = scrolled - startAbs;
      return clamp(into / span, 0, 1);
    }

    var pageHeight = Math.max(
      body ? body.scrollHeight : 0,
      doc.scrollHeight,
      body ? body.offsetHeight : 0,
      doc.offsetHeight,
      doc.clientHeight
    );
    var winHeight = window.innerHeight || doc.clientHeight || 0;
    var maxScroll = pageHeight - winHeight;
    if (maxScroll <= 0) return 0;
    return clamp(scrolled / maxScroll, 0, 1);
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var fill = root.querySelector('.sr-readprog__fill');
    if (!fill) return;
    var pctEl = root.getAttribute('data-show-pct') === '1'
      ? root.querySelector('.sr-readprog__pct')
      : null;

    var reduce = (window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;
    if (reduce) root.classList.add('sr-readprog--noanim');

    var ticking = false;
    var lastPct = -1;

    function render() {
      ticking = false;
      var ratio = computeProgress(root);
      var pct = Math.round(ratio * 100);
      fill.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      if (pct !== lastPct) {
        root.setAttribute('aria-valuenow', String(pct));
        if (pctEl) pctEl.textContent = pct + '%';
        root.classList.toggle('is-active', pct > 0);
        lastPct = pct;
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(render);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', render);

    render();
  }

  function boot() {
    var nodes = document.querySelectorAll('.sr-readprog');
    if (!nodes.length) return;
    for (var i = 0; i < nodes.length; i++) init(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
