import { useState, useEffect, useMemo } from 'react';
import {
  collection, doc, getDoc, getDocs, updateDoc, setDoc, deleteDoc, query, where,
  orderBy, limit, writeBatch, serverTimestamp, deleteField,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { useApp } from '../context/AppContext';
import { ZOOSNOOZ_ANIMALS } from '../data/zoosnoozAnimals';

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let c = '';
  for (let i = 0; i < 6; i++) c += chars.charAt(Math.floor(Math.random() * chars.length));
  return c;
}

// ─── Tab: Analytics ──────────────────────────────────────────────────────────
const GREEN = '#2E7D55';
const AXES_DEG = [270, 30, 150];

const LOCATION_LABELS = { 'taronga-sydney':'Taronga Sydney', 'zoosnooz-sydney':'ZooSnooz · Sydney', 'dubbo':'Taronga Dubbo', 'school':'Your School' };
const SUBJECT_LABELS  = { science:'Science', maths:'Mathematics', english:'English', geography:'Geography', pdhpe:'PDHPE' };

function AnalyticsTab({ classes }) {
  const [view,           setView]           = useState('total');   // total | daily | zoosnooz | dubbo | school
  const [timeFilter,     setTimeFilter]     = useState('all');     // all | today | week | month
  const [subjectFilter,  setSubjectFilter]  = useState('all');     // all | science | maths | english | geography
  const [students,       setStudents]       = useState(null);
  const [fetching,       setFetching]       = useState(false);
  const [schoolExpanded, setSchoolExpanded] = useState(false);

  // Fetch all student docs once
  useEffect(() => {
    if (!classes.length) return;
    let cancelled = false;
    (async () => {
      setFetching(true);
      const all = [];
      for (const cls of classes) {
        try {
          const snap = await getDocs(collection(db, 'classes', cls.classCode, 'students'));
          snap.docs.forEach(d => all.push({
            ...d.data(),
            _classCode: cls.classCode, _className: cls.className,
            _schoolName: cls.schoolName, _sessionType: cls.sessionType,
            _location: cls.location || null, _subject: cls.subject || null,
          }));
        } catch {}
      }
      if (!cancelled) { setStudents(all); setFetching(false); }
    })();
    return () => { cancelled = true; };
  }, [classes]);

  const viewClasses = useMemo(() => {
    let c = classes;
    if (view === 'daily')    c = c.filter(x => x.sessionType !== 'zoosnooz' && x.location !== 'dubbo' && x.location !== 'school');
    else if (view === 'zoosnooz') c = c.filter(x => x.sessionType === 'zoosnooz' || x.location === 'zoosnooz-sydney');
    else if (view === 'dubbo')   c = c.filter(x => x.location === 'dubbo');
    else if (view === 'school')  c = c.filter(x => x.location === 'school');
    if (subjectFilter !== 'all') c = c.filter(x => x.subject === subjectFilter);
    return c;
  }, [classes, view, subjectFilter]);

  const viewStudents = useMemo(() => {
    if (!students) return [];
    let s = students;
    if (view === 'daily')    s = s.filter(st => st._sessionType !== 'zoosnooz' && st._location !== 'dubbo' && st._location !== 'school');
    else if (view === 'zoosnooz') s = s.filter(st => st._sessionType === 'zoosnooz' || st._location === 'zoosnooz-sydney');
    else if (view === 'dubbo')   s = s.filter(st => st._location === 'dubbo');
    else if (view === 'school')  s = s.filter(st => st._location === 'school');
    if (subjectFilter !== 'all') s = s.filter(st => st._subject === subjectFilter);
    if (timeFilter !== 'all') {
      const cutoff = new Date();
      if (timeFilter === 'today')  cutoff.setHours(0, 0, 0, 0);
      else if (timeFilter === 'week')  cutoff.setDate(cutoff.getDate() - 7);
      else if (timeFilter === 'month') cutoff.setDate(cutoff.getDate() - 30);
      s = s.filter(st => {
        const d = st.completedAt?.toDate?.() ?? (st.completedAt ? new Date(st.completedAt) : null);
        return d && d >= cutoff;
      });
    }
    return s;
  }, [students, view, subjectFilter, timeFilter]);

  const kpi = useMemo(() => {
    const total     = viewClasses.length;
    const students  = viewClasses.reduce((s, c) => s + c.studentCount, 0);
    const completed = viewClasses.reduce((s, c) => s + c.completedCount, 0);
    const badges    = viewClasses.reduce((s, c) => s + (c.totalBadges || 0), 0);
    let wQSum = 0, wQCount = 0;
    viewClasses.forEach(c => { if (c.quizAverage != null && c.completedCount > 0) { wQSum += c.quizAverage * c.completedCount; wQCount += c.completedCount; } });
    const zzCount = viewClasses.filter(c => c.sessionType === 'zoosnooz').length;
    return { total, students, completed, badges, avgQuiz: wQCount > 0 ? Math.round(wQSum / wQCount) : null, zzCount };
  }, [viewClasses]);

  const animalVisits = useMemo(() => {
    const counts = {};
    viewStudents.forEach(st => {
      const isZz = st._sessionType === 'zoosnooz' || !!(st.zzBadges?.length || st.zoosnooz);
      if (isZz) {
        ZOOSNOOZ_ANIMALS.forEach(a => {
          if (st.zoosnooz?.[a.id]?.completed) counts[a.name] = (counts[a.name] || 0) + 1;
        });
      } else {
        (st.badges || []).forEach(b => { const nm = b.animal || b.animalId || 'Unknown'; counts[nm] = (counts[nm] || 0) + 1; });
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15);
  }, [viewStudents]);

  const quizBuckets = useMemo(() => {
    const b = [0, 0, 0, 0];
    viewStudents.forEach(st => {
      let p = null;
      if (st._sessionType === 'zoosnooz' && st.zoosnooz) {
        const attempted = ZOOSNOOZ_ANIMALS.filter(a => st.zoosnooz[a.id]?.quizCorrect !== undefined);
        if (attempted.length > 0) {
          const correct = attempted.filter(a => st.zoosnooz[a.id].quizCorrect === true).length;
          p = Math.round((correct / attempted.length) * 100);
        }
      } else {
        p = st.quizPercent ?? st.quizPercentage ?? null;
      }
      if (p == null) return;
      if (p <= 25) b[0]++; else if (p <= 50) b[1]++; else if (p <= 75) b[2]++; else b[3]++;
    });
    return b;
  }, [viewStudents]);

  const obsAvgs = useMemo(() => {
    let bS = 0, dS = 0, wS = 0, n = 0;
    const add = (o) => { if (!o) return; bS += o.behaviour||0; dS += o.detail||0; wS += o.writing||0; n++; };
    viewStudents.forEach(st => {
      const isZz = st._sessionType === 'zoosnooz' || !!(st.zzBadges?.length || st.zoosnooz);
      if (isZz) {
        if (st.zzBadges?.length) {
          // Completed session - zzBadges array written on submit
          st.zzBadges.forEach(b => add(b.observationScore));
        } else if (st.zoosnooz) {
          // Mid-session or per-badge writes - scores stored under zoosnooz[animalId]
          ZOOSNOOZ_ANIMALS.forEach(a => add(st.zoosnooz[a.id]?.observationScore));
        }
      } else {
        (st.badges || []).forEach(b => add(b.observationScore));
      }
    });
    if (!n) return null;
    return {
      behaviour: Math.min(100, Math.round(bS / n * 20)),
      detail:    Math.min(100, Math.round(dS / n * 20)),
      writing:   Math.min(100, Math.round(wS / n * 20)),
    };
  }, [viewStudents]);

  const hardestQuestions = useMemo(() => {
    const qMap = {};
    viewStudents.forEach(st => {
      (st.badges || []).forEach(b => {
        const q = b.quizQuestion || b.question || null; if (!q) return;
        const key = `${b.animalId}||${q}`;
        if (!qMap[key]) qMap[key] = { animal: b.animal || b.animalId || '', question: q, attempts: 0, firstCorrect: 0 };
        qMap[key].attempts++;
        if (b.quizFirstAttempt === true) qMap[key].firstCorrect++;
      });
    });
    return Object.values(qMap)
      .filter(q => q.attempts > 0)
      .map(q => ({ ...q, successRate: Math.round((q.firstCorrect / q.attempts) * 100) }))
      .sort((a, b) => a.successRate - b.successRate)
      .slice(0, 5);
  }, [viewStudents]);

  const schoolPerf = useMemo(() => {
    const schools = {};
    viewClasses.forEach(cls => {
      const s = cls.schoolName || 'Unknown';
      if (!schools[s]) schools[s] = { name: s, classes: 0, students: 0, quizSum: 0, quizCount: 0, obsSum: 0, obsCount: 0 };
      schools[s].classes++;
      schools[s].students += cls.studentCount;
      if (cls.quizAverage != null && cls.completedCount > 0) { schools[s].quizSum += cls.quizAverage * cls.completedCount; schools[s].quizCount += cls.completedCount; }
    });
    viewStudents.forEach(st => {
      const s = st._schoolName || 'Unknown';
      if (!schools[s]) return;
      const addObs = (o) => { if (!o) return; schools[s].obsSum += ((o.behaviour||0)+(o.detail||0)+(o.writing||0))/15*100; schools[s].obsCount++; };
      const isZz = st._sessionType === 'zoosnooz' || !!(st.zzBadges?.length || st.zoosnooz);
      if (isZz) {
        if (st.zzBadges?.length) st.zzBadges.forEach(b => addObs(b.observationScore));
        else if (st.zoosnooz) ZOOSNOOZ_ANIMALS.forEach(a => addObs(st.zoosnooz[a.id]?.observationScore));
      } else {
        (st.badges || []).forEach(b => addObs(b.observationScore));
      }
    });
    return Object.values(schools).map(s => ({
      ...s,
      quizAvg: s.quizCount > 0 ? Math.round(s.quizSum / s.quizCount) : null,
      obsAvg:  s.obsCount  > 0 ? Math.round(s.obsSum  / s.obsCount)  : null,
    })).sort((a, b) => (b.quizAvg ?? -1) - (a.quizAvg ?? -1));
  }, [viewClasses, viewStudents]);

  const conStatements = useMemo(() => {
    return viewStudents
      .filter(st => st.conservationStatement)
      .map(st => {
        const ts = st.completedAt?.toDate?.() ?? (st.completedAt ? new Date(st.completedAt) : null);
        return { name: st.name || 'Student', classCode: st._classCode, statement: st.conservationStatement, ts };
      })
      .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
      .slice(0, 25);
  }, [viewStudents]);

  const byStage = useMemo(() => {
    const map = {};
    viewClasses.forEach(c => {
      const s = c.stage ?? 'Unknown';
      if (!map[s]) map[s] = { count: 0, students: 0, quizSum: 0, quizCount: 0 };
      map[s].count++; map[s].students += c.studentCount || 0;
      if (c.quizAverage != null && c.completedCount > 0) { map[s].quizSum += c.quizAverage * c.completedCount; map[s].quizCount += c.completedCount; }
    });
    return map;
  }, [viewClasses]);

  const exportCSV = () => {
    const rows = [['Student Name','Class','School','Session Type','Quiz %','Badges','Completed']];
    viewStudents.forEach(st => rows.push([
      st.name || '', st._className || st._classCode || '', st._schoolName || '',
      st._sessionType || '', st.quizPercent ?? st.quizPercentage ?? '',
      (st.badges || []).length, st.completed ? 'Yes' : 'No',
    ]));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href:url, download:`taronga-analytics-${view}-${timeFilter}.csv` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  // Radar chart helpers
  const CX = 200, CY = 155, R = 100;
  const radarPt = (val, deg) => { const rad = deg * Math.PI / 180; const v = val / 100; return [CX + R*v*Math.cos(rad), CY + R*v*Math.sin(rad)]; };
  const gridPts = (level) => AXES_DEG.map(deg => { const rad = deg * Math.PI / 180; return `${CX + R*level*Math.cos(rad)},${CY + R*level*Math.sin(rad)}`; }).join(' ');
  const radarPts = obsAvgs ? AXES_DEG.map((deg, i) => radarPt([obsAvgs.behaviour, obsAvgs.detail, obsAvgs.writing][i], deg)) : null;

  if (!classes.length) return <div style={{ padding:'3rem', textAlign:'center', color:'var(--t-ash)' }}>No data yet.</div>;

  const totalStudentsAll = viewClasses.reduce((s, c) => s + c.studentCount, 0);
  const maxVisit  = animalVisits[0]?.[1] || 1;
  const maxBucket = Math.max(...quizBuckets, 1);
  const viewLabel = { total:'Total', daily:'Daily', zoosnooz:'ZooSnooz', dubbo:'Taronga Dubbo', school:'Your School' }[view] || 'Total';

  return (
    <div style={{ display:'flex', gap:'1.5rem', alignItems:'flex-start' }}>

      {/* VIEW sidebar */}
      <div style={{ width:155, flexShrink:0, background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1rem', border:'1px solid var(--t-stone)' }}>
        <div style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.6rem' }}>VIEW</div>
        {[['total','Total'],['daily','Daily'],['zoosnooz','🌙 ZooSnooz'],['dubbo','Taronga Dubbo'],['school','Your School']].map(([val,label]) => (
          <button key={val} onClick={() => setView(val)}
            style={{ display:'block', width:'100%', textAlign:'left', padding:'0.5rem 0.75rem', marginBottom:'0.2rem', borderRadius:'var(--t-r-sm)', border:'none', background: view===val ? GREEN : 'transparent', color: view===val ? 'white' : 'var(--t-slate)', fontWeight: view===val ? 700 : 500, cursor:'pointer', fontSize:'0.82rem', fontFamily:'inherit' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'1.5rem', minWidth:0 }}>

        {/* Header row */}
        <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:'0.75rem' }}>
          <h2 style={{ fontSize:'1.15rem', fontWeight:700, margin:0, color:'var(--t-deep)' }}>
            {viewLabel} Analytics
            <span style={{ background:'var(--t-foam)', border:'1px solid var(--t-mist)', borderRadius:999, fontSize:'0.65rem', fontWeight:600, padding:'0.15rem 0.6rem', marginLeft:'0.6rem', color:'var(--t-slate)', verticalAlign:'middle' }}>
              {{ total:'All Sessions', daily:'Standard Sessions', zoosnooz:'Night Sessions', dubbo:'Dubbo (Coming Soon)', school:'School (Coming Soon)' }[view] || 'All Sessions'}
            </span>
          </h2>
          <div style={{ flex:1 }} />
          <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
            style={{ padding:'0.45rem 0.75rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.82rem', fontFamily:'inherit', background:'white', color:'var(--t-deep)', cursor:'pointer' }}>
            <option value="all">All Subjects</option>
            <option value="science">Science</option>
            <option value="maths">Mathematics</option>
            <option value="english">English</option>
            <option value="geography">Geography</option>
            <option value="pdhpe">PDHPE</option>
            <option value="ngara-nura">Ngara Nura</option>
          </select>
          <select value={timeFilter} onChange={e => setTimeFilter(e.target.value)}
            style={{ padding:'0.45rem 0.75rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.82rem', fontFamily:'inherit', background:'white', color:'var(--t-deep)', cursor:'pointer' }}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button onClick={exportCSV}
            style={{ background:GREEN, color:'white', border:'none', padding:'0.5rem 1.1rem', borderRadius:'var(--t-r-sm)', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>
            Export Analytics CSV
          </button>
        </div>

        {/* KPI cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))', gap:'0.65rem' }}>
          {[
            ['Classes',    kpi.total,     null],
            ['Students',   kpi.students,  null],
            ['Submitted',  kpi.completed, `${kpi.students?Math.round(kpi.completed/kpi.students*100):0}% completion`],
            ['Badges',     kpi.badges,    null],
            ['Avg Quiz',   kpi.avgQuiz!=null?`${kpi.avgQuiz}%`:' - ', null],
            ['ZooSnooz',   kpi.zzCount,   `${viewClasses.length?Math.round(kpi.zzCount/viewClasses.length*100):0}% of classes`],
          ].map(([label, value, sub]) => (
            <div key={label} style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1rem', border:'1px solid var(--t-stone)', textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'var(--t-deep)', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'0.2rem' }}>{label}</div>
              {sub && <div style={{ fontSize:'0.65rem', color:'var(--t-slate)', marginTop:'0.1rem' }}>{sub}</div>}
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {fetching && (
          <div style={{ textAlign:'center', padding:'2rem', color:'var(--t-slate)' }}>
            <div style={{ width:32, height:32, border:'3px solid var(--t-mist)', borderTop:`3px solid ${GREEN}`, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 0.75rem' }} />
            Loading detailed analytics…
          </div>
        )}

        {students && (<>

          {/* Most Visited Animals */}
          {animalVisits.length > 0 && (
            <div style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'1.25rem' }}>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 1rem' }}>Most Visited Animals</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                {animalVisits.map(([name, count]) => (
                  <div key={name} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <div style={{ width:160, fontSize:'0.78rem', color:'var(--t-deep)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flexShrink:0 }}>{name}</div>
                    <div style={{ flex:1, height:20, background:'var(--t-foam)', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(count/maxVisit)*100}%`, background:GREEN, borderRadius:4 }} />
                    </div>
                    <div style={{ width:28, fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', textAlign:'right', flexShrink:0 }}>{count}</div>
                  </div>
                ))}
              </div>
              <p style={{ color:'var(--t-ash)', fontSize:'0.72rem', margin:'0.75rem 0 0', textAlign:'center', fontStyle:'italic' }}>
                Animal visit data will be calculated from student badge submissions once data is available.
              </p>
            </div>
          )}

          {/* Quiz Mastery Distribution */}
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'1.25rem' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 1rem' }}>Quiz Mastery Distribution</h3>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'0.75rem', height:140, padding:'0 0.5rem' }}>
              {[['0–25%', quizBuckets[0]],['26–50%', quizBuckets[1]],['51–75%', quizBuckets[2]],['76–100%', quizBuckets[3]]].map(([label, count]) => (
                <div key={label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem', height:'100%', justifyContent:'flex-end' }}>
                  <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--t-deep)' }}>{count}</div>
                  <div style={{ width:'60%', background:GREEN, borderRadius:'4px 4px 0 0', height:`${(count/maxBucket)*100}px`, minHeight: count>0?4:0, transition:'height 0.4s' }} />
                  <div style={{ fontSize:'0.72rem', color:'var(--t-slate)', textAlign:'center' }}>{label}</div>
                </div>
              ))}
            </div>
            <p style={{ color:'var(--t-ash)', fontSize:'0.72rem', margin:'0.75rem 0 0', textAlign:'center', fontStyle:'italic' }}>
              Distribution of combined quiz accuracy (knowledge + discovery) across classes.
            </p>
          </div>

          {/* Observation Skill Breakdown */}
          {obsAvgs && (() => {
            const radarLabels =
              subjectFilter === 'maths'   ? ['Method (%)',     'Accuracy (%)',      'Communication (%)'] :
              subjectFilter === 'pdhpe'   ? ['Comparison (%)', 'Understanding (%)', 'Communication (%)'] :
              subjectFilter === 'science' ? ['Behaviour (%)',  'Detail (%)',         'Writing (%)']       :
                                           ['Vocabulary (%)', 'Explanation (%)',    'Mechanics (%)'];
            const radarDefs =
              subjectFilter === 'maths' ? [
                ['Method (%)',         'Did the student show their working and approach clearly?'],
                ['Accuracy (%)',       'Did the student include correct numbers, units, and notation?'],
                ['Communication (%)', 'How clearly did the student structure and express their mathematical thinking?'],
              ] : subjectFilter === 'pdhpe' ? [
                ['Comparison (%)',    'Did the student compare what they observed to their own lifestyle or health?'],
                ['Understanding (%)', 'Did the student demonstrate understanding of a health or PDHPE concept?'],
                ['Communication (%)', 'How clearly did the student write using correct sentences and punctuation?'],
              ] : subjectFilter === 'science' ? [
                ['Behaviour (%)',  'Did the student identify real animal behaviour (pacing, grooming, feeding)?'],
                ['Detail (%)',     'Did the student include specific evidence - colour, sound, movement, habitat features?'],
                ['Writing (%)',    'Measures sentence clarity, descriptive language, structure, and grammar.'],
              ] : [
                ['Vocabulary (%)',   'How well did the student use subject-specific and descriptive vocabulary across all KLA areas?'],
                ['Explanation (%)',  'How well did the student develop, elaborate, and explain their ideas with supporting detail?'],
                ['Mechanics (%)',    'How clearly did the student structure sentences, use capitals, and apply punctuation?'],
              ];
            return (
              <div style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'1.25rem' }}>
                <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 0.75rem' }}>Writing Skill Breakdown</h3>
                <svg viewBox="0 0 400 280" style={{ width:'100%', maxWidth:420, display:'block', margin:'0 auto' }}>
                  {[0.2,0.4,0.6,0.8,1].map(lv => (
                    <polygon key={lv} points={gridPts(lv)} fill="none" stroke="#E5E7EB" strokeWidth={1} />
                  ))}
                  {[20,40,60,80].map(lv => (
                    <text key={lv} x={CX+2} y={CY - R*(lv/100) - 3} fontSize="9" fill="#9CA3AF" textAnchor="middle">{lv}</text>
                  ))}
                  {AXES_DEG.map(deg => { const rad=deg*Math.PI/180; return <line key={deg} x1={CX} y1={CY} x2={CX+R*Math.cos(rad)} y2={CY+R*Math.sin(rad)} stroke="#E5E7EB" strokeWidth={1} />; })}
                  {radarPts && (
                    <>
                      <polygon points={radarPts.map(p=>p.join(',')).join(' ')} fill={`${GREEN}22`} stroke={GREEN} strokeWidth={2} />
                      {radarPts.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r={4} fill={GREEN} />)}
                    </>
                  )}
                  <text x={CX} y={CY-R-14} fontSize="12" fill="#374151" textAnchor="middle" fontWeight="600">{radarLabels[0]}</text>
                  <text x={CX+R*Math.cos(30*Math.PI/180)+14} y={CY+R*Math.sin(30*Math.PI/180)+14} fontSize="12" fill="#374151" textAnchor="start" fontWeight="600">{radarLabels[1]}</text>
                  <text x={CX+R*Math.cos(150*Math.PI/180)-14} y={CY+R*Math.sin(150*Math.PI/180)+14} fontSize="12" fill="#374151" textAnchor="end" fontWeight="600">{radarLabels[2]}</text>
                  {[obsAvgs.behaviour, obsAvgs.detail, obsAvgs.writing].map((v, i) => {
                    const rad=AXES_DEG[i]*Math.PI/180; const sc=0.6;
                    return <text key={i} x={CX+R*sc*Math.cos(rad)} y={CY+R*sc*Math.sin(rad)+4} fontSize="11" fill={GREEN} textAnchor="middle" fontWeight="700">{v}</text>;
                  })}
                </svg>
                <div style={{ background:'var(--t-foam)', border:'1px solid var(--t-mist)', borderRadius:'var(--t-r-sm)', padding:'0.9rem 1rem', marginTop:'0.5rem' }}>
                  <div style={{ fontSize:'0.65rem', fontWeight:800, color:'var(--t-deep)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>HOW SCORES ARE CALCULATED</div>
                  {radarDefs.map(([term, def]) => (
                    <p key={term} style={{ margin:'0 0 0.4rem', fontSize:'0.78rem', color:'var(--t-slate)', lineHeight:1.55 }}>
                      <strong style={{ color:'var(--t-deep)' }}>{term}</strong> {def}
                    </p>
                  ))}
                </div>
                <p style={{ color:'var(--t-ash)', fontSize:'0.72rem', margin:'0.5rem 0 0', textAlign:'center', fontStyle:'italic' }}>
                  Average scores across all completed student writing. Scores range from 0–100.
                </p>
              </div>
            );
          })()}

          {/* Hardest Questions */}
          {hardestQuestions.length > 0 && (
            <div style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'1.25rem' }}>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 1rem' }}>Hardest Questions</h3>
              {hardestQuestions.map((q, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'1rem', padding:'0.85rem 0', borderBottom: i<hardestQuestions.length-1 ? '1px solid var(--t-mist)' : 'none' }}>
                  <div style={{ width:24, textAlign:'center', fontSize:'0.88rem', fontWeight:700, color:'var(--t-slate)', flexShrink:0 }}>{i+1}.</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.2rem' }}>{q.animal}</div>
                    <div style={{ fontSize:'0.88rem', color:'var(--t-deep)', fontWeight:500 }}>{q.question}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--t-slate)', marginTop:'0.2rem' }}>{q.attempts} attempt{q.attempts!==1?'s':''}</div>
                  </div>
                  <div style={{ fontSize:'0.95rem', fontWeight:800, color: q.successRate<40?'#DC2626':q.successRate<70?'#D97706':GREEN, flexShrink:0 }}>{q.successRate}%</div>
                </div>
              ))}
              <p style={{ color:'var(--t-ash)', fontSize:'0.72rem', margin:'0.5rem 0 0', textAlign:'center', fontStyle:'italic' }}>
                Questions with lowest first-attempt success rate. Helps identify confusing signage or difficult concepts.
              </p>
            </div>
          )}

          {/* School Performance table */}
          {schoolPerf.length > 0 && (
            <div style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'1.25rem' }}>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 1rem' }}>School Performance</h3>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.83rem' }}>
                  <thead>
                    <tr style={{ borderBottom:'2px solid var(--t-mist)' }}>
                      {['SCHOOL NAME','CLASSES','STUDENTS','QUIZ %','OBSERVATION %'].map(h => (
                        <th key={h} style={{ textAlign:h==='SCHOOL NAME'?'left':'center', padding:'0.4rem 0.6rem', fontSize:'0.62rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(schoolExpanded ? schoolPerf : schoolPerf.slice(0, 4)).map((s, i) => (
                      <tr key={s.name} style={{ borderBottom:'1px solid var(--t-mist)', background:i%2===0?'transparent':'var(--t-chalk)' }}>
                        <td style={{ padding:'0.65rem 0.6rem', fontWeight:600, color:'var(--t-deep)' }}>{s.name}</td>
                        <td style={{ padding:'0.65rem 0.6rem', textAlign:'center', color:'var(--t-slate)' }}>{s.classes}</td>
                        <td style={{ padding:'0.65rem 0.6rem', textAlign:'center', color:'var(--t-slate)' }}>{s.students}</td>
                        <td style={{ padding:'0.65rem 0.6rem', textAlign:'center', fontWeight:700, color:s.quizAvg==null?'var(--t-ash)':s.quizAvg<50?'#DC2626':s.quizAvg<75?'#D97706':GREEN }}>{s.quizAvg!=null?`${s.quizAvg}%`:' - '}</td>
                        <td style={{ padding:'0.65rem 0.6rem', textAlign:'center', color:'var(--t-slate)' }}>{s.obsAvg!=null?`${s.obsAvg}%`:' - '}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {schoolPerf.length > 4 && (
                <button onClick={() => setSchoolExpanded(x => !x)}
                  style={{ display:'block', width:'100%', marginTop:'0.75rem', padding:'0.5rem', background:'var(--t-foam)', border:'1px solid var(--t-mist)', borderRadius:'var(--t-r-sm)', fontSize:'0.8rem', fontWeight:600, color:'var(--t-slate)', cursor:'pointer', textAlign:'center' }}>
                  {schoolExpanded ? '▲ Show less' : `▼ Show ${schoolPerf.length - 4} more school${schoolPerf.length - 4 !== 1 ? 's' : ''}`}
                </button>
              )}
              <p style={{ color:'var(--t-ash)', fontSize:'0.72rem', margin:'0.75rem 0 0', textAlign:'center', fontStyle:'italic' }}>
                Schools ranked by average quiz performance. Observation scores calculated from completed student submissions.
              </p>
            </div>
          )}

          {/* Conservation Statements - standard sessions only */}
          {view !== 'zoosnooz' && conStatements.length > 0 && (
            <div style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'1.25rem' }}>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 0.35rem' }}>Conservation Statements</h3>
              <p style={{ color:'var(--t-slate)', fontSize:'0.78rem', margin:'0 0 0.85rem' }}>{conStatements.length} statement{conStatements.length!==1?'s':''} across all classes.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', maxHeight:320, overflowY:'auto' }}>
                {conStatements.map((s, i) => (
                  <div key={i} style={{ borderLeft:`3px solid ${GREEN}`, paddingLeft:'0.85rem', paddingTop:'0.3rem', paddingBottom:'0.3rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontWeight:600, color:'var(--t-deep)', fontSize:'0.83rem' }}>{s.name}</span>
                      <span style={{ fontSize:'0.68rem', color:'var(--t-ash)', fontFamily:'monospace' }}>{s.classCode}</span>
                    </div>
                    <p style={{ margin:'0.15rem 0 0', color:'var(--t-slate)', fontSize:'0.8rem', lineHeight:1.5 }}>"{s.statement}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </>)}

        {/* By Stage + Top Schools */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1.1rem', border:'1px solid var(--t-stone)' }}>
            <h3 style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--t-deep)', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 0.85rem' }}>By Stage</h3>
            {Object.keys(byStage).length === 0 && <p style={{ color:'var(--t-ash)', fontSize:'0.8rem', margin:0 }}>No stage data.</p>}
            {Object.entries(byStage).sort(([a],[b])=>String(a).localeCompare(String(b))).map(([stage, d]) => {
              const quizAvg = d.quizCount > 0 ? Math.round(d.quizSum/d.quizCount) : null;
              const barW    = totalStudentsAll ? Math.round((d.students/totalStudentsAll)*100) : 0;
              return (
                <div key={stage} style={{ marginBottom:'0.65rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', marginBottom:'0.2rem' }}>
                    <span style={{ fontWeight:600, color:'var(--t-deep)' }}>Stage {stage}</span>
                    <span style={{ color:'var(--t-slate)' }}>{d.students} students · {quizAvg!=null?`${quizAvg}% quiz`:' - '}</span>
                  </div>
                  <div style={{ height:6, background:'var(--t-foam)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${barW}%`, background:'var(--t-mid)', borderRadius:3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1.1rem', border:'1px solid var(--t-stone)' }}>
            <h3 style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--t-deep)', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 0.85rem' }}>Top Schools</h3>
            {schoolPerf.length === 0 && <p style={{ color:'var(--t-ash)', fontSize:'0.8rem', margin:0 }}>No school data yet.</p>}
            {schoolPerf.slice(0,5).map((s, i) => (
              <div key={s.name} style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.55rem' }}>
                <span style={{ width:20, height:20, borderRadius:'50%', background:'var(--t-foam)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:700, color:'var(--t-mid)', flexShrink:0 }}>{i+1}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--t-deep)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</div>
                </div>
                <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--t-slate)', flexShrink:0 }}>{s.students}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Rate by Class */}
        <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1.1rem', border:'1px solid var(--t-stone)' }}>
          <h3 style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--t-deep)', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 0.85rem' }}>Completion Rate by Class</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', maxHeight:240, overflowY:'auto' }}>
            {[...viewClasses].sort((a,b)=>b.completionPercent-a.completionPercent).map(c => (
              <div key={c.classCode} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <div style={{ width:90, fontSize:'0.7rem', color:'var(--t-slate)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flexShrink:0 }}>{c.className || c.classCode}</div>
                <div style={{ flex:1, height:8, background:'var(--t-foam)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${c.completionPercent}%`, background: c.completionPercent===100 ? 'var(--t-eucalyptus)' : 'var(--t-mid)', borderRadius:4, transition:'width 0.4s' }} />
                </div>
                <div style={{ width:36, fontSize:'0.72rem', fontWeight:700, color: c.completionPercent===100 ? 'var(--t-eucalyptus)' : 'var(--t-deep)', textAlign:'right', flexShrink:0 }}>{c.completionPercent}%</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Tab: Resources (admin) ───────────────────────────────────────────────────
function AdminResourcesTab() {
  const ADMIN_RESOURCES = [
    { icon:'📊', title:'Taronga Tracka Data Guide', desc:'How student data is stored, what each field means, and how to interpret Firestore output.', type:'DOC' },
    { icon:'🔐', title:'Access Code Protocol', desc:'When to generate daily codes vs. class codes, expiry rules, and ZooSnooz night codes.', type:'PDF' },
    { icon:'🌙', title:'ZooSnooz Operations Manual', desc:'Full operational guide for ZooSnooz night sessions - equipment, NFC setup, keeper coordination.', type:'PDF' },
    { icon:'📤', title:'Bulk Data Export Guide', desc:'How to export all class data as CSV from the admin dashboard and load into Excel/Sheets.', type:'PDF' },
    { icon:'🛠️', title:'Troubleshooting & FAQ', desc:'Common student issues, camera permission errors, geolocation problems, and Firebase offline mode.', type:'DOC' },
    { icon:'📋', title:'School Visit Booking Checklist', desc:'Pre-visit coordination checklist for education staff - tech check, class setup, teacher briefing.', type:'PDF' },
    { icon:'🔄', title:'Feedback Submission Form', desc:'Submit bug reports, feature requests, or content corrections to the Taronga digital team.', type:'FORM' },
  ];
  const typeColor = { PDF:'#DC2626', DOC:'#0284C7', FORM:'#7C3AED' };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
      <p style={{ color:'var(--t-slate)', fontSize:'0.85rem', marginBottom:'0.25rem' }}>Staff and operational resources for Taronga Education &amp; Digital teams.</p>
      {ADMIN_RESOURCES.map(r => (
        <div key={r.title} style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-stone)', padding:'0.9rem 1rem', display:'flex', gap:'0.85rem', alignItems:'flex-start', cursor:'pointer' }}
          onClick={() => alert(`"${r.title}" - connect this to the Taronga content library when ready.`)}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--t-mid)';e.currentTarget.style.boxShadow='var(--t-shadow-sm)';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--t-stone)';e.currentTarget.style.boxShadow='none';}}>
          <div style={{ fontSize:'1.5rem', flexShrink:0 }}>{r.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.2rem' }}>
              <span style={{ fontWeight:700, color:'var(--t-deep)', fontSize:'0.88rem' }}>{r.title}</span>
              <span style={{ background:`${typeColor[r.type]||'#888'}18`, color:typeColor[r.type]||'#888', border:`1px solid ${typeColor[r.type]||'#888'}40`, borderRadius:999, padding:'0.1rem 0.5rem', fontSize:'0.62rem', fontWeight:700 }}>{r.type}</span>
            </div>
            <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-slate)', lineHeight:1.55 }}>{r.desc}</p>
          </div>
          <div style={{ color:'var(--t-stone)', flexShrink:0 }}>↓</div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Review ──────────────────────────────────────────────────────────────
function ReviewTab({ classes }) {
  const [flagged,         setFlagged]         = useState([]);
  const [feedback,        setFeedback]        = useState([]);
  const [studentFeedback, setStudentFeedback] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [expanded,        setExpanded]        = useState({});
  const [overrideOpen,    setOverrideOpen]    = useState(null);
  const [overrideVals,    setOverrideVals]    = useState({ b: 0, d: 0, w: 0 });

  useEffect(() => {
    if (!classes.length) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const flaggedItems = [];
      for (const cls of classes) {
        try {
          const snap = await getDocs(collection(db, 'classes', cls.classCode, 'students'));
          snap.docs.forEach(d => {
            const sd = d.data();
            (sd.badges || []).forEach(b => {
              // Teacher flags via observationScore.reviewFlag.flagged
              if (b.observationScore?.reviewFlag?.flagged === true) {
                flaggedItems.push({ classCode: cls.classCode, className: cls.className || cls.classCode, studentId: d.id, studentName: sd.name || d.id, badge: b });
              }
            });
          });
        } catch {}
      }
      // Teacher feedback
      let fbItems = [];
      try {
        const fbSnap = await getDocs(collection(db, 'teacherFeedback'));
        fbItems = fbSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      } catch {}
      // Student feedback
      let sfItems = [];
      try {
        const sfSnap = await getDocs(collection(db, 'studentFeedback'));
        sfItems = sfSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      } catch {}
      if (!cancelled) { setFlagged(flaggedItems); setFeedback(fbItems); setStudentFeedback(sfItems); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [classes]);

  const removeFlag = async (item, idx) => {
    const ref = doc(db, 'classes', item.classCode, 'students', item.studentId);
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const badges = (snap.data().badges || []).map(b =>
        b.animalId === item.badge.animalId
          ? { ...b, observationScore: { ...b.observationScore, reviewFlag: { ...(b.observationScore?.reviewFlag || {}), flagged: false } } }
          : b
      );
      await updateDoc(ref, { badges });
      setFlagged(prev => prev.filter((_, i) => i !== idx));
    } catch (e) { alert('Failed to remove flag: ' + e.message); }
  };

  const openOverride = (item, idx) => {
    const o = item.badge.observationScore || {};
    const ov = o.teacherOverride || {};
    setOverrideVals({
      b: ov.behaviourScore ?? o.behaviour ?? 0,
      d: ov.detailScore    ?? o.detail    ?? 0,
      w: ov.writingScore   ?? o.writing   ?? 0,
    });
    setOverrideOpen(overrideOpen === idx ? null : idx);
  };

  const applyOverride = async (item, idx) => {
    const ref = doc(db, 'classes', item.classCode, 'students', item.studentId);
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const override = { applied: true, behaviourScore: overrideVals.b, detailScore: overrideVals.d, writingScore: overrideVals.w, savedAt: new Date().toISOString() };
      const badges = (snap.data().badges || []).map(b =>
        b.animalId === item.badge.animalId
          ? { ...b, observationScore: { ...b.observationScore, teacherOverride: override } }
          : b
      );
      await updateDoc(ref, { badges });
      setFlagged(prev => prev.map((f, i) => i !== idx ? f : {
        ...f, badge: { ...f.badge, observationScore: { ...f.badge.observationScore, teacherOverride: override } },
      }));
      setOverrideOpen(null);
    } catch (e) { alert('Failed to apply override: ' + e.message); }
  };

  if (loading) return (
    <div style={{ textAlign:'center', padding:'3rem', color:'var(--t-slate)' }}>
      <div style={{ width:36, height:36, border:'3px solid var(--t-mist)', borderTop:'3px solid var(--t-mid)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 0.75rem' }} />
      Loading review data…
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2.5rem' }}>

      {/* ── Flagged Observations ── */}
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.35rem' }}>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--t-deep)', margin:0 }}>Review / Feedback</h2>
          {flagged.length > 0 && (
            <span style={{ background:'#DC2626', color:'white', borderRadius:999, padding:'0.2rem 0.7rem', fontSize:'0.72rem', fontWeight:700 }}>
              {flagged.length} flagged
            </span>
          )}
        </div>
        <p style={{ color:'var(--t-slate)', fontSize:'0.85rem', margin:'0 0 1.25rem' }}>
          Observations flagged for review. Remove flags once actioned.
        </p>

        {flagged.length === 0 && (
          <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-md)', padding:'1.5rem', textAlign:'center' }}>
            <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem' }}>✅</div>
            <p style={{ color:'#166534', fontWeight:600, margin:0 }}>No flagged observations.</p>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {flagged.map((item, idx) => {
            const o    = item.badge.observationScore || {};
            const ov   = o.teacherOverride || {};
            const flag = o.reviewFlag || {};
            const hasOverride = ov.applied === true;
            // Show override scores if applied, otherwise originals
            const bv = hasOverride ? (ov.behaviourScore ?? o.behaviour) : o.behaviour;
            const dv = hasOverride ? (ov.detailScore    ?? o.detail)    : o.detail;
            const wv = hasOverride ? (ov.writingScore   ?? o.writing)   : o.writing;
            const obsText = item.badge.observation || '';
            const dateStr = flag.timestamp
              ? new Date(flag.timestamp).toLocaleDateString('en-AU', { day:'numeric', month:'short' })
              : '';
            const isExpanded    = !!expanded[idx];
            const isOverrideOpen = overrideOpen === idx;

            return (
              <div key={idx} style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', borderLeft:'4px solid #DC2626', padding:'1.1rem 1.25rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>

                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700, fontSize:'1rem', color:'var(--t-deep)' }}>{item.studentName}</span>
                      <span style={{ background:'#FEE2E2', color:'#DC2626', border:'1px solid #FECACA', borderRadius:999, padding:'0.15rem 0.55rem', fontSize:'0.68rem', fontWeight:700 }}>⚠ Review Required</span>
                      {hasOverride && <span style={{ background:'#FEF3C7', color:'#92400E', border:'1px solid #FDE68A', borderRadius:999, padding:'0.15rem 0.55rem', fontSize:'0.68rem', fontWeight:700 }}>Override</span>}
                    </div>
                    <div style={{ fontSize:'0.78rem' }}>
                      <strong style={{ color:'var(--t-deep)', textTransform:'uppercase', letterSpacing:'0.04em' }}>{item.badge.animal || item.badge.animalId}</strong>
                      {dateStr && <span style={{ marginLeft:'0.5rem', color:'var(--t-ash)' }}>· {dateStr}</span>}
                    </div>
                    {ov.reasonType && <div style={{ fontSize:'0.75rem', color:'var(--t-ash)', fontStyle:'italic' }}>Reason: {ov.reasonType}</div>}
                  </div>
                  {/* B D W scores */}
                  <div style={{ display:'flex', gap:'1rem', textAlign:'center', flexShrink:0 }}>
                    {[['B', bv], ['D', dv], ['W', wv]].map(([label, val]) => (
                      <div key={label}>
                        <div style={{ fontSize:'0.62rem', color:'var(--t-ash)', fontWeight:700 }}>{label}</div>
                        <div style={{ fontSize:'0.92rem', fontWeight:800, color: (val||0) >= 4 ? GREEN : (val||0) >= 2 ? '#D97706' : '#DC2626' }}>{val ?? ' - '}/5</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teacher note */}
                {ov.note && (
                  <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:'var(--t-r-sm)', padding:'0.55rem 0.85rem', fontSize:'0.82rem', color:'#92400E' }}>
                    <strong>Teacher note:</strong> {ov.note}
                  </div>
                )}

                {/* Observation text */}
                {obsText && (
                  <div style={{ background:'var(--t-foam)', border:'1px solid var(--t-mist)', borderRadius:'var(--t-r-sm)', padding:'0.75rem 1rem', fontSize:'0.85rem', color:'var(--t-deep)', lineHeight:1.65 }}>
                    {isExpanded || obsText.length <= 200 ? obsText : obsText.slice(0, 200) + '…'}
                  </div>
                )}

                {/* Override score form */}
                {isOverrideOpen && (
                  <div style={{ background:'var(--t-chalk)', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-sm)', padding:'0.85rem 1rem', display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                    <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)' }}>Adjust Scores (0–5)</div>
                    <div style={{ display:'flex', gap:'1rem' }}>
                      {[['Behaviour','b'],['Detail','d'],['Writing','w']].map(([label, key]) => (
                        <div key={key} style={{ flex:1 }}>
                          <label style={{ display:'block', fontSize:'0.72rem', fontWeight:600, color:'var(--t-slate)', marginBottom:'0.25rem' }}>{label}</label>
                          <input type="number" min={0} max={5} value={overrideVals[key]}
                            onChange={e => setOverrideVals(v => ({ ...v, [key]: Math.min(5, Math.max(0, Number(e.target.value))) }))}
                            style={{ width:'100%', padding:'0.4rem 0.6rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.88rem', fontFamily:'inherit', boxSizing:'border-box' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'flex', gap:'0.5rem' }}>
                      <button onClick={() => applyOverride(item, idx)} style={{ background:GREEN, color:'white', border:'none', padding:'0.45rem 1rem', borderRadius:'var(--t-r-sm)', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>Save Override</button>
                      <button onClick={() => setOverrideOpen(null)} style={{ background:'none', border:'1px solid var(--t-stone)', color:'var(--t-slate)', padding:'0.45rem 0.9rem', borderRadius:'var(--t-r-sm)', fontSize:'0.8rem', cursor:'pointer' }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
                  {obsText.length > 200 && (
                    <button onClick={() => setExpanded(e => ({ ...e, [idx]: !e[idx] }))}
                      style={{ background:'white', border:'1px solid var(--t-stone)', color:'var(--t-deep)', padding:'0.45rem 0.9rem', borderRadius:'var(--t-r-sm)', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
                      {isExpanded ? 'Collapse ▲' : 'View Full Observation ▼'}
                    </button>
                  )}
                  <button onClick={() => openOverride(item, idx)}
                    style={{ background:'white', border:'1px solid var(--t-stone)', color:'var(--t-deep)', padding:'0.45rem 0.9rem', borderRadius:'var(--t-r-sm)', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
                    Apply Override
                  </button>
                  <button onClick={() => removeFlag(item, idx)}
                    style={{ background:'white', border:'1.5px solid #DC2626', color:'#DC2626', padding:'0.45rem 0.9rem', borderRadius:'var(--t-r-sm)', fontSize:'0.8rem', fontWeight:700, cursor:'pointer' }}>
                    ✓ Remove Flag
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ── Teacher Feedback ── */}
      <div>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--t-deep)', margin:'0 0 0.35rem' }}>Teacher Feedback</h2>
        <p style={{ color:'var(--t-slate)', fontSize:'0.85rem', margin:'0 0 1.25rem' }}>Feedback submitted by teachers from the teacher portal.</p>

        {feedback.length === 0 && (
          <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'1.5rem', textAlign:'center', color:'var(--t-ash)', fontSize:'0.88rem' }}>
            No teacher feedback submitted yet.
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
          {feedback.map(fb => {
            const rating  = Math.min(5, Math.max(0, fb.rating || 0));
            const dateStr = fb.timestamp
              ? new Date(fb.timestamp).toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' })
              : '';
            return (
              <div key={fb.id} style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', borderLeft:`4px solid ${GREEN}`, padding:'1.1rem 1.25rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'1rem', letterSpacing:'0.05em', lineHeight:1 }}>
                    {'⭐'.repeat(rating)}{'☆'.repeat(5 - rating)}
                  </span>
                  <span style={{ fontWeight:700, color:'var(--t-deep)' }}>{rating}/5</span>
                  {fb.classCode && (
                    <span style={{ background:'var(--t-foam)', border:'1px solid var(--t-mist)', borderRadius:999, padding:'0.15rem 0.6rem', fontSize:'0.72rem', fontWeight:600, color:'var(--t-deep)' }}>
                      Class: {fb.classCode}
                    </span>
                  )}
                </div>
                {fb.comment && (
                  <p style={{ margin:'0 0 0.45rem', color:'var(--t-deep)', fontSize:'0.88rem', lineHeight:1.65 }}>{fb.comment}</p>
                )}
                <div style={{ fontSize:'0.72rem', color:'var(--t-ash)' }}>
                  {fb.teacherName || ''}
                  {dateStr && <span style={{ marginLeft:'0.75rem' }}>{dateStr}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Student Feedback ── */}
      <div>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--t-deep)', margin:'0 0 0.35rem' }}>Student Feedback</h2>
        <p style={{ color:'var(--t-slate)', fontSize:'0.85rem', margin:'0 0 1.25rem' }}>Ratings and comments submitted by students at the end of their session.</p>

        {studentFeedback.length > 0 && (() => {
          const avg = (studentFeedback.reduce((s, f) => s + (f.rating || 0), 0) / studentFeedback.length).toFixed(1);
          const dist = [5,4,3,2,1].map(s => ({ star: s, count: studentFeedback.filter(f => f.rating === s).length }));
          return (
            <div style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', borderLeft:`4px solid #F59E0B`, padding:'1.1rem 1.25rem', marginBottom:'1rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'2.2rem', fontWeight:800, color:'var(--t-deep)', lineHeight:1 }}>{avg}</div>
                  <div style={{ fontSize:'1rem', letterSpacing:'0.05em', margin:'0.2rem 0 0.15rem' }}>{'⭐'.repeat(Math.round(avg))}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--t-ash)', fontWeight:600 }}>{studentFeedback.length} response{studentFeedback.length !== 1 ? 's' : ''}</div>
                </div>
                <div style={{ flex:1, minWidth:'160px', display:'flex', flexDirection:'column', gap:'0.3rem' }}>
                  {dist.map(({ star, count }) => (
                    <div key={star} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                      <span style={{ fontSize:'0.72rem', color:'var(--t-slate)', width:'28px', textAlign:'right', fontWeight:600 }}>{star}★</span>
                      <div style={{ flex:1, background:'var(--t-foam)', borderRadius:999, height:'7px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${studentFeedback.length ? (count/studentFeedback.length)*100 : 0}%`, background:'#F59E0B', borderRadius:999, transition:'width 0.4s' }} />
                      </div>
                      <span style={{ fontSize:'0.72rem', color:'var(--t-ash)', width:'20px', fontWeight:600 }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {studentFeedback.length === 0 && (
          <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'1.5rem', textAlign:'center', color:'var(--t-ash)', fontSize:'0.88rem' }}>
            No student feedback submitted yet.
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {studentFeedback.map(fb => {
            const rating  = Math.min(5, Math.max(0, fb.rating || 0));
            const dateStr = fb.timestamp
              ? new Date(fb.timestamp).toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' })
              : '';
            return (
              <div key={fb.id} style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', borderLeft:'4px solid #F59E0B', padding:'1rem 1.25rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', marginBottom:'0.45rem', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'0.95rem', letterSpacing:'0.04em', lineHeight:1 }}>
                    {'⭐'.repeat(rating)}{'☆'.repeat(5 - rating)}
                  </span>
                  <span style={{ fontWeight:700, color:'var(--t-deep)', fontSize:'0.88rem' }}>{rating}/5</span>
                  {fb.sessionType && (
                    <span style={{ background: fb.sessionType === 'zoosnooz' ? '#1e1040' : 'var(--t-foam)', color: fb.sessionType === 'zoosnooz' ? '#a78bfa' : 'var(--t-mid)', border:`1px solid ${fb.sessionType === 'zoosnooz' ? '#4c1d95' : 'var(--t-mist)'}`, borderRadius:999, padding:'0.15rem 0.6rem', fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                      {fb.sessionType === 'zoosnooz' ? 'ZooSnooz' : 'Daily'}
                    </span>
                  )}
                  {fb.classCode && (
                    <span style={{ background:'var(--t-foam)', border:'1px solid var(--t-mist)', borderRadius:999, padding:'0.15rem 0.6rem', fontSize:'0.68rem', fontWeight:600, color:'var(--t-slate)' }}>
                      {fb.classCode}
                    </span>
                  )}
                  {fb.studentName && (
                    <span style={{ fontSize:'0.68rem', color:'var(--t-ash)', fontStyle:'italic' }}>{fb.studentName}</span>
                  )}
                </div>
                {fb.comment && (
                  <p style={{ margin:'0 0 0.35rem', color:'var(--t-deep)', fontSize:'0.85rem', lineHeight:1.65 }}>"{fb.comment}"</p>
                )}
                {dateStr && <div style={{ fontSize:'0.7rem', color:'var(--t-ash)' }}>{dateStr}</div>}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ─── Tab: ZooSnooz ───────────────────────────────────────────────────────────
function ZooSnoozAdminTab({ classes }) {
  const [docs,       setDocs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [urlCache,   setUrlCache]   = useState({});  // docId → { docUrl, clipUrls }
  const [busy,       setBusy]       = useState({});  // docId → bool
  const [copied,     setCopied]     = useState(null);

  const fmtDate = (ts) => {
    if (!ts) return '';
    const d = ts instanceof Date ? ts : (ts.toDate?.() || new Date(ts));
    return d.toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' }) + ', ' +
      d.toLocaleTimeString('en-AU', { hour:'2-digit', minute:'2-digit', hour12:true }).toLowerCase();
  };

  const loadList = async (includeAll = false) => {
    setLoading(true);
    const rows = [];
    try {
      const targets = includeAll ? classes : classes.filter(c => c.sessionType === 'zoosnooz');
      for (const cls of targets) {
        const snap = await getDocs(collection(db, 'classes', cls.classCode, 'students'));
        snap.docs.forEach(d => {
          const sd = d.data();
          const hasDoc    = !!sd.zzDocumentaryURL;
          const hasZzData = !!(sd.zoosnooz || sd.zzBadges?.length);
          if (!hasDoc && !hasZzData) return;

          const clips = [];
          let latestTs = null;

          // Primary: per-animal zoosnooz map
          ZOOSNOOZ_ANIMALS.forEach(a => {
            const az = sd.zoosnooz?.[a.id];
            if (az?.completed) {
              const ts = az.timestamp?.toDate?.() || (az.timestamp ? new Date(az.timestamp) : null);
              clips.push({ animalId: a.id, animalName: a.name, ts });
              if (ts && (!latestTs || ts > latestTs)) latestTs = ts;
            }
          });

          // Fallback: zzBadges array (from zzFinalSubmit)
          if (!clips.length) {
            (sd.zzBadges || []).forEach(b => {
              if (!b.animalId || clips.find(c => c.animalId === b.animalId)) return;
              const ts = b.timestamp ? new Date(b.timestamp) : null;
              clips.push({ animalId: b.animalId, animalName: b.animal || b.animalId, ts });
              if (ts && (!latestTs || ts > latestTs)) latestTs = ts;
            });
          }

          // Include if they have a documentary OR any animal clips - don't require both
          const qualifies = hasDoc || clips.length > 0;
          if (qualifies && !rows.find(r => r.docId === `${cls.classCode}_${d.id}`)) {
            const submittedAt = sd.completedAt?.toDate?.() || null;
            rows.push({
              docId: `${cls.classCode}_${d.id}`,
              studentDocId: d.id,
              name: sd.name || d.id,
              classCode: cls.classCode,
              clips: clips.sort((a, b) => (b.ts || 0) - (a.ts || 0)),
              latestTs: latestTs || submittedAt,
              totalAnimals: ZOOSNOOZ_ANIMALS.length,
              zzDocumentaryURL: sd.zzDocumentaryURL || null,
            });
          }
        });
      }
      rows.sort((a, b) => (b.latestTs || 0) - (a.latestTs || 0));
      setDocs(rows);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadList(); }, [classes]);

  // Fetch Storage URLs for one entry (cached after first call)
  const ensureUrls = async (entry) => {
    if (urlCache[entry.docId]) return urlCache[entry.docId];
    setBusy(prev => ({ ...prev, [entry.docId]: true }));
    const base = `zoosnooz/${entry.classCode}/${entry.studentDocId}`;
    let docUrl = entry.zzDocumentaryURL || null;
    const clipUrls = {};
    if (!docUrl) {
      // Try both extensions - Safari/iOS records mp4, Chrome records webm
      try { docUrl = await getDownloadURL(storageRef(storage, `${base}/documentary.webm`)); } catch {}
      if (!docUrl) {
        try { docUrl = await getDownloadURL(storageRef(storage, `${base}/documentary.mp4`)); } catch {}
      }
    }
    await Promise.all(entry.clips.map(async clip => {
      try { clipUrls[clip.animalId] = await getDownloadURL(storageRef(storage, `${base}/${clip.animalId}.webm`)); } catch {}
      if (!clipUrls[clip.animalId]) {
        try { clipUrls[clip.animalId] = await getDownloadURL(storageRef(storage, `${base}/${clip.animalId}.mp4`)); } catch {}
      }
    }));
    const result = { docUrl, clipUrls };
    setUrlCache(prev => ({ ...prev, [entry.docId]: result }));
    setBusy(prev => ({ ...prev, [entry.docId]: false }));
    return result;
  };

  const handleWatch = async (entry) => {
    const { docUrl } = await ensureUrls(entry);
    if (docUrl) window.open(docUrl, '_blank');
    else alert('No documentary file found in Storage for this student yet.');
  };

  const handleCopy = async (entry) => {
    const { docUrl } = await ensureUrls(entry);
    if (!docUrl) { alert('No documentary file found in Storage for this student yet.'); return; }
    navigator.clipboard.writeText(docUrl).then(() => {
      setCopied(entry.docId);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleCopyClip = (url, key) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleExpand = async (entry) => {
    const next = expandedId === entry.docId ? null : entry.docId;
    setExpandedId(next);
    if (next) ensureUrls(entry);
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.25rem', gap:'1rem', flexWrap:'wrap' }}>
        <div>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--t-deep)', margin:'0 0 0.2rem' }}>🌙 ZooSnooz Documentaries</h2>
          <p style={{ fontSize:'0.82rem', color:'var(--t-slate)', margin:0 }}>Copy a URL to program it onto a student's NFC tag.</p>
        </div>
        <div style={{ display:'flex', gap:'0.45rem' }}>
          <button onClick={() => loadList(false)} style={{ padding:'0.38rem 0.85rem', borderRadius:'var(--t-r-pill)', border:'1px solid var(--t-stone)', background:'white', fontSize:'0.76rem', fontWeight:600, cursor:'pointer', color:'var(--t-deep)' }}>↻ Refresh</button>
          <button onClick={() => loadList(true)}  style={{ padding:'0.38rem 0.85rem', borderRadius:'var(--t-r-pill)', border:'1px solid var(--t-stone)', background:'white', fontSize:'0.76rem', fontWeight:600, cursor:'pointer', color:'var(--t-slate)' }}>⟳ Backfill Historical</button>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--t-slate)', fontSize:'0.85rem' }}>
          <div style={{ width:28, height:28, border:'3px solid var(--t-stone)', borderTop:`3px solid ${GREEN}`, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 0.75rem' }} />
          Loading documentaries…
        </div>
      )}

      {!loading && docs.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--t-ash)' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🌙</div>
          <p style={{ margin:0, fontSize:'0.9rem' }}>No ZooSnooz documentaries yet.</p>
          <p style={{ margin:'0.4rem 0 0', fontSize:'0.78rem', color:'var(--t-slate)' }}>Try "Backfill Historical" to scan all classes.</p>
        </div>
      )}

      {!loading && docs.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
          {docs.map(entry => {
            const cached = urlCache[entry.docId];
            const isBusy = busy[entry.docId];
            return (
              <div key={entry.docId} style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-md)', padding:'1rem 1.25rem', boxShadow:'var(--t-shadow-sm)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem', flexWrap:'wrap' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', marginBottom:'0.3rem', flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700, color:'#4B3F8C', fontSize:'0.95rem' }}>{entry.name}</span>
                      <span style={{ background:'#F0FFF4', border:'1px solid #BBF7D0', color:'#166534', fontSize:'0.67rem', fontWeight:700, padding:'0.12rem 0.5rem', borderRadius:999 }}>{entry.classCode}</span>
                      <span style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', color:'#6B7280', fontSize:'0.67rem', fontWeight:600, padding:'0.12rem 0.5rem', borderRadius:999 }}>🎬 Film</span>
                    </div>
                    <div style={{ fontSize:'0.74rem', color:'var(--t-slate)' }}>
                      {entry.latestTs ? fmtDate(entry.latestTs) + ' · ' : ''}
                      {entry.clips.length}/{entry.totalAnimals} animals · {entry.clips.length} clip{entry.clips.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'0.4rem', flexShrink:0, flexWrap:'wrap' }}>
                    <button onClick={() => handleExpand(entry)}
                      style={{ padding:'0.38rem 0.75rem', borderRadius:'var(--t-r-pill)', border:'1px solid var(--t-stone)', background:'white', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', color:'var(--t-deep)', whiteSpace:'nowrap' }}>
                      ▶ Clips ({entry.clips.length})
                    </button>
                    <button onClick={() => handleWatch(entry)} disabled={isBusy}
                      style={{ padding:'0.38rem 0.75rem', borderRadius:'var(--t-r-pill)', border:'1px solid var(--t-stone)', background:'white', fontSize:'0.75rem', fontWeight:600, cursor: isBusy ? 'not-allowed' : 'pointer', color:'var(--t-deep)', opacity: isBusy ? 0.6 : 1 }}>
                      {isBusy ? '…' : 'Watch'}
                    </button>
                    <button onClick={() => handleCopy(entry)} disabled={isBusy}
                      style={{ padding:'0.38rem 0.85rem', borderRadius:'var(--t-r-pill)', border:'none', background: copied === entry.docId ? '#22C55E' : GREEN, color:'white', fontSize:'0.75rem', fontWeight:700, cursor: isBusy ? 'not-allowed' : 'pointer', whiteSpace:'nowrap', transition:'background 0.2s', opacity: isBusy ? 0.6 : 1 }}>
                      {isBusy ? '…' : copied === entry.docId ? '✓ Copied!' : 'Copy URL'}
                    </button>
                  </div>
                </div>

                {expandedId === entry.docId && (
                  <div style={{ marginTop:'0.85rem', paddingTop:'0.85rem', borderTop:'1px solid var(--t-stone)', display:'flex', flexDirection:'column', gap:'0.45rem' }}>
                    {isBusy && <div style={{ fontSize:'0.78rem', color:'var(--t-slate)' }}>Loading Storage URLs…</div>}
                    {/* Documentary */}
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'rgba(46,125,85,0.08)', border:'1px solid rgba(46,125,85,0.2)', borderRadius:'var(--t-r-sm)', padding:'0.55rem 0.85rem' }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:'0.8rem', color:GREEN, marginBottom:'0.12rem' }}>🎬 Documentary (compiled)</div>
                        <div style={{ fontFamily:'monospace', fontSize:'0.68rem', color:'var(--t-slate)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {cached?.docUrl || (isBusy ? '…' : 'No file in Storage yet')}
                        </div>
                      </div>
                      {cached?.docUrl && (
                        <button onClick={() => handleCopyClip(cached.docUrl, `${entry.docId}_doc`)}
                          style={{ flexShrink:0, padding:'0.3rem 0.7rem', borderRadius:'var(--t-r-pill)', border:'none', background: copied === `${entry.docId}_doc` ? '#22C55E' : GREEN, color:'white', fontSize:'0.7rem', fontWeight:700, cursor:'pointer' }}>
                          {copied === `${entry.docId}_doc` ? '✓' : 'Copy'}
                        </button>
                      )}
                    </div>
                    {/* Per-animal clips */}
                    {entry.clips.map(clip => {
                      const clipKey = `${entry.docId}_${clip.animalId}`;
                      const clipUrl = cached?.clipUrls?.[clip.animalId];
                      return (
                        <div key={clip.animalId} style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'var(--t-chalk)', borderRadius:'var(--t-r-sm)', padding:'0.55rem 0.85rem' }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontWeight:600, fontSize:'0.8rem', color:'var(--t-deep)', marginBottom:'0.12rem' }}>{clip.animalName}</div>
                            <div style={{ fontFamily:'monospace', fontSize:'0.68rem', color:'var(--t-slate)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                              {clipUrl || (isBusy ? '…' : 'No clip in Storage yet')}
                            </div>
                          </div>
                          {clipUrl && (
                            <button onClick={() => handleCopyClip(clipUrl, clipKey)}
                              style={{ flexShrink:0, padding:'0.3rem 0.7rem', borderRadius:'var(--t-r-pill)', border:'none', background: copied === clipKey ? '#22C55E' : GREEN, color:'white', fontSize:'0.7rem', fontWeight:700, cursor:'pointer' }}>
                              {copied === clipKey ? '✓' : 'Copy'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab({ classes, loading, onClassClick }) {
  const [dateFilter,    setDateFilter]    = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');

  const filtered = classes.filter(cls => {
    if (subjectFilter !== 'all' && cls.subject !== subjectFilter) return false;
    if (dateFilter === 'all') return true;
    if (!cls.createdAt) return false;
    const d = cls.createdAt.toDate?.() || new Date(cls.createdAt);
    const cutoffDays = dateFilter === 'today' ? 0 : dateFilter === '7days' ? 7 : 30;
    const cutoff = new Date();
    if (dateFilter === 'today') { cutoff.setHours(0,0,0,0); }
    else { cutoff.setDate(cutoff.getDate() - cutoffDays); }
    return d >= cutoff;
  });

  const totalStudents = classes.reduce((s,c) => s+c.studentCount, 0);
  const uniqueSchools = new Set(classes.map(c=>c.schoolName).filter(Boolean)).size;
  let wQSum=0, wQCount=0;
  classes.forEach(c => { if (c.quizAverage != null && c.completedCount > 0) { wQSum+=c.quizAverage*c.completedCount; wQCount+=c.completedCount; } });
  const avgQuiz = wQCount > 0 ? Math.round(wQSum/wQCount) : 0;
  const totalBadges = classes.reduce((s,c)=>s+(c.totalBadges||0), 0);

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem', gap:'1rem' }}>
      <div style={{ width:'48px', height:'48px', border:'4px solid rgba(26,82,56,0.15)', borderTop:'4px solid var(--t-mid)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'#888', fontSize:'0.9rem' }}>Loading dashboard data...</p>
    </div>
  );

  return (
    <>
      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { label:'Total Classes',  value: classes.length,  delay:'0.05s' },
          { label:'Total Students', value: totalStudents,   delay:'0.1s'  },
          { label:'Avg Quiz Score', value: `${avgQuiz}%`,  delay:'0.15s', color:'var(--t-eucalyptus)' },
          { label:'Total Unlocks',  value: totalBadges,     delay:'0.2s'  },
          { label:'Unique Schools', value: uniqueSchools,   delay:'0.25s' },
        ].map(k => (
          <div key={k.label} className="animate-scale-in" style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'var(--t-shadow-sm)', border:'1px solid var(--t-stone)', animationDelay: k.delay }}>
            <div style={{ fontSize:'2.2rem', fontWeight:800, color: k.color || 'var(--t-deep)', marginBottom:'0.25rem', lineHeight:1, letterSpacing:'-0.02em' }}>{k.value}</div>
            <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Class grid */}
      <div className="animate-fade-in-up" style={{ marginTop:'1.5rem', animationDelay:'0.4s' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:'1rem' }}>
          <h2 style={{ fontSize:'1.3rem', fontWeight:700, color:'var(--t-deep)', margin:0 }}>All Classes</h2>
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
            <select value={subjectFilter} onChange={e=>setSubjectFilter(e.target.value)}
              style={{ padding:'0.5rem 0.75rem', borderRadius:'var(--t-r-sm)', border:'2px solid #E5E5E5', fontSize:'0.85rem', fontFamily:'DM Sans, sans-serif', background:'white', color:'var(--t-deep)', cursor:'pointer', fontWeight:600 }}>
              <option value="all">All Subjects</option>
              <option value="science">Science</option>
              <option value="maths">Mathematics</option>
              <option value="english">English</option>
              <option value="geography">Geography</option>
            <option value="pdhpe">PDHPE</option>
            </select>
            <select value={dateFilter} onChange={e=>setDateFilter(e.target.value)}
              style={{ padding:'0.5rem 0.75rem', borderRadius:'var(--t-r-sm)', border:'2px solid #E5E5E5', fontSize:'0.85rem', fontFamily:'DM Sans, sans-serif', background:'white', color:'var(--t-deep)', cursor:'pointer', fontWeight:600 }}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom:'0.75rem', color:'#666', fontSize:'0.85rem' }}>Showing {filtered.length} of {classes.length} classes</div>

        {filtered.length === 0 ? (
          <div style={{ background:'white', borderRadius:'var(--t-r-lg)', padding:'2rem', textAlign:'center' }}>
            <p style={{ color:'#666', fontSize:'0.95rem' }}>{classes.length === 0 ? 'No classes have been created yet.' : 'No classes match this date filter.'}</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem' }}>
            {filtered.map(cls => (
              <div key={cls.classCode}
                onClick={() => onClassClick(cls.classCode)}
                style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1.1rem 1.15rem', boxShadow:'var(--t-shadow-xs)', cursor:'pointer', transition:'all 0.22s', border:'1px solid var(--t-stone)' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--t-mid)';e.currentTarget.style.boxShadow='var(--t-shadow-md)';e.currentTarget.style.transform='translateY(-1px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--t-stone)';e.currentTarget.style.boxShadow='var(--t-shadow-xs)';e.currentTarget.style.transform='translateY(0)';}}>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.2rem' }}>{cls.className}</h3>
                    <p style={{ fontSize:'0.8rem', color:'#999', fontWeight:600, letterSpacing:'0.05em', marginBottom:'0.1rem' }}>{cls.classCode}</p>
                    {cls.schoolName && <p style={{ fontSize:'0.75rem', color:'var(--t-mid)', fontWeight:600, margin:'0 0 0.1rem' }}>{cls.schoolName}</p>}
                    {(cls.location || cls.subject) && (
                      <p style={{ fontSize:'0.72rem', color:'var(--t-sage)', fontWeight:600, margin:0 }}>
                        {LOCATION_LABELS[cls.location] || cls.location || ''}
                        {cls.location && cls.subject && <span style={{ color:'var(--t-ash)' }}> · </span>}
                        {cls.subject && <span style={{ textTransform:'capitalize', color:'var(--t-slate)' }}>{cls.subject}</span>}
                      </p>
                    )}
                  </div>
                  <div style={{ background: cls.completionPercent===100 ? 'var(--t-success-bg)' : 'var(--t-warning-bg)', color: cls.completionPercent===100 ? 'var(--t-success)' : 'var(--t-warning)', border:`1px solid ${cls.completionPercent===100?'#BBF7D0':'#FED7AA'}`, padding:'0.2rem 0.55rem', borderRadius:'var(--t-r-pill)', fontSize:'0.7rem', fontWeight:700 }}>
                    {cls.completionPercent}%
                  </div>
                </div>

                <div style={{ borderTop:'1px solid var(--t-stone)', paddingTop:'0.7rem', display:'flex', justifyContent:'space-between', fontSize:'0.82rem' }}>
                  <div>
                    <div style={{ color:'#999', fontSize:'0.75rem', marginBottom:'0.2rem' }}>Stage</div>
                    <div style={{ color:'var(--t-deep)', fontWeight:600 }}>{cls.stage != null ? `Stage ${cls.stage}` : ' - '}</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ color:'#999', fontSize:'0.75rem', marginBottom:'0.2rem' }}>Quiz Avg</div>
                    <div style={{ color:'var(--t-mid)', fontWeight:700 }}>{cls.quizAverage != null ? `${cls.quizAverage}%` : ' - '}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color:'#999', fontSize:'0.75rem', marginBottom:'0.2rem' }}>Students</div>
                    <div style={{ color:'var(--t-deep)', fontWeight:600 }}>{cls.completedCount}/{cls.studentCount}</div>
                  </div>
                </div>

                <div style={{ marginTop:'0.75rem', fontSize:'0.8rem', color:'#888' }}>{cls.teacherEmail}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Tab: Control Room ────────────────────────────────────────────────────────
function ControlRoomTab({ adminAccessCode }) {
  const [unlocked,    setUnlocked]    = useState(false);
  const [input,       setInput]       = useState('');
  const [error,       setError]       = useState(false);
  const [creating,    setCreating]    = useState(false);
  const [createdCode, setCreatedCode] = useState('');
  const [codeType,    setCodeType]    = useState('standard');
  const [maxUses,     setMaxUses]     = useState(50);

  // GPS state
  const [gpsOn,      setGpsOn]      = useState(true);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Wipe state
  const [wipeStep,    setWipeStep]    = useState(0); // 0=idle, 1=confirming
  const [wipeConfirm, setWipeConfirm] = useState('');
  const [wiping,      setWiping]      = useState(false);

  // Load GPS setting on unlock
  useEffect(() => {
    if (!unlocked) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'app'));
        if (snap.exists()) setGpsOn(snap.data().gpsEnabled !== false);
      } catch {}
    })();
  }, [unlocked]);

  const createCode = async () => {
    setCreating(true);
    try {
      const code = generateCode();
      const expires = new Date();
      expires.setDate(expires.getDate() + 1);
      await setDoc(doc(db, 'accessCodes', code), {
        active: true, sessionType: codeType,
        venue: 'Taronga Zoo', uses: 0, maxUses,
        createdBy: adminAccessCode,
        createdAt: serverTimestamp(), expiresAt: expires,
      });
      setCreatedCode(code);
    } catch (e) { alert('Failed: ' + e.message); }
    finally { setCreating(false); }
  };

  const toggleGPS = async () => {
    setGpsLoading(true);
    try {
      const next = !gpsOn;
      await setDoc(doc(db, 'settings', 'app'), { gpsEnabled: next }, { merge: true });
      setGpsOn(next);
    } catch (e) { alert('Failed to update GPS setting: ' + e.message); }
    finally { setGpsLoading(false); }
  };

  const wipeAllData = async () => {
    if (wipeConfirm.trim().toUpperCase() !== 'WIPE') return;
    setWiping(true);
    try {
      const classesSnap = await getDocs(collection(db, 'classes'));
      for (const classDoc of classesSnap.docs) {
        const studentsSnap = await getDocs(collection(db, 'classes', classDoc.id, 'students'));
        for (const s of studentsSnap.docs) await deleteDoc(s.ref);
        await deleteDoc(classDoc.ref);
      }
      setWipeStep(0);
      setWipeConfirm('');
      alert('All class and student data has been wiped.');
    } catch (e) { alert('Wipe failed: ' + e.message); }
    finally { setWiping(false); }
  };

  if (!unlocked) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'3rem 1rem', textAlign:'center' }}>
      <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🔒</div>
      <h2 style={{ fontSize:'1.4rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.4rem' }}>Control Room</h2>
      <p style={{ fontSize:'0.85rem', color:'var(--t-slate)', marginBottom:'1.75rem', maxWidth:'320px', lineHeight:1.6 }}>This area contains powerful controls. Enter the password to continue.</p>
      <div style={{ width:'100%', maxWidth:'300px' }}>
        <input type="password" value={input} onChange={e=>{setInput(e.target.value);setError(false);}}
          onKeyDown={e => { if(e.key==='Enter') { if(input==='Bowie'){setUnlocked(true);setInput('');}else{setError(true);setInput('');} } }}
          placeholder="Password" autoFocus
          style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'var(--t-r-md)', border:`2px solid ${error?'#ef4444':'var(--t-stone)'}`, fontSize:'1rem', fontFamily:'DM Sans, sans-serif', outline:'none', marginBottom:'0.5rem', boxSizing:'border-box', textAlign:'center', letterSpacing:'0.1em' }}/>
        {error && <p style={{ color:'#ef4444', fontSize:'0.8rem', marginBottom:'0.5rem' }}>Incorrect password. Try again.</p>}
        <button onClick={()=>{if(input==='Bowie'){setUnlocked(true);setInput('');}else{setError(true);setInput('');}}}
          style={{ width:'100%', padding:'0.75rem', borderRadius:'var(--t-r-pill)', border:'none', background:'linear-gradient(135deg,var(--t-mid),#5B21B6)', color:'white', fontSize:'0.9rem', fontWeight:700, cursor:'pointer' }}>
          Unlock
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:'540px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ fontSize:'1.3rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 0.2rem' }}>Control Room</h2>
          <p style={{ fontSize:'0.8rem', color:'var(--t-slate)', margin:0 }}>Advanced controls for Taronga staff only.</p>
        </div>
        <button onClick={()=>setUnlocked(false)} style={{ fontSize:'0.78rem', color:'var(--t-slate)', background:'var(--t-foam)', border:'1px solid var(--t-mist)', padding:'0.35rem 0.75rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontWeight:600 }}>🔒 Lock</button>
      </div>

      {/* Generate access code */}
      <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-lg)', padding:'1.5rem', boxShadow:'var(--t-shadow-sm)', marginBottom:'1rem', border:'1px solid var(--t-stone)' }}>
        <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'1rem' }}>Generate Access Code</h3>
        <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Session Type</label>
        <select value={codeType} onChange={e=>setCodeType(e.target.value)} style={{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.88rem', fontFamily:'DM Sans, sans-serif', marginBottom:'0.85rem', background:'white', cursor:'pointer' }}>
          <option value="standard">Standard (Day)</option>
          <option value="zoosnooz">ZooSnooz (Night)</option>
        </select>
        <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Max Uses</label>
        <input type="number" value={maxUses} onChange={e=>setMaxUses(Number(e.target.value))} min={1} max={999}
          style={{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.88rem', fontFamily:'DM Sans, sans-serif', marginBottom:'0.85rem', boxSizing:'border-box', background:'white' }} />
        <button onClick={createCode} disabled={creating}
          style={{ width:'100%', padding:'0.7rem', borderRadius:'var(--t-r-sm)', border:'none', background: creating ? '#CCC' : 'linear-gradient(135deg,var(--t-mid),var(--t-eucalyptus))', color:'white', fontSize:'0.9rem', fontWeight:700, cursor: creating ? 'not-allowed' : 'pointer' }}>
          {creating ? 'Generating…' : '+ Generate Code'}
        </button>
        {createdCode && (
          <div style={{ marginTop:'0.75rem', background:'var(--t-success-bg)', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-sm)', padding:'0.75rem 1rem', textAlign:'center' }}>
            <p style={{ fontSize:'0.75rem', color:'#166534', fontWeight:600, marginBottom:'0.25rem' }}>Code generated:</p>
            <p style={{ fontFamily:'monospace', fontSize:'1.5rem', fontWeight:700, color:'#14532D', letterSpacing:'0.2em', margin:0 }}>{createdCode}</p>
            <p style={{ fontSize:'0.7rem', color:'#166534', margin:'0.25rem 0 0' }}>Valid for 24 hours · {maxUses} max uses · {codeType}</p>
          </div>
        )}
      </div>

      {/* GPS Proximity Override */}
      <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-lg)', padding:'1.25rem 1.5rem', boxShadow:'var(--t-shadow-sm)', marginBottom:'1rem', border:'1px solid var(--t-stone)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
        <div>
          <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 0.25rem' }}>GPS Proximity Override</h3>
          <p style={{ fontSize:'0.82rem', color:'var(--t-slate)', margin:0, lineHeight:1.5 }}>
            {gpsOn
              ? 'GPS is ON - students must be near each animal to unlock it.'
              : 'GPS is OFF - all animals are unlocked regardless of location.'}
          </p>
        </div>
        <button onClick={toggleGPS} disabled={gpsLoading}
          style={{ flexShrink:0, padding:'0.55rem 1.1rem', borderRadius:'var(--t-r-pill)', border:'none', background: gpsOn ? GREEN : '#6B7280', color:'white', fontSize:'0.82rem', fontWeight:700, cursor: gpsLoading ? 'not-allowed' : 'pointer', whiteSpace:'nowrap', opacity: gpsLoading ? 0.7 : 1 }}>
          {gpsLoading ? '…' : gpsOn ? 'Turn GPS Off' : 'Turn GPS On'}
        </button>
      </div>

      {/* Wipe All Data */}
      <div style={{ background:'#FFF5F5', borderRadius:'var(--t-r-lg)', padding:'1.5rem', boxShadow:'var(--t-shadow-sm)', marginBottom:'1rem', border:'1px solid #FCA5A5' }}>
        <h3 style={{ fontSize:'1rem', fontWeight:700, color:'#B91C1C', margin:'0 0 0.35rem' }}>Wipe All Data</h3>
        <p style={{ fontSize:'0.82rem', color:'#B91C1C', margin:'0 0 1rem', lineHeight:1.5 }}>
          Permanently deletes ALL classes and student data from the database. This cannot be undone.
        </p>
        {wipeStep === 0 && (
          <button onClick={() => setWipeStep(1)}
            style={{ padding:'0.65rem 1.5rem', borderRadius:'var(--t-r-sm)', border:'none', background:'#DC2626', color:'white', fontSize:'0.88rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
            Wipe All Test Data
          </button>
        )}
        {wipeStep === 1 && (
          <div>
            <p style={{ fontSize:'0.8rem', color:'#7F1D1D', marginBottom:'0.5rem', fontWeight:600 }}>
              Type <strong>WIPE</strong> to confirm:
            </p>
            <input
              value={wipeConfirm}
              onChange={e => setWipeConfirm(e.target.value)}
              placeholder="WIPE"
              style={{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid #FCA5A5', fontSize:'0.95rem', fontFamily:'DM Sans, sans-serif', marginBottom:'0.75rem', boxSizing:'border-box', outline:'none', textTransform:'uppercase', letterSpacing:'0.1em' }}
            />
            <div style={{ display:'flex', gap:'0.6rem' }}>
              <button onClick={() => { setWipeStep(0); setWipeConfirm(''); }}
                style={{ flex:1, padding:'0.65rem', borderRadius:'var(--t-r-sm)', border:'1px solid var(--t-stone)', background:'white', color:'var(--t-slate)', fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>
                Cancel
              </button>
              <button onClick={wipeAllData} disabled={wiping || wipeConfirm.trim().toUpperCase() !== 'WIPE'}
                style={{ flex:1, padding:'0.65rem', borderRadius:'var(--t-r-sm)', border:'none', background: wipeConfirm.trim().toUpperCase() === 'WIPE' ? '#DC2626' : '#CCC', color:'white', fontSize:'0.85rem', fontWeight:700, cursor: wiping || wipeConfirm.trim().toUpperCase() !== 'WIPE' ? 'not-allowed' : 'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                {wiping ? 'Wiping…' : 'Confirm Wipe'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-lg)', padding:'1.25rem 1.5rem', border:'1px solid var(--t-stone)', textAlign:'center' }}>
        <p style={{ fontSize:'0.82rem', color:'var(--t-slate)', margin:0, fontStyle:'italic' }}>More controls coming soon.</p>
      </div>
    </div>
  );
}

// ─── Tab: Users ──────────────────────────────────────────────────────────────
function UsersTab({ classes }) {
  const [copied,          setCopied]          = useState(false);
  const [profiles,        setProfiles]        = useState({});
  const [profLoading,     setProfLoading]     = useState(true);
  const [registeredEmails, setRegisteredEmails] = useState([]);

  // Load all registered teacher accounts from the teachers collection
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'teachers'));
        if (!cancelled) {
          setRegisteredEmails(snap.docs.map(d => (d.data().email || d.id).toLowerCase()));
        }
      } catch { /* non-fatal */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const teachers = useMemo(() => {
    const map = {};
    // Seed from all registered accounts first (so sign-ups with no class appear)
    registeredEmails.forEach(email => {
      if (!map[email]) map[email] = { email, schools: new Set(), classCount: 0 };
    });
    // Overlay with class data
    classes.forEach(cls => {
      if (!cls.teacherEmail) return;
      const key = cls.teacherEmail.toLowerCase();
      if (!map[key]) map[key] = { email: cls.teacherEmail, schools: new Set(), classCount: 0 };
      if (cls.schoolName) map[key].schools.add(cls.schoolName);
      map[key].classCount++;
    });
    return Object.values(map)
      .map(t => ({ ...t, schools: [...t.schools] }))
      .sort((a, b) => a.email.localeCompare(b.email));
  }, [classes, registeredEmails]);

  useEffect(() => {
    if (!teachers.length) { setProfLoading(false); return; }
    let cancelled = false;
    (async () => {
      setProfLoading(true);
      const profs = {};
      await Promise.all(teachers.map(async t => {
        try {
          const snap = await getDoc(doc(db, 'teachers', t.email));
          profs[t.email] = { commsOptIn: snap.exists() ? (snap.data().commsOptIn ?? null) : null };
        } catch { profs[t.email] = { commsOptIn: null }; }
      }));
      if (!cancelled) { setProfiles(profs); setProfLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [teachers]);

  const optInEmails = teachers.filter(t => profiles[t.email]?.commsOptIn === true).map(t => t.email);

  const copyEmails = () => {
    if (!optInEmails.length) return;
    navigator.clipboard?.writeText(optInEmails.join(', ')).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--t-deep)', margin:'0 0 0.25rem' }}>Users</h2>
          <p style={{ color:'var(--t-slate)', fontSize:'0.85rem', margin:0 }}>
            {teachers.length} registered teacher{teachers.length !== 1 ? 's' : ''} across {classes.length} class{classes.length !== 1 ? 'es' : ''}.
          </p>
        </div>
        <button onClick={copyEmails} disabled={!optInEmails.length}
          style={{ padding:'0.5rem 1.1rem', borderRadius:'var(--t-r-pill)', border:'none', background: copied ? '#22C55E' : optInEmails.length ? GREEN : '#CCC', color:'white', fontWeight:700, fontSize:'0.82rem', cursor: optInEmails.length ? 'pointer' : 'not-allowed', transition:'background 0.2s', whiteSpace:'nowrap' }}>
          {copied ? `✓ Copied ${optInEmails.length} email${optInEmails.length !== 1 ? 's' : ''}!` : `Copy Opted-In Emails (${optInEmails.length})`}
        </button>
      </div>

      <div style={{ background:'var(--t-foam)', border:'1px solid var(--t-mist)', borderRadius:'var(--t-r-md)', padding:'0.75rem 1rem', fontSize:'0.8rem', color:'var(--t-slate)', lineHeight:1.6 }}>
        <strong style={{ color:'var(--t-deep)' }}>Communication consent</strong> is collected at sign-up. The "Copy Opted-In Emails" button only includes teachers who have explicitly opted in. Teachers marked <strong>No Contact</strong> or with no preference on record are excluded.
      </div>

      {teachers.length === 0 ? (
        <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'2rem', textAlign:'center', color:'var(--t-ash)', fontSize:'0.88rem' }}>
          No registered users yet.
        </div>
      ) : (
        <div style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
            <thead>
              <tr style={{ background:'var(--t-chalk)', borderBottom:'2px solid var(--t-mist)' }}>
                {['Email', 'School(s)', 'Classes', 'Comms'].map(h => (
                  <th key={h} style={{ padding:'0.65rem 1rem', textAlign: h==='Classes'||h==='Comms' ? 'center' : 'left', fontSize:'0.62rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, i) => {
                const optIn = profLoading ? null : (profiles[t.email]?.commsOptIn ?? null);
                return (
                  <tr key={t.email} style={{ borderBottom:'1px solid var(--t-mist)', background: i%2===0 ? 'transparent' : 'var(--t-chalk)' }}>
                    <td style={{ padding:'0.75rem 1rem', fontWeight:600, color:'var(--t-deep)' }}>{t.email}</td>
                    <td style={{ padding:'0.75rem 1rem', color:'var(--t-slate)', fontSize:'0.82rem' }}>
                      {t.schools.length > 0 ? t.schools.join(', ') : <span style={{ color:'var(--t-ash)' }}> - </span>}
                    </td>
                    <td style={{ padding:'0.75rem 1rem', color:'var(--t-mid)', fontWeight:700, textAlign:'center' }}>{t.classCount}</td>
                    <td style={{ padding:'0.75rem 1rem', textAlign:'center' }}>
                      {profLoading ? (
                        <span style={{ color:'var(--t-ash)', fontSize:'0.75rem' }}>…</span>
                      ) : optIn === true ? (
                        <span style={{ background:'#F0FDF4', color:'#16A34A', border:'1px solid #BBF7D0', borderRadius:999, padding:'0.15rem 0.6rem', fontSize:'0.68rem', fontWeight:700 }}>Opted In</span>
                      ) : (
                        <span style={{ background:'#FEF2F2', color:'#DC2626', border:'1px solid #FECACA', borderRadius:999, padding:'0.15rem 0.6rem', fontSize:'0.68rem', fontWeight:700 }}>No Contact</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboardScreen() {
  const { setCurrentScreen, adminAccessCode, setAdminAccessCode, setSelectedAdminClass } = useApp();

  const [tab, setTab] = useState('overview');

  // Classes data
  const [classes,  setClasses]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Daily code
  const [dailyCode,        setDailyCode]        = useState(null);
  const [generatingDaily,  setGeneratingDaily]  = useState(false);
  const [codeDeactivated,  setCodeDeactivated]  = useState(false);

  // Night code
  const [nightCode,        setNightCode]        = useState('');
  const [creatingNight,    setCreatingNight]    = useState(false);

  // Load all classes with student counts
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'classes'));
        const results = await Promise.all(snap.docs.map(async classDoc => {
          const d = classDoc.data();
          try {
            const studentsSnap = await getDocs(collection(db, 'classes', classDoc.id, 'students'));
            let completedCount=0, quizSum=0, quizCount=0, totalBadges=0;
            const hasZzStudents = studentsSnap.docs.some(s => s.data().zzSessionComplete === true || s.data().zoosnooz);
            studentsSnap.docs.forEach(studentDoc => {
              const sd = studentDoc.data();
              const isComplete = sd.completed === true || sd.zzSessionComplete === true;
              if (isComplete) {
                completedCount++;
                let qPct = null;
                if (sd.zoosnooz && typeof sd.zoosnooz === 'object') {
                  const attempted = ZOOSNOOZ_ANIMALS.filter(a => sd.zoosnooz[a.id]?.quizCorrect !== undefined);
                  if (attempted.length > 0) {
                    const correct = attempted.filter(a => sd.zoosnooz[a.id].quizCorrect === true).length;
                    qPct = Math.round((correct / attempted.length) * 100);
                  }
                }
                if (qPct === null) qPct = sd.quizPercent ?? sd.quizPercentage ?? null;
                if (qPct !== null) { quizSum += qPct; quizCount++; }
              }
              totalBadges += sd.badges?.length || 0;
            });
            return {
              classCode: classDoc.id, className: d.className || '',
              schoolName: d.schoolName || '', teacherEmail: d.teacherEmail || '',
              stage: d.stage ?? null, yearGroup: d.yearGroup || '',
              sessionType: d.sessionType || (hasZzStudents ? 'zoosnooz' : 'standard'),
              location: d.location || null, subject: d.subject || null,
              studentCount: studentsSnap.size, completedCount,
              completionPercent: studentsSnap.size > 0 ? Math.round((completedCount/studentsSnap.size)*100) : 0,
              quizAverage: quizCount > 0 ? Math.round(quizSum/quizCount) : null,
              totalBadges, createdAt: d.createdAt || null,
            };
          } catch { return null; }
        }));
        if (!cancelled) { setClasses(results.filter(Boolean)); setLoading(false); }
      } catch (e) {
        console.error('Admin fetch error:', e);
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load current daily code - only pick it up if it hasn't expired yet
  useEffect(() => {
    const now = new Date();
    getDocs(query(collection(db, 'accessCodes'), where('active', '==', true)))
      .then(snap => {
        const daily = snap.docs.find(d => {
          if (!d.id.startsWith('ROAR-')) return false;
          const exp = d.data().expiresAt?.toDate?.() ?? (d.data().expiresAt ? new Date(d.data().expiresAt) : null);
          return exp && exp > now;
        });
        if (daily) setDailyCode({ id: daily.id, ...daily.data() });
      }).catch(() => {});
  }, []);

  const generateDailyCode = async () => {
    setGeneratingDaily(true);
    try {
      const newCode = 'ROAR-' + Math.floor(1000 + Math.random() * 9000);
      const expires = new Date();
      expires.setHours(23, 59, 59, 999);
      const activeSnap = await getDocs(query(collection(db, 'accessCodes'), where('active', '==', true)));
      const batch = writeBatch(db);
      activeSnap.docs.forEach(d => batch.update(d.ref, { active: false }));
      batch.set(doc(db, 'accessCodes', newCode), {
        active: true, expiresAt: expires, createdAt: serverTimestamp(),
        venue: 'Taronga Sydney', uses: 0, maxUses: 999,
      });
      await batch.commit();
      setDailyCode({ id: newCode, active: true, expiresAt: expires });
      setCodeDeactivated(true);
      setTimeout(() => setCodeDeactivated(false), 2500);
    } catch (e) { alert('Error generating daily code'); }
    finally { setGeneratingDaily(false); }
  };

  const createNightCode = async () => {
    setCreatingNight(true);
    setNightCode('');
    try {
      const code = generateCode();
      const expires = new Date();
      expires.setDate(expires.getDate() + 1);
      await setDoc(doc(db, 'accessCodes', code), {
        active: true, sessionType: 'zoosnooz',
        venue: 'Taronga Zoo', uses: 0, maxUses: 50,
        createdBy: adminAccessCode, createdAt: serverTimestamp(), expiresAt: expires,
      });
      setNightCode(code);
    } catch (e) { alert('Failed to generate code: ' + e.message); }
    finally { setCreatingNight(false); }
  };

  const tabs = ['overview', 'analytics', 'zoosnooz', 'review', 'users', 'controlRoom'];
  const tabLabels = { overview:'Overview', analytics:'Analytics', zoosnooz:'🌙 ZooSnooz', review:'Review', users:'Users', controlRoom:'🔒 Control Room' };

  return (
    <div style={{ position:'fixed', inset:0, background:'var(--t-canvas)', display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,var(--t-forest) 0%,var(--t-deep) 60%,var(--t-mid) 100%)', padding:'0.85rem 1.5rem', boxShadow:'var(--t-shadow-md)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0, borderBottom:'1px solid rgba(255,255,255,0.07)', flexWrap:'wrap', gap:'0.75rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.85rem' }}>
          <img src="/images/logo.png" alt="" style={{ height:'40px', width:'auto', filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} onError={e=>e.target.style.display='none'} />
          <div>
            <h1 className="taronga-title" style={{ fontSize:'clamp(1.1rem, 2.5vw, 1.35rem)', color:'white', lineHeight:1.15, letterSpacing:'0.04em' }}>Taronga Staff Portal</h1>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.7rem', marginTop:'0.1rem' }}>Educational insights & program management</p>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
          {/* Daily code */}
          {(() => {
            const exp = dailyCode?.expiresAt?.toDate?.() ?? (dailyCode?.expiresAt ? new Date(dailyCode.expiresAt) : null);
            const isLive = dailyCode && exp && exp > new Date();
            return (
              <div style={{ background:'rgba(255,255,255,0.10)', border:'1px solid rgba(255,255,255,0.18)', padding:'0.4rem 0.85rem', borderRadius:'var(--t-r-pill)', color:'white', display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.78rem', fontWeight:600 }}>
                🔑 Daily Code: {isLive ? (
                  <>
                    <strong style={{ letterSpacing:'0.05em' }}>{dailyCode.id}</strong>
                    <span style={{ opacity:0.8 }}>(Exp. 11:59pm)</span>
                    <button onClick={generateDailyCode} disabled={generatingDaily} style={{ padding:'2px 8px', borderRadius:'10px', border:'none', cursor:'pointer', background:'rgba(255,255,255,0.25)', color:'white', fontWeight:700, fontSize:'0.72rem' }}>
                      {generatingDaily ? '…' : 'Regenerate'}
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ opacity:0.7 }}>{dailyCode ? 'Expired' : 'No active code'}</span>
                    <button onClick={generateDailyCode} disabled={generatingDaily} style={{ padding:'2px 8px', borderRadius:'10px', border:'none', cursor:'pointer', background:'white', color:'#1A5238', fontWeight:700, fontSize:'0.72rem' }}>
                      {generatingDaily ? '…' : 'Generate'}
                    </button>
                  </>
                )}
              </div>
            );
          })()}

          {/* Night code */}
          <div style={{ background:'rgba(0,0,0,0.85)', border:'1px solid rgba(46,125,85,0.45)', padding:'0.4rem 0.85rem', borderRadius:'var(--t-r-pill)', color:'white', display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.78rem', fontWeight:600 }}>
            🌙 {nightCode ? (
              <>
                <strong onClick={()=>navigator.clipboard?.writeText(nightCode)} title="Tap to copy" style={{ fontFamily:'monospace', fontSize:'0.9rem', cursor:'pointer', letterSpacing:'0.1em' }}>{nightCode}</strong>
                <span style={{ opacity:0.7, fontSize:'0.72rem' }}>Night Code</span>
                <button onClick={()=>setNightCode('')} style={{ padding:'2px 7px', borderRadius:'8px', border:'none', cursor:'pointer', background:'rgba(255,255,255,0.15)', color:'white', fontWeight:700, fontSize:'0.72rem' }}>✕</button>
              </>
            ) : (
              <>
                <span style={{ opacity:0.7, fontSize:'0.76rem' }}>Night Session</span>
                <button onClick={createNightCode} disabled={creatingNight} style={{ padding:'3px 10px', borderRadius:'10px', border:'none', cursor:'pointer', background:'#2E7D55', color:'white', fontWeight:700, fontSize:'0.76rem' }}>
                  {creatingNight ? '…' : 'Generate'}
                </button>
              </>
            )}
          </div>

          {codeDeactivated && <div style={{ fontSize:'0.75rem', color:'#A8F0C8', fontWeight:600 }}>✓ Code updated.</div>}

          <button onClick={()=>{setAdminAccessCode('');setCurrentScreen('home');}}
            style={{ background:'rgba(255,255,255,0.10)', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.88)', padding:'0.4rem 0.85rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background:'var(--t-chalk)', borderBottom:'1px solid var(--t-stone)', padding:'0 1.5rem', flexShrink:0, boxShadow:'0 1px 4px rgba(7,30,20,0.05)' }}>
        <div style={{ maxWidth:'960px', margin:'0 auto', display:'flex', gap:0, overflowX:'auto' }}>
          {tabs.map(t => (
            <button key={t} onClick={()=>setTab(t)}
              style={{ padding:'0.85rem 1.1rem', background:'none', border:'none',
                borderBottom: tab===t ? `2.5px solid ${t==='controlRoom'?'#2E7D55':'var(--t-mid)'}` : '2.5px solid transparent',
                color: tab===t ? (t==='controlRoom'?'#2E7D55':'var(--t-deep)') : 'var(--t-slate)',
                fontSize:'0.85rem', fontWeight: tab===t ? 700 : 500, cursor:'pointer',
                transition:'color 0.18s, border-color 0.18s', fontFamily:'DM Sans, sans-serif',
                whiteSpace:'nowrap', letterSpacing:'0.01em' }}>
              {tabLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'1.25rem 1.5rem' }}>
        <div style={{ maxWidth:'960px', margin:'0 auto' }}>
          {tab === 'overview'    && <OverviewTab classes={classes} loading={loading} onClassClick={code=>{setSelectedAdminClass(code);setCurrentScreen('adminClassView');}} />}
          {tab === 'analytics'   && <AnalyticsTab classes={classes} />}
          {tab === 'zoosnooz'    && <ZooSnoozAdminTab classes={classes} />}
          {tab === 'review'      && <ReviewTab classes={classes} />}
          {tab === 'users'       && <UsersTab classes={classes} />}
          {tab === 'controlRoom' && <ControlRoomTab adminAccessCode={adminAccessCode} />}
        </div>
      </div>
    </div>
  );
}
