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

// SunRiver ASCII cursor trail — a localized glyph cloud that follows the cursor.
// Glyphs spawn only where the cursor actually moves and fade out in under a second,
// so the effect hugs the pointer and never accumulates into a screen-wide wash.
// No mix-blend-mode (that was lightening the whole page). Skipped on touch and
// prefers-reduced-motion; pauses when the tab is hidden.
(function () {
  if (!window.matchMedia) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'sr-cursor-fx';
  canvas.setAttribute('aria-hidden', 'true');
  (document.body || document.documentElement).appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Glyph ramp (sparse → dense) and SR palette stops.
  var GLYPHS = '·:+*xX#';
  var LIFE = 650;          // ms a glyph lives before it's fully faded
  var MAX = 110;           // hard cap on live glyphs (perf + restraint)
  var SIZE = 13;           // glyph font size in px
  var particles = [];      // { x, y, born, ch, dx, dy }

  var mx = -1, my = -1, pmx = -1, pmy = -1;
  var nowMs = 0;

  function rand(seed) { return Math.abs(Math.sin(seed * 999.13)) % 1; }

  function spawn(x, y, seed) {
    if (particles.length >= MAX) particles.shift();
    var ang = rand(seed) * Math.PI * 2;
    var spread = 2 + rand(seed + 7) * 8;
    particles.push({
      x: x + Math.cos(ang) * spread,
      y: y + Math.sin(ang) * spread,
      born: nowMs,
      ch: GLYPHS[(seed | 0) % GLYPHS.length],
      dx: (rand(seed + 3) - 0.5) * 0.5,   // gentle drift
      dy: -0.25 - rand(seed + 11) * 0.5   // rise slightly
    });
  }

  var seedCounter = 0;
  window.addEventListener('mousemove', function (e) {
    pmx = mx; pmy = my;
    mx = e.clientX; my = e.clientY;
    if (pmx < 0) return;
    var dx = mx - pmx, dy = my - pmy;
    var dist = Math.hypot(dx, dy);
    // Spawn a few glyphs along the segment the cursor just traversed,
    // proportional to speed but capped so fast flicks don't flood.
    var n = Math.min(4, 1 + Math.floor(dist / 14));
    for (var i = 0; i < n; i++) {
      var t = n > 1 ? i / (n - 1) : 0;
      spawn(pmx + dx * t, pmy + dy * t, ++seedCounter);
    }
  }, { passive: true });

  var paused = false;
  document.addEventListener('visibilitychange', function () { paused = document.hidden; });

  // Palette lerp (brand kit): fresh = Sun, mid = Valley, old = River.
  function colorFor(age01, alpha) {
    var r, g, b;
    if (age01 < 0.4)      { r = 251; g = 195; b = 74;  }  // Sun (fresh)
    else if (age01 < 0.7) { r = 143; g = 199; b = 64;  }  // Valley (mid)
    else                  { r = 62;  g = 157; b = 184; }  // River (old)
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha.toFixed(3) + ')';
  }

  function frame() {
    requestAnimationFrame(frame);
    if (paused) return;
    nowMs = performance.now();

    ctx.clearRect(0, 0, W, H);
    if (!particles.length) return;

    ctx.font = '700 ' + SIZE + 'px "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      var age = (nowMs - p.born) / LIFE;
      if (age >= 1) { particles.splice(i, 1); continue; }
      // Drift over lifetime.
      p.x += p.dx;
      p.y += p.dy;
      // Ease-out fade.
      var alpha = (1 - age) * (1 - age) * 0.85;
      ctx.fillStyle = colorFor(age, alpha);
      ctx.fillText(p.ch, p.x, p.y);
    }
  }
  frame();
})();

// SunRiver page-load loader — the brand "Daybreak" ring (sun → valley → river → deep).
// Shows once per session on the first non-Home page, then self-removes. NEVER shown on
// the Home page (path "/") and never on prefers-reduced-motion. A hard timeout guarantees
// it can never trap the page even if the load event never fires.
(function () {
  var path;
  try { path = location.pathname || '/'; } catch (e) { return; }
  if (path === '/' || path === '') return;                         // never on Home
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try { if (sessionStorage.getItem('sr-loader-seen')) return; sessionStorage.setItem('sr-loader-seen', '1'); } catch (e) {}

  var style = document.createElement('style');
  style.textContent =
    '@keyframes srLoadSpin{to{transform:rotate(360deg)}}' +
    '#sr-load{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;' +
    'align-items:center;justify-content:center;gap:18px;background:#0c1f29;' +
    'transition:opacity .5s ease;opacity:1}' +
    '#sr-load.sr-load--out{opacity:0;pointer-events:none}' +
    '#sr-load .sr-load__ring{width:54px;height:54px;border-radius:50%;' +
    'background:conic-gradient(from 90deg,#3e9db8,#fbc34a,#8fc740,#3e9db8);' +
    '-webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - 6px),#000 calc(100% - 5px));' +
    'mask:radial-gradient(farthest-side,#0000 calc(100% - 6px),#000 calc(100% - 5px));' +
    'animation:srLoadSpin 1.1s linear infinite}' +
    '#sr-load .sr-load__wm{font-family:"Poppins",system-ui,sans-serif;font-weight:600;' +
    'letter-spacing:-.02em;font-size:20px}' +
    '#sr-load .sr-load__wm .s{color:#f3f8fa}' +
    '#sr-load .sr-load__wm .r{background:linear-gradient(90deg,#fbc34a,#8fc740,#3e9db8);' +
    '-webkit-background-clip:text;background-clip:text;color:transparent}';
  (document.head || document.documentElement).appendChild(style);

  var el = document.createElement('div');
  el.id = 'sr-load';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="sr-load__ring"></div>' +
    '<div class="sr-load__wm"><span class="s">Sun</span><span class="r">River</span></div>';
  (document.body || document.documentElement).appendChild(el);

  var start = Date.now(), done = false;
  function hide() {
    if (done) return; done = true;
    el.classList.add('sr-load--out');
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 550);
  }
  function ready() {
    // keep visible at least 450ms so it reads as intentional, never longer than needed
    var wait = Math.max(0, 450 - (Date.now() - start));
    setTimeout(hide, wait);
  }
  if (document.readyState === 'complete') ready();
  else window.addEventListener('load', ready);
  setTimeout(hide, 2500);   // hard cap — never trap the page
})();

// SunRiver form-submit progress — a thin top "Brook" stream in the brand gradient,
// shown whenever any form on the page is submitted. Purely visual: it never blocks
// or alters submission, and auto-hides on navigation or after a timeout.
(function () {
  var bar = null, hideTimer = null;
  function ensureBar() {
    if (bar) return bar;
    bar = document.createElement('div');
    bar.id = 'sr-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<i></i>';
    (document.body || document.documentElement).appendChild(bar);
    return bar;
  }
  function show() {
    ensureBar();
    // force reflow so the opacity transition runs even on first show
    void bar.offsetWidth;
    bar.classList.add('sr-progress--on');
    if (hideTimer) clearTimeout(hideTimer);
    // For inline/AJAX forms that don't navigate, retract after a few seconds.
    hideTimer = setTimeout(hide, 5000);
  }
  function hide() {
    if (bar) bar.classList.remove('sr-progress--on');
  }
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.tagName === 'FORM') show();
  }, true);
  // Tidy up if the page is being navigated away/restored from bfcache.
  window.addEventListener('pagehide', hide);
})();
