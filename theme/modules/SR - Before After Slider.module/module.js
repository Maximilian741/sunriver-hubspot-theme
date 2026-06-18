/* SR - Before/After Slider.
   The comparison is driven by the --pos custom property and clip-path, so the
   widget always shows BOTH scenes split at the start position even if this
   script never runs. JS adds drag / click / keyboard control. */
(function () {
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  function initOne(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var frame  = root.querySelector('.sr-baslider__frame');
    var handle = root.querySelector('.sr-baslider__handle');
    if (!frame || !handle) return;

    var start = parseFloat(root.getAttribute('data-start'));
    if (isNaN(start)) start = 50;
    var pos = clamp(start, 0, 100);
    var dragging = false;

    function apply(pct) {
      pos = clamp(pct, 0, 100);
      var shown = Math.round(pos);
      root.style.setProperty('--pos', pos + '%');
      handle.setAttribute('aria-valuenow', String(shown));
    }

    function pctFromClientX(clientX) {
      var rect = frame.getBoundingClientRect();
      if (rect.width <= 0) return pos;
      return ((clientX - rect.left) / rect.width) * 100;
    }
    function onMove(clientX) { apply(pctFromClientX(clientX)); }

    function startDrag(e) {
      dragging = true;
      root.classList.add('sr-baslider--active');
      if (e.touches && e.touches.length) onMove(e.touches[0].clientX);
      else if (typeof e.clientX === 'number') onMove(e.clientX);
    }
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('sr-baslider--active');
    }

    handle.addEventListener('mousedown', function (e) { e.preventDefault(); startDrag(e); });
    handle.addEventListener('touchstart', function (e) { startDrag(e); }, { passive: true });

    document.addEventListener('mousemove', function (e) { if (dragging) onMove(e.clientX); });
    document.addEventListener('touchmove', function (e) {
      if (dragging && e.touches && e.touches.length) onMove(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchcancel', endDrag);

    // Click anywhere on the frame jumps the handle there.
    frame.addEventListener('mousedown', function (e) {
      if (e.target === handle || handle.contains(e.target)) return;
      e.preventDefault();
      startDrag(e);
    });

    handle.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowLeft' || k === 'Left') { apply(pos - (e.shiftKey ? 10 : 2)); e.preventDefault(); }
      else if (k === 'ArrowRight' || k === 'Right') { apply(pos + (e.shiftKey ? 10 : 2)); e.preventDefault(); }
      else if (k === 'Home') { apply(0); e.preventDefault(); }
      else if (k === 'End') { apply(100); e.preventDefault(); }
    });

    apply(pos);
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('.sr-baslider'), initOne);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
