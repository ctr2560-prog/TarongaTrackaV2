import { useState, useRef, useEffect, useCallback } from 'react';

// A live in-app camera, matching what every other student photo step in the app does
// (ObservationScreen, ZooSnooz, Evolve, the Giraffe/Lion/Tiger missions).
//
// ZooYard used a bare `<input type="file" capture="environment">`. `capture` is only a HINT: it
// is ignored entirely on desktop, and honoured inconsistently across mobile browsers — so
// students were being dropped into their photo library instead of the camera. Managed school
// devices are the least predictable of all, and ZooYard exists precisely because DoE devices
// behave differently.
//
// Falls back to a file input when getUserMedia is unavailable or blocked, so a locked-down
// device can still complete the task rather than being stuck.
//
// Calls onCapture(blob, dataUrl). The preview is the caller's business.
export default function PhotoCapture({ onCapture, accentColor = '#2E7D55', label = 'Take a photo', hint }) {
  const [stage, setStage]   = useState('idle');   // idle | live | error
  const [busy, setBusy]     = useState(false);
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  // State, not a ref: the preview is mirrored for the front camera, so flipping has to re-render.
  const [facing, setFacing] = useState('environment');

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  // Release the camera if the student navigates away mid-capture, or the light stays on.
  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async (mode = facing) => {
    setBusy(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setStage('live');
      // The <video> only exists once stage is 'live', so attach after the render.
      requestAnimationFrame(() => { if (videoRef.current) videoRef.current.srcObject = stream; });
    } catch {
      // No camera, no permission, or a locked-down device: fall back rather than dead-end.
      setStage('error');
    } finally { setBusy(false); }
  };

  const flip = async () => {
    const next = facing === 'environment' ? 'user' : 'environment';
    setFacing(next);
    stopCamera();
    await startCamera(next);
  };

  const snap = () => {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || 1280;
    canvas.height = video.videoHeight || 720;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      stopCamera();
      setStage('idle');
      if (blob) onCapture(blob, canvas.toDataURL('image/jpeg', 0.85));
    }, 'image/jpeg', 0.85);
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onCapture(file, reader.result);
    reader.readAsDataURL(file);
  };

  const btn = {
    width:'100%', padding:'0.85rem', borderRadius:999, border:'none', background:accentColor,
    color:'white', fontSize:'0.9rem', fontWeight:800, cursor:'pointer',
    textTransform:'uppercase', letterSpacing:'0.05em', fontFamily:'inherit',
  };

  if (stage === 'live') {
    return (
      <div style={{ marginBottom:'0.85rem' }}>
        <div style={{ position:'relative', borderRadius:12, overflow:'hidden', background:'#000', aspectRatio:'4 / 3' }}>
          <video ref={videoRef} autoPlay playsInline muted
            style={{ width:'100%', height:'100%', objectFit:'cover',
                     transform: facing === 'user' ? 'scaleX(-1)' : 'none' }} />
          <button onClick={flip} aria-label="Switch camera"
            style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.5)', border:'none',
                     color:'white', borderRadius:999, padding:'0.3rem 0.7rem', fontSize:'0.75rem', cursor:'pointer' }}>
            ⟲ Flip
          </button>
        </div>
        <canvas ref={canvasRef} style={{ display:'none' }} />
        <button onClick={snap} style={{ ...btn, marginTop:'0.6rem' }}>📷 Capture</button>
        <button onClick={() => { stopCamera(); setStage('idle'); }}
          style={{ background:'none', border:'none', color:'#6B6B62', fontSize:'0.82rem', cursor:'pointer', marginTop:'0.4rem', width:'100%', fontFamily:'inherit' }}>
          Cancel
        </button>
      </div>
    );
  }

  // Camera unavailable — offer the file picker so the student is not blocked.
  if (stage === 'error') {
    return (
      <label style={{ display:'block', cursor:'pointer', marginBottom:'0.85rem' }}>
        <div style={{ border:`2px dashed ${accentColor}66`, background:'#FAFAF8', borderRadius:12, padding:'1.1rem 1rem', textAlign:'center' }}>
          <div style={{ fontSize:'1.6rem', lineHeight:1, marginBottom:'0.35rem' }}>🖼️</div>
          <div style={{ fontSize:'0.86rem', fontWeight:700, color:'#0A2F1F' }}>Choose a photo</div>
          <div style={{ fontSize:'0.74rem', color:'#6B6B62', marginTop:'0.15rem' }}>The camera is not available on this device</div>
        </div>
        <input type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display:'none' }} />
      </label>
    );
  }

  return (
    <button onClick={() => startCamera()} disabled={busy}
      style={{ ...btn, marginBottom:'0.85rem', background: busy ? '#CCC' : accentColor, cursor: busy ? 'default' : 'pointer' }}>
      📷 {busy ? 'Opening camera…' : label}
      {hint && <span style={{ display:'block', fontSize:'0.7rem', fontWeight:600, textTransform:'none', letterSpacing:0, opacity:0.9, marginTop:'0.15rem' }}>{hint}</span>}
    </button>
  );
}
