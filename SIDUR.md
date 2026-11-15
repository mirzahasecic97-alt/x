# Pages on x.is: rules for whoever builds them

This file is for people building the site's pages. It does not go live. Never publish files that start with `_` or end in `.md`.

The site is **English only and global**. No `lang` attributes on elements, no IS/EN toggle, no Icelandic text, names, company IDs or amounts in kr, and no mention of Iceland or a country switch. (The ISK price switch on `verd.html` is one exception: it only changes the currency. The other is the crew chat example on the home page, where "Icelandic" is one of the owner's languages and the sample task is shown in it. Never name the country there.)

## Files

| File | What |
| --- | --- |
| `index.html` | Home page |
| `kerfid.html`, `tengingar.html`, `gervigreind.html`, `leidbeiningar.html`, `samstarf.html`, `verd.html` | Sub pages. Each starts as a copy of `_snidmat.html` |
| `industries.html` | Industries: pick an industry, two questions, a recommendation and a showcase of X for that industry (see Industries) |
| `pilot.html` | "Join the pilot": the one form every button leads to |
| `_snidmat.html` | Blank template: `<head>`, icons, header, sub page hero, empty `<main>`, footer |
| `assets/css/site.css` | Shared styles. Do not change it for one page |
| `assets/css/<page>.css` | Styles only one page uses. Linked under `site.css` in `<head>` |
| `assets/js/site.js` | Shared script: settings (`STILLINGAR`), header, reveal on scroll, the mobile action bar, year in the footer, hero effects |
| `assets/js/<page>.js` | Script for one page, loaded after `site.js`, both with `defer`. Wrap everything in `(() => { ... })();` |
| `assets/js/pilot.js` | The pilot form: prefill from the URL (or the industry saved in `localStorage` `x-grein` by the home page picker, `industries.html` or `kerfid.html`), `?tools=` ticks matching tools and puts the rest in "Other tools", validation, sending |
| `assets/js/industries.js` | `industries.html`: all content for the five industries in one data object (`G`), the connection list with status (`T`), the plans (`PLANS`), and the rendering |
| `assets/js/index.js` | The home page: the industry demo (`GREINAR`) and the crew chat example (`CW`, prewritten sample translations, no API, nothing is sent) |
| `assets/js/tengingar.js` | The "What do you use today?" picker (`[data-velja]`). On `tengingar.html` and the home page it builds the start of a pilot request: `[data-velja-send]` links to `pilot.html?tools=A,B,C` with the ticked tools and `[data-velja-annad]` |
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

- **Header links, in this order:** Industries, The system, Connections, AI, Guides, Pricing. Then the button "Join the pilot" (`pilot.html`). Partners is not in the header.
- **Footer links:** the same six, then "For software companies" (`samstarf.html`) and "Join the pilot" (`pilot.html`), then `© 2026 X`.
- No legal company name, ID or address in the footer until the owner decides.

## Buttons (CTA)

Only two labels exist on the whole site:

| Label | Where it goes | Style |
| --- | --- | --- |
| **Join the pilot** | `pilot.html`, with `?plan=solo`, `?plan=team`, `?plan=business` and/or `?industry=contractors`, `cleaning`, `consultants`, `shops`, `wholesale` when it helps | `btn btn--metal` (primary) |
| **Book a 15 min call** | `pilot.html?call=1` | `btn btn--ghost` (secondary) |

- No other button labels ("Get started", "Try the system", "Book a demo", "Talk to us", "See the plans" are gone).
- No `mailto:` links, no `app.x.is/demo`. Never write an email address or URL in HTML.
- Text links to other pages (`tlink`) are fine, for example "See the system".
- On phones (below 720px) `site.js` adds a bottom bar with "Join the pilot" once the hero buttons scroll away, and hides it near the final section and footer. Not on `pilot.html`.
- Old hooks `data-demo`, `data-kynning`, `data-samstarf` still work as a fallback (site.js points them at `pilot.html`), but do not use them in new markup.

## The pilot offer

Use this text, word for word, wherever the offer appears:

> Pilot: the first 10 firms use X free for 3 months. In return: a short call every two weeks and honest feedback. After the pilot: 25% off for the first 12 months.

No "seats left" counter.

The form on `pilot.html` posts JSON to `STILLINGAR.formEndpoint` in `site.js` (Formspree). While it is empty nothing is sent: the page shows the thank-you state and logs to the console, and `?debug=1` shows the note "Form not connected yet".

## Industries

Always these five, in this order and with this wording:

1. Contractors (trades and renovation)
2. Cleaning and services
3. Consultants
4. Shops
5. Wholesale (selling to shops)

URL values: `contractors`, `cleaning`, `consultants`, `shops`, `wholesale`. The chosen one is saved in `localStorage` `x-grein` and read by `index.html`, `industries.html`, `kerfid.html` and `pilot.html`. The home page demo has all five tabs (in Wholesale you accept a shop's order).

Wholesale is the newest pack and the research is still running. Never claim that store data (stock or sell-through per store) is available today: it is Coming soon and only where the store or chain shares it, depending on agreements. Reorder suggestions, webshop stock sync and store or POS connections are Coming soon. Shopify, WooCommerce, DK, Payday and store systems are named as plain text connections.

### industries.html

- Hero: "Pick your industry. See your X." and five cards (`.in-card`, buttons with `aria-pressed`). The industry comes from `?industry=`, then `x-grein`, otherwise contractors. Choosing one re-renders the page without reloading, sets `?industry=` with `history.replaceState` and saves `x-grein`.
- Two questions (team size 1 / 2 to 5 / 6 to 20 / More than 20, and "What do you use today?" with tools for that industry) drive "Recommended for you": plan and price, modules, connections with status, one sentence why. 1 is Solo, 2 to 5 is Team, 6 to 20 is Business, more than 20 is "Let's talk" with "Book a 15 min call" instead of a plan. Everything runs in the browser; nothing is sent.
- Showcase, rendered from `G` in `industries.js`: an Overview mockup made for the industry (`.app` classes from `site.css`, `aria-hidden` and `inert`), highlights, "A day with X", modules, example automations and connections.
- Every "Join the pilot" on the page points to `pilot.html?industry=<slug>&plan=<recommended>&size=<size>` (no `plan` for more than 20, plus `&tools=` with the ticked tools), and every "Book a 15 min call" to `pilot.html?call=1&` plus the same. `pilot.html` preselects industry, plan and team size from these.
- To change an industry's wording, sample data or status, edit `G` (and `T` for connections) in `industries.js`. Statuses must match `tengingar.html` and `kerfid.html`. Sample companies and people are made up and neutral English.

## Crew chat in their language

The lead feature for contractors. The owner writes or speaks a task on WhatsApp in his own language, each worker gets it in their own language and answers by text, voice note or photo, and the owner reads the answer in his. From these messages X keeps the **work diary** per job and the **hours** per worker. The plan and the sources are in `docs/crew-translation.md` (one level up from `site`).

- **Names:** "Crew chat in their language" (long), "Crew chat" (module chip), "Work diary and hours" (module chip). The old "Crew link" is gone.
- **Status: Coming soon** everywhere. Nothing is built, the Meta setup has not started and no language pair has been tested. Move it to **In testing** only when a pilot firm sends real tasks to real workers through a live WhatsApp number and one language pair has passed a test by native speakers.
- **Where:** home page hero line and the example right under the hero (`#crew`), the three problems, `industries.html` (contractors: first highlights, "A day with X", modules, automation, WhatsApp connection), `kerfid.html#crew`, `verd.html` (Team and Business, table row, FAQ "How does crew chat work?").
- **Plans:** Team and Business. Solo does not list it (`industries.js` hides the two modules when the recommendation is Solo).
- **Channel:** WhatsApp once Meta approves X. Until then a text message with a private link that opens the task in the worker's language, no app and no login. Say this wherever the channel comes up.
- **Languages:** no list of supported languages. The home example has English, Icelandic and Croatian for the owner and Polish, Lithuanian, Romanian, Ukrainian and Spanish for the worker, always with "Example" and the note that each language pair is tested with native speakers before it is offered.
- **Costs:** no per-message prices on the site. Say only that WhatsApp charges per message and those fees may be added at cost, confirmed before launch.
- **Honest limits:** the owner checks each task before it goes out and approves the hours. X does not track location. The work diary helps keep the official site diary, it does not replace it. Never "first" or "only": others already do parts of this.
- **Sample data:** owner Sarah, worker Marek, firm Northside Builders, job "Bathroom at 12 Elm Road", 08:00 to 15:30, 7 h 30 min.

## Status

Say it once, near the top of each page (the template has it in the hero):

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
| `picker`, `pgroup`, `tool`, `picks` | "What do you use today?" (with `tengingar.js`) |
| `ai`, `chat`, `msg`, `msg--me`, `msg__act`, `draft`, `seg` | AI and chat |
| `app`, `app__ai` | App mockup. The AI panel stacks under the dashboard below 1060px, it is never hidden |
| `guides`, `guide`, `cguides` | Guides |
| `partner`, `ways3`, `hub`, `pcards`, `pcard` | For software companies (`samstarf.html`) |
| `tiers`, `tier`, `tier--hot`, `price`, `tiers__note` | Pricing |
| `trust`, `faq`, `people`, `support`, `wl`, `brands` | Data, questions, people, your brand |
| `final` | Final call to action at the bottom of a page |
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
