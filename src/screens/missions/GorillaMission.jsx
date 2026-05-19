import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import MathsCalculator from '../../components/MathsCalculator';

const INGREDIENTS = [
  { id:'leaves',   emoji:'🍃', label:'Leaves',   icon:'Gorilla Game/icon-leaves.png' },
  { id:'bamboo',   emoji:'🎋', label:'Bamboo',    icon:'Gorilla Game/icon-bamboo.png' },
  { id:'fruit',    emoji:'🍎', label:'Fruit',     icon:'Gorilla Game/icon-fruit.png' },
  { id:'termites', emoji:'🐜', label:'Termites',  icon:'Gorilla Game/icon-termite.png' },
];
const CUSTOMERS = [
  { name:'Mila', title:'Mila the Lady Gorilla', ready:'Waiting for her whopper',
    img:{n:'Gorilla Game/Customer1_neutral.png',h:'Gorilla Game/Customer1_happy.png',m:'Gorilla Game/Customer1_angry.png'} },
  { name:'Koko', title:'Koko the Jungle Queen', ready:'Ready for a giant order',
    img:{n:'Gorilla Game/Customer3-neutral.png',h:'Gorilla Game/Customer3-happy.png',m:'Gorilla Game/Customer3-angry.png'} },
  { name:'Zuri', title:'Zuri the Forest Foodie', ready:'Craving fresh snacks',
    img:{n:'Gorilla Game/Customer1_neutral.png',h:'Gorilla Game/Customer1_happy.png',m:'Gorilla Game/Customer1_angry.png'} },
];
const GAME_DUR = 45;

function genOrder(round) {
  const n = round < 2 ? 2 : round < 4 ? 3 : round < 7 ? 4 : (Math.random() < 0.25 ? 5 : 4);
  const ids = INGREDIENTS.map(x => x.id);
  const order = [];
  for (let i = 0; i < n; i++) {
    let pick = ids[Math.floor(Math.random() * ids.length)];
    let tries = 0;
    while (pick === order[order.length - 1] && tries < 6) { pick = ids[Math.floor(Math.random() * ids.length)]; tries++; }
    order.push(pick);
  }
  const ms = round < 2 ? 3000 : round < 4 ? 2400 : round < 6 ? 1800 : 1400;
  return { order, ms };
}

