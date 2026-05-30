import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import { calculateAnimalPoints } from '../utils/helpers';

function Badge({ label, color = 'var(--t-mid)' }) {
  return (
    <span style={{ display:'inline-block', background:`${color}18`, border:`1px solid ${color}55`, color, borderRadius:999, padding:'0.2rem 0.6rem', fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>
      {label}
    </span>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background:'var(--t-foam)', borderRadius:'var(--t-r-md)', padding:'1rem', border:'1px solid var(--t-mist)', textAlign:'center' }}>
      <div style={{ fontWeight:800, fontSize:'1.6rem', color:'var(--t-mid)', lineHeight:1.1 }}>{value}</div>
      <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--t-slate)', marginTop:'0.2rem' }}>{label}</div>
      {sub && <div style={{ fontSize:'0.7rem', color:'var(--t-ash)', marginTop:'0.15rem' }}>{sub}</div>}
    </div>
  );
}

export default function AdminClassViewScreen() {
  const { setCurrentScreen, selectedAdminClass } = useApp();

  const [cls,      setCls]      = useState(null);
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [sort,     setSort]     = useState('name'); // name|points|badges|quiz|status

  // Load class doc + students
  useEffect(() => {
    if (!selectedAdminClass) { setCurrentScreen('adminDashboard'); return; }
    let cancelled = false;
    (async () => {
      try {
        const [clsSnap, studentsSnap] = await Promise.all([
          getDoc(doc(db, 'classes', selectedAdminClass)),
          getDocs(collection(db, 'classes', selectedAdminClass, 'students')),
        ]);
        if (cancelled) return;
        if (clsSnap.exists()) setCls({ id: clsSnap.id, ...clsSnap.data() });
        setStudents(studentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error('AdminClassView fetch:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedAdminClass, setCurrentScreen]);

  const sorted = [...students].sort((a, b) => {
    if (sort === 'points') return (b.totalPoints || 0) - (a.totalPoints || 0);
    if (sort === 'badges') return (b.badges?.length || 0) - (a.badges?.length || 0);
    if (sort === 'quiz') return (b.quizPercentage || 0) - (a.quizPercentage || 0);
    if (sort === 'status') return (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
    return (a.name || a.id).localeCompare(b.name || b.id);
  });

  const downloadCSV = () => {
    const rows = [['Name','Points','Badges','Quiz %','Completed','Observations']];
    students.forEach(s => {
      const obsText = (s.badges||[]).filter(b=>b.observation).map(b=>`${b.animal}: ${b.observation}`).join(' | ');
      rows.push([s.name||s.id, s.totalPoints||0, s.badges?.length||0, s.quizPercentage||' - ', s.completed?'Yes':'No', `"${obsText.replace(/"/g,'""')}"`]);
    });
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${selectedAdminClass}-students.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // Aggregates
  const completedCount = students.filter(s => s.completed).length;
  const avgPoints      = students.length ? Math.round(students.reduce((s,st)=>s+(st.totalPoints||0),0)/students.length) : 0;
  const totalBadges    = students.reduce((s,st)=>s+(st.badges?.length||0),0);
  const completedStuds = students.filter(s => s.completed);
  const avgQuiz        = completedStuds.length ? Math.round(completedStuds.reduce((s,st)=>s+(st.quizPercentage||0),0)/completedStuds.length) : 0;
  const allObs         = students.flatMap(s => (s.badges||[]).filter(b=>b.observationScore));
  const avgB           = allObs.length ? (allObs.reduce((s,b)=>s+(b.observationScore.behaviour||0),0)/allObs.length).toFixed(1) : ' - ';
  const avgD           = allObs.length ? (allObs.reduce((s,b)=>s+(b.observationScore.detail||0),0)/allObs.length).toFixed(1) : ' - ';
  const avgW           = allObs.length ? (allObs.reduce((s,b)=>s+(b.observationScore.writing||0),0)/allObs.length).toFixed(1) : ' - ';

  const isZZ = cls?.sessionType === 'zoosnooz';

  // ── Styles ────────────────────────────────────────────────────────────────
  const headerStyle  = { background:'var(--t-deep)', color:'white', padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', flexShrink:0 };
  const thStyle      = { padding:'0.6rem 0.75rem', textAlign:'left', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--t-slate)', borderBottom:'2px solid var(--t-mist)', cursor:'pointer', userSelect:'none', whiteSpace:'nowrap' };
  const tdStyle      = { padding:'0.65rem 0.75rem', fontSize:'0.83rem', color:'var(--t-deep)', borderBottom:'1px solid var(--t-mist)', verticalAlign:'middle' };

  if (loading) return (
    <div style={{ position:'fixed', inset:0, background:'var(--t-foam)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', color:'var(--t-slate)' }}>
        <div style={{ width:40, height:40, border:'3px solid var(--t-mist)', borderTop:'3px solid var(--t-mid)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 0.75rem' }} />
        Loading class data…
      </div>
    </div>
  );

  return (
    <div style={{ position:'fixed', inset:0, background:'var(--t-foam)', display:'flex', flexDirection:'column', fontFamily:'var(--t-font)' }}>

      {/* Header */}
      <div style={headerStyle}>
        <button onClick={() => setCurrentScreen('adminDashboard')} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.82rem', fontWeight:600, flexShrink:0 }}>
          ← Admin
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:'1.05rem', letterSpacing:'0.04em' }}>{cls?.className || selectedAdminClass}</div>
          <div style={{ fontSize:'0.75rem', opacity:0.7, marginTop:'0.1rem' }}>
            {[cls?.schoolName, cls?.teacherEmail, `Stage ${cls?.stage||'?'}`].filter(Boolean).join(' · ')}
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
          {isZZ && <Badge label="ZooSnooz" color="#4ADE80" />}
          <Badge label={selectedAdminClass} color="rgba(255,255,255,0.6)" />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        {/* KPI row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))', gap:'0.75rem' }}>
          <StatCard label="Students"   value={students.length} />
          <StatCard label="Completed"  value={completedCount} sub={`${students.length ? Math.round(completedCount/students.length*100) : 0}%`} />
          <StatCard label="Avg Points" value={avgPoints} />
          <StatCard label="Badges"     value={totalBadges} />
          <StatCard label="Avg Quiz"   value={completedStuds.length ? `${avgQuiz}%` : ' - '} />
          <StatCard label="Obs B·D·W"  value={`${avgB}·${avgD}·${avgW}`} />
        </div>

        {/* Student table */}
        <div style={{ background:'white', borderRadius:'var(--t-r-lg)', border:'1px solid var(--t-mist)', overflow:'hidden' }}>
          <div style={{ padding:'0.85rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--t-mist)' }}>
            <div style={{ fontWeight:700, color:'var(--t-deep)', fontSize:'0.9rem' }}>Students ({students.length})</div>
            <button onClick={downloadCSV} style={{ background:'none', border:'1px solid var(--t-stone)', color:'var(--t-slate)', padding:'0.35rem 0.85rem', borderRadius:'var(--t-r-sm)', fontSize:'0.75rem', fontWeight:600, cursor:'pointer' }}>
              ↓ CSV
            </button>
          </div>

          {students.length === 0 ? (
            <div style={{ padding:'3rem', textAlign:'center', color:'var(--t-ash)', fontSize:'0.9rem' }}>No students have joined this class yet.</div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                <thead>
                  <tr>
                    {[['Name','name'],['Points','points'],['Badges','badges'],['Quiz','quiz'],['Status','status']].map(([lbl,key]) => (
                      <th key={key} style={{ ...thStyle, color: sort === key ? 'var(--t-mid)' : 'var(--t-slate)' }} onClick={() => setSort(key)}>
                        {lbl}{sort === key ? ' ↓' : ''}
                      </th>
                    ))}
                    <th style={thStyle}>Obs B·D·W</th>
                    <th style={thStyle}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(s => {
                    const isExpanded = expanded === s.id;
                    const allObs = (s.badges||[]).filter(b=>b.observationScore);
                    const sAvgB = allObs.length ? (allObs.reduce((t,b)=>t+(b.observationScore.behaviour||0),0)/allObs.length).toFixed(1) : ' - ';
                    const sAvgD = allObs.length ? (allObs.reduce((t,b)=>t+(b.observationScore.detail||0),0)/allObs.length).toFixed(1) : ' - ';
                    const sAvgW = allObs.length ? (allObs.reduce((t,b)=>t+(b.observationScore.writing||0),0)/allObs.length).toFixed(1) : ' - ';
                    return (
                      <>
                        <tr key={s.id} onClick={() => setExpanded(isExpanded ? null : s.id)} style={{ cursor:'pointer', background: isExpanded ? 'var(--t-foam)' : 'white', transition:'background 0.15s' }}>
                          <td style={tdStyle}>
                            <div style={{ fontWeight:600 }}>{s.name || s.id}</div>
                            {s.name !== s.id && <div style={{ fontSize:'0.68rem', color:'var(--t-ash)', fontFamily:'monospace' }}>{s.id}</div>}
                          </td>
                          <td style={{ ...tdStyle, fontWeight:700, color:'var(--sunset-orange)' }}>{s.totalPoints || 0}</td>
                          <td style={tdStyle}>{s.badges?.length || 0}</td>
                          <td style={tdStyle}>{s.quizPercentage != null ? `${s.quizPercentage}%` : ' - '}</td>
                          <td style={tdStyle}>
                            <span style={{ display:'inline-block', padding:'0.2rem 0.6rem', borderRadius:999, fontSize:'0.7rem', fontWeight:700, background: s.completed ? '#D1FAE5' : '#F3F4F6', color: s.completed ? '#065F46' : '#6B7280' }}>
                              {s.completed ? '✓ Done' : 'In progress'}
                            </span>
                          </td>
                          <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:'0.78rem' }}>{sAvgB}·{sAvgD}·{sAvgW}</td>
                          <td style={{ ...tdStyle, fontSize:'0.72rem', color:'var(--t-ash)' }}>
                            {isExpanded ? '▲ collapse' : '▼ expand'}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${s.id}-exp`}>
                            <td colSpan={7} style={{ padding:'0 0 0 1rem', background:'var(--t-foam)', borderBottom:'2px solid var(--t-mist)' }}>
                              <div style={{ padding:'0.85rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                                {/* Badge observations */}
                                {(s.badges||[]).map((b, i) => {
                                  const o = b.observationScore || {};
                                  const pts = calculateAnimalPoints(b);
                                  return (
                                    <div key={i} style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'0.75rem', border:'1px solid var(--t-mist)' }}>
                                      <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
                                        <div style={{ width:36, height:36, borderRadius:'var(--t-r-sm)', backgroundImage:`url(images/badge-${b.animalId}.png)`, backgroundSize:'cover', backgroundPosition:'center', flexShrink:0 }} />
                                        <div style={{ flex:1, minWidth:0 }}>
                                          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
                                            <span style={{ fontWeight:700, fontSize:'0.83rem', color:'var(--t-deep)' }}>{b.animal}</span>
                                            <span style={{ fontSize:'0.7rem', color:'var(--sunset-orange)', fontWeight:700 }}>+{pts} pts</span>
                                            <span style={{ fontSize:'0.68rem', color:'var(--t-slate)', fontFamily:'monospace' }}>B{o.behaviour||0}·D{o.detail||0}·W{o.writing||0}</span>
                                          </div>
                                          {b.observation && (
                                            <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-slate)', lineHeight:1.55, fontStyle:'italic' }}>"{b.observation}"</p>
                                          )}
                                          {(b.quizResults||[]).map((qr, qi) => (
                                            <div key={qi} style={{ display:'flex', gap:'0.3rem', alignItems:'center', marginTop:'0.3rem' }}>
                                              <span style={{ fontSize:'0.65rem', color: qr.correctOnFirstAttempt ? '#059669' : '#DC2626', fontWeight:700 }}>
                                                {qr.correctOnFirstAttempt ? '✓' : '✗'}
                                              </span>
                                              <span style={{ fontSize:'0.68rem', color:'var(--t-ash)' }}>{qr.question || 'Quiz question'}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                                {(!s.badges || s.badges.length === 0) && (
                                  <p style={{ fontSize:'0.8rem', color:'var(--t-ash)', margin:0, fontStyle:'italic' }}>No badges earned yet.</p>
                                )}
                                {/* Conservation statement */}
                                {s.conservationStatement && (
                                  <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-sm)', padding:'0.6rem 0.85rem' }}>
                                    <div style={{ fontSize:'0.65rem', fontWeight:700, color:'#166534', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.2rem' }}>Conservation Statement</div>
                                    <p style={{ margin:0, fontSize:'0.78rem', color:'#166534', lineHeight:1.55 }}>"{s.conservationStatement}"</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
