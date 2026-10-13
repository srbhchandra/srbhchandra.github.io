# python3 -I select.py workdir  -> candidates.json + picker.html in workdir
import json, sys, math, datetime as dt, html, os
W = sys.argv[1]
res = [json.loads(l) for l in open(f'{W}/results.jsonl') if l.strip()]
trip = json.load(open(f'{W}/trip.json'))
DAY1 = dt.date.fromisoformat(json.load(open(os.path.join(W, 'config.json')))['day1'])  # kept out of the repo
def km(a, b):
    R = 6371; r = math.radians
    dla, dlo = r(b[0]-a[0]), r(b[1]-a[1])
    h = math.sin(dla/2)**2 + math.cos(r(a[0]))*math.cos(r(b[0]))*math.sin(dlo/2)**2
    return 2*R*math.asin(math.sqrt(h))
for p in res:
    try:
        p['t'] = dt.datetime.strptime(p['time'], '%Y:%m:%d %H:%M:%S'); p['day'] = (p['t'].date() - DAY1).days + 1
    except Exception: p['t'] = None
stops = []
for d in trip['days']:
    for i, it in enumerate(d['items']):
        if it['kind'] == 'miss': continue
        wide = 'nature' in (it.get('tags') or [])
        for j, s in enumerate(it.get('stops') or []):
            if len(s) >= 3:
                stops.append({'key': f"{d['n']}:{i}:{j}", 'day': d['n'], 'name': s[0], 'll': (s[2], s[1]), 'r': 1.0 if wide else 0.2,
                              'hl': 'hl' in (it.get('tags') or []) or bool(it.get('best')) or (len(s) > 3 and s[3] == 'hl')})
geo = sorted([p for p in res if 'lat' in p and p['t']], key=lambda p: p['t'])
for p in geo:
    cand = [(km(s['ll'], (p['lat'], p['lon'])), s) for s in stops if s['day'] == p['day']]
    cand = [c for c in cand if c[0] <= c[1]['r']]
    p['stop'] = min(cand, key=lambda c: c[0])[1]['key'] if cand else None
# Photos without GPS borrow the stop of the nearest geotagged photo within 15 min
import bisect
gt = [p['t'] for p in geo]
for p in res:
    if 'lat' in p or not p['t']: continue
    k = bisect.bisect_left(gt, p['t']); best = None
    for q in geo[max(0, k-1):k+1]:
        if abs((q['t'] - p['t']).total_seconds()) <= 900 and (best is None or abs((q['t']-p['t']).total_seconds()) < abs((best['t']-p['t']).total_seconds())): best = q
    p['stop'] = best['stop'] if best else None
ok = lambda p: p['t'] and 1 <= p['day'] <= 14 and not p.get('utility') and p.get('faceMax', 0) <= 0.0015 and p.get('humanMax', 0) <= 0.08 and 'aes' in p
def top(ps, n):
    out = []
    for p in sorted(ps, key=lambda p: -p['aes']):
        if any(abs((p['t'] - q['t']).total_seconds()) < 90 for q in out): continue
        out.append(p)
        if len(out) == n: break
    return out
C = {'days': []}
for d in trip['days']:
    dp = [p for p in res if ok(p) and p['day'] == d['n']]
    day = {'n': d['n'], 'title': d['title'], 'hero': [p['file'] for p in top(dp, 10)], 'stops': []}
    for s in [s for s in stops if s['day'] == d['n']]:
        sp = [p for p in dp if p.get('stop') == s['key'] and 'lat' in p]  # geotagged only: groups split up
        if sp: day['stops'].append({'key': s['key'], 'name': s['name'], 'hl': s['hl'], 'files': [p['file'] for p in top(sp, 6)]})
    C['days'].append(day)
json.dump(C, open(f'{W}/candidates.json', 'w'), indent=1)
thumb = {p['file']: p['thumb'] for p in res}
aes = {p['file']: p.get('aes', 0) for p in res}
print(sum(len(d['hero']) for d in C['days']), 'hero cands;', sum(len(s['files']) for d in C['days'] for s in d['stops']), 'stop cands;', sum(1 for d in C['days'] for s in d['stops']), 'stops with photos')
for d in C['days']: print(d['n'], len(d['hero']), [f"{s['name'][:18]}:{len(s['files'])}" for s in d['stops']])
