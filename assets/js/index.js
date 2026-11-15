// Forsíðan: gesturinn velur grein undir hetjunni og sér lausnirnar fyrir hana, með einu dæmi sem passar.
// Allt efni greinanna er í einum hlut, GREINAR. Allt keyrir í vafranum, ekkert er sent.
// Valin grein er geymd í localStorage 'x-grein' og í ?industry= svo aðrar síður fylgi henni.
(() => {

const GEYMSLA = 'x-grein';
const evra = n => '€' + Math.round(n).toLocaleString('en-US');
const evra2 = n => '€' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const kyrrt = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- tungumálin í dæminu um vinnuflokkinn ----------
const MAL = {
  en: { name: 'English', nat: 'English' },
  is: { name: 'Icelandic', nat: 'Íslenska' },
  hr: { name: 'Croatian', nat: 'Hrvatski' },
  pl: { name: 'Polish', nat: 'Polski' },
  lt: { name: 'Lithuanian', nat: 'Lietuvių' },
  ro: { name: 'Romanian', nat: 'Română' },
  uk: { name: 'Ukrainian', nat: 'Українська' },
  es: { name: 'Spanish', nat: 'Español' },
};

// heildsala: pöntunarlínur af verðlista búðarinnar (dæmagögn)
const PANTUN = [
  ['Oat crackers 200 g', 24, 2.10],
  ['Rye bread 500 g', 30, 2.80],
  ['Apple juice 1 l', 36, 1.90],
  ['Granola 400 g', 18, 3.40],
  ['Butter 250 g', 40, 2.25],
];
const PANTUN_ALLS = PANTUN.reduce((s, [, q, e]) => s + q * e, 0);

// ---------- áætlanir (verð eins og á verd.html) ----------
const PLON = {
  solo: { n: 'Solo', p: '€49 a month excl. VAT' },
  team: { n: 'Team', p: '€129 a month excl. VAT' },
  business: { n: 'Business', p: '€299 a month excl. VAT' },
};

// ---------- greinarnar fimm: allt efni hlutans "Solutions for ..." ----------
// intro: vandinn í einni setningu, í annarri persónu og án gæsalappa (ekki umsögn). sol: vandi (p) og hvað X gerir (x), soon = Coming soon. demo: 'cw' (vinnuflokkurinn) eða 'q' (tilboð eða pöntun).
// Fyrirtæki, fólk og upphæðir eru tilbúin dæmi.
const GREINAR = {
  contractors: {
    for: 'contractors',
    intro: 'Your crew does not speak your language, quotes go unanswered, and you write the diary and hours at night.',
    sol: [
      { i: 'i-spjall', p: 'You explain the same task three times in bad English. It still gets done wrong.', x: 'Write the task in your language. Each worker reads it in theirs and answers the same way.', soon: true },
      { i: 'i-tilbod', p: 'You sent the quote on Friday. No answer, and nobody followed it up.', x: 'Good, Better and Best from your price list. X drafts a reminder after 3 and 7 days. You tap yes.' },
      { i: 'i-bok', p: 'At night you write the work diary and everyone\'s hours in a notebook at home.', x: 'The diary and the hours fill in from your crew\'s messages. You check and approve.', soon: true },
      { i: 'i-reikningur', p: 'The invoice waits until the job is long done.', x: 'Each stage done: an invoice draft waits for your yes, then goes to your accounting.' },
    ],
    plan: 'team', who: 'For a firm of 2 to 5 people. One price for the whole team.',
    demo: 'cw', dh: 'Try it: crew chat in their language',
    dp: 'Write a task in your language. Marek reads it in his and answers in his. X keeps the work diary and the hours.',
    cw: {
      owner: 'Sarah', firm: 'Northside Builders', job: 'Bathroom at 12 Elm Road',
      t: ['07:12', '08:00', '15:30'], hours: '7 h 30 min', photo: 'old tiles off',
      txt: {
        en: { task: 'Marek, today: the bathroom at 12 Elm Road. Take off the old tiles. Send a photo when you finish.', start: 'Starting now.', done: 'Finished. The old tiles are off and the skip is full. Tomorrow I need 4 bags of tile adhesive.' },
        is: { task: 'Marek, í dag: baðherbergið á 12 Elm Road. Taktu gömlu flísarnar af. Sendu mynd þegar þú klárar.', start: 'Byrja núna.', done: 'Búinn. Gömlu flísarnar eru farnar og gámurinn er fullur. Á morgun þarf ég 4 poka af flísalími.' },
        hr: { task: 'Marek, danas: kupaonica na 12 Elm Road. Skini stare pločice. Pošalji fotografiju kad završiš.', start: 'Počinjem sada.', done: 'Gotovo. Stare pločice su skinute i kontejner je pun. Sutra trebam 4 vreće ljepila za pločice.' },
        pl: { task: 'Marek, dzisiaj: łazienka przy 12 Elm Road. Zdejmij stare płytki. Wyślij zdjęcie, jak skończysz.', start: 'Zaczynam.', done: 'Skończone. Stare płytki zdjęte, kontener pełny. Jutro potrzebuję 4 worki kleju do płytek.' },
        lt: { task: 'Marekai, šiandien: vonios kambarys, 12 Elm Road. Nuimk senas plyteles. Atsiųsk nuotrauką, kai baigsi.', start: 'Pradedu.', done: 'Baigta. Senos plytelės nuimtos, konteineris pilnas. Rytoj reikės 4 maišų plytelių klijų.' },
        ro: { task: 'Marek, azi: baia de la 12 Elm Road. Scoate plăcile vechi. Trimite o poză când termini.', start: 'Încep acum.', done: 'Gata. Plăcile vechi sunt scoase și containerul e plin. Mâine am nevoie de 4 saci de adeziv pentru plăci.' },
        uk: { task: 'Мареку, сьогодні: ванна кімната на 12 Elm Road. Зніми стару плитку. Надішли фото, коли закінчиш.', start: 'Починаю.', done: 'Готово. Стару плитку знято, контейнер повний. Завтра потрібно 4 мішки клею для плитки.' },
        es: { task: 'Marek, hoy: el baño de 12 Elm Road. Quita los azulejos viejos. Manda una foto cuando termines.', start: 'Empiezo ahora.', done: 'Terminado. Los azulejos viejos están fuera y el contenedor está lleno. Mañana necesito 4 sacos de adhesivo para azulejos.' },
      },
      // dagbókin: [heiti, gildi, stig sem fyllir línuna, tegund]
      diary: [
        ['Job', 'Bathroom at 12 Elm Road', 0],
        ['Worker', 'Marek', 0],
        ['Start', '08:00', 2],
        ['Finish', '15:30', 3],
        ['Hours', '7 h 30 min', 3, 'hours'],
        ['Done', 'Old tiles off. Skip full.', 3],
        ['Needs', '4 bags of tile adhesive for tomorrow', 3],
        ['Photo', 'Old tiles off', 3, 'photo'],
      ],
    },
  },

  cleaning: {
    for: 'cleaning and services',
    intro: 'You type the same invoices every month, and your team reads tasks in a language they barely know.',
    sol: [
      { i: 'i-skjol', p: 'Every month you type the same contract invoices again.', x: 'Recurring contracts with a fixed monthly price. On the 1st every invoice is drafted. Approve them all at once.' },
      { i: 'i-dagatal', p: 'The visit plan lives in your head and on sticky notes.', x: 'Each contract fills the visit schedule for the months ahead. Move a visit and the rest stays.' },
      { i: 'i-spjall', p: 'Your team reads the checklist in a language they barely know.', x: 'Send the task and checklist in your language. Each cleaner reads it in theirs and answers with a photo.', soon: true },
      { i: 'i-tilbod', p: 'An office asks for a price and you answer days later.', x: 'Weekly, twice a week and daily side by side, from your price list. The customer picks one online.' },
    ],
    plan: 'team', who: 'For a team of 2 to 5 people. One price for the whole team.',
    demo: 'cw', dh: 'Try it: the visit in their language',
    dp: 'Send tonight\'s visit and checklist in your language. Marek reads it in his and answers in his. X keeps the work diary and the hours.',
    cw: {
      owner: 'Emma', firm: 'Brightway Cleaning', job: 'Office cleaning, 3rd floor',
      t: ['17:40', '18:00', '21:00'], hours: '3 h', photo: 'office, 3rd floor',
      txt: {
        en: { task: 'Marek, today at 18:00: office cleaning at Lakeside Dental, 3rd floor. Follow the checklist. Send a photo when you finish.', start: 'Starting now.', done: 'Finished. Everything on the checklist is done. The toilets need more hand soap.' },
        is: { task: 'Marek, í dag klukkan 18:00: skrifstofuþrif hjá Lakeside Dental, 3. hæð. Fylgdu gátlistanum. Sendu mynd þegar þú klárar.', start: 'Byrja núna.', done: 'Búinn. Allt á gátlistanum er klárt. Það vantar meiri handsápu á salernin.' },
        hr: { task: 'Marek, danas u 18:00: čišćenje ureda u Lakeside Dental, 3. kat. Prati popis zadataka. Pošalji fotografiju kad završiš.', start: 'Počinjem sada.', done: 'Gotovo. Sve s popisa je napravljeno. U toaletima treba još sapuna za ruke.' },
        pl: { task: 'Marek, dzisiaj o 18:00: sprzątanie biura w Lakeside Dental, 3. piętro. Trzymaj się listy kontrolnej. Wyślij zdjęcie, jak skończysz.', start: 'Zaczynam.', done: 'Skończone. Wszystko z listy zrobione. W toaletach brakuje mydła do rąk.' },
        lt: { task: 'Marekai, šiandien 18:00: biuro valymas Lakeside Dental, 3 aukštas. Laikykis kontrolinio sąrašo. Atsiųsk nuotrauką, kai baigsi.', start: 'Pradedu.', done: 'Baigta. Viskas iš sąrašo padaryta. Tualetuose trūksta rankų muilo.' },
        ro: { task: 'Marek, azi la 18:00: curățenie la birourile Lakeside Dental, etajul 3. Urmează lista de verificare. Trimite o poză când termini.', start: 'Încep acum.', done: 'Gata. Tot ce era pe listă e făcut. La toalete mai trebuie săpun de mâini.' },
        uk: { task: 'Мареку, сьогодні о 18:00: прибирання офісу в Lakeside Dental, 3-й поверх. Дотримуйся чек-листа. Надішли фото, коли закінчиш.', start: 'Починаю.', done: 'Готово. Усе з чек-листа зроблено. У туалетах треба більше мила для рук.' },
        es: { task: 'Marek, hoy a las 18:00: limpieza de oficina en Lakeside Dental, 3.ª planta. Sigue la lista de control. Manda una foto cuando termines.', start: 'Empiezo ahora.', done: 'Terminado. Todo lo de la lista está hecho. En los baños falta jabón de manos.' },
      },
      diary: [
        ['Job', 'Office cleaning, 3rd floor, Lakeside Dental', 0],
        ['Worker', 'Marek', 0],
        ['Start', '18:00', 2],
        ['Finish', '21:00', 3],
        ['Hours', '3 h', 3, 'hours'],
        ['Checklist', ['Floors', 'Bins and kitchen', 'Toilets and sinks'], 3, 'list'],
        ['Needs', 'Hand soap for the toilets', 3],
        ['Photo', 'Office, 3rd floor', 3, 'photo'],
      ],
    },
  },

  consultants: {
    for: 'consultants',
    intro: 'Proposals, hours and meeting notes are all over the place, and invoicing waits until the end of the month.',
    sol: [
      { i: 'i-tilbod', p: 'You write each proposal from scratch.', x: 'Proposals in three tiers from your own packages. Your client picks one and accepts online.' },
      { i: 'i-verk', p: 'A yes still means an evening of setup.', x: 'Proposal accepted: a project, the check-ins and an invoice draft are created.' },
      { i: 'i-heili', p: 'Meeting notes sit in a notebook nobody reads again.', x: 'After a meeting: a summary with next steps that you approve before it goes.' },
      { i: 'i-hond', p: 'Hours over the retainer never make it onto the invoice.', x: 'Log time to the project. Extra hours go on the next invoice draft.' },
    ],
    plan: 'solo', who: 'If you work alone. Team covers 2 to 5 people at one price.',
    demo: 'q', dh: 'Try it: a proposal your client accepts',
    dp: 'Accept the proposal as your client would. See it become a project and an invoice draft.',
    q: {
      firm: 'Fieldstone Advisory', cust: 'Greenleaf Bakery', no: '3012', what: 'Advisory package',
      vat: 'Total, excl. VAT', per: '', rec: 1,
      doc: 'Proposal', lbl: 'Your client\'s phone', acc: 'Accept as your client', who: 'client',
      jk: 'Project', jw: 'Becomes a project when your client accepts.', sayJ: 'A project was created. ',
      iw: 'Made from the project. Nothing typed twice.',
      qwait: 'Sent. Reminder after 3 and 7 days if there is no answer.',
      opts: [
        { n: 'Starter', p: 1200, c: 'A written summary after the workshop', li: ['A review of your numbers', 'One half-day workshop', 'A written summary'] },
        { n: 'Standard', p: 2900, c: '3 monthly check-ins in the calendar', li: ['Everything in Starter', '3 monthly check-ins', 'A budget for next year'] },
        { n: 'Full', p: 5800, c: '12 monthly check-ins in the calendar', li: ['Everything in Standard', '12 monthly check-ins', 'Help with the bank meeting'] },
      ],
      job: o => ({
        t: 'Project: ' + o.n.toLowerCase() + ' package', s: 'Greenleaf Bakery · ' + o.n,
        li: ['Kick-off workshop booked', o.c, 'Tasks for you and for the client', 'Meeting summaries wait for your yes'],
      }),
      inv: o => ({
        t: 'Kick-off invoice', s: 'Greenleaf Bakery · the rest on delivery',
        lines: [[o.n + ' package, 50% at kick-off', o.p * 0.5]],
        tot: 'Total, excl. VAT',
      }),
    },
  },

  shops: {
    for: 'shops',
    intro: 'Webshop orders, business customers and stock all live in different places.',
    sol: [
      { i: 'i-verslun', p: 'Webshop orders and customers sit in another system.', x: 'Orders and customers come in from WooCommerce. Shopify is coming soon.' },
      { i: 'i-tilbod', p: 'A café wants 96 mugs and you work out the price by hand.', x: 'Quotes for business customers from the same price list as your shop.' },
      { i: 'i-vorur', p: 'You notice a product is gone when a customer asks for it.', x: 'Set a limit per product. Low stock shows on your morning list.' },
      { i: 'i-reikningur', p: 'Business orders get invoiced late, or not at all.', x: 'Every business order gets an invoice draft for your accounting.' },
    ],
    plan: 'team', who: 'For a shop of 2 to 5 people. One price for the whole team.',
    demo: 'q', dh: 'Try it: a business order',
    dp: 'Accept the order as your business customer would. See it become an order to pack and an invoice draft.',
    q: {
      firm: 'Copper and Clay', cust: 'Juniper Café', no: '4120', what: 'Stoneware mugs for the café',
      vat: 'Total, excl. VAT', per: '', rec: 1,
      doc: 'Quote', lbl: 'Your customer\'s phone', acc: 'Accept as your customer', who: 'customer',
      jk: 'Order', jw: 'Becomes an order when your customer accepts.', sayJ: 'An order to pack was created. ',
      iw: 'Made from the order. Nothing typed twice.',
      qwait: 'Sent. Reminder after 3 and 7 days if there is no answer.',
      opts: [
        { n: '48 mugs', q: 48, e: 10, p: 480, del: 'Pickup in store', li: ['€10.00 each', 'Pickup in store'] },
        { n: '96 mugs', q: 96, e: 9, p: 864, del: 'Delivery on Thursday', li: ['€9.00 each', 'Delivery included'] },
        { n: '144 mugs', q: 144, e: 8, p: 1152, del: 'Delivery on Thursday', li: ['€8.00 each', 'Delivery included', 'Same glaze, one batch'] },
      ],
      job: o => ({
        t: 'Order to pack', s: 'Juniper Café · ' + o.n,
        li: ['Order lines from your price list', 'Pick list for the shop', o.del, 'Juniper Café saved as a business customer'],
      }),
      inv: o => ({
        t: 'Invoice', s: 'Juniper Café · business customer',
        lines: [['Stoneware mug × ' + o.q + ' at €' + o.e.toFixed(2), o.p]],
        tot: 'Total, excl. VAT',
      }),
    },
  },

  wholesale: {
    for: 'wholesalers',
    intro: 'Shops order by phone, text and email, and you type every order and every invoice by hand.',
    sol: [
      { i: 'i-gatt', p: 'Orders come in by phone, text and email.', x: 'An ordering portal where each shop reorders from its own price list.' },
      { i: 'i-hak', p: 'Orders under your minimum slip through.', x: 'Your minimum order and delivery days are checked before you accept.' },
      { i: 'i-reikningur', p: 'Every order is typed twice: once to pick, once to invoice.', x: 'An accepted order becomes a picking list and an invoice draft.' },
      { i: 'i-heili', p: 'You hear a shop ran out when they call.', x: 'Reorder suggestions before a shop runs out, always with your approval. Stock per store only where the store or chain shares it.', soon: true },
    ],
    plan: 'business', who: 'For 6 to 20 people. The quick start setup is included.',
    demo: 'q', dh: 'Try it: a shop\'s reorder',
    dp: 'Accept the order as the wholesaler. See it become a picking list and an invoice draft.',
    q: {
      firm: 'Westgate Market', cust: 'Delivery Tuesday · minimum order €250', no: '3321', what: 'Weekly reorder',
      vat: 'Total, excl. VAT', per: '', rec: 0, cents: true,
      doc: 'Order', lbl: 'A shop\'s reorder, on your phone', pick: 'From their own price list', acc: 'Accept order',
      qic: 'i-gatt', jic: 'i-vorur', jk: 'Picking list and delivery', jw: 'Becomes a picking list when you accept.',
      iw: 'Made from the order. Nothing typed twice.', sayJ: 'A picking list and a delivery were created. ',
      qwait: 'Reordered in your ordering portal. Above your €250 minimum.',
      qacc: o => 'Accepted by you: ' + o.n + ', ' + evra2(o.p) + '. On Tuesday\'s run.',
      lines: PANTUN, side: true,
      opts: [{ n: PANTUN.length + ' lines', p: PANTUN_ALLS }],
      job: () => ({
        t: 'Picking list, order 3321', s: 'Westgate Market · Tuesday delivery run',
        li: [PANTUN.length + ' lines from their price list', 'Picking list for the warehouse', 'On Tuesday\'s run, 06:30', 'Delivery note for Westgate Market'],
      }),
      inv: () => ({
        t: 'Invoice, order 3321', s: 'Westgate Market · drafted on delivery',
        lines: PANTUN.map(([t, q, e]) => [t + ' × ' + q, q * e]),
        tot: 'Total, excl. VAT',
      }),
    },
  },
};
// textar sem eru eins í flestum tilboðsdæmum; grein getur skrifað yfir þá
const STD = { pick: 'Choose a version', qic: 'i-tilbod', jic: 'i-verk', iw: 'Made from the job. Nothing typed twice.' };
Object.values(GREINAR).forEach(g => { if (g.q) Object.keys(STD).forEach(k => { if (g.q[k] === undefined) g.q[k] = STD[k]; }); });
const SAMHEITI = { contractor: 'contractors', trades: 'contractors', renovation: 'contractors', cleaners: 'cleaning', services: 'cleaning', service: 'cleaning', consultant: 'consultants', shop: 'shops', retail: 'shops', wholesaler: 'wholesale', distributor: 'wholesale', distribution: 'wholesale', b2b: 'wholesale' };

// ---------- hjálparföll ----------
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
const ikon = id => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('aria-hidden', 'true'); const u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', '#' + id); s.appendChild(u); return s; };
const merki = (t, cls) => el('span', 'tag' + (cls ? ' ' + cls : ''), t);
function hak(t) { const li = el('li'); li.append(ikon('i-hak'), el('span', '', t)); return li; }
function geyma(k) { try { localStorage.setItem(GEYMSLA, k); } catch (e) { /* geymsla lokuð: síðan virkar samt */ } }

// =====================================================================
// Dæmi A: vinnuflokkurinn á sínu tungumáli (#crew). Þýðingarnar eru skrifaðar fyrirfram.
// =====================================================================
const cw = (() => {
  const demo = $('#crew');
  if (!demo) return null;
  const send = $('.cw-send', demo), sent = $('.cw-sent', demo), reset = $('.ix-reset', demo);
  const say = $('#cw-say'), dagbok = $('[data-cw-diary]', demo);
  let d = null, own = 'en', wrk = 'pl', stig = 0, timar = [];

  const hreinsa = () => { timar.forEach(clearTimeout); timar = []; };
  const textar = () => {
    if (!d) return;
    const o = d.txt[own], w = d.txt[wrk];
    const t = {
      'own-name': MAL[own].name, 'own-nat': MAL[own].nat, 'wrk-name': MAL[wrk].name, 'wrk-nat': MAL[wrk].nat,
      'task-own': o.task, 'task-wrk': w.task, 'start-own': o.start, 'start-wrk': w.start, 'done-own': o.done, 'done-wrk': w.done,
      owner: d.owner, firm: d.firm, ini: d.firm[0], job: d.job, photo: d.photo, t1: d.t[0], t2: d.t[1], t3: d.t[2],
    };
    $$('[data-cw-t]', demo).forEach(e => { const v = t[e.dataset.cwT]; if (v !== undefined) e.textContent = v; });
  };
  const teiknaDagbok = () => {
    if (!dagbok || !d) return;
    dagbok.replaceChildren(...d.diary.map(([k, v, s, teg]) => {
      const row = el('div', 'cw-row');
      if (s) row.dataset.s = s;
      const dd = el('dd');
      const val = el('span', 'cw-val');
      if (teg === 'hours') { val.append(el('b', '', v), ' ', merki('Waits for your OK', 'tag--warn')); }
      else if (teg === 'photo') { const p = el('span', 'cw-photo cw-photo--sm'); p.append(el('span', '', v)); val.append(p); }
      else if (teg === 'list') { const ul = el('ul', 'cw-list'); v.forEach(x => ul.append(hak(x))); val.append(ul); }
      else val.textContent = v;
      if (s) dd.append(el('span', 'cw-wait', 'Waiting'));
      dd.append(val);
      row.append(el('dt', '', k), dd);
      return row;
    }));
  };
  // stig 0: bíður eftir Send, 1: verkefnið farið, 2: Marek byrjaði, 3: búinn, dagbókin full
  const syna = n => {
    stig = n;
    $$('[data-s]', demo).forEach(e => e.classList.toggle('on', Number(e.dataset.s) <= n));
    $$('.cw-row:not([data-s])', demo).forEach(e => e.classList.add('on'));
    demo.classList.toggle('is-sent', n >= 1);
    demo.classList.toggle('is-done', n >= 3);
    if (reset) reset.hidden = n < 3;
  };
  const segja = n => {
    if (!say || !d) return;
    const w = MAL[wrk].name;
    say.textContent = [
      '',
      'Sent. Marek got the task in ' + w + '.',
      'Marek replied in ' + w + ' that he started at ' + d.t[1] + '. You read it in ' + MAL[own].name + '.',
      'Marek sent a voice note and a photo at ' + d.t[2] + '. The work diary shows ' + d.hours + ', waiting for your OK.',
    ][n];
  };
  if (send) send.addEventListener('click', () => {
    if (stig || !d) return;
    syna(1); segja(1);
    if (sent) sent.focus({ preventScroll: true });
    if (kyrrt) { syna(3); segja(3); return; }
    timar.push(setTimeout(() => { syna(2); segja(2); }, 1500));
    timar.push(setTimeout(() => { syna(3); segja(3); }, 3300));
  });
  if (reset) reset.addEventListener('click', () => {
    hreinsa(); syna(0); if (say) say.textContent = '';
    if (send) send.focus({ preventScroll: true });
  });
  const veljaMal = (attr, gildi) => $$('[' + attr + ']', demo).forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === gildi)));
  $$('[data-cw-own]', demo).forEach(b => b.addEventListener('click', () => { own = b.dataset.cwOwn; veljaMal('data-cw-own', own); textar(); }));
  $$('[data-cw-wrk]', demo).forEach(b => b.addEventListener('click', () => { wrk = b.dataset.cwWrk; veljaMal('data-cw-wrk', wrk); textar(); }));

  return {
    el: demo,
    setja(gogn) { hreinsa(); d = gogn; teiknaDagbok(); textar(); syna(0); if (say) say.textContent = ''; },
    stoppa() { hreinsa(); },
  };
})();

