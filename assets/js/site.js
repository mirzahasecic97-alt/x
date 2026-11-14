// X: sameiginleg skrifta fyrir allar síður (x.is)
// Hér er aðeins það sem allar síður nota. Kóði fyrir eina síðu fer í assets/js/<síða>.js
// og er hlaðinn á eftir þessari skrá (báðar með defer).
// Allt er innan fallsins svo nöfn rekist ekki á skriftur síðna. Þær nota window.X.
(() => {

// Stillingar sem þarf að fylla út áður en vefurinn fer í loftið
const STILLINGAR = {
  // TODO: setja rétta slóð á prufukerfið þegar það er komið á x.is
  demo: 'https://app.x.is/demo/',
  // TODO: breyta í rétt x.is netfang. Hvert "Bóka kynningu" fer
  netfang: 'hallo@x.is',
  // TODO: breyta í rétt x.is netfang. Hvert "Ræðum samstarf" fer (fyrirtæki sem gera kerfi og vilja tengjast)
  samstarf: 'samstarf@x.is',
};

// Staða tenginga og eininga. Sama orðalag alls staðar á vefnum.
const STADA = {
  ok: { is: 'Í fyrstu útgáfu', en: 'In the first release', cls: 'tag--ok' },
  prof: { is: 'Í prófun', en: 'In testing', cls: 'tag--warn' },
  live: { is: 'Tilbúið', en: 'Live', cls: 'tag--ok' },
  soon: { is: 'Væntanlegt', en: 'Coming soon', cls: '' },
};

const GEYMSLA = 'x-mal';
let geymslaVirkar = true;

function lesaMal() {
  const p = new URLSearchParams(location.search).get('lang');
  if (p === 'is' || p === 'en') { geyma(p); return p; }
  try { const g = localStorage.getItem(GEYMSLA); if (g === 'is' || g === 'en') return g; } catch (e) { geymslaVirkar = false; }
  return (navigator.language || '').toLowerCase().startsWith('is') ? 'is' : 'en';
}
function geyma(m) { try { localStorage.setItem(GEYMSLA, m); } catch (e) { geymslaVirkar = false; } }

function malSpan(m, t) { const s = document.createElement('span'); s.lang = m; s.textContent = t; return s; }

function setjaMal(m) {
  const html = document.documentElement;
  html.lang = m;
  // titill og lýsing hverrar síðu: data-titill-is/en og data-lysing-is/en á <html>
  const titill = html.getAttribute('data-titill-' + m);
  if (titill) document.title = titill;
  const lysing = html.getAttribute('data-lysing-' + m);
  const d = document.querySelector('meta[name="description"]');
  if (d && lysing) d.content = lysing;

  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mal === m)));
  document.querySelectorAll('[data-ph-' + m + ']').forEach(el => { el.placeholder = el.getAttribute('data-ph-' + m); });
  document.querySelectorAll('[data-al-' + m + ']').forEach(el => { el.setAttribute('aria-label', el.getAttribute('data-al-' + m)); });

  // prufukerfið
  document.querySelectorAll('[data-demo]').forEach(a => {
    let slod = STILLINGAR.demo;
    try { const u = new URL(STILLINGAR.demo); if (m === 'en') u.searchParams.set('lang', 'en'); slod = u.href; } catch (e) {}
    a.href = slod; a.target = '_blank'; a.rel = 'noopener';
  });
  // "Bóka kynningu": data-kynning="Teymi" bætir áskriftinni við efnislínuna
  const efni = m === 'is' ? 'Kynning á X' : 'X demo';
  // data-kynning-en gefur enska heitið í efnislínuna þegar enska er valin
  document.querySelectorAll('[data-kynning]').forEach(a => {
    const heiti = (m === 'en' && a.dataset.kynningEn) || a.dataset.kynning;
    a.href = 'mailto:' + STILLINGAR.netfang + '?subject=' + encodeURIComponent(efni + (heiti ? ' (' + heiti + ')' : ''));
  });
  // fyrirtæki sem gera kerfi og vilja tengjast
  const efniS = m === 'is' ? 'Samstarf um tengingu við X' : 'Building a connection to X';
  document.querySelectorAll('[data-samstarf]').forEach(a => {
    a.href = 'mailto:' + STILLINGAR.samstarf + '?subject=' + encodeURIComponent(efniS);
  });

  // ef vafrinn geymir ekki málið fylgir ?lang með innri tenglum
  if (!geymslaVirkar) {
    document.querySelectorAll('a[href$=".html"], a[href*=".html?"], a[href*=".html#"]').forEach(a => {
      const h = a.getAttribute('href');
      if (/^[a-z]+:/i.test(h)) return;
      const [slod, hash] = h.split('#');
      const grunnur = slod.replace(/[?&]lang=(is|en)/, '').replace(/\?$/, '');
      a.setAttribute('href', grunnur + (grunnur.includes('?') ? '&' : '?') + 'lang=' + m + (hash ? '#' + hash : ''));
    });
  }

  document.dispatchEvent(new CustomEvent('x:mal', { detail: m }));
}

