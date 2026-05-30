import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import MathsCalculator from '../../components/MathsCalculator';

const GATE_SEQUENCE = [
  // 1–10: warmup, centre
  0.50, 0.48, 0.52, 0.50, 0.45, 0.55, 0.50, 0.45, 0.55, 0.50,
  // 11–20: gentle waves
  0.35, 0.62, 0.38, 0.60, 0.35, 0.63, 0.38, 0.60, 0.35, 0.60,
  // 21–30: medium swings
  0.28, 0.68, 0.30, 0.70, 0.28, 0.70, 0.30, 0.68, 0.32, 0.65,
  // 31–40: harder alternating
  0.22, 0.72, 0.20, 0.75, 0.22, 0.72, 0.50, 0.22, 0.75, 0.25,
  // 41–50: rapid high/low
  0.18, 0.78, 0.20, 0.75, 0.18, 0.78, 0.20, 0.75, 0.18, 0.78,
  // 51–60: mixed with centre rests
  0.50, 0.15, 0.80, 0.50, 0.15, 0.80, 0.25, 0.70, 0.20, 0.75,
  // 61–70: challenging
  0.15, 0.80, 0.18, 0.78, 0.15, 0.80, 0.18, 0.78, 0.50, 0.15,
  // 71–80: very hard
  0.80, 0.15, 0.80, 0.20, 0.75, 0.15, 0.80, 0.22, 0.72, 0.50,
  // 81–90: extreme
  0.12, 0.82, 0.12, 0.82, 0.15, 0.80, 0.12, 0.82, 0.15, 0.80,
  // 91–99: final sprint
  0.20, 0.75, 0.15, 0.80, 0.12, 0.82, 0.15, 0.80, 0.20,
  // 100: triumphant centre finish
  0.50,
];

const ptsForScore = (s) => s >= 100 ? 200 : s >= 14 ? 100 : s >= 9 ? 80 : s >= 5 ? 60 : s >= 2 ? 40 : 20;

