// pilot.html: skráning í prufuhópinn (verktakar). Hlaðið á eftir site.js (báðar með defer).
// Sendir JSON á window.X.STILLINGAR.formEndpoint (Formspree). Ef slóðin er tóm er ekkert sent.
(() => {
  const form = document.getElementById('pilot-form');
  if (!form) return;
  const takk = document.getElementById('pl-thanks');
  const stada = document.getElementById('pl-status');
  const hnappur = form.querySelector('button[type="submit"]');
  const q = new URLSearchParams(location.search);
  const endpoint = ((window.X && window.X.STILLINGAR && window.X.STILLINGAR.formEndpoint) || '').trim();
  const debug = q.get('debug') === '1';
  if (q.get('call') === '1') document.getElementById('pl-call').checked = true;

  const SKILABOD = {
    name: 'Please enter your name.',
    company: 'Please enter your company.',
    email: 'Please enter an email address, like name@company.com.',
    phone: 'Please enter a phone number we can call.',
    crew_size: 'Please pick your crew size.',
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
  const athugaStaerd = () => {
    const set = document.getElementById('pl-size');
    const ok = !!form.querySelector('input[name="crew_size"]:checked');
    villa(set, document.getElementById('pl-size-e'), ok ? '' : SKILABOD.crew_size);
    return ok;
  };
  const reitir = [...form.querySelectorAll('.pl-f input[required]')];
  reitir.forEach(i => {
    i.addEventListener('blur', () => { if (i.value.trim()) athugaReit(i); });
    i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') athugaReit(i); });
  });
  form.querySelectorAll('input[name="crew_size"]').forEach(i => i.addEventListener('change', athugaStaerd));

  const gogn = () => {
    const f = new FormData(form);
    const s = n => (f.get(n) || '').toString().trim();
    const valin = form.querySelector('input[name="crew_size"]:checked');
    return {
      name: s('name'),
      company: s('company'),
      email: s('email'),
      phone: s('phone'),
      crew_size: valin ? valin.closest('label').textContent.trim() : '',
      trade: f.getAll('trade').join(', '),
      sends_jobs_with: f.getAll('today').join(', '),
      languages: s('languages'),
      biggest_cost: s('biggest_cost'),
      call_instead: f.get('call') ? 'Yes' : 'No',
      page: location.pathname + location.search,
      _subject: 'X pilot: ' + (s('company') || 'new signup'),
      _gotcha: s('_gotcha'),
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
    const ok = reitir.map(athugaReit);
    const okS = athugaStaerd();
    if (ok.includes(false) || !okS) {
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
