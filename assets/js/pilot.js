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
  // ?topic=connection: hugbúnaðarfyrirtæki (samstarf.html). Grein, stærð, verkfæri og áskrift eiga ekki við.
  const tenging = (q.get('topic') || '').toLowerCase() === 'connection';
  if (tenging) {
    const fela = s => { if (!s) return; s.hidden = true; s.querySelectorAll('input').forEach(i => { i.required = false; }); };
    fela(document.getElementById('pl-industry'));
    fela(document.getElementById('pl-size'));
    ['tools', 'plan'].forEach(n => { const i = form.querySelector('input[name="' + n + '"]'); fela(i && i.closest('fieldset')); });
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
  const reitir = [...form.querySelectorAll('.pl-f input[required]')];
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
      plan: tenging ? '' : merki('plan'),
      call_instead: f.get('call') ? 'Yes' : 'No',
      message: (f.get('message') || '').toString().trim(),
      topic: tenging ? 'Connection (software company)' : 'Pilot',
      page: location.pathname + location.search,
      _subject: (tenging ? 'X connection: ' : 'X pilot: ') + (fyrirtaeki || 'new signup'),
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
