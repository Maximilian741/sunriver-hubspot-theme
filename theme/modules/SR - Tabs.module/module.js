(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');
    var tabs = [].slice.call(root.querySelectorAll('.sr-tabs__tab'));
    var panels = [].slice.call(root.querySelectorAll('.sr-tabs__panel'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var i = tab.getAttribute('data-i');
        tabs.forEach(function (x) { x.classList.toggle('is-on', x === tab); });
        panels.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-i') === i); });
      });
    });
  }
  function boot() { [].slice.call(document.querySelectorAll('.sr-tabs')).forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
