// Check map pins in trip.js against OpenStreetMap's Nominatim geocoder.
// Prints stops whose best match is more than 400 m away (FAR) or not found (NONE).
// A FAR or NONE is a prompt to look, not proof of an error: same-name places mislead it.
//   cd travel/central-europe && node tools/verify.js trip.js
// Nominatim allows 1 request a second, so this takes about two minutes.
const fs=require('fs');global.window={};eval(fs.readFileSync(process.argv[2],'utf8'));
const T=window.TRIP;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const hav=(a,b)=>{const R=6371,r=x=>x*Math.PI/180;const dLa=r(b[1]-a[1]),dLo=r(b[0]-a[0]);const h=Math.sin(dLa/2)**2+Math.cos(r(a[1]))*Math.cos(r(b[1]))*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(h));};
(async()=>{const seen=new Set();
for(const d of T.days)for(const it of d.items)for(const s of (it.stops||[])){if(s.length<3||seen.has(s[0]))continue;seen.add(s[0]);
 const q=s[0].replace(/\(.*?\)|–.*$/g,'').trim();
 const url=`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}&viewbox=${s[1]-0.3},${s[2]+0.2},${s[1]+0.3},${s[2]-0.2}&bounded=1`;
 try{const r=await (await fetch(url,{headers:{'User-Agent':'srbhchandra.github.io itinerary check'}})).json();
  if(!r.length)console.log(`NONE  D${d.n} ${q}`);else{const km=hav([s[1],s[2]],[+r[0].lon,+r[0].lat]);console.log(`${km>0.4?'FAR ':'ok  '} ${km.toFixed(2)}km D${d.n} ${q} -> ${(+r[0].lon).toFixed(4)},${(+r[0].lat).toFixed(4)} | ${r[0].display_name.slice(0,60)}`);}
 }catch(e){console.log('ERR',q,e.message)}
 await sleep(1100);}})();