export default function BuffaloMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect, setIsCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const [bflPhase, setBflPhase]               = useState('edu');
  const [bflScore, setBflScore]               = useState(0);
  const [bflBest,  setBflBest]                = useState(0);
  const [bflReady, setBflReady]               = useState(false);
  const [bflStarted, setBflStarted]           = useState(false);
  const [bflUsedRetry, setBflUsedRetry]       = useState(false);
  const [bflSchoolQuizReady, setBflSchoolQuizReady] = useState(false);

  const bflRafRef     = useRef(null);
  const bflGameRef    = useRef(null);
  const bflRiverRef   = useRef(null);
  const bflBuffaloRef = useRef(null);
  const bflPipesRef   = useRef(null);
  const bflScoreRef   = useRef(null);

  const currentQuestion    = getStageQuestions(currentAnimal, classStage, classSubject)[0];
  const correctAnswerIndex = currentQuestion?.correct ?? 0;
  const fact = currentQuestion?.stageFacts?.[classStage] || currentQuestion?.fact;

  const flap = useCallback(() => {
    if (bflPhase !== 'playing' || !bflReady) return;
    const g = bflGameRef.current;
    if (!g) return;
    if (!g.started) { g.started = true; setBflStarted(true); }
    g.vy = -9.5;
  }, [bflPhase, bflReady]);

  const startGame = useCallback(() => {
    if (bflRafRef.current) cancelAnimationFrame(bflRafRef.current);
    bflGameRef.current = null;
    setBflScore(0);
    setBflReady(false);
    setBflStarted(false);
    setBflPhase('playing');
  }, []);

  const claimAndQuiz = useCallback(() => {
    if (bflRafRef.current) cancelAnimationFrame(bflRafRef.current);
    setBflPhase('edu');
    setBflSchoolQuizReady(true);
  }, []);

  // Game loop
  useEffect(() => {
    if (bflPhase !== 'playing') {
      if (bflRafRef.current) cancelAnimationFrame(bflRafRef.current);
      return;
    }

    const W = window.innerWidth;
    const H = window.innerHeight - 52;

    const RIVER_TOP = 110;
    const GROUND_H  = 110;
    const groundY   = H - GROUND_H;

    const GRAVITY = 0.45, JUMP_VY = -9.5;
    const BH = 115;
    const BFLO_X = 80;
    const OW = 630;
    const PIX_BETWEEN = 350;

    const riverH  = groundY - RIVER_TOP;
    const initGap = Math.min(215, Math.max(130, Math.round(riverH * 0.48)));
    const minGap  = Math.max(110, Math.round(riverH * 0.32));

    const g = {
      by: RIVER_TOP + (riverH / 2) - BH / 2 + 5, vy: 0,
      started: false,
      obstacles: [],
      frame: 0, speed: 1.8, score: 0,
      bgOffset: 0, gap: initGap,
      framesSinceLastPipe: 9999,
      gateIdx: 0,
    };
    bflGameRef.current = g;
    let stopped = false;
    let lastTs = null;

    const riverEl   = bflRiverRef.current;
    const buffaloEl = bflBuffaloRef.current;
    const pipesEl   = bflPipesRef.current;
    const scoreEl   = bflScoreRef.current;

    const pipePool = [];
    function getPipePair(i) {
      if (pipePool[i]) return pipePool[i];
      const mkImg = (isTop) => {
        const el = document.createElement('img');
        el.src = 'images/pipe.png';
        el.className = 'rr-pipe ' + (isTop ? 'rr-pipeTop' : 'rr-pipeBot');
        el.style.display = 'none';
        pipesEl.appendChild(el);
        return el;
      };
      pipePool[i] = { top: mkImg(true), bot: mkImg(false) };
      return pipePool[i];
    }

    function spawnPipe(startX) {
      if (g.gateIdx >= GATE_SEQUENCE.length) return;
      const fraction = GATE_SEQUENCE[g.gateIdx++];
      const availH = groundY - g.gap - RIVER_TOP - 10;
      const topH = Math.max(RIVER_TOP + 5, Math.min(groundY - g.gap - 60,
        Math.round(RIVER_TOP + 5 + availH * fraction)));
      g.obstacles.push({ x: startX !== undefined ? startX : W + OW + 10, topH, passed: false, gate_checked: false });
    }

    function render() {
      if (riverEl) riverEl.style.backgroundPositionX = (-g.bgOffset * 1.5) + 'px';
      if (buffaloEl) buffaloEl.style.top = Math.round(g.by) + 'px';
      if (scoreEl) scoreEl.textContent = g.score;

      g.obstacles.forEach((o, i) => {
        const pair = getPipePair(i);
        const bS = o.topH + g.gap;
        const bH = H - bS;
        pair.top.style.display = 'block';
        pair.top.style.left    = Math.round(o.x) + 'px';
        pair.top.style.height  = o.topH + 'px';
        if (bH > 0) {
          pair.bot.style.display = 'block';
          pair.bot.style.left    = Math.round(o.x) + 'px';
          pair.bot.style.height  = bH + 'px';
        } else {
          pair.bot.style.display = 'none';
        }
      });
      for (let i = g.obstacles.length; i < pipePool.length; i++) {
        pipePool[i].top.style.display = 'none';
        pipePool[i].bot.style.display = 'none';
      }
    }

    function loop(ts) {
      if (stopped) return;

      if (!g.started) {
        render();
        bflRafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dt = lastTs !== null ? Math.min((ts - lastTs) / 16.667, 2.5) : 1;
      lastTs = ts;

      g.frame++; g.bgOffset += g.speed * dt;
      g.vy += GRAVITY * dt; g.by += g.vy * dt;
      g.speed = Math.min(6.0, 1.8 + g.score * 0.10);
      g.gap   = Math.max(minGap, initGap - g.score * 2.5);

      g.framesSinceLastPipe += dt;
      const pipeInterval = Math.round(PIX_BETWEEN / g.speed);
      if (g.framesSinceLastPipe >= pipeInterval && g.frame > 28 && g.gateIdx < GATE_SEQUENCE.length) {
        spawnPipe(g.obstacles.length === 0 ? Math.min(700, W - 80) : undefined);
        g.framesSinceLastPipe = 0;
      }

      g.obstacles.forEach(o => { o.x -= g.speed * dt; });
      g.obstacles = g.obstacles.filter(o => o.x > -OW - 30);

      if (g.by + BH > H) {
        g.by = H - BH; render(); stopped = true;
        setBflBest(prev => Math.max(prev, g.score)); setBflPhase('dead'); return;
      }
      if (g.by < 0) {
        stopped = true;
        setBflBest(prev => Math.max(prev, g.score)); setBflPhase('dead'); return;
      }

      const gby = g.by + 75, gbbot = g.by + 119;
      for (const o of g.obstacles) {
        if (!o.gate_checked && o.x + OW * 0.5 < BFLO_X + 100) {
          o.gate_checked = true;
          const visualGapTop = o.topH * 0.798;
          const bS = o.topH + g.gap;
          const visualGapBot = bS + 0.202 * (H - bS);
          if (gby < visualGapTop || gbbot > visualGapBot) {
            render(); stopped = true;
            setBflBest(prev => Math.max(prev, g.score)); setBflPhase('dead'); return;
          }
          o.passed = true; g.score++;
          setBflScore(g.score);
          if (g.score >= GATE_SEQUENCE.length) {
            render(); stopped = true;
            setBflBest(prev => Math.max(prev, g.score)); setBflPhase('win'); return;
          }
        }
      }

      render();
      bflRafRef.current = requestAnimationFrame(loop);
    }

    function onKey(e) {
      if ((e.code === 'Space' || e.key === ' ') && !stopped) {
        e.preventDefault();
        if (bflGameRef.current) bflGameRef.current.vy = JUMP_VY;
      }
    }
    window.addEventListener('keydown', onKey);
    bflRafRef.current = requestAnimationFrame(loop);

    return () => {
      stopped = true;
      cancelAnimationFrame(bflRafRef.current);
      window.removeEventListener('keydown', onKey);
      if (riverEl) riverEl.style.backgroundPositionX = '0px';
      if (pipesEl) pipesEl.innerHTML = '';
      pipePool.length = 0;
    };
  }, [bflPhase]);

  // Asset preload
  useEffect(() => {
    if (bflPhase !== 'playing') return;
    let cancelled = false;
    const proceed = () => { if (!cancelled) { cancelled = true; setBflReady(true); } };
    const srcs = ['images/buffalo.png', 'images/pipe.png', 'images/river.png', 'images/bank.png', 'images/trees.png'];
    Promise.all(srcs.map(src => {
      const img = new Image();
      img.src = src;
      return img.decode ? img.decode().catch(() => {}) : new Promise(r => { img.onload = img.onerror = r; });
    })).then(proceed);
    const fallback = setTimeout(proceed, 3000);
    return () => { cancelled = true; clearTimeout(fallback); };
  }, [bflPhase]);

  // ── Quiz phase (after game) ──────────────────────────────────────────────
  if (bflSchoolQuizReady) {
    return (
      <div style={{ position:'fixed', inset:0, overflow:'hidden', background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)') : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
        <div style={{ background:'linear-gradient(135deg,var(--jungle-deep),var(--jungle-mid))', padding:'0.6rem 1rem', flex:'0 0 auto', zIndex:100 }}>
          <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ width:'70px' }} />
            <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
            <div style={{ width:'70px' }} />
          </div>
        </div>

        <div style={{ width:'100%', height:'13vh', minHeight:'90px', maxHeight:'130px', backgroundImage:'url(images/asian-water-buffalo.jpg)', backgroundSize:'cover', backgroundPosition:'center', position:'relative', flex:'0 0 auto' }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(180deg,transparent 0%,rgba(10,47,31,0.95) 100%)', padding:'0.6rem 1rem 0.5rem' }}>
            <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center' }}>
              <h1 className="heading-display" style={{ fontSize:'clamp(1.2rem,3vh,1.6rem)', color:'white', marginBottom:'0.1rem', lineHeight:1.1 }}>Asian Water Buffalo</h1>
              <p className="serif-accent" style={{ fontSize:'clamp(0.75rem,1.8vh,0.9rem)', color:'var(--safari-gold)' }}>Now answer the question</p>
            </div>
          </div>
        </div>

        {showResult && (
          <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
            <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
            <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color:isCorrect?'#10b981':'#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>
              {isCorrect ? 'Correct!' : 'Not Quite'}
            </h2>
            {isCorrect && fact && (
              <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
                <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {fact}</p>
              </div>
            )}
            <button onClick={() => { if (isCorrect) { handleNextQuestion(1); } else { setIsProcessingAnswer(false); setShowResult(false); } }}
              style={{ background:isCorrect?'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))':'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
              {isCorrect ? 'Continue to Observation →' : 'Try Again'}
            </button>
          </div>
        )}

        {!showResult && (
          <div style={{ flex:'1 1 auto', overflowY:'auto', padding:'1rem', maxWidth:'560px', margin:'0 auto', width:'100%' }}>
            <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'clamp(0.8rem,2vh,1.2rem)', boxShadow:'0 8px 32px rgba(0,0,0,0.1)', marginBottom:'1rem' }}>
              <p style={{ fontSize:'0.7rem', fontWeight:800, color:'var(--jungle-mid)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem', textAlign:'center' }}>Quiz Question</p>
              <p style={{ fontSize:'clamp(0.9rem,2vh,1.1rem)', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'clamp(0.8rem,1.5vh,1rem)', lineHeight:1.3, textAlign:'center' }}>{currentQuestion?.q}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(0.5rem,1vh,0.8rem)' }}>
                {(currentQuestion?.options || []).map((opt, i) => (
                  <button key={i} onClick={() => handleQuizAnswer(0, i, correctAnswerIndex)}
                    style={{ textAlign:'center', padding:'clamp(1rem,2.5vh,1.5rem) clamp(0.5rem,1vh,0.8rem)', borderRadius:'var(--t-r-md)', border:'3px solid var(--jungle-light)', background:'white', cursor:'pointer', fontSize:'clamp(0.85rem,1.8vh,1rem)', fontWeight:600, color:'var(--jungle-deep)', lineHeight:1.2, minHeight:'clamp(70px,12vh,90px)', display:'flex', alignItems:'center', justifyContent:'center', touchAction:'manipulation' }}>
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

  // ── Game phase ───────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', background:'#0E1E08' }}>
      {/* Game header */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'52px', background:'linear-gradient(to right,var(--t-deep),var(--t-mid),var(--t-deep))', borderBottom:'1.5px solid rgba(80,200,120,0.25)', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 1rem', zIndex:20, boxSizing:'border-box', boxShadow:'0 3px 16px rgba(0,0,0,0.5)' }}>
        <button onClick={() => { if (bflRafRef.current) cancelAnimationFrame(bflRafRef.current); setBflPhase('edu'); setCurrentScreen('map'); }}
          style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)', color:'white', padding:'0.4rem 0.9rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>
          ← Back
        </button>
        <span className="taronga-title" style={{ color:'white', fontSize:'1.1rem', letterSpacing:'0.06em', textShadow:'0 0 10px rgba(100,220,140,0.4)' }}>River Run</span>
        {bflBest > 0
          ? <div style={{ background:'rgba(255,215,50,0.18)', border:'1px solid rgba(255,215,50,0.35)', borderRadius:'20px', padding:'0.2rem 0.65rem', minWidth:'60px', textAlign:'center' }}>
              <span style={{ color:'rgba(255,230,100,0.75)', fontSize:'0.62rem', fontWeight:700, display:'block', lineHeight:1, letterSpacing:'0.05em' }}>BEST</span>
              <span style={{ color:'#FFD850', fontSize:'0.92rem', fontWeight:800, lineHeight:1 }}>{bflBest}</span>
            </div>
          : <div style={{ minWidth:'60px' }} />
        }
      </div>

      {/* Game canvas */}
      <div className="rr-game"
        onClick={flap}
        onTouchStart={e => { e.preventDefault(); flap(); }}
        style={{ top:'52px', bottom:0 }}>
        <img src="images/trees.png" alt="" className="rr-topTrees" />
        <img src="images/bank.png"  alt="" className="rr-topBank" />
        <div ref={bflRiverRef} className="rr-river" />
        <img src="images/bank.png"  alt="" className="rr-bottomBank" />
        <img src="images/trees.png" alt="" className="rr-bottomTrees" />
        <div ref={bflPipesRef} style={{ position:'absolute', inset:0, zIndex:4, pointerEvents:'none' }} />
        <img ref={bflBuffaloRef} src="images/buffalo.png" alt="" className="rr-buffalo" />
        <div className="rr-hud">
          <div className="rr-hudPill">
            <div className="rr-hudLabel">SCORE</div>
            <div ref={bflScoreRef} className="rr-hudScore">0</div>
          </div>
        </div>

        {/* Loading overlay */}
        {!bflReady && bflPhase === 'playing' && (
          <div style={{ position:'absolute', inset:0, zIndex:50, background:'linear-gradient(160deg,#0A2818,#0D3320)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.2rem' }}>
            <img src="images/buffalo.png" alt="" style={{ width:'110px', opacity:0.9, filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.6))' }} />
            <p className="taronga-title" style={{ color:'white', fontSize:'1.4rem', letterSpacing:'0.1em', margin:0 }}>River Run</p>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              {[0,1,2].map(i => (<div key={i} style={{ width:'8px', height:'8px', borderRadius:'50%', background:'rgba(100,220,140,0.85)', animation:`bflDot 1.1s ease-in-out ${i*0.22}s infinite` }} />))}
            </div>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.75rem', margin:0, letterSpacing:'0.06em' }}>LOADING…</p>
          </div>
        )}

        {/* Tap to play prompt */}
        {bflReady && !bflStarted && bflPhase === 'playing' && (
          <div style={{ position:'absolute', inset:0, zIndex:40, pointerEvents:'none', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.65rem' }}>
            <p className="taronga-title" style={{ color:'white', fontSize:'1.3rem', letterSpacing:'0.08em', margin:0, textShadow:'0 2px 10px rgba(0,0,0,0.9)' }}>Tap to Play!</p>
            <div style={{ display:'flex', gap:'0.45rem' }}>
              {[0,1,2].map(i => (<div key={i} style={{ width:'7px', height:'7px', borderRadius:'50%', background:'rgba(100,220,140,0.9)', animation:`bflDot 1.1s ease-in-out ${i*0.22}s infinite` }} />))}
            </div>
          </div>
        )}
      </div>

      {/* Edu / intro overlay */}
      {bflPhase === 'edu' && (
        <div style={{ position:'absolute', inset:0, zIndex:30, background:'linear-gradient(160deg,#0A2818 0%,#0D3320 50%,#0A2010 100%)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <img src={`images/asian-water-buffalo.jpg`} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', opacity:0.12, pointerEvents:'none', userSelect:'none' }} />
          <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.85rem 1.1rem 0' }}>
            <button onClick={() => setCurrentScreen('map')}
              style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', color:'rgba(255,255,255,0.75)', padding:'0.4rem 0.95rem', borderRadius:'40px', cursor:'pointer', fontSize:'0.82rem', fontWeight:600, letterSpacing:'0.03em' }}>
              ← Back
            </button>
            <img src="images/logo.png" alt="Taronga" style={{ height:'32px', width:'auto', opacity:0.7 }} onError={e => { e.target.style.display='none'; }} />
          </div>
          <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.5rem 1.25rem 1.75rem', maxWidth:'440px', margin:'0 auto', width:'100%' }}>
            <h1 className="taronga-title" style={{ fontSize:'clamp(2.2rem,8vw,3rem)', color:'white', letterSpacing:'0.08em', margin:'0 0 0.2rem', textAlign:'center', lineHeight:1 }}>River Run</h1>
            <div style={{ width:'48px', height:'2px', background:'rgba(100,220,140,0.55)', borderRadius:'1px', margin:'0.65rem auto 1.4rem' }} />
            <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'14px', padding:'1.1rem 1.2rem', marginBottom:'0.85rem' }}>
              <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,220,140,0.85)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.55rem' }}>About the Species</p>
              <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.88)', lineHeight:1.65, margin:0 }}>
                Asian Water Buffalo thrive in <strong style={{ color:'white' }}>wetlands and muddy riverbeds</strong> - their wide hooves act like natural snowshoes, spreading their weight so they don't sink. On <strong style={{ color:'#F4A460' }}>hard, dry ground</strong> those same hooves become a liability, making river habitat essential to their survival.
              </p>
            </div>
            <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.11)', borderRadius:'14px', padding:'1.1rem 1.2rem', marginBottom:'1.1rem' }}>
              <p style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(100,220,140,0.85)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.7rem' }}>How to Play</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {[
                  ['Tap the screen', 'to float the buffalo upward through the river.'],
                  ['Avoid the earth banks', ' - touching them ends your run.'],
                  ['Pass as many gaps as you can', ' - then answer the quiz question!'],
                ].map(([bold, rest], i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.6rem' }}>
                    <div style={{ flexShrink:0, width:'5px', height:'5px', borderRadius:'50%', background:'rgba(100,220,140,0.7)', marginTop:'0.42rem' }} />
                    <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.82)', lineHeight:1.5, margin:0 }}><strong style={{ color:'white' }}>{bold}</strong> {rest}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => { setBflUsedRetry(false); startGame(); }}
              style={{ width:'100%', padding:'1.05rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#2A8A40,#1E6A30)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.12em', boxShadow:'0 6px 24px rgba(30,100,50,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Win screen */}
      {bflPhase === 'win' && (
        <div style={{ position:'absolute', inset:0, zIndex:30, background:'linear-gradient(160deg,#0A2818 0%,#0D3320 50%,#0A2010 100%)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem 1.5rem', maxWidth:'420px', margin:'0 auto', width:'100%' }}>
            <div style={{ fontSize:'2.8rem', marginBottom:'0.4rem' }}>🏆</div>
            <h1 className="taronga-title" style={{ fontSize:'clamp(2.4rem,9vw,3.2rem)', color:'white', letterSpacing:'0.08em', margin:'0 0 0.3rem', textAlign:'center', lineHeight:1 }}>Amazing!</h1>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.9rem', marginBottom:'0.5rem' }}>You cleared all 100 gates!</p>
            <div style={{ width:'48px', height:'2px', background:'rgba(100,220,140,0.6)', borderRadius:'1px', margin:'0.4rem auto 1.6rem' }} />
            <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(100,220,140,0.25)', borderRadius:'18px', padding:'1rem 2rem', marginBottom:'1.6rem', textAlign:'center' }}>
              <div style={{ fontSize:'0.7rem', fontWeight:700, color:'rgba(100,220,140,0.75)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.3rem' }}>Game Points</div>
              <div style={{ fontSize:'3rem', fontWeight:800, color:'white', lineHeight:1 }}>200</div>
              <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', marginTop:'0.2rem' }}>Now answer the quiz to complete the mission!</div>
            </div>
            <button onClick={claimAndQuiz}
              style={{ width:'100%', padding:'1.05rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#2A8A40,#1E6A30)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.12em', boxShadow:'0 6px 24px rgba(30,100,50,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
              Continue to Quiz →
            </button>
          </div>
        </div>
      )}

      {/* Dead - first death: offer retry */}
      {bflPhase === 'dead' && !bflUsedRetry && (
        <div style={{ position:'absolute', top:'52px', left:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(28,4,4,0.72)', backdropFilter:'blur(4px)', zIndex:10 }}>
          <div className="animate-scale-in" style={{ background:'white', borderRadius:'var(--t-r-xl)', padding:'1.65rem 2rem', textAlign:'center', maxWidth:'300px', width:'calc(100% - 3rem)', boxShadow:'0 16px 50px rgba(0,0,0,0.48)' }}>
            <div style={{ fontSize:'2.6rem', marginBottom:'0.25rem' }}>💦</div>
            <h2 className="heading-display" style={{ fontSize:'1.75rem', color:'#C0392B', marginBottom:'0.3rem' }}>Hit dry land!</h2>
            <p style={{ color:'#555', fontSize:'0.88rem', marginBottom:'0.15rem' }}>
              Gates cleared: <strong style={{ color:'var(--t-deep)', fontSize:'1.3rem' }}>{bflScore}</strong>
            </p>
            {bflBest > 0 && <p style={{ color:'#999', fontSize:'0.76rem', marginBottom:'0.9rem' }}>Personal best: {bflBest} gates</p>}
            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-md)', padding:'0.4rem 0.75rem', marginBottom:'1.1rem', fontSize:'0.82rem', color:'#059669', fontWeight:700 }}>
              {ptsForScore(bflBest)} game pts earned - keep going for more!
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
              <button onClick={() => { setBflUsedRetry(true); startGame(); }}
                style={{ width:'100%', padding:'0.9rem', borderRadius:'var(--t-r-pill)', border:'none', background:'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))', color:'white', fontSize:'1rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 14px rgba(26,82,56,0.38)' }}>
                Try Again
              </button>
              <button onClick={() => { setBflUsedRetry(true); claimAndQuiz(); }}
                style={{ width:'100%', padding:'0.75rem', borderRadius:'var(--t-r-pill)', border:'1.5px solid #B8D9C4', background:'transparent', color:'var(--t-deep)', fontSize:'0.88rem', fontWeight:600, cursor:'pointer' }}>
                Continue to Quiz →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dead - after retry: full end card */}
      {bflPhase === 'dead' && bflUsedRetry && (
        <div style={{ position:'absolute', inset:0, zIndex:30, background:'linear-gradient(160deg,#0A2818 0%,#0D3320 50%,#0A2010 100%)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem 1.5rem', maxWidth:'420px', margin:'0 auto', width:'100%' }}>
            <h1 className="taronga-title" style={{ fontSize:'clamp(2.4rem,9vw,3.2rem)', color:'white', letterSpacing:'0.08em', margin:'0 0 0.3rem', textAlign:'center', lineHeight:1 }}>Great Run!</h1>
            <div style={{ width:'48px', height:'2px', background:'rgba(100,220,140,0.6)', borderRadius:'1px', margin:'0.6rem auto 1.6rem' }} />
            <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(100,220,140,0.25)', borderRadius:'18px', padding:'1rem 2rem', marginBottom:'1.6rem', textAlign:'center' }}>
              <div style={{ fontSize:'0.7rem', fontWeight:700, color:'rgba(100,220,140,0.75)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.3rem' }}>Game Points Earned</div>
              <div style={{ fontSize:'3rem', fontWeight:800, color:'white', lineHeight:1 }}>{ptsForScore(bflBest)}</div>
              <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', marginTop:'0.2rem' }}>from your best run of {bflBest} gates</div>
            </div>
            <div style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'14px', padding:'1rem 1.15rem', marginBottom:'1.5rem', borderLeft:'3px solid rgba(100,220,140,0.5)' }}>
              <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.88)', lineHeight:1.65, margin:0 }}>
                Without access to water or mud, water buffalo can quickly overheat in hot environments.
              </p>
            </div>
            <button onClick={claimAndQuiz}
              style={{ width:'100%', padding:'1.05rem', borderRadius:'40px', border:'none', background:'linear-gradient(to right,#2A8A40,#1E6A30)', color:'white', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.12em', boxShadow:'0 6px 24px rgba(30,100,50,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
              Continue to Quiz →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
