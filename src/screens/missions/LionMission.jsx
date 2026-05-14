import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import MathsCalculator from '../../components/MathsCalculator';

const ZOOM_OPTIONS = ['2×', '5×', '10×', '20×'];
const ZOOM_SCALE   = { '2×': 1, '5×': 2, '10×': 3, '20×': 4 };

export default function LionMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const [zoom, setZoom]             = useState(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const currentQuestion   = getStageQuestions(currentAnimal, classStage, classSubject)[0];
  const correctAnswerIndex = currentQuestion?.correct ?? 1;

  const infoPanelContent = classStage <= 2
    ? { label: 'Zoom Task', body: 'Use the zoom buttons below. Watch what happens to the image as you zoom in.' }
    : classStage === 3
    ? { label: 'Compare Sizes', body: 'Image size: 10 mm  ·  Real size: 200 cm — which is bigger?' }
    : classStage === 5
    ? { label: 'Magnification Calculation', body: 'Magnification = Image Size ÷ Actual Size\nImage Size = 10 mm  ·  Actual Size = 1 mm\nUse this to decide the correct zoom level.' }
    : { label: 'Magnification Challenge', body: 'Actual size: 2 mm  ·  Readable size: 10 mm  ·  Formula: image ÷ real' };

  const hintContent = classStage <= 2
    ? 'Zoom in → the image gets bigger!'
    : classStage === 3
    ? '10 mm vs 200 cm — which is bigger?'
    : classStage === 5
    ? 'Divide the image size by the actual size to work out the magnification.'
    : '10 ÷ 2 = 5×';

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

  const handleBack = () => {
    stopCamera();
    setCurrentScreen('map');
  };

  const handleTryAgain = () => {
    setIsProcessingAnswer(false);
    setShowResult(false);
    startCamera();
  };

  const scale = ZOOM_SCALE[zoom] || 1;
  const fact  = currentQuestion?.stageFacts?.[classStage] || currentQuestion?.fact;

  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>

      <div style={{ background:'linear-gradient(135deg,var(--jungle-deep) 0%,var(--jungle-mid) 100%)', padding:'0.6rem 1rem', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', flex:'0 0 auto', zIndex:100 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={handleBack} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>← Back</button>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
          <div style={{ width:'70px' }} />
        </div>
      </div>

      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color: isCorrect ? '#10b981' : '#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>
            {isCorrect ? 'Correct!' : 'Try Again'}
          </h2>
          {isCorrect && <p style={{ fontSize:'clamp(0.95rem,2.2vh,1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>You used magnification effectively to observe the lion.</p>}
          {!isCorrect && <p style={{ fontSize:'clamp(0.9rem,2vh,1rem)', color:'#555', marginBottom:'0.8rem', lineHeight:1.6 }}>Not quite — adjust your zoom and read the question carefully.</p>}
          {isCorrect && fact && (
            <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {fact}</p>
            </div>
          )}
          <button
            onClick={() => { if (isCorrect) { handleNextQuestion(1); } else { handleTryAgain(); } }}
            style={{ background: isCorrect ? 'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))' : 'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Reflection →' : 'Try Again'}
          </button>
        </div>
      )}

      {!showResult && (
        <div style={{ flex:'1 1 auto', overflowY:'auto', padding:'1rem 1rem 3rem', maxWidth:'600px', margin:'0 auto', width:'100%' }}>

          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.08)', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--jungle-deep)', marginBottom:'0.3rem' }}>
              Lion {classStage <= 2 ? 'Camera Task' : 'Micro Investigation'}
            </h2>
            <p style={{ fontSize:'0.85rem', color:'#666', margin:0 }}>
              {classStage <= 2
                ? 'Use your camera. Zoom in on the lion. Then answer the question.'
                : 'A tiny multiple-choice question is hidden on the lion sign. Use the microscope zoom to read it clearly.'}
            </p>
          </div>

          <div style={{ background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'0 4px 16px rgba(59,130,246,0.1)', marginBottom:'1rem' }}>
            <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#1D4ED8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.5rem' }}>{infoPanelContent.label}</p>
            <p style={{ fontSize:'0.88rem', color:'#1D4ED8', fontWeight:600, margin:0, whiteSpace:'pre-line' }}>{infoPanelContent.body}</p>
          </div>

          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1rem 1.2rem', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', marginBottom: hintVisible ? '0' : '1rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
            <p style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--jungle-deep)', margin:0 }}>
              {currentQuestion ? currentQuestion.q : 'What magnification do you need?'}
            </p>
            <button onClick={() => setHintVisible(h => !h)} style={{ background:'var(--jungle-light)', color:'white', border:'none', padding:'0.4rem 0.9rem', borderRadius:'var(--t-r-pill)', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
              {hintVisible ? 'Hide Hint' : 'Hint'}
            </button>
          </div>
          {hintVisible && (
            <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:'var(--t-r-md)', padding:'0.75rem 1rem', marginBottom:'1rem', textAlign:'center' }}>
              <p style={{ fontSize:'0.95rem', fontWeight:700, color:'#92400E', margin:0 }}>{hintContent}</p>
            </div>
          )}

          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1rem 1.2rem', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', marginBottom:'1rem' }}>
            <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--jungle-deep)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.7rem' }}>Select Zoom Level</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.6rem' }}>
              {ZOOM_OPTIONS.map(z => (
                <button key={z} onClick={() => setZoom(z)}
                  style={{ padding:'0.75rem 0', borderRadius:'var(--t-r-md)', border: zoom === z ? '2px solid var(--jungle-mid)' : '2px solid transparent', background: zoom === z ? 'var(--jungle-deep)' : '#f4f8f6', color: zoom === z ? 'white' : 'var(--jungle-deep)', fontSize:'1rem', fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
                  {z}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position:'relative', borderRadius:'var(--t-r-md)', overflow:'hidden', marginBottom:'1rem', background:'black', height:'220px', boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}>
            {cameraError ? (
              <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem', color:'rgba(255,255,255,0.7)' }}>
                <span style={{ fontSize:'2rem' }}>🦁</span>
                <p style={{ fontSize:'0.8rem', margin:0, textAlign:'center', padding:'0 1rem' }}>Camera unavailable — use the zoom buttons to select the magnification you'd use to read the sign.</p>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted
                style={{ width:'100%', height:'100%', objectFit:'cover', transform:`scale(${scale})`, transformOrigin:'center', transition:'transform 0.3s ease' }} />
            )}
            <div style={{ position:'absolute', top:'0.5rem', right:'0.6rem', background:'rgba(0,0,0,0.6)', color:'white', fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.5rem', borderRadius:'var(--t-r-xs)' }}>
              {zoom ? `${zoom} zoom` : 'No zoom'}
            </div>
          </div>

          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'0.75rem', textAlign:'center' }}>Select your answer:</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {(currentQuestion?.options || ['A', 'B', 'C', 'D']).map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(0, i, correctAnswerIndex)}
                  style={{ padding:'0.9rem', borderRadius:'var(--t-r-md)', border:'2px solid transparent', background:'#f4f8f6', color:'var(--jungle-deep)', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', textAlign:'center', transition:'all 0.2s' }}>
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
