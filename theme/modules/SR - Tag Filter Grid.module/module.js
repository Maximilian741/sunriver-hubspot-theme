(function () {
  function norm(s) { return (s || '').trim().toLowerCase(); }

  function parseTags(card) {
    var raw = card.getAttribute('data-tags') || '';
    return raw.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var grid = root.querySelector('.sr-tagfilter__grid');
    var filters = root.querySelector('.sr-tagfilter__filters');
    var empty = root.querySelector('.sr-tagfilter__empty');
    if (!grid || !filters) return;

    var cards = [].slice.call(grid.querySelectorAll('.sr-tagfilter__card'));
    var multi = (root.getAttribute('data-mode') || 'single') === 'multi';
    var allLabel = root.getAttribute('data-all-label') || 'All';

    // Build ordered unique tag list, keyed by lowercase, preserving first-seen display label.
    var order = [];
    var seen = {};
    cards.forEach(function (card) {
      parseTags(card).forEach(function (label) {
        var key = norm(label);
        if (key && !seen[key]) { seen[key] = label; order.push(key); }
      });
    });

    // Rebuild the filter row: All button + one per tag.
    filters.innerHTML = '';
    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'sr-tagfilter__btn is-on';
    allBtn.setAttribute('data-tag', '*');
    allBtn.textContent = allLabel;
    filters.appendChild(allBtn);

    var tagBtns = [];
    order.forEach(function (key) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sr-tagfilter__btn';
      btn.setAttribute('data-tag', key);
      btn.textContent = seen[key];
      filters.appendChild(btn);
      tagBtns.push(btn);
    });

    var active = []; // lowercase keys; empty means "all"

    function apply() {
      var shown = 0;
      cards.forEach(function (card) {
        var tags = parseTags(card).map(norm);
        var match = active.length === 0 || active.some(function (k) { return tags.indexOf(k) !== -1; });
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      if (empty) empty.hidden = shown !== 0;

      // Sync button states.
      allBtn.classList.toggle('is-on', active.length === 0);
      allBtn.setAttribute('aria-pressed', active.length === 0 ? 'true' : 'false');
      tagBtns.forEach(function (btn) {
        var on = active.indexOf(btn.getAttribute('data-tag')) !== -1;
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    allBtn.setAttribute('aria-pressed', 'true');
    tagBtns.forEach(function (btn) { btn.setAttribute('aria-pressed', 'false'); });

    allBtn.addEventListener('click', function () { active = []; apply(); });

    tagBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-tag');
        if (multi) {
          var i = active.indexOf(key);
          if (i === -1) active.push(key); else active.splice(i, 1);
        } else {
          active = (active.length === 1 && active[0] === key) ? [] : [key];
        }
        apply();
      });
    });

    apply();
  }

  function boot() { [].slice.call(document.querySelectorAll('.sr-tagfilter')).forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
