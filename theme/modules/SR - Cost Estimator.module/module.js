(function () {
  'use strict';

  function money(n, step) {
    step = step || 500;
    n = Math.max(0, Math.round(n / step) * step);
    return '$' + n.toLocaleString('en-US');
  }

  function initOne(root) {
    if (!root || root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var retainerFactor = parseFloat(root.getAttribute('data-retainer-factor'));
    if (!(retainerFactor > 0)) retainerFactor = 0.18;
    var projectNote = root.getAttribute('data-project-note') || 'one-time project';
    var retainerNote = root.getAttribute('data-retainer-note') || 'per month, ongoing';
    var emptyHint = root.getAttribute('data-empty-hint') || 'Pick what you need';

    var loEl = root.querySelector('[data-lo]');
    var hiEl = root.querySelector('[data-hi]');
    var modeLabelEl = root.querySelector('[data-modelabel]');
    var sumEl = root.querySelector('[data-sum]');

    // Default segmented state from the markup (Standard / one-time).
    var scale = 1;
    var standardBtn = root.querySelector('.sr-estimator__seg[data-seg="scale"] button.is-on');
    if (standardBtn) {
      var sm = parseFloat(standardBtn.getAttribute('data-mult'));
      if (!isNaN(sm)) scale = sm;
    }
    var mode = 'project';
    var modeBtn = root.querySelector('.sr-estimator__seg[data-seg="mode"] button.is-on');
    if (modeBtn && modeBtn.getAttribute('data-mode')) mode = modeBtn.getAttribute('data-mode');

    function recompute() {
      var base = 0, items = [];
      [].forEach.call(root.querySelectorAll('.sr-estimator__chip input:checked'), function (i) {
        var b = parseFloat(i.getAttribute('data-base')) || 0;
        base += b;
        var label = i.parentNode.getAttribute('data-name') || i.parentNode.textContent.trim();
        items.push({ n: label, b: b });
      });

      var total = base * scale;
      if (mode === 'retainer') total *= retainerFactor;

      if (base === 0) {
        if (loEl) loEl.textContent = '$0';
        if (hiEl) hiEl.textContent = '$0';
      } else {
        if (loEl) loEl.textContent = money(total * 0.8);
        if (hiEl) hiEl.textContent = money(total * 1.3);
      }

      if (modeLabelEl) modeLabelEl.textContent = mode === 'retainer' ? retainerNote : projectNote;

      if (sumEl) {
        if (items.length) {
          sumEl.innerHTML = items.map(function (it) {
            var v = it.b * scale;
            if (mode === 'retainer') v *= retainerFactor;
            var tag = mode === 'retainer'
              ? (money(v, 50) + '/mo')
              : (money(v * 0.8) + '–' + money(v * 1.3));
            return '<li><span>' + it.n + '</span><span>' + tag + '</span></li>';
          }).join('');
        } else {
          sumEl.innerHTML = '<li><span>' + emptyHint + ' →</span><span></span></li>';
        }
      }
    }

    root.addEventListener('change', function (e) {
      if (e.target && e.target.matches && e.target.matches('.sr-estimator__chip input')) {
        e.target.parentNode.classList.toggle('is-on', e.target.checked);
        recompute();
      }
    });

    root.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.sr-estimator__seg button');
      if (!b) return;
      var seg = b.closest('.sr-estimator__seg');
      [].forEach.call(seg.querySelectorAll('button'), function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      if (seg.getAttribute('data-seg') === 'scale') {
        var m = parseFloat(b.getAttribute('data-mult'));
        if (!isNaN(m)) scale = m;
      } else {
        mode = b.getAttribute('data-mode') || 'project';
      }
      recompute();
    });

    recompute();
  }

  function initAll() {
    [].forEach.call(document.querySelectorAll('.sr-estimator'), initOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
