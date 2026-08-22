const fs = require('fs');
const vm = require('vm');

function boot(search = '') {
  const elements = new Map();
  function el(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        innerHTML: '',
        children: [],
        appendChild(node) { this.children.push(node); },
        getContext() {
          return {
            clearRect() {},
            fillRect() {},
            strokeRect() {},
            fillText() {},
            createLinearGradient() { return { addColorStop() {} }; },
            set fillStyle(v) {},
            set strokeStyle(v) {},
            set font(v) {}
          };
        },
        width: 520,
        height: 330
      });
    }
    return elements.get(id);
  }
  const ctx = {
    console,
    window: null,
    location: { search },
    URLSearchParams,
    document: {
      querySelector(selector) { return el(selector.replace('#', '')); },
      createElement(tag) {
        return {
          tag,
          className: '',
          innerHTML: '',
          children: [],
          onclick: null,
          appendChild(node) { this.children.push(node); }
        };
      }
    },
    requestAnimationFrame() {}
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('web-prototype/data.js', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('web-prototype/app.js', 'utf8'), ctx);
  return { ctx, el };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sortCleanBatch(ctx, sourceId) {
  ctx.startSorting(sourceId);
  ['F1','F2','F3','F4','F5','F6','F7','F8','F11','F12'].forEach(suffix => ctx.sortSpecimen(`${sourceId}-${suffix}`, 'target'));
  ctx.finishBatch();
}

function testR2R3() {
  const { ctx, el } = boot();
  ctx.startLab();
  assert(el('stage').innerHTML.includes('Canton-S'), 'starting stocks missing');
  assert(el('stage').innerHTML.includes('Current goal'), 'objective strip missing current goal');
  assert(el('stage').innerHTML.includes('Next action'), 'objective strip missing next action');
  assert(el('stage').innerHTML.includes('Record risk'), 'objective strip missing record risk');
  assert(el('stage').innerHTML.includes('Reviewer vulnerability'), 'objective strip missing reviewer vulnerability');
  ctx.labelVial('V-003');
  assert(el('stage').innerHTML.includes('Label 75%'), 'label action did not update vial');
  ctx.flipVial('V-003');
  assert(el('stage').innerHTML.includes('V-004'), 'flip did not create new vial');
  ctx.clearAdultsForVirginCollection('V-002');
  ctx.advanceDay();
  ctx.collectVirgins();
  ctx.selectCrossMales('elav');
  ctx.setCrossVial();
  assert(el('stage').innerHTML.includes('X-01'), 'cross record missing');
  assert(el('stage').innerHTML.includes('scoring opens day 11'), 'scoring window missing');
}

function testCleanPath() {
  const { ctx, el } = boot();
  ctx.startLab();
  sortCleanBatch(ctx, 'V-001');
  ctx.runNegativeGeotaxis('B-01', true, 12);
  ctx.chooseClaim('A-01', 'sensational');
  assert(el('stage').innerHTML.includes('climbing assay does not establish'), 'clean sensational path should trigger overclaim');
  assert(el('stage').innerHTML.includes('Next-run repair plan'), 'reviewer debrief repair plan missing');
  assert(el('stage').innerHTML.includes('Keep the claim to a climbing phenotype'), 'overclaim path should suggest claim repair');
}

function testDirtyPath() {
  const { ctx, el } = boot();
  ctx.startLab();
  ctx.startSorting('V-002');
  assert(el('stage').innerHTML.includes('specimen-pad'), 'sorting pad visual layout missing');
  ctx.applyCO2(20);
  ctx.applyCO2(20);
  ctx.applyCO2(20);
  ctx.applyCO2(20);
  ['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10'].forEach(suffix => ctx.sortSpecimen(`V-002-${suffix}`, 'target'));
  ctx.finishBatch();
  ctx.runNegativeGeotaxis('B-01', true, 12);
  assert(el('stage').innerHTML.includes('assay-plot'), 'assay plot missing');
  ctx.chooseClaim('A-01', 'conservative');
  assert(el('stage').innerHTML.includes('CO2 exposure is a behavioral confound'), 'dirty path should trigger CO2 attack');
  assert(el('stage').innerHTML.includes('Stop CO2 earlier'), 'dirty path should suggest CO2 repair');
}

function testMissingControlPath() {
  const { ctx, el } = boot();
  ctx.startLab();
  sortCleanBatch(ctx, 'V-001');
  ctx.runNegativeGeotaxis('B-01', false, 8);
  assert(el('stage').innerHTML.includes('assay-plot'), 'missing-control assay plot missing');
  ctx.chooseClaim('A-01', 'mechanistic');
  assert(el('stage').innerHTML.includes('Without the control group'), 'missing-control path should trigger control attack');
  assert(el('stage').innerHTML.includes('Rerun the assay with a matched control group'), 'missing-control path should suggest control repair');
}

function testLegacyRoute() {
  const { ctx, el } = boot();
  ctx.quickStart();
  assert(el('stage').innerHTML.includes('Light-Induced Swarm Dance'), 'legacy route no longer reaches phenomenon screen');
}

function testValidationPacket() {
  let booted = boot();
  assert(booted.el('choices').children.some(child => child.innerHTML.includes('Open goal status')), 'route selection missing goal status entry');
  assert(booted.el('choices').children.some(child => child.innerHTML.includes('Open validation packet')), 'route selection missing validation packet entry');
  assert(booted.el('choices').children.some(child => child.innerHTML.includes('Open capture packet')), 'route selection missing capture packet entry');
  assert(booted.el('choices').children.some(child => child.innerHTML.includes('Open lived-experience packet')), 'route selection missing lived-experience packet entry');
  booted.ctx.startValidation();
  assert(booted.el('stage').innerHTML.includes('R7 validation packet'), 'validation packet screen missing');
  assert(booted.el('stage').innerHTML.includes('3 player sessions recorded'), 'validation packet missing closure gate');
  assert(booted.el('stage').innerHTML.includes('?fixture=dirty'), 'validation packet missing dirty fixture link');
  assert(booted.el('stage').innerHTML.includes('?validation=status'), 'validation packet missing goal status link');
  assert(booted.el('stage').innerHTML.includes('?validation=capture'), 'validation packet missing capture packet link');
  assert(booted.el('stage').innerHTML.includes('?validation=lived'), 'validation packet missing lived-experience link');
  assert(booted.el('choices').children.some(child => child.innerHTML.includes('Open capture packet')), 'validation packet missing capture packet action');
  assert(booted.el('choices').children.some(child => child.innerHTML.includes('Open goal status')), 'validation packet missing goal status action');
  booted = boot('?validation=packet');
  assert(booted.el('stage').innerHTML.includes('First-run and SME validation'), 'validation URL did not open packet');
  assert(booted.el('footer-question').textContent.includes('new player'), 'validation chrome footer missing');
}

function testGoalStatusPacket() {
  let booted = boot();
  booted.ctx.startStatus();
  assert(booted.el('stage').innerHTML.includes('Not complete: external evidence missing'), 'goal status screen missing incomplete status');
  assert(booted.el('stage').innerHTML.includes('0 / 5'), 'goal status missing #27 count');
  assert(booted.el('stage').innerHTML.includes('0 / 3'), 'goal status missing player count');
  assert(booted.el('stage').innerHTML.includes('Route/fixture coverage'), 'goal status missing route coverage gate');
  assert(booted.el('stage').innerHTML.includes('0 / 1'), 'goal status missing SME count');
  assert(booted.el('stage').innerHTML.includes('Fix/Cut follow-up issues'), 'goal status missing follow-up issue gate');
  assert(booted.el('stage').innerHTML.includes('0 / As needed'), 'goal status missing follow-up issue count');
  assert(booted.el('stage').innerHTML.includes('Screenshots or smoke tests'), 'goal status missing proxy-evidence warning');
  booted = boot('?validation=status');
  assert(booted.el('stage').innerHTML.includes('Thread goal status'), 'goal status URL did not open packet');
  assert(booted.el('footer-question').textContent.includes('evidence is still missing'), 'goal status chrome footer missing');
  booted.ctx.window.GAME_DATA.externalEvidence.playerSessions.accepted = 1;
  booted.ctx.startStatus();
  assert(booted.el('stage').innerHTML.includes('Not complete: external evidence in progress'), 'goal status missing partial-evidence status');
  assert(booted.el('stage').innerHTML.includes('1 / 3'), 'goal status missing partial player count');
  booted.ctx.window.GAME_DATA.externalEvidence.livedRows.accepted = 5;
  booted.ctx.window.GAME_DATA.externalEvidence.livedDesignChange.accepted = 1;
  booted.ctx.window.GAME_DATA.externalEvidence.playerSessions.accepted = 3;
  booted.ctx.window.GAME_DATA.externalEvidence.smeReviews.accepted = 1;
  booted.ctx.startStatus();
  assert(booted.el('stage').innerHTML.includes('Not complete: external evidence in progress'), 'goal status should stay incomplete until route coverage is met');
  booted.ctx.window.GAME_DATA.externalEvidence.playerRouteCoverage.accepted = 3;
  booted.ctx.startStatus();
  assert(booted.el('stage').innerHTML.includes('External evidence ready for closure review'), 'goal status missing ready state after all numeric gates are met');
}

function testCapturePacket() {
  let booted = boot();
  booted.ctx.startCapture();
  assert(booted.el('stage').innerHTML.includes('External evidence capture'), 'capture packet screen missing');
  assert(booted.el('stage').innerHTML.includes('Exact goal phrase'), 'capture packet missing player phrase fields');
  assert(booted.el('stage').innerHTML.includes('Every misleading or unsafe mark'), 'capture packet missing SME follow-up guardrail');
  assert(booted.el('stage').innerHTML.includes('Do not count screenshots'), 'capture packet missing proxy-evidence guardrail');
  assert(booted.el('choices').children.some(child => child.innerHTML.includes('Open goal status')), 'capture packet missing goal status action');
  booted = boot('?validation=capture');
  assert(booted.el('stage').innerHTML.includes('Record before interpreting'), 'capture URL did not open packet');
  assert(booted.el('footer-question').textContent.includes('update the ledger'), 'capture chrome footer missing');
}

function testLivedExperiencePacket() {
  let booted = boot();
  booted.ctx.startLived();
  assert(booted.el('stage').innerHTML.includes('R1 lived-experience packet'), 'lived-experience packet screen missing');
  assert(booted.el('stage').innerHTML.includes('At least 5 event-map rows'), 'lived-experience packet missing acceptance gate');
  assert(booted.el('stage').innerHTML.includes('Unsupported arbitrary phenomena'), 'lived-experience packet missing arbitrary-phenomenon guardrail');
  assert(booted.el('choices').children.some(child => child.innerHTML.includes('Open goal status')), 'lived-experience packet missing goal status action');
  assert(booted.el('choices').children.some(child => child.innerHTML.includes('Open capture packet')), 'lived-experience packet missing capture packet action');
  booted = boot('?validation=lived');
  assert(booted.el('stage').innerHTML.includes('Real lab incidents to mine'), 'lived-experience URL did not open packet');
  assert(booted.el('footer-question').textContent.includes('real lab memory'), 'lived-experience chrome footer missing');
}

function testUrlFixtures() {
  let booted = boot('?fixture=clean');
  assert(booted.el('stage').innerHTML.includes('climbing assay does not establish'), 'clean URL fixture missing overclaim review');
  assert(booted.el('stage').innerHTML.includes('Reviewer vulnerability'), 'clean URL fixture missing objective strip');
  assert(booted.el('stage').innerHTML.includes('Keep the claim to a climbing phenotype'), 'clean URL fixture missing repair plan');
  assert(!booted.el('stage').innerHTML.includes('Light-Induced Swarm Dance'), 'clean URL fixture drifted into legacy phenomenon copy');
  booted = boot('?fixture=dirty');
  assert(booted.el('stage').innerHTML.includes('CO2 exposure is a behavioral confound'), 'dirty URL fixture missing CO2 review');
  assert(booted.el('stage').innerHTML.includes('Reviewer vulnerability'), 'dirty URL fixture missing objective strip');
  assert(booted.el('stage').innerHTML.includes('Stop CO2 earlier'), 'dirty URL fixture missing repair plan');
  booted = boot('?fixture=missing-control');
  assert(booted.el('stage').innerHTML.includes('Without the control group'), 'missing-control URL fixture missing control review');
  assert(booted.el('stage').innerHTML.includes('Reviewer vulnerability'), 'missing-control URL fixture missing objective strip');
  assert(booted.el('stage').innerHTML.includes('Rerun the assay with a matched control group'), 'missing-control URL fixture missing repair plan');
}

testR2R3();
testCleanPath();
testDirtyPath();
testMissingControlPath();
testLegacyRoute();
testValidationPacket();
testGoalStatusPacket();
testCapturePacket();
testLivedExperiencePacket();
testUrlFixtures();

console.log('fly-lab smoke passed: R2/R3, objective strip, reviewer repair plans, validation/status/capture packets, clean, dirty, missing-control, URL fixtures, legacy route');
