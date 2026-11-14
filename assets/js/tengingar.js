// X: tengingar.html
// "Hvað notar þú í dag?": merktu við kerfi og sjáðu hvað X gerir með því.
// Hlaðið á eftir site.js (báðar með defer). Notar window.X.STADA (aðeins enska merkið, engin lang).
// HTML mynstrið (úr gömlu forsíðunni):
//   <div class="picker" data-velja>
//     ... <button type="button" class="tool" data-st="ok|prof|live|soon" aria-pressed="false">
//           <span class="tool__name">DK</span>
//           <span class="tool__does" hidden><span>...</span></span>
//         </button> ...
//     <ul class="picks" data-velja-ut aria-live="polite"></ul>
//     <p class="picker__empty" data-velja-tomt hidden>...</p>
//   </div>
(() => {
  const X = window.X || {};
  const STADA = X.STADA || { soon: { en: 'Coming soon', cls: '' } };

  document.querySelectorAll('[data-velja]').forEach(velja => {
    const ut = velja.querySelector('[data-velja-ut]');
    const tomt = velja.querySelector('[data-velja-tomt]');
    if (!ut) return;
    const teikna = () => {
      ut.textContent = '';
      const valin = velja.querySelectorAll('.tool[aria-pressed="true"]');
      if (tomt) tomt.hidden = valin.length > 0;
      valin.forEach(t => {
        const st = STADA[t.dataset.st] || STADA.soon;
        const li = document.createElement('li');
        const haus = document.createElement('div'); haus.className = 'pick__h';
        const nafnFrum = t.querySelector('.tool__name');
        const nafn = nafnFrum ? nafnFrum.cloneNode(true) : document.createElement('span');
        nafn.className = 'pick__name';
        haus.append(nafn);
        // Staðan er sögð einu sinni efst á síðunni: aðeins það sem víkur frá fær merki (Coming soon, In testing)
        if (t.dataset.st !== 'ok') {
          const merki = document.createElement('span'); merki.className = ('tag ' + st.cls).trim();
          const merkiTxt = document.createElement('span'); merkiTxt.textContent = st.en || 'Coming soon';
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
    };
    velja.querySelectorAll('.tool').forEach(t => t.addEventListener('click', () => {
      t.setAttribute('aria-pressed', String(t.getAttribute('aria-pressed') !== 'true'));
      teikna();
    }));
    teikna();
  });
})();
