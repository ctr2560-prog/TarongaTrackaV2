import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { getStageScaffoldTip, getMinWords } from '../utils/helpers';

// Per-animal heading / chip / bullet config for stage 3+
const OBS_CONFIG = {
  'chimpanzee': {
    heading: 'Chimpanzee Group Dynamics',
    chips: [{ label:'Grooming', color:'#059669' },{ label:'Communication', color:'#0284C7' },{ label:'Group roles', color:'#2E7D55' },{ label:'Relationships', color:'#DC2626' }],
    bullets: ['Social interactions (e.g. grooming, playing, aggression)','Communication (e.g. gestures, sounds, facial expressions)','Group roles (e.g. leader, dominant individuals, young)','Relationships between individuals'],
  },
  'gorilla': {
    heading: 'Gorilla Reflection',
    chips: [{ label:'Posture', color:'#059669' },{ label:'Expression', color:'#0284C7' },{ label:'Movement', color:'#2E7D55' },{ label:'Social bonds', color:'#DC2626' }],
    bullets: ['Body language and posture','How they move and interact','Facial expressions or sounds','Links to human behaviour'],
  },
  'lion': {
    heading: 'Conservation Reflection',
    chips: [{ label:'Ecosystem', color:'#059669' },{ label:'Food chain', color:'#0284C7' },{ label:'Biodiversity', color:'#2E7D55' },{ label:'Threats', color:'#DC2626' }],
    bullets: [],
  },
  'giraffe': {
    heading: 'Giraffe Adaptations',
    chips: [{ label:'Height', color:'#059669' },{ label:'Neck', color:'#0284C7' },{ label:'Colouring', color:'#2E7D55' },{ label:'Feeding', color:'#DC2626' }],
    bullets: ['What physical features you can observe','How those features help the giraffe survive','What the giraffe is doing right now','How the environment supports it'],
  },
  'lemur': {
    heading: 'Lemur Enclosure Use',
    chips: [{ label:'Position', color:'#2E7D55' },{ label:'Behaviour', color:'#059669' },{ label:'Height', color:'#0284C7' },{ label:'Movement', color:'#DC2626' }],
    bullets: ['Where the lemurs are in the enclosure (ground, trees, platforms)','What they are doing in those areas','How they move between spaces','What needs (feeding, resting, social) are being met'],
  },
  'dingo': {
    heading: 'Dingo Camouflage',
    chips: [{ label:'Fur colour', color:'#D97706' },{ label:'Texture', color:'#059669' },{ label:'Environment', color:'#0284C7' },{ label:'Blending in', color:'#DC2626' }],
    bullets: ["The colour and texture of the dingo's fur",'The colour of the surrounding environment','How well the dingo blends in','How camouflage helps the dingo survive'],
  },
  'sea-lion': {
    heading: 'Humans and the Ocean',
    chips: [{ label:'Water', color:'#0284C7' },{ label:'Enclosure', color:'#059669' },{ label:'Human impact', color:'#DC2626' },{ label:'Ocean health', color:'#2E7D55' }],
    bullets: ['What you can observe in the water and enclosure','Signs of human presence or human-made structures','How human activities may affect sea lion health','What a healthy ocean environment looks like'],
  },
  'asian-water-buffalo': {
    heading: 'Helpful Relationships',
    chips: [{ label:'Nearby animals', color:'#059669' },{ label:'Interactions', color:'#0284C7' },{ label:'Positioning', color:'#2E7D55' },{ label:'Mutualism', color:'#DC2626' }],
    bullets: ['Other animals nearby (e.g. birds, other species)','How those animals interact with the buffalo','Where they are positioned relative to each other','Why this relationship may benefit one or both animals'],
  },
  'blue-mountains-bushwalk': {
    heading: 'Listen to the Environment',
    chips: [{ label:'Sounds', color:'#059669' },{ label:'Volume', color:'#0284C7' },{ label:'Nature', color:'#2E7D55' },{ label:'Feeling', color:'#DC2626' }],
    bullets: ['Specific sounds you could hear (birds, wind, leaves)','How loud or quiet the environment was','How the sounds made you feel','How this compares to a built environment'],
  },
  'concert-lawn': {
    heading: 'Habitat Experience',
    chips: [{ label:'Texture', color:'#059669' },{ label:'Temperature', color:'#0284C7' },{ label:'Feel', color:'#2E7D55' },{ label:'Compare', color:'#DC2626' }],
    bullets: ['What the ground felt like (soft, cool, uneven)','The temperature of the grass','How this environment differs from concrete or hard surfaces','What you noticed about the natural environment'],
  },
  'koala': {
    heading: 'Koala Behaviour',
    chips: [{ label:'Behaviour', color:'#059669' },{ label:'Position', color:'#0284C7' },{ label:'Adaptation', color:'#2E7D55' },{ label:'Survival', color:'#DC2626' }],
    bullets: ['What behaviour you can observe right now','Why the koala behaves this way','How this helps it survive','What adaptations you can see'],
  },
  'tiger': {
    heading: 'Silent Forest',
    chips: [{ label:'Sounds', color:'#059669' },{ label:'Smells', color:'#0284C7' },{ label:'Habitat', color:'#2E7D55' },{ label:'Senses', color:'#DC2626' }],
    bullets: ['Sounds you can hear (water, animals, people)','Smells in the environment (fresh, earthy, strong)','What you can see around the habitat','How the environment supports the tiger'],
  },
};