export default function GorillaMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const { currentAnimal, showResult, setShowResult, isCorrect, isProcessingAnswer,
          setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion } = useStudent();

  const [schlPhase, setSchlPhase] = useState('game');
  const [phase,     setPhase]     = useState('intro');
  const [score,     setScore]     = useState(0);
  const [combo,     setCombo]     = useState(1);
  const [timeLeft,  setTimeLeft]  = useState(GAME_DUR);
  const [order,     setOrder]     = useState([]);
  const [selected,  setSelected]  = useState([]);
  const [customers, setCustomers] = useState(0);
  const [custIdx,   setCustIdx]   = useState(0);
  const [mood,      setMood]      = useState('ready');
  const [orderHidden, setOrderHidden] = useState(false);
  const [toastText,   setToastText]   = useState('');
  const [toastGood,   setToastGood]   = useState(true);
  const [toastKey,    setToastKey]    = useState(0);
  const [comboBurstText, setComboBurstText] = useState('');
  const [comboBurstKey,  setComboBurstKey]  = useState(0);
  const [grabSide,    setGrabSide]    = useState('none');

  const roundRef     = useRef(0);
  const gameRef      = useRef({ combo:1, streak:0, scoreClaimed:false });
  const orderTimeRef = useRef(0);
  const hideTimerRef = useRef(null);
  const grabTimerRef = useRef(null);

  const [assetsLoaded,  setAssetsLoaded]  = useState(false);
  const [loadProgress,  setLoadProgress]  = useState(0);

  useEffect(() => {
    const srcs = [
      'images/gorilla.jpg', 'images/logo.png',
      '/Gorilla Game/background.png',
      'Gorilla Game/server_body_idle.png',
      ...INGREDIENTS.map(i => i.icon),
      ...CUSTOMERS.flatMap(c => [c.img.n, c.img.h, c.img.m]),
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

  const questions = getStageQuestions(currentAnimal, classStage, classSubject);
  const mcqQ      = questions[0];

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.05) { clearInterval(id); setPhase('results'); return 0; }
        return t - 0.05;
      });
    }, 50);
    return () => clearInterval(id);
  }, [phase]);

  const showToast = useCallback((text, good) => {
    setToastText(text); setToastGood(good); setToastKey(k => k + 1);
  }, []);

  const beginOrder = useCallback((newOrder, ms) => {
    setOrder(newOrder); setSelected([]);
    orderTimeRef.current = performance.now();
    setCustIdx(Math.floor(Math.random() * CUSTOMERS.length));
    setMood('ready'); setOrderHidden(false);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setOrderHidden(true), ms);
  }, []);

  const startGame = useCallback(() => {
    roundRef.current = 0;
    gameRef.current = { combo:1, streak:0, scoreClaimed:false };
    setScore(0); setCombo(1); setTimeLeft(GAME_DUR);
    setCustomers(0); setCustIdx(0); setMood('ready');
    setGrabSide('none'); setOrderHidden(false); setSelected([]);
    clearTimeout(hideTimerRef.current); clearTimeout(grabTimerRef.current);
    const { order: o, ms } = genOrder(0);
    setOrder(o);
    orderTimeRef.current = performance.now();
    hideTimerRef.current = setTimeout(() => setOrderHidden(true), ms);
    setPhase('playing');
  }, []);

  const addIngredient = useCallback((id) => {
    if (phase !== 'playing') return;
    if (selected.length >= 7) { showToast('Too tall!', false); return; }
    clearTimeout(grabTimerRef.current);
    const side = grabSide === 'right' ? 'left' : 'right';
    setGrabSide(side);
    grabTimerRef.current = setTimeout(() => setGrabSide('none'), 220);
    setSelected(prev => [...prev, id]);
  }, [phase, selected, grabSide, showToast]);

  const serveOrder = useCallback(() => {
    if (phase !== 'playing' || selected.length === 0) return;
    const correct = selected.length === order.length && selected.every((id, i) => id === order[i]);
    clearTimeout(hideTimerRef.current);
    roundRef.current += 1;
    const nextGen = genOrder(roundRef.current);
    if (correct) {
      const elapsed = (performance.now() - orderTimeRef.current) / 1000;
      const fastBonus = elapsed < 2.2 ? 75 : elapsed < 4 ? 45 : elapsed < 6 ? 20 : 0;
      const base = 60 + order.length * 30;
      const c = gameRef.current.combo;
      const earned = (base + fastBonus) * c;
      const newStreak = gameRef.current.streak + 1;
      gameRef.current.streak = newStreak;
      const newCombo = Math.min(9, 1 + newStreak);
      gameRef.current.combo = newCombo;
      setScore(s => s + earned); setCombo(newCombo); setCustomers(c2 => c2 + 1);
      setMood('happy');
      showToast(`+${Math.round(earned)} ${fastBonus >= 45 ? 'Perfect!' : fastBonus > 0 ? 'Nice!' : 'Good!'}`, true);
      if (newCombo >= 3) { setComboBurstText(`x${newCombo} COMBO!`); setComboBurstKey(k => k + 1); }
      setTimeLeft(t => Math.min(GAME_DUR, t + 2 + order.length * 0.35));
    } else {
      gameRef.current.streak = 0; gameRef.current.combo = 1;
      setCombo(1); setMood('mad');
      showToast('Try again!', false);
      setSelected([]); setTimeLeft(t => Math.max(0, t - 4));
    }
    setTimeout(() => beginOrder(nextGen.order, nextGen.ms), 1150);
  }, [phase, selected, order, beginOrder, showToast]);

  const cust      = CUSTOMERS[custIdx];
  const timerAng  = Math.max(0, (timeLeft / GAME_DUR) * 360);
  const topBunBot = 42 + selected.length * 14;
  const grabIng   = grabSide !== 'none' && selected.length > 0
    ? INGREDIENTS.find(x => x.id === selected[selected.length - 1]) : null;

  if (!assetsLoaded) {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071A0C 0%,#0D3320 50%,#0A2010 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.25rem' }}>
        <img src="images/gorilla.jpg" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.13, pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <div style={{ fontSize:'2.8rem', marginBottom:'0.75rem' }}>🦍</div>
          <h2 style={{ color:'white', fontWeight:700, fontSize:'1.3rem', margin:'0 0 0.35rem', fontFamily:'inherit' }}>Gorilla Feeding Game</h2>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.85rem', margin:'0 0 1.5rem' }}>Loading game assets… {loadProgress}%</p>
          <div style={{ width:'200px', height:'6px', background:'rgba(255,255,255,0.12)', borderRadius:'999px', overflow:'hidden', margin:'0 auto' }}>
            <div style={{ height:'100%', width:`${loadProgress}%`, background:'linear-gradient(to right,#2b9c46,#4CAF50)', borderRadius:'999px', transition:'width 0.25s ease' }} />
          </div>
        </div>
      </div>
    );
  }

  // INTRO
  if (schlPhase === 'game' && phase === 'intro') {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071A0C 0%,#0D3320 50%,#0A2010 100%)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <img src="images/gorilla.jpg" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.13, pointerEvents:'none' }} />
        <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.85rem 1.1rem 0', position:'relative', zIndex:1 }}>
          <button onClick={() => setCurrentScreen('map')} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', color:'rgba(255,255,255,0.75)', padding:'0.4rem 0.95rem', borderRadius:'40px', cursor:'pointer', fontSize:'0.82rem', fontWeight:600 }}>← Back</button>
          <img src="images/logo.png" alt="Taronga" style={{ height:'32px', width:'auto', opacity:0.75 }} onError={e => e.target.style.display='none'} />
        </div>
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.5rem 1.25rem 1.75rem', maxWidth:'440px', margin:'0 auto', width:'100%', position:'relative', zIndex:1 }}>
          <h1 className="taronga-title" style={{ fontSize:'clamp(2.2rem,9vw,3rem)', color:'white', letterSpacing:'0.06em', margin:'0 0 0.2rem', textAlign:'center' }}>Gorilla Whopper Rush</h1>
          <p style={{ fontSize:'0.78rem', color:'rgba(100,220,140,0.8)', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', margin:'0 0 0.5rem', textAlign:'center' }}>Western Lowland Gorilla · Taronga Zoo</p>
          <div style={{ width:'48px', height:'2px', background:'rgba(100,220,140,0.55)', margin:'0.5rem auto 1.4rem' }} />
          <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'14px', padding:'1.1rem 1.2rem', marginBottom:'0.85rem' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,220,140,0.85)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.55rem' }}>Gorilla Diet Facts</p>
            <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.88)', lineHeight:1.65, margin:0 }}>
              Gorillas eat <strong style={{ color:'white' }}>leaves, bamboo &amp; fruit</strong> every day — up to <strong style={{ color:'#F4A460' }}>18 kg!</strong> They also eat <strong style={{ color:'white' }}>termites</strong> for protein. No meat, ever!
            </p>
          </div>
          <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'14px', padding:'1.1rem 1.2rem', marginBottom:'1.1rem' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,220,140,0.85)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.55rem' }}>How to Play</p>
            {[['🍃','Tap ingredients in the order shown'],['🧠','Memorise the recipe before it hides!'],['🍽️','Hit Serve when your stack is ready'],['🔥','Build combos for bonus points']].map(([em,txt]) => (
              <div key={em} style={{ display:'flex', alignItems:'flex-start', gap:'0.55rem', marginBottom:'0.38rem' }}>
                <span style={{ fontSize:'1rem', lineHeight:1.3, flexShrink:0 }}>{em}</span>
                <span style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.8)', lineHeight:1.45 }}>{txt}</span>
              </div>
            ))}
          </div>
          <button onClick={startGame} style={{ width:'100%', padding:'1.05rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#2A8A40,#1E6A30)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.12em' }}>
            Start Serving! 🦍
          </button>
        </div>
      </div>
    );
  }

  // PLAYING
  if (schlPhase === 'game' && phase === 'playing') {
    return (
      <div className="gwr-wrap">
        <div className="gwr-game">
          <div className="gwr-hudRow">
            <div className="gwr-timerRing" style={{ '--timerAngle': `${timerAng}deg` }}>
              <span style={{ color: timerAng < 90 ? '#FF6666' : '#fff4cc' }}>{Math.ceil(timeLeft)}</span>
            </div>
          </div>

          <div className="gwr-orderPanel">
            <div className="gwr-orderTitle">{cust.title}</div>
            <div className="gwr-orderSpeech">GORILLA WHOPPER!</div>
            <div className="gwr-customerMood">
              {mood === 'happy' ? `${cust.name} is happy!` : mood === 'mad' ? `${cust.name} is mad!` : cust.ready}
            </div>
            <div className={`gwr-recipe${orderHidden ? ' hidden' : ''}`}>
              {order.map((id, i) => {
                const ing = INGREDIENTS.find(x => x.id === id);
                return (
                  <span key={i}>
                    {i > 0 && <span className="gwr-plus">+</span>}
                    <span className="gwr-recipeChip">{ing.emoji} {ing.label}</span>
                  </span>
                );
              })}
            </div>
            <div className={`gwr-memoryCover${orderHidden ? ' show' : ''}`}>
              <span>Remember!</span>
              <div className="gwr-memoryDots">{order.map((_, i) => <span key={i} />)}</div>
            </div>
            <div className={`gwr-portrait${mood === 'happy' ? ' happy' : mood === 'mad' ? ' mad' : ''}`}>
              <img className="gwr-portraitImg" src={cust.img[mood === 'happy' ? 'h' : mood === 'mad' ? 'm' : 'n']} alt={cust.name} />
            </div>
          </div>

          <div className="gwr-scene">
            <div className="gwr-vine a" /><div className="gwr-vine b" /><div className="gwr-vine c" />
            <div key={`gt-${toastKey}`} className={`gwr-toast${toastGood ? ' good' : ' bad'}${toastKey > 0 ? ' show' : ''}`}>{toastText}</div>
            <div key={`gc-${comboBurstKey}`} className={`gwr-comboBurst${comboBurstKey > 0 ? ' show' : ''}`}>{comboBurstText}</div>
            <div className="gwr-serverSprite">
              <img src="Gorilla Game/server_body_idle.png" alt="" />
              {grabIng && (
                <div style={{ position:'absolute', top:'148px', width:'42px', height:'42px', zIndex:6, pointerEvents:'none', ...(grabSide === 'left' ? {left:'44px'} : {right:'44px'}) }}>
                  <img src={grabIng.icon} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                </div>
              )}
            </div>
            <div className="gwr-stackArea">
              <div className="gwr-burgerStack">
                <div className="gwr-topBun" style={{ bottom:`${topBunBot}px` }} />
                <div className="gwr-fillingStack">
                  {selected.map((id, i) => <div key={i} className={`gwr-layer ${id}`} />)}
                </div>
                <div className="gwr-bottomBun" />
              </div>
              <div className="gwr-plate" />
            </div>
            <div className="gwr-counter" />
          </div>

          <div className="gwr-serveRow">
            <button className="gwr-serveBtn" onClick={serveOrder}>Serve</button>
            <button className="gwr-miniBtn" onClick={() => setSelected([])}>Clear</button>
          </div>

          <div className="gwr-controls">
            {INGREDIENTS.map(ing => (
              <button key={ing.id} className="gwr-ingredientBtn" onClick={() => addIngredient(ing.id)}>
                <img src={ing.icon} alt={ing.label} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // RESULTS
  if (schlPhase === 'game' && phase === 'results') {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071A0C 0%,#0D3320 50%,#0A2010 100%)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <img src="images/gorilla.jpg" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.13, pointerEvents:'none' }} />
        <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.5rem 1.25rem', maxWidth:'440px', margin:'0 auto', width:'100%', position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'3.5rem', lineHeight:1, marginBottom:'0.4rem', textAlign:'center' }}>🦍</div>
          <h1 className="taronga-title" style={{ fontSize:'clamp(2.2rem,9vw,3rem)', color:'white', margin:'0 0 0.5rem', textAlign:'center' }}>Shift Over!</h1>
          <div style={{ display:'flex', justifyContent:'center', gap:'2.5rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'14px', padding:'1.1rem', marginBottom:'1rem', width:'100%' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'2.4rem', fontWeight:900, color:'rgba(100,220,140,0.95)' }}>{Math.floor(score)}</div>
              <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.55)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}>Score</div>
            </div>
            <div style={{ width:'1px', background:'rgba(255,255,255,0.12)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'2.4rem', fontWeight:900, color:'rgba(100,220,140,0.95)' }}>{customers}</div>
              <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.55)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}>Served</div>
            </div>
          </div>
          <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'14px', padding:'1rem 1.2rem', marginBottom:'0.85rem', textAlign:'left' }}>
            <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.82)', lineHeight:1.65, margin:0 }}>
              <strong style={{ color:'rgba(100,220,140,0.9)' }}>Did you know?</strong> Gorillas spend up to <strong style={{ color:'white' }}>6 hours a day</strong> foraging — mostly leaves, bark, roots and fruit from the rainforest floor.
            </p>
          </div>

          <button onClick={() => { setSchlPhase('mcq'); setShowResult(false); setIsProcessingAnswer(false); }}
            style={{ width:'100%', padding:'1.05rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#2A8A40,#1E6A30)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.55rem' }}>
            Answer the Diet Question →
          </button>
          <button onClick={startGame}
            style={{ width:'100%', padding:'0.8rem', borderRadius:'40px', border:'1px solid rgba(255,255,255,0.14)', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.75)', fontSize:'0.9rem', fontWeight:700, cursor:'pointer' }}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // MCQ
  if (schlPhase === 'mcq') {
    return (
      <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'linear-gradient(160deg,#071A0C 0%,#0D3320 50%,#0A2010 100%)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
        <img src="images/gorilla.jpg" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.08, pointerEvents:'none' }} />
        <div style={{ background:'rgba(0,0,0,0.35)', backdropFilter:'blur(2px)', padding:'0.6rem 1rem', flex:'0 0 auto', zIndex:100 }}>
          <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <button onClick={() => setCurrentScreen('map')} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>← Back</button>
            <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto', opacity:0.8 }} onError={e => e.target.style.display='none'} />
            <div style={{ width:'70px' }} />
          </div>
        </div>
        {showResult && (
          <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)', position:'relative', zIndex:1 }}>
            <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
            <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color: isCorrect ? '#10b981' : '#ef4444', marginBottom:'0.4rem' }}>{isCorrect ? 'Correct!' : 'Try Again'}</h2>
            {isCorrect && mcqQ && (mcqQ.stageFacts?.[classStage] || mcqQ.fact) && (
              <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
                <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {mcqQ.stageFacts?.[classStage] || mcqQ.fact}</p>
              </div>
            )}
            <button onClick={() => { if (isCorrect) { setCurrentScreen('observation'); setSchlPhase('game'); setPhase('intro'); } else { setIsProcessingAnswer(false); setShowResult(false); } }}
              style={{ background: isCorrect ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', marginTop:'0.5rem' }}>
              {isCorrect ? 'Continue to Observation →' : 'Try Again'}
            </button>
          </div>
        )}
        {!showResult && mcqQ && (
          <div style={{ flex:'1 1 auto', overflowY:'auto', padding:'1rem', maxWidth:'600px', margin:'0 auto', width:'100%', position:'relative', zIndex:1 }}>
            <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'var(--t-r-md)', padding:'1.2rem', marginBottom:'1rem', backdropFilter:'blur(8px)' }}>
              <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,220,140,0.85)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.35rem' }}>{classSubject === 'maths' ? 'Gorilla Maths Challenge' : 'Gorilla Diet Challenge'}</p>
              <h2 style={{ fontSize:'1.15rem', fontWeight:700, color:'white', marginBottom:'0.25rem' }}>{classSubject === 'maths' ? mcqQ?.q : 'What do gorillas mainly eat?'}</h2>
              <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.6)', margin:0 }}>{classSubject === 'maths' ? 'Use what you recorded in the game to answer.' : 'Use what you learned in the game to answer.'}</p>
            </div>
            <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'var(--t-r-md)', padding:'1.2rem', backdropFilter:'blur(8px)' }}>
              <p style={{ fontSize:'clamp(0.9rem,2vh,1.05rem)', fontWeight:600, color:'white', marginBottom:'1rem', lineHeight:1.4 }}>{classSubject === 'maths' ? 'Choose the correct answer:' : mcqQ.q}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                {mcqQ.options?.map((opt, i) => (
                  <button key={i} onClick={() => !isProcessingAnswer && handleQuizAnswer(0, i, mcqQ.correct)}
                    style={{ textAlign:'center', padding:'clamp(1rem,2.5vh,1.5rem) clamp(0.5rem,1vh,0.8rem)', borderRadius:'var(--t-r-md)', border:'2px solid rgba(100,220,140,0.35)', background:'rgba(255,255,255,0.07)', cursor:'pointer', fontSize:'clamp(0.85rem,1.8vh,1rem)', fontWeight:600, color:'white', lineHeight:1.2, minHeight:'clamp(70px,12vh,90px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {opt}
                  </button>
                ))}
              </div>
              <div style={{ marginTop:'0.5rem' }}><MathsCalculator /></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