setjaMal(lesaMal());
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => { geyma(b.dataset.mal); setjaMal(b.dataset.mal); }));

// opið fyrir skriftur einstakra síðna
window.X = { STILLINGAR, STADA, malSpan, mal: () => document.documentElement.lang };

// ---------- haus ----------
const nav = document.querySelector('.nav');
const valmynd = document.querySelector('.nav__menu');
if (nav) {
  const skrun = () => nav.classList.toggle('is-scrolled', scrollY > 12);
  addEventListener('scroll', skrun, { passive: true }); skrun();
  const loka = () => { nav.classList.remove('is-open'); if (valmynd) valmynd.setAttribute('aria-expanded', 'false'); };
  if (valmynd) valmynd.addEventListener('click', () => {
    const opin = nav.classList.toggle('is-open');
    valmynd.setAttribute('aria-expanded', String(opin));
  });
  nav.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', loka));
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { loka(); if (valmynd) valmynd.focus(); } });
  // virk síða: ef aria-current vantar í HTML er það sett hér eftir slóðinni
  if (!nav.querySelector('[aria-current="page"]')) {
    const skra = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav__links a, .foot__links a').forEach(a => {
      const h = (a.getAttribute('href') || '').split(/[?#]/)[0].toLowerCase();
      if (h && h === skra && skra !== 'index.html') a.setAttribute('aria-current', 'page');
    });
  }
}

// ---------- birtist við skrun ----------
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
} else document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
// varnet: allt sem er komið inn í eða upp fyrir gluggann birtist, líka við hratt skrun
const birtaFramhja = () => {
  const h = innerHeight;
  document.querySelectorAll('.rv:not(.in)').forEach(el => { if (el.getBoundingClientRect().top < h) el.classList.add('in'); });
};
let rvBidur = false;
addEventListener('scroll', () => { if (rvBidur) return; rvBidur = true; requestAnimationFrame(() => { rvBidur = false; birtaFramhja(); }); }, { passive: true });
addEventListener('load', birtaFramhja);

document.querySelectorAll('[data-ar]').forEach(el => { el.textContent = new Date().getFullYear(); });

// ---------- málmur og hetja ----------
// hreyfimerkið stoppar ef notandinn vill minni hreyfingu
const kyrrt = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (kyrrt) document.querySelectorAll('.hero__mark').forEach(m => { if (m.pauseAnimations) m.pauseAnimations(); });
// ljós fylgir músinni og skjámyndin hallar (aðeins ef síðan er með .hero)
const hetja = document.querySelector('.hero');
if (hetja && !kyrrt && matchMedia('(pointer: fine)').matches) {
  const appSkjar = hetja.querySelector('.app');
  let bidur = false, x = .5, y = .25;
  hetja.addEventListener('pointermove', e => {
    const r = hetja.getBoundingClientRect(); x = (e.clientX - r.left) / r.width; y = (e.clientY - r.top) / r.height;
    if (bidur) return; bidur = true;
    requestAnimationFrame(() => {
      bidur = false;
      hetja.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); hetja.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      if (appSkjar) { appSkjar.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg'); appSkjar.style.setProperty('--rx', (-(y - .6) * 4).toFixed(2) + 'deg'); }
    });
  });
  hetja.addEventListener('pointerleave', () => { if (appSkjar) { appSkjar.style.setProperty('--ry', '0deg'); appSkjar.style.setProperty('--rx', '0deg'); } });
}

})();
