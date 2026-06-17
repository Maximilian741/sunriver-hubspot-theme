(function () {
  var TZ = 'America/Denver';

  function parts(now) {
    try {
      var f = new Intl.DateTimeFormat('en-US', {
        timeZone: TZ, hour12: false,
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      var o = {};
      f.formatToParts(now).forEach(function (p) { o[p.type] = p.value; });
      var hour = parseInt(o.hour, 10); if (hour === 24) hour = 0;
      return {
        time: o.hour + ':' + o.minute + ':' + o.second,
        date: o.weekday + ', ' + o.month + ' ' + o.day,
        hour: hour
      };
    } catch (e) { return null; }
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var timeEl = root.querySelector('.sr-clock__time');
    var dateEl = root.querySelector('.sr-clock__date');
    var badge = root.querySelector('.sr-clock__badge');
    var msgEl = root.querySelector('.sr-clock__msg');
    if (!timeEl) return;

    var open = parseInt(root.getAttribute('data-open'), 10); if (isNaN(open)) open = 9;
    var close = parseInt(root.getAttribute('data-close'), 10); if (isNaN(close)) close = 17;
    var openMsg = root.getAttribute('data-openmsg') || 'Open and building.';
    var closedMsg = root.getAttribute('data-closedmsg') || 'After hours.';

    function render() {
      var p = parts(new Date());
      if (!p) { timeEl.textContent = '--:--:--'; return; }
      timeEl.textContent = p.time;
      if (dateEl) dateEl.textContent = p.date;
      var isOpen = (close > open) ? (p.hour >= open && p.hour < close) : (p.hour >= open || p.hour < close);
      if (badge) badge.setAttribute('data-state', isOpen ? 'open' : 'closed');
      if (msgEl) msgEl.textContent = isOpen ? openMsg : closedMsg;
    }

    render();
    window.setInterval(render, 1000);
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll('.sr-clock'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
