(function () {
  function withAutoplay(url) {
    if (!url) return '';
    var hasQuery = url.indexOf('?') !== -1;
    return url + (hasQuery ? '&' : '?') + 'autoplay=1';
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var trigger = root.querySelector('.sr-vlightbox__trigger');
    var modal = root.querySelector('.sr-vlightbox__modal');
    var iframe = root.querySelector('.sr-vlightbox__iframe');
    var closeEls = [].slice.call(root.querySelectorAll('[data-close]'));
    var closeBtn = root.querySelector('.sr-vlightbox__close');
    if (!trigger || !modal || !iframe) return;

    var embed = root.getAttribute('data-embed') || '';
    var lastFocused = null;

    function open() {
      if (!embed) return;
      lastFocused = document.activeElement;
      iframe.src = withAutoplay(embed);
      modal.hidden = false;
      root.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (closeBtn) {
        try { closeBtn.focus(); } catch (e) {}
      }
    }

    function close() {
      modal.hidden = true;
      root.classList.remove('is-open');
      iframe.src = '';
      document.body.style.overflow = '';
      if (lastFocused && lastFocused.focus) {
        try { lastFocused.focus(); } catch (e) {}
      }
    }

    trigger.addEventListener('click', open);

    closeEls.forEach(function (el) {
      el.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (root.classList.contains('is-open') && (e.key === 'Escape' || e.key === 'Esc')) {
        close();
      }
    });

    // Keep focus inside the dialog while open.
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = [].slice.call(modal.querySelectorAll('button, a[href], iframe, [tabindex]:not([tabindex="-1"])'))
        .filter(function (n) { return n.offsetParent !== null || n.tagName === 'IFRAME'; });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-vlightbox')).forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
