// SunRiver Pine Growth — scroll trigger (no dependencies)
(function () {
  var wrap = document.querySelector('.sr-pine-wrap');
  if (!wrap) return;

  function activate() {
    wrap.classList.add('sr-pine--inview');
  }

  // Fallback: if IntersectionObserver not supported, just run it
  if (!('IntersectionObserver' in window)) {
    activate();
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        activate();
        io.unobserve(entry.target); // run once
      }
    });
  }, { threshold: 0.35 });

  io.observe(wrap);
})();
