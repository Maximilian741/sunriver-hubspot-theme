(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var rows = Array.prototype.slice.call(root.querySelectorAll('.sr-status__row'));
    var banner = root.querySelector('.sr-status__banner');
    var bannerText = root.querySelector('.sr-status__bannertext');
    var updated = root.querySelector('.sr-status__updated');
    if (!rows.length || !banner) return;

    var down = 0, degraded = 0;
    rows.forEach(function (r) {
      var s = (r.getAttribute('data-status') || '').toLowerCase();
      if (s === 'down') down++;
      else if (s === 'degraded') degraded++;
    });

    var state = 'ok', text = 'All systems operational';
    if (down > 0) { state = 'down'; text = down + (down === 1 ? ' system' : ' systems') + ' down'; }
    else if (degraded > 0) { state = 'degraded'; text = degraded + (degraded === 1 ? ' system' : ' systems') + ' degraded'; }
    banner.setAttribute('data-state', state);
    if (bannerText) bannerText.textContent = text;

    if (updated) {
      var t0 = Date.now();
      function tick() {
        var s = Math.floor((Date.now() - t0) / 1000);
        var label = s < 5 ? 'updated just now' : 'updated ' + s + 's ago';
        updated.textContent = label;
      }
      tick();
      window.setInterval(tick, 1000);
    }
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll('.sr-status'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
