(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var key = root.getAttribute('data-key') || 'sr-stickycta';
    var threshold = parseInt(root.getAttribute('data-threshold'), 10);
    if (isNaN(threshold) || threshold < 0) threshold = 600;

    var closeBtn = root.querySelector('.sr-stickycta__close');

    var dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(key) === '1';
    } catch (e) {
      dismissed = false;
    }

    if (dismissed) {
      root.hidden = true;
      return;
    }

    function show() {
      if (root.classList.contains('is-on')) return;
      root.hidden = false;
      // force layout so the transition runs from the hidden state
      void root.offsetWidth;
      root.classList.add('is-on');
    }

    function hide() {
      root.classList.remove('is-on');
    }

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (y >= threshold) show();
      else hide();
    }

    function dismiss() {
      try {
        window.sessionStorage.setItem(key, '1');
      } catch (e) {}
      hide();
      window.removeEventListener('scroll', onScroll);
      // remove from layout after the slide-out finishes
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        root.hidden = true;
      } else {
        window.setTimeout(function () { root.hidden = true; }, 380);
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', dismiss);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // evaluate current position immediately (handles deep-linked / reloaded pages)
    onScroll();
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-stickycta')).forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
