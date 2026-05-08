(function () {
  function initOne(root) {
    if (root.dataset.srInit === 'true') return;
    root.dataset.srInit = 'true';

    var slides = Array.prototype.slice.call(root.querySelectorAll('.sr-testi__slide'));
    var dots   = Array.prototype.slice.call(root.querySelectorAll('.sr-testi__dot'));
    var prev   = root.querySelector('.sr-testi__btn--prev');
    var next   = root.querySelector('.sr-testi__btn--next');
    if (slides.length < 2) return;

    var current = 0;
    var autoplay = parseInt(root.getAttribute('data-autoplay'), 10) || 0;
    var timer = null;

    function show(idx) {
      idx = (idx + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle('sr-testi__slide--active', i === idx);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('sr-testi__dot--active', i === idx);
      });
      current = idx;
    }

    function step(delta) {
      show(current + delta);
      restartAutoplay();
    }

    function restartAutoplay() {
      if (!autoplay) return;
      if (timer) clearInterval(timer);
      timer = setInterval(function () { show(current + 1); }, autoplay * 1000);
    }

    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var i = parseInt(dot.getAttribute('data-index'), 10) || 0;
        show(i);
        restartAutoplay();
      });
    });

    // Pause on hover
    root.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    root.addEventListener('mouseleave', restartAutoplay);

    restartAutoplay();
  }

  function boot() {
    document.querySelectorAll('.sr-testi').forEach(initOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
