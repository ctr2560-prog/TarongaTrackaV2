// syllabusTransition.js — which NSW syllabus each outcome code belongs to, and what happens
// to it in 2027. One source of truth for the whole app.
//
// ⚠️⚠️ WHY THIS EXISTS. Outcome codes were defined independently in five files and had already
// drifted: `teacherInfoSheet.js` carried the NEW PDHPE codes while `CreateClassScreen.jsx`
// carried the OLD ones, and one code in CreateClassScreen (`ST2-5WT-T`) does not appear to exist
// at all. Nothing checked them against each other or against NESA. This module is what an audit
// can be run against — see `scripts/audit-outcomes.mjs`.
//
// ── VERIFIED AGAINST NSW SOURCES ON 2026-10-26 ─────────────────────────────
// Three learning areas the app uses are UNAFFECTED in 2027:
//   English K–10 (2022)        current, no replacement announced
//   Mathematics K–10 (2022)    current, no replacement announced
//   Science 7–10 (2023)        current, and its Life Skills outcomes (SCLS-*) with it
//
// Two ARE replaced, both from 2027, both with the 2018/2017 version withdrawn after Dec 2028:
//   Science and Technology K–6 (2017)  ->  Science and Technology K–6 (2024)
//   PDHPE K–10 (2018)                  ->  PDHPE K–6 (2024) and PDHPE 7–10 (2024)
//
// ⚠️ PDHPE 7–10 (2024) is staggered: Years 7 and 9 from 2027, Years 8 and 10 from 2028. So a
//    Stage 4 or Stage 5 class in 2027 may be on EITHER syllabus depending on the year group.
//    🚫 Do not present a single Stage 4/5 PDHPE answer for 2027 as though it were settled.
//
// ⚠️ One ambiguity left open: the NSW secondary syllabus listing shows a "New from 2027" tag near
//    English K–10 (2022), which appears to belong to an adjacent entry. Treated as unaffected
//    here. Worth one check before a 2027 sales conversation.

export const SYLLABUS_2027_FROM = 2027;

/** Learning areas, their current syllabus, and whether 2027 changes anything. */
export const SYLLABUS_STATUS = {
  english: {
    current: 'English K–10 (2022)',
    replacedIn2027: false,
    codePrefixes: ['EN'],
    note: 'No replacement announced. ⚠️ One NSW listing shows an ambiguous "New from 2027" tag near this syllabus — worth a check.',
  },
  mathematics: {
    current: 'Mathematics K–10 (2022)',
    replacedIn2027: false,
    codePrefixes: ['MA'],
    note: 'No replacement announced.',
  },
  scienceSecondary: {
    current: 'Science 7–10 (2023)',
    replacedIn2027: false,
    codePrefixes: ['SC4', 'SC5', 'SCLS'],
    note: 'Current and unaffected. Covers Stage 4, Stage 5 and the Life Skills outcomes Wildest Dreams uses.',
  },
  sciencePrimary: {
    current: 'Science and Technology K–6 (2017)',
    from2027: 'Science and Technology K–6 (2024)',
    replacedIn2027: true,
    withdrawnAfter: 'December 2028',
    // 2017 codes carry a strand in the middle: 1WS-S, 4LW-S, 2DP-T, 5LW-T.
    legacyPattern: /^ST[1-3]-\d[A-Z]{2}-[ST]$/,
    // 2024 codes are ST<stage>-<3 letters>-<2 digits>.
    currentPattern: /^ST[1-3]-(SCI|PQU|DAT|DDT|CWT)-\d{2}$/,
    note: 'Schools plan during 2026, teach the 2024 syllabus from 2027.',
  },
  pdhpe: {
    current: 'PDHPE K–10 (2018)',
    from2027: 'PDHPE K–6 (2024) and PDHPE 7–10 (2024)',
    replacedIn2027: true,
    withdrawnAfter: 'December 2028',
    // 2018 codes look like PD1-2, PD4-2 — stage then a bare outcome number.
    legacyPattern: /^PD[e1-5]-\d+$/,
    // 2024 codes look like PH1-IHW-01.
    currentPattern: /^PH[1-5]-[A-Z]{3}-\d{2}$/,
    note: '⚠️ 7–10 is staggered: Years 7 and 9 from 2027, Years 8 and 10 from 2028.',
  },
};

