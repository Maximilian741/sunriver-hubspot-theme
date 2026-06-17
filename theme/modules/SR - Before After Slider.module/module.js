(function () {
  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function initOne(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var frame  = root.querySelector('.sr-baslider__frame');
    var after  = root.querySelector('.sr-baslider__after');
    var handle = root.querySelector('.sr-baslider__handle');
    if (!frame || !after || !handle) return;

    var start = parseFloat(root.getAttribute('data-start'));
    if (isNaN(start)) start = 50;
    var pos = clamp(start, 0, 100);

    var dragging = false;

    function apply(pct) {
      pos = clamp(pct, 0, 100);
      var shown = Math.round(pos);
      after.style.width = pos + '%';
      handle.style.left = pos + '%';
      handle.setAttribute('aria-valuenow', String(shown));
    }

    function pctFromClientX(clientX) {
      var rect = frame.getBoundingClientRect();
      if (rect.width <= 0) return pos;
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function onMove(clientX) {
      apply(pctFromClientX(clientX));
    }

    function startDrag(e) {
      dragging = true;
      root.classList.add('sr-baslider--active');
      if (e.touches && e.touches.length) {
        onMove(e.touches[0].clientX);
      } else if (typeof e.clientX === 'number') {
        onMove(e.clientX);
      }
    }

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('sr-baslider--active');
    }

    // Pointer / mouse drag on the handle.
    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      startDrag(e);
    });
    handle.addEventListener('touchstart', function (e) {
      startDrag(e);
    }, { passive: true });

    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      onMove(e.clientX);
    });
    document.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      if (e.touches && e.touches.length) onMove(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchcancel', endDrag);

    // Click anywhere on the track to jump the handle there.
    frame.addEventListener('mousedown', function (e) {
      if (e.target === handle || handle.contains(e.target)) return;
      e.preventDefault();
      startDrag(e);
    });

    // Keyboard support on the handle.
    handle.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowLeft' || k === 'Left') {
        apply(pos - (e.shiftKey ? 10 : 2));
        e.preventDefault();
      } else if (k === 'ArrowRight' || k === 'Right') {
        apply(pos + (e.shiftKey ? 10 : 2));
        e.preventDefault();
      } else if (k === 'Home') {
        apply(0);
        e.preventDefault();
      } else if (k === 'End') {
        apply(100);
        e.preventDefault();
      }
    });

    // Re-apply on resize (width is percentage based, so just keep aria/state sane).
    window.addEventListener('resize', function () { apply(pos); });

    apply(pos);
  }

  function boot() {
    var nodes = document.querySelectorAll('.sr-baslider');
    Array.prototype.forEach.call(nodes, initOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
