import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import MathsCalculator from '../../components/MathsCalculator';

const BEHAVIOURS = [
  { key:'feeding', label:'Feeding', index:0, color:'#6EE7A0' },
  { key:'resting', label:'Resting', index:1, color:'#B87FFF' },
  { key:'moving',  label:'Moving',  index:2, color:'#F87FD6' },
  { key:'social',  label:'Social',  index:3, color:'#67D8F7' },
];

const LEMUR_BEATS = [
  { id:'sunbathing', label:'Sun Pose', color:'#FFD93D', glow:'rgba(255,217,61,0.6)',  dark:'#8B7000' },
  { id:'foraging',   label:'Foraging', color:'#6EE7A0', glow:'rgba(110,231,160,0.6)', dark:'#1A6B3C' },
  { id:'leaping',    label:'Leaping',  color:'#F87FD6', glow:'rgba(248,127,214,0.6)', dark:'#801060' },
  { id:'calling',    label:'Calling',  color:'#67D8F7', glow:'rgba(103,216,247,0.6)', dark:'#0A5F7A' },
  { id:'resting',    label:'Resting',  color:'#B87FFF', glow:'rgba(184,127,255,0.6)', dark:'#5A1AAF' },
];

const LEMUR_REAL_PCT = { sunbathing:24, foraging:32, leaping:20, calling:12, resting:12 };

const DUR = '0.52s ease-in-out 1';
function poseAnims(lane) {
  if (lane === 0) return { body:`lemurBaskBody ${DUR}`,   armL:`lemurBaskArmL ${DUR}`,   armR:`lemurBaskArmR ${DUR}`,   legL:`lemurBaskLegL ${DUR}`,   legR:`lemurBaskLegR ${DUR}` };
  if (lane === 1) return { body:`lemurForageBody ${DUR}`, armL:`lemurForageArmL ${DUR}`, armR:`lemurForageArmR ${DUR}`, legL:`lemurForageLegL ${DUR}`, legR:`lemurForageLegR ${DUR}` };
  if (lane === 2) return { body:`lemurLeapBody ${DUR}`,   armL:`lemurLeapArmL ${DUR}`,   armR:`lemurLeapArmR ${DUR}`,   legL:`lemurLeapLegL ${DUR}`,   legR:`lemurLeapLegR ${DUR}` };
  if (lane === 3) return { body:`lemurCallBody ${DUR}`,   armL:`lemurCallArmL ${DUR}`,   armR:`lemurCallArmR ${DUR}`,   legL:`lemurCallLegL ${DUR}`,   legR:`lemurCallLegR ${DUR}` };
  if (lane === 4) return { body:`lemurRestBody ${DUR}`,   armL:`lemurRestArmL ${DUR}`,   armR:`lemurRestArmR ${DUR}`,   legL:`lemurRestLegL ${DUR}`,   legR:`lemurRestLegR ${DUR}` };
  return { body:'lemurSway 0.65s ease-in-out infinite alternate', armL:'lemurArmL 0.65s ease-in-out infinite alternate', armR:'lemurArmR 0.65s ease-in-out infinite alternate', legL:null, legR:null };
}

