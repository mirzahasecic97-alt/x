// Forsíðan: greinin er valin með flögunum fyrir ofan verkflæðið (flow.js sér um flögurnar, ?industry= og 'x-grein').
// Þessi skrá fylgir valinu: ein setning yfir striganum, "What this saves you" og slóðin á "Join the pilot".
// Ekkert er sent. Engar tölur í línunum.
(() => {

// setning á hvert verkflæði, þrjár línur á hverja grein
const SETNING = {
  'contractors-service': 'From your plan for the day to the invoice. You only say yes.',
  'contractors-quote': 'From the first enquiry to the invoice. You only say yes.',
  cleaning: 'From the signed contract to the monthly invoices. You only say yes.',
  consultants: 'From the proposal to the invoice. You only say yes.',
  shops: 'From the order to the invoice. You only say yes.',
  wholesale: 'From the shop\'s reorder to the invoice. You only say yes.',
};

const SPARAR = {
  contractors: [
    'Plan the day once. X sorts it and gives each worker his own jobs.',
    'Each job comes with a short brief, so nobody walks in blind.',
    'Invoices are drafted from the job. Nothing is typed twice.',
  ],
  cleaning: [
    'Every visit goes on the schedule the day the contract is signed.',
    'Invoices for every contract are drafted on the 1st.',
    'You approve the whole invoice run in one go.',
  ],
  consultants: [
    'The project and the retainer are set up when the client says yes.',
    'Meeting notes are summed up for you to check.',
    'Extra hours land on the invoice, so none are forgotten.',
  ],
  shops: [
    'Every order lands on the right customer.',
    'Low stock shows up on your morning list.',
    'Invoices for business orders are drafted for you.',
  ],
  wholesale: [
    'Shops order from their own price list. No orders to type up.',
    'Every order is checked against your minimum and delivery day.',
    'Picking lists and invoices are made from the order.',
  ],
};

// síminn í "Your own system": appið hjá fyrirtækinu í hverri grein (tilbúin nöfn, eins og í flow.js)
const OWN = {
  contractors: { co: 'Northside Builders', who: 'Marek · Today', c: '#d9a35b', list: [['08:00', 'Leak at Harbor Hotel, room 214', 'Urgent', 'warn'], ['12:00', 'Bathroom at 12 Elm Road'], ['15:00', 'Photos of the finish']] },
  cleaning: { co: 'Brightway Cleaning', who: 'Ana · Thursday', c: '#6cc4c0', list: [['07:00', 'Park Lane Offices'], ['10:00', 'Lakeside Dental'], ['13:00', 'Harbor Gym', 'Photos', '']] },
  consultants: { co: 'Clearpath Advisory', who: 'Daniel · Tuesday', c: '#9db4e8', list: [['10:00', 'Session with Hill and Co'], ['13:00', 'Proposal for Brookline Studio'], ['15:00', 'Check Monday\'s summary', 'Ready', 'ok']] },
  shops: { co: 'Pine Street Goods', who: 'Olivia · Today', c: '#e39a8a', list: [['09:00', 'Pack order 5522, Riverside Cafe'], ['11:00', 'Reorder linen tea towels', 'Low stock', 'warn'], ['14:00', 'New stock on the shelves']] },
  wholesale: { co: 'Valley Foods Wholesale', who: 'James · Tuesday', c: '#a7cf7a', list: [['06:30', 'Delivery run, 6 shops'], ['07:45', 'Corner Market, order 3320', 'Confirmed', 'ok'], ['14:00', 'Picking list for Friday']] },
};
const phone = document.querySelector('[data-ix-phone]');

function simi(ind) {
  const o = OWN[ind];
  if (!phone || !o) return;
  const q = k => phone.querySelector('[data-ix-p="' + k + '"]');
  phone.style.setProperty('--brand', o.c);
  q('mark').textContent = o.co.charAt(0);
  q('co').textContent = o.co;
  q('who').textContent = o.who;
  q('list').replaceChildren(...o.list.map(r => {
    const li = document.createElement('li');
    const t = document.createElement('small'); t.textContent = r[0];
    const n = document.createElement('span'); n.textContent = r[1];
    li.append(t, n);
    if (r[2]) { const g = document.createElement('i'); g.className = 'tag' + (r[3] ? ' tag--' + r[3] : ''); g.textContent = r[2]; li.append(g); }
    return li;
  }));
}

const fl = document.getElementById('ix-flow');
const h = document.getElementById('ix-wf-h');
const ul = document.querySelector('[data-ix-saves]');
if (!fl) return;

function lina(t) {
  const li = document.createElement('li');
  li.innerHTML = '<svg aria-hidden="true"><use href="#i-hak"></use></svg>';
  const s = document.createElement('span');
  s.textContent = t;
  li.append(s);
  return li;
}

function synna(ind, flow) {
  if (!SPARAR[ind]) return;
  if (h && SETNING[flow]) h.textContent = SETNING[flow];
  if (ul) ul.replaceChildren(...SPARAR[ind].map(lina));
  simi(ind);
  document.querySelectorAll('[data-ix-cta]').forEach(a => { a.href = 'pilot.html?industry=' + ind; });
}

fl.addEventListener('xflow:pick', e => synna(e.detail.industry, e.detail.flow));
synna(fl.dataset.industry || 'contractors', fl.dataset.flow);

})();
