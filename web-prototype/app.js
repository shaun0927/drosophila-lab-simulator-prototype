const $ = s => document.querySelector(s);
const D = window.GAME_DATA;
let S, anim = 0;

function reset(){
  S = {phase:'mode', time:300, budget:100, ev:0, weird:0, cred:0, hype:0, susp:0,
       selected:[], phenomenon:null, title:'Untitled Figure', reviewer:'', ending:'', body:'', log:[]};
  log('PI: The paper can wait. First prove the vial history makes sense.');
  render();
}
function log(t){ S.log.push('• '+t); }
function add(o){ for(const k of ['ev','weird','cred','hype','susp']) S[k]=Math.max(0,Math.min(120,S[k]+(o[k]||0))); S.time+=o.time||0; S.budget+=o.budget||0; }
function statName(k){ return ({ev:'Evidence',weird:'Weird',cred:'Cred',hype:'Hype',susp:'Suspicion'})[k]||k; }
function renderStats(){
  $('#stats').innerHTML = `<div class="stat">Time ${S.time}s</div><div class="stat">Budget $${S.budget}</div><div></div>`+
    ['ev','weird','cred','hype','susp'].map(k=>`<div class="stat ${k==='susp'?'bad':'good'}">${statName(k)} ${S[k]}</div>`).join('');
}
function render(){ renderStats(); renderChrome(); $('#log').innerHTML=S.log.slice(-9).map(x=>`<div>${x}</div>`).join(''); ({mode,validation,capture,status:goalStatus,lived,lab,traits,discover,assay,figure,reviewer,final,result})[S.phase](); }
function renderChrome(){
  const procedure = S && S.lab && S.phase==='lab';
  const validationMode = S && S.phase==='validation';
  const captureMode = S && S.phase==='capture';
  const statusMode = S && S.phase==='status';
  const livedMode = S && S.phase==='lived';
  $('#side-title').textContent = livedMode ? 'Experience Packet' : statusMode ? 'Goal Status' : captureMode ? 'Capture Packet' : validationMode ? 'Validation Packet' : procedure ? 'Lab Record View' : 'Live Assay Chamber';
  $('#footer-question').textContent = livedMode ? 'Core question: which real lab memory should change the game?' : statusMode ? 'Core question: what evidence is still missing?' : captureMode ? 'Core question: what exact evidence can update the ledger?' : validationMode ? 'Core question: can a new player explain the failed record?' : procedure ? 'Core question: can the notebook defend the claim?' : 'Core question: make the phenomenon more believable, or more sensational?';
}
function btn(label, detail, fn, cls='choice'){ const b=document.createElement('button'); b.className=cls; b.innerHTML=`<h3>${label}</h3><p>${detail||''}</p>`; b.onclick=fn; return b; }
function setStage(html){ $('#stage').innerHTML=html; $('#choices').innerHTML=''; }
function choose(c, next){ add(c); if(c.log) log(c.log); if(c.title) S.title=c.title; if(S.time<=0||S.budget<=0) return submit(); if(next) S.phase=next; render(); }
function combo(tags){ return tags.every(t=>S.selectedTags.has(t)|| (t==='social'&&S.selectedTags.has('swarm'))); }
function resolve(){ S.selectedTags=new Set(S.selected.flatMap(t=>t.tags)); return D.phenomena.find(p=>combo(p.tags)) || D.fallback; }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function stockFor(vial){ return S.lab.stocks.find(s=>s.id===vial.stockId); }
function activeVials(){ return S.lab.vials.filter(v=>v.status==='active'); }
function vialAge(vial){ return S.lab.day - vial.setupDay; }
function notebook(action, detail, vialId=''){ S.lab.notebook.unshift({day:S.lab.day, action, detail, vialId}); log(`Day ${S.lab.day}: ${action} — ${detail}`); }
function createLabState(){
  const lab = clone(D.lab);
  lab.day = 0;
  lab.nextVial = 4;
  lab.nextCross = 1;
  lab.nextBatch = 1;
  lab.nextAssay = 1;
  lab.crossPlan = null;
  lab.crosses = [];
  lab.sortingSession = null;
  lab.batchRecords = [];
  lab.assayRecords = [];
  lab.figureReview = null;
  lab.notebook = [
    {day:0, action:'Lab opened', detail:'Starting stock rack loaded from R2 fixture.', vialId:''}
  ];
  applyVialConsequences(lab, false);
  return lab;
}
function applyVialConsequences(lab=S.lab, writeNotebook=true){
  lab.vials.forEach(v=>{
    if(v.status!=='active') return;
    const age = lab.day - v.setupDay;
    const stock = lab.stocks.find(s=>s.id===v.stockId);
    v.flags = [];
    if(v.labelCompleteness<100) v.flags.push('label incomplete');
    if(age>=18) v.flags.push('flip due');
    if(age>20) v.flags.push('overcrowding risk');
    if(age>24) v.flags.push('mixed-generation risk');
    if(v.food==='drying'||age>21) v.flags.push('food condition risk');
    if(v.contamination!=='clear') v.flags.push(v.contamination);
    v.lineageConfidence = Math.max(20, Math.min(100, v.labelCompleteness - Math.max(0, age-18)*5 - (v.flags.includes('mixed-generation risk')?15:0)));
    if(stock) stock.trust = Math.max(20, Math.min(100, stock.trust - (v.flags.includes('mixed-generation risk')?1:0)));
    if(writeNotebook && v.flags.includes('overcrowding risk') && !v.overdueLogged){
      v.overdueLogged = true;
      lab.notebook.unshift({day:lab.day, action:'Overdue consequence', detail:`${v.id} is old enough to threaten culture confidence.`, vialId:v.id});
    }
  });
}
function startLab(){ S.lab = createLabState(); S.phase='lab'; log('Procedure Lab started: stock rack, calendar, and notebook are now authoritative.'); render(); }
function advanceDay(){ S.lab.day += 1; activeVials().forEach(v=>v.adults += v.flags&&v.flags.includes('overcrowding risk') ? 2 : 1); applyVialConsequences(); notebook('Advance day', 'Vial ages, due events, and confidence warnings updated.'); render(); }
function labelVial(vialId){
  const v = S.lab.vials.find(x=>x.id===vialId);
  if(!v) return;
  const before = v.labelCompleteness;
  v.labelCompleteness = Math.min(100, v.labelCompleteness+25);
  applyVialConsequences();
  notebook('Label vial', `${v.id} label completeness ${before}% -> ${v.labelCompleteness}%.`, v.id);
  render();
}
function flipVial(vialId){
  const v = S.lab.vials.find(x=>x.id===vialId);
  if(!v||v.status!=='active') return;
  const stock = stockFor(v);
  const id = 'V-'+String(S.lab.nextVial++).padStart(3,'0');
  const newVial = {id, stockId:v.stockId, setupDay:S.lab.day, adults:Math.max(8, Math.round(v.adults*.55)), food:'fresh', labelCompleteness:v.labelCompleteness, contamination:'clear', status:'active'};
  v.status = 'archived';
  v.archivedDay = S.lab.day;
  S.lab.vials.push(newVial);
  if(stock&&stock.backupCount<1) stock.backupCount += 1;
  applyVialConsequences();
  notebook('Flip vial', `${v.id} -> ${id} for ${stock?stock.name:v.stockId}; label confidence carried forward.`, id);
  render();
}
function clearAdultsForVirginCollection(vialId){
  const v = S.lab.vials.find(x=>x.id===vialId&&x.status==='active');
  if(!v) return;
  const stock = stockFor(v);
  S.lab.crossPlan = {sourceVialId:v.id, femaleStockId:v.stockId, clearDay:S.lab.day, windowDay:S.lab.day+1, status:'cleared', virginCount:0, virginConfidence:0, maleStockId:null};
  notebook('Clear adults', `${v.id} cleared for virgin collection. Return on day ${S.lab.crossPlan.windowDay}.`, v.id);
  render();
}
function collectVirgins(){
  const p = S.lab.crossPlan;
  if(!p||p.status!=='cleared') return;
  const delta = S.lab.day - p.windowDay;
  if(delta<0){
    notebook('Virgin collection blocked', `Window opens on day ${p.windowDay}; collecting now would be premature.`, p.sourceVialId);
    return render();
  }
  p.status = 'virgins-collected';
  p.collectionDay = S.lab.day;
  p.late = delta>0;
  p.virginCount = Math.max(3, 10 - Math.max(0, delta*3));
  p.virginConfidence = p.late ? 48 : 92;
  notebook('Collect candidate virgins', `${p.virginCount} females collected with ${p.virginConfidence}% virgin confidence${p.late?' after a late window':''}.`, p.sourceVialId);
  render();
}
function selectCrossMales(stockId){
  const p = S.lab.crossPlan;
  if(!p) return;
  p.maleStockId = stockId;
  const stock = S.lab.stocks.find(s=>s.id===stockId);
  notebook('Select males', `${stock.name} selected as male parent stock.`, '');
  render();
}
function setCrossVial(){
  const p = S.lab.crossPlan;
  if(!p||p.status!=='virgins-collected'||!p.maleStockId) return;
  const female = S.lab.stocks.find(s=>s.id===p.femaleStockId);
  const male = S.lab.stocks.find(s=>s.id===p.maleStockId);
  const crossId = 'X-'+String(S.lab.nextCross++).padStart(2,'0');
  const vialId = 'V-'+String(S.lab.nextVial++).padStart(3,'0');
  const labelCompleteness = p.virginConfidence>=90 ? 90 : 65;
  const confidence = Math.max(20, Math.min(100, Math.round((p.virginConfidence + labelCompleteness + female.trust + male.trust)/4)));
  const cross = {id:crossId, vialId, femaleStockId:p.femaleStockId, maleStockId:p.maleStockId, setupDay:S.lab.day, scoringStart:S.lab.day+10, scoringEnd:S.lab.day+18, femaleCount:Math.min(8,p.virginCount), maleCount:4, labelCompleteness, confidence, expected:['female-parent marker class','male-parent marker class','ambiguous low-confidence class']};
  S.lab.crosses.push(cross);
  S.lab.vials.push({id:vialId, stockId:p.femaleStockId, crossId, setupDay:S.lab.day, adults:cross.femaleCount+cross.maleCount, food:'fresh', labelCompleteness, contamination:'clear', status:'active'});
  S.lab.crossPlan = null;
  applyVialConsequences();
  notebook('Set cross', `${crossId} ${female.name} females x ${male.name} males in ${vialId}; confidence ${confidence}%.`, vialId);
  render();
}
function specimenSet(sourceId){
  const types = [
    ['female','target','red eyes, rounded abdomen'],
    ['female','target','red eyes, rounded abdomen'],
    ['female','target','red eyes, rounded abdomen'],
    ['female','target','red eyes, rounded abdomen'],
    ['female','target','red eyes, rounded abdomen'],
    ['female','target','red eyes, rounded abdomen'],
    ['female','target','red eyes, rounded abdomen'],
    ['female','target','red eyes, rounded abdomen'],
    ['female','ambiguous','faint marker, borderline abdomen'],
    ['male','wild','white eyes, slimmer abdomen'],
    ['female','target','red eyes, rounded abdomen'],
    ['female','target','red eyes, rounded abdomen']
  ];
  return types.map((t,i)=>({id:`${sourceId}-F${i+1}`, sex:t[0], marker:t[1], tell:t[2], zone:'unsorted', exposureSeconds:0, stress:false}));
}
function startSorting(sourceId=''){
  const source = sourceId || (S.lab.crosses[0]&&S.lab.crosses[0].vialId) || activeVials()[0].id;
  S.lab.sortingSession = {sourceId:source, exposureSeconds:0, co2On:false, specimens:specimenSet(source), inspected:null};
  notebook('Start CO2 bench', `${source} loaded onto sorting pad.`, source);
  render();
}
function applyCO2(seconds=20){
  const session = S.lab.sortingSession;
  if(!session) return;
  session.co2On = true;
  session.exposureSeconds += seconds;
  session.specimens.filter(f=>f.zone==='unsorted').forEach(f=>{
    f.exposureSeconds += seconds;
    if(f.exposureSeconds>=80) f.stress = true;
  });
  notebook('Apply CO2', `Exposure increased to ${session.exposureSeconds}s; sorting gets easier, assay caveat risk rises.`, session.sourceId);
  render();
}
function stopCO2(){
  if(!S.lab.sortingSession) return;
  S.lab.sortingSession.co2On = false;
  notebook('Stop CO2', `Exposure stopped at ${S.lab.sortingSession.exposureSeconds}s.`, S.lab.sortingSession.sourceId);
  render();
}
function inspectSpecimen(id){
  const session = S.lab.sortingSession;
  if(!session) return;
  session.inspected = session.specimens.find(f=>f.id===id) || null;
  render();
}
function sortSpecimen(id, zone){
  const session = S.lab.sortingSession;
  if(!session) return;
  const fly = session.specimens.find(f=>f.id===id);
  if(!fly) return;
  fly.zone = zone;
  render();
}
function finishBatch(){
  const session = S.lab.sortingSession;
  if(!session) return;
  const selected = session.specimens.filter(f=>f.zone==='target');
  const targetCorrect = selected.filter(f=>f.sex==='female'&&f.marker==='target').length;
  const ambiguous = selected.filter(f=>f.marker==='ambiguous'||f.sex==='unknown').length;
  const wrong = selected.length - targetCorrect - ambiguous;
  const purity = selected.length ? Math.max(0, Math.round((targetCorrect / selected.length) * 100 - ambiguous*5 - wrong*12)) : 0;
  const exposureRisk = session.exposureSeconds>=80 ? 'high_co2_exposure' : session.exposureSeconds>=40 ? 'moderate_co2_exposure' : '';
  const caveats = [];
  if(selected.length<8) caveats.push('low_batch_n');
  if(ambiguous>0) caveats.push('ambiguous_batch');
  if(wrong>0) caveats.push('mis_sorted_specimens');
  if(exposureRisk) caveats.push(exposureRisk);
  const record = {
    id:'B-'+String(S.lab.nextBatch++).padStart(2,'0'),
    sourceId:session.sourceId,
    day:S.lab.day,
    count:selected.length,
    purity,
    ambiguity:ambiguous,
    co2ExposureSeconds:session.exposureSeconds,
    sortingConfidence:Math.max(20, Math.min(100, purity - caveats.length*6)),
    caveats
  };
  S.lab.batchRecords.unshift(record);
  S.lab.sortingSession = null;
  notebook('Batch record', `${record.id} from ${record.sourceId}: n=${record.count}, purity ${record.purity}%, CO2 ${record.co2ExposureSeconds}s, caveats ${record.caveats.join(', ')||'none'}.`, record.sourceId);
  render();
}
function runNegativeGeotaxis(batchId, controlPresent=false, nTarget=8){
  const batch = S.lab.batchRecords.find(b=>b.id===batchId);
  if(!batch) return;
  const n = Math.min(nTarget, batch.count);
  const caveats = [...batch.caveats];
  if(!controlPresent) caveats.push('missing_control');
  if(n<10) caveats.push('low_n');
  if(batch.co2ExposureSeconds>=80) caveats.push('co2_exposure');
  if(batch.ambiguity>0) caveats.push('ambiguous_batch');
  const penalty = caveats.length*5 + Math.max(0, 90-batch.purity)*.25 + Math.max(0, 80-batch.sortingConfidence)*.2;
  const meanScore = Math.max(5, Math.round(72 - penalty + (controlPresent?4:-3)));
  const variance = Math.round(8 + caveats.length*4 + Math.max(0, 90-batch.purity)*.15);
  const confidence = Math.max(10, Math.min(100, Math.round(batch.sortingConfidence + (controlPresent?12:-12) + n*1.5 - caveats.length*7)));
  const record = {id:'A-'+String(S.lab.nextAssay++).padStart(2,'0'), batchId, day:S.lab.day, n, controlPresent, meanScore, variance, confidence, caveats:[...new Set(caveats)]};
  S.lab.assayRecords.unshift(record);
  notebook('Negative geotaxis assay', `${record.id} from ${batchId}: n=${n}, control ${controlPresent?'present':'missing'}, climb ${meanScore}, confidence ${confidence}%.`, batch.sourceId);
  render();
}
function buildExperimentRecord(assayId, claimStrength='conservative'){
  const assay = S.lab.assayRecords.find(a=>a.id===assayId);
  if(!assay) return null;
  const batch = S.lab.batchRecords.find(b=>b.id===assay.batchId);
  const cross = batch ? S.lab.crosses.find(x=>x.vialId===batch.sourceId) : null;
  const sourceVial = batch ? S.lab.vials.find(v=>v.id===batch.sourceId) : null;
  const labelCompleteness = sourceVial ? sourceVial.labelCompleteness : 100;
  const crossConfidence = cross ? cross.confidence : (sourceVial ? sourceVial.lineageConfidence : 70);
  const caveats = [...new Set([...(assay.caveats||[]), ...(batch?batch.caveats:[])])];
  return {assay, batch, cross, sourceVial, labelCompleteness, crossConfidence, claimStrength, caveats};
}
function reviewerFinding(record){
  if(!record) return null;
  const strengthLabel = {conservative:'conservative climbing phenotype', mechanistic:'mechanistic neural interpretation', sensational:'broad behavioral discovery'}[record.claimStrength];
  if(record.crossConfidence<60||record.labelCompleteness<70) return {id:'weak_lineage', severity:'major', evidenceRef:record.cross?record.cross.id:(record.sourceVial&&record.sourceVial.id)||'source vial', quote:'I cannot tell whether the assayed flies are the flies your title claims they are.', why:'Lineage confidence or label completeness is too low for a strong claim.'};
  if(record.caveats.includes('missing_control')) return {id:'missing_control', severity:'major', evidenceRef:record.assay.id, quote:'Without the control group, this climbing difference could be handling, genotype, or wishful thinking.', why:'The assay record has no control, so the result cannot separate treatment from procedure.'};
  if(record.caveats.includes('low_n')) return {id:'low_n', severity:'major', evidenceRef:record.assay.id, quote:'Your n is still a lab anecdote wearing a figure legend.', why:'The assay used too few scored flies for the chosen claim.'};
  if(record.caveats.includes('co2_exposure')||record.caveats.includes('high_co2_exposure')) return {id:'co2_exposure', severity:'major', evidenceRef:record.batch.id, quote:'The CO2 exposure is a behavioral confound, not a methods detail you can bury.', why:'The sorted batch carried a high CO2 caveat into the behavior assay.'};
  if(record.caveats.includes('ambiguous_batch')||record.caveats.includes('mis_sorted_specimens')) return {id:'ambiguous_batch', severity:'major', evidenceRef:record.batch.id, quote:'Your batch purity makes the genotype label aspirational.', why:'Sorting ambiguity or mis-sorted specimens lowered batch confidence.'};
  if(record.claimStrength==='sensational') return {id:'overclaim_sensational', severity:'major', evidenceRef:record.assay.id, quote:'A climbing assay does not establish a grand theory of behavioral control.', why:'The claim strength exceeds what a negative geotaxis record can support.'};
  if(record.claimStrength==='mechanistic') return {id:'overclaim_mechanism', severity:'minor', evidenceRef:record.assay.id, quote:'The phenotype is plausible, but the mechanism is still mostly a drawing.', why:'The record supports a behavior difference better than a mechanism.'};
  return {id:'clean_record', severity:'minor', evidenceRef:record.assay.id, quote:'This is annoyingly defensible. I still want one independent repeat.', why:'The record has control, usable n, and no dominant procedural caveat.'};
}
function repairPlanForFinding(id){
  const plans = {
    weak_lineage:['Relabel or flip the source vial before using it again.','Use a source with stronger lineage confidence for the next batch.','Keep the claim conservative until the cross history is traceable.'],
    missing_control:['Rerun the assay with a matched control group.','Keep n at 10 or higher so the control actually helps.','Do not choose a mechanistic or sensational claim from a no-control assay.'],
    low_n:['Sort enough target flies before starting the assay.','Rerun negative geotaxis with n=12 when the batch supports it.','Treat small-n results as notebook warnings, not figure claims.'],
    co2_exposure:['Stop CO2 earlier and accept more difficult sorting.','Let the batch recover before behavior scoring in a later slice.','Use a clean batch if the next claim depends on locomotion.'],
    ambiguous_batch:['Inspect ambiguous specimens instead of target-sorting them by default.','Finish a smaller but cleaner batch if visual tells are uncertain.','Expect genotype and sex ambiguity to weaken every later assay.'],
    overclaim_sensational:['Keep the claim to a climbing phenotype.','Add a second assay before using broad behavior language.','Let the record decide the title, not the most exciting interpretation.'],
    overclaim_mechanism:['Use behavior wording unless a mechanism assay exists.','Add a follow-up mechanism-specific experiment before invoking circuitry.','Keep Reviewer #2 focused on evidence refs rather than title ambition.'],
    clean_record:['Repeat independently before raising claim strength.','Preserve this record as the comparison target for dirty runs.','Look for the next weakest link instead of adding spectacle.']
  };
  return plans[id] || ['Repeat the run and remove the strongest record caveat first.'];
}
function chooseClaim(assayId, claimStrength){
  const record = buildExperimentRecord(assayId, claimStrength);
  const finding = reviewerFinding(record);
  S.lab.figureReview = {record, finding};
  notebook('Figure summary reviewed', `${assayId} as ${claimStrength}: Reviewer finding ${finding.id} from ${finding.evidenceRef}.`, finding.evidenceRef);
  render();
}
function dueEvents(){
  const events = [];
  activeVials().forEach(v=>{
    const stock = stockFor(v), age = vialAge(v);
    if(v.labelCompleteness<100) events.push({kind:'Label', text:`${v.id} ${stock.name}: label incomplete (${v.labelCompleteness}%).`});
    if(age>=18&&age<=20) events.push({kind:'Due', text:`${v.id} ${stock.name}: flip due now, age ${age} days.`});
    if(age>20) events.push({kind:'Overdue', text:`${v.id} ${stock.name}: overdue, confidence falling.`});
  });
  if(S.lab.crossPlan){
    const p = S.lab.crossPlan, stock = S.lab.stocks.find(s=>s.id===p.femaleStockId);
    if(p.status==='cleared'&&S.lab.day<p.windowDay) events.push({kind:'Virgin', text:`${p.sourceVialId} ${stock.name}: virgin window opens day ${p.windowDay}.`});
    if(p.status==='cleared'&&S.lab.day===p.windowDay) events.push({kind:'Virgin', text:`${p.sourceVialId} ${stock.name}: collect candidate virgins today.`});
    if(p.status==='cleared'&&S.lab.day>p.windowDay) events.push({kind:'Late', text:`${p.sourceVialId} ${stock.name}: virgin window is late; confidence will drop.`});
  }
  S.lab.crosses.forEach(x=>{
    if(S.lab.day>=x.scoringStart&&S.lab.day<=x.scoringEnd) events.push({kind:'Score', text:`${x.id} ${x.vialId}: progeny scoring window is open.`});
    if(S.lab.day<x.scoringStart) events.push({kind:'Cross', text:`${x.id} ${x.vialId}: scoring opens day ${x.scoringStart}.`});
  });
  return events.length ? events : [{kind:'Clear', text:'No urgent rack events. Advance only if the notebook can defend it.'}];
}
function quickStart(){ S.selected=[D.traits[0],D.traits[3],D.traits[8]]; createLine(); }
function createLine(){ S.selected.forEach(add); S.time-=35; S.budget-=15; S.phenomenon=resolve(); add(S.phenomenon); log('Mutant line created: '+S.selected.map(t=>t.name).join(' + ')); log('NEW PHENOMENON: '+S.phenomenon.name); S.phase='discover'; render(); }

