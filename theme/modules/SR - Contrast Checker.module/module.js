(function () {
  function lin(c) {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function lum(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim());
    if (!m) return 0;
    var n = parseInt(m[1], 16);
    return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  }
  function ratio(fg, bg) {
    var a = lum(fg), b = lum(bg);
    var hi = Math.max(a, b), lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05);
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var fg = root.querySelector('.sr-contrast__fg');
    var bg = root.querySelector('.sr-contrast__bg');
    var swap = root.querySelector('.sr-contrast__swap');
    var preview = root.querySelector('.sr-contrast__preview');
    var numEl = root.querySelector('.sr-contrast__num');
    var badges = root.querySelectorAll('.sr-contrast__badge');
    if (!fg || !bg) return;

    var thresholds = { 'aa-normal': 4.5, 'aaa-normal': 7, 'aa-large': 3, 'aaa-large': 4.5 };

    function update() {
      var r = ratio(fg.value, bg.value);
      if (preview) { preview.style.background = bg.value; preview.style.color = fg.value; }
      if (numEl) numEl.textContent = (Math.round(r * 100) / 100).toFixed(2);
      Array.prototype.forEach.call(badges, function (b) {
        var pass = r >= (thresholds[b.getAttribute('data-test')] || 99);
        b.classList.toggle('is-pass', pass);
        b.classList.toggle('is-fail', !pass);
      });
    }

    fg.addEventListener('input', update);
    bg.addEventListener('input', update);
    if (swap) swap.addEventListener('click', function () {
      var t = fg.value; fg.value = bg.value; bg.value = t; update();
    });
    update();
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll('.sr-contrast'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
