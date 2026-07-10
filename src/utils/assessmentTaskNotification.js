import { NSW_OUTCOMES, STAGE_EXPECTATIONS } from './teacherInfoSheet.js';

const BRAND = {
  forest:     '#071E14',
  deep:       '#0A2F1F',
  mid:        '#1A5238',
  eucalyptus: '#2E7D55',
  sage:       '#4A7C61',
  mist:       '#A8C4B2',
  foam:       '#E8F2EC',
  parchment:  '#FAF8F4',
  ecru:       '#ECE7DD',
  ink:        '#1A1A17',
  charcoal:   '#3D3D38',
  slate:      '#6B6B62',
};

const SUBJECT_META = {
  science: { label: 'Science',     course: 'Science & Technology / Science', accent: '#1A5238', accentLight: '#E8F5EE', accentBorder: '#A8C4B2' },
  maths:   { label: 'Mathematics', course: 'Mathematics',                    accent: '#0369A1', accentLight: '#E0F0FB', accentBorder: '#BFDBFE' },
  english: { label: 'English',     course: 'English',                        accent: '#7C3AED', accentLight: '#F0EBFD', accentBorder: '#DDD6FE' },
  pdhpe:   { label: 'PDHPE',       course: 'PDHPE',                          accent: '#BE185D', accentLight: '#FDE8F3', accentBorder: '#FBCFE8' },
};

const STAGE_LABELS = {
  2: 'Stage 2 (Years 3–4)',
  3: 'Stage 3 (Years 5–6)',
  4: 'Stage 4 (Years 7–8)',
  5: 'Stage 5 (Years 9–10)',
};

// ── Task descriptions ─────────────────────────────────────────────────────────

const IN_EXCURSION_DESC = {
  science: {
    2: 'During your visit to Taronga Zoo, you will choose one animal and write a fieldwork observation. Observe the animal for at least two minutes, then write about: what the animal looks like, what it is doing, and what it needs to survive. Use the Taronga Tracka app to record your response.',
    3: 'During your visit to Taronga Zoo, you will complete a fieldwork observation at one animal exhibit. Observe the animal, then write about: what specific behaviours you noticed, how those behaviours help the animal survive, and what features (adaptations) you can see that suit it to its environment. Use the Taronga Tracka app to record your response.',
    4: 'During your visit to Taronga Zoo, you will complete a scientific field observation at one animal exhibit. Observe the animal carefully, then write a response that: describes specific behaviours using scientific vocabulary, links what you observed to a biological concept (adaptation, habitat, diet, or survival), and explains why this matters for the animal\'s survival. Use the Taronga Tracka app to record and submit your response.',
    5: 'During your visit to Taronga Zoo, you will conduct a scientific field observation at one animal exhibit. Observe the animal, then write a response that: applies scientific reasoning to explain what you observed, uses correct biological terminology, and connects your observation to broader ecological or evolutionary concepts. Use the Taronga Tracka app to record and submit your response.',
  },
  maths: {
    2: 'During your visit to Taronga Zoo, you will complete a mathematics task at one animal exhibit. Use what you observe and the data provided in the app to solve a problem using counting, addition, or multiplication. Record your working and answer clearly in the Taronga Tracka app.',
    3: 'During your visit to Taronga Zoo, you will complete a mathematics investigation at one animal exhibit. Using the data in the app, apply your knowledge of fractions, decimals, percentages or measurement to solve a contextual problem. Show all working and explain your answer in the Taronga Tracka app.',
    4: 'During your visit to Taronga Zoo, you will complete a contextual mathematics task at one animal exhibit. Using data from your observation and the app, apply ratio, rate, or statistical thinking to solve a problem in context. Show all working, use mathematical vocabulary, and justify your method.',
    5: 'During your visit to Taronga Zoo, you will complete a mathematical investigation at one animal exhibit. Apply algebraic reasoning, statistical analysis, or proportional thinking to solve a complex contextual problem. Show full working, use precise mathematical language, and communicate your conclusion clearly.',
  },
  english: {
    2: 'During your visit to Taronga Zoo, you will observe an animal and write a creative or descriptive response in the Taronga Tracka app. Describe what you see using descriptive words and at least one comparison (like a simile). Use the sentence starters provided in the app to help you begin.',
    3: 'During your visit to Taronga Zoo, you will observe an animal and compose a short written response. Use at least one language technique (such as a simile, metaphor or emotive word), and explain what that technique helps the reader feel or imagine. Use the sentence starters in the app to help you structure your response.',
    4: 'During your visit to Taronga Zoo, you will observe an animal and compose a written response in your required text type (descriptive, imaginative or persuasive). Your response must: use and name at least one language technique deliberately, explain the effect that technique creates for the reader, and control language features appropriate to your text type. Submit via the Taronga Tracka app.',
    5: 'During your visit to Taronga Zoo, you will observe an animal and craft a written response demonstrating sophisticated language control. Your response must: select and deploy language techniques with clear purpose, analyse how your language choices position the reader, and sustain a deliberate voice appropriate to your chosen text type. Submit via the Taronga Tracka app.',
  },
  pdhpe: {
    2: 'During your visit to Taronga Zoo, you will observe an animal and write about how it connects to your health and body. Write about: what the animal is doing, how this reminds you of something you do to stay healthy, and one thing you could learn from this animal about health or movement.',
    3: 'During your visit to Taronga Zoo, you will observe an animal and write a response connecting your observation to a health or wellbeing concept. Describe what you observed, name the PDHPE concept it relates to, and explain how this connects to your own health, movement or wellbeing.',
    4: 'During your visit to Taronga Zoo, you will observe an animal and write a PDHPE response that: describes what you observed using PDHPE vocabulary, connects the animal\'s behaviour or physical characteristics to a human body system or health concept, and explains the implications for your own health or physical performance.',
    5: 'During your visit to Taronga Zoo, you will observe an animal and produce a PDHPE field analysis. Your response must: apply a PDHPE framework or health model to what you observed, evaluate the implications for human health, wellbeing or physical performance, and connect your analysis to your own or your community\'s lifestyle.',
  },
};

