(function () {
  function initCard(card) {
    if (card.getAttribute('data-sr-init')) return;
    card.setAttribute('data-sr-init', '1');

    function move(e) {
      var rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
      card.classList.add('is-lit');
    }

    function leave() {
      card.classList.remove('is-lit');
    }

    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', leave);
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');
    var cards = [].slice.call(root.querySelectorAll('.sr-spotlight__card'));
    cards.forEach(initCard);
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-spotlight')).forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
