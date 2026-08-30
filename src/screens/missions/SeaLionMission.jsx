import { useState, useCallback, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import MathsCalculator from '../../components/MathsCalculator';
import StudentGuide from '../../components/StudentGuide';

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

// Slot positions (% of world) per zone - used as default drop positions
const SLOTS = {
  pool:           [{ x:27, y:52, w:22 },{ x:22, y:56, w:28 },{ x:30, y:48, w:34 }],
  land:           [{ x:62, y:44, w:11 },{ x:68, y:48, w:10 },{ x:58, y:52, w:11 }],
  rocks:          [{ x:79, y:36, w:7  },{ x:85, y:42, w:7  },{ x:82, y:50, w:8  }],
  toys:           [{ x:10, y:46, w:5  },{ x:15, y:43, w:5  },{ x:8,  y:52, w:5  }],
  food:           [{ x:30, y:18, w:8  },{ x:38, y:18, w:8  },{ x:44, y:20, w:8  }],
  sustainability: [{ x:70, y:16, w:9  },{ x:79, y:16, w:9  },{ x:86, y:20, w:9  }],
};

// Per-item justification data for English dynamic MCQ
const ITEM_JUSTIFICATIONS = {
  'pool-small':    { name:'Small Pool',      correct:'More swimming space helps sea lions stay active and physically healthy.',                                                         wrong:['Small pools look neater and take up less space in the design.','Small pools are cheaper and easier for keepers to maintain.','Small pools let visitors see the sea lions more clearly.'] },
  'pool-large':    { name:'Large Pool',      correct:'A large, deep pool allows sea lions to dive and swim naturally — essential for their physical health.',                           wrong:['Large pools are popular because visitors enjoy watching sea lions swim.','Large pools use less water overall than having multiple small ones.','Large pools make the enclosure look more impressive from a distance.'] },
  'stone':         { name:'Stone',           correct:'Natural rocks give sea lions places to haul out, rest and thermoregulate — just as they would in the wild.',                     wrong:['Stones look natural and make the enclosure more attractive to visitors.','Stones are one of the cheapest features in the whole design.','Stones help filter the pool water when it rains.'] },
  'stone-wall':    { name:'Stone Wall',      correct:'A defined habitat edge gives sea lions a sense of territory and security in their enclosure.',                                   wrong:['Stone walls are easy to build and rarely need maintenance.','Stone walls keep visitors at a safe distance from the animals.','Stone walls stop pool water from splashing onto the path.'] },
  'pier':          { name:'Pier',            correct:'A pier gives sea lions a raised platform to rest on and helps keepers safely observe and interact with them.',                   wrong:['Piers look impressive and are popular with visitors who want photos.','Piers are cheaper than building extra pools or land areas.','Piers help shade the pool from direct sunlight.'] },
  'beach-ball':    { name:'Beach Ball',      correct:'Play items like beach balls provide enrichment — mental stimulation that prevents boredom and reduces stress in sea lions.',     wrong:['Beach balls are cheap and easy to replace when worn out.','Beach balls keep visitors entertained during sea lion feeding sessions.','Beach balls help sea lions strengthen their flippers.'] },
  'buoy-toy':      { name:'Buoy Toy',        correct:'A buoy toy encourages active swimming and play, supporting both physical and mental wellbeing in sea lions.',                   wrong:['Buoy toys are colourful and look good in visitor photos.','Buoy toys are the most affordable enrichment item available.','Buoy toys help sea lions practise balancing for demonstrations.'] },
  'slide':         { name:'Slide',           correct:'A slide encourages movement and play, mimicking natural behaviour and keeping sea lions physically and mentally healthy.',        wrong:['Slides are popular with visitors who enjoy watching sea lions use them.','Slides are easy to install and can be removed quickly if needed.','Slides help sea lions dry off faster after swimming.'] },
  'fish-box':      { name:'Food Station',    correct:'A dedicated food station supports regular, controlled feeding — essential for sea lion health and keeper–animal bonding.',       wrong:['Food stations look professional and tidy in the enclosure layout.','Food stations keep the sea lions in one spot during feeding.','Food stations help the zoo reduce how much fish it purchases.'] },
  'feed-bucket':   { name:'Feed Bucket',     correct:'Keeper feeding tools allow positive reinforcement training, which supports sea lion health and mental wellbeing.',               wrong:['Feed buckets are the cheapest wellbeing item in the whole design.','Feed buckets keep fish away from the pool water.','Feed buckets help visitors understand how sea lions are fed.'] },
  'canopy':        { name:'Canopy',          correct:'A canopy provides shade that reduces heat stress for the sea lions and lowers the energy needed to cool the enclosure.',        wrong:['Canopies make the enclosure look more modern and well-designed.','Canopies are the most affordable sustainability feature available.','Canopies keep rain out of the pool to reduce overflow.'] },
  'solar-panel':   { name:'Solar Panel',     correct:'Solar panels generate clean energy for the enclosure, reducing the zoo\'s carbon footprint and long-term running costs.',       wrong:['Solar panels look high-tech and show visitors the zoo is modern.','Solar panels keep the pool water warm on cold days.','Solar panels are cheaper to run than all other power sources.'] },
  'solar-canopy':  { name:'Solar Canopy',    correct:'A solar canopy provides shade for the sea lions AND generates clean energy — a dual benefit for wellbeing and sustainability.', wrong:['Solar canopies look impressive and attract environmentally minded visitors.','Solar canopies are cheaper than buying separate panels and a canopy.','Solar canopies keep leaves and debris out of the pool.'] },
  'wind-turbine':  { name:'Wind Turbine',    correct:'A wind turbine generates renewable energy, making the enclosure more sustainable and reducing the zoo\'s environmental impact.',wrong:['Wind turbines look exciting and attract attention from zoo visitors.','Wind turbines help cool the sea lions on hot summer days.','Wind turbines are the cheapest energy source for outdoor enclosures.'] },
  'waterfilter':   { name:'Water Filter',    correct:'A water filter keeps the pool clean and safe, directly protecting the sea lions\' health and reducing water waste.',            wrong:['Water filters make the pool look clearer for visitors watching the sea lions.','Water filters are cheaper than replacing pool water regularly.','Water filters help sea lions swim faster through cleaner water.'] },
  'natural-filter':{ name:'Natural Filter',  correct:'A natural filter cleans water using eco-friendly methods, supporting sea lion health and environmental sustainability together.',  wrong:['Natural filters look more attractive than mechanical filter systems.','Natural filters are cheaper than all other filtering options.','Natural filters help grow aquatic plants inside the enclosure.'] },
  'water-tank':    { name:'Water Tank',      correct:'A water tank stores and reuses water, reducing waste and making the enclosure more sustainable over time.',                     wrong:['Water tanks are relatively cheap and easy to install anywhere.','Water tanks provide drinking water for zoo visitors and staff.','Water tanks make the pool much deeper for the sea lions to dive.'] },
  'recycling-bin': { name:'Recycling Bin',   correct:'A recycling bin reduces waste in the enclosure and demonstrates environmental responsibility to both staff and visitors.',       wrong:['Recycling bins are the cheapest single item in the whole design.','Recycling bins keep the enclosure neat and tidy for visitor photos.','Recycling bins help keepers store extra fish for feeding time.'] },
  'native-garden': { name:'Native Garden',   correct:'Native plants create a more natural habitat, support local biodiversity, and require less water to maintain long-term.',        wrong:['Native gardens look beautiful and make the enclosure more attractive.','Native gardens are one of the cheapest sustainability choices.','Native gardens give the sea lions a shaded area to hide and rest.'] },
};

const STAGE_Q_STEM = {
  1: (n) => `You added a ${n} to your design. Which sentence gives the BEST reason for including it?`,
  2: (n) => `You chose to include a ${n}. Which sentence best justifies this choice to the Taronga directors?`,
  3: (n) => `Your enclosure design includes a ${n}. Which sentence would most persuade the directors this was the right choice?`,
  4: (n) => `You included a ${n} in your design. Which argument best justifies this using evidence about sea lion needs?`,
  5: (n) => `You chose a ${n} for your enclosure. Which sentence provides the most logical, evidence-based justification for this design choice?`,
};

function getZone(item) {
  if (item.id.startsWith('pool')) return 'pool';
  if (item.id === 'stone') return 'rocks';
  if (item.id === 'stone-wall' || item.id === 'pier') return 'land';
  if (item.cat === 'Wellbeing') return (item.id === 'fish-box' || item.id === 'feed-bucket') ? 'food' : 'toys';
  return 'sustainability';
}

function calcScore(counts) {
  return ITEMS.reduce((a, it) => {
    const n = counts[it.id] || 0;
    return { E: a.E + it.E*n, W: a.W + it.W*n, S: a.S + it.S*n };
  }, { E:0, W:0, S:0 });
}

export default function SeaLionMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const isEnglish = classSubject === 'english';

  const [assetsLoaded,  setAssetsLoaded]  = useState(false);
  const [loadProgress,  setLoadProgress]  = useState(0);

  useEffect(() => {
    const srcs = [
      '/Seal Game/background.png',
      'Seal Game/seal.png',
      'images/sea-lion.jpg',
      'images/logo.png',
      ...ITEMS.map(it => it.icon),
    ];
    const total = srcs.length;
    let loaded = 0;
    let allLoaded = false;
    let minDone   = false;
    const tryFinish = () => { if (allLoaded && minDone) setAssetsLoaded(true); };
    setTimeout(() => { minDone = true; tryFinish(); }, 700);
    srcs.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / total) * 100));
        if (loaded === total) { allLoaded = true; tryFinish(); }
      };
      img.src = src;
    });
  }, []);

  const [phase,      setPhase]      = useState('intro');
  const [counts,     setCounts]     = useState(() => Object.fromEntries(ITEMS.map(it => [it.id, 0])));
  // placements: flat array of { key, itemId, zone, x, y, w, rotation }
  const [placements, setPlacements] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [cat,        setCat]        = useState('Environment');
  const [carousel,   setCarousel]   = useState(0);
  const [budget,     setBudget]     = useState(BUDGET);
  const [scoreOpen,  setScoreOpen]  = useState(false);
  const [slsScore,   setSlsScore]   = useState(0);
  const [englishQ,   setEnglishQ]   = useState(null);
  const [hintsOpen,  setHintsOpen]  = useState(false);

  const q = getStageQuestions(currentAnimal, classStage, classSubject)[0];
  const correctAnswerIndex = q?.correct ?? 0;
  const fact = q?.stageFacts?.[classStage] || q?.fact;

  const displayQ = (isEnglish && englishQ) ? englishQ : q;
  const displayCorrectIdx = (isEnglish && englishQ) ? englishQ.correct : correctAnswerIndex;
  const displayFact = (isEnglish && englishQ) ? englishQ.fact : fact;

  // Seal animation
  const sealRef     = useRef(null);
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

  // Drag state (ref to avoid re-renders during drag)
  const worldRef = useRef(null);
  const dragRef  = useRef({ activeKey: null, offsetX: 0, offsetY: 0, hasMoved: false });

  const catItems  = ITEMS.filter(it => it.cat === cat);
  const pageSize  = 5;
  const pageCount = Math.ceil(catItems.length / pageSize);
  const visible   = catItems.slice(carousel * pageSize, carousel * pageSize + pageSize);

  const useItem = useCallback((item) => {
    if (budget < item.cost) return;
    if ((counts[item.id] || 0) >= item.max) return;
    const zone = getZone(item);
    const slotList = SLOTS[zone];
    const placedInZone = placements.filter(p => p.zone === zone);
    if (placedInZone.length >= slotList.length) return;
    const slot = slotList[placedInZone.length];
    const key = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setCounts(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
    setBudget(b => b - item.cost);
    setPlacements(ps => [...ps, { key, itemId: item.id, zone, x: slot.x, y: slot.y, w: slot.w, rotation: 0 }]);
  }, [budget, counts, placements]);

  const removeItem = useCallback((item) => {
    const n = counts[item.id] || 0;
    if (n === 0) return;
    setCounts(c => ({ ...c, [item.id]: c[item.id] - 1 }));
    setBudget(b => b + item.cost);
    setPlacements(ps => {
      const arr = [...ps];
      const idx = [...arr].reverse().findIndex(p => p.itemId === item.id);
      if (idx !== -1) arr.splice(arr.length - 1 - idx, 1);
      return arr;
    });
  }, [counts]);

  const rotatePlacement = useCallback((key, delta) => {
    setPlacements(ps => ps.map(p => p.key === key
      ? { ...p, rotation: (p.rotation + delta + 360) % 360 }
      : p
    ));
  }, []);

  const deletePlacement = useCallback((key) => {
    const pl = placements.find(p => p.key === key);
    if (!pl) return;
    const item = ITEMS.find(it => it.id === pl.itemId);
    if (item) {
      setCounts(c => ({ ...c, [pl.itemId]: Math.max(0, (c[pl.itemId] || 0) - 1) }));
      setBudget(b => b + item.cost);
    }
    setPlacements(ps => ps.filter(p => p.key !== key));
    setSelectedKey(sk => sk === key ? null : sk);
  }, [placements]);

  const handlePlacementPointerDown = useCallback((e, key) => {
    if (!worldRef.current) return;
    const rect = worldRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const pl = placements.find(p => p.key === key);
    if (!pl) return;
    dragRef.current = { activeKey: key, offsetX: pl.x - px, offsetY: pl.y - py, hasMoved: false };
    setSelectedKey(key);
    e.preventDefault();
    e.stopPropagation();
  }, [placements]);

  const handleWorldPointerMove = useCallback((e) => {
    if (!dragRef.current.activeKey || !worldRef.current) return;
    const rect = worldRef.current.getBoundingClientRect();
    const x = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100 + dragRef.current.offsetX));
    const y = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100 + dragRef.current.offsetY));
    dragRef.current.hasMoved = true;
    const ak = dragRef.current.activeKey;
    setPlacements(ps => ps.map(p => p.key === ak ? { ...p, x, y } : p));
  }, []);

  const handleWorldPointerUp = useCallback(() => {
    dragRef.current.activeKey = null;
    // delay reset so the click handler can still read hasMoved
    setTimeout(() => { dragRef.current.hasMoved = false; }, 0);
  }, []);

  const finishBuilding = () => {
    const sc = calcScore(counts);
    setSlsScore(Math.round(sc.E + sc.W + sc.S * 1.5));

    if (isEnglish) {
      // Pick the highest-scoring item they actually placed (by total score contribution)
      const placed = ITEMS.filter(it => (counts[it.id] || 0) > 0);
      const sorted = [...placed].sort((a, b) =>
        ((b.E + b.W + b.S) * (counts[b.id] || 0)) - ((a.E + a.W + a.S) * (counts[a.id] || 0))
      );
      const chosenItem = sorted.find(it => ITEM_JUSTIFICATIONS[it.id]);
      const just = chosenItem ? ITEM_JUSTIFICATIONS[chosenItem.id] : null;

      if (just) {
        const stem = (STAGE_Q_STEM[classStage] || STAGE_Q_STEM[3])(just.name);
        // correct answer always at index 2 (option C)
        const [w1, w2, w3] = just.wrong;
        setEnglishQ({
          q: stem,
          options: [w1, w2, just.correct, w3],
          correct: 2,
          fact: `${just.correct} When writing to directors, linking your design choice directly to a sea lion need is what makes an argument persuasive.`,
        });
      } else {
        setEnglishQ({
          q: 'Which sentence best justifies building a new sea lion enclosure to the Taronga directors?',
          options: [
            'Sea lions are interesting animals that many people enjoy watching.',
            'Building a new enclosure is something zoos do from time to time.',
            'The new enclosure gives sea lions the space, enrichment and sustainable features they need to thrive.',
            'The enclosure will help the zoo attract more visitors each year.',
          ],
          correct: 2,
          fact: 'The strongest argument connects design choices directly to what the sea lions need. Specific evidence is always more persuasive than a general statement.',
        });
      }
    }

    setPhase('done');
  };

  const totalPlaced = placements.length;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!assetsLoaded) {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071A2A 0%,#0b3a5c 50%,#062a40 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem' }}>
        <div style={{ fontSize:'4rem' }}>🦭</div>
        <p style={{ color:'rgba(100,180,220,0.9)', fontWeight:700, fontSize:'1.1rem', letterSpacing:'0.12em', textTransform:'uppercase', margin:0 }}>Loading Sea Lion Sanctuary…</p>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.85rem', margin:'-0.75rem 0 0' }}>{loadProgress}%</p>
        <div style={{ width:'220px', height:'6px', background:'rgba(255,255,255,0.12)', borderRadius:'99px', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${loadProgress}%`, background:'linear-gradient(to right,#2b9c46,#67D8F7)', borderRadius:'99px', transition:'width 0.25s ease' }} />
        </div>
        <StudentGuide screen="mission-sealion" />
      </div>
    );
  }

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
            {/* Stage 3 and below get the same two ideas without the abstract nouns — "enrichment",
                "sustainability features" and "for the long term" are all doing work a Year 5 has
                no reason to decode before a building game. */}
            {classStage <= 3 ? (
              <p style={{ fontSize:'1rem', color:'white', lineHeight:1.6, margin:0 }}>
                Sea lions need <strong style={{ color:'#67D8F7' }}>deep water, shade and things to play with</strong>.
                <br /><br />
                <strong style={{ color:'#67D8F7' }}>Solar panels</strong> and <strong style={{ color:'#67D8F7' }}>water filters</strong> keep their home clean and healthy.
              </p>
            ) : (
              <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.88)', lineHeight:1.65, margin:0 }}>
                Sea lions need <strong style={{ color:'white' }}>deep pools, enrichment &amp; shade</strong> to thrive. Sustainability features like <strong style={{ color:'#67D8F7' }}>solar panels</strong> and <strong style={{ color:'#67D8F7' }}>water filters</strong> keep their habitat healthy for the long term.
              </p>
            )}
          </div>
          <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'14px', padding:'1.1rem 1.2rem', marginBottom:'1.1rem' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,180,220,0.85)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.55rem' }}>How to Play</p>
            {(classStage <= 3
              // Six steps is more than anyone reads before a game. Drag-to-move and tap-to-rotate
              // are discoverable once building starts, so they come out; what cannot be guessed
              // is the budget and the three things being scored.
              ? [['🌊','Drag features from the tray into your sanctuary.'],['💛','Do not spend more than $320.'],['♻️','Try to keep all three scores high.'],['✓','Tap Finish Building when you are done.']]
              : [['🌊','Choose features from the tray at the bottom'],['💛','Stay within your $320 budget'],['♻️','Balance environment, wellbeing & sustainability'],['↔️','Drag placed items to reposition them'],['↻','Tap an item then rotate it 90° as needed'],['✓','Hit Finish Building when your sanctuary is ready']]
            ).map(([em,txt]) => (
              <div key={em} style={{ display:'flex', alignItems:'flex-start', gap: classStage <= 3 ? '0.7rem' : '0.55rem', marginBottom: classStage <= 3 ? '0.6rem' : '0.38rem' }}>
                <span style={{ fontSize: classStage <= 3 ? '1.2rem' : '1rem', lineHeight:1.3, flexShrink:0 }}>{em}</span>
                <span style={{ fontSize: classStage <= 3 ? '1rem' : '0.85rem', color: classStage <= 3 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.8)', lineHeight:1.45 }}>{txt}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setPhase('building')}
            style={{ width:'100%', padding:'1.05rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#2b9c46,#1a6b2e)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.12em' }}>
            Start Building! 🏗️
          </button>
        </div>
        <StudentGuide screen="mission-sealion" />
      </div>
    );
  }

  // ── Building ──────────────────────────────────────────────────────────────
  if (phase === 'building') {
    const sc = calcScore(counts);
    const weighted = Math.round(sc.E + sc.W + sc.S * 1.5);
    const selectedPlacement = selectedKey ? placements.find(p => p.key === selectedKey) : null;
    const selectedItem = selectedPlacement ? ITEMS.find(it => it.id === selectedPlacement.itemId) : null;

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
        <div
          ref={worldRef}
          onPointerMove={handleWorldPointerMove}
          onPointerUp={handleWorldPointerUp}
          onPointerLeave={handleWorldPointerUp}
          onClick={(e) => { if (e.target === worldRef.current) setSelectedKey(null); }}
          style={{ position:'absolute', top:12, left:12, right:12, bottom:158, borderRadius:24, overflow:'hidden', border:'1px solid rgba(255,255,255,0.42)', boxShadow:'0 24px 40px rgba(56,84,45,0.16)', backgroundImage:'url("Seal Game/background.png")', backgroundSize:'cover', backgroundPosition:'center', touchAction:'none' }}
        >
          {/* Title banner */}
          <div style={{ position:'absolute', top:14, left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:16, pointerEvents:'none' }}>
            <div style={{ position:'relative', padding:'10px 24px 8px' }}>
              <div style={{ position:'absolute', inset:0, borderRadius:22, background:'linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,255,255,0.18))', backdropFilter:'blur(8px)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.46), 0 8px 20px rgba(0,0,0,0.08)' }} />
              <h1 style={{ position:'relative', margin:0, fontFamily:'var(--t-font-display)', fontSize:'clamp(1.4rem,3vw,2.4rem)', lineHeight:0.9, color:'#1f4d3a', letterSpacing:'0.01em', textShadow:'0 2px 0 rgba(255,248,218,0.3)' }}>Sea Lion Sanctuary</h1>
              <span style={{ position:'relative', display:'block', marginTop:4, fontSize:'0.65rem', fontWeight:900, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(31,77,58,0.85)' }}>Taronga Tracka Build Challenge</span>
            </div>
          </div>

          {/* Placed items - draggable + rotatable */}
          {placements.map((pl) => {
            const item = ITEMS.find(it => it.id === pl.itemId);
            const isSelected = selectedKey === pl.key;
            return (
              <div
                key={pl.key}
                onPointerDown={(e) => handlePlacementPointerDown(e, pl.key)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!dragRef.current.hasMoved) {
                    setSelectedKey(k => k === pl.key ? null : pl.key);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: `${pl.x}%`,
                  top: `${pl.y}%`,
                  width: `${pl.w}%`,
                  transform: `translate(-50%,-50%) rotate(${pl.rotation}deg)`,
                  cursor: 'grab',
                  zIndex: isSelected ? 8 : 3,
                  touchAction: 'none',
                  userSelect: 'none',
                }}
              >
                <img
                  alt={item?.name}
                  src={item?.icon}
                  draggable={false}
                  style={{
                    width: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.18))',
                    outline: isSelected ? '2px solid rgba(255,211,77,0.95)' : 'none',
                    outlineOffset: '3px',
                    borderRadius: 6,
                    pointerEvents: 'none',
                  }}
                />
              </div>
            );
          })}

          {/* Sea lion - above placed items */}
          <img ref={sealRef} src="Seal Game/seal.png" alt="Sea lion"
            style={{ position:'absolute', width:110, left:'37%', top:'44%', transform:'translate(-50%,-50%)', filter:'drop-shadow(0 10px 12px rgba(0,0,0,0.2))', pointerEvents:'none', zIndex:5 }} />

        </div>

        {/* Selected item action panel - floats above the build tray */}
        {selectedPlacement && selectedItem && (
          <div
            style={{
              position: 'absolute', left: 26, bottom: 270, zIndex: 36,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px',
              borderRadius: 14,
              background: 'linear-gradient(180deg,rgba(255,255,255,0.1) 0%,transparent 18%), linear-gradient(180deg,#0c5b8e,#083d62)',
              border: '1px solid rgba(255,255,255,0.22)',
              boxShadow: '0 10px 24px rgba(0,0,0,0.3)',
              color: 'white',
            }}
          >
            <span style={{ fontSize:'0.8rem', fontWeight:900, maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {selectedItem.name}
            </span>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); rotatePlacement(selectedKey, -90); }}
              title="Rotate left 90°"
              style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'rgba(255,255,255,0.16)', color:'white', fontSize:'1.25rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>
              ↺
            </button>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); rotatePlacement(selectedKey, 90); }}
              title="Rotate right 90°"
              style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'rgba(255,255,255,0.16)', color:'white', fontSize:'1.25rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>
              ↻
            </button>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); deletePlacement(selectedKey); }}
              title="Remove item"
              style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'rgba(200,40,30,0.85)', color:'white', fontSize:'1.3rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>
              ×
            </button>
          </div>
        )}

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
                    const zone   = getZone(item);
                    const zoneFull = placements.filter(p => p.zone === zone).length >= SLOTS[zone].length;
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
                            <button onClick={() => useItem(item)} disabled={!afford || full || zoneFull}
                              style={{ padding:'4px 7px', borderRadius:7, border:'none', background:'linear-gradient(180deg,#ffe178,#edae25)', color:'#173845', fontWeight:900, fontSize:'0.62rem', cursor:'pointer', opacity:(!afford||full||zoneFull)?0.4:1 }}>Use</button>
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
        <StudentGuide screen="mission-sealion" />
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
        <StudentGuide screen="mission-sealion" />
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
          {isCorrect && <p style={{ fontSize:'clamp(0.95rem,2.2vh,1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>{isEnglish ? 'Great argument for the new enclosure!' : 'Great thinking about sea lion conservation!'}</p>}
          {isCorrect && displayFact && (
            <div style={{ background:'linear-gradient(135deg,#EAF3F8 0%,#C8E0EE 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {displayFact}</p>
            </div>
          )}
          <button onClick={() => { if (isCorrect) { handleNextQuestion(1); } else { setIsProcessingAnswer(false); setShowResult(false); } }}
            style={{ background:isCorrect?'linear-gradient(135deg,#10b981,#059669)':'linear-gradient(135deg,#ef4444,#dc2626)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Observation →' : 'Try Again'}
          </button>
        </div>
      )}

      {!showResult && (
        <div style={{ flex:'1 1 0', minHeight:0, overflowY:'auto', padding:'1rem', maxWidth:'600px', margin:'0 auto', width:'100%' }}>
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.08)', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--jungle-deep)', marginBottom:'0.3rem' }}>{isEnglish ? 'Enclosure Design Question' : 'Sea Lion Sustainability'}</h2>
            <p style={{ fontSize:'0.85rem', color:'#555', margin:0 }}>{isEnglish ? 'Think about your enclosure design and answer the question below.' : 'Use what you\'ve observed to answer the question below.'}</p>
          </div>
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.08)', marginBottom:'1rem' }}>
            <p style={{ fontSize:'clamp(0.9rem,2vh,1.1rem)', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'1rem', lineHeight:1.4 }}>{displayQ?.q}</p>
            {!isEnglish && (() => {
              const hints = q?.stageHints?.[classStage];
              if (!hints?.length) return null;
              return (
                <div style={{ marginBottom:'1rem' }}>
                  <button onClick={() => setHintsOpen(o => !o)} style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#F0F9F4', border:'1px solid #D4E8DC', borderRadius: hintsOpen ? '8px 8px 0 0' : '8px', padding:'0.55rem 0.85rem', cursor:'pointer', color:'#059669', fontWeight:700, fontSize:'0.8rem', textAlign:'left' }}>
                    <span>💡 Need a hint?</span>
                    <span style={{ fontSize:'0.65rem' }}>{hintsOpen ? '▲' : '▼'}</span>
                  </button>
                  {hintsOpen && (
                    <div style={{ background:'#F7FAF8', border:'1px solid #D4E8DC', borderTop:'none', borderRadius:'0 0 8px 8px', padding:'0.6rem 0.85rem' }}>
                      {hints.map((h, i) => (
                        <p key={i} style={{ fontSize:'0.8rem', color:'#555', margin: i === 0 ? 0 : '0.25rem 0 0', lineHeight:1.5 }}>
                          <span style={{ color:'#059669', fontWeight:700 }}>{i + 1}. </span>{h}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {(displayQ?.options || []).map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(0, i, displayCorrectIdx)}
                  style={{ textAlign:'center', padding:'clamp(1rem,2.5vh,1.5rem) clamp(0.5rem,1vh,0.8rem)', borderRadius:'var(--t-r-md)', border:'3px solid #AACFE0', background:'white', cursor:'pointer', transition:'all 0.2s ease', fontSize:'clamp(0.85rem,1.8vh,1rem)', fontWeight:600, color:'var(--jungle-deep)', lineHeight:1.2, minHeight:'clamp(70px,12vh,90px)', display:'flex', alignItems:'center', justifyContent:'center', touchAction:'manipulation', WebkitTapHighlightColor:'transparent' }}>
                  {opt}
                </button>
              ))}
            </div>
            {!isEnglish && <MathsCalculator />}
          </div>
        </div>
      )}
      <StudentGuide screen="mission-sealion" />
    </div>
  );
}
