import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import MathsCalculator from '../../components/MathsCalculator';

const ZOOM_OPTIONS_SCIENCE = ['2×', '5×', '10×'];
const ZOOM_OPTIONS_OTHER   = ['1×', '2×', '3×', '4×'];
const ZOOM_SCALE = { '1×':1, '2×':2, '3×':3, '4×':4, '5×':5, '10×':10 };

// English: zoom level → imagery MCQ about what students can see at that zoom
const ZOOM_IMAGERY_MCQ = {
  '1×': {
    q: 'You can see the whole lion. Which sentence uses the best imagery to describe its overall appearance?',
    options: ['The lion is large and golden in colour', 'The lion sat very still and watched us', 'The lion blazed like a living flame, a statue of gold and shadow', 'The lion is an apex predator that hunts large prey'],
    correct: 2,
    fact: '"Blazed like a living flame" and "statue of gold and shadow" are strong visual images. They make the reader feel the lion\'s colour and stillness in a vivid, unexpected way rather than just describing facts.',
  },
  '2×': {
    q: "Zoomed in, you can see the lion's mane and face. Which sentence uses the best imagery to describe what you see?",
    options: ["The lion has a large mane around its face", "The lion's mane is dark and fluffy looking", "The lion's mane fell like a storm cloud, dark and heavy as thunder about to break", "The mane protects the lion's neck during fights with rivals"],
    correct: 2,
    fact: '"Fell like a storm cloud, dark and heavy as thunder" uses weather imagery to describe the mane\'s weight, darkness and sense of power. Good imagery makes the reader feel something, not just see it.',
  },
  '3×': {
    q: "Zoomed in closer, you can see the lion's coat. Which sentence uses the best imagery to describe its texture and colour?",
    options: ["The lion's coat is golden brown in colour", "The lion's fur looks soft and quite warm", "The lion's coat rippled like sun-warmed sand, each hair a brushstroke of amber and gold", "The coat keeps the lion warm during cold savannah nights"],
    correct: 2,
    fact: '"Rippled like sun-warmed sand" gives the coat movement and warmth. "Each hair a brushstroke of amber and gold" makes it feel painted and alive. Strong imagery stacks sensory details to create a rich, layered picture.',
  },
  '4×': {
    q: "At maximum zoom, you can see the lion's eyes. Which sentence uses the best imagery to describe them?",
    options: ["The lion's eyes are yellow with a dark pupil", "The lion's eyes look very focused and intense", "The lion's eyes burned like two amber coals, ancient and unblinking", "Lions have excellent eyesight that helps them hunt at night"],
    correct: 2,
    fact: '"Burned like two amber coals" gives the eyes heat and permanence. "Ancient and unblinking" layers meaning on top, so the reader feels not just the look of the eyes but the weight of the lion\'s intelligence behind them.',
  },
};

const SCIENCE_CONTENT = {
  1: {
    task: 'Select 2× zoom and hold the camera steady on the lion for 5 seconds.',
    formula: null,
    hints: [
      'The 2× button makes everything appear twice as big.',
      'Keep your camera pointed at the lion and hold still.',
    ],
    correctIdx: 0, // 2×
  },
  2: {
    task: 'Which zoom level makes the image appear 5 times bigger?\nSelect it and hold for 5 seconds.',
    formula: 'Magnification = zoom level',
    hints: [
      'The number on the button IS the magnification.',
      '5× zoom means everything looks 5 times larger than normal.',
    ],
    correctIdx: 1, // 5×
  },
  3: {
    task: "A lion's eye is 4 cm wide. You want it to appear 20 cm on screen.\n\nM = 20 ÷ 4 = ___\n\nSelect that zoom level and hold for 5 seconds.",
    formula: 'Magnification (M) = Image size ÷ Actual size',
    hints: [
      '20 ÷ 4 = 5',
      'So M = 5. Select 5× zoom.',
    ],
    correctIdx: 1, // 5×
  },
  4: {
    task: "A lion's claw is about 2 cm long. A scientist needs to photograph it so it appears 10 cm long to study its structure.\n\nSelect the correct zoom level and hold for 5 seconds.",
    formula: 'Magnification (M) = Desired size ÷ Actual size',
    hints: [
      '10 ÷ 2 = 5',
      'So M = 5. Select 5× zoom.',
    ],
    correctIdx: 1, // 5×
  },
  5: {
    task: "A feature on the lion's skin is 0.1 mm wide. Scientists need to see it at 1 mm.\n\nM = 1 ÷ 0.1 = ___\n\nSelect that zoom level and hold for 5 seconds.",
    formula: 'Magnification (M) = Image size ÷ Actual size',
    hints: [
      '1 ÷ 0.1 = 10',
      'So M = 10. Select 10× zoom.',
    ],
    correctIdx: 2, // 10×
  },
};

