import { MATHS_ANIMALS } from '../data/animalsMaths';

function checkExpectedAnswers(text, answers) {
  if (!answers || answers.length === 0) return false;
  const lower = text.toLowerCase().replace(/,/g, '');
  return answers.some(a => {
    const ans = String(a).toLowerCase().replace(/,/g, '');
    const escaped = ans.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![0-9.])${escaped}(?![0-9.])`).test(lower);
  });
}

export function isLowQualityResponse(text) {
  const t = text.trim().toLowerCase();
  if (!t) return true;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 3) return true;
  const uniqueWords = new Set(words);
  if (uniqueWords.size <= 2 && words.length >= 4) return true;
  if (/^(.)\1{4,}$/.test(t.replace(/\s/g, ''))) return true;
  const stopWords = new Set(['a','an','the','is','it','i','in','on','at','to','of','and','or','but','so','my','me','we','he','she','they','this','that','was','are','be','do','go','no','yes','ok','hi']);
  const meaningfulWords = words.filter(w => w.length > 1 && !stopWords.has(w));
  if (meaningfulWords.length < 2) return true;
  const hasVowel     = /[aeiou]/;
  const hasConsonant = /[bcdfghjklmnpqrstvwxyz]/;
  const realWordCount = words.filter(w => {
    const c = w.replace(/[^a-z]/g, '');
    return c.length >= 2 && hasVowel.test(c) && hasConsonant.test(c);
  }).length;
  if (realWordCount / words.length < 0.4) return true;
  // Detect keyboard mashing: multiple words with no vowels, double-j, or q without u
  const gibberishWordSet = new Set();
  words.forEach(w => {
    const c = w.replace(/[^a-z]/g, '');
    if (c.length < 2) return;
    if (!/[aeiouy]/.test(c)) gibberishWordSet.add(w);
    if ((c.match(/j/g) || []).length >= 2) gibberishWordSet.add(w);
    if (c.length <= 5 && /q(?!u)/.test(c)) gibberishWordSet.add(w);
  });
  if (words.length >= 5 && gibberishWordSet.size >= 2) return true;
  return false;
}

// ── ZooSnooz scoring ────────────────────────────────────────────────────────

export function calculateZzBehaviourScore(text) {
  if (isLowQualityResponse(text)) return 1;
  const lower = text.toLowerCase();
  const behaviourRoots = [
    'walk','run','jog','trot','pace','move','crawl','climb','jump','leap',
    'rest','sleep','lie','lay','still','stand','sit','crouch','curl',
    'eat','drink','feed','chew','bite','lick','sniff','smell',
    'watch','look','stare','follow','ignore','chase','play','groom','scratch',
    'roar','growl','grunt','call','vocalis','vocaliz',
    'stalk','prowl','pounce','mark','spray','rub','roll','swing','hang','wade',
    'patrol','survey','investigate','explore',
  ];
  const matches = behaviourRoots.filter(root => lower.includes(root));
  if (matches.length === 0) return 1;
  if (matches.length === 1) return 3;
  if (matches.length === 2) return 4;
  return 5;
}

export function calculateZzDetailScore(text) {
  if (isLowQualityResponse(text)) return 0;
  const lower = text.toLowerCase();
  const detailRoots = [
    'stripe','fur','coat','tail','claw','horn','skin','paw','snout','mane','tongue','chest','tusk','teeth','wing',
    'walk','run','jump','climb','pace','rest','sleep','crouch','prowl','stalk','stretch',
    'tree','rock','shade','log','branch','platform','enclosure','shadow','night',
    'sound','noise','smell','texture','pattern','colour','color','quiet','loud',
    'nocturnal','adaptation','camouflage','habitat','predator','prey',
    'endangered','conservation','species','territorial','social','behaviour',
    'prehensile','keratin','biodiversity','ecosystem','apex',
  ];
  const matches = detailRoots.filter(root => lower.includes(root)).length;
  if (matches === 0) return 1;
  if (matches === 1) return 2;
  if (matches === 2) return 3;
  if (matches === 3) return 4;
  return 5;
}

// ── Day-mode scoring ─────────────────────────────────────────────────────────

export function calculateBehaviourScore(text) {
  if (isLowQualityResponse(text)) return Math.min(1, 2);
  const lower = text.toLowerCase();
  const behaviourRoots = [
    'walk','run','jump','climb','pace','rest','sleep',
    'eat','drink','move','look','watch','sit','stand',
    'stretch','play','hunt','feed',
  ];
  const matches = behaviourRoots.filter(root => lower.includes(root));
  if (matches.length === 0) return 1;
  return Math.min(matches.length + 1, 5);
}

export function calculateDetailScore(text) {
  if (isLowQualityResponse(text)) return 0;
  const lower = text.toLowerCase();
  const detailRoots = [
    'tree','rock','water','grass','shade','log','branch',
    'leaf','fence','platform','ground','enclosure',
    'bird','wind','sound','noise','smell',
    'stripe','fur','tail','claw',
  ];
  const matches = detailRoots.filter(root => lower.includes(root));
  if (matches.length === 0) return 1;
  return Math.min(matches.length + 1, 5);
}

export function stage1BehaviourScore(text, relevanceWords) {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  if (wc === 0) return 0;
  const hits = relevanceWords.filter(w => lower.includes(w)).length;
  if (hits === 0 && wc < 2) return 1;
  if (hits === 0) return 3;
  if (hits >= 1 && wc === 1) return 4;
  if (hits >= 1 && wc >= 2 && hits < 3) return 4;
  if (hits >= 3 || (hits >= 1 && wc >= 5)) return 5;
  return 4;
}

export function stage1DetailScore(text, ideaWords) {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  if (wc === 0) return 0;
  const hits = ideaWords.filter(w => lower.includes(w)).length;
  if (hits === 0 && wc < 2) return 1;
  if (hits === 0) return 2;
  if (hits >= 1 && wc <= 3) return 3;
  if (hits >= 1 && wc >= 4 && hits < 3) return 4;
  if (hits >= 3 || (hits >= 1 && wc >= 6)) return 5;
  return 3;
}

export function stage1WritingScore(text) {
  const t = text.trim();
  if (!t) return 0;
  const words = t.split(/\s+/).filter(Boolean);
  const wc = words.length;
  const realWords = words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(w => w.length >= 2);
  const realCount = realWords.length;
  if (realCount === 0) return 1;
  if (realCount >= 1 && wc === 1) return 3;
  if (realCount >= 2 && wc <= 4) return 3;
  if (realCount >= 3 && wc >= 5) return 4;
  if (realCount >= 5 && wc >= 7) return 5;
  return 3;
}

export function stage3Score(hits, hasExplanation) {
  let b;
  if (hits === 0) b = 1;
  else if (hits >= 1 && !hasExplanation) b = 3;
  else b = Math.min(hits + 2, 4);
  let d;
  if (hits === 0) d = 1;
  else if (hits === 1 && !hasExplanation) d = 3;
  else if (hits === 1 && hasExplanation) d = 4;
  else if (hits >= 2) d = Math.min(hits + 1, 4);
  else d = 3;
  return { b, d };
}

export function stage4Score(hits, hasExplanation, wc) {
  let b;
  if (hits === 0 && wc < 3) b = 1;
  else if (hits === 0) b = 2;
  else if (hits >= 1 && !hasExplanation) b = 3;
  else if (hits >= 1 && hasExplanation && wc < 12) b = 4;
  else if (hits >= 1 && hasExplanation && wc >= 12) b = 5;
  else b = Math.min(hits + 2, 5);
  let d;
  if (hits === 0) d = 1;
  else if (hits === 1) d = 3;
  else if (hits >= 2 && !hasExplanation) d = 4;
  else if (hits >= 2 && hasExplanation) d = Math.min(hits + 2, 5);
  else d = 3;
  return { b, d };
}

export function stage5Score(text, behaviourWords, detailWords, hasExplanation) {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  const bHits = behaviourWords.filter(w => lower.includes(w)).length;
  let bScore;
  if (bHits === 0 && wc < 3) bScore = 1;
  else if (bHits === 0) bScore = 2;
  else if (bHits >= 1 && !hasExplanation) bScore = 3;
  else if (bHits >= 1 && hasExplanation && wc < 8) bScore = 4;
  else bScore = 5;
  const dHits = detailWords.filter(w => lower.includes(w)).length;
  let dScore;
  if (dHits === 0 && wc < 3) dScore = 1;
  else if (dHits === 0) dScore = 2;
  else if (dHits === 1 && !hasExplanation) dScore = 3;
  else if (dHits >= 1 && hasExplanation && dHits < 3) dScore = 4;
  else if (dHits >= 3 && hasExplanation) dScore = 5;
  else if (dHits >= 2 && !hasExplanation) dScore = 3;
  else dScore = 3;
  const hasSentence = /[A-Z].*[.!?]/.test(text.trim());
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  let wScore = 1;
  if (wc >= 3) wScore = 2;
  if (wc >= 6) wScore = 3;
  if (wc >= 8 && uniqueWords.size >= 5) wScore = Math.max(wScore, 4);
  if (wc >= 10 && hasExplanation) wScore = Math.max(wScore, 4);
  if (wc >= 12 && hasSentence && uniqueWords.size >= 8) wScore = Math.max(wScore, 5);
  if (wc >= 10 && hasExplanation && uniqueWords.size >= 8) wScore = Math.max(wScore, 5);
  if (!/^[A-Z]/.test(text.trim()) || !/[.!?]/.test(text.trim())) wScore = Math.min(wScore, 3);
  return { b: bScore, d: dScore, w: wScore };
}

export function normaliseScores({ behaviourScore, detailScore, writingScore, evidence, stage, isLowQuality }) {
  let b = behaviourScore, d = detailScore, w = writingScore;
  const s = stage || 4;
  const hasExplanation = evidence?.hasExplanation || false;
  const wordCount = evidence?.wordCount || 0;
  const behaviourDetected = (behaviourScore || 0) >= 3;
  const detailCount = (detailScore || 0);
  if (s === 5) {
    if (!hasExplanation) b = Math.min(b, 3);
    if (!hasExplanation && detailCount <= 3) d = Math.min(d, 3);
  }
  if (s <= 2) {
    if (behaviourDetected && !isLowQuality) b = Math.max(b, 3); else b = Math.min(b, 2);
    if (detailCount >= 1 && !isLowQuality) d = Math.max(d, 3); else d = Math.min(d, 2);
    if (wordCount > 3 && !isLowQuality) w = Math.max(w, 3);
  }
  if (s === 3) {
    if (behaviourDetected && !isLowQuality) b = Math.max(b, 3); else b = Math.min(b, 2);
    if (detailCount >= 1 && !isLowQuality) d = Math.max(d, 3); else d = Math.min(d, 2);
    if (wordCount >= 5 && !isLowQuality && evidence?.hasPunctuation) w = Math.max(w, 3);
  }
  if (s === 4) {
    if (behaviourDetected && !isLowQuality) b = Math.max(b, 3); else b = Math.min(b, 2);
    if (detailCount >= 1 && !isLowQuality) d = Math.max(d, 3);
    if (wordCount >= 8 && !isLowQuality && evidence?.hasPunctuation) w = Math.max(w, 3);
  }
  if (isLowQuality) { b = Math.min(b, 2); d = Math.min(d, 1); w = Math.min(w, 2); }
  return {
    behaviourScore: Math.max(0, Math.min(5, Math.round(b))),
    detailScore:    Math.max(0, Math.min(5, Math.round(d))),
    writingScore:   Math.max(0, Math.min(5, Math.round(w))),
  };
}

export function generateScoreRationale(text, behaviourScore, detailScore, writingScore, animalId, stage) {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  const s = stage || 4;
  const hasPunct = /[.!?]/.test(text);
  const hasExplanation = ['because','so that','helps','allows','means','therefore','so','since'].some(w => lower.includes(w));

  let behaviourRationale;
  if (behaviourScore >= 5) behaviourRationale = 'Clear, specific observation directly relevant to the task.';
  else if (behaviourScore === 4) behaviourRationale = 'Relevant observation with supporting context.';
  else if (behaviourScore === 3) behaviourRationale = 'Response mentions something relevant to the task.';
  else if (behaviourScore === 2) behaviourRationale = 'Response is vague or does not clearly relate to the question.';
  else behaviourRationale = 'No clear connection to the task or animal observed.';

  let detailRationale;
  if (detailScore >= 5) detailRationale = 'Response includes multiple specific, accurate supporting details.';
  else if (detailScore === 4) detailRationale = 'Response includes a clear supporting idea or explanation.';
  else if (detailScore === 3) detailRationale = 'Response includes at least one relevant idea.';
  else if (detailScore === 2) detailRationale = 'Response attempts a related idea but lacks accuracy or clarity.';
  else detailRationale = 'No supporting detail or idea identified.';

  let writingRationale;
  if (writingScore >= 5) writingRationale = `Clear, well-structured response (${wc} words). Good use of sentences.`;
  else if (writingScore === 4) writingRationale = `Mostly readable response (${wc} words). Reasonable sentence structure.`;
  else if (writingScore === 3) writingRationale = `Readable response (${wc} words)${hasPunct ? '' : ' - missing punctuation'}.`;
  else if (writingScore === 2) writingRationale = `Short or partial response (${wc} words). Some readable content.`;
  else writingRationale = `Very short response (${wc} word${wc !== 1 ? 's' : ''}). Difficult to assess written communication.`;

  const total = behaviourScore + detailScore + writingScore;
  let overallFeedback;
  if (s <= 2) {
    if (total >= 12) overallFeedback = 'Amazing work! You noticed lots of things.';
    else if (total >= 9) overallFeedback = 'Great job! Try adding one more detail next time.';
    else if (total >= 6) overallFeedback = 'Good try! Keep looking carefully and write what you see.';
    else overallFeedback = 'Keep trying! Write one thing you noticed about the animal.';
  } else if (s === 3) {
    if (total >= 12) overallFeedback = 'Strong response. Well observed and clearly written.';
    else if (total >= 9) overallFeedback = 'Good response. Add another detail to make it even stronger.';
    else if (total >= 6) overallFeedback = 'You have the right idea. Make sure your ideas are clearly explained.';
    else overallFeedback = 'Try again - focus on what you saw and write it clearly.';
  } else if (s === 4) {
    if (total >= 12) overallFeedback = 'Strong, well-structured response with clear observation.';
    else if (total >= 9) overallFeedback = 'Good response. Include more specific evidence to strengthen it.';
    else if (total >= 6) overallFeedback = 'Developing response. Focus on precise description and explanation.';
    else overallFeedback = 'Limited response. Encourage more detailed and targeted observation.';
  } else {
    if (total >= 12) overallFeedback = 'Excellent. Precise observation with clear explanatory reasoning.';
    else if (total >= 9) overallFeedback = 'Good observation. Improve by explaining why this behaviour or feature is significant.';
    else if (total >= 6) overallFeedback = 'Partial response. Strengthen by adding explanation and specific evidence.';
    else overallFeedback = 'Insufficient explanation. Ensure the response addresses the why and how, not just the what.';
  }

  let confidence = 'high';
  if (wc < 5 || behaviourScore <= 1) confidence = 'low';
  else if (wc < 10 || behaviourScore <= 2) confidence = 'medium';

  const behaviourSignals = words.filter(w => ['see','saw','observe','noticed','watch','look','found','heard'].some(k => w.toLowerCase().includes(k)));
  const explanationSignals = words.filter(w => ['because','so','helps','allows','means','therefore'].some(k => w.toLowerCase().includes(k)));

  return {
    rationale: { behaviour: behaviourRationale, detail: detailRationale, writing: writingRationale },
    improvementTips: {},
    overallFeedback,
    extractedEvidence: { wordCount: wc, hasExplanation, hasPunctuation: hasPunct, behaviourSignals, explanationSignals },
    confidence,
    reviewRecommended: confidence === 'low' || (behaviourScore <= 2 && detailScore <= 2),
  };
}

export function scoreObservation(text, animalId, classStage) {
  const lower = text.toLowerCase();
  const stage = classStage || 4;
  let behaviourBonus, detailBonus, literacyBonus;

  if (animalId === 'lion') {
    const conservationWords = ['important','protect','ecosystem','balance','food chain','biodiversity','conservation','survive','survival','species','nature','wild','wildlife'];
    const detailWords = ['prey','predator','extinction','humans','habitat','biodiversity','threat','poaching','population','climate','savanna','africa','apex','chain'];
    const conservationHits = conservationWords.filter(w => lower.includes(w)).length;
    const detailHits = detailWords.filter(w => lower.includes(w)).length;
    const hasExplanation = ['because','so','helps','allows','leads','since','therefore','means','in order','as a result'].some(p => lower.includes(p));
    behaviourBonus = Math.min(conservationHits + 1, 5);
    if (stage <= 2) {
      const s1words = ['lion','lions','big','large','huge','strong','sleeping','resting','walking','running','eating','mane','fur','yellow','golden','paw','tail','shade','grass'];
      behaviourBonus = stage1BehaviourScore(text, s1words);
      detailBonus = stage1DetailScore(text, s1words);
      literacyBonus = stage1WritingScore(text);
    } else if (stage === 3) {
      const s3 = stage3Score(detailHits, hasExplanation);
      behaviourBonus = s3.b; detailBonus = s3.d;
    } else if (stage === 5) {
      const s5 = stage5Score(text, conservationWords, detailWords, hasExplanation);
      behaviourBonus = s5.b; detailBonus = s5.d; literacyBonus = s5.w;
    } else {
      const s4 = stage4Score(detailHits, hasExplanation, text.trim().split(/\s+/).filter(Boolean).length);
      behaviourBonus = Math.max(behaviourBonus, s4.b); detailBonus = s4.d;
    }
    if (stage !== 5) literacyBonus = calculateWritingScore(text, stage);
  } else if (animalId === 'chimpanzee') {
    const behaviourWords = ['groom','play','interact','fight','chase','touch','hug','follow','watch','look','sit','move','climb','eat','feed','rest','sleep','call','scream','together'];
    const behaviourHits = behaviourWords.filter(w => lower.includes(w)).length;
    behaviourBonus = Math.min(behaviourHits + 1, 5);
    const detailWords = ['groom','dominan','leader','young','baby','adult','male','female','hierarchy','bond','communicat','gesture','sound','noise','fur','branch','tree','group','community','family'];
    const detailHits = detailWords.filter(w => lower.includes(w)).length;
    const hasExplanation = ['because','so','helps','allows'].some(p => lower.includes(p));
    if (stage <= 2) {
      const s1words = ['chimp','chimpanzee','together','group','playing','eating','sitting','climbing','grooming','touching','looking','tree','branch','fur','black','brown','hugging','moving'];
      behaviourBonus = stage1BehaviourScore(text, s1words);
      detailBonus = stage1DetailScore(text, s1words);
      literacyBonus = stage1WritingScore(text);
    } else if (stage === 3) {
      const s3 = stage3Score(detailHits, hasExplanation);
      behaviourBonus = s3.b; detailBonus = s3.d;
    } else if (stage === 5) {
      const s5 = stage5Score(text, behaviourWords, detailWords, hasExplanation);
      behaviourBonus = s5.b; detailBonus = s5.d; literacyBonus = s5.w;
    } else {
      const s4 = stage4Score(detailHits, hasExplanation, text.trim().split(/\s+/).filter(Boolean).length);
      behaviourBonus = Math.max(behaviourBonus, s4.b); detailBonus = s4.d;
    }
    if (stage !== 5) literacyBonus = calculateWritingScore(text, stage);
  } else if (animalId === 'gorilla') {
    behaviourBonus = calculateBehaviourScore(text);
    literacyBonus = calculateWritingScore(text, stage);
    const observationWords = ['sit','stand','move','eat','groom','play','look','climb','walk','rest','interact','together','group'];
    const conceptWords = ['social','group','behaviour','bond','family','dominan','hierarch','communicat','cooperat','relation','protect','young','leader','silverback'];
    const hasExp = ['because','helps','so that','in order','allows','enables','this means','for survival','stay safe','each other'].some(p => lower.includes(p));
    const hasObservation = observationWords.some(w => lower.includes(w));
    const hasConcept = conceptWords.some(w => lower.includes(w));
    const elements = [hasObservation, hasConcept, hasExp].filter(Boolean).length;
    if (stage <= 2) {
      const s1words = ['gorilla','gorillas','big','large','strong','black','sitting','eating','climbing','walking','resting','arm','hand','tree','branch','ground','together','group','human'];
      behaviourBonus = stage1BehaviourScore(text, s1words);
      detailBonus = stage1DetailScore(text, s1words);
      literacyBonus = stage1WritingScore(text);
    } else if (stage === 5) {
      const s5 = stage5Score(text, observationWords, conceptWords, hasExp);
      behaviourBonus = s5.b; detailBonus = s5.d; literacyBonus = s5.w;
    } else {
      detailBonus = stage === 3 ? Math.min(elements + 1, 4) : Math.min(elements + 2, 5);
    }
  } else if (animalId === 'dingo') {
    // Dingo question is about camouflage - colour, texture, blending, environment
    // Generic behaviour words (movement) don't fire → use camouflage-relevant words instead
    const camouflageWords = [
      'colour','color','yellow','brown','tan','sandy','golden','red','grey','gray','beige','cream','orange','buff',
      'fur','coat','skin','pattern','texture',
      'blend','blends','blending','camouflage','camoflage','camoflague','hide','hiding','hidden',
      'match','matches','matching','similar','same','disguise',
      'sand','ground','rock','dirt','soil','grass','bush','scrub','desert','outback','landscape','background','environment','surround','surrounding',
    ];
    const detailWords = ['adaptation','survival','predator','prey','hunt','blend','camouflage','hide','protect','danger','escape','survive'];
    const camouflageHits = camouflageWords.filter(w => lower.includes(w)).length;
    const detailHits = detailWords.filter(w => lower.includes(w)).length;
    const hasExp = ['because','so','helps','allows','leads','since','therefore','means','so that','in order'].some(p => lower.includes(p));
    const wc = text.trim().split(/\s+/).filter(Boolean).length;
    if (stage <= 2) {
      const s1words = ['dingo','yellow','brown','tan','sandy','golden','fur','coat','colour','color','blend','blends','ground','sand','rock','grass','match','similar'];
      behaviourBonus = stage1BehaviourScore(text, s1words);
      detailBonus    = stage1DetailScore(text, s1words);
      literacyBonus  = stage1WritingScore(text);
    } else if (stage === 3) {
      const s3 = stage3Score(camouflageHits, hasExp);
      behaviourBonus = s3.b; detailBonus = s3.d;
      literacyBonus  = calculateWritingScore(text, stage);
    } else if (stage === 5) {
      const s5 = stage5Score(text, camouflageWords, detailWords, hasExp);
      behaviourBonus = s5.b; detailBonus = s5.d; literacyBonus = s5.w;
    } else {
      const s4b = stage4Score(camouflageHits, hasExp, wc);
      const s4d = stage4Score(detailHits, hasExp, wc);
      behaviourBonus = s4b.b; detailBonus = s4d.d;
      literacyBonus  = calculateWritingScore(text, stage);
    }
  } else {
    const zzAnimalIds = new Set(['tiger','rhino','binturong','sun-bear']);
    behaviourBonus = zzAnimalIds.has(animalId) ? calculateZzBehaviourScore(text) : calculateBehaviourScore(text);
    literacyBonus = calculateWritingScore(text, stage);
    const detailRoots = ['tree','rock','water','grass','shade','log','branch','leaf','fence','platform','ground','enclosure','bird','wind','sound','noise','smell','stripe','fur','tail','claw'];
    const detailHits = detailRoots.filter(root => lower.includes(root)).length;
    const hasExp = ['because','so','helps','allows','leads','since','therefore'].some(p => lower.includes(p));
    if (stage <= 2) {
      detailBonus = Math.min(detailHits + 1, 5);
    } else {
      const s4 = stage4Score(detailHits, hasExp, text.trim().split(/\s+/).filter(Boolean).length);
      detailBonus = s4.d;
    }
  }

  return {
    behaviourBonus: behaviourBonus || 1,
    detailBonus:    detailBonus    || 1,
    literacyBonus:  literacyBonus  || 1,
  };
}

function scoreConcertLawnMathsObservation(text, classStage) {
  const lower = text.toLowerCase();
  const wc = text.trim().split(/\s+/).filter(Boolean).length;

  // Six categories from the prompt
  const categories = [
    /estimat|approximat|about|roughly|around|maybe|perhaps|guess/,
    /\b\d+(\.\d+)?\s*(m|cm|km|steps?|metres?|meters?|seconds?|minutes?)\b|measure|length|width|stride|distance|area|pace/,
    /compar|than|bigger|smaller|softer|harder|warmer|cooler|more|less|different|unlike|versus|\bvs\b/,
    /pattern|repeat|regular|even|uneven|uniform|grid|row|symmetr/,
    /\b\d+\b/,
    /flat|sloped|slope|soft|hard|rough|smooth|spongy|firm|texture|surface|circle|rectangle|square|triangle|curve|angle|oval|shape|edge|corner/,
  ];
  const categoriesFound = categories.filter(re => re.test(lower)).length;

  const hasMathVocab = /estimat|measure|calculat|approximat|equal|fraction|decimal|percent|proportion|average|area|perimeter|gradient|surface|unit|dimension/.test(lower);
  const hasSpecifics = /grass|lawn|ground|soil|concrete|path|foot|feet|step|stride|slope|temperature|texture|tree|bench|edge|border/.test(lower);

  // Method: category diversity
  let method = categoriesFound >= 5 ? 5 : categoriesFound >= 4 ? 4 : categoriesFound >= 3 ? 3 : categoriesFound >= 2 ? 2 : 1;

  // Accuracy: quality of mathematical description
  let accuracy;
  if (categoriesFound >= 3 && hasMathVocab && hasSpecifics) accuracy = 5;
  else if (categoriesFound >= 2 && (hasMathVocab || hasSpecifics)) accuracy = 4;
  else if (categoriesFound >= 2) accuracy = 3;
  else if (categoriesFound >= 1 && hasSpecifics) accuracy = 3;
  else if (categoriesFound >= 1) accuracy = 2;
  else accuracy = 1;

  // Communication: structure and length
  const hasCapital = /^[A-Z]/.test(text.trim());
  const hasFullStop = /[.!?]/.test(text);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5).length;
  let comms = 1;
  if (wc >= 10) comms = 2;
  if (wc >= 20 && (hasCapital || hasFullStop)) comms = 3;
  if (wc >= 25 && hasCapital && hasFullStop && sentences >= 2) comms = 4;
  if (wc >= 40 && hasCapital && hasFullStop && sentences >= 3) comms = 5;

  if (classStage <= 2) {
    method   = Math.min(5, method + 1);
    accuracy = Math.min(5, accuracy + 1);
    comms    = Math.min(5, comms + 1);
  } else if (classStage === 3) {
    method = Math.min(5, method + 1);
    comms  = Math.min(5, comms + 1);
  }

  return {
    behaviourBonus: Math.max(1, Math.min(5, method)),
    detailBonus:    Math.max(1, Math.min(5, accuracy)),
    literacyBonus:  Math.max(1, Math.min(5, comms)),
    answerCorrect:  false,
  };
}

function scoreTigerMathsObservation(text, classStage) {
  const lower = text.toLowerCase();
  const wc = text.trim().split(/\s+/).filter(Boolean).length;

  // Six categories from the prompt
  const categories = [
    /pattern|stripe|symmetr|repeat|tessell|parallel|alternati|regular|sequence/,
    /circle|rectangle|square|triangle|curve|angle|oval|round|arch|cylinder|cone|straight|diagonal|polygon|line|edge/,
    /\b\d+\b|count|number|many|how many|total|tally/,
    /far|close|near|distant| metre| meter| cm |kilomet|distance|apart|space|gap|length|wide|tall|height|depth/,
    /speed|fast|slow|quick|mov|walk|run|pace|direction|turn|step|stride|frequenc|rhythm|times per|rate|path|arc/,
    /bigger|smaller|larger|more|less|heavier|lighter|taller|shorter|wider|narrower|than|compar|ratio|times as|twice|double/,
  ];
  const categoriesFound = categories.filter(re => re.test(lower)).length;

  const hasMathVocab = /estimate|measure|calculat|approximat|equal|fraction|decimal|percent|proportion|average|symmetr|scale|unit|dimension|perpendicular/.test(lower);
  const hasSpecifics = /tiger|stripe|fence|tree|rock|water|path|bench|sign|pool|shadow|glass|wall|floor|ground|visitor|keeper/.test(lower);

  // Method: category diversity
  let method = categoriesFound >= 5 ? 5 : categoriesFound >= 4 ? 4 : categoriesFound >= 3 ? 3 : categoriesFound >= 2 ? 2 : 1;

  // Accuracy: quality of mathematical description
  let accuracy;
  if (categoriesFound >= 3 && hasMathVocab && hasSpecifics) accuracy = 5;
  else if (categoriesFound >= 2 && (hasMathVocab || hasSpecifics)) accuracy = 4;
  else if (categoriesFound >= 2) accuracy = 3;
  else if (categoriesFound >= 1 && hasSpecifics) accuracy = 3;
  else if (categoriesFound >= 1) accuracy = 2;
  else accuracy = 1;

  // Communication: structure and length
  const hasCapital = /^[A-Z]/.test(text.trim());
  const hasFullStop = /[.!?]/.test(text);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5).length;
  let comms = 1;
  if (wc >= 10) comms = 2;
  if (wc >= 20 && (hasCapital || hasFullStop)) comms = 3;
  if (wc >= 25 && hasCapital && hasFullStop && sentences >= 2) comms = 4;
  if (wc >= 40 && hasCapital && hasFullStop && sentences >= 3) comms = 5;

  if (classStage <= 2) {
    method   = Math.min(5, method + 1);
    accuracy = Math.min(5, accuracy + 1);
    comms    = Math.min(5, comms + 1);
  } else if (classStage === 3) {
    method = Math.min(5, method + 1);
    comms  = Math.min(5, comms + 1);
  }

  return {
    behaviourBonus: Math.max(1, Math.min(5, method)),
    detailBonus:    Math.max(1, Math.min(5, accuracy)),
    literacyBonus:  Math.max(1, Math.min(5, comms)),
    answerCorrect:  false,
  };
}

function scoreMathsObservation(text, classStage, expectedAnswers) {
  const lower = text.toLowerCase();
  const wc = text.trim().split(/\s+/).filter(Boolean).length;

  // Numbers: count distinct numeric tokens (integers, decimals, fractions like 3/5)
  const numberCount = (text.match(/\d+(\.\d+)?(\/\d+)?/g) || []).length;

  // Mathematical working signals
  const equalsCount = (text.match(/=/g) || []).length;
  const hasTimes    = /[×✕]/.test(text) || lower.includes('×');
  const hasDivide   = /[÷]/.test(text) || /\d+\/\d+/.test(text) || lower.includes('divided') || lower.includes('÷');
  const hasPercent  = /%/.test(text) || lower.includes('percent');
  const hasAddSub   = /[+]/.test(text) || /\s[-]\s/.test(text);
  const operatorCount = [equalsCount >= 2, hasTimes, hasDivide, hasPercent, hasAddSub].filter(Boolean).length;
  const hasWorkingChain = equalsCount >= 3; // e.g. = 30/100 × 24 = 0.30 × 24 = 7.2

  // Labels or organised structure (e.g. "Resting:", "Answer:", "Step 1:")
  const hasLabels = /[A-Za-z][a-z ]+:/.test(text);

  // Units present alongside numbers
  const hasUnits = /\d+\s*(m|cm|km|kg|g|%|hours?|minutes?|seconds?|steps?|\$|kJ|km²|m²)/i.test(text)
    || ['hours', 'minutes', 'metres', 'kilograms', 'dollars', 'percent', 'steps', 'kilojoules'].some(u => lower.includes(u));

  // Written maths vocabulary (beyond symbols)
  const mathVocab = ['fraction', 'decimal', 'percentage', 'ratio', 'rate', 'area', 'perimeter',
    'mean', 'median', 'mode', 'probability', 'formula', 'proportion', 'average', 'total',
    'simplified', 'simplify', 'estimate', 'range', 'frequency', 'difference', 'quotient'];
  const vocabHits = mathVocab.filter(w => lower.includes(w)).length;

  // Interpretation or conclusion sentence
  const hasInterpretation = ['this means','therefore','because','which means','so the','showing',
    'suggests','tells us','most common','compared','is greater','is less','is higher','is lower',
    'this shows','as a result'].some(p => lower.includes(p));

  // ── Method (showing working / approach) ──────────────────────────────────────
  let method = 1;
  if (numberCount >= 1) method = 2;
  if (numberCount >= 2 && (equalsCount >= 1 || operatorCount >= 1)) method = 3;
  if (numberCount >= 3 && (hasWorkingChain || operatorCount >= 2)) method = 4;
  if (numberCount >= 4 && hasWorkingChain && (hasLabels || hasInterpretation || vocabHits >= 1)) method = 5;

  // ── Accuracy (numbers, units, notation) ─────────────────────────────────────
  let accuracy = 1;
  if (numberCount >= 1) accuracy = 2;
  if (numberCount >= 2) accuracy = 3;
  if (numberCount >= 2 && hasUnits) accuracy = 4;
  if (numberCount >= 3 && hasUnits && operatorCount >= 2) accuracy = 5;

  // ── Communication (structure + vocabulary) ───────────────────────────────────
  const hasCapital  = /^[A-Z]/.test(text);
  const hasStructure = hasLabels || hasWorkingChain || (hasCapital && wc >= 8);
  let comms = 1;
  if (numberCount >= 1 || wc >= 3) comms = 2;
  if (hasStructure && numberCount >= 2) comms = 3;
  if (hasStructure && numberCount >= 3 && (hasUnits || vocabHits >= 1)) comms = 4;
  if (hasStructure && numberCount >= 4 && hasUnits && (vocabHits >= 1 || hasInterpretation)) comms = 5;

  // Answer check - boost accuracy if a key expected answer is found in the response
  const answerCorrect = checkExpectedAnswers(text, expectedAnswers);
  if (answerCorrect) {
    accuracy = Math.min(5, accuracy + 1);
  }

  // Stage adjustments - lower stages need fewer signals to reach a good score
  if (classStage <= 2) {
    method   = Math.min(5, method + 1);
    accuracy = Math.min(5, accuracy + 1);
    comms    = Math.min(5, comms + 1);
  } else if (classStage === 3) {
    method = Math.min(5, method + 1);
  }

  return {
    behaviourBonus: Math.max(1, Math.min(5, method)),
    detailBonus:    Math.max(1, Math.min(5, accuracy)),
    literacyBonus:  Math.max(1, Math.min(5, comms)),
    answerCorrect,
  };
}

function buildMathsObservationScore(text, animalId, classStage) {
  const isTiger = animalId === 'tiger';
  const isConcertLawn = animalId === 'concert-lawn';
  const isOpenEnded = isTiger || isConcertLawn;
  const { behaviourBonus, detailBonus, literacyBonus, answerCorrect } =
    isTiger      ? scoreTigerMathsObservation(text, classStage) :
    isConcertLawn ? scoreConcertLawnMathsObservation(text, classStage) :
    scoreMathsObservation(text, classStage, MATHS_ANIMALS?.[animalId]?.expectedAnswers?.[classStage] || []);
  const wc = text.trim().split(/\s+/).filter(Boolean).length;

  const methodRationale = isOpenEnded
    ? (behaviourBonus >= 5 ? 'Outstanding - covered 5+ distinct categories of maths.' :
       behaviourBonus >= 4 ? 'Strong variety - covered 4 categories of maths.' :
       behaviourBonus >= 3 ? 'Good range - covered 3 categories (e.g. estimate, number, comparison).' :
       behaviourBonus >= 2 ? 'Covered 1–2 categories. Try including more types.' :
                             'Response does not yet identify mathematical categories.')
    : (behaviourBonus >= 5 ? 'Working shown step-by-step with clear method.' :
       behaviourBonus >= 4 ? 'Working mostly shown. Clear approach evident.' :
       behaviourBonus >= 3 ? 'Some working shown. Approach is recognisable.' :
       behaviourBonus >= 2 ? 'Limited working shown. Method is not clear.' :
                             'No working shown.');

  const accuracyRationale = isOpenEnded
    ? (detailBonus >= 5 ? 'Precise mathematical language used. Observations are specific and well-named.' :
       detailBonus >= 4 ? 'Good mathematical vocabulary. Observations are mostly specific.' :
       detailBonus >= 3 ? 'Some maths vocabulary used. Try naming exactly what you noticed.' :
       detailBonus >= 2 ? 'General observations made. Use more precise mathematical terms.' :
                          'No mathematical description found.')
    : (answerCorrect
        ? (detailBonus >= 5 ? 'Correct answer found. Numbers, units, and notation all present.' :
           detailBonus >= 4 ? 'Correct answer found. Numbers and units present.' :
           detailBonus >= 3 ? 'Correct answer identified in response.' :
                              'Correct answer present. More working or units needed.')
        : (detailBonus >= 5 ? 'Numbers, units, and mathematical notation all present.' :
           detailBonus >= 4 ? 'Numbers and units present. Working is legible.' :
           detailBonus >= 3 ? 'Numbers present. Units or notation partially shown.' :
           detailBonus >= 2 ? 'Some numbers present.' :
                              'No numbers or calculations visible.'));

  const communicationRationale = isOpenEnded
    ? (literacyBonus >= 5 ? `Well-structured observations (${wc} words). Multiple clear sentences.` :
       literacyBonus >= 4 ? `Clear observations (${wc} words). Good sentence structure.` :
       literacyBonus >= 3 ? `Readable response (${wc} words). Try writing in full sentences.` :
       literacyBonus >= 2 ? `Short response (${wc} words). Write more to show what you noticed.` :
                            'Very limited response.')
    : (literacyBonus >= 5 ? `Well-structured response (${wc} words). Labels and vocabulary used effectively.` :
       literacyBonus >= 4 ? `Clearly organised (${wc} words). Structure supports understanding.` :
       literacyBonus >= 3 ? `Readable response (${wc} words). Some structure evident.` :
       literacyBonus >= 2 ? `Short or partial response (${wc} words).` :
                            'Very limited communication.');

  const total = behaviourBonus + detailBonus + literacyBonus;
  const overallFeedback = isOpenEnded
    ? (total >= 13 ? 'Excellent! You noticed maths across many categories and described them precisely.' :
       total >= 10 ? 'Great observations. Try to identify more categories or use more specific mathematical language.' :
       total >= 7  ? 'Good start. Try to include more types - estimates, measurements, comparisons, patterns.' :
                     'Keep looking! Try to write down at least 2 or 3 mathematical things you noticed.')
    : (total >= 13 ? 'Excellent mathematical response. Clear working, accurate numbers, well communicated.' :
       total >= 10 ? 'Strong response. Show more steps or include units to improve further.' :
       total >= 7  ? 'Good attempt. Aim to show all working clearly with appropriate units.' :
                     'Include more working and numbers in your response.');

  return {
    behaviour: Math.max(1, Math.min(5, behaviourBonus)),
    detail:    Math.max(1, Math.min(5, detailBonus)),
    writing:   Math.max(1, Math.min(5, literacyBonus)),
    rationale: { behaviour: methodRationale, detail: accuracyRationale, writing: communicationRationale },
    improvementTips: {},
    extractedEvidence: { wordCount: wc, hasExplanation: false, hasPunctuation: /[.!?]/.test(text), behaviourSignals: [], explanationSignals: [] },
    overallFeedback,
    confidence: total >= 7 ? 'high' : 'medium',
    reviewRecommended: total < 7,
  };
}

function buildPdhpeObservationScore(text, animalId, classStage) {
  if (isLowQualityResponse(text)) {
    return {
      behaviour: 1, detail: 1, writing: 1,
      rationale: {
        behaviour: 'Response did not clearly engage with the topic.',
        detail:    'No health understanding demonstrated.',
        writing:   'Response needs capital letters, full stops and complete sentences.',
      },
      improvementTips: ['Write at least one full sentence about what you observed.'],
      extractedEvidence: [],
      confidence: 'low',
      reviewRecommended: true,
      overallFeedback: 'Response needs development - prompt the student to write at least one full sentence about what they observed.',
    };
  }

  const lower = text.toLowerCase();
  const wc    = text.trim().split(/\s+/).filter(Boolean).length;

  // Lifestyle / comparison vocabulary (core for chimpanzee task, counts for all PDHPE)
  const lifestyleVocab = ['similar', 'similarity', 'different', 'difference', 'same', 'compare', 'comparison',
    'habit', 'lifestyle', 'healthy', 'health', 'unhealthy', 'more than', 'less than', 'more active',
    'outside', 'outdoors', 'sleep', 'sleeping', 'rest', 'resting', 'move', 'moving', 'active',
    'activity', 'eating', 'food', 'diet', 'social', 'together', 'group', 'adopt', 'improve',
    'benefit', 'could', 'should', 'try', 'change'];
  const lifestyleHits = lifestyleVocab.filter(w => lower.includes(w)).length;

  // Physical/movement vocabulary
  const physVocab = ['heart rate', 'pulse', 'heart', 'muscle', 'breathe', 'breathing', 'exercise', 'fitness',
    'cardiovascular', 'aerobic', 'anaerobic', 'endurance', 'strength', 'flexibility', 'energy',
    'atp', 'oxygen', 'blood', 'lungs', 'sprint', 'recovery', 'bone', 'skeletal',
    'fibre', 'fiber', 'twitch', 'vo2', 'cardio', 'body', 'movement'];
  const physHits = physVocab.filter(w => lower.includes(w)).length;

  // Mental health / wellbeing vocabulary
  const wellVocab = ['wellbeing', 'well-being', 'mental health', 'stress', 'cortisol', 'oxytocin', 'hormone',
    'mood', 'emotion', 'belong', 'belonging', 'identity', 'connect', 'connection',
    'anxiety', 'depression', 'happy', 'happiness', 'mindful', 'nature', 'calm', 'resilience',
    'self-esteem', 'community', 'support', 'relationship', 'hpa', 'serotonin', 'dopamine',
    'biopsychosocial', 'psychological', 'motivation', 'determinant'];
  const wellHits = wellVocab.filter(w => lower.includes(w)).length;

  const totalVocabHits = lifestyleHits + physHits + wellHits;

  // Explanation / analysis language
  const hasExplanation = ['because', 'therefore', 'which means', 'this shows', 'this helps',
    'this causes', 'as a result', 'in order to', 'due to', 'so that', 'would help',
    'increases', 'decreases', 'affects', 'supports', 'links to', 'related to'].some(p => lower.includes(p));

  // Personal observation or connection to the animal
  const hasPersonal = ['i noticed', 'i observed', 'i saw', 'i felt', 'i could see', 'i think', 'i could',
    'my ', 'the chimp', 'the gorilla', 'the lion', 'the giraffe', 'the tiger',
    'the koala', 'the dingo', 'the lemur', 'the sea lion', 'the buffalo',
    'chimpanzee', 'chimps'].some(p => lower.includes(p));

  const hasNumbers    = /\d+/.test(text);
  const hasCap        = /^[A-Z]/.test(text);
  const hasStop       = /[.!?]/.test(text);
  const sentences     = text.split(/[.!?]+/).filter(s => s.trim().length > 2);
  const multiSentence = sentences.length >= 2;
  const words         = text.trim().split(/\s+/).filter(Boolean);
  const uniqueWords   = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean));
  const isAllCaps     = text.length > 4 && text === text.toUpperCase();

  // Comparison (behaviour slot) - did they engage with the topic?
  let comparison = 1;
  if (wc >= 4 && (lifestyleHits >= 1 || physHits >= 1 || wellHits >= 1 || hasPersonal)) comparison = 2;
  if (wc >= 5 && (lifestyleHits >= 1 || hasPersonal))            comparison = 3;
  if (wc >= 8 && (lifestyleHits >= 2 || (lifestyleHits >= 1 && hasPersonal))) comparison = Math.max(comparison, 3);
  if (totalVocabHits >= 2 && (hasExplanation || hasPersonal))    comparison = Math.max(comparison, 4);
  if (totalVocabHits >= 4 && hasExplanation && multiSentence)    comparison = 5;

  // Understanding (detail slot) - did they show any health understanding?
  let understanding = 1;
  if (wc >= 4 && (lifestyleHits >= 1 || physHits >= 1 || wellHits >= 1)) understanding = 2;
  if (lifestyleHits >= 1 || physHits >= 1 || wellHits >= 1)      understanding = Math.max(understanding, 3);
  if (totalVocabHits >= 2 && hasExplanation)                      understanding = Math.max(understanding, 4);
  if (totalVocabHits >= 4 && hasExplanation && multiSentence)     understanding = 5;

  // Communication (writing slot) - based on spelling, grammar, capitals and sentence structure only
  let comms = 1;
  if (wc >= 5 && (hasCap || hasStop))                       comms = 2;
  if (wc >= 5 && hasCap)                                    comms = Math.max(comms, 2);
  if (wc >= 6 && hasCap && hasStop)                                               comms = 3;
  if (multiSentence && hasCap && hasStop)                                         comms = Math.max(comms, 3);
  if (wc >= 12 && hasCap && hasStop && uniqueWords.size >= 8)                    comms = Math.max(comms, 4);
  if (multiSentence && hasCap && hasStop && uniqueWords.size >= 8)                comms = Math.max(comms, 4);
  if (multiSentence && hasCap && hasStop && uniqueWords.size >= 12 && !isAllCaps) comms = 5;
  if (wc >= 18 && hasCap && hasStop && uniqueWords.size >= 12 && !isAllCaps)     comms = Math.max(comms, 5);
  if (isAllCaps) comms = Math.max(1, comms - 1);

  comparison    = Math.max(1, Math.min(5, comparison));
  understanding = Math.max(1, Math.min(5, understanding));
  comms         = Math.max(1, Math.min(5, comms));

  const rationale = {
    behaviour: comparison >= 4
      ? 'Student clearly engaged with the topic and made a specific, well-developed response.'
      : comparison >= 3
      ? 'Student identified a relevant idea or connection related to the topic.'
      : comparison >= 2
      ? 'Student made a basic attempt but the response needs more detail.'
      : 'Student response did not clearly engage with the topic.',
    detail: understanding >= 4
      ? 'Student demonstrated good understanding of a health or lifestyle concept with explanation.'
      : understanding >= 3
      ? 'Student showed some understanding of how the topic relates to health.'
      : understanding >= 2
      ? 'Student showed basic awareness but needs more depth.'
      : 'Student response did not demonstrate understanding of a health concept.',
    writing: comms >= 4
      ? 'Student wrote in clear, correctly punctuated sentences with a capital letter and varied vocabulary.'
      : comms >= 3
      ? 'Student used capital letters and full stops with reasonable sentence structure.'
      : comms >= 2
      ? 'Student attempted to write sentences but is missing capital letters or punctuation.'
      : 'Response needs capital letters, full stops and complete sentences.',
  };

  const avg = (comparison + understanding + comms) / 3;
  const overallFeedback = avg >= 4
    ? 'Strong response - student engaged with the topic, showed health understanding and wrote clearly.'
    : avg >= 3
    ? 'Good response - student addressed the topic. Encourage more explanation and check punctuation.'
    : avg >= 2
    ? 'Developing response - encourage the student to write in full sentences with a capital letter and full stop.'
    : 'Response needs development - prompt the student to write at least one full sentence about what they observed.';

  return {
    behaviour: comparison,
    detail:    understanding,
    writing:   comms,
    rationale,
    improvementTips: [
      comparison < 3    ? 'Write at least one idea about what you observed or learned.' : null,
      understanding < 3 ? 'Explain how your idea connects to health (e.g. "this is good for your body because…").' : null,
      comms < 3         ? 'Start with a capital letter, use full stops at the end of sentences, and check your spelling.' : null,
    ].filter(Boolean),
    extractedEvidence: [],
    confidence: avg >= 3 ? 'high' : avg >= 2 ? 'medium' : 'low',
    reviewRecommended: false,
    overallFeedback,
  };
}

export function buildObservationScore(text, animalId, classStage, classSubject) {
  if (classSubject === 'maths') {
    return buildMathsObservationScore(text, animalId, classStage);
  }
  if (classSubject === 'pdhpe') {
    return buildPdhpeObservationScore(text, animalId, classStage);
  }
  const { behaviourBonus, detailBonus, literacyBonus } = scoreObservation(text, animalId, classStage);
  const scoreRationale = generateScoreRationale(text, behaviourBonus, detailBonus, literacyBonus, animalId, classStage);
  const normalisedScores = normaliseScores({
    behaviourScore: behaviourBonus,
    detailScore:    detailBonus,
    writingScore:   literacyBonus,
    evidence:       scoreRationale.extractedEvidence,
    stage:          classStage,
    isLowQuality:   isLowQualityResponse(text),
  });
  return {
    behaviour: normalisedScores.behaviourScore,
    detail:    normalisedScores.detailScore,
    writing:   normalisedScores.writingScore,
    rationale: scoreRationale.rationale,
    overallFeedback: scoreRationale.overallFeedback,
    improvementTips: scoreRationale.improvementTips,
    extractedEvidence: scoreRationale.extractedEvidence,
    confidence: scoreRationale.confidence,
    reviewRecommended: scoreRationale.reviewRecommended,
  };
}

export function calculateWritingScore(studentResponse, stage) {
  const stg  = stage || 4;
  const text = studentResponse.trim();
  if (!text) return 0;
  if (isLowQualityResponse(text)) return 1;

  const words     = text.split(/\s+/).filter(Boolean);
  const wc        = words.length;
  const unique    = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean));
  const uCount    = unique.size;

  const hasCapital    = /^[A-Z]/.test(text);
  const hasFullStop   = /[.!?]/.test(text);
  const sentences     = text.split(/[.!?]+/).filter(s => s.trim().length > 2);
  const multiSentence = sentences.length >= 2;
  const isAllCaps     = text === text.toUpperCase() && wc > 2;
  const hasExplanation = ['because','so','helps','allows','means','therefore','since','so that'].some(w => text.toLowerCase().includes(w));

  let score = 1;

  if (stg <= 2) {
    if (wc >= 2)                                      score = 2;
    if (wc >= 4)                                      score = 3;
    if (score >= 3 && (hasCapital || hasFullStop))    score = Math.max(score, 4);
    if (hasCapital && hasFullStop)                     score = Math.max(score, 4);
    if (hasCapital && hasFullStop && wc >= 6)         score = Math.max(score, 5);
  } else if (stg === 3) {
    if (wc >= 4)                                      score = 2;
    if (wc >= 6)                                      score = 3;
    if (hasCapital && hasFullStop)                     score = Math.max(score, 4);
    if (hasCapital && hasFullStop && (multiSentence || uCount >= 8)) score = Math.max(score, 5);
  } else if (stg === 4) {
    if (wc >= 5)                                      score = 2;
    if (wc >= 7)                                      score = 3;
    if (hasCapital && hasFullStop)                     score = Math.max(score, 4);
    if (hasCapital && hasFullStop && (multiSentence || hasExplanation || uCount >= 8)) score = Math.max(score, 5);
  } else {
    if (wc >= 6)                                      score = 2;
    if (wc >= 9)                                      score = 3;
    if (hasCapital && hasFullStop && uCount >= 5)     score = Math.max(score, 4);
    if (hasCapital && hasFullStop && (multiSentence || hasExplanation) && uCount >= 8) score = Math.max(score, 5);
  }

  if (isAllCaps) score = Math.max(score - 1, 1);
  if (stg > 2 && !hasCapital && !hasFullStop) score = Math.min(score, 2);
  else if (stg > 2 && (!hasCapital || !hasFullStop)) score = Math.min(score, 3);

  if (wc >= 3) {
    const uniqueRatio = uCount / wc;
    const singleLetterCount = words.filter(w => w.replace(/[^a-zA-Z]/g, '').length === 1).length;
    let maxRun = 1, curRun = 1;
    for (let i = 1; i < words.length; i++) {
      curRun = words[i].toLowerCase() === words[i - 1].toLowerCase() ? curRun + 1 : 1;
      if (curRun > maxRun) maxRun = curRun;
    }
    if (maxRun >= 4 || uniqueRatio < 0.35 || (singleLetterCount / wc > 0.6)) score = Math.min(score, 2);
  }

  return Math.min(score, 5);
}
