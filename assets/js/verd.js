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

// Verð: upphæðir, gjaldmiðill (EUR / ISK) og mánaðarlega / árlega.
// Allar upphæðir eru hér og hvergi annars staðar. Excl. VAT. Valid from 1 December 2026.
(() => {
  const VERD = {
    solo:     { m: { eur: 49,  isk: 12900 }, y: { eur: 490,  isk: 129000 } },
    team:     { m: { eur: 129, isk: 29900 }, y: { eur: 1290, isk: 299000 }, pp: { eur: 26, isk: 6000 } },
    business: { m: { eur: 299, isk: 69900 }, y: { eur: 2990, isk: 699000 }, pp: { eur: 15, isk: 3500 } },
    quick:    { eur: 290,  isk: 49900 },
    standard: { eur: 790,  isk: 129900 },
    full:     { eur: 1790, isk: 299900 },
    training: { eur: 190,  isk: 29900 },
    hourly:   { eur: 95,   isk: 18900 }
  };
  const GEYMSLA = 'x-cur';
  const GJALD = ['eur', 'isk'];

  const fmt = (n, c) => c === 'isk'
    ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr'
    : '€' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

  function byrjun() {
    try {
      const q = (new URLSearchParams(location.search).get('cur') || '').toLowerCase();
      if (GJALD.includes(q)) return q;
    } catch (e) {}
    try {
      const s = localStorage.getItem(GEYMSLA);
      if (GJALD.includes(s)) return s;
    } catch (e) {}
    const l = String(navigator.language || '').toLowerCase();
    return l.startsWith('is') ? 'isk' : 'eur';
  }

  let cur = byrjun();
  let per = 'm';

  // "team" fylgir valinu (mánuður / ár), "team.y" er alltaf árið, "quick" er eitt gjald
  function upphaed(lykill) {
    let v = VERD;
    lykill.split('.').forEach(k => { v = v && v[k]; });
    if (v && v.m && v.y) v = v[per];
    return v && typeof v[cur] === 'number' ? v[cur] : null;
  }

  function syna() {
    document.querySelectorAll('[data-vd-amt]').forEach(el => {
      const n = upphaed(el.dataset.vdAmt);
      if (n !== null) el.textContent = fmt(n, cur);
    });
    document.querySelectorAll('[data-vd-unit]').forEach(el => {
      el.textContent = per === 'y' ? 'per year excl. VAT' : 'per month excl. VAT';
    });
    document.querySelectorAll('[data-vd-alt]').forEach(el => {
      const p = VERD[el.dataset.vdAlt];
      if (!p) return;
      el.textContent = per === 'y'
        ? 'Pay for 10 months, get 12. Monthly: ' + fmt(p.m[cur], cur) + '.'
        : 'or ' + fmt(p.y[cur], cur) + ' a year, 2 months free';
    });
    document.querySelectorAll('[data-vd-pp]').forEach(el => {
      const p = VERD[el.dataset.vdPp];
      if (p && p.pp) el.textContent = 'About ' + fmt(p.pp[cur], cur) + ' a month per person when the team is full.';
    });
    document.querySelectorAll('[data-vd-cur]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vdCur === cur)));
    document.querySelectorAll('[data-vd-period]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vdPeriod === per)));
    document.documentElement.setAttribute('data-vd-cur', cur);
  }

  document.querySelectorAll('[data-vd-cur]').forEach(b => b.addEventListener('click', () => {
    cur = b.dataset.vdCur;
    try { localStorage.setItem(GEYMSLA, cur); } catch (e) {}
    syna();
  }));
  document.querySelectorAll('[data-vd-period]').forEach(b => b.addEventListener('click', () => {
    per = b.dataset.vdPeriod;
    syna();
  }));

  syna();
})();
