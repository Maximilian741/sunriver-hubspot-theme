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

  // Palette lerp: fresh = gold, mid = green, old = teal — fading to transparent.
  function colorFor(age01, alpha) {
    var r, g, b;
    if (age01 < 0.4)      { r = 241; g = 194; b = 51; }   // SR gold (fresh)
    else if (age01 < 0.7) { r = 33;  g = 199; b = 0;  }   // SR green (mid)
    else                  { r = 6;   g = 224; b = 173; }  // SR teal (old)
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
