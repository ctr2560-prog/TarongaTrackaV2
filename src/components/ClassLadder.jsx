import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { normaliseCode } from '../utils/helpers';

// Live class ladder, shown on the badge screen. A student asked for it — they wanted to see
// where they sat against the rest of the class as they went.
//
// StudentContext already writes totalPoints to classes/{code}/students/{id} on every badge, so
// this needs no new data — just a listener on that collection.
//
// Students are animal aliases (Wombat, Quokka), never real names, so nobody is publicly ranked
// by name. The student's own row is always rendered, even when they are well down the list, so
// the panel never becomes a wall of other people's scores with no place for them in it.
export default function ClassLadder({ classCode, studentName, myPoints }) {
  const [rows, setRows] = useState(null);   // null = still loading

  useEffect(() => {
    if (!classCode) return;
    const code = normaliseCode(classCode);
    const unsub = onSnapshot(
      collection(db, 'classes', code, 'students'),
      snap => {
        const list = snap.docs
          .map(d => ({ id: d.id, name: d.data().name || d.id, points: d.data().totalPoints || 0 }))
          .filter(r => r.points > 0)
          .sort((a, b) => b.points - a.points);
        setRows(list);
      },
      () => setRows([]),   // offline or blocked: hide rather than error
    );
    return () => unsub();
  }, [classCode]);

  if (!rows || rows.length < 2) return null;   // pointless with nobody to compare against

  // The listener can lag a moment behind the badge that has just been awarded, so trust the
  // in-memory total for the student's own row rather than showing a stale number.
  const merged = rows.map(r =>
    r.name === studentName ? { ...r, points: Math.max(r.points, myPoints ?? 0) } : r
  ).sort((a, b) => b.points - a.points);

  const myIndex = merged.findIndex(r => r.name === studentName);
  const myRank  = myIndex >= 0 ? myIndex + 1 : null;

  // Top three, plus the student themselves if they are not already in it.
  const top = merged.slice(0, 3);
  const showMeSeparately = myIndex >= 3;

  const medal = ['🥇', '🥈', '🥉'];

  const row = (r, i, isMe) => (
    <div key={r.id} style={{
      display:'flex', alignItems:'center', gap:'0.55rem',
      padding:'0.4rem 0.6rem', borderRadius:'var(--t-r-sm)',
      background: isMe ? 'rgba(46,125,85,0.12)' : 'transparent',
      border: isMe ? '1px solid rgba(46,125,85,0.3)' : '1px solid transparent',
    }}>
      <span style={{ width:'1.6rem', flexShrink:0, fontSize: i < 3 ? '0.95rem' : '0.75rem', fontWeight:800, color:'var(--t-slate)', textAlign:'center' }}>
        {i < 3 ? medal[i] : i + 1}
      </span>
      <span style={{ flex:1, minWidth:0, textAlign:'left', fontSize:'0.85rem', fontWeight: isMe ? 800 : 600, color:'var(--t-deep)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {r.name}{isMe && ' (you)'}
      </span>
      <span style={{ flexShrink:0, fontSize:'0.85rem', fontWeight:800, color:'var(--earth-clay)' }}>{r.points}</span>
    </div>
  );

  return (
    <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'0.7rem 0.6rem', marginBottom:'0.75rem', border:'1px solid var(--t-mist)' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'0 0.4rem', marginBottom:'0.35rem' }}>
        <span style={{ fontSize:'0.6rem', fontWeight:800, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Class ladder</span>
        {myRank && (
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--t-mid)' }}>
            You are {myRank}{['st','nd','rd'][((myRank + 90) % 100 - 10) % 10 - 1] || 'th'} of {merged.length}
          </span>
        )}
      </div>
      {top.map((r, i) => row(r, i, r.name === studentName))}
      {showMeSeparately && (
        <>
          <div style={{ textAlign:'center', color:'var(--t-ash)', fontSize:'0.7rem', lineHeight:1 }}>⋯</div>
          {row(merged[myIndex], myIndex, true)}
        </>
      )}
    </div>
  );
}
