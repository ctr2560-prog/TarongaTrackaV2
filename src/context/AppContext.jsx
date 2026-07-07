import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const AppContext = createContext(null);

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

// ── Browser history integration ──────────────────────────────────────────────
// Screens that are safe to load directly from a URL (no in-memory state needed).
// Everything else falls back to home on a cold load; within a session, back/forward
// works across all screens because their state is still in memory.
const DEEP_LINK_SCREENS = new Set([
  'home', 'comingSoon', 'studentJoin', 'schoolEntry',
  'teacherLogin', 'teacherDashboard', 'createClass', 'resourceHub',
  'curriculumAlignment', 'teacherGuide', 'teacherMap',
  'excursionPlan', 'accessibility', 'conservationGallery',
  'adminLogin',
  'publicEntry', 'publicLeaderboard',
]);

// Auto-advancing screens: navigating away replaces their history entry so the
// back button never lands on them (they would immediately bounce forward again).
const TRANSIENT_SCREENS = new Set(['studentLoading']);

const screenToPath = (screen) => screen === 'home' ? '/' : `/${screen}`;
const pathToScreen = (pathname) => {
  const s = pathname.replace(/^\/+|\/+$/g, '');
  return s === '' ? 'home' : s;
};

export function AppProvider({ children }) {
  // ── Saved student session ─────────────────────────────────────────────────
  const _savedName    = readLocal('tarongaStudentName', '');
  const _savedCode    = readLocal('tarongaClassCode', '');
  const _hasSavedSession = !!((_savedName) && (_savedCode));
  const _savedSession = readLocal('tarongaSessionType', 'standard');

  // ── Navigation ────────────────────────────────────────────────────────────
  const [currentScreen, setCurrentScreen] = useState(() => {
    if (_hasSavedSession) return _savedSession === 'zoosnooz' ? 'zoosnooz' : 'map';
    const fromUrl = pathToScreen(window.location.pathname);
    return DEEP_LINK_SCREENS.has(fromUrl) ? fromUrl : 'home';
  });

  // Keep the browser URL and history in sync with the current screen, so the
  // back/forward buttons navigate between screens instead of leaving the site.
  const prevScreenRef = useRef(null);
  useEffect(() => {
    const path = screenToPath(currentScreen);
    // Replace (don't push) on first mount and when leaving auto-advancing screens
    const replace = prevScreenRef.current === null || TRANSIENT_SCREENS.has(prevScreenRef.current);
    if (window.location.pathname !== path) {
      window.history[replace ? 'replaceState' : 'pushState']({ screen: currentScreen }, '', path);
    } else if (!window.history.state?.screen) {
      window.history.replaceState({ screen: currentScreen }, '', path);
    }
    prevScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    const onPop = (e) => {
      const target = e.state?.screen || pathToScreen(window.location.pathname);
      setCurrentScreen(target);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const [sessionType,   setSessionType]   = useState(_savedSession);
  const [zzScreen,      setZzScreen]      = useState('map');      // ZooSnooz sub-router
  const [appMode,       setAppMode]       = useState(() => localStorage.getItem('tarongaAppMode') || 'school');

  // ── Student identity ──────────────────────────────────────────────────────
  const [studentName,   setStudentName]   = useState(_savedName);
  const [classCode,     setClassCode]     = useState(_savedCode);

  // ── Teacher / Admin identity ─────────────────────────────────────────────
  const [teacherEmail,    setTeacherEmail]    = useState('');
  const [adminAccessCode, setAdminAccessCode] = useState('');
  const [selectedClass,  setSelectedClass]  = useState(null);
  const [selectedAdminClass, setSelectedAdminClass] = useState(null);
  const [classStage,   setClassStage]   = useState(() => readLocal('tarongaClassStage', 4));
  const [classSubject, setClassSubject] = useState(() => readLocal('tarongaClassSubject', 'science'));

  // ── Firebase Auth ─────────────────────────────────────────────────────────
  const [teacher,     setTeacher]     = useState(null);   // Firebase User | null
  const [authLoading, setAuthLoading] = useState(true);   // true until first auth state known
  const [demoMode,    setDemoMode]    = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTeacher(user);
      if (user) setTeacherEmail(user.email || '');
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!teacherEmail) { setTeacherProfile(null); return; }
    const unsub = onSnapshot(doc(db, 'teachers', teacherEmail), snap => {
      setTeacherProfile(snap.exists() ? snap.data() : null);
    }, () => setTeacherProfile(null));
    return () => unsub();
  }, [teacherEmail]);

  const clearStudentSession = () => {
    ['tarongaStudentName','tarongaClassCode','tarongaClassStage','tarongaClassSubject',
     'tarongaSessionType','tarongaTrackaProgress','studentEssentialCache'].forEach(k => localStorage.removeItem(k));
  };

  const signOutTeacher = () => {
    setDemoMode(false);
    signOut(auth).then(() => {
      setTeacher(null);
      setTeacherEmail('');
      setCurrentScreen('home');
    });
  };

  // ── Documentary viewer (NFC) ──────────────────────────────────────────────
  const [docViewCode, setDocViewCode] = useState(() => {
    try { return new URLSearchParams(window.location.search).get('doc') || null; }
    catch(e) { return null; }
  });

  return (
    <AppContext.Provider value={{
      currentScreen, setCurrentScreen,
      sessionType,   setSessionType,
      zzScreen,      setZzScreen,
      appMode,       setAppMode,
      studentName,   setStudentName,
      classCode,     setClassCode,
      classStage,    setClassStage,
      classSubject,  setClassSubject,
      teacherEmail,      setTeacherEmail,
      adminAccessCode,   setAdminAccessCode,
      selectedClass,     setSelectedClass,
      selectedAdminClass, setSelectedAdminClass,
      teacher,       signOutTeacher, authLoading, demoMode, setDemoMode, teacherProfile,
      clearStudentSession,
      docViewCode,   setDocViewCode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
