/* ─────────────────────────────────────────
   AURORA BACKGROUND — duplicated from index.html
───────────────────────────────────────── */
(function() {
  const c = document.getElementById('aurora');
  const cx = c.getContext('2d');
  let W, H;

  const BLOBS = [
    { x:0.25, y:0.35, r:0.55, color:'#7c3aed', sp:0.22, ph:0.0 },
    { x:0.72, y:0.28, r:0.45, color:'#06b6d4', sp:0.18, ph:1.1 },
    { x:0.55, y:0.72, r:0.50, color:'#a855f7', sp:0.26, ph:2.2 },
    { x:0.15, y:0.65, r:0.38, color:'#0ea5e9', sp:0.20, ph:3.4 },
    { x:0.82, y:0.60, r:0.42, color:'#6366f1', sp:0.16, ph:4.6 },
  ];

  function resize() {
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
  }

  function hex2rgb(h) {
    const v = parseInt(h.slice(1), 16);
    return [(v>>16)&255,(v>>8)&255,v&255];
  }

  function draw(t) {
    cx.clearRect(0, 0, W, H);
    cx.globalCompositeOperation = 'screen';

    for (const b of BLOBS) {
      const bx = (b.x + Math.sin(t * b.sp * 0.001 + b.ph) * 0.18) * W;
      const by = (b.y + Math.cos(t * b.sp * 0.0008 + b.ph) * 0.12) * H;
      const br = b.r * Math.max(W, H) * 0.65;
      const [r,g,bl] = hex2rgb(b.color);
      const g2 = cx.createRadialGradient(bx, by, 0, bx, by, br);
      g2.addColorStop(0, `rgba(${r},${g},${bl},0.22)`);
      g2.addColorStop(0.4, `rgba(${r},${g},${bl},0.08)`);
      g2.addColorStop(1, `rgba(${r},${g},${bl},0)`);
      cx.fillStyle = g2;
      cx.fillRect(0, 0, W, H);
    }

    cx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ─────────────────────────────────────────
   MOUSE GLOW — duplicated from index.html
───────────────────────────────────────── */
(function() {
  const g = document.getElementById('glow');
  let tx = window.innerWidth/2, ty = window.innerHeight/2;
  let cx = tx, cy = ty;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function step() {
    cx += (tx-cx)*0.08; cy += (ty-cy)*0.08;
    g.style.left = cx+'px'; g.style.top = cy+'px';
    requestAnimationFrame(step);
  }
  step();
})();

/* ─────────────────────────────────────────
   SCROLL REVEAL — duplicated from index.html
───────────────────────────────────────── */
(function() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.05 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
