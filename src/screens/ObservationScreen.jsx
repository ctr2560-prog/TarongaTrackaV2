import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { getStageScaffoldTip, getMinWords, getMathsObservationData } from '../utils/helpers';
import MathsCalculator from '../components/MathsCalculator';

// Per-animal heading / chip / bullet config for stage 3+
const OBS_CONFIG = {
  'chimpanzee': {
    heading: 'Chimpanzee Group Dynamics',
    chips: [{ label:'Grooming', color:'#059669' },{ label:'Communication', color:'#0284C7' },{ label:'Group roles', color:'#2E7D55' },{ label:'Relationships', color:'#DC2626' }],
    bullets: ['Social interactions (e.g. grooming, playing, aggression)','Communication (e.g. gestures, sounds, facial expressions)','Group roles (e.g. leader, dominant individuals, young)','Relationships between individuals'],
  },
  'gorilla': {
    heading: 'Gorilla Reflection',
    chips: [{ label:'Posture', color:'#059669' },{ label:'Expression', color:'#0284C7' },{ label:'Movement', color:'#2E7D55' },{ label:'Social bonds', color:'#DC2626' }],
    bullets: ['Body language and posture','How they move and interact','Facial expressions or sounds','Links to human behaviour'],
  },
  'lion': {
    heading: 'Conservation Reflection',
    chips: [{ label:'Ecosystem', color:'#059669' },{ label:'Food chain', color:'#0284C7' },{ label:'Biodiversity', color:'#2E7D55' },{ label:'Threats', color:'#DC2626' }],
    bullets: [],
  },
  'giraffe': {
    heading: 'Giraffe Adaptations',
    chips: [{ label:'Height', color:'#059669' },{ label:'Neck', color:'#0284C7' },{ label:'Colouring', color:'#2E7D55' },{ label:'Feeding', color:'#DC2626' }],
    bullets: ['What physical features you can observe','How those features help the giraffe survive','What the giraffe is doing right now','How the environment supports it'],
  },
  'lemur': {
    heading: 'Lemur Enclosure Use',
    chips: [{ label:'Position', color:'#2E7D55' },{ label:'Behaviour', color:'#059669' },{ label:'Height', color:'#0284C7' },{ label:'Movement', color:'#DC2626' }],
    bullets: ['Where the lemurs are in the enclosure (ground, trees, platforms)','What they are doing in those areas','How they move between spaces','What needs (feeding, resting, social) are being met'],
  },
  'dingo': {
    heading: 'Dingo Camouflage',
    chips: [{ label:'Fur colour', color:'#D97706' },{ label:'Texture', color:'#059669' },{ label:'Environment', color:'#0284C7' },{ label:'Blending in', color:'#DC2626' }],
    bullets: ["The colour and texture of the dingo's fur",'The colour of the surrounding environment','How well the dingo blends in','How camouflage helps the dingo survive'],
  },
  'sea-lion': {
    heading: 'Humans and the Ocean',
    chips: [{ label:'Water', color:'#0284C7' },{ label:'Enclosure', color:'#059669' },{ label:'Human impact', color:'#DC2626' },{ label:'Ocean health', color:'#2E7D55' }],
    bullets: ['What you can observe in the water and enclosure','Signs of human presence or human-made structures','How human activities may affect sea lion health','What a healthy ocean environment looks like'],
  },
  'asian-water-buffalo': {
    heading: 'Helpful Relationships',
    chips: [{ label:'Nearby animals', color:'#059669' },{ label:'Interactions', color:'#0284C7' },{ label:'Positioning', color:'#2E7D55' },{ label:'Mutualism', color:'#DC2626' }],
    bullets: ['Other animals nearby (e.g. birds, other species)','How those animals interact with the buffalo','Where they are positioned relative to each other','Why this relationship may benefit one or both animals'],
  },
  'blue-mountains-bushwalk': {
    heading: 'Listen to the Environment',
    chips: [{ label:'Sounds', color:'#059669' },{ label:'Volume', color:'#0284C7' },{ label:'Nature', color:'#2E7D55' },{ label:'Feeling', color:'#DC2626' }],
    bullets: ['Specific sounds you could hear (birds, wind, leaves)','How loud or quiet the environment was','How the sounds made you feel','How this compares to a built environment'],
  },
  'concert-lawn': {
    heading: 'Habitat Experience',
    chips: [{ label:'Texture', color:'#059669' },{ label:'Temperature', color:'#0284C7' },{ label:'Feel', color:'#2E7D55' },{ label:'Compare', color:'#DC2626' }],
    bullets: ['What the ground felt like (soft, cool, uneven)','The temperature of the grass','How this environment differs from concrete or hard surfaces','What you noticed about the natural environment'],
  },
  'koala': {
    heading: 'Koala Behaviour',
    chips: [{ label:'Behaviour', color:'#059669' },{ label:'Position', color:'#0284C7' },{ label:'Adaptation', color:'#2E7D55' },{ label:'Survival', color:'#DC2626' }],
    bullets: ['What behaviour you can observe right now','Why the koala behaves this way','How this helps it survive','What adaptations you can see'],
  },
  'tiger': {
    heading: 'Silent Forest',
    chips: [{ label:'Sounds', color:'#059669' },{ label:'Smells', color:'#0284C7' },{ label:'Habitat', color:'#2E7D55' },{ label:'Senses', color:'#DC2626' }],
    bullets: ['Sounds you can hear (water, animals, people)','Smells in the environment (fresh, earthy, strong)','What you can see around the habitat','How the environment supports the tiger'],
  },
};

const S1_QUESTIONS = {
  'chimpanzee':            'What are the chimpanzees doing together?',
  'gorilla':               'How does the gorilla look like a human?',
  'lion':                  'Why do we need to look after lions?',
  'giraffe':               'Why is the giraffe tall?',
  'koala':                 'What does the koala look like? What is it doing?',
  'tiger':                 'What did you hear or smell around the habitat?',
  'dingo':                 "What colour is the dingo's fur?",
  'lemur':                 'Where are the lemurs in their home?',
  'sea-lion':              'How do people affect sea lions?',
  'asian-water-buffalo':   'What other animals are near the buffalo?',
  'concert-lawn':          'How did the ground feel on your feet?',
  'blue-mountains-bushwalk': 'What could you hear?',
};

