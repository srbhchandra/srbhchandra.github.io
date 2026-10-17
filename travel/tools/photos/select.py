# python3 -I select.py workdir [per_stop] [per_day]
# Shortlist photos for the picker: one row per day (the day photo) and one per stop.
# Writes workdir/candidates.json. Needs results.jsonl, trip.json and config.json
# ({"day1": "YYYY-MM-DD"}) in workdir.
#  - Drops photos with faces or prominent people, screenshots, and near-duplicates
#    (taken within 90 s of a better one).
#  - Stop photos are geotagged photos taken that day near the stop (1 km for nature
#    stops, 250 m otherwise); a photo goes to its nearest stop.
#  - Food stops only get photos the image classifier labels as food (when labels exist).
import json, sys, math, datetime as dt, os
W = sys.argv[1]
PER_STOP = int(sys.argv[2]) if len(sys.argv) > 2 else 6
PER_DAY = int(sys.argv[3]) if len(sys.argv) > 3 else 10
res = [json.loads(l) for l in open(f'{W}/results.jsonl') if l.strip()]
trip = json.load(open(f'{W}/trip.json'))
DAY1 = dt.date.fromisoformat(json.load(open(os.path.join(W, 'config.json')))['day1'])
FOOD = {'food', 'sushi', 'rice', 'vegetable', 'fruit', 'broccoli', 'lettuce', 'frozen', 'dessert',
        'noodle', 'meat', 'bread', 'pizza', 'cake', 'soup', 'salad', 'sandwich', 'plate', 'bowl'}
def km(a, b):
    r = math.radians; dla, dlo = r(b[0]-a[0]), r(b[1]-a[1])
    h = math.sin(dla/2)**2 + math.cos(r(a[0]))*math.cos(r(b[0]))*math.sin(dlo/2)**2
    return 12742*math.asin(math.sqrt(h))
def labels(p): return {l.split(':')[0]: float(l.split(':')[1]) for l in p.get('labels', [])}
def is_food(p):
    if 'labels' not in p: return True  # older analysis without labels: don't filter
    lb = labels(p); return any(k in FOOD and v >= 0.2 for k, v in lb.items())
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
                stops.append({'key': f"{d['n']}:{i}:{j}", 'day': d['n'], 'name': s[0], 'll': (s[2], s[1]),
                              'r': 1.0 if wide else 0.25, 'food': it['kind'] == 'food',
                              'hl': 'hl' in (it.get('tags') or []) or bool(it.get('best')) or (len(s) > 3 and 'hl' in str(s[3]))})
ok = lambda p: p['t'] and not p.get('utility') and p.get('faceMax', 0) <= 0.0015 and p.get('humanMax', 0) <= 0.08 and 'aes' in p
for p in res:
    p['stop'] = None
    if not ok(p) or 'lat' not in p: continue
    cand = [(km(s['ll'], (p['lat'], p['lon'])), s) for s in stops if s['day'] == p['day'] and (not s['food'] or is_food(p))]
    cand = [c for c in cand if c[0] <= c[1]['r']]
    if cand: p['stop'] = min(cand, key=lambda c: c[0])[1]['key']
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
    day = {'n': d['n'], 'title': d['title'], 'hero': [p['file'] for p in top([p for p in dp if not is_food(p) or 'labels' not in p], PER_DAY)], 'stops': []}
    for s in [s for s in stops if s['day'] == d['n']]:
        sp = [p for p in dp if p['stop'] == s['key']]
        day['stops'].append({'key': s['key'], 'name': s['name'], 'hl': s['hl'], 'food': s['food'], 'files': [p['file'] for p in top(sp, PER_STOP)]})
    C['days'].append(day)
json.dump(C, open(f'{W}/candidates.json', 'w'), indent=1)
print(sum(len(d['hero']) for d in C['days']), 'day-photo candidates;', sum(len(s['files']) for d in C['days'] for s in d['stops']), 'stop candidates;',
      sum(1 for d in C['days'] for s in d['stops'] if s['files']), 'of', sum(len(d['stops']) for d in C['days']), 'stops have photos')
