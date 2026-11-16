# Pages on x.is: rules for whoever builds them

This file does not go live. Never publish files that start with `_` or end in `.md`.

## What X is (16 Nov 2026)

X is an AI dispatcher for small contractor crews (3 to 20 people: plumbers, electricians, roofers and other trades). It works in the chat the crew already uses (WhatsApp and Messenger, one to one with X, not in a group), so nobody learns a new app. Contractors only: no other industries on the site.

Source: the product proposal "Verk" (working name, Nov 2026). The site keeps the name X.

How it works, always these seven steps in this order:
1. You send the job like today: voice note, text or photos.
2. X builds the task: address, what to do, urgency, rough time. Asks the boss for what is missing.
3. Each worker gets it in his own language and can answer by voice. The boss reads it in his.
4. Hours: the worker writes "start" and "done".
5. Photos before and after, plus "Was the job as easy as it said?". Estimates fit the firm better over time.
6. Material receipts: photo or forward, put on the right job.
7. Friday summary: hours and materials per job, ready to invoice, as Excel or PDF.

What makes it different: no new app, every language, it asks before the crew goes. Do not name competitors.

Not in the first version, say so plainly: invoicing, accounting connections, calendar.

## Honest limits

- Estimates are rough at the start. Present them as "X asks the right questions before the crew goes", never as accurate hours.
- X does not track location.
- No price on the site. The pilot is free; the price is set with the pilot firms. The buyer is the firm owner, never the worker.
- No invented customer counts, savings or testimonials. Sample data is labelled Example: boss (you), worker Marek (Polish), job at 40 Hill Road / Hill Road 40, Harbor Hotel, 12 Elm Road.

## The pilot offer

Word for word: "We are looking for 2 to 3 contractor firms for a 4 week pilot. Free. In return: a short call once a week."

## Pages

| File | What |
| --- | --- |
| `index.html` | Hero, Sound familiar? (3 problems), How it works (7 steps + phone demo), What makes X different + Not in the first version, Common questions, pilot block |
| `pilot.html` | The pilot form: name, company, email, phone, crew size, trade, how jobs are sent today, languages, what costs most, call instead |
| `assets/js/index.js` | The phone demo: `SKREF` holds the chat for each step |
| `assets/js/pilot.js` | Form validation and sending to `STILLINGAR.formEndpoint` in `site.js` (Formspree, empty until set) |
| `assets/css/site.css` | Shared styles (black and metal look) |

Header: How it works, Why X, Questions, then the button "Join the pilot". Buttons on the site: only "Join the pilot" (`pilot.html`) and "Book a 15 min call" (`pilot.html?call=1`).

Old pages (industries, kerfid, tengingar, gervigreind, leidbeiningar, samstarf, verd, flow) were removed on 16 Nov 2026 and redirect to `/` in `vercel.json`. They are in git history (commit 39beb15) if needed again.

## Rules

1. The product is called X. No other product name, and do not say who makes X.
2. English only. No mention of a country.
3. No em dashes or en dashes.
4. Look stays: black and metal, Michroma only in h1, Geist elsewhere.
5. Placeholders in square brackets (`[number]`) until the owner fills them in.

Check before handing in:

```sh
grep -rniE 'h[u]g(ur|ar|i|inn)?([^a-zúíéáóöæðþý]|$)|t[v]eir|[—–]|mailto:' index.html pilot.html assets
```