const S1_QUESTIONS = {
  'chimpanzee':            'What are the chimpanzees doing together?',
  'gorilla':               'How does the gorilla look like a human?',
  'lion':                  'Why do we need to look after lions?',
  'giraffe':               'Why is the giraffe tall?',
  'koala':                 'What does the koala look like? What is it doing?',
  'tiger':                 'What did you hear or smell around the habitat?',
  'dingo':                 "What colour is the dingo's fur?",
  'lemur':                 'Where are the lemurs in their home?',
  'sea-lion':              'How do people affect sea lions?',
  'asian-water-buffalo':   'What other animals are near the buffalo?',
  'concert-lawn':          'How did the ground feel on your feet?',
  'blue-mountains-bushwalk': 'What could you hear?',
};

const S1_CUES = {
  'koala':                    ['What does it look like?','What is it doing?'],
  'lion':                     ['What are people doing?','How can we help?'],
  'tiger':                    ['What could you hear?','Could you smell anything?'],
  'giraffe':                  ['What is it reaching?','Why is it tall?'],
  'gorilla':                  ['How big is it?','What is it doing?'],
  'chimpanzee':               ['Are they together?','What are they doing?'],
  'dingo':                    ['What colour is it?','What does its fur look like?'],
  'lemur':                    ['Where is it?','What is it doing?'],
  'sea-lion':                 ['What is in the water?','What are people doing?'],
  'asian-water-buffalo':      ['What do its feet look like?','Is it big or small?'],
  'concert-lawn':             ['How did it feel?','Was it soft or hard?'],
  'blue-mountains-bushwalk':  ['What could you hear?','Was it quiet or loud?'],
};

const PLACEHOLDER_S5 = {
  'koala':                    'The koala is adapting to its environment by…',
  'lion':                     'Humans impact lions by… This is important because…',
  'tiger':                    'I observed the tiger… This relates to its behaviour because…',
  'giraffe':                  "The giraffe's height helps it survive by…",
  'gorilla':                  'The gorilla\'s behaviour shows… This suggests…',
  'chimpanzee':               'Social behaviour helps chimpanzees because…',
  'dingo':                    'The dingo\'s appearance is an adaptation because…',
  'lemur':                    'The lemurs use this space because…',
  'sea-lion':                 'Human activities affect sea lions by…',
  'asian-water-buffalo':      'The relationship I observed helps survival because…',
  'concert-lawn':             'This environment felt this way because…',
  'blue-mountains-bushwalk':  'What I heard reflects this environment because…',
};

