import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import MathsCalculator from '../../components/MathsCalculator';

const GIRAFFE_MCQ = {
  stageQ: {
    1: 'How tall is a giraffe?',
    2: 'About how tall is a giraffe?',
    3: 'About how tall is the tallest giraffe?',
    4: 'How tall is the tallest giraffe?',
    5: 'How tall can an adult giraffe grow?',
  },
  options: ['1 m', '5 m', '12 m', '20 m'],
  correct: 1,
  fact: 'Adult giraffes can grow up to around 5–6 metres tall - the tallest land animals on Earth.',
};

const GIRAFFE_PDHPE_MCQ = {
  stageQ: {
    1: 'How far does a giraffe\'s heart pump blood up to its head?',
    2: 'About how far does a giraffe\'s heart need to pump blood to reach its brain?',
    3: 'A giraffe has a very long neck. How far must its heart pump blood to reach its brain?',
    4: 'How far must a giraffe\'s heart pump blood against gravity to maintain blood flow to its brain?',
    5: 'What is the approximate vertical distance a giraffe\'s heart must overcome to maintain cerebral perfusion?',
  },
  stageOptions: {
    1: ['0.3 m', '1 m', '3.7 m', '10 m'],
    2: ['0.5 m', '2 m', '3.7 m', '8 m'],
    3: ['1 m', '2.5 m', '3.7 m', '6 m'],
    4: ['1.8 m', '2.5 m', '3.7 m', '5.2 m'],
    5: ['2.5 m', '3.1 m', '3.7 m', '4.5 m'],
  },
  correct: 2,
  fact: 'A giraffe\'s heart pumps blood approximately 3.7 metres up to its brain - requiring blood pressure twice as high as a human\'s. This is why giraffes have the highest blood pressure of any land animal!',
};

