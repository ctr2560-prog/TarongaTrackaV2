import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { calculateAnimalPoints } from '../utils/helpers';

const SCORE_DOMAINS = {
  science: [
    { key:'behaviour', label:'Observation' },
    { key:'detail',    label:'Detail'      },
    { key:'writing',   label:'Writing'     },
  ],
  maths: [
    { key:'behaviour', label:'Method'  },
    { key:'detail',    label:'Accuracy' },
    { key:'writing',   label:'Comms'   },
  ],
  pdhpe: [
    { key:'behaviour', label:'Comparison'   },
    { key:'detail',    label:'Understanding' },
    { key:'writing',   label:'Communication' },
  ],
};

export default function BadgeScreen() {
  const { setCurrentScreen, classSubject } = useApp();
  const { badges, foundAnimals, animalsToRender, totalPoints } = useStudent();

  const lastBadge = badges[badges.length - 1];
  if (!lastBadge) return <div style={{ padding:'2rem' }}>No badge data found.</div>;

  const pts     = calculateAnimalPoints(lastBadge);
  const domains = SCORE_DOMAINS[classSubject] || SCORE_DOMAINS.science;
  const obs     = lastBadge.observationScore || {};

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,var(--sunset-orange) 0%,var(--earth-clay) 50%,var(--jungle-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem,5vw,2rem)', overflow:'hidden' }}>
      <div className="animate-scale-in" style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'clamp(1.5rem,4vh,2.5rem)', maxWidth:'460px', width:'100%', textAlign:'center', boxShadow:'var(--t-shadow-xl)', border:'1px solid rgba(255,255,255,0.8)' }}>

        {/* Badge image */}
        <div style={{ height:'clamp(160px,38vh,240px)', width:'clamp(160px,38vh,240px)', margin:'0 auto clamp(1.2rem,2.5vh,1.75rem)',
          backgroundImage:`url(images/badge-${lastBadge.animalId}.png)`, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center',
          filter:'drop-shadow(0 8px 24px rgba(7,30,20,0.22))' }} />

        <h2 className="taronga-title" style={{ fontSize:'clamp(1.8rem,4vh,2.4rem)', color:'var(--t-deep)', marginBottom:'0.2rem', letterSpacing:'0.04em' }}>Badge Earned</h2>
        <p className="serif-accent" style={{ fontSize:'clamp(1rem,2.2vh,1.2rem)', color:'var(--t-sage)', marginBottom:'clamp(0.9rem,1.8vh,1.2rem)' }}>{lastBadge.animal}</p>

        {/* Points reward */}
        <div style={{ background:'linear-gradient(135deg,#FBF4E3,#F5E5B8)', borderRadius:'var(--t-r-md)', padding:'clamp(0.9rem,1.8vh,1.3rem)', marginBottom:'clamp(0.7rem,1.4vh,1rem)', border:'1px solid rgba(201,169,110,0.3)' }}>
          <div style={{ fontSize:'clamp(2rem,4.5vh,2.8rem)', fontWeight:800, color:'var(--earth-clay)', marginBottom:'0.15rem', letterSpacing:'-0.02em' }}>+{pts}</div>
          <div style={{ color:'var(--t-slate)', fontSize:'clamp(0.78rem,1.6vh,0.9rem)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>Points</div>
        </div>

        {/* Domain scores */}
        {obs.behaviour != null && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem', marginBottom:'clamp(0.7rem,1.4vh,1rem)' }}>
            {domains.map(({ key, label }) => {
              const val = obs[key] ?? 0;
              const pct = Math.round((val / 5) * 100);
              return (
                <div key={key} style={{ background:'var(--t-foam)', borderRadius:'var(--t-r-md)', padding:'0.6rem 0.4rem', border:'1px solid var(--t-mist)', textAlign:'center' }}>
                  <div style={{ fontSize:'clamp(1.1rem,2.4vh,1.5rem)', fontWeight:800, color:'var(--t-mid)' }}>{val}<span style={{ fontSize:'0.6em', color:'var(--t-slate)', fontWeight:600 }}>/5</span></div>
                  <div style={{ width:'100%', height:'4px', background:'var(--t-mist)', borderRadius:'2px', margin:'0.3rem 0' }}>
                    <div style={{ width:`${pct}%`, height:'100%', background:'var(--t-eucalyptus)', borderRadius:'2px', transition:'width 0.4s ease' }} />
                  </div>
                  <div style={{ fontSize:'clamp(0.62rem,1.3vh,0.72rem)', fontWeight:700, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Progress */}
        <div style={{ background:'var(--t-foam)', borderRadius:'var(--t-r-md)', padding:'clamp(0.9rem,1.8vh,1.2rem)', marginBottom:'clamp(0.9rem,1.8vh,1.3rem)', border:'1px solid var(--t-mist)' }}>
          <div style={{ color:'var(--t-slate)', fontSize:'clamp(0.75rem,1.5vh,0.85rem)', marginBottom:'0.4rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>Total Progress</div>
          <div style={{ fontSize:'clamp(1.2rem,2.5vh,1.6rem)', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.2rem' }}>{foundAnimals.size}/{animalsToRender.length} Animals</div>
          <div style={{ fontSize:'clamp(1.1rem,2.2vh,1.4rem)', fontWeight:700, color:'var(--earth-clay)' }}>{totalPoints} Points</div>
        </div>

        <button onClick={() => setCurrentScreen('map')}
          style={{ background:'linear-gradient(135deg,var(--t-mid),var(--t-eucalyptus))', color:'white', border:'none', padding:'clamp(0.8rem,1.6vh,1rem) 2.5rem', fontSize:'clamp(0.95rem,1.9vh,1.1rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.09em', boxShadow:'0 6px 20px rgba(26,82,56,0.4)', transition:'all 0.2s' }}>
          Continue Exploring
        </button>
      </div>
    </div>
  );
}
