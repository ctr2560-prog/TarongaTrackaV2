import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

const MEDAL = ['🥇','🥈','🥉'];

export default function PublicLeaderboardScreen() {
  const { setCurrentScreen } = useApp();
  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all'); // all | today | week

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'classes'));
        const rows = [];
        for (const classDoc of snap.docs) {
          const studentsSnap = await getDocs(
            query(collection(db, 'classes', classDoc.id, 'students'), where('completed', '==', true))
          );
          studentsSnap.docs.forEach(d => {
            const s = d.data();
            if ((s.totalPoints || 0) > 0) {
              rows.push({
                name:       s.name || d.id,
                points:     s.totalPoints || 0,
                badges:     s.badges?.length || 0,
                school:     classDoc.data().schoolName || '',
                completedAt: s.completedAt?.toDate?.() || null,
              });
            }
          });
        }
        if (!cancelled) setEntries(rows.sort((a,b) => b.points - a.points).slice(0, 50));
      } catch (e) {
        console.warn('Leaderboard fetch:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const now = new Date();
  const filtered = entries.filter(e => {
    if (filter === 'all' || !e.completedAt) return true;
    const diffDays = (now - e.completedAt) / (1000 * 60 * 60 * 24);
    return filter === 'today' ? diffDays < 1 : diffDays < 7;
  });

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,var(--jungle-deep) 0%,var(--jungle-mid) 100%)', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ padding:'0.85rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <button onClick={() => setCurrentScreen('publicAnimal')} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.45rem 1rem', borderRadius:999, fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
          ← Back
        </button>
        <div style={{ display:'flex', gap:'0.35rem' }}>
          {[['all','All Time'],['week','This Week'],['today','Today']].map(([val,label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ padding:'0.35rem 0.75rem', borderRadius:999, border:'none', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', background: filter===val ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)', color:'white' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div style={{ padding:'0 1.25rem 1rem', flexShrink:0, textAlign:'center' }}>
        <div style={{ fontSize:'2rem', marginBottom:'0.2rem' }}>🏆</div>
        <h2 style={{ color:'white', margin:0, fontSize:'1.4rem', fontWeight:800 }}>Top Explorers</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', margin:'0.2rem 0 0', fontSize:'0.8rem' }}>Students who completed the Taronga Tracka activity</p>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 1.25rem 2rem' }}>
        <div style={{ maxWidth:480, margin:'0 auto', display:'flex', flexDirection:'column', gap:'0.5rem' }}>

          {loading && (
            <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.4)' }}>
              <div style={{ width:32, height:32, border:'3px solid rgba(255,255,255,0.15)', borderTop:'3px solid rgba(255,255,255,0.6)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 0.75rem' }} />
              Loading leaderboard…
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>🌿</div>
              <p style={{ margin:0 }}>No completed activities {filter !== 'all' ? 'in this period' : 'yet'}.</p>
            </div>
          )}

          {!loading && filtered.map((entry, i) => {
            const isTop3 = i < 3;
            return (
              <div key={i} style={{ background: isTop3 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)', border:`1px solid ${isTop3 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`, borderRadius:14, padding:'0.85rem 1rem', display:'flex', alignItems:'center', gap:'0.85rem' }}>
                <div style={{ width:32, textAlign:'center', fontSize: isTop3 ? '1.3rem' : '0.85rem', fontWeight:700, color:'rgba(255,255,255,0.45)', flexShrink:0 }}>
                  {isTop3 ? MEDAL[i] : `#${i+1}`}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:'white', fontWeight:700, fontSize:'0.92rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{entry.name}</div>
                  {entry.school && <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.7rem', marginTop:'0.1rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{entry.school}</div>}
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ color:'#F59E0B', fontWeight:800, fontSize:'1rem' }}>{entry.points}</div>
                  <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.65rem' }}>{entry.badges} badge{entry.badges !== 1 ? 's' : ''}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
