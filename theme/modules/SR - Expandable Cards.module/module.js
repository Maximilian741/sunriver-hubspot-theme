(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;
    var multiple = root.getAttribute('data-multiple') === '1';
    var cards = [].slice.call(root.querySelectorAll('.sr-expand__card'));

    function panelOf(card) { return card.querySelector('.sr-expand__panel'); }
    function headOf(card) { return card.querySelector('.sr-expand__head'); }

    function collapse(card) {
      var panel = panelOf(card);
      var head = headOf(card);
      if (!panel || !head) return;
      if (!card.classList.contains('is-open')) return;
      if (reduce) {
        panel.style.height = '0px';
      } else {
        panel.style.height = panel.scrollHeight + 'px';
        panel.offsetHeight; // force reflow so the transition runs
        panel.style.height = '0px';
      }
      card.classList.remove('is-open');
      head.setAttribute('aria-expanded', 'false');
    }

    function expand(card) {
      var panel = panelOf(card);
      var head = headOf(card);
      if (!panel || !head) return;
      if (card.classList.contains('is-open')) return;
      card.classList.add('is-open');
      head.setAttribute('aria-expanded', 'true');
      if (reduce) {
        panel.style.height = 'auto';
      } else {
        panel.style.height = panel.scrollHeight + 'px';
      }
    }

    cards.forEach(function (card) {
      var panel = panelOf(card);
      var head = headOf(card);
      if (!panel || !head) return;

      // Start collapsed (server rendered them visible for no-JS).
      card.classList.remove('is-open');
      head.setAttribute('aria-expanded', 'false');
      panel.style.height = '0px';

      // After a non-reduced expand transition ends, release the fixed height
      // so detail can reflow on resize.
      panel.addEventListener('transitionend', function (e) {
        if (e.propertyName !== 'height') return;
        if (card.classList.contains('is-open')) panel.style.height = 'auto';
      });

      head.addEventListener('click', function () {
        var open = card.classList.contains('is-open');
        if (!multiple) {
          cards.forEach(function (other) { if (other !== card) collapse(other); });
        }
        if (open) collapse(card); else expand(card);
      });
    });

    // Keep an open card's height correct when the window reflows.
    window.addEventListener('resize', function () {
      cards.forEach(function (card) {
        if (card.classList.contains('is-open')) {
          var panel = panelOf(card);
          if (panel) panel.style.height = 'auto';
        }
      });
    });
  }

  function boot() { [].slice.call(document.querySelectorAll('.sr-expand')).forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
