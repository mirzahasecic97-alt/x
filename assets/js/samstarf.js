// X: samstarf.html
// Lýsingin: smelltu á hluta (vinstri) og dæmið (hægri) skiptir um.
// Án JS sjást öll dæmin hvert undir öðru.
// Hlaðið á eftir site.js (báðar með defer).
(() => {
  document.querySelectorAll('[data-sm-spec]').forEach(spec => {
    const takkar = spec.querySelectorAll('[data-sm-tab]');
    const hlutar = spec.querySelectorAll('[data-sm-pane]');
    const skra = spec.querySelector('[data-sm-file]');
    if (!takkar.length || !hlutar.length) return;
    spec.classList.add('sm-js');

    const velja = (lykill, fokus) => {
      takkar.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.smTab === lykill)));
      hlutar.forEach(h => {
        const er = h.dataset.smPane === lykill;
        h.classList.toggle('on', er);
        if (er && skra) skra.textContent = h.dataset.smName || '';
      });
      if (fokus) {
        const t = spec.querySelector('[data-sm-tab="' + lykill + '"]');
        if (t) t.focus();
      }
    };

    takkar.forEach((t, i) => {
      t.addEventListener('click', () => velja(t.dataset.smTab));
      // örvar upp og niður færa á milli hluta
      t.addEventListener('keydown', e => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const n = (i + (e.key === 'ArrowDown' ? 1 : takkar.length - 1)) % takkar.length;
        velja(takkar[n].dataset.smTab, true);
      });
    });

    const fyrst = spec.querySelector('[data-sm-tab][aria-pressed="true"]') || takkar[0];
    velja(fyrst.dataset.smTab);
  });
})();
