// Compiles src/theme.json (palette tokens) into themes/theme.json (hex codes). Run: npm run build
//
// A color is written as "<family>-<step>" ("emerald-500", "neutral-950"), with an optional opacity
// percent: "sapphire-800/30". Steps come from src/sec-colors.dtcg.json, the HSLuv picker's DTCG export.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const SOURCE = 'src/theme.json';
const OUTPUT = 'themes/theme.json';

// neutral-50 and neutral-950 are the lightest and darkest colors for every family, so the 50 and
// 950 steps of the saturated families are off limits.
const ANCHOR = 'neutral';
const EDGE_STEPS = new Set(['50', '950']);

const tokens = JSON.parse(readFileSync(new URL('src/sec-colors.dtcg.json', root), 'utf8'));
const palette = new Map(); // "emerald-500" → "#00ae42"
for (const [family, scale] of Object.entries(tokens)) {
  for (const [step, token] of Object.entries(scale)) {
    const hex = String(token.$value).toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(hex)) throw new Error(`sec-colors.dtcg.json: ${family}.${step} is not a 6-digit hex color`);
    palette.set(`${family}-${step}`, hex);
  }
}
const families = new Set(Object.keys(tokens));

const TOKEN = /^([a-z]+)-(\d+)(?:\/(\d{1,3}))?$/;
const errors = [];
const used = new Map(); // token name → count

function compileColor(value, path) {
  if (/^#[0-9a-f]{3,8}$/i.test(value)) {
    errors.push(`${path}: raw hex ${value}; use a palette token`);
    return value;
  }
  const family = value.match(/^([a-z]+)-/)?.[1];
  if (!families.has(family)) return value;
  const match = value.match(TOKEN);
  if (!match) return errors.push(`${path}: malformed token "${value}"; expected "<family>-<step>" or "<family>-<step>/<percent>"`), value;
  const [, , step, pct] = match;
  const name = `${family}-${step}`;
  const hex = palette.get(name);
  if (!hex) return errors.push(`${path}: unknown palette step "${name}"`), value;
  if (family !== ANCHOR && EDGE_STEPS.has(step)) return errors.push(`${path}: "${name}" is off limits; use "${ANCHOR}-${step}"`), value;
  if (pct !== undefined && +pct > 100) return errors.push(`${path}: opacity ${pct}% is over 100`), value;
  used.set(name, (used.get(name) || 0) + 1);
  const alpha = pct === undefined || +pct === 100 ? '' : Math.round(+pct * 2.55).toString(16).padStart(2, '0');
  return hex + alpha;
}

function compile(value, path) {
  if (typeof value === 'string') return compileColor(value, path);
  if (Array.isArray(value)) return value.map((v, i) => compile(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, compile(v, path ? `${path} › ${k}` : k)]));
  }
  return value;
}

const compiled = compile(JSON.parse(readFileSync(new URL(SOURCE, root), 'utf8')), '');
if (errors.length) {
  console.error(`${SOURCE}:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

mkdirSync(new URL('themes/', root), { recursive: true });
writeFileSync(new URL(OUTPUT, root), JSON.stringify(compiled, null, '\t') + '\n');

const total = [...used.values()].reduce((a, b) => a + b, 0);
const byFamily = {};
for (const [name, n] of used) byFamily[name.split('-')[0]] = (byFamily[name.split('-')[0]] || 0) + n;
console.log(`${OUTPUT}: ${total} colors from ${used.size} palette steps`);
console.log(Object.entries(byFamily).sort((a, b) => b[1] - a[1]).map(([f, n]) => `${f} ${n}`).join(' · '));
