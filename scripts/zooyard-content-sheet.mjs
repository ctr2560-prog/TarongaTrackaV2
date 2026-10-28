// zooyard-content-sheet.mjs — prints every ZooYard habitat as a student meets it, for review.
//
// Run:  npx vite-node scripts/zooyard-content-sheet.mjs 4 > zooyard-stage-4.md
//       npx vite-node scripts/zooyard-content-sheet.mjs      (defaults to stage 4)
//
// ⚠️ GENERATED FROM src/data/zooyardAnimals.js, never hand-maintained. A reviewer reading a
//    hand-copied list is reviewing what the app USED to say — that is the whole reason this is a
//    script. Re-run it after any content edit and re-read the output.
//
// ⚠️ The quiz is the SAME at every stage. Only `writingPromptByStage` changes, so the stage
//    argument affects exactly one line per habitat. Worth knowing before comparing two stages and
//    wondering why they look identical.

import { ZOOYARD_ANIMALS } from '../src/data/zooyardAnimals.js';

const STAGE = Number(process.argv[2]) || 4;
const L = (s = '') => console.log(s);

const missingVideos = ZOOYARD_ANIMALS.filter(a => !a.videoUrl);
const correctPositions = ZOOYARD_ANIMALS.map(a => a.activity.correct);

L(`# ZooYard — Stage ${STAGE} content`);
L();
L(`${ZOOYARD_ANIMALS.length} habitats, generated from \`src/data/zooyardAnimals.js\` on ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}.`);
L();
L('Every habitat runs the same five beats: **stand somewhere real → answer one question → watch for two minutes → build something → write it up.**');
L();

// ── What a reviewer should know before reading the eight ───────────────────
L('## Before you start');
L();
if (missingVideos.length) {
  L(`- ⚠️ **${missingVideos.length} of ${ZOOYARD_ANIMALS.length} videos are missing.** Every habitat currently shows "Video coming soon" and goes straight to the question. Missing: ${missingVideos.map(a => a.name).join(', ')}.`);
}
L(`- **The question is the same at every stage.** Only the writing prompt changes by stage, so Stage 1 and Stage 5 students answer an identical multiple choice.`);
L(`- **Correct answers sit at positions ${correctPositions.join(', ')}** (0 = first option). Scattered, not patterned.`);
L(`- **Every build has a fallback** for schools that cannot plant into the ground.`);
L(`- **Every habitat asks for a photo** of what was built. That photo plus the unlock photo are the two camera steps.`);
L();

for (const a of ZOOYARD_ANIMALS) {
  const q = a.activity;
  const o = a.observation;
  const cs = a.citizenScience;

  L('---');
  L();
  L(`## ${a.name}`);
  L();
  L(`*${a.scientificName}* · ${a.habitatLabel} · **the one thing this habitat is about: ${o.focus.toLowerCase()}**`);
  L();

  L(`**1 · Where they stand**`);
  L();
  L(`> ${a.selfAttestWhere} ${a.selfAttestPrompt}`);
  L(`>`);
  L(`> *Unlock question:* ${a.selfAttestQuestion} — they photograph the spot to unlock it.`);
  L();

  L(`**2 · Video**`);
  L();
  L(a.videoUrl ? `> ${a.videoUrl}` : `> ⚠️ **Not filmed.** Should set up *${o.focus.toLowerCase()}*, so a student knows what they are walking out to look for.`);
  L();

  L(`**3 · The question**`);
  L();
  L(`> ${q.question}`);
  L(`>`);
  q.options.forEach((opt, i) => L(`> ${i === q.correct ? '- **✓ ' + opt + '**' : '- ' + opt}`));
  L(`>`);
  L(`> *Shown when correct:* ${q.fact}`);
  L();

  L(`**4 · Two minutes of watching** — ${o.title}`);
  L();
  L(`> ${o.instruction}`);
  L(`>`);
  L(`> What they are told to look for:`);
  o.lookFor.forEach(x => L(`> - ${x}`));
  L();

  L(`**5 · Build it** — ${cs.icon} ${cs.title}`);
  L();
  L(`> ${cs.brief}`);
  L(`>`);
  L(`> **Do this:** ${cs.primary}`);
  L(`>`);
  L(`> **If they can't:** ${cs.fallback}`);
  L(`>`);
  L(`> Steps:`);
  cs.steps.forEach((s, i) => L(`> ${i + 1}. ${s}`));
  L(`>`);
  L(`> **Photo:** ${cs.photoPrompt}`);
  L();

  L(`**6 · Write it up** — Stage ${STAGE}`);
  L();
  const prompt = a.writingPromptByStage?.[STAGE];
  L(prompt ? `> ${prompt}` : `> ⚠️ **No Stage ${STAGE} prompt.** The app would fall back to another stage's wording.`);
  L();
}
