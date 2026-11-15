// X: sameiginleg skrifta fyrir allar síður (x.is)
// Hér er aðeins það sem allar síður nota. Kóði fyrir eina síðu fer í assets/js/<síða>.js
// og er hlaðinn á eftir þessari skrá (báðar með defer).
// Allt er innan fallsins svo nöfn rekist ekki á skriftur síðna. Þær nota window.X.
(() => {

// Stillingar sem þarf að fylla út áður en vefurinn fer í loftið
const STILLINGAR = {
  // TODO: Formspree URL fyrir prufuhópinn (pilot.html), til dæmis 'https://formspree.io/f/xxxxxxx'.
  // Meðan þetta er tómt er ekkert sent: síðan sýnir þakkirnar og skrifar í console.
  formEndpoint: '',
  // síðan sem allir "Join the pilot" og "Book a 15 min call" hnappar vísa á
  pilot: 'pilot.html',
};

// Staða tenginga og eininga. Sama orðalag alls staðar á vefnum.
const STADA = {
  ok: { is: 'Í fyrstu útgáfu', en: 'Planned for the first release', cls: 'tag--ok' },
  prof: { is: 'Í prófun', en: 'In testing', cls: 'tag--warn' },
  live: { is: 'Tilbúið', en: 'Live', cls: 'tag--ok' },
  soon: { is: 'Væntanlegt', en: 'Coming soon', cls: '' },
};

// Vefurinn er eingöngu á ensku. Titill og lýsing koma úr data-titill-en og data-lysing-en á <html>,
// og aria-label úr data-al-en.
(() => {
  const html = document.documentElement;
  const titill = html.getAttribute('data-titill-en');
  if (titill) document.title = titill;
  const lysing = html.getAttribute('data-lysing-en');
  const d = document.querySelector('meta[name="description"]');
  if (d && lysing) d.content = lysing;
  document.querySelectorAll('[data-al-en]').forEach(el => { el.setAttribute('aria-label', el.getAttribute('data-al-en')); });

  // eldri krókar (data-demo, data-kynning, data-samstarf) vísa nú á pilot.html, engin mailto lengur.
  // Nýr kóði notar venjulega tengla: href="pilot.html", "pilot.html?plan=team" eða "pilot.html?call=1".
  const PLON = { solo: 'solo', team: 'team', business: 'business' };
  document.querySelectorAll('[data-demo]').forEach(a => { a.href = STILLINGAR.pilot; a.removeAttribute('target'); });
  document.querySelectorAll('[data-kynning]').forEach(a => {
    const plan = PLON[(a.dataset.kynningEn || '').toLowerCase()];
    a.href = STILLINGAR.pilot + (plan ? '?plan=' + plan : '?call=1');
  });
  document.querySelectorAll('[data-samstarf]').forEach(a => { a.href = STILLINGAR.pilot + '?call=1'; });
})();

// opið fyrir skriftur einstakra síðna
window.X = { STILLINGAR, STADA };

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

// ---------- aðgerðastika neðst á síma ----------
// Birtist undir 720px þegar hetjan er farin upp fyrir og felst nálægt fætinum. Ekki á pilot.html.
const skraNafn = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
if (!/^pilot(\.html)?$/.test(skraNafn)) {
  const stika = document.createElement('div');
  stika.className = 'mbar';
  stika.innerHTML = '<a class="btn btn--metal" href="' + STILLINGAR.pilot + '"><span>Join the pilot</span><svg><use href="#i-or"></use></svg></a>';
  stika.setAttribute('inert', '');
  document.body.appendChild(stika);
  const simi = matchMedia('(max-width:720px)');
  // hetjuhnapparnir ef þeir eru til (forsíðuhetjan er há með skjámyndinni), annars öll hetjan
  const hetjaE = document.querySelector('.hero .hero__cta') || document.querySelector('.hero');
  // felst þegar lokakallið (.final, sem hefur sinn eigin hnapp) eða fóturinn sést
  const nedst = [...document.querySelectorAll('.final, .foot')];
  const sjaanleg = new Set();
  let hetjaSest = !!hetjaE, foturSest = false;
  const uppfaera = () => {
    const syna = simi.matches && !hetjaSest && !foturSest && !(nav && nav.classList.contains('is-open'));
    stika.classList.toggle('is-on', syna);
    if (syna) stika.removeAttribute('inert'); else stika.setAttribute('inert', '');
  };
  if ('IntersectionObserver' in window) {
    if (hetjaE) new IntersectionObserver(es => { hetjaSest = es[0].isIntersecting; uppfaera(); }).observe(hetjaE);
    const ioN = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) sjaanleg.add(e.target); else sjaanleg.delete(e.target); });
      foturSest = sjaanleg.size > 0; uppfaera();
    }, { rootMargin: '0px 0px 80px 0px' });
    nedst.forEach(el => ioN.observe(el));
  } else {
    addEventListener('scroll', () => { hetjaSest = scrollY < 500; uppfaera(); }, { passive: true });
  }
  if (!hetjaE) addEventListener('scroll', () => { hetjaSest = scrollY < 400; uppfaera(); }, { passive: true });
  if (simi.addEventListener) simi.addEventListener('change', uppfaera);
  if (valmynd) valmynd.addEventListener('click', uppfaera);
  uppfaera();
}

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
