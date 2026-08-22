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
}

function testMissingControlPath() {
  const { ctx, el } = boot();
  ctx.startLab();
  sortCleanBatch(ctx, 'V-001');
  ctx.runNegativeGeotaxis('B-01', false, 8);
  assert(el('stage').innerHTML.includes('assay-plot'), 'missing-control assay plot missing');
  ctx.chooseClaim('A-01', 'mechanistic');
  assert(el('stage').innerHTML.includes('Without the control group'), 'missing-control path should trigger control attack');
}

function testLegacyRoute() {
  const { ctx, el } = boot();
  ctx.quickStart();
  assert(el('stage').innerHTML.includes('Light-Induced Swarm Dance'), 'legacy route no longer reaches phenomenon screen');
}

function testUrlFixtures() {
  let booted = boot('?fixture=clean');
  assert(booted.el('stage').innerHTML.includes('climbing assay does not establish'), 'clean URL fixture missing overclaim review');
  booted = boot('?fixture=dirty');
  assert(booted.el('stage').innerHTML.includes('CO2 exposure is a behavioral confound'), 'dirty URL fixture missing CO2 review');
  booted = boot('?fixture=missing-control');
  assert(booted.el('stage').innerHTML.includes('Without the control group'), 'missing-control URL fixture missing control review');
}

testR2R3();
testCleanPath();
testDirtyPath();
testMissingControlPath();
testLegacyRoute();
testUrlFixtures();

console.log('fly-lab smoke passed: R2/R3, clean, dirty, missing-control, URL fixtures, legacy route');
