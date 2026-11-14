# Síður á x.is: reglur fyrir þá sem smíða

Þetta skjal er fyrir þá sem smíða síður vefsins. Það fer ekki í loftið. Ekki birta skrár sem byrja á `_` eða enda á `.md`.

## Skrár

| Skrá | Hvað |
| --- | --- |
| `index.html` | Forsíða. Stutt: hetja, flæðið, önnur leið, kort á hverja síðu, lokakall |
| `kerfid.html`, `tengingar.html`, `gervigreind.html`, `leidbeiningar.html`, `samstarf.html`, `verd.html` | Undirsíður. Hver byrjar sem afrit af `_snidmat.html` |
| `_snidmat.html` | Autt sniðmát: `<head>`, tákn, haus, hetja undirsíðu, tómt `<main>`, fótur |
| `assets/css/site.css` | Sameiginlegur stíll. Ekki breyta honum fyrir eina síðu |
| `assets/css/<síða>.css` | Stíll sem aðeins ein síða notar. Tengill undir `site.css` í `<head>` |
| `assets/js/site.js` | Sameiginleg skrifta: mál, haus, birting við skrun, `data-demo`, `data-kynning`, `data-samstarf`, ár í fæti, hetjuáhrif |
| `assets/js/<síða>.js` | Skrifta fyrir eina síðu, hlaðin á eftir `site.js`, báðar með `defer`. Settu allt inn í `(() => { ... })();` |
| `assets/js/tengingar.js` | Tilbúið: "Hvað notar þú í dag?" valið (`[data-velja]`) fyrir `tengingar.html` |
| `assets/merki/` | `x-logo-malmur.svg` (merki og X, í haus og fæti), `merki.svg` (aðeins merkið, skraut), `favicon.svg` |

Slóðir eru alltaf afstæðar: `assets/...`, `kerfid.html`. Engin skástrik fremst.

## Ný síða, skref fyrir skref

1. Afritaðu `_snidmat.html` í `<síða>.html`.
2. Fylltu út `data-titill-is`, `data-titill-en`, `data-lysing-is`, `data-lysing-en` á `<html>`, og settu íslenska titilinn í `<title>` og íslensku lýsinguna í `meta description`. Titill: `Kerfið: X` / `The system: X`.
3. Settu `aria-current="page"` á tengil síðunnar, bæði í `.nav__links` og `.foot__links`.
4. Skrifaðu hetjuna (`.hero.hero--page`) og kaflana inn í `<main>`.
5. Ef síðan þarf eigin stíl eða skriftu: afskrifaðu tenglana í `<head>` og neðst og búðu til skrárnar.
6. Keyrðu athugunina neðst.

Haus, tákn (`<svg>` með `<symbol>`) og fótur eru eins á öllum síðum. Ef eitthvað þarf að breytast þar, breyttu því á öllum síðum og í sniðmátinu.

## Tungumál

Allur sýnilegur texti er til á báðum málum, sem systkini:

```html
<h2 lang="is">Frá tilboði til greiðslu. <span class="metal">Ekkert slegið inn tvisvar.</span></h2>
<h2 lang="en">From quote to payment. <span class="metal">Nothing typed twice.</span></h2>

<a href="verd.html"><span lang="is">Verð</span><span lang="en">Pricing</span></a>
```

- CSS felur málið sem er ekki valið (`html[lang]`). Ekki nota `hidden` eða stíl til þess.
- Nöfn sem eru eins á báðum málum (DK, Payday, Claude) þurfa ekki `lang`.
- `?lang=en` eða `?lang=is` í slóðinni velur málið. Valið geymist í `localStorage` undir `x-mal`.
- `aria-label` sem breytist eftir máli: `data-al-is="..." data-al-en="..."`. Placeholder: `data-ph-is` / `data-ph-en`.
- Skrifta síðu getur hlustað á málaskipti: `document.addEventListener('x:mal', e => e.detail)`. Núverandi mál: `window.X.mal()`.
- Texti búinn til í JS: `window.X.malSpan('is', 'texti')` býr til `<span lang="is">`.

