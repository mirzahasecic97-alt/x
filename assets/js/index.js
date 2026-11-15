// Forsíðan: gesturinn velur grein undir hetjunni og sér lausnirnar fyrir hana, með einu dæmi sem passar.
// Allt efni greinanna er í einum hlut, GREINAR. Allt keyrir í vafranum, ekkert er sent.
// Valin grein er geymd í localStorage 'x-grein' og í ?industry= svo aðrar síður fylgi henni.
(() => {

const GEYMSLA = 'x-grein';
const evra = n => '€' + Math.round(n).toLocaleString('en-US');
const evra2 = n => '€' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const kyrrt = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
// intro: vandinn í einni setningu, í annarri persónu og án gæsalappa (ekki umsögn). sol: vandi (p) og hvað X gerir (x), soon = Coming soon. demo: 'q' (tilboð, samningur eða pöntun).
// Fyrirtæki, fólk og upphæðir eru tilbúin dæmi.
const GREINAR = {
  contractors: {
    for: 'contractors',
    intro: 'A quick job runs over, quotes go unanswered, and you write the diary and hours at night.',
    sol: [
      { i: 'i-verk', p: 'A job gets called a quick one. It takes the whole afternoon.', x: 'A short brief before each job: past visits, photos, a checklist and an estimate. X flags a job that runs over the estimate.' },
      { i: 'i-tilbod', p: 'You sent the quote on Friday. No answer, and nobody followed it up.', x: 'Good, Better and Best from your price list. X drafts a reminder after 3 and 7 days. You tap yes.' },
      { i: 'i-bok', p: 'At night you write the work diary and everyone\'s hours in a notebook at home.', x: 'Each worker taps Started and Done on the job and adds photos. The diary and the hours fill in. You check and approve.', soon: true },
      { i: 'i-reikningur', p: 'The invoice waits until the job is long done.', x: 'Each stage done: an invoice draft waits for your yes, then goes to your accounting.' },
    ],
    plan: 'team', who: 'For a firm of 2 to 5 people. One price for the whole team.',
    demo: 'q', dh: 'Try it: a quote your client accepts',
    dp: 'Accept the quote as your client would. See it become a job in stages and an invoice draft.',
    q: {
      firm: 'Northside Builders', cust: 'Hannah Reid', no: '1051', what: 'Bathroom at 12 Elm Road',
      vat: 'Total, excl. VAT', per: '', rec: 1,
      doc: 'Quote', lbl: 'Your client\'s phone', acc: 'Accept as your client', who: 'client',
      jk: 'Job in stages', jw: 'Becomes a job when your client accepts.', sayJ: 'A job with three stages was created. ',
      iw: 'Made from the job. Nothing typed twice.',
      qwait: 'Sent. Reminder after 3 and 7 days if there is no answer.',
      opts: [
        { n: 'Good', p: 6400, li: ['Retile', 'New fittings'] },
        { n: 'Better', p: 8900, li: ['Everything in Good', 'A walk-in shower'] },
        { n: 'Best', p: 11200, li: ['Everything in Better', 'A heated floor'] },
      ],
      job: o => ({
        t: 'Job: bathroom at 12 Elm Road', s: 'Hannah Reid · ' + o.n,
        li: ['Stage 1: strip out and plumbing, 30%', 'Stage 2: tiling, 50%', 'Stage 3: fittings and finish, 20%', 'A brief and a checklist for the crew'],
      }),
      inv: o => ({
        t: 'Invoice, stage 1 of 3', s: 'Hannah Reid · when stage 1 is done',
        lines: [['Stage 1: strip out and plumbing, 30%', o.p * 0.3]],
        tot: 'Total, excl. VAT',
      }),
    },
  },

  cleaning: {
    for: 'cleaning and services',
    intro: 'You type the same invoices every month, and you chase everyone\'s hours at the end of it.',
    sol: [
      { i: 'i-skjol', p: 'Every month you type the same contract invoices again.', x: 'Recurring contracts with a fixed monthly price. On the 1st every invoice is drafted. Approve them all at once.' },
      { i: 'i-dagatal', p: 'The visit plan lives in your head and on sticky notes.', x: 'Each contract fills the visit schedule for the months ahead, with the checklist for each place. Move a visit and the rest stays.' },
      { i: 'i-bok', p: 'At the end of the month you chase everyone for their hours.', x: 'Each cleaner taps Started and Done at the visit and adds a photo. The work diary and the hours fill in. You approve.', soon: true },
      { i: 'i-tilbod', p: 'An office asks for a price and you answer days later.', x: 'Weekly, twice a week and daily side by side, from your price list. The customer picks one online.' },
    ],
    plan: 'team', who: 'For a team of 2 to 5 people. One price for the whole team.',
    demo: 'q', dh: 'Try it: a cleaning contract',
    dp: 'Accept the contract as your customer would. See it become visits with a checklist and a monthly invoice draft.',
    q: {
      firm: 'Brightway Cleaning', cust: 'Lakeside Dental', no: '2207', what: 'Office cleaning, 3rd floor',
      vat: 'Monthly, excl. VAT', per: ' a month', rec: 0,
      doc: 'Contract', lbl: 'Your customer\'s phone', pick: 'Choose how often', acc: 'Accept as your customer', who: 'customer',
      qic: 'i-skjol', jic: 'i-dagatal', jk: 'Visits and checklist', jw: 'Becomes a visit schedule when your customer accepts.', sayJ: 'The visits are on the schedule, each with its checklist. ',
      iw: 'Drafted on the 1st of each month. Nothing typed twice.',
      qwait: 'Sent. Reminder after 3 and 7 days if there is no answer.',
      opts: [
        { n: 'Weekly', p: 390, v: 'Every Thursday at 18:00', li: ['Once a week', 'Thursdays'] },
        { n: 'Twice a week', p: 740, v: 'Mondays and Thursdays at 18:00', li: ['Mondays', 'Thursdays'] },
        { n: 'Daily', p: 1650, v: 'Monday to Friday at 18:00', li: ['Monday to Friday'] },
      ],
      job: o => ({
        t: 'Visits: ' + o.n.toLowerCase(), s: 'Lakeside Dental · ' + o.v,
        li: ['On the schedule for the months ahead', 'Checklist: floors, kitchen, toilets, bins', 'Each visit on the cleaner\'s list for the day', 'Move one visit and the rest stays'],
      }),
      inv: o => ({
        t: 'Monthly invoice', s: 'Lakeside Dental · drafted on the 1st',
        lines: [['Office cleaning, ' + o.n.toLowerCase(), o.p]],
        tot: 'Total, excl. VAT',
      }),
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
// Dæmið: tilboð, samningur eða pöntun sem gesturinn samþykkir og sér verða að verki og reikningsdrögum (#ix-demo)
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

// greinin og verkflæðið hennar í flow.js
const FLAEDI = { contractors: 'contractors-service', cleaning: 'cleaning', consultants: 'consultants', shops: 'shops', wholesale: 'wholesale' };

// "Try it": litla dæmið er falið þar til gesturinn opnar það
const tryit = (() => {
  const b = $('.ix-tryit__b'), p = $('#ix-tryit-p');
  if (!b || !p) return null;
  const opna = (ja) => { b.setAttribute('aria-expanded', String(ja)); p.hidden = !ja; };
  b.addEventListener('click', () => opna(b.getAttribute('aria-expanded') !== 'true'));
  return { wrap: b.parentElement, opna };
})();

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

  // verkflæðið fyrir greinina (flow.js): skiptir um flæði og byrjar á skrefi 1. Spilar bara þegar það sést
  const fl = $('#ix-flow');
  if (fl) { if (window.XFlow && XFlow.set) XFlow.set(fl, FLAEDI[k]); else fl.dataset.flow = FLAEDI[k]; }

  // eitt lítið dæmi sem passar greininni, undir "Try it"
  if (qd) { qd.stoppa(); qd.setja(g.q); qd.el.hidden = false; }
  if (tryit) tryit.wrap.hidden = !qd;
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
// gamli tengillinn index.html#crew opnar verktaka.
const byrjun = lesa();
if (location.hash === '#crew' && !(byrjun && byrjun.ur)) velja('contractors', { vista: false, skruna: true });
else if (byrjun) velja(byrjun.k, { vista: !!byrjun.ur });

})();