// ── Science and Technology K–6 (2024) ──────────────────────────────────────
// ⚠️ Stage 1 and Stage 2 wordings are VERBATIM from curriculum.nsw.edu.au (2026-10-26).
// 🚫 Stage 3 wordings are PARAPHRASES from NSW Department of Education pages — the syllabus text
//    itself was not reachable. Check against NESA before printing them for a school.
export const SCIENCE_K6_2024 = {
  1: [
    { code: 'ST1-SCI-01', desc: 'Measures and describes changes in living things, materials, movement, Earth and the sky', verbatim: true },
    { code: 'ST1-PQU-01', desc: 'Poses questions based on observations and information to investigate cause and effect', verbatim: true },
    { code: 'ST1-DAT-01', desc: 'Collects, represents and uses data to identify patterns and relationships', verbatim: true },
    { code: 'ST1-DDT-01', desc: 'Uses technologies and materials to design and make products to address user needs or opportunities', verbatim: true },
  ],
  2: [
    { code: 'ST2-SCI-01', desc: 'Uses information to investigate the solar system and the effects of energy on living, physical and geological systems', verbatim: true },
    { code: 'ST2-PQU-01', desc: 'Poses questions to create fair tests that investigate the effects of energy on living things and physical systems', verbatim: true },
    { code: 'ST2-DAT-01', desc: 'Uses and interprets data to describe patterns and relationships', verbatim: true },
    { code: 'ST2-DDT-01', desc: 'Uses a design process to create products to address user needs or opportunities', verbatim: true },
    { code: 'ST2-DDT-02', desc: 'Designs and uses algorithms, represents data and uses digital systems for a purpose', verbatim: true },
  ],
  3: [
    { code: 'ST3-SCI-01', desc: 'Uses evidence to explain how scientific knowledge can support sustainable practices', verbatim: false },
    { code: 'ST3-PQU-01', desc: 'Poses questions to identify variables and conducts fair tests to collect data', verbatim: false },
    { code: 'ST3-DAT-01', desc: 'Interprets data to support explanations and arguments', verbatim: false },
    { code: 'ST3-DDT-01', desc: 'Designs solutions, evaluating and modifying them', verbatim: false },
    { code: 'ST3-DDT-02', desc: 'Designs and uses algorithms and digital systems, evaluating and modifying them', verbatim: false },
    { code: 'ST3-CWT-01', desc: 'Creates scientific and technological texts', verbatim: false },
  ],
};

// ── PDHPE K–6 (2024) ───────────────────────────────────────────────────────
// ⚠️ Stage 1 and Stage 2 are VERBATIM from curriculum.nsw.edu.au (2026-10-26).
// 🚫 STAGE 3 IS NOT RECORDED — the page truncated before it and no second source was found.
//    Do not invent it. `teacherInfoSheet.js` already carries PH3-* codes; they are plausible and
//    follow the pattern, but they are UNVERIFIED.
export const PDHPE_K6_2024 = {
  1: [
    { code: 'PH1-MSP-01', desc: 'Demonstrates fundamental movement skills and fair play in physical activities', verbatim: true },
    { code: 'PH1-RRS-01', desc: 'Describes and demonstrates actions that support respectful relationships and safety offline and online', verbatim: true },
    { code: 'PH1-IHW-01', desc: 'Describes factors that contribute to identity, health and wellbeing', verbatim: true },
    { code: 'PH1-SMI-01', desc: 'Describes and demonstrates self-management and interpersonal skills in a range of contexts', verbatim: true },
  ],
  2: [
    { code: 'PH2-MSP-01', desc: 'Applies movement skills, strategies and teamwork in physical activities', verbatim: true },
    { code: 'PH2-RRS-01', desc: 'Describes and applies skills and strategies to strengthen respectful relationships', verbatim: true },
    { code: 'PH2-RRS-02', desc: 'Describes and applies skills and strategies to interact safely in offline and online contexts', verbatim: true },
    { code: 'PH2-IHW-01', desc: 'Explains how related factors influence identity, health and wellbeing', verbatim: true },
    { code: 'PH2-SMI-01', desc: 'Explains and applies self-management and interpersonal skills in a range of contexts', verbatim: true },
  ],
  // 3: NOT RECORDED — see the warning above. 🚫 Do not fill this in from memory.
};