## Klasar til að endurnota

Útlit: svart og málmur. Michroma aðeins í `h1` og `h2` (sjálfvirkt). Geist í öllu öðru, Geist Mono í kickerum, merkjum og tölum.

| Klasi | Til hvers |
| --- | --- |
| `wrap` | Breidd og hliðarbil. Inni í hverjum kafla |
| `sec`, `sec--tight` | Kafli (120px bil), þéttari kafli (88px) |
| `sec__head`, `sec__head--mid` | Haus kafla: kicker, h2, lead. `--mid` miðjar |
| `kicker` | Yfirskrift í Mono með málmstriki |
| `lead` | Inngangstexti, ljósgrár |
| `metal` | Málmtexti sem rennur. Notaðu í seinni hluta fyrirsagnar |
| `edge` | Kort með málmbrún. Grunnur flestra korta |
| `rv` | Birtist mjúklega við skrun. Settu á kort og kaflahausa |
| `btn btn--metal` | Platínuhnappur (aðalaðgerð). Einn á hverjum stað |
| `btn btn--ghost` | Hnappur með hringrennandi brún (aukaaðgerð) |
| `btn--sm` | Minni hnappur |
| `tlink` | Textatengill með striki og ör: `<a class="tlink" href="..."><span ...>...</span><svg><use href="#i-or"/></svg></a>` |
| `chips`, `chip`, `chip soon`, `chip prof` | Tengingar og einingar sem pillur. Grænn punktur = í fyrstu útgáfu, grár (`soon`) = væntanlegt, gulur (`prof`, inni í `.conn`) = í prófun |
| `chips--sm` | Minni pillur |
| `tag`, `tag--ok`, `tag--warn` | Lítil stöðumerki í Mono |
| `mod`, `mods`, `mod__ic` | Eining: kort með tákni í ramma. `mods` er grind (4 dálkar) |
| `pt` | Atriði með tákni til vinstri (`mod__ic` + texti) |
| `fstep`, `flow` | Skrefin frá tilboði til greiðslu |
| `way`, `ways`, `way--x` | Samanburður í þremur dálkum. `way--x` er dálkurinn okkar |
| `split`, `side`, `side--x`, `nos`, `no` | "X sér um / þín kerfi sjá um" |
| `packs`, `pack`, `pack--big`, `recipes`, `qmock` | Greinapakkar (kerfið) |
| `conn`, `conn__g`, `conn__legend` | Tengingalisti í hópum, með skýringu á litum |
| `picker`, `pgroup`, `tool`, `picks` | "Hvað notar þú í dag?" (með `tengingar.js`) |
| `ai`, `chat`, `msg`, `msg--me`, `msg__act`, `draft`, `seg` | Gervigreind og spjall |
| `guides`, `guide`, `cguides` | Leiðbeiningar |
| `partner`, `ways3`, `hub`, `pcards`, `pcard` | Samstarf |
| `tiers`, `tier`, `tier--hot`, `price`, `tiers__note` | Verð |
| `trust`, `faq`, `people`, `support`, `wl`, `brands` | Gögn, spurningar, fólk, þitt merki |
| `final` | Lokakall neðst á síðu |
| `fine` | Smátt letur (fyrirvarar, vörumerki) |
| `sr` | Aðeins fyrir skjálesara |

Skjámyndir og skraut fá `aria-hidden="true"` (og `inert` ef þar eru hnappar). Myndir sem eru skraut: `alt=""`.

Tákn: `<svg><use href="#i-tilbod"/></svg>`. Til eru: `i-yfirlit i-folk i-sala i-tilbod i-verk i-dagatal i-postur i-samfelag i-reikningur i-vorur i-skjol i-gatt i-sjalfvirkni i-heili i-skyrsla i-tengi i-bok i-lykill i-skjoldur i-hnottur i-nidur i-lag i-hond i-hak i-or i-pensill i-x i-greidsla i-verslun i-skipti i-spjall`. `i-heili` er merkið okkar (heilinn). `i-x` er kross (nei), ekki nafnið.