// ── Assessment criteria ───────────────────────────────────────────────────────

const CRITERIA = {
  science: {
    2: ['Describe what the animal looks like and what it is doing', 'Write about what the animal needs to survive', 'Communicate your observation in clear sentences'],
    3: ['Describe specific behaviours you observed and explain why the animal might behave that way', 'Identify at least one adaptation that helps the animal survive in its environment', 'Communicate your observation using science words and clear sentences'],
    4: ['Observe and describe specific behaviours using scientific vocabulary', 'Connect your observation to a biological concept and explain the link to survival or function', 'Communicate your fieldwork findings in structured, scientific language'],
    5: ['Apply scientific reasoning to explain observed behaviours using biological terminology', 'Connect your observation to broader ecological or evolutionary concepts with supporting evidence', 'Communicate scientific ideas precisely and coherently using appropriate terminology and structure'],
  },
  maths: {
    2: ['Write a number sentence to show your working', 'Calculate the correct answer using the information provided', 'Explain what your answer means in words'],
    3: ['Show all working clearly using mathematical notation', 'Apply the correct strategy (fraction, percentage, or measurement) to solve the problem', 'Explain your answer using mathematical vocabulary'],
    4: ['Select and justify an appropriate mathematical method (ratio, rate, or statistical thinking)', 'Show full working with correct mathematical notation and units', 'Interpret and communicate your result in context using mathematical language'],
    5: ['Select and apply an appropriate mathematical technique with justification', 'Show full and precise working, including all steps and correct notation', 'Critically evaluate and communicate your conclusion using statistical or algebraic reasoning'],
  },
  english: {
    2: ['Use at least one describing word or comparison in your writing', 'Write in clear sentences about what you saw', 'Use the sentence starters to help you begin your response'],
    3: ['Use and identify at least one language technique (simile, metaphor or emotive word) in your response', 'Write a structured response that describes what you observed', 'Explain what your language choice helps the reader feel or imagine'],
    4: ['Use and name at least one language technique deliberately in your response', 'Compose a controlled response in the required text type with language appropriate to audience and purpose', 'Analyse the effect your language choices create for the reader'],
    5: ['Select and deploy language techniques with clear purpose and conscious effect', 'Craft a sustained and cohesive response appropriate to your text type, audience and purpose', 'Analyse how your language choices position the reader and shape meaning'],
  },
  pdhpe: {
    2: ['Write about what the animal is doing and how it connects to your health', 'Name one thing you do to stay healthy that is similar to the animal', 'Write in clear sentences'],
    3: ['Describe what you observed and name the health or wellbeing concept it relates to', 'Explain how the animal\'s behaviour connects to human health or your own life', 'Use PDHPE vocabulary in your response'],
    4: ['Describe what you observed using PDHPE vocabulary and connect it to a human body system or health concept', 'Explain the implications for your own health, wellbeing or physical performance', 'Communicate your analysis using health and physical education terminology'],
    5: ['Apply a PDHPE framework or health model to your observation with evidence', 'Evaluate the implications for human health, wellbeing or physical performance with justified reasoning', 'Communicate a sophisticated analysis using precise PDHPE language and health literacy'],
  },
};

// ── NESA verbs ────────────────────────────────────────────────────────────────

const NESA_VERBS = {
  science: [
    ['Describe',  'Give characteristics and features'],
    ['Explain',   'Relate cause and effect; make relationships between things clear'],
    ['Analyse',   'Identify components and the relationships between them; draw out and relate implications'],
    ['Evaluate',  'Make a judgement based on criteria; determine the value of evidence or reasoning'],
  ],
  maths: [
    ['Calculate', 'Determine a numerical answer using mathematical procedures; show all working'],
    ['Show',      'Provide mathematical working, steps or evidence to support an answer'],
    ['Explain',   'Make a method or line of reasoning clear with justification'],
    ['Justify',   'Support an argument, conclusion or answer with appropriate mathematical evidence'],
  ],
  english: [
    ['Describe',  'Give characteristics and features using language; represent in words'],
    ['Compose',   'Plan, create and revise a text for a given purpose and audience'],
    ['Analyse',   'Identify language features and the relationships between them; examine effect'],
    ['Evaluate',  'Make a judgement about the effectiveness of language choices; assess impact on audience'],
  ],
  pdhpe: [
    ['Describe',  'Give characteristics and features of a health concept, behaviour or body system'],
    ['Explain',   'Relate cause and effect; make relationships between health concepts evident'],
    ['Analyse',   'Identify components and the relationship between them; examine implications for health'],
    ['Evaluate',  'Make a judgement based on health criteria; assess the implications for wellbeing or performance'],
  ],
};

