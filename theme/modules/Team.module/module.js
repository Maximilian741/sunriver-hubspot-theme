(function () {
  // Scope to this slider instance
  var root = document.querySelector('.atmc-team-01.atmc-slider');
  if (!root) return;

  var numbers = root.querySelectorAll('.sr-counter-number');
  if (!numbers.length) return;

  function animateNumber(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    var start = 0;
    var duration = 800; // ms
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      var value = Math.floor(start + (target - start) * progress);
      el.textContent = value;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  function startAllCounters() {
    numbers.forEach(function (el) {
      // don’t re-animate if the user scrolls back up
      if (el.dataset.animated === '1') return;
      el.dataset.animated = '1';
      animateNumber(el);
    });
  }

  // Kick counters on when the slider block is in view
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startAllCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(root);
  } else {
    // Old browsers: just run immediately
    startAllCounters();
  }
})();
