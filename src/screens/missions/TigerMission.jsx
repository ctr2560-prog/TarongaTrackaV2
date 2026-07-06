import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import MathsCalculator from '../../components/MathsCalculator';
import StudentGuide from '../../components/StudentGuide';
import { TIGER_MCQ, TIGER_PDHPE_MCQ, TIGER_ENGLISH_MCQ } from '../../data/tigerMCQ';

const TIGER_ENGLISH_PASSAGE = `Your grandparents grew up in a world with thousands of Sumatran tigers. You are growing up in one with fewer than 400.\n\nThe forest that held them, layered and ancient and breathing, has been cleared, strip by strip, for palm oil. The tigers did not leave. They were erased.\n\nNow look at the animal in front of you. This is what the world is losing.`;

export default function TigerMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion, setMissionContext,
  } = useStudent();

  const [photo, setPhoto]           = useState(null);
  const [measurement, setMeasurement] = useState(2.5);
  const [cameraError, setCameraError] = useState(false);
  const [frontCam, setFrontCam]       = useState(false);

  const videoRef       = useRef(null);
  const canvasRef      = useRef(null);
  const streamRef      = useRef(null);
  const facingModeRef  = useRef('environment');

  const isEnglish = classSubject === 'english';
  const mcq = classSubject === 'pdhpe' ? TIGER_PDHPE_MCQ : isEnglish ? TIGER_ENGLISH_MCQ : TIGER_MCQ;
  const correctAnswerIndex = mcq.stageCorrect ? (mcq.stageCorrect[classStage] ?? 0) : mcq.correct;
  const question = mcq.stageQ[classStage] || mcq.stageQ[4];
  const options  = mcq.stageOptions ? (mcq.stageOptions[classStage] || mcq.stageOptions[4]) : mcq.options;
  const fact     = mcq.stageFacts?.[classStage] || mcq.fact;

  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingModeRef.current, width: { ideal: 1280 }, height: { ideal: 720 } },
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

  const flipCamera = () => {
    const newFront = !frontCam;
    facingModeRef.current = newFront ? 'user' : 'environment';
    setFrontCam(newFront);
    stopCamera();
    setTimeout(() => startCamera(), 80);
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

  const rulerPct = 18 + ((measurement - 1.0) / 3.0) * 70;

  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : '#0A0600', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
      <canvas ref={canvasRef} style={{ display:'none' }} />

      <div style={{ background:'linear-gradient(to right,#1A0800,#3D1800)', padding:'0.55rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,160,50,0.2)', flex:'0 0 auto', zIndex:100 }}>
        <button onClick={handleBack} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', color:'white', padding:'0.35rem 0.8rem', borderRadius:'40px', cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>
          {photo ? '← Retake' : '← Back'}
        </button>
        <img src="images/tracka-logo-white.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
        <div style={{ width:'70px' }} />
      </div>

      {/* Result overlay */}
      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color: isCorrect ? '#10b981' : '#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>
            {isCorrect ? 'Correct!' : 'Not Quite'}
          </h2>
          {isCorrect && <p style={{ fontSize:'clamp(0.95rem,2.2vh,1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>Great estimation!</p>}
          {!isCorrect && <p style={{ fontSize:'clamp(0.9rem,2vh,1rem)', color:'#555', marginBottom:'0.8rem', lineHeight:1.6 }}>Think about how long a tiger is compared to a person - they're longer than you might think!</p>}
          {isCorrect && fact && (
            <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {fact}</p>
            </div>
          )}
          <button onClick={() => { if (isCorrect) { stopCamera(); if (isEnglish && photo) setMissionContext({ type: 'tiger-english', photo }); handleNextQuestion(1); } else { setIsProcessingAnswer(false); setShowResult(false); setPhoto(null); setTimeout(() => startCamera(), 80); } }}
            style={{ background: isCorrect ? 'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))' : 'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Observation →' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Camera phase */}
      {!showResult && !photo && (
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
          <div style={{ flex:'1 1 auto', position:'relative', overflow:'hidden', minHeight:0 }}>
            {cameraError ? (
              <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', color:'rgba(255,255,255,0.7)' }}>
                <span style={{ fontSize:'3rem' }}>🐯</span>
                <p style={{ fontSize:'0.9rem', textAlign:'center', padding:'0 2rem', lineHeight:1.6 }}>Camera unavailable - tap Capture to proceed to the measuring and quiz step.</p>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transform: frontCam ? 'scaleX(-1)' : 'none' }} />
            )}
            <div style={{ position:'absolute', top:'0.75rem', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.65)', borderRadius:'40px', padding:'0.35rem 1rem', backdropFilter:'blur(4px)', maxWidth:'85%', textAlign:'center' }}>
              <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.85)', fontWeight:600 }}>
                {isEnglish
                  ? "You're a wildlife journalist. Photograph the tiger for your article about what the world is losing"
                  : 'Zoom in so the tiger fills the frame, then capture'
                }
              </span>
            </div>
            {!cameraError && (
              <button onClick={flipCamera} style={{ position:'absolute', bottom:'1rem', right:'1rem', width:'60px', height:'60px', borderRadius:'50%', border:'2.5px solid rgba(255,255,255,0.75)', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(10px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.05rem', cursor:'pointer', zIndex:5, boxShadow:'0 4px 16px rgba(0,0,0,0.4)' }}>
                <span style={{ fontSize:'1.8rem', color:'white', lineHeight:1 }}>⟳</span>
                <span style={{ fontSize:'0.55rem', fontWeight:800, color:'rgba(255,255,255,0.9)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Flip</span>
              </button>
            )}
          </div>
          <div style={{ flexShrink:0, background:'#0F0500', padding:'1rem 1.5rem 1.5rem', borderTop:'1px solid rgba(255,160,50,0.15)' }}>
            <button onClick={capturePhoto}
              style={{ width:'100%', padding:'1rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#C25A00,#8A3800)', color:'white', fontSize:'1rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.1em', boxShadow:'0 4px 20px rgba(180,80,0,0.5)' }}>
              Capture Photo
            </button>
          </div>
        </div>
      )}

      {/* Photo + passage + MCQ phase — English only */}
      {!showResult && photo && isEnglish && (
        <div style={{ flex:'1 1 auto', overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ position:'relative', background:'#0A0600', height:'32vh', flexShrink:0 }}>
            {photo !== 'camera-error'
              ? <img src={photo} alt="Your tiger" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>📷 Your tiger photo</div>
            }
            <div style={{ position:'absolute', bottom:'0.6rem', right:'0.75rem', background:'rgba(0,0,0,0.65)', borderRadius:'20px', padding:'0.2rem 0.6rem', backdropFilter:'blur(4px)' }}>
              <span style={{ fontSize:'0.65rem', color:'rgba(255,160,50,0.9)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Your photo</span>
            </div>
          </div>

          <div style={{ flexShrink:0, background:'#150800', borderTop:'1px solid rgba(255,160,50,0.2)', padding:'1rem 1.25rem' }}>
            <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(255,160,50,0.8)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.6rem' }}>The Last 400 - Model Text</p>
            {TIGER_ENGLISH_PASSAGE.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.88)', lineHeight:1.7, margin: i > 0 ? '0.65rem 0 0' : 0 }}>{para}</p>
            ))}
          </div>

          <div style={{ flexShrink:0, background:'white', borderTop:'1px solid #eee', padding:'0.85rem 1rem 1.25rem' }}>
            <p style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--jungle-deep)', marginBottom:'0.6rem', textAlign:'center', lineHeight:1.4 }}>
              {question}
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
              {options.map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(0, i, correctAnswerIndex)}
                  style={{ padding:'0.65rem 0.5rem', borderRadius:'var(--t-r-sm)', border:'2px solid transparent', background:'#f4f8f6', color:'var(--jungle-deep)', fontSize:'0.78rem', fontWeight:600, cursor:'pointer', textAlign:'left', transition:'all 0.15s', lineHeight:1.35 }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo + measure + MCQ phase — Science / Maths / PDHPE */}
      {!showResult && photo && !isEnglish && (
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ flex:'1 1 auto', position:'relative', background:'#0A0600', overflow:'hidden', minHeight:0 }}>
            {photo !== 'camera-error'
              ? <img src={photo} alt="Your tiger" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>Adjust the slider below to estimate the tiger's length</div>
            }
            {/* Horizontal ruler overlay */}
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
              <div style={{ width:`${rulerPct}%`, position:'relative', marginBottom:'0.5rem', transition:'width 0.08s ease' }}>
                <div style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:'3px', height:'44px', background:'rgba(100,230,140,0.95)', borderRadius:'2px', boxShadow:'0 0 8px rgba(100,230,140,0.7)' }} />
                <div style={{ height:'3px', background:'rgba(100,230,140,0.95)', boxShadow:'0 0 8px rgba(100,230,140,0.6)', margin:'20px 0' }} />
                <div style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', width:'3px', height:'44px', background:'rgba(100,230,140,0.95)', borderRadius:'2px', boxShadow:'0 0 8px rgba(100,230,140,0.7)' }} />
                <div style={{ position:'absolute', left:0, bottom:'calc(50% + 24px)', transform:'translateX(-50%)', fontSize:'0.65rem', fontWeight:800, color:'rgba(100,230,140,0.9)', letterSpacing:'0.1em', whiteSpace:'nowrap', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>NOSE</div>
                <div style={{ position:'absolute', right:0, bottom:'calc(50% + 24px)', transform:'translateX(50%)', fontSize:'0.65rem', fontWeight:800, color:'rgba(100,230,140,0.9)', letterSpacing:'0.1em', whiteSpace:'nowrap', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>TAIL</div>
              </div>
              <div style={{ background:'rgba(10,47,31,0.85)', border:'1.5px solid rgba(100,230,140,0.4)', borderRadius:'40px', padding:'0.25rem 0.9rem', backdropFilter:'blur(8px)' }}>
                <span style={{ fontSize:'1.3rem', fontWeight:800, color:'white' }}>{measurement.toFixed(1)}</span>
                <span style={{ fontSize:'0.85rem', fontWeight:600, color:'rgba(100,230,140,0.85)', marginLeft:'0.2rem' }}>m</span>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div style={{ flexShrink:0, background:'#0F0500', padding:'0.5rem 1.25rem 0.6rem', borderTop:'1px solid rgba(255,160,50,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.25rem' }}>
              <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>1.0 m</span>
              <span style={{ fontSize:'0.68rem', color:'rgba(255,160,50,0.75)', fontWeight:700, letterSpacing:'0.04em' }}>ALIGN NOSE → TAIL</span>
              <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontWeight:600 }}>4.0 m</span>
            </div>
            <input type="range" min="1.0" max="4.0" step="0.1"
              value={measurement}
              onChange={e => setMeasurement(parseFloat(e.target.value))}
              style={{ width:'100%', accentColor:'#E86A00' }} />
          </div>

          {/* MCQ */}
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
            {classSubject === 'maths' && <MathsCalculator />}
          </div>
        </div>
      )}
      <StudentGuide screen="mission-tiger" />
    </div>
  );
}
