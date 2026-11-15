# Pages on x.is: rules for whoever builds them

This file is for people building the site's pages. It does not go live. Never publish files that start with `_` or end in `.md`.

The site is **English only and global**. No `lang` attributes on elements, no IS/EN toggle, no Icelandic text, names, company IDs or amounts in kr, and no mention of Iceland or a country switch. (The ISK price switch on `verd.html` is the one exception: it only changes the currency.)

## What X is (positioning)

X connects the accounts and tools a firm already has and builds the workflows between them for its industry. We do it for them, they do not build anything. Where nothing exists yet, X adds a few small screens: quotes, the work diary and approvals. Say it in this order: we connect your tools, then we build your workflows on top.

- Home hero: "Your work, on autopilot." with the line "Pick your industry. See exactly what X does for you, step by step."
- How it works: 1 Pick your industry. 2 We connect your tools. 3 We build your workflows.
- Write for a busy owner who is not technical: short sentences, everyday words. No jargon on customer pages (no API, MCP, webhook, module, OAuth).
- **Your own system (white label).** Every firm gets its own X with its name, logo and colours: a system for the boss and an app for the crew. Logo and colours are in every plan (first release). Your own web address, no X branding, is Business only and Coming soon. Say "your own system with your logo", "your app", never "our app".
- **The boss is in control.** The boss decides who sees what and who gets which job, and approves hours, notes to clients and invoices. Say "You decide who sees what" or "You control who sees what". Nothing goes out without the boss's OK.
- **No Messenger or WhatsApp as the way work runs**, in any industry. Never show a flow where the boss sends tasks in a group chat or the crew answer in one. The crew use the firm's own app on their phones: tasks, Started and Done, photos, hours, materials. A text message (SMS) or WhatsApp is only an optional alert ("you have a new task"). "Messenger or WhatsApp" may appear only as something a firm uses today (the pilot form, the tools question on `industries.html`).
- Translation for the crew is **not** a feature we lead with. It is an option on request, one short line where it fits, for example "Crew speaks another language? We can turn on translation for your tasks." Never more than that: no language pickers, no translated sample messages, no language lists.

## Files

| File | What |
| --- | --- |
| `index.html` | Home page: "Workflows". Short and workflow first (see Home page) |
| `kerfid.html`, `tengingar.html`, `gervigreind.html`, `leidbeiningar.html`, `samstarf.html`, `verd.html` | Sub pages. Each starts as a copy of `_snidmat.html` |
| `industries.html` | Industries: pick an industry, two questions, a recommendation and a showcase of X for that industry (see Industries) |
| `pilot.html` | "Join the pilot": the one form every button leads to |
| `_snidmat.html` | Blank template: `<head>`, icons, header, sub page hero, empty `<main>`, footer |
| `assets/css/site.css` | Shared styles. Do not change it for one page |
| `assets/css/<page>.css` | Styles only one page uses. Linked under `site.css` in `<head>` |
| `assets/js/site.js` | Shared script: settings (`STILLINGAR`), header, reveal on scroll, the mobile action bar, year in the footer, hero effects |
| `assets/js/<page>.js` | Script for one page, loaded after `site.js`, both with `defer`. Wrap everything in `(() => { ... })();` |
| `assets/js/pilot.js` | The pilot form: prefill from the URL (or the industry saved in `localStorage` `x-grein` by the industry chips on `index.html` and `flow.html`, `industries.html` or `kerfid.html`), `?tools=` ticks matching tools and puts the rest in "Other tools" (`industries.html` sends it), validation, sending |
| `assets/js/industries.js` | `industries.html`: all content for the five industries in one data object (`G`, with the service contracts block in `G.contractors.svc`), the connection list with status (`T`), the plans (`PLANS`), and the rendering |
| `assets/js/index.js` | The home page. Follows the industry chips (which `flow.js` runs): the one sentence above the canvas (`SETNING`, one per flow), the three "What this saves you" lines (`SPARAR`, one set per industry, no numbers) and the `?industry=` on every "Join the pilot" (`data-ix-cta`). Nothing is sent |
| `assets/js/flow.js`, `assets/css/flow.css` | The live workflow: a node canvas that runs one example workflow step by step, with what comes in, what X does and what goes out. Six flows in `FLOWS`: `contractors-service`, `contractors-quote`, `cleaning`, `consultants`, `shops`, `wholesale`. Also the industry chips and the contractors switch (`data-xflow-ind`, `data-xflow-sub`) used on `index.html` and `flow.html` (see Live workflow) |
| `flow.html` | "All workflows": the industry chips, the contractors switch and the canvas, nothing else. In the footer, and linked from `kerfid.html` ("See all workflows"). `?industry=` or `?flow=` opens one |
| `assets/merki/` | `x-logo-malmur.svg` (mark and X, header and footer), `merki.svg` (mark only, decoration), `favicon.svg` |

