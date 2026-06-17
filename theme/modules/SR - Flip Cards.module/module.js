(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;
    var hoverFlip = root.getAttribute('data-hover') === '1';
    var cards = [].slice.call(root.querySelectorAll('.sr-flip__card'));

    if (reduce) root.classList.add('is-reduced');

    function setFlipped(card, on) {
      if (on) card.classList.add('is-flipped');
      else card.classList.remove('is-flipped');
      var btn = card.querySelector('.sr-flip__toggle');
      if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    cards.forEach(function (card) {
      var btn = card.querySelector('.sr-flip__toggle');
      if (!btn) return;

      // Server renders cards showing the front; ensure a known JS state.
      setFlipped(card, false);

      btn.addEventListener('click', function () {
        setFlipped(card, !card.classList.contains('is-flipped'));
      });

      if (hoverFlip && !reduce && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
        card.addEventListener('mouseenter', function () { setFlipped(card, true); });
        card.addEventListener('mouseleave', function () { setFlipped(card, false); });
      }
    });
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-flip')).forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
