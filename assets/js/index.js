// Forsíðan (index.html): síminn sem sýnir skrefin sjö í spjallinu. Hlaðið á eftir site.js.
// Skrefin (hnapparnir í [data-ix-steps]) velja hvað síminn sýnir. Spilast sjálft meðan síminn sést,
// stoppar þegar mús eða lyklaborð er á skrefunum og spilast ekki sjálft með prefers-reduced-motion.
(() => {
  const listi = document.querySelector('[data-ix-steps]');
  const chat = document.querySelector('[data-ix-chat]');
  if (!listi || !chat) return;
  const hnappar = [...listi.querySelectorAll('button[data-s]')];
  const who = document.querySelector('[data-ix-who]');
  const sub = document.querySelector('[data-ix-sub]');
  const av = document.querySelector('[data-ix-av]');

  const rodd = (sek) => '<span class="ix-voice"><svg><use href="#i-mic"></use></svg><i></i><span>' + sek + '</span></span>';
  // m: me = sá sem á símann sendi, k = lítil merking efst, t = texti (HTML), s = þýðing eða athugasemd undir
  const BOSS = { who: 'You and X', sub: 'Your chat', av: 'X' };
  const MAREK = { who: 'Marek and X', sub: "Marek's chat · Polish", av: 'X' };
  const SKREF = [
    { ...BOSS, m: [
      { me: 1, t: rodd('0:24') , s: '"Leak under the kitchen sink at 40 Hill Road. Needs doing today. Marek can take it."' },
      { me: 1, t: '<span class="ix-pics"><span class="ix-pic">photo</span><span class="ix-pic">photo</span></span>' },
    ] },
    { ...BOSS, m: [
      { k: 'New task', t: '<b>Leak under kitchen sink</b><ul><li>40 Hill Road</li><li>Urgent: today</li><li>Rough time: 1 to 2 h</li><li>Marek</li></ul>' },
      { t: 'Two questions before Marek goes: is there access to the shut-off valve? Which floor?' },
      { me: 1, t: '2nd floor. Valve is in the hall cupboard.' },
      { t: 'Thanks. Sending it to Marek now.' },
    ] },
    { ...MAREK, m: [
      { k: 'Nowe zadanie', t: '<b>Przeciek pod zlewem w kuchni</b><br>Hill Road 40, 2. piętro. Pilne: dzisiaj. Zawór jest w szafie w przedpokoju.', s: 'In English: Leak under kitchen sink, 40 Hill Road, 2nd floor. Urgent: today. The valve is in the hall cupboard.' },
      { me: 1, t: rodd('0:09'), s: 'Polish voice note. You read: "I can be there at 13:00. I need a new trap."' },
    ] },
    { ...MAREK, m: [
      { me: 1, t: 'start' },
      { t: 'Started 13:04. Hill Road 40.' },
      { time: '14:52' },
      { me: 1, t: 'gotowe', s: 'Polish for "done".' },
      { t: 'Done 14:52. 1 h 48 min on Hill Road 40.' },
    ] },
    { ...MAREK, m: [
      { me: 1, t: '<span class="ix-pics"><span class="ix-pic">before</span><span class="ix-pic ix-pic--after">after</span></span>' },
      { t: 'Czy praca była tak łatwa, jak napisano?<span class="ix-btns"><span>Tak</span><span>Nie</span></span>', s: 'In English: Was the job as easy as it said? Yes / No' },
      { me: 1, t: 'Nie. Rura była skorodowana.', s: 'You read: "No. The pipe was corroded."' },
    ] },
    { ...MAREK, m: [
      { me: 1, t: '<span class="ix-pics"><span class="ix-pic">receipt</span></span>' },
      { t: 'Receipt €38.40, plumbing parts. Added to Hill Road 40.' },
    ] },
    { ...BOSS, sub: 'Friday 16:00', m: [
      { k: 'Your week', t: 'Hours and materials per job:<table class="ix-tbl"><tr><td>Hill Road 40</td><td>1 h 48 · €38</td></tr><tr><td>Harbor Hotel</td><td>14 h 10 · €212</td></tr><tr><td>12 Elm Road</td><td>31 h 30 · €640</td></tr></table><span class="ix-btns"><span>Excel</span><span>PDF</span></span>' },
      { t: 'One job ran over: Hill Road 40. Marek says the pipe was corroded.' },
    ] },
  ];

  const hreyfing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let nr = 0, timar = [], sjalf = null, sest = false, kyrrt = false;

  const hreinsa = () => { timar.forEach(clearTimeout); timar = []; };
  const syna = (i) => {
    hreinsa();
    nr = i;
    const s = SKREF[i];
    hnappar.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    if (who) who.textContent = s.who;
    if (sub) sub.textContent = s.sub;
    if (av) av.textContent = s.av;
    chat.innerHTML = '';
    s.m.forEach((m, j) => {
      const fall = () => {
        const el = document.createElement('div');
        if (m.time) { el.className = 'ix-time'; el.textContent = m.time; }
        else {
          el.className = 'ix-m' + (m.me ? ' ix-m--me' : '');
          el.innerHTML = (m.k ? '<span class="ix-m__k">' + m.k + '</span>' : '') + m.t + (m.s ? '<small>' + m.s + '</small>' : '');
        }
        chat.appendChild(el);
      };
      if (hreyfing && j) timar.push(setTimeout(fall, j * 900)); else fall();
    });
  };

  const naesta = () => syna((nr + 1) % SKREF.length);
  const stilla = () => {
    clearInterval(sjalf); sjalf = null;
    if (hreyfing && sest && !kyrrt && !document.hidden) sjalf = setInterval(naesta, 6500);
  };

  hnappar.forEach((b, i) => b.addEventListener('click', () => { kyrrt = true; syna(i); stilla(); }));
  listi.addEventListener('mouseenter', () => { kyrrt = true; stilla(); });
  listi.addEventListener('mouseleave', () => { kyrrt = false; stilla(); });
  listi.addEventListener('focusin', () => { kyrrt = true; stilla(); });
  listi.addEventListener('focusout', () => { kyrrt = false; stilla(); });
  document.addEventListener('visibilitychange', stilla);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { sest = es[0].isIntersecting; stilla(); }, { threshold: .35 }).observe(chat);
  }
  syna(0);
})();
