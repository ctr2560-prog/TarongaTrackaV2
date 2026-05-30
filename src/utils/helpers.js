import { MATHS_ANIMALS } from '../data/animalsMaths';
import { PDHPE_ANIMALS } from '../data/animalsPdhpe';
import { ENGLISH_ANIMALS } from '../data/animalsEnglish';

export const normaliseCode = (code) =>
  code.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);

export const deriveStageFromYear = (year) => {
  const yearNum = parseInt(String(year).replace(/[^0-9]/g, ''), 10);
  if (yearNum <= 2) return 'Stage 1';
  if (yearNum <= 4) return 'Stage 2';
  if (yearNum <= 6) return 'Stage 3';
  if (yearNum <= 8) return 'Stage 4';
  if (yearNum <= 10) return 'Stage 5';
  return null;
};

export const toTitleCase = (str) =>
  str.replace(/\w\S*/g, txt =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export const mapFocusAreaToCategory = (focusArea) => {
  const map = {
    'Behaviour': 'behaviour',
    'Use of Evidence': 'detail',
    'Literacy': 'writing',
    'Knowledge & understanding': 'quiz',
    'Observation': 'behaviour',
    'Scientific Language': 'writing',
    'Writing': 'writing',
    'Evidence Use': 'detail',
    'Data Interpretation': 'detail',
  };
  return map[focusArea] || null;
};

export const safeStudentId = (name) =>
  name.trim().replace(/[\\/#.$[\]]/g, '_');

export function getBearing(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const toDeg = rad => rad * 180 / Math.PI;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2);
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

export function getStageQuestions(animal, classStage, classSubject) {
  const stage = classStage || 4;
  let questions;
  if (classSubject === 'maths' && animal) {
    const mathsData = MATHS_ANIMALS[animal.id];
    questions = mathsData ? mathsData.questions : animal.questions;
  } else if (classSubject === 'pdhpe' && animal) {
    const pdhpeData = PDHPE_ANIMALS[animal.id];
    questions = pdhpeData ? pdhpeData.questions : animal.questions;
  } else if (classSubject === 'english' && animal) {
    const englishData = ENGLISH_ANIMALS[animal.id];
    questions = englishData ? englishData.questions : animal.questions;
  } else {
    questions = (animal && animal.questions) ? animal.questions : [];
  }
  const baseQuestions = questions || [];
  return baseQuestions.map(q => {
    if (!q.stageVariants && !q.stageOptions && !q.stageCorrect) return q;
    const stageText = q.stageVariants ? (q.stageVariants[stage] || q.stageVariants[4] || q.q) : q.q;
    const stageOpts = q.stageOptions ? (q.stageOptions[stage] || q.stageOptions[4] || q.options) : q.options;
    const stageCor  = q.stageCorrect ? (q.stageCorrect[stage] !== undefined ? q.stageCorrect[stage] : (q.stageCorrect[4] !== undefined ? q.stageCorrect[4] : q.correct)) : q.correct;
    const stageFact = q.stageFacts ? (q.stageFacts[stage] || q.fact) : q.fact;
    return { ...q, q: stageText, options: stageOpts, correct: stageCor, fact: stageFact };
  });
}

export function getMathsObservationData(animalId, classStage) {
  const data = MATHS_ANIMALS[animalId];
  if (!data) return null;
  return {
    prompt:            data.writingPromptByStage?.[classStage] || data.observationPrompt || '',
    observationPrompt: data.observationPrompt || '',
  };
}

export function getPdhpeObservationData(animalId, classStage) {
  const data = PDHPE_ANIMALS[animalId];
  if (!data) return null;
  return {
    prompt:            data.writingPromptByStage?.[classStage] || data.observationPrompt || '',
    observationPrompt: data.observationPrompt || '',
  };
}

export function getEnglishObservationData(animalId, classStage) {
  const data = ENGLISH_ANIMALS[animalId];
  if (!data) return null;
  return {
    prompt:            data.writingPromptByStage?.[classStage] || data.observationPrompt || '',
    observationPrompt: data.observationPrompt || '',
  };
}

export function getStagePrompt(basePrompt, stage) {
  if (stage <= 2) return `Look at the animal. ${basePrompt.split('.')[0]}. Draw or write what you see.`;
  if (stage === 3) return basePrompt;
  if (stage === 4) return basePrompt;
  return basePrompt.replace(/\.$/, '') + '. Use scientific vocabulary to explain your thinking.';
}

export function getStageScaffoldTip(stage) {
  if (stage <= 2) return { header: 'Start with:', points: [], starters: ['I saw…', 'I can see…'] };
  if (stage === 3) return { header: 'A good response includes:', points: ['What you can observe', 'One feature or behaviour', 'Why you think it does that'], starters: ['I noticed…', 'I think this is because…'] };
  if (stage === 4) return { header: '✓ A strong response includes:', points: ['A clear observation (what + where/what doing)', 'A relevant concept or feature', 'A simple explanation or link to survival'], starters: ['I observed that…', 'This may help the animal because…'] };
  return { header: '✓ Stage 5 - Explain and reason:', points: ['What did you observe?', 'Why does this happen?', 'How does this help the animal or environment?'], starters: ['Based on my observation…', 'This is significant because…', 'This adaptation allows the animal to…'] };
}

export const MIN_WORDS_BY_STAGE = { 1: 3, 2: 5, 3: 8, 4: 10, 5: 12 };
export const getMinWords = (stage) => MIN_WORDS_BY_STAGE[stage] || 10;

export function calculateAnimalPoints(badge) {
  if (!badge) return 0;
  const behaviour = badge.observationScore?.behaviour || 0;
  const detail    = badge.observationScore?.detail    || 0;
  const writing   = badge.observationScore?.writing   || 0;
  const observationPoints = Math.round(((behaviour + detail + writing) / 15) * 100);
  const quizPoints = (badge.quizResults || []).filter(q => q.correctOnFirstAttempt).length * 20;
  return observationPoints + quizPoints;
}