Paths are always relative: `assets/...`, `kerfid.html`. No leading slash.

## New page, step by step

1. Copy `_snidmat.html` to `<page>.html`.
2. Fill in `<title>`, `meta description`, and `data-titill-en` / `data-lysing-en` on `<html>`. Title: `The system: X`.
3. Put `aria-current="page"` on the page's link in both `.nav__links` and `.foot__links`.
4. Write the hero (`.hero.hero--page`) and the sections inside `<main>`. Keep the status line (see Status).
5. If the page needs its own styles or script: uncomment the links in `<head>` and at the bottom and create the files.
6. Run the check at the bottom.

Header, icons (`<svg>` with `<symbol>`) and footer are the same on every page. If something there changes, change it on every page and in the template.

## Header and footer

- **Header links, in this order:** Workflows (`index.html`), Pricing (`verd.html`), Connections (`tengingar.html`). Then the button "Join the pilot" (`pilot.html`). Nothing else in the header.
- **Footer links:** Workflows, Pricing, Connections, Join the pilot, then The system (`kerfid.html`), AI (`gervigreind.html`), Guides (`leidbeiningar.html`), Industries (`industries.html`), For software companies (`samstarf.html`), All workflows (`flow.html`), then `© 2026 X`. These pages stay, they are just not in the header.
- `aria-current="page"` goes on the page's own link (on the home page: Workflows), not on the logo.
- No legal company name, ID or address in the footer until the owner decides.

## Buttons (CTA)

Only two labels exist on the whole site:

| Label | Where it goes | Style |
| --- | --- | --- |
| **Join the pilot** | `pilot.html`, with `?plan=solo`, `?plan=team`, `?plan=business` and/or `?industry=contractors`, `cleaning`, `consultants`, `shops`, `wholesale` when it helps | `btn btn--metal` (primary) |
| **Book a 15 min call** | `pilot.html?call=1` (or `pilot.html?call=1&topic=workflow` in the workflow problem block) | `btn btn--ghost` (secondary) |

- No other button labels ("Get started", "Try the system", "Book a demo", "Talk to us", "See the plans" are gone).
- No `mailto:` links, no `app.x.is/demo`. Never write an email address or URL in HTML.
- Text links to other pages (`tlink`) are fine, for example "See the system".
- On phones (below 720px) `site.js` adds a bottom bar with "Join the pilot" once the hero buttons scroll away, and hides it near the final section and footer. Not on `pilot.html`.
- Old hooks `data-demo`, `data-kynning`, `data-samstarf` still work as a fallback (site.js points them at `pilot.html`), but do not use them in new markup.

## The pilot offer

Use this text, word for word, wherever the offer appears:

> Pilot: the first 10 firms use X free for 3 months. In return: a short call every two weeks and honest feedback. After the pilot: 25% off for the first 12 months.

No "seats left" counter.

## Workflow problem block

One short block, word for word: heading "Have a workflow problem?", the line "Contact us and we will find the solution within a week." and the button "Book a 15 min call" to `pilot.html?call=1&topic=workflow`. Markup: `section.wfp-sec > .wrap > .wfp.edge.rv` (styles in `site.css`). It sits on `index.html` (after "What this saves you", before "How it works" and the price line), on `flow.html` (after the workflow) and on `tengingar.html` (before the pilot block). Nowhere else.

