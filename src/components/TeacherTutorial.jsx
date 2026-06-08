import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';

// Highlight coordinates are fractions (0–1) of the natural image dimensions.
// { x, y, width, height } — all relative to the image, not the container.
const STEPS = [
  {
    type: 'welcome',
    title: 'Welcome to your Teacher Dashboard',
    text: "Here's a quick tour of the key features so you can get the most out of Taronga Tracka with your class.",
  },
  {
    title: 'Create a New Class',
    text: 'Fill in your location, subject, school name, NSW stage, and class name. Enter your Taronga access code and hit Create Class to generate a unique join code for your students.',
    image: '/images/teacher-tutorial/dashboard-create-class.png',
    highlights: [
      { x: 0.15, y: 0.73, width: 0.83, height: 0.21 },
    ],
  },
  {
    title: 'Teacher Documents',
    text: 'Below the form you\'ll find the NSW Curriculum Outcomes mapped to your subject and stage. Download the Teacher Information Sheet for a printable overview to use before and after your visit.',
    image: '/images/teacher-tutorial/dashboard-teacher-docs.png',
    highlights: [
      { x: 0.15, y: 0.38, width: 0.83, height: 0.40 },
    ],
  },
  {
    title: 'Access Code & Your Classes',
    text: 'Once your class is created it appears in the My Classes list. Each class shows the unique code your students use to join. Tap any class to start a live session or view analytics.',
    image: '/images/teacher-tutorial/dashboard-code-classes.png',
    highlights: [
      { x: 0.15, y: 0.63, width: 0.83, height: 0.35 },
      { x: 0.89, y: 0.72, width: 0.09, height: 0.09 },
      { x: 0.89, y: 0.85, width: 0.09, height: 0.09 },
    ],
  },
  {
    title: 'Class Analytics',
    text: "After your visit, detailed analytics are available for every class. Here's a walkthrough of what's inside.",
    slides: [
      {
        title: 'Analytics Overview',
        text: 'At a glance: total students, animals found, badges earned, and quiz scores. The chart shows which animals your class visited most and how quiz results are distributed.',
        image: '/images/teacher-tutorial/analytics-overview.png',
      },
      {
        title: 'Writing & Insights',
        text: 'The radar chart breaks down writing quality across six domains. Teaching Takeaways highlight where your class excelled and where they need support, generated automatically from their work.',
        image: '/images/teacher-tutorial/analytics-writing.png',
      },
      {
        title: 'Student Performance',
        text: 'See every student ranked by overall performance band. Click any student to drill into their individual results, quiz answers, and observation writing.',
        image: '/images/teacher-tutorial/analytics-students.png',
      },
      {
        title: 'Viewing Observations',
        text: "Read each student's observation writing exactly as they submitted it. Use this to assess quality and spot students who may need extra support.",
        image: '/images/teacher-tutorial/analytics-observations.png',
      },
      {
        title: 'Marking & Review',
        text: 'Override any automatically-generated score here. Use the dropdowns to adjust marks for quiz, writing, and engagement. Changes update instantly.',
        image: '/images/teacher-tutorial/analytics-marking.png',
      },
      {
        title: 'Conservation Statements',
        text: "Each student writes a personal conservation commitment at the end of their visit. Read them here. Often the most meaningful part of the whole experience.",
        image: '/images/teacher-tutorial/analytics-conservation.png',
      },
    ],
  },
  {
    title: 'Need Help?',
    text: "See the green question mark button in the bottom-right corner? Tap it any time to get answers about using the dashboard, reading analytics, or running a session.",
    image: '/images/teacher-tutorial/dashboard-code-classes.png',
    highlights: [
      { x: 0.96, y: 0.87, width: 0.05, height: 0.10 },
    ],
  },
];

function shouldShow(email, demo) {
  if (!email) return false;
  if (demo || email === 'demo@zoo') return true;
  try { return localStorage.getItem(`teacherTutorial_${email}`) !== 'true'; }
  catch { return true; }
}

export default function TeacherTutorial() {
  const { teacherEmail, demoMode } = useApp();
  const [done, setDone] = useState(() => !shouldShow(teacherEmail, demoMode));
  const [step, setStep] = useState(0);
  const [slide, setSlide] = useState(0);

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const hasSlides = !!current?.slides;
  const slides = hasSlides ? current.slides : null;
  const isLastSlide = hasSlides && slide === slides.length - 1;

  const complete = () => {
    const isDemo = demoMode || teacherEmail === 'demo@zoo';
    if (!isDemo && teacherEmail) {
      try { localStorage.setItem(`teacherTutorial_${teacherEmail}`, 'true'); } catch { /* storage blocked */ }
    }
    setDone(true);
  };

  const next = () => {
    if (hasSlides && !isLastSlide) { setSlide(s => s + 1); return; }
    if (isLast) { complete(); return; }
    setSlide(0);
    setStep(s => s + 1);
  };

  const back = () => {
    if (hasSlides && slide > 0) { setSlide(s => s - 1); return; }
    setSlide(0);
    setStep(s => s - 1);
  };

  if (done) return null;

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.72)' }} />

      {!isFirst && (
        <button onClick={complete} style={{
          position: 'fixed', top: '1rem', right: '1rem', zIndex: 3003,
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
          color: 'rgba(255,255,255,0.85)', borderRadius: '999px', padding: '0.3rem 0.9rem',
          fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(6px)',
        }}>Skip tour</button>
      )}

      {isFirst ? (
        <WelcomeCard
          title={current.title}
          text={current.text}
          totalSteps={STEPS.length}
          onNext={next}
        />
      ) : (
        <ScreenshotModal
          step={step}
          totalSteps={STEPS.length}
          title={hasSlides ? slides[slide].title : current.title}
          text={hasSlides ? slides[slide].text : current.text}
          image={hasSlides ? slides[slide].image : current.image}
          highlights={hasSlides ? (slides[slide].highlights || []) : (current.highlights || [])}
          badge={hasSlides ? `${slide + 1} of ${slides.length}` : null}
          isLast={isLast && (!hasSlides || isLastSlide)}
          onBack={back}
          onNext={next}
          slideIndex={hasSlides ? slide : null}
          slideCount={hasSlides ? slides.length : null}
        />
      )}

      <style>{`
        @keyframes ttFadeInCenter {
          from { opacity: 0; transform: translate(-50%, -46%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes ttFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ttHighlight {
          0%, 100% { stroke-opacity: 0.9; fill-opacity: 0.12; }
          50%       { stroke-opacity: 0.5; fill-opacity: 0.04; }
        }
      `}</style>
    </>,
    document.body
  );
}

