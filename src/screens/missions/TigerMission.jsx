import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';

// phase: 'camera' → 'measure' → 'fact' (correct) | 'incorrect'
export default function TigerMission() {
  const { setCurrentScreen } = useApp();
  const { setFirstAttemptResults } = useStudent();

  const [phase, setPhase]           = useState('camera');
  const [measurement, setMeasurement] = useState(2.5);
  const [photo, setPhoto]           = useState(null);
  const [attempted, setAttempted]   = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const APPROX_LENGTHS = [0.5, 2.5, 5, 10];
  const RULER_PCT      = { 0.5: 12, 2.5: 42, 5: 68, 10: 88 };

  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

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
    if (!video && !cameraError) return;
    if (canvas) {
      canvas.width  = video?.videoWidth  || 640;
      canvas.height = video?.videoHeight || 480;
      if (video) canvas.getContext('2d').drawImage(video, 0, 0);
    }
    const dataUrl = canvas?.toDataURL('image/jpeg', 0.85) || null;
    stopCamera();
    setPhoto(dataUrl);
    setPhase('measure');
  };

  const submitMeasurement = () => {
    const correct = measurement === 2.5;
    const isFirst = !attempted;
    setAttempted(true);
    setFirstAttemptResults(prev => {
      if (prev[0] !== undefined) return prev;
      return { ...prev, 0: correct && isFirst };
    });
    setPhase(correct ? 'fact' : 'incorrect');
  };

  const retake = () => {
    setPhoto(null);
    setPhase('camera');
    setTimeout(() => startCamera(), 80);
  };

  const rulerPct = RULER_PCT[measurement] ?? 42;

  // ── Incorrect ────────────────────────────────────────────────────────────────
  if (phase === 'incorrect') {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem,5vw,2rem)' }}>
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', maxWidth:'480px', width:'100%' }}>
          <div style={{ fontSize:'clamp(2rem,6vh,3rem)', marginBottom:'0.5rem' }}>📏</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color:'#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>Not Quite</h2>
          <p style={{ fontSize:'clamp(0.9rem,2vh,1rem)', color:'#555', marginBottom:'1.25rem', lineHeight:1.6 }}>
            Think about how long a Sumatran tiger really is — nose to tail. Have another look at the options!
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            <button onClick={() => setPhase('measure')}
              style={{ background:'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)' }}>
              Try Again
            </button>
            <button onClick={retake}
              style={{ background:'none', border:'none', color:'#888', fontSize:'0.85rem', cursor:'pointer', textDecoration:'underline' }}>
              Retake photo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Fact ─────────────────────────────────────────────────────────────────────
  if (phase === 'fact') {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#1a3a2a 0%,#2e5c3e 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white', textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎯</div>
        <h2 className="heading-display" style={{ fontSize:'2rem', color:'#4ade80', marginBottom:'1.5rem' }}>Spot On!</h2>
        <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:'var(--t-r-md)', padding:'1.5rem', maxWidth:'480px', marginBottom:'2rem', backdropFilter:'blur(8px)' }}>
          <p style={{ fontSize:'1rem', lineHeight:1.7, marginBottom:'0.75rem' }}>
            A Sumatran tiger can grow to about <strong>2.5 metres</strong> from nose to tail.
          </p>
          <p style={{ fontSize:'0.9rem', opacity:0.85, lineHeight:1.6 }}>
            Their tail alone can be nearly 1 metre long — it helps them balance when moving through dense rainforest.
          </p>
        </div>
        <button onClick={() => setCurrentScreen('observation')}
          style={{ background:'linear-gradient(135deg,var(--sunset-orange),var(--earth-clay))', color:'white', border:'none', padding:'1rem 2.5rem', borderRadius:'30px', fontSize:'1.1rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 15px rgba(232,106,51,0.5)' }}>
          Continue to Observation →
        </button>
      </div>
    );
  }

  // ── Measure ───────────────────────────────────────────────────────────────────
  if (phase === 'measure') {
    return (
      <div style={{ position:'fixed', inset:0, background:'#0A0600', display:'flex', flexDirection:'column' }}>
        <canvas ref={canvasRef} style={{ display:'none' }} />

        <div style={{ flexShrink:0, background:'linear-gradient(to right,#1A0800,#3D1800)', padding:'0.55rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,160,50,0.2)' }}>
          <button onClick={retake}
            style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', color:'white', padding:'0.35rem 0.8rem', borderRadius:'40px', cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>← Retake</button>
          <span style={{ color:'white', fontSize:'1rem', fontWeight:700, letterSpacing:'0.06em' }}>Measure Your Photo</span>
          <div style={{ width:'60px' }} />
        </div>

        <div style={{ flex:'1 1 auto', position:'relative', background:'#0A0600', overflow:'hidden' }}>
          {photo
            ? <img src={photo} alt="Your measurement" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
            : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>Use the slider below to estimate the tiger's length</div>
          }
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
            <div style={{ width:`${rulerPct}%`, position:'relative', marginBottom:'0.5rem', transition:'width 0.08s ease' }}>
              <div style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:'3px', height:'44px', background:'rgba(100,230,140,0.95)', borderRadius:'2px', boxShadow:'0 0 8px rgba(100,230,140,0.7)' }} />
              <div style={{ height:'3px', background:'rgba(100,230,140,0.95)', boxShadow:'0 0 8px rgba(100,230,140,0.6)', margin:'20px 0' }} />
              <div style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', width:'3px', height:'44px', background:'rgba(100,230,140,0.95)', borderRadius:'2px', boxShadow:'0 0 8px rgba(100,230,140,0.7)' }} />
              <div style={{ position:'absolute', left:0, bottom:'calc(50% + 24px)', transform:'translateX(-50%)', fontSize:'0.65rem', fontWeight:800, color:'rgba(100,230,140,0.9)', letterSpacing:'0.1em', whiteSpace:'nowrap', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>NOSE</div>
              <div style={{ position:'absolute', right:0, bottom:'calc(50% + 24px)', transform:'translateX(50%)', fontSize:'0.65rem', fontWeight:800, color:'rgba(100,230,140,0.9)', letterSpacing:'0.1em', whiteSpace:'nowrap', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>TAIL</div>
            </div>
            <div style={{ background:'rgba(10,47,31,0.85)', border:'1.5px solid rgba(100,230,140,0.4)', borderRadius:'40px', padding:'0.3rem 1.2rem', backdropFilter:'blur(8px)' }}>
              <span style={{ fontSize:'1.6rem', fontWeight:800, color:'white', letterSpacing:'0.02em' }}>~{measurement}</span>
              <span style={{ fontSize:'0.9rem', fontWeight:600, color:'rgba(100,230,140,0.85)', marginLeft:'0.2rem' }}>m</span>
            </div>
          </div>
        </div>

        <div style={{ flexShrink:0, background:'#0F0500', padding:'0.6rem 1.25rem 1rem', borderTop:'1px solid rgba(255,160,50,0.15)' }}>
          <div style={{ fontSize:'0.65rem', color:'rgba(255,160,50,0.7)', fontWeight:700, letterSpacing:'0.06em', textAlign:'center', marginBottom:'0.4rem', textTransform:'uppercase' }}>Estimate the length</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.4rem', marginBottom:'0.65rem' }}>
            {APPROX_LENGTHS.map(h => {
              const selected = measurement === h;
              return (
                <button key={h} onClick={() => setMeasurement(h)}
                  style={{ padding:'0.55rem 0.3rem', borderRadius:'10px', border: selected ? '2px solid rgba(255,160,50,0.8)' : '2px solid rgba(255,255,255,0.1)', background: selected ? 'rgba(255,160,50,0.15)' : 'rgba(255,255,255,0.04)', color: selected ? 'rgba(255,160,50,0.95)' : 'rgba(255,255,255,0.45)', fontSize:'1rem', fontWeight:800, cursor:'pointer', transition:'all 0.15s' }}>
                  ~{h}m
                </button>
              );
            })}
          </div>
          <button onClick={submitMeasurement}
            style={{ width:'100%', padding:'0.9rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#C25A00,#8A3800)', color:'white', fontSize:'1rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.1em', boxShadow:'0 4px 20px rgba(180,80,0,0.5)' }}>
            Submit →
          </button>
        </div>
      </div>
    );
  }

  // ── Camera ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:'#0A0600', display:'flex', flexDirection:'column' }}>
      <canvas ref={canvasRef} style={{ display:'none' }} />

      <div style={{ flexShrink:0, background:'linear-gradient(to right,#1A0800,#3D1800)', padding:'0.55rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,160,50,0.2)' }}>
        <button onClick={() => { stopCamera(); setCurrentScreen('map'); }}
          style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', color:'white', padding:'0.35rem 0.8rem', borderRadius:'40px', cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>← Back</button>
        <span style={{ color:'white', fontSize:'1rem', fontWeight:700, letterSpacing:'0.06em' }}>Tiger Measure</span>
        <div style={{ width:'60px' }} />
      </div>

      <div style={{ flex:'1 1 auto', position:'relative', overflow:'hidden' }}>
        {cameraError ? (
          <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', color:'rgba(255,255,255,0.7)' }}>
            <span style={{ fontSize:'3rem' }}>🐯</span>
            <p style={{ fontSize:'0.9rem', textAlign:'center', padding:'0 2rem', lineHeight:1.6 }}>Camera unavailable — tap Capture to proceed to the measuring step.</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        )}
        <div style={{ position:'absolute', top:'0.75rem', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.65)', borderRadius:'40px', padding:'0.35rem 1rem', whiteSpace:'nowrap', backdropFilter:'blur(4px)' }}>
          <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.85)', fontWeight:600 }}>Zoom in so the tiger fills the frame, then capture</span>
        </div>
      </div>

      <div style={{ flexShrink:0, background:'#0F0500', padding:'1rem 1.5rem 1.5rem', borderTop:'1px solid rgba(255,160,50,0.15)' }}>
        <button onClick={capturePhoto}
          style={{ width:'100%', padding:'1rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#C25A00,#8A3800)', color:'white', fontSize:'1rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.1em', boxShadow:'0 4px 20px rgba(180,80,0,0.5)' }}>
          Capture Photo
        </button>
      </div>
    </div>
  );
}