function LemurDancer({ anim = 'sway', size = 130, tapLane = null, tapKey = 0 }) {
  const posing = tapLane !== null;
  const a = posing ? poseAnims(tapLane) : {
    body: anim==='spin'?'lemurSpin 0.7s cubic-bezier(0.4,0,0.2,1) 1':anim==='jump'?'lemurJump 0.55s ease-out 1':anim==='shrug'?'lemurShrug 0.5s ease-in-out 1':'lemurSway 0.65s ease-in-out infinite alternate',
    armL:'lemurArmL 0.65s ease-in-out infinite alternate',
    armR:'lemurArmR 0.65s ease-in-out infinite alternate',
    legL:null, legR:null,
  };
  return (
    <div style={{ width:size, height:size*1.33, position:'relative', animation:'lemurGlow 2.2s ease-in-out infinite', filter:'drop-shadow(0 4px 20px rgba(155,48,255,0.5))' }}>
      <svg key={tapKey} viewBox="-20 0 160 160" width={size} height={size*1.33} style={{ animation:a.body, transformOrigin:'60px 100px', display:'block' }}>
        <g style={{ animation:'lemurTailWag 0.75s ease-in-out infinite alternate', transformOrigin:'78px 130px' }}>
          <path d="M78 130 C105 118 112 92 106 68 C100 46 86 38 78 46 C70 54 74 70 76 84 C78 96 72 112 68 122" fill="none" stroke="white" strokeWidth="13" strokeLinecap="round"/>
          <path d="M78 130 C105 118 112 92 106 68 C100 46 86 38 78 46 C70 54 74 70 76 84 C78 96 72 112 68 122" fill="none" stroke="#111" strokeWidth="13" strokeLinecap="round" strokeDasharray="10 10"/>
        </g>
        <g key={`al-${tapKey}`} style={{ animation:a.armL, transformOrigin:'34px 96px' }}>
          <path d="M34 96 C20 78 10 62 6 50" fill="none" stroke="#888078" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="6" cy="50" r="6" fill="#888078"/>
          <line x1="6" y1="50" x2="0"  y2="44" stroke="#888078" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="6" y1="50" x2="4"  y2="42" stroke="#888078" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="6" y1="50" x2="10" y2="43" stroke="#888078" strokeWidth="3.5" strokeLinecap="round"/>
        </g>
        <ellipse cx="60" cy="110" rx="24" ry="30" fill="#8A8278"/>
        <ellipse cx="60" cy="108" rx="14" ry="22" fill="#7A7268"/>
        <ellipse cx="60" cy="113" rx="13" ry="18" fill="#DDD6C2"/>
        <g key={`ar-${tapKey}`} style={{ animation:a.armR, transformOrigin:'86px 96px' }}>
          <path d="M86 96 C100 78 110 62 114 50" fill="none" stroke="#888078" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="114" cy="50" r="6" fill="#888078"/>
          <line x1="114" y1="50" x2="120" y2="44" stroke="#888078" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="114" y1="50" x2="116" y2="42" stroke="#888078" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="114" y1="50" x2="110" y2="43" stroke="#888078" strokeWidth="3.5" strokeLinecap="round"/>
        </g>
        <g key={`ll-${tapKey}`} style={{ animation:a.legL||undefined, transformOrigin:'50px 138px' }}>
          <path d="M50 138 C46 148 40 154 36 158" fill="none" stroke="#888078" strokeWidth="9" strokeLinecap="round"/>
          <ellipse cx="34" cy="158" rx="10" ry="5" fill="#6A6258" transform="rotate(-10,34,158)"/>
        </g>
        <g key={`lr-${tapKey}`} style={{ animation:a.legR||undefined, transformOrigin:'70px 138px' }}>
          <path d="M70 138 C74 148 80 154 84 158" fill="none" stroke="#888078" strokeWidth="9" strokeLinecap="round"/>
          <ellipse cx="86" cy="158" rx="10" ry="5" fill="#6A6258" transform="rotate(10,86,158)"/>
        </g>
        <ellipse cx="60" cy="54" rx="26" ry="28" fill="#C8C0B0"/>
        <ellipse cx="37" cy="30" rx="11" ry="13" fill="#B0A898" transform="rotate(-15,37,30)"/>
        <ellipse cx="37" cy="30" rx="7"  ry="9"  fill="#C8B8A8" transform="rotate(-15,37,30)"/>
        <ellipse cx="83" cy="30" rx="11" ry="13" fill="#B0A898" transform="rotate(15,83,30)"/>
        <ellipse cx="83" cy="30" rx="7"  ry="9"  fill="#C8B8A8" transform="rotate(15,83,30)"/>
        <ellipse cx="60" cy="52" rx="20" ry="22" fill="#E8E0D0"/>
        <polygon points="36,44 52,44 44,62" fill="#1A1A1A"/>
        <polygon points="84,44 68,44 76,62" fill="#1A1A1A"/>
        <rect x="52" y="44" width="16" height="7" rx="2" fill="#1A1A1A"/>
        {tapLane===4
          ? (<><line x1="38" y1="50" x2="52" y2="48" stroke="#333" strokeWidth="3" strokeLinecap="round"/><line x1="70" y1="48" x2="84" y2="50" stroke="#333" strokeWidth="3" strokeLinecap="round"/></>)
          : (<><circle cx="44" cy="50" r="9" fill="#E8720C"/><circle cx="76" cy="50" r="9" fill="#E8720C"/><circle cx="44" cy="50" r="7" fill="#F0960A"/><circle cx="76" cy="50" r="7" fill="#F0960A"/><circle cx="44" cy="50" r="4.5" fill="#0A0A0A"/><circle cx="76" cy="50" r="4.5" fill="#0A0A0A"/><circle cx="46" cy="47" r="2" fill="rgba(255,255,255,0.85)"/><circle cx="78" cy="47" r="2" fill="rgba(255,255,255,0.85)"/></>)
        }
        <ellipse cx="60" cy="66" rx="10" ry="8" fill="#C0B8A8"/>
        <ellipse cx="60" cy="62" rx="4" ry="3" fill="#222"/>
        <circle cx="57.5" cy="63" r="1.2" fill="#111"/>
        <circle cx="62.5" cy="63" r="1.2" fill="#111"/>
        {tapLane===3 ? <ellipse cx="60" cy="73" rx="7" ry="5" fill="#8B2020"/> : tapLane===1 ? <ellipse cx="60" cy="72" rx="4" ry="3.5" fill="#8B2020" style={{ animation:'lemurForageChew 0.35s ease-in-out infinite' }}/> : tapLane===4 ? <path d="M55 72 Q60 70 65 72" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round"/> : <path d="M53 70 Q60 76 67 70" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round"/>}
        {tapLane===0 && (<g opacity="0.85">{[0,45,90,135,180,225,270,315].map((deg,i)=>(<line key={i} x1={60+Math.cos(deg*Math.PI/180)*32} y1={30+Math.sin(deg*Math.PI/180)*32} x2={60+Math.cos(deg*Math.PI/180)*42} y2={30+Math.sin(deg*Math.PI/180)*42} stroke="#FFD93D" strokeWidth="3" strokeLinecap="round"/>))}<circle cx="60" cy="30" r="10" fill="#FFD93D" opacity="0.7"/></g>)}
        {tapLane===1 && (<g><ellipse cx="43" cy="69" rx="8" ry="5" fill="#4EC87A" transform="rotate(-20,43,69)"/><ellipse cx="38" cy="65" rx="5" ry="3.5" fill="#3DB860" transform="rotate(-40,38,65)"/></g>)}
        {tapLane===4 && (<g><text x="75" y="32" fontSize="10" fontWeight="bold" fill="#B87FFF" style={{ animation:'lemurZzzFloat 1.2s ease-out 1', opacity:0 }}>z</text><text x="83" y="20" fontSize="13" fontWeight="bold" fill="#C8A0FF" style={{ animation:'lemurZzzFloat 1.2s ease-out 0.2s 1', opacity:0 }}>z</text><text x="92" y="10" fontSize="16" fontWeight="bold" fill="#D4B8FF" style={{ animation:'lemurZzzFloat 1.2s ease-out 0.4s 1', opacity:0 }}>Z</text></g>)}
        {tapLane===3 && (<g opacity="0.7"><path d="M74 58 Q82 54 82 62 Q82 70 74 66" fill="none" stroke="#67D8F7" strokeWidth="2.5" strokeLinecap="round"/><path d="M77 52 Q90 46 90 62 Q90 78 77 72" fill="none" stroke="#67D8F7" strokeWidth="2" strokeLinecap="round" opacity="0.6"/></g>)}
      </svg>
    </div>
  );
}

