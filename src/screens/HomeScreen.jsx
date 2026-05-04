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

function BrowserFrame({ src, alt = '' }) {
  return (
    <div style={{ borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 16px 52px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.04)', background:'#060d08' }}>
      <div style={{ background:'rgba(255,255,255,0.045)', padding:'0.55rem 0.8rem', display:'flex', alignItems:'center', gap:'0.55rem', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', gap:'5px', flexShrink:0 }}>
          {['#ff5f57','#febc2e','#28c840'].map((c,i) => (
            <div key={i} style={{ width:'9px', height:'9px', borderRadius:'50%', background:c, opacity:0.72 }} />
          ))}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.055)', borderRadius:'5px', height:'17px' }} />
      </div>
      <div style={{ aspectRatio:'16/9', overflow:'hidden' }}>
        <img src={src} alt={alt} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', display:'block' }} />
      </div>
    </div>
  );
}

function ExpandableFeatureCard({ feature, isOpen, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: isOpen ? 'rgba(78,203,113,0.05)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isOpen ? 'rgba(78,203,113,0.18)' : 'rgba(255,255,255,0.07)'}`,
        borderLeft: `3px solid ${isOpen ? '#4ecb71' : 'rgba(255,255,255,0.1)'}`,
        borderRadius:'14px',
        overflow:'hidden',
        cursor:'pointer',
        transition:'background 0.22s, border-color 0.22s',
      }}
    >
      <div style={{ padding:'1rem 1.15rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem' }}>
        <div>
          <div style={{ fontSize:'1.05rem', fontWeight:800, color:'white', lineHeight:1.2, letterSpacing:'-0.01em', marginBottom:'0.18rem' }}>
            {feature.label}
          </div>
          <div style={{ fontSize:'0.76rem', color:'rgba(255,255,255,0.4)', fontStyle:'italic' }}>
            {feature.tagline}
          </div>
        </div>
        <div style={{
          flexShrink:0, width:'26px', height:'26px', borderRadius:'50%',
          background: isOpen ? 'rgba(78,203,113,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${isOpen ? 'rgba(78,203,113,0.35)' : 'rgba(255,255,255,0.1)'}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'0.65rem', color: isOpen ? '#4ecb71' : 'rgba(255,255,255,0.4)',
          transition:'all 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ↓
        </div>
      </div>

      <div style={{
        maxHeight: isOpen ? '600px' : '0',
        overflow:'hidden',
        transition:'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {feature.image && (
          <div style={{ width:'100%', aspectRatio:'16/9', overflow:'hidden', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <img src={feature.image} alt={feature.label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', display:'block' }} />
          </div>
        )}
        <div style={{ padding:'1rem 1.15rem 1.2rem', borderTop: feature.image ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.62)', lineHeight:1.78, margin:0 }}>
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

      {/* ── Learn More overlay ── */}
      <div style={{ position:'fixed', inset:0, zIndex:500, transform: learnOpen?'translateY(0)':'translateY(100%)', transition:'transform 0.55s cubic-bezier(0.32,0,0.18,1)', pointerEvents: learnOpen?'all':'none' }}>
        <div style={{ position:'absolute', inset:0, background:'#050e08', zIndex:0 }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', zIndex:5, background:['linear-gradient(to right,#2b9c46,#4ecb71)','linear-gradient(to right,#2684c4,#4ecbcb)','linear-gradient(to right,#1a8c6e,#50c8a0)'][page], transition:'background 0.6s ease' }} />

        <button onClick={closeLearn} style={{ position:'absolute', top:'1.1rem', right:'1.1rem', zIndex:40, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.7)', width:'38px', height:'38px', borderRadius:'50%', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(10px)' }}>✕</button>

        <div style={{ position:'absolute', right:'0.8rem', top:'50%', transform:'translateY(-50%)', zIndex:40, display:'flex', flexDirection:'column', gap:'0.55rem' }}>
          {[0,1,2].map(i => (
            <div key={i} onClick={() => goToPage(i)} style={{ width:page===i?'8px':'5px', height:page===i?'8px':'5px', borderRadius:'50%', cursor:'pointer', transition:'all 0.25s', background:page===i?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.28)', boxShadow:page===i?'0 0 10px rgba(255,255,255,0.5)':'none' }} />
          ))}
        </div>

        <div ref={scrollRef} onScroll={handleScroll} style={{ position:'relative', zIndex:10, height:'100%', width:'100%', overflowY:'scroll', scrollSnapType:'y proximity', WebkitOverflowScrolling:'touch' }}>

          {/* ══ PAGE 1 · About ══ */}
          <div ref={el => pagesRef.current[0] = el} style={{ minHeight:'100vh', height:'auto', scrollSnapAlign:'start', display:'flex', flexDirection:'column', alignItems:'center', paddingBottom:'5rem', position:'relative' }}>

            <div style={{ width:'100%', maxWidth:'580px', padding:'3.5rem 1.5rem 2rem', textAlign:'center' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(78,203,113,0.1)', border:'1px solid rgba(78,203,113,0.2)', borderRadius:'99px', padding:'0.28rem 0.8rem', marginBottom:'1.4rem' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#4ecb71', flexShrink:0 }} />
                <span style={{ fontSize:'0.57rem', fontWeight:800, color:'#4ecb71', textTransform:'uppercase', letterSpacing:'0.2em' }}>Taronga Zoo Education</span>
              </div>
              <h2 className="taronga-title" style={{ fontSize:'clamp(2.2rem,8vw,3.2rem)', color:'white', margin:'0 0 1rem', letterSpacing:'-0.02em', lineHeight:1.06, fontWeight:900 }}>
                Learning that<br/>lives at the zoo.
              </h2>
              <p style={{ fontSize:'0.95rem', color:'rgba(255,255,255,0.52)', lineHeight:1.75, margin:'0 auto', maxWidth:'360px' }}>
                Real animals. Real science. Three powerful ways to bring your students closer to wildlife.
              </p>
            </div>

            <div style={{ width:'100%', maxWidth:'580px', padding:'0 1.5rem', marginBottom:'0.85rem' }}>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {MODES.map(m => (
                  <button key={m.id} onClick={e => { e.stopPropagation(); setActiveMode(m.id); }}
                    style={{ flex:1, padding:'0.7rem 0.3rem', border:`1.5px solid ${activeMode===m.id ? m.accent : 'rgba(255,255,255,0.1)'}`, borderRadius:'10px', cursor:'pointer', background: activeMode===m.id ? `${m.accent}18` : 'rgba(255,255,255,0.025)', transition:'all 0.22s', position:'relative' }}>
                    <div style={{ fontSize:'0.63rem', fontWeight:800, color: activeMode===m.id ? m.accent : 'rgba(255,255,255,0.35)', letterSpacing:'0.02em', lineHeight:1.3, transition:'color 0.2s' }}>
                      {m.label}
                    </div>
                    {m.comingSoon && <div style={{ position:'absolute', top:'-7px', right:'4px', fontSize:'0.42rem', fontWeight:900, background:'rgba(78,203,203,0.9)', color:'#050e08', padding:'0.1rem 0.32rem', borderRadius:'4px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Soon</div>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width:'100%', maxWidth:'580px', padding:'0 1.5rem', marginBottom:'2rem' }}>
              <div style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${activeModeData?.accent}28`, borderRadius:'16px', overflow:'hidden' }}>
                {activeModeData?.image ? (
                  <div style={{ aspectRatio:'16/9', overflow:'hidden' }}>
                    <img src={activeModeData.image} alt={activeModeData.label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', display:'block' }} />
                  </div>
                ) : (
                  <div style={{ aspectRatio:'16/9', background:'rgba(78,203,203,0.04)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                    <div style={{ fontSize:'0.68rem', fontWeight:800, color:'rgba(78,203,203,0.6)', textTransform:'uppercase', letterSpacing:'0.18em' }}>Coming Soon</div>
                    <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.28)', textAlign:'center', maxWidth:'220px', lineHeight:1.6 }}>Virtual zoo classroom experience in development</div>
                  </div>
                )}
                <div style={{ padding:'1.1rem 1.25rem 1.3rem' }}>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', marginBottom:'0.55rem' }}>
                    <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:activeModeData?.accent, flexShrink:0 }} />
                    <span style={{ fontSize:'0.57rem', fontWeight:800, color:activeModeData?.accent, textTransform:'uppercase', letterSpacing:'0.2em' }}>{activeModeData?.tag}</span>
                  </div>
                  <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.68)', lineHeight:1.74, margin:0 }}>{activeModeData?.detail}</p>
                </div>
              </div>
            </div>

            <div style={{ width:'100%', maxWidth:'580px', padding:'0 1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
                <span style={{ fontSize:'0.56rem', fontWeight:900, color:'rgba(255,255,255,0.22)', textTransform:'uppercase', letterSpacing:'0.3em', whiteSpace:'nowrap' }}>Platform Features</span>
                <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                {FEATURES.map(f => (
                  <ExpandableFeatureCard key={f.id} feature={f} isOpen={expandedFeature===f.id} onToggle={() => setExpandedFeature(expandedFeature===f.id ? null : f.id)} />
                ))}
              </div>
            </div>

            <div style={{ position:'absolute', bottom:'1.4rem', left:'50%', transform:'translateX(-50%)', opacity:0.25, animation:'lm-bob 2.6s ease-in-out infinite', pointerEvents:'none' }}>
              <svg width="16" height="9" viewBox="0 0 18 10" fill="none"><path d="M1 1L9 9L17 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* ══ PAGE 2 · How It Works ══ */}
          <div ref={el => pagesRef.current[1] = el} style={{ minHeight:'100vh', scrollSnapAlign:'start', display:'flex', flexDirection:'column', alignItems:'center', paddingBottom:'5rem', position:'relative' }}>

            <div style={{ width:'100%', maxWidth:'580px', padding:'3.5rem 1.5rem 2rem', textAlign:'center' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(78,180,203,0.1)', border:'1px solid rgba(78,180,203,0.2)', borderRadius:'99px', padding:'0.28rem 0.8rem', marginBottom:'1.2rem' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#4ecbcb', flexShrink:0 }} />
                <span style={{ fontSize:'0.57rem', fontWeight:800, color:'#4ecbcb', textTransform:'uppercase', letterSpacing:'0.2em' }}>The Journey</span>
              </div>
              <h2 className="taronga-title" style={{ fontSize:'clamp(2.2rem,8vw,3.2rem)', color:'white', margin:'0 0 0.8rem', letterSpacing:'-0.02em', lineHeight:1.06, fontWeight:900 }}>How It Works</h2>
              <p style={{ fontSize:'0.92rem', color:'rgba(255,255,255,0.42)', lineHeight:1.65, margin:'0 auto', maxWidth:'320px' }}>From first log-in to final badge — a seamless guided experience.</p>
            </div>

            <div style={{ width:'100%', maxWidth:'580px', padding:'0 1.5rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {STEPS.map((s, i) => (
                <div key={s.n} style={{ display:'flex', alignItems:'flex-start', gap:'1rem', background: i<2 ? 'rgba(38,132,196,0.07)' : 'rgba(255,255,255,0.03)', border:`1px solid ${i<2 ? 'rgba(78,180,203,0.18)' : 'rgba(255,255,255,0.06)'}`, borderRadius:'14px', padding:'1rem 1.2rem' }}>
                  <div style={{ flexShrink:0, fontSize:'1.7rem', fontWeight:900, lineHeight:1, color: i<2 ? 'rgba(78,200,210,0.65)' : 'rgba(255,255,255,0.15)', letterSpacing:'-0.04em', minWidth:'2.2rem' }}>
                    {s.n}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.22rem' }}>
                      <span style={{ fontSize:'0.91rem', fontWeight:700, color:'white', lineHeight:1.3 }}>{s.label}</span>
                      {s.tag && <span style={{ fontSize:'0.54rem', background: i<2 ? 'rgba(78,180,203,0.14)' : 'rgba(255,255,255,0.07)', border:`1px solid ${i<2 ? 'rgba(78,180,203,0.28)' : 'rgba(255,255,255,0.12)'}`, color: i<2 ? 'rgba(78,200,210,0.88)' : 'rgba(255,255,255,0.4)', padding:'0.1rem 0.42rem', borderRadius:'99px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>{s.tag}</span>}
                    </div>
                    <div style={{ fontSize:'0.77rem', color:'rgba(255,255,255,0.4)', lineHeight:1.62 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ position:'absolute', bottom:'1.4rem', left:'50%', transform:'translateX(-50%)', opacity:0.25, animation:'lm-bob 2.6s ease-in-out infinite' }}>
              <svg width="16" height="9" viewBox="0 0 18 10" fill="none"><path d="M1 1L9 9L17 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* ══ PAGE 3 · Teacher Portal ══ */}
          <div ref={el => pagesRef.current[2] = el} style={{ minHeight:'100vh', height:'auto', scrollSnapAlign:'start', display:'flex', flexDirection:'column', alignItems:'center', paddingBottom:'4rem', position:'relative' }}>

            <div style={{ width:'100%', maxWidth:'580px', padding:'3.5rem 1.5rem 1.8rem', textAlign:'center' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(80,200,160,0.1)', border:'1px solid rgba(80,200,160,0.2)', borderRadius:'99px', padding:'0.28rem 0.8rem', marginBottom:'1.2rem' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#50c8a0', flexShrink:0 }} />
                <span style={{ fontSize:'0.57rem', fontWeight:800, color:'#50c8a0', textTransform:'uppercase', letterSpacing:'0.2em' }}>For Educators</span>
              </div>
              <h2 className="taronga-title" style={{ fontSize:'clamp(2.2rem,8vw,3.2rem)', color:'white', margin:'0 0 0.8rem', letterSpacing:'-0.02em', lineHeight:1.06, fontWeight:900 }}>Teacher Portal</h2>
              <p style={{ fontSize:'0.92rem', color:'rgba(255,255,255,0.5)', lineHeight:1.72, margin:'0 auto', maxWidth:'360px' }}>
                Everything you need to run a seamless excursion and bring the learning back into your classroom.
              </p>
            </div>

            <div style={{ padding:'0 1.5rem', width:'100%', maxWidth:'580px', marginBottom:'1.6rem' }}>
              <BrowserFrame src="/images/screenshots/app-teacher.png" alt="Teacher portal dashboard" />
            </div>

            <div style={{ padding:'0 1.5rem', width:'100%', maxWidth:'580px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
                <span style={{ fontSize:'0.56rem', fontWeight:900, color:'rgba(255,255,255,0.22)', textTransform:'uppercase', letterSpacing:'0.3em', whiteSpace:'nowrap' }}>Portal Features</span>
                <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem' }}>
                {PORTAL_FEATURES.map((item, i) => (
                  <div key={i} style={{ background:'rgba(80,200,160,0.05)', border:'1px solid rgba(80,200,160,0.12)', borderRadius:'12px', padding:'0.85rem 0.9rem' }}>
                    <div style={{ fontSize:'0.74rem', fontWeight:800, color:'rgba(80,200,160,0.88)', marginBottom:'0.3rem', lineHeight:1.2 }}>{item.label}</div>
                    <div style={{ fontSize:'0.67rem', color:'rgba(255,255,255,0.42)', lineHeight:1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop:'2rem', textAlign:'center' }}>
              <div onClick={() => { closeLearn(); setCurrentScreen('adminLogin'); }}
                style={{ display:'inline-block', color:'rgba(255,255,255,0.28)', fontSize:'0.67rem', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.12)', paddingBottom:'2px', transition:'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.58)'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.28)'}>
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
