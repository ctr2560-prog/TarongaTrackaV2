import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';

const ZOOM_OPTIONS = ['1×', '2×', '3×', '4×'];
const ZOOM_SCALE   = { '1×': 1, '2×': 2, '3×': 3, '4×': 4 };

export default function LionMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const [zoom, setZoom]           = useState('1×');
  const [cameraError, setCameraError] = useState(false);

  const videoRef  = useRef(null);
  const streamRef = useRef(null);

  const currentQuestion    = getStageQuestions(currentAnimal, classStage, classSubject)[0];
  const correctAnswerIndex = currentQuestion?.correct ?? 1;
  const question           = currentQuestion?.q || '';
  const fact               = currentQuestion?.stageFacts?.[classStage] || currentQuestion?.fact;

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

  const scale = ZOOM_SCALE[zoom] || 1;

  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : '#0A0900', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>

      <div style={{ background:'linear-gradient(to right,#1A0E00,#3D2A00)', padding:'0.55rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,180,50,0.2)', flex:'0 0 auto', zIndex:100 }}>
        <button onClick={handleBack} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', color:'white', padding:'0.35rem 0.8rem', borderRadius:'40px', cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>← Back</button>
        <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
        <div style={{ width:'70px' }} />
      </div>

      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color: isCorrect ? '#10b981' : '#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>
            {isCorrect ? 'Correct!' : 'Not Quite'}
          </h2>
          {isCorrect && <p style={{ fontSize:'clamp(0.95rem,2.2vh,1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>Great observation!</p>}
          {!isCorrect && <p style={{ fontSize:'clamp(0.9rem,2vh,1rem)', color:'#555', marginBottom:'0.8rem', lineHeight:1.6 }}>Zoom in and look closely at the lion's body - think about what it needs to catch prey in short, powerful bursts.</p>}
          {isCorrect && fact && (
            <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {fact}</p>
            </div>
          )}
          <button
            onClick={() => { if (isCorrect) { stopCamera(); handleNextQuestion(1); } else { setIsProcessingAnswer(false); setShowResult(false); } }}
            style={{ background: isCorrect ? 'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))' : 'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Observation →' : 'Try Again'}
          </button>
        </div>
      )}

      {!showResult && (
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ flex:'1 1 auto', position:'relative', background:'#0A0900', overflow:'hidden', minHeight:0 }}>
            {cameraError ? (
              <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', color:'rgba(255,255,255,0.7)' }}>
                <span style={{ fontSize:'3rem' }}>🦁</span>
                <p style={{ fontSize:'0.9rem', textAlign:'center', padding:'0 2rem', lineHeight:1.6 }}>Camera unavailable - answer the question below using your knowledge of the lion.</p>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted
                style={{ width:'100%', height:'100%', objectFit:'cover', transform:`scale(${scale})`, transformOrigin:'center', transition:'transform 0.3s ease', display:'block' }} />
            )}
            <div style={{ position:'absolute', top:'0.75rem', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.65)', borderRadius:'40px', padding:'0.35rem 1rem', whiteSpace:'nowrap', backdropFilter:'blur(4px)' }}>
              <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.85)', fontWeight:600 }}>Zoom in to observe the lion's muscles, then answer below</span>
            </div>
            <div style={{ position:'absolute', top:'0.75rem', right:'0.75rem', background:'rgba(0,0,0,0.6)', color:'rgba(255,180,50,0.9)', fontSize:'0.7rem', fontWeight:700, padding:'0.25rem 0.6rem', borderRadius:'var(--t-r-xs)', border:'1px solid rgba(255,180,50,0.3)' }}>
              {zoom}
            </div>
            <div style={{ position:'absolute', bottom:'0.75rem', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'0.4rem' }}>
              {ZOOM_OPTIONS.map(z => (
                <button key={z} onClick={() => setZoom(z)}
                  style={{ padding:'0.4rem 0.75rem', borderRadius:'40px', border: zoom === z ? '2px solid rgba(255,180,50,0.9)' : '2px solid rgba(255,255,255,0.25)', background: zoom === z ? 'rgba(180,100,0,0.85)' : 'rgba(0,0,0,0.55)', color: zoom === z ? 'white' : 'rgba(255,255,255,0.75)', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', transition:'all 0.15s', backdropFilter:'blur(4px)' }}>
                  {z}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flexShrink:0, background:'white', borderTop:'1px solid #eee', padding:'0.85rem 1rem', zIndex:10 }}>
            <p style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'0.6rem', textAlign:'center' }}>
              {question}
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
              {(currentQuestion?.options || []).map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(0, i, correctAnswerIndex)}
                  style={{ padding:'0.7rem 0.5rem', borderRadius:'var(--t-r-sm)', border:'2px solid transparent', background:'#f4f8f6', color:'var(--jungle-deep)', fontSize:'0.8rem', fontWeight:600, cursor:'pointer', textAlign:'left', transition:'all 0.15s', lineHeight:1.3 }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
