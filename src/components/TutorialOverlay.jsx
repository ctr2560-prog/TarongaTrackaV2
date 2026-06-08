import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';

const STEPS = [
  {
    title: "Hi, I'm Dr. Cam!",
    text: "Welcome to Taronga Tracka! I'm going to show you how everything works before you head out to find the animals.",
    selector: null,
    camImage: 'images/guide-character.png',
    camCorner: 'center',
  },
  {
    title: "Your Animal Cards",
    text: "These cards show all the animals at Taronga Zoo you need to find today. The closest ones always appear at the top of the list!",
    selector: '.discovery-grid',
    camImage: 'images/dr-cam-point-up-left.png',
    camCorner: 'bottom-right',
  },
  {
    title: "Follow the Arrow",
    text: "See the yellow arrow on each card? It points in the direction you need to walk! Watch the distance number shrink as you get closer.",
    selector: '.discovery-card',
    camImage: 'images/dr-cam-point-up-left.png',
    camCorner: 'bottom-right',
  },
  {
    title: "Zoo Map",
    text: "If you ever get lost, tap the Zoo Map button up here to see a full map of the zoo!",
    selector: '#t-zoo-map-btn',
    camImage: 'images/dr-cam-point-up-right.png',
    camCorner: 'bottom-left',
  },
  {
    title: "Your Badges",
    text: "This shows your points and how many badges you've collected! Tap it to see your full badge collection.",
    selector: '.student-points-chip',
    camImage: 'images/dr-cam-point-up-right.png',
    camCorner: 'bottom-left',
  },
  {
    title: "Completing the Activity",
    text: "When your teacher says it's time to finish, tap 'Complete Activity' here to submit all your work. Good luck out there!",
    selector: '.submit-btn',
    camImage: 'images/dr-cam-point-up-right.png',
    camCorner: 'bottom-left',
  },
  {
    title: "Need a hand?",
    text: "If you need me at any time, tap this button to ask me helpful questions during your visit!",
    selector: '#t-guide-btn',
    camImage: 'images/dr-cam-point-up-right.png',
    camCorner: 'bottom-left',
    elevateTarget: true,
  },
];

const PADDING = 12;

function getRect(selector) {
  if (!selector) return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left - PADDING, y: r.top - PADDING, w: r.width + PADDING * 2, h: r.height + PADDING * 2 };
}

