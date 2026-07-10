import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { openAssessmentTaskNotification } from '../utils/assessmentTaskNotification';

const KLAS = [
  { id: 'science',  label: 'Science',  color: '#1A5238', light: '#E8F5EE' },
  { id: 'maths',    label: 'Maths',    color: '#0369A1', light: '#E0F0FB' },
  { id: 'english',  label: 'English',  color: '#7C3AED', light: '#F0EBFD' },
  { id: 'pdhpe',    label: 'PDHPE',    color: '#BE185D', light: '#FDE8F3' },
];

const STAGE_COLORS = {
  'S2': '#2E7D55',
  'S3': '#0369A1',
  'S4': '#7C3AED',
  'S5': '#BE185D',
};

// ── In-app evidence ──────────────────────────────────────────────────────────
const APP_EVIDENCE = {
  science: [
    {
      metric: 'Observation Score',
      where: 'Class Insights → student row → Behaviour / Detail / Writing bars',
      what: 'AI-scored free-text observation against three domains: behaviour description, scientific detail, and written expression. Each scored /5.',
    },
    {
      metric: 'Quiz Result',
      where: 'Class Insights → Quiz column',
      what: 'Stage-differentiated MCQ answered at the animal. Records correct/incorrect and the specific distractor chosen — useful for identifying misconceptions.',
    },
    {
      metric: 'Written Response',
      where: 'Class Insights → tap any student → full response text',
      what: 'The student\'s own words, unedited. Can be downloaded or copy-pasted into a portfolio, report comment, or moderation sample.',
    },
    {
      metric: 'Animals Visited',
      where: 'Class Insights → badges row',
      what: 'Which enclosures the student engaged with, and in what order. Useful as a participation record or field study log.',
    },
    {
      metric: 'Class Points',
      where: 'Class Insights → top summary',
      what: 'Aggregate score across all animals and all students. Gives a quick class-level performance snapshot before you look at individuals.',
    },
  ],
  maths: [
    {
      metric: 'Written Working',
      where: 'Class Insights → student row → full response',
      what: 'The student\'s step-by-step working for the stage-matched maths task. Shows method, not just answer — directly assessable against Working Mathematically criteria.',
    },
    {
      metric: 'Quiz Result',
      where: 'Class Insights → Quiz column',
      what: 'Stage-differentiated calculation MCQ. Distractors are based on common errors (e.g. adding instead of multiplying) so wrong answers reveal the specific misconception.',
    },
    {
      metric: 'Score Override',
      where: 'Class Insights → pencil icon next to any score',
      what: 'Teacher can override the AI score for any domain. Use this to apply your own professional judgement, especially for partially correct working.',
    },
  ],
  english: [
    {
      metric: 'Written Response',
      where: 'Class Insights → tap student → full response text',
      what: 'The student\'s observation writing using the English task (language techniques, creative response, or descriptive piece matched to stage). Primary evidence for literacy assessment.',
    },
    {
      metric: 'Writing Score — Language & Technique',
      where: 'Class Insights → student row → score bars',
      what: 'AI-assessed against stage-appropriate technique use (simile, imagery, structural choices). Review alongside the full text for moderation.',
    },
    {
      metric: 'Writing Score — Written Expression',
      where: 'Class Insights → student row → score bars',
      what: 'Sentence structure, vocabulary, and cohesion. Useful as a pre/post comparison data point if you run two Tracka sessions in a year.',
    },
    {
      metric: 'Quiz Result',
      where: 'Class Insights → Quiz column',
      what: 'Language and technique identification question (e.g. "which sentence uses personification?"). Tests metalanguage at the student\'s stage level.',
    },
  ],
  pdhpe: [
    {
      metric: 'Written Response',
      where: 'Class Insights → student row → full response',
      what: 'The student\'s PDHPE observation — connects animal behaviour or anatomy to human health, movement, body systems, or wellbeing concepts.',
    },
    {
      metric: 'Quiz Result',
      where: 'Class Insights → Quiz column',
      what: 'Stage-matched health/movement question linked to the animal (e.g. energy systems from lion behaviour, cardiovascular system from giraffe heart). Records correct answer and distractor chosen.',
    },
    {
      metric: 'Score — Comparison',
      where: 'Class Insights → student row → Comparison bar',
      what: 'How well the student drew a connection between animal and human. A reliable proxy for understanding, not just recall.',
    },
  ],
};

