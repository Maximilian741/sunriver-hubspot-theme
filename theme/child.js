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

// SunRiver ASCII cursor trail — site-wide subtle overlay.
// Smoke-field simulation rendered as glyphs in the SR palette (teal → green → gold).
// Disabled on touch and prefers-reduced-motion. Mix-blend-mode in child.css makes it
// glow on dark hero sections and fade out on white body sections.
(function () {
  if (!window.matchMedia) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'sr-cursor-fx';
  canvas.setAttribute('aria-hidden', 'true');
  (document.body || document.documentElement).appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var cell = 8;
  var drift = 0.22, diffuse = 0.10, decay = 0.94, radius = 3.5;
  var W = 0, H = 0, cols = 0, rows = 0;
  var grid, next;

  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    if (w === W && h === H) return;
    W = w; H = h;
    canvas.width = W; canvas.height = H;
    cols = Math.ceil(W / cell);
    rows = Math.ceil(H / cell);
    grid = new Float32Array(cols * rows);
    next = new Float32Array(cols * rows);
  }
  resize();
  window.addEventListener('resize', resize);

  var mx = -1, my = -1, pmx = -1, pmy = -1;
  window.addEventListener('mousemove', function (e) {
    pmx = mx; pmy = my;
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  var paused = false;
  document.addEventListener('visibilitychange', function () { paused = document.hidden; });

  function hashN(x, y, t) { return Math.sin(x * 12.9898 + y * 78.233 + t) * 0.5; }
  var ramp = ' .·:;+*x#';

  function frame() {
    requestAnimationFrame(frame);
    if (paused || !grid) return;
    var tNow = performance.now() * 0.0006;

    // Smoke physics: advect + diffuse + decay.
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var jx = hashN(x * 0.25, y * 0.25, tNow) * 1.0 + hashN(x * 0.7, y * 0.3, tNow * 0.6) * 0.5;
        var srcX = x + jx, srcY = y + drift;
        var sx0 = Math.max(0, Math.min(cols - 1, Math.floor(srcX)));
        var sx1 = Math.max(0, Math.min(cols - 1, sx0 + 1));
        var sy0 = Math.max(0, Math.min(rows - 1, Math.floor(srcY)));
        var sy1 = Math.max(0, Math.min(rows - 1, sy0 + 1));
        var fx = srcX - sx0, fy = srcY - sy0;
        var v00 = grid[sy0 * cols + sx0], v10 = grid[sy0 * cols + sx1];
        var v01 = grid[sy1 * cols + sx0], v11 = grid[sy1 * cols + sx1];
        var v = (v00 * (1 - fx) + v10 * fx) * (1 - fy) + (v01 * (1 - fx) + v11 * fx) * fy;
        var acc = 0, cnt = 0;
        if (x > 0)        { acc += grid[y * cols + x - 1]; cnt++; }
        if (x < cols - 1) { acc += grid[y * cols + x + 1]; cnt++; }
        if (y > 0)        { acc += grid[(y - 1) * cols + x]; cnt++; }
        if (y < rows - 1) { acc += grid[(y + 1) * cols + x]; cnt++; }
        var navg = cnt ? acc / cnt : 0;
        next[y * cols + x] = (v * (1 - diffuse) + navg * diffuse) * decay;
      }
    }
    var tmp = grid; grid = next; next = tmp;

    // Inject density along cursor path.
    if (mx >= 0 && pmx >= 0) {
      var dx = mx - pmx, dy = my - pmy;
      var dist = Math.hypot(dx, dy);
      var steps = Math.min(40, Math.ceil(dist / (cell * 0.4)));
      for (var s = 0; s <= steps; s++) {
        var t = steps ? s / steps : 0;
        var px = pmx + dx * t, py = pmy + dy * t;
        var cx = Math.floor(px / cell), cy = Math.floor(py / cell);
        var rInt = Math.ceil(radius);
        for (var oy = -rInt; oy <= rInt; oy++) {
          for (var ox = -rInt; ox <= rInt; ox++) {
            var gx = cx + ox, gy = cy + oy;
            if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) continue;
            var d = Math.hypot(ox, oy);
            if (d > radius) continue;
            var vv = Math.max(0, 1 - d / radius);
            grid[gy * cols + gx] = Math.min(1, grid[gy * cols + gx] + vv * vv * 0.18);
          }
        }
      }
    }
    pmx = mx; pmy = my;

    // Render: transparent background, SR palette glyphs.
    // Teal at low density → green at mid → gold at peak.
    ctx.clearRect(0, 0, W, H);
    ctx.font = (cell - 1) + 'px "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
    ctx.textBaseline = 'top';
    for (var yy = 0; yy < rows; yy++) {
      for (var xx = 0; xx < cols; xx++) {
        var vvv = grid[yy * cols + xx];
        if (vvv < 0.05) continue;
        var idx = Math.min(ramp.length - 1, Math.floor(vvv * ramp.length));
        var ch = ramp[idx];
        var alpha = (0.10 + vvv * 0.40) * 0.75;
        var r, g, b;
        if (vvv < 0.4)       { r = 6;   g = 224; b = 173; }   // SR teal
        else if (vvv < 0.75) { r = 33;  g = 199; b = 0;   }   // SR green
        else                 { r = 241; g = 194; b = 51;  }   // SR gold
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
        ctx.fillText(ch, xx * cell, yy * cell);
      }
    }
  }
  frame();
})();