const S1_CUES = {
  'koala':                    ['What does it look like?','What is it doing?'],
  'lion':                     ['What are people doing?','How can we help?'],
  'tiger':                    ['What could you hear?','Could you smell anything?'],
  'giraffe':                  ['What is it reaching?','Why is it tall?'],
  'gorilla':                  ['How big is it?','What is it doing?'],
  'chimpanzee':               ['Are they together?','What are they doing?'],
  'dingo':                    ['What colour is it?','What does its fur look like?'],
  'lemur':                    ['Where is it?','What is it doing?'],
  'sea-lion':                 ['What is in the water?','What are people doing?'],
  'asian-water-buffalo':      ['What do its feet look like?','Is it big or small?'],
  'concert-lawn':             ['How did it feel?','Was it soft or hard?'],
  'blue-mountains-bushwalk':  ['What could you hear?','Was it quiet or loud?'],
};

const PLACEHOLDER_S5 = {
  'koala':                    'The koala is adapting to its environment by…',
  'lion':                     'Humans impact lions by… This is important because…',
  'tiger':                    'I observed the tiger… This relates to its behaviour because…',
  'giraffe':                  "The giraffe's height helps it survive by…",
  'gorilla':                  'The gorilla\'s behaviour shows… This suggests…',
  'chimpanzee':               'Social behaviour helps chimpanzees because…',
  'dingo':                    'The dingo\'s appearance is an adaptation because…',
  'lemur':                    'The lemurs use this space because…',
  'sea-lion':                 'Human activities affect sea lions by…',
  'asian-water-buffalo':      'The relationship I observed helps survival because…',
  'concert-lawn':             'This environment felt this way because…',
  'blue-mountains-bushwalk':  'What I heard reflects this environment because…',
};

const PLACEHOLDER_MID = {
  'chimpanzee':   'I observed that…',
  'gorilla':      'I noticed that the gorillas…',
  'giraffe':      "I noticed that the giraffe's … helps it to…",
  'concert-lawn': 'The grass felt…',
  'lemur':        'The lemurs are using…',
  'dingo':        "The dingo's fur is…",
  'asian-water-buffalo': 'I can see…',
  'sea-lion':     'Humans can…',
  'blue-mountains-bushwalk': 'I could hear…',
};

