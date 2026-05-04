import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

// ── Data ──────────────────────────────────────────────────────────────────────

const MODES = [
  {
    id: 'zoo',
    label: 'At the Zoo',
    accent: '#4ecb71',
    tag: 'Live Experience',
    summary: 'GPS-guided animal tracking and live missions during your Taronga Zoo excursion.',
    detail: 'Students explore Taronga Zoo with real-time GPS guidance, discovering animals in their natural habitats, completing keeper-designed missions and building their badge collection — all across one incredible visit.',
    image: '/images/screenshots/app-map.png',
  },
  {
    id: 'zoosnooz',
    label: 'ZooSnooz',
    accent: '#a482e8',
    tag: 'Overnight Program',
    summary: 'Taronga\'s overnight experience with after-dark keeper missions and documentary making.',
    detail: 'Designed exclusively for Taronga\'s ZooSnooz overnight program. Students complete nocturnal animal observations, interact with keepers and produce a wildlife documentary — all under the stars at the zoo.',
    image: '/images/screenshots/app-zoosnooz.png',
  },
  {
    id: 'school',
    label: 'At School',
    accent: '#4ecbcb',
    tag: 'Coming Soon',
    comingSoon: true,
    summary: 'A virtual zoo that brings the full Taronga experience into your classroom.',
    detail: 'Can\'t make it to the zoo? Taronga Tracka will recreate the complete zoo experience in your classroom. Students track virtual animals, complete digital missions and earn badges — building their own virtual Taronga from their desks.',
    image: null,
  },
];

const FEATURES = [
  {
    id: 'gps',
    label: 'GPS Technology',
    tagline: 'Find every animal, every time.',
    desc: 'Real-time GPS guidance leads students directly to each animal zone across the zoo. No paper maps, no lost groups — just a seamless, self-guided wildlife trail that keeps every student on track.',
    image: '/images/screenshots/app-map.png',
  },
  {
    id: 'missions',
    label: 'Missions & Games',
    tagline: 'Learning through play.',
    desc: 'Students engage through interactive games, hands-on keeper activities and documentary making — all built around each animal\'s real habitat and behaviour. Every mission is different, every visit stays fresh.',
    image: '/images/screenshots/app-zoosnooz.png',
  },
  {
    id: 'badges',
    label: 'Badge Collection',
    tagline: 'Every visit tells a story.',
    desc: 'Completed missions unlock personalised animal badges. Students build a digital wildlife collection that reflects their real discoveries at the zoo — a tangible record of what they found, learned and explored.',
    image: '/images/screenshots/app-collection.png',
  },
  {
    id: 'conservation',
    label: 'Conservation Science',
    tagline: 'Connecting visits to outcomes.',
    desc: 'Evidence-based content connects every zoo encounter to real-world conservation outcomes. Stage-appropriate curriculum links turn a school excursion into a science lesson that extends far beyond the visit.',
    image: '/images/screenshots/app-map.png',
  },
];

const STEPS = [
  { n: '01', label: 'Create a Class',    desc: 'Set up your class in the teacher portal and receive a unique class code in seconds.', tag: 'Teacher' },
  { n: '02', label: 'Students Join',     desc: 'Students enter the class code on arrival to connect instantly to your group.', tag: 'Student' },
  { n: '03', label: 'Explore the Zoo',   desc: 'GPS technology guides students to each animal zone at their own pace.' },
  { n: '04', label: 'Complete Missions', desc: 'Students engage through games, hands-on activities and documentary making.' },
  { n: '05', label: 'Earn Badges',       desc: 'Completed missions unlock badges that build each student\'s wildlife collection.' },
];

