import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { getBearing, getDistance } from '../utils/helpers';

export default function MapScreen() {
  const { setCurrentScreen, studentName, classCode } = useApp();
  const {
    animalsToRender, foundAnimals, totalPoints, badges,
    userLocation, locationEnabled, gpsRequired, checkAnimalProximity, enableLocation,
    activityCompleted, isSubmittingActivity,
    discoverAnimal, completeActivity,
    studentStatus, statusLoaded,
    showZooMap, setShowZooMap,
    conservationStatement, setConservationStatement,
    showConservationScreen, setShowConservationScreen,
    completionCardDismissed, setCompletionCardDismissed,
  } = useStudent();

  useEffect(() => {
    if (gpsRequired) enableLocation();
  }, [gpsRequired]);

  // Session already submitted — show completion card
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

          <button onClick={() => setShowZooMap(true)}
            style={{ padding:'6px 12px', background:'#2E7D32', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', marginLeft:'10px', fontSize:'0.82rem', fontWeight:600 }}>
            Zoo Map
          </button>

          <button className="student-points-chip" onClick={() => setCurrentScreen('collection')}>
            <div className="pts-value">{totalPoints}</div>
            <div className="pts-label">{foundAnimals.size}/{animalsToRender.length} Badges</div>
          </button>
        </div>
      </div>

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
              return (
                <div key={animal.id}
                  onClick={e => { if (!alreadyFound) discoverAnimal(animal, e); }}
                  className={`animate-fade-in-up discovery-card${alreadyFound ? ' dc-found' : ''}${nearby && !alreadyFound ? ' dc-nearby' : ''}`}
                  style={{ animationDelay:`${index * 0.08}s` }}>
                  <div className="discovery-card-img" style={{ backgroundImage:`url(${animal.image})` }} />
                  <div className="discovery-card-overlay" />
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

      {/* Zoo map modal */}
      {showZooMap && (
        <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div style={{ background:'#fff', padding:'20px', borderRadius:'var(--t-r-sm)', maxWidth:'90%', maxHeight:'90%', textAlign:'center' }}>
            <div style={{ overflow:'auto', maxHeight:'70vh' }}>
              <img src="images/taronga-map.png" style={{ width:'100%' }} alt="Zoo Map" />
            </div>
            <div style={{ marginTop:'15px' }}>
              <button onClick={() => setShowZooMap(false)}
                style={{ padding:'8px 16px', background:'#444', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer' }}>
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
