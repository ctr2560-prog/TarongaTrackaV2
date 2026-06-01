import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import StudentFeedbackModal from '../components/StudentFeedbackModal';

export default function SubmissionCompleteScreen() {
  const { setCurrentScreen, classCode, clearStudentSession } = useApp();
  const { badges, foundAnimals, animalsToRender, totalPoints, studentName, setCompletionCardDismissed } = useStudent();

  const [showFeedback,   setShowFeedback]   = useState(false);
  const [feedbackDone,   setFeedbackDone]   = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowFeedback(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fade-in" style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,var(--jungle-deep) 0%,var(--jungle-mid) 50%,var(--jungle-light) 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(1rem,5vw,2rem)', overflow:'hidden' }}>
      {/* Confetti */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        {[...Array(60)].map((_, i) => (
          <div key={i} style={{ position:'absolute', left:`${(i * 1.667) % 100}%`, top:'-20px', width:`${6 + (i % 8)}px`, height:`${6 + (i % 8)}px`, borderRadius: i % 2 ? '50%' : '2px', background:['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#4A9E6B','#34D399'][i % 7], animation:`fall ${2.5 + (i % 5) * 0.5}s linear forwards`, animationDelay:`${(i * 0.02) % 1.2}s` }} />
        ))}
      </div>

      <div className="animate-scale-in" style={{ position:'relative', zIndex:10, background:'white', borderRadius:'28px', padding:'clamp(1.8rem,5vh,2.8rem)', maxWidth:'480px', width:'100%', textAlign:'center', boxShadow:'0 24px 64px rgba(0,0,0,0.35)' }}>
        <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg,var(--jungle-mid),var(--jungle-light))', margin:'0 auto 1.2rem', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.4rem', boxShadow:'0 6px 20px rgba(26,82,56,0.4)' }}>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ width:'60%', height:'60%', objectFit:'contain' }} onError={e => e.target.style.display='none'} />
        </div>

        <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem,4vh,2.2rem)', color:'var(--t-deep)', marginBottom:'0.4rem', letterSpacing:'0.04em' }}>Activity Submitted!</h2>
        <p className="serif-accent" style={{ color:'var(--t-sage)', fontSize:'clamp(0.92rem,2vh,1.1rem)', marginBottom:'1.4rem' }}>Your results have been saved</p>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.7rem', marginBottom:'1.4rem' }}>
          {[
            { label:'Points',  value: totalPoints,                               color:'var(--sunset-orange)' },
            { label:'Badges',  value: badges.length,                             color:'var(--earth-clay)' },
            { label:'Animals', value: `${foundAnimals.size}/${animalsToRender.length}`, color:'var(--jungle-mid)' },
          ].map(s => (
            <div key={s.label} style={{ background:'#F5F3EE', borderRadius:'14px', padding:'0.8rem 0.4rem' }}>
              <div style={{ fontWeight:700, color:s.color, fontSize:'1.2rem', lineHeight:1.2 }}>{s.value}</div>
              <div style={{ color:'#999', fontSize:'0.68rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badge thumbnails */}
        {badges.length > 0 && (
          <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.4rem' }}>
            {badges.map((b, i) => (
              <div key={i} style={{ width:'48px', height:'48px', borderRadius:'var(--t-r-sm)', backgroundImage:`url(images/badge-${b.animalId}.png)`, backgroundSize:'cover', backgroundPosition:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.15)', border:'2px solid white' }} />
            ))}
          </div>
        )}

        <div className="fade-in" style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-md)', padding:'0.6rem 1rem', marginBottom:'1.4rem', display:'inline-block' }}>
          <p style={{ color:'#16A34A', fontSize:'0.8rem', fontWeight:600, margin:0 }}>
            ✓ Saved to class <span style={{ fontFamily:'monospace', letterSpacing:'0.1em' }}>{classCode}</span> · {studentName}
          </p>
        </div>

        {feedbackDone ? (
          <button onClick={() => { clearStudentSession(); setCompletionCardDismissed(true); setCurrentScreen('home'); }}
            style={{ background:'linear-gradient(135deg,var(--jungle-mid),var(--jungle-light))', color:'white', border:'none', padding:'0.85rem 2.5rem', fontSize:'1.05rem', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 6px 18px rgba(26,82,56,0.4)' }}>
            Done
          </button>
        ) : (
          <p style={{ color:'var(--t-ash)', fontSize:'0.82rem', margin:'0.5rem 0 0' }}>Rate your experience to continue…</p>
        )}
      </div>

      {showFeedback && !feedbackDone && (
        <StudentFeedbackModal
          classCode={classCode}
          studentName={studentName}
          sessionType="standard"
          onDone={() => { setShowFeedback(false); setFeedbackDone(true); }}
        />
      )}
    </div>
  );
}