const PORTAL_FEATURES = [
  { label: 'Live Analytics',          desc: 'Track mission completion, observation quality and student progress across your class in real time.' },
  { label: 'Learning Suggestions',    desc: 'Tailored follow-up recommendations help you extend the zoo visit back in the classroom.' },
  { label: 'Observation Review',      desc: 'Read student wildlife observations and watch documentary submissions from a single dashboard.' },
  { label: 'Built for Busy Teachers', desc: 'Automated reporting and class tools designed to save time and lift the quality of your practice.' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function PhoneMockup({ src, alt = '', style = {} }) {
  return (
    <div style={{ position:'relative', width:'190px', flexShrink:0, ...style }}>
      <div style={{ borderRadius:'26px', border:'6px solid rgba(255,255,255,0.16)', overflow:'hidden', boxShadow:'0 20px 56px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)', background:'#050e08' }}>
        <div style={{ height:'9px', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:'36px', height:'3px', background:'rgba(255,255,255,0.14)', borderRadius:'2px' }} />
        </div>
        <img src={src} alt={alt} style={{ width:'100%', display:'block', objectFit:'cover', objectPosition:'top' }} />
      </div>
      <div style={{ position:'absolute', right:'-8px', top:'65px', width:'3px', height:'32px', background:'rgba(255,255,255,0.13)', borderRadius:'2px' }} />
    </div>
  );
}

function ExpandableFeatureCard({ feature, isOpen, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: isOpen ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.038)',
        border: `1px solid ${isOpen ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius:'16px',
        overflow:'hidden',
        cursor:'pointer',
        transition:'background 0.2s, border-color 0.2s',
      }}
    >
      {/* Card header — always visible */}
      <div style={{ padding:'1.1rem 1.15rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem' }}>
        <div>
          <div style={{ fontSize:'1.25rem', fontWeight:800, color:'white', lineHeight:1.15, letterSpacing:'-0.01em', marginBottom:'0.2rem' }}>
            {feature.label}
          </div>
          <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.48)', fontStyle:'italic' }}>
            {feature.tagline}
          </div>
        </div>
        <div style={{
          flexShrink:0, width:'28px', height:'28px', borderRadius:'50%',
          background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'0.75rem', color:'rgba(255,255,255,0.55)',
          transition:'transform 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ↓
        </div>
      </div>

      {/* Expanded content */}
      <div style={{
        maxHeight: isOpen ? '500px' : '0',
        overflow:'hidden',
        transition:'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {feature.image && (
          <div style={{ width:'100%', height:'180px', overflow:'hidden', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <img src={feature.image} alt={feature.label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', display:'block' }} />
          </div>
        )}
        <div style={{ padding:'1rem 1.15rem 1.2rem', borderTop: feature.image ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.65)', lineHeight:1.75, margin:0 }}>
            {feature.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { setCurrentScreen, setAppMode } = useApp();
  const [learnOpen, setLearnOpen] = useState(false);
  const [page, setPage]           = useState(0);
  const [activeMode, setActiveMode]           = useState('zoo');
  const [expandedFeature, setExpandedFeature] = useState(null);
  const scrollRef  = useRef(null);
  const pagesRef   = useRef([]);

  const openLearn = () => { setLearnOpen(true); setPage(0); };
  const closeLearn = () => {
    setLearnOpen(false);
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setPage(0);
    }, 550);
  };

  const goToPage = (i) => {
    pagesRef.current[i]?.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    // Find which page occupies the most of the viewport
    const container = scrollRef.current;
    const mid = container.scrollTop + container.clientHeight / 2;
    let best = 0;
    pagesRef.current.forEach((el, i) => {
      if (el && el.offsetTop <= mid) best = i;
    });
    setPage(best);
  };

  const activeModeData = MODES.find(m => m.id === activeMode);

  return (
    <>
      {/* ── Home screen ──────────────────────────────────────────────── */}
      <div style={{ position:'relative', width:'100%', height:'100vh', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'linear-gradient(180deg,rgba(7,30,20,0.55) 0%,rgba(7,30,20,0.3) 40%,rgba(7,30,20,0.72) 100%)' }} />
        <div style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'2rem 1.5rem', textAlign:'center' }}>
          <div className="animate-fade-in-up" style={{ animationDelay:'0.15s', marginBottom:'clamp(1.2rem,3.5vh,2.2rem)' }}>
            <img src="/images/logo.png" alt="Taronga Tracka" style={{ width:'clamp(180px,42vw,260px)', height:'auto', display:'block', filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }} onError={e => e.target.style.display='none'} />
          </div>
          <div className="animate-fade-in-up" style={{ background:'rgba(7,30,20,0.55)', backdropFilter:'blur(18px) saturate(1.2)', WebkitBackdropFilter:'blur(18px) saturate(1.2)', borderRadius:'var(--t-r-xl)', padding:'clamp(1.2rem,2.5vh,1.8rem) clamp(1.5rem,4vw,2.2rem)', marginBottom:'clamp(1.2rem,3vh,2rem)', border:'1px solid rgba(255,255,255,0.12)', maxWidth:'460px', width:'90%', animationDelay:'0.35s' }}>
            <h3 className="taronga-title" style={{ fontSize:'clamp(1.6rem,4vw,2rem)', marginBottom:'0.75rem', color:'white', letterSpacing:'0.04em', textShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>Step Into the Wild</h3>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'0.45rem' }}>
              {['Track animals across the zoo','Record meaningful observations','Earn badges for your discoveries'].map((line,i) => (
                <li key={i} style={{ fontSize:'clamp(0.9rem,2vw,1.05rem)', color:'rgba(255,255,255,0.88)', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:'center' }}>
                  <span style={{ color:'var(--t-eucalyptus)', fontSize:'0.8em' }}>▸</span>{line}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => { setAppMode('public'); setCurrentScreen('publicEntry'); }} className="animate-scale-in"
            style={{ background:'linear-gradient(135deg,var(--sunset-orange) 0%,var(--earth-clay) 100%)', color:'white', border:'none', padding:'clamp(0.85rem,2vh,1.05rem) clamp(2.5rem,6vw,3rem)', fontSize:'clamp(1rem,2.2vw,1.15rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', boxShadow:'0 8px 28px rgba(180,90,40,0.45)', animationDelay:'0.55s', textTransform:'uppercase', letterSpacing:'0.12em', width:'min(88vw,380px)', marginBottom:'0.85rem', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 36px rgba(180,90,40,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(180,90,40,0.45)'; }}>
            Let's Track!
          </button>
          <button onClick={() => setCurrentScreen('schoolEntry')}
            style={{ padding:'clamp(0.75rem,1.8vh,0.95rem) clamp(2rem,5vw,2.5rem)', borderRadius:'var(--t-r-pill)', border:'1.5px solid rgba(255,255,255,0.28)', background:'rgba(26,82,56,0.6)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', color:'white', cursor:'pointer', fontWeight:600, width:'min(88vw,380px)', boxShadow:'0 4px 16px rgba(0,0,0,0.2)', transition:'all 0.2s', textTransform:'uppercase', letterSpacing:'0.1em', fontSize:'clamp(0.9rem,2vw,1rem)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(26,82,56,0.85)'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(26,82,56,0.6)'; e.currentTarget.style.transform='translateY(0)'; }}>
            Taronga Education
          </button>
        </div>
        <button onClick={openLearn} style={{ position:'absolute', bottom:'1.5rem', left:'50%', transform:'translateX(-50%)', background:'none', border:'none', cursor:'pointer', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.35rem', color:'rgba(255,255,255,0.72)', animation:'lm-bob 2.4s ease-in-out infinite', padding:'0.5rem 1rem' }}>
          <span style={{ fontSize:'0.68rem', fontWeight:800, letterSpacing:'0.22em', textTransform:'uppercase' }}>Learn More</span>
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none"><path d="M1 1L9 9L17 1" stroke="rgba(255,255,255,0.72)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* ── Learn More overlay ────────────────────────────────────────── */}
      <div style={{ position:'fixed', inset:0, zIndex:500, transform: learnOpen?'translateY(0)':'translateY(100%)', transition:'transform 0.55s cubic-bezier(0.32,0,0.18,1)', pointerEvents: learnOpen?'all':'none' }}>
        <div style={{ position:'absolute', inset:0, background:'#06100a', zIndex:0 }} />
        <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background: page===0?'radial-gradient(ellipse at 80% 5%,rgba(15,70,35,0.55) 0%,transparent 50%)':page===1?'radial-gradient(ellipse at 20% 5%,rgba(5,45,75,0.55) 0%,transparent 50%)':'radial-gradient(ellipse at 60% 5%,rgba(8,55,40,0.6) 0%,transparent 50%)', transition:'background 0.9s ease' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', zIndex:5, background:['linear-gradient(to right,#2b9c46,#4ecb71)','linear-gradient(to right,#2684c4,#4ecbcb)','linear-gradient(to right,#1a8c6e,#50c8a0)'][page], transition:'background 0.6s ease' }} />

        {/* Close */}
        <button onClick={closeLearn} style={{ position:'absolute', top:'1rem', right:'1rem', zIndex:40, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', color:'rgba(255,255,255,0.8)', width:'36px', height:'36px', borderRadius:'50%', cursor:'pointer', fontSize:'0.95rem', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(10px)' }}>✕</button>

        {/* Dots */}
        <div style={{ position:'absolute', right:'0.8rem', top:'50%', transform:'translateY(-50%)', zIndex:40, display:'flex', flexDirection:'column', gap:'0.55rem' }}>
          {[0,1,2].map(i => (
            <div key={i} onClick={() => goToPage(i)} style={{ width:page===i?'8px':'5px', height:page===i?'8px':'5px', borderRadius:'50%', cursor:'pointer', transition:'all 0.25s', background:page===i?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.28)', boxShadow:page===i?'0 0 10px rgba(255,255,255,0.5)':'none' }} />
          ))}
        </div>

        {/* Scroll container */}
        <div ref={scrollRef} onScroll={handleScroll} style={{ position:'relative', zIndex:10, height:'100%', width:'100%', overflowY:'scroll', scrollSnapType:'y proximity', WebkitOverflowScrolling:'touch' }}>

          {/* ══ PAGE 1 · About ══════════════════════════════════════════ */}
          <div ref={el => pagesRef.current[0] = el} style={{ minHeight:'100vh', height:'auto', scrollSnapAlign:'start', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'0 0 4rem', position:'relative' }}>

            {/* Header */}
            <div style={{ width:'100%', padding:'3rem 1.5rem 1.6rem', textAlign:'center' }}>
              <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(78,203,113,0.85)', textTransform:'uppercase', letterSpacing:'0.28em', margin:'0 0 0.55rem' }}>About</p>
              <h2 className="taronga-title" style={{ fontSize:'clamp(1.75rem,6vw,2.5rem)', color:'white', margin:'0 0 0.3rem', letterSpacing:'0.03em', lineHeight:1.1 }}>
                An Immersive Education Platform
              </h2>
              <p style={{ fontSize:'0.72rem', fontWeight:700, color:'rgba(78,203,113,0.7)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.8rem' }}>Built by Taronga Zoo</p>
              <p style={{ fontSize:'0.86rem', color:'rgba(255,255,255,0.52)', lineHeight:1.72, margin:'0 auto' }}>
                Three powerful ways to learn about wildlife — at the zoo, overnight, or in your classroom.
              </p>
            </div>

            {/* ── Three experiences card ── */}
            <div style={{ padding:'0 1.2rem', width:'100%', marginBottom:'1.6rem' }}>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'18px', overflow:'hidden' }}>
                {/* Tab bar */}
                <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  {MODES.map(m => (
                    <button key={m.id} onClick={e => { e.stopPropagation(); setActiveMode(m.id); }}
                      style={{ flex:1, padding:'0.75rem 0.4rem', border:'none', cursor:'pointer', background:'transparent', borderBottom:`2px solid ${activeMode===m.id ? m.accent : 'transparent'}`, transition:'border-color 0.2s', position:'relative' }}>
                      <div style={{ fontSize:'0.67rem', fontWeight:800, color: activeMode===m.id ? 'white' : 'rgba(255,255,255,0.38)', letterSpacing:'0.04em', lineHeight:1.3, transition:'color 0.2s' }}>
                        {m.label}
                      </div>
                      {m.comingSoon && (
                        <div style={{ position:'absolute', top:'4px', right:'4px', fontSize:'0.45rem', fontWeight:900, background:'rgba(78,203,203,0.18)', color:'rgba(78,203,203,0.85)', padding:'0.1rem 0.3rem', borderRadius:'4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Soon</div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div style={{ padding:'1.1rem 1.15rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
                    <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: activeModeData?.accent, flexShrink:0 }} />
                    <span style={{ fontSize:'0.6rem', fontWeight:800, color: activeModeData?.accent, textTransform:'uppercase', letterSpacing:'0.16em' }}>{activeModeData?.tag}</span>
                  </div>
                  <p style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.7)', lineHeight:1.72, margin:'0 0 0.9rem' }}>
                    {activeModeData?.detail}
                  </p>
                  {activeModeData?.image ? (
                    <div style={{ borderRadius:'12px', overflow:'hidden', height:'140px', border:'1px solid rgba(255,255,255,0.08)' }}>
                      <img src={activeModeData.image} alt={activeModeData.label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', display:'block' }} />
                    </div>
                  ) : (
                    <div style={{ borderRadius:'12px', height:'100px', background:'rgba(78,203,203,0.06)', border:'1px solid rgba(78,203,203,0.12)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.35rem' }}>
                      <div style={{ fontSize:'0.7rem', fontWeight:800, color:'rgba(78,203,203,0.7)', textTransform:'uppercase', letterSpacing:'0.14em' }}>Coming Soon</div>
                      <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', textAlign:'center', lineHeight:1.5 }}>Virtual zoo classroom experience in development</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Expandable feature cards ── */}
            <div style={{ padding:'0 1.2rem', width:'100%' }}>
              <div style={{ height:'1px', background:'rgba(255,255,255,0.07)', marginBottom:'1.1rem' }} />
              <p style={{ fontSize:'0.58rem', fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.22em', margin:'0 0 0.85rem' }}>Platform Features</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                {FEATURES.map(f => (
                  <ExpandableFeatureCard
                    key={f.id}
                    feature={f}
                    isOpen={expandedFeature === f.id}
                    onToggle={() => setExpandedFeature(expandedFeature === f.id ? null : f.id)}
                  />
                ))}
              </div>
            </div>

            <div style={{ position:'absolute', bottom:'1.4rem', left:'50%', transform:'translateX(-50%)', opacity:0.28, animation:'lm-bob 2.6s ease-in-out infinite', pointerEvents:'none' }}>
              <svg width="16" height="9" viewBox="0 0 18 10" fill="none"><path d="M1 1L9 9L17 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* ══ PAGE 2 · How It Works ═══════════════════════════════════ */}
          <div ref={el => pagesRef.current[1] = el} style={{ height:'100vh', scrollSnapAlign:'start', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem 1.5rem 3.5rem', position:'relative' }}>
            <div style={{ width:'100%', textAlign:'center', marginBottom:'1.8rem', padding:'0 1.5rem' }}>
              <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(78,180,203,0.85)', textTransform:'uppercase', letterSpacing:'0.28em', margin:'0 0 0.6rem' }}>The Journey</p>
              <h2 className="taronga-title" style={{ fontSize:'clamp(1.8rem,6.5vw,2.6rem)', color:'white', margin:'0 0 0.5rem', letterSpacing:'0.04em', lineHeight:1.1 }}>How It Works</h2>
              <p style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.45)', lineHeight:1.65, margin:0 }}>From first log-in to final badge — a seamless guided experience.</p>
            </div>

            <div style={{ width:'100%', padding:'0 1.5rem' }}>
              {STEPS.map((s, i) => (
                <div key={s.n} style={{ display:'flex', alignItems:'flex-start', gap:'0.95rem', position:'relative' }}>
                  {i < STEPS.length - 1 && (
                    <div style={{ position:'absolute', left:'17px', top:'38px', width:'2px', height:'calc(100% - 2px)', background:'linear-gradient(to bottom,rgba(78,180,203,0.28),rgba(78,180,203,0.04))', zIndex:0 }} />
                  )}
                  <div style={{ flexShrink:0, zIndex:1, width:'36px', height:'36px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: i<2?'linear-gradient(135deg,rgba(38,132,196,0.4),rgba(78,180,203,0.22))':'rgba(255,255,255,0.055)', border:`1.5px solid ${i<2?'rgba(78,180,203,0.5)':'rgba(255,255,255,0.1)'}`, fontSize:'0.6rem', fontWeight:800, color:i<2?'rgba(78,200,210,0.95)':'rgba(255,255,255,0.4)', letterSpacing:'0.04em' }}>
                    {s.n}
                  </div>
                  <div style={{ paddingBottom: i < STEPS.length-1 ? '1.25rem' : 0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', paddingTop:'0.45rem' }}>
                      <span style={{ fontSize:'0.86rem', fontWeight:700, color:'white' }}>{s.label}</span>
                      {s.tag && <span style={{ fontSize:'0.56rem', background:'rgba(78,180,203,0.12)', border:'1px solid rgba(78,180,203,0.28)', color:'rgba(78,200,210,0.85)', padding:'0.12rem 0.45rem', borderRadius:'99px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>{s.tag}</span>}
                    </div>
                    <div style={{ fontSize:'0.73rem', color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ position:'absolute', bottom:'1.4rem', left:'50%', transform:'translateX(-50%)', opacity:0.28, animation:'lm-bob 2.6s ease-in-out infinite' }}>
              <svg width="16" height="9" viewBox="0 0 18 10" fill="none"><path d="M1 1L9 9L17 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* ══ PAGE 3 · Teacher Portal ═════════════════════════════════ */}
          <div ref={el => pagesRef.current[2] = el} style={{ minHeight:'100vh', height:'auto', scrollSnapAlign:'start', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', padding:'0 0 3rem', position:'relative' }}>
            <div style={{ width:'100%', padding:'3rem 1.5rem 1.4rem', textAlign:'center' }}>
              <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(80,200,160,0.85)', textTransform:'uppercase', letterSpacing:'0.28em', margin:'0 0 0.6rem' }}>For Educators</p>
              <h2 className="taronga-title" style={{ fontSize:'clamp(1.8rem,6.5vw,2.6rem)', color:'white', margin:'0 0 0.5rem', letterSpacing:'0.04em', lineHeight:1.1 }}>Teacher Portal</h2>
              <p style={{ fontSize:'0.86rem', color:'rgba(255,255,255,0.5)', lineHeight:1.7, margin:'0 auto' }}>
                Everything you need to run a seamless excursion and bring the learning back to your classroom.
              </p>
            </div>

            <div style={{ display:'flex', alignItems:'flex-start', gap:'1.1rem', padding:'0 1.5rem', width:'100%', marginBottom:'1.3rem' }}>
              <PhoneMockup src="/images/screenshots/app-teacher.png" alt="Teacher dashboard" />
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'0.6rem', paddingTop:'0.15rem' }}>
                {[{ t:'Dashboard', d:'Class overview, student progress and live activity feed' },{ t:'Analytics', d:'Observation scoring, badge tracking and class reports' },{ t:'Resources', d:'Pre/post visit materials aligned to your curriculum' }].map(item => (
                  <div key={item.t} style={{ background:'rgba(80,200,160,0.07)', border:'1px solid rgba(80,200,160,0.16)', borderRadius:'11px', padding:'0.65rem 0.8rem' }}>
                    <div style={{ fontSize:'0.67rem', fontWeight:800, color:'rgba(80,200,160,0.88)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.22rem' }}>{item.t}</div>
                    <div style={{ fontSize:'0.66rem', color:'rgba(255,255,255,0.46)', lineHeight:1.55 }}>{item.d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding:'0 1.2rem', width:'100%' }}>
              <div style={{ height:'1px', background:'rgba(255,255,255,0.07)', marginBottom:'1.1rem' }} />
              <p style={{ fontSize:'0.58rem', fontWeight:800, color:'rgba(255,255,255,0.28)', textTransform:'uppercase', letterSpacing:'0.22em', margin:'0 0 0.85rem' }}>Portal Features</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                {PORTAL_FEATURES.map((item, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', background:'rgba(255,255,255,0.032)', border:'1px solid rgba(255,255,255,0.065)', borderLeft:'2.5px solid rgba(80,200,160,0.42)', borderRadius:'10px', padding:'0.7rem 0.85rem' }}>
                    <div>
                      <div style={{ fontSize:'0.78rem', fontWeight:700, color:'rgba(255,255,255,0.85)', marginBottom:'0.14rem' }}>{item.label}</div>
                      <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop:'1.5rem', textAlign:'center' }}>
              <div onClick={() => { closeLearn(); setCurrentScreen('adminLogin'); }}
                style={{ display:'inline-block', color:'rgba(255,255,255,0.32)', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.14)', paddingBottom:'2px', transition:'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.62)'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.32)'}>
                Taronga Staff Login
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes lm-bob {
          0%, 100% { opacity:0.7; transform:translateX(-50%) translateY(0); }
          50%       { opacity:1;  transform:translateX(-50%) translateY(6px); }
        }
      `}</style>
    </>
  );
}
