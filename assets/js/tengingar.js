// X: tengingar.html (og forsíðan, index.html)
// "Hvað notar þú í dag?": merktu við kerfi.
//  - Á forsíðunni: hvert kerfi hefur lýsingu (.tool__does) og stöðu (data-st). Listinn sýnir hvað X gerir.
//  - Á tengingar.html (aðeins nöfn) og forsíðunni: listinn verður upphaf umsóknar: [data-velja-send] opnar
//    pilot.html?tools=A,B,C með völdum kerfum og því sem er skrifað í [data-velja-annad]. Ekkert er sent héðan.
// Hlaðið á eftir site.js (báðar með defer). Notar window.X.STADA (aðeins enska merkið, engin lang).
// HTML mynstrið:
//   <div class="picker" data-velja>
//     ... <button type="button" class="tool" data-st="soon|prof" aria-pressed="false">
//           <span class="tool__name">DK</span>
//           <span class="tool__does" hidden><span>...</span></span>   (valfrjálst)
//         </button> ...
//     <ul class="picks" data-velja-ut aria-live="polite"></ul>
//     <p class="picker__empty" data-velja-tomt hidden>...</p>
//     <input data-velja-annad> <a data-velja-send href="pilot.html">...</a>   (valfrjálst)
//   </div>
(() => {
  const X = window.X || {};
  const STADA = X.STADA || { soon: { en: 'Coming soon', cls: '' } };
  const nafnA = t => {
    const el = t.querySelector('.tool__name');
    return ((el ? el.textContent : t.textContent) || '').replace(/\s+/g, ' ').trim();
  };

  document.querySelectorAll('[data-velja]').forEach(velja => {
    const ut = velja.querySelector('[data-velja-ut]');
    const tomt = velja.querySelector('[data-velja-tomt]');
    const annad = velja.querySelector('[data-velja-annad]');
    const senda = velja.querySelector('[data-velja-send]');
    if (!ut) return;

    // slóðin á pilot.html: ?tools=DK,Payday,Shopify (hvert nafn kóðað, kommur á milli)
    const uppfaeraSlod = () => {
      if (!senda) return;
      const nofn = [...velja.querySelectorAll('.tool[aria-pressed="true"]')].map(nafnA);
      if (annad) annad.value.split(',').map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean).forEach(n => nofn.push(n.slice(0, 60)));
      const einstok = [...new Set(nofn)].slice(0, 30);
      senda.href = einstok.length ? 'pilot.html?tools=' + einstok.map(encodeURIComponent).join(',') : 'pilot.html';
    };

    const teikna = () => {
      ut.textContent = '';
      const valin = velja.querySelectorAll('.tool[aria-pressed="true"]');
      if (tomt) tomt.hidden = valin.length > 0;
      valin.forEach(t => {
        const li = document.createElement('li');
        const haus = document.createElement('div'); haus.className = 'pick__h';
        const nafn = document.createElement('span');
        nafn.className = 'pick__name';
        nafn.textContent = nafnA(t);
        haus.append(nafn);
        // Staðan er sögð einu sinni efst á síðunni: aðeins það sem víkur frá fær merki (Coming soon, In testing)
        const st = t.dataset.st;
        if (st === 'soon' || st === 'prof') {
          const s = STADA[st] || STADA.soon;
          const merki = document.createElement('span'); merki.className = ('tag ' + (s.cls || '')).trim();
          const merkiTxt = document.createElement('span'); merkiTxt.textContent = s.en || 'Coming soon';
          merki.append(merkiTxt);
          haus.append(merki);
        }
        li.append(haus);
        const lysingFrum = t.querySelector('.tool__does');
        if (lysingFrum) {
          const lysing = lysingFrum.cloneNode(true);
          lysing.hidden = false; lysing.className = 'pick__p';
          li.append(lysing);
        }
        ut.append(li);
      });
      uppfaeraSlod();
    };
    velja.querySelectorAll('.tool').forEach(t => t.addEventListener('click', () => {
      t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true'));
      teikna();
    }));
    if (annad) annad.addEventListener('input', uppfaeraSlod);
    teikna();
  });
})();
