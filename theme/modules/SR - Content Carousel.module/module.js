(function () {
  function initOne(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var slides = Array.prototype.slice.call(root.querySelectorAll('.sr-carousel__slide'));
    var dots   = Array.prototype.slice.call(root.querySelectorAll('.sr-carousel__dot'));
    var prev   = root.querySelector('.sr-carousel__arrow--prev');
    var next   = root.querySelector('.sr-carousel__arrow--next');

    if (!slides.length) return;

    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;

    // Single slide: nothing to navigate, hide controls.
    if (slides.length < 2) {
      if (prev) prev.style.display = 'none';
      if (next) next.style.display = 'none';
      return;
    }

    var current = 0;
    var autoplayOn = root.getAttribute('data-autoplay') === '1';
    var interval = parseInt(root.getAttribute('data-interval'), 10);
    if (isNaN(interval) || interval < 1) interval = 6;
    var timer = null;

    function show(idx) {
      idx = (idx % slides.length + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var active = i === idx;
        s.classList.toggle('sr-carousel__slide--active', active);
        if (active) {
          s.removeAttribute('aria-hidden');
        } else {
          s.setAttribute('aria-hidden', 'true');
        }
      });
      dots.forEach(function (d, i) {
        var active = i === idx;
        d.classList.toggle('sr-carousel__dot--active', active);
        d.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      current = idx;
    }

    function step(delta) {
      show(current + delta);
      restart();
    }

    function start() {
      if (!autoplayOn || reduce) return;
      stop();
      timer = setInterval(function () { show(current + 1); }, interval * 1000);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function restart() {
      if (!autoplayOn || reduce) return;
      stop();
      start();
    }

    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var i = parseInt(dot.getAttribute('data-index'), 10) || 0;
        show(i);
        restart();
      });
    });

    // Pause on hover and on keyboard focus within the carousel.
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    show(0);
    start();
  }

  function boot() {
    var nodes = document.querySelectorAll('.sr-carousel');
    Array.prototype.forEach.call(nodes, initOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
