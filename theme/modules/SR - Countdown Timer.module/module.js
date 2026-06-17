(function () {
  function pad(n) {
    n = Math.round(n);
    return n < 10 ? '0' + n : '' + n;
  }

  function parseTarget(raw, utc) {
    if (!raw) return null;
    var str = ('' + raw).trim();
    if (!str) return null;
    // If marked UTC and the string carries no timezone, append Z so it parses as UTC.
    if (utc && !/[zZ]|[+\-]\d\d:?\d\d$/.test(str)) {
      str = str.replace(' ', 'T') + 'Z';
    } else {
      str = str.replace(' ', 'T');
    }
    var t = new Date(str).getTime();
    return isNaN(t) ? null : t;
  }

  function initOne(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var clock = root.querySelector('.sr-countdown__clock');
    var done = root.querySelector('.sr-countdown__done');
    var cta = root.querySelector('.sr-countdown__cta');
    var nums = {
      days: root.querySelector('[data-unit="days"]'),
      hours: root.querySelector('[data-unit="hours"]'),
      minutes: root.querySelector('[data-unit="minutes"]'),
      seconds: root.querySelector('[data-unit="seconds"]')
    };

    var utc = root.getAttribute('data-utc') === '1';
    var target = parseTarget(root.getAttribute('data-target'), utc);
    if (target === null) return;

    var timer = null;

    function setNum(el, val, doPad) {
      if (!el) return;
      var next = doPad ? pad(val) : '' + Math.round(val);
      if (el.textContent !== next) el.textContent = next;
    }

    function finish() {
      if (timer) { clearInterval(timer); timer = null; }
      setNum(nums.days, 0, false);
      setNum(nums.hours, 0, true);
      setNum(nums.minutes, 0, true);
      setNum(nums.seconds, 0, true);
      if (done) {
        if (clock) clock.hidden = true;
        if (cta) cta.hidden = true;
        done.hidden = false;
        root.classList.add('sr-countdown--done');
      }
    }

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) { finish(); return; }
      var totalSec = Math.floor(diff / 1000);
      var d = Math.floor(totalSec / 86400);
      var h = Math.floor((totalSec % 86400) / 3600);
      var m = Math.floor((totalSec % 3600) / 60);
      var s = totalSec % 60;
      setNum(nums.days, d, false);
      setNum(nums.hours, h, true);
      setNum(nums.minutes, m, true);
      setNum(nums.seconds, s, true);
    }

    tick();
    if (target - Date.now() > 0) {
      timer = setInterval(tick, 1000);
    }
  }

  function boot() {
    var list = document.querySelectorAll('.sr-countdown');
    for (var i = 0; i < list.length; i++) initOne(list[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
