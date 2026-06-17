(function () {
  function setOpen(panel, head, body, open, reduce) {
    panel.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (reduce) {
      body.style.height = open ? 'auto' : '0px';
      return;
    }
    if (open) {
      body.style.height = body.scrollHeight + 'px';
      var done = function () {
        body.style.height = 'auto';
        body.removeEventListener('transitionend', done);
      };
      body.addEventListener('transitionend', done);
    } else {
      body.style.height = body.scrollHeight + 'px';
      // force reflow so the browser registers the explicit height before collapsing
      void body.offsetHeight;
      body.style.height = '0px';
    }
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var multiple = root.getAttribute('data-multiple') === '1';
    var panels = [].slice.call(root.querySelectorAll('.sr-toggle__panel'));

    panels.forEach(function (panel) {
      var head = panel.querySelector('.sr-toggle__head');
      var body = panel.querySelector('.sr-toggle__body');
      if (!head || !body) return;

      // sync initial state set server-side
      var startOpen = panel.classList.contains('is-open');
      body.style.height = startOpen ? 'auto' : '0px';

      head.addEventListener('click', function () {
        var willOpen = !panel.classList.contains('is-open');

        if (willOpen && !multiple) {
          panels.forEach(function (other) {
            if (other === panel) return;
            if (!other.classList.contains('is-open')) return;
            var oHead = other.querySelector('.sr-toggle__head');
            var oBody = other.querySelector('.sr-toggle__body');
            if (oHead && oBody) setOpen(other, oHead, oBody, false, reduce);
          });
        }

        setOpen(panel, head, body, willOpen, reduce);
      });
    });
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-toggle')).forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