`pilot.html?topic=workflow` (handled in `pilot.js`): the heading becomes "Have a workflow problem?", the pilot offer is hidden, the three steps read "You describe the problem." / "We call you within [number] working days." / "Within a week, we come back with the solution.", the required field "Describe your workflow problem" (`#pl-problem`, sent as `problem`) appears, the call box is ticked, the plan question and Message are hidden, and the submit button says "Book a 15 min call". `topic` is sent as "Workflow problem".

The form on `pilot.html` posts JSON to `STILLINGAR.formEndpoint` in `site.js` (Formspree). While it is empty nothing is sent: the page shows the thank-you state and logs to the console, and `?debug=1` shows the note "Form not connected yet".

## Industries

Always these five, in this order and with this wording:

1. Contractors (trades and renovation)
2. Cleaning and services
3. Consultants
4. Shops
5. Wholesale (selling to shops)

URL values: `contractors`, `cleaning`, `consultants`, `shops`, `wholesale`. The chosen one is saved in `localStorage` `x-grein` and read by `index.html`, `flow.html`, `industries.html`, `kerfid.html` and `pilot.html`. On the industry chips the short names are fine: Contractors, Cleaning, Consultants, Shops, Wholesale.

### Home page (index.html)

Short and simple. Only this, in this order:

1. Hero: "Your work, on autopilot." (Michroma, the only Michroma on the page: every `h2` on the home page is Geist), the line "Pick your industry. See exactly what X does for you, step by step." and the two buttons. No mockups, no notes row, no status line in the hero.
2. "Your own system. Your name on it." (`.ix-own`, at the top of `#workflow`): the line "Every firm gets its own X, with its name and logo. For you and for your crew.", three points (Your logo and colours. / Your crew use your app, not Messenger. Coming soon / You decide who sees what and approve what goes out.) and a small phone (`.ix-phone`, `aria-hidden`, `inert`) with the firm's own app. The phone follows the industry chips (`OWN` in `index.js`: firm name, logo letter, colour and today's tasks), with the line "Example. Your name and logo go here."
3. Industry chips (`.xf-chips`, `data-xflow-ind="ix-flow"`). One is always chosen: `?industry=`, then `x-grein`, otherwise contractors.
4. One plain sentence for the flow (from `SETNING` in `index.js`, for example "From your plan for the day to the invoice. You only say yes."), the contractors switch "Service jobs / Quotes" (`.xf-sub`), and the live workflow full width (`#ix-flow`), with the Example line under it.
5. "What this saves you": three short lines for the industry (no numbers) and the status line.
6. The workflow problem block (see Workflow problem block).
7. "How it works": the three steps in one row, then one price line "One price for the whole team. From €49 a month excl. VAT." with a link to Pricing.
8. The pilot block (`.final`) with the pilot text and "Join the pilot". Then the footer.

Nothing else goes on the home page. Longer explanations belong on `kerfid.html`, `industries.html` and the other footer pages. The old link `index.html#crew` simply opens the home page.

Wholesale is the newest pack and the research is still running. Never claim that store data (stock or sell-through per store) is available today: it is Coming soon and only where the store or chain shares it, depending on agreements. Reorder suggestions, webshop stock sync and store or POS connections are Coming soon. Shopify, WooCommerce, DK, Payday and store systems are named as plain text connections.

### industries.html

- Hero: "Pick your industry. See your X." and five cards (`.in-card`, buttons with `aria-pressed`). The industry comes from `?industry=`, then `x-grein`, otherwise contractors. Choosing one re-renders the page without reloading, sets `?industry=` with `history.replaceState` and saves `x-grein`.
- Two questions (team size 1 / 2 to 5 / 6 to 20 / More than 20, and "What do you use today?" with tools for that industry) drive "Recommended for you": plan and price, modules, connections with status, one sentence why. 1 is Solo, 2 to 5 is Team, 6 to 20 is Business, more than 20 is "Let's talk" with "Book a 15 min call" instead of a plan. Everything runs in the browser; nothing is sent.
- Showcase, rendered from `G` in `industries.js`: an Overview mockup made for the industry (`.app` classes from `site.css`, `aria-hidden` and `inert`), "How your workflow runs" (the live workflow, see Live workflow), highlights (with the one translation on request line from `ask` in `G`, contractors and cleaning only), "A day with X", modules, example automations and connections.
- Every "Join the pilot" on the page points to `pilot.html?industry=<slug>&plan=<recommended>&size=<size>` (no `plan` for more than 20, plus `&tools=` with the ticked tools), and every "Book a 15 min call" to `pilot.html?call=1&` plus the same. `pilot.html` preselects industry, plan and team size from these.
- To change an industry's wording, sample data or status, edit `G` (and `T` for connections) in `industries.js`. Statuses must match `tengingar.html` and `kerfid.html`. Sample companies and people are made up and neutral English.

