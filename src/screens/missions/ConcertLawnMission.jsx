import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import StudentGuide from '../../components/StudentGuide';

const STAGE_CHALLENGES = {
  1: 'Do a relay race across the lawn, everyone must run and finish together! Every single team member must cross the line before you\'re done.',
  2: 'Pass a ball (or any object) to every team member 3 times in a row without dropping it. The whole team counts out loud together.',
  3: 'Create a 4-stage relay where each person plays a different role, runner, caller, timer, and encourager, then run it once.',
  4: 'Human Knot: stand in a tight circle, reach across and each grab the hands of two different people (not your neighbours). Without letting go, untangle yourselves back into a circle.',
  5: 'One person takes a leadership role and guides the team through a physical challenge of your group\'s choice on the lawn. Rotate the leader halfway through.',
};

const STAGE_LABELS = {
  1: 'Relay Race',
  2: 'Pass the Object',
  3: 'Role Relay',
  4: 'Human Knot',
  5: 'Leadership Challenge',
};

const STAGE_EMOJIS = { 1: '🏃', 2: '🤝', 3: '🔄', 4: '🎯', 5: '⭐' };

export default function ConcertLawnMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal,
    showResult, isCorrect,
    setIsProcessingAnswer,
    handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const [phase, setPhase] = useState('challenge');

  const KNOT_SECONDS = 300; // 5-minute Human Knot countdown
  const [knotActive, setKnotActive]   = useState(false);
  const [knotDone,   setKnotDone]     = useState(false);
  const [knotSecs,   setKnotSecs]     = useState(KNOT_SECONDS);

  useEffect(() => {
    if (classStage !== 4 || !knotActive || knotDone) return;
    if (knotSecs <= 0) { setKnotDone(true); return; }
    const t = setTimeout(() => setKnotSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [classStage, knotActive, knotDone, knotSecs]);

  const formatKnot = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const question           = getStageQuestions(currentAnimal, classStage, classSubject)[0];
  const correctAnswerIndex = question?.correct ?? 0;
  const fact               = question?.stageFacts?.[classStage] || question?.fact;
  const challenge          = STAGE_CHALLENGES[classStage] || STAGE_CHALLENGES[1];
  const label              = STAGE_LABELS[classStage]    || STAGE_LABELS[1];
  const emoji              = STAGE_EMOJIS[classStage]    || '🏃';
  const questionText       = question?.stageVariants?.[classStage] || question?.q || '';

  if (phase === 'challenge') {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#0E2818 0%,#1A4228 50%,#0E2010 100%)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.85rem 1.1rem 0' }}>
          <button onClick={() => setCurrentScreen('map')}
            style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', color:'rgba(255,255,255,0.75)', padding:'0.4rem 0.95rem', borderRadius:'40px', cursor:'pointer', fontSize:'0.82rem', fontWeight:600 }}>
            ← Back
          </button>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'32px', width:'auto', opacity:0.7 }} onError={e => e.target.style.display='none'} />
        </div>

        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.5rem 1.25rem 2rem', maxWidth:'460px', margin:'0 auto', width:'100%' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'0.5rem' }}>{emoji}</div>
          <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,220,140,0.8)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.35rem', textAlign:'center' }}>Team Challenge</p>
          <h1 style={{ fontSize:'clamp(1.6rem,5vw,2.2rem)', color:'white', fontWeight:800, margin:'0 0 1.4rem', textAlign:'center', lineHeight:1.1 }}>{label}</h1>

          <div style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(100,220,140,0.25)', borderRadius:'16px', padding:'1.25rem 1.3rem', marginBottom:'1.4rem', borderLeft:'3px solid rgba(100,220,140,0.6)' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,220,140,0.75)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.6rem' }}>Your Mission</p>
            <p style={{ fontSize:'1rem', color:'rgba(255,255,255,0.92)', lineHeight:1.65, margin:0, fontWeight:500 }}>{challenge}</p>
          </div>

          <div style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'0.85rem 1.1rem', marginBottom:'1.4rem', display:'flex', alignItems:'flex-start', gap:'0.65rem' }}>
            <span style={{ fontSize:'1.1rem', flexShrink:0, marginTop:'0.05rem' }}>💬</span>
            <p style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.65)', lineHeight:1.55, margin:0 }}>
              Work together as a team. When everyone has completed the challenge, tap the button below to answer a reflection question.
            </p>
          </div>

          {classStage === 4 && (
            <div style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(100,220,140,0.2)', borderRadius:'16px', padding:'1.1rem 1.2rem', marginBottom:'1.4rem', textAlign:'center' }}>
              <p style={{ fontSize:'0.62rem', fontWeight:800, color:'rgba(100,220,140,0.75)', textTransform:'uppercase', letterSpacing:'0.13em', margin:'0 0 0.5rem' }}>Human Knot Timer</p>
              <div style={{ fontSize:'3.8rem', fontWeight:800, fontVariantNumeric:'tabular-nums', color: knotSecs <= 30 && knotActive && !knotDone ? '#FFEB3B' : 'white', lineHeight:1, marginBottom:'0.65rem' }}>
                {formatKnot(knotSecs)}
              </div>
              {knotDone
                ? <p style={{ fontSize:'0.85rem', fontWeight:700, color:'rgba(100,220,140,0.9)', margin:0 }}>Time is up! Answer the reflection question below.</p>
                : !knotActive
                ? <button onClick={() => setKnotActive(true)}
                    style={{ padding:'0.55rem 1.6rem', borderRadius:'40px', border:'none', background:'rgba(100,220,140,0.2)', color:'rgba(100,220,140,0.95)', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', letterSpacing:'0.06em' }}>
                    ▶ Start Timer
                  </button>
                : <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.5)', margin:0, fontWeight:600 }}>Timer running - untangle the knot!</p>
              }
            </div>
          )}

          <button onClick={() => setPhase('quiz')}
            style={{ width:'100%', padding:'1.1rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#2A8A40,#1E6A30)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.1em', boxShadow:'0 6px 24px rgba(30,100,50,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
            ✅ Done, Answer the Question
          </button>
        </div>
        <StudentGuide screen="mission-concertlawn" />
      </div>
    );
  }

  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)') : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(135deg,var(--jungle-deep),var(--jungle-mid))', padding:'0.6rem 1rem', flex:'0 0 auto', zIndex:100 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={() => { if (!showResult) setPhase('challenge'); }}
            style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>
            ← Back
          </button>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
          <div style={{ width:'70px' }} />
        </div>
      </div>

      <div style={{ width:'100%', height:'13vh', minHeight:'90px', maxHeight:'130px', backgroundImage:'url(images/concert-lawn.jpg)', backgroundSize:'cover', backgroundPosition:'center', position:'relative', flex:'0 0 auto' }}>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(180deg,transparent 0%,rgba(10,47,31,0.95) 100%)', padding:'0.6rem 1rem 0.5rem' }}>
          <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center' }}>
            <h1 className="heading-display" style={{ fontSize:'clamp(1.2rem,3vh,1.6rem)', color:'white', marginBottom:'0.1rem', lineHeight:1.1 }}>Concert Lawn</h1>
            <p className="serif-accent" style={{ fontSize:'clamp(0.75rem,1.8vh,0.9rem)', color:'var(--safari-gold)' }}>Reflect on your team challenge</p>
          </div>
        </div>
      </div>

      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color:isCorrect?'#10b981':'#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>
            {isCorrect ? 'Great thinking!' : 'Not Quite'}
          </h2>
          {isCorrect && fact && (
            <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {fact}</p>
            </div>
          )}
          <button onClick={() => { if (isCorrect) { handleNextQuestion(1); } else { setIsProcessingAnswer(false); } }}
            style={{ background:isCorrect?'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))':'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Observation →' : 'Try Again'}
          </button>
        </div>
      )}

      {!showResult && (
        <div style={{ flex:'1 1 0', minHeight:0, overflowY:'auto', padding:'1rem', maxWidth:'560px', margin:'0 auto', width:'100%' }}>
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'clamp(0.8rem,2vh,1.2rem)', boxShadow:'0 8px 32px rgba(0,0,0,0.1)', marginBottom:'1rem' }}>
            <p style={{ fontSize:'0.7rem', fontWeight:800, color:'var(--jungle-mid)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem', textAlign:'center' }}>Reflection Question</p>
            <p style={{ fontSize:'clamp(0.9rem,2vh,1.1rem)', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'clamp(0.8rem,1.5vh,1rem)', lineHeight:1.4, textAlign:'center' }}>{questionText}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(0.5rem,1vh,0.8rem)' }}>
              {(question?.options || []).map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(0, i, correctAnswerIndex)}
                  style={{ textAlign:'center', padding:'clamp(1rem,2.5vh,1.5rem) clamp(0.5rem,1vh,0.8rem)', borderRadius:'var(--t-r-md)', border:'3px solid var(--jungle-light)', background:'white', cursor:'pointer', fontSize:'clamp(0.85rem,1.8vh,1rem)', fontWeight:600, color:'var(--jungle-deep)', lineHeight:1.2, minHeight:'clamp(70px,12vh,90px)', display:'flex', alignItems:'center', justifyContent:'center', touchAction:'manipulation' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <StudentGuide screen="mission-concertlawn" />
    </div>
  );
}
