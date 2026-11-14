import { useState, useEffect, useRef } from 'react';
import { collection, doc, onSnapshot, getDocs, getDoc, query, orderBy, limit, where, setDoc, addDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useApp } from '../context/AppContext';
import LegalModal from '../components/LegalModal';
import TeacherHelpBot from '../components/TeacherHelpBot';
import TeacherTutorial from '../components/TeacherTutorial';
import nswSchools from '../data/nswPublicSchools.json';

const MILESTONES = [
  { points: 300,  label: 'Free class zoo visit', reward: true },
  { points: 600,  label: 'Sponsor a habitat' },
  { points: 1000, label: 'Conservation Partner' },
];

const SvgPlus    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SvgLayers  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const SvgHelpCircle = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/></svg>;
const SvgGlobe   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const SvgZap    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const SvgImage  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const SvgFeather = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>;
const SvgBridge  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18h20"/><path d="M5 18V12"/><path d="M19 18V12"/><path d="M5 12Q5 6 12 6Q19 6 19 12"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>;
const SvgNotebook = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 2v20"/><line x1="13" y1="7" x2="17" y2="7"/><line x1="13" y1="11" x2="17" y2="11"/><line x1="13" y1="15" x2="17" y2="15"/></svg>;
const SvgCheck  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const SvgTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const SvgTree  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-6"/><path d="M8 16l4-4 4 4"/><path d="M6 12l6-6 6 6"/><path d="M4 8l8-6 8 6"/></svg>;
const SvgSearch = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>;
const SvgMoon   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const SvgSchool = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SvgStar  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const SvgBook  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const SvgCompass = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
const SvgList  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="0.5" fill="currentColor"/><circle cx="3" cy="12" r="0.5" fill="currentColor"/><circle cx="3" cy="18" r="0.5" fill="currentColor"/></svg>;
const SvgChart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const SvgMail  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;

const SvgUsers = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;

const SvgCalendarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;

const CHALLENGES = [
  { id:'expedition-sydney',   name:'Taronga Sydney',       desc:'Run a Tracka session at Taronga Zoo Sydney.',                                                     points:25, icon:<SvgZap/>,      type:'auto', location:'taronga-sydney'  },
  { id:'expedition-zoosnooz', name:'ZooSnooz Night',       desc:'Lead your class through an after-dark ZooSnooz experience at Taronga Sydney.',                    points:40, icon:<SvgMoon/>,     type:'auto', location:'zoosnooz-sydney' },
  { id:'expedition-dubbo',    name:'Taronga Dubbo',        desc:'Run a Tracka session at Taronga Western Plains Zoo in Dubbo.',                                    points:35, icon:<SvgZap/>,      type:'auto', location:'dubbo'           },
  { id:'expedition-school',   name:'Your School',          desc:'Run a Tracka session on your school grounds.',                                                    points:20, icon:<SvgSchool/>,   type:'auto', location:'school'          },
  { id:'nature-journal',     name:'Nature Journal',            desc:'Students document local wildlife observations in illustrated journals over a week.',                                    points:35, icon:<SvgNotebook/>, type:'submit' },
  { id:'wildlife-poem',      name:'Wildlife Poem',             desc:'Write and illustrate a class poem about a local or endangered species.',                                               points:30, icon:<SvgFeather/>,  type:'submit' },
  { id:'wildlife-posters',   name:'Wildlife Posters',          desc:'Create wildlife awareness posters with your class and display them at school.',                                        points:40, icon:<SvgImage/>,    type:'submit' },
  { id:'clean-up-school',    name:'Clean Up School',           desc:'Organise a litter clean-up around your school grounds.',                                                              points:50, icon:<SvgTrash/>,    type:'submit' },
  { id:'biodiversity-audit', name:'Biodiversity Audit',        desc:'Count and photograph species found near your school and submit your findings.',                                       points:60, icon:<SvgSearch/>,   type:'submit' },
  { id:'plant-a-tree',       name:'Plant a Tree',              desc:'Plant a native tree or shrub in your school grounds.',                                                                points:75, icon:<SvgTree/>,     type:'submit' },
  { id:'wildlife-crossing',  name:'Wildlife Crossing Design',  desc:'Design and model a wildlife corridor or road crossing for a local species, then present it to the class.',           points:80, icon:<SvgBridge/>,   type:'submit' },
];

const MONTHLY_CHALLENGE = { id:'monthly-june-2026', name:'June Challenge — Habitat Heroes', desc:'Document three different animal habitats near your school with photos and a short description.', points:100, icon:<SvgStar/> };

// ── Dashboard redesign (2026-11-13) ─────────────────────────────────────────────
// Programme identity for each class card. ⚠️ 'standard' and an ABSENT sessionType both mean
// Tracka Trek (see CLAUDE.md, Programme names); the listener already defaults absent to 'standard'.
const PROGRAMMES = {
  standard:         { key:'trek', label:'Tracka Trek',    color:'#2E7D55' },
  zoosnooz:         { key:'snooz', label:'ZooSnooz',       color:'#7FA7E0', night:true },
  zooyard:          { key:'yard', label:'ZooYard',        color:'#6E8B2A' },
  evolve:           { key:'evolve', label:'Evolve',         color:'#C08A1E' },
  'wildest-dreams': { key:'dreams', label:'Wildest Dreams', color:'#B4536E' },
};
function programmeOf(cls) {
  if (cls.location === 'zoosnooz-sydney') return PROGRAMMES.zoosnooz;
  return PROGRAMMES[cls.sessionType] || PROGRAMMES.standard;
}
function locationLabel(loc) {
  return { 'taronga-sydney':'Taronga Sydney', 'zoosnooz-sydney':'ZooSnooz', 'dubbo':'Taronga Western Plains, Dubbo', 'school':'Your school grounds' }[loc] || loc || '';
}
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

const PLAN_LINKS = [
  { title:'Book devices',              desc:'Reserve Taronga phones for your visit',   icon:<SvgCalendarIcon/>, screen:'deviceBooking' },
  { title:'Pre and post visit lessons', desc:'Ready-made lessons for before and after', icon:<SvgLayers/>,       screen:'resourceHub' },
  { title:'Excursion planning pack',   desc:'From booking to boarding the bus',        icon:<SvgBook/>,         screen:'excursionPlan' },
  { title:'Zoo map',                   desc:'Where every Tracka animal lives',         icon:<SvgCompass/>,      screen:'teacherMap' },
  { title:'Curriculum alignment',      desc:'NSW syllabus outcomes, mapped',           icon:<SvgList/>,         screen:'curriculumAlignment' },
  { title:'Assessment ideas',          desc:'Evidence from the app, tasks for after',  icon:<SvgChart/>,        screen:'assessmentIdeas' },
  { title:'Accessibility and inclusion', desc:'Supports so every student can take part', icon:<SvgUsers/>,      screen:'accessibility' },
  { title:'Conservation in action',    desc:'What other schools have done',            icon:<SvgTree/>,         screen:'conservationGallery' },
  { title:'How-to guides',             desc:'Setting up, running and reviewing a class', icon:<SvgHelpCircle/>, screen:'teacherGuide' },
  { title:'Book an excursion',         desc:'Opens taronga.org.au',                    icon:<SvgGlobe/>,        href:'https://www.taronga.org.au/learn' },
];

