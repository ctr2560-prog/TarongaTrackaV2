// zooyardOutcomes.js — the NSW syllabus outcomes ZooYard can defensibly claim.
//
// ⚠️⚠️ READ THE THREE WARNINGS BELOW BEFORE SHOWING THIS TO A SCHOOL.
//
// ── 1. WHAT ZOOYARD CAN AND CANNOT CLAIM ────────────────────────────────────
// ZooYard had a measurement step (pace out the canopy gap, count sightline blockers) and it was
// removed on 2026-10-01 as one step too many. 🚫 That removal means **ZooYard does not support a
// Working Scientifically DATA claim.** It collects no quantitative data, runs no fair test and
// controls no variables. Any outcome whose wording turns on collecting, graphing or interpreting
// data is NOT honestly claimable here, however tempting the code looks.
//
// What it genuinely does, and what every `evidence` line below is tied to:
//   a student observes one named environmental quality in their own schoolyard, decides where it
//   is missing, BUILDS something that provides it, photographs the result, and explains why it
//   matters to that animal.
// That is observation, living-world understanding, designed solutions and conservation action.
//
// ── 2. THE CODES ARE THE 2017 K–6 SYLLABUS, AND IT IS BEING REPLACED ────────
// ⚠️ Verified 2026-10-26: NSW is replacing Science and Technology K–6 (2017) with Science and
//    Technology K–6 (2024). Schools plan during 2026, **teach the new syllabus from 2027**, and
//    the 2017 syllabus is **withdrawn after December 2028**.
// So the K–6 codes below are correct for a class running today and have a known expiry.
// `ZOOYARD_OUTCOMES_2024_NOTE` carries the replacement codes. 🚫 Do not switch to them before a
// school's own transition year — a teacher cannot report against a syllabus they are not teaching.
//
// ── 3. ⚠️ THE WORDINGS NEED A NESA CHECK BEFORE THIS IS SOLD ON ─────────────
// Every CODE below already appears elsewhere in this codebase, and the Stage 1/3 Working
// Scientifically and Stage 1 Design and Production codes were corroborated against NSW
// Department of Education and NESA-derived sources on 2026-10-26. The `desc` strings, however,
// were inherited from the existing in-app lists, not transcribed from the syllabus document.
// 🚫 Treat `desc` as a paraphrase until someone has checked each line against NESA.
// ⚠️ `ST2-5WT-T`, used in `CreateClassScreen.jsx`, could NOT be found in any source. The nearest
//    real code appears to be `ST2-5LW-T`. It is deliberately NOT used here. Fix it there.
//
// Shape matches WD_OUTCOMES in modes/wildest-dreams/content.js on purpose, so the info sheets
// can stay near-identical: { lifeSkills, syllabus, outcomes: [{ code, desc, evidence }] }.

export const ZOOYARD_OUTCOMES = {
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

// Shown under the outcome table wherever it appears.
export const ZOOYARD_OUTCOMES_NOTE =
  'ZooYard is designed for observation, designed solutions and conservation action. It does not ' +
  'collect quantitative data, run fair tests or control variables, so it should not be reported ' +
  'against outcomes that require data collection or experimental design.';

// ⚠️ The replacement syllabus, for planning only. Verified against the NSW curriculum site
//    2026-10-26. Teaching starts 2027; the 2017 syllabus goes after December 2028.
// 🚫 Do not wire these into the info sheet yet — see warning 2 at the top.
export const ZOOYARD_OUTCOMES_2024_NOTE = {
  syllabus: 'Science and Technology K–6 (2024)',
  teachingFrom: 2027,
  withdrawn2017After: 'December 2028',
  likelyCodes: {
    1: ['ST1-SCI-01', 'ST1-PQU-01', 'ST1-DDT-01'],
    2: ['ST2-SCI-01', 'ST2-PQU-01', 'ST2-DDT-01'],
    3: ['ST3-SCI-01', 'ST3-PQU-01', 'ST3-DDT-01', 'ST3-CWT-01'],
  },
  caution:
    'Codes only — the Stage 3 set and all 2024 wordings still need checking against NESA, and the ' +
    'mapping from ZooYard to each one has not been written. ST*-DAT-01 is deliberately absent: it ' +
    'is the data outcome, and ZooYard collects none.',
};