export default function TutorialOverlay() {
  const { studentName } = useApp();
  const [done, setDone] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!studentName) { setDone(true); return; }
    const seen = localStorage.getItem(`drCamTutorial_${studentName}`) === 'true';
    setDone(seen);
    setStep(0);
  }, [studentName]);
  const [rect, setRect] = useState(null);
  const [imgMap, setImgMap] = useState({});

  const current = STEPS[step];
  const isWelcome = step === 0;
  const isLast = step === STEPS.length - 1;

  const updateRect = useCallback(() => {
    setRect(getRect(current.selector));
  }, [current.selector]);

  useEffect(() => {
    if (done) return;
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [done, updateRect]);

  // Elevate the target element above the tutorial overlay when needed
  useEffect(() => {
    if (done || !current.elevateTarget || !current.selector) return;
    const el = document.querySelector(current.selector);
    if (!el) return;
    const prev = el.style.zIndex;
    el.style.zIndex = '3004';
    return () => { el.style.zIndex = prev; };
  }, [done, step, current.elevateTarget, current.selector]);

  const complete = () => {
    if (studentName) localStorage.setItem(`drCamTutorial_${studentName}`, 'true');
    setDone(true);
  };

  const next = () => { if (isLast) complete(); else setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleImgError = (src) => setImgMap(m => ({ ...m, [src]: true }));
  const imgSrc = (src) => imgMap[src] ? 'images/guide-character.png' : src;

  if (done) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Dr. Cam corner positions
  const camSize = isWelcome ? 220 : 130;
  const corners = {
    'bottom-left':  { left: 16,          bottom: 16 },
    'bottom-right': { right: 16,         bottom: 16 },
    'center':       { left: '50%', top: '50%', transform: 'translate(-50%, -62%)' },
  };
  const camStyle = corners[current.camCorner] || corners['bottom-left'];

  return createPortal(
    <>
      {/* Dark overlay with spotlight */}
      {isWelcome ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.75)' }} />
      ) : (
        <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 3000, pointerEvents: 'none' }}>
          <defs>
            <mask id="tut-mask">
              <rect width="100%" height="100%" fill="white" />
              {rect && <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx="10" fill="black" />}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.72)" mask="url(#tut-mask)" />
          {rect && (
            <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx="10"
              fill="none" stroke="#FCD34D" strokeWidth="2.5"
              style={{ animation: 'tutPulse 1.8s ease-in-out infinite' }} />
          )}
        </svg>
      )}

      {/* Skip button */}
      {!isWelcome && (
        <button onClick={complete} style={{
          position: 'fixed', top: '1rem', right: '1rem', zIndex: 3002,
          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
          color: 'white', borderRadius: '999px', padding: '0.3rem 0.85rem',
          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(6px)',
        }}>Skip tour</button>
      )}

      {/* Dr. Cam image */}
      <div style={{
        position: 'fixed', zIndex: 3003,
        width: `${camSize}px`, height: `${camSize}px`,
        ...camStyle,
        background: 'white',
        borderRadius: isWelcome ? '20px' : '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        border: isWelcome ? 'none' : '2px solid rgba(255,255,255,0.8)',
        pointerEvents: 'none',
        transition: 'all 0.3s ease',
      }}>
        <img
          src={imgSrc(current.camImage)}
          alt="Dr. Cam"
          onError={() => handleImgError(current.camImage)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: isWelcome ? '50% 15%' : '50% 10%',
          }}
        />
      </div>

      {/* Welcome card */}
      {isWelcome && (
        <div style={{
          position: 'fixed', zIndex: 3002, left: '50%', bottom: '2.5rem',
          transform: 'translateX(-50%)', width: 'min(340px, calc(100vw - 2rem))',
          background: 'white', borderRadius: '20px', padding: '1.5rem 1.5rem 1.2rem',
          boxShadow: '0 12px 48px rgba(0,0,0,0.35)', textAlign: 'center',
          animation: 'tutSlideUp 0.3s ease',
        }}>
          <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1A5238', marginBottom: '0.5rem' }}>{current.title}</div>
          <p style={{ margin: '0 0 1.2rem', fontSize: '0.92rem', color: '#444', lineHeight: 1.6 }}>{current.text}</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ width: i === step ? '18px' : '7px', height: '7px', borderRadius: '999px', background: i === step ? '#2E7D32' : '#D1D5DB', transition: 'all 0.2s' }} />
            ))}
          </div>
          <button onClick={next} style={{
            width: '100%', padding: '0.85rem', borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #2E7D32, #4A9E6B)', color: 'white',
            fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem',
            boxShadow: '0 4px 14px rgba(46,125,50,0.4)',
          }}>Let's Go</button>
        </div>
      )}

      {/* Coach mark speech bubble */}
      {!isWelcome && (
        <div style={{
          position: 'fixed', zIndex: 3002,
          ...(current.camCorner === 'bottom-right'
            ? { right: '16px', bottom: `${camSize + 24}px` }
            : { left: '16px',  bottom: `${camSize + 24}px` }),
          width: 'min(280px, calc(100vw - 2rem))',
          background: 'white', borderRadius: '16px',
          padding: '1rem 1.1rem 0.85rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'tutSlideUp 0.25s ease',
        }}>
          {/* Bubble tail */}
          <div style={{
            position: 'absolute', bottom: '-10px',
            ...(current.camCorner === 'bottom-right' ? { right: '28px' } : { left: '28px' }),
            width: '18px', height: '18px', background: 'white',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }} />

          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1A5238', marginBottom: '0.3rem' }}>{current.title}</div>
          <p style={{ margin: '0 0 0.85rem', fontSize: '0.82rem', color: '#333', lineHeight: 1.55 }}>{current.text}</p>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '0.75rem' }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ width: i === step ? '14px' : '6px', height: '6px', borderRadius: '999px', background: i === step ? '#2E7D32' : '#D1D5DB', transition: 'all 0.2s' }} />
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={back} style={{
              flex: 1, padding: '0.5rem', borderRadius: '999px',
              border: '1.5px solid #E5E5E5', background: 'white', color: '#555',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
            }}>Back</button>
            <button onClick={next} style={{
              flex: 2, padding: '0.5rem', borderRadius: '999px', border: 'none',
              background: 'linear-gradient(135deg, #2E7D32, #4A9E6B)', color: 'white',
              fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            }}>{isLast ? "Let's Go" : 'Next'}</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tutSlideUp {
          from { opacity: 0; transform: translateY(12px) translateX(var(--tx, 0)); }
          to   { opacity: 1; transform: translateY(0)    translateX(var(--tx, 0)); }
        }
        @keyframes tutPulse {
          0%, 100% { stroke-opacity: 1;   stroke-width: 2.5; }
          50%       { stroke-opacity: 0.5; stroke-width: 4; }
        }
      `}</style>
    </>,
    document.body
  );
}
