import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { getStageScaffoldTip, getMinWords, getMathsObservationData, getPdhpeObservationData, getEnglishObservationData, getStageQuestions } from '../utils/helpers';
import MathsCalculator from '../components/MathsCalculator';
import StudentGuide from '../components/StudentGuide';

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
    // "Mutualism" was the odd one out — a technical term next to three plain-English chips, and
    // not a word the writing prompt ever uses. "Helping each other" says the same thing.
    chips: [{ label:'Nearby animals', color:'#059669' },{ label:'Interactions', color:'#0284C7' },{ label:'Positioning', color:'#2E7D55' },{ label:'Helping each other', color:'#DC2626' }],
    bullets: ['Other animals nearby (e.g. birds, other species)','How those animals interact with the buffalo','Where they are positioned relative to each other','How the buffalo and the other animal might help each other'],
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
      1: [
        'Is the giraffe taller than the fence? Write yes or no and include a number',
        'Find one more thing to compare it to — a nearby tree, a lamp post, or how many of you stacked up',
        'Include a number in each comparison (e.g. "about ___ times taller")',
      ],
      2: [
        'Stretch your arms out — your arm span is usually close to your height in cm',
        'Count how many arm spans tall the giraffe looks from where you stand',
        'Multiply: arm span cm × number of arm spans = estimated height',
      ],
      3: [
        'Estimate your own height in cm (e.g. 150 cm)',
        'Write the ratio: your height : 550 (e.g. 150 : 550)',
        'Find the number that divides evenly into both — try 50 or another common factor',
        'Write the simplified ratio clearly and show the division',
      ],
      4: [
        'The giraffe\'s neck is 180 cm. Your neck is about 15 cm',
        'Divide: 180 ÷ 15 = ___',
        'Write a sentence: "The giraffe\'s neck is ___ times longer than mine because..."',
      ],
      5: [
        'Total growth: 540 − 180 = ___ cm',
        'Average per year: total growth ÷ 4 = ___ cm/year',
        'Fraction at birth: write 180/540 as a fraction and simplify (hint: divide both by 180)',
        'Show all working with units throughout',
      ],
    },
    starters: ['The giraffe is taller than…', 'The ratio of my height to the giraffe\'s is…', 'The giraffe\'s neck is ___ times longer than mine because…'],
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
        'Look for repeating patterns - stripes, tiles, shadows',
        'Estimate a distance - how far away is the tiger?',
        'Can you make a comparison using numbers?',
      ],
      3: [
        'Patterns: stripes, symmetry, repetition in the habitat',
        'Numbers: count things, estimate quantities or distances',
        'Comparisons: use words like "twice as", "longer than", "more than"',
      ],
      4: [
        'Aim to notice at least 4 different categories: patterns, shapes, numbers, distances, movements, comparisons',
        'Use mathematical vocabulary - symmetry, parallel, estimate, ratio',
        'Describe *where* you see it to make your observation specific',
      ],
      5: [
        'Identify at least 5 distinct mathematical observations across different categories',
        'Include estimates or rough calculations where possible (e.g. "approx. 3 m")',
        'Use precise mathematical language - perpendicular, angle, frequency, scale',
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
        'Describe how the ground felt - soft, hard, flat, bumpy?',
        'Can you compare it to another surface?',
      ],
      2: [
        'Include a number - how many steps did you take?',
        'Make a comparison - how is grass different to concrete?',
        'Describe the surface texture in your own words',
      ],
      3: [
        'Include an estimate - e.g. "the lawn is approximately ___ m long"',
        'Include a measurement - steps × 0.6 m = ___ m',
        'Include a comparison - grass vs concrete, soft vs hard',
      ],
      4: [
        'Use at least 3 categories: estimate, measurement, comparison, pattern, number, shape/surface',
        'Use mathematical vocabulary - area, perimeter, texture, slope, estimate',
        'Tie each observation to something specific you felt or saw',
      ],
      5: [
        'Use at least 4 categories: estimate, measurement, comparison, pattern, number, shape/surface',
        'Include a rough calculation where possible - e.g. stride length × steps = distance',
        'Use precise language - perpendicular, gradient, surface area, frequency',
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
    heading: 'Multiplication & Average',
    chips: [{ label:'Count rings', color:'#059669' },{ label:'Multiply', color:'#0284C7' },{ label:'Total', color:'#2E7D55' },{ label:'Show working', color:'#DC2626' }],
    hintsByStage: {
      1: [
        'Look at the lemur\'s tail — count every ring you can see',
        'Point and count: 1, 2, 3… all the way around',
        'A ring-tailed lemur usually has 25 rings total',
        'Write: "I counted ___ rings"',
      ],
      2: [
        'Count the rings on one lemur\'s tail',
        'A lemur has about 25 rings',
        'There are 4 lemurs in the group — multiply: 25 × 4 = ___',
        'Write your answer with the working shown',
      ],
      3: [
        'Count the rings on one lemur\'s tail (about 25)',
        'There are 6 lemurs in the group',
        'Multiply: rings × 6 = ___',
        'Show your working: ___ × 6 = ___',
      ],
      4: [
        'Count the rings on the lemur\'s tail — this is the average per lemur',
        'Taronga has 20 ring-tailed lemurs',
        'Multiply: ___ rings × 20 = ___',
        'Show your multiplication with units (rings)',
      ],
      5: [
        'Count the rings — this is your sample average',
        'Multiply by 20 lemurs to find the total: ___ × 20 = ___',
        'Think about sampling: does counting 1 lemur give a reliable average?',
        'Write your reasoning — what would make the estimate more reliable?',
      ],
    },
    starters: ['I counted ___ rings on the lemur\'s tail, so the total for the group is…', 'If each lemur has ___ rings and there are ___ lemurs, the total is…', 'Multiplying ___ × ___ = ___…'],
  },
  'sea-lion': {
    heading: 'Financial Maths',
    chips: [{ label:'Show working', color:'#059669' },{ label:'$', color:'#0284C7' },{ label:'Rates', color:'#2E7D55' },{ label:'Simple interest', color:'#DC2626' }],
    hintsByStage: {
      1: [
        'The zoo spends $5 every day',
        'Multiply: $5 × 4 days = $___',
        'Write a sentence explaining your answer',
      ],
      2: [
        'Multiply: kg per day × cost per kg',
        'Try: 4 × $8 = $___',
        'Write your number sentence with units',
      ],
      3: [
        'Step 1: daily cost → 4 kg × $8 = $___',
        'Step 2: weekly cost → daily cost × 7 = $___',
        'Show both steps clearly with units',
      ],
      4: [
        'Write the formula: Interest = P × r × t',
        'P = $500    r = 0.10 (10% as a decimal)    t = 1 year',
        'Step 1: $500 × 0.10 × 1 = $___',
        'Step 2: Total = $500 + interest = $___',
      ],
      5: [
        'Step 1: weekly cost at $6/kg → 8 × $6 × 7 = $___',
        'Step 2: weekly cost at $4/kg → 8 × $4 × 7 = $___',
        'Step 3: weekly saving → $___ − $___ = $___',
        'Show all three calculations with units',
      ],
    },
    starters: ['The cost of feeding the sea lion is…', 'Using the formula Interest = P × r × t, I calculated…', 'At $6/kg the weekly cost is… but at $4/kg it would be…'],
  },
  'asian-water-buffalo': {
    heading: 'Measurement & Rates',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Ratio', color:'#0284C7' },{ label:'Arm span', color:'#2E7D55' },{ label:'Speed', color:'#DC2626' }],
    hintsByStage: {
      1: [
        'Stretch your arms out — estimate your arm span in cm',
        'The horn span is 200 cm (2 m) — is your arm span bigger or smaller?',
        'Write YES or NO and include your estimated arm span number',
      ],
      2: [
        'Look at the buffalo from nose to tail — estimate how many metres long it is',
        'A standard car is about 4.5 m — is the buffalo longer or shorter?',
        'Write a comparison sentence using numbers (e.g. "The buffalo is about ___ m, which is ___ m shorter than a car")',
      ],
      3: [
        'Estimate your arm span in cm (usually close to your height)',
        'Write the ratio: your arm span cm : 200',
        'Find the number that divides evenly into both — try 10 or 25 or 50',
        'Write the simplified ratio and show the division',
      ],
      4: [
        'Speed = distance ÷ time: 60 ÷ 3 = ___ m/min',
        'Use your speed to find distance in 5 minutes: speed × 5 = ___',
        'Show both calculations with units',
      ],
      5: [
        'Fill the table: Year 0 = 10, Year 1 = 10 + 5 = ___, Year 2 = ___, Year 3 = ___',
        'Write the rule: Number of animals = 10 + (5 × y)',
        'Substitute y = 6 into your rule to find the Year 6 population',
      ],
    },
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

const PDHPE_OBS_CONFIG = {
  'chimpanzee': {
    heading: 'Chimp Lifestyle vs. Yours',
    chips: [{ label:'Physical Activity', color:'#059669' },{ label:'Sleep', color:'#7C3AED' },{ label:'Social Time', color:'#0284C7' },{ label:'Time Outdoors', color:'#D97706' }],
    hintsByStage: {
      1: ['Look at your graph and find the tallest bar', 'That is what the chimps did most', 'Say one thing they do that you do too'],
      2: ['Compare your graph to your own day', 'Name one thing that is the same and one that is different', 'Chimps move, rest, eat and spend time together, just like you'],
      3: ['Describe one similarity between chimp habits and healthy human habits', 'Describe one difference you noticed in the comparison chart', 'Suggest one chimp habit you could adopt to improve your own health'],
      4: ['For two lifestyle habits from the chart, explain how each addresses a determinant of health', 'Evaluate whether your own habits support or undermine each determinant', 'Use PDHPE terminology (e.g. determinants of health, health behaviours)'],
      5: ['Apply the biopsychosocial model to two chimp lifestyle behaviours', 'Explain how each addresses a determinant of health', 'Propose one evidence-based lifestyle change for adolescents based on what chimp habits suggest'],
    },
    starters: ['I noticed that chimpanzees…', 'One similarity between my habits and the chimp is…', 'A healthy habit I could adopt is…'],
  },
  'gorilla': {
    heading: 'Nutrition and Healthy Eating',
    chips: [{ label:'Food variety', color:'#059669' },{ label:'Nutrients', color:'#D97706' },{ label:'Food groups', color:'#0284C7' },{ label:'Healthy diet', color:'#7C3AED' }],
    hintsByStage: {
      1: ['Look at what the gorilla is eating', 'Leaves, fruit and bamboo are all plants', 'Name one healthy food that you eat'],
      2: ['Gorillas eat lots of different plants, not just one', 'Name two healthy foods you eat', 'Say what each one does for your body, e.g. gives you energy'],
      3: ['Name two types of food the gorilla eats', 'Name two food groups and what they do for the body', 'Explain why eating a variety of foods matters for health'],
      4: ['Name two food groups and describe the key nutrients each provides', 'Explain the role those nutrients play in keeping the body healthy', 'Use the gorilla\'s diet as an example in your answer'],
      5: ['Name specific nutrients (fibre, vitamins, minerals, plant protein) and explain their physiological roles', 'Evaluate how the gorilla\'s diet compares to adolescent dietary guidelines', 'Discuss at least two health outcomes supported by the gorilla\'s diet'],
    },
    starters: ['Gorillas eat…', 'Eating a variety of foods is important because…', 'The gorilla\'s diet shows that…'],
  },
  'lion': {
    heading: 'Muscular Power',
    chips: [{ label:'Power', color:'#DC2626' },{ label:'Strength', color:'#059669' },{ label:'Speed', color:'#0284C7' },{ label:'Legs and muscles', color:'#7C3AED' }],
    hintsByStage: {
      1: ['Look at the lion\'s back legs', 'What do you do that needs strong legs?', 'Think about running, jumping or kicking'],
      2: ['Watch how fast the lion can move when it wants to', 'Name one thing you do that needs fast, strong muscles', 'Think about sprinting, jumping or throwing'],
      3: ['Muscular power means being strong and fast at the same time', 'Describe when the lion uses muscular power', 'Name one activity where you use muscular power'],
      4: ['Explain what muscular power is in your own words', 'Use the lion\'s sprint or pounce as your example', 'Name an activity where you use muscular power'],
      5: ['Explain muscular power as force and speed together', 'Explain how it differs from muscular strength alone', 'Use the lion as your example for both'],
    },
    starters: ['The lion uses muscular power when…', 'Muscular power is…', 'I use muscular power when…'],
  },
  'giraffe': {
    heading: 'Body Size and Heart Size',
    chips: [{ label:'Body size', color:'#059669' },{ label:'Heart size', color:'#DC2626' },{ label:'How far the blood goes', color:'#0284C7' },{ label:'Blood pressure', color:'#7C3AED' }],
    hintsByStage: {
      1: ['Look at how big the giraffe is next to a person', 'Bigger bodies need bigger hearts', 'Say whether its heart is bigger or smaller than yours'],
      2: ['A giraffe\'s heart weighs about 11 kg. A human heart weighs about 300 g', 'Think about how far the blood has to travel to reach the head', 'Say why a bigger body needs a bigger heart'],
      3: ['Compare the size of the two bodies first, then the two hearts', 'A giraffe pushes blood about 2 m up. You push it about 30 cm', 'Explain why the giraffe needs the bigger heart'],
      4: ['Compare body size, then heart size', 'The giraffe must push blood about 2 m up to its head, against gravity', 'Explain what that means for how hard its heart has to work'],
      5: ['Compare body size, heart size and how far the blood must travel', 'Explain why a taller animal needs higher blood pressure', 'A giraffe\'s blood pressure is roughly double a human\'s'],
    },
    starters: ['The giraffe\'s body is…', 'Its heart is bigger than mine because…', 'A giraffe needs a big heart to…'],
  },
  'tiger': {
    heading: 'Tiger & Sport',
    chips: [{ label:'Power', color:'#DC2626' },{ label:'Speed', color:'#059669' },{ label:'Patience', color:'#7C3AED' },{ label:'Sport', color:'#0284C7' }],
    hintsByStage: {
      1: ['How does the tiger move - fast or slow?', 'What does the tiger\'s body look like?', 'What could a sports player copy from the tiger?'],
      2: ['Look at how the tiger moves', 'Think about a sport that needs speed or power', 'What could an athlete copy from the tiger?'],
      3: ['Describe how the tiger moves and what its body looks like', 'Name a sport that uses similar skills to the tiger', 'What could an athlete take away from watching this animal?'],
      4: ['Describe the tiger\'s physical qualities (power, speed, patience, muscle)', 'Name a sporting quality that matches what you see', 'Explain what athletes could learn from this animal'],
      5: ['Describe the tiger\'s explosive power and patient stillness', 'Connect tiger qualities to specific sporting demands', 'Evaluate what training lessons athletes could take from observing this animal'],
    },
    starters: ['From watching the tiger, an athlete could…', 'The tiger shows that in sport…', 'One thing sport could take from the tiger is…'],
  },
  'koala': {
    heading: 'Sleep & Health',
    chips: [{ label:'Sleep', color:'#7C3AED' },{ label:'Recovery', color:'#059669' },{ label:'Human vs koala', color:'#0284C7' },{ label:'Health', color:'#DC2626' }],
    hintsByStage: {
      1: ['How many hours does the koala sleep?', 'How many hours do you sleep each night?', 'Name one thing sleep does for your body'],
      2: ['Koalas sleep up to 22 hours - humans need about 8 to 10', 'Write one similarity and one difference between koala and human sleep', 'Name two things sleep does for your body'],
      3: ['Compare how many hours a koala sleeps to how many hours a human needs', 'Write what sleep does for your body (e.g. rest, repair, grow)', 'Explain why sleep matters for your health'],
      4: ['Compare koala sleep to the amount of sleep teenagers need', 'Describe what happens to your body when you do not get enough sleep', 'Connect sleep to a health outcome like mood, energy or recovery'],
      5: ['Compare the koala\'s extreme sleep needs to human recommendations', 'Describe at least two health consequences of not getting enough sleep', 'Explain why sleep is important for teenagers specifically'],
    },
    starters: ['The koala sleeps…', 'Compared to a koala, humans…', 'Sleep is important because…'],
  },
  'dingo': {
    heading: 'Food as Fuel',
    chips: [{ label:'Energy', color:'#DC2626' },{ label:'Food choices', color:'#059669' },{ label:'Performance', color:'#0284C7' },{ label:'Dingo', color:'#7C3AED' }],
    hintsByStage: {
      1: ['The dingo runs a long way to hunt, so it needs energy', 'Name one food that gives you energy', 'Think about what you eat before you run or play'],
      2: ['Just like the dingo, your body needs fuel to move', 'Name two foods that give good energy for sport or play', 'Explain why you chose those foods'],
      3: ['Think about what the dingo eats to survive its long hunts', 'What food would fuel a student for a sport session?', 'Explain why that food is a good choice'],
      4: ['Connect the dingo\'s need for food to human performance', 'What should a student eat before physical activity and why?', 'Why do food choices matter for how your body performs?'],
      5: ['Think about how the dingo relies on food to fuel every hunt', 'Describe what to eat before and after activity for performance and recovery', 'Explain why food quality and timing matters for active people'],
    },
    starters: ['Just like the dingo, my body needs…', 'A good food to eat before sport is…', 'Food affects performance because…'],
  },
  'lemur': {
    heading: 'Relationships & Wellbeing',
    chips: [{ label:'Relationships', color:'#7C3AED' },{ label:'Belonging', color:'#059669' },{ label:'Lemurs', color:'#0284C7' },{ label:'Wellbeing', color:'#DC2626' }],
    hintsByStage: {
      1: ['Watch how the lemurs stay close together', 'Think about someone you feel safe around', 'How do your relationships make you feel?'],
      2: ['How do the lemurs look after each other?', 'Think of one way your friendships or family are similar to the lemur troop', 'How do those relationships affect how you feel?'],
      3: ['Describe one way lemur relationships are similar to human relationships', 'How do your relationships with others affect your mood or health?', 'What would it feel like to not have those connections?'],
      4: ['Compare lemur social bonds to human relationships', 'How do relationships affect your physical and mental health?', 'Think about belonging, safety and connection'],
      5: ['Compare the lemur troop\'s social bonds to human social connections', 'Describe how relationships affect both physical and mental health', 'Connect belonging and connection to health outcomes'],
    },
    starters: ['Just like lemurs, humans…', 'My relationships with others make me feel…', 'Belonging to a group affects health because…'],
  },
  'sea-lion': {
    heading: 'Persuasive Writing',
    chips: [{ label:'Argument', color:'#DC2626' },{ label:'Evidence', color:'#059669' },{ label:'Directors', color:'#0284C7' },{ label:'Persuade', color:'#7C3AED' }],
    hintsByStage: {
      1: ['Think about what YOU put in your enclosure design', 'Why does your sea lion need that feature?', 'Start with: "The sea lions need..."'],
      2: ['Name one feature from your design (e.g. large pool, slide, solar panels)', 'Use the word "because" to connect your feature to a reason', 'Why will that feature help the sea lion stay healthy?'],
      3: ['Use your design choices as evidence — name specific features', 'Why do sea lions need the things you included?', 'Try to make the directors feel they WANT to say yes'],
      4: ['Name a persuasive technique you are using (e.g. evidence, rhetorical question, emotive language)', 'Back up your argument with features from your design', 'Think about what matters to the directors — animal welfare and sustainability'],
      5: ['Choose your most powerful argument from your design evidence', 'Name and explain the persuasive technique(s) you use', 'How does your language position the directors to agree with you?'],
    },
    starters: ['Dear Taronga Directors,', 'The sea lions need…', 'My enclosure design shows…'],
  },
  'asian-water-buffalo': {
    heading: 'Hydration & Health',
    chips: [{ label:'Water', color:'#0284C7' },{ label:'Sweat', color:'#DC2626' },{ label:'Performance', color:'#059669' },{ label:'Buffalo', color:'#7C3AED' }],
    hintsByStage: {
      1: ['Watch the buffalo - it loves mud and water to cool down', 'Why do you need water when you are hot or active?', 'What happens to your body when you do not drink enough?'],
      2: ['Just like the buffalo needs water to keep going, so do you', 'Name two reasons your body needs water during activity', 'What happens if you do not drink enough water?'],
      3: ['Think about what the buffalo uses water for', 'Why does your body need water when you exercise?', 'Name one sign that your body needs more water'],
      4: ['Connect the buffalo\'s need for water to your own hydration needs', 'What does water do for your body during physical activity?', 'What are the signs of dehydration and why do they happen?'],
      5: ['Think about how the buffalo relies on water to perform and stay cool', 'Explain the role of hydration in physical performance', 'Describe the effects of dehydration on the body during exercise'],
    },
    starters: ['Just like the buffalo, my body needs water to…', 'When I am active, hydration is important because…', 'Without enough water, my body…'],
  },
  'blue-mountains-bushwalk': {
    heading: 'Identity',
    chips: [{ label:'Identity', color:'#7C3AED' },{ label:'Environment', color:'#059669' },{ label:'World around me', color:'#0284C7' },{ label:'Wellbeing', color:'#DC2626' }],
    hintsByStage: {
      1: ['Think back to when you stood still and listened to the birds', 'What people, places or experiences shape who you are?', 'Write two ways the world around you makes you who you are'],
      2: ['Remember listening to the bush - the world around you shaped that moment', 'Think about your family, culture, friends or school', 'Write two ways the world around you shapes your identity'],
      3: ['You listened to the bush - just like these animals are shaped by it, so are you', 'What parts of your world shape who you are - family, culture, friends, experiences?', 'Write two ways your environment shapes your identity'],
      4: ['Think back to standing still and listening - how did that environment feel?', 'How do people, places and experiences around you shape your identity?', 'How does the world shaping your identity connect to your wellbeing?'],
      5: ['Remember becoming part of the environment for that moment - the world shapes us', 'What aspects of your environment most shape your identity?', 'Write about how your environment shapes your identity and connects to your wellbeing'],
    },
    starters: ['The world around me shapes my identity by…', 'When I stood still and listened, I noticed…', 'My identity is shaped by…'],
  },
  'concert-lawn': {
    heading: 'Connection & Health',
    chips: [{ label:'Mood', color:'#7C3AED' },{ label:'Body feeling', color:'#DC2626' },{ label:'Connection', color:'#059669' },{ label:'Outdoors', color:'#0284C7' }],
    hintsByStage: {
      1: ['Did your body feel different on the grass?', 'How did your mood change?', 'Write one word for how your body felt and one for your mood'],
      2: ['How did being active make your body feel?', 'Did being outdoors change how you felt?', 'Write about your body and your mood'],
      3: ['Describe how your body felt during the activity', 'Write about your mood or emotions', 'Did being with others change how you felt?'],
      4: ['Describe one physical feeling and one emotional feeling', 'Connect being outdoors and active to a health benefit', 'How does this connect to your health habits?'],
      5: ['Describe both physical and emotional effects of being active outdoors', 'Connect the experience to physical and mental health outcomes', 'How does connection to nature and others relate to your wellbeing?'],
    },
    starters: ['Being on the lawn made me feel…', 'My body felt…', 'Being active outdoors…'],
  },
};

const ENGLISH_OBS_CONFIG = {
  'chimpanzee': {
    heading: 'Creative Story Writing',
    chips: [{ label:'Conflict', color:'#B45309' },{ label:'Characters', color:'#059669' },{ label:'Setting', color:'#0284C7' },{ label:'Resolution', color:'#DC2626' }],
    hintsByStage: {
      1: ['Who is your chimpanzee character? Give them a name', 'What is the problem from your graph? (not enough food, rest or movement)', 'How does the story end - does the problem get solved?'],
      2: ['Start with a beginning - introduce your chimp and where they live', 'Use the conflict from your graph as the problem in the middle', 'Write an ending - how do the chimps solve (or not solve) the problem?'],
      3: ['Describe the setting to draw the reader in', 'Build the conflict from your graph - how does it affect the group?', 'Write a resolution that feels satisfying - does it have to be happy?'],
      4: ['Develop a character who is at the centre of the conflict', 'Use your graph data to make the conflict feel real and grounded', 'Think about what your resolution says about the group - what is the theme?'],
      5: ['Use the conflict to explore something deeper - survival, loyalty, hierarchy', 'Show the tension building through the characters\' actions and reactions', 'Write a resolution that leaves the reader thinking - it doesn\'t have to be neat'],
    },
    starters: ['Deep in the forest…', 'The trouble began when…', 'Once, a chimpanzee named…'],
  },
  'gorilla': {
    heading: 'Finish the Story',
    chips: [{ label:'Kito', color:'#059669' },{ label:'Jabari', color:'#B45309' },{ label:'What happens next?', color:'#0284C7' },{ label:'Observe now', color:'#DC2626' }],
    hintsByStage: {
      1: ['Look at the gorillas right now - are they calm or active?', 'Does Kito get the mango? What does Jabari do?', 'Write what happens at the end of the story'],
      2: ['Watch how the gorillas move around each other', 'Does the big silverback react when a smaller gorilla gets close?', 'Write two or three sentences to finish the story - what happens?'],
      3: ['Observe the group - who has power? How can you tell?', 'Use what you see right now to make your ending feel real', 'How does Kito\'s story end - does he succeed, get caught, or back away?'],
      4: ['Watch the real gorillas - how do they show or avoid conflict?', 'Use specific details from your observation (posture, movement, distance) in your ending', 'Think about what your ending reveals about power and survival in the group'],
      5: ['Observe closely - how does the silverback maintain dominance without always acting?', 'Use your real observations to write an ending that reflects the actual social dynamics you see', 'Consider what your ending says about power, risk and survival - and whether the story ends neatly or not'],
    },
    starters: ['Jabari turned slowly and…', 'Kito reached the branches and…', 'The enclosure went quiet when…'],
  },
  'lion': {
    heading: 'Describing the Eyes',
    chips: [{ label:'Colour', color:'#B45309' },{ label:'Like / As', color:'#DC2626' },{ label:'What do they remind you of?', color:'#059669' },{ label:'Effect', color:'#7C3AED' }],
    hintsByStage: {
      1: ['What colour are the lion\'s eyes? (golden, amber, yellow)', 'What do they remind you of? (coins, flames, sunlight...)', 'Write: "The lion\'s eyes are like a ___"'],
      2: ['Pick a specific colour word for the eyes — not just "yellow", try amber or gold', 'What do the eyes remind you of?', 'Write your comparison using "like" or "as"'],
      3: ['Start with the colour — what exact shade are the eyes?', 'Write a comparison: "The eyes are like ___"', 'Add a second detail — what feeling do the eyes give you?'],
      4: ['Write your strongest comparison for the eyes', 'What effect does it create for the reader — power, danger, calm?', 'Use: "This creates the effect of..." to explain your choice'],
      5: ['Write two different images for the eyes — vary the comparisons', 'What do your word choices suggest about the lion (danger, power, age, intelligence)?', 'End with "This imagery positions the reader to feel..."'],
    },
    starters: ['The lion\'s eyes are like…', 'Looking into the lion\'s eyes, I could see…', 'The golden eyes…'],
  },
  'giraffe': {
    heading: 'Simile Writing',
    chips: [{ label:'As tall as', color:'#B45309' },{ label:'Like', color:'#059669' },{ label:'Comparison', color:'#0284C7' },{ label:'Simile', color:'#DC2626' }],
    hintsByStage: {
      1: ['A simile compares using "like" or "as"', 'Try: "The giraffe is as tall as a ___"', 'What does the giraffe\'s height remind you of?'],
      2: ['Write your simile, then say what the two things have in common', 'Use "as...as" or "like"', 'Make sure your comparison is something the reader can picture'],
      3: ['Write your simile, then explain why you chose that comparison', 'Is it accurate? Does it create a clear picture?', 'Use the word "because" to explain your choice'],
      4: ['Write your simile, then explain the effect it creates for the reader', 'What feeling or image does your comparison give?', 'Use: "This simile creates the effect of…"'],
      5: ['Write your simile, then analyse why that comparison works', 'What makes it accurate AND vivid?', 'Use: "This simile is effective because…"'],
    },
    starters: ['The giraffe is as tall as…', 'Its neck stretches like…', 'Moving like a…, the giraffe…'],
  },
  'koala': {
    heading: 'Informative Writing',
    chips: [{ label:'Topic sentence', color:'#B45309' },{ label:'Facts', color:'#059669' },{ label:'Signs', color:'#0284C7' },{ label:'Inform', color:'#DC2626' }],
    hintsByStage: {
      1: ['Find one fact on a sign near the koala', 'Write that fact in your own words', 'Start with "Koalas are…" or "Did you know that…"'],
      2: ['Start with a topic sentence that says what your text is about', 'Add two facts from the signs around you', 'Finish with a sentence that sums up the information'],
      3: ['Write a topic sentence that states the main idea clearly', 'Use two or three facts from the signs as supporting evidence', 'End with a concluding sentence that ties the information together'],
      4: ['Write a clear topic sentence followed by evidence from the signs', 'Explain why the information matters - not just what it says', 'Use precise, factual language: third person, present tense, specific vocabulary'],
      5: ['Think about your audience and purpose - how does your language position the reader?', 'Use specific facts or quotes from the signs and explain their significance', 'Analyse how your language choices are appropriate for the informative text type'],
    },
    starters: ['Koalas are…', 'According to the sign,…', 'One important fact about koalas is…'],
  },
  'tiger': {
    heading: 'Loss Writing',
    chips: [{ label:'Loss', color:'#B45309' },{ label:'Sumatran tiger', color:'#DC2626' },{ label:'The passage', color:'#059669' },{ label:'Reference', color:'#0284C7' }],
    hintsByStage: {
      1: ['Look at the tiger in front of you — what do you see?', 'Write one sentence about the tiger', 'For your second sentence, use a word or idea from the passage — like "erased" or "what the world is losing"'],
      2: ['Look at the tiger and think about the passage', 'Use an idea or phrase from the passage in one of your sentences', 'You could try: "The passage says... and when I look at this tiger..."'],
      3: ['Write a paragraph about the tiger and loss', 'Refer to something from the passage — a word, phrase or idea', 'Connect what you read to what you can actually see in front of you'],
      4: ['Use ideas or quotes from the passage to support your writing', 'Connect what the passage says to what you can observe in the tiger', 'Try: "As the passage describes... this tiger..."'],
      5: ['Write a piece that connects the passage to the tiger in front of you', 'Quote or refer to the passage directly in your writing', 'Explain how the passage\'s ideas match what you can see'],
    },
    starters: ['This tiger is…', 'What the world is losing is…', 'The passage says… and when I look at this tiger…', 'Fewer than 400…'],
  },
  'dingo': {
    heading: 'Warrigal\'s Story',
    chips: [{ label:'Describe the dingo', color:'#B45309' },{ label:'Warrigal', color:'#DC2626' },{ label:'Feelings', color:'#059669' },{ label:'Partnership', color:'#0284C7' }],
    hintsByStage: {
      1: ['Look at the dingo - describe its colour, size or how it moves', 'Think about Warrigal - what did he want? What did he find instead?', 'Write one sentence about the dingo you see, one sentence about Warrigal'],
      2: ['Look carefully at the dingo in front of you', 'What does it remind you of from the story? Its movement, its eyes, how it holds itself?', 'Write about the dingo and connect it to Warrigal in a few sentences'],
      3: ['Look at the dingo, then write as Warrigal using "I"', 'What is he feeling? Tired, hungry, nervous?', 'Start with where he is right now - facing the hunter'],
      4: ['Look at the dingo to picture what Warrigal looks like', 'Write as Warrigal - what does he see, hear, feel in this moment?', 'Show his decision: why does he speak instead of run?'],
      5: ['Observe the dingo, then write from Warrigal\'s perspective at the turning point', 'Use first person deliberately - what effect does it create for the reader?', 'After writing, reflect on how perspective shapes the theme of partnership'],
    },
    starters: ['The dingo in front of me…', 'I could run no further…', 'Looking at this animal, I think of Warrigal…', 'When I turned to face him…'],
  },
  'lemur': {
    heading: 'Creative Story',
    chips: [{ label:'First person', color:'#B45309' },{ label:'Third person', color:'#059669' },{ label:'Story language', color:'#9B30FF' },{ label:'Detail', color:'#DC2626' }],
    hintsByStage: {
      1: ['Look at the lemurs now — what are they doing?', 'Think about the moments in the game: leaping, foraging, calling', 'Use "I" if you are the lemur, or "the lemur" if you are the narrator'],
      2: ['Describe one thing you can see the lemurs doing right now', 'Add a moment from the dance game — leaping, foraging, calling or resting', 'Choose first person ("I leapt...") or third person ("the lemur leapt...") and stick to it'],
      3: ['Combine what you see now with the game behaviours as your story events', 'Choose a perspective and use it consistently throughout', 'Add sensory details from both what you see and what you experienced in the game'],
      4: ['Use specific observations from the enclosure AND game moments as your raw material', 'Maintain a consistent perspective and use it deliberately', 'Analyse in one sentence how your perspective choice affects the reader'],
      5: ['Blend your direct observation with game-inspired moments to create a layered narrative', 'Use your perspective to shape what the reader knows and feels', 'Analyse how narrative perspective constructs reader positioning in your text'],
    },
    starters: ['I leapt into the branches and…', 'The lemur stretched its ringed tail and…', 'Looking at the lemur now, I…', 'As the afternoon light shifted…'],
  },
  'sea-lion': {
    heading: 'Persuasive Techniques',
    chips: [{ label:'Rhetorical Q', color:'#B45309' },{ label:'Emotive words', color:'#059669' },{ label:'Evidence', color:'#0284C7' },{ label:'Persuade', color:'#DC2626' }],
    hintsByStage: {
      1: ['Give one reason why sea lions need our help', 'Use the word "must" or "should" to make your writing persuasive', 'Write a sentence that makes the reader want to help sea lions'],
      2: ['Write one sentence using emotive language (words that make the reader feel something)', 'Add a fact to support your argument', 'Why is evidence important in persuasive writing?'],
      3: ['Write a persuasive paragraph using emotive language, a fact and a rhetorical question', 'Identify the persuasive technique you used', 'How does each technique affect the reader differently?'],
      4: ['Use and name at least two persuasive techniques (rhetorical question, emotive language, repetition, statistics)', 'How does each technique position the reader?', 'Explain the effect of your chosen techniques on the audience'],
      5: ['Analyse how different rhetorical devices construct argument and position readers', 'Discuss how the intended audience shapes your choice of persuasive techniques', 'Evaluate the effectiveness of each rhetorical device you used'],
    },
    starters: ['Should we really allow sea lions to…?', 'Sea lions need our help because…', 'I used the technique of… because it…'],
  },
  'asian-water-buffalo': {
    heading: 'Buffalo Hooves',
    chips: [{ label:'Hooves', color:'#B45309' },{ label:'Shape', color:'#059669' },{ label:'Help', color:'#0284C7' },{ label:'Mud', color:'#DC2626' }],
    hintsByStage: {
      1: ['Look at the buffalo\'s feet', 'Are the hooves wide or narrow?', 'Write: "The buffalo has hooves that are..."'],
      2: ['Sentence 1: what do the hooves look like? (wide, flat, spread out)', 'Sentence 2: what do you think they help the buffalo do?', 'Try starting with "They help the buffalo..."'],
      3: ['Start with: "Buffalo hooves are wide and..."', 'Next: what do they help the buffalo do?', 'Finish: why does this help? (muddy ground, swamps)'],
      4: ['Describe the shape: wide, flat, split in two', 'Explain the job: they spread weight so the buffalo doesn\'t sink', 'Why does this suit the habitat? (muddy, wet ground)'],
      5: ['Describe the shape (wide, split in two) and what you can see', 'Explain the job the hooves do (spread weight across soft mud)', 'Connect to habitat: the buffalo lives in swamps — how do the hooves suit this?'],
    },
    starters: ['Buffalo hooves are…', 'The hooves help the buffalo by…', 'I can see that the hooves are…'],
  },
  'concert-lawn': {
    heading: 'Through the Tree\'s Eyes',
    chips: [{ label:'Memory', color:'#B45309' },{ label:'Time', color:'#059669' },{ label:'Feelings', color:'#0284C7' },{ label:'Voice', color:'#DC2626' }],
    hintsByStage: {
      1: ['How old do you think the tree is?', 'What might it have seen? (people, animals, seasons)', 'Write "the tree saw..." or "the tree felt..."'],
      2: ['Give the tree a human emotion - lonely, proud, tired, watchful?', 'Think about what it might have heard or felt over many years', 'You can write as the tree using "I", or describe it using "the tree"'],
      3: ['Choose two or three specific things the tree might have witnessed', 'Use personification - give the tree a feeling, thought or action', 'Use your real observation of the tree to make the writing feel grounded'],
      4: ['Use what you actually see (size, texture, bark, branches) to anchor the writing', 'Give the tree a consistent voice or perspective - what does it notice? What does it value?', 'Think about what your personification reveals about time, nature and humans'],
      5: ['Use your real observations to write something specific - avoid generic descriptions', 'Through personification, explore what the tree\'s long existence might say about impermanence, memory or the natural world', 'Be intentional - what does each personification choice add to the meaning?'],
    },
    starters: ['For a hundred years, I have stood here and watched…', 'The tree remembered the day when…', 'If the old tree could speak, it would say…'],
  },
  'blue-mountains-bushwalk': {
    heading: 'Listening Recount',
    chips: [{ label:'What you heard', color:'#B45309' },{ label:'First person', color:'#059669' },{ label:'Past tense', color:'#0284C7' },{ label:'Sensory language', color:'#DC2626' }],
    hintsByStage: {
      1: ['Think about what you heard on the walk', 'Start with "I heard..." and write what it sounded like', 'Write two or three sentences in the order things happened'],
      2: ['Use "I" and past tense - "I heard", "I noticed", "I saw"', 'Use time words: first, then, next, finally', 'Look at the model text to see how sensory language works'],
      3: ['Write a recount using first person, past tense and sensory language', 'Look at the model text - how does the writer describe sound and place?', 'Try to capture one specific moment: the waterfall, the lizard, or the lyrebird'],
      4: ['Use the model text to help structure your recount: orientation, sequence, reorientation', 'Choose two techniques from the model text and use them in your own writing', 'After writing, name the techniques you used and explain their effect'],
      5: ['Write a recount that shows control of structure and language', 'Analyse how the model text uses person, tense and sensory detail to position the reader', 'How do your own language choices shape the reader\'s experience of the walk?'],
    },
    starters: ['I heard…', 'The first thing I noticed was…', 'By the time we reached…', 'The sound I remember most was…'],
  },
};

const BUSHWALK_PASSAGE = [
  'We set off along the track and the city disappeared behind us, tree by tree. The air changed first - cooler, heavier, carrying the smell of damp bark and eucalyptus.',
  'At the waterfall, we stopped. The sound was everywhere at once, a rush and a hiss that filled all the space around us. Something moved at the water\'s edge and vanished before I could be sure of it. A platypus, someone said quietly. We stood still for a long time after that.',
  'Further along, a flat sandstone slab lay warm in the sun. A blue-tongued lizard occupied the centre and did not move for us. One amber eye considered us briefly, then looked away.',
  'The lyrebird we heard before we saw it. A click. A mechanical whirr. Then something close to a voice, though no one was near. We found it eventually in the ferns, but by then it had already moved on. The forest kept producing sounds long after we had stopped expecting them.',
];

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
  const [storyOpen, setStoryOpen] = useState(false);

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

  const isMaths   = classSubject === 'maths';
  const isPdhpe   = classSubject === 'pdhpe';
  const isEnglish = classSubject === 'english';
  const mathsData   = isMaths   ? getMathsObservationData(animalId, classStage)   : null;
  const pdhpeData   = isPdhpe   ? getPdhpeObservationData(animalId, classStage)   : null;
  const englishData = isEnglish ? getEnglishObservationData(animalId, classStage) : null;
  const cfg    = isMaths   ? (MATHS_OBS_CONFIG[animalId]   || OBS_CONFIG[animalId])
               : isPdhpe   ? (PDHPE_OBS_CONFIG[animalId]   || OBS_CONFIG[animalId])
               : isEnglish ? (ENGLISH_OBS_CONFIG[animalId] || OBS_CONFIG[animalId])
               : OBS_CONFIG[animalId];
  const prompt = isMaths   ? (mathsData?.prompt   || '')
               : isPdhpe   ? (pdhpeData?.prompt   || '')
               : isEnglish ? (englishData?.prompt || '')
               : ((currentAnimal?.writingPromptByStage?.[classStage]) || currentAnimal?.observationPrompt || '');
  const tip    = getStageScaffoldTip(classStage);

  // Placeholder text
  const placeholder = isMaths
    ? (classStage <= 2 ? 'I calculated…' : classStage === 5 ? 'Based on my calculations…' : 'I calculated that…')
    : isPdhpe
    ? (classStage <= 2 ? 'I noticed…' : classStage === 5 ? 'Based on my observation and knowledge of PDHPE…' : 'I observed that…')
    : isEnglish
    ? (animalId === 'concert-lawn'
        ? (classStage <= 2 ? 'For a hundred years, I have seen…' : classStage === 5 ? 'The tree stood as a silent witness to…' : 'If this tree could speak, it would say…')
        : animalId === 'lion'
        ? (classStage <= 2 ? 'The lion\'s eyes are like a…' : classStage >= 4 ? 'The lion\'s eyes burned like… This creates the effect of…' : 'The lion\'s eyes are like…')
        : animalId === 'chimpanzee'
        ? (classStage <= 2 ? 'Once there was a chimpanzee who…' : 'The trouble began when the chimps couldn\'t…')
        : animalId === 'gorilla'
        ? (classStage <= 2 ? 'Jabari turned and…' : 'Slowly, Kito reached out and…')
        : animalId === 'giraffe'
        ? (classStage <= 2 ? 'The giraffe is as tall as a…' : 'The giraffe stretches like… This simile…')
        : animalId === 'koala'
        ? (classStage <= 2 ? 'Koalas are…' : 'Koalas are a species that…')
        : animalId === 'tiger'
        ? (classStage <= 2 ? 'The tiger stood like the last of something…' : 'What the world is losing is…')
        : animalId === 'dingo'
        ? (classStage <= 2 ? 'I could run no further…' : 'I turned to face him and…')
        : animalId === 'lemur'
        ? (classStage <= 2 ? 'I leapt into the branches and…' : 'I leapt between the trees and…')
        : animalId === 'sea-lion'
        ? (classStage <= 2 ? 'The sea lions need…' : 'Dear Taronga Directors,…')
        : animalId === 'asian-water-buffalo'
        ? (classStage <= 2 ? 'Buffalo hooves are…' : 'The wide hooves of the buffalo…')
        : animalId === 'blue-mountains-bushwalk'
        ? (classStage <= 2 ? 'I heard…' : 'The first thing I noticed was…')
        : (classStage <= 2 ? 'I noticed…' : classStage === 5 ? 'In my response I will use the technique of…' : 'I noticed the language technique of…'))
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
    'koala': ['How long did it stay still?', 'Koalas sleep up to 22 hours - does that match?'],
    'concert-lawn': ['Count steps one way across', 'Draw the shape of the lawn'],
    'dingo': ['More or fewer than 5?', 'Write a number sentence about what you see'],
    'lemur': ['Count the black rings', 'Count the white rings'],
    'sea-lion': ['Bigger or smaller than a person?', 'Write 3 things you could measure'],
    'asian-water-buffalo': ['Stretch your arms as wide as you can', 'Write YES or NO and explain'],
    'blue-mountains-bushwalk': ['Count on your fingers', 'Which category had the most?'],
  };

  const pdhpeS1Q = {
    'chimpanzee':          'Look at the comparison chart. Which chimp habit do you think is most important for health?',
    'gorilla':             'What did you feed the gorillas in the game? Can you name one of those foods?',
    'lion':                'Is the lion resting or moving right now?',
    'giraffe':             'Can you feel your own heartbeat?',
    'tiger':               'Does the tiger move fast or slow?',
    'koala':               'Is the koala awake or asleep?',
    'dingo':               'How does the dingo move around?',
    'lemur':               'Are the lemurs together or alone?',
    'sea-lion':            'Watch the sea lion - is it swimming or resting?',
    'asian-water-buffalo': 'Which parts of the buffalo look the most muscular?',
    'blue-mountains-bushwalk': 'How does your body feel after walking?',
    'concert-lawn':        'How does your body feel after being active on the grass?',
  };
  const pdhpeS1Cues = {
    'chimpanzee':          ['Think about physical activity, sleep, or time outdoors', 'Which habit could help YOUR health the most?'],
    'gorilla':             ['Was it leaves, bamboo, fruit or termites?', 'Which one do YOU eat too?'],
    'lion':                ['How long has it been resting?', 'Why do you think it needs so much rest?'],
    'giraffe':             ['Put your hand on your chest', 'Count how many times it beats in 10 seconds'],
    'tiger':               ['Is it sneaking slowly or pacing quickly?', 'What muscles can you see moving?'],
    'koala':               ['How many hours might it sleep?', 'Do YOU feel better after a good sleep?'],
    'dingo':               ['Is it walking, trotting, or running?', 'Does it look tired or energetic?'],
    'lemur':               ['Count how many are in the group', 'Are they touching each other or staying apart?'],
    'sea-lion':            ['Count how many times it surfaces to breathe', 'Does it look comfortable in the water?'],
    'asian-water-buffalo': ['Point to where you think the biggest muscles are', 'Do you think it is strong or fast?'],
    'blue-mountains-bushwalk': ['Is your heart beating faster?', 'Take a deep breath - how does it feel?'],
    'concert-lawn':        ['Is your heart beating faster?', 'Do you feel warm or energetic?'],
  };

  const s1q    = isMaths   ? (mathsS1Q[animalId]  || 'What number or measurement did you record?')
               : isPdhpe   ? (pdhpeS1Q[animalId]  || 'What did you observe about this animal\'s body or behaviour?')
               : isEnglish ? (animalId === 'concert-lawn' ? 'Find a tree near the Concert Lawn. Look up at it. How old does it look?' : 'What action word (verb) best describes what this animal is doing right now?')
               : (S1_QUESTIONS[animalId] || 'What did you see?');
  const s1cues = isMaths   ? (mathsS1Cues[animalId] || ['What did you calculate?', 'Show your working.'])
               : isPdhpe   ? (pdhpeS1Cues[animalId] || ['Describe one thing you noticed', 'How does it connect to your own body?'])
               : isEnglish ? (animalId === 'concert-lawn' ? ['How big is the trunk?', 'Does it look old or young?'] : ['What is the animal doing?', 'Which word describes it best?'])
               : (S1_CUES[animalId] || ['What did you see?','What was it doing?']);
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
          <h2 className="heading-display" style={{ fontSize:'2.5rem', marginBottom:'0.8rem' }}>
            {isPdhpe ? 'Concert Lawn' : isEnglish ? 'Find Your Tree' : 'Habitat Experience'}
          </h2>
          <p style={{ fontSize:'1rem', opacity:0.9, maxWidth:'520px', lineHeight:1.7, marginBottom:'1rem' }}>
            {isPdhpe
              ? 'Take off your shoes if it is safe to do so. Step onto the grass and notice how it makes you feel.'
              : isMaths
              ? 'Maths is not just numbers on a page. Mathematicians use observation, estimation and measurement to understand real places.'
              : isEnglish
              ? 'Walk to a tree near the Concert Lawn. Stand beside it. Look up at its branches and down at its roots.'
              : classStage <= 3
              // Stage 3 and below get a single instruction. The full version is two sentences of
              // framing before it says what to do, and the six bullets below are more than a
              // student can hold while walking around for a minute.
              ? 'Stand on the grass. This is a habitat too — find out what lives here.'
              : 'The Concert Lawn is a natural habitat within the zoo. Stand on the grass and observe what makes this environment different from the animal enclosures.'}
          </p>
          <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'14px', padding:'1rem 1.4rem', maxWidth:'480px', marginBottom:'1.5rem', textAlign:'left' }}>
            {isEnglish ? (
              <>
                <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.4rem' }}>Walk to a tree and stand beside it.</p>
                <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.7rem' }}>⏱ Observe it for 60 seconds.</p>
                <p style={{ fontSize:'0.82rem', opacity:0.85, marginBottom:'0.4rem', fontWeight:600 }}>As you look, think about:</p>
                {[
                  'how tall and wide the trunk is',
                  'how old you think it might be',
                  'what the bark looks and feels like',
                  'what the tree might have seen from this spot over the years',
                  'what season it looks like it is experiencing right now',
                  'what human quality you could give this tree',
                ].map((pt, i) => (
                  <p key={i} style={{ fontSize:'0.82rem', opacity:0.8, margin:'0.15rem 0', paddingLeft:'0.8rem' }}>– {pt}</p>
                ))}
              </>
            ) : (
              <>
                <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.4rem' }}>Take your shoes off if safe to do so.</p>
                <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.7rem' }}>⏱ Walk on the grass for 60 seconds.</p>
                <p style={{ fontSize:'0.82rem', opacity:0.85, marginBottom:'0.4rem', fontWeight:600 }}>
                  {isPdhpe ? 'As you walk, notice:' : 'As you walk, think about:'}
                </p>
                {(isPdhpe ? [
                  'how the grass feels under your feet',
                  'how your body feels in the open space',
                  'how the fresh air and nature affect your mood',
                  'how it feels to be active with others around you',
                  'whether you feel more relaxed, energised or connected',
                ] : isMaths ? [
                  'how many steps you take',
                  'the length of your stride',
                  'whether the ground feels flat, sloped, soft or uneven',
                  'how the texture compares to concrete or hard surfaces',
                  'how temperature, distance and area could be measured',
                  'how this environment changes the way you move',
                ] : classStage <= 3 ? [
                  'how the grass feels under your feet',
                  'sounds and smells around you',
                  'any insects, birds or plants you can see',
                ] : [
                  'the texture and temperature of the grass underfoot',
                  'sounds, smells and living things around you',
                  'how this natural habitat differs from the animal enclosures',
                  'any insects, birds or plants you can observe',
                  'how this open green space functions as a habitat',
                  'how humans and animals share and interact with this space',
                ]).map((pt, i) => (
                  <p key={i} style={{ fontSize:'0.82rem', opacity:0.8, margin:'0.15rem 0', paddingLeft:'0.8rem' }}>– {pt}</p>
                ))}
              </>
            )}
          </div>
          <h3 style={{ fontSize:'5rem', fontWeight:800, marginBottom:'1.5rem', fontVariantNumeric:'tabular-nums', color: concertLawnTimerSeconds <= 10 ? '#FFEB3B' : 'white' }}>
            {concertLawnTimerSeconds}
          </h3>
          {!concertLawnTimerActive
            ? <button onClick={() => setConcertLawnTimerActive(true)}
                style={{ padding:'0.9rem 2.5rem', borderRadius:'var(--t-r-pill)', border:'none', background:'var(--sunset-orange)', color:'white', fontWeight:700, fontSize:'1.1rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
                ▶ Start Timer
              </button>
            : <p style={{ fontSize:'0.9rem', opacity:0.85, fontWeight:600 }}>{isEnglish ? 'Observe your tree now…' : 'Walk on the grass now…'}</p>
          }
        </div>
      )}

      {/* Tiger Silent Forest countdown */}
      {animalId === 'tiger' && !tigerTimerDone && (
        <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#1a3a2a 0%,#2e5c3e 100%)', zIndex:1900, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white', textAlign:'center' }}>
          <h2 className="heading-display" style={{ fontSize:'2.5rem', marginBottom:'0.8rem' }}>Silent Forest</h2>
          <p style={{ fontSize:'1.1rem', opacity:0.9, maxWidth:'500px', lineHeight:1.7, marginBottom:'2rem' }}>
            {isPdhpe
              ? 'Stop. Look closely at the tiger. Think about what athletes could learn from this animal.'
              : isMaths
              ? 'Stop. Look closely. The zoo is full of hidden maths.'
              : isEnglish
              ? 'Stop. Look at the tiger through your journalist\'s eye. What do you see that carries the weight of what is being lost?'
              : classStage <= 3
              // Stage 3 and below are asked "what did you hear or smell around the habitat?", so
              // the countdown primes the senses rather than the science vocabulary. Stage 4-5
              // keep the adaptations framing, which is what their prompt asks for.
              ? 'Stop. Stand still and use your senses. What can you SEE, HEAR and SMELL around the tiger?'
              : 'Stop. Look closely at the tiger. What behaviours, features and adaptations can you observe?'}
          </p>
          <h3 style={{ fontSize:'5rem', fontWeight:800, marginBottom:'1.5rem', fontVariantNumeric:'tabular-nums', color: tigerTimerSeconds <= 10 ? '#FFEB3B' : 'white' }}>
            {tigerTimerSeconds}
          </h3>
          {!tigerTimerActive
            ? <button onClick={() => setTigerTimerActive(true)}
                style={{ padding:'0.9rem 2.5rem', borderRadius:'var(--t-r-pill)', border:'none', background:'var(--sunset-orange)', color:'white', fontWeight:700, fontSize:'1.1rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
                Start Observing
              </button>
            : <p style={{ fontSize:'0.9rem', opacity:0.85, fontWeight:600 }}>
                {isPdhpe ? 'Observe now… what can sport learn from this animal?'
                  : isMaths ? 'Observe now… find the hidden maths.'
                  : isEnglish ? 'Look closely… what details will you put in your writing?'
                  : classStage <= 3 ? 'Look, listen and sniff… what can you notice?'
                  : 'Observe now… look for adaptations and behaviours.'}
              </p>
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
                  <p style={{ fontSize:'0.82rem', fontWeight:700, color:'#065F46', margin:0 }}>✓ Listening complete - write your response below</p>
                </div>
              )}
              {animalId === 'tiger' && tigerTimerDone && (
                <div style={{ background:'#D1FAE5', borderRadius:'var(--t-r-sm)', padding:'0.4rem 0.9rem', marginBottom:'0.75rem', textAlign:'center' }}>
                  <p style={{ fontSize:'0.82rem', fontWeight:700, color:'#065F46', margin:0 }}>✓ Observation complete - write your response below</p>
                </div>
              )}
            </>
          )}

          {/* Chimp behaviour data summary (maths + PDHPE) */}
          {(isMaths || isPdhpe) && animalId === 'chimpanzee' && missionContext?.type === 'chimp-behaviour' && (
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
              {isPdhpe && <p style={{ fontSize:'0.75rem', color:'#444', fontWeight:600, margin:'0.4rem 0 0' }}>Use this graph to compare the chimp's lifestyle with your own in your response below.</p>}
            </div>
          )}

          {/* Maths calculator */}
          {isMaths && <div style={{ marginBottom:'0.75rem' }}><MathsCalculator /></div>}

          {/* Story reference dropdown (English gorilla only) */}
          {isEnglish && animalId === 'gorilla' && (() => {
            const passage = getStageQuestions(currentAnimal, classStage, classSubject)[0]?.passage;
            if (!passage) return null;
            return (
              <div style={{ marginBottom:'0.85rem' }}>
                <button onClick={() => setStoryOpen(o => !o)}
                  style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', background: storyOpen ? '#1a3a2a' : '#f0f7f0', border:`1.5px solid ${storyOpen ? '#2A8A40' : 'rgba(46,125,85,0.35)'}`, borderRadius: storyOpen ? '10px 10px 0 0' : '10px', padding:'0.65rem 1rem', cursor:'pointer', transition:'all 0.2s' }}>
                  <span style={{ fontSize:'0.82rem', fontWeight:700, color: storyOpen ? 'rgba(100,220,140,0.9)' : '#2E7D55', letterSpacing:'0.05em' }}>📖 The Big Serve — read the story again</span>
                  <span style={{ fontSize:'0.75rem', color: storyOpen ? 'rgba(255,255,255,0.6)' : '#666' }}>{storyOpen ? '▴ Hide' : '▾ Show'}</span>
                </button>
                {storyOpen && (
                  <div style={{ background:'white', border:'1.5px solid rgba(46,125,85,0.35)', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'1.1rem 1.3rem' }}>
                    {passage.split('\n').map((line, i) => (
                      <p key={i} style={{ fontSize: i === 0 ? '0.95rem' : '0.88rem', color: i === 0 ? '#1a1a1a' : '#333', margin: i === 0 ? '0 0 0.65rem' : '0.3rem 0 0', lineHeight:1.7, fontWeight: i === 0 ? 700 : 400, fontStyle: i > 0 ? 'italic' : 'normal' }}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Photo + passage reference (English tiger only) */}
          {isEnglish && animalId === 'tiger' && missionContext?.type === 'tiger-english' && (
            <div style={{ marginBottom:'0.85rem' }}>
              <button onClick={() => setStoryOpen(o => !o)}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', background: storyOpen ? '#1a3a2a' : '#f0f7f0', border:`1.5px solid ${storyOpen ? '#2A8A40' : 'rgba(46,125,85,0.35)'}`, borderRadius: storyOpen ? '10px 10px 0 0' : '10px', padding:'0.65rem 1rem', cursor:'pointer', transition:'all 0.2s' }}>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color: storyOpen ? 'rgba(100,220,140,0.9)' : '#2E7D55', letterSpacing:'0.05em' }}>📷 Your photo and model text</span>
                <span style={{ fontSize:'0.75rem', color: storyOpen ? 'rgba(255,255,255,0.6)' : '#666' }}>{storyOpen ? '▴ Hide' : '▾ Show'}</span>
              </button>
              {storyOpen && (
                <div style={{ background:'white', border:'1.5px solid rgba(46,125,85,0.35)', borderTop:'none', borderRadius:'0 0 10px 10px', overflow:'hidden' }}>
                  {missionContext.photo && missionContext.photo !== 'camera-error' && (
                    <img src={missionContext.photo} alt="Your tiger" style={{ width:'100%', maxHeight:'220px', objectFit:'cover', display:'block' }} />
                  )}
                  <div style={{ padding:'1rem 1.2rem' }}>
                    <p style={{ fontSize:'0.6rem', fontWeight:800, color:'#B45309', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.6rem' }}>The Last 400 - Model Text</p>
                    {[
                      'Your grandparents grew up in a world with thousands of Sumatran tigers. You are growing up in one with fewer than 400.',
                      'The forest that held them, layered and ancient and breathing, has been cleared, strip by strip, for palm oil. The tigers did not leave. They were erased.',
                      'Now look at the animal in front of you. This is what the world is losing.',
                    ].map((para, i) => (
                      <p key={i} style={{ fontSize:'0.85rem', color:'#333', lineHeight:1.7, margin: i > 0 ? '0.6rem 0 0' : 0, fontStyle:'italic' }}>{para}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Model recount passage (English bushwalk only) */}
          {isEnglish && animalId === 'blue-mountains-bushwalk' && (
            <div style={{ marginBottom:'0.85rem' }}>
              <button onClick={() => setStoryOpen(o => !o)}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', background: storyOpen ? '#1a3a2a' : '#f0f7f0', border:`1.5px solid ${storyOpen ? '#2A8A40' : 'rgba(46,125,85,0.35)'}`, borderRadius: storyOpen ? '10px 10px 0 0' : '10px', padding:'0.65rem 1rem', cursor:'pointer', transition:'all 0.2s' }}>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color: storyOpen ? 'rgba(100,220,140,0.9)' : '#2E7D55', letterSpacing:'0.05em' }}>📖 Model Recount — A Walk Through the Blue Mountains</span>
                <span style={{ fontSize:'0.75rem', color: storyOpen ? 'rgba(255,255,255,0.6)' : '#666' }}>{storyOpen ? '▴ Hide' : '▾ Show'}</span>
              </button>
              {storyOpen && (
                <div style={{ background:'white', border:'1.5px solid rgba(46,125,85,0.35)', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'1rem 1.2rem' }}>
                  <p style={{ fontSize:'0.6rem', fontWeight:800, color:'#5B8C5A', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.75rem' }}>Model Recount Text</p>
                  {BUSHWALK_PASSAGE.map((para, i) => (
                    <p key={i} style={{ fontSize:'0.88rem', color:'#333', lineHeight:1.75, margin: i > 0 ? '0.65rem 0 0' : 0, fontStyle:'italic' }}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Lemur dance moments reference */}
          {isEnglish && animalId === 'lemur' && (() => {
            const moments = JSON.parse(localStorage.getItem('lemurDanceMoments') || '[]');
            if (!moments.length) return null;
            return (
              <div style={{ background:'rgba(155,48,255,0.06)', border:'1px solid rgba(155,48,255,0.2)', borderRadius:'var(--t-r-md)', padding:'0.75rem 1rem', marginBottom:'0.85rem' }}>
                <p style={{ fontSize:'0.65rem', fontWeight:800, color:'#7C3AED', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 0.5rem' }}>Your dance moments</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                  {moments.map((m, i) => (
                    <span key={i} style={{ background:`${m.color}22`, border:`1.5px solid ${m.color}80`, borderRadius:'var(--t-r-pill)', padding:'0.25rem 0.65rem', fontSize:'0.78rem', fontWeight:600, color:'#222' }}>I {m.story}</span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Dreaming story dropdown (English dingo only) */}
          {isEnglish && animalId === 'dingo' && (
            <div style={{ marginBottom:'0.85rem' }}>
              <button onClick={() => setStoryOpen(o => !o)}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', background: storyOpen ? '#2C1A0E' : '#fdf6ee', border:`1.5px solid ${storyOpen ? 'rgba(255,200,100,0.4)' : 'rgba(196,135,58,0.4)'}`, borderRadius: storyOpen ? '10px 10px 0 0' : '10px', padding:'0.65rem 1rem', cursor:'pointer', transition:'all 0.2s' }}>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color: storyOpen ? 'rgba(255,200,100,0.9)' : '#9B5E1E', letterSpacing:'0.05em' }}>📖 Read the story again — Warrigal and the Mundurra</span>
                <span style={{ fontSize:'0.75rem', color: storyOpen ? 'rgba(255,255,255,0.5)' : '#888' }}>{storyOpen ? '▴ Hide' : '▾ Show'}</span>
              </button>
              {storyOpen && (
                <div style={{ background:'#2C1A0E', border:'1.5px solid rgba(255,200,100,0.25)', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'1rem 1.2rem' }}>
                  <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(255,200,100,0.6)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.75rem' }}>Aboriginal Dreaming Story</p>
                  <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.88)', lineHeight:1.8, margin:0 }}>Warrigal, the old dingo, was hungry. He had been stalking a wallaby through the scrub when an old mundurra, a hunter, scared it away. The mundurra spotted Warrigal and raised his spear (his tura), so Warrigal ran. But both were old and tired, and when Warrigal could run no further, he turned and faced the hunter. "Why do you chase me, old brother?" he panted. The mundurra was also relieved to stop. "We are both lonely hunters," said Warrigal, "and our old age unites us." The mundurra lowered his spear and sat down. Together they worked out that they might both eat better if they hunted as a team. And so they did, sharing food and campfires, and becoming close friends. So did all their descendants. Men and dogs have hunted together ever since.</p>
                  <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.3)', marginTop:'0.85rem', marginBottom:0 }}>Source: dingoden.net</p>
                </div>
              )}
            </div>
          )}

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
                <span style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--jungle-deep)', fontStyle:'italic' }}>{isMaths ? '"I calculated…"' : isEnglish ? '"I noticed…"' : '"I saw…"'}</span>
              </div>
              <div style={{ background:'#F7FAF8', border:'1px solid #D4E8DC', borderRadius:'var(--t-r-md)', padding:'0.9rem 1.1rem', marginTop:'0.75rem' }}>
                <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#059669', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.5rem' }}>You could write:</p>
                {(isMaths ? ['I calculated…','The answer is…'] : isEnglish ? ['The animal…','I noticed the word…'] : ['I saw…','It was…']).map((s, i) => (
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
          {classStage > 2 && isPdhpe && (() => {
            const hints = cfg?.hintsByStage?.[classStage] || cfg?.hintsByStage?.[3] || [];
            return (
              <div style={{ marginTop:'0.75rem' }}>
                <button
                  onClick={() => setHintsOpen(o => !o)}
                  style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#FAF5FF', border:'1px solid #E9D5FF', borderRadius: hintsOpen ? '10px 10px 0 0' : '10px', padding:'0.7rem 1rem', cursor:'pointer', color:'#7C3AED', fontWeight:700, fontSize:'0.82rem', textAlign:'left' }}>
                  <span>Need a hint?</span>
                  <span style={{ fontSize:'0.7rem' }}>{hintsOpen ? '▲' : '▼'}</span>
                </button>
                {hintsOpen && (
                  <div style={{ background:'#FAF5FF', border:'1px solid #E9D5FF', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'0.75rem 1rem' }}>
                    {hints.length > 0 && (
                      <>
                        <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#7C3AED', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.35rem' }}>Your response should include:</p>
                        <ul style={{ margin:'0 0 0.6rem', paddingLeft:'1.1rem', fontSize:'0.8rem', color:'#555', lineHeight:1.8 }}>
                          {hints.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                      </>
                    )}
                    <p style={{ fontSize:'0.73rem', fontWeight:600, color:'#7C3AED', marginBottom:'0.2rem' }}>Sentence starters:</p>
                    {(cfg?.starters || tip.starters).map((s, i) => (
                      <p key={i} style={{ fontSize:'0.75rem', color:'#555', margin:'0.1rem 0', paddingLeft:'0.5rem', fontStyle:'italic' }}>"{s}"</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
          {classStage > 2 && isEnglish && (() => {
            const hints = cfg?.hintsByStage?.[classStage] || cfg?.hintsByStage?.[3] || [];
            return (
              <div style={{ marginTop:'0.75rem' }}>
                <button
                  onClick={() => setHintsOpen(o => !o)}
                  style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius: hintsOpen ? '10px 10px 0 0' : '10px', padding:'0.7rem 1rem', cursor:'pointer', color:'#B45309', fontWeight:700, fontSize:'0.82rem', textAlign:'left' }}>
                  <span>Need a hint?</span>
                  <span style={{ fontSize:'0.7rem' }}>{hintsOpen ? '▲' : '▼'}</span>
                </button>
                {hintsOpen && (
                  <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'0.75rem 1rem' }}>
                    {hints.length > 0 && (
                      <>
                        <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#B45309', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.35rem' }}>Your response should include:</p>
                        <ul style={{ margin:'0 0 0.6rem', paddingLeft:'1.1rem', fontSize:'0.8rem', color:'#555', lineHeight:1.8 }}>
                          {hints.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                      </>
                    )}
                    <p style={{ fontSize:'0.73rem', fontWeight:600, color:'#B45309', marginBottom:'0.2rem' }}>Sentence starters:</p>
                    {(cfg?.starters || tip.starters).map((s, i) => (
                      <p key={i} style={{ fontSize:'0.75rem', color:'#555', margin:'0.1rem 0', paddingLeft:'0.5rem', fontStyle:'italic' }}>"{s}"</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
          {classStage > 2 && !isMaths && !isPdhpe && !isEnglish && (
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
      <StudentGuide screen="observation" animal={animalId} />
    </div>
  );
}
