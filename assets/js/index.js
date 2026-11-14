// Forsíðan: "Pick your industry". Tilboð á dæmagögnum sem gesturinn samþykkir sem viðskiptavinur,
// og sér það verða að verki og reikningsdrögum. Allt keyrir í vafranum, ekkert er sent.
// Valin grein er geymd í localStorage undir 'x-grein' svo aðrar síður geti notað hana.
(() => {

const GEYMSLA = 'x-grein';
const evra = n => '€' + Math.round(n).toLocaleString('en-US');

// dæmagögn: tilbúin fyrirtæki, ekki raunverulegir viðskiptavinir
const GREINAR = {
  contractors: {
    for: 'contractors',
    firm: 'Northside Builders', cust: 'Harbor Hotel', no: '1043', what: 'Bathroom on the 2nd floor',
    vat: 'Total, incl. VAT', per: '', rec: 1,
    opts: [
      { n: 'Good', p: 8400, li: ['Floor tiles', 'New sink and toilet', 'Painting'] },
      { n: 'Better', p: 11700, li: ['Everything in Good', 'Wall tiles', 'Glass shower screen'] },
      { n: 'Best', p: 14900, li: ['Everything in Better', 'Underfloor heating', 'Concealed fittings'] },
    ],
    job: o => ({
      t: 'Bathroom, 2nd floor', s: 'Harbor Hotel · ' + o.n + ' · 3 stages',
      li: ['Stage 1: strip out and plumbing', 'Stage 2: tiles and fittings', 'Stage 3: finish and handover', 'Tasks for Mike and Leo'],
    }),
    inv: o => ({
      t: 'Stage 1 of 3', s: 'Harbor Hotel · when stage 1 is done',
      lines: [['Stage 1: strip out and plumbing, 30% of ' + evra(o.p), o.p * 0.3]],
      tot: 'Total, incl. VAT',
    }),
    sets: [
      'Your price list as quote lines, ready for Good, Better and Best.',
      'Jobs in stages, with an invoice draft for each stage.',
      'Change orders your customer accepts online, added to the right stage.',
    ],
  },
  cleaning: {
    for: 'cleaning and service firms',
    firm: 'Brightway Cleaning', cust: 'Lakeside Dental', no: '2017', what: 'Office cleaning, 240 m²',
    vat: 'A month, excl. VAT', per: ' a month', rec: 1,
    opts: [
      { n: 'Weekly', p: 390, d: 'every Tuesday', li: ['One visit a week', 'Floors, bins and kitchen', 'Toilets and sinks'] },
      { n: 'Twice a week', p: 740, d: 'Tuesday and Thursday', li: ['Everything in Weekly', 'A second visit', 'Desks and surfaces wiped'] },
      { n: 'Daily', p: 1650, d: 'Monday to Friday', li: ['A visit every weekday', 'Everything in Twice a week', 'Supplies restocked'] },
    ],
    job: o => ({
      t: 'Cleaning contract', s: 'Lakeside Dental · ' + o.n,
      li: ['Visits planned: ' + o.d + ', 18:00', 'A checklist for each visit', 'Fixed price: ' + evra(o.p) + ' a month', 'Team: Ana and Tom'],
    }),
    inv: o => ({
      t: 'Contract invoice, month 1', s: 'Lakeside Dental · drafted on the 1st',
      lines: [['Office cleaning, ' + o.n.toLowerCase() + ', one month', o.p]],
      tot: 'Total, excl. VAT',
    }),
    sets: [
      'Recurring contracts with a visit plan and a fixed monthly price.',
      'A checklist for each visit, so the team knows what is included.',
      '1st of the month: contract invoices drafted. Approve them all at once.',
    ],
  },
  consultants: {
    for: 'consultants',
    firm: 'Fieldstone Advisory', cust: 'Greenleaf Bakery', no: '3012', what: 'Advisory package',
    vat: 'Total, excl. VAT', per: '', rec: 1,
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
    sets: [
      'Proposals in three versions from your own packages.',
      'Proposal accepted: a project and an invoice draft are created.',
      'After a meeting: a summary you approve before it goes.',
    ],
  },
  shops: {
    for: 'shops',
    firm: 'Copper and Clay', cust: 'Juniper Café', no: '4120', what: 'Stoneware mugs for the café',
    vat: 'Total, excl. VAT', per: '', rec: 1,
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
    sets: [
      'Business customers get quotes from the same price list as your shop.',
      'Orders from WooCommerce come into X, with the customer.',
      'Orders from Shopify the same way.',
    ],
    soon: 2, // þriðja línan er "Coming soon"
  },
};
const LYKLAR = Object.keys(GREINAR);
const SAMHEITI = { contractor: 'contractors', trades: 'contractors', cleaners: 'cleaning', services: 'cleaning', service: 'cleaning', consultant: 'consultants', shop: 'shops', retail: 'shops' };

const demo = document.getElementById('ix-demo');
if (!demo) return;
const kyrrt = matchMedia('(prefers-reduced-motion: reduce)').matches;
const tabs = [...document.querySelectorAll('.ix-tab')];
const f = n => demo.querySelector('[data-f="' + n + '"]');
const optsEl = demo.querySelector('.ix-opts');
const accept = demo.querySelector('.ix-accept');
const reset = demo.querySelector('.ix-reset');
const say = document.getElementById('ix-say');
const wire = demo.querySelector('.ix-wire');
const stepQ = demo.querySelector('.ix-step--q');
const stepJ = demo.querySelector('.ix-step--job');
const stepI = demo.querySelector('.ix-step--inv');

let grein = 'contractors', val = 1, timar = [];

function lesa() {
  const q = new URLSearchParams(location.search).get('industry');
  const k = q && (GREINAR[q.toLowerCase()] ? q.toLowerCase() : SAMHEITI[q.toLowerCase()]);
  // grein úr slóðinni er geymd líka, svo kerfid.html og pilot.html fylgi henni
  if (k) { geyma(k); return k; }
  try { const g = localStorage.getItem(GEYMSLA); if (g && GREINAR[g]) return g; } catch (e) { /* geymsla lokuð */ }
  return null;
}
function geyma(k) { try { localStorage.setItem(GEYMSLA, k); } catch (e) { /* geymsla lokuð: síðan virkar samt */ } }

function texti(n, t) { const el = f(n); if (el) el.textContent = t; }
function lista(el, items, mk) { el.replaceChildren(...items.map(mk)); }
function hak(t, cls) {
  const li = document.createElement('li');
  if (cls) li.className = cls;
  li.innerHTML = '<svg aria-hidden="true"><use href="#i-hak"></use></svg>';
  const s = document.createElement('span'); s.textContent = t; li.appendChild(s);
  return li;
}

function hreinsa() { timar.forEach(clearTimeout); timar = []; }
function seinna(fn, ms) { if (kyrrt) fn(); else timar.push(setTimeout(fn, ms)); }

function teiknaVal() {
  const g = GREINAR[grein];
  [...optsEl.children].forEach((b, i) => b.setAttribute('aria-pressed', String(i === val)));
  texti('total', evra(g.opts[val].p) + g.per);
}

function teikna() {
  const g = GREINAR[grein];
  hreinsa();
  demo.classList.remove('is-acc', 'is-job', 'is-inv');
  texti('ini', g.firm[0]); texti('firm', g.firm); texti('qno', 'Quote ' + g.no);
  texti('what', g.what); texti('cust', 'For ' + g.cust); texti('vat', g.vat);
  texti('thanks', 'Thank you. ' + g.firm + ' has been told.');
  texti('qline', 'Quote ' + g.no + ' · ' + g.cust);
  texti('qstate', 'Sent. Reminder after 3 and 7 days if there is no answer.');
  const qtag = f('qtag'); qtag.textContent = 'Waiting'; qtag.className = 'tag tag--warn';
  texti('for', g.for);

  optsEl.replaceChildren(...g.opts.map((o, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ix-opt';
    const h = document.createElement('span'); h.className = 'ix-opt__h';
    const n = document.createElement('b'); n.textContent = o.n;
    if (i === g.rec) { const t = document.createElement('span'); t.className = 'tag'; t.textContent = 'Recommended'; n.append(' ', t); }
    const p = document.createElement('span'); p.className = 'ix-opt__p'; p.textContent = evra(o.p) + g.per;
    h.append(n, p);
    const li = document.createElement('span'); li.className = 'ix-opt__li'; li.textContent = o.li.join(' · ');
    b.append(h, li);
    b.addEventListener('click', () => { if (demo.classList.contains('is-acc')) return; val = i; teiknaVal(); });
    return b;
  }));
  teiknaVal();

  lista(f('sets'), g.sets, (t, i) => {
    const li = hak(t);
    if (g.soon === i) { const s = document.createElement('span'); s.className = 'tag'; s.textContent = 'Coming soon'; li.querySelector('span').append(' ', s); li.classList.add('is-soon'); }
    return li;
  });
  f('cta').href = 'pilot.html?industry=' + grein;
  f('jl').replaceChildren(); f('il').replaceChildren();
  accept.disabled = false; accept.querySelector('span').textContent = 'Accept as your customer';
  reset.hidden = true;
  say.textContent = '';
}

function senda() {
  if (demo.classList.contains('is-acc')) return;
  const g = GREINAR[grein], o = g.opts[val];
  const j = g.job(o), inv = g.inv(o);
  accept.disabled = true; accept.querySelector('span').textContent = 'Accepted';
  demo.classList.add('is-acc');
  const qtag = f('qtag'); qtag.textContent = 'Accepted'; qtag.className = 'tag tag--ok';
  texti('qstate', 'Accepted on your customer\'s phone: ' + o.n + ', ' + evra(o.p) + g.per + '.');
  texti('thanks', o.n + ', ' + evra(o.p) + g.per + '. ' + g.firm + ' has been told.');
  say.textContent = 'Accepted: ' + o.n + '. ';
  hlaupa();

  // verkið
  texti('jt', j.t); texti('js', j.s);
  lista(f('jl'), j.li, t => hak(t));
  seinna(() => { demo.classList.add('is-job'); say.textContent += 'A job was created. '; hlaupa(); if (!kyrrt) skruna(stepJ); }, 700);

  // reikningsdrögin
  texti('it', inv.t); texti('is', inv.s);
  const linur = inv.lines.map(([t, a]) => {
    const li = document.createElement('li');
    const s = document.createElement('span'); s.textContent = t;
    const b = document.createElement('b'); b.textContent = evra(a);
    li.append(s, b); return li;
  });
  const tot = document.createElement('li'); tot.className = 'ix-lines__tot';
  const ts = document.createElement('span'); ts.textContent = inv.tot;
  const tb = document.createElement('b'); tb.textContent = evra(inv.lines.reduce((s, l) => s + l[1], 0));
  tot.append(ts, tb); linur.push(tot);
  f('il').replaceChildren(...linur);
  seinna(() => {
    demo.classList.add('is-inv'); say.textContent += 'An invoice draft is ready for your accounting.';
    reset.hidden = false;
    if (!kyrrt) skruna(stepI);
  }, 2100);
}

function hlaupa() {
  if (kyrrt || !wire) return;
  wire.classList.remove('go'); void wire.offsetWidth; wire.classList.add('go');
}
function skruna(el) {
  if (!matchMedia('(max-width:960px)').matches) return;
  const r = el.getBoundingClientRect();
  if (r.bottom > innerHeight - 90) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function velja(k, vista, fokus) {
  if (!GREINAR[k]) return;
  grein = k; val = GREINAR[k].rec;
  tabs.forEach(t => {
    const a = t.dataset.grein === k;
    t.setAttribute('aria-selected', String(a));
    t.tabIndex = a ? 0 : -1;
    if (a) { demo.setAttribute('aria-labelledby', t.id); if (fokus) t.focus(); }
  });
  teikna();
  if (vista) {
    geyma(k);
    document.querySelectorAll('[data-ix-cta]').forEach(a => { a.href = 'pilot.html?industry=' + k; });
  }
}

tabs.forEach((t, i) => {
  t.addEventListener('click', () => velja(t.dataset.grein, true));
  t.addEventListener('keydown', e => {
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n === null) return;
    e.preventDefault();
    velja(tabs[n].dataset.grein, true, true);
  });
});
accept.addEventListener('click', senda);
reset.addEventListener('click', () => { teikna(); accept.focus(); });

const byrjun = lesa();
velja(byrjun || 'contractors', false);
if (byrjun) document.querySelectorAll('[data-ix-cta]').forEach(a => { a.href = 'pilot.html?industry=' + byrjun; });

})();
