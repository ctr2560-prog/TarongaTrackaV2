import { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { getBearing, getDistance } from '../utils/helpers';
import StudentGuide from '../components/StudentGuide';
import TutorialOverlay from '../components/TutorialOverlay';

const CARDINALS = ['N','NE','E','SE','S','SW','W','NW'];
const toCardinal = (deg) => CARDINALS[Math.round(deg / 45) % 8];

// Map is SOUTH-UP and X-AXIS INVERTED (east is left, west is right).
// MAP_BOUNDS used only for the live student-dot overlay.
const MAP_BOUNDS = {
  north: -33.8385,  // bottom edge of image
  south: -33.8492,  // top edge of image (harbour side)
  west:  151.2342,  // left edge
  east:  151.2462,  // right edge
};

// ── Hardcoded exhibit positions (% of image width/height) ─────────────────────
// Map image: 2465×2339px rendered from the MAP ONLY PDF at 200 DPI.
// The bottom ~12% of the image is the KEY legend strip (not geographical).
const MAP_CONTENT_HEIGHT = 0.88; // fraction of image height that is map (rest = legend)

const ANIMAL_MAP_POSITIONS = {
  'sea-lion':                { x: 62.1, y: 25.0, label: 'Sea Lions'     },
  'concert-lawn':            { x: 28.6, y: 24.4, label: 'Concert Lawn'  },
  'gorilla':                 { x: 57.8, y: 43.2, label: 'Gorillas'      },
  'asian-water-buffalo':     { x: 70.3, y: 35.9, label: 'Water Buffalo' },
  'lemur':                   { x: 63.5, y: 61.5, label: 'Lemurs'        },
  'tiger':                   { x: 91.3, y: 57.8, label: 'Tiger Trek'    },
  'giraffe':                 { x: 75.5, y: 63.4, label: 'Giraffes'      },
  'lion':                    { x: 94.2, y: 71.3, label: 'Lions'         },
  'chimpanzee':              { x: 78.7, y: 72.9, label: 'Chimps'        },
  'blue-mountains-bushwalk': { x: 28.2, y: 47.5, label: 'Bushwalk'     },
  'dingo':                   { x: 21.2, y: 62.7, label: 'Dingoes'       },
  'koala':                   { x: 60.2, y: 72.1, label: 'Koalas'        },
};

export default function MapScreen() {
  const { setCurrentScreen, studentName, classCode } = useApp();
  const {
    animalsToRender, foundAnimals, totalPoints, badges,
    userLocation, locationEnabled, locationError, gpsRequired, checkAnimalProximity, enableLocation, retryLocation,
    activityCompleted, isSubmittingActivity,
    discoverAnimal, completeActivity,
    studentStatus, statusLoaded,
    showZooMap, setShowZooMap,
    conservationStatement, setConservationStatement,
    showConservationScreen, setShowConservationScreen,
    completionCardDismissed, setCompletionCardDismissed,
  } = useStudent();

  const [mapLoaded, setMapLoaded] = useState(false);

  // Zoom & pan — start at 0.85 so the full map is visible with room to scroll right
  const [mapScale,    setMapScale]    = useState(0.85);
  const outerScrollRef = useRef(null);
  const pinchRef       = useRef({ active:false, startDist:0, startScale:1 });
  const panRef         = useRef({ active:false, startX:0, startY:0, scrollX:0, scrollY:0 });

  const clampScale = (s) => Math.min(4, Math.max(0.4, s));

  const handleWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setMapScale(s => clampScale(s * (e.deltaY < 0 ? 1.12 : 0.9)));
  };

  const pinchDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchRef.current = { active:true, startDist: pinchDist(e.touches), startScale: mapScale };
      panRef.current.active = false;
    } else if (e.touches.length === 1) {
      panRef.current = { active:true, startX: e.touches[0].clientX, startY: e.touches[0].clientY, scrollX: outerScrollRef.current?.scrollLeft ?? 0, scrollY: outerScrollRef.current?.scrollTop ?? 0 };
      pinchRef.current.active = false;
    }
  };

  const handleTouchMove = (e) => {
    if (pinchRef.current.active && e.touches.length === 2) {
      e.preventDefault();
      const ratio = pinchDist(e.touches) / pinchRef.current.startDist;
      setMapScale(clampScale(pinchRef.current.startScale * ratio));
    } else if (panRef.current.active && e.touches.length === 1 && outerScrollRef.current) {
      e.preventDefault();
      outerScrollRef.current.scrollLeft = panRef.current.scrollX + (panRef.current.startX - e.touches[0].clientX);
      outerScrollRef.current.scrollTop  = panRef.current.scrollY + (panRef.current.startY - e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current.active = false;
    panRef.current.active   = false;
  };


  useEffect(() => {
    if (gpsRequired) enableLocation();
  }, [gpsRequired, enableLocation]);

  // Session already submitted - show completion card
  if (studentStatus === 'complete' && !completionCardDismissed) {
    return (
      <div className="fade-in" style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--jungle-deep) 0%, var(--jungle-mid) 50%, var(--jungle-light) 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'hidden' }}>
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
          {[...Array(60)].map((_,i)=>(
            <div key={i} style={{ position:'absolute', left:`${Math.random()*100}%`, top:'-20px', width:`${6+Math.random()*8}px`, height:`${6+Math.random()*8}px`, borderRadius: Math.random()>0.5 ? '50%' : '2px', background:['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#4A9E6B','#34D399'][Math.floor(Math.random()*7)], animation:`fall ${2.5+Math.random()*2.5}s linear forwards`, animationDelay:`${Math.random()*1.2}s` }} />
          ))}
        </div>
        <div className="animate-scale-in" style={{ position:'relative', zIndex:10, background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'clamp(1.8rem, 5vh, 2.8rem)', maxWidth:'460px', width:'100%', textAlign:'center', boxShadow:'var(--t-shadow-xl)', border:'1px solid rgba(255,255,255,0.8)' }}>
          <div style={{ width:'76px', height:'76px', borderRadius:'50%', background:'linear-gradient(135deg, var(--t-eucalyptus), var(--t-mid))', margin:'0 auto 1.1rem', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', boxShadow:'0 6px 20px rgba(46,125,85,0.38)' }}>✓</div>
          <h1 className="taronga-title" style={{ fontSize:'clamp(1.8rem, 4.5vh, 2.4rem)', color:'var(--t-deep)', marginBottom:'0.2rem', letterSpacing:'0.04em' }}>Submission Complete</h1>
          <p className="serif-accent" style={{ color:'var(--t-sage)', fontSize:'clamp(0.92rem, 2vh, 1.1rem)', marginBottom:'1.4rem' }}>Your results have been saved</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.65rem', marginBottom:'1.4rem' }}>
            {[
              { label:'Points',  value: totalPoints },
              { label:'Badges',  value: badges.length },
              { label:'Animals', value:`${foundAnimals.size}/${animalsToRender.length}` },
            ].map(s => (
              <div key={s.label} style={{ background:'var(--t-foam)', borderRadius:'var(--t-r-md)', padding:'0.85rem 0.4rem', border:'1px solid var(--t-mist)' }}>
                <div style={{ fontWeight:800, color:'var(--t-mid)', fontSize:'1.25rem', lineHeight:1.2 }}>{s.value}</div>
                <div style={{ color:'var(--t-ash)', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'0.15rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {badges.length > 0 && (
            <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.4rem' }}>
              {badges.map((b, i) => (
                <div key={i} style={{ width:'48px', height:'48px', borderRadius:'var(--t-r-sm)', backgroundImage:`url(images/badge-${b.animalId}.png)`, backgroundSize:'cover', backgroundPosition:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.15)', border:'2px solid white' }} />
              ))}
            </div>
          )}
          <div className="fade-in" style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-md)', padding:'0.6rem 1rem', marginBottom:'1.4rem', display:'inline-block' }}>
            <p style={{ color:'#16A34A', fontSize:'0.8rem', fontWeight:600 }}>Saved to class {classCode} · {studentName}</p>
          </div>
          <button onClick={() => setCompletionCardDismissed(true)} style={{ background:'linear-gradient(135deg, var(--jungle-mid), var(--jungle-light))', color:'white', border:'none', padding:'0.85rem 2.5rem', fontSize:'1.05rem', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 6px 18px rgba(26,82,56,0.4)' }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--t-canvas)' }}>
      {/* Conservation screen overlay */}
      {showConservationScreen && (
        <div style={{ position:'fixed', inset:0, zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.55)', padding:'1rem' }}>
          <div className="fade-in" style={{ background:'white', borderRadius:'var(--t-r-xl)', padding:'2rem', maxWidth:'500px', width:'100%', boxShadow:'0 24px 64px rgba(0,0,0,0.35)', textAlign:'center' }}>
            <div style={{ fontSize:'3rem', marginBottom:'0.6rem' }}>🌍</div>
            <h2 className="heading-display" style={{ fontSize:'1.9rem', color:'var(--jungle-deep)', marginBottom:'0.5rem' }}>Make a Difference</h2>
            <p style={{ fontSize:'0.92rem', color:'#555', lineHeight:1.7, marginBottom:'0.4rem' }}>Before you finish, think about how you can help protect animals and the environment.</p>
            <p style={{ fontSize:'0.95rem', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'1rem' }}>Based on today's experience, what is ONE thing you can do to support conservation?</p>
            <textarea
              value={conservationStatement}
              onChange={e => setConservationStatement(e.target.value)}
              placeholder="I can help by..."
              style={{ width:'100%', minHeight:'120px', padding:'1rem 1.1rem', borderRadius:'var(--t-r-md)', border:'2px solid #E5E5E5', fontSize:'1rem', fontFamily:'DM Sans, sans-serif', resize:'vertical', color:'#222', lineHeight:1.6, boxSizing:'border-box', outline:'none', transition:'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--jungle-mid)'}
              onBlur={e => e.target.style.borderColor = '#E5E5E5'}
            />
            <div style={{ fontSize:'0.78rem', color: conservationStatement.trim().length >= 5 ? '#16A34A' : '#aaa', marginTop:'0.3rem', marginBottom:'1.1rem', textAlign:'right', fontWeight:600 }}>
              {conservationStatement.trim().length} / 5 minimum characters
            </div>
            <button
              disabled={conservationStatement.trim().length < 5}
              onClick={() => { setShowConservationScreen(false); completeActivity(conservationStatement); }}
              style={{ width:'100%', padding:'1rem', borderRadius:'var(--t-r-pill)', border:'none', background: conservationStatement.trim().length >= 5 ? 'linear-gradient(135deg, var(--sunset-orange), var(--earth-clay))' : '#CCC', color:'white', fontSize:'1rem', fontWeight:700, cursor: conservationStatement.trim().length >= 5 ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem' }}>
              Submit & Finish
            </button>
            <button onClick={() => setShowConservationScreen(false)} style={{ background:'none', border:'none', color:'#aaa', fontSize:'0.8rem', cursor:'pointer' }}>← Back</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="student-header">
        <div className="student-banner-mobile student-header-inner">
          <div className="logo-title-block" style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'90px', width:'auto' }} onError={e => e.target.style.display='none'} />
            <div>
              <h1 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 3.5vw, 2.2rem)', color:'white', marginBottom:'0.2rem', letterSpacing:'0.04em', textShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>Discover Animals</h1>
              <p className="serif-accent" style={{ color:'var(--safari-gold)', fontSize:'1rem' }}>Get within range to unlock</p>
            </div>
          </div>

          {studentName && (
            <div className="student-name-pill" style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', borderRadius:'var(--t-r-pill)', padding:'0.4rem 0.9rem', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)' }}>
              <span style={{ color:'white', fontSize:'0.82rem', fontWeight:600 }}>👤 {studentName}</span>
            </div>
          )}

          {studentName && classCode && (
            <button className="submit-btn" onClick={completeActivity}
              disabled={activityCompleted || isSubmittingActivity}
              style={{ background: activityCompleted ? 'rgba(46,125,85,0.5)' : 'linear-gradient(135deg, var(--sunset-orange), var(--earth-clay))', border: activityCompleted ? '1px solid rgba(255,255,255,0.3)' : 'none', color:'white', padding:'0.55rem 1rem', borderRadius:'30px', cursor: activityCompleted || isSubmittingActivity ? 'not-allowed' : 'pointer', fontSize:'0.82rem', fontWeight:700, opacity: activityCompleted || isSubmittingActivity ? 0.6 : 1, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', boxShadow: activityCompleted ? 'none' : '0 4px 12px rgba(232,106,51,0.4)', transition:'all 0.2s' }}>
              {activityCompleted ? 'Submitted' : isSubmittingActivity ? 'Submitting...' : 'Complete Activity'}
            </button>
          )}

          <button id="t-zoo-map-btn" onClick={() => setShowZooMap(true)}
            style={{ padding:'6px 12px', background:'#2E7D32', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', marginLeft:'10px', fontSize:'0.82rem', fontWeight:600 }}>
            Zoo Map
          </button>

          <button className="student-points-chip" onClick={() => setCurrentScreen('collection')}>
            <div className="pts-value">{totalPoints}</div>
            <div className="pts-label">{foundAnimals.size}/{animalsToRender.length} Badges</div>
          </button>
        </div>
      </div>

      {/* Location error banner */}
      {locationError && gpsRequired && (
        <div style={{ background:'#FEF3C7', border:'1px solid #FCD34D', borderRadius:'var(--t-r-md)', padding:'0.75rem 1rem', margin:'0.75rem 1rem 0', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem' }}>
          <p style={{ margin:0, fontSize:'0.82rem', color:'#92400E', lineHeight:1.4 }}>⚠️ {locationError}</p>
          <button onClick={retryLocation} style={{ flexShrink:0, padding:'0.4rem 0.85rem', background:'#D97706', color:'white', border:'none', borderRadius:'var(--t-r-pill)', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
            Retry
          </button>
        </div>
      )}

      {/* Discovery grid */}
      <div>
        <div className="discovery-grid">
          {Array.isArray(animalsToRender) && animalsToRender
            .map(animal => ({ ...animal, ...checkAnimalProximity(animal) }))
            .sort((a, b) => {
              if (foundAnimals.has(a.id) && !foundAnimals.has(b.id)) return 1;
              if (!foundAnimals.has(a.id) && foundAnimals.has(b.id)) return -1;
              if (a.distance === null) return 1;
              if (b.distance === null) return -1;
              return a.distance - b.distance;
            })
            .map((animal, index) => {
              const { nearby, distance } = animal;
              const alreadyFound = foundAnimals.has(animal.id);
              const bearing = (!alreadyFound && !nearby && userLocation && distance !== null)
                ? getBearing(userLocation.latitude, userLocation.longitude, animal.latitude, animal.longitude)
                : null;
              return (
                <div key={animal.id}
                  onClick={e => { if (!alreadyFound) discoverAnimal(animal, e); }}
                  className={`animate-fade-in-up discovery-card${alreadyFound ? ' dc-found' : ''}${nearby && !alreadyFound ? ' dc-nearby' : ''}`}
                  style={{ animationDelay:`${index * 0.08}s` }}>
                  <div className="discovery-card-img" style={{ backgroundImage:`url(${animal.image})` }} />
                  <div className="discovery-card-overlay" />
                  {bearing !== null && (
                    <div style={{ position:'absolute', top:'8px', right:'8px', width:'44px', height:'44px', borderRadius:'50%', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1px', zIndex:5, border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" style={{ transform:`rotate(${bearing}deg)`, filter:'drop-shadow(0 0 3px rgba(0,0,0,0.7))' }}>
                        <polygon points="12,2 19,20 12,16 5,20" fill="#FCD34D" />
                      </svg>
                      <div style={{ fontSize:'8px', fontWeight:700, color:'white', letterSpacing:'0.04em', lineHeight:1 }}>{toCardinal(bearing)}</div>
                    </div>
                  )}
                  <div className="discovery-card-body">
                    <h3 className="dc-name">{animal.name}</h3>
                    <p className="dc-scientific">{animal.scientificName}</p>
                    {alreadyFound ? (
                      <div className="dc-pill dc-pill-found">✓ Discovered</div>
                    ) : nearby ? (
                      <div className="dc-pill dc-pill-nearby">▶ Tap to Discover</div>
                    ) : distance !== null ? (
                      <div className="dc-pill dc-pill-dist">⟳ {distance}m away</div>
                    ) : (
                      <div className="dc-pill dc-pill-far">Get closer</div>
                    )}
                  </div>
                  {nearby && !alreadyFound && <div className="dc-nearby-ring" />}
                </div>
              );
            })}
        </div>
      </div>

      <StudentGuide />
      <TutorialOverlay />

      {/* Zoo map modal */}
      {showZooMap && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.82)', display:'flex', flexDirection:'column', animation:'sgSlideUp 0.22s ease' }}>

          <style>{`
            @keyframes pulse-ring {
              0%   { transform: scale(0.8); opacity: 0.8; }
              100% { transform: scale(2.2); opacity: 0; }
            }
            @keyframes marker-nearby-pill {
              0%, 100% { box-shadow: 0 3px 14px rgba(0,0,0,0.55), 0 0 0 0 rgba(251,191,36,0.7); }
              50%       { box-shadow: 0 3px 14px rgba(0,0,0,0.55), 0 0 0 9px rgba(251,191,36,0); }
            }
            @keyframes bar-shimmer {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
            @keyframes glow-pulse {
              0%, 100% { box-shadow: 0 0 0 3px rgba(134,239,172,0.25), 0 0 14px rgba(74,222,128,0.9); }
              50%       { box-shadow: 0 0 0 6px rgba(134,239,172,0.1), 0 0 28px rgba(74,222,128,0.4); }
            }
          `}</style>

          {/* Header */}
          {(() => {
            const pct = animalsToRender.length > 0 ? (foundAnimals.size / animalsToRender.length) * 100 : 0;
            const done = foundAnimals.size === animalsToRender.length && animalsToRender.length > 0;
            return (
              <div style={{ background:'linear-gradient(160deg, #0d2818 0%, #1A5238 55%, #2E7D32 100%)', padding:'0.9rem 1.2rem 0.85rem', flexShrink:0, boxShadow:'0 4px 20px rgba(0,0,0,0.45)' }}>
                {/* Title row */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                  <div>
                    <div style={{ color:'white', fontWeight:800, fontSize:'1.05rem', lineHeight:1.2, letterSpacing:'0.01em' }}>Taronga Zoo Map</div>
                    <div style={{ color: done ? '#4ADE80' : 'rgba(255,255,255,0.6)', fontSize:'0.72rem', marginTop:'0.15rem', fontWeight:600, transition:'color 0.4s' }}>
                      {done ? '🎉 All animals discovered!' : `${foundAnimals.size} of ${animalsToRender.length} animals found`}
                    </div>
                  </div>
                  <button onClick={() => setShowZooMap(false)}
                    style={{ width:'34px', height:'34px', borderRadius:'50%', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.22)', color:'white', fontSize:'0.95rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, flexShrink:0 }}>✕</button>
                </div>

                {/* Progress bar */}
                <div style={{ position:'relative', height:'13px', borderRadius:'999px', background:'rgba(0,0,0,0.45)', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'inset 0 2px 5px rgba(0,0,0,0.4)', overflow:'hidden' }}>
                  {/* Fill */}
                  <div style={{
                    position:'absolute', inset:0, right:`${100 - pct}%`,
                    background: done
                      ? 'linear-gradient(90deg, #15803d, #22C55E, #FFD700)'
                      : 'linear-gradient(90deg, #15803d 0%, #22C55E 70%, #4ADE80 100%)',
                    borderRadius:'999px',
                    transition:'right 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                    overflow:'hidden',
                  }}>
                    {/* Shimmer */}
                    <div style={{
                      position:'absolute', top:0, bottom:0, width:'40%',
                      background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      animation:'bar-shimmer 2s ease-in-out infinite',
                    }} />
                  </div>
                  {/* Glow dot at leading edge */}
                  {pct > 2 && !done && (
                    <div style={{
                      position:'absolute', top:'50%', left:`${pct}%`,
                      transform:'translate(-50%, -50%)',
                      width:'17px', height:'17px', borderRadius:'50%',
                      background:'#86EFAC',
                      border:'2.5px solid white',
                      animation:'glow-pulse 1.6s ease-in-out infinite',
                      zIndex:2,
                    }} />
                  )}
                </div>

                {/* Sub-labels */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.35rem' }}>
                  <span style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.38)', fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>Progress</span>
                  <span style={{ fontSize:'0.65rem', fontWeight:800, color: done ? '#4ADE80' : pct > 0 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)', letterSpacing:'0.02em', transition:'color 0.4s' }}>
                    {done ? 'Complete! ⭐' : pct > 0 ? `${Math.round(pct)}%` : 'Find your first animal!'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Location permission banner */}
          {!locationEnabled && (
            <div style={{ background:'#FEF9C3', borderBottom:'1px solid #FDE047', padding:'0.55rem 1rem', display:'flex', alignItems:'center', gap:'0.6rem', flexShrink:0 }}>
              <span style={{ fontSize:'1rem', flexShrink:0 }}>📍</span>
              <p style={{ margin:0, fontSize:'0.78rem', color:'#713F12', lineHeight:1.3, flex:1 }}>
                Allow location permissions to see where you are on the map
              </p>
              <button onClick={enableLocation} style={{ flexShrink:0, padding:'0.3rem 0.75rem', background:'#CA8A04', color:'white', border:'none', borderRadius:'20px', fontSize:'0.72rem', fontWeight:700, cursor:'pointer' }}>
                Enable
              </button>
            </div>
          )}


          {/* Map with overlaid markers */}
          <div
            ref={outerScrollRef}
            style={{ flex:1, overflow:'auto', WebkitOverflowScrolling:'touch', background:'#0a1a0a', textAlign:'center' }}
          >
            {/* inline-block wrapper = exactly image size → marker % positions are correct */}
            <div
              style={{ position:'relative', display:'inline-block', width:`${Math.round(mapScale * 100)}%`, minWidth:'100%', touchAction:'none', cursor:'grab' }}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src="images/taronga-map.png"
                alt="Taronga Zoo Map"
                style={{ width:'100%', display:'block' }}
                onLoad={() => setMapLoaded(true)}
              />

              {mapLoaded && animalsToRender.map(animal => {
                const pos = ANIMAL_MAP_POSITIONS[animal.id];
                if (!pos) return null;
                const found  = foundAnimals.has(animal.id);
                const { nearby } = checkAnimalProximity(animal);

                const pillBg     = found ? 'linear-gradient(135deg,#166534,#15803d)' : nearby ? 'linear-gradient(135deg,#78350F,#92400E)' : 'linear-gradient(135deg,#1a2e1a,#1e3a1e)';
                const borderCol  = found ? '#22C55E' : nearby ? '#FBBF24' : 'rgba(255,255,255,0.25)';
                const labelColor = found ? '#86EFAC' : nearby ? '#FDE68A' : 'rgba(255,255,255,0.88)';
                const thumbFilter = found || nearby ? 'none' : 'grayscale(0.45)';

                return (
                  <div key={animal.id}
                    style={{ position:'absolute', left:`${pos.x}%`, top:`${pos.y}%`, transform:'translate(-50%,-100%)', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center' }}>
                    {/* Pill badge */}
                    <div style={{
                      display:'flex', alignItems:'center', gap:'6px',
                      background: pillBg,
                      border:`2px solid ${borderCol}`,
                      borderRadius:'999px',
                      padding:'4px 10px 4px 4px',
                      boxShadow:'0 4px 16px rgba(0,0,0,0.6)',
                      animation: nearby && !found ? 'marker-nearby-pill 1.8s ease-in-out infinite' : 'none',
                    }}>
                      {/* Thumbnail */}
                      <div style={{
                        width:'34px', height:'34px', borderRadius:'50%',
                        backgroundImage:`url(${animal.image})`,
                        backgroundSize:'cover', backgroundPosition:'center',
                        flexShrink:0,
                        border:`1.5px solid ${borderCol}`,
                        filter: thumbFilter,
                        position:'relative',
                      }}>
                        {found && (
                          <div style={{ position:'absolute', bottom:'-2px', right:'-2px', width:'14px', height:'14px', borderRadius:'50%', background:'#22C55E', border:'2px solid #166534', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'7px', color:'white', fontWeight:900, lineHeight:1 }}>✓</div>
                        )}
                      </div>
                      {/* Label */}
                      <div>
                        <div style={{ fontSize:'0.66rem', fontWeight:800, color: labelColor, lineHeight:1.2, whiteSpace:'nowrap' }}>
                          {pos.label}
                        </div>
                        {nearby && !found && (
                          <div style={{ fontSize:'0.56rem', fontWeight:700, color:'#FCD34D', lineHeight:1.1 }}>Tap to unlock!</div>
                        )}
                        {found && (
                          <div style={{ fontSize:'0.56rem', fontWeight:700, color:'#4ADE80', lineHeight:1.1 }}>Discovered</div>
                        )}
                      </div>
                    </div>
                    {/* Pointer tail */}
                    <div style={{ width:0, height:0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:`8px solid ${borderCol}` }} />
                  </div>
                );
              })}

              {/* Student location dot */}
              {mapLoaded && locationEnabled && userLocation && (() => {
                const x = (MAP_BOUNDS.east - userLocation.longitude) / (MAP_BOUNDS.east - MAP_BOUNDS.west) * 100;
                const y = (userLocation.latitude - MAP_BOUNDS.south) / (MAP_BOUNDS.north - MAP_BOUNDS.south) * 100 * MAP_CONTENT_HEIGHT;
                if (x < 0 || x > 100 || y < 0 || y > MAP_CONTENT_HEIGHT * 100) return null;
                return (
                  <div style={{ position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)', zIndex:10 }}>
                    <div style={{ position:'absolute', inset:'-8px', borderRadius:'50%', border:'2px solid rgba(59,130,246,0.45)', animation:'pulse-ring 1.8s ease-out infinite' }} />
                    <div style={{ width:'14px', height:'14px', borderRadius:'50%', background:'#3B82F6', border:'2.5px solid white', boxShadow:'0 2px 8px rgba(59,130,246,0.6)', position:'relative' }} />
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Bottom legend bar */}
          <div style={{ background:'rgba(15,15,15,0.9)', backdropFilter:'blur(10px)', padding:'0.55rem 1rem', display:'flex', alignItems:'center', gap:'0.85rem', flexShrink:0, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
              {[
                { color:'#22C55E', label:'Found' },
                { color:'#FBBF24', label:'Nearby' },
                { color:'white',   label:'Not yet' },
                ...(locationEnabled && userLocation ? [{ color:'#3B82F6', label:'You' }] : []),
              ].map(item => (
                <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <div style={{ width:'9px', height:'9px', borderRadius:'50%', background:item.color, flexShrink:0 }} />
                  <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.72rem', fontWeight:600 }}>{item.label}</span>
                </div>
              ))}
              {/* Zoom controls */}
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'4px' }}>
                <button
                  onClick={() => setMapScale(s => clampScale(s / 1.3))}
                  style={{ width:'28px', height:'28px', borderRadius:'6px', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'white', fontSize:'1rem', fontWeight:700, cursor:'pointer', lineHeight:1, flexShrink:0 }}>−</button>
                <span style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.65rem', fontWeight:700, minWidth:'2.6rem', textAlign:'center' }}>
                  {Math.round(mapScale * 100)}%
                </span>
                <button
                  onClick={() => setMapScale(s => clampScale(s * 1.3))}
                  style={{ width:'28px', height:'28px', borderRadius:'6px', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'white', fontSize:'1rem', fontWeight:700, cursor:'pointer', lineHeight:1, flexShrink:0 }}>+</button>
                {mapScale !== 1 && (
                  <button
                    onClick={() => setMapScale(1)}
                    title="Reset zoom"
                    style={{ width:'28px', height:'28px', borderRadius:'6px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.6)', fontSize:'0.7rem', cursor:'pointer', lineHeight:1, flexShrink:0 }}>↺</button>
                )}
              </div>
            </div>

        </div>
      )}
    </div>
  );
}
