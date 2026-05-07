import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { StudentProvider } from './context/StudentContext';
import {
  HomeScreen, MapScreen, AnimalScreen, ObservationScreen,
  BadgeScreen, CollectionScreen, SchoolEntryScreen, StudentJoinScreen, StudentLoadingScreen,
  SubmissionCompleteScreen, ResourceHubScreen,
  TeacherLoginScreen, TeacherDashboardScreen, ClassDetailsScreen,
  AdminLoginScreen, AdminDashboardScreen, AdminClassViewScreen,
  PublicHomeScreen, PublicHomeExtScreen, PublicEntryScreen,
  PublicAnimalScreen, PublicMissionScreen, PublicLeaderboardScreen,
  ZooSnoozScreen, DocumentaryViewer, ComingSoonScreen,
} from './screens';

function SplashDismisser() {
  const { authLoading } = useApp();
  const [videoReady,  setVideoReady]  = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);

  // Minimum hold — prevents instant flash-and-dismiss when assets are cached
  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  // Wait for background video to have enough data to play smoothly
  useEffect(() => {
    const video = document.querySelector('video');
    if (!video) { setVideoReady(true); return; }
    // Already buffered (e.g. cached)
    if (video.readyState >= 3) { setVideoReady(true); return; }
    const onReady = () => setVideoReady(true);
    video.addEventListener('canplay', onReady);
    // Hard fallback — don't hold splash forever on very slow connections
    const fallback = setTimeout(() => setVideoReady(true), 6000);
    return () => { video.removeEventListener('canplay', onReady); clearTimeout(fallback); };
  }, []);

  useEffect(() => {
    if (authLoading || !videoReady || !minTimeDone) return;
    const el = document.getElementById('splash');
    if (!el) return;
    el.classList.add('splash-hide');
    const t = setTimeout(() => { el.style.display = 'none'; }, 600);
    return () => clearTimeout(t);
  }, [authLoading, videoReady, minTimeDone]);

  return null;
}

function Router() {
  const { currentScreen, sessionType, docViewCode } = useApp();

  // NFC documentary viewer intercepts any screen if ?doc= is in the URL
  if (docViewCode) return <DocumentaryViewer />;

  // ZooSnooz session has its own sub-router
  if (sessionType === 'zoosnooz') return <ZooSnoozScreen />;

  switch (currentScreen) {
    case 'home':                 return <HomeScreen />;
    case 'map':                  return <MapScreen />;
    case 'animal':               return <AnimalScreen />;
    case 'observation':          return <ObservationScreen />;
    case 'badge':                return <BadgeScreen />;
    case 'collection':           return <CollectionScreen />;
    case 'schoolEntry':          return <SchoolEntryScreen />;
    case 'studentJoin':          return <StudentJoinScreen />;
    case 'studentLoading':       return <StudentLoadingScreen />;
    case 'submissionComplete':   return <SubmissionCompleteScreen />;
    case 'resourceHub':          return <ResourceHubScreen />;
    case 'teacherLogin':         return <TeacherLoginScreen />;
    case 'teacherDashboard':     return <TeacherDashboardScreen />;
    case 'classDetails':         return <ClassDetailsScreen />;
    case 'adminLogin':           return <AdminLoginScreen />;
    case 'adminDashboard':       return <AdminDashboardScreen />;
    case 'adminClassView':       return <AdminClassViewScreen />;
    case 'publicHome':           return <PublicHomeScreen />;
    case 'publicHomeExtension':  return <PublicHomeExtScreen />;
    case 'comingSoon':           return <ComingSoonScreen />;
    case 'publicEntry':          return <PublicEntryScreen />;
    case 'publicAnimal':         return <PublicAnimalScreen />;
    case 'publicMission':        return <PublicMissionScreen />;
    case 'publicLeaderboard':    return <PublicLeaderboardScreen />;
    default:                     return <HomeScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <StudentProvider>
        <SplashDismisser />
        <Router />
      </StudentProvider>
    </AppProvider>
  );
}
