import { useState } from 'react';
import { useApp } from '../context/AppContext';

const RESOURCES = [
  {
    category: 'Getting Started',
    color: '#2E7D55',
    items: [
      { title:'Teacher Setup Guide', desc:'Step-by-step instructions for creating a class, generating codes, and running the activity.', type:'PDF', icon:'📋' },
      { title:'Student Quick-Start Card', desc:'One-page printable handout for students - how to join, observe, and earn badges.', type:'PDF', icon:'🎒' },
      { title:'ZooSnooz Facilitation Guide', desc:'Night mode setup, managing NFC stations, and interaction instrument overview.', type:'PDF', icon:'🌙' },
    ],
  },
  {
    category: 'Curriculum Links',
    color: '#0284C7',
    items: [
      { title:'NSW Science & Technology K-6', desc:'Activity mapping to observing, questioning, and recording living things (ST2-4LW-S, ST3-4LW-S).', type:'DOC', icon:'🔬' },
      { title:'Stage 4 Biology: Ecosystems', desc:'Links to NESA outcomes for ecosystem interactions, adaptations, and biodiversity.', type:'DOC', icon:'🌿' },
      { title:'Stage 5 Evolution & Adaptation', desc:'Extended observation tasks and ZooSnooz mission alignment for Stage 5.', type:'DOC', icon:'🧬' },
      { title:'English Literacy Integration', desc:'Observation writing scaffolds, sentence starters, and vocabulary lists.', type:'DOC', icon:'✏️' },
    ],
  },
  {
    category: 'Assessment',
    color: '#D97706',
    items: [
      { title:'Observation Rubric (Stage 2–3)', desc:'Behaviour, detail, and writing scoring criteria for younger students.', type:'PDF', icon:'📊' },
      { title:'Observation Rubric (Stage 4–5)', desc:'Extended rubric for senior secondary with NESA alignment.', type:'PDF', icon:'📊' },
      { title:'Interpreting the Dashboard', desc:'How to read quiz scores, observation sub-scores, and class progress data.', type:'PDF', icon:'📈' },
    ],
  },
  {
    category: 'Classroom Activities',
    color: '#7C3AED',
    items: [
      { title:'Pre-Visit Discussion Cards', desc:'Stimulus questions and animal images to build prior knowledge before the visit.', type:'PDF', icon:'🃏' },
      { title:'Post-Visit Reflection Booklet', desc:'Structured reflection tasks linking observations back to curriculum content.', type:'PDF', icon:'📓' },
      { title:'Digital Presentations (Animals)', desc:'Slides covering adaptations, conservation status, and keeper facts for each species.', type:'PPTX', icon:'📽️' },
    ],
  },
];

const TYPE_COLORS = { PDF:'#DC2626', DOC:'#0284C7', PPTX:'#D97706', VIDEO:'#7C3AED' };

export default function ResourceHubScreen() {
  const { setCurrentScreen } = useApp();
  const [filter, setFilter] = useState('All');
  const [query,  setQuery]  = useState('');

  const categories = ['All', ...RESOURCES.map(r => r.category)];

  const visible = RESOURCES.filter(cat => filter === 'All' || cat.category === filter)
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div style={{ position:'fixed', inset:0, background:'var(--t-foam)', display:'flex', flexDirection:'column', fontFamily:'var(--t-font)' }}>

      {/* Header */}
      <div style={{ background:'var(--t-deep)', color:'white', padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', flexShrink:0 }}>
        <button onClick={() => setCurrentScreen('classDetails')} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.82rem', fontWeight:600, flexShrink:0 }}>
          ← Back
        </button>
        <div>
          <div style={{ fontWeight:800, fontSize:'1.1rem', letterSpacing:'0.03em' }}>Resource Hub</div>
          <div style={{ fontSize:'0.75rem', opacity:0.65, marginTop:'0.05rem' }}>Teaching resources &amp; curriculum materials</div>
        </div>
      </div>

      {/* Search + filter bar */}
      <div style={{ padding:'0.75rem 1.25rem', background:'white', borderBottom:'1px solid var(--t-mist)', flexShrink:0, display:'flex', gap:'0.75rem', alignItems:'center' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search resources…"
          style={{ flex:1, padding:'0.55rem 0.9rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.85rem', fontFamily:'inherit', outline:'none' }}
        />
        <div style={{ display:'flex', gap:'0.35rem', flexShrink:0, overflowX:'auto' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ padding:'0.4rem 0.85rem', borderRadius:999, border:'none', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', background: filter === c ? 'var(--t-mid)' : 'var(--t-foam)', color: filter === c ? 'white' : 'var(--t-slate)', transition:'all 0.15s' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Resource list */}
      <div style={{ flex:1, overflowY:'auto', padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
        {visible.length === 0 && (
          <div style={{ textAlign:'center', padding:'3rem', color:'var(--t-ash)' }}>
            <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>🔍</div>
            <p style={{ margin:0 }}>No resources found for "{query}"</p>
          </div>
        )}
        {visible.map(cat => (
          <div key={cat.category}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
              <div style={{ width:4, height:18, borderRadius:2, background:cat.color }} />
              <h3 style={{ margin:0, color:'var(--t-deep)', fontSize:'0.88rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>{cat.category}</h3>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {cat.items.map(item => (
                <div key={item.title} style={{ background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', padding:'0.9rem 1rem', display:'flex', gap:'0.85rem', alignItems:'flex-start', cursor:'pointer', transition:'box-shadow 0.15s' }}
                  onClick={() => alert(`"${item.title}" - resource downloads will be available when connected to the content library.`)}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--t-shadow-sm)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ fontSize:'1.6rem', flexShrink:0, lineHeight:1 }}>{item.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.2rem' }}>
                      <span style={{ fontWeight:700, color:'var(--t-deep)', fontSize:'0.88rem' }}>{item.title}</span>
                      <span style={{ background:`${TYPE_COLORS[item.type] || '#888'}18`, color:TYPE_COLORS[item.type] || '#888', border:`1px solid ${TYPE_COLORS[item.type] || '#888'}40`, borderRadius:999, padding:'0.1rem 0.5rem', fontSize:'0.62rem', fontWeight:700, flexShrink:0 }}>{item.type}</span>
                    </div>
                    <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-slate)', lineHeight:1.55 }}>{item.desc}</p>
                  </div>
                  <div style={{ color:'var(--t-stone)', fontSize:'1rem', flexShrink:0, marginTop:'0.1rem' }}>↓</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Taronga contact footer */}
        <div style={{ background:'linear-gradient(135deg,rgba(26,82,56,0.06),rgba(46,125,85,0.08))', border:'1px solid rgba(46,125,85,0.2)', borderRadius:'var(--t-r-lg)', padding:'1.25rem', textAlign:'center' }}>
          <div style={{ fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem' }}>Need something specific?</div>
          <p style={{ color:'var(--t-slate)', fontSize:'0.82rem', margin:'0 0 0.75rem', lineHeight:1.6 }}>Our Education team can provide additional resources, custom curriculum mapping, or support for your excursion.</p>
          <a href="mailto:education@taronga.org.au" style={{ display:'inline-block', background:'var(--t-mid)', color:'white', padding:'0.55rem 1.25rem', borderRadius:'var(--t-r-pill)', fontSize:'0.82rem', fontWeight:700, textDecoration:'none' }}>
            education@taronga.org.au
          </a>
        </div>
      </div>
    </div>
  );
}
