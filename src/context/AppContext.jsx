import { createContext, useContext, useState } from 'react';

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
      docViewCode,   setDocViewCode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
