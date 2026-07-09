import { useApp } from '../context/AppContext';
import DeviceBookingCalendar, { DEVICE_CAPACITY } from '../components/DeviceBookingCalendar';

export default function DeviceBookingScreen() {
  const { setCurrentScreen, teacherEmail, teacherProfile } = useApp();

  return (
    <div className="lms-page">

      {/* Top bar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <button onClick={() => setCurrentScreen('excursionPlan')} style={{ background:'var(--t-foam)', border:'1.5px solid var(--t-stone)', color:'var(--t-charcoal)', padding:'0.45rem 0.95rem', borderRadius:'var(--t-r-sm)', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, flexShrink:0, fontFamily:'inherit' }}>
            ← Back
          </button>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>DEVICE BOOKINGS</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · Book Taronga Tracka devices for your visit</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto', padding:'1.75rem 1.5rem 3rem' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto' }}>

          <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
            Book Tracka Devices
          </h2>
          <p style={{ margin:'0.35rem 0 1rem', fontSize:'0.8rem', color:'var(--t-slate)', fontWeight:500, lineHeight:1.6 }}>
            Taronga has {DEVICE_CAPACITY} Tracka devices available each day. Pick a date, tell us how many you need,
            and the Education team is notified automatically. Bringing your own devices? You don't need a booking here.
          </p>

          <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:'var(--t-r-lg)', padding:'0.85rem 1.1rem', display:'flex', gap:'0.6rem', alignItems:'flex-start', marginBottom:'1.5rem' }}>
            <span style={{ flexShrink:0, fontSize:'0.58rem', fontWeight:800, color:'#B45309', background:'#FDE68A', padding:'0.16rem 0.55rem', borderRadius:999, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:'2px' }}>Important</span>
            <span style={{ fontSize:'0.78rem', color:'#78350F', lineHeight:1.6 }}>
              Booking devices here does not book your zoo visit. For now, please also complete a{' '}
              <a href="https://selfguided.taronga.org.au/School/sydney" target="_blank" rel="noopener noreferrer" style={{ color:'#B45309', fontWeight:800 }}>self-guided tour booking</a>{' '}
              with Taronga - we're working on combining the two.
            </span>
          </div>

          <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.4rem 1.5rem' }}>
            <DeviceBookingCalendar mode="teacher" teacherEmail={teacherEmail} schoolName={teacherProfile?.schoolName || ''} />
          </div>

          <div style={{ textAlign:'center', padding:'1.25rem 1rem 0' }}>
            <p style={{ margin:0, fontSize:'0.76rem', color:'var(--t-slate)' }}>
              Need to change a booking or have questions? <a href="mailto:education@taronga.org.au" style={{ color:'var(--t-mid)', fontWeight:700, textDecoration:'none' }}>education@taronga.org.au</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
