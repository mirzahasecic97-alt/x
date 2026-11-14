// X: leiðbeiningar. Sía safnið eftir efni. Hlaðið á eftir site.js.
(() => {
  const sia = document.querySelector('.lg-filter');
  const spjold = Array.from(document.querySelectorAll('.lg-card[data-efni]'));
  const fjoldi = document.querySelector('.lg-count');
  if (!sia || !spjold.length) return;

  const hnappar = Array.from(sia.querySelectorAll('[data-sia]'));
  let val = 'allt';
  // "Allt" sýnir fyrst eina síðu af spjöldum, svo síðan verði ekki of löng
  const FYRST = 9;
  let opid = spjold.length <= FYRST;
  const meira = document.createElement('div');
  meira.className = 'lg-more';
  const meiraBtn = document.createElement('button');
  meiraBtn.type = 'button';
  meiraBtn.className = 'btn btn--ghost btn--sm';
  meiraBtn.textContent = 'Show all guides';
  meira.appendChild(meiraBtn);
  const grind = spjold[0].parentElement;
  grind.after(meira);
  meiraBtn.addEventListener('click', () => {
    opid = true; syna();
    if (spjold[FYRST]) { spjold[FYRST].setAttribute('tabindex', '-1'); spjold[FYRST].focus({ preventScroll: true }); }
  });

  // fjöldi í hverjum hnappi
  hnappar.forEach(b => {
    const n = b.dataset.sia === 'allt' ? spjold.length : spjold.filter(s => s.dataset.efni === b.dataset.sia).length;
    if (!n) { b.remove(); return; }
    const t = document.createElement('span');
    t.className = 'lg-n'; t.textContent = n; t.setAttribute('aria-hidden', 'true');
    b.appendChild(t);
  });

  // "1 guide", annars "guides"
  const ordEn = n => n === 1 ? 'guide' : 'guides';

  function syna() {
    let synileg = 0, alls = 0;
    spjold.forEach(s => {
      const passar = val === 'allt' || s.dataset.efni === val;
      if (passar) alls++;
      const er = passar && (val !== 'allt' || opid || alls <= FYRST);
      s.hidden = !er;
      if (er) { synileg++; s.classList.add('in'); }
    });
    meira.hidden = synileg === alls;
    hnappar.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sia === val)));
    if (fjoldi) {
      fjoldi.textContent = synileg === alls ? synileg + ' ' + ordEn(synileg) : synileg + ' of ' + alls + ' ' + ordEn(alls);
    }
  }

  sia.addEventListener('click', e => {
    const b = e.target.closest('[data-sia]');
    if (!b) return;
    val = b.dataset.sia;
    syna();
  });

  // ?efni=claude opnar safnið á réttu efni
  const p = new URLSearchParams(location.search).get('efni');
  if (p && hnappar.some(b => b.dataset.sia === p && b.isConnected)) val = p;

  sia.hidden = false;
  syna();
})();
