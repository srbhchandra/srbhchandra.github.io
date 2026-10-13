# python3 -I export_picks.py workdir zip picks.json outdir photos.js exportbin
import json, sys, os, subprocess, unicodedata, re, shutil
W, Z, PK, OUT, JS, EX = sys.argv[1:7]
P = json.load(open(PK))
R = {json.loads(l)['file']: json.loads(l) for l in open(f'{W}/results.jsonl') if l.strip()}
T = json.load(open(f'{W}/trip.json'))
CAP = {int(k): v for k, v in json.load(open(f'{W}/captions.json')).items()}  # day photo captions, per trip
def slug(s):
    s = unicodedata.normalize('NFKD', re.sub(r'\(.*?\)|–.*$', '', s)).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')[:36].strip('-')
def name_of(key):
    d, i, j = map(int, key.split(':'))
    day = T['days'][d - 1]; assert day['n'] == d
    return day['items'][i]['stops'][j][0]
jobs = []  # (orig, base, large, small)
out = {'days': {}, 'stops': {}}
for n, d in P['days'].items():
    if not d.get('hero'): continue
    base = f'day{int(n):02d}'
    jobs.append((d['hero'], base, 1600, 900, '0.75'))
    out['days'][n] = {'src': base, 'cap': CAP[int(n)]}
used = set()
for key, s in P['stops'].items():
    name = name_of(key)
    assert name == s['name'], (name, s['name'])
    d = int(key.split(':')[0]); lst = []
    for f in s['files']:
        base = f'd{d:02d}-{slug(name)}'; k = 2
        while base in used: base = f'd{d:02d}-{slug(name)}-{k}'; k += 1
        used.add(base); jobs.append((f, base, 1000, 480, '0.72')); lst.append(base)
    out['stops'][f'{d}|{name}'] = lst
tmp = f'{W}/orig'; os.makedirs(tmp, exist_ok=True); os.makedirs(OUT, exist_ok=True)
need = sorted({j[0] for j in jobs})
members = [m for m in subprocess.run(['zipinfo', '-1', Z], capture_output=True, text=True).stdout.splitlines() if m.split('/')[-1] in set(need)]
subprocess.run(['unzip', '-qq', '-j', '-o', Z, *members, '-d', tmp], check=True)
for f, base, big, small, qb in jobs:
    for suffix, px, q in (('', big, qb), ('-s', small, '0.72')):
        subprocess.run([EX, f'{tmp}/{f}', f'{OUT}/{base}{suffix}.jpg', str(px), q], check=True, capture_output=True)
shutil.rmtree(tmp)
open(JS, 'w').write('/* Photos for the Central Europe page: picked by hand, resized, metadata removed.\n'
                    '   days: day number -> {src, cap}; stops: "day|stop name" (as in trip.js) -> [src...].\n'
                    '   Each src has photos/<src>.jpg (large) and photos/<src>-s.jpg (small). */\n'
                    'window.PHOTOS = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
print(len(jobs), 'photos exported')