// =====================================================================
// Dæmi B: tilboð eða pöntun sem gesturinn samþykkir og sér verða að verki og reikningsdrögum (#ix-demo)
// =====================================================================
const qd = (() => {
  const demo = $('#ix-demo');
  if (!demo) return null;
  const f = n => demo.querySelector('[data-f="' + n + '"]');
  const optsEl = $('.ix-opts', demo), accept = $('.ix-accept', demo), reset = $('.ix-reset', demo);
  const say = $('#ix-say'), wire = $('.ix-wire', demo);
  const stepJ = $('.ix-step--job', demo), stepI = $('.ix-step--inv', demo);
  let g = null, val = 0, timar = [];

  const upph = () => g.cents ? evra2 : evra;
  const texti = (n, t) => { const e = f(n); if (e) e.textContent = t; };
  const hreinsa = () => { timar.forEach(clearTimeout); timar = []; };
  const seinna = (fn, ms) => { if (kyrrt) fn(); else timar.push(setTimeout(fn, ms)); };
  const hlaupa = () => { if (kyrrt || !wire) return; wire.classList.remove('go'); void wire.offsetWidth; wire.classList.add('go'); };
  const skruna = e => {
    if (!e || !matchMedia('(max-width:960px)').matches) return;
    const r = e.getBoundingClientRect();
    if (r.bottom > innerHeight - 90) e.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  function teiknaVal() {
    if (!g.lines && optsEl) [...optsEl.children].forEach((b, i) => b.setAttribute('aria-pressed', String(i === val)));
    texti('total', upph()(g.opts[val].p) + g.per);
  }

  function teikna() {
    hreinsa();
    demo.classList.remove('is-acc', 'is-job', 'is-inv');
    const sala = g.lines ? g.firm : g.cust; // í heildsölu er búðin sú sem pantar
    texti('ini', g.firm[0]); texti('firm', g.firm); texti('qno', g.doc + ' ' + g.no);
    texti('what', g.what); texti('cust', g.lines ? g.cust : 'For ' + g.cust); texti('vat', g.vat);
    texti('thanks', 'Thank you. ' + g.firm + ' has been told.');
    texti('qline', g.doc + ' ' + g.no + ' · ' + sala);
    texti('qstate', g.qwait);
    ['lbl', 'pick', 'jk', 'jw', 'iw'].forEach(k => texti(k, g[k]));
    if (f('qic')) f('qic').setAttribute('href', '#' + g.qic);
    if (f('jic')) f('jic').setAttribute('href', '#' + g.jic);
    if (f('side')) f('side').hidden = !g.side;
    const qtag = f('qtag'); if (qtag) { qtag.textContent = 'Waiting'; qtag.className = 'tag tag--warn'; }

    if (optsEl) {
      if (g.lines) optsEl.replaceChildren(...g.lines.map(([t, q, e]) => {
        // pöntunarlínur: ekki val, bara það sem búðin bað um
        const d = el('div', 'ix-opt ix-opt--line');
        const h = el('span', 'ix-opt__h');
        h.append(el('b', '', t), el('span', 'ix-opt__p', evra2(q * e)));
        d.append(h, el('span', 'ix-opt__li', q + ' × ' + evra2(e)));
        return d;
      }));
      else optsEl.replaceChildren(...g.opts.map((o, i) => {
        const b = el('button', 'ix-opt'); b.type = 'button';
        const h = el('span', 'ix-opt__h');
        const n = el('b', '', o.n);
        if (i === g.rec) n.append(' ', merki('Recommended'));
        h.append(n, el('span', 'ix-opt__p', evra(o.p) + g.per));
        b.append(h, el('span', 'ix-opt__li', o.li.join(' · ')));
        b.addEventListener('click', () => { if (demo.classList.contains('is-acc')) return; val = i; teiknaVal(); });
        return b;
      }));
    }
    teiknaVal();
    if (f('jl')) f('jl').replaceChildren();
    if (f('il')) f('il').replaceChildren();
    if (accept) { accept.disabled = false; accept.querySelector('span').textContent = g.acc; }
    if (reset) reset.hidden = true;
    if (say) say.textContent = '';
  }

  function senda() {
    if (!g || demo.classList.contains('is-acc')) return;
    const o = g.opts[val], j = g.job(o), inv = g.inv(o), kr = upph();
    accept.disabled = true; accept.querySelector('span').textContent = 'Accepted';
    demo.classList.add('is-acc');
    const qtag = f('qtag'); if (qtag) { qtag.textContent = 'Accepted'; qtag.className = 'tag tag--ok'; }
    texti('qstate', g.qacc ? g.qacc(o) : 'Accepted on your ' + g.who + '\'s phone: ' + o.n + ', ' + kr(o.p) + g.per + '.');
    texti('thanks', o.n + ', ' + kr(o.p) + g.per + '. ' + g.firm + ' has been told.');
    if (say) say.textContent = 'Accepted: ' + o.n + '. ';
    hlaupa();

    texti('jt', j.t); texti('js', j.s);
    if (f('jl')) f('jl').replaceChildren(...j.li.map(hak));
    seinna(() => { demo.classList.add('is-job'); if (say) say.textContent += g.sayJ; hlaupa(); if (!kyrrt) skruna(stepJ); }, 700);

    texti('it', inv.t); texti('is', inv.s);
    const linur = inv.lines.map(([t, a]) => { const li = el('li'); li.append(el('span', '', t), el('b', '', kr(a))); return li; });
    const tot = el('li', 'ix-lines__tot');
    tot.append(el('span', '', inv.tot), el('b', '', kr(inv.lines.reduce((s, l) => s + l[1], 0))));
    linur.push(tot);
    if (f('il')) f('il').replaceChildren(...linur);
    seinna(() => {
      demo.classList.add('is-inv'); if (say) say.textContent += 'An invoice draft is ready for your accounting.';
      if (reset) reset.hidden = false;
      if (!kyrrt) skruna(stepI);
    }, 2100);
  }

  if (accept) accept.addEventListener('click', senda);
  if (reset) reset.addEventListener('click', () => { teikna(); if (accept) accept.focus(); });

  return {
    el: demo,
    setja(gogn) { g = gogn; val = g.rec; teikna(); },
    stoppa() { hreinsa(); },
  };
})();

// =====================================================================
// Valið: spjöldin undir hetjunni stýra hlutanum "Solutions for ..."
// =====================================================================
const spjold = $$('.ix-card[data-grein]');
const hluti = $('#lausnir');
const hvatning = $('#ix-prompt');
const L = n => hluti ? hluti.querySelector('[data-l="' + n + '"]') : null;
let valin = null;

function lesa() {
  const q = (new URLSearchParams(location.search).get('industry') || '').toLowerCase();
  const k = GREINAR[q] ? q : SAMHEITI[q];
  if (k) return { k, ur: true };
  try { const s = localStorage.getItem(GEYMSLA); if (s && GREINAR[s]) return { k: s }; } catch (e) { /* geymsla lokuð */ }
  return null;
}

function teiknaLausnir(k) {
  const g = GREINAR[k];
  const t = (n, v) => { const e = L(n); if (e) e.textContent = v; };
  t('for', g.for); t('intro', g.intro); t('dh', g.dh); t('dp', g.dp);
  const plan = PLON[g.plan];
  t('plan', plan.n); t('price', plan.p); t('who', g.who);
  const full = L('full'); if (full) full.href = 'industries.html?industry=' + k;
  const cta = L('cta'); if (cta) cta.href = 'pilot.html?industry=' + k;

  const ul = L('sols');
  if (ul) ul.replaceChildren(...g.sol.map(s => {
    const li = el('li', 'ix-sol__c edge');
    const ic = el('span', 'mod__ic'); ic.append(ikon(s.i));
    const b = el('div', 'ix-sol__b');
    const kx = el('p', 'ix-sol__k ix-sol__k--x');
    const m = el('img'); m.src = 'assets/merki/merki.svg'; m.alt = '';
    kx.append(m, el('span', '', 'What X does'));
    if (s.soon) kx.append(merki('Coming soon'));
    b.append(el('p', 'ix-sol__k', 'Problem'), el('p', 'ix-sol__p', s.p), kx, el('p', 'ix-sol__x', s.x));
    li.append(ic, b);
    return li;
  }));

  // eitt dæmi sem passar greininni
  const syna = g.demo === 'cw' ? cw : qd, fela = g.demo === 'cw' ? qd : cw;
  if (fela) { fela.stoppa(); fela.el.hidden = true; }
  if (syna) { syna.setja(g.demo === 'cw' ? g.cw : g.q); syna.el.hidden = false; }
  const tryEl = $('.ix-try', hluti); if (tryEl) tryEl.hidden = !syna;
}

function velja(k, { vista = true, skruna = false } = {}) {
  if (!GREINAR[k] || !hluti) return;
  valin = k;
  spjold.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.grein === k)));
  teiknaLausnir(k);
  hluti.hidden = false;
  hluti.classList.remove('is-new'); void hluti.offsetWidth; hluti.classList.add('is-new');
  const nafn = spjold.find(b => b.dataset.grein === k);
  if (hvatning && nafn) hvatning.textContent = 'Showing solutions for ' + nafn.querySelector('b').textContent + '.';
  $$('[data-ix-cta]').forEach(a => { a.href = 'pilot.html?industry=' + k; });
  if (vista) {
    geyma(k);
    try {
      const u = new URL(location.href);
      u.searchParams.set('industry', k);
      history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    } catch (e) { /* t.d. opnað beint úr skrá: slóðin breytist ekki, valið virkar samt */ }
  }
  if (skruna) hluti.scrollIntoView({ behavior: kyrrt ? 'auto' : 'smooth', block: 'start' });
}

spjold.forEach(b => b.addEventListener('click', () => velja(b.dataset.grein, { skruna: true })));

const aftur = $('.ix-back');
if (aftur) aftur.addEventListener('click', () => {
  const grein = $('#grein');
  if (grein) grein.scrollIntoView({ behavior: kyrrt ? 'auto' : 'smooth', block: 'start' });
  const p = spjold.find(b => b.getAttribute('aria-pressed') === 'true') || spjold[0];
  if (p) p.focus({ preventScroll: true });
});

// byrjun: ?industry=, svo vistuð grein. Annars er ekkert valið og hvatningin sést.
// index.html#crew (tengill af verd.html) opnar dæmið um vinnuflokkinn hjá verktökum.
const byrjun = lesa();
const crewHash = location.hash === '#crew';
if (crewHash && !(byrjun && GREINAR[byrjun.k].demo === 'cw')) velja('contractors', { vista: false });
else if (byrjun) velja(byrjun.k, { vista: !!byrjun.ur });
if (crewHash && cw && !cw.el.hidden) requestAnimationFrame(() => cw.el.scrollIntoView({ block: 'start' }));

})();