// ⚠️ No backticks inside this string — it is a template literal.
const TD_CSS = `
.td-main { background: #F4F6F2; }
.td-inner { max-width: 1180px; margin: 0 auto; }

.td-hero {
  position: relative; overflow: hidden; isolation: isolate;
  display: flex; align-items: flex-end; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
  background: #0A2F1F; color: #fff; border-radius: 22px;
  padding: 2.25rem 2.25rem 2rem; margin-bottom: 2rem; min-height: 230px;
}
.td-hero-photo {
  position: absolute; inset: 0 0 0 38%; z-index: -1;
  background: url('/images/koala.jpg') center 30% / cover no-repeat;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 45%, #000 100%);
          mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 45%, #000 100%);
  opacity: 0.75;
}
.td-hero::after {
  content: ''; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(0deg, rgba(10,47,31,0.75) 0%, rgba(10,47,31,0) 60%);
}
.td-greeting {
  font-family: 'Taronga Headline', 'Bebas Neue', sans-serif; font-weight: 400;
  font-size: clamp(2.4rem, 5vw, 3.6rem); line-height: 0.95; letter-spacing: 0.02em;
  margin: 0 0 0.6rem; color: #fff;
}
.td-hero-sub { margin: 0; font-size: 0.95rem; color: rgba(255,255,255,0.78); display: flex; align-items: center; flex-wrap: wrap; gap: 0 0.6rem; }
.td-sep { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.45); display: inline-block; }
.td-hero-stats { display: flex; gap: 2.25rem; margin: 1.5rem 0 0; padding: 0; flex-wrap: wrap; }
.td-hero-stats div { display: flex; flex-direction: column-reverse; }
.td-hero-stats dt { font-size: 0.78rem; color: rgba(255,255,255,0.62); margin-top: 0.15rem; }
.td-hero-stats dd { margin: 0; font-size: 1.6rem; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.td-hero-cta { flex-shrink: 0; }

.td-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;
  font: inherit; font-size: 0.9rem; font-weight: 700; cursor: pointer;
  padding: 0.75rem 1.25rem; border-radius: 999px; border: 1.5px solid transparent;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.td-btn svg { width: 18px; height: 18px; }
.td-btn:focus-visible, .td-code:focus-visible, .td-class-open:focus-visible, .td-links button:focus-visible,
.td-wildly:focus-visible, .td-class-new:focus-visible, .td-ch-submit:focus-visible { outline: 3px solid #E0A526; outline-offset: 2px; }
.td-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.td-btn-light { background: #fff; color: #0A2F1F; }
.td-btn-light:hover { background: #E8F2EC; }
.td-btn-primary { background: #1A5238; color: #fff; }
.td-btn-primary:hover:not(:disabled) { background: #0A2F1F; }
.td-btn-gold { background: #E0A526; color: #3A2A05; }
.td-btn-gold:hover { background: #CF961C; }
.td-btn-ghost { background: transparent; color: #1A5238; border-color: #CBD8CF; }
.td-btn-ghost:hover { border-color: #1A5238; }

.td-nudge { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; background: #FFF8E6; border: 1px solid #F0D58A; border-radius: 16px; padding: 1.1rem 1.25rem; margin-bottom: 2rem; }
.td-nudge-title { margin: 0; font-weight: 700; color: #5C4306; font-size: 0.92rem; }
.td-nudge-sub { margin: 0.2rem 0 0; color: #7A5B12; font-size: 0.82rem; line-height: 1.5; }
.td-input { width: 100%; box-sizing: border-box; padding: 0.7rem 0.95rem; border-radius: 12px; border: 1.5px solid #E2CF98; font: inherit; font-size: 0.88rem; outline: none; background: #fff; }
.td-input:focus { border-color: #1A5238; }
.td-sugs { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: #fff; border: 1px solid #E2E6DF; border-radius: 12px; box-shadow: 0 12px 32px rgba(10,47,31,0.14); z-index: 20; max-height: 260px; overflow-y: auto; }
.td-sugs button { display: block; width: 100%; text-align: left; padding: 0.55rem 0.9rem; background: none; border: 0; cursor: pointer; font: inherit; }
.td-sugs button:hover { background: #F1F5F1; }
.td-sug-name { display: block; font-size: 0.86rem; color: #14231B; }
.td-sug-sub { display: block; font-size: 0.74rem; color: #8A928C; }
.td-sug-add { border-top: 1px solid #EEF1EC !important; color: #1A5238; font-weight: 700; font-size: 0.84rem; }

.td-section { margin-bottom: 2.25rem; }
.td-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.td-h3 { margin: 0; font-size: 1.3rem; font-weight: 700; color: #0A2F1F; letter-spacing: -0.015em; }
.td-hint { margin: 0; font-size: 0.84rem; color: #6B736D; }
.td-muted { margin: 0; font-size: 0.84rem; color: #8A928C; }

.td-class-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(268px, 1fr)); gap: 1.1rem; }

.td-class-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1rem; }
.td-class {
  --prog: #2E7D55;
  position: relative; display: flex; flex-direction: column;
  background: #fff; border-radius: 20px; padding: 1.25rem 1.35rem 1.2rem;
  border: 1px solid #E2E6DF; box-shadow: 0 1px 2px rgba(10,47,31,0.04);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.td-class:hover { border-color: #BFCDC4; box-shadow: 0 10px 30px rgba(10,47,31,0.08); }
.td-class-open { position: absolute; inset: 0; border: 0; background: none; cursor: pointer; border-radius: 20px; z-index: 0; }
.td-class > *:not(.td-class-open) { position: relative; z-index: 1; pointer-events: none; }
.td-class .td-code { pointer-events: auto; }
.td-class-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.7rem; }
.td-prog { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; font-weight: 700; color: #3C4A41; }
.td-prog-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--prog); }
.td-stage { font-size: 0.75rem; color: #6B736D; font-weight: 600; }
.td-class-name { margin: 0; font-size: 1.08rem; font-weight: 700; color: #0A2F1F; line-height: 1.25; letter-spacing: -0.01em; overflow-wrap: anywhere; }
.td-class-meta { margin: 0.2rem 0 0; font-size: 0.82rem; color: #6B736D; }
.td-code {
  align-self: flex-start; margin: 0.85rem 0 1.1rem; padding: 0.15rem 0.55rem 0.05rem; margin-left: -0.55rem;
  font-family: 'Taronga Headline', 'Bebas Neue', sans-serif; font-weight: 400;
  font-size: 2.6rem; line-height: 1; letter-spacing: 0.14em; color: #0A2F1F;
  background: none; border: 0; border-radius: 10px; cursor: zoom-in;
  transition: background 0.15s;
}
.td-code:hover { background: #EEF4EF; }
.td-progress { display: flex; align-items: center; gap: 0.7rem; margin-top: auto; }
.td-bar { flex: 1; height: 5px; border-radius: 3px; background: #E8ECE6; overflow: hidden; }
.td-bar span { display: block; height: 100%; border-radius: 3px; background: var(--prog, #2E7D55); transition: width 0.6s ease; }
.td-progress-label { font-size: 0.78rem; color: #6B736D; white-space: nowrap; font-variant-numeric: tabular-nums; }

.td-class.is-night { background: #0D1B2E; border-color: #0D1B2E; color: #E4ECF7; }
.td-class.is-night:hover { border-color: #2B4466; box-shadow: 0 10px 30px rgba(13,27,46,0.35); }
.td-class.is-night .td-prog { color: #BFD0EA; }
.td-class.is-night .td-class-name, .td-class.is-night .td-code { color: #F3F7FC; }
.td-class.is-night .td-class-meta, .td-class.is-night .td-stage, .td-class.is-night .td-progress-label { color: #8EA2BF; }
.td-class.is-night .td-code:hover { background: rgba(255,255,255,0.07); }
.td-class.is-night .td-bar { background: rgba(255,255,255,0.1); }

/* Light theme hints: a pale wash in the programme colour and, for some, one faint detail.
   Kept quiet on purpose; the code stays the strongest thing on the card. */
.td-class { overflow: hidden; isolation: isolate; }
.td-class[class*='tint-']::after { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.tint-trek::after   { background: radial-gradient(120% 90% at 100% 0%, rgba(46,125,85,0.10) 0%, rgba(46,125,85,0) 60%); }
.tint-yard::after   { background: radial-gradient(120% 90% at 100% 0%, rgba(110,139,42,0.13) 0%, rgba(110,139,42,0) 60%), radial-gradient(70% 50% at 0% 100%, rgba(110,139,42,0.06), transparent 70%); }
.tint-evolve::after { background: radial-gradient(90% 70% at 100% 100%, rgba(232,150,60,0.20) 0%, rgba(192,90,120,0.07) 45%, rgba(192,90,120,0) 70%); }
.tint-dreams::after {
  background:
    repeating-linear-gradient(90deg, rgba(180,83,110,0.16) 0 8px, transparent 8px 18px) left 0 top 6px / 100% 5px no-repeat,
    radial-gradient(120% 90% at 100% 0%, rgba(180,83,110,0.09) 0%, rgba(180,83,110,0) 60%);
}
.tint-snooz::after {
  background:
    radial-gradient(1.4px 1.4px at 58% 14%, rgba(255,255,255,0.75) 50%, transparent 51%),
    radial-gradient(1px 1px at 72% 34%, rgba(255,255,255,0.55) 50%, transparent 51%),
    radial-gradient(1.2px 1.2px at 46% 40%, rgba(255,255,255,0.45) 50%, transparent 51%),
    radial-gradient(1px 1px at 90% 52%, rgba(255,255,255,0.4) 50%, transparent 51%),
    radial-gradient(1.2px 1.2px at 64% 58%, rgba(255,255,255,0.35) 50%, transparent 51%),
    radial-gradient(90% 70% at 100% 0%, rgba(127,167,224,0.22) 0%, rgba(127,167,224,0) 60%);
}

.td-class-new {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;
  min-height: 200px; border-radius: 20px; border: 1.5px dashed #BFCDC4; background: transparent;
  color: #1A5238; font: inherit; font-weight: 700; font-size: 0.92rem; cursor: pointer; transition: background 0.15s, border-color 0.15s;
}
.td-class-new:hover { background: #fff; border-color: #1A5238; }
.td-class-new svg { width: 26px; height: 26px; }

.td-empty { background: #fff; border: 1px solid #E2E6DF; border-radius: 20px; padding: 2.5rem 2rem; max-width: 560px; }
.td-empty h4 { margin: 0 0 0.4rem; font-size: 1.15rem; color: #0A2F1F; }
.td-empty p { margin: 0 0 1.25rem; color: #5B645E; line-height: 1.55; font-size: 0.92rem; }

.td-split { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 1.5rem; align-items: start; }
.td-links { list-style: none; margin: 0; padding: 0.35rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.15rem; background: #fff; border: 1px solid #E2E6DF; border-radius: 20px; }
.td-links button { display: flex; align-items: center; gap: 0.85rem; width: 100%; text-align: left; padding: 0.8rem 0.85rem; border: 0; background: none; border-radius: 14px; cursor: pointer; font: inherit; transition: background 0.15s; }
.td-links button:hover { background: #F1F5F1; }
.td-link-icon { width: 38px; height: 38px; flex-shrink: 0; border-radius: 11px; background: #EAF2EC; color: #1A5238; display: flex; align-items: center; justify-content: center; }
.td-link-icon svg { width: 19px; height: 19px; }
.td-link-text { flex: 1; min-width: 0; }
.td-link-title { display: block; font-size: 0.9rem; font-weight: 700; color: #14231B; }
.td-link-desc { display: block; font-size: 0.78rem; color: #6B736D; margin-top: 0.1rem; }
.td-chev { color: #A3ADA6; font-size: 1.3rem; line-height: 1; }
.td-wildly { margin-top: 0.75rem; display: flex; align-items: center; gap: 1rem; width: 100%; text-align: left; padding: 0.9rem 1.1rem; background: #fff; border: 1px solid #E2E6DF; border-radius: 20px; cursor: pointer; font: inherit; color: #3C4A41; font-size: 0.86rem; line-height: 1.45; transition: border-color 0.15s; }
.td-wildly:hover { border-color: #1A5238; }
.td-wildly img { width: 76px; height: auto; flex-shrink: 0; }
.td-wildly span:nth-of-type(1) { flex: 1; }

.td-points { background: #fff; border: 1px solid #E2E6DF; border-radius: 20px; padding: 1.35rem; }
.td-points-num { display: flex; align-items: baseline; gap: 0.45rem; }
.td-points-num span { font-size: 2.6rem; font-weight: 800; color: #0A2F1F; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.td-points-num small { font-size: 0.9rem; color: #6B736D; font-weight: 600; }
.td-points-card .td-bar { margin-top: 0.85rem; }
.td-bar-gold span { background: #E0A526; }
.td-points-goal { margin: 0.5rem 0 0; font-size: 0.84rem; color: #5B645E; }
.td-points-goal.is-won { color: #8A6200; font-weight: 700; margin-top: 0.6rem; }
.td-monthly { margin-top: 1.25rem; padding: 1.05rem; border-radius: 16px; background: #FFF8E6; border: 1px solid #F3DFA6; }
.td-monthly-head { display: flex; gap: 0.75rem; align-items: center; }
.td-monthly-icon { width: 38px; height: 38px; border-radius: 11px; background: #E0A526; color: #3A2A05; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.td-monthly-icon svg { width: 19px; height: 19px; }
.td-monthly-name { margin: 0; font-weight: 700; color: #3A2A05; font-size: 0.94rem; }
.td-monthly-meta { margin: 0.1rem 0 0; font-size: 0.77rem; color: #7A5B12; }
.td-monthly-desc { margin: 0.75rem 0 0.9rem; font-size: 0.84rem; color: #5C4306; line-height: 1.5; }
.td-status { margin: 0; font-size: 0.82rem; font-weight: 700; }
.td-status.is-pending { color: #8A6200; }
.td-status.is-done { color: #1A5238; }
.td-board { margin-top: 1.25rem; }
.td-board-title { margin: 0 0 0.45rem; font-size: 0.86rem; font-weight: 700; color: #14231B; }
.td-board ol { list-style: none; margin: 0; padding: 0; }
.td-board li { display: grid; grid-template-columns: 1.6rem 1fr auto; gap: 0.5rem; align-items: center; padding: 0.5rem 0.55rem; border-radius: 10px; font-size: 0.85rem; }
.td-board li + li { border-top: 1px solid #F0F2EE; }
.td-board li.is-you { background: #EEF4EF; border-top-color: transparent; }
.td-board li.is-you + li { border-top-color: transparent; }
.td-rank { color: #8A928C; font-weight: 700; font-variant-numeric: tabular-nums; }
.td-school { color: #14231B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-school em { font-style: normal; color: #1A5238; font-weight: 700; }
.td-pts { font-weight: 700; color: #3C4A41; font-variant-numeric: tabular-nums; }
.td-all-ch { width: 100%; margin-top: 1rem; }

.td-ch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 0.6rem; }
.td-ch { display: flex; gap: 0.85rem; align-items: flex-start; background: #fff; border: 1px solid #E2E6DF; border-radius: 16px; padding: 0.95rem 1rem; }
.td-ch-icon { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #F1F5F1; color: #4A7C61; }
.td-ch-icon svg { width: 18px; height: 18px; }
.td-ch.is-done .td-ch-icon { background: #1A5238; color: #fff; }
.td-ch.is-pending { border-color: #F0D58A; }
.td-ch-body { flex: 1; min-width: 0; }
.td-ch-name { margin: 0; font-weight: 700; font-size: 0.9rem; color: #14231B; }
.td-ch-desc { margin: 0.15rem 0 0; font-size: 0.8rem; color: #6B736D; line-height: 1.45; }
.td-ch-side { display: flex; flex-direction: column; align-items: flex-end; gap: 0.3rem; flex-shrink: 0; }
.td-ch-pts { font-weight: 800; color: #8A6200; font-size: 0.95rem; font-variant-numeric: tabular-nums; }
.td-ch-pts::after { content: ' pts'; font-weight: 600; font-size: 0.74rem; color: #A88A3A; }
.td-ch-state { font-size: 0.74rem; font-weight: 700; color: #1A5238; }
.td-ch.is-pending .td-ch-state { color: #8A6200; }
.td-ch-submit { font: inherit; font-size: 0.78rem; font-weight: 700; color: #1A5238; background: #EAF2EC; border: 0; border-radius: 999px; padding: 0.3rem 0.8rem; cursor: pointer; }
.td-ch-submit:hover { background: #D7E7DC; }

/* Sidebar on this screen: words only. Scoped to .td-side so other portal pages are unchanged. */
.td-side.lms-sidebar { padding: 1.5rem 0.9rem 1.25rem; background: #0A2F1F; border-right: 0; }
.td-nav, .td-nav-group, .td-side-foot { display: flex; flex-direction: column; gap: 0.15rem; }
.td-nav-group { margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.09); }
.td-nav-label { margin: 0 0 0.4rem; padding: 0 1rem; font-size: 0.8rem; color: rgba(255,255,255,0.45); }
.td-nav-item {
  position: relative; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
  width: 100%; text-align: left; padding: 0.72rem 1rem; border: 0; border-radius: 12px;
  background: transparent; cursor: pointer; font: inherit; font-size: 1.02rem; font-weight: 600;
  color: rgba(255,255,255,0.74); transition: background 0.15s, color 0.15s;
}
.td-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
.td-nav-item:focus-visible, .td-legal button:focus-visible { outline: 2px solid #E0A526; outline-offset: 2px; }
.td-nav-item.is-active { background: rgba(255,255,255,0.1); color: #fff; font-weight: 700; }
.td-ext { font-size: 0.85rem; color: rgba(255,255,255,0.38); font-weight: 400; }
.td-nav-item:hover .td-ext { color: rgba(255,255,255,0.7); }
.td-side-foot { margin-top: auto; padding-top: 1.25rem; }
.td-nav-quiet { font-size: 0.92rem; font-weight: 500; color: rgba(255,255,255,0.55); padding-top: 0.55rem; padding-bottom: 0.55rem; }
.td-legal { display: flex; gap: 1rem; margin: 0.9rem 0 0; padding: 0.9rem 1rem 0; border-top: 1px solid rgba(255,255,255,0.09); }
.td-legal button { background: none; border: 0; padding: 0; cursor: pointer; font: inherit; font-size: 0.76rem; color: rgba(255,255,255,0.38); }
.td-legal button:hover { color: rgba(255,255,255,0.7); }
.td-section[id] { scroll-margin-top: 1rem; }

@media (max-width: 980px) {
  .td-split { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .td-main.lms-main { padding: 1rem; }
  .td-hero { padding: 1.6rem 1.35rem 1.4rem; border-radius: 18px; min-height: 0; }
  .td-hero-photo { inset: 0 0 0 30%; opacity: 0.5; }
  .td-hero-stats { gap: 1.5rem; }
  .td-hero-cta { width: 100%; }
  .td-links { grid-template-columns: 1fr; }
  .td-class-grid, .td-ch-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .td-bar span, .td-class, .td-btn, .td-code { transition: none; }
}
`;

function jumpTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' });
}

function normalizeSchoolId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default function TeacherDashboardScreen() {
  const { setCurrentScreen, teacherEmail, setSelectedClass, teacher, authLoading, signOutTeacher, demoMode, teacherProfile } = useApp();

  useEffect(() => {
    if (!authLoading && !teacher && !demoMode) setCurrentScreen('teacherLogin');
  }, [teacher, authLoading, demoMode, setCurrentScreen]);

  const [teacherClasses,  setTeacherClasses]  = useState([]);
  const [studentCounts,   setStudentCounts]   = useState({});
  const [classesLoading,  setClassesLoading]  = useState(true);

  // Class code modal
  const [classCodeModal,      setClassCodeModal]      = useState(null);
  const [classCodeFullscreen, setClassCodeFullscreen] = useState(false);

  // Feedback
  const [showFeedback,       setShowFeedback]       = useState(false);
  const [feedbackRating,     setFeedbackRating]     = useState(0);
  const [feedbackComment,    setFeedbackComment]    = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [legalDoc,           setLegalDoc]           = useState(null);

  // School points + leaderboard
  const [schoolPoints,    setSchoolPoints]    = useState(null);
  const [schoolDocExists, setSchoolDocExists] = useState(null);
  const [leaderboard,     setLeaderboard]     = useState([]);

  // My challenge submissions (keyed by challengeId → latest submission)
  const [mySubmissions, setMySubmissions] = useState({});

  // Full challenge list, opened from the points panel
  const [showAllChallenges, setShowAllChallenges] = useState(false);

  // Challenge upload modal
  const [uploadChallenge,   setUploadChallenge]   = useState(null);
  const [uploadFile,        setUploadFile]        = useState(null);
  const [uploadNote,        setUploadNote]        = useState('');
  const [uploadSubmitting,  setUploadSubmitting]  = useState(false);
  const [uploadSuccess,     setUploadSuccess]     = useState(false);
  const fileInputRef = useRef(null);

  // Set school nudge
  const [setSchoolInput,    setSetSchoolInput]    = useState('');
  const [setSchoolSugs,     setSetSchoolSugs]     = useState([]);
  const [showSetSchoolSugs, setShowSetSchoolSugs] = useState(false);
  const [allSchools,        setAllSchools]        = useState([]);
  const [savingSchool,      setSavingSchool]      = useState(false);

  // Classes listener
  useEffect(() => {
    if (!teacherEmail.trim()) return;
    const unsub = onSnapshot(collection(db, 'teachers', teacherEmail, 'classes'), snap => {
      setTeacherClasses(snap.docs.map(d => ({
        classCode:   d.data().classCode || d.id,
        className:   d.data().className || '',
        schoolName:  d.data().schoolName || '',
        stage:       d.data().stage || 4,
        teacherEmail:d.data().teacherEmail || teacherEmail,
        archived:    d.data().archived || false,
        sessionType: d.data().sessionType || 'standard',
        location:    d.data().location || null,
        subject:     d.data().subject || null,
      })));
      setClassesLoading(false);
    }, () => { setTeacherClasses([]); setClassesLoading(false); });
    return () => unsub();
  }, [teacherEmail]);

  // Student counts
  useEffect(() => {
    if (!teacherClasses.length) { setStudentCounts({}); return; }
    let cancelled = false;
    (async () => {
      const counts = {};
      for (const cls of teacherClasses) {
        try {
          const snap = await getDocs(collection(db, 'classes', cls.classCode, 'students'));
          counts[cls.classCode] = { total: snap.size, completed: snap.docs.filter(d => d.data().completed === true).length };
        } catch { counts[cls.classCode] = { total:0, completed:0 }; }
      }
      if (!cancelled) setStudentCounts(counts);
    })();
    return () => { cancelled = true; };
  }, [teacherClasses]);

  // School points
  const primarySchool = teacherProfile?.schoolName || teacherClasses.find(c => !c.archived)?.schoolName || '';
  useEffect(() => {
    if (!primarySchool) return;
    const sid = normalizeSchoolId(primarySchool);
    const unsub = onSnapshot(doc(db, 'schools', sid), snap => {
      setSchoolDocExists(snap.exists());
      setSchoolPoints(snap.exists() ? (snap.data().totalPoints || 0) : 0);
    });
    return () => unsub();
  }, [primarySchool]);

  // Seed/correct school doc for pre-existing schools (once, on mount)
  useEffect(() => {
    if (!primarySchool || classesLoading) return;
    const activeCount = teacherClasses.filter(c => !c.archived).length;
    if (activeCount === 0) return;
    let cancelled = false;
    const sid = normalizeSchoolId(primarySchool);
    getDoc(doc(db, 'schools', sid)).then(snap => {
      if (cancelled) return;
      // Doc missing → create fresh
      // Doc exists but no awardedChallenges → wrong old seed, correct it to 25
      if (!snap.exists() || !snap.data().awardedChallenges) {
        return setDoc(doc(db, 'schools', sid), {
          name: primarySchool,
          totalPoints: 25,
          awardedChallenges: ['expedition'],
          lastUpdated: serverTimestamp(),
        }, { merge: true });
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [primarySchool, classesLoading]);

  // Leaderboard
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'schools'), orderBy('totalPoints', 'desc'), limit(10)),
      snap => setLeaderboard(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  // My challenge submissions — keep latest per challengeId
  useEffect(() => {
    if (!teacherEmail) return;
    const q = query(collection(db, 'challengeSubmissions'), where('teacherEmail', '==', teacherEmail), orderBy('submittedAt', 'desc'));
    return onSnapshot(q, snap => {
      // Keep the best submission per challenge: approved beats pending beats
      // rejected; within the same status the most recent wins (docs are DESC).
      const rank = (s) => s === 'approved' ? 2 : s === 'pending' ? 1 : 0;
      const map = {};
      snap.docs.forEach(d => {
        const data = d.data();
        const existing = map[data.challengeId];
        if (!existing || rank(data.status) > rank(existing.status)) {
          map[data.challengeId] = { id: d.id, ...data };
        }
      });
      setMySubmissions(map);
    });
  }, [teacherEmail]);

  // Load schools for set-school nudge autocomplete (NSW DoE list + Firestore extras)
  useEffect(() => {
    if (teacherProfile?.schoolName) return;
    const base = nswSchools;
    getDocs(collection(db, 'schools'))
      .then(snap => {
        const baseNames = new Set(base.map(s => s.name.toLowerCase()));
        const extras = snap.docs
          .map(d => ({ name: (d.data().name || '').trim(), suburb: '', postcode: '' }))
          .filter(s => s.name && !baseNames.has(s.name.toLowerCase()));
        setAllSchools([...base, ...extras]);
      })
      .catch(() => setAllSchools(base));
  }, [teacherProfile]);

  const activeClasses    = teacherClasses.filter(c => !c.archived);
  const totalStudentsAll = activeClasses.reduce((s, c) => s + (studentCounts[c.classCode]?.total || 0), 0);

  const nextMilestone = MILESTONES.find(m => m.points > (schoolPoints || 0)) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = MILESTONES[MILESTONES.indexOf(nextMilestone) - 1];
  const milestoneProgress = nextMilestone && prevMilestone
    ? Math.min(100, ((schoolPoints || 0) - prevMilestone.points) / (nextMilestone.points - prevMilestone.points) * 100)
    : Math.min(100, ((schoolPoints || 0) / MILESTONES[0].points) * 100);

  const submitFeedback = async () => {
    if (!feedbackRating) { alert('Please select a rating.'); return; }
    setFeedbackSubmitting(true);
    try {
      const { addDoc: ad, collection: col } = await import('firebase/firestore');
      await ad(col(db, 'teacherFeedback'), { type:'teacherFeedback', teacherName:teacherEmail, rating:feedbackRating, comment:feedbackComment.trim(), timestamp:new Date().toISOString() });
      setShowFeedback(false); setFeedbackRating(0); setFeedbackComment('');
    } catch {}
    setFeedbackSubmitting(false);
  };

  const saveSchoolToProfile = async () => {
    const name = setSchoolInput.trim();
    if (!name || !teacherEmail) return;
    setSavingSchool(true);
    try {
      await setDoc(doc(db, 'teachers', teacherEmail), { schoolName: name }, { merge: true });
      setSetSchoolInput('');
    } catch {}
    setSavingSchool(false);
  };

  const submitChallengeEvidence = async () => {
    if (!uploadFile || !uploadChallenge) return;
    setUploadSubmitting(true);
    try {
      const ext  = uploadFile.name.split('.').pop();
      const path = `challengeEvidence/${normalizeSchoolId(primarySchool)}/${uploadChallenge.id}-${Date.now()}.${ext}`;
      const snap = await uploadBytes(storageRef(storage, path), uploadFile);
      const url  = await getDownloadURL(snap.ref);
      await addDoc(collection(db, 'challengeSubmissions'), {
        schoolName:    primarySchool,
        teacherEmail,
        challengeId:   uploadChallenge.id,
        challengeName: uploadChallenge.name,
        evidenceUrl:   url,
        note:          uploadNote.trim(),
        pointsValue:   uploadChallenge.points,
        status:        'pending',
        submittedAt:   serverTimestamp(),
      });
      setUploadSuccess(true);
      setTimeout(() => { setUploadChallenge(null); setUploadFile(null); setUploadNote(''); setUploadSuccess(false); }, 2500);
    } catch (e) { console.error('Upload error:', e); alert('Upload failed. Please try again.'); }
    setUploadSubmitting(false);
  };

  if (!demoMode && (authLoading || classesLoading)) return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 60%, var(--t-eucalyptus) 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
        <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <img src="/images/logo.png" alt="Taronga" style={{ width:'48px', height:'48px', objectFit:'contain' }} onError={e => e.target.style.display='none'} />
        </div>
        <h1 className="taronga-title" style={{ color:'white', fontSize:'1.5rem', letterSpacing:'0.06em', fontWeight:400, margin:0 }}>TARONGA TRACKA</h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', margin:0 }}>Teacher Portal</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem' }}>
        <div style={{ width:'36px', height:'36px', border:'3px solid rgba(255,255,255,0.2)', borderTop:'3px solid white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.85rem', margin:0, fontWeight:500 }}>Loading your classes…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
    <div className="lms-page">
      {/* Topbar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }}>
            <img src="/images/logo.png" alt="Taronga" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>TARONGA TRACKA</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · {teacherEmail}</p>
          </div>
        </div>
        <button className="lms-signout-btn" onClick={signOutTeacher}>Sign Out</button>
      </div>

      <div className="lms-two-col">
        {/* Sidebar */}
        <div className="lms-sidebar td-side">
          <nav className="td-nav" aria-label="Dashboard">
            <button className="td-nav-item is-active" aria-current="page" onClick={() => document.querySelector('.td-main')?.scrollTo({ top:0, behavior:'smooth' })}>Dashboard</button>
            <button className="td-nav-item" onClick={() => jumpTo('t-classes-section')}>Your classes</button>
            <button className="td-nav-item" onClick={() => setCurrentScreen('createClass')}>Create a class</button>
            <button className="td-nav-item" onClick={() => jumpTo('t-plan-section')}>Plan your visit</button>
            <button className="td-nav-item" onClick={() => jumpTo('t-points-section')}>School points</button>
          </nav>

          <div className="td-nav-group">
            <p className="td-nav-label">More from Taronga</p>
            <button className="td-nav-item" onClick={() => window.open('https://www.wildlybytaronga.com.au', '_blank')}>
              Wildly by Taronga<span className="td-ext" aria-label="(opens a new tab)">↗</span>
            </button>
            <button className="td-nav-item" onClick={() => window.open('https://www.taronga.org.au/learn', '_blank')}>
              Book an excursion<span className="td-ext" aria-label="(opens a new tab)">↗</span>
            </button>
          </div>

          <div className="td-side-foot">
            <button className="td-nav-item td-nav-quiet" onClick={() => { setFeedbackRating(0); setFeedbackComment(''); setShowFeedback(true); }}>Send feedback</button>
            <button className="td-nav-item td-nav-quiet" onClick={() => setCurrentScreen('home')}>Back to home</button>
            <p className="td-legal">
              <button onClick={() => setLegalDoc('privacy')}>Privacy</button>
              <button onClick={() => setLegalDoc('terms')}>Terms of use</button>
            </p>
          </div>
        </div>

        {/* Main content — redesigned 2026-11-13 (preview branch). Order follows what a teacher
            opens the portal FOR: their classes and codes first, planning second, points last. */}
        <div className="lms-main td-main">
          <style>{TD_CSS}</style>
          <div className="lms-main-inner td-inner">

            {/* Hero */}
            <header className="td-hero">
              <div className="td-hero-photo" aria-hidden="true" />
              <div className="td-hero-body">
                <h2 className="td-greeting">
                  {greeting()}{teacher?.displayName ? `, ${teacher.displayName.split(' ')[0]}` : ''}
                </h2>
                <p className="td-hero-sub">
                  {primarySchool || 'Taronga Tracka'}<span className="td-sep" aria-hidden="true" />
                  {new Date().toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long' })}
                </p>
                <dl className="td-hero-stats">
                  <div><dt>Active classes</dt><dd>{activeClasses.length}</dd></div>
                  <div><dt>Students</dt><dd>{totalStudentsAll}</dd></div>
                  <div><dt>School points</dt><dd>{schoolPoints === null ? '–' : schoolPoints.toLocaleString('en-AU')}</dd></div>
                </dl>
              </div>
              <button className="td-btn td-btn-light td-hero-cta" onClick={() => setCurrentScreen('createClass')}>
                <SvgPlus /> Create a class
              </button>
            </header>

            {/* Set school nudge */}
            {!teacherProfile?.schoolName && (
              <div className="td-nudge">
                <div style={{ flex:1, minWidth:'200px' }}>
                  <p className="td-nudge-title">Add your school to earn points</p>
                  <p className="td-nudge-sub">Your school wasn't saved when you created your account, so points and the leaderboard can't count your classes yet.</p>
                </div>
                <div style={{ position:'relative', display:'flex', gap:'0.5rem', alignItems:'center', flex:1, minWidth:'220px' }}>
                  <div style={{ position:'relative', flex:1 }}>
                    <input
                      type="text"
                      className="td-input"
                      value={setSchoolInput}
                      onChange={e => { setSetSchoolInput(e.target.value); setShowSetSchoolSugs(true); }}
                      onFocus={() => setShowSetSchoolSugs(true)}
                      onBlur={() => setTimeout(() => setShowSetSchoolSugs(false), 150)}
                      placeholder="Start typing your school…"
                    />
                    {showSetSchoolSugs && setSchoolInput.trim().length >= 2 && (() => {
                      const q = setSchoolInput.trim().toLowerCase();
                      const sugs = allSchools.filter(s => s.name.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q)).slice(0, 10);
                      const exactMatch = sugs.some(s => s.name.toLowerCase() === q);
                      return (
                        <div className="td-sugs">
                          {sugs.map(s => (
                            <button key={s.name + s.suburb} onMouseDown={() => { setSetSchoolInput(s.name); setShowSetSchoolSugs(false); }}>
                              <span className="td-sug-name">{s.name}</span>
                              {s.suburb && <span className="td-sug-sub">{s.suburb}{s.postcode ? ` ${s.postcode}` : ''}</span>}
                            </button>
                          ))}
                          {!exactMatch && (
                            <button onMouseDown={() => setShowSetSchoolSugs(false)} className="td-sug-add">Add "{setSchoolInput.trim()}"</button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <button className="td-btn td-btn-primary" onClick={saveSchoolToProfile} disabled={setSchoolInput.trim().length < 2 || savingSchool}>
                    {savingSchool ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            )}

            {/* Classes */}
            <section id="t-classes-section" className="td-section">
              <div className="td-section-head">
                <h3 className="td-h3">Your classes</h3>
                {activeClasses.length > 0 && <p className="td-hint">Select a code to show it full screen for your students.</p>}
              </div>

              {activeClasses.length === 0 ? (
                <div className="td-empty">
                  <h4>Start with a class</h4>
                  <p>A class gives your students a code to join on the day. It takes about a minute to set up.</p>
                  <button className="td-btn td-btn-primary" onClick={() => setCurrentScreen('createClass')}><SvgPlus /> Create a class</button>
                </div>
              ) : (
                <div className="td-class-grid">
                  {activeClasses.map(cls => {
                    const counts = studentCounts[cls.classCode] || { total:0, completed:0 };
                    const pct = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;
                    const prog = programmeOf(cls);
                    const open = () => { setSelectedClass(cls.classCode); setCurrentScreen('classDetails'); };
                    return (
                      <article key={cls.classCode} className={`td-class tint-${prog.key}${prog.night ? ' is-night' : ''}`} style={{ '--prog': prog.color }}>
                        <button className="td-class-open" onClick={open} aria-label={`Open ${cls.className || cls.classCode}`} />
                        <div className="td-class-top">
                          <span className="td-prog"><span className="td-prog-dot" />{prog.label}</span>
                          {cls.stage ? <span className="td-stage">Stage {cls.stage}</span> : null}
                        </div>
                        <h4 className="td-class-name">{cls.className || 'Untitled class'}</h4>
                        <button className="td-code" onClick={() => setClassCodeModal(cls.classCode)} aria-label={`Show class code ${cls.classCode} full screen`}>
                          {cls.classCode}
                        </button>
                        <div className="td-progress">
                          <div className="td-bar"><span style={{ width:`${pct}%` }} /></div>
                          <span className="td-progress-label">
                            {counts.total === 0 ? 'No students yet' : `${counts.completed} of ${counts.total} finished`}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                  <button className="td-class-new" onClick={() => setCurrentScreen('createClass')}>
                    <SvgPlus /><span>New class</span>
                  </button>
                </div>
              )}
            </section>

            {/* Plan + points */}
            <div className="td-split">
              <section id="t-plan-section" className="td-section td-plan">
                <div className="td-section-head"><h3 className="td-h3">Plan your visit</h3></div>
                <ul className="td-links">
                  {PLAN_LINKS.map(l => (
                    <li key={l.title}>
                      <button onClick={() => l.href ? window.open(l.href, '_blank') : setCurrentScreen(l.screen)}>
                        <span className="td-link-icon">{l.icon}</span>
                        <span className="td-link-text">
                          <span className="td-link-title">{l.title}</span>
                          <span className="td-link-desc">{l.desc}</span>
                        </span>
                        <span className="td-chev" aria-hidden="true">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button className="td-wildly" onClick={() => window.open('https://www.wildlybytaronga.com.au', '_blank')}>
                  <img src="/images/wildly-logo.webp" alt="Wildly by Taronga" />
                  <span>Lessons, programs and assessments to carry the visit back into class.</span>
                  <span className="td-chev" aria-hidden="true">›</span>
                </button>
              </section>

              <section id="t-points-section" className="td-section">
                <div className="td-section-head"><h3 className="td-h3">School points</h3></div>
                <div className="td-points">
                <div className="td-points-card">
                  <div className="td-points-num">
                    <span>{schoolPoints === null ? '–' : schoolPoints.toLocaleString('en-AU')}</span>
                    <small>points</small>
                  </div>
                  {schoolPoints !== null && (schoolPoints || 0) >= 300 ? (
                    <p className="td-points-goal is-won">Your school has earned a free class zoo visit.</p>
                  ) : schoolPoints !== null && nextMilestone ? (
                    <>
                      <div className="td-bar td-bar-gold"><span style={{ width:`${milestoneProgress}%` }} /></div>
                      <p className="td-points-goal">
                        {nextMilestone.reward
                          ? `${nextMilestone.points - (schoolPoints || 0)} more to a free class zoo visit`
                          : `Next: ${nextMilestone.label} at ${nextMilestone.points}`}
                      </p>
                    </>
                  ) : null}
                </div>

                {(() => {
                  const sub = mySubmissions[MONTHLY_CHALLENGE.id];
                  return (
                    <div className="td-monthly">
                      <div className="td-monthly-head">
                        <span className="td-monthly-icon">{MONTHLY_CHALLENGE.icon}</span>
                        <div>
                          <p className="td-monthly-name">{MONTHLY_CHALLENGE.name.replace(/^.*?—\s*/, '')}</p>
                          <p className="td-monthly-meta">This month's challenge, worth {MONTHLY_CHALLENGE.points} points</p>
                        </div>
                      </div>
                      <p className="td-monthly-desc">{MONTHLY_CHALLENGE.desc}</p>
                      {!sub && (
                        <button className="td-btn td-btn-gold" onClick={() => { setUploadChallenge(MONTHLY_CHALLENGE); setUploadFile(null); setUploadNote(''); setUploadSuccess(false); }}>
                          Submit evidence
                        </button>
                      )}
                      {sub?.status === 'pending'  && <p className="td-status is-pending">Submitted. Waiting for Taronga to review.</p>}
                      {sub?.status === 'approved' && <p className="td-status is-done">Approved. Points added.</p>}
                    </div>
                  );
                })()}

                <div className="td-board">
                  <p className="td-board-title">Leaderboard</p>
                  {leaderboard.length === 0 ? (
                    <p className="td-muted">No schools on the board yet.</p>
                  ) : (
                    <ol>
                      {leaderboard.slice(0, 5).map((school, i) => {
                        const isYours = primarySchool && normalizeSchoolId(primarySchool) === school.id;
                        return (
                          <li key={school.id} className={isYours ? 'is-you' : ''}>
                            <span className="td-rank">{i + 1}</span>
                            <span className="td-school">{school.name || school.id}{isYours && <em> (you)</em>}</span>
                            <span className="td-pts">{school.totalPoints}</span>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>

                <button className="td-btn td-btn-ghost td-all-ch" onClick={() => setShowAllChallenges(v => !v)} aria-expanded={showAllChallenges}>
                  {showAllChallenges ? 'Hide challenges' : `See all ${CHALLENGES.length} challenges`}
                </button>
                </div>
              </section>
            </div>

            {/* All challenges, opened from the points panel */}
            {showAllChallenges && (
              <section className="td-section">
                <div className="td-section-head">
                  <h3 className="td-h3">Challenges</h3>
                  <p className="td-hint">Visits count automatically. Class projects need a photo, which Taronga reviews.</p>
                </div>
                <div className="td-ch-grid">
                  {CHALLENGES.map(ch => {
                    const isAuto = ch.type === 'auto' && (ch.location ? activeClasses.some(c => c.location === ch.location) : activeClasses.length > 0);
                    const sub = mySubmissions[ch.id];
                    const isApproved = sub?.status === 'approved';
                    const isPending  = sub?.status === 'pending';
                    const isDone = isAuto || isApproved;
                    return (
                      <div key={ch.id} className={`td-ch${isDone ? ' is-done' : ''}${isPending && !isDone ? ' is-pending' : ''}`}>
                        <span className="td-ch-icon">{isDone ? <SvgCheck /> : ch.icon}</span>
                        <div className="td-ch-body">
                          <p className="td-ch-name">{ch.name}</p>
                          <p className="td-ch-desc">{ch.desc}</p>
                        </div>
                        <div className="td-ch-side">
                          <span className="td-ch-pts">{ch.points}</span>
                          {isDone && <span className="td-ch-state">Done</span>}
                          {isPending && !isDone && <span className="td-ch-state">In review</span>}
                          {ch.type === 'submit' && !sub && (
                            <button className="td-ch-submit" onClick={() => { setUploadChallenge(ch); setUploadFile(null); setUploadNote(''); setUploadSuccess(false); }}>Submit</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>

      {/* Feedback modal */}
      {showFeedback && (
        <div onClick={() => setShowFeedback(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'var(--t-r-lg)', padding:'2rem', width:'100%', maxWidth:'420px', boxShadow:'0 24px 60px rgba(0,0,0,0.25)' }}>
            <h3 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.25rem' }}>Class Feedback</h3>
            <p style={{ fontSize:'0.82rem', color:'#888', marginBottom:'1.25rem' }}>Share your experience with the Taronga Tracka team.</p>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
              {[1,2,3,4,5].map(n => <button key={n} onClick={() => setFeedbackRating(n)} style={{ fontSize:'1.6rem', background:'none', border:'none', cursor:'pointer', opacity: n <= feedbackRating ? 1 : 0.25 }}>⭐</button>)}
            </div>
            <textarea value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} placeholder="Share your feedback…"
              style={{ width:'100%', minHeight:'90px', padding:'0.75rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid #E5E5E5', fontSize:'0.88rem', fontFamily:'DM Sans, sans-serif', resize:'vertical', boxSizing:'border-box', marginBottom:'1rem', outline:'none' }} />
            <div style={{ display:'flex', gap:'0.6rem' }}>
              <button onClick={submitFeedback} disabled={feedbackSubmitting || !feedbackRating}
                style={{ flex:1, padding:'0.75rem', borderRadius:'var(--t-r-sm)', border:'none', background: feedbackRating > 0 ? 'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))' : '#CCC', color:'white', fontSize:'0.9rem', fontWeight:700, cursor: feedbackRating > 0 ? 'pointer' : 'not-allowed' }}>
                {feedbackSubmitting ? 'Submitting…' : 'Submit Feedback'}
              </button>
              <button onClick={() => setShowFeedback(false)} style={{ padding:'0.75rem 1.1rem', borderRadius:'var(--t-r-sm)', border:'1px solid #E5E5E5', background:'white', fontSize:'0.9rem', color:'#888', cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Class code modal */}
      {classCodeModal && !classCodeFullscreen && (
        <div onClick={() => setClassCodeModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'24px', padding:'2.5rem', textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,0.3)', minWidth:'320px' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:600, color:'#888', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>Class Code</h3>
            <div style={{ fontFamily:'monospace', fontSize:'4rem', fontWeight:700, color:'var(--t-deep)', letterSpacing:'0.3em', marginBottom:'1.5rem', lineHeight:1.2 }}>{classCodeModal}</div>
            <button onClick={() => setClassCodeFullscreen(true)} style={{ width:'100%', background:'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))', color:'white', border:'none', padding:'0.85rem', borderRadius:'var(--t-r-md)', fontSize:'0.95rem', fontWeight:700, cursor:'pointer', marginBottom:'0.7rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Full Screen Mode</button>
            <button onClick={() => setClassCodeModal(null)} style={{ width:'100%', background:'#F5F3EE', color:'#666', border:'none', padding:'0.75rem', borderRadius:'var(--t-r-md)', fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* Fullscreen class code */}
      {classCodeFullscreen && (
        <div style={{ position:'fixed', inset:0, background:'#0A2F1F', zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontFamily:'monospace', fontSize:'clamp(5rem, 20vw, 12rem)', fontWeight:700, color:'white', letterSpacing:'0.3em', textAlign:'center' }}>{classCodeModal}</div>
          <button onClick={() => { setClassCodeFullscreen(false); setClassCodeModal(null); }}
            style={{ position:'absolute', top:'2rem', right:'2rem', background:'rgba(255,255,255,0.15)', color:'white', border:'2px solid rgba(255,255,255,0.3)', padding:'0.75rem 1.5rem', borderRadius:'var(--t-r-md)', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Exit
          </button>
        </div>
      )}

      {/* Challenge upload modal */}
      {uploadChallenge && (
        <div onClick={() => setUploadChallenge(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'var(--t-r-lg)', padding:'2rem', width:'100%', maxWidth:'460px', boxShadow:'0 24px 60px rgba(0,0,0,0.3)' }}>
            {uploadSuccess ? (
              <div style={{ textAlign:'center', padding:'1rem 0' }}>
                <div style={{ fontSize:'3rem', marginBottom:'0.75rem', color:'#22C55E' }}>✓</div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.4rem' }}>Evidence Submitted!</h3>
                <p style={{ fontSize:'0.83rem', color:'var(--t-slate)' }}>Your submission is being reviewed by the Taronga team. Points will be awarded once approved.</p>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
                  <span style={{ fontSize:'1.75rem' }}>{uploadChallenge.icon}</span>
                  <div>
                    <h3 style={{ fontSize:'1.05rem', fontWeight:700, color:'var(--t-deep)', margin:0 }}>{uploadChallenge.name}</h3>
                    <p style={{ fontSize:'0.75rem', color:'var(--t-ash)', margin:0 }}>+{uploadChallenge.points} points on approval</p>
                  </div>
                </div>
                <p style={{ fontSize:'0.83rem', color:'var(--t-slate)', marginBottom:'1.25rem', lineHeight:1.6 }}>{uploadChallenge.desc}</p>

                <div style={{ marginBottom:'1rem' }}>
                  <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Photo Evidence</label>
                  <div onClick={() => fileInputRef.current?.click()}
                    style={{ border:`2px dashed ${uploadFile ? 'var(--t-mid)' : 'var(--t-stone)'}`, borderRadius:'var(--t-r-md)', padding:'1.5rem', textAlign:'center', cursor:'pointer', background: uploadFile ? 'var(--t-foam)' : 'var(--t-chalk)', transition:'all 0.18s' }}>
                    {uploadFile ? (
                      <div>
                        <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem', color:'var(--t-mid)' }}>○</div>
                        <p style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--t-mid)', margin:0 }}>{uploadFile.name}</p>
                        <p style={{ fontSize:'0.72rem', color:'var(--t-ash)', margin:'0.2rem 0 0' }}>Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem', color:'var(--t-ash)' }}>↑</div>
                        <p style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--t-slate)', margin:0 }}>Click to upload a photo</p>
                        <p style={{ fontSize:'0.72rem', color:'var(--t-ash)', margin:'0.2rem 0 0' }}>JPG, PNG or HEIC</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => setUploadFile(e.target.files[0] || null)} />
                </div>

                <div style={{ marginBottom:'1.25rem' }}>
                  <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Note <span style={{ color:'var(--t-ash)', fontWeight:400, textTransform:'none' }}>(optional)</span></label>
                  <textarea value={uploadNote} onChange={e => setUploadNote(e.target.value)} placeholder="Briefly describe what your class did…" rows={3}
                    style={{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.85rem', fontFamily:'DM Sans, sans-serif', resize:'none', boxSizing:'border-box', outline:'none' }} />
                </div>

                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <button onClick={submitChallengeEvidence} disabled={!uploadFile || uploadSubmitting}
                    style={{ flex:1, padding:'0.8rem', borderRadius:'var(--t-r-sm)', border:'none', background: uploadFile ? 'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))' : '#CCC', color:'white', fontSize:'0.9rem', fontWeight:700, cursor: uploadFile ? 'pointer' : 'not-allowed' }}>
                    {uploadSubmitting ? 'Submitting…' : 'Submit Evidence'}
                  </button>
                  <button onClick={() => setUploadChallenge(null)} style={{ padding:'0.8rem 1.1rem', borderRadius:'var(--t-r-sm)', border:'1px solid #E5E5E5', background:'white', fontSize:'0.9rem', color:'#888', cursor:'pointer' }}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>

    {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    <TeacherHelpBot />
    <TeacherTutorial />
    </>
  );
}
