const $ = s => document.querySelector(s);
const D = window.GAME_DATA;
let S, anim = 0;

function reset(){
  S = {phase:'traits', time:300, budget:100, ev:0, weird:0, cred:0, hype:0, susp:0,
       selected:[], phenomenon:null, title:'Untitled Figure', reviewer:'', ending:'', body:'', log:[]};
  log('PI: We need a publishable behavior by midnight. Make the flies do something weird. Then make it look rigorous.');
  render();
}
function log(t){ S.log.push('• '+t); }
function add(o){ for(const k of ['ev','weird','cred','hype','susp']) S[k]=Math.max(0,Math.min(120,S[k]+(o[k]||0))); S.time+=o.time||0; S.budget+=o.budget||0; }
function statName(k){ return ({ev:'Evidence',weird:'Weird',cred:'Cred',hype:'Hype',susp:'Suspicion'})[k]||k; }
function renderStats(){
  $('#stats').innerHTML = `<div class="stat">Time ${S.time}s</div><div class="stat">Budget $${S.budget}</div><div></div>`+
    ['ev','weird','cred','hype','susp'].map(k=>`<div class="stat ${k==='susp'?'bad':'good'}">${statName(k)} ${S[k]}</div>`).join('');
}
function render(){ renderStats(); $('#log').innerHTML=S.log.slice(-9).map(x=>`<div>${x}</div>`).join(''); ({traits,discover,assay,figure,reviewer,final,result})[S.phase](); }
function btn(label, detail, fn, cls='choice'){ const b=document.createElement('button'); b.className=cls; b.innerHTML=`<h3>${label}</h3><p>${detail||''}</p>`; b.onclick=fn; return b; }
function setStage(html){ $('#stage').innerHTML=html; $('#choices').innerHTML=''; }
function choose(c, next){ add(c); if(c.log) log(c.log); if(c.title) S.title=c.title; if(S.time<=0||S.budget<=0) return submit(); if(next) S.phase=next; render(); }
function combo(tags){ return tags.every(t=>S.selectedTags.has(t)|| (t==='social'&&S.selectedTags.has('swarm'))); }
function resolve(){ S.selectedTags=new Set(S.selected.flatMap(t=>t.tags)); return D.phenomena.find(p=>combo(p.tags)) || D.fallback; }
function quickStart(){ S.selected=[D.traits[0],D.traits[3],D.traits[8]]; createLine(); }
function createLine(){ S.selected.forEach(add); S.time-=35; S.budget-=15; S.phenomenon=resolve(); add(S.phenomenon); log('Mutant line created: '+S.selected.map(t=>t.name).join(' + ')); log('NEW PHENOMENON: '+S.phenomenon.name); S.phase='discover'; render(); }

