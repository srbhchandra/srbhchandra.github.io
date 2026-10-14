// Bake the itinerary into index.html for crawlers that don't run JavaScript,
// and publish it as data for agents. Run after editing trip.js, photos.js or
// routes.json:
//   cd travel/central-europe && node tools/build.js
// Writes:
//   index.html      the static itinerary between <!-- build:static --> markers,
//                   and schema.org JSON-LD between <!-- build:jsonld --> markers.
//                   app.js replaces the static markup with the interactive one.
//   itinerary.json  the same content as plain data.
const fs = require('fs');
global.window = {};
eval(fs.readFileSync('trip.js', 'utf8'));
eval(fs.readFileSync('photos.js', 'utf8'));
const T = window.TRIP, PH = window.PHOTOS;
const R = JSON.parse(fs.readFileSync('routes.json', 'utf8'));

const URL = 'https://srbhchandra.github.io/travel/central-europe/';
const HOME = 'https://srbhchandra.github.io/';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KIND = { walk: 'Walk', see: 'See', food: 'Eat', miss: 'Missed' };
const fmtH = (h) => { const q = Math.max(0.5, Math.round(h * 2) / 2); return `${Math.floor(q) || ''}${q % 1 ? '½' : ''} h`; };
const walkKm = (n) => Object.values((R.days[n] || {}).walks || {}).reduce((a, w) => a + w.km, 0);
const stags = (s) => (s[3] || '').split(' ');
const itemText = (it) => it.text || [it.label, (it.stops || []).map((s) => s[0]).join(it.kind === 'walk' ? ' → ' : ', ')].filter(Boolean).join(': ');

/* ---------- static HTML ---------- */
const days = T.days.map((d) => {
  const rd = R.days[d.n] || {};
  const meta = [];
  if (rd.drive) meta.push(`Driving about ${fmtH(rd.drive.h)} · ${rd.drive.km >= 100 ? Math.round(rd.drive.km / 10) * 10 : rd.drive.km} km`);
  const wk = walkKm(d.n);
  if (wk >= 1) meta.push(`Walking about ${Math.round(wk * 2) / 2} km`);
  meta.push(`Night in ${d.base}`);
  const hero = PH.days[d.n];
  const items = d.items.map((it) => {
    let body = esc(it.text ? it.text + ((it.stops || []).length > 1 ? ' — ' + it.stops.map((s) => s[0]).join(', ') : '') : itemText(it));
    if (it.best) body += ` <strong>(${esc(it.best)})</strong>`;
    return `<li><span class="kind">${KIND[it.kind]}</span> <span class="body">${body}</span></li>`;
  }).join('\n          ');
  return `      <section class="day" id="day-${d.n}">
        ${hero ? `<figure class="dayphoto"><img src="photos/${hero.src}-s.jpg" alt="${esc(hero.cap)}" width="${hero.w}" height="${hero.h}" loading="lazy"><figcaption>${esc(hero.cap)}</figcaption></figure>` : ''}
        <p class="daynum">Day ${d.n}</p>
        <h2>${esc(d.title)}${d.note ? ` <span class="note">${esc(d.note)}</span>` : ''}</h2>
        <p class="meta">${meta.map(esc).join(' · ')}</p>
        <ul class="items">
          ${items}
        </ul>
      </section>`;
}).join('\n');
const staticDays = `<section class="overview" id="day-0">
        <h2>Prague to Venice by car</h2>
        <p>Fly into Prague, fly out of Venice, and drive in between. The cities are best on foot, so the days alternate: whole days walking in Prague, Krakow, Budapest and Vienna, and driving days that string together caves, castles and mountain passes.</p>
      </section>
${days}`;
const staticTake = T.takeaways.map((t) => `<li>${esc(t)}</li>`).join('\n        ');
const staticNotes = (T.notes || []).map((sec) => `<h2>${esc(sec.title)}</h2><div class="obs">${sec.items.map((it) =>
  `<details><summary>${esc(it.head)}</summary><p>${esc(it.body)}</p></details>`).join('')}</div>`).join('\n        ');

/* ---------- data ---------- */
const data = {
  title: 'Central Europe in 14 days',
  url: URL,
  author: { name: 'Saurabh Bipin Chandra', url: HOME },
  summary: 'A 14-day road trip from Prague to Venice through Czechia, Poland, Slovakia, Hungary, Austria, Slovenia and Italy.',
  note: 'Drive and walk times are routing estimates (OSRM, FOSSGIS foot router) for the stops in order, excluding time spent at them.',
  days: T.days.map((d) => {
    const rd = R.days[d.n] || {};
    return {
      day: d.n, title: d.title, country: T.countries[d.country].name, night: d.base,
      via: (d.via || []).map((v) => T.countries[v].name),
      drive: rd.drive ? { hours: +rd.drive.h.toFixed(1), km: rd.drive.km } : null,
      walk_km: +walkKm(d.n).toFixed(1) || null,
      items: d.items.map((it) => ({
        kind: { walk: 'walk', see: 'sight', food: 'food', miss: 'missed' }[it.kind],
        text: itemText(it),
        best: it.best || undefined,
        tags: [...new Set([...(it.tags || []), ...(it.stops || []).flatMap(stags)].filter(Boolean))],
        places: (it.stops || []).map((s) => (s.length >= 3 ? { name: s[0], lat: s[2], lon: s[1] } : { name: s[0] }))
      }))
    };
  }),
  takeaways: T.takeaways,
  notes: (T.notes || []).map((sec) => ({ title: sec.title, items: sec.items.map((it) => ({ point: it.head, detail: it.body })) }))
};
fs.writeFileSync('itinerary.json', JSON.stringify(data, null, 1) + '\n');

const ld = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: data.title,
  description: data.summary,
  url: URL,
  image: URL + 'photos/og.jpg',
  inLanguage: 'en',
  author: { '@type': 'Person', name: data.author.name, url: HOME, sameAs: ['https://github.com/srbhchandra', 'https://www.linkedin.com/in/srbhchandra'] },
  itinerary: {
    '@type': 'ItemList',
    numberOfItems: T.days.length,
    itemListElement: T.days.map((d) => ({
      '@type': 'ListItem',
      position: d.n,
      item: {
        '@type': 'TouristTrip',
        name: `Day ${d.n}: ${d.title}`,
        url: `${URL}#day-${d.n}`,
        itinerary: {
          '@type': 'ItemList',
          itemListElement: d.items.filter((it) => it.kind !== 'miss').flatMap((it) => (it.stops || []).filter((s) => s.length >= 3))
            .map((s, k) => ({ '@type': 'ListItem', position: k + 1,
              item: { '@type': 'TouristAttraction', name: s[0], geo: { '@type': 'GeoCoordinates', latitude: s[2], longitude: s[1] } } }))
        }
      }
    }))
  }
};

/* ---------- write into index.html ---------- */
let html = fs.readFileSync('index.html', 'utf8');
const put = (name, content) => {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`);
  if (!re.test(html)) throw new Error(`missing <!-- build:${name} --> markers in index.html`);
  html = html.replace(re, `$1\n${content}\n$2`);
};
put('static', staticDays);
put('takeaways', `        ${staticTake}`);
put('notes', `        ${staticNotes}`);
put('jsonld', `  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
fs.writeFileSync('index.html', html);
console.log(`static: ${T.days.length} days; itinerary.json: ${(fs.statSync('itinerary.json').size / 1024).toFixed(0)} KB; JSON-LD: ${(JSON.stringify(ld).length / 1024).toFixed(0)} KB`);
