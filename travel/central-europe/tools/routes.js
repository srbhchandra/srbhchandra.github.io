// Rebuild routes.json from trip.js: driving routes (OSRM demo server) and
// walking routes (FOSSGIS foot router), simplified for the map.
// Run after changing stops or drive waypoints in trip.js:
//   cd travel/central-europe && node tools/routes.js trip.js routes.json
// Needs Node 18+ (built-in fetch). Takes about a minute; be gentle with the public servers.
const fs=require('fs');global.window={};eval(fs.readFileSync(process.argv[2],'utf8'));
const T=window.TRIP;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function rdp(pts,eps){if(pts.length<3)return pts;let dmax=0,idx=0;const[a,b]=[pts[0],pts[pts.length-1]];
 for(let i=1;i<pts.length-1;i++){const p=pts[i];const dx=b[0]-a[0],dy=b[1]-a[1];const L=dx*dx+dy*dy;
  let t=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0;t=Math.max(0,Math.min(1,t));const ex=a[0]+t*dx-p[0],ey=a[1]+t*dy-p[1];const d=Math.sqrt(ex*ex+ey*ey);if(d>dmax){dmax=d;idx=i}}
 if(dmax>eps){const l=rdp(pts.slice(0,idx+1),eps),r=rdp(pts.slice(idx),eps);return l.slice(0,-1).concat(r)}return[a,b]}
const round=pts=>pts.map(p=>[+p[0].toFixed(5),+p[1].toFixed(5)]);
async function route(base,pts){const u=`${base}/${pts.map(p=>p.join(',')).join(';')}?overview=full&geometries=geojson`;
 for(let i=0;i<3;i++){const r=await (await fetch(u,{headers:{'User-Agent':'srbhchandra.github.io itinerary'}})).json();if(r.code==='Ok')return r.routes[0];await sleep(2000)}throw new Error('route failed '+u)}
(async()=>{const out={days:{}};
for(const d of T.days){const o={};
 if(d.drive){const r=await route('https://router.project-osrm.org/route/v1/driving',d.drive);
  o.drive={km:Math.round(r.distance/1000),h:+(r.duration/3600).toFixed(2),line:round(rdp(r.geometry.coordinates,0.00025))};await sleep(1200)}
 o.walks={};
 for(const [i,it] of d.items.entries()){if(it.kind!=='walk')continue;const pts=(it.stops||[]).filter(s=>s.length>=3).map(s=>[s[1],s[2]]);
  const uniq=pts.filter((p,j)=>!j||p[0]!==pts[j-1][0]||p[1]!==pts[j-1][1]);if(uniq.length<2)continue;
  const r=await route('https://routing.openstreetmap.de/routed-foot/route/v1/driving',uniq);
  o.walks[i]={km:+(r.distance/1000).toFixed(1),min:Math.round(r.duration/60),line:round(rdp(r.geometry.coordinates,0.00004))};await sleep(1200)}
 out.days[d.n]=o;console.error(d.n,o.drive?`${o.drive.km}km ${o.drive.h}h ${o.drive.line.length}pts`:'-',Object.entries(o.walks).map(([k,w])=>`walk${k}:${w.km}km/${w.min}m`).join(' '))}
// Planned days ("Plan your version"): drives only; their walks reuse the original days'
 out.plan={};
 const P=T.plan||{};const pdays=[...Object.values(P.versions||{}).flatMap(v=>(v.replace||[]).map(x=>x.with)),...Object.values(P.extras||{}).map(e=>e.day)];
 for(const d of pdays){if(!d.drive)continue;const r=await route('https://router.project-osrm.org/route/v1/driving',d.drive);
  out.plan[d.key]={drive:{km:Math.round(r.distance/1000),h:+(r.duration/3600).toFixed(2),line:round(rdp(r.geometry.coordinates,0.00025))}};
  console.error('plan',d.key,out.plan[d.key].drive.km+'km',out.plan[d.key].drive.h+'h');await sleep(1200)}
fs.writeFileSync(process.argv[3],JSON.stringify(out));})();