function traits(){
  setStage(`<div class="kicker">Step 1 — Select 3 traits</div><h2>Engineer a publishable fly line</h2><div class="body"><p><b>PI:</b> “Make the flies do something weird. Then make it look rigorous.”</p><div class="objective">Goal: discover one abnormal behavior, gather evidence, frame the figure, survive Reviewer #2, and submit before midnight.</div><p><b>Selected:</b> ${S.selected.length}/3 ${S.selected.map(t=>`<span class="pill">${t.name}</span>`).join('')||'<span class="pill">empty</span><span class="pill">empty</span><span class="pill">empty</span>'}</p></div>`);
  const c=$('#choices'); c.appendChild(btn('Start recommended first run','Blue Light + Hyperactive + Social Bias. Fastest path to a visible phenomenon.', quickStart, 'choice primary'));
  const grid=document.createElement('div'); grid.className='trait-grid';
  D.traits.forEach(t=>{ const sel=S.selected.includes(t); const b=btn((sel?'✓ ':'+ ')+t.name,t.desc,()=>{ if(sel) S.selected=S.selected.filter(x=>x!==t); else if(S.selected.length<3) {S.selected.push(t); log('Trait selected: '+t.name);} render();},'card '+(sel?'selected':'')); grid.appendChild(b); });
  c.appendChild(grid); if(S.selected.length===3) c.appendChild(btn('Create mutant line → discover behavior','Possible behavior: ???',createLine,'choice primary'));
}
function discover(){ setStage(`<div class="kicker">New phenomenon discovered</div><div class="result-title">${S.phenomenon.name}</div><div class="body"><p>Observed visual: <b>${S.phenomenon.visual}</b>.</p><div class="meters">${meterHtml()}</div><p class="hint">Now decide whether to make this result believable or sensational.</p></div>`); $('#choices').appendChild(btn('Proceed to assays','Collect evidence, hype, or control data.',()=>{S.phase='assay';render();},'choice primary')); }
function meterHtml(){ return ['ev','weird','cred','hype','susp'].map(k=>`<div class="meter"><b>${statName(k)}</b><span>${S[k]}</span></div>`).join(''); }
function assay(){ setStage(`<div class="kicker">Assay phase</div><h2>${S.phenomenon.name}</h2><div class="body"><p>More evidence makes the claim believable. Flashier recordings make it publishable.</p><div class="meters">${meterHtml()}</div></div>`); const c=$('#choices'); c.appendChild(btn('Quick replicate','Time -20, Budget -5, Evidence +15, Suspicion +5',()=>choose({time:-20,budget:-5,ev:15,susp:5,log:'Quick replicate: the effect appears again, technically.'}))); c.appendChild(btn('Careful control','Time -45, Budget -15, Evidence +25, Cred +20, Hype -5',()=>choose({time:-45,budget:-15,ev:25,cred:20,hype:-5,log:'Careful control: less exciting, more defensible.'}))); c.appendChild(btn('Flashy recording','Time -25, Budget -10, Hype +25, Evidence +5, Suspicion +10',()=>choose({time:-25,budget:-10,ev:5,hype:25,susp:10,log:'Flashy recording: the lab Slack loses its mind.'}))); c.appendChild(btn('Frame the figure','Package the result as a paper claim.',()=>{S.phase='figure';render();},'choice primary')); }
function figure(){ setStage(`<div class="kicker">Figure framing</div><h2>How hard do you sell it?</h2><div class="body"><p>Same behavior, different academic audacity.</p><div class="meters">${meterHtml()}</div></div>`); const c=$('#choices'); c.appendChild(btn('Conservative Figure','“Blue Light Modulates Locomotor Synchrony” — Cred +25, Hype -10, Susp -10',()=>choose({cred:25,hype:-10,susp:-10,title:'Blue Light Modulates Locomotor Synchrony in Engineered Drosophila'},'reviewer'))); c.appendChild(btn('Big Claim Figure','“A Neural Switch for Collective Decision-Making” — Hype +30, Weird +10, Susp +20',()=>choose({hype:30,weird:10,susp:20,title:'A Neural Switch for Collective Decision-Making in Drosophila'},'reviewer'))); c.appendChild(btn('Beautiful But Vague Figure','“Emergent Behavioral Dynamics” — Hype +20, Cred +5, Susp +10',()=>choose({hype:20,cred:5,susp:10,title:'Emergent Behavioral Dynamics in Engineered Flies'},'reviewer'))); c.appendChild(btn('Data Massage','Risky satire option — Evidence +10, Cred +15, Susp +30',()=>choose({ev:10,cred:15,susp:30,title:'Robust Evidence for Social Phototaxis in Drosophila'},'reviewer'),'choice danger')); }
function pickReviewer(){
  if(S.ev<40) return 'n=12 is not a sample size. It is a rumor.';
  if(S.title.includes('Neural Switch')) return 'Correlation is not neural circuitry.';
  if(S.susp>55) return 'Can anyone reproduce this, including you?';
  if(S.phenomenon.weakness==='ethics') return 'Why are the flies forming committees?';
  if(S.phenomenon.weakness==='control') return 'Where is the heat-control experiment?';
  return 'This is interesting, but interesting is not a mechanism.';
}
function reviewer(){
  S.reviewer=pickReviewer();
  setStage(`<div class="kicker">Reviewer #2 attacks</div><h2>“${S.reviewer}”</h2><div class="body"><p>Your figure title:</p><p class="paper-title">${S.title}</p><div class="meters">${meterHtml()}</div></div>`);
  const c=$('#choices');
  c.appendChild(btn('Add speculative model diagram','Cred +10, Hype +5, Suspicion +10',()=>choose({cred:10,hype:5,susp:10,log:'You add arrows. So many arrows.'},'final')));
  c.appendChild(btn('Weaken the title','Cred +20, Hype -20, Suspicion -10',()=>choose({cred:20,hype:-20,susp:-10,log:'The title becomes responsible. The PI sighs.'},'final')));
  c.appendChild(btn('Invoke mushroom body','Cred +5, Hype +5, Suspicion +5',()=>choose({cred:5,hype:5,susp:5,log:'Mushroom body invoked. Reviewer confusion rises.'},'final')));
}
function final(){
  const acc=Math.max(5,Math.min(95,Math.floor((S.ev+S.cred-S.susp+40)/2)));
  const vir=Math.max(0,Math.min(95,Math.floor((S.hype+S.weird-S.susp/2)/2)));
  const sca=Math.max(0,Math.min(95,Math.floor(S.susp+S.hype/3-S.ev/3)));
  setStage(`<div class="kicker">Final call before midnight</div><h2>Submit now, or risk one more pass?</h2><div class="body"><p>Acceptance chance: <b>${acc}%</b><br>Viral chance: <b>${vir}%</b><br>Scandal chance: <b>${sca}%</b></p><div class="meters">${meterHtml()}</div></div>`);
  const c=$('#choices');
  c.appendChild(btn('Submit manuscript','End run and receive verdict.',submit,'choice primary'));
  c.appendChild(btn('Run one more assay','Time -40, Budget -15, Evidence +20, Cred +5',()=>choose({time:-40,budget:-15,ev:20,cred:5,log:'One more assay. It is always one more assay.'})));
  c.appendChild(btn('Polish figure','Time -25, Hype +10, Cred +5',()=>choose({time:-25,hype:10,cred:5,log:'The figure now looks 17% more inevitable.'})));
}
function submit(){
  if(S.susp>=80 || (S.weird>=95 && S.cred<50)){S.ending='ETHICS COMMITTEE SUMMONED'; S.body='The flies learned to attend the ethics meeting. Bad for methods, excellent for the trailer.';}
  else if(S.ev>=60&&S.weird>=70&&S.cred>=60&&S.susp<40){S.ending='BREAKTHROUGH'; S.body='A terrifyingly good paper. The PI smiles for the first time.';}
  else if(S.hype>=70&&S.susp>=60&&S.ev<70){S.ending='REPLICATION CRISIS'; S.body='Everyone cited you for one week. Then someone repeated the assay.';}
  else if(S.cred<40||S.ev<40){S.ending='DESK REJECTED'; S.body='Reviewer #2 rejected it before becoming Reviewer #2.';}
  else if(S.ev>=70&&S.cred>=70&&S.weird<50){S.ending='SOLID BUT BORING'; S.body='Accepted in a respectable journal no one reads. A real career move.';}
  else if(S.hype>=75&&S.susp<60){S.ending='VIRAL PREPRINT'; S.body='Three labs try to replicate it. None use the same flies.';}
  else {S.ending='MAJOR REVISION'; S.body='The dancing is undeniable. The interpretation is clinically unwell.';}
  log('Phenomenon catalog updated: '+S.phenomenon.name); S.phase='result'; render();
}
function result(){
  const impact=Math.round(S.ev*.25+S.weird*.25+S.cred*.25+S.hype*.25-S.susp*.35);
  setStage(`<div class="kicker">Submission result</div><div class="result-title">${S.ending}</div><p class="paper-title">${S.title}</p><div class="body"><p>${S.body}</p><div class="meters">${meterHtml()}</div><p><b>Impact Score: ${impact}</b></p><p class="hint">Catalog updated: ${S.phenomenon.name}</p></div>`);
  $('#choices').appendChild(btn('Run another experiment','Try another trait combination and chase a different ending.',reset,'choice primary'));
}
function drawChamber(){
  const cv=$('#chamber'), ctx=cv.getContext('2d'), w=cv.width, h=cv.height; anim+=0.025;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#02040a'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#25324a'; ctx.strokeRect(8,8,w-16,h-16);
  if(!S.phenomenon){ ctx.fillStyle='#d8e6ff'; ctx.font='20px system-ui'; ctx.fillText('No mutant line yet.',28,55); ctx.fillStyle='#9fb0c6'; ctx.font='16px system-ui'; ctx.fillText('Choose traits to discover what flies do.',28,82); return requestAnimationFrame(drawChamber); }
  const grad=ctx.createLinearGradient(w*.4,0,w*.6,h); grad.addColorStop(0,'rgba(70,150,255,.28)'); grad.addColorStop(1,'rgba(70,150,255,.02)'); ctx.fillStyle=grad; ctx.fillRect(w*.38,20,w*.24,h-40);
  for(let i=0;i<38;i++){ let a=anim*(S.phenomenon.name.includes('Dance')?3.0:1.7)+i*.57, r=55+(i%8)*13, x=Math.cos(a+i)*r+Math.sin(a*.37+i)*25, y=Math.sin(a*1.2+i)*r*.55+Math.cos(a*.21+i)*35; if(S.phenomenon.name.includes('Wall')){x=Math.sin(a+i)*w*.38;y=h*.31*Math.sign(Math.sin(a*.35+i));} if(S.phenomenon.name.includes('Spiral')){r=(i*8+(anim*80)%130);x=Math.cos(a)*r;y=Math.sin(a)*r*.55;} ctx.fillStyle=i%5?'#f1d35e':'#72bdff'; ctx.fillRect(w/2+x,h/2+y,7,7); }
  ctx.fillStyle='#d8e6ff'; ctx.font='15px system-ui'; ctx.fillText(S.phenomenon.name,18,h-26);
  requestAnimationFrame(drawChamber);
}
reset(); drawChamber();
