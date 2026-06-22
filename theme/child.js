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

    // page-wide smoke on .srh pages: ONE fixed canvas behind everything, so the
    // smoke runs continuously behind the cards instead of being cut off per band
    var srhRoot = document.querySelector('.srh');
    if (srhRoot && !document.querySelector('.srh__smoke')) {
      var pc = document.createElement('canvas');
      pc.className = 'srh__smoke';
      pc.setAttribute('data-srx-shader', 'smoke-veil');
      pc.setAttribute('aria-hidden', 'true');
      srhRoot.insertBefore(pc, srhRoot.firstChild);
    }

    // stagger: cards / FAQ items / contact tiles pop in one at a time
    [].forEach.call(document.querySelectorAll('.srh-cards, .srh-faq, .srh-methods'), function (grid) {
      grid.classList.remove('srx-reveal');
      [].forEach.call(grid.children, function (el, i) {
        el.classList.add('srx-reveal');
        el.style.transitionDelay = Math.min(i * 90, 540) + 'ms';
      });
    });

    var reveals = [].slice.call(document.querySelectorAll('.srx-reveal:not(.srx-in)'));
    if (reveals.length) {
      // once revealed, drop the stagger delay so hover/scroll transitions
      // respond instantly instead of waiting out the leftover delay (mobile jank)
      var unstagger = function (el) { setTimeout(function () { el.style.transitionDelay = ''; }, 950); };
      if (reduce || !('IntersectionObserver' in window)) {
        reveals.forEach(function (el) { el.classList.add('srx-in'); el.style.transitionDelay = ''; });
      } else {
        var ro = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('srx-in'); ro.unobserve(e.target); unstagger(e.target); } });
        }, { threshold: 0.15 });
        reveals.forEach(function (el) { ro.observe(el); });
      }
    }

    // tactile click ripple on the .srx boxes — highlight on hover, react on click
    if (!reduce) {
      document.addEventListener('pointerdown', function (e) {
        var box = e.target && e.target.closest ? e.target.closest('.srx-card, .srh-card') : null;
        if (!box) return;
        var r = box.getBoundingClientRect(), size = Math.max(r.width, r.height);
        var sp = document.createElement('span');
        sp.className = 'sr-ripple';
        sp.style.width = sp.style.height = size + 'px';
        sp.style.left = (e.clientX - r.left - size / 2) + 'px';
        sp.style.top = (e.clientY - r.top - size / 2) + 'px';
        box.appendChild(sp);
        setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 640);
      }, { passive: true });
    }

    // interactive pricing estimator
    (function () {
      var est = document.querySelector('[data-estimator]'); if (!est) return;
      var scale = 1, mode = 'project';
      function money(n, step) { step = step || 500; n = Math.max(0, Math.round(n / step) * step); return '$' + n.toLocaleString('en-US'); }
      function recompute() {
        var base = 0, items = [];
        [].forEach.call(est.querySelectorAll('.srh-chip2 input:checked'), function (i) {
          var b = parseFloat(i.getAttribute('data-base')) || 0;
          base += b;
          items.push({ n: i.parentNode.getAttribute('data-name') || i.parentNode.textContent.trim(), b: b });
        });
        var total = base * scale; if (mode === 'retainer') total *= 0.18;
        var lo = est.querySelector('[data-lo]'), hi = est.querySelector('[data-hi]');
        if (base === 0) { if (lo) lo.textContent = '—'; if (hi) hi.textContent = '—'; }
        else { if (lo) lo.textContent = money(total * 0.8); if (hi) hi.textContent = money(total * 1.3); }
        var ml = est.querySelector('[data-modelabel]'); if (ml) ml.textContent = mode === 'retainer' ? 'per month, ongoing' : 'one-time project';
        var sum = est.querySelector('[data-sum]');
        // per-line ballparks so people can see what each piece costs
        if (sum) sum.innerHTML = items.length
          ? items.map(function (it) {
              var v = it.b * scale; if (mode === 'retainer') v *= 0.18;
              var tag = mode === 'retainer' ? (money(v, 50) + '/mo') : (money(v * 0.8) + '–' + money(v * 1.3));
              return '<li><span>' + it.n + '</span><span>' + tag + '</span></li>';
            }).join('')
          : '<li><span>Pick what you need &rarr;</span><span></span></li>';
      }
      est.addEventListener('change', function (e) {
        if (e.target.matches && e.target.matches('.srh-chip2 input')) { e.target.parentNode.classList.toggle('is-on', e.target.checked); recompute(); }
      });
      est.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.srh-seg button'); if (!b) return;
        var seg = b.closest('.srh-seg');
        [].forEach.call(seg.querySelectorAll('button'), function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        if (seg.getAttribute('data-seg') === 'scale') scale = parseFloat(b.getAttribute('data-mult'));
        else mode = b.getAttribute('data-mode');
        recompute();
      });
      recompute();
    })();
    // FAQ accordion
    [].forEach.call(document.querySelectorAll('.srh-faq__q'), function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.srh-faq__item'), a = item.querySelector('.srh-faq__a');
        var open = item.classList.toggle('is-open');
        a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
      });
    });
    // contact form (demo confirmation if no backend is wired)
    [].forEach.call(document.querySelectorAll('form[data-demo]'), function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        f.innerHTML = '<div class="srh-form__ok">Thanks — we got it. A real engineer will be in touch shortly.</div>';
      });
    });

    // green -> sunset background warmth, driven by scroll (used by .srd__sky).
    // Slow ramp: full ember only after ~1800px so the red arrives late.
    (function () {
      var setWarm = function () { var w = Math.min(1, (window.scrollY || window.pageYOffset || 0) / 1800); document.documentElement.style.setProperty('--sr-warm', w.toFixed(3)); };
      window.addEventListener('scroll', setWarm, { passive: true }); setWarm();
    })();
    // collapsible deep-dive sheets: collapsed by default; header click toggles;
    // arriving via #anchor (nav / modal Learn more) auto-expands the target
    (function () {
      var sheets = document.querySelectorAll('.srd-collapse');
      if (!sheets.length) return;
      [].forEach.call(sheets, function (sh) {
        var head = sh.querySelector('.srd-collapse__head');
        if (!head) return;
        head.addEventListener('click', function () {
          var open = sh.classList.toggle('is-open');
          head.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      });
      function openFromHash() {
        var id = (location.hash || '').slice(1);
        if (!id) return;
        var el = document.getElementById(id);
        if (el && el.classList.contains('srd-collapse')) {
          el.classList.add('is-open');
          var h = el.querySelector('.srd-collapse__head'); if (h) h.setAttribute('aria-expanded', 'true');
          setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
        }
      }
      window.addEventListener('hashchange', openFromHash);
      openFromHash();
    })();
    // learn-more modal for facet cards (sub-pages)
    (function () {
      var cards = document.querySelectorAll('.srh-card[data-modal]');
      if (!cards.length) return;
      var modal = document.createElement('div');
      modal.className = 'srh-modal';
      modal.innerHTML = '<div class="srh-modal__backdrop" data-close><canvas class="srh-modal__smoke" data-srx-shader="smoke-veil" aria-hidden="true"></canvas></div>'
        + '<div class="srh-modal__dialog" role="dialog" aria-modal="true">'
        + '<button class="srh-modal__close" data-close aria-label="Close">&times;</button>'
        + '<div class="srh-modal__ic" data-ic></div>'
        + '<h3 class="srh-modal__title" data-title></h3>'
        + '<p class="srh-modal__lead" data-lead></p>'
        + '<div class="srh-modal__body" data-body></div>'
        + '<div class="srh-modal__cta"><a class="srh-btn srh-btn--primary" data-more-link href="/quote-sunriver-consulting">Get a quick estimate &rarr;</a><a class="srh-btn srh-btn--ghost" href="/contact">Ask a question</a></div>'
        + '</div>';
      document.body.appendChild(modal);
      var icEl = modal.querySelector('[data-ic]'), tEl = modal.querySelector('[data-title]'), lEl = modal.querySelector('[data-lead]'), bEl = modal.querySelector('[data-body]');
      function openCard(card) {
        var svg = card.querySelector('.srh-card__logo svg');
        icEl.innerHTML = svg ? svg.outerHTML : '';
        var t = card.querySelector('.srh-card__title'), d = card.querySelector('.srh-card__desc'), m = card.querySelector('.srh-card__more');
        tEl.textContent = t ? t.textContent : '';
        lEl.textContent = d ? d.textContent : '';
        bEl.innerHTML = m ? m.innerHTML : (d ? d.textContent : '');
        var ml = modal.querySelector('[data-more-link]'), href = card.getAttribute('data-href');
        if (ml) { if (href) { ml.setAttribute('href', href); ml.innerHTML = 'Learn more &rarr;'; } else { ml.setAttribute('href', '/quote-sunriver-consulting'); ml.innerHTML = 'Get a quick estimate &rarr;'; } }
        modal.classList.add('is-open'); document.body.classList.add('srh-modal-open');
      }
      function closeModal() { modal.classList.remove('is-open'); document.body.classList.remove('srh-modal-open'); }
      [].forEach.call(cards, function (c) { c.addEventListener('click', function (e) { e.preventDefault(); openCard(c); }); });
      modal.addEventListener('click', function (e) { if (e.target.hasAttribute && e.target.hasAttribute('data-close')) closeModal(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    })();

    var canvases = [].slice.call(document.querySelectorAll('canvas[data-srx-shader]:not([data-srx-init])'));
    if (!canvases.length) return;
    if (reduce) { canvases.forEach(function (c) { c.setAttribute('data-srx-init', '1'); c.style.display = 'none'; }); return; }

    var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
    var COMMON =
      'precision highp float;uniform float u_time;uniform vec2 u_res;uniform vec2 u_mouse;uniform float u_warm;uniform float u_edge;uniform float u_doc0;uniform float u_page;' +
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
      'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);' +
      'return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}' +
      'float fbm(vec2 p){float v=0.0,a=0.5;mat2 R=mat2(0.8,-0.6,0.6,0.8);' +
      'for(int i=0;i<4;i++){v+=a*noise(p);p=R*p*2.05+3.1;a*=0.5;}return v;}' +
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
    // Transparent smoke VEIL — dark teal-ink wisps that drift OVER a bright
    // background (e.g. the green->gold home gradient). Outputs straight alpha
    // (context is premultipliedAlpha:false) so the page shows through.
    // The smoke IS the background: wisps carry the color journey down the page
    // (neon green -> teal -> river blue -> ink) based on document position, so
    // the transition ebbs and flows organically instead of being a flat gradient.
    var SMOKE_VEIL = COMMON +
      'void main(){vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;float t=u_time*0.125;' +
      'vec2 q=p*1.25;q.y+=t*0.85;q+=0.72*vec2(fbm(q+t*1.3),fbm(q*1.2-t*1.05+5.0));q=warp(q,p);' +
      'float m1=fbm(q*1.25+vec2(t*0.4,0.0));float m2=fbm(q*2.4+vec2(t*0.7,t*1.8));' +
      'float dens=smoothstep(0.16,0.92,m1*0.62+m2*0.55);' +
      'float docY=clamp((u_doc0+(u_res.y-gl_FragCoord.y))/max(u_page,1.0),0.0,1.0);' +
      'float dx=gl_FragCoord.x/max(u_res.x,1.0);float diag=clamp(docY*0.62+dx*0.38,0.0,1.0);' +
      'vec3 gN=vec3(0.16,0.93,0.03);vec3 gD=vec3(0.07,0.56,0.03);' +
      'vec3 tN=vec3(0.06,0.62,0.06);vec3 tD=vec3(0.03,0.30,0.05);' +
      'vec3 bN=vec3(0.04,0.40,0.08);vec3 bD=vec3(0.02,0.18,0.05);' +
      'vec3 kN=vec3(0.02,0.14,0.05);vec3 kD=vec3(0.004,0.045,0.02);' +
      'float s1=smoothstep(0.24,0.52,diag);float s2=smoothstep(0.52,0.78,diag);float s3=smoothstep(0.78,1.0,diag);' +
      'vec3 wisp=mix(mix(mix(gN,tN,s1),bN,s2),kN,s3);' +
      'vec3 base=mix(mix(mix(gD,tD,s1),bD,s2),kD,s3);' +
      'vec3 cool=mix(base,wisp,dens);' +
      'vec3 emb=mix(vec3(0.16,0.05,0.02),vec3(1.0,0.45,0.10),dens);' +
      'float w=clamp(u_warm*1.15,0.0,1.0);' +
      'vec3 col=mix(cool,emb,w);' +
      'col+=(hash(gl_FragCoord.xy+u_time)-0.5)*0.02;' +
      'float a=mix(0.55,0.97,dens);' +
      // edge dissolve only for in-band canvases (u_edge=1); page-wide smoke runs uncut
      'float vy=gl_FragCoord.y/u_res.y;a*=mix(1.0,smoothstep(0.0,0.16,vy)*smoothstep(1.0,0.84,vy),u_edge);' +
      'gl_FragColor=vec4(col,a);}';
    // Birch Veil — the user's pale airy wallpaper (paper/taupe/sage mist, drifting
    // motes, mouse parts the fog). Light palette so dark text reads on top.
    // Opaque; used as the background of "money" cards (estimates/quotes).
    var BIRCH_VEIL = COMMON +
      'void main(){vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/u_res.y;vec2 m=u_mouse;float t=u_time*0.05;' +
      'vec2 q=p*1.0+vec2(t*0.7,-t*0.2);q+=0.3*vec2(fbm(q+t),fbm(q-t+6.0));' +
      'float mist=fbm(q*1.5);' +
      'vec3 paper=vec3(0.90,0.88,0.82);vec3 taupe=vec3(0.74,0.69,0.60);' +
      'vec3 sage=vec3(0.66,0.68,0.55);vec3 fgold=vec3(0.84,0.72,0.48);' +
      'vec3 col=mix(paper,taupe,smoothstep(0.2,0.8,mist));' +
      'col=mix(col,sage,smoothstep(0.5,0.9,fbm(q*2.2-t))*0.4);' +
      'col=mix(col,fgold,smoothstep(0.6,1.0,mist)*0.35);' +
      'float md=length(p-m);col=mix(col,paper*1.04,exp(-md*2.5)*0.18);' +
      'vec2 dq=p*7.0+vec2(t*2.0,sin(t*3.0));vec2 di=floor(dq);vec2 df=fract(dq)-0.5;' +
      'float h2=hash(di);' +
      'float mote=step(0.92,h2)*smoothstep(0.18,0.0,length(df))*(0.4+0.6*sin(u_time*2.0+h2*30.0));' +
      'col+=vec3(1.0,0.97,0.9)*mote*0.5;' +
      'col=mix(col,paper,smoothstep(0.5,1.2,length(p))*0.4);' +
      'col+=(hash(gl_FragCoord.xy+u_time)-0.5)*0.010;' +
      'gl_FragColor=vec4(col,1.0);}';
    var FRAG = { ember: EMBER, maple: MAPLE, 'ember-neon': EMBER_NEON, 'maple-neon': MAPLE_NEON, 'ember-warm': EMBER_WARM, 'smoke-veil': SMOKE_VEIL, 'birch-veil': BIRCH_VEIL };

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
      var uT = gl.getUniformLocation(prog, 'u_time'), uR = gl.getUniformLocation(prog, 'u_res'), uM = gl.getUniformLocation(prog, 'u_mouse'), uW = gl.getUniformLocation(prog, 'u_warm');
      var start = performance.now(), visible = true, mAim = [0, 0], mSm = [0, 0], warmS = 0;
      // ember-on-scroll is a deep-page (.srd) effect only; everywhere else the smoke stays cool
      var warmOn = !!(canvas.closest && canvas.closest('.srd'));
      // full-page canvases run uncut; in-band canvases dissolve at their edges
      var edgeOn = (canvas.classList.contains('srh__smoke') || (canvas.closest && canvas.closest('.srd'))) ? 0 : 1;
      var uE = gl.getUniformLocation(prog, 'u_edge');
      var uD0 = gl.getUniformLocation(prog, 'u_doc0'), uPg = gl.getUniformLocation(prog, 'u_page');
      window.addEventListener('mousemove', function (e) {
        var r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return;
        mAim[0] = (e.clientX - r.left - r.width / 2) / r.height;
        mAim[1] = 0.5 - (e.clientY - r.top) / r.height;
      }, { passive: true });
      // The smoke is soft, so we render it BELOW native resolution and throttle
      // the frame rate. This is the difference between "buttery" and "brutal" on
      // weak integrated GPUs (Surface Pro etc.). If the device still can't keep
      // up, drop resolution and fps once more, automatically.
      var resScale = 0.85, FRAME_MS = 1000 / 30, lastDraw = -100000, samples = 0, slow = 0, downgraded = false;
      function sizeCanvas() {
        var dpr = Math.min(window.devicePixelRatio || 1, resScale);
        var w = Math.max(1, Math.floor(canvas.clientWidth * dpr)), h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      }
      window.addEventListener('resize', sizeCanvas);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; }); }).observe(canvas);
      function loop(now) {
        requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        if (now === undefined) now = performance.now();
        var dt = now - lastDraw;
        if (dt < FRAME_MS) return;
        if (!downgraded && lastDraw > 0) {
          samples++;
          if (dt > FRAME_MS * 2.2) slow++;
          if (samples >= 45 && slow > 18) { downgraded = true; resScale = 0.55; FRAME_MS = 1000 / 20; sizeCanvas(); }
        }
        lastDraw = now;
        sizeCanvas();
        mSm[0] += (mAim[0] - mSm[0]) * 0.07; mSm[1] += (mAim[1] - mSm[1]) * 0.07;
        var wt = warmOn ? Math.min(1, (window.scrollY || window.pageYOffset || 0) / 1800) : 0;
        warmS += (wt - warmS) * 0.06;
        gl.uniform1f(uT, (performance.now() - start) / 1000);
        gl.uniform2f(uR, canvas.width, canvas.height);
        if (uM) gl.uniform2f(uM, mSm[0], mSm[1]);
        if (uW) gl.uniform1f(uW, warmS);
        if (uE) gl.uniform1f(uE, edgeOn);
        if (uD0 && uPg) {
          var k = canvas.height / Math.max(1, canvas.clientHeight);
          var sy = window.scrollY || window.pageYOffset || 0;
          gl.uniform1f(uD0, (canvas.getBoundingClientRect().top + sy) * k);
          gl.uniform1f(uPg, Math.max(document.documentElement.scrollHeight, 1) * k);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      requestAnimationFrame(loop);
    }

    canvases.forEach(function (c) {
      c.setAttribute('data-srx-init', '1');
      // On .srh pages the per-band canvases are display:none (one page-wide smoke
      // runs instead). Don't create a WebGL context for a hidden canvas.
      if (window.getComputedStyle(c).display === 'none') return;
      run(c, FRAG[c.getAttribute('data-srx-shader')] || EMBER);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
