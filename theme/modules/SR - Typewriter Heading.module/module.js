<![CDATA[(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var textEl = root.querySelector('.sr-typer__text');
    var dataEl = root.querySelector('.sr-typer__data');
    if (!textEl || !dataEl) return;

    var items = [].slice.call(dataEl.querySelectorAll('.sr-typer__item'));
    var phrases = items.map(function (n) { return (n.textContent || '').trim(); })
                       .filter(function (s) { return s.length > 0; });
    if (!phrases.length) return;

    // Progressive enhancement already shows phrases[0]; only animate if there is more than one.
    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduce || phrases.length < 2) {
      textEl.textContent = phrases[0];
      return;
    }

    var typeSpeed = parseInt(root.getAttribute('data-speed'), 10);
    if (!isFinite(typeSpeed) || typeSpeed < 10) typeSpeed = 70;
    var holdTime = parseInt(root.getAttribute('data-hold'), 10);
    if (!isFinite(holdTime) || holdTime < 0) holdTime = 1500;
    var deleteSpeed = Math.max(20, Math.round(typeSpeed / 2));

    var pi = 0;        // phrase index
    var ci = 0;        // char index
    var deleting = false;
    var timer = null;

    function clear() { if (timer) { clearTimeout(timer); timer = null; } }

    function step() {
      var current = phrases[pi];

      if (!deleting) {
        ci++;
        textEl.textContent = current.slice(0, ci);
        if (ci >= current.length) {
          deleting = true;
          timer = setTimeout(step, holdTime);
          return;
        }
        timer = setTimeout(step, typeSpeed);
      } else {
        ci--;
        textEl.textContent = current.slice(0, Math.max(0, ci));
        if (ci <= 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          timer = setTimeout(step, typeSpeed);
          return;
        }
        timer = setTimeout(step, deleteSpeed);
      }
    }

    // Start fresh from an empty string so the first cycle types cleanly.
    ci = 0;
    textEl.textContent = '';
    timer = setTimeout(step, 400);

    // Pause the loop when off-screen to save cycles; resume on return.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!timer) timer = setTimeout(step, typeSpeed);
          } else {
            clear();
          }
        });
      }, { threshold: 0 });
      io.observe(root);
    }
  }

  function boot() {
    [].slice.call(document.querySelectorAll('.sr-typer')).forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();]]>
