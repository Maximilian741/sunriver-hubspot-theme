(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var openBtn = root.querySelector('.sr-modal__open');
    var backdrop = root.querySelector('.sr-modal__backdrop');
    if (!openBtn || !backdrop) return;
    var dialog = backdrop.querySelector('.sr-modal__dialog');
    var closeBtn = backdrop.querySelector('.sr-modal__close');

    var lastFocused = null;

    function focusables() {
      return [].slice.call(
        dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter(function (el) { return el.offsetParent !== null; });
    }

    function open() {
      lastFocused = document.activeElement;
      backdrop.hidden = false;
      // force reflow so the transition runs from hidden state
      void backdrop.offsetWidth;
      backdrop.classList.add('is-open');
      root.classList.add('is-open');
      openBtn.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('sr-modal-locked');
      document.body.classList.add('sr-modal-locked');
      if (closeBtn) { try { closeBtn.focus(); } catch (e) {} }
    }

    function close() {
      backdrop.classList.remove('is-open');
      root.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('sr-modal-locked');
      document.body.classList.remove('sr-modal-locked');

      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var finish = function () { backdrop.hidden = true; };
      if (reduce) {
        finish();
      } else {
        var done = false;
        var once = function () { if (done) return; done = true; finish(); };
        backdrop.addEventListener('transitionend', once, { once: true });
        // fallback in case transitionend does not fire
        setTimeout(once, 320);
      }
      if (lastFocused && lastFocused.focus) { try { lastFocused.focus(); } catch (e) {} }
    }

    function onKey(e) {
      if (backdrop.hidden) return;
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab' || e.keyCode === 9) {
        var items = focusables();
        if (!items.length) { e.preventDefault(); return; }
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) close();
    });
    if (dialog) dialog.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('keydown', onKey);
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-modal')).forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
