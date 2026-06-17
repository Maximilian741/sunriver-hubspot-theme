(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var chipBox = root.querySelector('.sr-filtergal__chips');
    var items = [].slice.call(root.querySelectorAll('.sr-filtergal__item'));
    var empty = root.querySelector('.sr-filtergal__empty');
    if (!chipBox || !items.length) return;

    // Build unique category chips from the items, deduped here (reliable, unlike a HubL loop accumulator).
    var seen = {};
    items.forEach(function (item) {
      var cat = (item.getAttribute('data-cat') || '').trim();
      if (!cat || seen[cat]) return;
      seen[cat] = true;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sr-filtergal__chip';
      b.setAttribute('data-cat', cat);
      b.textContent = cat;
      chipBox.appendChild(b);
    });
    var chips = [].slice.call(chipBox.querySelectorAll('.sr-filtergal__chip'));

    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;

    function apply(cat) {
      var shownCount = 0;
      items.forEach(function (item) {
        var itemCat = (item.getAttribute('data-cat') || '').trim();
        var match = (cat === '__all__') || (itemCat === cat);
        if (match) shownCount++;
        if (reduce) {
          item.classList.toggle('is-shown', match);
          item.classList.remove('is-fading');
          item.style.display = match ? '' : 'none';
          return;
        }
        if (match) {
          item.style.display = '';
          item.classList.remove('is-fading');
          // force reflow so the fade-in transition replays
          void item.offsetWidth;
          item.classList.add('is-shown');
        } else if (item.classList.contains('is-shown') || item.style.display !== 'none') {
          item.classList.remove('is-shown');
          item.classList.add('is-fading');
          window.setTimeout(function () {
            if (item.classList.contains('is-fading')) {
              item.style.display = 'none';
              item.classList.remove('is-fading');
            }
          }, 280);
        } else {
          item.style.display = 'none';
        }
      });
      if (empty) empty.hidden = shownCount > 0;
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var cat = chip.getAttribute('data-cat') || '__all__';
        chips.forEach(function (c) { c.classList.toggle('is-on', c === chip); });
        apply(cat);
      });
    });
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-filtergal')).forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
