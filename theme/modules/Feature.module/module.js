(function () {
  // Attach per module instance (safe even if multiple modules on page)
  const roots = document.querySelectorAll('.atmc-feature .atmc-feature-01');
  if (!roots.length) return;

  roots.forEach((el) => {
    // Track pointer position for hover ripple
    const setVars = (evt) => {
      const rect = el.getBoundingClientRect();
      const x = ((evt.clientX - rect.left) / rect.width) * 100;
      const y = ((evt.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };

    el.addEventListener('pointermove', setVars, { passive: true });
    el.addEventListener('pointerenter', setVars, { passive: true });

    // Click burst ripple
    el.addEventListener('pointerdown', (evt) => {
      // Only left click / primary touch
      if (evt.pointerType === 'mouse' && evt.button !== 0) return;

      const rect = el.getBoundingClientRect();
      const maxDim = Math.max(rect.width, rect.height);
      const rippleSize = Math.ceil(maxDim * 2); // big enough to cover corners

      const ripple = document.createElement('span');
      ripple.className = 'atmc-ripple';
      ripple.style.width = `${rippleSize}px`;
      ripple.style.height = `${rippleSize}px`;

      const left = evt.clientX - rect.left;
      const top = evt.clientY - rect.top;
      ripple.style.left = `${left}px`;
      ripple.style.top = `${top}px`;

      el.appendChild(ripple);

      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  });
})();
