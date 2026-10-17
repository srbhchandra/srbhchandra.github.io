# python3 -I picker.py workdir -> workdir/picker.html (local only: personal photos)
# Click a photo to select or unselect it. "Move" sends a photo to another row of the
# same day (a different place, or the day photo), for when a photo landed in the
# wrong place. "Download my picks" saves the choices as JSON for export_picks.py.
import json, sys, html, os
W = sys.argv[1]
C = json.load(open(f'{W}/candidates.json'))
res = {json.loads(l)['file']: json.loads(l) for l in open(f'{W}/results.jsonl') if l.strip()}
th = lambda f: 'thumbs/' + res[f]['thumb']
def tile(f, opts):
    return (f"<span class='t'><img loading='lazy' src='{th(f)}' data-f='{html.escape(f)}'>"
            f"<select title='Move to another place'>{opts}</select></span>")
parts = []
for d in C['days']:
    rows = [('hero', f"day{d['n']}", 'Photo for the day (pick one)', d['hero'])] + \
           [('stop', s['key'], ('★ ' if s['hl'] else '') + s['name'] + (' (food)' if s.get('food') else ''), s['files']) for s in d['stops']]
    opts = "<option value=''>Move…</option>" + ''.join(f"<option value='{k}'>{html.escape(lab)}</option>" for _, k, lab, _ in rows)
    parts.append(f"<section><h2>Day {d['n']} · {html.escape(d['title'])}</h2>")
    for kind, key, lab, files in rows:
        attr = f"data-hero='{d['n']}'" if kind == 'hero' else f"data-stop='{key}' data-name='{html.escape(lab.lstrip('★ ').replace(' (food)', ''))}'"
        parts.append(f"<p class='lab'>{html.escape(lab)}</p><div class='row' id='r-{key}' {attr}>" + ''.join(tile(f, opts) for f in files) +
                     ("<span class='none'>no photos found near here</span>" if not files else '') + '</div>')
    parts.append('</section>')
page = """<!doctype html><html><head><meta charset='utf-8'><title>Pick photos</title>
<style>
body{margin:0;background:#faf9f5;color:#1f1e1b;font:15px/1.5 -apple-system,system-ui,sans-serif}
header{position:sticky;top:0;background:#faf9f5;border-bottom:1px solid #e2ded4;padding:10px 20px;display:flex;gap:16px;align-items:center;z-index:2;flex-wrap:wrap}
header b{font-weight:600} button{font:inherit;padding:6px 14px;border-radius:999px;border:1px solid #1f1e1b;background:#1f1e1b;color:#faf9f5;cursor:pointer}
main{padding:0 20px 80px} h2{margin:28px 0 6px;font-size:20px} .lab{margin:12px 0 4px;color:#6b675f;font-size:13px}
.row{display:flex;gap:8px;overflow-x:auto;min-height:40px;padding-bottom:4px}
.t{display:flex;flex-direction:column;gap:3px;flex:none}
.t img{height:150px;border-radius:6px;cursor:pointer;outline:3px solid transparent;outline-offset:-3px;opacity:.72}
.t img.on{outline-color:#2a78d6;opacity:1} .row[data-hero] img.on{outline-color:#eb6834}
.t select{font-size:11px;color:#6b675f;border:1px solid #e2ded4;border-radius:6px;background:#fff;max-width:200px}
.t.moved img{box-shadow:0 0 0 2px #1baf7a}
.none{color:#b5ae9f;font-size:13px;align-self:center}
small{color:#6b675f}
</style></head><body>
<header><b>Pick photos for the page</b><span id='n'></span><button id='dl'>Download my picks</button>
<small>Click to select. Orange = the day's photo (one per day); blue = photos for a place. "Move…" sends a photo to another place of that day (green = moved). Double-click opens it larger.</small></header>
<main>""" + ''.join(parts) + """</main>
<script>
const KEY='picks-'+location.pathname;
let saved=null; try{saved=JSON.parse(localStorage.getItem(KEY))}catch(e){}
const rowOf=(img)=>img.closest('.row');
// Restore moves, then selections
if(saved&&saved.moves){Object.entries(saved.moves).forEach(([f,to])=>{const img=document.querySelector(`img[data-f="${CSS.escape(f)}"]`),r=document.getElementById('r-'+to);if(img&&r){r.appendChild(img.closest('.t'));img.closest('.t').classList.add('moved');}});}
const sel=new Set(saved?saved.selected||[]:[]);
if(!saved){document.querySelectorAll('.row').forEach(r=>{const i=r.querySelector('img');if(i)sel.add(i.dataset.f)});}
const moves=saved&&saved.moves?saved.moves:{};
function paint(){document.querySelectorAll('img[data-f]').forEach(i=>i.classList.toggle('on',sel.has(i.dataset.f)));save();}
document.addEventListener('click',e=>{const i=e.target.closest('img[data-f]');if(!i)return;const r=rowOf(i);
  if(r.dataset.hero){r.querySelectorAll('img').forEach(x=>{if(x!==i)sel.delete(x.dataset.f)});}
  sel.has(i.dataset.f)?sel.delete(i.dataset.f):sel.add(i.dataset.f);paint();});
document.addEventListener('dblclick',e=>{const i=e.target.closest('img[data-f]');if(i)open(i.src,'_blank');});
document.addEventListener('change',e=>{const s=e.target.closest('.t select');if(!s||!s.value)return;const t=s.closest('.t'),r=document.getElementById('r-'+s.value);
  if(r){r.appendChild(t);t.classList.add('moved');moves[t.querySelector('img').dataset.f]=s.value;sel.add(t.querySelector('img').dataset.f);
    if(r.dataset.hero)r.querySelectorAll('img').forEach(x=>{if(x!==t.querySelector('img'))sel.delete(x.dataset.f)});}
  s.value='';paint();});
function picks(){const o={days:{},stops:{}};
  document.querySelectorAll('.row').forEach(r=>{const on=[...r.querySelectorAll('img')].map(i=>i.dataset.f).filter(f=>sel.has(f));
    if(r.dataset.hero){o.days[r.dataset.hero]={hero:on[0]||null}} else if(on.length){o.stops[r.dataset.stop]={name:r.dataset.name,files:on}}});
  return o;}
function save(){try{localStorage.setItem(KEY,JSON.stringify({selected:[...sel],moves}))}catch(e){}
  const p=picks();document.getElementById('n').textContent=Object.values(p.days).filter(d=>d.hero).length+' day photos, '+Object.values(p.stops).reduce((a,s)=>a+s.files.length,0)+' place photos';}
paint();
document.getElementById('dl').onclick=()=>{const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(picks(),null,1)],{type:'application/json'}));a.download='""" + os.path.basename(os.path.abspath(W)).replace('-work', '') + """-picks.json';a.click();};
</script></body></html>"""
open(f'{W}/picker.html', 'w').write(page)
print('ok')
