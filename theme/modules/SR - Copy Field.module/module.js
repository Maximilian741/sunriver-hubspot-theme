(function () {
  function setState(btn, label, done, root) {
    var span = btn.querySelector('.sr-copy__btn-label');
    if (span) span.textContent = label;
    btn.classList.toggle('is-done', !!done);
  }

  function copyValue(value, cb) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () { cb(true); }, function () { cb(fallback(value)); });
    } else {
      cb(fallback(value));
    }
  }

  function fallback(value) {
    try {
      var ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');
    var doneText = root.getAttribute('data-copied') || 'Copied';
    var rows = [].slice.call(root.querySelectorAll('.sr-copy__row'));
    rows.forEach(function (row) {
      var btn = row.querySelector('.sr-copy__btn');
      var valEl = row.querySelector('.sr-copy__value');
      if (!btn || !valEl) return;
      var timer = null;
      btn.addEventListener('click', function () {
        var value = valEl.getAttribute('data-copy-value') || valEl.textContent || '';
        value = value.trim();
        if (!value) return;
        copyValue(value, function (ok) {
          if (!ok) return;
          setState(btn, doneText, true, root);
          if (timer) clearTimeout(timer);
          timer = setTimeout(function () { setState(btn, 'Copy', false, root); }, 1600);
        });
      });
    });
  }

  function boot() { [].slice.call(document.querySelectorAll('.sr-copy')).forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
