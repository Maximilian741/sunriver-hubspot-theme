(function () {
  function initOne(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var viewport = root.querySelector('.sr-ticker__viewport');
    var track = root.querySelector('.sr-ticker__track');
    if (!viewport || !track) return;

    var items = track.querySelectorAll('.sr-ticker__item');
    if (!items.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Static, readable: no scrolling, allow natural wrap.
      track.style.transform = 'none';
      track.classList.add('sr-ticker__track--static');
      return;
    }

    var speed = Number(root.getAttribute('data-speed'));
    if (!isFinite(speed) || speed <= 0) speed = 60;

    var baseWidth = 0;     // width of one full set of original items
    var offset = 0;        // current scroll offset in px
    var lastTime = 0;
    var rafId = null;
    var paused = false;
    var clonesAdded = false;

    function originalWidth() {
      var w = 0;
      for (var i = 0; i < items.length; i++) {
        w += Math.round(items[i].getBoundingClientRect().width);
      }
      return w;
    }

    function ensureFill() {
      // Duplicate the original set until the track is at least twice the viewport,
      // so the loop never shows empty space.
      if (clonesAdded) return;
      var vpWidth = Math.round(viewport.getBoundingClientRect().width);
      var safety = 0;
      while (Math.round(track.getBoundingClientRect().width) < (vpWidth + baseWidth) && safety < 20) {
        for (var i = 0; i < items.length; i++) {
          var clone = items[i].cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        }
        safety++;
      }
      clonesAdded = true;
    }

    function setup() {
      baseWidth = originalWidth();
      clonesAdded = false;
      // Remove any prior clones before recomputing on resize.
      var all = track.querySelectorAll('.sr-ticker__item');
      for (var i = all.length - 1; i >= items.length; i--) {
        all[i].parentNode.removeChild(all[i]);
      }
      ensureFill();
      if (offset > baseWidth) offset = 0;
    }

    function frame(now) {
      if (!lastTime) lastTime = now;
      var dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!paused && baseWidth > 0) {
        offset += speed * dt;
        if (offset >= baseWidth) offset -= baseWidth;
        track.style.transform = 'translateX(' + (-Math.round(offset)) + 'px)';
      }
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (rafId) return;
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    }

    function pause() { paused = true; }
    function resume() { paused = false; }

    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', resume);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', resume);

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 150);
    });

    // Pause when off-screen to save cycles.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start();
          else { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
        });
      }, { threshold: 0 });
      io.observe(root);
    }

    setup();
    start();
    // Recompute once fonts/images settle.
    window.addEventListener('load', setup, { once: true });
  }

  function boot() {
    var nodes = document.querySelectorAll('.sr-ticker');
    for (var i = 0; i < nodes.length; i++) initOne(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