// ── Marking descriptors ───────────────────────────────────────────────────────

const MARKING_IN_EXCURSION = {
  science: [
    { grade: 'A', range: '13–15', desc: 'Perceptively observes and describes specific animal behaviours using precise scientific vocabulary. Makes an insightful connection to a biological concept and explains the significance for the animal\'s survival with supporting detail and scientific reasoning.' },
    { grade: 'B', range: '10–12', desc: 'Effectively describes animal behaviours with relevant scientific detail. Makes a clear connection to a biological concept and explains the link to survival.' },
    { grade: 'C', range: '7–9',   desc: 'Describes observable behaviours with some scientific detail. Makes a general connection to a biological concept, though the explanation may be incomplete.' },
    { grade: 'D', range: '4–6',   desc: 'Describes aspects of the animal\'s appearance or behaviour with limited scientific detail. Attempts a concept connection but the link is unclear or missing.' },
    { grade: 'E', range: '1–3',   desc: 'Makes minimal reference to observation or biological ideas. Response is very limited in content and language.' },
    { grade: 'N', range: '0',     desc: 'Non-attempt or non-serious attempt.' },
  ],
  maths: [
    { grade: 'A', range: '13–15', desc: 'Selects a correct and efficient mathematical strategy. Shows full working with correct notation and units. Interprets and communicates the result clearly and precisely in context.' },
    { grade: 'B', range: '10–12', desc: 'Selects an appropriate strategy and shows working with only minor errors. Communicates the result clearly with some mathematical vocabulary.' },
    { grade: 'C', range: '7–9',   desc: 'Applies a suitable strategy with some working shown. Obtains a partially correct result. Communication of method is present but may be incomplete.' },
    { grade: 'D', range: '4–6',   desc: 'Attempts a mathematical strategy with limited or incorrect working. The result may be incorrect. Communication of reasoning is unclear.' },
    { grade: 'E', range: '1–3',   desc: 'Attempts a response with minimal mathematical content. Working is absent or does not lead to a meaningful result.' },
    { grade: 'N', range: '0',     desc: 'Non-attempt or non-serious attempt.' },
  ],
  english: [
    { grade: 'A', range: '13–15', desc: 'Crafts a sustained and controlled response using deliberate language techniques with clear purpose. Demonstrates sophisticated understanding of audience, purpose and context. Analyses or explains the effect of language choices with precision.' },
    { grade: 'B', range: '10–12', desc: 'Composes an effective response using at least one language technique with clear purpose. Demonstrates understanding of audience and purpose. Explains the effect of language with some precision.' },
    { grade: 'C', range: '7–9',   desc: 'Writes a response that uses some descriptive language. Shows general awareness of audience and purpose. Identifies or uses a technique but the explanation of effect may be incomplete.' },
    { grade: 'D', range: '4–6',   desc: 'Writes a response with limited language technique use. Shows basic awareness of audience and purpose. Description is present but lacks development.' },
    { grade: 'E', range: '1–3',   desc: 'Attempts a response with minimal language control. Very limited engagement with the task requirements.' },
    { grade: 'N', range: '0',     desc: 'Non-attempt or non-serious attempt.' },
  ],
  pdhpe: [
    { grade: 'A', range: '13–15', desc: 'Makes an insightful and well-supported connection between the animal\'s behaviour and a PDHPE concept. Uses precise health and physical education vocabulary. Clearly evaluates the implications for human health, wellbeing or performance.' },
    { grade: 'B', range: '10–12', desc: 'Makes a clear connection between the animal\'s behaviour and a PDHPE concept with relevant supporting detail. Uses appropriate PDHPE vocabulary. Explains implications for human health or performance.' },
    { grade: 'C', range: '7–9',   desc: 'Makes a general connection between the animal and a health or wellbeing concept with some relevant detail. Uses some PDHPE vocabulary. Explanation of implications is present but may be incomplete.' },
    { grade: 'D', range: '4–6',   desc: 'Describes the animal\'s behaviour and attempts a health connection with limited detail. Limited use of PDHPE vocabulary. The link to human health is unclear.' },
    { grade: 'E', range: '1–3',   desc: 'Makes minimal reference to the animal or a health concept. Response is very limited.' },
    { grade: 'N', range: '0',     desc: 'Non-attempt or non-serious attempt.' },
  ],
};

