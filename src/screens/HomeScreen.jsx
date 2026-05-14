import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

// ── Data ──────────────────────────────────────────────────────────────────────

const MODES = [
  {
    id: 'zoo',
    label: 'At the Zoo',
    accent: '#4ecb71',
    tag: 'Live Experience',
    summary: 'GPS-guided animal tracking and live missions during your Taronga Zoo excursion.',
    detail: 'Explore Taronga Zoo Sydney (Dubbo coming soon). Students discover animals with real-time GPS guidance, completing keeper-designed missions and building their badge collection — all across one incredible visit.',
    image: '/images/screenshots/mode-zoo.jpg',
  },
  {
    id: 'zoosnooz',
    label: 'ZooSnooz',
    accent: '#a482e8',
    tag: 'Overnight Program',
    summary: 'Taronga\'s overnight experience with after-dark keeper missions and documentary making.',
    detail: 'Designed exclusively for Taronga\'s ZooSnooz overnight program. Students complete nocturnal animal observations, interact with keepers and produce a wildlife documentary — all under the stars at the zoo.',
    image: '/images/screenshots/mode-zoosnooz.jpg',
  },
  {
    id: 'school',
    label: 'At School',
    accent: '#4ecbcb',
    tag: 'Coming Soon',
    comingSoon: true,
    summary: 'A virtual zoo that brings the full Taronga experience into your classroom.',
    detail: 'Can\'t make it to the zoo? Taronga Tracka will recreate the complete zoo experience in your classroom. Students track virtual animals, complete digital missions and earn badges — building their own virtual Taronga from their desks.',
    image: '/images/screenshots/mode-school.jpg',
  },
];

const FEATURES = [
  {
    id: 'gps',
    label: 'GPS Technology',
    tagline: 'Find every animal, every time.',
    desc: 'Real-time GPS guidance leads students directly to each animal zone across the zoo. No paper maps, no lost groups — just a seamless, self-guided wildlife trail that keeps every student on track.',
    image: '/images/screenshots/app-map.jpg',
  },
  {
    id: 'missions',
    label: 'Missions & Games',
    tagline: 'Learning through play.',
    desc: 'Students engage through interactive games, hands-on keeper activities and documentary making — all built around each animal\'s real habitat and behaviour. Every mission is different, every visit stays fresh.',
    images: [
      '/images/screenshots/mission-1.jpg',
      '/images/screenshots/mission-2.jpg',
      '/images/screenshots/mission-3.jpg',
      '/images/screenshots/mission-4.jpg',
    ],
  },
  {
    id: 'badges',
    label: 'Badge Collection',
    tagline: 'Every visit tells a story.',
    desc: 'Completed missions unlock personalised animal badges. Students build a digital wildlife collection that reflects their real discoveries at the zoo — a tangible record of what they found, learned and explored.',
    image: '/images/screenshots/app-collection.jpg',
  },
  {
    id: 'conservation',
    label: 'Learning through Conservation',
    tagline: 'Extending the impact beyond the visit.',
    desc: 'Taronga Tracka connects directly to the Wildly Online Learning platform — giving teachers access to curriculum-aligned resources, assessments and learning pathways that extend the zoo experience and create lasting conservation impact.',
    image: '/images/screenshots/app-wildly.jpg',
  },
];

