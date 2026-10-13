# python3 -I picker.py workdir -> workdir/picker.html (local only: personal photos)
import json, sys, html
W = sys.argv[1]
C = json.load(open(f'{W}/candidates.json'))
res = {json.loads(l)['file']: json.loads(l) for l in open(f'{W}/results.jsonl') if l.strip()}
th = lambda f: 'thumbs/' + res[f]['thumb']
parts = []
for d in C['days']:
    parts.append(f"<section><h2>Day {d['n']} · {html.escape(d['title'])}</h2>"
                 f"<p class='lab'>Photo for the day (pick one)</p><div class='row' data-hero='{d['n']}'>" +
                 ''.join(f"<img loading='lazy' src='{th(f)}' data-f='{html.escape(f)}'>" for f in d['hero']) + '</div>')
    for s in d['stops']:
        parts.append(f"<p class='lab'>{'★ ' if s['hl'] else ''}{html.escape(s['name'])}</p><div class='row' data-stop='{s['key']}' data-name='{html.escape(s['name'])}'>" +
                     ''.join(f"<img loading='lazy' src='{th(f)}' data-f='{html.escape(f)}'>" for f in s['files']) + '</div>')
    parts.append('</section>')
page = """<!doctype html><html><head><meta charset='utf-8'><title>Pick photos · Central Europe</title>
<style>
body{margin:0;background:#faf9f5;color:#1f1e1b;font:15px/1.5 -apple-system,system-ui,sans-serif}
header{position:sticky;top:0;background:#faf9f5;border-bottom:1px solid #e2ded4;padding:10px 20px;display:flex;gap:16px;align-items:center;z-index:2}
header b{font-weight:600} button{font:inherit;padding:6px 14px;border-radius:999px;border:1px solid #1f1e1b;background:#1f1e1b;color:#faf9f5;cursor:pointer}
main{padding:0 20px 80px} h2{margin:28px 0 6px;font-size:20px} .lab{margin:10px 0 4px;color:#6b675f;font-size:13px}
.row{display:flex;gap:6px;overflow-x:auto} .row img{height:150px;border-radius:6px;cursor:pointer;outline:3px solid transparent;outline-offset:-3px;opacity:.75}
.row img.on{outline-color:#2a78d6;opacity:1} .row[data-hero] img.on{outline-color:#eb6834}
small{color:#6b675f}
</style></head><body>
<header><b>Pick photos for the page</b><span id='n'></span><button id='dl'>Download my picks</button>
<small>Click to select or unselect. Orange = the day's photo (one per day), blue = photos for a stop. Double-click opens a photo larger.</small></header>
<main>""" + ''.join(parts) + """</main>
<script>
const KEY='ce-picks';
let saved=null; try{saved=JSON.parse(localStorage.getItem(KEY))}catch(e){}
const rows=[...document.querySelectorAll('.row')];
rows.forEach(r=>{const imgs=[...r.querySelectorAll('img')];
  const pre = saved ? (r.dataset.hero ? [saved.days?.[r.dataset.hero]?.hero] : (saved.stops?.[r.dataset.stop]?.files||[])) : [imgs[0]?.dataset.f];
  imgs.forEach(i=>{ if(pre.includes(i.dataset.f)) i.classList.add('on');
    i.addEventListener('click',()=>{ if(r.dataset.hero){imgs.forEach(x=>x.classList.toggle('on',x===i))} else i.classList.toggle('on'); save(); });
    i.addEventListener('dblclick',()=>open(i.src,'_blank')); });});
function picks(){const o={days:{},stops:{}};
  rows.forEach(r=>{const on=[...r.querySelectorAll('img.on')].map(i=>i.dataset.f);
    if(r.dataset.hero){o.days[r.dataset.hero]={hero:on[0]||null}} else if(on.length){o.stops[r.dataset.stop]={name:r.dataset.name,files:on}}});
  return o;}
function save(){const p=picks(); try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}
  document.getElementById('n').textContent=Object.values(p.days).filter(d=>d.hero).length+' day photos, '+Object.values(p.stops).reduce((a,s)=>a+s.files.length,0)+' stop photos';}
save();
document.getElementById('dl').onclick=()=>{const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(picks(),null,1)],{type:'application/json'}));a.download='central-europe-picks.json';a.click();};
</script></body></html>"""
open(f'{W}/picker.html', 'w').write(page)
print('ok')
