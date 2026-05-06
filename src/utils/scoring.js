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
  if (wc >= 10 && uniqueWords.size >= 6) wScore = Math.max(wScore, 4);
  if (wc >= 12 && hasExplanation) wScore = Math.max(wScore, 4);
  if (wc >= 15 && hasSentence && uniqueWords.size >= 10) wScore = Math.max(wScore, 5);
  if (wc >= 12 && hasExplanation && uniqueWords.size >= 10) wScore = Math.max(wScore, 5);
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
    if (!hasExplanation) w = Math.min(w, 3);
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
    if (wordCount >= 5 && !isLowQuality) w = Math.max(w, 3);
  }
  if (s === 4) {
    if (behaviourDetected && !isLowQuality) b = Math.max(b, 3); else b = Math.min(b, 2);
    if (detailCount >= 1 && !isLowQuality) d = Math.max(d, 3);
    if (wordCount >= 8 && !isLowQuality) w = Math.max(w, 3);
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
  else if (writingScore === 3) writingRationale = `Readable response (${wc} words)${hasPunct ? '' : ' — missing punctuation'}.`;
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
    else overallFeedback = 'Try again — focus on what you saw and write it clearly.';
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
    // Dingo question is about camouflage — colour, texture, blending, environment
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

export function buildObservationScore(text, animalId, classStage) {
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
    if (hasCapital && hasFullStop && (multiSentence || hasExplanation || uCount >= 10)) score = Math.max(score, 5);
  } else {
    if (wc >= 6)                                      score = 2;
    if (wc >= 9)                                      score = 3;
    if (hasCapital && hasFullStop && uCount >= 7)     score = Math.max(score, 4);
    if (hasCapital && hasFullStop && (multiSentence || hasExplanation) && uCount >= 10) score = Math.max(score, 5);
  }

  if (isAllCaps) score = Math.max(score - 1, 1);
  if (stg > 2 && (!hasCapital || !hasFullStop)) score = Math.min(score, 3);

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
