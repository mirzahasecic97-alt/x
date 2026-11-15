// pilot.html: skráning í prufuhópinn. Hlaðið á eftir site.js (báðar með defer).
// Sendir JSON á window.X.STILLINGAR.formEndpoint (Formspree). Ef slóðin er tóm er ekkert sent.
(() => {
  const form = document.getElementById('pilot-form');
  if (!form) return;
  const takk = document.getElementById('pl-thanks');
  const stada = document.getElementById('pl-status');
  const hnappur = form.querySelector('button[type="submit"]');
  const q = new URLSearchParams(location.search);
  const endpoint = ((window.X && window.X.STILLINGAR && window.X.STILLINGAR.formEndpoint) || '').trim();

  // ---------- forval úr slóðinni ----------
  const GREINAR = {
    contractors: 'contractors', contractor: 'contractors', trades: 'contractors', renovation: 'contractors',
    cleaning: 'cleaning', services: 'cleaning', service: 'cleaning',
    consultants: 'consultants', consultant: 'consultants',
    shops: 'shops', shop: 'shops', retail: 'shops',
    wholesale: 'wholesale', wholesaler: 'wholesale', distributor: 'wholesale', distribution: 'wholesale', b2b: 'wholesale',
  };
  const PLON = ['solo', 'team', 'business'];
  const velja = (nafn, gildi) => {
    const el = form.querySelector('input[name="' + nafn + '"][value="' + gildi + '"]');
    if (el) el.checked = true;
  };
  // ?industry= í slóðinni, annars greinin sem gesturinn valdi á forsíðunni, industries.html eða kerfid.html (localStorage 'x-grein')
  let grein = GREINAR[(q.get('industry') || '').toLowerCase()];
  if (!grein) { try { grein = GREINAR[(localStorage.getItem('x-grein') || '').toLowerCase()]; } catch (e) { /* lokuð geymsla */ } }
  if (grein) velja('industry', grein);
  const plan = (q.get('plan') || '').toLowerCase();
  if (PLON.includes(plan)) velja('plan', plan);
  // ?size= frá industries.html: 1, 2-5, 6-20 eða 20+ ("+" getur komið sem bil í slóðinni)
  const STAERDIR = { '1': '1', '2-5': '2-5', '6-20': '6-20', '20+': '20+', '20': '20+' };
  const staerd = STAERDIR[(q.get('size') || '').trim()];
  if (staerd) velja('team_size', staerd);
  if (q.get('call') === '1') document.getElementById('pl-call').checked = true;
  // ?tools=DK,Payday,Shopify frá tengingar.html og forsíðunni (index.html): merkt við það sem passar, restin fer í "Other tools"
  const verkfaeriQ = (q.get('tools') || '').split(',').map(s => s.replace(/\s+/g, ' ').trim().slice(0, 60)).filter(Boolean).slice(0, 30);
  if (verkfaeriQ.length) {
    const SAMHEITI = {
      'gmail': 'Gmail', 'google': 'Gmail', 'google workspace': 'Gmail',
      'outlook': 'Outlook', 'microsoft 365': 'Outlook', 'office 365': 'Outlook', 'microsoft': 'Outlook',
      'messenger': 'Messenger or WhatsApp', 'whatsapp': 'Messenger or WhatsApp', 'messenger or whatsapp with the crew': 'Messenger or WhatsApp', 'whatsapp with the crew': 'Messenger or WhatsApp',
      'word or excel': 'Quotes in Word or Excel',
    };
    const kassar = [...form.querySelectorAll('input[name="tools"]')];
    const annad = [];
    verkfaeriQ.forEach(n => {
      const lyk = n.toLowerCase();
      const gildi = (SAMHEITI[lyk] || n).toLowerCase();
      const kassi = kassar.find(k => k.value.toLowerCase() === gildi);
      if (kassi) kassi.checked = true;
      else if (!annad.some(a => a.toLowerCase() === lyk)) annad.push(n);
    });
    const annadReitur = document.getElementById('pl-tools-other');
    if (annadReitur && annad.length) annadReitur.value = annad.join(', ');
  }
  // ?topic=connection: hugbúnaðarfyrirtæki (samstarf.html). Grein, stærð, verkfæri og áskrift eiga ekki við.
  const tenging = (q.get('topic') || '').toLowerCase() === 'connection';
  if (tenging) {
    const fela = s => { if (!s) return; s.hidden = true; s.querySelectorAll('input').forEach(i => { i.required = false; }); };
    fela(document.getElementById('pl-industry'));
    fela(document.getElementById('pl-size'));
    ['tools', 'plan'].forEach(n => { const i = form.querySelector('input[name="' + n + '"]'); fela(i && i.closest('fieldset')); });
  }
  // ?topic=workflow: "Have a workflow problem?" (index.html, flow.html, tengingar.html). Reiturinn "Describe your workflow problem"
  // birtist og er skyldur, símtalið er valið, áskriftin og skilaboðin eru falin. Hnappurinn heitir "Book a 15 min call".
  const vandi = (q.get('topic') || '').toLowerCase() === 'workflow';
  const vandiReitur = document.getElementById('pl-problem');
  if (vandi && !tenging) {
    document.querySelectorAll('[data-pl-wf]').forEach(el => { el.hidden = false; });
    if (vandiReitur) vandiReitur.required = true;
    document.getElementById('pl-call').checked = true;
    const h1 = document.querySelector('[data-pl-h]');
    if (h1) h1.innerHTML = 'Have a workflow <span class="metal">problem?</span>';
    const tilbod = document.querySelector('.pl-offer');
    if (tilbod) tilbod.hidden = true;
    const skref = document.querySelectorAll('.pl-steps li span');
    if (skref[0]) skref[0].textContent = 'You describe the problem.';
    if (skref[2]) skref[2].textContent = 'Within a week, we come back with the solution.';
    const planSet = form.querySelector('input[name="plan"]');
    if (planSet && planSet.closest('fieldset')) planSet.closest('fieldset').hidden = true;
    const msg = document.getElementById('pl-msg-wrap');
    if (msg) msg.hidden = true;
    const send = form.querySelector('[data-pl-send]');
    if (send) send.textContent = 'Book a 15 min call';
    const fine = form.querySelector('.pl-fine');
    if (fine) fine.textContent = 'We use your details only to contact you about your workflow problem.';
    document.title = 'Workflow problem: X';
  }
  const debug = q.get('debug') === '1';

  // ---------- villur ----------
  const SKILABOD = {
    name: 'Please enter your name.',
    company: 'Please enter your company, or your own name.',
    email: 'Please enter an email address, like name@company.com.',
    phone: 'Please enter a phone number we can call.',
    country: 'Please enter your country.',
    industry: 'Please pick your industry.',
    team_size: 'Please pick your team size.',
    problem: 'Please describe your workflow problem in a few words.',
  };
  const villa = (el, errEl, texti) => {
    if (errEl) errEl.textContent = texti || '';
    if (el) { if (texti) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
  };
  const athugaReit = input => {
    const err = document.getElementById(input.id + '-e');
    const v = input.value.trim();
    let t = '';
    if (input.required && !v) t = SKILABOD[input.name];
    else if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) t = SKILABOD.email;
    else if (input.type === 'tel' && v && v.replace(/\D/g, '').length < 6) t = SKILABOD.phone;
    villa(input, err, t);
    return !t;
  };
  const athugaHop = (nafn, setId) => {
    const set = document.getElementById(setId);
    const ok = !!form.querySelector('input[name="' + nafn + '"]:checked');
    villa(set, document.getElementById(setId + '-e'), ok ? '' : SKILABOD[nafn]);
    return ok;
  };
  const reitir = [...form.querySelectorAll('.pl-f input[required], .pl-f textarea[required]')];
  reitir.forEach(i => {
    i.addEventListener('blur', () => { if (i.value.trim()) athugaReit(i); });
    i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') athugaReit(i); });
  });
  form.querySelectorAll('input[name="industry"]').forEach(i => i.addEventListener('change', () => athugaHop('industry', 'pl-industry')));
  form.querySelectorAll('input[name="team_size"]').forEach(i => i.addEventListener('change', () => athugaHop('team_size', 'pl-size')));

  // ---------- gögnin ----------
  const merki = (nafn) => {
    const el = form.querySelector('input[name="' + nafn + '"]:checked');
    if (!el) return '';
    const l = el.closest('label');
    const b = l && l.querySelector('b');
    return ((b ? b.textContent : l ? l.textContent : el.value) || '').trim();
  };
  const gogn = () => {
    const f = new FormData(form);
    const fyrirtaeki = (f.get('company') || '').toString().trim();
    return {
      name: (f.get('name') || '').toString().trim(),
      email: (f.get('email') || '').toString().trim(),
      phone: (f.get('phone') || '').toString().trim(),
      company: fyrirtaeki,
      // falið fyrir hugbúnaðarfyrirtæki (?topic=connection): ekki senda forval sem gesturinn sá ekki
      industry: tenging ? '' : merki('industry'),
      team_size: tenging ? '' : merki('team_size'),
      country: (f.get('country') || '').toString().trim(),
      tools: tenging ? '' : f.getAll('tools').join(', '),
      tools_other: tenging ? '' : (f.get('tools_other') || '').toString().trim(),
      plan: tenging || vandi ? '' : merki('plan'),
      call_instead: f.get('call') ? 'Yes' : 'No',
      message: vandi ? '' : (f.get('message') || '').toString().trim(),
      problem: vandi ? (f.get('problem') || '').toString().trim() : '',
      topic: tenging ? 'Connection (software company)' : vandi ? 'Workflow problem' : 'Pilot',
      page: location.pathname + location.search,
      _subject: (tenging ? 'X connection: ' : vandi ? 'X workflow problem: ' : 'X pilot: ') + (fyrirtaeki || 'new signup'),
      _gotcha: (f.get('_gotcha') || '').toString(),
    };
  };

  const synaTakk = (ekkiTengt) => {
    form.hidden = true;
    takk.hidden = false;
    const d = document.getElementById('pl-debug');
    if (d) d.hidden = !(ekkiTengt && debug);
    takk.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    takk.focus({ preventScroll: true });
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    stada.textContent = ''; stada.classList.remove('is-err');
    const okReitir = reitir.map(athugaReit);
    const okGrein = tenging || athugaHop('industry', 'pl-industry');
    const okStaerd = tenging || athugaHop('team_size', 'pl-size');
    if (okReitir.includes(false) || !okGrein || !okStaerd) {
      const fyrsta = form.querySelector('[aria-invalid="true"]');
      if (fyrsta) {
        const mark = fyrsta.matches('fieldset') ? fyrsta.querySelector('input') : fyrsta;
        fyrsta.scrollIntoView({ block: 'center' });
        if (mark) mark.focus({ preventScroll: true });
      }
      stada.textContent = 'Please check the fields marked above.';
      stada.classList.add('is-err');
      return;
    }
    const g = gogn();
    if (g._gotcha) { synaTakk(false); return; }
    delete g._gotcha;

    if (!endpoint) {
      console.info('[X pilot] formEndpoint is empty in site.js STILLINGAR, so nothing was sent.', g);
      synaTakk(true);
      return;
    }
    hnappur.setAttribute('aria-busy', 'true');
    stada.textContent = 'Sending...';
    try {
      const svar = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(g),
      });
      if (!svar.ok) throw new Error('HTTP ' + svar.status);
      stada.textContent = '';
      synaTakk(false);
    } catch (err) {
      console.warn('[X pilot] sending failed', err);
      stada.textContent = 'Something went wrong and the form was not sent. Please try again in a moment.';
      stada.classList.add('is-err');
    } finally {
      hnappur.removeAttribute('aria-busy');
    }
  });
})();
