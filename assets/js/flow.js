// X: live workflow demo, drawn like a node canvas.
// Markup: <div class="xflow" data-flow="contractors-service"></div>
// Load after site.js, both with defer. Styles: assets/css/flow.css. Icons come from the page's <svg> sprite.
// Every company, person and amount below is made up. Status follows SIDUR.md:
// tasks on the crew's phones, the work diary, quality photos, supplier matching and store data are Coming soon.
(() => {
  'use strict';

  // ---------- data: one object, six flows ----------
  // path: node ids in run order. A branch is { yes: id, no: id, take: 'yes' | 'no' } right after a decision node (dec: 1).
  // side: extra nodes outside the run, drawn dashed (for example a Coming soon data source).
  // Node: t title, s subtitle, ic icon, tag 'soon' | 'ok', trig trigger, chip label on the packet that arrives,
  // cap step caption, in / does / out plain words, mi / mo small mock of what goes in / comes out, note fine print.
  const acct = (chip, who, out, row) => ({
    t: 'Accounting', s: 'DK or Payday', ic: 'i-tengi', chip,
    cap: 'The approved invoice goes to DK or Payday.',
    in: 'The invoice ' + who + ' approved.',
    does: 'X sends it to your accounting system, where it is issued as usual.',
    out, mo: { k: 'rows', rows: [row] },
  });

  const FLOWS = {
    'contractors-service': {
      label: 'Contractors: service jobs', name: 'Service jobs', co: 'Northside Builders',
      path: ['list', 'split', 'brief', 'send', 'reply', 'back', 'over', { yes: 'note', no: 'done', take: 'yes' }, 'supplier', 'invoice'],
      nodes: {
        list: {
          t: 'Day list in', s: 'Pasted from Messenger', ic: 'i-spjall', trig: 1,
          cap: 'Sarah sends X the day\'s list.',
          in: 'Sarah\'s list for the day, written in Messenger.',
          mi: { k: 'msg', from: 'Sarah', via: 'Messenger', time: '06:50', lines: ['Today:', '1. Leak at Harbor Hotel room 214, urgent.', '2. Replace water heater at 40 Hill Road.', '3. Check radiators at Westgate Market.'] },
          does: 'Sarah pastes the list into X, or sends it to her jobs address. Once, for the whole crew.',
          out: 'One message with three jobs in it.',
          note: 'Apps cannot read personal Messenger chats, so the list is pasted or forwarded.',
        },
        split: {
          t: 'Split by urgency', s: 'One task per job', ic: 'i-lag', chip: '1 message',
          cap: 'X splits the list into tasks, most urgent first.',
          in: 'Sarah\'s message, as she wrote it.',
          does: 'X makes one task per job, sorts them by urgency and puts each one on the right worker\'s list.',
          out: 'Three tasks, each with a job number and a worker.',
          mo: { k: 'rows', rows: [['1042', 'Leak at Harbor Hotel, room 214', 'Marek', 'Urgent', 'warn'], ['1043', 'Water heater, 40 Hill Road', 'Tomas', 'Today'], ['1044', 'Radiators, Westgate Market', 'Ana', 'Routine']] },
        },
        brief: {
          t: 'Job brief', s: 'History and estimate', ic: 'i-tilbod', chip: '3 tasks',
          cap: 'X writes a short brief for each job.',
          in: 'Job 1042 and what X already knows about the address.',
          does: 'Before anyone calls it a quick one: the client\'s photos, past visits, a checklist and an estimate.',
          out: 'A brief for each job. Here, job 1042.',
          mo: { k: 'card', title: 'Job 1042 · Harbor Hotel, room 214', rows: [['Client photos', '2'], ['Past visits', '3'], ['Checklist', 'Access, shut-off valve, parts'], ['Estimate', '1 h']] },
        },
        send: {
          t: 'Marek\'s task', s: 'By link or WhatsApp', ic: 'i-spjall', tag: 'soon', chip: '3 briefs',
          cap: 'Marek gets his task and the brief on his phone.',
          in: 'Job 1042 and its brief.',
          does: 'X sends the task to Marek\'s phone with the brief. Sarah checks it before it goes out.',
          out: 'The task on Marek\'s phone.',
          mo: { k: 'msg', x: 1, from: 'Northside Builders', via: 'Text message link', time: '07:05', lines: ['Urgent: leak at Harbor Hotel, room 214.', 'Estimate: 1 h.', 'Check: access, shut-off valve, parts.'] },
          note: 'A text message with a private link, no app and no login. On WhatsApp once Meta approves X.',
        },
        reply: {
          t: 'Marek on the job', s: 'Started, note and photo', ic: 'i-verk', tag: 'soon', chip: 'Task',
          cap: 'Marek taps Started, then sends a voice note and a photo.',
          in: 'The task on his phone.',
          does: 'Marek taps Started when he begins and answers the way he likes: text, a voice note or a photo.',
          out: 'Started at 08:10, a voice note and a photo of the wall.',
          mo: { k: 'msg', from: 'Marek', via: 'Text message link', time: '11:50', voice: '0:12', photo: 'Wall behind the shower', lines: ['The leak is inside the wall behind the shower. I have to take off a panel.'] },
        },
        back: {
          t: 'Work diary and hours', s: 'Start, finish, photos', ic: 'i-bok', tag: 'soon', chip: 'Started + photo',
          cap: 'X fills in the work diary and the hours.',
          in: 'Marek\'s start time, his voice note and his photo.',
          does: 'X writes out the voice note and keeps the work diary per job and the hours per worker.',
          out: 'Marek\'s day in the diary, with his hours.',
          mo: { k: 'diary', rows: [['1042', 'Started 08:10, photo', '3 h 40 min so far'], ['Marek', 'End of day, 08:00 to 15:30', '7 h 30 min']] },
          note: 'Sarah approves the hours. X does not track location.',
        },
        over: {
          t: 'Over estimate?', s: 'Planned against actual', ic: 'i-sala', dec: 1, chip: '3 h 40',
          cap: 'X checks the time on the job against the estimate.',
          in: 'Job 1042: 1 h planned, 3 h 40 min so far.',
          does: 'Over the estimate: X flags it and drafts a note. Within it: the job is marked done.',
          out: 'Yes. 2 h 40 min over.',
          mo: { k: 'split', yes: 'Draft a note to the client', no: 'Mark the job done', take: 'yes' },
        },
        note: {
          t: 'Note to client', s: 'Harbor Hotel', ic: 'i-postur', tag: 'ok', chip: '+2 h 40',
          cap: 'X drafts a note to Harbor Hotel. It waits for your OK.',
          in: 'The overrun, Marek\'s answer and his photo.',
          does: 'X drafts a short note with the reason and the photo. Nothing goes out until Sarah says yes.',
          out: 'A draft, waiting for Sarah.',
          mo: { k: 'draft', to: 'Harbor Hotel', text: 'The leak is inside the wall behind the shower, so a panel had to come off. Photo attached.', act: ['Approve', 'Edit'] },
        },
        done: {
          t: 'Marked done', s: 'Within estimate', ic: 'i-hak',
          cap: 'Within the estimate, the job is simply marked done.',
          in: 'A job that finished within its estimate.',
          does: 'Nothing to explain to the client. The job shows as done on the board, with the photo.',
          out: 'The job on the board as done.',
        },
        supplier: {
          t: 'Supplier invoice', s: 'Matched by job number', ic: 'i-vorur', tag: 'soon', chip: 'Invoice 77812',
          cap: 'A supplier invoice is matched to its job by the job number.',
          in: 'Supplier invoice 77812. Tomas gave job number 1043 at the counter.',
          does: 'When the invoice reaches DK or Payday, X reads the job number on it and puts the materials on that job.',
          out: '€186 of materials on job 1043.',
          mo: { k: 'rows', rows: [['77812', 'Water heater and fittings', '€186', 'Job 1043', 'ok']] },
          note: 'Depends on reading supplier invoices through the accounting connection.',
        },
        invoice: {
          t: 'Invoice draft', s: 'To DK or Payday', ic: 'i-reikningur', tag: 'ok', chip: '€186',
          cap: 'The invoice for job 1043 waits for your OK, then goes to DK or Payday.',
          in: 'Hours and materials on job 1043.',
          does: 'X drafts the client invoice with hours and materials together, so nothing is left out. Sarah approves it.',
          out: 'An invoice draft, waiting for Sarah.',
          mo: { k: 'inv', title: 'Invoice draft · 40 Hill Road', lines: [['Labour, Tomas', '3 h'], ['Materials, supplier invoice 77812', '€186']], foot: ['Goes to', 'DK or Payday'] },
        },
      },
    },

    'contractors-quote': {
      label: 'Contractors: quotes', name: 'Quote to invoice', co: 'Northside Builders',
      path: ['enq', 'quote', 'wait', { yes: 'remind', no: 'opened', take: 'yes' }, 'accept', 'job', 'stage', 'acct'],
      nodes: {
        enq: {
          t: 'Enquiry in', s: 'Web form', ic: 'i-postur', trig: 1,
          cap: 'Harbor Hotel asks for a price on the web form.',
          in: 'A message from the form on your website.',
          mi: { k: 'msg', from: 'Harbor Hotel', via: 'Web form', time: '09:14', lines: ['We want to renovate the bathroom in room 118. Could you send us a price?'] },
          does: 'X saves the customer and the enquiry in Sales.',
          out: 'A new lead in Sales, with the job and the address.',
        },
        quote: {
          t: 'Quote in 3 versions', s: 'From your price list', ic: 'i-tilbod', chip: '1 enquiry',
          cap: 'X drafts Good, Better and Best from your price list.',
          in: 'The enquiry and your price list.',
          does: 'X drafts three versions side by side. Sarah checks the quote and sends it.',
          out: 'Quote 1043 with three options.',
          mo: { k: 'tiers', opts: [['Good', 'Retile, new fittings', '€6,400'], ['Better', 'Adds a walk-in shower', '€8,900'], ['Best', 'Adds a heated floor', '€11,200']] },
        },
        wait: {
          t: 'No answer in 3 days?', s: 'Quote not opened', ic: 'i-sala', dec: 1, chip: 'Quote 1043',
          cap: 'Three days on, X checks if the quote has been opened.',
          in: 'Quote 1043, sent on Monday.',
          does: 'Not opened in 3 days: X drafts a reminder. Opened: nothing to do.',
          out: 'Yes. Not opened yet.',
          mo: { k: 'split', yes: 'Draft a reminder', no: 'Wait for the answer', take: 'yes' },
        },
        remind: {
          t: 'Reminder drafted', s: 'Email to Harbor Hotel', ic: 'i-postur', tag: 'ok', chip: 'Day 3',
          cap: 'X drafts a short reminder. It waits for your OK.',
          in: 'A quote nobody has opened.',
          does: 'X writes a short, friendly reminder in Sarah\'s name. It goes out when she says yes.',
          out: 'A reminder, waiting for Sarah.',
          mo: { k: 'draft', to: 'Harbor Hotel', text: 'Just checking that our quote for the bathroom in room 118 reached you. Happy to answer any questions. Sarah, Northside Builders', act: ['Send', 'Edit'] },
        },
        opened: {
          t: 'Opened', s: 'No reminder needed', ic: 'i-hak',
          cap: 'The quote was opened, so no reminder is needed.',
          in: 'A quote the customer has opened.',
          does: 'X leaves it alone and waits for the answer.',
          out: 'Nothing to send.',
        },
        accept: {
          t: 'Accepted on phone', s: 'Picks Better', ic: 'i-verk', chip: 'Reminder',
          cap: 'The hotel opens the quote on a phone and accepts Better.',
          in: 'The link to quote 1043.',
          does: 'The customer compares the three options on the phone and accepts one. No login, no printing.',
          out: 'Better accepted: €8,900.',
          mo: { k: 'tiers', pick: 1, foot: 'Accepted on a phone, 14:22', opts: [['Good', 'Retile, new fittings', '€6,400'], ['Better', 'Adds a walk-in shower', '€8,900'], ['Best', 'Adds a heated floor', '€11,200']] },
        },
        job: {
          t: 'Job with stages', s: '3 stages', ic: 'i-lag', chip: '€8,900',
          cap: 'A job is created with its stages.',
          in: 'The accepted option.',
          does: 'X creates the job and splits the price into the stages you set for this kind of work.',
          out: 'Three stages, each with its share of the price.',
          mo: { k: 'rows', rows: [['1', 'Strip out and plumbing', '€2,670', '30%'], ['2', 'Tiling and shower', '€4,450', '50%'], ['3', 'Fittings and finish', '€1,780', '20%']] },
        },
        stage: {
          t: 'Stage invoice', s: 'Stage 1 of 3', ic: 'i-reikningur', tag: 'ok', chip: 'Stage 1 done',
          cap: 'Stage 1 is done. Its invoice waits for your OK.',
          in: 'Stage 1 marked done on the job.',
          does: 'X drafts the invoice for that stage. Each one waits for Sarah\'s yes.',
          out: 'An invoice draft for €2,670 excl. VAT.',
          mo: { k: 'inv', title: 'Invoice draft · Harbor Hotel', lines: [['Stage 1: strip out and plumbing', '€2,670']], foot: ['Total excl. VAT', '€2,670'] },
        },
        acct: acct('€2,670', 'Sarah', 'The invoice in DK or Payday.', ['INV', 'Harbor Hotel, stage 1 of 3', '€2,670', 'Sent', 'ok']),
      },
    },

    cleaning: {
      label: 'Cleaning', name: 'Contract cleaning', co: 'Brightway Cleaning',
      path: ['contract', 'sched', 'check', 'visit', 'first', 'approve', 'acct'],
      nodes: {
        contract: {
          t: 'Contract', s: 'Weekly office cleaning', ic: 'i-skjol', trig: 1,
          cap: 'Park Lane Offices signs up for weekly cleaning.',
          in: 'The accepted quote: weekly, on Thursdays.',
          does: 'X saves the contract with its fixed monthly price from Emma\'s price list.',
          out: 'A recurring contract.',
          mo: { k: 'card', title: 'Park Lane Offices', rows: [['Plan', 'Weekly, Thursdays 07:00'], ['Price', '€390 a month'], ['First visit', 'Thursday 3 December']] },
        },
        sched: {
          t: 'Visit schedule', s: 'Next 12 months', ic: 'i-dagatal', chip: 'Weekly',
          cap: 'X puts every visit on the schedule.',
          in: 'The contract and its visit day.',
          does: 'X fills the schedule for the year ahead. Move one visit and the rest stays.',
          out: '52 visits on the schedule.',
          mo: { k: 'rows', rows: [['Thu 3 Dec', 'Park Lane Offices', '07:00', 'Ana'], ['Thu 10 Dec', 'Park Lane Offices', '07:00', 'Ana'], ['Thu 17 Dec', 'Park Lane Offices', '07:00', 'Ana']] },
        },
        check: {
          t: 'Ana\'s checklist', s: 'Today\'s list', ic: 'i-spjall', tag: 'soon', chip: '52 visits',
          cap: 'Ana gets the visit and its checklist on her phone.',
          in: 'The visit and the checklist for this office.',
          does: 'X sends the visit and its checklist to the cleaner\'s phone.',
          out: 'The checklist on Ana\'s phone.',
          mo: { k: 'msg', x: 1, from: 'Brightway Cleaning', via: 'Text message link', time: '06:30', lines: ['Park Lane Offices, Thursday 07:00.', 'Offices, kitchen, toilets, bins.'] },
          note: 'A text message with a private link, no app and no login.',
        },
        visit: {
          t: 'Done with photos', s: 'Quality check', ic: 'i-verk', tag: 'soon', chip: 'Today\'s list',
          cap: 'Ana marks the visit done and adds photos.',
          in: 'The checklist, ticked off.',
          does: 'Ana ticks the list and adds photos. X puts them on the right contract, ready if the client asks, and keeps her hours in the work diary.',
          out: 'Visit done, with 3 photos.',
          mo: { k: 'msg', from: 'Ana', via: 'Text message link', time: '08:40', photo: 'Kitchen, after', lines: ['Done. All clean.'] },
        },
        first: {
          t: 'Invoices on the 1st', s: 'Every contract', ic: 'i-reikningur', chip: 'Visit done',
          cap: 'On the 1st, X drafts an invoice for every contract.',
          in: 'All active contracts for the month.',
          does: 'X drafts one invoice per contract, from the fixed monthly price.',
          out: '14 drafts, €11,280 in all excl. VAT.',
          mo: { k: 'rows', rows: [['', 'Park Lane Offices', '€390', 'Draft'], ['', 'Lakeside Dental', '€740', 'Draft'], ['', '12 more contracts', '€10,150', 'Draft']] },
        },
        approve: {
          t: 'Approve all', s: 'In one go', ic: 'i-hak', tag: 'ok', chip: '14 drafts',
          cap: 'Emma checks the run and approves all in one go.',
          in: '14 invoice drafts.',
          does: 'Emma looks over the list and approves all, or opens any one first.',
          out: '14 approved invoices.',
          mo: { k: 'draft', head: 'Invoice run · the 1st', text: '14 invoices, €11,280 in all excl. VAT.', act: ['Approve all', 'View'] },
        },
        acct: acct('€11,280', 'Emma', '14 invoices in DK or Payday.', ['14', 'Contract invoices', '€11,280', 'Sent', 'ok']),
      },
    },

    consultants: {
      label: 'Consultants', name: 'Proposal to invoice', co: 'Clearpath Advisory',
      path: ['prop', 'acc', 'proj', 'time', 'notes', 'inv', 'acct'],
      nodes: {
        prop: {
          t: 'Proposal', s: '3 tiers', ic: 'i-tilbod', trig: 1,
          cap: 'Daniel sends Hill and Co a proposal in three tiers.',
          in: 'Daniel\'s services and prices.',
          does: 'X drafts Light, Standard and Full side by side. Daniel checks it and sends it.',
          out: 'Proposal 312 with three tiers.',
          mo: { k: 'tiers', opts: [['Light', '4 h a month', '€500'], ['Standard', '10 h a month', '€1,200'], ['Full', '20 h a month', '€2,300']] },
        },
        acc: {
          t: 'Client accepts', s: 'Picks Standard', ic: 'i-verk', chip: '3 tiers',
          cap: 'Hill and Co accepts the Standard tier online.',
          in: 'The link to proposal 312.',
          does: 'The client compares the tiers and accepts one online.',
          out: 'Standard accepted: €1,200 a month.',
          mo: { k: 'tiers', pick: 1, foot: 'Accepted online', opts: [['Light', '4 h a month', '€500'], ['Standard', '10 h a month', '€1,200'], ['Full', '20 h a month', '€2,300']] },
        },
        proj: {
          t: 'Project and retainer', s: 'Hill and Co', ic: 'i-skipti', chip: 'Standard',
          cap: 'X sets up the project and the monthly retainer.',
          in: 'The accepted tier.',
          does: 'X creates the project under the client, with a retainer that is invoiced every month.',
          out: 'A project with a retainer.',
          mo: { k: 'card', title: 'Hill and Co · Pricing review', rows: [['Retainer', '€1,200 a month'], ['Included', '10 h a month'], ['Extra hours', '€120 an hour']] },
        },
        time: {
          t: 'Time logged', s: 'On the project', ic: 'i-hond', chip: 'Retainer',
          cap: 'Daniel logs his hours to the project as he works.',
          in: 'Hours, logged as the work happens.',
          does: 'Each entry lands on the right project and client.',
          out: '14 h this month. 4 h over the retainer.',
          mo: { k: 'rows', rows: [['Mon', 'Session: pricing review', '1.5 h'], ['Wed', 'New price model', '3 h'], ['Month', 'Logged so far', '14 h', '4 h over', 'warn']] },
        },
        notes: {
          t: 'Session notes', s: 'AI summary', ic: 'i-heili', tag: 'ok', chip: '1.5 h',
          cap: 'The AI summarises the session notes. Daniel approves the summary.',
          in: 'Daniel\'s notes from Monday\'s session, pasted in.',
          does: 'The AI writes a short summary with decisions and next steps. It is saved when Daniel approves it.',
          out: 'A summary, waiting for Daniel.',
          mo: { k: 'draft', head: 'Summary · Hill and Co, Monday', text: 'Three decisions: a new price list from January, two tiers instead of four, a review in March. Next steps: draft the price list, book the March review.', act: ['Save', 'Edit first'] },
        },
        inv: {
          t: 'Invoice draft', s: 'Retainer and extra hours', ic: 'i-reikningur', tag: 'ok', chip: '4 h over',
          cap: 'Month end: the retainer and the extra hours on one invoice draft.',
          in: 'The retainer and the 4 h over it.',
          does: 'X drafts the invoice with the retainer and the extra hours. It waits for Daniel\'s yes.',
          out: 'An invoice draft for €1,680 excl. VAT.',
          mo: { k: 'inv', title: 'Invoice draft · Hill and Co', lines: [['Retainer, Standard', '€1,200'], ['Extra hours, 4 h', '€480']], foot: ['Total excl. VAT', '€1,680'] },
        },
        acct: acct('€1,680', 'Daniel', 'The invoice in DK or Payday.', ['INV', 'Hill and Co, monthly', '€1,680', 'Sent', 'ok']),
      },
    },

    shops: {
      label: 'Shops', name: 'Orders and stock', co: 'Pine Street Goods',
      path: ['order', 'cust', 'stock', { yes: 'alert', no: 'fine', take: 'yes' }, 'inv', 'acct'],
      nodes: {
        order: {
          t: 'New order', s: 'Webshop or business', ic: 'i-verslun', trig: 1,
          cap: 'Riverside Cafe places an order.',
          in: 'An order from the WooCommerce webshop, or from a business customer.',
          mi: { k: 'rows', rows: [['5522', 'Riverside Cafe', '', 'Business'], ['40 ×', 'Stoneware mug', '€520'], ['4 ×', 'Linen tea towel', '€64']] },
          does: 'X picks up the order with its lines and the customer.',
          out: 'Order 5522: two lines, €584.',
          note: 'WooCommerce orders are planned for the first release. Shopify is coming soon.',
        },
        cust: {
          t: 'Customer record', s: 'Customers', ic: 'i-folk', chip: 'Order 5522',
          cap: 'The order lands on the customer\'s record.',
          in: 'The order and the buyer\'s details.',
          does: 'X finds the customer, or creates one, and adds the order to their history.',
          out: 'Riverside Cafe, with order 5522 on file.',
          mo: { k: 'card', title: 'Riverside Cafe', rows: [['Type', 'Business, pays by invoice'], ['Latest order', '5522, €584'], ['Earlier', 'Quote for 40 mugs, accepted']] },
        },
        stock: {
          t: 'Below your limit?', s: 'Stock check', ic: 'i-vorur', dec: 1, chip: '2 lines',
          cap: 'X checks stock after the order.',
          in: 'Stock for each product on the order.',
          does: 'Below the limit you set: an alert on the morning list. Above it: nothing to do.',
          out: 'Yes. Linen tea towel: 3 left, limit 5.',
          mo: { k: 'split', yes: 'Alert on the morning list', no: 'Nothing to do', take: 'yes' },
        },
        alert: {
          t: 'Low stock alert', s: 'On the morning list', ic: 'i-sjalfvirkni', chip: '3 left',
          cap: 'The tea towel shows on Olivia\'s morning list.',
          in: 'A product below its limit.',
          does: 'X puts it on the morning list, so Olivia can reorder in time.',
          out: 'One alert on the morning list.',
          mo: { k: 'rows', rows: [['', 'Linen tea towel', '3 left', 'Low stock', 'warn']] },
        },
        fine: {
          t: 'Stock is fine', s: 'Nothing to do', ic: 'i-hak',
          cap: 'Stock is above the limit, so nothing needs doing.',
          in: 'Products above their limit.',
          does: 'X leaves them alone.',
          out: 'Nothing on the morning list.',
        },
        inv: {
          t: 'Invoice draft', s: 'Business order', ic: 'i-reikningur', tag: 'ok', chip: 'Order 5522',
          cap: 'The invoice for the business order waits for your OK.',
          in: 'Order 5522 for Riverside Cafe.',
          does: 'Business orders get an invoice draft. It waits for Olivia\'s yes.',
          out: 'An invoice draft for €584 excl. VAT.',
          mo: { k: 'inv', title: 'Invoice draft · Riverside Cafe', lines: [['40 × Stoneware mug', '€520'], ['4 × Linen tea towel', '€64']], foot: ['Total excl. VAT', '€584'] },
        },
        acct: acct('€584', 'Olivia', 'The invoice in DK or Payday.', ['INV', 'Riverside Cafe, order 5522', '€584', 'Sent', 'ok']),
      },
    },

    wholesale: {
      label: 'Wholesale', name: 'Shop reorders', co: 'Valley Foods Wholesale',
      path: ['reorder', 'min', { yes: 'ask', no: 'conf', take: 'no' }, 'pick', 'run', 'inv', 'acct'],
      side: [{ id: 'stores', to: 'reorder' }],
      nodes: {
        stores: {
          t: 'Stock per store', s: 'Where the shop shares it', ic: 'i-skyrsla', tag: 'soon', chip: 'Suggestion',
          cap: 'Coming soon: a reorder suggestion from the shop\'s own stock data.',
          in: 'Stock and sell-through from a store, only where the store or chain shares it.',
          does: 'X would suggest a draft reorder before a shop runs out. Nothing goes out without approval.',
          out: 'A suggested reorder.',
          note: 'Not available today. It depends on agreements with each store or chain.',
        },
        reorder: {
          t: 'Shop reorders', s: 'Ordering portal', ic: 'i-gatt', trig: 1,
          cap: 'Corner Market reorders from its own price list.',
          in: 'An order in the portal, from Corner Market\'s price list.',
          mi: { k: 'rows', rows: [['3320', 'Corner Market', '€1,240', '14 lines']] },
          does: 'The shop orders in the portal. Prices come from its own price list.',
          out: 'Order 3320: 14 lines, €1,240.',
        },
        min: {
          t: 'Below minimum?', s: 'Minimum and delivery day', ic: 'i-sala', dec: 1, chip: '14 lines',
          cap: 'X checks the minimum order and the delivery day.',
          in: 'Order 3320: €1,240. Minimum €250. Delivery days: Tuesday and Friday.',
          does: 'Below the minimum: X drafts a note asking the shop to add more. Above it: on to the next delivery day.',
          out: 'No. Above the minimum, for Tuesday.',
          mo: { k: 'split', yes: 'Ask the shop to add more', no: 'Confirm for Tuesday', take: 'no' },
        },
        ask: {
          t: 'Ask to add more', s: 'Note to the shop', ic: 'i-postur', tag: 'ok',
          cap: 'Below the minimum, X drafts a note to the shop. It waits for your OK.',
          in: 'An order under €250.',
          does: 'X drafts a short note asking the shop to add to the order before the run.',
          out: 'A note, waiting for James.',
        },
        conf: {
          t: 'Order confirmed', s: 'Tuesday\'s run', ic: 'i-hak', tag: 'ok', chip: '€1,240',
          cap: 'James confirms the order for Tuesday\'s run.',
          in: 'An order above the minimum.',
          does: 'James confirms the order. It goes on the run for its delivery day.',
          out: 'Order 3320, confirmed for Tuesday.',
        },
        pick: {
          t: 'Picking list', s: 'By shelf', ic: 'i-verk', chip: 'Tuesday',
          cap: 'X makes the picking list for the run.',
          in: 'All confirmed orders for Tuesday.',
          does: 'X lists every line, sorted by shelf, so the van is packed in one walk.',
          out: 'A picking list for Tuesday.',
          mo: { k: 'rows', rows: [['A3', 'Oat crackers 200 g', '12'], ['B1', 'Apple juice 1 l', '24'], ['C4', 'Rye bread', '18'], ['', '11 more lines', '']] },
        },
        run: {
          t: 'Delivery run', s: 'Tuesday 06:30', ic: 'i-dagatal', chip: 'Picking list',
          cap: 'The orders go out on Tuesday\'s delivery run.',
          in: 'Confirmed orders and the shops on the route.',
          does: 'X lists the stops for the run, in order.',
          out: '6 shops on Tuesday\'s run.',
          mo: { k: 'rows', rows: [['1', 'Bay Deli', '06:30'], ['2', 'Hill Street Grocers', '07:10'], ['3', 'Corner Market', '07:45', 'Order 3320'], ['', '3 more stops', '']] },
        },
        inv: {
          t: 'Invoice draft', s: 'Order 3320', ic: 'i-reikningur', tag: 'ok', chip: 'Delivered',
          cap: 'The invoice for order 3320 waits for your OK.',
          in: 'Order 3320, delivered.',
          does: 'X drafts the invoice from the shop\'s price list. It waits for James\'s yes.',
          out: 'An invoice draft for €1,240 excl. VAT.',
          mo: { k: 'inv', title: 'Invoice draft · Corner Market', lines: [['Order 3320, 14 lines', '€1,240']], foot: ['Total excl. VAT', '€1,240'] },
        },
        acct: acct('€1,240', 'James', 'The invoice in DK or Payday.', ['INV', 'Corner Market, order 3320', '€1,240', 'Sent', 'ok']),
      },
    },
  };

  // ---------- helpers ----------
  const TAG = { soon: ['Coming soon', 'xf-tag--soon'], ok: ['Waits for your OK', 'xf-tag--ok'] };
  const TRAVEL = 1150, RUN = 480, DWELL = 3500, END = 2600, TWEEN = 380;
  const NS = 'http://www.w3.org/2000/svg';
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c]));
  const ico = id => `<svg aria-hidden="true" focusable="false"><use href="#${id}"></use></svg>`;
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const lerp = (a, b, k) => a + (b - a) * k;
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const svgEl = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  let uid = 0;

  const I_BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6"/></svg>';
  const I_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"/></svg>';
  const I_PLAY = '<svg class="xf-i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5.5v13l11-6.5z"/></svg>';
  const I_PAUSE = '<svg class="xf-i-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>';
  const WAVE = [6, 11, 15, 8, 13, 17, 10, 6, 12, 16, 8, 11, 14, 7, 10, 13, 6, 9, 12, 7];

  // ---------- small mocks of the data in and out ----------
  const rowsHTML = rows => `<div class="xf-rows">${rows.map(r => `<div class="xf-row">${r[0] ? `<span class="xf-row__k">${esc(r[0])}</span>` : ''}<span class="xf-row__t">${esc(r[1])}</span>${r[2] ? `<span class="xf-row__m">${esc(r[2])}</span>` : ''}${r[3] ? `<span class="tag${r[4] ? ' tag--' + r[4] : ''}">${esc(r[3])}</span>` : ''}</div>`).join('')}</div>`;

  function msgHTML(m) {
    const head = `<div class="xf-msg__h"><b>${esc(m.from)}</b><span>${esc([m.via, m.time].filter(Boolean).join(' · '))}</span></div>`;
    const voice = m.voice ? `<div class="xf-voice"><span class="xf-voice__b">${I_PLAY}</span><span class="xf-wave">${WAVE.map(h => `<i style="height:${h}px"></i>`).join('')}</span><em>${esc(m.voice)}</em></div>` : '';
    const photo = m.photo ? `<div class="xf-photo"><span>Photo · ${esc(m.photo)}</span></div>` : '';
    return `<div class="xf-msg${m.x ? ' xf-msg--x' : ''}">${head}${voice}${photo}${(m.lines || []).map(l => `<p>${esc(l)}</p>`).join('')}</div>`;
  }

  function mock(m) {
    if (!m) return '';
    let h = '';
    switch (m.k) {
      case 'msg': h = msgHTML(m); break;
      case 'rows': h = rowsHTML(m.rows); break;
      case 'card':
        h = `<div class="xf-card"><b class="xf-card__h">${esc(m.title)}</b><dl>${m.rows.map(r => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl></div>`;
        break;
      case 'tiers':
        h = `<div class="xf-tiers">${m.opts.map((o, k) => `<div class="xf-tier${m.pick === k ? ' is-pick' : ''}"><b>${esc(o[0])}</b><small>${esc(o[1])}</small><em>${esc(o[2])}</em></div>`).join('')}</div>${m.foot ? `<p class="xf-mfoot"><span class="tag tag--ok">Accepted</span> ${esc(m.foot)}</p>` : ''}`;
        break;
      case 'draft':
        h = `<div class="xf-draft"><div class="xf-draft__h"><span>${esc(m.to ? 'Draft to ' + m.to : m.head)}</span><span class="xf-tag xf-tag--ok">Waits for your OK</span></div><p>${esc(m.text)}</p><div class="xf-acts">${m.act.map(a => `<span>${esc(a)}</span>`).join('')}</div></div>`;
        break;
      case 'inv':
        h = `<div class="xf-inv"><b class="xf-inv__h">${esc(m.title)}</b>${m.lines.map(l => `<div class="xf-inv__l"><span>${esc(l[0])}</span><em>${esc(l[1])}</em></div>`).join('')}${m.foot ? `<div class="xf-inv__l xf-inv__t"><span>${esc(m.foot[0])}</span><em>${esc(m.foot[1])}</em></div>` : ''}</div>`;
        break;
      case 'split':
        h = `<div class="xf-split">${['yes', 'no'].map(c => `<div class="${m.take === c ? 'is-on' : ''}"><span class="xf-cond">${c}</span><span>${esc(m[c])}</span>${m.take === c ? ico('i-hak') : ''}</div>`).join('')}</div>`;
        break;
      case 'diary':
        h = `${m.quote ? msgHTML({ from: m.from, via: m.via, x: 1, lines: [m.quote] }) : ''}<p class="xf-k xf-k--sub">Work diary</p>${rowsHTML(m.rows)}`;
        break;
      default: h = '';
    }
    return `<div class="xf-mock">${h}</div>`;
  }

  // ---------- graph: slots, edges and the run order ----------
  function graph(f) {
    const slots = [], edges = [], order = [], alts = new Set(), sides = new Set();
    let prev = [];
    f.path.forEach(item => {
      if (typeof item === 'string') {
        slots.push({ main: item });
        prev.forEach(p => edges.push({ from: p.id, to: item, kind: p.kind }));
        order.push(item);
        prev = [{ id: item, kind: 'path' }];
      } else {
        const take = item.take === 'no' ? 'no' : 'yes', other = take === 'yes' ? 'no' : 'yes';
        const main = item[take], alt = item[other], d = prev[0].id;
        slots.push({ main, alt });
        alts.add(alt);
        edges.push({ from: d, to: main, kind: 'path', cond: take });
        edges.push({ from: d, to: alt, kind: 'alt', cond: other });
        order.push(main);
        prev = [{ id: main, kind: 'path' }, { id: alt, kind: 'alt' }];
      }
    });
    (f.side || []).forEach(sd => {
      const slot = slots.find(x => x.main === sd.to);
      if (!slot) return;
      slot.side = sd.id; sides.add(sd.id);
      edges.push({ from: sd.id, to: sd.to, kind: 'side' });
    });
    edges.forEach(e => {
      e.chip = e.kind === 'path' ? (f.nodes[e.to].chip || '') : e.kind === 'side' ? (f.nodes[e.from].chip || '') : '';
      e.st = 'idle';
    });
    const nav = [];
    slots.forEach(s => { if (s.side) nav.push(s.side); nav.push(s.main); if (s.alt) nav.push(s.alt); });
    return { slots, edges, order, alts, sides, nav };
  }

  // ---------- one live workflow ----------
  class Flow {
    constructor(root) {
      this.root = root;
      this.uid = ++uid;
      this.rm = !!(mq && mq.matches);
      this.s = { i: 0, ph: 'dwell', t: 0, playing: !this.rm, manual: false, insp: null, vis: false, hov: false, foc: false };
      this.raf = 0; this.last = 0; this.tw = null; this.W = 0; this.v = false; this.open = null;
      this.frameB = now => this.frame(now);

      if ('IntersectionObserver' in window) {
        this.io = new IntersectionObserver(es => es.forEach(e => {
          const vh = window.innerHeight || 800;
          this.s.vis = e.isIntersecting && (e.intersectionRatio >= 0.3 || e.intersectionRect.height >= vh * 0.45);
          this.status(); this.kick();
        }), { threshold: [0, 0.1, 0.2, 0.3, 0.45, 0.6, 0.8, 1] });
        this.io.observe(root);
      } else this.s.vis = true;
      if ('ResizeObserver' in window) {
        this.ro = new ResizeObserver(() => {
          const w = this.el ? Math.round(this.el.canvas.clientWidth) : 0;
          if (w && Math.abs(w - this.W) > 1) this.relayout();
        });
        this.ro.observe(root);
      } else window.addEventListener('resize', () => this.relayout());

      document.addEventListener('visibilitychange', () => { this.last = 0; this.kick(); });
      // A mouse resting on the details panel pauses the run, so the text can be read. The canvas keeps playing.
      root.addEventListener('pointerover', e => {
        if (e.pointerType !== 'mouse' || this.s.hov || !e.target.closest || !e.target.closest('.xf-insp')) return;
        this.s.hov = true; this.status();
      });
      root.addEventListener('pointerout', e => {
        if (!this.s.hov) return;
        const to = e.relatedTarget;
        if (to && to.closest && to.closest('.xf-insp') && root.contains(to)) return;
        this.s.hov = false; this.status(); this.kick();
      });
      root.addEventListener('focusin', e => {
        let kb = false;
        try { kb = e.target.matches(':focus-visible'); } catch (err) { kb = true; }
        if (kb) { this.s.foc = true; this.status(); }
      });
      root.addEventListener('focusout', e => { if (!root.contains(e.relatedTarget)) { this.s.foc = false; this.status(); this.kick(); } });
      root.addEventListener('click', e => this.onClick(e));
      root.addEventListener('keydown', e => this.onKey(e));
      if (mq) {
        const ch = () => { this.rm = mq.matches; if (this.rm) { this.s.playing = false; this.s.manual = false; if (this.s.ph !== 'end') this.show(this.s.i); } this.status(); };
        if (mq.addEventListener) mq.addEventListener('change', ch); else if (mq.addListener) mq.addListener(ch);
      }

      this.load(root.dataset.flow);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.relayout());

      // Another script can switch the flow by changing data-flow (or with XFlow.set). It restarts at step 1.
      if ('MutationObserver' in window) {
        this.mo = new MutationObserver(() => {
          const k = root.dataset.flow;
          if (k && k !== this.key && FLOWS[k]) this.load(k, true);
        });
        this.mo.observe(root, { attributes: true, attributeFilter: ['data-flow'] });
      }
    }

    node(id) { return this.f.nodes[id]; }

    // Switch to another flow. user = true when someone picked it, so it plays at once.
    load(key, user) {
      // stop the old run first: no frame, tween or packet from the old flow may draw on the new one
      if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
      this.last = 0;
      if (this.followT) { clearTimeout(this.followT); this.followT = 0; }
      this.key = FLOWS[key] ? key : 'contractors-service';
      this.f = FLOWS[this.key];
      this.g = graph(this.f);
      this.root.dataset.flow = this.key;
      this.tw = null; this.open = null; this.hs = null; this.ihs = {};
      this.render();
      this.W = 0; this.placed = false; this.panelOn = null; this.cur = null;
      this.relayout();
      const s = this.s;
      s.manual = false; s.insp = null; s.hov = false;
      if (user) s.playing = !this.rm;
      this.show(0);
      this.kick();
    }

    render() {
      const f = this.f, g = this.g, N = g.order.length;
      const nodeHTML = id => {
        const n = this.node(id), k = g.order.indexOf(id);
        const fed = g.edges.some(e => e.kind === 'side' && e.to === id);
        const cls = ['xf-node', n.trig && 'is-trig', n.dec && 'is-dec', g.alts.has(id) && 'is-alt', g.sides.has(id) && 'is-side', fed && 'is-fed'].filter(Boolean).join(' ');
        const pre = k >= 0 ? `Step ${k + 1} of ${N}: ` : g.alts.has(id) ? 'Other branch, not in this run: ' : 'Side step: ';
        const tag = n.tag ? `<span class="xf-tag ${TAG[n.tag][1]}">${TAG[n.tag][0]}</span>` : '';
        // the label carries the step caption, so moving focus says it all and the live region stays quiet
        const label = `${pre}${n.t}. ${n.cap}${n.tag ? ' ' + TAG[n.tag][0] + '.' : ''}`;
        return `<button type="button" class="${cls}" data-id="${esc(id)}" tabindex="-1" aria-label="${esc(label)}"><span class="xf-node__box">${n.trig && !fed ? `<span class="xf-node__bolt">${ico('i-sjalfvirkni')}</span>` : ''}<span class="xf-node__tile">${ico(n.ic)}</span><span class="xf-node__ok">${ico('i-hak')}</span></span><span class="xf-node__txt"><b>${esc(n.t)}</b><small>${esc(n.s)}</small>${tag}</span></button>`;
      };
      const panelHTML = id => {
        const n = this.node(id);
        const tags = [n.tag && `<span class="xf-tag ${TAG[n.tag][1]}">${TAG[n.tag][0]}</span>`, g.alts.has(id) && '<span class="xf-tag xf-tag--alt">Not in this run</span>'].filter(Boolean).join('');
        return `<div class="xf-panel" data-id="${esc(id)}">
          <div class="xf-pane xf-pane--in"><p class="xf-k">In</p><p>${esc(n.in)}</p>${mock(n.mi)}</div>
          <div class="xf-pane xf-pane--node"><div class="xf-ph"><span class="xf-ph__ic">${ico(n.ic)}</span><span><b>${esc(n.t)}</b><small>${esc(n.s)}</small></span></div>${tags ? `<div class="xf-tags">${tags}</div>` : ''}<p class="xf-does">${esc(n.does)}</p>${n.note ? `<p class="xf-note">${esc(n.note)}</p>` : ''}</div>
          <div class="xf-pane xf-pane--out"><p class="xf-k">Out</p><p>${esc(n.out)}</p>${mock(n.mo)}</div>
        </div>`;
      };

      this.root.innerHTML = `<div class="xf" role="region" aria-roledescription="workflow" aria-label="Example workflow: ${esc(f.name)}, ${esc(f.co)}">
        <div class="xf-name">${ico('i-sjalfvirkni')}<b>${esc(f.name)}</b><span class="xf-co">${esc(f.co)}</span><span class="tag">Example</span></div>
        <div class="xf-bar">
          <p class="xf-cap"><span class="xf-cap__n"></span><span class="xf-cap__t"></span></p>
          <div class="xf-ctrl">
            <span class="xf-state" aria-hidden="true"><i></i><span></span></span>
            <button type="button" class="xf-btn" data-a="back" aria-label="Previous step">${I_BACK}</button>
            <button type="button" class="xf-btn xf-btn--play" data-a="play" aria-label="Pause">${I_PAUSE}${I_PLAY}</button>
            <button type="button" class="xf-btn" data-a="next" aria-label="Next step">${I_NEXT}</button>
          </div>
          <span class="xf-prog" aria-hidden="true"><i></i></span>
        </div>
        <div class="xf-canvas">
          <svg class="xf-wires" aria-hidden="true" focusable="false"></svg>
          <div class="xf-labels" aria-hidden="true"></div>
          <div class="xf-nodes" role="group" aria-label="Steps. Use the arrow keys to move between them.">${g.nav.map(nodeHTML).join('')}</div>
          <div class="xf-fly" aria-hidden="true"><i class="xf-dot"></i><span class="xf-chip"></span></div>
        </div>
        <div class="xf-insp" role="region" aria-label="What goes in and what comes out"><div class="xf-panels">${g.nav.map(panelHTML).join('')}</div></div>
        <p class="sr" aria-live="polite"></p>
      </div>`;

      const q = s => this.root.querySelector(s);
      this.el = {
        xf: q('.xf'), capN: q('.xf-cap__n'), capT: q('.xf-cap__t'), state: q('.xf-state span'), play: q('.xf-btn--play'),
        prog: q('.xf-prog i'), canvas: q('.xf-canvas'), svg: q('.xf-wires'), labels: q('.xf-labels'), fly: q('.xf-fly'),
        dot: q('.xf-dot'), chip: q('.xf-chip'), insp: q('.xf-insp'), live: q('.sr'),
      };
      this.nodeEl = {}; this.panelEl = {};
      this.root.querySelectorAll('.xf-node').forEach(b => { this.nodeEl[b.dataset.id] = b; });
      this.root.querySelectorAll('.xf-panel').forEach(p => { this.panelEl[p.dataset.id] = p; });

      // wires: base line, lit trail on the run path, ports at both ends, labels on the line
      const svg = this.el.svg;
      const fid = 'xfg' + this.uid;
      const defs = svgEl('defs', {});
      const filt = svgEl('filter', { id: fid, filterUnits: 'userSpaceOnUse', x: '-2000', y: '-2000', width: '8000', height: '8000' });
      filt.appendChild(svgEl('feGaussianBlur', { stdDeviation: '2.4', result: 'b' }));
      const merge = svgEl('feMerge', {});
      merge.appendChild(svgEl('feMergeNode', { in: 'b' }));
      merge.appendChild(svgEl('feMergeNode', { in: 'SourceGraphic' }));
      filt.appendChild(merge); defs.appendChild(filt); svg.appendChild(defs);
      const gBase = svgEl('g', {}), gTrail = svgEl('g', {}), gPort = svgEl('g', {});
      svg.append(gBase, gTrail, gPort);
      g.edges.forEach(e => {
        e.base = svgEl('path', { class: 'xf-w xf-w--' + e.kind });
        gBase.appendChild(e.base);
        if (e.kind === 'path') { e.trail = svgEl('path', { class: 'xf-tr', filter: `url(#${fid})` }); gTrail.appendChild(e.trail); }
        e.p1 = svgEl('circle', { class: 'xf-port', r: '3.4' });
        e.p2 = svgEl('circle', { class: 'xf-port', r: '3.4' });
        gPort.append(e.p1, e.p2);
        const txt = e.cond || e.chip;
        if (txt) {
          e.lab = document.createElement('span');
          e.lab.className = 'xf-elab' + (e.cond ? ' xf-elab--cond' : '') + (e.kind === 'side' ? ' xf-elab--side' : '');
          e.lab.textContent = txt;
          this.el.labels.appendChild(e.lab);
        }
      });
      this.el.xf.classList.toggle('is-rm', this.rm);
    }

    // ---------- layout ----------
    relayout() {
      if (!this.el) return;
      const W = Math.round(this.el.canvas.clientWidth);
      if (!W) return;
      const v = W < 640;
      if (v !== this.v || !this.placed) {
        this.v = v; this.placed = true;
        this.el.xf.classList.toggle('is-v', v);
        const ins = this.el.insp;
        if (v) { this.el.canvas.appendChild(ins); ins.classList.add('is-inline'); }
        else { this.el.canvas.after(ins); ins.classList.remove('is-inline', 'is-closed'); ins.style.transform = ''; ins.style.width = ''; }
      }
      this.W = W; this.hs = null; this.ihs = {}; this.tw = null;
      this.g.edges.forEach(e => { e.labW = 0; });
      if (this.v && this.open) this.showPanel(this.open);
      this.cur = this.compute(this.v ? this.open : null);
      this.g.edges.forEach(e => { e.labT = 0.5; });
      this.place(); this.draw();
      if (this.placeLabels()) this.draw();
      this.drawFly();
    }

    // Canvas view: slide each wire label along its wire until it clears the nodes and the other labels.
    // Runs once per layout, not per frame. Returns true when a label moved.
    placeLabels() {
      if (this.v) return false;
      const cr = this.el.canvas.getBoundingClientRect(), obs = [], placed = [];
      const box = r => ({ l: r.left - cr.left, t: r.top - cr.top, r: r.right - cr.left, b: r.bottom - cr.top });
      for (const id in this.nodeEl) {
        const n = this.nodeEl[id];
        obs.push(box(n.querySelector('.xf-node__box').getBoundingClientRect()));
        n.querySelectorAll('.xf-node__txt > *').forEach(c => { const r = c.getBoundingClientRect(); if (r.width) obs.push(box(r)); });
      }
      const hit = (a, list) => list.some(o => a.l < o.r + 4 && a.r > o.l - 4 && a.t < o.b + 2 && a.b > o.t - 2);
      const T = [0.5, 0.42, 0.58, 0.34, 0.66, 0.27, 0.73, 0.2, 0.8];
      let moved = false;
      this.g.edges.forEach(e => {
        if (!e.lab || !e.len) return;
        const w = e.labW || 60, h = e.lab.offsetHeight || 17;
        let pick = null, first = null;
        for (const t of T) {
          const m = e.base.getPointAtLength(e.len * t);
          const x = Math.max(w / 2 + 4, Math.min(this.W - w / 2 - 4, m.x));
          const r = { l: x - w / 2, r: x + w / 2, t: m.y - h / 2, b: m.y + h / 2 };
          if (!first) first = { t, r };
          if (!hit(r, obs) && !hit(r, placed)) { pick = { t, r }; break; }
        }
        pick = pick || first;
        if (pick.t !== 0.5) moved = true;
        e.labT = pick.t; placed.push(pick.r);
      });
      return moved;
    }

    measure(widths) {
      const ids = Object.keys(widths);
      ids.forEach(id => { const n = this.nodeEl[id]; n.style.width = widths[id] + 'px'; n.style.height = ''; });
      const hs = {};
      ids.forEach(id => { hs[id] = this.nodeEl[id].offsetHeight; });
      return hs;
    }

    compute(openId) {
      const g = this.g, W = this.W, pos = {};
      if (!this.v) {
        const M = 20, n = g.slots.length;
        const maxC = Math.max(2, Math.floor((W - 2 * M) / 168));
        const rows = Math.ceil(n / maxC), C = Math.ceil(n / rows);
        const colW = (W - 2 * M) / C, LW = Math.floor(Math.min(172, colW - 14));
        if (!this.hs) { const w = {}; g.nav.forEach(id => { w[id] = LW; }); this.hs = this.measure(w); }
        const hs = this.hs;
        let top = 54;
        for (let r = 0; r < rows; r++) {
          const sl = g.slots.slice(r * C, r * C + C);
          const mh = Math.max(...sl.map(s => hs[s.main]));
          const lane = sl.filter(s => s.alt || s.side);
          sl.forEach((s, k) => {
            const col = r % 2 ? C - 1 - k : k, cx = M + colW * (col + 0.5);
            pos[s.main] = { cx, x: cx - LW / 2, y: top, w: LW, h: hs[s.main] };
            const o = s.alt || s.side;
            if (o) pos[o] = { cx, x: cx - LW / 2, y: top + mh + 30, w: LW, h: hs[o] };
          });
          top += mh + (lane.length ? 30 + Math.max(...lane.map(s => hs[s.alt || s.side])) : 0) + 46;
        }
        return { pos, H: Math.round(top - 46 + 30), ins: null };
      }
      // phones: one column, a branch side by side, the details open under the active step
      const M = 14, CW = Math.min(W - 2 * M, 520), x0 = Math.round((W - CW) / 2), GAP = 10, VG = 46;
      const rows = [];
      g.slots.forEach(s => { if (s.side) rows.push([s.side]); rows.push(s.alt ? [s.main, s.alt] : [s.main]); });
      const half = (CW - GAP) / 2;
      if (!this.hs) {
        const w = {};
        rows.forEach(row => row.forEach(id => { w[id] = row.length > 1 ? half : CW; }));
        this.hs = this.measure(w);
      }
      const hs = this.hs;
      let y = 22, ins = null;
      rows.forEach(row => {
        const w = row.length > 1 ? half : CW;
        const rh = Math.max(...row.map(id => hs[id]));
        row.forEach((id, k) => { const x = x0 + k * (w + GAP); pos[id] = { x, y, w, h: rh, cx: x + w / 2 }; });
        y += rh;
        if (openId && row.indexOf(openId) >= 0) {
          const ih = this.measureInsp(openId, CW);
          ins = { x: x0, y: y + 14, w: CW, h: ih, nx: pos[openId].cx - x0 };
          y += 14 + ih;
        }
        y += VG;
      });
      return { pos, H: Math.round(y - VG + 22), ins };
    }

    measureInsp(id, w) {
      if (this.ihs[id]) return this.ihs[id];
      const ins = this.el.insp;
      ins.style.width = w + 'px';
      const was = this.panelOn;
      this.showPanel(id);
      const h = ins.offsetHeight;
      if (was && was !== id && this.open !== id) this.showPanel(was);
      this.ihs[id] = h;
      return h;
    }

    showPanel(id) {
      if (!id || this.panelOn === id) return;
      this.panelOn = id;
      for (const k in this.panelEl) this.panelEl[k].classList.toggle('is-on', k === id);
    }

    place() {
      const c = this.cur, el = this.el;
      for (const id in c.pos) {
        const p = c.pos[id], n = this.nodeEl[id];
        n.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`;
        n.style.width = p.w + 'px';
        n.style.height = this.v ? p.h + 'px' : '';
      }
      el.canvas.style.height = c.H + 'px';
      el.svg.setAttribute('width', this.W);
      el.svg.setAttribute('height', c.H);
      el.svg.setAttribute('viewBox', `0 0 ${this.W} ${c.H}`);
      if (this.v && c.ins) {
        el.insp.style.transform = `translate(${c.ins.x}px,${c.ins.y.toFixed(1)}px)`;
        el.insp.style.width = c.ins.w + 'px';
        el.insp.style.setProperty('--nx', c.ins.nx.toFixed(1) + 'px');
      }
    }

    // where a wire leaves and enters a node
    edgeD(e) {
      const a = this.cur.pos[e.from], b = this.cur.pos[e.to];
      if (!a || !b) return '';
      if (this.v) {
        const x1 = a.cx, y1 = a.y + a.h, x2 = b.cx, y2 = b.y, k = Math.max(14, (y2 - y1) * 0.5);
        return `M${x1} ${y1}C${x1} ${y1 + k} ${x2} ${y2 - k} ${x2} ${y2}`;
      }
      const ra = this.node(e.from).dec ? 37 : 32, rb = this.node(e.to).dec ? 37 : 32;
      const y1 = a.y + 32, y2 = b.y + 32;
      if (Math.abs(a.cx - b.cx) < 2) {
        const sd = a.cx > this.W / 2 ? 1 : -1, x1 = a.cx + sd * ra, x2 = b.cx + sd * rb, o = 82;
        return `M${x1} ${y1}C${x1 + sd * o} ${y1} ${x2 + sd * o} ${y2} ${x2} ${y2}`;
      }
      const dir = b.cx > a.cx ? 1 : -1, x1 = a.cx + dir * ra, x2 = b.cx - dir * rb;
      const k = Math.max(26, Math.abs(x2 - x1) * 0.5);
      return `M${x1} ${y1}C${x1 + dir * k} ${y1} ${x2 - dir * k} ${y2} ${x2} ${y2}`;
    }

    draw() {
      this.g.edges.forEach(e => {
        const d = this.edgeD(e);
        e.base.setAttribute('d', d);
        if (e.trail) e.trail.setAttribute('d', d);
        let L = 0;
        try { L = e.base.getTotalLength(); } catch (err) { L = 0; }
        e.len = L;
        if (!L) return;
        const p1 = e.base.getPointAtLength(0), p2 = e.base.getPointAtLength(L);
        e.p1.setAttribute('cx', p1.x); e.p1.setAttribute('cy', p1.y);
        e.p2.setAttribute('cx', p2.x); e.p2.setAttribute('cy', p2.y);
        if (e.lab) {
          const m = e.base.getPointAtLength(L * (this.v ? 0.5 : (e.labT || 0.5)));
          if (!e.labW) e.labW = e.lab.offsetWidth || 60;
          const x = Math.max(e.labW / 2 + 4, Math.min(this.W - e.labW / 2 - 4, m.x));
          e.lab.style.transform = `translate(${x.toFixed(1)}px,${m.y.toFixed(1)}px) translate(-50%,-50%)`;
        }
      });
      this.edgeStyle();
    }

    edgeStyle() {
      this.g.edges.forEach(e => {
        const on = e.st === 'done';
        e.base.classList.toggle('is-done', on);
        e.p1.classList.toggle('is-on', on || e.st === 'live');
        e.p2.classList.toggle('is-on', on);
        if (e.trail && e.len) {
          e.trail.style.strokeDasharray = `${e.len} ${e.len + 2}`;
          if (e.st !== 'live') e.trail.style.strokeDashoffset = on ? '0' : String(e.len + 1);
        }
        if (e.lab) e.lab.classList.toggle('is-on', on);
      });
    }

    // ---------- the run ----------
    inEdge(k) { const id = this.g.order[k]; return this.g.edges.find(e => e.kind === 'path' && e.to === id); }

    dur(ph) {
      if (ph === 'travel') return this.rm ? 0 : TRAVEL;
      if (ph === 'run') return this.rm ? 0 : RUN;
      if (ph === 'end') return END;
      const n = this.node(this.g.order[this.s.i]);
      return (this.rm ? 5200 : DWELL) + (n.tag === 'ok' ? 900 : 0) + (this.v ? 500 : 0);
    }

    going() {
      const s = this.s;
      return s.manual || (s.playing && !s.hov && !s.foc && s.vis && !document.hidden);
    }

    kick() {
      if (!this.raf && (this.going() || this.tw)) { this.last = 0; this.raf = requestAnimationFrame(this.frameB); }
    }

    frame(now) {
      this.raf = 0;
      const dt = this.last ? Math.min(64, now - this.last) : 16;
      this.last = now;
      if (this.going()) {
        const s = this.s;
        s.t += dt;
        let d = this.dur(s.ph), guard = 0;
        while (s.t >= d && guard++ < 6) {
          s.t -= d;
          this.nextPhase();
          d = this.dur(s.ph);
          if (!this.going()) { s.t = 0; break; }
        }
      }
      if (this.tw) this.stepTween(dt);
      this.drawFly();
      if (this.going() || this.tw) this.raf = requestAnimationFrame(this.frameB);
      else this.last = 0;
    }

    nextPhase() {
      const s = this.s, N = this.g.order.length;
      if (s.ph === 'travel') { s.ph = 'run'; this.arrive(); }
      else if (s.ph === 'run') { s.ph = 'dwell'; s.manual = false; }
      else if (s.ph === 'dwell') {
        if (s.i < N - 1) this.enter(s.i + 1);
        else { s.ph = 'end'; this.caption(); }
      } else if (s.ph === 'end') this.enter(0);
      this.apply();
    }

    // start step k: the packet travels in, then the node runs
    enter(k) {
      const s = this.s;
      s.i = k; s.t = 0; s.insp = null;
      const e = k > 0 ? this.inEdge(k) : null;
      if (this.rm) { s.ph = 'dwell'; this.arrive(false); }
      else if (e) {
        s.ph = 'travel';
        if (this.v) this.setOpen(null, true);
        else this.showPanel(this.g.order[k - 1]);
        this.el.chip.textContent = e.chip || '';
        this.chipW = this.el.chip.offsetWidth;
      } else { s.ph = 'run'; this.arrive(); }
      this.caption();
      this.apply();
    }

    arrive(anim) { this.setOpen(this.g.order[this.s.i], anim !== false); }

    // show step k at rest, with its details open
    show(k) {
      const s = this.s;
      s.i = k; s.ph = 'dwell'; s.t = 0; s.insp = null; s.manual = false;
      this.setOpen(this.g.order[k], true);
      this.caption(); this.apply();
    }

    setOpen(id, anim) {
      this.open = id;
      if (id) this.showPanel(id);
      if (!this.v) return;
      this.el.insp.classList.toggle('is-closed', !id);
      const to = this.compute(id);
      if (!anim || this.rm || !this.cur) { this.tw = null; this.cur = to; this.place(); this.draw(); return; }
      this.tw = { from: this.cur, to, t: 0 };
      this.kick();
    }

    stepTween(dt) {
      const tw = this.tw;
      tw.t = Math.min(1, tw.t + dt / TWEEN);
      const k = ease(tw.t), a = tw.from, b = tw.to, pos = {};
      for (const id in b.pos) {
        const p = a.pos[id] || b.pos[id], q = b.pos[id];
        pos[id] = { x: lerp(p.x, q.x, k), y: lerp(p.y, q.y, k), w: q.w, h: q.h, cx: lerp(p.cx, q.cx, k) };
      }
      let ins = b.ins || a.ins;
      if (a.ins && b.ins) ins = { x: b.ins.x, w: b.ins.w, h: b.ins.h, y: lerp(a.ins.y, b.ins.y, k), nx: lerp(a.ins.nx, b.ins.nx, k) };
      this.cur = { pos, H: lerp(a.H, b.H, k), ins };
      if (tw.t >= 1) { this.cur = b; this.tw = null; }
      this.place(); this.draw();
    }

    drawFly() {
      const s = this.s, el = this.el;
      if (!el) return;
      const e = s.ph === 'travel' && !this.rm ? this.inEdge(s.i) : null;
      if (!e || !e.len) { el.dot.style.opacity = '0'; el.chip.style.opacity = '0'; return; }
      const p = ease(Math.min(1, s.t / TRAVEL)), L = e.len;
      const pt = e.base.getPointAtLength(L * p);
      const op = p < 0.06 ? p / 0.06 : p > 0.94 ? (1 - p) / 0.06 : 1;
      el.dot.style.opacity = String(op);
      el.dot.style.transform = `translate(${pt.x.toFixed(1)}px,${pt.y.toFixed(1)}px) translate(-50%,-50%)`;
      if (e.trail) e.trail.style.strokeDashoffset = String(L * (1 - p));
      const cw = this.chipW || 60;
      let cx, cy;
      if (this.v) { cx = pt.x + 14; if (cx + cw > this.W - 6) cx = pt.x - 14 - cw; cy = pt.y - 10; }
      else { cx = Math.max(6, Math.min(this.W - cw - 6, pt.x - cw / 2)); cy = pt.y - 32; }
      el.chip.style.opacity = e.chip ? String(op) : '0';
      el.chip.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`;
    }

    shown() {
      const s = this.s, o = this.g.order;
      if (s.insp) return s.insp;
      if (s.ph === 'end') return o[o.length - 1];
      if (s.ph === 'travel') return o[Math.max(0, s.i - 1)];
      return o[s.i];
    }

    apply() {
      const s = this.s, g = this.g, N = g.order.length, end = s.ph === 'end';
      g.order.forEach((id, k) => {
        const n = this.nodeEl[id];
        n.classList.toggle('is-done', end || k < s.i || (k === s.i && s.ph === 'dwell'));
        n.classList.toggle('is-on', !end && k === s.i && s.ph === 'dwell');
        n.classList.toggle('is-run', !end && k === s.i && s.ph === 'run');
      });
      const shown = this.shown();
      for (const id in this.nodeEl) {
        const n = this.nodeEl[id];
        n.classList.toggle('is-sel', id === s.insp);
        n.tabIndex = id === shown ? 0 : -1;
        if (id === shown) n.setAttribute('aria-current', 'step'); else n.removeAttribute('aria-current');
      }
      g.edges.forEach(e => {
        if (e.kind !== 'path') { e.st = 'idle'; return; }
        const k = g.order.indexOf(e.to);
        e.st = end || k < s.i || (k === s.i && s.ph !== 'travel') ? 'done' : k === s.i ? 'live' : 'idle';
      });
      this.edgeStyle();
      const p = end ? 1 : (s.i + (s.ph === 'travel' ? 0 : 1)) / N;
      this.el.prog.style.width = (p * 100).toFixed(2) + '%';
      this.status();
    }

    caption() {
      const s = this.s, N = this.g.order.length;
      let n, t;
      if (s.insp) { n = this.g.alts.has(s.insp) ? 'Other branch' : 'Side step'; t = this.node(s.insp).cap; }
      else if (s.ph === 'end') { n = 'Run complete'; t = 'Every step done. It starts again in a moment.'; }
      else { n = `Step ${s.i + 1} of ${N}`; t = this.node(this.g.order[s.i]).cap; }
      const el = this.el;
      if (el.capT.textContent === t && el.capN.textContent === n) return;
      el.capN.textContent = n;
      el.capT.textContent = t;
      if (!this.rm && el.capT.animate) el.capT.animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
    }

    status() {
      if (!this.el) return;
      const s = this.s, el = this.el;
      const live = s.playing && !s.hov && !s.foc;
      let txt = s.playing ? (live ? 'Running' : 'Paused') : (this.rm ? 'Step by step' : 'Paused');
      if (s.ph === 'end' && live) txt = 'Done';
      el.state.textContent = txt;
      el.xf.classList.toggle('is-live', live);
      el.xf.classList.toggle('is-playing', s.playing);
      el.play.setAttribute('aria-label', s.playing ? 'Pause' : 'Play');
    }

    say(t) {
      const l = this.el.live;
      l.textContent = '';
      setTimeout(() => { l.textContent = t; }, 60);
    }
    sayStep() { this.say(`${this.el.capN.textContent}. ${this.el.capT.textContent}`); }

    // ---------- controls ----------
    onClick(e) {
      const b = e.target.closest ? e.target.closest('button') : null;
      if (!b || !this.root.contains(b)) return;
      const a = b.dataset.a;
      if (a === 'play') this.toggle();
      else if (a === 'next') this.next();
      else if (a === 'back') this.back();
      else if (b.dataset.id) this.pick(b.dataset.id);
    }

    onKey(e) {
      const b = e.target.closest ? e.target.closest('.xf-node') : null;
      if (!b) return;
      const L = this.g.nav;
      let k = L.indexOf(b.dataset.id);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') k = Math.min(L.length - 1, k + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') k = Math.max(0, k - 1);
      else if (e.key === 'Home') k = 0;
      else if (e.key === 'End') k = L.length - 1;
      else return;
      e.preventDefault();
      this.pick(L[k]);
      this.nodeEl[L[k]].focus();
    }

    toggle() {
      const s = this.s;
      s.playing = !s.playing; s.manual = false;
      if (s.playing) {
        s.hov = false; s.foc = false;
        if (s.insp) { s.insp = null; this.setOpen(this.g.order[s.i], true); this.caption(); }
      }
      this.apply(); this.kick();
      this.say(s.playing ? 'Playing' : 'Paused');
    }

    next() {
      const s = this.s, N = this.g.order.length;
      s.playing = false;
      if (s.insp) { s.insp = null; }
      if (s.ph === 'travel' || s.ph === 'run') s.manual = true;
      else { this.enter(s.ph === 'end' || s.i >= N - 1 ? 0 : s.i + 1); s.manual = !this.rm && s.ph !== 'dwell'; }
      this.caption(); this.apply(); this.kick(); this.sayStep(); this.follow();
    }

    back() {
      const s = this.s, N = this.g.order.length;
      s.playing = false;
      let k;
      if (s.insp) k = s.i;
      else if (s.ph === 'end') k = N - 2;
      else if (s.ph === 'travel') k = s.i - 2;
      else k = s.i - 1;
      this.show(Math.max(0, k));
      this.sayStep(); this.follow();
    }

    pick(id) {
      const s = this.s, k = this.g.order.indexOf(id);
      s.playing = false; s.manual = false;
      if (k >= 0) this.show(k);
      else {
        if (s.ph !== 'dwell') { s.ph = 'dwell'; s.t = 0; }
        s.insp = id;
        this.setOpen(id, true);
        this.caption(); this.apply();
      }
    }

    // phones: after Next or Back, bring the active step into view if it moved off screen
    follow() {
      if (!this.v) return;
      clearTimeout(this.followT);
      this.followT = setTimeout(() => {
        this.followT = 0;
        const n = this.nodeEl[this.shown()];
        if (!n) return;
        const r = n.getBoundingClientRect(), vh = window.innerHeight;
        if (r.top < 170 || r.bottom > vh - 120) window.scrollBy({ top: r.top - 190, behavior: this.rm ? 'auto' : 'smooth' });
      }, TWEEN + 60);
    }

    // For checks and screenshots: put the run at step k, in a phase, part way through it.
    seek(k, ph, frac) {
      const s = this.s;
      s.playing = false; s.manual = false;
      this.enter(Math.max(0, Math.min(this.g.order.length - 1, k)));
      if (ph === 'travel' && s.ph === 'travel') s.t = TRAVEL * (frac || 0.5);
      else { s.ph = 'dwell'; s.t = 0; this.setOpen(this.g.order[s.i], false); }
      if (this.tw) { this.cur = this.tw.to; this.tw = null; this.place(); this.draw(); }
      this.caption(); this.apply(); this.drawFly();
    }
  }

  function mount(el) {
    if (!el || el.xflow) return el && el.xflow;
    el.xflow = new Flow(el);
    return el.xflow;
  }

  // A picker for several flows: <div data-xflow-pick="id-of-the-xflow"><button data-flow="cleaning">...</button></div>
  function wirePickers() {
    let want = '';
    try { want = new URLSearchParams(location.search).get('flow') || ''; } catch (e) { want = ''; }
    document.querySelectorAll('[data-xflow-pick]').forEach(group => {
      const target = document.getElementById(group.getAttribute('data-xflow-pick'));
      if (!target) return;
      const btns = Array.from(group.querySelectorAll('button[data-flow]'));
      const mark = key => btns.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.flow === key)));
      if (FLOWS[want]) target.dataset.flow = want;
      mark(target.dataset.flow);
      btns.forEach(b => b.addEventListener('click', () => {
        mark(b.dataset.flow);
        const inst = mount(target);
        inst.load(b.dataset.flow, true);
        try { const u = new URL(location.href); u.searchParams.set('flow', b.dataset.flow); history.replaceState(null, '', u); } catch (e) { /* no history */ }
      }));
    });
  }

  // Switch an embedded flow from another script: XFlow.set(el, 'cleaning'). Same as changing data-flow.
  function set(el, key) {
    if (!el || !FLOWS[key]) return null;
    if (!el.xflow) { el.dataset.flow = key; return mount(el); }
    if (el.xflow.key !== key) el.xflow.load(key, true);
    return el.xflow;
  }

  wirePickers();
  document.querySelectorAll('.xflow[data-flow]').forEach(mount);
  window.XFlow = { FLOWS, mount, set };
})();
