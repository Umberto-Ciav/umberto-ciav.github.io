// Ethereal blue‑wave animation
(function() {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let width, height, t = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const waveCount = 3;
    for (let i = 0; i < waveCount; i++) {
      const alpha = 0.1 + i * 0.05;
      ctx.fillStyle = `rgba(30,136,229,${alpha})`; // ethereal blue
      ctx.beginPath();
      const offset = t * (0.5 + i * 0.2);
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 10) {
        const y = height * 0.5 
                + Math.sin((x * 0.01) + offset) * (50 + i * 20);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    }

    t += 0.02;
    requestAnimationFrame(draw);
  }

  draw();
})();
