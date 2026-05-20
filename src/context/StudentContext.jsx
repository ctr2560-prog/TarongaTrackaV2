import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from './AppContext';
import { animals as hardcodedAnimals } from '../data/animals';
import { normaliseCode, safeStudentId, getDistance, getStageQuestions } from '../utils/helpers';
import { buildObservationScore } from '../utils/scoring';

const StudentContext = createContext(null);

function loadProgress() {
  try {
    const saved = localStorage.getItem('tarongaTrackaProgress');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

export function StudentProvider({ children }) {
  const { currentScreen, setCurrentScreen, studentName, classCode, classStage, classSubject, appMode } = useApp();

  const savedProgress = useMemo(() => loadProgress(), []);

  // ── Core student state ─────────────────────────────────────────────────────
  const [foundAnimals,   setFoundAnimals]   = useState(() => new Set(savedProgress?.foundAnimals || []));
  const [badges,         setBadges]         = useState(savedProgress?.badges || []);
  const [activityCompleted, setActivityCompleted] = useState(savedProgress?.activityCompleted || false);
  const [isSubmittingActivity, setIsSubmittingActivity] = useState(false);
  const [studentStatus,  setStudentStatus]  = useState('incomplete');
  const [statusLoaded,   setStatusLoaded]   = useState(false);
  const [studentPreloadError, setStudentPreloadError] = useState(null);

  // ── Quiz / observation state ───────────────────────────────────────────────
  const [currentAnimal,        setCurrentAnimal]        = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers,          setQuizAnswers]          = useState({});
  const [firstAttemptResults,  setFirstAttemptResults]  = useState({});
  const [showResult,           setShowResult]           = useState(false);
  const [isCorrect,            setIsCorrect]            = useState(false);
  const [isProcessingAnswer,   setIsProcessingAnswer]   = useState(false);
  const [observation,          setObservation]          = useState('');

  // ── Conservation statement ─────────────────────────────────────────────────
  const [conservationStatement,   setConservationStatement]   = useState('');
  const [showConservationScreen,  setShowConservationScreen]  = useState(false);

  // ── Completion card dismissed (persists across navigation) ─────────────────
  const [completionCardDismissed, setCompletionCardDismissed] = useState(false);

  // ── Mission context (data from mission to carry into observation) ──────────
  const [missionContext, setMissionContext] = useState(null);

  // ── GPS override setting ───────────────────────────────────────────────────
  const [gpsRequired, setGpsRequired] = useState(true); // false = admin has turned GPS off

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'app'), snap => {
      if (snap.exists()) setGpsRequired(snap.data().gpsEnabled !== false);
    }, () => {});
    return unsub;
  }, []);

  // ── Geolocation ────────────────────────────────────────────────────────────
  const [userLocation,    setUserLocation]    = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(savedProgress?.locationEnabled || false);
  const geoWatchIdRef = useRef(null);
  const hasEnteredMapRef = useRef(false);

  // ── Zoo map modal ──────────────────────────────────────────────────────────
  const [showZooMap, setShowZooMap] = useState(false);

  // ── Animals ────────────────────────────────────────────────────────────────
  const animalsToRender = useMemo(() => Array.isArray(hardcodedAnimals) ? hardcodedAnimals : [], []);

  // ── Points derived from badges ─────────────────────────────────────────────
  const totalPoints = useMemo(() => badges.reduce((sum, b) => {
    const obs = b.observationScore || {};
    const obsTotal = (obs.behaviour || 0) + (obs.detail || 0) + (obs.writing || 0);
    const obsPoints = Math.round((obsTotal / 15) * 100);
    const qPoints = (b.quizResults || []).filter(q => q.correctOnFirstAttempt).length * 20;
    const gamePoints = b.gamePoints || 0;
    return sum + obsPoints + qPoints + gamePoints;
  }, 0), [badges]);

  // ── Save progress to localStorage ─────────────────────────────────────────
  useEffect(() => {
    if (!currentScreen) return;
    if (!['map','animal','observation','badge','collection','submissionComplete'].includes(currentScreen)) return;
    const progress = {
      currentScreen,
      foundAnimals: Array.from(foundAnimals),
      totalPoints,
      badges,
      locationEnabled,
      activityCompleted,
    };
    localStorage.setItem('tarongaTrackaProgress', JSON.stringify(progress));
  }, [currentScreen, foundAnimals, totalPoints, badges, locationEnabled, activityCompleted]);

  // ── Live Firestore student status ──────────────────────────────────────────
  useEffect(() => {
    if (!studentName || !classCode) return;
    const code = normaliseCode(classCode);
    const sid  = safeStudentId(studentName);
    const ref  = doc(db, 'classes', code, 'students', sid);
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        const d = snap.data();
        setStudentStatus(d.status || (d.completed ? 'complete' : 'incomplete'));
        if (d.badges && Array.isArray(d.badges)) {
          setBadges(prev => prev.length > 0 ? prev : d.badges);
          setFoundAnimals(prev => prev.size > 0 ? prev : new Set(d.badges.map(b => b.animalId).filter(Boolean)));
        }
      }
      setStatusLoaded(true);
    }, () => setStatusLoaded(true));
    return unsub;
  }, [studentName, classCode]);

  // ── Geolocation ────────────────────────────────────────────────────────────
  const [locationError, setLocationError] = useState(null);

  const enableLocation = useCallback(() => {
    if (!('geolocation' in navigator)) { alert('Geolocation not supported on this device.'); return; }
    if (geoWatchIdRef.current !== null) return;
    setLocationError(null);

    geoWatchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocationError(null);
        setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy });
        setLocationEnabled(true);
        if (!hasEnteredMapRef.current) {
          hasEnteredMapRef.current = true;
          setCurrentScreen(prev => (prev === 'home' ? 'map' : prev));
        }
      },
      (error) => {
        geoWatchIdRef.current = null;
        if (error.code === 1) {
          setLocationError('Location access was denied. Please allow location in your browser settings and refresh.');
        } else if (error.code === 2) {
          setLocationError('Unable to determine your location. Make sure GPS is enabled on your device.');
        } else {
          setLocationError('Location timed out. Please check your signal and try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  }, [setCurrentScreen]);

  useEffect(() => {
    return () => {
      if (geoWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
        geoWatchIdRef.current = null;
      }
    };
  }, []);

  const checkAnimalProximity = useCallback((animal) => {
    if (!gpsRequired) return { nearby: true, distance: null };
    if (!userLocation) return { nearby: false, distance: null };
    const distance = getDistance(userLocation.latitude, userLocation.longitude, animal.latitude, animal.longitude);
    return { nearby: distance <= (animal.radius || 30), distance: Math.round(distance) };
  }, [userLocation, gpsRequired]);

  // ── Discover animal ────────────────────────────────────────────────────────
  const discoverAnimal = useCallback((animal, event) => {
    if (event) event.stopPropagation();
    if (activityCompleted) return;
    if (foundAnimals.has(animal.id)) return;
    if (gpsRequired && !checkAnimalProximity(animal).nearby) return;

    setCurrentAnimal(animal);
    setQuizAnswers({});
    setFirstAttemptResults({});
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setIsCorrect(false);
    setObservation('');
    setIsProcessingAnswer(false);
    setMissionContext(null);
    setCurrentScreen('animal');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);
  }, [activityCompleted, foundAnimals, checkAnimalProximity, setCurrentScreen]);

  // ── Reset in-memory progress for a new student session ────────────────────
  const resetProgress = useCallback(() => {
    setFoundAnimals(new Set());
    setBadges([]);
    setActivityCompleted(false);
    setStudentStatus('incomplete');
    setStatusLoaded(false);
    setCurrentAnimal(null);
    setCurrentQuestionIndex(0);
    setQuizAnswers({});
    setFirstAttemptResults({});
    setShowResult(false);
    setIsCorrect(false);
    setIsProcessingAnswer(false);
    setObservation('');
    setConservationStatement('');
    setShowConservationScreen(false);
    setCompletionCardDismissed(false);
    setMissionContext(null);
  }, []);

  // ── Add badge ──────────────────────────────────────────────────────────────
  const addBadge = useCallback((badgeData) => {
    setFoundAnimals(prev => new Set([...prev, badgeData.animalId]));
    setBadges(prev => {
      const existingIndex = prev.findIndex(b => b.animalId === badgeData.animalId);
      if (existingIndex === -1) return [...prev, badgeData];
      const updated = [...prev];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...badgeData,
        quizResults: badgeData.quizResults?.length > 0 ? badgeData.quizResults : updated[existingIndex].quizResults,
      };
      return updated;
    });
  }, []);

  // ── Quiz answer handler (shared by standard + mission screens) ────────────
  const handleQuizAnswer = useCallback((questionIndex, answerIndex, correctIndex) => {
    if (isProcessingAnswer) return;
    setIsProcessingAnswer(true);
    const correct = answerIndex === correctIndex;
    setIsCorrect(correct);
    setShowResult(true);
    setFirstAttemptResults(prev => {
      if (prev[questionIndex] !== undefined) return prev;
      return { ...prev, [questionIndex]: correct };
    });
    if (correct) {
      const audio = new Audio('images/ding.mp3');
      audio.play().catch(() => {});
    }
  }, [isProcessingAnswer]);

  const handleNextQuestion = useCallback((questionsLength) => {
    setIsProcessingAnswer(false);
    setShowResult(false);
    if (currentQuestionIndex < (questionsLength || 1) - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setCurrentScreen('observation');
    }
  }, [currentQuestionIndex, setCurrentScreen]);

  // ── Submit observation ─────────────────────────────────────────────────────
  const submitObservation = useCallback(() => {
    if (activityCompleted || !currentAnimal) return;
    const minW = { 1: 3, 2: 5, 3: 8, 4: 10, 5: 12 }[classStage] || 10;
    const wc = observation.trim().match(/\b\w+\b/g)?.length || 0;
    if (wc < minW) { alert(`Your response needs at least ${minW} words. You have ${wc}.`); return; }

    const stageQs = getStageQuestions(currentAnimal, classStage, classSubject);
    const quizResults = stageQs.map((q, i) => ({
      question: q.q || q.question || 'Question unavailable',
      correctOnFirstAttempt: firstAttemptResults[i] === true,
      missionType: 'knowledge',
    }));

    const observationScore = buildObservationScore(observation.trim(), currentAnimal.id, classStage, classSubject);

    addBadge({
      animalId: currentAnimal.id,
      animal: currentAnimal.name,
      quizResults,
      observation: observation.trim(),
      observationScore,
      timestamp: new Date().toISOString(),
    });
    setCurrentScreen('badge');
  }, [activityCompleted, currentAnimal, classStage, observation, firstAttemptResults, addBadge, setCurrentScreen]);

  // ── Complete activity ──────────────────────────────────────────────────────
  const completeActivity = useCallback(async (statementOverride) => {
    if (!studentName || !classCode) return;
    if (activityCompleted) return;

    const validOverride = typeof statementOverride === 'string' ? statementOverride : null;
    if (!validOverride) {
      setShowConservationScreen(true);
      return;
    }

    if (!window.confirm('Submit your activity results to your teacher?\n\nYou will not be able to earn more badges after this.')) return;

    setIsSubmittingActivity(true);
    const code = normaliseCode(classCode);
    const sid  = safeStudentId(studentName);

    const cleanBadges = badges.map(b => ({
      animalId: b.animalId || '',
      animal: b.animal || '',
      quizResults: (b.quizResults || []).map(qr => ({
        question: qr.question || '',
        correctOnFirstAttempt: qr.correctOnFirstAttempt === true,
        missionType: qr.missionType || 'knowledge',
      })),
      observation: b.observation || '',
      observationScore: (b.observationScore && typeof b.observationScore === 'object') ? b.observationScore : null,
      timestamp: b.timestamp || '',
    }));

    const allQuizResults = cleanBadges.flatMap(b => b.quizResults || []);
    const quizTotal = allQuizResults.length;
    const quizCorrect = allQuizResults.filter(q => q.correctOnFirstAttempt === true).length;
    const quizPercent = quizTotal === 0 ? 0 : Math.round((quizCorrect / quizTotal) * 100);

    try {
      await setDoc(
        doc(db, 'classes', code, 'students', sid),
        {
          name: studentName,
          classCode: code,
          totalPoints,
          badges: cleanBadges,
          quizCorrect,
          quizTotal,
          quizPercentage: quizPercent,
          quizPercent,
          conservationStatement: validOverride.trim(),
          completed: true,
          completedAt: serverTimestamp(),
          status: 'complete',
        },
        { merge: true }
      );
      setActivityCompleted(true);
      setIsSubmittingActivity(false);
      setCurrentScreen('submissionComplete');
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmittingActivity(false);
      alert(`Submission failed: ${err.message}\n\nPlease check your connection and try again.`);
    }
  }, [studentName, classCode, activityCompleted, badges, totalPoints, setCurrentScreen]);

  return (
    <StudentContext.Provider value={{
      // Animals
      animalsToRender,
      // Student state
      foundAnimals,    setFoundAnimals,
      badges,          setBadges,
      totalPoints,
      activityCompleted,
      isSubmittingActivity,
      studentStatus,
      statusLoaded,
      studentPreloadError,
      // Quiz / observation
      currentAnimal,   setCurrentAnimal,
      currentQuestionIndex, setCurrentQuestionIndex,
      quizAnswers,     setQuizAnswers,
      firstAttemptResults, setFirstAttemptResults,
      showResult,      setShowResult,
      isCorrect,       setIsCorrect,
      isProcessingAnswer, setIsProcessingAnswer,
      observation,     setObservation,
      // Conservation
      conservationStatement,  setConservationStatement,
      showConservationScreen, setShowConservationScreen,
      // Completion card
      completionCardDismissed, setCompletionCardDismissed,
      // Mission context (data carried into observation screen)
      missionContext, setMissionContext,
      // Geolocation
      userLocation,
      locationEnabled,
      locationError,
      gpsRequired,
      enableLocation,
      checkAnimalProximity,
      // Zoo map
      showZooMap, setShowZooMap,
      // Actions
      resetProgress,
      discoverAnimal,
      addBadge,
      handleQuizAnswer,
      handleNextQuestion,
      submitObservation,
      completeActivity,
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export const useStudent = () => useContext(StudentContext);
