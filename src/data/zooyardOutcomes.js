// zooyardOutcomes.js — the NSW syllabus outcomes ZooYard can defensibly claim.
//
// ⚠️⚠️ READ THE FOUR WARNINGS BELOW BEFORE SHOWING THIS TO A SCHOOL.
//
// ── 1. WHAT ZOOYARD CAN AND CANNOT CLAIM ────────────────────────────────────
// ZooYard had a measurement step (pace out the canopy gap, count sightline blockers) and it was
// removed on 2026-10-01 as one step too many. 🚫 That removal means **ZooYard does not support a
// data claim, and it does not support a fair-test claim either.** It collects no quantitative
// data, runs no fair test and controls no variables.
//
// This rules out whole families of outcome, and the rule is applied strictly below:
//   🚫 ST*-DAT-01 — the data outcomes. Excluded at every stage.
//   🚫 ST2-PQU-01 / ST3-PQU-01 — "fair tests", "identify variables". Excluded.
// However well a code seems to fit, if its wording turns on data or fair testing it is not ours.
//
// What ZooYard genuinely does, and what every `evidence` line is tied to:
//   a student observes one named environmental quality in their own schoolyard, decides where it
//   is missing, BUILDS something that provides it, photographs the result, and explains why it
//   matters to that animal.
// That is observation, living-world understanding, designed solutions and conservation action.
//
// ── 2. TWO SYLLABUSES, SELECTED BY YEAR ─────────────────────────────────────
// ⚠️ Verified against the NSW curriculum site 2026-10-26. NSW is replacing Science and Technology
//    K–6 (2017) with Science and Technology K–6 (2024). Schools plan during 2026, **teach the new
//    syllabus from 2027**, and the 2017 syllabus is **withdrawn after December 2028**.
// Both sets are kept here and `zooyardOutcomesFor(stage)` picks by the current year, so the app
// switches itself on 1 January 2027 and nobody has to remember. 🚫 Do not delete the 2017 set
// before 2029 — a school still teaching it must be able to report against it.
// ⚠️ Stages 4–5 are Science 7–10 (2023), which is already current and still current in 2027, so
//    the secondary outcomes are identical in both sets and are defined once.
//
// ── 3. ⚠️ THE 2024 SYLLABUS FITS ZOOYARD *WORSE* AT STAGE 2 ─────────────────
// Not a bug and not something to paper over. ST2-SCI-01 (2024) is about **the solar system and
// the effects of energy** — ZooYard is habitat, so it is not claimable. ST2-PQU-01 is fair tests
// and ST2-DAT-01 is data, both excluded by rule 1, and ST2-DDT-02 is algorithms and digital
// systems. That leaves **exactly one** honest Stage 2 outcome from 2027: `ST2-DDT-01`.
// 🚫 Do not pad the Stage 2 list to make it look comparable. Tell the school instead — a Stage 2
//    class in 2027 is better served by running ZooYard as a Design and Technology task.
//
// ── 4. ⚠️ THE WORDINGS ─────────────────────────────────────────────────────
// Early Stage 1, Stage 1 and Stage 2 of the 2024 set are **verbatim** from the NSW curriculum
// site. 🚫 The Stage 3 (2024) wordings and ALL 2017 wordings are working paraphrases — the Stage 3
// outcomes were only available through NSW Department of Education secondary pages, and the 2017
// set was inherited from the existing in-app lists. Check each against NESA before the mode is
// sold on its outcomes. Both the panel and the sheet say so in a visible caution block.
//
// ⚠️ `ST2-5WT-T`, used in `CreateClassScreen.jsx`, could not be found in any source. The nearest
//    real code appears to be `ST2-5LW-T`. It is deliberately NOT used here. Fix it there.
//
// Shape matches WD_OUTCOMES in modes/wildest-dreams/content.js:
//   { lifeSkills, syllabus, outcomes: [{ code, desc, evidence }] }

