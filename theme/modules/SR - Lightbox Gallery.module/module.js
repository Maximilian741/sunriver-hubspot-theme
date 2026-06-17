(function () {
  'use strict';

  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var thumbs = [].slice.call(root.querySelectorAll('.sr-lightbox__thumb'));
    if (!thumbs.length) return;

    var overlay = root.querySelector('.sr-lightbox__overlay');
    var fullImg = root.querySelector('.sr-lightbox__full');
    var fullCap = root.querySelector('.sr-lightbox__fullcap');
    var counter = root.querySelector('.sr-lightbox__count');
    var btnPrev = root.querySelector('[data-sr-prev]');
    var btnNext = root.querySelector('[data-sr-next]');
    if (!overlay || !fullImg) return;

    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || false;

    var slides = thumbs.map(function (t) {
      return {
        src: t.getAttribute('data-sr-src') || '',
        alt: t.getAttribute('data-sr-alt') || '',
        caption: t.getAttribute('data-sr-caption') || ''
      };
    });

    var current = 0;
    var lastFocused = null;
    var scrollLock = 0;

    function lockScroll() {
      scrollLock = window.pageYOffset || document.documentElement.scrollTop || 0;
      document.body.style.top = '-' + scrollLock + 'px';
      document.body.classList.add('sr-lightbox-lock');
    }

    function unlockScroll() {
      document.body.classList.remove('sr-lightbox-lock');
      document.body.style.top = '';
      window.scrollTo(0, scrollLock);
    }

    function render(i) {
      var total = slides.length;
      current = ((i % total) + total) % total;
      var s = slides[current];
      fullImg.setAttribute('src', s.src);
      fullImg.setAttribute('alt', s.alt);
      if (fullCap) {
        fullCap.textContent = s.caption;
        fullCap.style.display = s.caption ? '' : 'none';
      }
      if (counter) counter.textContent = (current + 1) + ' of ' + total;
      var single = total < 2;
      if (btnPrev) btnPrev.style.display = single ? 'none' : '';
      if (btnNext) btnNext.style.display = single ? 'none' : '';
    }

    function open(i) {
      lastFocused = document.activeElement;
      render(i);
      overlay.hidden = false;
      lockScroll();
      if (!reduce) {
        overlay.classList.remove('is-in');
        void overlay.offsetWidth;
      }
      overlay.classList.add('is-open');
      if (!reduce) overlay.classList.add('is-in');
      var closeBtn = overlay.querySelector('.sr-lightbox__close');
      if (closeBtn) closeBtn.focus();
      document.addEventListener('keydown', onKey);
    }

    function close() {
      overlay.classList.remove('is-open', 'is-in');
      overlay.hidden = true;
      unlockScroll();
      document.removeEventListener('keydown', onKey);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    function next() { render(current + 1); }
    function prev() { render(current - 1); }

    function onKey(e) {
      var k = e.key;
      if (k === 'Escape' || k === 'Esc') { e.preventDefault(); close(); }
      else if (k === 'ArrowRight') { e.preventDefault(); next(); }
      else if (k === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (k === 'Tab') { trapFocus(e); }
    }

    function trapFocus(e) {
      var focusables = [].slice.call(overlay.querySelectorAll('button')).filter(function (b) {
        return b.style.display !== 'none' && b.offsetParent !== null;
      });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { open(i); });
    });

    overlay.addEventListener('click', function (e) {
      var el = e.target;
      while (el && el !== overlay) {
        if (el.getAttribute('data-sr-close')) { close(); return; }
        if (el.getAttribute('data-sr-next')) { next(); return; }
        if (el.getAttribute('data-sr-prev')) { prev(); return; }
        el = el.parentNode;
      }
    });

    // Swipe support
    var startX = 0, startY = 0, tracking = false;
    var stage = overlay.querySelector('.sr-lightbox__stage');
    if (stage) {
      stage.addEventListener('touchstart', function (e) {
        if (!e.touches || !e.touches.length) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        tracking = true;
      }, { passive: true });
      stage.addEventListener('touchend', function (e) {
        if (!tracking || !e.changedTouches || !e.changedTouches.length) return;
        tracking = false;
        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) next(); else prev();
        }
      }, { passive: true });
    }
  }

  function boot() {
    var roots = document.querySelectorAll('.sr-lightbox');
    for (var i = 0; i < roots.length; i++) init(roots[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
