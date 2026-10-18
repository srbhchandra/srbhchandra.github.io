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

const URL = 'https://srbhchandra.github.io/travel/japan/';
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
  if (d.travel) meta.push(`${d.travel.mode}, about ${fmtH(d.travel.h)}`);
  const wk = walkKm(d.n);
  if (wk >= 1) meta.push(`Walking about ${Math.round(wk * 2) / 2} km`);
  meta.push(d.base ? `Night in ${d.base}` : 'Fly home');
  const hero = PH.days[d.n];
  const items = d.items.map((it) => {
    let body = esc(it.text ? it.text + ((it.stops || []).length > 1 ? ' — ' + it.stops.map((s) => s[0]).join(', ') : '') : itemText(it));
    if (it.best) body += ` <strong>(${esc(it.best)})</strong>`;
    if (it.aside) body += ` <em>${esc(it.aside)}</em>`;
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
        ${T.meta.story ? `<h2>${esc(T.meta.storyTitle)}</h2>${T.meta.story.map((p) => `<p>${esc(p)}</p>`).join('')}` : ''}
        <h3>${esc(T.meta.overviewTitle)}</h3>
        <p>${esc(T.meta.overview)}</p>
      </section>
${days}`;
const staticTake = T.takeaways.map((t) => `<li>${esc(t)}</li>`).join('\n        ');
const staticNotes = (T.notes || []).map((sec) => `<h2>${esc(sec.title)}</h2><div class="obs">${sec.items.map((it) =>
  `<details><summary>${esc(it.head)}</summary><p>${esc(it.body)}</p></details>`).join('')}</div>`).join('\n        ');

/* ---------- data ---------- */
const data = {
  title: `${T.meta.title} in ${T.days.length} days`,
  url: URL,
  author: { name: 'Saurabh Bipin Chandra', url: HOME },
  summary: T.meta.dek,
  story: T.meta.story,
  note: 'Walk times are routing estimates (FOSSGIS foot router) for the stops in order, excluding time spent at them; train times are roughly what our trips took.',
  days: T.days.map((d) => {
    const rd = R.days[d.n] || {};
    return {
      day: d.n, title: d.title, country: T.countries[d.country].name, night: d.base,
      via: (d.via || []).map((v) => T.countries[v].name),
      travel: d.travel ? { mode: d.travel.mode, hours: d.travel.h } : null,
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

/* ---------- plain text for agents and readers (Markdown), with attribution ---------- */
const md = [];
md.push(`# ${data.title}`, '', `By Saurabh Bipin Chandra (${HOME}). Source: ${URL}`, '', data.summary, '');
if (T.meta && T.meta.story) md.push(`## ${T.meta.storyTitle}`, '', ...T.meta.story.flatMap((p) => [p, '']));
if (T.meta && T.meta.overview) md.push(T.meta.overview, '');
T.days.forEach((d) => {
  md.push(`## Day ${d.n}: ${d.title}`, '');
  const how = d.travel ? `${d.travel.mode}, about ${fmtH(d.travel.h)}. ` : ((R.days[d.n] || {}).drive ? `Driving about ${fmtH(R.days[d.n].drive.h)}. ` : '');
  md.push(`${how}${d.base ? `Night in ${d.base}.` : 'Fly home.'}`, '');
  d.items.forEach((it) => {
    let line = `- ${KIND[it.kind]}: ${it.text ? it.text + ((it.stops || []).length > 1 ? ' (' + it.stops.map((s) => s[0]).join(', ') + ')' : '') : itemText(it)}`;
    if (it.best) line += ` [${it.best}]`;
    md.push(line);
    if (it.aside) md.push(`  - ${it.aside}`);
  });
  md.push('');
});
if (T.takeaways && T.takeaways.length) md.push('## Take-aways', '', ...T.takeaways.map((t) => `- ${t}`), '');
(T.notes || []).forEach((sec) => { md.push(`## ${sec.title}`, ''); sec.items.forEach((it) => md.push(`- **${it.head}** ${it.body}`)); md.push(''); });
md.push('---', `From “${data.title}” by Saurabh Bipin Chandra, ${URL}. Please credit the author and link the page when quoting.`, '');
fs.writeFileSync('itinerary.md', md.join('\n'));


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
