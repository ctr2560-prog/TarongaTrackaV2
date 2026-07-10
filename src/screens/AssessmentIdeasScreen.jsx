import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { openAssessmentTaskNotification } from '../utils/assessmentTaskNotification';

const KLAS = [
  { id: 'science',  label: 'Science',  color: '#1A5238', light: '#E8F5EE', border: '#A8D5BB' },
  { id: 'maths',    label: 'Maths',    color: '#0369A1', light: '#E0F0FB', border: '#93C5E8' },
  { id: 'english',  label: 'English',  color: '#7C3AED', light: '#F0EBFD', border: '#C4B0F5' },
  { id: 'pdhpe',    label: 'PDHPE',    color: '#BE185D', light: '#FDE8F3', border: '#F0A0C8' },
];

const STAGE_COLORS = {
  'S2': '#2E7D55',
  'S3': '#0369A1',
  'S4': '#7C3AED',
  'S5': '#BE185D',
};

const FORMAT_COLORS = {
  'Written':              '#1A5238',
  'Creative Writing':     '#7C3AED',
  'Multimodal':           '#D97706',
  'Investigation':        '#0369A1',
  'Report':               '#0369A1',
  'Written / Report':     '#0369A1',
  'Written / Multimodal': '#D97706',
  'Extended Response':    '#BE185D',
  'Reflection / Presentation': '#BE185D',
  'Persuasive Writing':   '#BE185D',
};

// ── Evidence icon SVGs ────────────────────────────────────────────────────────
const IcoChart = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1.5" y="9" width="3" height="6" rx="1"/>
    <rect x="6.5" y="5" width="3" height="10" rx="1"/>
    <rect x="11.5" y="1.5" width="3" height="13.5" rx="1"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M5.5 8.2l2 2 3-3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoDoc = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 2a1 1 0 011-1h5l4 4v9a1 1 0 01-1 1h-8a1 1 0 01-1-1V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9.5 1v4H13.5M5.5 8h5M5.5 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IcoPin = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5C5.52 1.5 3.5 3.52 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.48-2.02-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IcoCalc = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 5.5h6M5 8.5h2M9 8.5h2M5 11.5h2M9 11.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IcoPencil = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9.5 3.5l3 3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IcoQuote = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 3h12a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H9.5L7 14V11H2a.5.5 0 01-.5-.5v-7A.5.5 0 012 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M5 7h6M5 9h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IcoLines = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M2 7.5h12M2 11h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IcoCompare = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 5.5h12M10.5 3l3 2.5-3 2.5M13.5 10.5H1.5M5.5 8l-3 2.5 3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── In-app evidence ───────────────────────────────────────────────────────────
const APP_EVIDENCE = {
  science: [
    { metric: 'Observation Score',  icon: <IcoChart />,   what: 'AI-scored observation across Behaviour, Detail and Writing, each out of 5.' },
    { metric: 'Quiz Result',        icon: <IcoCheck />,   what: 'Stage-differentiated MCQ with the specific distractor chosen recorded.' },
    { metric: 'Written Response',   icon: <IcoDoc />,     what: 'The student\'s own unedited words, portfolio, moderation or report-ready.' },
    { metric: 'Animals Visited',    icon: <IcoPin />,     what: 'Which enclosures the student engaged with, a field study participation log.' },
  ],
  maths: [
    { metric: 'Written Working',    icon: <IcoCalc />,    what: 'Step-by-step working for the stage-matched maths task, method not just answer.' },
    { metric: 'Quiz Result',        icon: <IcoCheck />,   what: 'Calculation MCQ with error-based distractors, reveals the exact misconception.' },
    { metric: 'Score Override',     icon: <IcoPencil />,  what: 'Override the AI score to apply your professional judgement on partial working.' },
  ],
  english: [
    { metric: 'Written Response',          icon: <IcoDoc />,     what: 'Creative or analytical piece using language techniques matched to stage.' },
    { metric: 'Language & Technique Score', icon: <IcoQuote />,  what: 'AI-assessed against stage-appropriate technique use, review alongside text.' },
    { metric: 'Written Expression Score',   icon: <IcoLines />,  what: 'Sentence structure, vocabulary and cohesion, useful as pre/post comparison.' },
    { metric: 'Quiz Result',               icon: <IcoCheck />,   what: 'Metalanguage identification question, tests technique knowledge at stage level.' },
  ],
  pdhpe: [
    { metric: 'Written Response',   icon: <IcoDoc />,     what: 'Connects animal behaviour or anatomy to human health, movement or wellbeing.' },
    { metric: 'Quiz Result',        icon: <IcoCheck />,   what: 'Stage-matched health/movement question, records correct answer and distractor.' },
    { metric: 'Comparison Score',   icon: <IcoCompare />, what: 'How well the student connected animal to human, a proxy for understanding not recall.' },
  ],
};

