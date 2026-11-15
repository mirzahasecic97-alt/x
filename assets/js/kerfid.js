// kerfid.html: val á grein í greinapökkunum. Hlaðið á eftir site.js (báðar með defer).
// Sjálfgefið: ?industry= í slóðinni, síðan localStorage "x-grein", annars verktakar.
(() => {
  const rot = document.querySelector('[data-grein]');
  if (!rot) return;
  const flipar = Array.from(rot.querySelectorAll('[role="tab"]'));
  const gildi = flipar.map(f => f.dataset.greinVal);
  const LYKILL = 'x-grein';

  // sömu samheiti og á forsíðunni og pilot.html
  const SAMHEITI = { contractor: 'contractors', trades: 'contractors', renovation: 'contractors', cleaners: 'cleaning', services: 'cleaning', service: 'cleaning', consultant: 'consultants', shop: 'shops', retail: 'shops', wholesaler: 'wholesale', distributor: 'wholesale', distribution: 'wholesale', b2b: 'wholesale' };
  const lesa = () => {
    let q = (new URLSearchParams(location.search).get('industry') || '').toLowerCase();
    q = SAMHEITI[q] || q;
    if (gildi.includes(q)) { try { localStorage.setItem(LYKILL, q); } catch (e) { /* lokuð geymsla */ } return q; }
    try {
      const v = localStorage.getItem(LYKILL);
      if (gildi.includes(v)) return v;
    } catch (e) { /* lokuð geymsla */ }
    return gildi[0];
  };

  const velja = (val, vista, fokus) => {
    flipar.forEach(f => {
      const a = f.dataset.greinVal === val;
      f.setAttribute('aria-selected', a ? 'true' : 'false');
      f.tabIndex = a ? 0 : -1;
      const p = document.getElementById(f.getAttribute('aria-controls'));
      if (p) p.hidden = !a;
      if (a && fokus) f.focus();
    });
    if (vista) { try { localStorage.setItem(LYKILL, val); } catch (e) { /* lokuð geymsla */ } }
  };

  flipar.forEach((f, i) => {
    f.addEventListener('click', () => velja(f.dataset.greinVal, true, false));
    f.addEventListener('keydown', e => {
      let n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % flipar.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + flipar.length) % flipar.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = flipar.length - 1;
      if (n === null) return;
      e.preventDefault();
      velja(flipar[n].dataset.greinVal, true, true);
    });
  });

  rot.classList.add('kf-ind--js');
  velja(lesa(), false, false);
})();