const MATHS_OBS_CONFIG = {
  'chimpanzee': {
    heading: 'Percentage Analysis',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Use %', color:'#0284C7' },{ label:'Fractions', color:'#2E7D55' },{ label:'Compare', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Write your 3 percentages as fractions of 100 (e.g. 30/100)',
        'Show that your three percentages add to 100%',
        'Calculate the fraction of time NOT resting (add feeding % + moving %)',
      ],
      4: [
        'Write each behaviour percentage you recorded',
        'Show the calculation: % ÷ 100 × 24 = hours per day',
        'Check that your three hour values add up to 24 hours',
      ],
      5: [
        'Convert each behaviour % to a fraction, decimal, and hours per day',
        'Show all three conversions with full working',
        'Comment on what the mathematical distribution reveals about chimpanzee ecology',
      ],
    },
    starters: ['I calculated that…', 'My percentage for … was…', 'Based on my data…'],
  },
  'gorilla': {
    heading: 'Ratios & Scale',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Ratios', color:'#0284C7' },{ label:'Simplify', color:'#2E7D55' },{ label:'Scale', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Estimate your own mass in kg',
        'Write the ratio: your mass : 200 kg',
        'Simplify: divide both sides by the HCF (e.g. 50:200 → ÷50 → 1:4)',
      ],
      4: [
        'Ratio: daily food intake : body mass = 18 : 200',
        'Find the HCF of 18 and 200 (it\'s 2)',
        '18 ÷ 2 = 9 and 200 ÷ 2 = 100, so the simplest ratio is 9:100',
      ],
      5: [
        'Current : 1980 population = 316,000 : 400,000',
        'Simplify: divide both by 4,000 → 79:100',
        'Annual decline = (400,000 − 316,000) ÷ 44 years',
      ],
    },
    starters: ['I estimated that…', 'The ratio of…', 'Comparing the data…'],
  },
  'lion': {
    heading: 'Territory & Probability',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Area', color:'#0284C7' },{ label:'km²', color:'#2E7D55' },{ label:'Probability', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Think: what number × itself ≈ 260? (this is the square root of 260)',
        'Show your estimate or working for √260',
        'Compare the side length you found to your enclosure estimate',
      ],
      4: [
        'Write: P(one successful hunt) = 1/5',
        'Show: P(two in a row) = 1/5 × 1/5 = 1/25',
        'Convert 1/25 to a decimal and write both the fraction and decimal forms',
      ],
      5: [
        'Write both success rates as decimals: 0.20 and 0.75',
        'Calculate the ratio: 0.75 ÷ 0.20',
        'Discuss what this mathematical comparison tells us about hunting strategies in nature',
      ],
    },
    starters: ['I estimated the area as…', 'I counted…', 'Compared to a real lion territory…'],
  },
  'giraffe': {
    heading: 'Height & Ratio',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Ratio', color:'#0284C7' },{ label:'Height', color:'#2E7D55' },{ label:'Simplify', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Write your own height in cm',
        'Write the ratio: your height cm : 550 cm',
        'Simplify by dividing both numbers by their highest common factor',
        'State the simplified ratio',
      ],
      4: [
        'Convert 3.7 m to cm (= 370 cm)',
        'Show: 370 cm ÷ 30 cm = how many times further the giraffe\'s heart pumps',
        'Round your answer to 1 decimal place and include units',
      ],
      5: [
        'Calculate total growth: 5.5 m − 1.8 m',
        'Annual rate: total growth ÷ 4 years — convert to cm/year',
        'Percentage growth = total growth ÷ birth height × 100',
        'Show all working with units throughout',
      ],
    },
    starters: ['I estimated the giraffe\'s height as…', 'The ratio of my height to the giraffe\'s is…', 'I simplified the ratio by…'],
  },
  'tiger': {
    heading: 'Hidden Maths',
    chips: [{ label:'Patterns', color:'#059669' },{ label:'Shapes', color:'#0284C7' },{ label:'Numbers', color:'#2E7D55' },{ label:'Comparisons', color:'#DC2626' }],
    hintsByStage: {
      1: [
        'Can you count anything? (stripes, fence panels, visitors)',
        'What shapes can you see? (rectangles, circles, curves)',
        'What looks big or small compared to something else?',
      ],
      2: [
        'Look for repeating patterns — stripes, tiles, shadows',
        'Estimate a distance — how far away is the tiger?',
        'Can you make a comparison using numbers?',
      ],
      3: [
        'Patterns: stripes, symmetry, repetition in the habitat',
        'Numbers: count things, estimate quantities or distances',
        'Comparisons: use words like "twice as", "longer than", "more than"',
      ],
      4: [
        'Aim to notice at least 4 different categories: patterns, shapes, numbers, distances, movements, comparisons',
        'Use mathematical vocabulary — symmetry, parallel, estimate, ratio',
        'Describe *where* you see it to make your observation specific',
      ],
      5: [
        'Identify at least 5 distinct mathematical observations across different categories',
        'Include estimates or rough calculations where possible (e.g. "approx. 3 m")',
        'Use precise mathematical language — perpendicular, angle, frequency, scale',
      ],
    },
    starters: ['I noticed…', 'I can see a pattern…', 'Comparing the…'],
  },
  'koala': {
    heading: 'Financial Maths & Conservation',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Fractions', color:'#0284C7' },{ label:'Budgets', color:'#2E7D55' },{ label:'Financial maths', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Annual care cost = $15,000',
        'Fraction: fundraiser amount ÷ annual care cost',
        'Simplify: find the HCF and divide both top and bottom',
      ],
      4: [
        'List the budget for each year: $180,000 then +$12,000 each year',
        'Year 5 budget = $180,000 + (4 × $12,000)',
        'Add all 5 years together to find the total',
      ],
      5: [
        'Percentage increase: (new − old) ÷ old × 100',
        'Annual dollar rise: ($15,000 − $12,000) ÷ 4 years',
        'Predict 2026: apply the annual rise twice from 2024',
      ],
    },
    starters: ['I observed the koala…', 'I calculated that…', 'The conservation budget…'],
  },
  'concert-lawn': {
    heading: 'Maths in the Wild',
    chips: [{ label:'Estimate', color:'#059669' },{ label:'Measure', color:'#0284C7' },{ label:'Compare', color:'#2E7D55' },{ label:'Describe', color:'#DC2626' }],
    hintsByStage: {
      1: [
        'Write a number you noticed (e.g. steps, people, objects)',
        'Describe how the ground felt — soft, hard, flat, bumpy?',
        'Can you compare it to another surface?',
      ],
      2: [
        'Include a number — how many steps did you take?',
        'Make a comparison — how is grass different to concrete?',
        'Describe the surface texture in your own words',
      ],
      3: [
        'Include an estimate — e.g. "the lawn is approximately ___ m long"',
        'Include a measurement — steps × 0.6 m = ___ m',
        'Include a comparison — grass vs concrete, soft vs hard',
      ],
      4: [
        'Use at least 3 categories: estimate, measurement, comparison, pattern, number, shape/surface',
        'Use mathematical vocabulary — area, perimeter, texture, slope, estimate',
        'Tie each observation to something specific you felt or saw',
      ],
      5: [
        'Use at least 4 categories: estimate, measurement, comparison, pattern, number, shape/surface',
        'Include a rough calculation where possible — e.g. stride length × steps = distance',
        'Use precise language — perpendicular, gradient, surface area, frequency',
      ],
    },
    starters: ['I noticed…', 'I estimated…', 'Comparing the grass to…'],
  },
  'dingo': {
    heading: 'Territory & Distance',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Territory', color:'#0284C7' },{ label:'km²', color:'#2E7D55' },{ label:'Distance', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Range = maximum − minimum = 70 − 10 = ___ km²',
        'Mean = (10 + 70) ÷ 2 = ___ km²',
        'Show both calculations with working and include units (km²)',
      ],
      4: [
        'Show: 420 km ÷ 6 dingoes = km per dingo per week',
        'Per day: km per week ÷ 7 = ___ km/day',
        'State what assumptions your calculation requires',
      ],
      5: [
        'Dingo ratio: 60 km/h ÷ 15 kg = ___ km/h per kg',
        'Cheetah ratio: 110 km/h ÷ 60 kg = ___ km/h per kg',
        'Compare both ratios and state which animal is more efficient per kg',
        'Justify your conclusion with your calculations',
      ],
    },
    starters: ['I counted…', 'If each dingo needs…', 'The mean territory size is…'],
  },
  'lemur': {
    heading: 'Patterns & Number',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Ratio', color:'#0284C7' },{ label:'Fractions', color:'#2E7D55' },{ label:'Count', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Record: ___ black rings and ___ white rings',
        'Write the ratio as black : white',
        'Simplify the ratio — is it close to 1:1?',
        'Show your simplification working',
      ],
      4: [
        'Total rings in the troop: 20 lemurs × 25 rings = ___',
        'Total black rings: 20 × 13 = ___',
        'Fraction = black rings ÷ total rings',
        'Simplify the fraction and write as a ratio',
      ],
      5: [
        'Total ring length: 25 × 2.4 cm = ___ cm',
        'Gap (skin between rings): 60 cm − total ring length = ___ cm',
        'Express gap as % of tail length: gap ÷ 60 × 100',
        'Show all working with units',
      ],
    },
    starters: ['I counted…', 'The ratio of black to white is…', 'My total was … compared to the known 25…'],
  },
  'sea-lion': {
    heading: 'Mass, Rates & Financial Maths',
    chips: [{ label:'Show working', color:'#059669' },{ label:'kg', color:'#0284C7' },{ label:'Rates', color:'#2E7D55' },{ label:'Simple interest', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Weekly fish: 8 kg × 7 days = ___ kg',
        'Annual fish: 8 kg × 365 days = ___ kg',
        'Weekly cost: weekly fish × $8 = $___',
        'Annual cost: annual fish × $8 = $___',
      ],
      4: [
        'Simple interest formula: I = P × r × t',
        'I = $5,000 × 0.04 × 3 = $___',
        'Total = Principal + Interest = $5,000 + $___',
      ],
      5: [
        'Sea lion dimorphism ratio: 300 ÷ 85 = ___ (to 2 d.p.)',
        'Gorilla ratio: 270 ÷ 90 = ___',
        'Lion ratio: 190 ÷ 120 = ___',
        'Describe the pattern you notice across all three ratios',
      ],
    },
    starters: ['The sea lion looked…', 'Comparing masses…', 'I calculated the feeding cost as…'],
  },
  'asian-water-buffalo': {
    heading: 'Measurement & Algebra',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Equations', color:'#0284C7' },{ label:'Arm span', color:'#2E7D55' },{ label:'Algebra', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Estimate or measure your arm span in cm',
        'Write the fraction: your arm span ÷ 200',
        'Simplify the fraction',
        'Write as a ratio: arm span cm : 200 cm',
      ],
      4: [
        'Let s = buffalo\'s speed in m/min',
        'Write the equation: 3 × s = 90',
        'Solve for s, then calculate: s × 7 = distance in 7 minutes',
      ],
      5: [
        'Write P = 12 + 4y and Q = 20 + 2y',
        'Set equal: 12 + 4y = 20 + 2y',
        'Solve: subtract 2y from both sides, then subtract 12',
      ],
    },
    starters: ['My arm span is…', 'Let s represent…', 'Solving the equation…'],
  },
  'blue-mountains-bushwalk': {
    heading: 'Maths Sound Observation',
    chips: [{ label:'Tally', color:'#059669' },{ label:'Compare', color:'#0284C7' },{ label:'Most / Least', color:'#2E7D55' },{ label:'How do you know?', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Write your tally for each sound category',
        'Which number is largest? That is your most common sound',
        'Compare using > or < between two categories',
        'Use the word "because" with a number to explain',
      ],
      4: [
        'Write your tally counts for each category',
        'Calculate the total number of sounds you heard',
        'Write the most common as a fraction of the total (e.g. 8 out of 15)',
        'Simplify the fraction if possible and explain what it means',
      ],
      5: [
        'Write your tally and calculate the total',
        'Express each category as a percentage of the total',
        'Identify the modal sound type and justify using data',
        'Calculate the ratio of the most common to the least common sound',
      ],
    },
    starters: ['The sound I heard most was…', 'I know this because my tally showed…', 'The most common sound was… which was ___ out of ___ total sounds…'],
  },
};

