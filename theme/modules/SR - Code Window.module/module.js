(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var btn = root.querySelector('.sr-codewin__copy');
    var code = root.querySelector('.sr-codewin__code');
    if (!btn || !code) return;

    btn.addEventListener('click', function () {
      var text = (code.innerText || code.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
      function done() {
        var old = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('is-copied');
        window.setTimeout(function () { btn.textContent = old; btn.classList.remove('is-copied'); }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta); done();
        } catch (e) { /* clipboard unavailable */ }
      }
    });
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll('.sr-codewin'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
