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

const KID_MSGS = {
  science: {
    behaviour: {
      well: "You described exactly what the animal was doing — great watching!",
      next: "Watch closely and write down exactly what the animal is doing.",
    },
    detail: {
      well: "You used great details and science words to back up your ideas!",
      next: "Try explaining WHY the animal does that. What's the reason?",
    },
    writing: {
      well: "Your sentences were clear and easy to read!",
      next: "Start with a capital letter and finish with a full stop.",
    },
  },
  maths: {
    behaviour: {
      well: "You showed your working step by step — just like a mathematician!",
      next: "Show every step of your working so we can follow your thinking.",
    },
    detail: {
      well: "Your numbers and units were accurate — nice work!",
      next: "Include correct units (cm, m, kg) and double-check your numbers.",
    },
    writing: {
      well: "You explained your maths ideas clearly in sentences!",
      next: "Write your maths ideas in full sentences with a capital and full stop.",
    },
  },
  pdhpe: {
    behaviour: {
      well: "You made a great connection between the animal and your own life!",
      next: "Try comparing what the animal does to what you do in your own life.",
    },
    detail: {
      well: "You explained really well how this links to health!",
      next: "Explain how what the animal does connects to being healthy.",
    },
    writing: {
      well: "Your writing was clear with great sentences!",
      next: "Use a capital letter, full stops, and write in full sentences.",
    },
  },
};

export default function BadgeScreen() {
  const { setCurrentScreen, classSubject } = useApp();
  const { badges, foundAnimals, animalsToRender, totalPoints } = useStudent();

  const lastBadge = badges[badges.length - 1];
  if (!lastBadge) return <div style={{ padding:'2rem' }}>No badge data found.</div>;

  const pts     = calculateAnimalPoints(lastBadge);
  const domains = SCORE_DOMAINS[classSubject] || SCORE_DOMAINS.science;
  const obs     = lastBadge.observationScore || {};
  const msgs    = KID_MSGS[classSubject] || KID_MSGS.science;

  const hasScores = obs.behaviour != null;
  const sorted    = hasScores ? [...domains].sort((a, b) => (obs[b.key] ?? 0) - (obs[a.key] ?? 0)) : [];
  const bestDomain  = sorted[0] || null;
  const worstDomain = sorted[sorted.length - 1] || null;
  const wellMsg = bestDomain
    ? ((obs[bestDomain.key] ?? 0) >= 4 ? msgs[bestDomain.key]?.well : "You gave it a go today — keep practising!")
    : null;
  const nextMsg = worstDomain ? msgs[worstDomain.key]?.next : null;

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,var(--sunset-orange) 0%,var(--earth-clay) 50%,var(--jungle-mid) 100%)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'1rem', overflowY:'auto' }}>
      <div className="animate-scale-in" style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'1.25rem 1.25rem 1.5rem', maxWidth:'420px', width:'100%', textAlign:'center', boxShadow:'var(--t-shadow-xl)', border:'1px solid rgba(255,255,255,0.8)', margin:'auto' }}>

        {/* Badge image */}
        <div style={{ height:'clamp(100px,22vh,150px)', width:'clamp(100px,22vh,150px)', margin:'0 auto 0.75rem',
          backgroundImage:`url(images/badge-${lastBadge.animalId}.png)`, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center',
          filter:'drop-shadow(0 6px 18px rgba(7,30,20,0.22))' }} />

        <h2 className="taronga-title" style={{ fontSize:'clamp(1.5rem,3.5vh,2rem)', color:'var(--t-deep)', marginBottom:'0.1rem', letterSpacing:'0.04em' }}>Badge Earned!</h2>
        <p className="serif-accent" style={{ fontSize:'clamp(0.9rem,1.9vh,1.05rem)', color:'var(--t-sage)', marginBottom:'0.75rem' }}>{lastBadge.animal}</p>

        {/* Points + progress inline */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.75rem' }}>
          <div style={{ background:'linear-gradient(135deg,#FBF4E3,#F5E5B8)', borderRadius:'var(--t-r-md)', padding:'0.65rem 0.4rem', border:'1px solid rgba(201,169,110,0.3)' }}>
            <div style={{ fontSize:'clamp(1.5rem,3.5vh,2rem)', fontWeight:800, color:'var(--earth-clay)', lineHeight:1 }}>+{pts}</div>
            <div style={{ color:'var(--t-slate)', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginTop:'0.2rem' }}>Points</div>
          </div>
          <div style={{ background:'var(--t-foam)', borderRadius:'var(--t-r-md)', padding:'0.65rem 0.4rem', border:'1px solid var(--t-mist)' }}>
            <div style={{ fontSize:'clamp(1.5rem,3.5vh,2rem)', fontWeight:800, color:'var(--t-mid)', lineHeight:1 }}>{foundAnimals.size}<span style={{ fontSize:'0.55em', color:'var(--t-slate)', fontWeight:600 }}>/{animalsToRender.length}</span></div>
            <div style={{ color:'var(--t-slate)', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginTop:'0.2rem' }}>Animals</div>
          </div>
        </div>

        {/* Domain scores */}
        {obs.behaviour != null && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.4rem', marginBottom:'0.75rem' }}>
            {domains.map(({ key, label }) => {
              const val = obs[key] ?? 0;
              return (
                <div key={key} style={{ background:'var(--t-foam)', borderRadius:'var(--t-r-md)', padding:'0.5rem 0.3rem', border:'1px solid var(--t-mist)', textAlign:'center' }}>
                  <div style={{ fontSize:'clamp(1rem,2.2vh,1.3rem)', fontWeight:800, color:'var(--t-mid)' }}>{val}<span style={{ fontSize:'0.6em', color:'var(--t-slate)', fontWeight:600 }}>/5</span></div>
                  <div style={{ width:'100%', height:'3px', background:'var(--t-mist)', borderRadius:'2px', margin:'0.25rem 0' }}>
                    <div style={{ width:`${Math.round((val/5)*100)}%`, height:'100%', background:'var(--t-eucalyptus)', borderRadius:'2px' }} />
                  </div>
                  <div style={{ fontSize:'0.6rem', fontWeight:700, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feedback */}
        {hasScores && wellMsg && nextMsg && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem', marginBottom:'0.85rem' }}>
            <div style={{ background:'#F0FDF4', borderRadius:'var(--t-r-md)', padding:'0.6rem 0.65rem', border:'1px solid #BBF7D0', textAlign:'left' }}>
              <div style={{ fontSize:'0.58rem', fontWeight:800, color:'#15803D', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.35rem' }}>What you did well</div>
              <p style={{ margin:0, fontSize:'0.7rem', color:'#166534', lineHeight:1.4 }}>{wellMsg}</p>
            </div>
            <div style={{ background:'#FFF7ED', borderRadius:'var(--t-r-md)', padding:'0.6rem 0.65rem', border:'1px solid #FED7AA', textAlign:'left' }}>
              <div style={{ fontSize:'0.58rem', fontWeight:800, color:'#C2410C', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.35rem' }}>Next time, try to...</div>
              <p style={{ margin:0, fontSize:'0.7rem', color:'#9A3412', lineHeight:1.4 }}>{nextMsg}</p>
            </div>
          </div>
        )}

        <button onClick={() => setCurrentScreen('map')}
          style={{ width:'100%', background:'linear-gradient(135deg,var(--t-mid),var(--t-eucalyptus))', color:'white', border:'none', padding:'0.85rem', fontSize:'0.95rem', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.09em', boxShadow:'0 6px 20px rgba(26,82,56,0.4)' }}>
          Continue Exploring
        </button>
      </div>
    </div>
  );
}