const MARKING_POST_VISIT = {
  science: [
    { grade: 'A', range: '21–25', desc: 'Produces a perceptive and well-structured scientific response. Demonstrates deep understanding of biological concepts with precise vocabulary, insightful connections between observation and theory, and sophisticated evaluation of evidence.' },
    { grade: 'B', range: '16–20', desc: 'Produces an effective scientific response that demonstrates clear understanding. Biological concepts are accurately applied with relevant evidence and clear connections to the animal observed.' },
    { grade: 'C', range: '11–15', desc: 'Produces a sound response that demonstrates general understanding of biological concepts. Makes connections between observation and science, though depth and precision may vary.' },
    { grade: 'D', range: '6–10',  desc: 'Produces a basic response that describes biological features with limited explanation or connection to concepts. Understanding is evident but inconsistent.' },
    { grade: 'E', range: '1–5',   desc: 'Produces a minimal response with limited engagement with biological concepts or evidence from the excursion.' },
    { grade: 'N', range: '0',     desc: 'Non-attempt or non-serious attempt.' },
  ],
  maths: [
    { grade: 'A', range: '21–25', desc: 'Applies sophisticated mathematical thinking to solve a complex contextual problem. Shows complete, efficient working with precise notation. Critically evaluates the result and communicates conclusions with mathematical fluency.' },
    { grade: 'B', range: '16–20', desc: 'Applies appropriate mathematical strategies to solve the problem with mostly correct working. Communicates the method and result clearly with mathematical vocabulary.' },
    { grade: 'C', range: '11–15', desc: 'Applies a relevant mathematical strategy with partially correct working. Communicates the method and result, though some steps may be missing or contain minor errors.' },
    { grade: 'D', range: '6–10',  desc: 'Attempts relevant mathematical strategies with limited working shown. The approach is partially correct but errors affect the result or communication is unclear.' },
    { grade: 'E', range: '1–5',   desc: 'Attempts a response with minimal mathematical content. Working and reasoning are largely absent or incorrect.' },
    { grade: 'N', range: '0',     desc: 'Non-attempt or non-serious attempt.' },
  ],
  english: [
    { grade: 'A', range: '21–25', desc: 'Crafts a sophisticated, sustained response demonstrating precise control of language and form. Deploys multiple techniques with clear purpose, analyses their effect on the reader with perceptive insight, and sustains an authoritative and deliberate voice.' },
    { grade: 'B', range: '16–20', desc: 'Composes an effective, controlled response using language techniques with clear purpose. Demonstrates strong understanding of audience, purpose and context. Analyses the effect of language choices with clarity.' },
    { grade: 'C', range: '11–15', desc: 'Composes a sound response using language techniques with some purpose and control. Demonstrates general understanding of audience and purpose. Attempts to analyse the effect of language choices.' },
    { grade: 'D', range: '6–10',  desc: 'Composes a basic response with some language technique use. Demonstrates limited control of language. Awareness of audience and purpose is present but inconsistent.' },
    { grade: 'E', range: '1–5',   desc: 'Attempts a response with minimal language technique use or control. Very limited engagement with the task requirements.' },
    { grade: 'N', range: '0',     desc: 'Non-attempt or non-serious attempt.' },
  ],
  pdhpe: [
    { grade: 'A', range: '21–25', desc: 'Produces a perceptive, well-supported PDHPE analysis. Applies relevant frameworks or health models with precision, evaluates implications for health and wellbeing with justified reasoning, and demonstrates sophisticated use of health literacy.' },
    { grade: 'B', range: '16–20', desc: 'Produces an effective PDHPE response that applies relevant concepts with clear evidence. Explains implications for health and wellbeing with appropriate PDHPE vocabulary and reasoning.' },
    { grade: 'C', range: '11–15', desc: 'Produces a sound PDHPE response that demonstrates general understanding. Connects PDHPE concepts to the context with some explanation, though depth and precision may vary.' },
    { grade: 'D', range: '6–10',  desc: 'Produces a basic PDHPE response that identifies relevant health concepts with limited explanation. Understanding is evident but the connection to the context or evidence base is incomplete.' },
    { grade: 'E', range: '1–5',   desc: 'Produces a minimal response with limited engagement with PDHPE concepts or evidence.' },
    { grade: 'N', range: '0',     desc: 'Non-attempt or non-serious attempt.' },
  ],
};

const GRADE_COLORS = {
  A: '#1A5238',
  B: '#0369A1',
  C: '#D97706',
  D: '#BE185D',
  E: '#6B6B62',
  N: '#1A1A17',
};

// ── Main export ───────────────────────────────────────────────────────────────

