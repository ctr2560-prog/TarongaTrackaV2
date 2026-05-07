import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Navigation ────────────────────────────────────────────────────────────
  const [currentScreen, setCurrentScreen] = useState('home');
  const [sessionType,   setSessionType]   = useState('standard'); // 'standard' | 'zoosnooz'
  const [zzScreen,      setZzScreen]      = useState('map');      // ZooSnooz sub-router
  const [appMode,       setAppMode]       = useState(() => localStorage.getItem('tarongaAppMode') || 'school');

  // ── Student identity ──────────────────────────────────────────────────────
  const [studentName,   setStudentName]   = useState('');
  const [classCode,     setClassCode]     = useState('');

  // ── Teacher / Admin identity ─────────────────────────────────────────────
  const [teacherEmail,    setTeacherEmail]    = useState('');
  const [adminAccessCode, setAdminAccessCode] = useState('');
  const [selectedClass,  setSelectedClass]  = useState(null);
  const [selectedAdminClass, setSelectedAdminClass] = useState(null);
  const [classStage,  setClassStage]  = useState(4);

  // ── Firebase Auth ─────────────────────────────────────────────────────────
  const [teacher,     setTeacher]     = useState(null);   // Firebase User | null
  const [authLoading, setAuthLoading] = useState(true);   // true until first auth state known
  const [demoMode,    setDemoMode]    = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTeacher(user);
      if (user) setTeacherEmail(user.email || '');
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const signOutTeacher = () => {
    setDemoMode(false);
    signOut(auth).then(() => {
      setTeacher(null);
      setTeacherEmail('');
      setCurrentScreen('teacherLogin');
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
      teacherEmail,      setTeacherEmail,
      adminAccessCode,   setAdminAccessCode,
      selectedClass,     setSelectedClass,
      selectedAdminClass, setSelectedAdminClass,
      teacher,       signOutTeacher, authLoading, demoMode, setDemoMode,
      docViewCode,   setDocViewCode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