// The year NSW schools begin teaching Science and Technology K–6 (2024).
// ⚠️ 2024 wordings come from science2024() in syllabusTransition.js, never typed out here.
//    Four of the six Stage 3 wordings in this file were WRONG before that check on 2026-10-26 —
//    close enough to look right and not right. 🚫 Do not paste a wording back in.
import { science2024 } from './syllabusTransition';

export const SYLLABUS_2024_FROM = 2027;

// ── Stages 4–5: Science 7–10 (2023). Unchanged across the K–6 transition. ───
const SECONDARY = {
  4: {
    lifeSkills: false,
    syllabus: 'Science 7–10 (2023)',
    outcomes: [
      { code: 'SC4-WS-01',
        desc: 'Uses scientific tools and instruments for observations',
        evidence: 'Structured observation of one variable in a real environment, with the camera as the recording instrument.' },
      { code: 'SC4-WS-08',
        desc: 'Communicates scientific concepts and ideas using a range of communication forms',
        evidence: 'The write-up is marked on three domains, and the build photo and citizen science statement are communication in their own right.' },
      { code: 'SC4-LIV-01',
        desc: 'Describes the role, structure and function of a range of living systems and their components',
        evidence: 'Each habitat isolates one component of a living system — ground layer, canopy connectivity, vertical layering — and asks what it does.' },
    ],
  },
  5: {
    lifeSkills: false,
    syllabus: 'Science 7–10 (2023)',
    outcomes: [
      { code: 'SC5-WS-01',
        desc: 'Selects and uses scientific tools and instruments for accurate observations',
        evidence: 'Same observation task, marked against the Stage 5 rubric, which requires an explanation rather than a description.' },
      { code: 'SC5-WS-08',
        desc: 'Communicates scientific arguments with evidence, using scientific language and terminology in a range of communication forms',
        evidence: 'Stage 5 writing prompts ask the student to explain a mechanism — why cover changes hunting success, why layering raises species diversity — not just report it.' },
      { code: 'SC5-CLS-01',
        desc: 'Analyses and evaluates the structural and functional relationships of living systems',
        evidence: 'The organising question of every habitat is the relationship between a structural feature of a habitat and an animal\'s function within it.' },
    ],
  },
};

// ── Science and Technology K–6 (2024) — taught from 2027 ────────────────────
// ⚠️ Stage 1 and Stage 2 wordings are verbatim from curriculum.nsw.edu.au. Stage 3 is a
//    paraphrase from NSW Department of Education pages — see warning 4.
export const ZOOYARD_OUTCOMES_2024 = {
  1: {
    lifeSkills: false,
    syllabus: 'Science and Technology K–6 (2024)',
    outcomes: [
      { ...science2024('ST1-DDT-01'),
        evidence: 'The build step, and the strongest fit in the whole 2024 set: the student makes something real — plants into a canopy gap, rakes a ground layer back, makes a shaded refuge — and photographs it.' },
      { ...science2024('ST1-SCI-01'),
        evidence: 'Describes the change the build makes to a living thing\'s habitat. ⚠️ ZooYard does NOT measure — claim the "describes changes in living things" half of this outcome only.' },
      { ...science2024('ST1-PQU-01'),
        evidence: 'Two minutes of watching produces the question the habitat turns on: this quality is missing here, so what happens to the animal?' },
    ],
  },
  2: {
    lifeSkills: false,
    syllabus: 'Science and Technology K–6 (2024)',
    outcomes: [
      { ...science2024('ST2-DDT-01'),
        evidence: 'Observe what is missing, choose a build, make it, photograph it — a complete design process, with a stated fallback for schools that cannot plant into the ground.' },
    ],
  },
  3: {
    lifeSkills: false,
    syllabus: 'Science and Technology K–6 (2024)',
    outcomes: [
      { ...science2024('ST3-SCI-01'),
        evidence: 'The best fit ZooYard has in either syllabus. The student observes, builds a sustainability measure, then explains from evidence why it helps that animal.' },
      { ...science2024('ST3-DDT-01'),
        evidence: 'Each habitat sets a problem — this quality is missing here — and the student designs and builds the solution.' },
      { ...science2024('ST3-CWT-01'),
        evidence: 'The write-up, marked on three domains, with Stage 3 prompts asking for a reason rather than a description.' },
    ],
  },
  ...SECONDARY,
};