export function openAssessmentTaskNotification(subject, stage, taskType, taskData) {
  const meta       = SUBJECT_META[subject] || SUBJECT_META.science;
  const stageNum   = parseInt(stage, 10);
  const stageLabel = STAGE_LABELS[stageNum] || `Stage ${stageNum}`;
  const isPostVisit = taskType === 'post-visit';
  const origin     = window.location.origin;
  const today      = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  const { accent, accentLight, accentBorder } = meta;

  // Content
  const taskTypeLabel    = isPostVisit ? 'Post-Visit Assessment Task' : 'In-Excursion Assessment Task';
  const submissionMethod = isPostVisit ? 'Written submission to teacher' : 'Via Taronga Tracka app (in-excursion)';
  const taskTitle        = isPostVisit ? (taskData?.title || 'Post-Visit Task') : 'In-Excursion Observation';
  const taskFormat       = isPostVisit ? (taskData?.format || 'Written') : 'In-app written observation';
  const description      = isPostVisit
    ? (taskData?.desc || '')
    : (IN_EXCURSION_DESC[subject]?.[stageNum] || IN_EXCURSION_DESC[subject]?.[4] || '');

  const criteria   = CRITERIA[subject]?.[stageNum] || CRITERIA[subject]?.[4] || [];
  const nesaVerbs  = NESA_VERBS[subject] || NESA_VERBS.science;
  const outcomes   = (NSW_OUTCOMES[subject]?.[stageNum] || []).slice(0, 3);
  const markTotal  = isPostVisit ? 25 : 15;
  const markingRows = isPostVisit
    ? (MARKING_POST_VISIT[subject] || MARKING_POST_VISIT.science)
    : (MARKING_IN_EXCURSION[subject] || MARKING_IN_EXCURSION.science);

  // Stage expectations for resources section
  const stageExp = STAGE_EXPECTATIONS[subject]?.[stageNum] || STAGE_EXPECTATIONS[subject]?.[4];

  const resources = isPostVisit ? [
    'Your written observation recorded in the Taronga Tracka app (Class Insights)',
    'Class notes and any handouts provided during the excursion',
    `NSW ${meta.label} syllabus`,
    'Your textbook and classroom resources',
    'Teacher-approved websites and reference materials',
  ] : [
    'Taronga Tracka app (provided on excursion devices)',
    'Animal exhibit signage and information panels',
    'Your excursion workbook (if provided by your teacher)',
    `Sentence starters: ${(stageExp?.starters || []).join(' / ')}`,
  ];

  const feedbackInfo = [
    'Your teacher will return your marked work with written comments.',
    'Feedback will address each of the three assessment criteria.',
    'You will have an opportunity to discuss your feedback with your teacher.',
  ];

  // Build HTML sections
  const criteriaHtml = criteria.map(c => `<li class="criteria-item"><span class="criteria-dot"></span><span>${c}</span></li>`).join('');

  const nesaHtml = nesaVerbs.map(([verb, def]) => `
    <div class="nesa-card">
      <div class="nesa-verb">${verb}</div>
      <div class="nesa-def">${def}</div>
    </div>`).join('');

  const resourcesHtml = resources.map(r => `<li class="resource-item"><span class="resource-dot"></span><span>${r}</span></li>`).join('');

  const feedbackHtml = feedbackInfo.map((f, i) => `
    <div class="feedback-row">
      <span class="feedback-num">${String(i + 1).padStart(2, '0')}</span>
      <span>${f}</span>
    </div>`).join('');

  const outcomesHtml = outcomes.length
    ? outcomes.map(o => `
    <div class="outcome-row">
      <span class="outcome-code">${o.code}</span>
      <span class="outcome-desc">${o.desc}</span>
    </div>`).join('')
    : '<p style="font-size:9pt;color:#888">No outcomes on file for this selection.</p>';

  const markingHtml = markingRows.map(row => {
    const gc = GRADE_COLORS[row.grade] || BRAND.slate;
    return `
    <tr class="mark-row">
      <td class="mark-grade-cell"><span class="grade-badge" style="background:${gc}">${row.grade}</span></td>
      <td class="mark-desc">${row.desc}</td>
      <td class="mark-range">${row.range}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Assessment Task Notification — ${meta.label} ${stageLabel}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
@font-face {
  font-family: 'TarongaHeadline';
  src: url('${origin}/images/TarongaHeadline-Regular.ttf') format('truetype');
  font-weight: normal; font-style: normal;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@page { margin: 15mm; }

body {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 10pt;
  line-height: 1.65;
  color: ${BRAND.ink};
  background: #EDEAE3;
  -webkit-font-smoothing: antialiased;
}

.page {
  max-width: 800px;
  margin: 32px auto;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(7,30,20,0.16);
}

/* ── PRINT BUTTON ── */
.print-fab {
  position: fixed;
  top: 20px; right: 20px;
  background: ${accent};
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 40px;
  font-family: 'DM Sans', sans-serif;
  font-size: 8.5pt;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(0,0,0,0.18);
  z-index: 999;
}
.print-fab:hover { opacity: 0.88; }

/* ── HEADER ── */
.hdr {
  background: ${BRAND.forest};
  padding: 36px 48px 28px;
  position: relative;
  overflow: hidden;
}
.hdr-glow {
  position: absolute;
  top: -80px; right: -80px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(46,125,85,0.35) 0%, transparent 70%);
  pointer-events: none;
}
.hdr-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  position: relative;
}
.hdr-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.hdr-logo { height: 48px; width: auto; display: block; flex-shrink: 0; }
.hdr-brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hdr-brand-name {
  font-family: 'TarongaHeadline', 'DM Sans', sans-serif;
  font-size: 15pt;
  font-weight: normal;
  color: #fff;
  letter-spacing: 0.06em;
  line-height: 1.1;
}
.hdr-brand-sub {
  font-size: 8pt;
  color: ${BRAND.mist};
  letter-spacing: 0.1em;
  margin-top: 3px;
  text-transform: uppercase;
}
.hdr-right {
  text-align: right;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.hdr-badges {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.badge-chip {
  display: inline-block;
  background: ${accent};
  color: #fff;
  font-size: 7.5pt;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 5px 16px;
  border-radius: 40px;
}
.badge-chip-outline {
  display: inline-block;
  background: transparent;
  color: ${BRAND.mist};
  border: 1px solid rgba(168,196,178,0.4);
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 5px 16px;
  border-radius: 40px;
}
.hdr-student-field {
  font-size: 8.5pt;
  color: ${BRAND.mist};
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(168,196,178,0.35);
  padding-bottom: 3px;
  min-width: 220px;
}

/* ── METADATA STRIP ── */
.meta-strip {
  background: ${BRAND.parchment};
  border-bottom: 1px solid ${BRAND.ecru};
  padding: 18px 48px;
}
.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 24px;
}
.meta-field {}
.meta-label {
  font-size: 6.5pt;
  font-weight: 800;
  color: ${accent};
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-bottom: 3px;
}
.meta-value {
  font-size: 9pt;
  font-weight: 600;
  color: ${BRAND.forest};
  line-height: 1.3;
}

/* ── BODY ── */
.body { padding: 44px 48px 52px; }

/* ── SECTION ── */
.section { margin-bottom: 38px; }
.section:last-child { margin-bottom: 0; }

.sec-kicker {
  font-size: 6.5pt;
  font-weight: 800;
  color: ${accent};
  text-transform: uppercase;
  letter-spacing: 0.24em;
  margin-bottom: 5px;
}
.sec-title {
  font-family: 'TarongaHeadline', 'DM Sans', sans-serif;
  font-size: 14pt;
  font-weight: normal;
  color: ${BRAND.forest};
  letter-spacing: 0.02em;
  line-height: 1.2;
}
.sec-rule {
  width: 40px;
  height: 3px;
  background: ${accent};
  border-radius: 2px;
  margin: 10px 0 18px;
}

/* ── TASK DESCRIPTION ── */
.task-desc {
  font-size: 9.5pt;
  color: ${BRAND.charcoal};
  line-height: 1.75;
  background: ${accentLight};
  border-left: 3px solid ${accent};
  border-radius: 0 10px 10px 0;
  padding: 16px 20px;
}

/* ── CRITERIA ── */
.criteria-lead {
  font-size: 9pt;
  font-weight: 600;
  color: ${BRAND.forest};
  margin-bottom: 12px;
}
.criteria-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.criteria-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 9pt;
  color: ${BRAND.charcoal};
  line-height: 1.6;
}
.criteria-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${accent};
  margin-top: 5px;
}

/* ── NESA VERBS ── */
.nesa-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.nesa-card {
  background: ${BRAND.parchment};
  border: 1px solid ${BRAND.ecru};
  border-radius: 10px;
  padding: 13px 16px;
}
.nesa-verb {
  font-size: 9pt;
  font-weight: 800;
  color: ${accent};
  margin-bottom: 4px;
  letter-spacing: 0.04em;
}
.nesa-def {
  font-size: 8.5pt;
  color: ${BRAND.charcoal};
  line-height: 1.55;
}

/* ── RESOURCES ── */
.resource-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.resource-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 9pt;
  color: ${BRAND.charcoal};
  line-height: 1.6;
}
.resource-dot {
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${BRAND.mist};
  margin-top: 7px;
}

/* ── FEEDBACK ── */
.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.feedback-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 9pt;
  color: ${BRAND.charcoal};
  line-height: 1.6;
}
.feedback-num {
  font-family: 'TarongaHeadline', 'DM Sans', sans-serif;
  font-size: 11pt;
  color: ${accent};
  flex-shrink: 0;
  line-height: 1.3;
  min-width: 28px;
}

/* ── OUTCOMES ── */
.outcomes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.outcome-row {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}
.outcome-code {
  flex-shrink: 0;
  background: ${accentLight};
  color: ${accent};
  border: 1px solid ${accentBorder};
  font-size: 7.5pt;
  font-weight: 800;
  padding: 3px 11px;
  border-radius: 6px;
  letter-spacing: 0.04em;
  margin-top: 2px;
  font-variant-numeric: tabular-nums;
}
.outcome-desc {
  font-size: 9pt;
  color: ${BRAND.charcoal};
  line-height: 1.6;
}

/* ── DECLARATION ── */
.declaration-box {
  border: 2px dashed ${accentBorder};
  border-radius: 12px;
  padding: 20px 24px;
}
.declaration-hd {
  font-size: 8.5pt;
  font-weight: 800;
  color: ${BRAND.forest};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.declaration-checkbox {
  width: 14px;
  height: 14px;
  border: 2px solid ${accent};
  border-radius: 3px;
  display: inline-block;
  flex-shrink: 0;
}
.declaration-text {
  font-size: 8.5pt;
  font-style: italic;
  color: ${BRAND.charcoal};
  line-height: 1.65;
  margin-bottom: 18px;
}
.sig-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 16px;
}
.sig-field {
  border-bottom: 1px solid ${BRAND.ecru};
  padding-bottom: 4px;
}
.sig-label {
  font-size: 7pt;
  font-weight: 700;
  color: ${BRAND.slate};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-top: 5px;
}

/* ── STUDENT FEEDBACK TABLE ── */
.sfb-lead {
  font-size: 9pt;
  color: ${BRAND.charcoal};
  margin-bottom: 12px;
}
.sfb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8.5pt;
}
.sfb-table th {
  background: ${accent};
  color: #fff;
  font-weight: 700;
  font-size: 7.5pt;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 14px;
  text-align: left;
}
.sfb-table th:last-child,
.sfb-table th:nth-last-child(2) {
  text-align: center;
  width: 80px;
}
.sfb-table td {
  padding: 10px 14px;
  color: ${BRAND.charcoal};
  border-bottom: 1px solid ${BRAND.ecru};
  vertical-align: middle;
}
.sfb-table tr:nth-child(even) td {
  background: ${BRAND.parchment};
}
.sfb-table td.sfb-check {
  text-align: center;
  width: 80px;
}
.sfb-checkbox {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1.5px solid ${accentBorder};
  border-radius: 3px;
}

/* ── MARKING TABLE ── */
.mark-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8.5pt;
  margin-top: 4px;
}
.mark-table thead th {
  background: ${BRAND.forest};
  color: #fff;
  font-weight: 700;
  font-size: 7.5pt;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 10px 14px;
  text-align: left;
}
.mark-table thead th:first-child { text-align: center; width: 60px; }
.mark-table thead th:last-child  { text-align: center; width: 80px; }
.mark-row td {
  padding: 10px 14px;
  border-bottom: 1px solid ${BRAND.ecru};
  vertical-align: top;
}
.mark-row:nth-child(even) td { background: ${BRAND.parchment}; }
.mark-row:last-child td { border-bottom: none; }
.mark-grade-cell { text-align: center; }
.grade-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  font-size: 10pt;
  font-weight: 800;
  letter-spacing: 0;
}
.mark-desc {
  color: ${BRAND.charcoal};
  line-height: 1.6;
}
.mark-range {
  text-align: center;
  font-weight: 700;
  color: ${BRAND.forest};
  white-space: nowrap;
}
.mark-final-row td {
  background: ${accentLight};
  border-top: 2px solid ${accent};
  padding: 12px 14px;
  font-weight: 700;
  color: ${BRAND.forest};
}
.mark-final-row td:first-child { text-align: left; }

/* ── FOOTER ── */
.ftr {
  background: ${BRAND.forest};
  padding: 20px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ftr-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.ftr-logo { height: 30px; width: auto; opacity: 0.9; }
.ftr-divider { width: 1px; height: 20px; background: rgba(168,196,178,0.3); }
.ftr-name {
  font-family: 'TarongaHeadline', 'DM Sans', sans-serif;
  font-size: 10pt;
  font-weight: normal;
  color: #fff;
  letter-spacing: 0.05em;
}
.ftr-right {
  text-align: right;
  font-size: 7.5pt;
  color: ${BRAND.sage};
  line-height: 1.6;
}

/* ── PRINT ── */
@media print {
  body { background: #fff; }
  .page { max-width: none; margin: 0; border-radius: 0; box-shadow: none; }
  .print-fab { display: none !important; }
  .hdr, .ftr, .badge-chip, .badge-chip-outline,
  .hdr-glow, .sec-rule, .task-desc, .outcome-code,
  .criteria-dot, .resource-dot, .grade-badge,
  .nesa-card, .declaration-box {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .section { page-break-inside: avoid; }
  .mark-row { page-break-inside: avoid; }
  .nesa-card { page-break-inside: avoid; }
}
</style>
</head>
<body>

<button class="print-fab" onclick="window.print()">Print / Save PDF</button>

<div class="page">

  <!-- Header -->
  <div class="hdr">
    <div class="hdr-glow"></div>
    <div class="hdr-inner">
      <div class="hdr-left">
        <img src="${origin}/images/logo.png" alt="Taronga" class="hdr-logo"
             onerror="this.style.display='none'">
        <div class="hdr-brand">
          <div class="hdr-brand-name">TARONGA TRACKA</div>
          <div class="hdr-brand-sub">Assessment Task Notification</div>
        </div>
      </div>
      <div class="hdr-right">
        <div class="hdr-badges">
          <span class="badge-chip">${meta.label}</span>
          <span class="badge-chip-outline">${stageLabel}</span>
        </div>
        <div class="hdr-student-field">Student name: ___________________________</div>
      </div>
    </div>
  </div>

  <!-- Metadata strip -->
  <div class="meta-strip">
    <div class="meta-grid">
      <div class="meta-field">
        <div class="meta-label">Course</div>
        <div class="meta-value">${meta.course}</div>
      </div>
      <div class="meta-field">
        <div class="meta-label">Stage &amp; Year</div>
        <div class="meta-value">${stageLabel}</div>
      </div>
      <div class="meta-field">
        <div class="meta-label">Task Type</div>
        <div class="meta-value">${taskTypeLabel}</div>
      </div>
      <div class="meta-field">
        <div class="meta-label">Task Title</div>
        <div class="meta-value">${taskTitle}</div>
      </div>
      <div class="meta-field">
        <div class="meta-label">Due Date</div>
        <div class="meta-value">___________________________</div>
      </div>
      <div class="meta-field">
        <div class="meta-label">Submission</div>
        <div class="meta-value">${submissionMethod}</div>
      </div>
      ${isPostVisit ? `
      <div class="meta-field">
        <div class="meta-label">Format</div>
        <div class="meta-value">${taskFormat}</div>
      </div>` : ''}
      <div class="meta-field">
        <div class="meta-label">Worth</div>
        <div class="meta-value">${markTotal} marks</div>
      </div>
    </div>
  </div>

  <div class="body">

    <!-- Task Description -->
    <div class="section">
      <div class="sec-kicker">Task</div>
      <div class="sec-title">${taskTitle}</div>
      <div class="sec-rule"></div>
      <div class="task-desc">${description}</div>
    </div>

    <!-- Assessment Criteria -->
    <div class="section">
      <div class="sec-kicker">Assessment Criteria</div>
      <div class="sec-title">What You Will Be Assessed On</div>
      <div class="sec-rule"></div>
      <div class="criteria-lead">You will be assessed on how well you:</div>
      <ul class="criteria-list">
        ${criteriaHtml}
      </ul>
    </div>

    <!-- NESA Verbs -->
    <div class="section">
      <div class="sec-kicker">NESA Verbs</div>
      <div class="sec-title">Key Words &amp; What They Mean</div>
      <div class="sec-rule"></div>
      <div class="nesa-grid">
        ${nesaHtml}
      </div>
    </div>

    <!-- Resources -->
    <div class="section">
      <div class="sec-kicker">Resources</div>
      <div class="sec-title">What You Can Use</div>
      <div class="sec-rule"></div>
      <ul class="resource-list">
        ${resourcesHtml}
      </ul>
    </div>

    <!-- Feedback -->
    <div class="section">
      <div class="sec-kicker">Feedback</div>
      <div class="sec-title">How You Will Receive Feedback</div>
      <div class="sec-rule"></div>
      <div class="feedback-list">
        ${feedbackHtml}
      </div>
    </div>

    <!-- NSW Outcomes -->
    <div class="section">
      <div class="sec-kicker">Outcomes Assessed</div>
      <div class="sec-title">NSW Syllabus Outcomes</div>
      <div class="sec-rule"></div>
      <div class="outcomes-list">
        ${outcomesHtml}
      </div>
    </div>

    <!-- All My Own Work Declaration -->
    <div class="section">
      <div class="sec-kicker">Declaration</div>
      <div class="sec-title">All My Own Work</div>
      <div class="sec-rule"></div>
      <div class="declaration-box">
        <div class="declaration-hd">
          <span class="declaration-checkbox"></span>
          Student Declaration
        </div>
        <div class="declaration-text">
          I declare that this work is entirely my own and has not been copied from any other student or source without acknowledgement. I understand that submitting work that is not my own is a serious breach of the school's academic integrity policy.
        </div>
        <div class="sig-row">
          <div>
            <div class="sig-field">&nbsp;</div>
            <div class="sig-label">Student Signature</div>
          </div>
          <div>
            <div class="sig-field">&nbsp;</div>
            <div class="sig-label">Date</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Student Feedback on Task -->
    <div class="section">
      <div class="sec-kicker">Student Feedback</div>
      <div class="sec-title">Your Thoughts on This Task</div>
      <div class="sec-rule"></div>
      <div class="sfb-lead">Please provide feedback on this assessment task by ticking the appropriate column.</div>
      <table class="sfb-table">
        <thead>
          <tr>
            <th>Statement</th>
            <th>Agree</th>
            <th>Disagree</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>I understood what was required of me for this task.</td>
            <td class="sfb-check"><span class="sfb-checkbox"></span></td>
            <td class="sfb-check"><span class="sfb-checkbox"></span></td>
          </tr>
          <tr>
            <td>I had enough time to complete this task to the best of my ability.</td>
            <td class="sfb-check"><span class="sfb-checkbox"></span></td>
            <td class="sfb-check"><span class="sfb-checkbox"></span></td>
          </tr>
          <tr>
            <td>I received appropriate support and resources to complete this task.</td>
            <td class="sfb-check"><span class="sfb-checkbox"></span></td>
            <td class="sfb-check"><span class="sfb-checkbox"></span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Marking Criteria -->
    <div class="section">
      <div class="sec-kicker">Marking Criteria</div>
      <div class="sec-title">Grade Descriptors — ${markTotal} Marks Total</div>
      <div class="sec-rule"></div>
      <table class="mark-table">
        <thead>
          <tr>
            <th>Grade</th>
            <th>Descriptor</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          ${markingHtml}
          <tr class="mark-final-row">
            <td colspan="2">Final mark</td>
            <td style="text-align:center">_____ / ${markTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div><!-- /body -->

  <!-- Footer -->
  <div class="ftr">
    <div class="ftr-left">
      <img src="${origin}/images/logo.png" alt="Taronga Tracka" class="ftr-logo"
           onerror="this.style.display='none'">
      <div class="ftr-divider"></div>
      <span class="ftr-name">Taronga Tracka</span>
    </div>
    <div class="ftr-right">
      ${meta.label} · ${stageLabel}<br>
      taronga.org.au · Education Programs
    </div>
  </div>

</div><!-- /page -->
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
}
