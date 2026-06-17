(function () {
  function setProgress(root, index, count) {
    var progress = root.querySelector('.sr-stepper__progress');
    if (!progress) return;
    var pct = count > 1 ? (index / (count - 1)) * 100 : 0;
    progress.style.height = Math.round(pct) + '%';
    progress.style.width = Math.round(pct) + '%';
  }

  function activate(root, index) {
    var tabs = root.querySelectorAll('.sr-stepper__tab');
    var panels = root.querySelectorAll('.sr-stepper__panel');
    if (!tabs.length) return;
    if (index < 0) index = 0;
    if (index > tabs.length - 1) index = tabs.length - 1;

    for (var i = 0; i < tabs.length; i++) {
      var on = i === index;
      tabs[i].classList.toggle('is-active', on);
      tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
      tabs[i].setAttribute('tabindex', on ? '0' : '-1');
      tabs[i].classList.toggle('is-done', i < index);
    }
    for (var j = 0; j < panels.length; j++) {
      var show = j === index;
      panels[j].classList.toggle('is-active', show);
      if (show) { panels[j].removeAttribute('hidden'); }
      else { panels[j].setAttribute('hidden', ''); }
    }
    setProgress(root, index, tabs.length);
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var tabs = root.querySelectorAll('.sr-stepper__tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(root, i); });
      tab.addEventListener('keydown', function (e) {
        var next = i;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { next = Math.min(tabs.length - 1, i + 1); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { next = Math.max(0, i - 1); }
        else if (e.key === 'Home') { next = 0; }
        else if (e.key === 'End') { next = tabs.length - 1; }
        else { return; }
        e.preventDefault();
        activate(root, next);
        tabs[next].focus();
      });
    });

    activate(root, 0);
  }

  function boot() {
    var roots = document.querySelectorAll('.sr-stepper');
    for (var i = 0; i < roots.length; i++) { init(roots[i]); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
