/* Central Europe: day strip, filters and a map that follows the scroll.
   Content comes from trip.js (window.TRIP), routes from routes.json. */
(async function () {
  const T = window.TRIP;
  const C = T.countries;
  const days = T.days;
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NEUTRAL = '#c9c4b8'; // Slovakia: passed through, no nights

  let R = { days: {} };
  try { R = await (await fetch('routes.json')).json(); } catch (e) { /* page still works without routes */ }

  /* ---------- formatting ---------- */
  const fmtH = (h) => { const q = Math.max(0.5, Math.round(h * 2) / 2); return `${Math.floor(q) || ''}${q % 1 ? '½' : ''} h`; };
  const fmtKm = (km) => km >= 100 ? Math.round(km / 10) * 10 : km;
  const walkKm = (n) => Object.values((R.days[n] || {}).walks || {}).reduce((a, w) => a + w.km, 0);

  /* ---------- filters ---------- */
  const FILTERS = [
    ['all', 'Everything', () => true],
    ['hl', 'Highlights', (it) => (it.tags || []).includes('hl') || !!it.best || (it.stops || []).some((s) => s[3] === 'hl')],
    ['walk', 'City walks', (it) => it.kind === 'walk'],
    ['food', 'Food & drink', (it) => it.kind === 'food'],
    ['nature', 'Nature', (it) => (it.tags || []).includes('nature')],
    ['tour', 'Tours & tickets', (it) => (it.tags || []).some((t) => t === 'tour' || t === 'book')],
    ['miss', 'Missed', (it) => it.kind === 'miss']
  ];
  let filter = 'all';
  const matches = (it) => FILTERS.find((f) => f[0] === filter)[2](it);

  /* ---------- stats ---------- */
  const driveDays = days.filter((d) => R.days[d.n] && R.days[d.n].drive);
  const totKm = driveDays.reduce((a, d) => a + R.days[d.n].drive.km, 0);
  const totH = driveDays.reduce((a, d) => a + R.days[d.n].drive.h, 0);
  const totWalk = days.reduce((a, d) => a + walkKm(d.n), 0);
  const nStops = days.reduce((a, d) => a + d.items.reduce((b, it) => b + (it.kind === 'miss' ? 0 : (it.stops || [it]).length), 0), 0);
  const stats = [['14', 'days'], ['7', 'countries']];
  if (totKm) stats.push([(Math.round(totKm / 100) * 100).toLocaleString('en'), `km driven, about ${Math.round(totH)} h`]);
  if (totWalk) stats.push([`${Math.round(totWalk)} km`, 'of mapped city walks']);
  stats.push([`${nStops}`, 'stops']);
  $('#stats').innerHTML = stats.map(([b, t]) => `<span><b>${b}</b>${t}</span>`).join('');

  /* ---------- day strip ---------- */
  const fromCountry = (d, i) => (i ? days[i - 1].country : d.country);
  const segBg = (d, i) => {
    const a = C[fromCountry(d, i)].color, b = C[d.country].color;
    if (d.via) return `linear-gradient(90deg, ${a} 0 38%, ${NEUTRAL} 38% 62%, ${b} 62%)`;
    return a === b ? b : `linear-gradient(90deg, ${a} 0 50%, ${b} 50%)`;
  };
  const strip = $('#strip');
  days.forEach((d, i) => {
    const b = el('button');
    b.type = 'button';
    b.dataset.day = d.n;
    b.setAttribute('aria-label', `Day ${d.n}: ${d.place}`);
    b.innerHTML = `<span>${d.n}</span><span class="seg" style="background:${segBg(d, i)}"></span>`;
    b.addEventListener('click', () => goTo(d.n));
    strip.appendChild(b);
  });
  const nights = {};
  days.forEach((d) => { nights[d.country] = (nights[d.country] || 0) + 1; });
  $('#legend').innerHTML = Object.entries(C).map(([k, c]) =>
    `<span><i style="background:${c.color || NEUTRAL}"></i>${c.name}${nights[k] ? ' ' + nights[k] : ''}</span>`).join('');

  /* ---------- filters UI ---------- */
  const fbox = $('#filters');
  FILTERS.forEach(([key, label, fn]) => {
    const n = key === 'all' ? null : days.reduce((a, d) => a + d.items.filter(fn).length, 0);
    const b = el('button', null, `${label}${n != null ? `<small>${n}</small>` : ''}`);
    b.type = 'button';
    b.dataset.f = key;
    b.setAttribute('aria-pressed', key === filter);
    b.addEventListener('click', () => setFilter(key));
    fbox.appendChild(b);
  });

  /* ---------- day sections ---------- */
  const KIND = { walk: 'Walk', see: 'See', food: 'Eat', miss: 'Missed' };

  /* ---------- photos (photos.js) ---------- */
  const PH = window.PHOTOS || { days: {}, stops: {} };
  const stopPhotos = (n, name) => PH.stops[`${n}|${name}`] || [];
  const imgSmall = (src) => `photos/${src}-s.jpg`;
  const imgLarge = (src) => `photos/${src}.jpg`;
  const gallery = {}; // day -> [{src, cap}], the order the viewer steps through
  days.forEach((d) => {
    const g = [];
    if (PH.days[d.n]) g.push({ src: PH.days[d.n].src, cap: PH.days[d.n].cap });
    d.items.forEach((it) => (it.stops || []).forEach((st) => stopPhotos(d.n, st[0]).forEach((src) => g.push({ src, cap: st[0] }))));
    gallery[d.n] = g;
  });
  const photoBtn = (day, src, label, inner) =>
    `<button type="button" data-photo="${src}" data-pday="${day}" aria-label="View photo: ${esc(label)}">${inner}</button>`;

  const lb = el('dialog', 'lightbox');
  lb.innerHTML = `<figure><img alt=""><figcaption></figcaption></figure>
    <button type="button" class="lb-prev" aria-label="Previous photo">‹</button>
    <button type="button" class="lb-next" aria-label="Next photo">›</button>
    <button type="button" class="lb-close" aria-label="Close">×</button>`;
  document.body.appendChild(lb);
  let lbDay = 0, lbI = 0;
  function lbShow() {
    const g = gallery[lbDay], p = g[lbI], img = lb.querySelector('img');
    img.src = imgLarge(p.src);
    img.alt = p.cap;
    lb.querySelector('figcaption').textContent = `${p.cap} · Day ${lbDay} · ${lbI + 1} of ${g.length}`;
  }
  function openPhoto(day, src) {
    lbDay = day;
    lbI = Math.max(0, gallery[day].findIndex((p) => p.src === src));
    lbShow();
    if (!lb.open) lb.showModal();
  }
  const step = (k) => { const n = gallery[lbDay].length; lbI = (lbI + k + n) % n; lbShow(); };
  lb.querySelector('.lb-prev').addEventListener('click', () => step(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => step(1));
  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.tagName === 'FIGURE') lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-photo]');
    if (b) { e.preventDefault(); openPhoto(+b.dataset.pday, b.dataset.photo); }
  });

  // Mosaic under the title: four days that sell the trip
  const MOSAIC = { 2: 'Prague', 7: 'Budapest', 12: 'Vintgar Gorge', 14: 'The Dolomites' };
  $('#mosaic').innerHTML = Object.entries(MOSAIC).filter(([n]) => PH.days[n]).map(([n, label]) =>
    `<button type="button" data-goto="${n}" aria-label="Go to day ${n}: ${label}"><img src="${imgSmall(PH.days[n].src)}" alt="${esc(PH.days[n].cap)}"><span>Day ${n} · ${label}</span></button>`).join('');
  $('#mosaic').addEventListener('click', (e) => { const b = e.target.closest('[data-goto]'); if (b) goTo(+b.dataset.goto); });
  const box = $('#days');
  const ov = el('section', 'overview');
  ov.id = 'day-0';
  ov.dataset.day = 0;
  const nightsText = Object.entries(nights).map(([k, n]) => `${n} in ${C[k].name}`).join(', ');
  ov.innerHTML = `<p class="daynum">The route</p><h2>Prague to Venice by car</h2>
    <p>Fly into Prague, fly out of Venice, and drive in between. The cities are best on foot, so the days alternate: whole days walking in Prague, Krakow, Budapest and Vienna, and driving days that string together caves, castles and mountain passes.</p>
    <p>Nights: ${nightsText}. Slovakia is on the way twice. Scroll, or pick a day above; the map follows.</p>`;
  box.appendChild(ov);

  const itemIndex = []; // {day, i, li}
  days.forEach((d, di) => {
    const s = el('section', 'day');
    s.id = `day-${d.n}`;
    s.dataset.day = d.n;
    const rd = R.days[d.n] || {};
    const meta = [];
    if (rd.drive) meta.push(`Driving <b>about ${fmtH(rd.drive.h)}</b> · ${fmtKm(rd.drive.km)} km`);
    const wk = walkKm(d.n);
    if (wk >= 1) meta.push(`Walking <b>about ${Math.round(wk * 2) / 2} km</b>`);
    meta.push(`Night in <b>${d.base}</b>`);
    if (d.via) meta.push(`Through ${d.via.map((v) => C[v].name).join(', ')}`);
    const col = C[d.country].color;
    const hero = PH.days[d.n];
    const heroHtml = hero ? `<figure class="dayphoto">${photoBtn(d.n, hero.src, hero.cap,
      `<img src="${imgSmall(hero.src)}" srcset="${imgSmall(hero.src)} 900w, ${imgLarge(hero.src)} 1600w" sizes="(max-width: 900px) 100vw, 30rem" loading="lazy" alt="${esc(hero.cap)}">`)}<figcaption>${esc(hero.cap)}</figcaption></figure>` : '';
    s.innerHTML = heroHtml + `<p class="daynum"><i style="background:${segBg(d, di)}"></i>Day ${d.n}</p>
      <h2>${esc(d.title)}${d.note ? ` <span class="note">${esc(d.note)}</span>` : ''}</h2>
      <p class="meta">${meta.map((m) => `<span>${m}</span>`).join('')}</p>`;
    const ul = el('ul', 'items');
    d.items.forEach((it, i) => {
      const li = el('li', [it.kind, (it.tags || []).includes('hl') ? 'hl' : ''].join(' ').trim());
      const stops = it.stops || [];
      const stopHtml = (s, j) => s.length >= 3
        ? `<a href="#map" class="stop${s[3] === 'hl' ? ' hl' : ''}" data-day="${d.n}" data-i="${i}" data-j="${j}">${esc(s[0])}</a>`
        : esc(s[0]);
      let body;
      if (it.text) {
        body = `<span class="lead">${esc(it.text)}</span>`;
        const mapped = stops.filter((s) => s.length >= 3);
        if (stops.length > 1 || (mapped.length === 1 && it.kind === 'miss')) body += ` <span class="sep">—</span> ` + stops.map(stopHtml).join('<span class="sep">, </span>');
        else if (mapped.length === 1) body = `<a href="#map" class="stop lead" data-day="${d.n}" data-i="${i}" data-j="${stops.indexOf(mapped[0])}">${esc(it.text)}</a>`;
      } else {
        body = (it.label ? `<span class="lead">${esc(it.label)}:</span> ` : '') +
          stops.map(stopHtml).join(it.kind === 'walk' ? '<span class="sep"> → </span>' : '<span class="sep">, </span>');
      }
      const w = (rd.walks || {})[i];
      if (w) body += ` <span class="wm">${w.km} km · ~${Math.max(5, Math.round(w.min / 5) * 5)} min</span>`;
      if (it.best) body += ` <span class="badge best">★ ${esc(it.best)}</span>`;
      if ((it.tags || []).includes('book')) body += ` <span class="badge book">Book ahead</span>`;
      const pics = stops.flatMap((st) => stopPhotos(d.n, st[0]).map((src) => ({ src, name: st[0] })));
      if (pics.length) body += `<span class="thumbs">${pics.map((p) => photoBtn(d.n, p.src, p.name,
        `<img src="${imgSmall(p.src)}" loading="lazy" alt="${esc(p.name)}">`)).join('')}</span>`;
      li.innerHTML = `<span class="kind">${KIND[it.kind]}</span><span class="body">${body}</span>`;
      li.addEventListener('mouseenter', () => hover(d.n, i, true, li));
      li.addEventListener('mouseleave', () => hover(d.n, i, false, li));
      ul.appendChild(li);
      itemIndex.push({ day: d.n, i, it, li });
    });
    s.appendChild(ul);
    box.appendChild(s);
  });

  $('#takeaways').innerHTML = T.takeaways.map((t) => `<li>${esc(t)}</li>`).join('');

  /* ---------- sticky offsets ---------- */
  const bar = $('#bar');
  const setBarH = () => document.documentElement.style.setProperty('--barH', bar.offsetHeight + 'px');
  setBarH();
  // Re-measure when web fonts land or the filters wrap
  new ResizeObserver(setBarH).observe(bar);

  /* ---------- active day from scroll ---------- */
  const sections = [...document.querySelectorAll('.overview, .day')];
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

  function goTo(n) {
    const s = document.getElementById(`day-${n}`);
    // Mobile: the sticky map covers the top of the text column
    const off = mobile() ? document.querySelector('.mapwrap').offsetHeight : 0;
    const y = s.getBoundingClientRect().top + scrollY - bar.offsetHeight - off - 8;
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
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
      const rd = R.days[n] || {};
      const bits = [`<b>Day ${n}</b> · ${esc(d.place)}`];
      if (rd.drive) bits.push(`about ${fmtH(rd.drive.h)} driving`);
      $('#caption').innerHTML = bits.join(' · ');
    } else {
      $('#caption').innerHTML = `<b>14 days</b> · Prague → Venice`;
    }
    updateMap(true);
  }

  /* ---------- filtering ---------- */
  function setFilter(f) {
    filter = f;
    fbox.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.f === f));
    const seen = {};
    itemIndex.forEach(({ day, it, li }) => {
      const ok = matches(it);
      li.hidden = !ok;
      if (ok) seen[day] = true;
    });
    document.querySelectorAll('.day').forEach((s) => s.classList.toggle('empty', !seen[s.dataset.day]));
    setBarH();
    updateMap(false);
    onScroll();
  }

  /* ---------- map ---------- */
  let map = null, popup = null, ready = false;
  const hot = new Set();
  const features = [];
  days.forEach((d) => d.items.forEach((it, i) => (it.stops || []).forEach((s, j) => {
    if (s.length < 3) return;
    features.push({ day: d.n, i, j, it, name: s[0], ll: [s[1], s[2]],
      hl: (it.tags || []).includes('hl') || !!it.best || s[3] === 'hl', miss: it.kind === 'miss' });
  })));

  function stopsGeo() {
    return { type: 'FeatureCollection', features: features.map((f, id) => {
      const ok = matches(f.it);
      // vis: 0 hidden, 1 faint, 2 shown
      let vis;
      if (active === 0) vis = filter === 'all' ? 0 : (ok ? 2 : 0);
      else vis = f.day === active ? (ok ? 2 : 1) : (filter !== 'all' && ok ? 1 : 0);
      return { type: 'Feature', id, geometry: { type: 'Point', coordinates: f.ll },
        properties: { name: f.name, day: f.day, vis, hl: f.hl ? 1 : 0, miss: f.miss ? 1 : 0, hot: hot.has(`${f.day}:${f.i}`) ? 1 : 0 } };
    }) };
  }
  function routesGeo() {
    const fs = [];
    for (const [n, rd] of Object.entries(R.days)) {
      if (rd.drive) fs.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: rd.drive.line },
        properties: { kind: 'drive', on: active === 0 || +n === active ? 1 : 0 } });
      for (const [i, w] of Object.entries(rd.walks || {})) {
        const it = days.find((d) => d.n === +n).items[i];
        fs.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: w.line },
          properties: { kind: 'walk', on: +n === active && matches(it) ? 1 : 0 } });
      }
    }
    return { type: 'FeatureCollection', features: fs };
  }
  function bounds(n) {
    const pts = [];
    if (n === 0) {
      Object.values(R.days).forEach((rd) => rd.drive && pts.push(...rd.drive.line));
      if (!pts.length) features.forEach((f) => pts.push(f.ll));
    } else {
      const rd = R.days[n] || {};
      if (rd.drive) pts.push(...rd.drive.line);
      features.filter((f) => f.day === n).forEach((f) => pts.push(f.ll));
    }
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
      map.fitBounds(bounds(active), { padding: pad(), maxZoom: 15, duration: reduced ? 0 : 1400, essential: true });
    }
  }
  function hover(day, i, on, li) {
    li.classList.toggle('hot', on);
    if (on) hot.add(`${day}:${i}`); else hot.delete(`${day}:${i}`);
    if (ready) map.getSource('stops').setData(stopsGeo());
  }
  function popupHtml(name, day) {
    const ps = stopPhotos(day, name);
    return (ps.length ? `<img class="pop" src="${imgSmall(ps[0])}" alt="${esc(name)}" data-photo="${ps[0]}" data-pday="${day}">` : '') +
      `${esc(name)}<small>Day ${day}${ps.length > 1 ? ` · ${ps.length} photos` : ''}</small>`;
  }
  function showStop(f) {
    if (!map) return;
    if (f.day !== active) goTo(f.day);
    if (popup) popup.remove();
    map.flyTo({ center: f.ll, zoom: Math.max(map.getZoom(), 14.5), duration: reduced ? 0 : 1000, essential: true });
    popup = new maplibregl.Popup({ closeButton: false, offset: 12 }).setLngLat(f.ll)
      .setHTML(popupHtml(f.name, f.day)).addTo(map);
  }
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.stop');
    if (!b) return;
    e.preventDefault();
    const f = features.find((x) => x.day === +b.dataset.day && x.i === +b.dataset.i && x.j === +b.dataset.j);
    if (f) showStop(f);
  });

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
      map.setPaintProperty('background', 'background-color', '#f3f1ea');
      map.setPaintProperty('water', 'fill-color', '#dfe4e3');
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
          .setHTML(popupHtml(p.name, p.day)).addTo(map);
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

  onScroll();
  if (active < 0) setActive(0);
  if (location.hash.startsWith('#day-')) goTo(+location.hash.slice(5));
})();