function mode(){
  setStage(`<div class="kicker">R-series prototype direction</div><h2>Choose the lab loop to test</h2><div class="body"><p>The production target is now a fly-lab procedure simulator with a publication wrapper. The old phenomenon-first loop remains available as a historical prototype.</p><div class="objective">Current goal: make labels, vial age, calendar pressure, and notebook traceability matter before any paper claim exists.</div></div>`);
  const c=$('#choices');
  c.appendChild(btn('Start Procedure Lab','Stock rack, vial age, labels, calendar events, and notebook consequences.',startLab,'choice primary'));
  c.appendChild(btn('Open goal status','See why the current objective is not complete yet.',startStatus,'choice'));
  c.appendChild(btn('Open validation packet','Run #33 player/SME sessions without leaving the prototype.',startValidation,'choice'));
  c.appendChild(btn('Open capture packet','Record exact #27/#33 evidence before updating the ledger.',startCapture,'choice'));
  c.appendChild(btn('Open lived-experience packet','Collect #27 firsthand/observed lab incidents without adding arbitrary spectacle.',startLived,'choice'));
  c.appendChild(btn('Open old publication-satire prototype','Trait cards, absurd phenomena, figure framing, and Reviewer #2.',()=>{S.phase='traits'; log('Historical prototype route opened.'); render();},'choice ghost'));
}
function startValidation(){ S.phase='validation'; log('Validation packet opened: player session, SME fixtures, and closure gate are visible.'); render(); }
function validation(){
  setStage(`<div class="kicker">R7 validation packet</div><h2>First-run and SME validation</h2><div class="body"><p>This packet keeps validation focused on the R-series question: can the player connect lab records to Reviewer #2, and can a biology-aware reviewer accept the simplifications?</p></div><div class="validation-grid"><section class="planner"><h3>Player session</h3><ol><li>Open the default Procedure Lab route.</li><li>Let a fresh player reach one Reviewer #2 finding without coaching the first 30 seconds.</li><li>Ask what caused the attack and what they would change next run.</li></ol><p><b>Pass:</b> names one real cause and one plausible second-run repair.</p></section><section class="planner"><h3>SME fixture checks</h3><ul class="calendar"><li><a href="?fixture=clean">Clean overclaim fixture</a></li><li><a href="?fixture=dirty">Dirty CO2 fixture</a></li><li><a href="?fixture=missing-control">Missing-control fixture</a></li><li><a href="?validation=status">Current goal status</a></li><li><a href="?validation=capture">Session capture packet</a></li><li><a href="?validation=lived">#27 lived-experience packet</a></li></ul><p>Rate each core mechanic as accurate enough, acceptable simplification, misleading, or unsafe.</p></section><section class="planner"><h3>Record exact evidence</h3><p>Capture exact player phrases, the reviewer finding id, second-run repair, and any misleading SME mark. Open a follow-up issue for every misleading or unsafe core mechanic.</p></section><section class="planner"><h3>Closure gate</h3><ul class="calendar"><li>3 player sessions recorded.</li><li>1 SME review recorded.</li><li>Fixture differences understood or follow-up issues opened.</li><li>#27 lived-experience gap stays separate.</li></ul></section></div>`);
  const c=$('#choices');
  c.appendChild(btn('Start first-run route','Open the Procedure Lab without fixture setup.',startLab,'choice primary'));
  c.appendChild(btn('Open capture packet','Record raw session evidence before summarizing.',startCapture,'choice'));
  c.appendChild(btn('Open goal status','Check the remaining closure gaps.',startStatus,'choice'));
  c.appendChild(btn('Return to route selection','Back to normal prototype entry.',reset,'choice ghost'));
}
function startStatus(){ S.phase='status'; log('Goal status opened: #27 and #33 still need external evidence.'); render(); }
function goalStatus(){
  setStage(`<div class="kicker">Thread goal status</div><h2>Not complete: external evidence missing</h2><div class="body"><p>The implementation, proxy QA, ledger, capture packet, and decision tree are in place. The current objective still cannot close because the remaining proof must come from real lived-experience input and real player/SME sessions.</p></div><div class="validation-grid"><section class="planner"><h3>#27 lived experience</h3><ul class="calendar"><li>Accepted lived-experience rows: <b>0 / 5</b>.</li><li>Design-changing lived answer: <b>0 / 1</b>.</li><li>Needed: user or observed-lab provenance, then experience-map update.</li></ul></section><section class="planner"><h3>#33 validation</h3><ul class="calendar"><li>Fresh-player sessions: <b>0 / 3</b>.</li><li>SME or biology-aware review: <b>0 / 1</b>.</li><li>Needed: raw phrases, rubric ratings, and fix/cut issues for failures.</li></ul></section><section class="planner"><h3>What is already ready</h3><ul class="calendar"><li>Procedure Lab route and URL fixtures.</li><li>Validation, capture, and lived-experience packets.</li><li>External evidence ledger and validator.</li><li>Finding decision tree and issue templates.</li></ul></section><section class="planner"><h3>Do not close from</h3><ul class="calendar"><li>Screenshots or smoke tests.</li><li>Implementer walkthroughs.</li><li>Prompt surfaces without real answers.</li><li>Parked Unity or old-loop backlog.</li></ul></section></div>`);
  const c=$('#choices');
  c.appendChild(btn('Open validation packet','Run #33 player/SME protocol.',startValidation,'choice'));
  c.appendChild(btn('Open capture packet','Record raw evidence fields.',startCapture,'choice primary'));
  c.appendChild(btn('Open lived-experience packet','Collect #27 provenance.',startLived,'choice'));
}
function startCapture(){ S.phase='capture'; log('Capture packet opened: record exact evidence before updating ledger counts.'); render(); }
function capture(){
  setStage(`<div class="kicker">External evidence capture</div><h2>Record before interpreting</h2><div class="body"><p>This packet is a session-side checklist for #27 and #33. It does not close either issue; it prevents raw evidence from becoming vague summaries.</p></div><div class="validation-grid"><section class="planner"><h3>#33 player row</h3><ul class="calendar"><li>Session id, date, route or fixture.</li><li>Completed one run within 5 minutes?</li><li>Exact goal phrase in the first 30 seconds.</li><li>Exact reviewer-cause phrase.</li><li>Exact second-run repair phrase.</li><li>Decision: Pass, Fix, or Cut.</li></ul></section><section class="planner"><h3>#33 SME row</h3><ul class="calendar"><li>Reviewer role or biology experience level.</li><li>Rate stock/vial, virgin/cross, CO2/sorting, assay, and record-reviewer logic.</li><li>Every misleading or unsafe mark needs a fix/cut issue.</li></ul></section><section class="planner"><h3>#27 lived row</h3><ul class="calendar"><li>Provenance: firsthand, observed, or explicit no relevant experience.</li><li>Procedure event, game verb, player skill.</li><li>Failure mode and delayed consequence.</li><li>Design effect: mechanic, guardrail, SME risk, or exclusion.</li></ul></section><section class="planner"><h3>After session</h3><ol><li>Append raw notes to validation results.</li><li>Update external evidence ledger counts.</li><li>Apply the decision tree before implementation.</li><li>Run smoke, status, and external evidence checks.</li></ol><p><b>Do not count screenshots, smoke tests, or implementer walkthroughs as external evidence.</b></p></section></div>`);
  const c=$('#choices');
  c.appendChild(btn('Open goal status','Check the remaining closure gaps.',startStatus,'choice'));
  c.appendChild(btn('Open validation packet','Return to #33 protocol and fixtures.',startValidation,'choice'));
  c.appendChild(btn('Open lived-experience packet','Collect #27 source answers.',startLived,'choice'));
  c.appendChild(btn('Start Procedure Lab','Run the normal player route.',startLab,'choice primary'));
}
function startLived(){ S.phase='lived'; log('Lived-experience packet opened: collect real incidents before expanding content.'); render(); }
function lived(){
  setStage(`<div class="kicker">R1 lived-experience packet</div><h2>Real lab incidents to mine</h2><div class="body"><p>Use this packet to capture firsthand or observed fly-lab memories that can change mechanics, guardrails, or SME risk. Do not use it to invent new spectacle.</p></div><div class="validation-grid"><section class="planner"><h3>Ask for incidents</h3><ol><li>Repeated hands-on work that became muscle memory.</li><li>Costliest mistake in time, confidence, or trust.</li><li>Hardest visual tell when learning.</li><li>Real criticism from PI, senior lab member, collaborator, or reviewer.</li></ol></section><section class="planner"><h3>Translate each answer</h3><ul class="calendar"><li>Procedure event.</li><li>Game verb.</li><li>Player skill.</li><li>Failure mode.</li><li>Delayed consequence.</li><li>Comedy boundary and SME risk.</li></ul></section><section class="planner"><h3>Acceptance gate</h3><ul class="calendar"><li>At least 5 event-map rows have user/lived-experience provenance.</li><li>At least one answer changes design, guardrails, or SME risk.</li><li>Unsupported arbitrary phenomena stay excluded from the first slice.</li></ul></section><section class="planner"><h3>Record location</h3><p>Copy accepted rows into <b>docs/fly-lab-experience-map.md</b>. If an answer needs implementation, open a lived-experience issue instead of editing gameplay directly.</p></section></div>`);
  const c=$('#choices');
  c.appendChild(btn('Open Procedure Lab context','Review the current stock, sorting, assay, and reviewer loop before answering.',startLab,'choice primary'));
  c.appendChild(btn('Open goal status','Check the remaining closure gaps.',startStatus,'choice'));
  c.appendChild(btn('Open capture packet','Record #27 answers before updating the ledger.',startCapture,'choice'));
  c.appendChild(btn('Open #33 validation packet','Keep lived experience separate from player/SME validation.',startValidation,'choice'));
  c.appendChild(btn('Return to route selection','Back to normal prototype entry.',reset,'choice ghost'));
}
function latestLabRecord(){
  if(S.lab.figureReview) return {stage:'review', record:S.lab.figureReview};
  if(S.lab.assayRecords.length) return {stage:'assay', record:S.lab.assayRecords[S.lab.assayRecords.length-1]};
  if(S.lab.batchRecords.length) return {stage:'batch', record:S.lab.batchRecords[S.lab.batchRecords.length-1]};
  const risky = activeVials().slice().sort((a,b)=>(a.lineageConfidence+a.labelCompleteness)-(b.lineageConfidence+b.labelCompleteness))[0];
  return {stage:'rack', record:risky};
}
function labNextAction(){
  if(!S.lab.batchRecords.length) return 'Sort a traceable batch from V-001 before testing any claim.';
  if(!S.lab.assayRecords.length) return 'Run negative geotaxis with a control and enough flies.';
  if(!S.lab.figureReview) return 'Pick a claim strength and see which record weakness Reviewer #2 attacks.';
  return 'Repeat the loop with a cleaner record or compare the dirty fixtures.';
}
function labRecordRisk(){
  const latest = latestLabRecord();
  if(latest.stage==='review') return `${latest.record.finding.id}: ${latest.record.finding.evidenceRef}`;
  if(latest.stage==='assay') return latest.record.caveats.length ? latest.record.caveats.join(', ') : 'A clean assay can still be overclaimed at figure strength.';
  if(latest.stage==='batch') return latest.record.caveats.length ? latest.record.caveats.join(', ') : `Batch ${latest.record.id} is defensible enough for a controlled assay.`;
  const v = latest.record;
  return `${v.id}: label ${v.labelCompleteness}%, lineage ${v.lineageConfidence}%, age ${vialAge(v)} days.`;
}
function labReviewerVulnerability(){
  const latest = latestLabRecord();
  if(latest.stage==='review') return latest.record.finding.why;
  if(latest.stage==='assay'){
    if(!latest.record.controlPresent) return 'Missing control will dominate the review.';
    if(latest.record.n<10) return 'Low n makes the assay fragile.';
    if(latest.record.caveats.some(c=>c.includes('CO2'))) return 'CO2 exposure can become a behavioral confound.';
    return 'The record is strong; overclaiming is now the main risk.';
  }
  if(latest.stage==='batch') return latest.record.caveats.length ? 'Batch caveats will follow every later assay.' : 'Next risk comes from assay design, not sorting.';
  return 'Weak labels or lineage confidence can invalidate later crosses.';
}
function labObjectiveHtml(){
  return `<div class="objective-strip"><div><span>Current goal</span><b>Build a defensible experiment record</b></div><div><span>Next action</span><b>${labNextAction()}</b></div><div><span>Record risk</span><b>${labRecordRisk()}</b></div><div><span>Reviewer vulnerability</span><b>${labReviewerVulnerability()}</b></div></div>`;
}
function lab(){
  const rack = activeVials().map(v=>{
    const stock = stockFor(v), age = vialAge(v), flags = (v.flags||[]).map(f=>`<span class="pill ${f.includes('risk')||f.includes('incomplete')?'warn':''}">${f}</span>`).join('') || '<span class="pill">clean</span>';
    return `<article class="vial-card"><div class="vial-head"><b>${v.id}</b><span>Day ${S.lab.day}, age ${age}</span></div><h3>${stock.name}</h3><p>${stock.genotype}<br>Marker: ${stock.marker}</p><div class="lab-metrics"><span>Adults ${v.adults}</span><span>Food ${v.food}</span><span>Label ${v.labelCompleteness}%</span><span>Lineage ${v.lineageConfidence}%</span></div><div>${flags}</div><div class="mini-actions"><button onclick="labelVial('${v.id}')">Label</button><button onclick="flipVial('${v.id}')">Flip</button></div></article>`;
  }).join('');
  const calendar = dueEvents().map(e=>`<li><b>${e.kind}</b> ${e.text}</li>`).join('');
  const notes = S.lab.notebook.slice(0,8).map(n=>`<div><b>D${n.day} ${n.action}</b>${n.vialId?` <span>${n.vialId}</span>`:''}<br>${n.detail}</div>`).join('');
  const planner = crossPlannerHtml();
  setStage(`<div class="kicker">Procedure Lab</div><h2>Stock rack and calendar</h2><div class="body"><p>Small record choices now become future confidence. Bad labels, overdue vials, late virgin collection, CO2 exposure, sorting ambiguity, and missing controls all become record caveats.</p></div>${labObjectiveHtml()}<div class="lab-grid"><section><h3>Vial rack</h3><div class="vial-rack">${rack}</div>${planner}${benchHtml()}${assayHtml()}${figureReviewHtml()}</section><section><h3>Calendar checklist</h3><ul class="calendar">${calendar}</ul><h3>Notebook</h3><div class="notebook">${notes}</div></section></div>`);
  const c=$('#choices');
  c.appendChild(btn('Advance one day','Ages active vials and applies overdue consequences.',advanceDay,'choice primary'));
  c.appendChild(btn('Return to route selection','Keeps the old prototype accessible without mixing state.',reset,'choice ghost'));
}
function crossPlannerHtml(){
  const p = S.lab.crossPlan;
  if(!p){
    const options = activeVials().slice(0,3).map(v=>{
      const stock = stockFor(v);
      return `<button onclick="clearAdultsForVirginCollection('${v.id}')">Clear ${v.id} for ${stock.name} virgins</button>`;
    }).join('');
    return `<section class="planner"><h3>Cross planner</h3><p>Start one cross by clearing adults, waiting for the virgin window, collecting females, selecting males, and setting a labeled cross vial.</p><div class="mini-actions stacked">${options}</div></section>`;
  }
  const female = S.lab.stocks.find(s=>s.id===p.femaleStockId);
  const maleButtons = S.lab.stocks.filter(s=>s.id!==p.femaleStockId).map(s=>`<button onclick="selectCrossMales('${s.id}')">${p.maleStockId===s.id?'Selected: ':''}${s.name} males</button>`).join('');
  const collectButton = p.status==='cleared' ? `<button onclick="collectVirgins()">Collect candidate virgins</button>` : '';
  const setButton = p.status==='virgins-collected'&&p.maleStockId ? `<button onclick="setCrossVial()">Set cross vial</button>` : '';
  return `<section class="planner"><h3>Cross planner</h3><p><b>Female source:</b> ${female.name} from ${p.sourceVialId}<br><b>Window:</b> day ${p.windowDay}<br><b>Status:</b> ${p.status}${p.virginCount?`<br><b>Candidate virgins:</b> ${p.virginCount}, confidence ${p.virginConfidence}%`:''}</p><div class="mini-actions stacked">${collectButton}${maleButtons}${setButton}</div></section>`;
}
function benchHtml(){
  const session = S.lab.sortingSession;
  const records = S.lab.batchRecords.map(b=>`<li><b>${b.id}</b> ${b.sourceId}: n=${b.count}, purity ${b.purity}%, CO2 ${b.co2ExposureSeconds}s, confidence ${b.sortingConfidence}%, caveats ${b.caveats.join(', ')||'none'}</li>`).join('') || '<li>No batch record yet.</li>';
  if(!session){
    const sourceButtons = [...S.lab.crosses.map(x=>x.vialId), ...activeVials().slice(0,2).map(v=>v.id)].slice(0,4).map(id=>`<button onclick="startSorting('${id}')">Sort from ${id}</button>`).join('');
    return `<section class="planner"><h3>CO2 bench sorting</h3><p>Use CO2 to slow flies, then sort target females. More exposure makes sorting calmer but adds assay caveats.</p><div class="mini-actions stacked">${sourceButtons||'<button onclick="startSorting()">Start from rack vial</button>'}</div><ul class="calendar">${records}</ul></section>`;
  }
  const rows = session.specimens.map(f=>{
    const stress = f.stress ? ' stress' : '';
    const zone = f.zone==='target' ? 'targeted' : f.zone==='reject' ? 'rejected' : f.zone==='ambiguous' ? 'uncertain' : 'unsorted';
    return `<article class="specimen ${zone}${stress}"><button class="specimen-id" onclick="inspectSpecimen('${f.id}')">${f.id}</button><div class="fly-chip"><span></span><span></span><span></span></div><p>${f.tell}</p><div class="zone-label">${f.zone}</div><div class="specimen-actions"><button onclick="sortSpecimen('${f.id}','target')">Target</button><button onclick="sortSpecimen('${f.id}','reject')">Reject</button><button onclick="sortSpecimen('${f.id}','ambiguous')">Ambiguous</button></div></article>`;
  }).join('');
  const selected = session.specimens.filter(f=>f.zone==='target').length;
  const inspected = session.inspected ? `<p><b>Inspecting ${session.inspected.id}</b><br>Tell: ${session.inspected.tell}<br>True state for prototype QA: ${session.inspected.sex}, ${session.inspected.marker}</p>` : '<p>Select a specimen to inspect its tell.</p>';
  return `<section class="planner"><h3>CO2 bench sorting</h3><p><b>Source:</b> ${session.sourceId}<br><b>CO2 exposure:</b> ${session.exposureSeconds}s ${session.exposureSeconds>=80?'<span class="warning">high assay caveat risk</span>':session.exposureSeconds>=40?'<span class="hint">moderate caveat risk</span>':'low caveat risk'}<br><b>Selected target count:</b> ${selected}</p><div class="co2-meter"><span style="width:${Math.min(100,session.exposureSeconds)}%"></span></div><div class="mini-actions"><button onclick="applyCO2(20)">Apply CO2 +20s</button><button onclick="stopCO2()">Stop CO2</button><button onclick="finishBatch()">Finish batch</button></div>${inspected}<div class="specimen-pad">${rows}</div></section>`;
}
function assayHtml(){
  const batchOptions = S.lab.batchRecords.map(b=>`<div class="record-card"><b>${b.id}</b> from ${b.sourceId}<br>n=${b.count}, purity ${b.purity}%, confidence ${b.sortingConfidence}%<div class="mini-actions"><button onclick="runNegativeGeotaxis('${b.id}',false,8)">Run no-control n=8</button><button onclick="runNegativeGeotaxis('${b.id}',true,12)">Run controlled n=12</button></div></div>`).join('') || '<p>No sorted batch available. Finish CO2 sorting first.</p>';
  const plots = S.lab.assayRecords.map(assayPlot).join('');
  const records = S.lab.assayRecords.map(a=>`<tr><td>${a.id}</td><td>${a.batchId}</td><td>${a.n}</td><td>${a.controlPresent?'yes':'no'}</td><td>${a.meanScore}</td><td>${a.variance}</td><td>${a.confidence}%</td><td>${a.caveats.join(', ')||'none'}</td></tr>`).join('');
  const table = records ? `<table class="record-table"><thead><tr><th>ID</th><th>Batch</th><th>n</th><th>Control</th><th>Mean climb</th><th>Variance</th><th>Confidence</th><th>Caveats</th></tr></thead><tbody>${records}</tbody></table>` : '<p>No assay record yet.</p>';
  return `<section class="planner"><h3>Negative geotaxis assay</h3><p>Run a simplified climbing assay from a sorted batch. Control, n, CO2, and ambiguity change confidence and reviewer vulnerabilities.</p>${batchOptions}<div class="assay-plots">${plots}</div>${table}</section>`;
}
function assayPlot(a){
  const noise = Math.min(100, a.variance*4);
  return `<article class="assay-plot"><div><b>${a.id}</b> ${a.controlPresent?'controlled':'no control'} n=${a.n}</div><div class="bar-row"><span>climb</span><div><i style="width:${a.meanScore}%"></i></div><b>${a.meanScore}</b></div><div class="bar-row"><span>confidence</span><div><i style="width:${a.confidence}%"></i></div><b>${a.confidence}%</b></div><div class="bar-row bad-bar"><span>noise</span><div><i style="width:${noise}%"></i></div><b>${a.variance}</b></div><p>${a.caveats.join(', ')||'clean record'}</p></article>`;
}
function figureReviewHtml(){
  const assayButtons = S.lab.assayRecords.map(a=>`<div class="record-card"><b>${a.id}</b> confidence ${a.confidence}%, caveats ${a.caveats.join(', ')||'none'}<div class="mini-actions"><button onclick="chooseClaim('${a.id}','conservative')">Conservative claim</button><button onclick="chooseClaim('${a.id}','mechanistic')">Mechanistic claim</button><button onclick="chooseClaim('${a.id}','sensational')">Sensational claim</button></div></div>`).join('') || '<p>No assay record available for review.</p>';
  const review = S.lab.figureReview;
  const repair = review ? repairPlanForFinding(review.finding.id).map(step=>`<li>${step}</li>`).join('') : '';
  const result = review ? `<div class="record-card"><h3>Reviewer #2 finding</h3><p><b>${review.finding.severity.toUpperCase()}:</b> ${review.finding.quote}</p><p><b>Evidence ref:</b> ${review.finding.evidenceRef}<br><b>Why this happened:</b> ${review.finding.why}</p><p><b>Claim:</b> ${review.record.claimStrength}<br><b>Assay:</b> ${review.record.assay.id}, n=${review.record.assay.n}, control=${review.record.assay.controlPresent?'yes':'no'}, confidence=${review.record.assay.confidence}%</p><div class="repair-plan"><b>Next-run repair plan</b><ol>${repair}</ol></div></div>` : '';
  return `<section class="planner"><h3>Figure summary and reviewer</h3><p>Choose claim strength from an assay record. Reviewer #2 reads lineage, batch, control, n, CO2, and ambiguity before attacking one primary weakness.</p>${assayButtons}${result}</section>`;
}
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
function sortFixtureTargets(sourceId, ids, co2Pulses=0){
  startSorting(sourceId);
  for(let i=0;i<co2Pulses;i++) applyCO2(20);
  ids.forEach(id=>sortSpecimen(`${sourceId}-${id}`,'target'));
  finishBatch();
}
function loadValidationFixture(name){
  startLab();
  if(name==='clean'){
    sortFixtureTargets('V-001',['F1','F2','F3','F4','F5','F6','F7','F8','F11','F12']);
    runNegativeGeotaxis('B-01', true, 12);
    chooseClaim('A-01','sensational');
    log('Validation fixture loaded: clean path.');
  } else if(name==='dirty'){
    sortFixtureTargets('V-002',['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10'],4);
    runNegativeGeotaxis('B-01', true, 12);
    chooseClaim('A-01','conservative');
    log('Validation fixture loaded: dirty CO2 path.');
  } else if(name==='missing-control'){
    sortFixtureTargets('V-001',['F1','F2','F3','F4','F5','F6','F7','F8','F11','F12']);
    runNegativeGeotaxis('B-01', false, 8);
    chooseClaim('A-01','mechanistic');
    log('Validation fixture loaded: missing-control path.');
  }
  render();
}
function applyInitialFixture(){
  try{
    const search = window.location && window.location.search ? window.location.search : '';
    const params = new URLSearchParams(search);
    if(params.get('validation')==='packet') startValidation();
    if(params.get('validation')==='capture') startCapture();
    if(params.get('validation')==='status') startStatus();
    if(params.get('validation')==='lived') startLived();
    const fixture = params.get('fixture');
    if(['clean','dirty','missing-control'].includes(fixture)) loadValidationFixture(fixture);
  }catch(e){}
}
function drawChamber(){
  const cv=$('#chamber'), ctx=cv.getContext('2d'), w=cv.width, h=cv.height; anim+=0.025;
  ctx.clearRect(0,0,w,h); ctx.fillStyle='#02040a'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#25324a'; ctx.strokeRect(8,8,w-16,h-16);
  if(S.phase==='lived'){
    ctx.fillStyle='#d8e6ff'; ctx.font='20px system-ui'; ctx.fillText('Experience packet, not shipped lore.',28,48);
    ctx.fillStyle='#9fb0c6'; ctx.font='15px system-ui'; ctx.fillText('Convert memories into verbs, failures, and guardrails.',28,76);
    ctx.fillStyle='#9fdc61'; ctx.font='15px system-ui'; ctx.fillText('1. Name a real repeated action.',28,126);
    ctx.fillText('2. Name the mistake and delayed cost.',28,154);
    ctx.fillText('3. Mark uncertainty for SME review.',28,182);
    ctx.fillStyle='#f5c86a'; ctx.font='14px system-ui'; ctx.fillText('Do not invent unsupported first-slice phenomena.',28,h-36);
    return requestAnimationFrame(drawChamber);
  }
  if(S.phase==='capture'){
    ctx.fillStyle='#d8e6ff'; ctx.font='20px system-ui'; ctx.fillText('External evidence capture packet',28,48);
    ctx.fillStyle='#9fb0c6'; ctx.font='15px system-ui'; ctx.fillText('Write exact phrases before summary or issue creation.',28,76);
    ctx.fillStyle='#9fdc61'; ctx.font='15px system-ui'; ctx.fillText('1. P-01..P-03 exact player phrases.',28,126);
    ctx.fillText('2. SME-01 mechanic ratings.',28,154);
    ctx.fillText('3. LE-01..LE-05 provenance rows.',28,182);
    ctx.fillStyle='#f5c86a'; ctx.font='14px system-ui'; ctx.fillText('Do not close #27 or #33 from this screen alone.',28,h-36);
    return requestAnimationFrame(drawChamber);
  }
  if(S.phase==='status'){
    ctx.fillStyle='#d8e6ff'; ctx.font='20px system-ui'; ctx.fillText('Goal status: external evidence missing',28,48);
    ctx.fillStyle='#9fb0c6'; ctx.font='15px system-ui'; ctx.fillText('#27: 0/5 lived rows. #33: 0/3 players, 0/1 SME.',28,76);
    ctx.fillStyle='#9fdc61'; ctx.font='15px system-ui'; ctx.fillText('Ready: route, packets, ledger, validator, decision tree.',28,126);
    ctx.fillStyle='#f5c86a'; ctx.font='14px system-ui'; ctx.fillText('Completion still requires real user/player/SME evidence.',28,h-36);
    return requestAnimationFrame(drawChamber);
  }
  if(S.phase==='validation'){
    ctx.fillStyle='#d8e6ff'; ctx.font='20px system-ui'; ctx.fillText('Validation packet, not a play state.',28,48);
    ctx.fillStyle='#9fb0c6'; ctx.font='15px system-ui'; ctx.fillText('Run sessions, record exact evidence, then decide #33.',28,76);
    ctx.fillStyle='#9fdc61'; ctx.font='15px system-ui'; ctx.fillText('1. Fresh player reaches Reviewer #2.',28,126);
    ctx.fillText('2. SME reviews clean / dirty / missing-control.',28,154);
    ctx.fillText('3. Follow-up issues capture failures.',28,182);
    ctx.fillStyle='#f5c86a'; ctx.font='14px system-ui'; ctx.fillText('Do not close #27 or #33 from this screen alone.',28,h-36);
    return requestAnimationFrame(drawChamber);
  }
  if(S.lab&&S.phase==='lab'){
    const vials = activeVials(), batches = S.lab.batchRecords.length, assays = S.lab.assayRecords.length, review = S.lab.figureReview;
    ctx.fillStyle='#d8e6ff'; ctx.font='20px system-ui'; ctx.fillText('Procedure record, not phenomenon chamber.',28,48);
    ctx.fillStyle='#9fb0c6'; ctx.font='15px system-ui'; ctx.fillText(`Day ${S.lab.day} • active vials ${vials.length} • batches ${batches} • assays ${assays}`,28,76);
    vials.slice(0,5).forEach((v,i)=>{
      const x=38+i*92, y=122, age=vialAge(v), conf=v.lineageConfidence||0;
      ctx.strokeStyle=v.flags&&v.flags.some(f=>f.includes('risk')||f.includes('incomplete'))?'#d78352':'#7cc7ff';
      ctx.fillStyle='#0b111c'; ctx.fillRect(x,y,54,112); ctx.strokeRect(x,y,54,112);
      ctx.fillStyle=conf>=80?'#9fdc61':conf>=50?'#f5c86a':'#ff8f6b';
      ctx.fillRect(x+8,y+98-conf*.86,38,conf*.86);
      ctx.fillStyle='#d8e6ff'; ctx.font='12px system-ui'; ctx.fillText(v.id,x,y+130);
      ctx.fillStyle='#9fb0c6'; ctx.fillText(`${age}d`,x+2,y+146);
    });
    if(review){
      ctx.fillStyle='#f5c86a'; ctx.font='15px system-ui'; ctx.fillText(`Reviewer: ${review.finding.id}`,28,h-58);
      ctx.fillStyle='#d8e6ff'; ctx.font='13px system-ui'; ctx.fillText(`Evidence ref ${review.finding.evidenceRef}`,28,h-34);
    } else {
      ctx.fillStyle='#9fb0c6'; ctx.font='14px system-ui'; ctx.fillText('Run sorting and assay records to expose reviewer vulnerabilities.',28,h-34);
    }
    return requestAnimationFrame(drawChamber);
  }
  if(!S.phenomenon){ ctx.fillStyle='#d8e6ff'; ctx.font='20px system-ui'; ctx.fillText('No mutant line yet.',28,55); ctx.fillStyle='#9fb0c6'; ctx.font='16px system-ui'; ctx.fillText('Choose traits to discover what flies do.',28,82); return requestAnimationFrame(drawChamber); }
  const grad=ctx.createLinearGradient(w*.4,0,w*.6,h); grad.addColorStop(0,'rgba(70,150,255,.28)'); grad.addColorStop(1,'rgba(70,150,255,.02)'); ctx.fillStyle=grad; ctx.fillRect(w*.38,20,w*.24,h-40);
  for(let i=0;i<38;i++){ let a=anim*(S.phenomenon.name.includes('Dance')?3.0:1.7)+i*.57, r=55+(i%8)*13, x=Math.cos(a+i)*r+Math.sin(a*.37+i)*25, y=Math.sin(a*1.2+i)*r*.55+Math.cos(a*.21+i)*35; if(S.phenomenon.name.includes('Wall')){x=Math.sin(a+i)*w*.38;y=h*.31*Math.sign(Math.sin(a*.35+i));} if(S.phenomenon.name.includes('Spiral')){r=(i*8+(anim*80)%130);x=Math.cos(a)*r;y=Math.sin(a)*r*.55;} ctx.fillStyle=i%5?'#f1d35e':'#72bdff'; ctx.fillRect(w/2+x,h/2+y,7,7); }
  ctx.fillStyle='#d8e6ff'; ctx.font='15px system-ui'; ctx.fillText(S.phenomenon.name,18,h-26);
  requestAnimationFrame(drawChamber);
}
reset(); applyInitialFixture(); drawChamber();
