(function () {
  function norm(s) {
    return (s || '').toString().toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function initOne(root) {
    if (root.dataset.srInit === 'true') return;
    root.dataset.srInit = 'true';

    var input = root.querySelector('.sr-faqsearch__input');
    var filters = root.querySelector('.sr-faqsearch__filters');
    var empty = root.querySelector('.sr-faqsearch__empty');
    var items = Array.prototype.slice.call(root.querySelectorAll('.sr-faqsearch__item'));
    if (!items.length) return;

    var showFilters = root.getAttribute('data-show-filters') === 'true';
    var allLabel = root.getAttribute('data-all-label') || 'All';
    var activeCat = '__all__';

    var data = items.map(function (el) {
      return {
        el: el,
        cat: (el.getAttribute('data-category') || '').trim(),
        text: norm(el.getAttribute('data-search')) + ' ' + norm((el.getAttribute('data-category') || ''))
      };
    });

    // Build filter chips from unique categories.
    if (showFilters && filters) {
      var seen = {};
      var cats = [];
      data.forEach(function (d) {
        if (d.cat && !seen[d.cat]) { seen[d.cat] = true; cats.push(d.cat); }
      });

      if (cats.length > 1) {
        var frag = document.createDocumentFragment();
        frag.appendChild(makeChip('__all__', allLabel, true));
        cats.forEach(function (c) { frag.appendChild(makeChip(c, c, false)); });
        filters.appendChild(frag);
      } else {
        filters.setAttribute('hidden', 'hidden');
      }
    } else if (filters) {
      filters.setAttribute('hidden', 'hidden');
    }

    function makeChip(value, label, isActive) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sr-faqsearch__chip' + (isActive ? ' sr-faqsearch__chip--active' : '');
      btn.setAttribute('data-cat', value);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.textContent = label;
      btn.addEventListener('click', function () {
        activeCat = value;
        var chips = filters.querySelectorAll('.sr-faqsearch__chip');
        Array.prototype.forEach.call(chips, function (c) {
          var on = c === btn;
          c.classList.toggle('sr-faqsearch__chip--active', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        apply();
      });
      return btn;
    }

    function apply() {
      var q = norm(input ? input.value : '');
      var visible = 0;

      data.forEach(function (d) {
        var matchCat = activeCat === '__all__' || d.cat === activeCat;
        var matchText = !q || d.text.indexOf(q) !== -1;
        var show = matchCat && matchText;
        d.el.hidden = !show;
        if (!show && d.el.open) d.el.open = false;
        if (show) visible++;
      });

      if (empty) empty.hidden = visible !== 0;
    }

    if (input) {
      input.addEventListener('input', apply);
      input.addEventListener('search', apply);
    }

    apply();
  }

  function boot() {
    var roots = document.querySelectorAll('.sr-faqsearch');
    Array.prototype.forEach.call(roots, initOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
