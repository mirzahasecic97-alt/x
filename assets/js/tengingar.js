// X: tengingar.html
// "Hvað notar þú í dag?": merktu við kerfi og sjáðu hvað X gerir með því.
// Hlaðið á eftir site.js (báðar með defer). Notar window.X.STADA og window.X.malSpan.
// HTML mynstrið (úr gömlu forsíðunni):
//   <div class="picker" data-velja>
//     ... <button type="button" class="tool" data-st="ok|prof|live|soon" aria-pressed="false">
//           <span class="tool__name">DK</span>
//           <span class="tool__does" hidden><span lang="is">...</span><span lang="en">...</span></span>
//         </button> ...
//     <ul class="picks" data-velja-ut aria-live="polite"></ul>
//     <p class="picker__empty" data-velja-tomt hidden>...</p>
//   </div>
(() => {
  const X = window.X || {};
  const STADA = X.STADA || { soon: { is: 'Væntanlegt', en: 'Coming soon', cls: '' } };
  const malSpan = X.malSpan || ((m, t) => { const s = document.createElement('span'); s.lang = m; s.textContent = t; return s; });

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
        const merki = document.createElement('span'); merki.className = ('tag ' + st.cls).trim();
        merki.append(malSpan('is', st.is), malSpan('en', st.en));
        haus.append(nafn, merki);
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
