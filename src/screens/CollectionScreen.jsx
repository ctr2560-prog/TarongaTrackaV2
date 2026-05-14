import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { calculateAnimalPoints } from '../utils/helpers';

export default function CollectionScreen() {
  const { setCurrentScreen, classSubject } = useApp();
  const {
    animalsToRender, foundAnimals, badges, totalPoints,
    activityCompleted, isSubmittingActivity, completeActivity,
    studentName, classCode,
  } = useStudent();

  return (
    <div className="collection-page">
      <div className="collection-header-bar">
        <button className="back-btn" onClick={() => setCurrentScreen('map')}
          style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.6rem 1.2rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.9rem', fontWeight:600 }}>
          ← Map
        </button>
        <h1 className="taronga-title" style={{ fontSize:'clamp(1.6rem,3.5vw,2.2rem)', color:'white', letterSpacing:'0.05em', textShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
          Badge Collection
        </h1>
        {studentName && classCode
          ? <button onClick={completeActivity} disabled={activityCompleted || isSubmittingActivity}
              style={{ background: activityCompleted ? 'rgba(46,125,85,0.5)' : 'linear-gradient(135deg,var(--sunset-orange),var(--earth-clay))', border: activityCompleted ? '1px solid rgba(255,255,255,0.3)' : 'none', color:'white', padding:'0.55rem 1rem', borderRadius:'30px', cursor: activityCompleted || isSubmittingActivity ? 'not-allowed' : 'pointer', fontSize:'0.82rem', fontWeight:700, opacity: activityCompleted || isSubmittingActivity ? 0.6 : 1, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', boxShadow: activityCompleted ? 'none' : '0 4px 12px rgba(232,106,51,0.4)', transition:'all 0.2s' }}>
              {activityCompleted ? '✓ Submitted' : isSubmittingActivity ? 'Submitting…' : 'Complete Activity'}
            </button>
          : <div style={{ width:'80px' }} />
        }
      </div>

      <div className="badge-grid">
        {Array.isArray(animalsToRender) && animalsToRender.map(animal => {
          const earned = foundAnimals.has(animal.id);
          const badge  = badges.find(b => b.animalId === animal.id);
          const obs    = badge?.observationScore;
          const b      = obs?.behaviour || 0;
          const d      = obs?.detail    || 0;
          const w      = obs?.writing   || 0;
          const pts    = badge ? calculateAnimalPoints(badge) : 0;
          return (
            <div key={animal.id} className={`badge-tile${earned ? ' bt-earned' : ''}`}>
              <div className={`bt-img${earned ? '' : ' bt-img-locked'}`}
                style={{ backgroundImage:`url(images/badge-${animal.id}.png)` }} />
              <h3 className="bt-name">{animal.name}</h3>
              {earned && badge ? (
                <>
                  <p className="bt-pts">{pts} pts</p>
                  <p className="bt-scores">{classSubject === 'maths'
                    ? `Method +${b} · Accuracy +${d} · Communication +${w}`
                    : `Behaviour +${b} · Detail +${d} · Writing +${w}`
                  }</p>
                </>
              ) : (
                <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.42)', fontStyle:'italic' }}>Not yet discovered</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="collection-totals-strip">
        <div className="collection-totals-card">
          <div>
            <div className="totals-stat-label">Total Points</div>
            <div className="totals-stat-value" style={{ color:'var(--safari-gold)' }}>{totalPoints}</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div className="totals-stat-label">Badges Earned</div>
            <div className="totals-stat-value" style={{ color:'white' }}>
              {foundAnimals.size}<span style={{ fontSize:'1.25rem', opacity:0.4 }}>/{animalsToRender.length}</span>
            </div>
          </div>
          <div style={{ textAlign:'right', display:'flex', flexDirection:'column', gap:'0.5rem', alignItems:'flex-end' }}>
            <button onClick={() => setCurrentScreen('home')}
              style={{ background:'rgba(255,255,255,0.12)', color:'white', border:'1px solid rgba(255,255,255,0.2)', padding:'0.5rem 1rem', borderRadius:'var(--t-r-sm)', cursor:'pointer', fontSize:'0.8125rem', fontWeight:600 }}>
              🏠 Home
            </button>
            <button onClick={() => { if (window.confirm('Reset all progress? This cannot be undone.')) { localStorage.removeItem('tarongaTrackaProgress'); window.location.reload(); } }}
              style={{ background:'rgba(239,68,68,0.18)', color:'#FCA5A5', border:'1px solid rgba(239,68,68,0.3)', padding:'0.5rem 1rem', borderRadius:'var(--t-r-sm)', cursor:'pointer', fontSize:'0.8125rem', fontWeight:600 }}>
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
