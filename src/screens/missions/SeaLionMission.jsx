import { useState, useCallback, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';

// ── Game data ──────────────────────────────────────────────────────────────
const BUDGET = 320;
const CATEGORIES = ['Environment', 'Wellbeing', 'Sustainability'];

const ITEMS = [
  { id:'pool-small',    name:'Small Pool',     cost:30,  cat:'Environment',   E:8,  W:3,  S:0,  max:3, icon:'Seal Game/small pool.png',     desc:'Expand the swim area.' },
  { id:'pool-large',    name:'Large Pool',     cost:55,  cat:'Environment',   E:14, W:5,  S:1,  max:3, icon:'Seal Game/large pool.png',     desc:'A major habitat boost.' },
  { id:'stone',         name:'Stone',          cost:18,  cat:'Environment',   E:7,  W:2,  S:0,  max:3, icon:'Seal Game/stone.png',          desc:'Natural rock shelter.' },
  { id:'stone-wall',    name:'Stone Wall',     cost:22,  cat:'Environment',   E:9,  W:1,  S:0,  max:3, icon:'Seal Game/stone wall.png',     desc:'Defined habitat edge.' },
  { id:'pier',          name:'Pier',           cost:26,  cat:'Environment',   E:11, W:4,  S:0,  max:3, icon:'Seal Game/pier.png',           desc:'Structured viewing deck.' },
  { id:'beach-ball',   name:'Beach Ball',     cost:12,  cat:'Wellbeing',     E:1,  W:8,  S:0,  max:3, icon:'Seal Game/beach ball.png',     desc:'Play and enrichment.' },
  { id:'buoy-toy',     name:'Buoy Toy',       cost:14,  cat:'Wellbeing',     E:1,  W:9,  S:0,  max:3, icon:'Seal Game/buoy toy.png',       desc:'Active swim toy.' },
  { id:'slide',         name:'Slide',          cost:20,  cat:'Wellbeing',     E:2,  W:11, S:0,  max:3, icon:'Seal Game/slide.png',          desc:'Movement and play.' },
  { id:'fish-box',     name:'Food Station',   cost:24,  cat:'Wellbeing',     E:0,  W:10, S:2,  max:3, icon:'Seal Game/fish box.png',       desc:'Feeding support.' },
  { id:'feed-bucket',  name:'Feed Bucket',    cost:16,  cat:'Wellbeing',     E:0,  W:8,  S:1,  max:3, icon:'Seal Game/feed bucket.png',    desc:'Keeper feeding tools.' },
  { id:'canopy',        name:'Canopy',         cost:28,  cat:'Sustainability', E:2,  W:4,  S:12, max:3, icon:'Seal Game/canopy.png',         desc:'Shade and smart design.' },
  { id:'solar-panel',  name:'Solar Panel',    cost:24,  cat:'Sustainability', E:1,  W:1,  S:11, max:3, icon:'Seal Game/solar panel.png',   desc:'Clean energy boost.' },
  { id:'solar-canopy', name:'Solar Canopy',   cost:32,  cat:'Sustainability', E:2,  W:3,  S:14, max:3, icon:'Seal Game/solar canopy.png',  desc:'Power plus shade.' },
  { id:'wind-turbine', name:'Wind Turbine',   cost:34,  cat:'Sustainability', E:1,  W:0,  S:15, max:3, icon:'Seal Game/wind turbine.png',  desc:'Renewable power.' },
  { id:'waterfilter',  name:'Water Filter',   cost:22,  cat:'Sustainability', E:1,  W:2,  S:10, max:3, icon:'Seal Game/waterfilter.png',    desc:'Cleaner pool systems.' },
  { id:'natural-filter',name:'Natural Filter',cost:30,  cat:'Sustainability', E:4,  W:2,  S:13, max:3, icon:'Seal Game/natural filter.png', desc:'Eco water treatment.' },
  { id:'water-tank',   name:'Water Tank',     cost:20,  cat:'Sustainability', E:1,  W:1,  S:9,  max:3, icon:'Seal Game/water tank.png',     desc:'Store and reuse water.' },
  { id:'recycling-bin',name:'Recycling Bin',  cost:10,  cat:'Sustainability', E:1,  W:0,  S:6,  max:3, icon:'Seal Game/recycling bin.png',  desc:'Waste reduction.' },
  { id:'native-garden',name:'Native Garden',  cost:18,  cat:'Sustainability', E:5,  W:2,  S:8,  max:3, icon:'Seal Game/native garden.png',  desc:'Habitat-friendly planting.' },
];

// Slot positions (% of world width/height) per zone — used to place items in the scene
const SLOTS = {
  pool:           [{ x:27, y:52, w:22 },{ x:22, y:56, w:28 },{ x:30, y:48, w:34 }],
  land:           [{ x:62, y:44, w:11 },{ x:68, y:48, w:10 },{ x:58, y:52, w:11 }],
  rocks:          [{ x:79, y:36, w:7  },{ x:85, y:42, w:7  },{ x:82, y:50, w:8  }],
  toys:           [{ x:10, y:46, w:5  },{ x:15, y:43, w:5  },{ x:8,  y:52, w:5  }],
  food:           [{ x:30, y:18, w:8  },{ x:38, y:18, w:8  },{ x:44, y:20, w:8  }],
  sustainability: [{ x:70, y:16, w:9  },{ x:79, y:16, w:9  },{ x:86, y:20, w:9  }],
};

const ZONE_OF = { Environment:'pool', Wellbeing:'toys', Sustainability:'sustainability' };

function calcScore(counts) {
  return ITEMS.reduce((a, it) => {
    const n = counts[it.id] || 0;
    return { E: a.E + it.E*n, W: a.W + it.W*n, S: a.S + it.S*n };
  }, { E:0, W:0, S:0 });
}

export default function SeaLionMission() {
  const { setCurrentScreen, classStage } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const [phase,    setPhase]    = useState('intro');
  const [counts,   setCounts]   = useState(() => Object.fromEntries(ITEMS.map(it => [it.id, 0])));
  const [placements, setPlacements] = useState({ pool:[], land:[], rocks:[], toys:[], food:[], sustainability:[] });
  const [cat,      setCat]      = useState('Environment');
  const [carousel, setCarousel] = useState(0);
  const [budget,   setBudget]   = useState(BUDGET);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [slsScore, setSlsScore] = useState(0);

  const q = getStageQuestions(currentAnimal, classStage)[0];
  const correctAnswerIndex = q?.correct ?? 0;
  const fact = q?.stageFacts?.[classStage] || q?.fact;

  // Seal animation (direct DOM to avoid re-renders)
  const sealRef    = useRef(null);
  const swimTickRef = useRef(0);
  useEffect(() => {
    if (phase !== 'building') return;
    const id = setInterval(() => {
      swimTickRef.current += 0.035;
      const t = swimTickRef.current;
      const x = 37 + Math.cos(t) * 7.5;
      const y = 44 + Math.sin(t * 1.28) * 5.4;
      const r = Math.sin(t) * 14;
      if (sealRef.current) {
        sealRef.current.style.left = `${x}%`;
        sealRef.current.style.top  = `${y}%`;
        sealRef.current.style.transform = `translate(-50%,-50%) rotate(${r}deg)`;
      }
    }, 90);
    return () => clearInterval(id);
  }, [phase]);

  const catItems = ITEMS.filter(it => it.cat === cat);
  const pageSize = 5;
  const pageCount = Math.ceil(catItems.length / pageSize);
  const visible  = catItems.slice(carousel * pageSize, carousel * pageSize + pageSize);

  const useItem = useCallback((item) => {
    if (budget < item.cost) return;
    if ((counts[item.id] || 0) >= item.max) return;
    // determine zone from item category or item id
    const zone = item.id.startsWith('pool') ? 'pool'
               : item.id === 'stone' || item.id === 'stone-wall' || item.id === 'pier' ? (item.id === 'stone' ? 'rocks' : 'land')
               : item.cat === 'Wellbeing' ? (item.id === 'fish-box' || item.id === 'feed-bucket' ? 'food' : 'toys')
               : 'sustainability';
    const slotList = SLOTS[zone];
    const placedInZone = placements[zone] || [];
    const slotIdx = placedInZone.length;
    if (slotIdx >= slotList.length) return; // zone full
    const slot = slotList[slotIdx];
    setCounts(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
    setBudget(b => b - item.cost);
    setPlacements(p => ({ ...p, [zone]: [...(p[zone] || []), { itemId: item.id, slot }] }));
  }, [budget, counts, placements]);

  const removeItem = useCallback((item) => {
    const n = counts[item.id] || 0;
    if (n === 0) return;
    const zone = item.id.startsWith('pool') ? 'pool'
               : item.id === 'stone' || item.id === 'stone-wall' || item.id === 'pier' ? (item.id === 'stone' ? 'rocks' : 'land')
               : item.cat === 'Wellbeing' ? (item.id === 'fish-box' || item.id === 'feed-bucket' ? 'food' : 'toys')
               : 'sustainability';
    setCounts(c => ({ ...c, [item.id]: (c[item.id] || 0) - 1 }));
    setBudget(b => b + item.cost);
    setPlacements(p => {
      const arr = [...(p[zone] || [])];
      // remove last placed of this item
      const idx = [...arr].reverse().findIndex(pl => pl.itemId === item.id);
      if (idx !== -1) arr.splice(arr.length - 1 - idx, 1);
      return { ...p, [zone]: arr };
    });
  }, [counts]);

  const finishBuilding = () => {
    const sc = calcScore(counts);
    setSlsScore(Math.round(sc.E + sc.W + sc.S * 1.5));
    setPhase('done');
  };

  const allPlacements = Object.values(placements).flat();
  const totalPlaced = allPlacements.length;

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071A2A 0%,#0b3a5c 50%,#0A2818 100%)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <img src="images/sea-lion.jpg" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', opacity:0.13, pointerEvents:'none', userSelect:'none' }} />
        <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.85rem 1.1rem 0', position:'relative', zIndex:1 }}>
          <button onClick={() => setCurrentScreen('map')} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', color:'rgba(255,255,255,0.75)', padding:'0.4rem 0.95rem', borderRadius:'40px', cursor:'pointer', fontSize:'0.82rem', fontWeight:600 }}>← Back</button>
          <img src="images/logo.png" alt="Taronga" style={{ height:'32px', width:'auto', opacity:0.75 }} onError={e => e.target.style.display='none'} />
        </div>
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.5rem 1.25rem 1.75rem', maxWidth:'440px', margin:'0 auto', width:'100%', position:'relative', zIndex:1 }}>
          <h1 className="taronga-title" style={{ fontSize:'clamp(2.2rem,9vw,3rem)', color:'white', letterSpacing:'0.06em', margin:'0 0 0.2rem', textAlign:'center' }}>Sea Lion Sanctuary</h1>
          <p style={{ fontSize:'0.78rem', color:'rgba(100,180,220,0.85)', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', margin:'0 0 0.5rem', textAlign:'center' }}>Australian Sea Lion · Taronga Zoo</p>
          <div style={{ width:'48px', height:'2px', background:'rgba(100,180,220,0.55)', margin:'0.5rem auto 1.4rem' }} />
          <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'14px', padding:'1.1rem 1.2rem', marginBottom:'0.85rem' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,180,220,0.85)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.55rem' }}>Sea Lion Facts</p>
            <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.88)', lineHeight:1.65, margin:0 }}>
              Sea lions need <strong style={{ color:'white' }}>deep pools, enrichment &amp; shade</strong> to thrive. Sustainability features like <strong style={{ color:'#67D8F7' }}>solar panels</strong> and <strong style={{ color:'#67D8F7' }}>water filters</strong> keep their habitat healthy for the long term.
            </p>
          </div>
          <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'14px', padding:'1.1rem 1.2rem', marginBottom:'1.1rem' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,180,220,0.85)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.55rem' }}>How to Play</p>
            {[['🌊','Choose features from the tray at the bottom'],['💛','Stay within your $320 budget'],['♻️','Balance environment, wellbeing & sustainability'],['✓','Hit Finish Building when your sanctuary is ready']].map(([em,txt]) => (
              <div key={em} style={{ display:'flex', alignItems:'flex-start', gap:'0.55rem', marginBottom:'0.38rem' }}>
                <span style={{ fontSize:'1rem', lineHeight:1.3, flexShrink:0 }}>{em}</span>
                <span style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.8)', lineHeight:1.45 }}>{txt}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setPhase('building')}
            style={{ width:'100%', padding:'1.05rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#2b9c46,#1a6b2e)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.12em' }}>
            Start Building! 🏗️
          </button>
        </div>
      </div>
    );
  }

  // ── Building ──────────────────────────────────────────────────────────────
  if (phase === 'building') {
    const sc = calcScore(counts);
    const weighted = Math.round(sc.E + sc.W + sc.S * 1.5);
    return (
      <div style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', background:'linear-gradient(180deg,#82d1f2 0%,#c8effb 18%,#e7efc1 18%,#dac47d 100%)', overflow:'hidden' }}>

        {/* HUD */}
        <div style={{ position:'absolute', top:12, left:12, right:12, zIndex:30, display:'flex', gap:10, alignItems:'flex-start' }}>
          <div style={{ padding:'8px 14px', borderRadius:14, border:'2px solid rgba(184,217,234,0.92)', background:'linear-gradient(180deg,var(--ocean),var(--ocean-dark,#083f62))', color:'#fff6cf', fontWeight:900, fontSize:'0.88rem', whiteSpace:'nowrap', boxShadow:'0 10px 24px rgba(0,0,0,0.18)' }}>
            Budget: <strong style={{ color:'white' }}>${budget}</strong>
          </div>
          <div style={{ padding:'8px 14px', borderRadius:14, border:'2px solid rgba(184,217,234,0.92)', background:'linear-gradient(180deg,#0b5b8d,#083f62)', color:'#fff6cf', fontWeight:900, fontSize:'0.88rem', boxShadow:'0 10px 24px rgba(0,0,0,0.18)', minWidth:180 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
              <span>Total Score: <strong style={{ color:'white' }}>{weighted}</strong></span>
              <button onClick={() => setScoreOpen(o => !o)} style={{ width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,0.12)', border:'none', color:'#fff6cf', fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>
                {scoreOpen ? '▲' : '▾'}
              </button>
            </div>
            {scoreOpen && (
              <div style={{ marginTop:8, paddingTop:6, borderTop:'1px solid rgba(255,255,255,0.16)', display:'grid', gap:4 }}>
                {[['Environment', sc.E, '#4ade80'],['Wellbeing', sc.W, '#60a5fa'],['Sustainability', sc.S, '#facc15']].map(([l,v,c]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'4px 8px', borderRadius:8, background:'rgba(255,255,255,0.09)', fontSize:'0.72rem' }}>
                    <span>{l}</span><strong style={{ color:c }}>{v}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            <button onClick={finishBuilding}
              style={{ padding:'8px 18px', borderRadius:12, border:'none', background:'linear-gradient(180deg,#ffe178,#edae25)', color:'#173845', fontWeight:900, fontSize:'0.88rem', cursor:'pointer', boxShadow:'0 6px 16px rgba(0,0,0,0.22)', whiteSpace:'nowrap' }}>
              Finish Building ✓
            </button>
            <button onClick={() => setCurrentScreen('map')}
              style={{ padding:'8px 14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.15)', color:'white', fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }}>
              ← Back
            </button>
          </div>
        </div>

        {/* World scene */}
        <div style={{ position:'absolute', top:12, left:12, right:12, bottom:158, borderRadius:24, overflow:'hidden', border:'1px solid rgba(255,255,255,0.42)', boxShadow:'0 24px 40px rgba(56,84,45,0.16)', backgroundImage:'url("Seal Game/background.png")', backgroundSize:'cover', backgroundPosition:'center' }}>
          {/* Title banner */}
          <div style={{ position:'absolute', top:14, left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:16, pointerEvents:'none' }}>
            <div style={{ position:'relative', padding:'10px 24px 8px' }}>
              <div style={{ position:'absolute', inset:0, borderRadius:22, background:'linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,255,255,0.18))', backdropFilter:'blur(8px)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.46), 0 8px 20px rgba(0,0,0,0.08)' }} />
              <h1 style={{ position:'relative', margin:0, fontFamily:'var(--t-font-display)', fontSize:'clamp(1.4rem,3vw,2.4rem)', lineHeight:0.9, color:'#1f4d3a', letterSpacing:'0.01em', textShadow:'0 2px 0 rgba(255,248,218,0.3)' }}>Sea Lion Sanctuary</h1>
              <span style={{ position:'relative', display:'block', marginTop:4, fontSize:'0.65rem', fontWeight:900, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(31,77,58,0.85)' }}>Taronga Tracka Build Challenge</span>
            </div>
          </div>

          {/* Placed items */}
          {allPlacements.map((pl, i) => {
            const item = ITEMS.find(it => it.id === pl.itemId);
            return (
              <img key={`${pl.itemId}-${i}`}
                alt={item?.name}
                src={item?.icon}
                style={{ position:'absolute', left:`${pl.slot.x}%`, top:`${pl.slot.y}%`, width:`${pl.slot.w}%`, transform:'translate(-50%,-50%)', objectFit:'contain', filter:'drop-shadow(0 6px 10px rgba(0,0,0,0.18))', zIndex:3, pointerEvents:'none' }} />
            );
          })}

          {/* Sea lion — above placed items */}
          <img ref={sealRef} src="Seal Game/seal.png" alt="Sea lion"
            style={{ position:'absolute', width:110, left:'37%', top:'44%', transform:'translate(-50%,-50%)', filter:'drop-shadow(0 10px 12px rgba(0,0,0,0.2))', pointerEvents:'none', zIndex:5 }} />
        </div>

        {/* Build tray */}
        <div style={{ position:'absolute', left:'50%', bottom:12, width:'calc(100% - 24px)', transform:'translateX(-50%)', zIndex:35 }}>
          <div style={{ borderRadius:18, background:'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,transparent 18%), linear-gradient(180deg,#1f4d3a,#153527)', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 14px 30px rgba(0,0,0,0.2)', padding:10 }}>
            {/* Category tabs */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:8 }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => { setCat(c); setCarousel(0); }}
                  style={{ padding:'8px 10px', borderRadius:12, border:`1px solid ${cat===c ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.14)'}`, background:cat===c ? 'linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))' : 'rgba(255,255,255,0.06)', color:cat===c ? 'white' : 'rgba(238,248,242,0.72)', fontSize:'0.74rem', fontWeight:900, cursor:'pointer', textAlign:'center', letterSpacing:'0.04em' }}>
                  {c}
                </button>
              ))}
            </div>
            {/* Carousel */}
            <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 40px', gap:8, alignItems:'center' }}>
              <button onClick={() => setCarousel(c => Math.max(0, c-1))} disabled={carousel === 0}
                style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(180deg,#0d5f94,#083d62)', color:'white', border:'none', fontSize:'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity:carousel===0?0.4:1 }}>‹</button>
              <div style={{ overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(visible.length,5)},1fr)`, gap:8 }}>
                  {visible.map(item => {
                    const count  = counts[item.id] || 0;
                    const afford = budget >= item.cost;
                    const full   = count >= item.max;
                    const active = count > 0;
                    return (
                      <div key={item.id} style={{ padding:'6px 6px 7px', borderRadius:13, border:`2px solid ${active ? '#4dd96f' : 'rgba(184,217,234,0.92)'}`, background:'linear-gradient(180deg,rgba(255,255,255,0.34),transparent 22%), linear-gradient(180deg,#fff6d8,#f4de9a)', color:'#19353d', boxShadow:active ? 'inset 0 4px 0 rgba(255,255,255,0.42), 0 0 0 3px rgba(77,217,111,0.22)' : 'inset 0 4px 0 rgba(255,255,255,0.42)', opacity:(!afford && !active) ? 0.55 : 1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:'0.67rem', fontWeight:900 }}>
                          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'70%' }}>{item.name}</span>
                          <span style={{ color:'#8f5f17', flexShrink:0 }}>${item.cost}</span>
                        </div>
                        <img src={item.icon} alt={item.name} style={{ width:'100%', height:40, objectFit:'contain', display:'block', marginBottom:4, borderRadius:8, background:'linear-gradient(180deg,rgba(255,255,255,0.24),transparent 18%), linear-gradient(180deg,#d8efac,#edd69c)', border:'1px solid rgba(22,52,60,0.08)', padding:3 }} />
                        <div style={{ fontSize:'0.5rem', color:'#5b4b24', marginBottom:3, minHeight:12, lineHeight:1.2 }}>{item.desc}</div>
                        <div style={{ fontSize:'0.48rem', color:'#4f655f', fontWeight:800, marginBottom:4 }}>
                          E {item.E} · W {item.W} · S {item.S}
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:4 }}>
                          <span style={{ padding:'2px 7px', borderRadius:999, background:'#0f4d77', color:'white', fontSize:'0.63rem', fontWeight:900 }}>{count}/{item.max}</span>
                          <div style={{ display:'flex', gap:4 }}>
                            <button onClick={() => useItem(item)} disabled={!afford || full}
                              style={{ padding:'4px 7px', borderRadius:7, border:'none', background:'linear-gradient(180deg,#ffe178,#edae25)', color:'#173845', fontWeight:900, fontSize:'0.62rem', cursor:'pointer', opacity:(!afford||full)?0.4:1 }}>Use</button>
                            <button onClick={() => removeItem(item)} disabled={count === 0}
                              style={{ padding:'4px 6px', borderRadius:7, border:'none', background:'linear-gradient(180deg,#ffd8a3,#f2ae58)', color:'#173845', fontWeight:900, fontSize:'0.62rem', cursor:'pointer', opacity:count===0?0.4:1 }}>−</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => setCarousel(c => Math.min(pageCount-1, c+1))} disabled={carousel >= pageCount-1}
                style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(180deg,#0d5f94,#083d62)', color:'white', border:'none', fontSize:'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity:carousel>=pageCount-1?0.4:1 }}>›</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const sc = calcScore(counts);
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#10b981 0%,#059669 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white', textAlign:'center', gap:'1.25rem' }}>
        <div style={{ fontSize:'3.5rem' }}>🦭✨</div>
        <h2 style={{ fontSize:'2rem', margin:0, color:'#fbf1cf', fontFamily:'var(--t-font-display)' }}>Sanctuary Built!</h2>
        <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:20, padding:'1rem 1.5rem', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.25)' }}>
          <div style={{ fontSize:'0.75rem', fontWeight:700, opacity:0.78, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Weighted Score</div>
          <div style={{ fontSize:'2.8rem', fontWeight:900, lineHeight:1 }}>{slsScore}</div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:8, fontSize:'0.78rem', opacity:0.85 }}>
            <span>🌊 E: {sc.E}</span><span>💛 W: {sc.W}</span><span>♻️ S: {sc.S}</span>
          </div>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', justifyContent:'center', maxWidth:360 }}>
          {ITEMS.filter(it => (counts[it.id]||0) > 0).map(it => (
            <span key={it.id} style={{ background:'rgba(255,255,255,0.2)', borderRadius:20, padding:'0.3rem 0.7rem', fontSize:'0.78rem', fontWeight:600 }}>
              {it.name} ×{counts[it.id]}
            </span>
          ))}
        </div>
        <button onClick={() => { setPhase('quiz'); setShowResult(false); setIsProcessingAnswer(false); }}
          style={{ padding:'1rem 2.5rem', borderRadius:30, border:'3px solid rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.15)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.05em', backdropFilter:'blur(6px)' }}>
          Answer the Question →
        </button>
      </div>
    );
  }

  // ── Quiz ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(135deg,var(--jungle-deep) 0%,var(--jungle-mid) 100%)', padding:'0.6rem 1rem', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', flex:'0 0 auto', zIndex:100 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={() => setCurrentScreen('map')} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>← Back</button>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
          <div style={{ width:'70px' }} />
        </div>
      </div>

      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color:isCorrect?'#10b981':'#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>{isCorrect ? 'Correct!' : 'Try Again'}</h2>
          {isCorrect && <p style={{ fontSize:'clamp(0.95rem,2.2vh,1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>Great thinking about sea lion conservation!</p>}
          {isCorrect && fact && (
            <div style={{ background:'linear-gradient(135deg,#EAF3F8 0%,#C8E0EE 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {fact}</p>
            </div>
          )}
          <button onClick={() => { if (isCorrect) { handleNextQuestion(1); } else { setIsProcessingAnswer(false); setShowResult(false); } }}
            style={{ background:isCorrect?'linear-gradient(135deg,#10b981,#059669)':'linear-gradient(135deg,#ef4444,#dc2626)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Observation →' : 'Try Again'}
          </button>
        </div>
      )}

      {!showResult && (
        <div style={{ flex:'1 1 auto', overflowY:'auto', padding:'1rem', maxWidth:'600px', margin:'0 auto', width:'100%' }}>
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.08)', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--jungle-deep)', marginBottom:'0.3rem' }}>Sea Lion Sustainability</h2>
            <p style={{ fontSize:'0.85rem', color:'#555', margin:0 }}>Use what you've observed to answer the question below.</p>
          </div>
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.08)', marginBottom:'1rem' }}>
            <p style={{ fontSize:'clamp(0.9rem,2vh,1.1rem)', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'1rem', lineHeight:1.4 }}>{q?.q}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {(q?.options || []).map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(0, i, correctAnswerIndex)}
                  style={{ textAlign:'center', padding:'clamp(1rem,2.5vh,1.5rem) clamp(0.5rem,1vh,0.8rem)', borderRadius:'var(--t-r-md)', border:'3px solid #AACFE0', background:'white', cursor:'pointer', transition:'all 0.2s ease', fontSize:'clamp(0.85rem,1.8vh,1rem)', fontWeight:600, color:'var(--jungle-deep)', lineHeight:1.2, minHeight:'clamp(70px,12vh,90px)', display:'flex', alignItems:'center', justifyContent:'center', touchAction:'manipulation', WebkitTapHighlightColor:'transparent' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