## Hnappar og tenglar sem JS fyllir út

- `data-demo`: opnar prufukerfið í nýjum flipa (`STILLINGAR.demo`). Settu `href` á síðu sem virkar ef JS keyrir ekki, til dæmis `verd.html`.
- `data-kynning="Teymi" data-kynning-en="Team"`: tölvupóstur til að bóka kynningu. Gildið fer í efnislínuna (má vera tómt). `data-kynning-en` er notað þegar enska er valin.
- `data-samstarf`: tölvupóstur um samstarf.
- `data-ar`: núverandi ár.

Netföngin og slóðin eru aðeins í `STILLINGAR` efst í `site.js` (merkt `TODO`). Aldrei skrifa netfang eða slóð beint í HTML.

## Stöðumerki

Alltaf sama orðalag, á báðum málum. Sama listi er í `window.X.STADA`.

| Lykill | Íslenska | Enska | Klasi | Hvenær |
| --- | --- | --- | --- | --- |
| `ok` | Í fyrstu útgáfu | In the first release | `tag--ok` | Fylgir fyrstu útgáfu |
| `prof` | Í prófun | In testing | `tag--warn` | Verið að prófa með notendum |
| `soon` | Væntanlegt | Coming soon | `tag` | Á áætlun, ekki tilbúið |
| `live` | Tilbúið | Live | `tag--ok` | Aðeins þegar það virkar í alvöru |

Kerfið er smíðað í áföngum. Sýndu stöðuna heiðarlega: ef eitthvað er ekki tilbúið er það merkt Væntanlegt.

## REGLUR

1. Varan og fyrirtækið heita **X**. Aldrei gamla vöruheitið, í neinni mynd eða beygingu, og aldrei nafn þeirra sem smíða vefinn. Hvergi: ekki í texta, titlum, alt texta, athugasemdum, klösum eða skráarnöfnum. Ekki segja hver gerir X.
2. Lén í dæmum og skjámyndum: `x.is`, til dæmis `app.x.is`.
3. Engin löng eða miðlungs strik (em dash, en dash). Notaðu punkt, tvípunkt eða kommu.
4. Engar tölur, viðskiptavinafjöldi, sparnaður, umsagnir eða "treyst af" sem eru búnar til. Dæmi í skjámyndum eru augljóslega tilbúin fyrirtæki.
5. Verð eru staðgenglar: `[verð]` / `[price]`.
6. Aldrei "eina", "fyrsta", "ekkert þessu líkt", "alíslenskt", og aldrei að gervigreindin keyri aðeins í Evrópu. Gagnagrunnurinn er í Evrópu; gervigreindin vinnur hjá Anthropic eða OpenAI.
7. Repeat, Torfi, Noona, Payday, Straumur, Teya, Pei, Taktikal og önnur kerfi eru aðeins **tengingar** með heiðarlegri stöðu, aldrei samstarfsaðilar. Nöfn sem venjulegur texti, engin merki (lógó).
8. Íslenska: eðlileg og rétt, einföld, bein og hlý, stuttar setningar. Enska: trú íslenskunni og eðlileg.
9. Merkið: `assets/merki/x-logo-malmur.svg` í haus (28px hátt) og fæti, `assets/merki/merki.svg` í skraut, `assets/merki/favicon.svg` sem favicon.
10. Útlitið helst: svart og málmur, málmflæðið, platínuhnappar, `hero__fx` flæðið í hetjunni, Michroma aðeins í h1 og h2.

## Athugun áður en þú skilar

Keyrðu í `x-site` möppunni (hornklofarnir eru viljandi, svo skjalið sjálft innihaldi ekki orðin):

```sh
grep -rniE 'h[u]g(ur|ar|i|inn)?([^a-zúíéáóöæðþý]|$)|t[v]eir|[—–]' --include='*.html' --include='*.css' --include='*.js' .
```

Ekkert á að koma út. Athugaðu líka síðuna á 375px breidd (engin lárétt skrun) og á báðum málum (`?lang=en`).
