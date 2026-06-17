(function () {
  function initOne(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var slides = Array.prototype.slice.call(root.querySelectorAll('.sr-imgcar__slide'));
    var dots   = Array.prototype.slice.call(root.querySelectorAll('.sr-imgcar__dot'));
    var prev   = root.querySelector('.sr-imgcar__nav--prev');
    var next   = root.querySelector('.sr-imgcar__nav--next');
    var track  = root.querySelector('.sr-imgcar__track');
    if (slides.length < 2) return;

    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;

    var current   = 0;
    var autoWant  = root.getAttribute('data-autoplay') === '1' && !reduce;
    var seconds   = parseFloat(root.getAttribute('data-interval'));
    if (!seconds || seconds < 1) seconds = 6;
    var timer     = null;
    var inView    = true;   // updated by IntersectionObserver when supported
    var hovering  = false;  // pointer / focus pause

    function show(idx) {
      idx = (idx % slides.length + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var on = i === idx;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      dots.forEach(function (d, i) {
        var on = i === idx;
        d.classList.toggle('is-active', on);
        if (on) { d.setAttribute('aria-current', 'true'); }
        else { d.removeAttribute('aria-current'); }
      });
      current = idx;
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    // Only run autoplay when allowed, visible, and not paused by the user.
    function maybeStart() {
      stop();
      if (!autoWant || !inView || hovering) return;
      timer = setInterval(function () { show(current + 1); }, seconds * 1000);
    }

    function go(delta) {
      show(current + delta);
      maybeStart();
    }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var i = parseInt(dot.getAttribute('data-index'), 10) || 0;
        show(i);
        maybeStart();
      });
    });

    // Keyboard support when the carousel has focus.
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.keyCode === 37) { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight' || e.keyCode === 39) { e.preventDefault(); go(1); }
    });

    // Pause autoplay on hover / focus, resume on leave.
    root.addEventListener('mouseenter', function () { hovering = true; stop(); });
    root.addEventListener('mouseleave', function () { hovering = false; maybeStart(); });
    root.addEventListener('focusin', function () { hovering = true; stop(); });
    root.addEventListener('focusout', function () { hovering = false; maybeStart(); });

    // Pointer / touch swipe.
    var startX = 0, startY = 0, tracking = false;

    function downX(e) {
      var t = e.touches ? e.touches[0] : e;
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    }

    function upX(e) {
      if (!tracking) return;
      tracking = false;
      var t = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : e;
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1);
      }
    }

    if (track) {
      if (window.PointerEvent) {
        track.addEventListener('pointerdown', downX);
        track.addEventListener('pointerup', upX);
        track.addEventListener('pointercancel', function () { tracking = false; });
      } else {
        track.addEventListener('touchstart', downX, { passive: true });
        track.addEventListener('touchend', upX);
      }
      // Stop image drag ghosting from hijacking the swipe.
      track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    }

    // Pause when scrolled out of view to save cycles.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          inView = en.isIntersecting;
          maybeStart();
        });
      }, { threshold: 0.2 });
      io.observe(root);
    } else {
      maybeStart();
    }
  }

  function boot() {
    var roots = document.querySelectorAll('.sr-imgcar');
    Array.prototype.forEach.call(roots, initOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