const STEPS = [
  { n:'01', label:'Create a Class',              role:'teacher', desc:'Set up your class in the teacher portal and receive a unique join code in seconds.' },
  { n:'02', label:'Students Join',               role:'student', desc:'Students enter the class code on arrival to connect instantly to your group.' },
  { n:'03', label:'Explore the Zoo',             role:'student', desc:'GPS technology guides students to each animal zone at their own pace.' },
  { n:'04', label:'Complete Missions',           role:'student', desc:'Students engage through games, hands-on activities and documentary making.' },
  { n:'05', label:'Earn Badges',                 role:'student', desc:'Completed missions unlock badges that build each student\'s wildlife collection.' },
  { n:'06', label:'Student Data & Learning Links', role:'teacher', desc:'Review observation scores, mission progress and curriculum-aligned learning reports from your teacher portal.' },
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
      <div style={{ padding:'1.1rem 1.4rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem' }}>
        <div>
          <div style={{ fontSize:'clamp(1rem,1.5vw,1.2rem)', fontWeight:800, color:'white', lineHeight:1.2, letterSpacing:'-0.01em', marginBottom:'0.2rem' }}>
            {feature.label}
          </div>
          <div style={{ fontSize:'clamp(0.75rem,1vw,0.88rem)', color:'rgba(255,255,255,0.4)', fontStyle:'italic' }}>
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
        maxHeight: isOpen ? '900px' : '0',
        overflow:'hidden',
        transition:'max-height 0.45s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {feature.renderCard && feature.renderCard()}
        {feature.images && (
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', position:'relative' }}>
            <div className="mission-scroll" style={{
              display:'flex', gap:'0.5rem', overflowX:'auto', padding:'0.75rem 0.75rem',
              scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch',
              scrollbarWidth:'none', msOverflowStyle:'none',
            }}>
              {feature.images.map((src, i) => (
                <div key={i} style={{ flexShrink:0, height:'240px', borderRadius:'10px', overflow:'hidden', scrollSnapAlign:'start', boxShadow:'0 4px 16px rgba(0,0,0,0.4)' }}>
                  <img src={src} alt={`${feature.label} ${i+1}`} style={{ height:'100%', width:'auto', display:'block', objectFit:'cover' }} />
                </div>
              ))}
            </div>
            <div style={{ position:'absolute', right:'0.75rem', bottom:'1.1rem', display:'flex', gap:'3px' }}>
              {feature.images.map((_,i) => (
                <div key={i} style={{ width:'4px', height:'4px', borderRadius:'50%', background:'rgba(255,255,255,0.25)' }} />
              ))}
            </div>
          </div>
        )}
        {feature.image && (
          <div style={{ width:'100%', aspectRatio:'16/9', overflow:'hidden', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <img src={feature.image} alt={feature.label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', display:'block' }} />
          </div>
        )}
        <div style={{ padding:'1.1rem 1.4rem 1.3rem', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize:'clamp(0.84rem,1.2vw,1rem)', color:'rgba(255,255,255,0.62)', lineHeight:1.78, margin:0 }}>
            {feature.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

const DEMO_SLIDES = [
  {
    id: 'overview',
    label: 'Class Overview',
    accent: '#4ecb71',
    src: '/images/screenshots/portal-slide-4.jpg',
    caption: 'At a glance: students, average points, badges earned, missions completed and quiz scores — plus most-visited animals and quiz distribution across your class.',
  },
  {
    id: 'writing',
    label: 'Writing Analytics',
    accent: '#50c8a0',
    src: '/images/screenshots/portal-slide-1.jpg',
    caption: 'Automated writing analysis scores every observation across Behaviour, Detail and Writing — with strength and focus area callouts for your whole class.',
  },
  {
    id: 'observations',
    label: 'Student Observations',
    accent: '#4ecbcb',
    src: '/images/screenshots/portal-slide-2.jpg',
    caption: 'View every student\'s field observations side-by-side, track completion, and drill into individual responses with a single tap.',
  },
  {
    id: 'zoosnooz',
    label: 'ZooSnooz Portal',
    accent: '#a482e8',
    src: '/images/screenshots/portal-slide-3.jpg',
    caption: 'Student-made wildlife documentaries are automatically collected and playable from your portal — ready to screen back in class.',
  },
];

function TeacherPortalDemo() {
  const [slide, setSlide] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const [imgKey, setImgKey] = useState(0);

  useEffect(() => {
    setCardVisible(false);
    const t1 = setTimeout(() => setCardVisible(true), 1200);
    const t2 = setTimeout(() => {
      setSlide(s => (s + 1) % DEMO_SLIDES.length);
      setImgKey(k => k + 1);
    }, 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  const current = DEMO_SLIDES[slide];
  const accent  = current.accent;

  return (
    <div style={{ borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 20px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)', background:'#060d08' }}>
      {/* macOS chrome */}
      <div style={{ background:'rgba(255,255,255,0.045)', padding:'0.55rem 0.8rem', display:'flex', alignItems:'center', gap:'0.55rem', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', gap:'5px', flexShrink:0 }}>
          {['#ff5f57','#febc2e','#28c840'].map((c,i) => (
            <div key={i} style={{ width:'9px', height:'9px', borderRadius:'50%', background:c, opacity:0.72 }} />
          ))}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.055)', borderRadius:'5px', height:'17px' }} />
        {/* Progress dots */}
        <div style={{ display:'flex', gap:'4px', flexShrink:0 }}>
          {DEMO_SLIDES.map((_,i) => (
            <div key={i} style={{ height:'4px', width: i===slide ? '16px' : '4px', borderRadius:'99px', background: i===slide ? accent : 'rgba(255,255,255,0.2)', transition:'all 0.4s ease' }} />
          ))}
        </div>
      </div>

      {/* Screenshot area — no fixed aspect ratio, let image dictate height */}
      <div style={{ position:'relative', overflow:'hidden', background:'#f0f0ee' }}>
        <img
          key={imgKey}
          src={current.src}
          alt={current.label}
          style={{ width:'100%', display:'block', animation:'portal-slide-in 0.5s cubic-bezier(0.32,0,0.18,1) both' }}
        />

        {/* Slide label badge — top left overlay */}
        <div style={{ position:'absolute', top:'0.6rem', left:'0.7rem', zIndex:3, display:'flex', alignItems:'center', gap:'0.38rem', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)', borderRadius:'99px', padding:'0.22rem 0.6rem' }}>
          <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:accent, flexShrink:0 }} />
          <span style={{ fontSize:'0.56rem', fontWeight:800, color:accent, textTransform:'uppercase', letterSpacing:'0.14em' }}>{current.label}</span>
        </div>

        {/* Explanation card slides up from bottom */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, zIndex:5,
          transform: cardVisible ? 'translateY(0)' : 'translateY(100%)',
          transition:'transform 0.5s cubic-bezier(0.32,0,0.18,1)',
          background:'rgba(5,14,8,0.88)',
          backdropFilter:'blur(12px)',
          WebkitBackdropFilter:'blur(12px)',
          borderTop:`1px solid ${accent}33`,
          padding:'0.85rem 1rem 0.8rem',
        }}>
          <p style={{ margin:0, fontSize:'0.8rem', color:'rgba(255,255,255,0.85)', lineHeight:1.6, textAlign:'center' }}>{current.caption}</p>
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
  const [p2Key, setP2Key] = useState(0);
  const scrollRef  = useRef(null);
  const pagesRef   = useRef([]);
  const lastPageRef = useRef(-1);

  useEffect(() => {
    if (page === 1 && lastPageRef.current !== 1) setP2Key(k => k + 1);
    lastPageRef.current = page;
  }, [page]);

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
          <button onClick={() => setCurrentScreen('comingSoon')} className="animate-scale-in"
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

            <div style={{ width:'100%', maxWidth:'min(92vw, 960px)', padding:'3.5rem 1.5rem 2rem', textAlign:'center' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(78,203,113,0.1)', border:'1px solid rgba(78,203,113,0.2)', borderRadius:'99px', padding:'0.28rem 0.8rem', marginBottom:'1.4rem' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#4ecb71', flexShrink:0 }} />
                <span style={{ fontSize:'0.62rem', fontWeight:800, color:'#4ecb71', textTransform:'uppercase', letterSpacing:'0.2em' }}>Taronga Zoo Education</span>
              </div>
              <h2 className="taronga-title" style={{ fontSize:'clamp(2.6rem,7vw,4.2rem)', color:'white', margin:'0 0 1.1rem', letterSpacing:'-0.02em', lineHeight:1.05 }}>
                Learning Through<br/>Nature with Taronga Zoo.
              </h2>
              <p style={{ fontSize:'clamp(0.95rem,1.4vw,1.15rem)', color:'rgba(255,255,255,0.52)', lineHeight:1.75, margin:'0 auto', maxWidth:'520px' }}>
                Real animals. Real science. Three powerful ways to bring your students closer to wildlife.
              </p>
            </div>

            <div style={{ width:'100%', maxWidth:'min(92vw, 960px)', padding:'0 1.5rem', marginBottom:'0.85rem' }}>
              <div style={{ display:'flex', gap:'0.65rem' }}>
                {MODES.map(m => (
                  <button key={m.id} onClick={e => { e.stopPropagation(); setActiveMode(m.id); }}
                    style={{ flex:1, padding:'0.85rem 0.5rem', border:`1.5px solid ${activeMode===m.id ? m.accent : 'rgba(255,255,255,0.1)'}`, borderRadius:'12px', cursor:'pointer', background: activeMode===m.id ? `${m.accent}18` : 'rgba(255,255,255,0.025)', transition:'all 0.22s', position:'relative' }}>
                    <div style={{ fontSize:'clamp(0.63rem,1.1vw,0.85rem)', fontWeight:800, color: activeMode===m.id ? m.accent : 'rgba(255,255,255,0.35)', letterSpacing:'0.02em', lineHeight:1.3, transition:'color 0.2s' }}>
                      {m.label}
                    </div>
                    {m.comingSoon && <div style={{ position:'absolute', top:'-7px', right:'4px', fontSize:'0.42rem', fontWeight:900, background:'rgba(78,203,203,0.9)', color:'#050e08', padding:'0.1rem 0.32rem', borderRadius:'4px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Soon</div>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width:'100%', maxWidth:'min(92vw, 960px)', padding:'0 1.5rem', marginBottom:'2rem' }}>
              <div style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${activeModeData?.accent}28`, borderRadius:'18px', overflow:'hidden' }}>
                <div style={{ aspectRatio:'16/9', overflow:'hidden' }}>
                  <img src={activeModeData.image} alt={activeModeData.label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }} />
                </div>
                <div style={{ padding:'1.4rem 1.6rem 1.6rem' }}>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', marginBottom:'0.6rem' }}>
                    <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:activeModeData?.accent, flexShrink:0 }} />
                    <span style={{ fontSize:'0.62rem', fontWeight:800, color:activeModeData?.accent, textTransform:'uppercase', letterSpacing:'0.2em' }}>{activeModeData?.tag}</span>
                  </div>
                  <p style={{ fontSize:'clamp(0.88rem,1.3vw,1.05rem)', color:'rgba(255,255,255,0.68)', lineHeight:1.74, margin:0 }}>{activeModeData?.detail}</p>
                </div>
              </div>
            </div>

            <div style={{ width:'100%', maxWidth:'min(92vw, 960px)', padding:'0 1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
                <span style={{ fontSize:'0.56rem', fontWeight:900, color:'rgba(255,255,255,0.22)', textTransform:'uppercase', letterSpacing:'0.3em', whiteSpace:'nowrap' }}>Platform Features</span>
                <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
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

            <div style={{ width:'100%', maxWidth:'min(92vw, 960px)', padding:'3.5rem 1.5rem 2rem', textAlign:'center' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(78,180,203,0.1)', border:'1px solid rgba(78,180,203,0.2)', borderRadius:'99px', padding:'0.28rem 0.8rem', marginBottom:'1.2rem' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#4ecbcb', flexShrink:0 }} />
                <span style={{ fontSize:'0.62rem', fontWeight:800, color:'#4ecbcb', textTransform:'uppercase', letterSpacing:'0.2em' }}>The Journey</span>
              </div>
              <h2 className="taronga-title" style={{ fontSize:'clamp(2.6rem,7vw,4.2rem)', color:'white', margin:'0 0 0.8rem', letterSpacing:'-0.02em', lineHeight:1.05 }}>How It Works</h2>
              <p style={{ fontSize:'clamp(0.92rem,1.4vw,1.15rem)', color:'rgba(255,255,255,0.42)', lineHeight:1.65, margin:'0 auto', maxWidth:'460px' }}>From first log-in to final badge — a seamless guided experience.</p>
            </div>

            <div key={p2Key} style={{ width:'100%', maxWidth:'min(92vw, 960px)', padding:'0 1.5rem' }}>
              {STEPS.map((s, i) => {
                const isTeacher = s.role === 'teacher';
                const accent  = isTeacher ? '#4ecbcb' : '#4ecb71';
                const bg      = isTeacher ? 'rgba(78,203,203,' : 'rgba(78,203,113,';
                const nextAccent = i < STEPS.length - 1 ? (STEPS[i+1].role === 'teacher' ? 'rgba(78,203,203,0.25)' : 'rgba(78,203,113,0.25)') : 'transparent';
                return (
                  <div key={s.n} style={{ display:'flex', gap:'1.25rem', animation:'lm-bubble-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay:`${i * 0.55}s` }}>
                    {/* Bubble + connector column */}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'52px', flexShrink:0 }}>
                      <div style={{ width:'52px', height:'52px', borderRadius:'50%', flexShrink:0, background:`${bg}0.1)`, border:`2px solid ${accent}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:800, color:accent, boxShadow:`0 0 20px ${accent}40`, position:'relative', zIndex:1 }}>
                        {s.n}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{ width:'2px', flex:1, minHeight:'22px', background:`linear-gradient(to bottom,${accent}55,${nextAccent})`, transformOrigin:'top', animation:'lm-line-in 0.3s ease both', animationDelay:`${i * 0.55 + 0.38}s` }} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ flex:1, paddingBottom: i < STEPS.length-1 ? '0.85rem' : 0, paddingTop:'0.7rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.28rem', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'clamp(0.9rem,1.3vw,1.1rem)', fontWeight:700, color:'white', lineHeight:1.3 }}>{s.label}</span>
                        <span style={{ fontSize:'0.58rem', fontWeight:800, color:accent, background:`${bg}0.12)`, border:`1px solid ${bg}0.25)`, padding:'0.12rem 0.48rem', borderRadius:'99px', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                          {isTeacher ? 'Teacher' : 'Student'}
                        </span>
                      </div>
                      <div style={{ fontSize:'clamp(0.76rem,1.1vw,0.92rem)', color:'rgba(255,255,255,0.42)', lineHeight:1.65 }}>{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ position:'absolute', bottom:'1.4rem', left:'50%', transform:'translateX(-50%)', opacity:0.25, animation:'lm-bob 2.6s ease-in-out infinite' }}>
              <svg width="16" height="9" viewBox="0 0 18 10" fill="none"><path d="M1 1L9 9L17 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* ══ PAGE 3 · Teacher Portal ══ */}
          <div ref={el => pagesRef.current[2] = el} style={{ minHeight:'100vh', height:'auto', scrollSnapAlign:'start', display:'flex', flexDirection:'column', alignItems:'center', paddingBottom:'4rem', position:'relative' }}>

            <div style={{ width:'100%', maxWidth:'min(92vw, 960px)', padding:'3.5rem 1.5rem 1.6rem', textAlign:'center' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(80,200,160,0.1)', border:'1px solid rgba(80,200,160,0.2)', borderRadius:'99px', padding:'0.28rem 0.8rem', marginBottom:'1.2rem' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#50c8a0', flexShrink:0 }} />
                <span style={{ fontSize:'0.62rem', fontWeight:800, color:'#50c8a0', textTransform:'uppercase', letterSpacing:'0.2em' }}>For Educators</span>
              </div>
              <h2 className="taronga-title" style={{ fontSize:'clamp(2.6rem,7vw,4.2rem)', color:'white', margin:'0 0 1rem', letterSpacing:'-0.02em', lineHeight:1.04 }}>Teacher Portal</h2>
              <p style={{ fontSize:'clamp(0.95rem,1.4vw,1.15rem)', color:'rgba(255,255,255,0.52)', lineHeight:1.7, margin:'0 auto', maxWidth:'520px' }}>
                Live analytics, student observations, and wildlife documentaries — all in one place.
              </p>
            </div>

            <div style={{ padding:'0 1.5rem', width:'100%', maxWidth:'min(92vw, 960px)', marginBottom:'2rem' }}>
              <TeacherPortalDemo />
            </div>

            <div style={{ textAlign:'center' }}>
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
        @keyframes lm-bubble-in {
          0%   { opacity:0; transform:scale(0.3) translateY(6px); }
          65%  { transform:scale(1.08) translateY(0); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes lm-line-in {
          0%   { opacity:0; transform:scaleY(0); }
          100% { opacity:1; transform:scaleY(1); }
        }
        @keyframes portal-slide-in {
          0%   { opacity:0; transform:translateY(10px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes portal-pulse {
          0%, 100% { opacity:0.6; transform:scale(1); }
          50%       { opacity:1;  transform:scale(1.35); }
        }
        .mission-scroll::-webkit-scrollbar { display:none; }
      `}</style>
    </>
  );
}
