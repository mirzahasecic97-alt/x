// Verð: "Hve mörg eruð þið?" sýnir hvaða áskrift passar. Aðeins fyrir verd.html, hlaðið á eftir site.js.
(() => {
  const box = document.querySelector('[data-vd-size]');
  if (!box) return;
  const range = box.querySelector('[data-vd-range]');
  const out = box.querySelector('[data-vd-n]');
  const dots = [...box.querySelectorAll('[data-vd-dots] i')];
  const segs = [...box.querySelectorAll('[data-vd-seg]')];
  const plans = [...box.querySelectorAll('[data-vd-plan]')];
  const tiers = [...document.querySelectorAll('[data-vd-tier]')];

  const askrift = n => (n <= 1 ? 'einyrki' : n <= 5 ? 'teymi' : 'fyrirtaeki');

  function syna() {
    const n = Math.min(20, Math.max(1, parseInt(range.value, 10) || 1));
    const a = askrift(n);
    out.textContent = n;
    range.style.setProperty('--vd-fill', ((n - 1) / 19) * 100 + '%');
    dots.forEach((d, i) => d.classList.toggle('on', i < n));
    segs.forEach(s => s.classList.toggle('on', s.dataset.vdSeg === a));
    plans.forEach(p => { p.hidden = p.dataset.vdPlan !== a; });
    tiers.forEach(t => t.classList.toggle('vd-pick', t.dataset.vdTier === a));
  }

  range.addEventListener('input', syna);
  syna();
})();