// ── Post-visit tasks ──────────────────────────────────────────────────────────
const POST_TASKS = {
  science: [
    {
      title: 'Field Report',
      stages: ['S2', 'S3'],
      format: 'Written',
      desc: 'Students revise and extend their in-app observation into a structured field report with heading, observations, explanation and conclusion.',
      appLink: 'Pull the raw response from Class Insights as their starting draft.',
    },
    {
      title: 'Adaptation Explanation',
      stages: ['S3', 'S4'],
      format: 'Written / Multimodal',
      desc: 'Choose one animal and explain how two adaptations help it survive, using at least one piece of excursion evidence and one from prior knowledge.',
      appLink: 'Behaviour and Detail domain scores give a rubric-ready starting point.',
    },
    {
      title: 'Ecosystem Relationships',
      stages: ['S4'],
      format: 'Report',
      desc: 'Using dingo food chain mission data, describe feeding relationships and evaluate what would happen if one organism was removed.',
      appLink: 'Dingo quiz result (energy transfer) + written observation = two pieces of evidence.',
    },
    {
      title: 'Biodiversity & Conservation Argument',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Construct a scientific argument for why biodiversity matters using conservation facts from across the Tracka missions.',
      appLink: 'Conservation Gallery class submissions can be used as stimulus material.',
    },
    {
      title: 'Comparative Animal Study',
      stages: ['S5'],
      format: 'Investigation',
      desc: 'Compare two animals\' evolutionary adaptations, ecological niches and conservation status using observation writing as primary field data.',
      appLink: 'Export observations from at least two animals per student from Class Insights.',
    },
  ],
  maths: [
    {
      title: 'Maths Journal',
      stages: ['S2', 'S3'],
      format: 'Written',
      desc: 'Write up the in-app maths working in a maths journal with a sketch of the animal and a sentence explaining what the calculation shows.',
      appLink: 'The written working response from Class Insights is the starting point.',
    },
    {
      title: 'Data Investigation',
      stages: ['S3', 'S4'],
      format: 'Investigation',
      desc: 'Use class observation data to pose and answer a statistical question — graph, calculate mean/median, and draw conclusions.',
      appLink: 'Use class-level scores from Class Insights as the dataset.',
    },
    {
      title: 'Conservation Cost Analysis',
      stages: ['S4'],
      format: 'Written / Report',
      desc: 'Extend the koala care cost data to research a full conservation program budget — percentage changes, ratios and projections.',
      appLink: 'Koala written response (financial maths working) provides the starting calculation.',
    },
    {
      title: 'Proportional Reasoning Task',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Apply proportional reasoning to compare animal measurements (mass, food intake, territory) across two animals. Full working required.',
      appLink: 'Gorilla, sea lion and giraffe in-app tasks all generate proportional reasoning evidence.',
    },
    {
      title: 'Statistical Analysis & Inference',
      stages: ['S5'],
      format: 'Investigation',
      desc: 'Use the class chimpanzee behaviour percentages to calculate mean, range and standard deviation, then draw inferences and identify error sources.',
      appLink: 'Collect chimpanzee behaviour percentages from each student\'s response in Class Insights.',
    },
  ],
  english: [
    {
      title: 'Observation Piece: Revised & Extended',
      stages: ['S2', 'S3'],
      format: 'Creative Writing',
      desc: 'Students identify one technique they used in their in-app response, then revise and extend the piece to three paragraphs with peer editing.',
      appLink: 'The raw in-app response is the first draft — pull it from Class Insights.',
    },
    {
      title: 'Descriptive / Imaginative Writing',
      stages: ['S3', 'S4'],
      format: 'Creative Writing',
      desc: 'Using the in-app English task as stimulus, write a complete imaginative text set at Taronga with at least three named language techniques.',
      appLink: 'English observation writing + technique quiz result = two pieces of evidence.',
    },
    {
      title: 'Persuasive Text',
      stages: ['S4'],
      format: 'Persuasive Writing',
      desc: 'Write a persuasive speech or letter arguing for the conservation of one animal, using rhetorical questions, emotive language and statistics.',
      appLink: 'Sea lion persuasive writing task gives a ready-made scaffold and starting evidence.',
    },
    {
      title: 'Comparative Textual Analysis',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Compare how the in-app reading text and a published wildlife article use language to position the reader — technique, effect, evidence.',
      appLink: 'Gorilla and dingo reading tasks both generate quotable textual evidence.',
    },
    {
      title: 'Multimodal Feature Article',
      stages: ['S5'],
      format: 'Multimodal',
      desc: 'Produce a digital or print feature article about one conservation issue, incorporating observation writing, a self-taken image and language analysis.',
      appLink: 'In-app observation writing + ZooSnooz video clips (if applicable) as primary evidence.',
    },
  ],
  pdhpe: [
    {
      title: 'Movement & Body Reflection',
      stages: ['S2', 'S3'],
      format: 'Written',
      desc: 'Compare how the observed animal moves to how the student\'s own body moves in sport or play — and what athletes could learn from it.',
      appLink: 'PDHPE observation writing gives the animal evidence. Students add the human connection.',
    },
    {
      title: 'Energy Systems Analysis',
      stages: ['S4'],
      format: 'Written / Report',
      desc: 'Using the lion mission as stimulus, write a detailed analysis of ATP-PC and aerobic energy systems, including a diagram and rest-to-work ratios.',
      appLink: 'Lion PDHPE quiz result (energy systems) + observation writing = two pieces of evidence.',
    },
    {
      title: 'Cardiovascular System Investigation',
      stages: ['S4'],
      format: 'Investigation',
      desc: 'Research and compare the giraffe cardiovascular system to the human cardiovascular system during exercise, connecting to effects of physical activity.',
      appLink: 'Giraffe PDHPE observation writing (cardiovascular comparison) is the primary evidence.',
    },
    {
      title: 'Wellbeing & Community Connections',
      stages: ['S3', 'S4'],
      format: 'Reflection / Presentation',
      desc: 'Drawing on lemur social behaviour, reflect on how belonging and community support physical and mental wellbeing. Present with personal examples.',
      appLink: 'Lemur PDHPE observation writing is the stimulus. Students link to their own life.',
    },
    {
      title: 'Nutritional Needs & Performance',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Using the dingo hunting mission, research nutritional requirements for sustained physical performance and compare to dietary guidelines for athletes.',
      appLink: 'Dingo PDHPE quiz (food for energy) + observation writing give the animal-side evidence.',
    },
  ],
};

