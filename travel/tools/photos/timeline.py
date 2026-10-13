# python3 -I timeline.py results.jsonl trip.json out.json
# Photos -> per-day visits (place + time clusters) matched to itinerary stops.
import json, sys, math, datetime as dt, time, urllib.request, urllib.parse, os

res = [json.loads(l) for l in open(sys.argv[1]) if l.strip()]
trip = json.load(open(sys.argv[2]))
DAY1 = dt.date.fromisoformat(json.load(open(os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), 'config.json')))['day1'])  # kept out of the repo

def km(a, b):
    R = 6371; r = math.radians
    dla, dlo = r(b[0]-a[0]), r(b[1]-a[1])
    h = math.sin(dla/2)**2 + math.cos(r(a[0]))*math.cos(r(b[0]))*math.sin(dlo/2)**2
    return 2*R*math.asin(math.sqrt(h))

stops = []
for d in trip['days']:
    for i, it in enumerate(d['items']):
        for j, s in enumerate(it.get('stops') or []):
            if len(s) >= 3:
                stops.append({'day': d['n'], 'i': i, 'j': j, 'name': s[0], 'll': (s[2], s[1]), 'miss': it['kind'] == 'miss'})

def t(p):
    try: return dt.datetime.strptime(p['time'], '%Y:%m:%d %H:%M:%S')
    except Exception: return None

geo = sorted([p for p in res if 'lat' in p and t(p)], key=t)
nogeo = [p for p in res if 'lat' not in p]

# Sequential clustering per day: break on >300 m from centroid or >40 min gap
visits = []
for p in geo:
    ts, ll = t(p), (p['lat'], p['lon'])
    day = (ts.date() - DAY1).days + 1
    v = visits[-1] if visits else None
    if v and v['day'] == day and km(v['c'], ll) < 0.3 and (ts - v['end']).total_seconds() < 2400:
        n = len(v['files']); v['c'] = ((v['c'][0]*n+ll[0])/(n+1), (v['c'][1]*n+ll[1])/(n+1))
        v['files'].append(p['file']); v['end'] = ts
    else:
        visits.append({'day': day, 'c': ll, 'start': ts, 'end': ts, 'files': [p['file']]})

def nearest(ll):
    best = min(stops, key=lambda s: km(s['ll'], ll))
    return best, km(best['ll'], ll)

cache_f = os.path.join(os.path.dirname(sys.argv[3]), 'revgeo.json')
cache = json.load(open(cache_f)) if os.path.exists(cache_f) else {}
def rev(ll):
    k = f'{ll[0]:.4f},{ll[1]:.4f}'
    if k not in cache:
        q = urllib.parse.urlencode({'format': 'json', 'lat': ll[0], 'lon': ll[1], 'zoom': 17, 'accept-language': 'en'})
        req = urllib.request.Request('https://nominatim.openstreetmap.org/reverse?' + q, headers={'User-Agent': 'srbhchandra.github.io itinerary check'})
        try:
            r = json.load(urllib.request.urlopen(req, timeout=20))
            a = r.get('address', {})
            cache[k] = {'name': r.get('name') or '', 'place': a.get('city') or a.get('town') or a.get('village') or a.get('county') or '', 'country': a.get('country_code', '').upper()}
        except Exception as e:
            cache[k] = {'name': '', 'place': f'?{e}', 'country': ''}
        time.sleep(1.1)
        json.dump(cache, open(cache_f, 'w'))
    return cache[k]

out = []
for v in visits:
    s, d = nearest(v['c'])
    rec = {'day': v['day'], 'start': v['start'].strftime('%H:%M'), 'end': v['end'].strftime('%H:%M'),
           'n': len(v['files']), 'lat': round(v['c'][0], 5), 'lon': round(v['c'][1], 5),
           'stop': s['name'], 'stopDay': s['day'], 'km': round(d, 2), 'files': v['files']}
    if d > 0.4 and len(v['files']) >= 2:
        rec['rev'] = rev(v['c'])
    out.append(rec)

seen = {}
for r in out:
    if r['km'] <= 0.4: seen.setdefault((r['stop'], r['stopDay']), []).append(r['day'])
unseen = [s for s in stops if (s['name'], s['day']) not in seen]
json.dump({'visits': out, 'unseen': unseen, 'nogeo': len(nogeo), 'geo': len(geo),
           'models': {m: sum(1 for p in res if p.get('model') == m) for m in {p.get('model') for p in res}},
           'models_geo': {m: sum(1 for p in geo if p.get('model') == m) for m in {p.get('model') for p in geo}}},
          open(sys.argv[3], 'w'), indent=1, default=str)
print('visits', len(out), 'geo', len(geo), 'nogeo', len(nogeo))
