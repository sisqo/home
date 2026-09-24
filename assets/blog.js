/* ─────────────────────────────────────────
   SCROLL REVEAL — duplicated from index.html
───────────────────────────────────────── */
(function() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.05 }
  );
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();