/** Codes that are known NOT to exist. Checked by the audit so they cannot creep back. */
export const BOGUS_CODES = {
  'ST2-5WT-T': 'No source found on 2026-10-26. The nearest real code appears to be ST2-5LW-T. Used in CreateClassScreen.jsx.',
};

/** True once the 2027 syllabuses are the ones being taught. */
export function using2027Syllabuses(year = new Date().getFullYear()) {
  return year >= SYLLABUS_2027_FROM;
}

/**
 * Classifies one outcome code for a given year.
 * Returns { area, status, syllabus, message }.
 *   status: 'ok' | 'retires-2027' | 'bogus' | 'unknown'
 */
export function classifyCode(code, year = new Date().getFullYear()) {
  if (BOGUS_CODES[code]) {
    return { area: null, status: 'bogus', syllabus: null, message: BOGUS_CODES[code] };
  }
  for (const [area, s] of Object.entries(SYLLABUS_STATUS)) {
    const matchesPrefix = s.codePrefixes?.some(p => code.startsWith(p));
    const matchesLegacy = s.legacyPattern?.test(code);
    const matchesCurrent = s.currentPattern?.test(code);
    if (!matchesPrefix && !matchesLegacy && !matchesCurrent) continue;

    if (!s.replacedIn2027) {
      return { area, status: 'ok', syllabus: s.current, message: s.note };
    }
    if (matchesCurrent) {
      return { area, status: 'ok', syllabus: s.from2027, message: `Already on the ${s.from2027} set.` };
    }
    return {
      area,
      status: year >= SYLLABUS_2027_FROM ? 'retires-2027' : 'retires-2027',
      syllabus: s.current,
      message: `${s.current} is replaced by ${s.from2027} from ${SYLLABUS_2027_FROM}; withdrawn after ${s.withdrawnAfter}. ${s.note}`,
    };
  }
  return { area: null, status: 'unknown', syllabus: null, message: 'Not recognised by any known NSW code pattern.' };
}

/**
 * The verified wording for a Science and Technology K–6 (2024) code.
 * ⚠️ Single-sourced on purpose — four files now show these, and a wording typed out four times
 *    is a wording that drifts. Throws on an unknown code so a typo fails loudly at build rather
 *    than printing a blank description on a sheet handed to a school.
 */
export function science2024(code) {
  for (const list of Object.values(SCIENCE_K6_2024)) {
    const hit = list.find(o => o.code === code);
    if (hit) return hit;
  }
  throw new Error(`science2024: unknown code "${code}" — add it to SCIENCE_K6_2024 first.`);
}

/**
 * ⚠️ Shown on any Stage 2 science view from 2027.
 * The 2024 syllabus moves Stage 2 science content to the solar system and the effects of energy,
 * so there is NO Stage 2 living-world outcome. 🚫 Never substitute ST2-SCI-01 to fill the gap.
 */
export const STAGE2_LIVING_WORLD_GONE =
  'Stage 2 of the 2024 syllabus places its science content on the solar system and the effects ' +
  'of energy, so there is no Stage 2 living-world outcome to claim. What this programme ' +
  'evidences at Stage 2 is scientific questioning and working with observations, which is what ' +
  'is listed here. For a living-world focus, Stage 1 and Stage 3 both carry it.';