const HOLD_SECS = 5;
const CIRC = 2 * Math.PI * 28;

export default function LionMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const isEnglish  = classSubject === 'english';
  const isScience  = classSubject !== 'pdhpe' && classSubject !== 'english';
  const content    = SCIENCE_CONTENT[classStage] || SCIENCE_CONTENT[4];
  const zoomOptions = isScience ? ZOOM_OPTIONS_SCIENCE : ZOOM_OPTIONS_OTHER;

  const currentQuestion     = getStageQuestions(currentAnimal, classStage, classSubject)[0];
  const stageQuestion       = currentQuestion?.stageVariants?.[classStage] || currentQuestion?.q || '';
  const stageOptions        = currentQuestion?.stageOptions?.[classStage] || currentQuestion?.options || [];
  const stageCorrectIdx     = currentQuestion?.stageCorrect?.[classStage] ?? currentQuestion?.correct ?? 0;
  const fact                = currentQuestion?.stageFacts?.[classStage] || currentQuestion?.fact;

  const [zoom,            setZoom]            = useState(isScience ? null : '1×');

  const englishMcq  = isEnglish && zoom ? ZOOM_IMAGERY_MCQ[zoom] : null;
  const displayQ    = isEnglish ? (englishMcq?.q    || 'Select a zoom level above to observe the lion, then answer here.') : stageQuestion;
  const displayOpts = isEnglish ? (englishMcq?.options || []) : stageOptions;
  const displayCorr = isEnglish ? (englishMcq?.correct ?? 2) : stageCorrectIdx;
  const displayFact = isEnglish ? (englishMcq?.fact || fact) : fact;
  const [selectedZoomIdx, setSelectedZoomIdx] = useState(null);
  const [holdSeconds,     setHoldSeconds]     = useState(0);
  const [hintsOpen,       setHintsOpen]       = useState(false);
  const [cameraError,     setCameraError]     = useState(false);
  const [frontCam,        setFrontCam]        = useState(false);

  const videoRef       = useRef(null);
  const streamRef      = useRef(null);
  const holdTimerRef   = useRef(null);
  const facingModeRef  = useRef('environment');
  const selectedIdxRef = useRef(null);

  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingModeRef.current, width:{ ideal:1280 }, height:{ ideal:720 } },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch {
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const flipCamera = () => {
    const newFront = !frontCam;
    facingModeRef.current = newFront ? 'user' : 'environment';
    setFrontCam(newFront);
    stopCamera();
    setTimeout(() => startCamera(), 80);
  };

  useEffect(() => { startCamera(); return () => stopCamera(); }, []);

  const handleBack = () => { stopCamera(); setCurrentScreen('map'); };

  const selectZoom = (label, idx) => {
    setZoom(label);
    setSelectedZoomIdx(idx);
    selectedIdxRef.current = idx;
    setHoldSeconds(0);
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    let secs = 0;
    holdTimerRef.current = setInterval(() => {
      secs += 1;
      setHoldSeconds(secs);
      if (secs >= HOLD_SECS) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
        handleQuizAnswer(0, selectedIdxRef.current, content.correctIdx);
      }
    }, 1000);
  };

  const resetZoom = () => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    setSelectedZoomIdx(null);
    setHoldSeconds(0);
    setZoom(null);
  };

  const scale        = ZOOM_SCALE[zoom] || 1;
  const holdProgress = Math.min((holdSeconds / HOLD_SECS) * 100, 100);

  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : '#0A0900', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>

      {/* Navbar */}
      <div style={{ background:'linear-gradient(to right,#1A0E00,#3D2A00)', padding:'0.55rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,180,50,0.2)', flex:'0 0 auto', zIndex:100 }}>
        <button onClick={handleBack} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', color:'white', padding:'0.35rem 0.8rem', borderRadius:'40px', cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>← Back</button>
        <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
        <div style={{ width:'70px' }} />
      </div>

      {/* Result overlay */}
      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color: isCorrect ? '#10b981' : '#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>
            {isCorrect ? 'Correct!' : 'Not Quite'}
          </h2>
          {isCorrect && <p style={{ fontSize:'clamp(0.95rem,2.2vh,1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>Great observation!</p>}
          {!isCorrect && (
            <p style={{ fontSize:'clamp(0.9rem,2vh,1rem)', color:'#555', marginBottom:'0.8rem', lineHeight:1.6 }}>
              {isScience
                ? 'Use the formula to calculate the correct magnification, then try again.'
                : isEnglish
                ? "Look at the lion's colour, eyes and mane — think about which sentence creates the most vivid picture."
                : "Zoom in and look closely at the lion's body — think about what it needs to catch prey."}
            </p>
          )}
          {isCorrect && displayFact && (
            <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {displayFact}</p>
            </div>
          )}
          <button
            onClick={() => {
              if (isCorrect) { stopCamera(); handleNextQuestion(1); }
              else { setIsProcessingAnswer(false); setShowResult(false); if (isScience) resetZoom(); }
            }}
            style={{ background: isCorrect ? 'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))' : 'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Observation →' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Main content */}
      {!showResult && (
        <div style={{ flex:'1 1 0', minHeight:0, display:'flex', flexDirection:'column' }}>

          {/* Camera */}
          <div style={{ flex:'1 1 0', minHeight:0, position:'relative', background:'#0A0900', overflow:'hidden' }}>
            {cameraError ? (
              <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', color:'rgba(255,255,255,0.7)' }}>
                <span style={{ fontSize:'3rem' }}>🦁</span>
                <p style={{ fontSize:'0.9rem', textAlign:'center', padding:'0 2rem', lineHeight:1.6 }}>
                  {isScience
                    ? 'Camera unavailable — use the formula below to calculate the correct zoom level.'
                    : isEnglish
                    ? 'Camera unavailable — answer the imagery question below using what you know about lions.'
                    : 'Camera unavailable — answer the question below using your knowledge of the lion.'}
                </p>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted
                style={{ width:'100%', height:'100%', objectFit:'cover', transform:`scale(${scale}) scaleX(${frontCam ? -1 : 1})`, transformOrigin:'center', transition:'transform 0.3s ease', display:'block' }} />
            )}

            {/* Instruction banner */}
            <div style={{ position:'absolute', top:'0.75rem', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.65)', borderRadius:'40px', padding:'0.35rem 1rem', whiteSpace:'nowrap', backdropFilter:'blur(4px)' }}>
              <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.85)', fontWeight:600 }}>
                {isScience
                  ? 'Calculate the correct zoom, select it and hold for 5 seconds'
                  : isEnglish
                  ? "Zoom in to observe the lion's coat, eyes and mane — then answer below"
                  : "Zoom in to observe the lion's muscles, then answer below"}
              </span>
            </div>

            {/* Active zoom badge */}
            {zoom && (
              <div style={{ position:'absolute', top:'0.75rem', right:'0.75rem', background:'rgba(0,0,0,0.6)', color:'rgba(255,180,50,0.9)', fontSize:'0.7rem', fontWeight:700, padding:'0.25rem 0.6rem', borderRadius:'var(--t-r-xs)', border:'1px solid rgba(255,180,50,0.3)' }}>
                {zoom}
              </div>
            )}

            {/* Hold-timer ring */}
            {isScience && selectedZoomIdx !== null && (
              <div style={{ position:'absolute', bottom:'4.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.35rem' }}>
                <div style={{ width:'64px', height:'64px', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg style={{ position:'absolute', inset:0, transform:'rotate(-90deg)' }} viewBox="0 0 64 64" width="64" height="64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,180,50,0.2)" strokeWidth="5" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,180,50,0.95)" strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      strokeDashoffset={CIRC * (1 - holdProgress / 100)}
                      style={{ transition:'stroke-dashoffset 0.85s linear' }}
                    />
                  </svg>
                  <span style={{ fontSize:'1.5rem', fontWeight:800, color:'rgba(255,180,50,0.95)', lineHeight:1 }}>
                    {holdSeconds >= HOLD_SECS ? '✓' : HOLD_SECS - holdSeconds}
                  </span>
                </div>
                <span style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.75)', fontWeight:600, background:'rgba(0,0,0,0.5)', padding:'0.1rem 0.45rem', borderRadius:'4px' }}>
                  Hold steady…
                </span>
              </div>
            )}

            {!cameraError && (
              <button onClick={flipCamera} style={{ position:'absolute', bottom:'1rem', right:'1rem', width:'60px', height:'60px', borderRadius:'50%', border:'2.5px solid rgba(255,255,255,0.75)', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(10px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.05rem', cursor:'pointer', zIndex:5, boxShadow:'0 4px 16px rgba(0,0,0,0.4)' }}>
                <span style={{ fontSize:'1.8rem', color:'white', lineHeight:1 }}>⟳</span>
                <span style={{ fontSize:'0.55rem', fontWeight:800, color:'rgba(255,255,255,0.9)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Flip</span>
              </button>
            )}

            {/* Zoom buttons */}
            <div style={{ position:'absolute', bottom:'0.75rem', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'0.4rem' }}>
              {zoomOptions.map((z, idx) => (
                <button key={z}
                  onClick={() => isScience ? selectZoom(z, idx) : setZoom(z)}
                  style={{ padding:'0.4rem 0.75rem', borderRadius:'40px', border: zoom === z ? '2px solid rgba(255,180,50,0.9)' : '2px solid rgba(255,255,255,0.25)', background: zoom === z ? 'rgba(180,100,0,0.85)' : 'rgba(0,0,0,0.55)', color: zoom === z ? 'white' : 'rgba(255,255,255,0.75)', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', transition:'all 0.15s', backdropFilter:'blur(4px)' }}>
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom panel — science */}
          {isScience && (
            <div style={{ flexShrink:0, background:'white', borderTop:'1px solid #eee', maxHeight:'46vh', overflowY:'auto' }}>
              <div style={{ padding:'0.85rem 1rem 0.5rem' }}>
                {content.formula && (
                  <div style={{ background:'linear-gradient(135deg,#FFF9E6,#FFE6B3)', borderRadius:'8px', padding:'0.5rem 0.85rem', marginBottom:'0.6rem', border:'1px solid rgba(201,169,110,0.4)' }}>
                    <p style={{ fontSize:'0.6rem', fontWeight:800, color:'#92400E', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 0.2rem' }}>Formula</p>
                    <p style={{ fontSize:'0.88rem', fontWeight:700, color:'#78350F', margin:0, fontFamily:'monospace' }}>{content.formula}</p>
                  </div>
                )}
                {content.task.split('\n').map((line, i) => (
                  line.trim() === '' ? null :
                  <p key={i} style={{
                    fontSize: line.includes('M =') ? '1rem' : '0.85rem',
                    color: line.includes('M =') ? '#1A5238' : '#333',
                    fontWeight: line.includes('M =') ? 700 : 600,
                    fontFamily: line.includes('M =') ? 'monospace' : 'inherit',
                    margin: '0 0 0.25rem',
                    lineHeight: 1.5,
                  }}>{line}</p>
                ))}
              </div>
              <div style={{ padding:'0 1rem 0.5rem' }}>
                <button
                  onClick={() => setHintsOpen(o => !o)}
                  style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#F0F9F4', border:'1px solid #D4E8DC', borderRadius: hintsOpen ? '8px 8px 0 0' : '8px', padding:'0.55rem 0.85rem', cursor:'pointer', color:'#059669', fontWeight:700, fontSize:'0.8rem', textAlign:'left' }}>
                  <span>💡 Hint</span>
                  <span style={{ fontSize:'0.65rem' }}>{hintsOpen ? '▲' : '▼'}</span>
                </button>
                {hintsOpen && (
                  <div style={{ background:'#F7FAF8', border:'1px solid #D4E8DC', borderTop:'none', borderRadius:'0 0 8px 8px', padding:'0.6rem 0.85rem' }}>
                    {content.hints.map((h, i) => (
                      <p key={i} style={{ fontSize:'0.8rem', color:'#555', margin: i === 0 ? 0 : '0.25rem 0 0', lineHeight:1.5 }}>
                        <span style={{ color:'#059669', fontWeight:700 }}>{i + 1}. </span>{h}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ padding:'0 1rem 0.85rem' }}>
                <MathsCalculator />
              </div>
            </div>
          )}

          {/* Bottom panel — PDHPE / English */}
          {!isScience && (
            <div style={{ flexShrink:0, background:'white', borderTop:'1px solid #eee', padding:'0.85rem 1rem', zIndex:10 }}>
              <p style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'0.6rem', textAlign:'center' }}>
                {displayQ}
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                {displayOpts.map((opt, i) => (
                  <button key={i} onClick={() => handleQuizAnswer(0, i, displayCorr)}
                    style={{ padding:'0.7rem 0.5rem', borderRadius:'var(--t-r-sm)', border:'2px solid transparent', background:'#f4f8f6', color:'var(--jungle-deep)', fontSize:'0.8rem', fontWeight:600, cursor:'pointer', textAlign:'left', transition:'all 0.15s', lineHeight:1.3 }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
