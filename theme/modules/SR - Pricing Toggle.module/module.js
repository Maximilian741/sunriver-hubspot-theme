(function () {
  function setPeriod(root, period, saveNote) {
    var opts = [].slice.call(root.querySelectorAll('.sr-pricetoggle__opt'));
    var prices = [].slice.call(root.querySelectorAll('[data-price]'));
    var suffixes = [].slice.call(root.querySelectorAll('[data-suffix]'));
    var note = root.querySelector('[data-save-note]');

    opts.forEach(function (b) {
      var on = b.getAttribute('data-period') === period;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    prices.forEach(function (el) {
      var v = el.getAttribute('data-' + period);
      if (v !== null && v !== '') el.textContent = v;
    });

    suffixes.forEach(function (el) {
      var v = el.getAttribute('data-' + period);
      el.textContent = (v === null) ? '' : v;
    });

    root.setAttribute('data-period', period);

    if (note) {
      if (period === 'annual' && saveNote) {
        note.hidden = false;
      } else {
        note.hidden = true;
      }
    }
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var opts = [].slice.call(root.querySelectorAll('.sr-pricetoggle__opt'));
    var note = root.querySelector('[data-save-note]');
    var hasSaveNote = !!note;

    opts.forEach(function (b) {
      b.addEventListener('click', function () {
        setPeriod(root, b.getAttribute('data-period'), hasSaveNote);
      });
    });

    var startAnnual = root.getAttribute('data-start-annual') === '1';
    setPeriod(root, startAnnual ? 'annual' : 'monthly', hasSaveNote);
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-pricetoggle')).forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
