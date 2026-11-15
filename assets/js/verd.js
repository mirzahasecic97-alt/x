// Verð: upphæðir, gjaldmiðill (EUR / ISK) og mánaðarlega / árlega.
// Allar upphæðir eru hér og hvergi annars staðar. Excl. VAT.
(() => {
  const VERD = {
    solo:     { m: { eur: 49,  isk: 12900 }, y: { eur: 490,  isk: 129000 } },
    team:     { m: { eur: 129, isk: 29900 }, y: { eur: 1290, isk: 299000 } },
    business: { m: { eur: 299, isk: 69900 }, y: { eur: 2990, isk: 699000 } },
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
        : 'or ' + fmt(p.y[cur], cur) + ' a year';
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
