import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUBJ_META } from '../data/slideDecks';

// ─── Motion presets ───────────────────────────────────────────────────────────

const slideVariants = {
  enter:  dir => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: ()  => ({ x: 0, opacity: 1 }),
  exit:   dir => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

const fadeUp = {
  hidden:  { y: 28, opacity: 0 },
  visible: (i = 0) => ({
    y: 0, opacity: 1,
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const LIME   = '#B6F61A';
const ORANGE = '#FF8C42';

// ─── Stage vocabulary chips ───────────────────────────────────────────────────

const STAGE_VERBS = {
  2: ['Observe', 'Describe', 'Notice', 'Share'],
  3: ['Analyse', 'Connect', 'Explain', 'Record'],
  4: ['Evaluate', 'Apply', 'Justify', 'Model'],
  5: ['Critique', 'Synthesise', 'Argue', 'Investigate'],
};

// ─── Phone frame component ────────────────────────────────────────────────────

function PhoneFrame({ src, label, stepNum, color, delay = 0 }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={delay}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.6rem', flex:1, minWidth:0 }}>
      {/* Step badge */}
      <div style={{ width:28, height:28, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <span style={{ color:'white', fontSize:'0.72rem', fontWeight:900 }}>{stepNum}</span>
      </div>

      {/* Phone shell */}
      <div style={{
        position:'relative',
        width:'100%', maxWidth:160,
        aspectRatio:'9/19',
        borderRadius:'clamp(14px,2.5vw,22px)',
        border:'2.5px solid rgba(255,255,255,0.22)',
        background:'#111',
        boxShadow:'0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)',
        overflow:'hidden',
        flexShrink:0,
      }}>
        {/* Notch */}
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'35%', height:'clamp(10px,1.8vw,14px)', background:'#111', borderRadius:'0 0 8px 8px', zIndex:2 }} />
        {/* Screenshot */}
        <img src={src} alt={label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
        {/* Glare */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)', pointerEvents:'none' }} />
      </div>

      {/* Label */}
      <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'clamp(0.6rem,1.1vw,0.72rem)', textAlign:'center', margin:0, lineHeight:1.35, fontWeight:600, maxWidth:140 }}>{label}</p>
    </motion.div>
  );
}

// ─── Slide type renderers ─────────────────────────────────────────────────────

function TitleSlide({ deck, sm }) {
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
      <img src={`/images/${deck.img}`} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(7,30,20,0.94) 0%, rgba(7,30,20,0.55) 55%, rgba(7,30,20,0.15) 100%)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(7,30,20,0.9) 0%, transparent 55%)' }} />

      <div style={{ position:'relative', padding:'clamp(1.5rem,4vw,3rem)', maxWidth:'68%' }}>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:sm.light, border:`1px solid ${sm.border}`, borderRadius:999, padding:'0.3rem 0.9rem', marginBottom:'0.7rem' }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:sm.color }} />
          <span style={{ color:sm.color, fontSize:'clamp(0.6rem,1.2vw,0.72rem)', fontWeight:800, letterSpacing:'0.07em', textTransform:'uppercase' }}>{SUBJ_META[deck.subject].label}</span>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.65rem', margin:'0 0.2rem' }}>·</span>
          <span style={{ color:deck.timing==='pre' ? '#60A5FA' : '#F472B6', fontSize:'clamp(0.6rem,1.2vw,0.72rem)', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>{deck.timing==='pre' ? 'Pre-Visit' : 'Post-Visit'}</span>
        </motion.div>

        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="taronga-title"
          style={{ color:'white', fontSize:'clamp(2rem,5.5vw,3.8rem)', margin:'0 0 0.5rem', lineHeight:1.08, textShadow:'0 2px 24px rgba(0,0,0,0.45)' }}>
          {deck.title}
        </motion.h1>

        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={1.6}
          style={{ color:'rgba(255,255,255,0.55)', fontSize:'clamp(0.72rem,1.4vw,0.88rem)', margin:'0 0 1rem', letterSpacing:'0.06em', textTransform:'uppercase' }}>
          Stage {deck.stage}  ·  Taronga Tracka
        </motion.p>

        {/* Stage skill verbs */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'0.9rem' }}>
          {STAGE_VERBS[deck.stage].map(v => (
            <span key={v} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:6, padding:'0.2rem 0.6rem', fontSize:'clamp(0.58rem,1.1vw,0.68rem)', color:'rgba(255,255,255,0.65)', fontWeight:700 }}>{v}</span>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2.4}
          style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
          {deck.outcomes.map(o => (
            <span key={o} style={{ background:`${sm.color}25`, border:`1px solid ${sm.color}50`, borderRadius:6, padding:'0.22rem 0.6rem', fontSize:'clamp(0.58rem,1.1vw,0.68rem)', color:sm.color, fontWeight:700 }}>{o}</span>
          ))}
        </motion.div>
      </div>

      <img src="/images/tracka-logo-white.png" alt="" style={{ position:'absolute', top:'1.5rem', right:'1.5rem', height:30, opacity:0.4 }} />
    </div>
  );
}

