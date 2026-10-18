/* Japan (adapted from the Central Europe page): day strip, filters, a map that
   follows the scroll, and exports. Travel between bases is by train (`travel`).
   Content comes from trip.js (window.TRIP), photos from photos.js, routes from routes.json. */
(async function () {
  const T = window.TRIP;
  const C = T.countries;
  const PL = T.plan || null; // no shorter/longer versions yet
  const M = T.meta;
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NEUTRAL = '#c9c4b8'; // Slovakia: passed through, no nights
  const BASE_DAYS = T.days.length;

  let R = { days: {}, plan: {} };
  try { R = await (await fetch('routes.json')).json(); } catch (e) { /* page still works without routes */ }

  /* ---------- formatting ---------- */
  const fmtH = (h) => { const q = Math.max(0.5, Math.round(h * 2) / 2); return `${Math.floor(q) || ''}${q % 1 ? '½' : ''} h`; };
  const fmtKm = (km) => km >= 100 ? Math.round(km / 10) * 10 : km;
  const walkKm = (d) => Object.values(d.walks).reduce((a, w) => a + w.km, 0);

  /* ---------- the version being shown ---------- */
  const qs = new URLSearchParams(location.search);
  let nDays = PL ? Math.min(PL.max, Math.max(PL.min, +qs.get('days') || BASE_DAYS)) : BASE_DAYS;
  let more = qs.get('more') === 'city' ? 'city' : 'nature';
  let days = [];

  // Build the days for nDays from the hand-written versions in trip.js. Skipped days
  // stay in the list (shown faded and collapsed); `days` holds only the kept ones.
  let allDays = [];
  function resolveDays() {
    const copy = (it, o, dropped) => ({ ...it, _o: o, dropped: !!dropped });
    const base = (d) => ({ ...d, key: String(d.n), orig: d.n, photo: d.n, skipped: false, edited: false,
      items: d.items.map((it, i) => copy(it, [d.n, i])) });
    const planned = (pd, orig) => ({ ...pd, orig, via: pd.via || null, skipped: false, edited: true,
      items: pd.items.map((it) => (it.from ? copy(T.days[it.from[0] - 1].items[it.from[1]], it.from, it.dropped) : copy(it, null))) });
    let list = T.days.map(base);
    if (nDays < BASE_DAYS) {
      const v = PL.versions[nDays];
      (v.replace || []).forEach((r) => { const at = list.findIndex((d) => d.orig === r.day); list[at] = planned(r.with, r.day); });
      v.skip.forEach((n) => { list.find((d) => d.orig === n).skipped = true; });
    }
    if (nDays > BASE_DAYS) {
      const order = more === 'city' ? ['city', 'nature'] : ['nature', 'city'];
      order.slice(0, nDays - BASE_DAYS).forEach((k) => {
        const e = PL.extras[k], at = list.findIndex((d) => d.orig === e.after);
        list.splice(at + 1, 0, planned(e.day, null));
      });
    }
    let n = 0;
    list.forEach((d) => {
      d.n = d.skipped ? null : ++n;
      d.drive = d.travel ? { h: d.travel.h, km: null, mode: d.travel.mode, line: d.travel.line } : null;
      d.walks = {};
      d.items.forEach((it, j) => {
        if (it.kind === 'walk' && it._o && !it.dropped) { const w = ((R.days[it._o[0]] || {}).walks || {})[it._o[1]]; if (w) d.walks[j] = w; }
      });
    });
    allDays = list;
    return list.filter((d) => !d.skipped);
  }
  const live = (d) => d.items.filter((it) => !it.dropped);

  /* ---------- filters ---------- */
  // Stop tags are a space-separated string in the 4th slot: 'hl history'
  const stags = (s) => (s[3] || '').split(' ');
  const hasTag = (it, t) => (it.tags || []).includes(t) || (it.stops || []).some((s) => stags(s).includes(t));
  // First group splits every item by kind (they add up to Everything); the second cuts across
  const FILTERS = [
    ['all', 'Everything', () => true, 1],
    ['walk', 'City walks', (it) => it.kind === 'walk', 1],
    ['see', 'Sights', (it) => it.kind === 'see', 1],
    ['food', 'Food & drink', (it) => it.kind === 'food', 1],
    ['miss', 'Missed', (it) => it.kind === 'miss', 1],
    ['hl', 'Highlights', (it) => hasTag(it, 'hl') || !!it.best, 2],
    ['nature', 'Nature', (it) => hasTag(it, 'nature'), 2],
    ['history', 'History', (it) => hasTag(it, 'history'), 2],
    ['tour', 'Tours & tickets', (it) => hasTag(it, 'tour') || hasTag(it, 'book'), 2]
  ];
  let filter = 'all';
  const matches = (it) => FILTERS.find((f) => f[0] === filter)[2](it);

  /* ---------- photos (photos.js) ---------- */
  const PH = window.PHOTOS || { days: {}, stops: {} };
  const stopPhotos = (origDay, name) => (origDay ? PH.stops[`${origDay}|${name}`] || [] : []);
  const imgSmall = (src) => `photos/${src}-s.jpg`;
  const imgLarge = (src) => `photos/${src}.jpg`;
  const caps = {}; // src -> caption, for photos opened outside a day's gallery
  let gallery = {}; // shown day -> [{src, cap}], the order the viewer steps through
  const photoBtn = (day, src, label, inner, style = '') =>
    `<button type="button" data-photo="${src}" data-pday="${day}" aria-label="View photo: ${esc(label)}"${style ? ` style="${style}"` : ''}>${inner}</button>`;
  // Box sized to the photo's own aspect ratio, so nothing is cropped
  const fit = (p, maxW, maxH) => { const k = Math.min(maxW / p.w, maxH / p.h); return [Math.round(p.w * k), Math.round(p.h * k)]; };

  const lb = el('dialog', 'lightbox');
  lb.innerHTML = `<figure><img alt=""><figcaption></figcaption></figure>
    <button type="button" class="lb-prev" aria-label="Previous photo">‹</button>
    <button type="button" class="lb-next" aria-label="Next photo">›</button>
    <button type="button" class="lb-close" aria-label="Close">×</button>`;
  document.body.appendChild(lb);
  let lbList = [], lbDay = 0, lbI = 0;
  function lbShow() {
    const p = lbList[lbI], img = lb.querySelector('img');
    img.src = imgLarge(p.src);
    img.alt = p.cap;
    lb.querySelector('figcaption').textContent = [p.cap, lbDay ? `Day ${lbDay}` : '', lbList.length > 1 ? `${lbI + 1} of ${lbList.length}` : ''].filter(Boolean).join(' · ');
  }
  function openPhoto(day, src) {
    const g = gallery[day] || [];
    const i = g.findIndex((p) => p.src === src);
    if (i >= 0) { lbList = g; lbI = i; lbDay = day; } else { lbList = [{ src, cap: caps[src] || '' }]; lbI = 0; lbDay = 0; }
    lbShow();
    if (!lb.open) lb.showModal();
  }
  const step = (k) => { const n = lbList.length; lbI = (lbI + k + n) % n; lbShow(); };
  lb.querySelector('.lb-prev').addEventListener('click', () => step(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => step(1));
  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.tagName === 'FIGURE') lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-photo]');
    if (b) { e.preventDefault(); openPhoto(+b.dataset.pday, b.dataset.photo); }
  });

  // Mosaic under the title: four days that sell the trip (original day numbers)
  const MOSAIC = M.mosaic || []; // [[original day, label], ...], first one large
  $('#mosaic').innerHTML = MOSAIC.filter(([n]) => PH.days[n]).map(([n, label]) =>
    `<button type="button" data-goto-orig="${n}" aria-label="Go to ${label}"><img src="${imgSmall(PH.days[n].src)}" alt="${esc(PH.days[n].cap)}"><span>${label}</span></button>`).join('');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-goto], [data-goto-orig]');
    if (!b) return;
    e.preventDefault();
    if (b.dataset.goto) goTo(+b.dataset.goto);
    else { const k = +b.dataset.gotoOrig, d = days.find((x) => x.orig === k) || days.find((x) => x.photo === k); if (d) goTo(d.n); }
  });

  /* ---------- Google Maps links and the My Maps file ---------- */
  const mapped = (d) => {
    const pts = [];
    live(d).forEach((it) => { if (it.kind === 'miss') return; (it.stops || []).forEach((s) => { if (s.length >= 3) pts.push({ name: s[0], lat: s[2], lon: s[1], it }); }); });
    return pts.filter((p, i) => !i || p.lat !== pts[i - 1].lat || p.lon !== pts[i - 1].lon);
  };
  // Google allows 9 waypoints between origin and destination (3 in mobile browsers),
  // so longer days are split into parts that share their end points
  function gmapsLinks(d) {
    const pts = mapped(d).map((p) => `${p.lat.toFixed(5)},${p.lon.toFixed(5)}`);
    if (!pts.length) return [];
    if (pts.length === 1) return [`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pts[0])}`];
    const mode = d.drive ? 'transit' : 'walking', links = [];
    for (let i = 0; i < pts.length - 1; i += 10) {
      const c = pts.slice(i, i + 11);
      links.push(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(c[0])}&destination=${encodeURIComponent(c[c.length - 1])}` +
        (c.length > 2 ? `&waypoints=${encodeURIComponent(c.slice(1, -1).join('|'))}` : '') + `&travelmode=${mode}`);
    }
    return links;
  }
  const xml = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
  function kml() {
    const pm = [];
    days.forEach((d) => {
      mapped(d).forEach((p) => pm.push(`<Placemark><name>${xml(`Day ${d.n} · ${p.name}`)}</name><description>${xml(p.it.text || p.it.label || '')}</description><Point><coordinates>${p.lon},${p.lat}</coordinates></Point></Placemark>`));
      if (d.drive) pm.push(`<Placemark><name>${xml(`Day ${d.n} · ${d.drive.mode}`)}</name><LineString><coordinates>${d.drive.line.map((c) => c.join(',')).join(' ')}</coordinates></LineString></Placemark>`);
    });
    return `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${xml(`${M.title} in ${days.length} days`)}</name>` +
      `<description>${xml(location.origin + location.pathname)}</description>${pm.join('')}</Document></kml>\n`;
  }

  /* ---------- static pieces ---------- */
  const KIND = { walk: 'Walk', see: 'See', food: 'Eat', miss: 'Missed' };
  const box = $('#days');
  const strip = $('#strip');
  const fbox = $('#filters');
  const bar = $('#bar');
  const setBarH = () => document.documentElement.style.setProperty('--barH', bar.offsetHeight + 'px');
  new ResizeObserver(setBarH).observe(bar); // re-measure when web fonts land or the filters wrap

  $('#takeaways').innerHTML = T.takeaways.map((t) => `<li>${esc(t)}</li>`).join('');
  if (M.quote) {
    const q = M.quote, dims = (PH.extra || {})[q.photo];
    caps[q.photo] = q.caption;
    const fig = el('figure', 'quote');
    fig.innerHTML = `<blockquote>${esc(q.text)}</blockquote><figcaption>${esc(q.by)}</figcaption>` +
      (dims ? photoBtn(0, q.photo, q.caption, `<img src="${imgSmall(q.photo)}" loading="lazy" alt="${esc(q.caption)}" width="${dims.w}" height="${dims.h}">`) : '');
    const h = $('#takeaways').previousElementSibling;
    h.parentNode.insertBefore(fig, h);
  }
  const photoDims = {};
  Object.values(PH.stops).flat().forEach((p) => { photoDims[p.src] = p; });
  $('#notes').innerHTML = (T.notes || []).map((sec) => `<h2 id="notes-${sec.title.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}">${esc(sec.title)}</h2><div class="obs">${sec.items.map((it) => {
    const figs = (it.photos || []).filter(([src]) => photoDims[src]).map(([src, cap]) => {
      caps[src] = cap;
      const [w, h] = fit(photoDims[src], 560, 420);
      return `<figure class="notephoto">${photoBtn(0, src, cap,
        `<img src="${imgSmall(src)}" srcset="${imgSmall(src)} 480w, ${imgLarge(src)} 1600w" sizes="${w}px" loading="lazy" alt="${esc(cap)}" width="${w}" height="${h}">`,
        `aspect-ratio: ${w} / ${h}; max-width: ${w}px`)}<figcaption>${esc(cap)}</figcaption></figure>`;
    }).join('');
    return `<details><summary>${esc(it.head)}</summary><p>${esc(it.body)}</p>${figs}</details>`;
  }).join('')}</div>`).join('');

  /* ---------- rendering (re-run whenever the version changes) ---------- */
  let itemIndex = [], features = [], sections = [];
  const fromCountry = (d, i) => (i ? days[i - 1].country : d.country);
  const segBg = (d, i) => {
    const a = C[fromCountry(d, i)].color, b = C[d.country].color;
    if (d.via) return `linear-gradient(90deg, ${a} 0 38%, ${NEUTRAL} 38% 62%, ${b} 62%)`;
    return a === b ? b : `linear-gradient(90deg, ${a} 0 50%, ${b} 50%)`;
  };

  function render() {
    days = resolveDays();
    const N = days.length;
    $('h1').textContent = `${M.title} in ${N} days`;

    // Stats
    const totKm = days.reduce((a, d) => a + (d.drive ? d.drive.km : 0), 0);
    const totH = days.reduce((a, d) => a + (d.drive ? d.drive.h : 0), 0);
    const totWalk = days.reduce((a, d) => a + walkKm(d), 0);
    const nStops = days.reduce((a, d) => a + live(d).reduce((b, it) => b + (it.kind === 'miss' ? 0 : (it.stops || [it]).length), 0), 0);
    const visited = new Set(days.flatMap((d) => [d.country, ...(d.via || [])]));
    const stats = [[`${N}`, 'days'], [`${visited.size}`, 'places to stay']];
    if (totH) stats.push([`${Math.round(totH)} h`, 'on trains and buses']);
    if (totWalk) stats.push([`${Math.round(totWalk)} km`, 'of mapped city walks']);
    stats.push([`${nStops}`, 'stops']);
    $('#stats').innerHTML = stats.map(([b, t]) => `<span><b>${b}</b>${t}</span>`).join('');

    // Day strip and legend
    strip.innerHTML = '';
    strip.style.gridTemplateColumns = `repeat(${N}, minmax(0, 1fr))`;
    days.forEach((d, i) => {
      const b = el('button', d.edited ? 'changed' : null);
      b.type = 'button';
      b.dataset.day = d.n;
      b.setAttribute('aria-label', `Day ${d.n}: ${d.place}`);
      b.innerHTML = `<span>${d.n}</span><span class="seg" style="background:${segBg(d, i)}"></span>`;
      b.addEventListener('click', () => goTo(d.n));
      strip.appendChild(b);
    });
    const nights = {};
    days.forEach((d) => { if (d.base) nights[d.country] = (nights[d.country] || 0) + 1; });
    $('#legend').innerHTML = Object.entries(C).filter(([k]) => visited.has(k)).map(([k, c]) =>
      `<span><i style="background:${c.color || NEUTRAL}"></i>${c.name}${nights[k] ? ' ' + nights[k] : ''}</span>`).join('');

    // Filters, with counts for this version
    fbox.innerHTML = '';
    FILTERS.forEach(([key, label, fn, group], k) => {
      if (k && group !== FILTERS[k - 1][3]) fbox.appendChild(el('span', 'fsep'));
      const n = days.reduce((a, d) => a + live(d).filter(fn).length, 0);
      const b = el('button', null, `${label}<small>${n}</small>`);
      b.type = 'button';
      b.dataset.f = key;
      b.setAttribute('aria-pressed', key === filter);
      b.addEventListener('click', () => setFilter(key));
      fbox.appendChild(b);
    });

    // Photo galleries per shown day
    gallery = {};
    days.forEach((d) => {
      const g = [], hero = d.photo ? PH.days[d.photo] : null;
      if (hero) { g.push({ src: hero.src, cap: hero.cap }); caps[hero.src] = hero.cap; }
      live(d).forEach((it) => (it.stops || []).forEach((st) => stopPhotos(it._o && it._o[0], st[0]).forEach((p) => { g.push({ src: p.src, cap: st[0] }); caps[p.src] = st[0]; })));
      gallery[d.n] = g;
    });

    // Overview
    box.innerHTML = ''; // also drops the static copy baked in by tools/build.js
    const ov = el('section', 'overview');
    ov.id = 'day-0';
    ov.dataset.day = 0;
    const nightsText = Object.entries(nights).map(([k, n]) => `${n} in ${C[k].name}`).join(', ');
    ov.innerHTML = (M.story ? `<p class="daynum">${esc(M.storyKicker)}</p><h2>${esc(M.storyTitle)}</h2>
      <div class="story">${M.story.map((p) => `<p>${esc(p).replace(/&lt;a href=&quot;(#[a-z-]+)&quot;&gt;(.*?)&lt;\/a&gt;/g, '<a href="$1">$2</a>')}</p>`).join('')}</div>
      <p class="daynum route-k">The route</p><h3>${esc(M.overviewTitle)}</h3>` : `<p class="daynum">The route</p><h2>${esc(M.overviewTitle)}</h2>`) + `
      <p>${esc(M.overview)}</p>
      <p>Nights: ${nightsText}.<span class="noprint"> Scroll, or pick a day above; the map follows.</span></p>
      <ul class="bests">${days.flatMap((d) => live(d).filter((it) => it.best).map((it) =>
        `<li><span class="badge best">★ ${esc(it.best)}</span> <a href="#day-${d.n}" data-goto="${d.n}">${esc((it.stops || []).length === 1 ? it.stops[0][0] : d.title)}</a> <span class="when">Day ${d.n}</span></li>`)).join('')}</ul>`;
    box.appendChild(ov);

    // Days
    itemIndex = [];
    allDays.forEach((d) => {
      if (!d.skipped) return;
      d._skipEl = el('section', 'day skipped');
      d._skipEl.innerHTML = `<details><summary>Skipped in this version: ${esc(d.title)}</summary><ul class="items">${d.items.map((it) =>
        `<li class="dropped"><span class="kind">${KIND[it.kind]}</span><span class="body">${esc(it.text || [it.label, (it.stops || []).map((st) => st[0]).join(', ')].filter(Boolean).join(': '))}</span></li>`).join('')}</ul></details>`;
    });
    days.forEach((d, di) => {
      const s = el('section', 'day');
      s.id = `day-${d.n}`;
      s.dataset.day = d.n;
      const meta = [];
      if (d.drive) meta.push(`${esc(d.drive.mode)}, <b>about ${fmtH(d.drive.h)}</b>`);
      const wk = walkKm(d);
      if (wk >= 1) meta.push(`Walking <b>about ${Math.round(wk * 2) / 2} km</b>`);
      meta.push(d.base ? `Night in <b>${esc(d.base)}</b>` : 'Fly home in the evening');
      if (d.via) meta.push(`Through ${d.via.map((v) => C[v].name).join(', ')}`);
      const links = gmapsLinks(d);
      const gl = links.length ? `<span class="gmaps">${links.map((u, k) => `<a href="${u}" target="_blank" rel="noopener">${k ? `part ${k + 1}` : (links.length > 1 ? 'Google Maps, part 1' : 'Open in Google Maps')}</a>`).join(' · ')}</span>` : '';
      const hero = d.photo ? PH.days[d.photo] : null;
      const heroHtml = hero ? `<figure class="dayphoto">${photoBtn(d.n, hero.src, hero.cap,
        `<img src="${imgSmall(hero.src)}" srcset="${imgSmall(hero.src)} 900w, ${imgLarge(hero.src)} 1600w" sizes="(max-width: 900px) 100vw, 30rem" loading="lazy" alt="${esc(hero.cap)}" width="${hero.w}" height="${hero.h}">`,
        // Portrait photos: full height within 60% of the screen, never cropped
        `aspect-ratio: ${hero.w} / ${hero.h}; max-width: min(100%, calc(60vh * ${(hero.w / hero.h).toFixed(3)}))`)}<figcaption>${esc(hero.cap)}</figcaption></figure>` : '';
      s.innerHTML = heroHtml + `<p class="daynum"><i style="background:${segBg(d, di)}"></i>Day ${d.n}</p>
        <h2>${esc(d.title)}${d.note ? ` <span class="note">${esc(d.note)}</span>` : ''}</h2>
        <p class="meta">${meta.map((m) => `<span>${m}</span>`).join('')}${gl}</p>`;
      const ul = el('ul', 'items');
      d.items.forEach((it, i) => {
        const li = el('li', [it.kind, (it.tags || []).includes('hl') ? 'hl' : '', it.added ? 'added' : '', it.dropped ? 'dropped' : ''].join(' ').trim());
        const stops = it.stops || [];
        const stopHtml = (st, j) => st.length >= 3
          ? `<a href="#map" class="stop${stags(st).includes('hl') ? ' hl' : ''}" data-day="${d.n}" data-i="${i}" data-j="${j}">${esc(st[0])}</a>`
          : esc(st[0]);
        let body;
        if (it.text) {
          body = `<span class="lead">${esc(it.text)}</span>`;
          const mp = stops.filter((st) => st.length >= 3);
          if (stops.length > 1 || (mp.length === 1 && it.kind === 'miss')) body += ` <span class="sep">—</span> ` + stops.map(stopHtml).join('<span class="sep">, </span>');
          else if (mp.length === 1) body = `<a href="#map" class="stop lead" data-day="${d.n}" data-i="${i}" data-j="${stops.indexOf(mp[0])}">${esc(it.text)}</a>`;
        } else {
          body = (it.label ? `<span class="lead">${esc(it.label)}:</span> ` : '') +
            stops.map(stopHtml).join(it.kind === 'walk' ? '<span class="sep"> → </span>' : '<span class="sep">, </span>');
        }
        const w = it.dropped ? null : d.walks[i];
        if (w) body += ` <span class="wm">${w.km} km · ~${Math.max(5, Math.round(w.min / 5) * 5)} min</span>`;
        if (it.best) body += ` <span class="badge best">★ ${esc(it.best)}</span>`;
        if (it.added) body += ` <span class="badge add">Suggested, not on our trip</span>`;
        if ((it.tags || []).includes('book')) body += ` <span class="badge book">Book ahead</span>`;
        if (hasTag(it, 'history')) body += ` <span class="badge book">History</span>`;
        if (it.dropped) body = `<span class="lead">${esc(it.text || [it.label, stops.map((st) => st[0]).join(', ')].filter(Boolean).join(': '))}</span> <span class="badge drop">Skipped in this version</span>`;
        const pics = it.dropped ? [] : stops.flatMap((st) => stopPhotos(it._o && it._o[0], st[0]).map((p) => ({ ...p, name: st[0] })));
        if (pics.length) body += `<span class="thumbs">${pics.map((p) => {
          const [pw, ph] = fit(p, 120, 72);
          return photoBtn(d.n, p.src, p.name, `<img src="${imgSmall(p.src)}" loading="lazy" alt="${esc(p.name)}" width="${pw}" height="${ph}">`, `width:${pw}px;height:${ph}px`);
        }).join('')}</span>`;
        if (it.aside && !it.dropped) body += `<span class="aside">${esc(it.aside)}</span>`;
        li.innerHTML = `<span class="kind">${KIND[it.kind]}</span><span class="body">${body}</span>`;
        li.addEventListener('mouseenter', () => hover(d.n, i, true, li));
        li.addEventListener('mouseleave', () => hover(d.n, i, false, li));
        ul.appendChild(li);
        if (!it.dropped) itemIndex.push({ day: d.n, i, it, li });
      });
      s.appendChild(ul);
      d._el = s;
    });
    allDays.forEach((d) => box.appendChild(d.skipped ? d._skipEl : d._el)); // trip order, skipped days in place

    // Map features
    features = [];
    days.forEach((d) => d.items.forEach((it, i) => (it.stops || []).forEach((st, j) => {
      if (st.length < 3 || it.dropped) return;
      features.push({ day: d.n, pday: it._o ? it._o[0] : 0, i, j, it, name: st[0], ll: [st[1], st[2]],
        hl: (it.tags || []).includes('hl') || !!it.best || stags(st).includes('hl'), miss: it.kind === 'miss' });
    })));

    sections = [...document.querySelectorAll('.overview, .day:not(.skipped)')];
    setBarH();
    setFilter(filter, true);
    active = -1;
    onScroll();
    renderPlanner();
  }

  /* ---------- active day from scroll ---------- */
  let active = -1;
  const mobile = () => matchMedia('(max-width: 900px)').matches;
  function refLine() {
    const top = bar.offsetHeight + (mobile() ? document.querySelector('.mapwrap').offsetHeight : 0);
    return top + (innerHeight - top) * 0.35;
  }
  function onScroll() {
    const y = refLine();
    let cur = 0;
    for (const s of sections) if (s.getBoundingClientRect().top <= y) cur = +s.dataset.day;
    if (cur !== active) setActive(cur);
  }
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); } }, { passive: true });

  function goTo(n, instant) {
    const s = document.getElementById(`day-${n}`);
    if (!s) return;
    // Mobile: the sticky map covers the top of the text column
    const off = mobile() ? document.querySelector('.mapwrap').offsetHeight : 0;
    const y = s.getBoundingClientRect().top + scrollY - bar.offsetHeight - off - 8;
    scrollTo({ top: y, behavior: reduced || instant ? 'auto' : 'smooth' });
  }

  function setActive(n) {
    active = n;
    strip.querySelectorAll('button').forEach((b) => {
      const k = +b.dataset.day;
      if (k === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('past', n > 0 && k < n);
    });
    const d = days.find((x) => x.n === n);
    if (d) {
      $('#caption').innerHTML = `<b>Day ${n}</b> · ${esc(d.place)}` + (d.drive ? `<span class="capdrive"> · about ${fmtH(d.drive.h)} of travel</span>` : '');
    } else {
      $('#caption').innerHTML = `<b>${days.length} days</b> · ${esc(M.subtitle)}`;
    }
    updateMap(true);
  }

  /* ---------- filtering ---------- */
  function setFilter(f, quiet) {
    filter = f;
    fbox.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.f === f));
    const seen = {};
    itemIndex.forEach(({ day, it, li }) => {
      const ok = matches(it);
      li.hidden = !ok;
      if (ok) seen[day] = true;
    });
    document.querySelectorAll('.day:not(.skipped)').forEach((s) => s.classList.toggle('empty', !seen[s.dataset.day]));
    document.querySelectorAll('.day.skipped').forEach((s) => { s.hidden = filter !== 'all'; });
    setBarH();
    if (quiet) return;
    updateMap(false);
    onScroll();
  }

  /* ---------- map ---------- */
  let map = null, popup = null, ready = false;
  const hot = new Set();

  function stopsGeo() {
    return { type: 'FeatureCollection', features: features.map((f, id) => {
      const ok = matches(f.it);
      // vis: 0 hidden, 1 faint, 2 shown
      let vis;
      if (active === 0) vis = filter === 'all' ? 0 : (ok ? 2 : 0);
      else vis = f.day === active ? (ok ? 2 : 1) : (filter !== 'all' && ok ? 1 : 0);
      return { type: 'Feature', id, geometry: { type: 'Point', coordinates: f.ll },
        properties: { name: f.name, day: f.day, pday: f.pday, vis, hl: f.hl ? 1 : 0, miss: f.miss ? 1 : 0, hot: hot.has(`${f.day}:${f.i}`) ? 1 : 0 } };
    }) };
  }
  function routesGeo() {
    const fs = [];
    days.forEach((d) => {
      if (d.drive) fs.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: d.drive.line },
        properties: { kind: 'drive', on: active === 0 || d.n === active ? 1 : 0 } });
      Object.entries(d.walks).forEach(([i, w]) => fs.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: w.line },
        properties: { kind: 'walk', on: d.n === active && matches(d.items[i]) ? 1 : 0 } }));
    });
    return { type: 'FeatureCollection', features: fs };
  }
  function bounds(n) {
    const pts = [];
    if (n === 0) {
      days.forEach((d) => d.drive && pts.push(...d.drive.line));
      if (!pts.length) features.forEach((f) => pts.push(f.ll));
    } else {
      const d = days.find((x) => x.n === n);
      if (d && d.drive) pts.push(...d.drive.line);
      features.filter((f) => f.day === n).forEach((f) => pts.push(f.ll));
    }
    if (!pts.length) return null;
    const b = new maplibregl.LngLatBounds(pts[0], pts[0]);
    pts.forEach((p) => b.extend(p));
    return b;
  }
  // Extra room on the right for the zoom buttons, at the bottom for the attribution
  function pad() { return mobile() ? { top: 24, right: 52, bottom: 36, left: 24 } : { top: 48, right: 68, bottom: 56, left: 48 }; }

  function updateMap(move) {
    if (!ready) return;
    map.getSource('stops').setData(stopsGeo());
    map.getSource('routes').setData(routesGeo());
    if (move && active >= 0) {
      if (popup) popup.remove();
      const b = bounds(active);
      if (b) map.fitBounds(b, { padding: pad(), maxZoom: 15, duration: reduced ? 0 : 1400, essential: true });
    }
  }
  function hover(day, i, on, li) {
    li.classList.toggle('hot', on);
    if (on) hot.add(`${day}:${i}`); else hot.delete(`${day}:${i}`);
    if (ready) map.getSource('stops').setData(stopsGeo());
  }
  function popupHtml(name, day, pday) {
    const ps = stopPhotos(pday, name);
    const [w, h] = ps.length ? (mobile() ? fit(ps[0], 180, 130) : fit(ps[0], 240, 200)) : [0, 0];
    return (ps.length ? `<img class="pop" src="${imgSmall(ps[0].src)}" alt="${esc(name)}" data-photo="${ps[0].src}" data-pday="${day}" width="${w}" height="${h}" style="width:${w}px;height:${h}px">` : '') +
      `${esc(name)}<small>Day ${day}${ps.length > 1 ? ` · ${ps.length} photos` : ''}</small>`;
  }
  function showStop(f) {
    if (!map) return;
    if (f.day !== active) goTo(f.day);
    if (popup) popup.remove();
    map.flyTo({ center: f.ll, zoom: Math.max(map.getZoom(), 14.5), duration: reduced ? 0 : 1000, essential: true });
    popup = new maplibregl.Popup({ closeButton: false, offset: 12 }).setLngLat(f.ll)
      .setHTML(popupHtml(f.name, f.day, f.pday)).addTo(map);
  }

  /* ---------- phones: hide or show the map ---------- */
  const mtog = $('#maptoggle');
  function setMapHidden(hide) {
    document.body.classList.toggle('nomap', hide);
    mtog.setAttribute('aria-pressed', hide);
    mtog.textContent = hide ? 'Show map' : 'Hide map';
    try { localStorage.setItem('ce-nomap', hide ? '1' : '0'); } catch (e) { /* storage blocked */ }
    if (!hide && map) { map.resize(); updateMap(true); }
    // The map's space came or went: stay on the day being read
    if (active > 0) goTo(active, true); else onScroll();
  }
  mtog.addEventListener('click', () => setMapHidden(!document.body.classList.contains('nomap')));

  box.addEventListener('click', (e) => {
    const b = e.target.closest('.stop');
    if (!b) return;
    e.preventDefault();
    if (document.body.classList.contains('nomap')) setMapHidden(false); // a place was tapped: bring the map back
    const f = features.find((x) => x.day === +b.dataset.day && x.i === +b.dataset.i && x.j === +b.dataset.j);
    if (f) showStop(f);
  });

  /* ---------- "Plan your version" ---------- */
  const ptoggle = $('#ptoggle'), pbody = $('#pbody'), slider = $('#pslider'), pout = $('#pout');
  if (PL) { slider.min = PL.min; slider.max = PL.max; slider.value = nDays; } else { ptoggle.hidden = true; }
  function renderPlanner() {
    if (!PL) { $('#psum').textContent = `${days.length} days, as we did it`; return; }
    const N = days.length;
    slider.value = N;
    pout.textContent = `${N} days`;
    $('#psum').textContent = N === BASE_DAYS ? `${N} days, as we did it` : `Your version: ${N} days`;
    $('#pmore').hidden = N <= BASE_DAYS;
    document.querySelectorAll('#pmore button').forEach((b) => {
      const on = N >= BASE_DAYS + 2 || b.dataset.more === more;
      b.setAttribute('aria-pressed', on);
    });
    const changes = N < BASE_DAYS ? PL.versions[N].summary
      : N > BASE_DAYS ? (more === 'city' ? ['city', 'nature'] : ['nature', 'city']).slice(0, N - BASE_DAYS).map((k) => PL.extras[k].summary) : [];
    $('#pchanges').innerHTML = changes.length ? changes.map((c) => `<li>${esc(c)}</li>`).join('') : '<li>No changes: this is the trip exactly as we did it.</li>';
    // Shareable address for this version
    const q = new URLSearchParams(location.search);
    if (N === BASE_DAYS) q.delete('days'); else q.set('days', N);
    if (N > BASE_DAYS && N < BASE_DAYS + 2) q.set('more', more); else q.delete('more');
    const s = q.toString();
    history.replaceState(null, '', location.pathname + (s ? `?${s}` : '') + location.hash);
  }
  ptoggle.addEventListener('click', () => {
    const open = pbody.hidden;
    pbody.hidden = !open;
    ptoggle.setAttribute('aria-expanded', open);
    setBarH();
  });
  slider.addEventListener('input', () => { pout.textContent = `${slider.value} days`; });
  slider.addEventListener('change', () => { nDays = +slider.value; render(); updateMap(true); });
  document.querySelectorAll('#pmore button').forEach((b) => b.addEventListener('click', () => {
    if (days.length >= BASE_DAYS + 2) return;
    more = b.dataset.more; render(); updateMap(true);
  }));
  // Exports
  $('#xpdf').addEventListener('click', () => print());
  $('#xkml').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([kml()], { type: 'application/vnd.google-earth.kml+xml' }));
    a.download = `japan-${days.length}-days.kml`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('#xlink').addEventListener('click', async () => {
    const b = $('#xlink'), label = b.textContent;
    try { await navigator.clipboard.writeText(location.href); b.textContent = 'Link copied'; } catch (e) { b.textContent = 'Copy failed'; }
    setTimeout(() => { b.textContent = label; }, 1800);
  });
  // Printing (Save as PDF): show everything, notes open
  let beforePrintFilter = null, openedForPrint = [];
  addEventListener('beforeprint', () => {
    beforePrintFilter = filter;
    if (filter !== 'all') setFilter('all', true);
    openedForPrint = [...document.querySelectorAll('#notes details:not([open])')];
    openedForPrint.forEach((d) => { d.open = true; });
  });
  addEventListener('afterprint', () => {
    openedForPrint.forEach((d) => { d.open = false; });
    if (beforePrintFilter && beforePrintFilter !== 'all') setFilter(beforePrintFilter, true);
  });

  /* ---------- first render, then the map ---------- */
  render();
  if (nDays !== BASE_DAYS) { pbody.hidden = false; ptoggle.setAttribute('aria-expanded', true); setBarH(); }

  const INK = '#1f1e1b', PAPER = '#faf9f5', MUTED = '#6b675f', FOCUS = '#2a78d6';
  try {
    if (!window.maplibregl) throw new Error('no map library');
    map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/positron',
      bounds: bounds(0), fitBoundsOptions: { padding: pad() },
      attributionControl: { compact: true },
      cooperativeGestures: mobile(),
      dragRotate: false, pitchWithRotate: false
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.on('load', () => {
      // Warm the basemap to match the page
      const tint = [['background', 'background-color', '#f5efe3'], ['landuse_residential', 'fill-color', '#f0e7d8'],
        ['park', 'fill-color', '#e2ead0'], ['landcover_wood', 'fill-color', '#dde7c8'], ['water', 'fill-color', '#cde2e4'],
        ['waterway', 'line-color', '#bcd9dd'], ['building', 'fill-color', '#e9dfcd']];
      tint.forEach(([layer, prop, color]) => { try { map.setPaintProperty(layer, prop, color); } catch (e) { /* layer missing */ } });
      // English place names where OpenStreetMap has them (Japanese otherwise)
      map.getStyle().layers.filter((l) => l.type === 'symbol' && l.layout && l.layout['text-field']).forEach((l) => {
        try { map.setLayoutProperty(l.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']]); } catch (e) { /* skip */ }
      });
      const before = 'waterway_line_label';
      map.addSource('routes', { type: 'geojson', data: routesGeo() });
      map.addSource('stops', { type: 'geojson', data: stopsGeo() });
      map.addLayer({ id: 'drive-all', type: 'line', source: 'routes', filter: ['==', ['get', 'kind'], 'drive'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#b5ae9f', 'line-width': 2 } }, before);
      map.addLayer({ id: 'drive-casing', type: 'line', source: 'routes',
        filter: ['all', ['==', ['get', 'kind'], 'drive'], ['==', ['get', 'on'], 1]],
        layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': PAPER, 'line-width': 6 } }, before);
      map.addLayer({ id: 'drive-on', type: 'line', source: 'routes',
        filter: ['all', ['==', ['get', 'kind'], 'drive'], ['==', ['get', 'on'], 1]],
        layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': INK, 'line-width': 3 } }, before);
      map.addLayer({ id: 'walk-on', type: 'line', source: 'routes',
        filter: ['all', ['==', ['get', 'kind'], 'walk'], ['==', ['get', 'on'], 1]],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': FOCUS, 'line-width': 3, 'line-dasharray': [0.1, 2] } });
      map.addLayer({ id: 'stops', type: 'circle', source: 'stops', filter: ['>', ['get', 'vis'], 0],
        paint: {
          'circle-radius': ['case', ['==', ['get', 'hot'], 1], 8, ['==', ['get', 'hl'], 1], 6, 5],
          'circle-color': ['case', ['==', ['get', 'miss'], 1], PAPER, ['==', ['get', 'hot'], 1], FOCUS, ['==', ['get', 'hl'], 1], INK, PAPER],
          'circle-stroke-color': ['case', ['==', ['get', 'miss'], 1], MUTED, ['==', ['get', 'hot'], 1], PAPER, INK],
          'circle-stroke-width': ['case', ['==', ['get', 'hl'], 1], 2, 1.75],
          'circle-opacity': ['case', ['==', ['get', 'vis'], 2], 1, 0.35],
          'circle-stroke-opacity': ['case', ['==', ['get', 'vis'], 2], 1, 0.35]
        } });
      map.addLayer({ id: 'stops-label', type: 'symbol', source: 'stops',
        filter: ['all', ['==', ['get', 'vis'], 2], ['any', ['==', ['get', 'hl'], 1], ['==', ['get', 'hot'], 1], ['>=', ['zoom'], 13]]],
        layout: { 'text-field': ['get', 'name'], 'text-font': ['Noto Sans Regular'], 'text-size': 12,
          'text-offset': [0, 1], 'text-anchor': 'top', 'text-max-width': 9, 'text-optional': true,
          'symbol-sort-key': ['-', 0, ['get', 'hl']] },
        paint: { 'text-color': INK, 'text-halo-color': PAPER, 'text-halo-width': 1.6 } });
      map.on('click', 'stops', (e) => {
        const p = e.features[0].properties;
        if (popup) popup.remove();
        popup = new maplibregl.Popup({ closeButton: false, offset: 12 }).setLngLat(e.lngLat)
          .setHTML(popupHtml(p.name, p.day, p.pday)).addTo(map);
      });
      map.on('mouseenter', 'stops', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'stops', () => { map.getCanvas().style.cursor = ''; });
      ready = true;
      updateMap(true);
    });
  } catch (e) {
    map = null;
    document.querySelector('.mapwrap').appendChild(el('div', 'mapfail', 'The map could not load here. The itinerary below is complete without it.'));
  }

  let startHidden = false;
  try { startHidden = localStorage.getItem('ce-nomap') === '1'; } catch (e) { /* storage blocked */ }
  if (startHidden) setMapHidden(true);
  if (location.hash.startsWith('#day-')) goTo(+location.hash.slice(5));
})();