function buildNoteQueue() {
  const raw = [
    [0,1200],[1,1900],[0,2700],[2,3100],[1,3800],[0,4400],[3,4900],[1,5500],[0,6000],[2,6400],[1,7000],[3,7500],[0,8000],
    [4,8700],[4,9400],[3,10200],[1,10800],[2,11200],[3,11900],[0,12400],[2,13000],[3,13600],[1,14200],[2,14700],[3,15200],[0,15600],[2,16200],[1,16700],
    [3,17200],[2,17700],[3,18200],[1,18700],[0,19200],[2,19800],[4,20600],[4,21400],
    [0,22000],[1,22300],[2,22600],[3,22900],[0,23400],[1,23700],[2,24200],[3,24500],[0,24900],[1,25300],[2,25600],[3,26000],
    [1,27000],[0,27700],[1,28500],[3,29100],[1,29900],[0,30500],[2,31200],[1,31900],[0,32500],[3,33100],
    [4,33800],[4,34500],[2,35200],[0,35700],[3,36100],[1,36500],[2,36900],[0,37300],[3,37700],[1,38100],[4,38500],[2,38900],[0,39300],[1,39700],
    [2,40100],[3,40500],[0,40900],[1,41300],[2,41700],[3,42100],[0,42500],[1,42900],[4,43300],[2,43700],[1,44200],
  ];
  let nid = 0;
  return raw.map(([lane, time]) => ({ id: nid++, lane, spawnTime: time - 1600 })).sort((a, b) => a.spawnTime - b.spawnTime);
}