export default function ObservationScreen() {
  const { classStage, classSubject } = useApp();
  const { currentAnimal, observation, setObservation, submitObservation, missionContext } = useStudent();

  // Timer state for Bushwalk + Concert Lawn overlays
  const [bushwalkTimerSeconds, setBushwalkTimerSeconds] = useState(30);
  const [bushwalkTimerActive,  setBushwalkTimerActive]  = useState(false);
  const [bushwalkTimerDone,    setBushwalkTimerDone]    = useState(false);
  const [soundTally, setSoundTally] = useState({ birds:0, leaves:0, water:0, people:0, other:0 });

  const SOUND_CATEGORIES = [
    { key:'birds',  label:'Bird calls' },
    { key:'leaves', label:'Leaves / wind' },
    { key:'water',  label:'Water' },
    { key:'people', label:'People / footsteps' },
    { key:'other',  label:'Other sounds' },
  ];

  const [concertLawnTimerSeconds, setConcertLawnTimerSeconds] = useState(60);
  const [concertLawnTimerActive,  setConcertLawnTimerActive]  = useState(false);
  const [concertLawnTimerDone,    setConcertLawnTimerDone]    = useState(false);

  const [tigerTimerSeconds, setTigerTimerSeconds] = useState(30);
  const [tigerTimerActive,  setTigerTimerActive]  = useState(false);
  const [tigerTimerDone,    setTigerTimerDone]    = useState(false);

  const [hintsOpen, setHintsOpen] = useState(false);

  // Camera overlay for measurement reference
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef  = useRef(null);
  const streamRef = useRef(null);

  const animalId = currentAnimal?.id;
  const minWords = getMinWords(classStage);
  const wordCount = observation.trim().match(/\b\w+\b/g)?.length || 0;

  // Bushwalk countdown
  useEffect(() => {
    if (!bushwalkTimerActive || bushwalkTimerDone) return;
    if (bushwalkTimerSeconds <= 0) { setBushwalkTimerDone(true); return; }
    const t = setTimeout(() => setBushwalkTimerSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [bushwalkTimerActive, bushwalkTimerSeconds, bushwalkTimerDone]);

  // Concert lawn countdown
  useEffect(() => {
    if (!concertLawnTimerActive || concertLawnTimerDone) return;
    if (concertLawnTimerSeconds <= 0) { setConcertLawnTimerDone(true); return; }
    const t = setTimeout(() => setConcertLawnTimerSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [concertLawnTimerActive, concertLawnTimerSeconds, concertLawnTimerDone]);

  // Tiger Silent Forest countdown
  useEffect(() => {
    if (!tigerTimerActive || tigerTimerDone) return;
    if (tigerTimerSeconds <= 0) { setTigerTimerDone(true); return; }
    const t = setTimeout(() => setTigerTimerSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [tigerTimerActive, tigerTimerSeconds, tigerTimerDone]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      alert('Camera unavailable on this device.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  };

  useEffect(() => () => stopCamera(), []);

  const isMaths = classSubject === 'maths';
  const mathsData = isMaths ? getMathsObservationData(animalId, classStage) : null;
  const cfg    = isMaths ? (MATHS_OBS_CONFIG[animalId] || OBS_CONFIG[animalId]) : OBS_CONFIG[animalId];
  const prompt = isMaths
    ? (mathsData?.prompt || '')
    : ((currentAnimal?.writingPromptByStage?.[classStage]) || currentAnimal?.observationPrompt || '');
  const tip    = getStageScaffoldTip(classStage);

  // Placeholder text
  const placeholder = isMaths
    ? (classStage <= 2 ? 'I calculated…' : classStage === 5 ? 'Based on my calculations…' : 'I calculated that…')
    : classStage <= 2
    ? 'I saw…'
    : classStage === 5
      ? (PLACEHOLDER_S5[animalId] || 'Based on my observation…')
      : (PLACEHOLDER_MID[animalId] || 'Describe what you observe in detail…');

  const mathsS1Q = {
    'chimpanzee': 'What percentage of the time were the chimps doing each behaviour?',
    'gorilla': 'How many gorillas can you see?',
    'lion': 'How many lions can you see?',
    'giraffe': 'Is the giraffe taller than the fence?',
    'tiger': 'How many stripes can you count on the tiger\'s head?',
    'koala': 'Is the koala moving or still right now?',
    'concert-lawn': 'How many steps does it take to walk across the Concert Lawn?',
    'dingo': 'How many dingoes can you see in the enclosure?',
    'lemur': 'How many black rings can you count on the lemur\'s tail?',
    'sea-lion': 'Is the sea lion bigger or smaller than a person?',
    'asian-water-buffalo': 'Could you reach from one horn tip to the other?',
    'blue-mountains-bushwalk': 'Which sound did you hear the most?',
  };
  const mathsS1Cues = {
    'chimpanzee': ['What % were resting?', 'What % were feeding?'],
    'gorilla': ['Count them all', 'Is there a big one (silverback)?'],
    'lion': ['How many big lions?', 'How many small ones?'],
    'giraffe': ['Taller or shorter than the fence?', 'Taller than a nearby tree?'],
    'tiger': ['Count the head stripes', 'Draw the stripe pattern you see'],
    'koala': ['How long did it stay still?', 'Koalas sleep up to 22 hours — does that match?'],
    'concert-lawn': ['Count steps one way across', 'Draw the shape of the lawn'],
    'dingo': ['More or fewer than 5?', 'Write a number sentence about what you see'],
    'lemur': ['Count the black rings', 'Count the white rings'],
    'sea-lion': ['Bigger or smaller than a person?', 'Write 3 things you could measure'],
    'asian-water-buffalo': ['Stretch your arms as wide as you can', 'Write YES or NO and explain'],
    'blue-mountains-bushwalk': ['Count on your fingers', 'Which category had the most?'],
  };

  const s1q    = isMaths ? (mathsS1Q[animalId] || 'What number or measurement did you record?') : (S1_QUESTIONS[animalId] || 'What did you see?');
  const s1cues = isMaths ? (mathsS1Cues[animalId] || ['What did you calculate?', 'Show your working.']) : (S1_CUES[animalId] || ['What did you see?','What was it doing?']);
  const chipsList = isMaths ? [
    { label:'Show working', color:'var(--jungle-light)' },
    { label:'Use numbers', color:'var(--discovery-blue)' },
    { label:'Include units', color:'var(--sunset-orange)' },
  ] : animalId === 'concert-lawn' ? [
    { label:'What did it feel like?', color:'var(--jungle-light)' },
    { label:'Soft, hard, warm, or cold?', color:'var(--discovery-blue)' },
    { label:'What was under your feet?', color:'var(--sunset-orange)' },
  ] : animalId === 'blue-mountains-bushwalk' ? [
    { label:'What did you hear?', color:'var(--jungle-light)' },
    { label:'Was it loud or quiet?', color:'var(--discovery-blue)' },
    { label:'What made the sound?', color:'var(--sunset-orange)' },
  ] : classStage === 5 ? [
    { label:'What did you observe?', color:'var(--jungle-light)' },
    { label:'Why does this happen?', color:'var(--discovery-blue)' },
    { label:'How does this help survive?', color:'var(--sunset-orange)' },
  ] : [
    { label:'What did you see?', color:'var(--jungle-light)' },
    { label:'What is it doing?', color:'var(--discovery-blue)' },
    { label:'Where is it?', color:'var(--sunset-orange)' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--mist-light)', paddingBottom:'4rem' }}>

      {/* Camera overlay */}
      {cameraActive && (
        <div style={{ position:'fixed', inset:0, background:'#000', zIndex:2000, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width:'100%', maxHeight:'70vh', objectFit:'cover' }} />
          <button onClick={stopCamera} style={{ marginTop:'1rem', padding:'0.75rem 2rem', background:'var(--sunset-orange)', color:'white', border:'none', borderRadius:'30px', fontWeight:700, fontSize:'1rem', cursor:'pointer' }}>
            Close Camera
          </button>
        </div>
      )}

      {/* Bushwalk listening timer */}
      {animalId === 'blue-mountains-bushwalk' && !bushwalkTimerDone && (
        <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#1a3a2a 0%,#2e5c3e 100%)', zIndex:1900, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white', textAlign:'center', overflowY:'auto' }}>
          {isMaths ? (
            <>
              <h2 className="heading-display" style={{ fontSize:'2.2rem', marginBottom:'0.5rem' }}>Maths Sound Observation</h2>
              <p style={{ fontSize:'0.95rem', opacity:0.85, maxWidth:'500px', lineHeight:1.6, marginBottom:'0.8rem' }}>Tap each row every time you hear that sound.</p>
              <div style={{ maxWidth:'380px', width:'100%', marginBottom:'1.2rem', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:'0 0.75rem', padding:'0 0.25rem', marginBottom:'0.15rem' }}>
                  <span style={{ fontSize:'0.72rem', fontWeight:700, opacity:0.6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Sound type</span>
                  <span style={{ fontSize:'0.72rem', fontWeight:700, opacity:0.6, textTransform:'uppercase', letterSpacing:'0.06em', textAlign:'center' }}>Count</span>
                  <span style={{ fontSize:'0.72rem', fontWeight:700, opacity:0.6, textTransform:'uppercase', letterSpacing:'0.06em', textAlign:'center', minWidth:'2rem' }}></span>
                </div>
                {SOUND_CATEGORIES.map(({ key, label }) => (
                  <div key={key} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', alignItems:'center', gap:'0 0.75rem', background:'rgba(255,255,255,0.1)', borderRadius:'10px', padding:'0.55rem 0.75rem' }}>
                    <span style={{ fontSize:'0.9rem', fontWeight:600, textAlign:'left' }}>{label}</span>
                    <span style={{ fontSize:'1.2rem', fontWeight:800, minWidth:'2rem', textAlign:'center', fontVariantNumeric:'tabular-nums' }}>{soundTally[key]}</span>
                    <div style={{ display:'flex', gap:'0.3rem' }}>
                      <button onClick={() => setSoundTally(t => ({ ...t, [key]: t[key] + 1 }))}
                        style={{ width:'2rem', height:'2rem', borderRadius:'50%', border:'none', background:'rgba(255,255,255,0.25)', color:'white', fontSize:'1.2rem', fontWeight:700, cursor:'pointer', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                      {soundTally[key] > 0 && (
                        <button onClick={() => setSoundTally(t => ({ ...t, [key]: Math.max(0, t[key] - 1) }))}
                          style={{ width:'2rem', height:'2rem', borderRadius:'50%', border:'none', background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', fontSize:'1.2rem', fontWeight:700, cursor:'pointer', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="heading-display" style={{ fontSize:'2.5rem', marginBottom:'0.8rem' }}>Listen to the Environment</h2>
              <p style={{ fontSize:'1.1rem', opacity:0.9, maxWidth:'500px', lineHeight:1.7, marginBottom:'0.5rem' }}>Close your eyes and listen carefully.</p>
              <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'14px', padding:'1rem 1.4rem', maxWidth:'460px', marginBottom:'2rem', textAlign:'left' }}>
                <p style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.5rem' }}>Focus on:</p>
                {['natural sounds (wind, birds, leaves)','distant sounds','how the environment feels'].map((pt, i) => (
                  <p key={i} style={{ fontSize:'0.82rem', opacity:0.8, margin:'0.1rem 0', paddingLeft:'0.8rem' }}>– {pt}</p>
                ))}
                <p style={{ fontSize:'0.8rem', opacity:0.65, fontStyle:'italic', marginTop:'0.6rem', marginBottom:0 }}>Stay still and let the environment come to you.</p>
              </div>
            </>
          )}
          <h3 style={{ fontSize:'5rem', fontWeight:800, marginBottom:'1.5rem', fontVariantNumeric:'tabular-nums', color: bushwalkTimerSeconds <= 10 ? '#FFEB3B' : 'white' }}>
            {bushwalkTimerSeconds}
          </h3>
          {!bushwalkTimerActive
            ? <button onClick={() => setBushwalkTimerActive(true)}
                style={{ padding:'0.9rem 2.5rem', borderRadius:'var(--t-r-pill)', border:'none', background:'var(--sunset-orange)', color:'white', fontWeight:700, fontSize:'1.1rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
                {isMaths ? 'Start Listening' : 'Start Listening'}
              </button>
            : <p style={{ fontSize:'0.9rem', opacity:0.85, fontWeight:600 }}>{isMaths ? 'Count the sounds… stay still.' : 'Listening now… stay still.'}</p>
          }
        </div>
      )}

      {/* Concert lawn experience timer */}
      {animalId === 'concert-lawn' && !concertLawnTimerDone && (
        <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#1a3a2a 0%,#2e5c3e 100%)', zIndex:1900, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white', textAlign:'center' }}>
          <h2 className="heading-display" style={{ fontSize:'2.5rem', marginBottom:'0.8rem' }}>Habitat Experience</h2>
          <p style={{ fontSize:'1rem', opacity:0.9, maxWidth:'520px', lineHeight:1.7, marginBottom:'1rem' }}>Maths is not just numbers on a page. Mathematicians use observation, estimation and measurement to understand real places.</p>
          <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'14px', padding:'1rem 1.4rem', maxWidth:'480px', marginBottom:'1.5rem', textAlign:'left' }}>
            <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.4rem' }}>Take your shoes off if safe to do so.</p>
            <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.7rem' }}>⏱ Walk on the grass for 60 seconds.</p>
            <p style={{ fontSize:'0.82rem', opacity:0.85, marginBottom:'0.4rem', fontWeight:600 }}>As you walk, think about:</p>
            {[
              'how many steps you take',
              'the length of your stride',
              'whether the ground feels flat, sloped, soft or uneven',
              'how the texture compares to concrete or hard surfaces',
              'how temperature, distance and area could be measured',
              'how this environment changes the way you move',
            ].map((pt, i) => (
              <p key={i} style={{ fontSize:'0.82rem', opacity:0.8, margin:'0.15rem 0', paddingLeft:'0.8rem' }}>– {pt}</p>
            ))}
          </div>
          <h3 style={{ fontSize:'5rem', fontWeight:800, marginBottom:'1.5rem', fontVariantNumeric:'tabular-nums', color: concertLawnTimerSeconds <= 10 ? '#FFEB3B' : 'white' }}>
            {concertLawnTimerSeconds}
          </h3>
          {!concertLawnTimerActive
            ? <button onClick={() => setConcertLawnTimerActive(true)}
                style={{ padding:'0.9rem 2.5rem', borderRadius:'var(--t-r-pill)', border:'none', background:'var(--sunset-orange)', color:'white', fontWeight:700, fontSize:'1.1rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
                ▶ Start Timer
              </button>
            : <p style={{ fontSize:'0.9rem', opacity:0.85, fontWeight:600 }}>Walk on the grass now…</p>
          }
        </div>
      )}

      {/* Tiger Silent Forest countdown */}
      {animalId === 'tiger' && !tigerTimerDone && (
        <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#1a3a2a 0%,#2e5c3e 100%)', zIndex:1900, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white', textAlign:'center' }}>
          <h2 className="heading-display" style={{ fontSize:'2.5rem', marginBottom:'0.8rem' }}>Silent Forest</h2>
          <p style={{ fontSize:'1.1rem', opacity:0.9, maxWidth:'500px', lineHeight:1.7, marginBottom:'2rem' }}>Stop. Look closely. The zoo is full of hidden maths.</p>
          <h3 style={{ fontSize:'5rem', fontWeight:800, marginBottom:'1.5rem', fontVariantNumeric:'tabular-nums', color: tigerTimerSeconds <= 10 ? '#FFEB3B' : 'white' }}>
            {tigerTimerSeconds}
          </h3>
          {!tigerTimerActive
            ? <button onClick={() => setTigerTimerActive(true)}
                style={{ padding:'0.9rem 2.5rem', borderRadius:'var(--t-r-pill)', border:'none', background:'var(--sunset-orange)', color:'white', fontWeight:700, fontSize:'1.1rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
                Start Observing
              </button>
            : <p style={{ fontSize:'0.9rem', opacity:0.85, fontWeight:600 }}>Observe now… find the hidden maths.</p>
          }
        </div>
      )}

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,var(--t-forest) 0%,var(--t-deep) 60%,var(--t-mid) 100%)', padding:'0.85rem 1rem', boxShadow:'var(--t-shadow-md)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'center', alignItems:'center' }}>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'52px', width:'auto', filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} onError={e => e.target.style.display='none'} />
        </div>
      </div>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'2rem 1.25rem 4rem' }}>
        <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'2rem 2.25rem', boxShadow:'var(--t-shadow-md)', border:'1px solid var(--t-stone)' }}>

          {/* Stage 1–2: simple prompt */}
          {classStage <= 2 && (
            <>
              <h2 className="heading-display" style={{ fontSize:'1.8rem', color:'var(--jungle-deep)', marginBottom:'0.6rem', textAlign:'center' }}>{s1q}</h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem', justifyContent:'center', marginBottom:'1.4rem' }}>
                {chipsList.map((chip, i) => (
                  <div key={i} style={{ background:`${chip.color}18`, border:`1.5px solid ${chip.color}40`, borderRadius:'var(--t-r-pill)', padding:'0.45rem 0.9rem', fontSize:'0.9rem', fontWeight:700, color:chip.color }}>{chip.label}</div>
                ))}
              </div>
            </>
          )}

          {/* Stage 3+: per-animal heading + prompt */}
          {classStage > 2 && cfg && (
            <>
              <h2 className="heading-display" style={{ fontSize:'1.75rem', color:'var(--jungle-deep)', marginBottom:'0.4rem', textAlign:'center' }}>{cfg.heading}</h2>
              {prompt && <p style={{ fontSize:'1rem', fontWeight:600, color:'#333', marginBottom:'1rem', textAlign:'center', lineHeight:1.45 }}>{prompt}</p>}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', justifyContent:'center', marginBottom:'1.25rem' }}>
                {cfg.chips.map((chip, i) => (
                  <div key={i} style={{ background:`${chip.color}12`, border:`1.5px solid ${chip.color}35`, borderRadius:'var(--t-r-pill)', padding:'0.35rem 0.8rem', fontSize:'0.8rem', fontWeight:600, color:chip.color }}>{chip.label}</div>
                ))}
              </div>
              {classStage >= 4 && <p style={{ fontSize:'0.82rem', color:'#aaa', marginBottom:'1rem', textAlign:'center', fontStyle:'italic' }}>{isMaths ? 'Show your full working and include units.' : 'Use specific evidence from your observation.'}</p>}
              {animalId === 'blue-mountains-bushwalk' && bushwalkTimerDone && isMaths && (() => {
                const maxCount = Math.max(...SOUND_CATEGORIES.map(c => soundTally[c.key]));
                return (
                  <div style={{ background:'linear-gradient(135deg,#F0F7F0,#E8F4E8)', border:'1.5px solid rgba(46,125,85,0.3)', borderRadius:'var(--t-r-md)', padding:'0.85rem 1rem', marginBottom:'0.75rem' }}>
                    <p style={{ fontSize:'0.72rem', fontWeight:800, color:'#2E7D55', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.5rem' }}>🔊 Your Sound Tally</p>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'0.25rem 1rem', marginBottom:'0.5rem' }}>
                      {SOUND_CATEGORIES.map(({ key, label }) => {
                        const isMax = soundTally[key] === maxCount && maxCount > 0;
                        return (
                          <>
                            <span key={`l${key}`} style={{ fontSize:'0.85rem', color: isMax ? '#065F46' : '#555', fontWeight: isMax ? 700 : 400 }}>{label}{isMax ? ' ★' : ''}</span>
                            <span key={`n${key}`} style={{ fontSize:'0.85rem', fontWeight:700, color: isMax ? '#065F46' : '#444', textAlign:'right' }}>{soundTally[key]}</span>
                          </>
                        );
                      })}
                    </div>
                    <p style={{ fontSize:'0.78rem', color:'#065F46', fontWeight:600, margin:0 }}>✓ Use your tally to answer the question below</p>
                  </div>
                );
              })()}
              {animalId === 'blue-mountains-bushwalk' && bushwalkTimerDone && !isMaths && (
                <div style={{ background:'#D1FAE5', borderRadius:'var(--t-r-sm)', padding:'0.4rem 0.9rem', marginBottom:'0.75rem', textAlign:'center' }}>
                  <p style={{ fontSize:'0.82rem', fontWeight:700, color:'#065F46', margin:0 }}>✓ Listening complete — write your response below</p>
                </div>
              )}
              {animalId === 'tiger' && tigerTimerDone && (
                <div style={{ background:'#D1FAE5', borderRadius:'var(--t-r-sm)', padding:'0.4rem 0.9rem', marginBottom:'0.75rem', textAlign:'center' }}>
                  <p style={{ fontSize:'0.82rem', fontWeight:700, color:'#065F46', margin:0 }}>✓ Observation complete — write your response below</p>
                </div>
              )}
            </>
          )}

          {/* Maths: chimp behaviour data summary */}
          {isMaths && animalId === 'chimpanzee' && missionContext?.type === 'chimp-behaviour' && (
            <div style={{ background:'linear-gradient(135deg,#F0F7F0,#E8F4E8)', border:'1.5px solid rgba(46,125,85,0.25)', borderRadius:'var(--t-r-md)', padding:'0.85rem 1rem', marginBottom:'0.75rem' }}>
              <p style={{ fontSize:'0.72rem', fontWeight:800, color:'#2E7D55', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.5rem' }}>📊 Your Behaviour Data</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem', marginBottom:'0.5rem' }}>
                {[
                  { label:'Resting', value: missionContext.resting, colour:'#2E7D55' },
                  { label:'Feeding', value: missionContext.feeding, colour:'#D97706' },
                  { label:'Moving',  value: missionContext.moving,  colour:'#0284C7' },
                ].map(({ label, value, colour }) => (
                  <div key={label} style={{ textAlign:'center', background:'white', borderRadius:'var(--t-r-sm)', padding:'0.45rem 0.3rem', border:`1.5px solid ${colour}33` }}>
                    <div style={{ fontSize:'1.1rem', fontWeight:800, color:colour }}>{value}%</div>
                    <div style={{ fontSize:'0.65rem', fontWeight:600, color:'#666' }}>{label}</div>
                  </div>
                ))}
              </div>
              {(() => {
                const { resting, feeding, moving } = missionContext;
                const max = Math.max(resting, feeding, moving);
                const tops = [resting, feeding, moving];
                const allEqual = tops.every(v => v === max);
                const labels = ['Resting','Feeding','Moving'];
                const topLabel = allEqual ? 'All equal' : labels[tops.indexOf(max)];
                return <p style={{ fontSize:'0.75rem', color:'#444', margin:0, fontWeight:600 }}>Most common: <span style={{ color:'#2E7D55' }}>{topLabel}{!allEqual ? ` (${max}%)` : ''}</span></p>;
              })()}
            </div>
          )}

          {/* Maths calculator */}
          {isMaths && <div style={{ marginBottom:'0.75rem' }}><MathsCalculator /></div>}

          {/* Textarea */}
          <textarea value={observation} onChange={e => setObservation(e.target.value)}
            placeholder={placeholder}
            style={{ width:'100%', minHeight:'200px', padding:'1.25rem 1.4rem', borderRadius:'var(--t-r-md)', border:'2px solid var(--t-stone)', fontSize:'1.05rem', fontFamily:'DM Sans, sans-serif', resize:'vertical', transition:'border-color 0.22s ease, box-shadow 0.22s ease', lineHeight:1.65, color:'var(--t-ink)', background:'var(--t-parchment)', outline:'none', boxSizing:'border-box' }}
            onFocus={e => { e.target.style.borderColor='var(--t-mid)'; e.target.style.boxShadow='0 0 0 3px rgba(26,82,56,0.1)'; }}
            onBlur={e  => { e.target.style.borderColor='var(--t-stone)'; e.target.style.boxShadow='none'; }} />

          {/* Stage 1–2 sentence starter */}
          {classStage <= 2 && (
            <>
              <div style={{ background:'var(--t-foam)', border:'1px solid var(--t-mist)', borderRadius:'var(--t-r-sm)', padding:'0.6rem 1rem', marginTop:'0.6rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <span style={{ fontSize:'0.85rem', color:'#555' }}>Try starting with:</span>
                <span style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--jungle-deep)', fontStyle:'italic' }}>{isMaths ? '"I calculated…"' : '"I saw…"'}</span>
              </div>
              <div style={{ background:'#F7FAF8', border:'1px solid #D4E8DC', borderRadius:'var(--t-r-md)', padding:'0.9rem 1.1rem', marginTop:'0.75rem' }}>
                <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#059669', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.5rem' }}>You could write:</p>
                {(isMaths ? ['I calculated…','The answer is…'] : ['I saw…','It was…']).map((s, i) => (
                  <p key={i} style={{ fontSize:'0.78rem', color:'#555', margin:'0.1rem 0', paddingLeft:'0.5rem', fontStyle:'italic' }}>"{s}"</p>
                ))}
                <p style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--jungle-mid)', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0.6rem 0 0.3rem' }}>{isMaths ? 'Think about:' : 'Think about:'}</p>
                {s1cues.map((cue, i) => (
                  <p key={i} style={{ fontSize:'0.78rem', color:'#555', margin:'0.1rem 0', paddingLeft:'0.5rem' }}>– {cue}</p>
                ))}
              </div>
            </>
          )}

          {/* Stage 3+ scaffold tip */}
          {classStage > 2 && isMaths && (() => {
            const hints = cfg?.hintsByStage?.[classStage] || cfg?.hintsByStage?.[3] || [];
            return (
              <div style={{ marginTop:'0.75rem' }}>
                <button
                  onClick={() => setHintsOpen(o => !o)}
                  style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#F0F9F4', border:'1px solid #D4E8DC', borderRadius: hintsOpen ? '10px 10px 0 0' : '10px', padding:'0.7rem 1rem', cursor:'pointer', color:'#059669', fontWeight:700, fontSize:'0.82rem', textAlign:'left' }}>
                  <span>💡 Need a hint?</span>
                  <span style={{ fontSize:'0.7rem' }}>{hintsOpen ? '▲' : '▼'}</span>
                </button>
                {hintsOpen && (
                  <div style={{ background:'#F7FAF8', border:'1px solid #D4E8DC', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'0.75rem 1rem' }}>
                    {hints.length > 0 && (
                      <>
                        <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#059669', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.35rem' }}>Your response should include:</p>
                        <ul style={{ margin:'0 0 0.6rem', paddingLeft:'1.1rem', fontSize:'0.8rem', color:'#555', lineHeight:1.8 }}>
                          {hints.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                      </>
                    )}
                    <p style={{ fontSize:'0.73rem', fontWeight:600, color:'var(--jungle-mid)', marginBottom:'0.2rem' }}>Sentence starters:</p>
                    {(cfg?.starters || tip.starters).map((s, i) => (
                      <p key={i} style={{ fontSize:'0.75rem', color:'#555', margin:'0.1rem 0', paddingLeft:'0.5rem', fontStyle:'italic' }}>"{s}"</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
          {classStage > 2 && !isMaths && (
            <div style={{ background:'#F7FAF8', border:'1px solid #D4E8DC', borderRadius:'var(--t-r-md)', padding:'0.9rem 1.1rem', marginTop:'0.75rem' }}>
              {cfg?.bullets?.length > 0 ? (
                <>
                  <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#059669', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>You may include:</p>
                  <ul style={{ margin:'0 0 0.5rem', paddingLeft:'1.1rem', fontSize:'0.8rem', color:'#555', lineHeight:1.8 }}>
                    {cfg.bullets.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </>
              ) : (
                <>
                  <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#059669', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>{tip.header}</p>
                  {tip.points.length > 0 && (
                    <ul style={{ margin:'0 0 0.5rem', paddingLeft:'1.1rem', fontSize:'0.8rem', color:'#555', lineHeight:1.8 }}>
                      {tip.points.map((pt, i) => <li key={i}>{pt}</li>)}
                    </ul>
                  )}
                </>
              )}
              <p style={{ fontSize:'0.73rem', fontWeight:600, color:'var(--jungle-mid)', marginBottom:'0.2rem' }}>Sentence starters:</p>
              {tip.starters.map((s, i) => (
                <p key={i} style={{ fontSize:'0.75rem', color:'#555', margin:'0.1rem 0', paddingLeft:'0.5rem', fontStyle:'italic' }}>"{s}"</p>
              ))}
            </div>
          )}

          {/* Word counter + submit */}
          <div style={{ marginTop:'1rem', fontSize:'1rem', color: wordCount >= minWords ? 'var(--jungle-light)' : '#E86A33', fontWeight:600 }}>
            {wordCount}/{minWords} words
          </div>
          <button onClick={submitObservation} disabled={wordCount < minWords}
            style={{ width:'100%', padding:'1.1rem 2rem', borderRadius:'var(--t-r-pill)', border:'none',
              background: wordCount >= minWords ? 'linear-gradient(135deg,var(--t-eucalyptus) 0%,var(--t-mid) 100%)' : 'rgba(0,0,0,0.12)',
              color:'white', fontSize:'1.05rem', fontWeight:700, cursor: wordCount >= minWords ? 'pointer' : 'not-allowed',
              transition:'all 0.25s ease', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:'1.75rem',
              boxShadow: wordCount >= minWords ? '0 6px 20px rgba(26,82,56,0.4)' : 'none' }}>
            {wordCount < minWords ? 'Write More to Continue' : 'Submit & Earn Badge'}
          </button>
        </div>
      </div>
    </div>
  );
}