// Flatten all tasks into one array with kla attached
const ALL_TASKS = Object.entries(POST_TASKS).flatMap(([klaId, tasks]) =>
  tasks.map(t => ({ ...t, klaId }))
);

export default function AssessmentIdeasScreen() {
  const { setCurrentScreen } = useApp();
  const [filterKla, setFilterKla]   = useState('science');
  const [filterStage, setFilterStage] = useState('all');
  const [printStage, setPrintStage] = useState(4);

  const activeKla  = KLAS.find(k => k.id === filterKla);
  const heroColor  = activeKla?.color  ?? '#1A5238';
  const heroLight  = activeKla?.light  ?? '#E8F5EE';

  const evidenceItems = filterKla === 'all'
    ? Object.values(APP_EVIDENCE).flat().filter((v, i, arr) => arr.findIndex(x => x.metric === v.metric) === i)
    : APP_EVIDENCE[filterKla] ?? [];

  const visibleTasks = ALL_TASKS.filter(t => {
    const klaOk   = filterKla === 'all' || t.klaId === filterKla;
    const stageOk = filterStage === 'all' || t.stages.includes(`S${filterStage}`);
    return klaOk && stageOk;
  });

  return (
    <div style={{ minHeight:'100vh', background:'#F3F1EC', fontFamily:'var(--t-font)' }}>

      {/* ── Topbar ── */}
      <div style={{ background:'white', borderBottom:'1px solid #E5E2DA', padding:'0.75rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => setCurrentScreen('teacherDashboard')}
          style={{ background:'none', border:'1px solid #E5E2DA', color:'var(--t-deep)', padding:'0.4rem 0.9rem', borderRadius:999, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Dashboard
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="" style={{ height:'22px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <span className="taronga-title" style={{ fontSize:'0.95rem', color:'var(--t-deep)', letterSpacing:'0.08em', fontWeight:400 }}>ASSESSMENT IDEAS</span>
            <span style={{ fontSize:'0.7rem', color:'var(--t-slate)', marginLeft:'0.6rem' }}>Teacher Portal</span>
          </div>
        </div>
      </div>

      {/* ── Hero: Taronga Tracka as Assessment ── */}
      <div style={{ background:'#071E14', color:'white', padding:'3rem 1.5rem 2.5rem' }}>
        <div style={{ maxWidth:1180, margin:'0 auto' }}>

          {/* Kicker */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1rem' }}>
            <div style={{ width:36, height:3, borderRadius:2, background:'#2E7D55' }} />
            <span style={{ fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase', color:'#A8C4B2' }}>
              In-Excursion Assessment
            </span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'2rem', alignItems:'start', flexWrap:'wrap' }}>
            <div>
              <h2 className="taronga-title" style={{ margin:'0 0 0.6rem', fontSize:'2.4rem', fontWeight:400, letterSpacing:'0.02em', lineHeight:1.1, color:'white' }}>
                Taronga Tracka<br/>as Assessment
              </h2>
              <p style={{ margin:'0 0 1.75rem', fontSize:'0.9rem', color:'#A8C4B2', lineHeight:1.7, maxWidth:560 }}>
                The excursion is the assessment. Every student response, quiz result and score is captured automatically and waiting in Class Insights the moment they submit.
              </p>

              {/* Evidence chips */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem', marginBottom:'1.75rem' }}>
                {evidenceItems.map(ev => (
                  <div key={ev.metric} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'0.6rem 0.85rem', display:'flex', alignItems:'flex-start', gap:'0.55rem', maxWidth:240 }}>
                    <span style={{ display:'flex', alignItems:'center', marginTop:'0.1rem', flexShrink:0, color:'rgba(255,255,255,0.75)' }}>{ev.icon}</span>
                    <div>
                      <div style={{ fontSize:'0.75rem', fontWeight:700, color:'white', marginBottom:'0.15rem' }}>{ev.metric}</div>
                      <div style={{ fontSize:'0.68rem', color:'#A8C4B2', lineHeight:1.5 }}>{ev.what}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Class Insights callout */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.6rem', background:'rgba(46,125,85,0.25)', border:'1px solid rgba(46,125,85,0.4)', borderRadius:8, padding:'0.6rem 1rem', fontSize:'0.78rem', color:'#A8D5BB' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Find all of this in <strong style={{ color:'white' }}>Class Insights → select your class → tap any student</strong>
              </div>
            </div>

            {/* Print AT panel */}
            <div style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:16, padding:'1.5rem', minWidth:240, flexShrink:0 }}>
              <div style={{ fontSize:'0.62rem', fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', color:'#A8C4B2', marginBottom:'0.75rem' }}>Print AT Notification</div>
              <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.6)', lineHeight:1.6, margin:'0 0 1rem' }}>Generate a print-ready NSW Assessment Task Notification for the in-excursion fieldwork observation.</p>

              {/* KLA selector */}
              <div style={{ marginBottom:'0.75rem' }}>
                <div style={{ fontSize:'0.6rem', fontWeight:700, color:'#A8C4B2', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.4rem' }}>Subject</div>
                <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap' }}>
                  {KLAS.map(k => (
                    <button key={k.id}
                      onClick={() => setFilterKla(filterKla === k.id ? 'all' : k.id)}
                      style={{ padding:'0.3rem 0.65rem', borderRadius:999, border:'none', fontSize:'0.7rem', fontWeight:700, cursor:'pointer', background: filterKla === k.id ? k.color : 'rgba(255,255,255,0.1)', color: filterKla === k.id ? 'white' : 'rgba(255,255,255,0.6)', transition:'all 0.15s' }}>
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage selector */}
              <div style={{ marginBottom:'1rem' }}>
                <div style={{ fontSize:'0.6rem', fontWeight:700, color:'#A8C4B2', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.4rem' }}>Stage</div>
                <div style={{ display:'flex', gap:'0.35rem' }}>
                  {[2,3,4,5].map(s => (
                    <button key={s} onClick={() => setPrintStage(s)}
                      style={{ width:34, height:34, borderRadius:8, border:'none', fontSize:'0.82rem', fontWeight:800, cursor:'pointer', background: printStage === s ? (activeKla?.color ?? '#2E7D55') : 'rgba(255,255,255,0.1)', color: printStage === s ? 'white' : 'rgba(255,255,255,0.55)', transition:'all 0.15s' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openAssessmentTaskNotification(filterKla === 'all' ? 'science' : filterKla, printStage, 'in-excursion', null)}
                style={{ width:'100%', padding:'0.7rem', borderRadius:8, border:'none', background:'linear-gradient(135deg,#1A5238,#2E7D55)', color:'white', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.03em' }}>
                Print AT Notification →
              </button>
              <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', marginTop:'0.5rem', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem' }}>
                {filterKla === 'all' ? 'Science' : activeKla?.label}
                <svg width="3" height="3" viewBox="0 0 3 3"><circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,255,255,0.3)"/></svg>
                Stage {printStage}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background:'white', borderBottom:'1px solid #E5E2DA', padding:'0 1.5rem', position:'sticky', top:57, zIndex:90 }}>
        <div style={{ maxWidth:1180, margin:'0 auto', display:'flex', alignItems:'center', gap:'0', overflowX:'auto' }}>

          {/* KLA tabs */}
          <div style={{ display:'flex', gap:'0', flexShrink:0 }}>
            {[{ id:'all', label:'All KLAs', color:'#1A1A17' }, ...KLAS].map(k => {
              const isActive = filterKla === k.id;
              return (
                <button key={k.id} onClick={() => setFilterKla(k.id)}
                  style={{ padding:'0.85rem 1.1rem', background:'none', border:'none', borderBottom: isActive ? `3px solid ${k.color ?? '#1A1A17'}` : '3px solid transparent', fontSize:'0.82rem', fontWeight: isActive ? 700 : 500, color: isActive ? (k.color ?? '#1A1A17') : '#6B6B62', cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s', marginBottom:'-1px' }}>
                  {k.label}
                </button>
              );
            })}
          </div>

          <div style={{ flex:1 }} />

          {/* Stage filter */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0, padding:'0.5rem 0' }}>
            <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#6B6B62', textTransform:'uppercase', letterSpacing:'0.08em' }}>Stage</span>
            {['all',2,3,4,5].map(s => (
              <button key={s} onClick={() => setFilterStage(s)}
                style={{ padding:'0.3rem 0.6rem', borderRadius:999, border:`1.5px solid ${filterStage === s ? '#1A5238' : '#E5E2DA'}`, background: filterStage === s ? '#1A5238' : 'white', color: filterStage === s ? 'white' : '#6B6B62', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Card grid ── */}
      <div style={{ maxWidth:1180, margin:'0 auto', padding:'2rem 1.5rem 3rem' }}>

        {/* Section heading */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
          <h3 style={{ margin:0, fontSize:'1.1rem', fontWeight:700, color:'#1A1A17' }}>
            Post-Visit Assessment Tasks
          </h3>
          <span style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.78rem', color:'#6B6B62' }}>
            {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''}
            {filterKla !== 'all' && <><svg width="3" height="3" viewBox="0 0 3 3"><circle cx="1.5" cy="1.5" r="1.5" fill="#9A9A92"/></svg>{activeKla?.label}</>}
            {filterStage !== 'all' && <><svg width="3" height="3" viewBox="0 0 3 3"><circle cx="1.5" cy="1.5" r="1.5" fill="#9A9A92"/></svg>Stage {filterStage}</>}
          </span>
        </div>

        {visibleTasks.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem 2rem', color:'#6B6B62' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'0.75rem' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="21" cy="21" r="14" stroke="#CBD5CC" strokeWidth="2.5"/>
                <path d="M31 31l10 10" stroke="#CBD5CC" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ margin:0, fontWeight:600 }}>No tasks match that filter combination.</p>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1.1rem' }}>
          {visibleTasks.map(task => {
            const klaObj    = KLAS.find(k => k.id === task.klaId);
            const fmtColor  = FORMAT_COLORS[task.format] ?? '#6B6B62';
            const firstStage = parseInt(task.stages[0].replace('S',''), 10);

            return (
              <div key={`${task.klaId}-${task.title}`}
                style={{ background:'white', borderRadius:16, overflow:'hidden', border:'1px solid #E5E2DA', display:'flex', flexDirection:'column', transition:'box-shadow 0.15s, transform 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 32px rgba(7,30,20,0.10)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>

                {/* Coloured top band */}
                <div style={{ height:6, background:`linear-gradient(90deg, ${klaObj?.color}, ${klaObj?.color}88)` }} />

                {/* Card body */}
                <div style={{ padding:'1.1rem 1.2rem 0.85rem', flex:1, display:'flex', flexDirection:'column' }}>

                  {/* Tags row */}
                  <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexWrap:'wrap', marginBottom:'0.65rem' }}>
                    <span style={{ background: klaObj?.light, color: klaObj?.color, border:`1px solid ${klaObj?.border}`, borderRadius:999, padding:'0.15rem 0.6rem', fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                      {klaObj?.label}
                    </span>
                    {task.stages.map(s => (
                      <span key={s} style={{ background:`${STAGE_COLORS[s]}15`, color:STAGE_COLORS[s], border:`1px solid ${STAGE_COLORS[s]}40`, borderRadius:999, padding:'0.15rem 0.5rem', fontSize:'0.62rem', fontWeight:800, letterSpacing:'0.06em' }}>
                        {s}
                      </span>
                    ))}
                    <span style={{ marginLeft:'auto', background:`${fmtColor}12`, color:fmtColor, border:`1px solid ${fmtColor}30`, borderRadius:999, padding:'0.15rem 0.55rem', fontSize:'0.62rem', fontWeight:700 }}>
                      {task.format}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{ margin:'0 0 0.5rem', fontSize:'1rem', fontWeight:700, color:'#1A1A17', lineHeight:1.25 }}>{task.title}</h4>

                  {/* Description */}
                  <p style={{ margin:'0 0 0.75rem', fontSize:'0.8rem', color:'#4A4A42', lineHeight:1.65, flex:1 }}>{task.desc}</p>

                  {/* App evidence callout */}
                  <div style={{ background:'#F7F5F0', borderRadius:8, padding:'0.5rem 0.7rem', marginBottom:'0.85rem', display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
                    <span style={{ fontSize:'0.65rem', fontWeight:800, color:klaObj?.color, textTransform:'uppercase', letterSpacing:'0.08em', flexShrink:0, marginTop:'0.1rem' }}>App evidence</span>
                    <span style={{ fontSize:'0.72rem', color:'#6B6B62', lineHeight:1.5 }}>{task.appLink}</span>
                  </div>

                  {/* Print button */}
                  <button
                    onClick={() => openAssessmentTaskNotification(task.klaId, firstStage, 'post-visit', task)}
                    style={{ width:'100%', padding:'0.6rem', borderRadius:8, border:`1.5px solid ${klaObj?.color}`, background:'white', color:klaObj?.color, fontSize:'0.77rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', transition:'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = klaObj?.color; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = klaObj?.color; }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Print AT Notification
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer tip */}
        <div style={{ marginTop:'2rem', background:'white', border:'1px solid #E5E2DA', borderRadius:12, padding:'1rem 1.25rem', display:'flex', gap:'0.85rem', alignItems:'flex-start' }}>
          <div style={{ flexShrink:0, marginTop:'0.1rem' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2.5C7.24 2.5 5 4.74 5 7.5c0 1.93.99 3.62 2.5 4.59V15h5v-2.91C14.01 11.12 15 9.43 15 7.5c0-2.76-2.24-5-5-5z" stroke="#D97706" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M7.5 15.5h5M8.5 18h3" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight:700, color:'#1A1A17', fontSize:'0.83rem', marginBottom:'0.2rem' }}>Using AI scores as evidence</div>
            <p style={{ margin:0, fontSize:'0.77rem', color:'#6B6B62', lineHeight:1.65 }}>
              Every AI score in Class Insights is a starting point, not a final judgement. Use the <strong>score override</strong> on any student's response to apply your own professional marking. The AI rationale and improvement tips feed directly into written feedback or report comments.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .assess-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