export default function LemurMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  // ── Observe phase ──────────────────────────────────────────────────────────
  const [schlPhase,    setSchlPhase]    = useState('observe'); // 'observe' | 'game' | 'question'
  const [counts,       setCounts]       = useState({ feeding:0, resting:0, moving:0, social:0 });
  const [cooldown,     setCooldown]     = useState({});
  const [timerOn,      setTimerOn]      = useState(false);
  const [timerDone,    setTimerDone]    = useState(false);
  const [timeLeft,     setTimeLeft]     = useState(30);

  // ── Game phase ─────────────────────────────────────────────────────────────
  const [gamePhase,    setGamePhase]    = useState('intro'); // 'intro'|'playing'|'results'
  const [score,        setScore]        = useState(0);
  const [combo,        setCombo]        = useState(0);
  const [maxCombo,     setMaxCombo]     = useState(0);
  const [gameTimer,    setGameTimer]    = useState(45);
  const [notes,        setNotes]        = useState([]);
  const [feedback,     setFeedback]     = useState([]);
  const [hits,         setHits]         = useState({});
  const [misses,       setMisses]       = useState(0);
  const [tapFlash,     setTapFlash]     = useState(null);
  const [tapCount,     setTapCount]     = useState(0);
  const gameRef    = useRef(null);
  const intervalRef = useRef(null);

  const q = getStageQuestions(currentAnimal, classStage, classSubject)[0];
  const maxCount = Math.max(...BEHAVIOURS.map(b => counts[b.key]));
  const computedCorrect = BEHAVIOURS.findIndex(b => counts[b.key] === maxCount);

  // ── Observe timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerOn || timerDone) return;
    if (timeLeft <= 0) { setTimerDone(true); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerOn, timerDone]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const tapBehaviour = (key) => {
    if (!timerOn || timerDone) return;
    if (cooldown[key]) return;
    setCounts(c => ({ ...c, [key]: c[key] + 1 }));
    setCooldown(cd => ({ ...cd, [key]: true }));
    setTimeout(() => setCooldown(cd => ({ ...cd, [key]: false })), 300);
  };

  const startGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const queue = buildNoteQueue();
    gameRef.current = { noteQueue: queue, activeNotes: [], score: 0, combo: 0, maxCombo: 0, hits: {}, misses: 0, startTime: Date.now(), feedbackId: 0 };
    setScore(0); setCombo(0); setMaxCombo(0); setGameTimer(45); setNotes([]); setFeedback([]); setHits({}); setMisses(0);
    setGamePhase('playing');
    intervalRef.current = setInterval(() => {
      const g = gameRef.current;
      if (!g) return;
      const elapsed = Date.now() - g.startTime;
      while (g.noteQueue.length > 0 && g.noteQueue[0].spawnTime <= elapsed) {
        const n = g.noteQueue.shift();
        g.activeNotes.push({ ...n, spawnedAt: Date.now(), progress: 0 });
      }
      const now = Date.now();
      g.activeNotes = g.activeNotes.map(n => {
        const p = Math.min(1.15, (now - n.spawnedAt) / 1600);
        if (p >= 1.0 && n.state !== 'hit' && n.state !== 'missed') { g.misses++; g.combo = 0; return { ...n, progress: p, state: 'missed' }; }
        return { ...n, progress: p };
      }).filter(n => n.progress < 1.15);
      const tl = Math.max(0, 45 - Math.floor(elapsed / 1000));
      setNotes([...g.activeNotes]); setScore(g.score); setCombo(g.combo); setGameTimer(tl);
      if (elapsed >= 45000 && g.noteQueue.length === 0) {
        clearInterval(intervalRef.current); intervalRef.current = null;
        setHits({ ...g.hits }); setMisses(g.misses); setMaxCombo(g.maxCombo); setGamePhase('results');
      }
    }, 32);
  }, []);

  const tapLane = useCallback((laneIdx) => {
    const g = gameRef.current;
    if (!g) return;
    setTapFlash(laneIdx); setTapCount(c => c + 1);
    setTimeout(() => setTapFlash(prev => prev === laneIdx ? null : prev), 500);
    const candidates = g.activeNotes.filter(n => n.lane === laneIdx && n.state !== 'hit' && n.state !== 'missed' && n.progress >= 0.65 && n.progress <= 1.0);
    if (!candidates.length) return;
    candidates.sort((a, b) => Math.abs(a.progress - 0.85) - Math.abs(b.progress - 0.85));
    const note = candidates[0];
    const accuracy = Math.abs(note.progress - 0.85);
    let pts, label, labelColor;
    if (accuracy < 0.05)      { pts = 100; label = '✨ PERFECT'; labelColor = '#FFD93D'; }
    else if (accuracy < 0.10) { pts = 75;  label = '🎯 GREAT';   labelColor = '#6EE7A0'; }
    else                       { pts = 50;  label = '👍 GOOD';    labelColor = '#F87FD6'; }
    g.combo++; if (g.combo > g.maxCombo) g.maxCombo = g.combo;
    const mult = Math.min(8, 1 + Math.floor(g.combo / 8));
    g.score += pts * mult;
    g.hits[LEMUR_BEATS[laneIdx].id] = (g.hits[LEMUR_BEATS[laneIdx].id] || 0) + 1;
    note.state = 'hit'; note.hitAt = note.progress;
    const fid = g.feedbackId++;
    setFeedback(prev => [...prev.slice(-6), { id: fid, label, labelColor, lane: laneIdx, pts: pts * mult }]);
    setTimeout(() => setFeedback(prev => prev.filter(f => f.id !== fid)), 900);
  }, []);

  // ── PHASE: OBSERVE ────────────────────────────────────────────────────────
  if (schlPhase === 'observe') {
    return (
      <div style={{ position:'fixed', inset:0, background:'var(--mist-light)', display:'flex', flexDirection:'column' }}>
        <div style={{ background:'linear-gradient(135deg,var(--jungle-deep) 0%,var(--jungle-mid) 100%)', padding:'0.6rem 1rem', flex:'0 0 auto', zIndex:100 }}>
          <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <button onClick={() => setCurrentScreen('map')} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>← Back</button>
            <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
            <div style={{ width:'70px' }} />
          </div>
        </div>
        <div style={{ flex:'1 1 0', minHeight:0, overflowY:'auto', padding:'1rem', maxWidth:'560px', margin:'0 auto', width:'100%' }}>
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1rem 1.2rem', boxShadow:'var(--t-shadow-md)', marginBottom:'1rem', textAlign:'center' }}>
            <h2 style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--jungle-deep)', margin:'0 0 0.2rem' }}>Lemur Activity Tracker</h2>
            <p style={{ fontSize:'0.82rem', color:'#666', margin:0 }}>
              {!timerOn ? 'Watch the lemurs carefully. Press Start, then tap each behaviour you see in real time.' : timerDone ? 'Observation complete - review your tally, then play the game!' : 'Tap the behaviours you see in real time.'}
            </p>
          </div>
          {!timerDone && (
            <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'var(--t-shadow-md)', marginBottom:'1rem' }}>
              <div style={{ textAlign:'center', marginBottom:'1rem' }}>
                <div style={{ fontSize:'4rem', fontWeight:800, color: timeLeft <= 10 ? '#ef4444' : 'var(--jungle-deep)', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                  {timerOn ? timeLeft : 30}
                </div>
                <p style={{ fontSize:'0.72rem', color:'#888', marginTop:'0.2rem' }}>seconds remaining</p>
              </div>
              {!timerOn ? (
                <button onClick={() => setTimerOn(true)}
                  style={{ width:'100%', padding:'1rem', borderRadius:'var(--t-r-pill)', border:'none', background:'linear-gradient(135deg,#7A6E8A,#5a5070)', color:'white', fontWeight:700, fontSize:'1.1rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(122,110,138,0.4)' }}>
                  ▶ Start Observation
                </button>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  {BEHAVIOURS.map(b => (
                    <button key={b.key} onClick={() => tapBehaviour(b.key)}
                      style={{ padding:'1.1rem 0.5rem', borderRadius:'14px', border:`2px solid ${cooldown[b.key]?'#7A6E8A':'#E5E5E5'}`, background:cooldown[b.key]?'#EDE8F2':'#F8F8F8', cursor:'pointer', transition:'all 0.15s', transform:cooldown[b.key]?'scale(0.95)':'scale(1)', textAlign:'center' }}>
                      <div style={{ fontSize:'0.88rem', fontWeight:700, color:'var(--jungle-deep)' }}>{b.label}</div>
                      <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#7A6E8A', marginTop:'0.2rem' }}>{counts[b.key]}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {timerDone && (
            <>
              <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'var(--t-shadow-md)', marginBottom:'1rem' }}>
                <p style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--jungle-deep)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.75rem' }}>Your Observation Tally</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
                  {BEHAVIOURS.map(b => (
                    <div key={b.key} style={{ background:counts[b.key]===maxCount&&maxCount>0?'#EDE8F2':'#F8F8F8', border:counts[b.key]===maxCount&&maxCount>0?'2px solid #7A6E8A':'2px solid transparent', borderRadius:'var(--t-r-sm)', padding:'0.65rem 0.8rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                      <span style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--jungle-deep)', flex:1 }}>{b.label}</span>
                      <span style={{ fontSize:'1.1rem', fontWeight:800, color:'#7A6E8A' }}>{counts[b.key]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background:'rgba(155,48,255,0.06)', border:'1px solid rgba(155,48,255,0.2)', borderRadius:'var(--t-r-md)', padding:'0.85rem 1rem', marginBottom:'1rem' }}>
                <p style={{ fontSize:'0.8rem', color:'#5A1AAF', lineHeight:1.5, margin:0 }}>
                  <strong>Great work!</strong> You just completed a real ethogram. Now play the Lemur Dance Party game - after, you'll compare what you recorded to what you experienced in the game.
                </p>
              </div>
              <button onClick={() => { setGamePhase('intro'); setSchlPhase('game'); }}
                style={{ width:'100%', padding:'1.05rem', borderRadius:'40px', border:'none', background:'linear-gradient(135deg,#9B30FF,#F87FD6)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.12em', boxShadow:'0 6px 24px rgba(155,48,255,0.4)' }}>
                Play the Dance Party! 💃
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── PHASE: GAME INTRO ─────────────────────────────────────────────────────
  if (schlPhase === 'game' && gamePhase === 'intro') {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#020D06 0%,#0A2F1F 50%,#020D06 100%)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', alignItems:'center', padding:'1.5rem', maxWidth:'440px', margin:'0 auto', width:'100%' }}>
          <button onClick={() => setSchlPhase('observe')} style={{ alignSelf:'flex-start', background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:'0.85rem', padding:0, marginBottom:'0.5rem' }}>← Back to Observation</button>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'1rem' }}>
            <LemurDancer anim="sway" size={120} />
            <h1 style={{ fontSize:'clamp(2rem,8vw,2.8rem)', color:'white', letterSpacing:'0.08em', margin:'0.4rem 0 0.1rem', textAlign:'center', lineHeight:1, fontFamily:'var(--t-font-display)' }}>Dance Party</h1>
            <p style={{ fontSize:'0.72rem', fontWeight:700, color:'rgba(248,127,214,0.9)', textTransform:'uppercase', letterSpacing:'0.18em', margin:0 }}>Ring-Tailed Lemur · Taronga Zoo</p>
          </div>
          <div style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(155,48,255,0.35)', borderRadius:'20px', padding:'1rem 1.1rem', marginBottom:'1rem' }}>
            <p style={{ fontSize:'0.7rem', fontWeight:800, color:'rgba(155,48,255,0.9)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.55rem' }}>Your tally so far</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
              {BEHAVIOURS.map(b => (
                <div key={b.key} style={{ display:'flex', justifyContent:'space-between', background:'rgba(255,255,255,0.06)', borderRadius:'8px', padding:'0.4rem 0.6rem' }}>
                  <span style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.75)' }}>{b.label}</span>
                  <span style={{ fontSize:'0.8rem', fontWeight:700, color:'#B87FFF' }}>{counts[b.key]}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(103,216,247,0.2)', borderRadius:'16px', padding:'0.9rem 1rem', marginBottom:'1rem' }}>
            <p style={{ fontSize:'0.68rem', fontWeight:800, color:'rgba(103,216,247,0.85)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.65rem' }}>How to play</p>
            {[['🎵','Behaviour beats fall down 5 lanes'],['👆','Tap the lane button when a beat hits the glow zone'],['🔥','Build combos to multiply your score'],['📊','Then compare your field data to the game!']].map(([em,txt]) => (
              <div key={em} style={{ display:'flex', alignItems:'flex-start', gap:'0.55rem', marginBottom:'0.4rem' }}>
                <span style={{ fontSize:'1rem', lineHeight:1.3, flexShrink:0 }}>{em}</span>
                <span style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.75)', lineHeight:1.45 }}>{txt}</span>
              </div>
            ))}
          </div>
          <button onClick={startGame}
            style={{ width:'100%', padding:'1.1rem', borderRadius:'40px', border:'none', background:'linear-gradient(135deg,#9B30FF,#F87FD6)', color:'white', fontSize:'1.1rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.15em', boxShadow:'0 8px 32px rgba(155,48,255,0.5)', marginBottom:'1.5rem' }}>
            💃 Start Dancing!
          </button>
        </div>
      </div>
    );
  }

  // ── PHASE: GAME PLAYING ───────────────────────────────────────────────────
  if (schlPhase === 'game' && gamePhase === 'playing') {
    const lemurAnim = combo >= 16 ? 'spin' : combo >= 8 ? 'jump' : misses > 3 ? 'shrug' : 'sway';
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(180deg,#06000F 0%,#0E0028 35%,#06000F 100%)', display:'flex', flexDirection:'column', userSelect:'none', WebkitUserSelect:'none' }}>
        <div style={{ flexShrink:0, padding:'0.5rem 0.8rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(155,48,255,0.18)', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(10px)' }}>
          <div style={{ textAlign:'center', minWidth:'80px' }}>
            <div style={{ fontSize:'0.55rem', fontWeight:800, color:'rgba(255,217,61,0.7)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Score</div>
            <div style={{ fontSize:'1.35rem', fontWeight:800, color:'white', lineHeight:1, fontFamily:'monospace' }}>{score.toLocaleString()}</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'0.55rem', fontWeight:800, color:'rgba(248,127,214,0.7)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Time</div>
            <div style={{ fontSize:'2rem', fontWeight:800, color:gameTimer<=10?'#FF5555':'white', lineHeight:1, fontFamily:'monospace', transition:'color 0.3s' }}>{gameTimer}s</div>
          </div>
          <div style={{ textAlign:'center', minWidth:'80px' }}>
            <div style={{ fontSize:'0.55rem', fontWeight:800, color:'rgba(110,231,160,0.7)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Combo</div>
            <div style={{ fontSize:'1.35rem', fontWeight:800, color:combo>=8?'#FFD93D':'white', lineHeight:1, fontFamily:'monospace' }}>×{combo}{combo>=8?' !!':''}</div>
          </div>
        </div>
        <div style={{ position:'relative', flex:'1 1 auto', display:'flex', overflow:'hidden', minHeight:0 }}>
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, background:'repeating-linear-gradient(90deg,rgba(155,48,255,0.03) 0px,rgba(155,48,255,0.03) 1px,transparent 1px,transparent 25%),repeating-linear-gradient(0deg,rgba(155,48,255,0.03) 0px,rgba(155,48,255,0.03) 1px,transparent 1px,transparent 60px)' }} />
          <div style={{ position:'absolute', bottom:'92px', left:'50%', transform:'translateX(-50%)', zIndex:3, pointerEvents:'none', opacity:0.92 }}>
            <LemurDancer anim={lemurAnim} size={120} tapLane={tapFlash} tapKey={tapCount} />
          </div>
          {LEMUR_BEATS.map((beat, laneIdx) => {
            const laneNotes = notes.filter(n => n.lane === laneIdx);
            const isFlashing = tapFlash === laneIdx;
            return (
              <div key={beat.id} style={{ flex:1, position:'relative', borderRight:laneIdx<4?'1px solid rgba(255,255,255,0.05)':'none', overflow:'hidden', zIndex:1 }}>
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(to bottom,${beat.color}04 0%,transparent 50%,${beat.color}08 100%)`, pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'88px', background:`linear-gradient(to top,${beat.color}${isFlashing?'55':'18'},transparent)`, transition:'background 0.08s', pointerEvents:'none', borderTop:`1.5px solid ${beat.color}${isFlashing?'CC':'40'}`, boxShadow:isFlashing?`0 0 16px ${beat.color}66`:'none' }} />
                <div style={{ position:'absolute', top:'6px', left:0, right:0, textAlign:'center', fontSize:'0.55rem', fontWeight:700, color:`${beat.color}70`, textTransform:'uppercase', letterSpacing:'0.07em', pointerEvents:'none' }}>{beat.label}</div>
                {laneNotes.map(note => {
                  if (note.state === 'missed') return null;
                  const yPct = note.progress * 100;
                  const isHit = note.state === 'hit';
                  const hitFade = isHit ? Math.max(0, 1 - (note.progress - (note.hitAt || 0)) * 10) : 1;
                  return (<div key={note.id} style={{ position:'absolute', left:'50%', top:`${Math.min(yPct,91)}%`, width:'50px', height:'50px', borderRadius:'50%', background:isHit?`radial-gradient(circle,white 0%,${beat.color} 50%,transparent 100%)`:`radial-gradient(circle,rgba(255,255,255,0.95) 0%,${beat.color} 45%,${beat.color}55 100%)`, border:`2.5px solid ${beat.color}`, boxShadow:isHit?`0 0 28px 12px ${beat.color}88`:`0 0 12px 3px ${beat.color}66,inset 0 1px 0 rgba(255,255,255,0.5)`, display:'flex', alignItems:'center', justifyContent:'center', opacity:isHit?hitFade:1, transform:isHit?`translateX(-50%) scale(${1.3+(1-hitFade)*0.3})`:'translateX(-50%) scale(1)', pointerEvents:'none', zIndex:2, animation:!isHit&&note.progress<0.08?'noteSlide 0.12s ease-out':'none' }}><div style={{ width:'12px', height:'12px', borderRadius:'50%', background:'white', opacity:0.9 }}/></div>);
                })}
                {feedback.filter(f => f.lane === laneIdx).map(f => (
                  <div key={f.id} style={{ position:'absolute', bottom:'96px', left:0, right:0, textAlign:'center', fontSize:'0.72rem', fontWeight:800, color:f.labelColor, pointerEvents:'none', zIndex:10, textShadow:`0 0 10px ${f.labelColor}`, animation:'feedbackFloat 0.85s ease-out forwards' }}>
                    {f.label}<div style={{ fontSize:'0.65rem', color:'white', opacity:0.9, fontFamily:'monospace' }}>+{f.pts}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ flexShrink:0, display:'flex', borderTop:'2px solid rgba(155,48,255,0.35)', background:'rgba(4,0,14,0.85)', backdropFilter:'blur(14px)' }}>
          {LEMUR_BEATS.map((beat, laneIdx) => {
            const isFlashing = tapFlash === laneIdx;
            return (
              <button key={beat.id} onPointerDown={e => { e.preventDefault(); tapLane(laneIdx); }}
                style={{ flex:1, padding:'0.85rem 0.2rem', border:'none', borderRight:laneIdx<4?'1px solid rgba(255,255,255,0.05)':'none', background:isFlashing?`linear-gradient(to top,${beat.color}66,${beat.color}22)`:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.25rem', transition:'background 0.1s', WebkitTapHighlightColor:'transparent', touchAction:'manipulation' }}>
                <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:isFlashing?`radial-gradient(circle,white 0%,${beat.color} 60%)`:`${beat.color}33`, border:`2.5px solid ${beat.color}${isFlashing?'':'88'}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:isFlashing?`0 0 24px ${beat.color},0 0 48px ${beat.color}66`:`0 0 6px ${beat.color}33`, transition:'all 0.1s', transform:isFlashing?'scale(1.18)':'scale(1)' }}>
                  <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:isFlashing?'white':beat.color, opacity:isFlashing?1:0.9 }}/>
                </div>
                <span style={{ fontSize:'0.58rem', fontWeight:700, color:`${beat.color}BB`, textTransform:'uppercase', letterSpacing:'0.07em' }}>{beat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── PHASE: GAME RESULTS ───────────────────────────────────────────────────
  if (schlPhase === 'game' && gamePhase === 'results') {
    const totalH = Object.values(hits).reduce((a, b) => a + b, 0) || 1;
    const accuracy = totalH > 0 ? Math.round(totalH / (totalH + misses) * 100) : 0;
    const rank = score>=8000?['🌟 Legendary Biologist','#FFD93D']:score>=5000?['🏆 Expert Tracker','#6EE7A0']:score>=2500?['🎯 Field Researcher','#F87FD6']:['🌱 Junior Observer','#67D8F7'];
    const topPlayerBeat = LEMUR_BEATS.reduce((best, b) => (hits[b.id]||0) > (hits[best.id]||0) ? b : best, LEMUR_BEATS[0]);
    const topRealBeat   = LEMUR_BEATS.reduce((best, b) => LEMUR_REAL_PCT[b.id] > LEMUR_REAL_PCT[best.id] ? b : best, LEMUR_BEATS[0]);
    const matchedTop    = topPlayerBeat.id === topRealBeat.id;
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#020D06 0%,#0A2F1F 55%,#020D06 100%)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', alignItems:'center', padding:'1.5rem', maxWidth:'440px', margin:'0 auto', width:'100%' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'0.8rem' }}>
            <LemurDancer anim="jump" size={100} />
            <h1 style={{ fontSize:'clamp(1.8rem,7vw,2.5rem)', color:'white', letterSpacing:'0.08em', margin:'0.3rem 0 0.1rem', textAlign:'center' }}>Dance Complete!</h1>
            <div style={{ background:`${rank[1]}22`, border:`1.5px solid ${rank[1]}55`, borderRadius:'40px', padding:'0.3rem 1rem', marginTop:'0.4rem' }}>
              <span style={{ fontSize:'0.82rem', fontWeight:800, color:rank[1] }}>{rank[0]}</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.7rem', marginBottom:'1rem', width:'100%' }}>
            {[['Score',score.toLocaleString(),'#FFD93D'],['Combo',`×${maxCombo}`,'#F87FD6'],['Accuracy',`${accuracy}%`,'#6EE7A0']].map(([lbl,val,col]) => (
              <div key={lbl} style={{ flex:1, background:'rgba(255,255,255,0.07)', border:`1px solid ${col}33`, borderRadius:'14px', padding:'0.65rem 0.4rem', textAlign:'center' }}>
                <div style={{ fontSize:'0.58rem', fontWeight:700, color:`${col}88`, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.2rem' }}>{lbl}</div>
                <div style={{ fontSize:'1.45rem', fontWeight:800, color:'white' }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(155,48,255,0.3)', borderRadius:'18px', padding:'1rem 1.1rem', marginBottom:'1rem' }}>
            <p style={{ fontSize:'0.68rem', fontWeight:800, color:'rgba(155,48,255,0.85)', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 0.6rem' }}>Your Field Tally vs. Game</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.75rem' }}>
              {BEHAVIOURS.map(b => (
                <div key={b.key} style={{ background:'rgba(255,255,255,0.06)', borderRadius:'8px', padding:'0.5rem 0.7rem' }}>
                  <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.55)', marginBottom:'0.15rem' }}>{b.label}</div>
                  <div style={{ fontSize:'1rem', fontWeight:800, color:'#B87FFF' }}>{counts[b.key]} <span style={{ fontSize:'0.65rem', fontWeight:400, color:'rgba(255,255,255,0.4)' }}>taps</span></div>
                </div>
              ))}
            </div>
            <div style={{ padding:'0.55rem 0.7rem', background:'rgba(255,255,255,0.05)', borderRadius:'10px', borderLeft:`3px solid ${matchedTop?'#6EE7A0':'#FFD93D'}` }}>
              <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.82)', lineHeight:1.55, margin:0 }}>
                {matchedTop
                  ? <><strong style={{ color:topRealBeat.color }}>{topRealBeat.label}</strong> was most common in the game - matching real lemur field data! Did your tally agree?</>
                  : <>In the game, <strong style={{ color:topPlayerBeat.color }}>{topPlayerBeat.label}</strong> was your top tap. Compare this to your real-life tally - do they match?</>
                }
              </p>
            </div>
          </div>
          <button onClick={() => setSchlPhase('question')}
            style={{ width:'100%', padding:'1.05rem', borderRadius:'40px', border:'none', background:'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.12em', boxShadow:'0 6px 24px rgba(30,100,50,0.4)', marginBottom:'1.5rem' }}>
            Answer the Question →
          </button>
        </div>
      </div>
    );
  }

  // ── PHASE: QUESTION ───────────────────────────────────────────────────────
  const totalObs = BEHAVIOURS.reduce((s, b) => s + counts[b.key], 0);
  const gamePct  = { feeding: LEMUR_REAL_PCT.foraging, resting: LEMUR_REAL_PCT.sunbathing + LEMUR_REAL_PCT.resting, moving: LEMUR_REAL_PCT.leaping, social: LEMUR_REAL_PCT.calling };
  const obsMax   = Math.max(...BEHAVIOURS.map(b => counts[b.key]), 1);
  const BAR_H    = 80;

  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(135deg,var(--jungle-deep) 0%,var(--jungle-mid) 100%)', padding:'0.6rem 1rem', flex:'0 0 auto', zIndex:100 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={() => { setShowResult(false); setIsProcessingAnswer(false); setSchlPhase('game'); setGamePhase('results'); }}
            style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>← Back</button>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
          <div style={{ width:'70px' }} />
        </div>
      </div>
      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color:isCorrect?'#10b981':'#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>{isCorrect ? 'Correct!' : 'Not Quite'}</h2>
          {isCorrect && <p style={{ fontSize:'clamp(0.9rem,2vh,1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>Your observation data was spot on!</p>}
          {!isCorrect && <p style={{ fontSize:'clamp(0.9rem,2vh,1rem)', color:'#555', marginBottom:'0.8rem' }}>Check your tally above - what did you record most?</p>}
          {(q?.stageFacts?.[classStage] || q?.fact) && (
            <div style={{ background:'linear-gradient(135deg,#F3EEFF 0%,#E8D8FF 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {q.stageFacts?.[classStage] || q.fact}</p>
            </div>
          )}
          <button onClick={() => { if (isCorrect) { handleNextQuestion(1); } else { setIsProcessingAnswer(false); setShowResult(false); } }}
            style={{ background:isCorrect?'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))':'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Observation →' : 'Try Again'}
          </button>
        </div>
      )}
      {!showResult && (
        <div style={{ flex:'1 1 0', minHeight:0, overflowY:'auto', padding:'1rem', maxWidth:'600px', margin:'0 auto', width:'100%' }}>
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1rem 1.2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.08)', marginBottom:'1rem' }}>
            <p style={{ fontSize:'0.72rem', fontWeight:800, color:'#7A6E8A', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 0.75rem' }}>Your Observation vs Real-World Data</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem', alignItems:'end', marginBottom:'0.5rem' }}>
              {BEHAVIOURS.map(b => {
                const obsPct = totalObs > 0 ? Math.round((counts[b.key] / totalObs) * 100) : 0;
                const gPct = gamePct[b.key] || 0;
                const obsH = Math.round((counts[b.key] / obsMax) * BAR_H);
                const gMax = Math.max(...Object.values(gamePct), 1);
                const gH = Math.round((gPct / gMax) * BAR_H);
                const isTop = counts[b.key] === maxCount && maxCount > 0;
                return (
                  <div key={b.key} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ display:'flex', gap:'3px', alignItems:'flex-end', height:`${BAR_H}px`, marginBottom:'4px' }}>
                      <div style={{ width:'26px', height:`${Math.max(obsH,3)}px`, background:isTop?b.color:`${b.color}88`, borderRadius:'4px 4px 0 0', transition:'height 0.4s ease', display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'2px' }}>
                        {obsPct > 0 && <span style={{ fontSize:'0.62rem', fontWeight:800, color:'white', lineHeight:1 }}>{obsPct}%</span>}
                      </div>
                      <div style={{ width:'26px', height:`${Math.max(gH,3)}px`, background:`${b.color}44`, border:`1.5px dashed ${b.color}88`, borderRadius:'4px 4px 0 0', boxSizing:'border-box' }} />
                    </div>
                    <span style={{ fontSize:'0.62rem', color:isTop?b.color:'#888', fontWeight:isTop?800:600, textAlign:'center', lineHeight:1.2 }}>{b.label}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', marginTop:'0.4rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'4px' }}><div style={{ width:'12px', height:'10px', background:'#7A6E8A', borderRadius:'2px' }} /><span style={{ fontSize:'0.65rem', color:'#666', fontWeight:600 }}>Your observation</span></div>
              <div style={{ display:'flex', alignItems:'center', gap:'4px' }}><div style={{ width:'12px', height:'10px', background:'rgba(122,110,138,0.25)', border:'1.5px dashed #7A6E8A88', borderRadius:'2px', boxSizing:'border-box' }} /><span style={{ fontSize:'0.65rem', color:'#666', fontWeight:600 }}>Real-world data</span></div>
            </div>
          </div>
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.08)', marginBottom:'1rem' }}>
            <p style={{ fontSize:'clamp(0.9rem,2vh,1.1rem)', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'1rem', lineHeight:1.4 }}>{q?.q}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {(q?.options || []).map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(0, i, computedCorrect >= 0 ? computedCorrect : 0)}
                  style={{ textAlign:'center', padding:'clamp(1rem,2.5vh,1.5rem) clamp(0.5rem,1vh,0.8rem)', borderRadius:'var(--t-r-md)', border:'3px solid #D4C8E8', background:'white', cursor:'pointer', transition:'all 0.2s ease', fontSize:'clamp(0.85rem,1.8vh,1rem)', fontWeight:600, color:'var(--jungle-deep)', lineHeight:1.2, minHeight:'clamp(70px,12vh,90px)', display:'flex', alignItems:'center', justifyContent:'center', touchAction:'manipulation', WebkitTapHighlightColor:'transparent' }}>
                  {opt}
                </button>
              ))}
            </div>
            <MathsCalculator />
          </div>
        </div>
      )}
    </div>
  );
}
