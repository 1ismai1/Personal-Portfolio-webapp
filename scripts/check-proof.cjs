const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const { renderToStaticMarkup } = require('react-dom/server')
const React = require('react')
const root = join(__dirname, '..')
const original = JSON.parse(readFileSync(join(root, 'public/data/endurance.json'), 'utf8'))
const compiled = ts.transpileModule(readFileSync(join(root, 'components/home/ProofStrip.tsx'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText
function render(data) {
  const context = { exports: {}, require: name => name === '@/public/data/endurance.json' ? data : require(name) }
  vm.runInNewContext(compiled, context)
  return renderToStaticMarkup(React.createElement(context.exports.default))
}
const noGaps = structuredClone(original)
noGaps.gaps = []
assert.doesNotThrow(() => render(noGaps), 'a continuous log must render without a gap')
assert.doesNotMatch(render(noGaps), /sensor unplugged|recovered/)
const multiple = structuredClone(original)
multiple.gaps.push({ ...multiple.gaps[0], fromMs: 90000, toMs: 91000, durationMs: 1000 })
assert.match(render(multiple), /2 interruptions/)
assert.doesNotMatch(render(multiple), /except for one/)
const dropped = structuredClone(noGaps)
dropped.stretches.at(-1).droppedSamples = 2
assert.doesNotMatch(render(dropped), /zero dropped samples|at exactly/)
assert.match(render(original), /25\.3/)
const singleSample = structuredClone(multiple)
Object.assign(singleSample.stretches.at(-1), { samples: 1, durationS: 0, avgIntervalMs: null })
assert.doesNotThrow(() => render(singleSample), 'a last segment with one sample has no average interval')
console.log('ProofStrip: continuous, multiple-gap, dropped-sample and supplied-log checks passed.')
