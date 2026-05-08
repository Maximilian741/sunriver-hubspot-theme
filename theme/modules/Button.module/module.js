(function () {
  const btns = document.querySelectorAll('.atmc-btn-module');
  if (!btns.length) return;

  btns.forEach((btn) => {
    // Set ripple origin where user clicks
    btn.addEventListener('pointerdown', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--rx', `${x}%`);
      btn.style.setProperty('--ry', `${y}%`);

      // restart animation reliably
      btn.classList.remove('is-clicked');
      // force reflow
      void btn.offsetWidth;
      btn.classList.add('is-clicked');
    });

    // cleanup class after animation
    btn.addEventListener('animationend', () => {
      btn.classList.remove('is-clicked');
    }, true);
  });
})();
