(function () {
  function init(btn) {
    if (btn.getAttribute('data-sr-init')) return;
    btn.setAttribute('data-sr-init', '1');

    var threshold = parseInt(btn.getAttribute('data-threshold'), 10);
    if (isNaN(threshold) || threshold < 0) threshold = 400;

    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;

    function scrollY() {
      return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    var visible = false;
    function update() {
      var show = scrollY() > threshold;
      if (show === visible) return;
      visible = show;
      if (show) {
        btn.hidden = false;
        // allow display to apply before transitioning opacity
        window.requestAnimationFrame(function () { btn.classList.add('is-on'); });
      } else {
        btn.classList.remove('is-on');
        if (reduce) {
          btn.hidden = true;
        } else {
          window.setTimeout(function () {
            if (!visible) btn.hidden = true;
          }, 280);
        }
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    btn.addEventListener('click', function () {
      if (reduce) {
        window.scrollTo(0, 0);
      } else {
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          window.scrollTo(0, 0);
        }
      }
      // move focus to top of document for keyboard/AT users
      var target = document.querySelector('header, [role="banner"], main, body');
      if (target && typeof target.focus === 'function') {
        var hadTabindex = target.hasAttribute('tabindex');
        if (!hadTabindex) target.setAttribute('tabindex', '-1');
        try { target.focus({ preventScroll: true }); } catch (e2) { target.focus(); }
        if (!hadTabindex) {
          target.addEventListener('blur', function once() {
            target.removeAttribute('tabindex');
            target.removeEventListener('blur', once);
          });
        }
      }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-totop')).forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
