(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateRow(track) {
    var fill = track.querySelector('.sr-bars__fill');
    if (!fill) return;
    var pct = parseFloat(fill.getAttribute('data-pct'));
    if (!isFinite(pct)) pct = 0;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;

    var pctEl = track.parentNode ? track.parentNode.querySelector('.sr-bars__pct') : null;

    if (reduce) {
      fill.style.width = pct + '%';
      if (pctEl) pctEl.textContent = Math.round(pct) + '%';
      return;
    }

    // Reset to zero, then let CSS transition carry the width to its target.
    fill.style.width = '0%';
    // Force reflow so the transition fires from 0.
    void fill.offsetWidth;
    requestAnimationFrame(function () {
      fill.style.width = pct + '%';
    });

    if (pctEl) {
      var duration = 1200;
      var start = null;
      function tick(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        pctEl.textContent = Math.round(pct * eased) + '%';
        if (t < 1) requestAnimationFrame(tick);
        else pctEl.textContent = Math.round(pct) + '%';
      }
      pctEl.textContent = '0%';
      requestAnimationFrame(tick);
    }
  }

  function initInstance(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var tracks = root.querySelectorAll('.sr-bars__track');
    if (!tracks.length) return;

    // Start collapsed so the fill grows in view (unless reduced motion).
    if (!reduce) {
      for (var i = 0; i < tracks.length; i++) {
        var f = tracks[i].querySelector('.sr-bars__fill');
        if (f) f.style.width = '0%';
      }
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateRow(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });
      for (var j = 0; j < tracks.length; j++) io.observe(tracks[j]);
    } else {
      for (var k = 0; k < tracks.length; k++) animateRow(tracks[k]);
    }
  }

  function boot() {
    var roots = document.querySelectorAll('.sr-bars');
    for (var i = 0; i < roots.length; i++) initInstance(roots[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