function LiScSlide({ slide, deck, sm }) {
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'linear-gradient(155deg, #071E14 0%, #0D2B1C 100%)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Faint animal silhouette background */}
      <img src={`/images/${deck.img}`} alt="" style={{ position:'absolute', right:'-5%', top:0, height:'100%', width:'50%', objectFit:'cover', objectPosition:'center top', opacity:0.07, filter:'blur(2px)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, #071E14 50%, transparent 100%)' }} />

      <div style={{ position:'relative', display:'flex', flexDirection:'column', height:'100%', padding:'clamp(1rem,3vw,1.75rem)', gap:'0.8rem' }}>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          style={{ background:`linear-gradient(135deg, ${sm.color} 0%, ${sm.color}cc 100%)`, borderRadius:12, padding:'0.85rem 1.2rem', boxShadow:`0 8px 32px ${sm.color}40` }}>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'clamp(0.58rem,1vw,0.68rem)', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', margin:'0 0 0.2rem' }}>Learning Intention</p>
          <p style={{ color:'white', fontSize:'clamp(0.88rem,1.9vw,1.08rem)', fontWeight:600, margin:0, lineHeight:1.45 }}>{slide.li}</p>
        </motion.div>

        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
          style={{ color:'rgba(255,255,255,0.45)', fontSize:'clamp(0.6rem,1vw,0.68rem)', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', margin:0 }}>
          Success Criteria — I can...
        </motion.p>

        <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem', flex:1, justifyContent:'center' }}>
          {slide.sc.map((item, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={1 + i * 0.4}
              style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${sm.border}`, borderLeft:`3px solid ${sm.color}`, borderRadius:'0 12px 12px 0', padding:'0.8rem 1rem', display:'flex', alignItems:'flex-start', gap:'0.8rem', backdropFilter:'blur(4px)' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg, ${sm.color}, ${sm.color}99)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 12px ${sm.color}50` }}>
                <span style={{ color:'white', fontSize:'0.75rem', fontWeight:900 }}>{i + 1}</span>
              </div>
              <p style={{ color:'rgba(255,255,255,0.92)', fontSize:'clamp(0.82rem,1.7vw,0.98rem)', margin:0, lineHeight:1.5 }}>{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Preview Slide ────────────────────────────────────────────────────────

const PRE_STEPS = [
  { src:'/images/screenshots/app-home.png',        label:'Open the app & join your class with the student code' },
  { src:'/images/screenshots/app-map.png',         label:'Navigate the zoo map to find an animal enclosure' },
  { src:'/images/screenshots/mission-2.png',       label:'Read the mission brief & start your observation' },
  { src:'/images/screenshots/app-collection.png',  label:'Earn badges & points for each animal you complete' },
];

const POST_STEPS = [
  { src:'/images/screenshots/app-map.png',                           label:'The animals you navigated to at the zoo' },
  { src:'/images/screenshots/mission-3.png',                         label:'Observations you completed during the visit' },
  { src:'/images/screenshots/app-collection.png',                    label:'Badges & points you earned on the day' },
  { src:'/images/teacher-tutorial/analytics-overview.png',           label:'Your teacher can see every score in the dashboard' },
];

function AppPreviewSlide({ deck, sm }) {
  const isPre = deck.timing === 'pre';
  const steps = isPre ? PRE_STEPS : POST_STEPS;

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'linear-gradient(160deg, #030E08 0%, #071E14 60%, #0D2B1C 100%)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Subtle grid texture */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(46,125,85,0.08) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        style={{ position:'relative', background:`linear-gradient(135deg, ${sm.color} 0%, ${sm.color}bb 100%)`, padding:'0.8rem clamp(1rem,3vw,1.75rem)', display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="white" opacity="0.9">
          <rect x="1" y="3" width="11" height="8" rx="1.5"/><rect x="8" y="9" width="11" height="8" rx="1.5" opacity="0.6"/>
        </svg>
        <div>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'clamp(0.58rem,1vw,0.66rem)', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', margin:0 }}>Taronga Tracka App</p>
          <p style={{ color:'white', fontSize:'clamp(0.85rem,1.9vw,1.05rem)', fontWeight:800, margin:0 }}>
            {isPre ? "Here's What You'll Do at the Zoo" : "Here's What You Did at the Zoo"}
          </p>
        </div>
      </motion.div>

      {/* Phone frames */}
      <div style={{ position:'relative', flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(0.75rem,2vw,1.25rem) clamp(0.5rem,2vw,1.5rem)', gap:'clamp(0.5rem,2vw,1.25rem)' }}>
        {steps.map((step, i) => (
          <PhoneFrame key={i} src={step.src} label={step.label} stepNum={i + 1} color={sm.color} delay={0.3 + i * 0.18} />
        ))}
      </div>

      {/* Bottom hint */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1.5}
        style={{ position:'relative', padding:'0.6rem clamp(1rem,3vw,1.75rem)', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'clamp(0.6rem,1.1vw,0.7rem)', margin:0 }}>
          {isPre ? 'Tracka runs on school iPads, shared devices, or your own phone at tarongatracka.com.au' : 'Your teacher can view all scores, observations and badges in the Class Dashboard'}
        </p>
      </motion.div>
    </div>
  );
}

function VideoSlide({ deck, sm }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'#030E08', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem', padding:'2rem', overflow:'hidden' }}>
      {/* Faint animal bg */}
      <img src={`/images/${deck.img}`} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.06, filter:'blur(8px)', transform:'scale(1.05)' }} />
      <div style={{ position:'absolute', inset:0, background:'rgba(3,14,8,0.7)' }} />

      <div style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem', maxWidth:500 }}>
        {/* Pulsing play */}
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <motion.div animate={{ scale: pulse ? 1.22 : 1, opacity: pulse ? 0.2 : 0.08 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ position:'absolute', width:'clamp(110px,20vw,150px)', height:'clamp(110px,20vw,150px)', borderRadius:'50%', background:sm.color }} />
          <motion.div animate={{ scale: pulse ? 1.08 : 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ width:'clamp(72px,12vw,96px)', height:'clamp(72px,12vw,96px)', borderRadius:'50%', background:`linear-gradient(135deg, ${sm.color}, ${sm.color}cc)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 48px ${sm.color}60, 0 8px 32px rgba(0,0,0,0.5)` }}>
            <svg width="34" height="34" viewBox="0 0 32 32" fill="white">
              <polygon points="10,6 28,16 10,26"/>
            </svg>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.4} style={{ textAlign:'center' }}>
          <p style={{ color:'white', fontSize:'clamp(1rem,2.5vw,1.3rem)', fontWeight:800, margin:'0 0 0.5rem' }}>
            {deck.timing === 'pre' ? 'Watch Before We Head to the Zoo' : 'Watch to Revisit the Zoo Experience'}
          </p>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'clamp(0.72rem,1.4vw,0.85rem)', margin:'0 0 1.2rem', lineHeight:1.65 }}>
            {deck.timing === 'pre'
              ? 'Insert a short clip introducing the animals students will observe — a Taronga keeper video, National Geographic clip, or documentary excerpt. Aim for 2–4 minutes. Pause at key moments to prompt discussion.'
              : 'Insert a short clip revisiting the animals students observed — footage from the visit, Taronga social content, or a conservation documentary. Aim for 2–4 minutes. Use as a reflection anchor.'}
          </p>
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'0.6rem 1rem', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/>
            </svg>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'clamp(0.62rem,1.1vw,0.72rem)', margin:0, fontStyle:'italic' }}>
              Teacher: right-click this slide → Insert Video to embed directly
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ContentSlide({ slide, deck, slideIndex, totalSlides, sm }) {
  const words = slide.heading.split(' ');
  const firstWord = words[0];
  const restWords = words.slice(1).join(' ');

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'#003D25', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Full-bleed animal image */}
      <img
        src={`/images/${deck.img}`}
        alt=""
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 20%', opacity:0.33 }}
      />
      {/* Strong left-to-right overlay — keeps text readable, lets image breathe on right */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(0,61,37,0.97) 0%, rgba(0,61,37,0.93) 45%, rgba(0,61,37,0.65) 70%, rgba(0,61,37,0.25) 100%)' }} />
      {/* Bottom vignette */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'25%', background:'linear-gradient(to top, rgba(0,61,37,0.6), transparent)', pointerEvents:'none' }} />

      {/* Content — left-anchored */}
      <div style={{ position:'relative', display:'flex', flexDirection:'column', height:'100%', padding:'clamp(1.8rem,4.5vw,3rem) clamp(1.8rem,4vw,2.8rem)', maxWidth:'74%', justifyContent:'center', gap:'clamp(1rem,2.5vw,1.6rem)' }}>

        {/* Heading: first word in LIME, rest in white */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div style={{ lineHeight:1.0, marginBottom:'0.5rem' }}>
            <span className="taronga-title" style={{ color:LIME, fontSize:'clamp(2.2rem,6vw,4.2rem)', fontWeight:900, display:'block', letterSpacing:'-0.02em' }}>
              {firstWord}
            </span>
            {restWords && (
              <span className="taronga-title" style={{ color:'white', fontSize:'clamp(2rem,5.5vw,3.8rem)', fontWeight:900, letterSpacing:'-0.02em' }}>
                {restWords}
              </span>
            )}
          </div>
          <div style={{ width:56, height:3, background:LIME, borderRadius:2 }} />
        </motion.div>

        {/* Full-sentence paragraph blocks */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(0.65rem,1.8vw,1rem)' }}>
          {slide.bullets.map((para, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={0.25 + i * 0.18}
              style={{ background:'rgba(0,0,0,0.28)', backdropFilter:'blur(10px)', borderRadius:14, padding:'clamp(0.85rem,2.2vw,1.15rem) clamp(1rem,2.5vw,1.4rem)', borderLeft:`4px solid ${LIME}` }}>
              <p style={{ color:'rgba(255,255,255,0.92)', fontSize:'clamp(0.88rem,1.8vw,1.05rem)', margin:0, lineHeight:1.72 }}>{para}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Counter + stage watermark — bottom right */}
      <div style={{ position:'absolute', bottom:'1.2rem', right:'1.5rem', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.2rem' }}>
        <span style={{ color:'rgba(255,255,255,0.22)', fontSize:'clamp(0.58rem,1vw,0.68rem)', fontWeight:700 }}>{slideIndex} / {totalSlides}</span>
        <span className="taronga-title" style={{ color:LIME, fontSize:'clamp(2.5rem,6vw,4.5rem)', opacity:0.1, letterSpacing:'-0.02em', lineHeight:1 }}>S{deck.stage}</span>
      </div>
    </div>
  );
}

function BrainBreakSlide({ slide }) {
  return (
    <div style={{ width:'100%', height:'100%', background:'linear-gradient(155deg, #1A1200 0%, #2D1E00 60%, #1A0F00 100%)', display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      {/* Decorative circles */}
      <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'60%', paddingBottom:'60%', borderRadius:'50%', background:'rgba(217,119,6,0.06)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-15%', left:'-8%', width:'45%', paddingBottom:'45%', borderRadius:'50%', background:'rgba(217,119,6,0.04)', pointerEvents:'none' }} />

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        style={{ position:'relative', background:'linear-gradient(135deg, #D97706, #B45309)', padding:'0.85rem clamp(1rem,3vw,1.75rem)', display:'flex', alignItems:'center', gap:'0.75rem', boxShadow:'0 8px 32px rgba(217,119,6,0.4)' }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" fill="rgba(255,255,255,0.2)"/>
          <path d="M11 7v4l3 2" stroke="rgba(26,18,0,0.8)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span style={{ color:'rgba(26,18,0,0.85)', fontSize:'clamp(0.8rem,1.8vw,1rem)', fontWeight:900, letterSpacing:'0.08em', textTransform:'uppercase' }}>Brain Break</span>
        <span style={{ color:'rgba(26,18,0,0.45)', fontSize:'clamp(0.62rem,1.1vw,0.72rem)', marginLeft:'auto' }}>3–5 min · everyone participates</span>
      </motion.div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'clamp(1rem,3vw,2rem) clamp(1.2rem,3.5vw,2rem)', gap:'1rem' }}>
        <motion.h2 variants={fadeUp} initial="hidden" animate="visible" custom={0.4}
          className="taronga-title"
          style={{ color:'#D97706', fontSize:'clamp(1.8rem,4.5vw,2.8rem)', margin:0, lineHeight:1.05, textShadow:'0 4px 24px rgba(217,119,6,0.4)' }}>
          {slide.name}
        </motion.h2>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.8}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(217,119,6,0.25)', borderLeft:'3px solid #D97706', borderRadius:'0 14px 14px 0', padding:'clamp(0.9rem,2.5vw,1.3rem) clamp(1rem,3vw,1.5rem)', backdropFilter:'blur(4px)' }}>
          <p style={{ color:'rgba(255,255,255,0.88)', fontSize:'clamp(0.88rem,1.9vw,1.08rem)', margin:0, lineHeight:1.7 }}>{slide.instruction}</p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Applied Learning / Planning slide ───────────────────────────────────────

const PRE_INSTRUCTIONS = [
  'Look at the Taronga zoo map on your device or on the board — find the enclosures you\'ll visit on the excursion.',
  'In your exercise book or on the planning sheet, write down 3 animals you most want to observe.',
  'For each animal, write ONE specific thing you will focus on — a behaviour, a feature, or a question.',
  'Open Taronga Tracka and check your student code is working before you leave school.',
];

const POST_INSTRUCTIONS_BY_FORMAT = {
  poster:       ['Choose your animal and create a title and key question','Research one additional fact to add to what you observed','Sketch your layout: title, image, 3 sections, fact card','Create the poster and prepare a 60-second verbal explanation'],
  video:        ['Write a 60-second script based on your observation + one new fact','Film in short segments: introduction, evidence, conclusion','Edit clips together and add captions or narration','Upload to your class folder and complete the peer feedback form'],
  report:       ['Reread your Tracka observation and highlight the strongest evidence','Write a plan: introduction → 2–3 body sections → conclusion','Write the full report, referencing your observation as evidence','Proofread and submit — check word count against the brief'],
  default:      ['Choose your format: poster, video, report, model, or presentation','Identify your strongest observation from Tracka as your starting evidence','Plan your structure before you start creating','Present your work to the class — include what you would do differently next time'],
};

function getPostInstructions(actionTitle) {
  const t = actionTitle.toLowerCase();
  if (t.includes('video') || t.includes('film')) return POST_INSTRUCTIONS_BY_FORMAT.video;
  if (t.includes('report') || t.includes('brief') || t.includes('essay')) return POST_INSTRUCTIONS_BY_FORMAT.report;
  if (t.includes('poster')) return POST_INSTRUCTIONS_BY_FORMAT.poster;
  return POST_INSTRUCTIONS_BY_FORMAT.default;
}

function AppliedSlide({ slide, deck, sm }) {
  const isPre = slide.variant === 'pre';
  const instructions = isPre ? PRE_INSTRUCTIONS : getPostInstructions(slide.actionTitle || '');

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'linear-gradient(155deg, #071E14 0%, #0D2B1C 100%)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Subtle animal bg */}
      <img src={`/images/${deck.img}`} alt="" style={{ position:'absolute', right:0, bottom:0, height:'60%', width:'40%', objectFit:'cover', objectPosition:'center', opacity:0.08, filter:'blur(4px)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, #071E14 55%, rgba(7,30,20,0.6) 100%)' }} />

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        style={{ position:'relative', background:`linear-gradient(135deg, ${sm.color} 0%, ${sm.color}cc 100%)`, padding:'0.8rem clamp(1rem,3vw,1.75rem)', flexShrink:0 }}>
        <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'clamp(0.58rem,1vw,0.66rem)', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 0.1rem' }}>
          {isPre ? 'Planning Session' : 'Action Project'}
        </p>
        <h2 style={{ color:'white', fontSize:'clamp(0.88rem,2vw,1.12rem)', fontWeight:900, margin:0 }}>
          {isPre ? 'Getting Ready for the Zoo' : slide.actionTitle}
        </h2>
      </motion.div>

      <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column', padding:'clamp(0.75rem,2vw,1.2rem) clamp(1rem,3vw,1.75rem)', gap:'clamp(0.45rem,1.2vw,0.7rem)', overflow:'hidden' }}>

        {/* Action project description (post only) */}
        {!isPre && slide.actionDesc && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
            style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${sm.border}`, borderRadius:10, padding:'0.65rem 0.9rem', marginBottom:'0.2rem' }}>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'clamp(0.72rem,1.45vw,0.85rem)', margin:0, lineHeight:1.6 }}>{slide.actionDesc}</p>
          </motion.div>
        )}

        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.4}
          style={{ color:'rgba(255,255,255,0.4)', fontSize:'clamp(0.58rem,1vw,0.66rem)', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', margin:0 }}>
          {isPre ? 'Your step-by-step plan' : 'Step-by-step instructions'}
        </motion.p>

        {instructions.map((step, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={0.5 + i * 0.18}
            style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${sm.border}`, borderRadius:10, padding:'clamp(0.55rem,1.4vw,0.75rem) clamp(0.8rem,2vw,1rem)', display:'flex', alignItems:'flex-start', gap:'0.75rem', backdropFilter:'blur(4px)' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:`linear-gradient(135deg, ${sm.color}, ${sm.color}99)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 3px 10px ${sm.color}50` }}>
              <span style={{ color:'white', fontSize:'0.72rem', fontWeight:900 }}>{i + 1}</span>
            </div>
            <p style={{ color:'rgba(255,255,255,0.88)', fontSize:'clamp(0.78rem,1.6vw,0.93rem)', margin:0, lineHeight:1.5 }}>{step}</p>
          </motion.div>
        ))}

        {/* Format chips (post only) */}
        {!isPre && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1.3}
            style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginTop:'0.15rem' }}>
            {['Poster','Video','Model','Report','Presentation','Campaign'].map(f => (
              <span key={f} style={{ background:`${sm.color}18`, border:`1px solid ${sm.border}`, borderRadius:999, padding:'0.22rem 0.65rem', fontSize:'clamp(0.6rem,1.1vw,0.7rem)', color:sm.color, fontWeight:800 }}>{f}</span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ExitTicketSlide({ slide, deck }) {
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'linear-gradient(155deg, #0F0F00 0%, #1A1A06 60%, #0F0E00 100%)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, right:0, width:'35%', height:'100%' }}>
        <img src={`/images/${deck.img}`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 20%', opacity:0.1, filter:'blur(3px)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, #0F0F00, rgba(15,15,0,0.4) 100%)' }} />
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
        style={{ position:'relative', background:'linear-gradient(135deg, #D97706, #B45309)', padding:'0.8rem clamp(1rem,3vw,1.75rem)', display:'flex', alignItems:'center', gap:'0.65rem', boxShadow:'0 8px 32px rgba(217,119,6,0.4)', flexShrink:0 }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="rgba(26,18,0,0.7)">
          <rect x="1" y="4" width="18" height="13" rx="2"/><path d="M7 4V2h6v2" strokeWidth="1.5" stroke="rgba(26,18,0,0.7)" fill="none"/>
        </svg>
        <span style={{ color:'rgba(26,18,0,0.85)', fontSize:'clamp(0.8rem,1.8vw,1rem)', fontWeight:900, letterSpacing:'0.06em', textTransform:'uppercase' }}>Exit Ticket</span>
        <span style={{ color:'rgba(26,18,0,0.45)', fontSize:'clamp(0.6rem,1.1vw,0.7rem)', marginLeft:'auto' }}>Hand in before leaving</span>
      </motion.div>

      <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:'clamp(0.75rem,2vw,1.1rem)', padding:'clamp(0.9rem,2.5vw,1.5rem) clamp(1rem,3vw,1.75rem)' }}>
        {slide.questions.map((q, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={0.35 + i * 0.4}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(217,119,6,0.25)', borderLeft:'3px solid #D97706', borderRadius:'0 14px 14px 0', padding:'clamp(0.85rem,2.5vw,1.1rem) clamp(1rem,3vw,1.3rem)', display:'flex', gap:'0.85rem', alignItems:'flex-start', backdropFilter:'blur(4px)' }}>
            <div style={{ width:30, height:30, background:'linear-gradient(135deg, #D97706, #B45309)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(217,119,6,0.5)' }}>
              <span style={{ color:'rgba(26,18,0,0.85)', fontWeight:900, fontSize:'0.82rem' }}>Q{i + 1}</span>
            </div>
            <p style={{ color:'rgba(255,255,255,0.92)', fontSize:'clamp(0.85rem,1.8vw,1rem)', margin:0, lineHeight:1.6 }}>{q}</p>
          </motion.div>
        ))}

        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={1.2}
          style={{ color:'rgba(255,255,255,0.25)', fontSize:'clamp(0.6rem,1.1vw,0.7rem)', margin:0, textAlign:'center', marginTop:'0.3rem' }}>
          taronga.org.au  ·  tarongatracka.com.au
        </motion.p>
      </div>
    </div>
  );
}

// ─── Discussion slide ─────────────────────────────────────────────────────────

function DiscussionSlide({ slide, deck, sm }) {
  const isPre = deck.timing === 'pre';

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'#003D25', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Faint animal bg — right half only */}
      <img src={`/images/${deck.img}`} alt="" style={{ position:'absolute', right:0, top:0, height:'100%', width:'55%', objectFit:'cover', objectPosition:'center 25%', opacity:0.07, filter:'blur(6px)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, #003D25 42%, rgba(0,61,37,0.75) 100%)' }} />
      {/* Dot grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(${LIME}0a 1px, transparent 1px)`, backgroundSize:'30px 30px', pointerEvents:'none' }} />

      <div style={{ position:'relative', display:'flex', flexDirection:'column', height:'100%', padding:'clamp(1.1rem,2.8vw,1.8rem) clamp(1.2rem,3vw,2rem)' }}>

        {/* Header row */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.6rem', flexShrink:0 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:`${LIME}14`, border:`1.5px solid ${LIME}35`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
              <circle cx="8" cy="8" r="3.2" stroke={LIME} strokeWidth="1.7"/>
              <path d="M3.5 17c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke={LIME} strokeWidth="1.7" strokeLinecap="round"/>
              <circle cx="14.5" cy="7" r="2.2" stroke={LIME} strokeWidth="1.4" opacity="0.55"/>
              <path d="M16.5 12.5c1.8.7 3 2.3 3 4" stroke={LIME} strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
            </svg>
          </div>
          <div>
            <p style={{ color:LIME, fontSize:'clamp(0.58rem,1.05vw,0.68rem)', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', margin:0 }}>Teacher-Led Discussion</p>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'clamp(0.55rem,0.95vw,0.62rem)', margin:0 }}>{isPre ? '2–3 days before your Taronga Zoo visit' : '1–2 days after your Taronga Zoo visit'}</p>
          </div>
          <div style={{ marginLeft:'auto', background:`${LIME}10`, border:`1px solid ${LIME}28`, borderRadius:999, padding:'0.2rem 0.65rem', flexShrink:0 }}>
            <span style={{ color:LIME, fontSize:'clamp(0.55rem,0.95vw,0.62rem)', fontWeight:800, letterSpacing:'0.05em' }}>{sm.label} · Stage {deck.stage}</span>
          </div>
        </motion.div>

        {/* Big LIME heading */}
        <motion.h2 variants={fadeUp} initial="hidden" animate="visible" custom={0.12}
          className="taronga-title"
          style={{ color:LIME, fontSize:'clamp(1.7rem,4.2vw,2.9rem)', margin:'0 0 0.25rem', lineHeight:1.0, letterSpacing:'-0.02em', flexShrink:0 }}>
          {slide.heading}
        </motion.h2>

        {/* Context paragraph */}
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.22}
          style={{ color:'rgba(255,255,255,0.68)', fontSize:'clamp(0.78rem,1.5vw,0.92rem)', margin:'0 0 0.7rem', lineHeight:1.62, maxWidth:'80%', flexShrink:0 }}>
          {slide.context}
        </motion.p>

        {/* Discussion prompts */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.42rem', flex:1, overflow:'hidden' }}>
          {slide.prompts.map((prompt, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={0.3 + i * 0.1}
              style={{ display:'flex', gap:'0.65rem', alignItems:'flex-start', background:'rgba(255,255,255,0.04)', border:`1px solid ${LIME}18`, borderRadius:11, padding:'clamp(0.5rem,1.3vw,0.7rem) clamp(0.7rem,1.6vw,0.85rem)', backdropFilter:'blur(4px)' }}>
              <div style={{ width:24, height:24, borderRadius:7, background:`${LIME}14`, border:`1.5px solid ${LIME}38`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'0.05rem' }}>
                <span style={{ color:LIME, fontSize:'0.68rem', fontWeight:900 }}>{i + 1}</span>
              </div>
              <p style={{ color:'rgba(255,255,255,0.88)', fontSize:'clamp(0.76rem,1.5vw,0.9rem)', margin:0, lineHeight:1.55 }}>{prompt}</p>
            </motion.div>
          ))}
        </div>

        {/* Pre-only: Tracka concept note */}
        {isPre && slide.trackaNotes && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.68}
            style={{ background:`${LIME}09`, border:`1px solid ${LIME}22`, borderLeft:`3.5px solid ${LIME}`, borderRadius:'0 10px 10px 0', padding:'clamp(0.5rem,1.3vw,0.7rem) clamp(0.7rem,1.6vw,0.9rem)', marginTop:'0.55rem', flexShrink:0 }}>
            <p style={{ color:`${LIME}bb`, fontSize:'clamp(0.56rem,1vw,0.65rem)', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 0.18rem' }}>Taronga Tracka — What You'll Do</p>
            <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'clamp(0.74rem,1.38vw,0.84rem)', margin:0, lineHeight:1.55 }}>{slide.trackaNotes}</p>
          </motion.div>
        )}

        {/* Teacher note */}
        {slide.teacherNote && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.82}
            style={{ display:'flex', gap:'0.45rem', alignItems:'flex-start', background:`${ORANGE}0a`, border:`1px solid ${ORANGE}22`, borderRadius:9, padding:'clamp(0.42rem,1.1vw,0.58rem) clamp(0.65rem,1.4vw,0.8rem)', marginTop:'0.38rem', flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0, marginTop:'0.18rem' }}>
              <circle cx="8" cy="8" r="6.5" stroke={ORANGE} strokeWidth="1.4"/>
              <path d="M8 5v4M8 11.5v.5" stroke={ORANGE} strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            <p style={{ color:'rgba(255,255,255,0.46)', fontSize:'clamp(0.6rem,1.05vw,0.7rem)', margin:0, lineHeight:1.48, fontStyle:'italic' }}>
              <span style={{ color:ORANGE, fontWeight:700, fontStyle:'normal' }}>Teacher note: </span>
              {slide.teacherNote}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Slide router ─────────────────────────────────────────────────────────────

function SlideRenderer({ slide, deck, slideIndex, totalSlides, sm }) {
  switch (slide.type) {
    case 'title':        return <TitleSlide deck={deck} sm={sm} />;
    case 'li-sc':        return <LiScSlide slide={slide} deck={deck} sm={sm} />;
    case 'app-preview':  return <AppPreviewSlide deck={deck} sm={sm} />;
    case 'video':        return <VideoSlide deck={deck} sm={sm} />;
    case 'discussion':   return <DiscussionSlide slide={slide} deck={deck} sm={sm} />;
    case 'content':      return <ContentSlide slide={slide} deck={deck} slideIndex={slideIndex} totalSlides={totalSlides} sm={sm} />;
    case 'brain-break':  return <BrainBreakSlide slide={slide} />;
    case 'applied':      return <AppliedSlide slide={slide} deck={deck} sm={sm} />;
    case 'exit-ticket':  return <ExitTicketSlide slide={slide} deck={deck} />;
    default:             return null;
  }
}

// ─── Slide player ─────────────────────────────────────────────────────────────

const SLIDE_TYPE_LABELS = {
  'title':       'Title',
  'li-sc':       'LI & SC',
  'app-preview': 'App Preview',
  'video':       'Video',
  'discussion':  'Discussion',
  'content':     'Content',
  'brain-break': 'Break',
  'applied':     'Activity',
  'exit-ticket': 'Exit',
};

export default function SlidePlayer({ deck, onClose }) {
  const [index, setIndex]           = useState(0);
  const [dir,   setDir]             = useState(1);
  const [showOverview, setShowOverview] = useState(false);
  const touchStart = useRef(null);

  const sm    = SUBJ_META[deck.subject];
  const total = deck.slides.length;
  const slide = deck.slides[index];

  const goTo = useCallback((i, direction) => {
    setDir(direction);
    setIndex(i);
    setShowOverview(false);
  }, []);

  const next = useCallback(() => { if (index < total - 1) goTo(index + 1, 1);  }, [index, total, goTo]);
  const prev = useCallback(() => { if (index > 0)         goTo(index - 1, -1); }, [index, goTo]);

  useEffect(() => {
    const fn = e => {
      if (showOverview) { if (e.key === 'Escape') setShowOverview(false); return; }
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')                   { e.preventDefault(); prev(); }
      if (e.key === 'Escape')                       onClose();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [next, prev, onClose, showOverview]);

  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchStart.current = null;
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'#000', display:'flex', flexDirection:'column', fontFamily:'var(--t-font)' }}>

      {/* ── Top chrome ── */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.55rem 0.9rem', background:'rgba(0,0,0,0.8)', backdropFilter:'blur(10px)', flexShrink:0, zIndex:10, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={onClose}
          style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.08)', color:'white', width:30, height:30, borderRadius:999, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'0.9rem', transition:'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
          ✕
        </button>

        <div style={{ background:sm.color, borderRadius:999, padding:'0.2rem 0.65rem', fontSize:'0.63rem', fontWeight:900, color:'white', letterSpacing:'0.05em', textTransform:'uppercase', flexShrink:0 }}>
          {SUBJ_META[deck.subject].label}
        </div>
        <div style={{ background: deck.timing==='pre' ? '#1D4ED8' : '#9D174D', borderRadius:999, padding:'0.2rem 0.65rem', fontSize:'0.63rem', fontWeight:900, color:'white', letterSpacing:'0.05em', textTransform:'uppercase', flexShrink:0 }}>
          {deck.timing === 'pre' ? 'Pre-Visit' : 'Post-Visit'}
        </div>

        <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.78rem', fontWeight:600, flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {deck.title} — Stage {deck.stage}
        </span>

        <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.65rem', flexShrink:0, background:'rgba(255,255,255,0.06)', borderRadius:6, padding:'0.18rem 0.5rem' }}>
          {SLIDE_TYPE_LABELS[slide.type] || ''}
        </span>

        <button onClick={() => setShowOverview(s => !s)}
          style={{ background: showOverview ? sm.color : 'rgba(255,255,255,0.08)', border:`1px solid ${showOverview ? sm.color : 'rgba(255,255,255,0.1)'}`, color:'white', borderRadius:7, padding:'0.28rem 0.65rem', cursor:'pointer', fontSize:'0.65rem', fontWeight:700, flexShrink:0, fontFamily:'inherit', transition:'all 0.15s' }}>
          ⊞ Overview
        </button>

        <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.7rem', fontWeight:700, flexShrink:0 }}>
          {index + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:'rgba(255,255,255,0.06)', flexShrink:0 }}>
        <motion.div
          animate={{ width:`${((index + 1) / total) * 100}%` }}
          transition={{ duration:0.4, ease:'easeOut' }}
          style={{ height:'100%', background:`linear-gradient(to right, ${sm.color}, ${sm.color}cc)`, boxShadow:`0 0 8px ${sm.color}` }}
        />
      </div>

      {/* ── Slide area ── */}
      <div style={{ flex:1, position:'relative', overflow:'hidden' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`${deck.id}-${index}`}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration:0.38, ease:[0.32, 0, 0.18, 1] }}
            style={{ position:'absolute', inset:0 }}>
            <SlideRenderer
              slide={slide}
              deck={deck}
              slideIndex={index + 1}
              totalSlides={total}
              sm={sm}
            />
          </motion.div>
        </AnimatePresence>

        {/* Side nav hit areas */}
        {index > 0 && (
          <button onClick={prev}
            style={{ position:'absolute', left:0, top:0, bottom:0, width:'10%', background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'flex-start', paddingLeft:'0.75rem', opacity:0, transition:'opacity 0.2s', zIndex:5 }}
            onMouseEnter={e => e.currentTarget.style.opacity='1'}
            onMouseLeave={e => e.currentTarget.style.opacity='0'}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
            </div>
          </button>
        )}
        {index < total - 1 && (
          <button onClick={next}
            style={{ position:'absolute', right:0, top:0, bottom:0, width:'10%', background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:'0.75rem', opacity:0, transition:'opacity 0.2s', zIndex:5 }}
            onMouseEnter={e => e.currentTarget.style.opacity='1'}
            onMouseLeave={e => e.currentTarget.style.opacity='0'}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M6 3l5 5-5 5"/></svg>
            </div>
          </button>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', padding:'0.55rem', background:'rgba(0,0,0,0.75)', backdropFilter:'blur(10px)', flexShrink:0, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={prev} disabled={index === 0}
          style={{ background: index===0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.08)', color: index===0 ? 'rgba(255,255,255,0.18)' : 'white', borderRadius:999, padding:'0.42rem 1.1rem', cursor: index===0 ? 'not-allowed' : 'pointer', fontSize:'0.76rem', fontWeight:700, fontFamily:'inherit', display:'flex', alignItems:'center', gap:'0.4rem', transition:'all 0.15s' }}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
          Back
        </button>

        {/* Dot indicators */}
        <div style={{ display:'flex', gap:'0.28rem', alignItems:'center' }}>
          {deck.slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i, i > index ? 1 : -1)}
              style={{ width: i === index ? 20 : 6, height:6, borderRadius:999, background: i === index ? sm.color : 'rgba(255,255,255,0.18)', border:'none', cursor:'pointer', padding:0, transition:'all 0.25s', boxShadow: i===index ? `0 0 8px ${sm.color}` : 'none' }} />
          ))}
        </div>

        <button onClick={next} disabled={index === total - 1}
          style={{ background: index===total-1 ? 'rgba(255,255,255,0.04)' : `linear-gradient(135deg, ${sm.color}, ${sm.color}cc)`, border:'none', color: index===total-1 ? 'rgba(255,255,255,0.18)' : 'white', borderRadius:999, padding:'0.42rem 1.1rem', cursor: index===total-1 ? 'not-allowed' : 'pointer', fontSize:'0.76rem', fontWeight:700, fontFamily:'inherit', display:'flex', alignItems:'center', gap:'0.4rem', transition:'all 0.15s', boxShadow: index<total-1 ? `0 4px 16px ${sm.color}50` : 'none' }}>
          Next
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 3l5 5-5 5"/></svg>
        </button>
      </div>

      {/* ── Overview panel ── */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity:0, y:'100%' }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:'100%' }}
            transition={{ duration:0.32, ease:[0.32,0,0.18,1] }}
            style={{ position:'absolute', inset:0, background:'rgba(3,14,8,0.93)', backdropFilter:'blur(16px)', zIndex:20, display:'flex', flexDirection:'column', padding:'1rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.9rem' }}>
              <div>
                <span style={{ color:'white', fontWeight:800, fontSize:'0.9rem' }}>Slide Overview</span>
                <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.72rem', marginLeft:'0.6rem' }}>{total} slides</span>
              </div>
              <button onClick={() => setShowOverview(false)}
                style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', color:'white', borderRadius:999, width:28, height:28, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem' }}>
                ✕
              </button>
            </div>
            <div style={{ flex:1, overflowY:'auto', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))', gap:'0.55rem', alignContent:'start' }}>
              {deck.slides.map((s, i) => (
                <button key={i} onClick={() => goTo(i, i > index ? 1 : -1)}
                  style={{ background: i===index ? sm.color : 'rgba(255,255,255,0.05)', border:`1.5px solid ${i===index ? sm.color : 'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'0.7rem 0.65rem', cursor:'pointer', textAlign:'left', transition:'all 0.15s', fontFamily:'inherit', boxShadow: i===index ? `0 4px 16px ${sm.color}50` : 'none' }}>
                  <div style={{ color: i===index ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)', fontSize:'0.6rem', fontWeight:800, marginBottom:'0.3rem', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                    {String(i+1).padStart(2,'0')} · {SLIDE_TYPE_LABELS[s.type]}
                  </div>
                  <div style={{ color: i===index ? 'white' : 'rgba(255,255,255,0.7)', fontSize:'0.72rem', fontWeight:700, lineHeight:1.3 }}>
                    {s.type==='title' ? deck.title : s.type==='content' ? s.heading : s.type==='discussion' ? s.heading : s.type==='brain-break' ? s.name : SLIDE_TYPE_LABELS[s.type]}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
