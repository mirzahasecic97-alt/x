// industries.html: pick an industry, answer two questions, see the recommendation and the showcase.
// Loaded after site.js (both with defer). Everything runs in the browser: nothing is sent anywhere.
// Default industry: ?industry= in the URL, then localStorage "x-grein" (shared with the home page,
// kerfid.html and pilot.html), otherwise contractors.
(() => {
  const root = document.querySelector('[data-in-cards]');
  if (!root) return;
  const LYKILL = 'x-grein';

  // ---------- connections: names as plain text, status as on tengingar.html ----------
  // st: 'ok' = planned for the first release, 'soon' = Coming soon
  const T = {
    payday: { label: 'Payday', conn: { n: 'Payday', note: 'Premium or higher', st: 'ok' } },
    dk: { label: 'DK', conn: { n: 'DK', note: 'invoices', st: 'ok' } },
    gmail: { label: 'Gmail', conn: { n: 'Gmail', note: 'send', st: 'ok' } },
    outlook: { label: 'Outlook', conn: { n: 'Outlook and Microsoft 365', st: 'ok' } },
    gcal: { label: 'Google Calendar', conn: { n: 'Google Calendar', st: 'ok' } },
    wordquotes: { label: 'Quotes in Word or Excel', conn: { n: 'Forwarding address', note: 'old quotes in', st: 'ok' } },
    excel: { label: 'Excel sheets', conn: { n: 'Excel and CSV', note: 'import', st: 'ok' } },
    pricelist: { label: 'Price lists in Excel', conn: { n: 'Excel and CSV', note: 'price lists', st: 'ok' } },
    mailorders: { label: 'Orders by email', conn: { n: 'Forwarding address', note: 'emailed orders', st: 'ok' } },
    noona: { label: 'Noona', conn: { n: 'Noona', note: 'bookings', st: 'soon' } },
    drive: { label: 'Google Drive or OneDrive', conn: { n: 'Google Drive and OneDrive', st: 'soon' } },
    woo: { label: 'WooCommerce', conn: { n: 'WooCommerce', note: 'orders', st: 'ok' } },
    woostock: { label: 'WooCommerce', conn: { n: 'WooCommerce', note: 'stock sync', st: 'soon' } },
    shopify: { label: 'Shopify', conn: { n: 'Shopify', st: 'soon' } },
    shopifystock: { label: 'Shopify', conn: { n: 'Shopify', note: 'stock sync', st: 'soon' } },
    mailchimp: { label: 'Mailchimp', conn: { n: 'Mailchimp', st: 'soon' } },
    social: { label: 'Facebook or Instagram', conn: { n: 'Facebook and Instagram', st: 'soon' } },
    pos: { label: 'A till or POS system', conn: { n: 'Store and POS systems', note: 'more to come', st: 'soon' } },
  };
  const AI = { n: 'Claude or ChatGPT', st: 'ok' };

  const PLANS = {
    '1': { key: 'solo', name: 'Solo', price: '€49', fit: '1 user.', who: 'You work alone', why: 'Solo is all you need' },
    '2-5': { key: 'team', name: 'Team', price: '€129', fit: 'Up to 5 people, same price.', who: 'You are 2 to 5 people', why: 'Team covers everyone at one price' },
    '6-20': { key: 'business', name: 'Business', price: '€299', fit: 'Up to 20 people, same price. The quick start setup is included.', who: 'You are 6 to 20 people', why: 'Business covers up to 20 people at one price, with the quick start included' },
    // more than 20: no plan on the site covers it, so we talk first
    '20+': { key: '', name: 'Let\'s talk', price: '', fit: 'The plans on the site go up to 20 people.', who: 'You are more than 20 people', why: 'we set up the plan with you on a short call' },
  };

  // ---------- the five industries: all content for the page lives here ----------
  // Sample data in the mockups is made up.
  const G = {
    contractors: {
      name: 'Contractors', full: 'Contractors (trades and renovation)',
      h2: ['Contractors.', 'Your morning in X.'],
      dayh: 'From the first enquiry',
      lead: 'Quotes in three versions, jobs in stages and an invoice for each stage. From the first enquiry to your accounting.',
      why: 'the contractor pack takes every job from the first quote to the last staged invoice',
      app: {
        co: 'Northside Builders', user: 'Sarah', date: 'Monday · 6 jobs this week',
        nav: [['i-yfirlit', 'Overview'], ['i-folk', 'Customers'], ['i-sala', 'Sales', 2], ['i-tilbod', 'Quotes', 4], ['i-verk', 'Jobs', 6], ['i-reikningur', 'Invoices'], ['i-heili', 'AI'], ['i-tengi', 'Connections']],
        stats: [['Quotes awaiting reply', '2'], ['Accepted this week', '1'], ['Ready to invoice', '€4,860']],
        list: 'Today',
        rows: [
          { t: 'Cladding at Birch Lane: stage 3', s: '08:00', done: true },
          { t: 'Measure Anna Miller\'s kitchen, 12 Elm Road', s: '10:30' },
          { t: 'Quote 1043: Harbor Hotel bathroom', tag: ['Not opened', 'warn'] },
          { t: 'Quote 1044: Porch at 7 Lake Drive, Better option', tag: ['Accepted', 'ok'] },
          { t: 'Oak Street roof: stage 2 invoice, €2,480', tag: ['Draft', ''] },
          { t: 'Crew link: today\'s jobs to Tom and Ali', tag: ['Coming soon', ''] },
        ],
        ai: [
          { m: 'Quote 1044 was accepted last night: the Better option, €6,900. The job is created with three stages and the deposit invoice is drafted. Send it?', act: ['Send', 'Check first'] },
          { me: 'And Harbor Hotel?' },
          { m: 'Quote 1043 has not been opened in 7 days. I drafted a short reminder. Send it?', act: ['Send reminder', 'Later'] },
        ],
      },
      hl: [
        { i: 'i-tilbod', h: 'Good, Better, Best', p: 'Three versions of one quote, side by side. Your customer picks one and accepts online.' },
        { i: 'i-reikningur', h: 'Staged invoices', p: 'Deposit, stages and the final invoice from one quote. Each one waits for your yes.' },
        { i: 'i-skipti', h: 'Change orders', p: 'Extra work is priced and accepted on the job, then lands on the next invoice.' },
        { i: 'i-folk', h: 'Crew link', p: 'Today\'s jobs to each worker as a link. No app and no password.', soon: true },
      ],
      day: [
        { i: 'i-sala', h: 'The enquiry', p: 'A web enquiry for a bathroom lands in Sales with the customer\'s details.' },
        { i: 'i-tilbod', h: 'Quote in three versions', p: 'X drafts Good, Better and Best from your price list. You check and send.' },
        { i: 'i-hak', h: 'Accepted online', p: 'The customer picks Better. A job is created with its stages.' },
        { i: 'i-verk', h: 'The work', p: 'Stage by stage on the job board, with change orders when the plan changes.' },
        { i: 'i-reikningur', h: 'The invoice', p: 'Each stage done: the invoice waits for your yes, then goes to DK or Payday.' },
      ],
      mods: [['Overview'], ['Customers'], ['Sales'], ['Quotes in three versions'], ['Jobs'], ['Staged invoices'], ['Change orders'], ['Crew link', 1], ['Documents', 1], ['Client portal', 1]],
      autos: [
        ['Quote not opened in 3 days: a reminder on the morning list.'],
        ['Quote accepted: a job is created and the deposit invoice is drafted.'],
        ['Stage done: the invoice for that stage waits for your yes.'],
      ],
      tools: ['payday', 'dk', 'gmail', 'outlook', 'gcal', 'wordquotes'],
    },

    cleaning: {
      name: 'Cleaning and services', full: 'Cleaning and services',
      h2: ['Cleaning and services.', 'Your month in X.'],
      dayh: 'From the first enquiry',
      lead: 'Recurring contracts with a visit schedule and a fixed monthly price. On the 1st, every contract invoice is drafted for you.',
      why: 'the cleaning pack turns each contract into scheduled visits and a monthly invoice drafted on the 1st',
      app: {
        co: 'Brightway Cleaning', user: 'Emma', date: 'Monday · 38 visits this week',
        nav: [['i-yfirlit', 'Overview'], ['i-folk', 'Customers'], ['i-tilbod', 'Quotes', 2], ['i-skjol', 'Contracts', 14], ['i-dagatal', 'Visits'], ['i-reikningur', 'Invoices'], ['i-heili', 'AI'], ['i-tengi', 'Connections']],
        stats: [['Visits today', '9'], ['Active contracts', '14'], ['Drafted for the 1st', '€11,280']],
        list: 'Today',
        rows: [
          { t: 'Lakeside Dental: twice a week', s: '07:00', done: true },
          { t: 'Park Lane Offices: weekly, moved to Thursday', tag: ['Moved', 'warn'] },
          { t: 'Quote 2017: office cleaning, Twice a week option', tag: ['Accepted', 'ok'] },
          { t: '14 contract invoices for the 1st', tag: ['Draft', ''] },
          { t: 'Harbor Gym: quality check photos', tag: ['Coming soon', ''] },
        ],
        ai: [
          { m: 'Lakeside Dental accepted Twice a week, €740 a month. The visits are on the schedule for the next 12 months. Add the contract to the run on the 1st?', act: ['Add', 'Later'] },
          { me: 'Show me the run.' },
          { m: '14 contract invoices are drafted for the 1st, €11,280 in all excl. VAT. Approve all?', act: ['Approve all', 'View'] },
        ],
      },
      hl: [
        { i: 'i-skjol', h: 'Recurring contracts', p: 'Weekly, twice a week or daily, with one fixed monthly price from your price list.' },
        { i: 'i-dagatal', h: 'Visit schedule', p: 'Every contract fills the schedule for the months ahead. Move a visit and the rest stays.' },
        { i: 'i-reikningur', h: 'Invoices on the 1st', p: 'Every contract invoice drafted on the 1st of the month. Approve all in one go.' },
        { i: 'i-verk', h: 'Quality check photos', p: 'Photos from each visit on the right contract, ready if a customer asks.', soon: true },
      ],
      day: [
        { i: 'i-sala', h: 'The enquiry', p: 'An office asks for cleaning. The details land in Sales.' },
        { i: 'i-tilbod', h: 'Three versions', p: 'Weekly, twice a week and daily side by side. The customer picks one online.' },
        { i: 'i-dagatal', h: 'On the schedule', p: 'The visits go on the schedule for the months ahead, on the days you set.' },
        { i: 'i-reikningur', h: 'The 1st of the month', p: 'Contract invoices are drafted. You approve all and they go to your accounting.' },
      ],
      mods: [['Overview'], ['Customers'], ['Quotes in three versions'], ['Recurring contracts'], ['Visit schedule'], ['Invoices'], ['Quality check photos', 1], ['Bookings', 1]],
      autos: [
        ['1st of the month: contract invoices drafted, approve all.'],
        ['Contract accepted: the visits go on the schedule for the months ahead.'],
        ['New web enquiry: a draft reply and a task for you.'],
      ],
      tools: ['payday', 'dk', 'gcal', 'outlook', 'excel', 'noona'],
    },

    consultants: {
      name: 'Consultants', full: 'Consultants',
      h2: ['Consultants.', 'Your week in X.'],
      dayh: 'From the proposal',
      lead: 'Proposals in tiers, retainers, time logged to projects and session notes with an AI summary. Every project under the right client.',
      why: 'the consultant pack keeps proposals, retainers, hours and session notes on the right client',
      app: {
        co: 'Clearpath Advisory', user: 'Daniel', date: 'Tuesday · 3 sessions today',
        nav: [['i-yfirlit', 'Overview'], ['i-folk', 'Clients'], ['i-tilbod', 'Proposals', 2], ['i-verk', 'Projects', 5], ['i-hond', 'Time'], ['i-reikningur', 'Invoices'], ['i-heili', 'AI'], ['i-tengi', 'Connections']],
        stats: [['Hours this week', '26.5'], ['Active retainers', '6'], ['To invoice', '€7,350']],
        list: 'Today',
        rows: [
          { t: 'Session with Hill and Co: pricing review', s: '10:00' },
          { t: 'Proposal 311: Brookline Studio, Standard tier', tag: ['Not opened', 'warn'] },
          { t: 'Monday\'s session notes: summary ready', tag: ['Ready', 'ok'] },
          { t: 'Retainer invoices for the 1st: 6 drafts', tag: ['Draft', ''] },
          { t: 'Client portal for Hill and Co', tag: ['Coming soon', ''] },
        ],
        ai: [
          { m: 'Summary of Monday\'s session with Hill and Co: three decisions and two next steps. Save it on the client and log 1.5 hours to the project?', act: ['Save', 'Edit first'] },
          { me: 'Anything over the retainer?' },
          { m: 'Hill and Co is 4 hours over this month. Add them to the retainer invoice, €480 excl. VAT?', act: ['Add', 'Later'] },
        ],
      },
      hl: [
        { i: 'i-tilbod', h: 'Proposals in tiers', p: 'Light, Standard and Full side by side. The client picks one and accepts online.' },
        { i: 'i-skipti', h: 'Retainers', p: 'A fixed monthly fee per client, drafted as an invoice every month.' },
        { i: 'i-hond', h: 'Time on projects', p: 'Log hours to the right project. Hours over the retainer go on the next invoice.' },
        { i: 'i-heili', h: 'Session notes', p: 'Write or paste your notes. The AI summarises them with next steps, for you to approve.' },
        { i: 'i-gatt', h: 'Client portal', p: 'Proposals, notes and invoices in one place for each client.', soon: true },
      ],
      day: [
        { i: 'i-tilbod', h: 'The proposal', p: 'Three tiers from your services. You check and send.' },
        { i: 'i-hak', h: 'Accepted', p: 'The client picks Standard. A project and a retainer are set up.' },
        { i: 'i-hond', h: 'The work', p: 'Hours logged to the project as you go.' },
        { i: 'i-heili', h: 'After each session', p: 'Notes with an AI summary and next steps, saved on the client.' },
        { i: 'i-reikningur', h: 'The invoice', p: 'The retainer plus extra hours, drafted for your yes and sent to your accounting.' },
      ],
      mods: [['Overview'], ['Clients'], ['Proposals in tiers'], ['Retainers'], ['Projects and time'], ['Session notes'], ['Invoices'], ['Client portal', 1], ['Documents', 1]],
      autos: [
        ['Proposal accepted: a project and the first retainer invoice are created.'],
        ['After a session: a summary and next steps on the right client, for you to approve.'],
        ['Month end: hours over the retainer go on a draft invoice.'],
        ['Proposal not opened in 3 days: a reminder on the morning list.'],
      ],
      tools: ['payday', 'dk', 'gmail', 'outlook', 'gcal', 'drive'],
    },

    shops: {
      name: 'Shops', full: 'Shops',
      h2: ['Shops.', 'Your shop in X.'],
      dayh: 'From the order',
      lead: 'Webshop orders and customers come into X, business customers get quotes from the same price list, and low stock shows on the morning list.',
      why: 'the shop pack brings webshop orders, business quotes and stock alerts into one place',
      app: {
        co: 'Pine Street Goods', user: 'Olivia', date: 'Saturday · 12 webshop orders since Friday',
        nav: [['i-yfirlit', 'Overview'], ['i-folk', 'Customers'], ['i-verslun', 'Orders', 12], ['i-vorur', 'Products'], ['i-tilbod', 'Quotes', 3], ['i-reikningur', 'Invoices'], ['i-heili', 'AI'], ['i-tengi', 'Connections']],
        stats: [['Orders today', '12'], ['Business quotes', '3'], ['Low stock', '4']],
        list: 'Today',
        rows: [
          { t: 'Order 5521 from the webshop: 3 items, €86', tag: ['New', 'ok'] },
          { t: 'Bulk quote for Riverside Cafe: 40 mugs, €520', tag: ['Not opened', 'warn'] },
          { t: 'Linen tea towel: 3 left', tag: ['Low stock', 'warn'] },
          { t: 'New customer from the webshop: Ben Carter', s: '09:12' },
          { t: 'Newsletter: autumn offers', tag: ['Coming soon', ''] },
        ],
        ai: [
          { m: 'Riverside Cafe has not opened the quote for 40 mugs, €520, in 4 days. Send a short reminder?', act: ['Send reminder', 'Later'] },
          { me: 'What is running low?' },
          { m: '4 products are below your limit. The linen tea towel has 3 left, and 2 orders this week included it.', act: ['View list', 'Later'] },
        ],
      },
      hl: [
        { i: 'i-folk', h: 'Customers and business quotes', p: 'Every customer in one place. Businesses get quotes from your own price list.' },
        { i: 'i-verslun', h: 'Webshop orders', p: 'Orders and customers come in from WooCommerce. Shopify is coming soon.' },
        { i: 'i-vorur', h: 'Stock low alerts', p: 'Set a limit per product. When stock drops below it, you see it on the morning list.' },
        { i: 'i-postur', h: 'Newsletters', p: 'Offers to your customers, written with the AI, sent when you say yes.', soon: true },
      ],
      day: [
        { i: 'i-verslun', h: 'The order', p: 'An order comes in from the webshop. The customer is saved in X.' },
        { i: 'i-tilbod', h: 'A business asks', p: 'A cafe wants 40 mugs. X drafts a quote from your price list.' },
        { i: 'i-vorur', h: 'Stock', p: 'A product drops below your limit. It shows on the morning list.' },
        { i: 'i-reikningur', h: 'The invoice', p: 'Business orders get an invoice draft that goes to your accounting.' },
      ],
      mods: [['Overview'], ['Customers'], ['Products and prices'], ['Business quotes'], ['Webshop orders'], ['Stock low alerts'], ['Invoices'], ['Newsletters', 1]],
      autos: [
        ['New webshop order: the customer comes into X.'],
        ['A business asks for a bulk price: a quote from your price list.'],
        ['Stock below your limit: an alert on the morning list.'],
      ],
      tools: ['woo', 'shopify', 'payday', 'dk', 'mailchimp', 'social'],
    },

    wholesale: {
      name: 'Wholesale', full: 'Wholesale (selling to shops)',
      h2: ['Wholesale.', 'Your orders in X.'],
      dayh: 'From the reorder',
      lead: 'For a small wholesaler selling to shops. Your shops reorder from their own price list, with your minimum order and delivery days, and the invoices go to your accounting.',
      note: 'Wholesale is our newest pack, so parts of it may change. Stock and sell-through per store only show where the store or chain shares them. That depends on agreements with each of them and is not available today.',
      why: 'the wholesale pack gives your shops an ordering portal with their own price list, and sends quotes and invoices to your accounting',
      app: {
        co: 'Valley Foods Wholesale', user: 'James', date: 'Monday · delivery day for 6 shops',
        nav: [['i-yfirlit', 'Overview'], ['i-verslun', 'Shops'], ['i-vorur', 'Orders', 11], ['i-lag', 'Products'], ['i-tilbod', 'Quotes', 1], ['i-reikningur', 'Invoices'], ['i-heili', 'AI'], ['i-tengi', 'Connections']],
        stats: [['Orders in', '11'], ['To deliver today', '6'], ['Invoice drafts', '€9,780']],
        list: 'This morning',
        rows: [
          { t: 'Corner Market reordered: 14 lines, €1,240', tag: ['New', 'ok'] },
          { t: 'Hill Street Grocers: €180 of the €250 minimum', tag: ['Below minimum', 'warn'] },
          { t: 'Delivery run today: 6 shops', s: '06:30', done: true },
          { t: 'Invoice draft: Bay Deli, order 3318, €860', tag: ['Draft', ''] },
          { t: 'Stock per store from shared data', tag: ['Coming soon', ''] },
        ],
        ai: [
          { m: 'Hill Street Grocers ordered €180, under your €250 minimum. Ask them to add to the order before Tuesday\'s run?', act: ['Ask them', 'Accept anyway'] },
          { me: 'Who runs out next week?' },
          { m: '4 stores will run out of Oat crackers 200 g next week. Draft orders?', act: ['Draft orders', 'Not now'], soon: true },
        ],
      },
      hl: [
        { i: 'i-gatt', h: 'Ordering portal', p: 'Each shop reorders from its own price list, with your minimum order and delivery days.' },
        { i: 'i-reikningur', h: 'Quotes and invoices', p: 'Quotes for new shops, invoices for every order, sent to your accounting.' },
        { i: 'i-heili', h: 'Reorder suggestions', p: 'The AI suggests draft orders before a shop runs out. Nothing goes out without your approval.', soon: true },
        { i: 'i-skyrsla', h: 'Stock per store', p: 'Stock and sell-through per store, only where the store or chain shares it. Depends on agreements.', soon: true },
        { i: 'i-skipti', h: 'Webshop stock sync', p: 'Stock kept in step with your Shopify or WooCommerce shop.', soon: true },
      ],
      day: [
        { i: 'i-gatt', h: 'The reorder', p: 'A shop orders in the portal from its own price list.' },
        { i: 'i-hak', h: 'Checked', p: 'Minimum order and delivery day are checked. You confirm the order.' },
        { i: 'i-dagatal', h: 'The delivery run', p: 'Confirmed orders go on the run for their delivery day.' },
        { i: 'i-reikningur', h: 'The invoice', p: 'An invoice draft for each order, sent to your accounting when you say yes.' },
        { i: 'i-heili', h: 'Next week', p: 'A draft reorder for the shops about to run out, for your approval.', soon: true },
      ],
      mods: [['Overview'], ['Shops and customers'], ['Products and price lists'], ['Ordering portal'], ['Quotes'], ['Invoices'], ['Reorder suggestions', 1], ['Stock per store', 1], ['Webshop stock sync', 1]],
      autos: [
        ['A shop orders below the minimum: you see it before you confirm.'],
        ['Order confirmed: an invoice draft waits for your yes.'],
        ['A shop is about to run out: a draft order for your approval.', 1],
      ],
      tools: ['dk', 'payday', 'pricelist', 'mailorders', 'woostock', 'shopifystock', 'pos'],
    },
  };
  const KEYS = Object.keys(G);
  const ALIAS = {
    contractor: 'contractors', trades: 'contractors', renovation: 'contractors',
    cleaners: 'cleaning', services: 'cleaning', service: 'cleaning',
    consultant: 'consultants', shop: 'shops', retail: 'shops',
    wholesaler: 'wholesale', distributor: 'wholesale', distribution: 'wholesale', b2b: 'wholesale',
  };

  // ---------- helpers ----------
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c]));
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const ic = id => '<svg aria-hidden="true"><use href="#' + id + '"></use></svg>';
  const SOON = '<span class="tag">Coming soon</span>';
  const chip = (n, soon, note) => '<span class="chip' + (soon ? ' soon' : '') + '"><span>' + esc(n) + '</span>' + (note ? ' <small>' + esc(note) + '</small>' : '') + (soon ? '<span class="sr"> (Coming soon)</span>' : '') + '</span>';
  const connChip = c => chip(c.n, c.st === 'soon', c.note);

  // ---------- state ----------
  const cards = $$('[data-in]');
  const toolsBox = $('[data-in-tools]');
  const valdTol = new Set();
  let grein = null;

  const lesa = () => {
    let q = (new URLSearchParams(location.search).get('industry') || '').toLowerCase();
    q = ALIAS[q] || q;
    if (KEYS.includes(q)) return q;
    try { const v = localStorage.getItem(LYKILL); if (KEYS.includes(v)) return v; } catch (e) { /* storage blocked */ }
    return KEYS[0];
  };
  const staerd = () => { const r = document.querySelector('input[name="size"]:checked'); return r ? r.value : '2-5'; };

  // ---------- rendering ----------
  const renderApp = a => {
    const nav = a.nav.map((n, i) => '<div class="app__nav' + (i === 0 ? ' on' : '') + '">' + ic(n[0]) + '<span>' + esc(n[1]) + '</span>' + (n[2] ? '<em>' + n[2] + '</em>' : '') + '</div>').join('');
    const stats = a.stats.map(s => '<div class="stat"><small>' + esc(s[0]) + '</small><b>' + esc(s[1]) + '</b></div>').join('');
    const rows = a.rows.map(r => '<div class="row"><i class="tick' + (r.done ? ' done' : '') + '"></i><span>' + esc(r.t) + '</span>' +
      (r.tag ? '<span class="tag' + (r.tag[1] ? ' tag--' + r.tag[1] : '') + '">' + esc(r.tag[0]) + '</span>' : '<small>' + esc(r.s || '') + '</small>') + '</div>').join('');
    const ai = a.ai.map(m => m.me
      ? '<div class="msg msg--me"><span>' + esc(m.me) + '</span></div>'
      : '<div class="msg' + (m.soon ? ' in-msg--soon' : '') + '">' + (m.soon ? '<span class="tag in-msg__tag">Coming soon</span>' : '') + '<span>' + esc(m.m) + '</span>' +
        (m.act ? '<div class="msg__act">' + m.act.map(b => '<button tabindex="-1" type="button"><span>' + esc(b) + '</span></button>').join('') + '</div>' : '') + '</div>').join('');
    return '<div class="app__bar"><i></i><i></i><i></i><span class="app__url">app.x.is</span></div>' +
      '<div class="app__body">' +
      '<aside class="app__side"><div class="app__co"><b>' + esc(a.co.charAt(0)) + '</b>' + esc(a.co) + '</div>' + nav + '</aside>' +
      '<div class="app__main"><div><div class="app__hi"><span>Good morning, ' + esc(a.user) + '</span></div><div class="app__date"><span>' + esc(a.date) + '</span></div></div>' +
      '<div class="app__stats">' + stats + '</div>' +
      '<div class="app__list"><h4><span>' + esc(a.list) + '</span></h4>' + rows + '</div></div>' +
      '<aside class="app__ai"><div class="app__aihead"><img alt="" src="assets/merki/merki.svg"/>X<small>AI</small></div>' + ai +
      '<div class="app__input"><span>Ask X...</span></div></aside>' +
      '</div>';
  };

  const renderShow = g => {
    const d = G[g];
    $('[data-in-kicker]').textContent = 'Your X: ' + d.name;
    $('[data-in-h2]').innerHTML = esc(d.h2[0]) + '<br/> <span class="metal">' + esc(d.h2[1]) + '</span>';
    $('[data-in-lead]').textContent = d.lead;
    $('[data-in-dayh]').innerHTML = esc(d.dayh) + '<br/> <span class="metal">to the invoice.</span>';
    $('[data-in-app]').innerHTML = renderApp(d.app);
    const note = $('[data-in-note]');
    note.hidden = !d.note; note.textContent = d.note || '';
    $('[data-in-hl]').innerHTML = d.hl.map(h => '<div class="mod edge"><span class="mod__ic">' + ic(h.i) + '</span><h3>' + esc(h.h) + '</h3><p>' + esc(h.p) + '</p>' + (h.soon ? SOON : '') + '</div>').join('');
    const steps = $('[data-in-steps]');
    steps.style.setProperty('--n', d.day.length);
    steps.innerHTML = d.day.map((s, i) => '<li class="fstep edge"><div class="fstep__top"><span class="mod__ic">' + ic(s.i) + '</span><span class="fstep__n">' + String(i + 1).padStart(2, '0') + '</span></div><h3>' + esc(s.h) + '</h3><p>' + esc(s.p) + '</p>' + (s.soon ? SOON : '') + '</li>').join('');
    $('[data-in-mods]').innerHTML = d.mods.map(m => chip(m[0], m[1])).join('');
    $('[data-in-autos]').innerHTML = d.autos.map(a => '<li>' + ic('i-sjalfvirkni') + '<span>' + esc(a[0]) + (a[1] ? ' ' + SOON : '') + '</span></li>').join('');
    $('[data-in-conns]').innerHTML = d.tools.map(t => connChip(T[t].conn)).concat(connChip(AI)).join('');
  };

  const renderTools = g => {
    toolsBox.innerHTML = G[g].tools.map(t => '<label class="in-pill"><input name="tools" type="checkbox" value="' + t + '"' + (valdTol.has(t) || valdTol.has(T[t].label) ? ' checked' : '') + '/><span>' + esc(T[t].label) + '</span></label>').join('');
  };

  const renderRec = () => {
    const d = G[grein];
    const p = PLANS[staerd()];
    $('[data-in-plan]').textContent = p.name;
    $('[data-in-price]').textContent = p.price;
    $('[data-in-pricebox]').hidden = !p.price;
    $('[data-in-fit]').textContent = p.fit;
    $('[data-in-why]').textContent = p.key
      ? p.who + ', so ' + p.why + ', and ' + d.why + '.'
      : p.who + ', so ' + p.why + '. ' + d.why.charAt(0).toUpperCase() + d.why.slice(1) + '.';
    $('[data-in-rmods]').innerHTML = d.mods.map(m => chip(m[0], m[1])).join('');
    const valin = Array.from(toolsBox.querySelectorAll('input:checked')).map(i => i.value);
    const sed = new Set();
    const conns = [];
    valin.forEach(t => { const c = T[t].conn; const k = c.n + '|' + (c.note || ''); if (!sed.has(k)) { sed.add(k); conns.push(c); } });
    conns.push(AI);
    $('[data-in-rconns]').innerHTML = conns.map(connChip).join('') +
      (valin.length ? '' : '<span class="in-rec__hint">Tick what you use today to see what to connect.</span>');
    // every button on the page carries the industry, the plan and the size to pilot.html
    // and the ticked tools as ?tools=, which pilot.html ticks or puts in "Other tools"
    const verkf = [...new Set(valin.map(t => T[t].label))];
    const extra = 'industry=' + grein + (p.key ? '&plan=' + p.key : '') + '&size=' + encodeURIComponent(staerd()) +
      (verkf.length ? '&tools=' + verkf.map(encodeURIComponent).join(',') : '');
    $$('[data-in-cta]').forEach(a => { a.href = 'pilot.html?' + extra; });
    $$('[data-in-call]').forEach(a => { a.href = 'pilot.html?call=1&' + extra; });
    // more than 20: the call is the next step in the recommendation
    const tala = !p.key;
    $('[data-in-rcta]').hidden = tala;
    $('[data-in-rcall]').hidden = !tala;
  };

  const velja = (g, vista) => {
    if (!G[g]) return;
    grein = g;
    cards.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.in === g)));
    renderTools(g);
    renderShow(g);
    renderRec();
    if (vista) {
      try { localStorage.setItem(LYKILL, g); } catch (e) { /* storage blocked */ }
      try {
        const u = new URL(location.href);
        u.searchParams.set('industry', g);
        history.replaceState(null, '', u.search + u.hash);
      } catch (e) { /* file:// or blocked history */ }
    }
  };

  cards.forEach(c => c.addEventListener('click', () => velja(c.dataset.in, true)));
  $$('input[name="size"]').forEach(r => r.addEventListener('change', renderRec));
  toolsBox.addEventListener('change', e => {
    const i = e.target;
    if (!i || i.name !== 'tools') return;
    const lbl = T[i.value].label;
    if (i.checked) { valdTol.add(i.value); valdTol.add(lbl); } else { valdTol.delete(i.value); valdTol.delete(lbl); }
    renderRec();
  });

  document.documentElement.classList.add('in-js');
  // an industry from the URL is also saved, so pilot.html and kerfid.html follow it
  const fyrst = lesa();
  const urlGrein = new URLSearchParams(location.search).get('industry');
  velja(fyrst, false);
  if (urlGrein) { try { localStorage.setItem(LYKILL, fyrst); } catch (e) { /* storage blocked */ } }
})();