const PLACEHOLDER_MID = {
  'chimpanzee':   'I observed that…',
  'gorilla':      'I noticed that the gorillas…',
  'giraffe':      "I noticed that the giraffe's … helps it to…",
  'concert-lawn': 'The grass felt…',
  'lemur':        'The lemurs are using…',
  'dingo':        "The dingo's fur is…",
  'asian-water-buffalo': 'I can see…',
  'sea-lion':     'Humans can…',
  'blue-mountains-bushwalk': 'I could hear…',
};

export default function ObservationScreen() {
  const { classStage } = useApp();
  const { currentAnimal, observation, setObservation, submitObservation } = useStudent();

  // Timer state for Bushwalk + Concert Lawn overlays
  const [bushwalkTimerSeconds, setBushwalkTimerSeconds] = useState(30);
  const [bushwalkTimerActive,  setBushwalkTimerActive]  = useState(false);
  const [bushwalkTimerDone,    setBushwalkTimerDone]    = useState(false);

  const [concertLawnTimerSeconds, setConcertLawnTimerSeconds] = useState(60);
  const [concertLawnTimerActive,  setConcertLawnTimerActive]  = useState(false);
  const [concertLawnTimerDone,    setConcertLawnTimerDone]    = useState(false);

  const [tigerTimerSeconds, setTigerTimerSeconds] = useState(30);
  const [tigerTimerActive,  setTigerTimerActive]  = useState(false);
  const [tigerTimerDone,    setTigerTimerDone]    = useState(false);

  // Camera overlay for measurement reference
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef  = useRef(null);
  const streamRef = useRef(null);

  const animalId = currentAnimal?.id;
  const minWords = getMinWords(classStage);
  const wordCount = observation.trim().match(/\b\w+\b/g)?.length || 0;

  // Bushwalk countdown
  useEffect(() => {
    if (!bushwalkTimerActive || bushwalkTimerDone) return;
    if (bushwalkTimerSeconds <= 0) { setBushwalkTimerDone(true); return; }
    const t = setTimeout(() => setBushwalkTimerSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [bushwalkTimerActive, bushwalkTimerSeconds, bushwalkTimerDone]);

  // Concert lawn countdown
  useEffect(() => {
    if (!concertLawnTimerActive || concertLawnTimerDone) return;
    if (concertLawnTimerSeconds <= 0) { setConcertLawnTimerDone(true); return; }
    const t = setTimeout(() => setConcertLawnTimerSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [concertLawnTimerActive, concertLawnTimerSeconds, concertLawnTimerDone]);

  // Tiger Silent Forest countdown
  useEffect(() => {
    if (!tigerTimerActive || tigerTimerDone) return;
    if (tigerTimerSeconds <= 0) { setTigerTimerDone(true); return; }
    const t = setTimeout(() => setTigerTimerSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [tigerTimerActive, tigerTimerSeconds, tigerTimerDone]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      alert('Camera unavailable on this device.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  };

  useEffect(() => () => stopCamera(), []);

  const cfg    = OBS_CONFIG[animalId];
  const prompt = (currentAnimal?.writingPromptByStage?.[classStage]) || currentAnimal?.observationPrompt || '';
  const tip    = getStageScaffoldTip(classStage);

  // Placeholder text
  const placeholder = classStage <= 2
    ? 'I saw…'
    : classStage === 5
      ? (PLACEHOLDER_S5[animalId] || 'Based on my observation…')
      : (PLACEHOLDER_MID[animalId] || 'Describe what you observe in detail…');

  const s1q   = S1_QUESTIONS[animalId]  || 'What did you see?';
  const s1cues = S1_CUES[animalId]      || ['What did you see?','What was it doing?'];
  const chipsList = animalId === 'concert-lawn' ? [
    { label:'What did it feel like?', color:'var(--jungle-light)' },
    { label:'Soft, hard, warm, or cold?', color:'var(--discovery-blue)' },
    { label:'What was under your feet?', color:'var(--sunset-orange)' },
  ] : animalId === 'blue-mountains-bushwalk' ? [
    { label:'What did you hear?', color:'var(--jungle-light)' },
    { label:'Was it loud or quiet?', color:'var(--discovery-blue)' },
    { label:'What made the sound?', color:'var(--sunset-orange)' },
  ] : classStage === 5 ? [
    { label:'What did you observe?', color:'var(--jungle-light)' },
    { label:'Why does this happen?', color:'var(--discovery-blue)' },
    { label:'How does this help survive?', color:'var(--sunset-orange)' },
  ] : [
    { label:'What did you see?', color:'var(--jungle-light)' },
    { label:'What is it doing?', color:'var(--discovery-blue)' },
    { label:'Where is it?', color:'var(--sunset-orange)' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--mist-light)', paddingBottom:'4rem' }}>

      {/* Camera overlay */}
      {cameraActive && (
        <div style={{ position:'fixed', inset:0, background:'#000', zIndex:2000, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width:'100%', maxHeight:'70vh', objectFit:'cover' }} />
          <button onClick={stopCamera} style={{ marginTop:'1rem', padding:'0.75rem 2rem', background:'var(--sunset-orange)', color:'white', border:'none', borderRadius:'30px', fontWeight:700, fontSize:'1rem', cursor:'pointer' }}>
            Close Camera
          </button>
        </div>
      )}

      {/* Bushwalk listening timer */}
      {animalId === 'blue-mountains-bushwalk' && !bushwalkTimerDone && (
        <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#1a3a2a 0%,#2e5c3e 100%)', zIndex:1900, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white', textAlign:'center' }}>
          <h2 className="heading-display" style={{ fontSize:'2.5rem', marginBottom:'0.8rem' }}>Listen to the Environment</h2>
          <p style={{ fontSize:'1.1rem', opacity:0.9, maxWidth:'500px', lineHeight:1.7, marginBottom:'0.5rem' }}>Close your eyes and listen carefully.</p>
          <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'14px', padding:'1rem 1.4rem', maxWidth:'460px', marginBottom:'2rem', textAlign:'left' }}>
            <p style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.5rem' }}>Focus on:</p>
            {['natural sounds (wind, birds, leaves)','distant sounds','how the environment feels'].map((pt, i) => (
              <p key={i} style={{ fontSize:'0.82rem', opacity:0.8, margin:'0.1rem 0', paddingLeft:'0.8rem' }}>– {pt}</p>
            ))}
            <p style={{ fontSize:'0.8rem', opacity:0.65, fontStyle:'italic', marginTop:'0.6rem', marginBottom:0 }}>Stay still and let the environment come to you.</p>
          </div>
          <h3 style={{ fontSize:'5rem', fontWeight:800, marginBottom:'1.5rem', fontVariantNumeric:'tabular-nums', color: bushwalkTimerSeconds <= 10 ? '#FFEB3B' : 'white' }}>
            {bushwalkTimerSeconds}
          </h3>
          {!bushwalkTimerActive
            ? <button onClick={() => setBushwalkTimerActive(true)}
                style={{ padding:'0.9rem 2.5rem', borderRadius:'var(--t-r-pill)', border:'none', background:'var(--sunset-orange)', color:'white', fontWeight:700, fontSize:'1.1rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
                Start Listening
              </button>
            : <p style={{ fontSize:'0.9rem', opacity:0.85, fontWeight:600 }}>Listening now… stay still.</p>
          }
        </div>
      )}

      {/* Concert lawn experience timer */}
      {animalId === 'concert-lawn' && !concertLawnTimerDone && (
        <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#1a3a2a 0%,#2e5c3e 100%)', zIndex:1900, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white', textAlign:'center' }}>
          <h2 className="heading-display" style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>Habitat Experience</h2>
          <p style={{ fontSize:'1.1rem', opacity:0.9, maxWidth:'500px', lineHeight:1.7, marginBottom:'0.5rem' }}>Scientists use their senses to understand environments, not just their eyes.</p>
          <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'14px', padding:'1rem 1.4rem', maxWidth:'460px', marginBottom:'2rem', textAlign:'left' }}>
            <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.4rem' }}>Take your shoes off (if safe to do so)</p>
            <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.6rem' }}>⏱ Walk on the grass for 60 seconds</p>
            <p style={{ fontSize:'0.82rem', opacity:0.85, marginBottom:'0.3rem', fontWeight:600 }}>As you walk, think about:</p>
            {['how the ground feels','the temperature','the texture','how this environment differs from hard surfaces'].map((pt, i) => (
              <p key={i} style={{ fontSize:'0.82rem', opacity:0.8, margin:'0.1rem 0', paddingLeft:'0.8rem' }}>– {pt}</p>
            ))}
          </div>
          <h3 style={{ fontSize:'5rem', fontWeight:800, marginBottom:'1.5rem', fontVariantNumeric:'tabular-nums', color: concertLawnTimerSeconds <= 10 ? '#FFEB3B' : 'white' }}>
            {concertLawnTimerSeconds}
          </h3>
          {!concertLawnTimerActive
            ? <button onClick={() => setConcertLawnTimerActive(true)}
                style={{ padding:'0.9rem 2.5rem', borderRadius:'var(--t-r-pill)', border:'none', background:'var(--sunset-orange)', color:'white', fontWeight:700, fontSize:'1.1rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
                ▶ Start Timer
              </button>
            : <p style={{ fontSize:'0.9rem', opacity:0.85, fontWeight:600 }}>Walk on the grass now…</p>
          }
        </div>
      )}

      {/* Tiger Silent Forest countdown */}
      {animalId === 'tiger' && !tigerTimerDone && (
        <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#1a3a2a 0%,#2e5c3e 100%)', zIndex:1900, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white', textAlign:'center' }}>
          <h2 className="heading-display" style={{ fontSize:'2.5rem', marginBottom:'0.8rem' }}>Silent Forest</h2>
          <p style={{ fontSize:'1.1rem', opacity:0.9, maxWidth:'500px', lineHeight:1.7, marginBottom:'2rem' }}>Stop and experience the world around you. Put the iPad down and observe the habitat.</p>
          <h3 style={{ fontSize:'5rem', fontWeight:800, marginBottom:'1.5rem', fontVariantNumeric:'tabular-nums', color: tigerTimerSeconds <= 10 ? '#FFEB3B' : 'white' }}>
            {tigerTimerSeconds}
          </h3>
          {!tigerTimerActive
            ? <button onClick={() => setTigerTimerActive(true)}
                style={{ padding:'0.9rem 2.5rem', borderRadius:'var(--t-r-pill)', border:'none', background:'var(--sunset-orange)', color:'white', fontWeight:700, fontSize:'1.1rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
                Start Observing
              </button>
            : <p style={{ fontSize:'0.9rem', opacity:0.85, fontWeight:600 }}>Observe now… stay still and listen.</p>
          }
        </div>
      )}

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,var(--t-forest) 0%,var(--t-deep) 60%,var(--t-mid) 100%)', padding:'0.85rem 1rem', boxShadow:'var(--t-shadow-md)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'center', alignItems:'center' }}>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'52px', width:'auto', filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} onError={e => e.target.style.display='none'} />
        </div>
      </div>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'2rem 1.25rem 4rem' }}>
        <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'2rem 2.25rem', boxShadow:'var(--t-shadow-md)', border:'1px solid var(--t-stone)' }}>

          {/* Stage 1–2: simple prompt */}
          {classStage <= 2 && (
            <>
              <h2 className="heading-display" style={{ fontSize:'1.8rem', color:'var(--jungle-deep)', marginBottom:'0.6rem', textAlign:'center' }}>{s1q}</h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem', justifyContent:'center', marginBottom:'1.4rem' }}>
                {chipsList.map((chip, i) => (
                  <div key={i} style={{ background:`${chip.color}18`, border:`1.5px solid ${chip.color}40`, borderRadius:'var(--t-r-pill)', padding:'0.45rem 0.9rem', fontSize:'0.9rem', fontWeight:700, color:chip.color }}>{chip.label}</div>
                ))}
              </div>
            </>
          )}

          {/* Stage 3+: per-animal heading + prompt */}
          {classStage > 2 && cfg && (
            <>
              <h2 className="heading-display" style={{ fontSize:'1.75rem', color:'var(--jungle-deep)', marginBottom:'0.4rem', textAlign:'center' }}>{cfg.heading}</h2>
              {prompt && <p style={{ fontSize:'1rem', fontWeight:600, color:'#333', marginBottom:'1rem', textAlign:'center', lineHeight:1.45 }}>{prompt}</p>}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', justifyContent:'center', marginBottom:'1.25rem' }}>
                {cfg.chips.map((chip, i) => (
                  <div key={i} style={{ background:`${chip.color}12`, border:`1.5px solid ${chip.color}35`, borderRadius:'var(--t-r-pill)', padding:'0.35rem 0.8rem', fontSize:'0.8rem', fontWeight:600, color:chip.color }}>{chip.label}</div>
                ))}
              </div>
              {classStage >= 4 && <p style={{ fontSize:'0.82rem', color:'#aaa', marginBottom:'1rem', textAlign:'center', fontStyle:'italic' }}>Use specific evidence from your observation.</p>}
              {animalId === 'blue-mountains-bushwalk' && bushwalkTimerDone && (
                <div style={{ background:'#D1FAE5', borderRadius:'var(--t-r-sm)', padding:'0.4rem 0.9rem', marginBottom:'0.75rem', textAlign:'center' }}>
                  <p style={{ fontSize:'0.82rem', fontWeight:700, color:'#065F46', margin:0 }}>✓ Listening complete — write your response below</p>
                </div>
              )}
              {animalId === 'tiger' && tigerTimerDone && (
                <div style={{ background:'#D1FAE5', borderRadius:'var(--t-r-sm)', padding:'0.4rem 0.9rem', marginBottom:'0.75rem', textAlign:'center' }}>
                  <p style={{ fontSize:'0.82rem', fontWeight:700, color:'#065F46', margin:0 }}>✓ Observation complete — write your response below</p>
                </div>
              )}
            </>
          )}

          {/* Textarea */}
          <textarea value={observation} onChange={e => setObservation(e.target.value)}
            placeholder={placeholder}
            style={{ width:'100%', minHeight:'200px', padding:'1.25rem 1.4rem', borderRadius:'var(--t-r-md)', border:'2px solid var(--t-stone)', fontSize:'1.05rem', fontFamily:'DM Sans, sans-serif', resize:'vertical', transition:'border-color 0.22s ease, box-shadow 0.22s ease', lineHeight:1.65, color:'var(--t-ink)', background:'var(--t-parchment)', outline:'none', boxSizing:'border-box' }}
            onFocus={e => { e.target.style.borderColor='var(--t-mid)'; e.target.style.boxShadow='0 0 0 3px rgba(26,82,56,0.1)'; }}
            onBlur={e  => { e.target.style.borderColor='var(--t-stone)'; e.target.style.boxShadow='none'; }} />

          {/* Stage 1–2 sentence starter */}
          {classStage <= 2 && (
            <>
              <div style={{ background:'var(--t-foam)', border:'1px solid var(--t-mist)', borderRadius:'var(--t-r-sm)', padding:'0.6rem 1rem', marginTop:'0.6rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <span style={{ fontSize:'0.85rem', color:'#555' }}>Try starting with:</span>
                <span style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--jungle-deep)', fontStyle:'italic' }}>"I saw…"</span>
              </div>
              <div style={{ background:'#F7FAF8', border:'1px solid #D4E8DC', borderRadius:'var(--t-r-md)', padding:'0.9rem 1.1rem', marginTop:'0.75rem' }}>
                <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#059669', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.5rem' }}>You could write:</p>
                {['I saw…','It was…'].map((s, i) => (
                  <p key={i} style={{ fontSize:'0.78rem', color:'#555', margin:'0.1rem 0', paddingLeft:'0.5rem', fontStyle:'italic' }}>"{s}"</p>
                ))}
                <p style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--jungle-mid)', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0.6rem 0 0.3rem' }}>Think about:</p>
                {s1cues.map((cue, i) => (
                  <p key={i} style={{ fontSize:'0.78rem', color:'#555', margin:'0.1rem 0', paddingLeft:'0.5rem' }}>– {cue}</p>
                ))}
              </div>
            </>
          )}

          {/* Stage 3+ scaffold tip */}
          {classStage > 2 && (
            <div style={{ background:'#F7FAF8', border:'1px solid #D4E8DC', borderRadius:'var(--t-r-md)', padding:'0.9rem 1.1rem', marginTop:'0.75rem' }}>
              {cfg?.bullets?.length > 0 ? (
                <>
                  <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#059669', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>You may include:</p>
                  <ul style={{ margin:'0 0 0.5rem', paddingLeft:'1.1rem', fontSize:'0.8rem', color:'#555', lineHeight:1.8 }}>
                    {cfg.bullets.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </>
              ) : (
                <>
                  <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#059669', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>{tip.header}</p>
                  {tip.points.length > 0 && (
                    <ul style={{ margin:'0 0 0.5rem', paddingLeft:'1.1rem', fontSize:'0.8rem', color:'#555', lineHeight:1.8 }}>
                      {tip.points.map((pt, i) => <li key={i}>{pt}</li>)}
                    </ul>
                  )}
                </>
              )}
              <p style={{ fontSize:'0.73rem', fontWeight:600, color:'var(--jungle-mid)', marginBottom:'0.2rem' }}>Sentence starters:</p>
              {tip.starters.map((s, i) => (
                <p key={i} style={{ fontSize:'0.75rem', color:'#555', margin:'0.1rem 0', paddingLeft:'0.5rem', fontStyle:'italic' }}>"{s}"</p>
              ))}
            </div>
          )}

          {/* Word counter + submit */}
          <div style={{ marginTop:'1rem', fontSize:'1rem', color: wordCount >= minWords ? 'var(--jungle-light)' : '#E86A33', fontWeight:600 }}>
            {wordCount}/{minWords} words
          </div>
          <button onClick={submitObservation} disabled={wordCount < minWords}
            style={{ width:'100%', padding:'1.1rem 2rem', borderRadius:'var(--t-r-pill)', border:'none',
              background: wordCount >= minWords ? 'linear-gradient(135deg,var(--t-eucalyptus) 0%,var(--t-mid) 100%)' : 'rgba(0,0,0,0.12)',
              color:'white', fontSize:'1.05rem', fontWeight:700, cursor: wordCount >= minWords ? 'pointer' : 'not-allowed',
              transition:'all 0.25s ease', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:'1.75rem',
              boxShadow: wordCount >= minWords ? '0 6px 20px rgba(26,82,56,0.4)' : 'none' }}>
            {wordCount < minWords ? 'Write More to Continue' : 'Submit & Earn Badge'}
          </button>
        </div>
      </div>
    </div>
  );
}
