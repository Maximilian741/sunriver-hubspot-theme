(function () {
  function init(root) {
    if (root.getAttribute('data-sr-init')) return;
    root.setAttribute('data-sr-init', '1');

    var input = root.querySelector('.sr-pwstrength__input');
    var toggle = root.querySelector('.sr-pwstrength__toggle');
    var bar = root.querySelector('.sr-pwstrength__bar');
    var label = root.querySelector('.sr-pwstrength__label');
    var rules = Array.prototype.slice.call(root.querySelectorAll('.sr-pwstrength__rule'));
    if (!input || !bar) return;

    var LEVELS = ['Start typing', 'Weak', 'Fair', 'Good', 'Strong'];

    function evaluate(v) {
      var checks = {
        len: v.length >= 12,
        upper: /[A-Z]/.test(v),
        lower: /[a-z]/.test(v),
        num: /[0-9]/.test(v),
        sym: /[^A-Za-z0-9]/.test(v)
      };
      var met = 0;
      for (var k in checks) if (checks[k]) met++;
      var score = 0;
      if (v.length) {
        score = met;
        if (v.length >= 16 && met >= 4) score = 5;
        if (v.length < 8) score = Math.min(score, 1);
      }
      // map 0..5 -> 0..4 filled segments / level index
      var level = v.length === 0 ? 0 : Math.max(1, Math.min(4, Math.round(score * 4 / 5)));
      return { checks: checks, level: level };
    }

    function update() {
      var v = input.value;
      var r = evaluate(v);
      bar.setAttribute('data-level', r.level);
      if (label) {
        label.textContent = LEVELS[r.level];
        label.setAttribute('data-level', r.level);
      }
      rules.forEach(function (li) {
        var on = !!r.checks[li.getAttribute('data-rule')];
        li.classList.toggle('is-met', on);
      });
    }

    input.addEventListener('input', update);
    if (toggle) toggle.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.textContent = show ? 'Hide' : 'Show';
      toggle.setAttribute('aria-pressed', show ? 'true' : 'false');
      input.focus();
    });
    update();
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll('.sr-pwstrength'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
