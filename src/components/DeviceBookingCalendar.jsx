import { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const DEVICE_CAPACITY = 20;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const toKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const todayKey = () => { const t = new Date(); return toKey(t.getFullYear(), t.getMonth(), t.getDate()); };

// mode: 'teacher' (book + cancel own) | 'staff' (view + cancel any)
export default function DeviceBookingCalendar({ mode, teacherEmail = '', schoolName = '' }) {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);   // date key
  const [devices, setDevices]   = useState(20);
  const [school, setSchool]     = useState(schoolName);
  const [note, setNote]         = useState('');
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => { setSchool(schoolName); }, [schoolName]);

  useEffect(() => {
    return onSnapshot(collection(db, 'deviceBookings'), snap => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const byDate = useMemo(() => {
    const map = {};
    bookings.forEach(b => { (map[b.date] = map[b.date] || []).push(b); });
    return map;
  }, [bookings]);

  const firstDow  = (new Date(year, month, 1).getDay() + 6) % 7;  // Monday first
  const daysInMon = new Date(year, month + 1, 0).getDate();
  const tKey      = todayKey();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelected(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelected(null); };

  const selectedBookings = selected ? (byDate[selected] || []) : [];
  const selectedUsed     = selectedBookings.reduce((s, b) => s + (b.devices || 0), 0);
  const selectedLeft     = DEVICE_CAPACITY - selectedUsed;

  const book = async () => {
    const n = parseInt(devices, 10);
    if (!school.trim()) { setError('Please enter your school name.'); return; }
    if (isNaN(n) || n < 1) { setError('Enter how many devices you need.'); return; }
    if (n > selectedLeft) { setError(`Only ${selectedLeft} devices are available on this date.`); return; }
    setSaving(true); setError('');
    try {
      await addDoc(collection(db, 'deviceBookings'), {
        date: selected,
        schoolName: school.trim(),
        teacherEmail,
        devices: n,
        note: note.trim(),
        createdAt: serverTimestamp(),
      });
      setNote('');
      setSelected(null);
    } catch (e) {
      setError('Booking failed: ' + e.message);
    }
    setSaving(false);
  };

  const cancel = async (b) => {
    if (!window.confirm(`Cancel the booking for ${b.schoolName} (${b.devices} devices) on ${b.date}?`)) return;
    try { await deleteDoc(doc(db, 'deviceBookings', b.id)); } catch (e) { alert('Cancel failed: ' + e.message); }
  };

  return (
    <div>
      {/* Month header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.9rem' }}>
        <button onClick={prevMonth} style={{ width:'32px', height:'32px', borderRadius:'50%', border:'1px solid var(--t-stone)', background:'white', cursor:'pointer', fontSize:'0.9rem', color:'var(--t-deep)' }}>‹</button>
        <div className="taronga-title" style={{ fontSize:'1.3rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.04em' }}>{MONTHS[month]} {year}</div>
        <button onClick={nextMonth} style={{ width:'32px', height:'32px', borderRadius:'50%', border:'1px solid var(--t-stone)', background:'white', cursor:'pointer', fontSize:'0.9rem', color:'var(--t-deep)' }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'4px', marginBottom:'4px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign:'center', fontSize:'0.6rem', fontWeight:800, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.08em', padding:'0.3rem 0' }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'4px' }}>
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMon }).map((_, i) => {
          const d = i + 1;
          const key   = toKey(year, month, d);
          const dow   = (firstDow + i) % 7;
          const isWknd = dow >= 5;
          const isPast = key < tKey;
          const dayBookings = byDate[key] || [];
          const used  = dayBookings.reduce((s, b) => s + (b.devices || 0), 0);
          const left  = DEVICE_CAPACITY - used;
          const full  = left <= 0;
          const clickable = !isPast || dayBookings.length > 0;
          const isSel = selected === key;

          return (
            <div key={key}
              onClick={() => { if (!isPast || dayBookings.length > 0) { setSelected(isSel ? null : key); setError(''); } }}
              style={{
                minHeight:'72px', borderRadius:'10px', padding:'0.35rem 0.4rem',
                border:`1.5px solid ${isSel ? 'var(--t-mid)' : dayBookings.length ? '#A8C4B2' : 'var(--t-stone)'}`,
                background: isPast ? '#F4F1EB' : full ? '#FEF2F2' : dayBookings.length ? 'var(--t-foam)' : 'white',
                opacity: isPast ? 0.55 : 1,
                cursor: clickable ? 'pointer' : 'default',
                transition:'border-color 0.15s, box-shadow 0.15s',
                boxShadow: isSel ? '0 4px 14px rgba(26,82,56,0.2)' : 'none',
                position:'relative', overflow:'hidden',
              }}>
              <div style={{ fontSize:'0.68rem', fontWeight:800, color: isWknd ? 'var(--t-ash)' : 'var(--t-deep)' }}>{d}</div>
              {dayBookings.slice(0, 2).map(b => (
                <div key={b.id} title={`${b.schoolName} · ${b.devices} devices`}
                  style={{ fontSize:'0.54rem', fontWeight:700, color:'var(--t-mid)', lineHeight:1.25, marginTop:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {b.schoolName}
                </div>
              ))}
              {dayBookings.length > 2 && <div style={{ fontSize:'0.52rem', color:'var(--t-slate)', marginTop:'1px' }}>+{dayBookings.length - 2} more</div>}
              {full && !isPast && (
                <div style={{ position:'absolute', bottom:'3px', right:'5px', fontSize:'0.5rem', fontWeight:800, color:'#DC2626', textTransform:'uppercase', letterSpacing:'0.06em' }}>Full</div>
              )}
              {!full && dayBookings.length > 0 && !isPast && (
                <div style={{ position:'absolute', bottom:'3px', right:'5px', fontSize:'0.5rem', fontWeight:700, color:'var(--t-slate)' }}>{left} left</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected day panel */}
      {selected && (
        <div style={{ marginTop:'1rem', background:'white', border:'1px solid var(--t-stone)', borderTop:'3px solid var(--t-mid)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.15rem 1.3rem' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:'0.75rem', flexWrap:'wrap', marginBottom:'0.75rem' }}>
            <div style={{ fontSize:'0.92rem', fontWeight:800, color:'var(--t-deep)' }}>
              {new Date(selected + 'T00:00:00').toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color: selectedLeft > 0 ? 'var(--t-mid)' : '#DC2626' }}>
              {selectedLeft > 0 ? `${selectedLeft} of ${DEVICE_CAPACITY} devices available` : 'Fully booked'}
            </div>
          </div>

          {selectedBookings.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'0.85rem' }}>
              {selectedBookings.map(b => {
                const canCancel = mode === 'staff' || b.teacherEmail === teacherEmail;
                return (
                  <div key={b.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.6rem', background:'var(--t-foam)', borderRadius:'10px', padding:'0.5rem 0.75rem' }}>
                    <div style={{ minWidth:0 }}>
                      <span style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)' }}>{b.schoolName}</span>
                      <span style={{ fontSize:'0.7rem', color:'var(--t-slate)', marginLeft:'0.5rem' }}>{b.devices} devices{mode === 'staff' && b.teacherEmail ? ` · ${b.teacherEmail}` : ''}</span>
                      {mode === 'staff' && b.note && <div style={{ fontSize:'0.68rem', color:'var(--t-slate)', fontStyle:'italic', marginTop:'1px' }}>"{b.note}"</div>}
                    </div>
                    {canCancel && (
                      <button onClick={() => cancel(b)} style={{ flexShrink:0, fontSize:'0.66rem', fontWeight:700, color:'#DC2626', background:'none', border:'1px solid #FCA5A5', borderRadius:999, padding:'0.22rem 0.65rem', cursor:'pointer' }}>Cancel</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Booking form (teachers, future dates with capacity) */}
          {mode === 'teacher' && selected >= tKey && selectedLeft > 0 && (
            <div style={{ borderTop: selectedBookings.length ? '1px solid var(--t-foam)' : 'none', paddingTop: selectedBookings.length ? '0.85rem' : 0 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 110px', gap:'0.6rem', marginBottom:'0.6rem' }}>
                <input value={school} onChange={e => setSchool(e.target.value)} placeholder="School name"
                  style={{ padding:'0.55rem 0.8rem', borderRadius:'10px', border:'1.5px solid var(--t-stone)', fontSize:'0.8rem', fontFamily:'inherit', outline:'none' }} />
                <input type="number" min="1" max={selectedLeft} value={devices} onChange={e => setDevices(e.target.value)} placeholder="Devices"
                  style={{ padding:'0.55rem 0.8rem', borderRadius:'10px', border:'1.5px solid var(--t-stone)', fontSize:'0.8rem', fontFamily:'inherit', outline:'none' }} />
              </div>
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Anything we should know? (optional)"
                style={{ width:'100%', boxSizing:'border-box', padding:'0.55rem 0.8rem', borderRadius:'10px', border:'1.5px solid var(--t-stone)', fontSize:'0.8rem', fontFamily:'inherit', outline:'none', marginBottom:'0.6rem' }} />
              {error && <p style={{ margin:'0 0 0.6rem', fontSize:'0.72rem', color:'#DC2626', fontWeight:600 }}>{error}</p>}
              <button onClick={book} disabled={saving}
                style={{ width:'100%', padding:'0.65rem', borderRadius:999, border:'none', background:'var(--t-mid)', color:'white', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Booking…' : `Book ${devices || ''} device${parseInt(devices, 10) === 1 ? '' : 's'} for this date`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