// ── Post-visit tasks ─────────────────────────────────────────────────────────
const POST_TASKS = {
  science: [
    {
      title: 'Field Report',
      stages: ['S2', 'S3'],
      format: 'Written',
      desc: 'Use the written observation from the app as a first draft. Students revise and extend it into a structured field report with heading, observations, explanation, and conclusion. Scaffold with the app\'s sentence starters.',
      appLink: 'Pull the student\'s raw response from Class Insights as their starting evidence.',
    },
    {
      title: 'Adaptation Explanation',
      stages: ['S3', 'S4'],
      format: 'Written / Multimodal',
      desc: 'Choose one animal visited and write an explanation of how two adaptations help it survive. Must use at least one piece of evidence from the observation (what you actually saw) and one from prior knowledge.',
      appLink: 'The observation score\'s Behaviour and Detail domains give you a rubric-ready starting point.',
    },
    {
      title: 'Ecosystem Relationships',
      stages: ['S4'],
      format: 'Report',
      desc: 'Using the dingo food chain mission data and observation notes, describe the feeding relationships observed and explain the role of each organism. Evaluate what would happen if one organism was removed.',
      appLink: 'Dingo mission quiz result (energy transfer) + written observation = two pieces of evidence.',
    },
    {
      title: 'Biodiversity & Conservation Argument',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Draw on the conservation facts from across the Tracka missions to construct a scientific argument for why biodiversity matters. Must include specific data or species examples from the visit.',
      appLink: 'Conservation Gallery submissions from your class can be used as stimulus material.',
    },
    {
      title: 'Comparative Animal Study',
      stages: ['S5'],
      format: 'Investigation',
      desc: 'Select two animals from the visit and compare their evolutionary adaptations, ecological niches, and conservation status. Use the observation writing as primary field data alongside secondary sources.',
      appLink: 'Export observations from at least two animals per student from Class Insights.',
    },
  ],
  maths: [
    {
      title: 'Maths Journal',
      stages: ['S2', 'S3'],
      format: 'Written',
      desc: 'Students write up their working from the in-app maths task in a maths journal, adding a diagram or sketch of the animal and explaining in words what their calculation shows.',
      appLink: 'The written working response from Class Insights is the starting point for the journal entry.',
    },
    {
      title: 'Data Investigation',
      stages: ['S3', 'S4'],
      format: 'Investigation',
      desc: 'Use the class observation data (collected in the app) to pose and answer a statistical question. E.g. "Which animal had the highest average score?" Students create a graph, calculate mean/median, and draw conclusions.',
      appLink: 'Use the class-level scores from Class Insights as the dataset. Export from the dashboard.',
    },
    {
      title: 'Conservation Cost Analysis',
      stages: ['S4'],
      format: 'Written / Report',
      desc: 'Using the koala care cost data from the in-app task ($15,000/koala/year), students extend this to research the full cost of a conservation program and calculate percentage changes, ratios, and projections.',
      appLink: 'Koala written response (financial maths working) provides the starting calculation.',
    },
    {
      title: 'Proportional Reasoning Task',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Students select two animals from the visit and apply proportional reasoning to compare measurements (body mass, food intake, territory size). Must show full working and interpret results in context.',
      appLink: 'Gorilla, sea lion and giraffe in-app tasks all generate proportional reasoning evidence.',
    },
    {
      title: 'Statistical Analysis & Inference',
      stages: ['S5'],
      format: 'Investigation',
      desc: 'Use the class chimpanzee behaviour data (all students\' behaviour percentage recordings) to calculate mean, range, and standard deviation. Draw inferences about what the data suggests and identify sources of error.',
      appLink: 'Collect the chimpanzee behaviour percentages from each student\'s written response in Class Insights.',
    },
  ],
  english: [
    {
      title: 'Observation Piece — Revised & Extended',
      stages: ['S2', 'S3'],
      format: 'Creative Writing',
      desc: 'Students take their in-app observation writing, identify one language technique they used, then revise and extend the piece to three paragraphs. Peer editing step included.',
      appLink: 'The raw in-app response is the first draft. Pull it from Class Insights.',
    },
    {
      title: 'Descriptive / Imaginative Writing',
      stages: ['S3', 'S4'],
      format: 'Creative Writing',
      desc: 'Using the in-app English task observation as stimulus, students write a complete imaginative text (narrative or descriptive essay) set at Taronga. Must include at least three named language techniques with conscious effect.',
      appLink: 'English observation writing + language technique quiz result = two pieces of evidence.',
    },
    {
      title: 'Persuasive Text',
      stages: ['S4'],
      format: 'Persuasive Writing',
      desc: 'Write a persuasive speech or letter arguing for the conservation of one animal visited. Must use rhetorical questions, emotive language, and at least one statistic from the conservation facts encountered at Taronga.',
      appLink: 'Sea lion persuasive writing task gives a ready-made scaffold and starting evidence.',
    },
    {
      title: 'Comparative Textual Analysis',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Compare how two different texts (the in-app reading text and a short published wildlife article) use language and structure to position the reader. Analyse technique and effect with specific textual evidence.',
      appLink: 'Gorilla and dingo reading tasks both generate textual evidence students can quote directly.',
    },
    {
      title: 'Multimodal Feature Article',
      stages: ['S5'],
      format: 'Multimodal',
      desc: 'Produce a feature article (digital or print format) about one conservation issue observed at Taronga. Must incorporate field observation writing, a self-taken image, and analysis of language choices in the article.',
      appLink: 'In-app observation writing + ZooSnooz video clips (if applicable) as primary multimodal evidence.',
    },
  ],
  pdhpe: [
    {
      title: 'Movement & Body Reflection',
      stages: ['S2', 'S3'],
      format: 'Written',
      desc: 'Students write a short reflection comparing how the animal they observed moves to how their own body moves in sport or play. What can athletes learn from watching this animal?',
      appLink: 'PDHPE observation writing response gives the animal evidence. Students add the human connection.',
    },
    {
      title: 'Energy Systems Analysis',
      stages: ['S4'],
      format: 'Written Report',
      desc: 'Using the lion mission as stimulus (long rest periods, explosive bursts), write a detailed analysis of the ATP-PC and aerobic energy systems. Include a diagram and explain how rest-to-work ratios apply to human sport.',
      appLink: 'Lion PDHPE quiz result (energy systems) + observation writing = two pieces of evidence.',
    },
    {
      title: 'Cardiovascular System Investigation',
      stages: ['S4'],
      format: 'Investigation',
      desc: 'Research and compare the giraffe cardiovascular system (11 kg heart, extreme blood pressure) to the human cardiovascular system during exercise. Explain adaptations and connect to the effects of regular physical activity.',
      appLink: 'Giraffe PDHPE observation writing (cardiovascular comparison) is the primary evidence.',
    },
    {
      title: 'Wellbeing & Community Connections',
      stages: ['S3', 'S4'],
      format: 'Reflection / Presentation',
      desc: 'Drawing on the lemur social behaviour observation, students reflect on how belonging and community connection support their own physical and mental wellbeing. Produce a short presentation or written piece with personal examples.',
      appLink: 'Lemur PDHPE observation writing is the stimulus. Students link to their own life.',
    },
    {
      title: 'Nutritional Needs & Performance',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Using the dingo hunting mission as context, research the nutritional requirements for sustained physical performance. Compare the dingo\'s protein-rich diet to recommended human dietary guidelines for athletes.',
      appLink: 'Dingo PDHPE quiz (food for energy) + observation writing give the animal-side evidence.',
    },
  ],
};