export default function GiraffeMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const [photo, setPhoto]           = useState(null);
  const [measurement, setMeasurement] = useState(5.0);
  const [cameraError, setCameraError] = useState(false);

  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const mcq = classSubject === 'pdhpe' ? GIRAFFE_PDHPE_MCQ : GIRAFFE_MCQ;
  const correctAnswerIndex = mcq.correct;
  const question = mcq.stageQ[classStage] || mcq.stageQ[4];
  const options  = mcq.stageOptions ? (mcq.stageOptions[classStage] || mcq.stageOptions[4]) : mcq.options;
  const fact     = mcq.fact;

  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch {
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const capturePhoto = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (canvas && video) {
      canvas.width  = video.videoWidth  || 640;
      canvas.height = video.videoHeight || 480;
      canvas.getContext('2d').drawImage(video, 0, 0);
    }
    setPhoto(canvas?.toDataURL('image/jpeg', 0.85) || 'camera-error');
    stopCamera();
  };

  const handleRetake = () => {
    setPhoto(null);
    setIsProcessingAnswer(false);
    setShowResult(false);
    setTimeout(() => startCamera(), 80);
  };

  const handleBack = () => {
    if (photo) { handleRetake(); }
    else { stopCamera(); setCurrentScreen('map'); }
  };

  const rulerPct = 15 + ((measurement - 2.0) / 6.0) * 75;

  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
      <canvas ref={canvasRef} style={{ display:'none' }} />

      <div style={{ background:'linear-gradient(135deg,var(--jungle-deep) 0%,var(--jungle-mid) 100%)', padding:'0.6rem 1rem', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', flex:'0 0 auto', zIndex:100 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={handleBack} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>
            {photo ? '← Retake' : '← Back'}
          </button>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
          <div style={{ width:'70px' }} />
        </div>
      </div>

      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color: isCorrect ? '#10b981' : '#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>
            {isCorrect ? 'Correct!' : 'Not Quite'}
          </h2>
          {isCorrect && <p style={{ fontSize:'clamp(0.95rem,2.2vh,1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>Great estimation!</p>}
          {!isCorrect && <p style={{ fontSize:'clamp(0.9rem,2vh,1rem)', color:'#555', marginBottom:'0.8rem', lineHeight:1.6 }}>Look carefully at the scale - giraffes are much taller than most animals!</p>}
          {isCorrect && fact && (
            <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {fact}</p>
            </div>
          )}
          <button onClick={() => { if (isCorrect) { stopCamera(); handleNextQuestion(1); } else { setIsProcessingAnswer(false); setShowResult(false); setPhoto(null); setTimeout(() => startCamera(), 80); } }}
            style={{ background: isCorrect ? 'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))' : 'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Observation →' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Camera phase */}
      {!showResult && !photo && (
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
          <div style={{ flex:'1 1 auto', position:'relative', background:'#000A03', overflow:'hidden', minHeight:0 }}>
            {cameraError ? (
              <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', color:'rgba(255,255,255,0.7)' }}>
                <span style={{ fontSize:'3rem' }}>🦒</span>
                <p style={{ fontSize:'0.9rem', textAlign:'center', padding:'0 2rem', lineHeight:1.6 }}>Camera unavailable - tap Capture to proceed to the measuring and quiz step.</p>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
            )}
            <div style={{ position:'absolute', top:'0.75rem', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.65)', borderRadius:'40px', padding:'0.35rem 1rem', whiteSpace:'nowrap', backdropFilter:'blur(4px)' }}>
              <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.85)', fontWeight:600 }}>Zoom in so the giraffe fills the frame, then capture</span>
            </div>
          </div>
          <div style={{ flexShrink:0, background:'#050F07', padding:'1rem 1.25rem 1.25rem', borderTop:'1px solid rgba(120,200,80,0.15)' }}>
            <button onClick={capturePhoto}
              style={{ width:'100%', padding:'1rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#2A6A00,#1A4800)', color:'white', fontSize:'1rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.1em', boxShadow:'0 4px 20px rgba(40,100,0,0.5)' }}>
              Capture Photo
            </button>
          </div>
        </div>
      )}

      {/* Photo + measure + MCQ phase */}
      {!showResult && photo && (
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ flex:'1 1 auto', position:'relative', background:'#000A03', overflow:'hidden', minHeight:0 }}>
            {photo !== 'camera-error'
              ? <img src={photo} alt="Your giraffe" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>Adjust the slider below to estimate the giraffe's height</div>
            }
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', display:'flex', justifyContent:'center', alignItems:'center' }}>
              <div style={{ height:`${rulerPct}%`, position:'relative', display:'flex', flexDirection:'column', alignItems:'center', transition:'height 0.08s ease' }}>
                <div style={{ width:'44px', height:'3px', background:'rgba(100,230,140,0.95)', borderRadius:'2px', boxShadow:'0 0 8px rgba(100,230,140,0.7)', flexShrink:0 }} />
                <div style={{ position:'absolute', top:0, right:'calc(50% + 26px)', transform:'translateY(-50%)', fontSize:'0.65rem', fontWeight:800, color:'rgba(100,230,140,0.9)', letterSpacing:'0.1em', whiteSpace:'nowrap', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>HORNS</div>
                <div style={{ flex:1, width:'3px', background:'rgba(100,230,140,0.95)', boxShadow:'0 0 8px rgba(100,230,140,0.6)' }} />
                <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%) translateX(32px)', background:'rgba(10,47,31,0.85)', border:'1.5px solid rgba(100,230,140,0.4)', borderRadius:'40px', padding:'0.25rem 0.9rem', backdropFilter:'blur(8px)', whiteSpace:'nowrap' }}>
                  <span style={{ fontSize:'1.3rem', fontWeight:800, color:'white' }}>{measurement.toFixed(1)}</span>
                  <span style={{ fontSize:'0.85rem', fontWeight:600, color:'rgba(100,230,140,0.85)', marginLeft:'0.2rem' }}>m</span>
                </div>
                <div style={{ width:'44px', height:'3px', background:'rgba(100,230,140,0.95)', borderRadius:'2px', boxShadow:'0 0 8px rgba(100,230,140,0.7)', flexShrink:0 }} />
                <div style={{ position:'absolute', bottom:0, right:'calc(50% + 26px)', transform:'translateY(50%)', fontSize:'0.65rem', fontWeight:800, color:'rgba(100,230,140,0.9)', letterSpacing:'0.1em', whiteSpace:'nowrap', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>HOOVES</div>
              </div>
            </div>
          </div>

          <div style={{ flexShrink:0, background:'#050F07', padding:'0.5rem 1.25rem 0.6rem', borderTop:'1px solid rgba(120,200,80,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.25rem' }}>
              <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>2.0 m</span>
              <span style={{ fontSize:'0.68rem', color:'rgba(120,200,80,0.75)', fontWeight:700, letterSpacing:'0.04em' }}>ALIGN HORNS → HOOVES</span>
              <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>8.0 m</span>
            </div>
            <input type="range" min="2.0" max="8.0" step="0.1"
              value={measurement}
              onChange={e => setMeasurement(parseFloat(e.target.value))}
              style={{ width:'100%', accentColor:'#4CAF50' }} />
          </div>

          <div style={{ flexShrink:0, background:'white', borderTop:'1px solid #eee', padding:'0.85rem 1rem', zIndex:10 }}>
            <p style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'0.6rem', textAlign:'center' }}>
              {question}
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
              {options.map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(0, i, correctAnswerIndex)}
                  style={{ padding:'0.7rem 0.5rem', borderRadius:'var(--t-r-sm)', border:'2px solid transparent', background:'#f4f8f6', color:'var(--jungle-deep)', fontSize:'0.8rem', fontWeight:600, cursor:'pointer', textAlign:'left', transition:'all 0.15s', lineHeight:1.3 }}>
                  {opt}
                </button>
              ))}
            </div>
            <MathsCalculator />
          </div>
        </div>
      )}
    </div>
  );
}