// ── Science and Technology K–6 (2017) — current until schools transition ────
// 🚫 Keep until 2029. A school still teaching 2017 must be able to report against it.
export const ZOOYARD_OUTCOMES_2017 = {
  1: {
    lifeSkills: false,
    syllabus: 'Science and Technology K–6 (2017)',
    outcomes: [
      { code: 'ST1-1WS-S',
        desc: 'Observes, questions and collects data to communicate and compare ideas',
        evidence: 'Spends two minutes watching one named quality — shade, cover, connected trees — and says where it is and is not in the schoolyard.' },
      { code: 'ST1-4LW-S',
        desc: 'Describes the behaviours and needs of living things and the features of their environment that help them survive',
        evidence: 'Each habitat is built around one thing an animal needs. The writing prompt asks the student to say why that animal needs it.' },
      { code: 'ST1-2DP-T',
        desc: 'Uses materials, tools and equipment to develop solutions for a need or opportunity',
        evidence: 'The build step: plants into a canopy gap, rakes a ground layer back, makes a shaded refuge. Photographed as evidence.' },
    ],
  },
  2: {
    lifeSkills: false,
    syllabus: 'Science and Technology K–6 (2017)',
    outcomes: [
      { code: 'ST2-1WS-S',
        desc: 'Conducts investigations by observing, questioning, planning, predicting, testing and communicating',
        evidence: 'Observes the schoolyard against a stated quality, then communicates the finding in the write-up. ⚠️ No fair test and no measurement — see the data warning at the top of this file.' },
      { code: 'ST2-4LW-S',
        desc: 'Compares features of living things and examines how environments affect living things',
        evidence: 'Compares what the animal\'s habitat provides with what the schoolyard provides, across up to eight different habitat types.' },
    ],
  },
  3: {
    lifeSkills: false,
    syllabus: 'Science and Technology K–6 (2017)',
    outcomes: [
      { code: 'ST3-1WS-S',
        desc: 'Plans and conducts scientific investigations to answer questions or solve problems',
        evidence: 'The habitat sets the problem — this quality is missing here — and the student plans and carries out the build that solves it.' },
      { code: 'ST3-4LW-S',
        desc: 'Examines the role of living things in the environment and the effect of environmental change',
        evidence: 'The whole mode is environmental change the student makes themselves, then explains the effect of.' },
    ],
  },
  ...SECONDARY,
};

/**
 * The outcome set a school should report against, for a given calendar year.
 * ⚠️ Switches itself on 1 January 2027. Pass `year` only in tests.
 */
export function zooyardOutcomesFor(stage, year = new Date().getFullYear()) {
  const set = year >= SYLLABUS_2024_FROM ? ZOOYARD_OUTCOMES_2024 : ZOOYARD_OUTCOMES_2017;
  return set[stage] || set[4];
}

/** True once the 2024 K–6 syllabus is the one being taught. */
export function using2024Syllabus(year = new Date().getFullYear()) {
  return year >= SYLLABUS_2024_FROM;
}

// Shown under the outcome table wherever it appears.
export const ZOOYARD_OUTCOMES_NOTE =
  'ZooYard is designed for observation, designed solutions and conservation action. It does not ' +
  'collect quantitative data, run fair tests or control variables, so it should not be reported ' +
  'against outcomes that require data collection or experimental design.';

// ⚠️ Shown on the Stage 2 view only, from 2027. See warning 3.
export const ZOOYARD_STAGE2_2024_NOTE =
  'Stage 2 of the 2024 syllabus places the science content on the solar system and the effects of ' +
  'energy, and its remaining outcomes require fair tests, data or digital systems — none of which ' +
  'ZooYard does. Only the design outcome is honestly claimable. A Stage 2 class is better served ' +
  'by running ZooYard as a Design and Technology task.';