const FORMAT_COLORS = {
  'Written':            '#1A5238',
  'Creative Writing':   '#7C3AED',
  'Multimodal':         '#D97706',
  'Investigation':      '#0369A1',
  'Report':             '#0369A1',
  'Written / Report':   '#0369A1',
  'Written / Multimodal': '#D97706',
  'Extended Response':  '#BE185D',
  'Reflection / Presentation': '#BE185D',
  'Persuasive Writing': '#BE185D',
};

export default function AssessmentIdeasScreen() {
  const { setCurrentScreen } = useApp();
  const [kla, setKla] = useState('science');
  const [printStage, setPrintStage] = useState(4);

  const active = KLAS.find(k => k.id === kla);
  const evidence = APP_EVIDENCE[kla];
  const tasks = POST_TASKS[kla];

  return (
    <div className="lms-page">

      {/* Top bar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>ASSESSMENT IDEAS</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · In-app evidence & post-visit tasks</p>
          </div>
        </div>
      </div>

      <div className="lms-two-col">

        {/* Sidebar */}
        <div className="lms-sidebar">
          <p className="lms-nav-group-label">Navigation</p>
          <nav className="lms-nav">
            <button className="lms-nav-item" onClick={() => setCurrentScreen('teacherDashboard')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Dashboard
            </button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('curriculumAlignment')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 2h10v12H3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6 5h4M6 8h4M6 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></span> Curriculum Alignment
            </button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('resourceHub')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M2 8h12M2 13h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></span> Resource Hub
            </button>
          </nav>

          <p className="lms-nav-group-label">Learning Area</p>
          <nav className="lms-nav">
            {KLAS.map(k => (
              <button
                key={k.id}
                className={`lms-nav-item ${k.id === kla ? 'lms-nav-active' : ''}`}
                onClick={() => setKla(k.id)}
              >
                <span className="lms-nav-icon">
                  <span style={{ width:8, height:8, borderRadius:'50%', background: k.id === kla ? 'white' : k.color, display:'block', opacity:0.85 }} />
                </span>
                {k.label}
              </button>
            ))}
          </nav>

          {/* Stage key */}
          <p className="lms-nav-group-label" style={{ marginTop:'1.5rem' }}>Stage key</p>
          <div style={{ padding:'0 0.75rem', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
            {Object.entries(STAGE_COLORS).map(([s, c]) => (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:'0.55rem' }}>
                <span style={{ display:'inline-block', background:`${c}22`, color:c, border:`1px solid ${c}55`, borderRadius:999, padding:'0.1rem 0.5rem', fontSize:'0.62rem', fontWeight:800, letterSpacing:'0.06em' }}>{s}</span>
                <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.5)' }}>Stage {s.replace('S', '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="lms-main">
          <div className="lms-main-inner" style={{ maxWidth:'900px', margin:'0 auto' }}>

            {/* KLA header */}
            <div key={kla} className="animate-fade-in-up">
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.3rem' }}>
                <div style={{ width:6, height:32, borderRadius:3, background:active.color, flexShrink:0 }} />
                <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:active.color, fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
                  {active.label}
                </h2>
              </div>
              <p style={{ margin:'0 0 1.25rem 1.5rem', fontSize:'0.8rem', color:'var(--t-slate)', lineHeight:1.6, maxWidth:'640px' }}>
                What the app captures during the excursion, and how to extend it into assessed work back in the classroom.
              </p>

              {/* ── AT Notification print row ── */}
              <div style={{ margin:'0 0 1.75rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', padding:'0.85rem 1rem', background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-md)', boxShadow:'var(--t-shadow-sm)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
                  <span style={{ fontSize:'0.68rem', fontWeight:800, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.12em' }}>Stage</span>
                  {[2,3,4,5].map(s => (
                    <button
                      key={s}
                      onClick={() => setPrintStage(s)}
                      style={{
                        width:30, height:30, borderRadius:'50%',
                        border: printStage === s ? `2px solid ${active.color}` : '1.5px solid var(--t-stone)',
                        background: printStage === s ? active.color : 'white',
                        color: printStage === s ? 'white' : 'var(--t-slate)',
                        fontWeight:800, fontSize:'0.75rem', cursor:'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        transition:'all 0.15s',
                      }}
                    >{s}</button>
                  ))}
                </div>
                <div style={{ width:1, height:24, background:'var(--t-stone)', flexShrink:0 }} />
                <button
                  onClick={() => openAssessmentTaskNotification(kla, printStage, 'in-excursion', null)}
                  style={{
                    display:'flex', alignItems:'center', gap:'0.45rem',
                    background: active.color, color:'white',
                    border:'none', borderRadius:999,
                    padding:'0.45rem 1rem', fontSize:'0.75rem', fontWeight:700,
                    cursor:'pointer', letterSpacing:'0.04em',
                    boxShadow:`0 2px 8px ${active.color}40`,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 10v3a1 1 0 001 1h8a1 1 0 001-1v-3M8 2v8m0 0L5 7m3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Print In-Excursion AT Notification →
                </button>
                <span style={{ fontSize:'0.72rem', color:'var(--t-slate)' }}>Opens a print-ready Assessment Task Notification for Stage {printStage} {active.label}</span>
              </div>

              {/* ── Section 1: In-app evidence ── */}
              <h3 style={{ margin:'0 0 0.6rem', fontSize:'0.72rem', fontWeight:800, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.14em' }}>
                What the app captures
              </h3>
              <p style={{ margin:'0 0 0.85rem', fontSize:'0.78rem', color:'var(--t-slate)', lineHeight:1.6 }}>
                This data is generated automatically during the excursion and available in <strong style={{ color:'var(--t-deep)' }}>Class Insights</strong> the moment students complete each animal.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'2rem' }}>
                {evidence.map(ev => (
                  <div key={ev.metric} style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-md)', padding:'0.9rem 1.1rem', display:'grid', gridTemplateColumns:'auto 1fr', gap:'0 1rem', alignItems:'start' }}>
                    <div style={{ gridRow:'1 / 3', display:'flex', alignItems:'center', justifyContent:'center', width:36, height:36, borderRadius:10, background:active.light, flexShrink:0, marginTop:'0.1rem' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="9" width="2.5" height="5" rx="1" fill={active.color}/>
                        <rect x="6.5" y="6" width="2.5" height="8" rx="1" fill={active.color} opacity="0.7"/>
                        <rect x="11" y="3" width="2.5" height="11" rx="1" fill={active.color} opacity="0.4"/>
                      </svg>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700, color:'var(--t-deep)', fontSize:'0.86rem' }}>{ev.metric}</span>
                      <span style={{ fontSize:'0.68rem', color:active.color, background:active.light, border:`1px solid ${active.color}30`, borderRadius:999, padding:'0.1rem 0.55rem', fontWeight:700 }}>Class Insights</span>
                    </div>
                    <div>
                      <p style={{ margin:'0.2rem 0 0.25rem', fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.55 }}>{ev.what}</p>
                      <p style={{ margin:0, fontSize:'0.71rem', color:'var(--t-slate)', fontStyle:'italic' }}>{ev.where}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Section 2: Post-visit tasks ── */}
              <h3 style={{ margin:'0 0 0.6rem', fontSize:'0.72rem', fontWeight:800, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.14em' }}>
                Post-visit assessment tasks
              </h3>
              <p style={{ margin:'0 0 0.85rem', fontSize:'0.78rem', color:'var(--t-slate)', lineHeight:1.6 }}>
                Tasks that use the in-app evidence as a starting point. Each one is tagged with the stages it suits best.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.75rem' }}>
                {tasks.map(task => {
                  const fmtColor = FORMAT_COLORS[task.format] || '#6B6B62';
                  return (
                    <div key={task.title} style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', overflow:'hidden', boxShadow:'var(--t-shadow-sm)' }}>
                      {/* Card header */}
                      <div style={{ padding:'0.85rem 1.1rem 0.7rem', borderBottom:'1px solid var(--t-foam)', display:'flex', alignItems:'flex-start', gap:'0.75rem', flexWrap:'wrap' }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.25rem' }}>
                            <span style={{ fontWeight:700, color:'var(--t-deep)', fontSize:'0.9rem' }}>{task.title}</span>
                          </div>
                          <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap' }}>
                            {task.stages.map(s => (
                              <span key={s} style={{ display:'inline-block', background:`${STAGE_COLORS[s]}18`, color:STAGE_COLORS[s], border:`1px solid ${STAGE_COLORS[s]}40`, borderRadius:999, padding:'0.1rem 0.5rem', fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.06em' }}>{s}</span>
                            ))}
                            <span style={{ display:'inline-block', background:`${fmtColor}12`, color:fmtColor, border:`1px solid ${fmtColor}35`, borderRadius:999, padding:'0.1rem 0.55rem', fontSize:'0.65rem', fontWeight:700 }}>{task.format}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const firstStage = parseInt(task.stages[0].replace('S', ''), 10);
                            openAssessmentTaskNotification(kla, firstStage, 'post-visit', task);
                          }}
                          style={{
                            flexShrink:0,
                            display:'flex', alignItems:'center', gap:'0.35rem',
                            background: active.light, color: active.color,
                            border:`1px solid ${active.color}40`,
                            borderRadius:999, padding:'0.3rem 0.75rem',
                            fontSize:'0.68rem', fontWeight:700,
                            cursor:'pointer', letterSpacing:'0.03em',
                            whiteSpace:'nowrap',
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 10v3a1 1 0 001 1h8a1 1 0 001-1v-3M8 2v8m0 0L5 7m3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Print AT ↓
                        </button>
                      </div>
                      {/* Card body */}
                      <div style={{ padding:'0.8rem 1.1rem', display:'grid', gridTemplateColumns:'1fr auto', gap:'0.75rem', alignItems:'start' }}>
                        <p style={{ margin:0, fontSize:'0.8rem', color:'var(--t-charcoal)', lineHeight:1.65 }}>{task.desc}</p>
                        <div style={{ flexShrink:0, minWidth:180, background:active.light, borderRadius:'var(--t-r-md)', padding:'0.6rem 0.8rem', border:`1px solid ${active.color}25` }}>
                          <div style={{ fontSize:'0.62rem', fontWeight:800, color:active.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.3rem' }}>App evidence</div>
                          <p style={{ margin:0, fontSize:'0.74rem', color:'var(--t-deep)', lineHeight:1.5 }}>{task.appLink}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tip footer */}
              <div style={{ background:'linear-gradient(135deg,rgba(26,82,56,0.06),rgba(46,125,85,0.08))', border:'1px solid rgba(46,125,85,0.2)', borderRadius:'var(--t-r-lg)', padding:'1.1rem 1.3rem', display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1.5rem' }}>
                <div style={{ fontSize:'1.25rem', flexShrink:0, lineHeight:1, marginTop:'0.1rem' }}>💡</div>
                <div>
                  <div style={{ fontWeight:700, color:'var(--t-deep)', fontSize:'0.83rem', marginBottom:'0.25rem' }}>Using AI scores as evidence</div>
                  <p style={{ margin:0, fontSize:'0.77rem', color:'var(--t-slate)', lineHeight:1.65 }}>
                    Every AI score in Class Insights is a starting point, not a final judgement. Use the <strong>score override</strong> on any student's response to apply your own professional marking. The AI rationale and improvement tips are visible alongside each score — these can feed directly into written feedback or report comments.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
