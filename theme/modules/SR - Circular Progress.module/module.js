(function () {
  'use strict';

  function clampNum(n) {
    if (isNaN(n)) return 0;
    if (n < 0) return 0;
    return n;
  }

  function animateNumber(el, target, duration, done) {
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = (ts - start) / duration;
      if (t > 1) t = 1;
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = Math.round(target);
        if (done) done();
      }
    }
    requestAnimationFrame(step);
  }

  function play(root) {
    var bars = root.querySelectorAll('.sr-ring__bar');
    var nums = root.querySelectorAll('.sr-ring__num');
    var i;

    for (i = 0; i < bars.length; i++) {
      (function (bar) {
        var circ = parseFloat(bar.getAttribute('data-sr-circ')) || 0;
        var finalOffset = parseFloat(bar.getAttribute('data-sr-final-offset')) || 0;
        // start empty, then transition to final
        bar.style.strokeDashoffset = circ;
        // force reflow so the transition runs
        void bar.getBoundingClientRect();
        requestAnimationFrame(function () {
          bar.style.strokeDashoffset = finalOffset;
        });
      })(bars[i]);
    }

    for (i = 0; i < nums.length; i++) {
      (function (num) {
        var target = clampNum(parseInt(num.getAttribute('data-sr-target'), 10));
        num.textContent = '0';
        animateNumber(num, target, 1400);
      })(nums[i]);
    }
  }

  function jumpToFinal(root) {
    var bars = root.querySelectorAll('.sr-ring__bar');
    var nums = root.querySelectorAll('.sr-ring__num');
    var i;
    for (i = 0; i < bars.length; i++) {
      var fo = parseFloat(bars[i].getAttribute('data-sr-final-offset')) || 0;
      bars[i].style.transition = 'none';
      bars[i].style.strokeDashoffset = fo;
    }
    for (i = 0; i < nums.length; i++) {
      var target = clampNum(parseInt(nums[i].getAttribute('data-sr-target'), 10));
      nums[i].textContent = Math.round(target);
    }
  }

  function initOne(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      jumpToFinal(root);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      play(root);
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          play(entries[i].target);
          obs.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.35 });

    io.observe(root);
  }

  function initAll() {
    var roots = document.querySelectorAll('.sr-ring');
    for (var i = 0; i < roots.length; i++) {
      initOne(roots[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