function WelcomeCard({ title, text, totalSteps, onNext }) {
  return (
    <div style={{
      position: 'fixed', zIndex: 3002, left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(420px, calc(100vw - 2rem))',
      background: 'white', borderRadius: '20px', padding: '2rem 2rem 1.6rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      animation: 'ttFadeInCenter 0.3s ease',
      textAlign: 'center',
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 1.25rem',
        background: 'linear-gradient(135deg, #1A5238, #2E7D32)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(46,125,50,0.35)',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
        </svg>
      </div>
      <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1A5238', marginBottom: '0.6rem', lineHeight: 1.2 }}>{title}</div>
      <p style={{ margin: '0 0 1.5rem', fontSize: '1rem', color: '#555', lineHeight: 1.65 }}>{text}</p>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '1.25rem' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{ width: i === 0 ? '20px' : '7px', height: '7px', borderRadius: '999px', background: i === 0 ? '#2E7D32' : '#D1D5DB', transition: 'all 0.25s' }} />
        ))}
      </div>
      <button onClick={onNext} style={{
        width: '100%', padding: '0.9rem', borderRadius: '999px', border: 'none',
        background: 'linear-gradient(135deg, #1A5238, #2E7D32)', color: 'white',
        fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(46,125,50,0.4)',
      }}>Start Tour</button>
    </div>
  );
}

function ScreenshotModal({ step, totalSteps, title, text, image, highlights, badge, isLast, onBack, onNext, slideIndex, slideCount }) {
  return (
    <div style={{
      position: 'fixed', zIndex: 3002, inset: 0,
      background: 'white', display: 'flex', flexDirection: 'column',
      animation: 'ttFadeIn 0.25s ease',
    }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1A5238, #2E7D32)', padding: '0.85rem 1.25rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>
            {badge ? `ANALYTICS · ${badge}` : `STEP ${step} OF ${totalSteps - 1}`}
          </div>
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', lineHeight: 1.2 }}>{title}</div>
      </div>

      {/* Screenshot — fills all remaining vertical space */}
      <div style={{ flex: 1, background: '#f0f2f4', overflow: 'hidden', minHeight: 0 }}>
        <ImageWithHighlights src={image} alt={title} highlights={highlights} />
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '0.9rem 1.25rem 1rem', flexShrink: 0, borderTop: '1px solid #eee' }}>
        <p style={{ margin: '0 0 0.8rem', fontSize: '1.1rem', color: '#333', lineHeight: 1.6, fontWeight: 500, textAlign: 'center' }}>{text}</p>

        {slideCount !== null && (
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '0.5rem' }}>
            {Array.from({ length: slideCount }).map((_, i) => (
              <div key={i} style={{ width: i === slideIndex ? '14px' : '6px', height: '6px', borderRadius: '999px', background: i === slideIndex ? '#2E7D32' : '#D1D5DB', transition: 'all 0.2s' }} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '0.8rem' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{ width: i === step ? '14px' : '6px', height: '6px', borderRadius: '999px', background: i === step ? '#2E7D32' : '#D1D5DB', transition: 'all 0.2s' }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '480px', margin: '0 auto' }}>
          <button onClick={onBack} style={{
            flex: 1, padding: '0.65rem', borderRadius: '999px',
            border: '1.5px solid #E5E5E5', background: 'white', color: '#555',
            fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
          }}>Back</button>
          <button onClick={onNext} style={{
            flex: 2, padding: '0.65rem', borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #1A5238, #2E7D32)', color: 'white',
            fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
          }}>{isLast ? 'Done' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
}

function ImageWithHighlights({ src, alt, highlights = [] }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [bounds, setBounds] = useState(null);

  const calcBounds = useCallback(() => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container || !img.naturalWidth) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.min(cw / iw, ch / ih);
    const rw = iw * scale;
    const rh = ih * scale;
    setBounds({ x: (cw - rw) / 2, y: (ch - rh) / 2, w: rw, h: rh });
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth) calcBounds();
    img.addEventListener('load', calcBounds);
    window.addEventListener('resize', calcBounds);
    return () => {
      img.removeEventListener('load', calcBounds);
      window.removeEventListener('resize', calcBounds);
    };
  }, [src, calcBounds]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
      {bounds && highlights.length > 0 && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
          {highlights.map((h, i) => (
            <rect
              key={i}
              x={bounds.x + h.x * bounds.w}
              y={bounds.y + h.y * bounds.h}
              width={h.width * bounds.w}
              height={h.height * bounds.h}
              rx="8" ry="8"
              fill="rgba(252,211,77,0.18)"
              stroke="#FCD34D"
              strokeWidth="3"
              style={{ animation: 'ttHighlight 2s ease-in-out infinite', filter: 'drop-shadow(0 0 6px rgba(252,211,77,0.7))' }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
