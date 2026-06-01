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

// SunRiver .srx showcase runtime — scroll-reveal + brand-palette WebGL shader
// backgrounds. Auto-runs on any page that contains .srx components (the
// *-Showcase templates). Honors prefers-reduced-motion; canvases are guarded
// with data-srx-init so this can never double-initialize one.
(function () {
  function init() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var reveals = [].slice.call(document.querySelectorAll('.srx-reveal:not(.srx-in)'));
    if (reveals.length) {
      if (reduce || !('IntersectionObserver' in window)) {
        reveals.forEach(function (el) { el.classList.add('srx-in'); });
      } else {
        var ro = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('srx-in'); ro.unobserve(e.target); } });
        }, { threshold: 0.15 });
        reveals.forEach(function (el) { ro.observe(el); });
      }
    }

    // tactile click ripple on the .srx boxes — highlight on hover, react on click
    if (!reduce) {
      document.addEventListener('pointerdown', function (e) {
        var box = e.target && e.target.closest ? e.target.closest('.srx-card') : null;
        if (!box) return;
        var r = box.getBoundingClientRect(), size = Math.max(r.width, r.height);
        var sp = document.createElement('span');
        sp.className = 'srx-card__ripple';
        sp.style.width = sp.style.height = size + 'px';
        sp.style.left = (e.clientX - r.left - size / 2) + 'px';
        sp.style.top = (e.clientY - r.top - size / 2) + 'px';
        box.appendChild(sp);
        setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 640);
      }, { passive: true });
    }

    var canvases = [].slice.call(document.querySelectorAll('canvas[data-srx-shader]:not([data-srx-init])'));
    if (!canvases.length) return;
    if (reduce) { canvases.forEach(function (c) { c.setAttribute('data-srx-init', '1'); c.style.display = 'none'; }); return; }

    var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
    var COMMON =
      'precision highp float;uniform float u_time;uniform vec2 u_res;uniform vec2 u_mouse;' +
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
      'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);' +
      'return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}' +
      'float fbm(vec2 p){float v=0.0,a=0.5;mat2 R=mat2(0.8,-0.6,0.6,0.8);' +
      'for(int i=0;i<5;i++){v+=a*noise(p);p=R*p*2.05+3.1;a*=0.5;}return v;}' +
      'vec2 warp(vec2 q,vec2 pp){return q+(u_mouse-pp)*exp(-length(pp-u_mouse)*1.7)*0.5;}' +
      'vec3 SUN=vec3(0.984,0.765,0.290);vec3 VAL=vec3(0.561,0.780,0.251);' +
      'vec3 RIV=vec3(0.243,0.616,0.722);vec3 DEEP=vec3(0.110,0.357,0.467);' +
      'vec3 BASE=vec3(0.035,0.102,0.145);';
    var EMBER = COMMON +
      'void main(){vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;float t=u_time*0.11;' +
      'vec2 q=p*1.3;q.y+=t*0.8;q+=0.4*vec2(fbm(q+t),fbm(q*1.2-t+7.0));q=warp(q,p);' +
      'float smoke=fbm(q);float dense=smoothstep(0.2,0.85,smoke);' +
      'float wisp=fbm(q*2.5+vec2(0.0,t*1.5));dense*=0.6+0.6*wisp;' +
      'vec3 col=BASE;col=mix(col,DEEP,smoothstep(0.1,0.5,dense));' +
      'col=mix(col,RIV,smoothstep(0.42,0.82,dense));col=mix(col,VAL,smoothstep(0.62,0.95,dense)*0.55);' +
      'col+=SUN*pow(dense,6.0)*0.65;col*=1.0-0.42*dot(p,p);' +
      'col+=(hash(gl_FragCoord.xy+u_time)-0.5)*0.02;gl_FragColor=vec4(col,1.0);}';
    var MAPLE = COMMON +
      'void main(){vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;float t=u_time*0.09;' +
      'vec2 q=p*1.2+vec2(t*0.6,t*0.2);q=warp(q,p);float mist=fbm(q+vec2(0.0,fbm(q*2.0-t)));' +
      'float density=smoothstep(0.2,0.85,mist);vec2 lq=p*6.0+vec2(-t*1.2,t*0.3);' +
      'vec2 li=floor(lq),lf=fract(lq);float pD=1.0;vec2 pC=vec2(0.0);' +
      'for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){vec2 o=vec2(float(x),float(y));' +
      'vec2 h=vec2(hash(li+o),hash(li+o+17.0));vec2 seed=o+h;' +
      'seed+=vec2(sin(u_time*0.5+h.x*6.28)*0.18,cos(u_time*0.4+h.y*6.28)*0.12);' +
      'float d=length(seed-lf);if(d<pD){pD=d;pC=li+o;}}}' +
      'float part=smoothstep(0.15,0.04,pD);float lh=hash(pC);' +
      'vec3 bg=mix(BASE,DEEP,smoothstep(-0.4,0.5,p.y));bg=mix(bg,RIV*0.5,density*0.45);' +
      'vec3 pCol;if(lh<0.4)pCol=RIV;else if(lh<0.75)pCol=VAL;else pCol=SUN;' +
      'vec3 col=bg;col=mix(col,pCol,part*0.7);col=mix(col,BASE,smoothstep(0.6,1.2,length(p))*0.6);' +
      'col+=(hash(gl_FragCoord.xy+u_time)-0.5)*0.015;gl_FragColor=vec4(col,1.0);}';
    // Neon flavor — vibrant SR green/teal/gold on near-black (matches the home-page look).
    var NEON =
      'vec3 NG=vec3(0.129,0.78,0.0);vec3 NT=vec3(0.024,0.878,0.678);' +
      'vec3 NGD=vec3(0.945,0.761,0.20);vec3 NINK=vec3(0.016,0.063,0.043);';
    var EMBER_NEON = COMMON + NEON +
      'void main(){vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;float t=u_time*0.12;' +
      'vec2 q=p*1.3;q.y+=t*0.85;q+=0.4*vec2(fbm(q+t),fbm(q*1.2-t+7.0));q=warp(q,p);' +
      'float smoke=fbm(q);float dense=smoothstep(0.18,0.85,smoke);' +
      'float wisp=fbm(q*2.5+vec2(0.0,t*1.6));dense*=0.6+0.6*wisp;' +
      'vec3 col=NINK;col=mix(col,NG*0.55,smoothstep(0.1,0.5,dense));' +
      'col=mix(col,NT,smoothstep(0.42,0.84,dense));col=mix(col,NG,smoothstep(0.6,0.93,dense)*0.7);' +
      'col+=NGD*pow(dense,5.0)*0.85;col+=NT*pow(dense,9.0)*0.6;' +
      'col*=1.0-0.4*dot(p,p);col+=(hash(gl_FragCoord.xy+u_time)-0.5)*0.02;gl_FragColor=vec4(col,1.0);}';
    var MAPLE_NEON = COMMON + NEON +
      'void main(){vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;float t=u_time*0.09;' +
      'vec2 q=p*1.2+vec2(t*0.6,t*0.2);q=warp(q,p);float mist=fbm(q+vec2(0.0,fbm(q*2.0-t)));' +
      'float density=smoothstep(0.2,0.85,mist);vec2 lq=p*6.0+vec2(-t*1.2,t*0.3);' +
      'vec2 li=floor(lq),lf=fract(lq);float pD=1.0;vec2 pC=vec2(0.0);' +
      'for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){vec2 o=vec2(float(x),float(y));' +
      'vec2 h=vec2(hash(li+o),hash(li+o+17.0));vec2 seed=o+h;' +
      'seed+=vec2(sin(u_time*0.5+h.x*6.28)*0.18,cos(u_time*0.4+h.y*6.28)*0.12);' +
      'float d=length(seed-lf);if(d<pD){pD=d;pC=li+o;}}}' +
      'float part=smoothstep(0.16,0.04,pD);float lh=hash(pC);' +
      'vec3 bg=mix(NINK,NG*0.16,smoothstep(-0.5,0.6,p.y));bg=mix(bg,NT*0.18,density*0.5);' +
      'vec3 pCol;if(lh<0.4)pCol=NT;else if(lh<0.75)pCol=NG;else pCol=NGD;' +
      'vec3 col=bg;col=mix(col,pCol,part*0.85);col=mix(col,NINK,smoothstep(0.6,1.2,length(p))*0.55);' +
      'col+=(hash(gl_FragCoord.xy+u_time)-0.5)*0.015;gl_FragColor=vec4(col,1.0);}';
    // Warm ember — charcoal → umber → ember orange → gold (the original "ember smoke").
    var EMBER_WARM = COMMON +
      'void main(){vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;float t=u_time*0.12;' +
      'vec2 q=p*1.3;q.y+=t*0.85;q+=0.4*vec2(fbm(q+t),fbm(q*1.2-t+7.0));q=warp(q,p);' +
      'float smoke=fbm(q);float dense=smoothstep(0.18,0.85,smoke);' +
      'float wisp=fbm(q*2.5+vec2(0.0,t*1.6));dense*=0.6+0.6*wisp;' +
      'vec3 night=vec3(0.05,0.035,0.05);vec3 chr=vec3(0.20,0.10,0.08);' +
      'vec3 umber=vec3(0.55,0.22,0.10);vec3 ember=vec3(1.0,0.45,0.12);vec3 gold=vec3(1.0,0.78,0.35);' +
      'vec3 col=night;col=mix(col,chr,smoothstep(0.1,0.5,dense));col=mix(col,umber,smoothstep(0.45,0.85,dense));' +
      'col+=ember*pow(dense,5.0)*0.85;col+=gold*pow(dense,9.0)*0.55;' +
      'col*=1.0-0.45*dot(p,p);col+=(hash(gl_FragCoord.xy+u_time)-0.5)*0.025;gl_FragColor=vec4(col,1.0);}';
    var FRAG = { ember: EMBER, maple: MAPLE, 'ember-neon': EMBER_NEON, 'maple-neon': MAPLE_NEON, 'ember-warm': EMBER_WARM };

    function run(canvas, fragSrc) {
      var gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false });
      if (!gl) { canvas.style.display = 'none'; return; }
      function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
      var prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fragSrc));
      gl.linkProgram(prog); gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      var uT = gl.getUniformLocation(prog, 'u_time'), uR = gl.getUniformLocation(prog, 'u_res'), uM = gl.getUniformLocation(prog, 'u_mouse');
      var start = performance.now(), visible = true, mAim = [0, 0], mSm = [0, 0];
      window.addEventListener('mousemove', function (e) {
        var r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return;
        mAim[0] = (e.clientX - r.left - r.width / 2) / r.height;
        mAim[1] = 0.5 - (e.clientY - r.top) / r.height;
      }, { passive: true });
      function sizeCanvas() {
        var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        var w = Math.max(1, Math.floor(canvas.clientWidth * dpr)), h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      }
      window.addEventListener('resize', sizeCanvas);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; }); }).observe(canvas);
      function loop() {
        requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        sizeCanvas();
        mSm[0] += (mAim[0] - mSm[0]) * 0.07; mSm[1] += (mAim[1] - mSm[1]) * 0.07;
        gl.uniform1f(uT, (performance.now() - start) / 1000);
        gl.uniform2f(uR, canvas.width, canvas.height);
        if (uM) gl.uniform2f(uM, mSm[0], mSm[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      loop();
    }

    canvases.forEach(function (c) {
      c.setAttribute('data-srx-init', '1');
      run(c, FRAG[c.getAttribute('data-srx-shader')] || EMBER);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
