// audit-outcomes.mjs — checks every NSW syllabus outcome code in the app against
// src/data/syllabusTransition.js.
//
// Run:  npx vite-node scripts/audit-outcomes.mjs
//       npx vite-node scripts/audit-outcomes.mjs 2027     (see it as a 2027 school would)
//
// ⚠️ WHY THIS IS A SCRIPT AND NOT A ONE-OFF. Outcome codes were defined independently in five
// files and had already drifted apart — two of them disagreed about PDHPE, and one carried a code
// that does not appear to exist. Nothing would have caught that. Run this after touching any
// outcome list, and before any conversation with a school about curriculum alignment.
//
// Exit code is 1 if anything is bogus, so it can go in CI.

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { classifyCode, SYLLABUS_STATUS, SYLLABUS_2027_FROM } from '../src/data/syllabusTransition.js';

const ROOT = new URL('..', import.meta.url).pathname;
const YEAR = Number(process.argv[2]) || new Date().getFullYear();

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

// Only `code: 'XXX'` — the shape every outcome list in this app uses. Deliberately narrow, so
// prose mentioning a code in a comment is not counted.
const CODE_RE = /code:\s*'([A-Z][A-Z0-9-]{3,})'/g;

const found = new Map();   // code -> Set(file)
for (const file of walk(join(ROOT, 'src'))) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(CODE_RE)) {
    const rel = relative(ROOT, file);
    // The transition module itself is the reference list, not a usage site.
    if (rel.endsWith('syllabusTransition.js')) continue;
    if (!found.has(m[1])) found.set(m[1], new Set());
    found.get(m[1]).add(rel);
  }
}

const buckets = { bogus: [], 'retires-2027': [], unknown: [], ok: [] };
for (const [code, files] of [...found].sort()) {
  const c = classifyCode(code, YEAR);
  buckets[c.status].push({ code, files: [...files], ...c });
}

const line = (s = '') => console.log(s);
line();
line(`NSW outcome audit — ${found.size} distinct codes, viewed as a school in ${YEAR}`);
line('='.repeat(78));

if (buckets.bogus.length) {
  line();
  line(`XX NOT A REAL OUTCOME  (${buckets.bogus.length})`);
  for (const b of buckets.bogus) {
    line(`   ${b.code}`);
    line(`      ${b.message}`);
    for (const f of b.files) line(`      in ${f}`);
  }
}

if (buckets['retires-2027'].length) {
  line();
  line(`!! REPLACED FROM ${SYLLABUS_2027_FROM}  (${buckets['retires-2027'].length})`);
  const byArea = {};
  for (const b of buckets['retires-2027']) (byArea[b.area] ||= []).push(b);
  for (const [area, list] of Object.entries(byArea)) {
    const s = SYLLABUS_STATUS[area];
    line(`   ${s.current}  ->  ${s.from2027}`);
    line(`   withdrawn after ${s.withdrawnAfter}`);
    for (const b of list) line(`      ${b.code.padEnd(14)} ${b.files.join(', ')}`);
  }
}

if (buckets.unknown.length) {
  line();
  line(`?? UNRECOGNISED  (${buckets.unknown.length})`);
  for (const b of buckets.unknown) line(`   ${b.code.padEnd(14)} ${b.files.join(', ')}`);
}

line();
line(`OK  SAFE IN ${YEAR} AND BEYOND  (${buckets.ok.length})`);
const okByArea = {};
for (const b of buckets.ok) (okByArea[b.syllabus] ||= []).push(b.code);
for (const [syl, codes] of Object.entries(okByArea)) {
  line(`   ${syl}`);
  line(`      ${codes.join(', ')}`);
}

line();
line('-'.repeat(78));
line(`bogus ${buckets.bogus.length} | replaced ${buckets['retires-2027'].length} | unknown ${buckets.unknown.length} | ok ${buckets.ok.length}`);
line();

process.exit(buckets.bogus.length ? 1 : 0);