### Pricing, Connections and the pilot page

Calm and short like the home page: Michroma only in the `h1`, every `h2` in Geist (set in each page's CSS), plain words.

- **`verd.html`:** hero "One price for the whole team." with the two buttons and the status line, the Monthly / Yearly and EUR / ISK switches (`verd.js`, all amounts in `VERD`), three plan cards (each with the box `.vd-own` "Your own system with your logo" / "You control who sees what" under the price, then four or five lines; Team lists "Crew app with your logo: tasks, work diary and hours" Coming soon, Business lists "Your own web address, no X branding" Coming soon), one note line, "Included in every plan" (six lines, one of them "Your own system, with your name, logo and colours."), "Want help setting up?" (a simple list with one-off prices), "Common questions" (six at most), then the pilot block. No comparison table, promises, team size slider or long sections.
- **`tengingar.html`:** hero "We connect what you already use.", "How it works" (three steps in one row), "Before we start" (one paragraph, then one on your own system: your name and logo, the crew use your app and not Messenger or WhatsApp, Coming soon, you decide who sees what), "Some of the tools we connect" (plain text by group, Coming soon tags where they apply), the line "If it has an export or a way in, we can usually connect it.", "Common questions" (four at most), the workflow problem block, then the pilot block. SMS and WhatsApp are listed only as "Task alerts". No tool picker and no script.
- **`pilot.html`:** hero "Join the pilot." with the pilot text and the status line, three one-line steps, then the form. Keep the text around the form this short.

## Live workflow

The workflow component from `flow.js`. Embed it like this:

```html
<link href="assets/css/flow.css" rel="stylesheet"/>   <!-- in <head>, after site.css -->
<div class="xflow" data-flow="cleaning"></div>
<script defer src="assets/js/flow.js"></script>       <!-- after site.js, before the page script -->
```

- **Where:** the centre of the home page (`#ix-flow`), `industries.html` near the top of the showcase under "How your workflow runs" (`#in-flow`, contractors has a small toggle between Service jobs and Quotes), and `flow.html` (`#xflow-demo`).
- **Switching:** change `data-flow` on the element, or call `XFlow.set(el, 'wholesale')`. The old run stops and the new one starts at step 1. `industries.js` does this when the industry changes.
- **Industry chips:** `<div role="group" data-xflow-ind="ID">` with `<button data-ind="cleaning">` per industry, and for contractors `<div role="group" data-xflow-sub="ID" data-for="contractors">` with `<button data-flow="contractors-service">Service jobs</button>` and `contractors-quote` (Quotes). `flow.js` starts from `?industry=`, then `?flow=`, then `x-grein`, otherwise contractors; a click saves `x-grein` and sets `?industry=` (plus `?flow=` for Quotes). Each change fires `xflow:pick` on the `.xflow` with `{ industry, flow }`, which `index.js` listens to.
- **What the visitor sees:** each step on the canvas has a number, a name, a short subtitle and its status tag. The bar on top says "Step 3 of 10" and one plain sentence for the step (`cap`). The details panel has three parts: "What comes in", "What X does", "What goes out" (stacked in that order on phones, where the canvas runs top to bottom).
- **Motion:** calm. The packet takes 1.5 s along the wire, the step works for 0.6 s, then rests about 3 s so the sentence can be read. It plays only while it is on screen (and the tab is visible), pauses while a mouse rests on the details or a keyboard user is in it, and goes step by step with `prefers-reduced-motion`. Only one live workflow per page.
- **The firm's own app:** steps on the crew's or the boss's screen use the mock `k: 'app'` (firm name, logo letter and colour from `BRAND` in `flow.js`, rows, optional status, photo and Started / Done). Never a chat bubble "via Messenger", "via WhatsApp" or "Text message link". Contractors service jobs run: Boss plans the day (in Northside Builders' own system), Split by urgency, Job brief, Marek's task (in the Northside app), Marek on the job (Started, photos, materials), Work diary and hours, Over estimate?, Note to client (waits for the boss's OK), Supplier invoice matched, Invoice draft (waits for the boss's OK). Cleaning uses the Brightway app the same way.
- **Wording:** always labelled Example, with the line "Example. Companies, people and amounts are made up. Nothing goes out until you approve it." Steps follow the status rules: tasks on the crew's phones, the work diary, quality photos, supplier invoice matching and store data are Coming soon. No translated messages in the flows. Anything sent to a client, worker or accounting "Waits for your OK".
- **Data:** to change a step, edit `FLOWS` in `flow.js`. Sample companies and people are the same made up ones as elsewhere.

## Crew tasks and work diary

For contractors and cleaning. Each worker gets his tasks in the firm's own app on his phone (their name and logo), taps Started and Done, and adds photos, hours, materials or a voice note. The boss decides who sees what and who gets which job. From that X keeps the **work diary** per job and the **hours** per worker, and the owner approves the hours.

- **Names:** "Crew tasks and work diary" (long), "Work diary and hours" (module chip and plan feature on `verd.html`). "Crew chat" and "Crew link" are gone.
- **Status: Coming soon** everywhere. Move it to **In testing** only when a pilot firm sends real tasks to real workers and gets hours back.
- **Where:** the home page (`.ix-own` and the workflow for contractors and cleaning, steps marked Coming soon), `industries.html` (contractors highlights "Crew app and work diary", "A day with X", modules, automation, the "SMS or WhatsApp: new task alerts only" connection), `kerfid.html#crew`, `verd.html` (Team plan card, FAQ "How do the work diary and hours work?").
- **Plans:** Team and Business. Solo does not list it (`industries.js` hides the module when the recommendation is Solo).
- **Channel:** the firm's own app, with its logo. Not Messenger or WhatsApp. An SMS or WhatsApp message may only tell a worker that a new task is waiting (optional, Coming soon).
- **Translation:** only on request. One line, never a feature: "Crew speaks another language? We can turn on translation for your tasks." It appears in the contractors and cleaning showcases on `industries.html`, at the end of `kerfid.html#crew`, and as the FAQ "Can tasks be translated for my crew? Yes, on request." on `verd.html`. Nowhere else.
- **Costs:** no per-message prices on the site. Say only that text or WhatsApp alerts are charged per message and may be added at cost, confirmed before launch.
- **Honest limits:** the owner checks each task before it goes out and approves the hours. X does not track location. The work diary helps keep the official site diary, it does not replace it. Never "first" or "only".
- **Sample data:** owner Sarah, worker Marek, firm Northside Builders, job "Bathroom at 12 Elm Road", 08:00 to 15:30, 7 h 30 min.

## Service contracts

A block for contractors who work for companies on service agreements (plumbers, electricians, maintenance crews). Source: the plumber interview in `docs/customer-interviews/2026-11-15-plumber.md` (one level up from `site`). The pain: the boss sends the day's tasks on Messenger, calls a job "a quick one" without checking, and hours and materials end up in different places.

- **Where:** `industries.html` (contractors only: the block `#service-contracts` after the highlights, rendered from `G.contractors.svc` in `industries.js`, plus the step "The morning plan" in "A day with X" and one example automation), `kerfid.html#service-contracts` (compact list under crew tasks in `#verk`, links to `industries.html?industry=contractors#service-contracts`), `verd.html` (FAQ "Do you handle service contracts?"). No price changes.
- **The five, with status:**
  1. The day planned once: the boss types or pastes the day's jobs in the firm's own system and X splits them into tasks, most urgent first, and suggests a worker; the boss decides who gets which job (first release). Each worker's list in the firm's app on his phone follows the crew tasks rules: **Coming soon**.
  2. A job brief first: client photos, past visits to the same address and job type, a short checklist (access, shut-off valves, parts) and an estimate (first release).
  3. Planned against actual: the worker taps Started, X flags a job that runs over and drafts a short note to the client for the owner's OK. Over time the owner sees which job types run over. No numbers on the site (first release).
  4. Materials on the job: the worker gives the job number at the supplier's counter, the supplier invoice reaches DK or Payday and X matches it to the job by that number. **Coming soon**: depends on reading supplier invoices through the accounting connection.
  5. One board for status: started, waiting for parts, done with a photo (first release).
- **The demo** (`industries.html`, contractors): Sarah's plan for today in Northside Builders' own system, a "Split into tasks" button that turns it into three task cards (priority, worker, job brief), then "later that day" with statuses, "Over estimate: 1 h planned, 3 h 40 min so far" with a draft note that "Waits for your OK", and the supplier invoice line marked Coming soon. Labelled "Example. The system is in development." Nothing is sent. "Split into tasks" and "Start over" are demo controls, not CTAs.
- **Sample data:** owner Sarah, workers Marek, Tomas and Ana (names only, no languages), jobs 1042 to 1044 at Harbor Hotel, 40 Hill Road and Westgate Market, supplier invoice 77812, €186. All made up.

## Status

Say it once, near the top of each page (the template has it in the hero; on the home page it sits under "What this saves you"):

```html
<p class="planned">Everything here is planned for the first release unless marked <span class="tag">Coming soon</span></p>
```

After that, only mark what differs:

| Key | Label | Class | When |
| --- | --- | --- | --- |
| `soon` | Coming soon | `tag` | Planned, not ready |
| `prof` | In testing | `tag--warn` | Being tested with users (only where already used) |

Do not add "In the first release" tags. Chips without `soon` are in the first release by default (green dot); `chip soon` has a grey dot. The same list is in `window.X.STADA`.

The system is built in stages. Show status honestly: if something is not ready, it is marked Coming soon.

## Reusable classes

Look: black and metal. Michroma only in `h1` and `h2` (automatic, letter-spacing 0). Geist for everything else, Geist Mono in kickers, tags and numbers.

| Class | Use |
| --- | --- |
| `wrap` | Width and side padding. Inside every section |
| `sec`, `sec--tight` | Section (120px spacing), tighter section (88px) |
| `sec__head`, `sec__head--mid` | Section head: kicker, h2, lead. `--mid` centres it |
| `kicker` | Mono overline with a metal dash |
| `lead` | Intro text, light grey |
| `metal` | Metal text. Use in the second part of a heading. It shimmers once when it appears |
| `planned` | The status line near the top of the page |
| `edge` | Card with a metal edge. Base of most cards |
| `rv` | Fades in on scroll. Put on cards and section heads |
| `btn btn--metal` | Platinum button (primary). One per place. The light sweep plays on hover |
| `btn btn--ghost` | Button with a metal border (secondary). The border spins on hover |
| `btn--sm` | Smaller button |
| `tlink` | Text link with underline and arrow: `<a class="tlink" href="..."><span>...</span><svg><use href="#i-or"/></svg></a>` |
| `chips`, `chip`, `chip soon`, `chip prof` | Connections and modules as pills. Green dot = first release, grey (`soon`) = coming soon, yellow (`prof`, inside `.conn`) = in testing |
| `chips--sm` | Smaller pills |
| `tag`, `tag--ok`, `tag--warn` | Small Mono status labels |
| `mod`, `mods`, `mod__ic` | Module: card with an icon in a frame. `mods` is a 4 column grid |
| `pt` | Point with an icon on the left (`mod__ic` + text) |
| `fstep`, `flow` | The steps from quote to payment |
| `way`, `ways`, `way--x` | Comparison in columns. `way--x` is our column |
| `split`, `side`, `side--x`, `nos`, `no` | "X handles / your systems handle" |
| `packs`, `pack`, `pack--big`, `recipes`, `qmock` | Industry packs (the system) |
| `conn`, `conn__g`, `conn__legend` | Connection list in groups, with a colour legend |
| `ai`, `chat`, `msg`, `msg--me`, `msg__act`, `draft`, `seg` | AI and chat |
| `app`, `app__ai` | App mockup. The AI panel stacks under the dashboard below 1060px, it is never hidden |
| `guides`, `guide`, `cguides` | Guides |
| `partner`, `ways3`, `hub`, `pcards`, `pcard` | For software companies (`samstarf.html`) |
| `tiers`, `tier`, `tier--hot`, `price`, `tiers__note` | Pricing |
| `trust`, `faq`, `people`, `support`, `wl`, `brands` | Data, questions, people, your brand |
| `final` | Final call to action at the bottom of a page |
| `wfp-sec`, `wfp` | The workflow problem block (`site.css`) |
| `ix-own`, `ix-phone` | "Your own system" block and its phone on the home page (`index.css`) |
| `vd-own` | The two own system lines in each plan card (`verd.css`) |
| `xf-app` | The firm's own app inside a live workflow step (`flow.css`) |
| `xf-chips`, `xf-sub` | Industry chips and the small Service jobs / Quotes switch above a live workflow (`flow.css`) |
| `fine` | Small print (disclaimers, trademarks) |
| `sr` | Screen readers only |

Mockups and decoration get `aria-hidden="true"` (and `inert` if they contain buttons). Decorative images: `alt=""`. No keyboard shortcuts such as "⌘K" in mockups.

Icons: `<svg><use href="#i-tilbod"/></svg>`. Available: `i-yfirlit i-folk i-sala i-tilbod i-verk i-dagatal i-postur i-samfelag i-reikningur i-vorur i-skjol i-gatt i-sjalfvirkni i-heili i-skyrsla i-tengi i-bok i-lykill i-skjoldur i-hnottur i-nidur i-lag i-hond i-hak i-or i-pensill i-x i-greidsla i-verslun i-skipti i-spjall`. `i-heili` is our mark. `i-x` is a cross (no), not the name.

## Placeholders

Values only the owner can fill in are written in square brackets, for example `[number]` working days and `[Month]`. Search for `\[` in the HTML before going live.

## RULES

1. The product and the company are called **X**. Never the old product name, in any form, and never the name of whoever builds the site. Nowhere: not in text, titles, alt text, comments, classes or file names. Do not say who makes X.
2. Domain in examples and mockups: `x.is`, for example `app.x.is`.
3. No em dashes or en dashes. Use a full stop, colon or comma.
4. No invented numbers, customer counts, savings, testimonials or "trusted by". Examples in mockups are clearly made-up companies.
5. Prices as on the site: Solo €49, Team €129, Business €299 a month excl. VAT (ISK switch on `verd.html`). Do not change who counts toward plan size.
6. Never "the only", "the first", "never done before". Never say the AI runs only in Europe. "Database in Europe" is fine; the AI runs at Anthropic or OpenAI.
7. Payday, DK, Repeat, Noona, Straumur, Teya and every other system are **connections** with an honest status, never partners. Names as plain text, no logos.
8. English: plain, direct, short sentences.
9. Logo: `assets/merki/x-logo-malmur.svg` in the header (28px high) and footer, `assets/merki/merki.svg` for decoration, `assets/merki/favicon.svg` as favicon.
10. The look stays: black and metal, the metal flow, platinum buttons, the `hero__fx` flow in the hero, Michroma only in h1 and h2. Motion that loops forever on buttons and text is not allowed: shimmer once, sweep and spin on hover. Respect `prefers-reduced-motion`.

## Check before you hand in

Run in the `site` folder (the brackets are deliberate, so this file does not contain the words itself):

```sh
grep -rniE 'h[u]g(ur|ar|i|inn)?([^a-zúíéáóöæðþý]|$)|t[v]eir|[—–]|mailto:|app\.x\.is/demo|lang="is"' --include='*.html' --include='*.css' --include='*.js' .
```

Nothing should come out. Also check every page at 375px width (no horizontal scroll, the bottom bar appears after the hero) and that every button says "Join the pilot" or "Book a 15 min call".
