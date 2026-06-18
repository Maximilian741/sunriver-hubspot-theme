/* SR - Flip Cards.
   Cards reveal their back face on click (toggle), and optionally on hover.
   The reveal is CSS-driven; with JS off, focus-within still reveals on click.
   This script marks the root .sr-flip--js so the CSS uses the click-toggle path,
   wires the toggle buttons, and enables hover-flip when configured. */
(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');
    root.classList.add('sr-flip--js');

    var hoverFlip = root.getAttribute('data-hover') === '1';
    if (hoverFlip && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      root.classList.add('sr-flip--hover');
    }

    var cards = [].slice.call(root.querySelectorAll('.sr-flip__card'));
    cards.forEach(function (card) {
      var btn = card.querySelector('.sr-flip__toggle');
      if (!btn) return;
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', function () {
        var on = !card.classList.contains('is-flipped');
        card.classList.toggle('is-flipped', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  }

  function boot() { [].slice.call(document.querySelectorAll('.sr-flip')).forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
