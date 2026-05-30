import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { getStageScaffoldTip, getMinWords, getMathsObservationData, getPdhpeObservationData, getEnglishObservationData } from '../utils/helpers';
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
        'Annual rate: total growth ÷ 4 years - convert to cm/year',
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
    heading: 'Patterns & Number',
    chips: [{ label:'Show working', color:'#059669' },{ label:'Ratio', color:'#0284C7' },{ label:'Fractions', color:'#2E7D55' },{ label:'Count', color:'#DC2626' }],
    hintsByStage: {
      3: [
        'Record: ___ black rings and ___ white rings',
        'Write the ratio as black : white',
        'Simplify the ratio - is it close to 1:1?',
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

const PDHPE_OBS_CONFIG = {
  'chimpanzee': {
    heading: 'Chimp Lifestyle vs. Yours',
    chips: [{ label:'Physical Activity', color:'#059669' },{ label:'Sleep', color:'#7C3AED' },{ label:'Social Time', color:'#0284C7' },{ label:'Time Outdoors', color:'#D97706' }],
    hintsByStage: {
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
      3: ['Name two types of food the gorilla eats', 'Name two food groups and what they do for the body', 'Explain why eating a variety of foods matters for health'],
      4: ['Name two food groups and describe the key nutrients each provides', 'Explain the role those nutrients play in keeping the body healthy', 'Use the gorilla\'s diet as an example in your answer'],
      5: ['Name specific nutrients (fibre, vitamins, minerals, plant protein) and explain their physiological roles', 'Evaluate how the gorilla\'s diet compares to adolescent dietary guidelines', 'Discuss at least two health outcomes supported by the gorilla\'s diet'],
    },
    starters: ['Gorillas eat…', 'Eating a variety of foods is important because…', 'The gorilla\'s diet shows that…'],
  },
  'lion': {
    heading: 'Energy Systems & Recovery',
    chips: [{ label:'ATP-PC system', color:'#DC2626' },{ label:'Aerobic / Anaerobic', color:'#059669' },{ label:'BMR', color:'#0284C7' },{ label:'Recovery', color:'#7C3AED' }],
    hintsByStage: {
      3: ['Name the energy system used in a 6-second sprint', 'Explain what BMR means and why it matters for health', 'Give 2 reasons why rest and recovery are important after exercise'],
      4: ['Explain the ATP-PC (phosphocreatine) system and its duration (~10 seconds)', 'Describe how phosphocreatine is replenished during aerobic recovery (3–5 minutes)', 'Link the lion\'s rest-to-activity ratio to human training recovery principles'],
      5: ['Compare ATP-PC, glycolytic, and oxidative energy systems with durations and fuel sources', 'Evaluate how sleep supports growth hormone secretion and physical recovery', 'Apply BMR and energy conservation principles to elite athletic performance'],
    },
    starters: ['The lion uses the ATP-PC system when…', 'Recovery is important because…', 'The aerobic system replenishes…'],
  },
  'giraffe': {
    heading: 'Cardiovascular System',
    chips: [{ label:'Heart rate', color:'#DC2626' },{ label:'Heart size', color:'#059669' },{ label:'Blood flow', color:'#0284C7' },{ label:'Heart health', color:'#7C3AED' }],
    hintsByStage: {
      1: ['Think about how big the giraffe\'s heart is compared to yours', 'What does the heart do for your body?', 'How might a healthy heart help you every day?'],
      2: ['A giraffe\'s heart weighs about 11 kg - a human heart weighs about 0.3 kg', 'Both hearts pump blood to keep the body alive', 'Name one thing that keeps a human heart healthy (e.g. exercise, diet)'],
      3: ['Think about one way the two hearts are the same and one way they are different', 'What happens to your heart rate when you exercise?', 'How does regular exercise help keep your heart healthy?'],
      4: ['Describe a difference in size, rate or pressure between the two hearts', 'What does regular exercise do to the human heart over time?', 'Connect heart function to a health outcome (e.g. lower resting heart rate)'],
      5: ['Consider how a trained athlete\'s heart adapts compared to an untrained person', 'How does the giraffe\'s long neck create a similar challenge to intense exercise?', 'Link cardiovascular fitness to long-term health outcomes'],
    },
    starters: ['The giraffe\'s heart is…', 'Compared to a human heart, the giraffe\'s…', 'A healthy heart…'],
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
      1: ['What does the dingo need food for?', 'Name one food that gives you energy', 'How does your body feel when you have not eaten enough?'],
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
    heading: 'Human Impacts & Resilience',
    chips: [{ label:'Human impacts', color:'#DC2626' },{ label:'Sea lion', color:'#059669' },{ label:'Resilience', color:'#0284C7' },{ label:'Strategies', color:'#7C3AED' }],
    hintsByStage: {
      1: ['Think about what threatens sea lions (pollution, fishing)', 'The sea lion keeps going despite those threats', 'What do YOU do when something is hard?'],
      2: ['Name a human threat sea lions face', 'Think about how the sea lion adapts and keeps going', 'What strategy do you use when you face a challenge?'],
      3: ['Name a human impact on sea lions', 'Just like the sea lion adapts, what do you do when things get difficult?', 'Name one resilience strategy that works for you'],
      4: ['Describe a human impact sea lions face and how they survive it', 'Connect that to your own experience of overcoming a challenge', 'What strategies help you build resilience?'],
      5: ['Name the human threats sea lions face', 'Just as sea lions must adapt and persist, what resilience strategies do you rely on?', 'Explain why those strategies help you overcome challenges'],
    },
    starters: ['Sea lions face threats from humans like…', 'Just like the sea lion, I keep going by…', 'A resilience strategy that works for me is…'],
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
    heading: 'Precise Verbs',
    chips: [{ label:'Verbs', color:'#B45309' },{ label:'Word choice', color:'#059669' },{ label:'Describe', color:'#0284C7' },{ label:'Vivid', color:'#DC2626' }],
    hintsByStage: {
      1: ['What action word (verb) describes what the chimp is doing right now?', 'Swap a vague word for a more exact one - "moves" vs "swings"', 'Write one sentence using a precise verb'],
      2: ['Write two precise verbs that describe exactly how the chimps move', 'Use a specific verb - "leaps" tells us more than "goes"', 'Add two adjectives to your description'],
      3: ['Choose three precise verbs to describe the chimpanzees', 'Add adjectives to paint a clearer picture', 'What image do your words create in the reader\'s mind?'],
      4: ['Use precise verbs and specific noun groups (e.g. "the silver-backed male")', 'What connotations do your verb choices carry?', 'How do your word choices shape the reader\'s impression?'],
      5: ['Analyse how your verb choices shape connotation', 'Discuss how precise vocabulary positions the reader', 'Explain the effect of your word choices on the reader\'s impression of the animal'],
    },
    starters: ['The chimpanzee…', 'I chose the verb "…" because…', 'Precise verbs like "…" create the effect of…'],
  },
  'gorilla': {
    heading: 'Figurative Language',
    chips: [{ label:'Simile', color:'#B45309' },{ label:'Metaphor', color:'#059669' },{ label:'Like / as', color:'#0284C7' },{ label:'Comparison', color:'#DC2626' }],
    hintsByStage: {
      1: ['A simile uses "like" or "as" to compare two things', 'Try: "The gorilla is as big as…"', 'Write one sentence comparing the gorilla to something'],
      2: ['A simile uses "like" or "as" - a metaphor says something IS something else', 'Write one simile and one metaphor about the gorilla', 'Think about its size, colour, movement or power'],
      3: ['A simile compares using "like" or "as" - a metaphor makes a direct comparison', 'Explain what effect each device creates for the reader', 'Try to use an unusual or surprising comparison'],
      4: ['Write a simile and an extended metaphor about the gorilla', 'How does each device shape the reader\'s impression differently?', 'Consider the connotations of what you are comparing the gorilla to'],
      5: ['Analyse the different effects of simile versus extended metaphor', 'How do your figurative language choices position the reader?', 'Discuss how figurative language constructs meaning beyond literal description'],
    },
    starters: ['The gorilla is like…', 'The gorilla is a…', 'I used this comparison because…'],
  },
  'lion': {
    heading: 'Persuasive Writing',
    chips: [{ label:'Argument', color:'#B45309' },{ label:'Evidence', color:'#059669' },{ label:'Persuade', color:'#0284C7' },{ label:'Conservation', color:'#DC2626' }],
    hintsByStage: {
      1: ['Give one reason why lions should be protected', 'Use the word "because" to explain your reason', 'Write one sentence that tries to convince the reader'],
      2: ['Give two reasons why lions matter', 'Use linking words: "firstly", "also", "because"', 'What would the world be like without lions?'],
      3: ['Write a persuasive statement with at least two reasons and evidence', 'Use persuasive language - "we must", "it is vital that"', 'How does your word choice convince the reader?'],
      4: ['Identify a persuasive technique you used (emotive language, rhetorical question, statistics)', 'How does this technique position the reader?', 'Explain the effect of your persuasive choices'],
      5: ['Use and name at least two rhetorical devices in your argument', 'Analyse how your language choices position the reader', 'Consider counterarguments and how you address them'],
    },
    starters: ['Lions must be protected because…', 'Without lions, the world would…', 'I believe that…'],
  },
  'giraffe': {
    heading: 'Vocabulary & Word Choice',
    chips: [{ label:'Vocabulary', color:'#B45309' },{ label:'Precise words', color:'#059669' },{ label:'Tier 2 words', color:'#0284C7' },{ label:'Description', color:'#DC2626' }],
    hintsByStage: {
      1: ['Choose a describing word (adjective) for the giraffe', 'Instead of "big", what more precise word could you use?', 'Write one sentence with a describing word'],
      2: ['Upgrade vague words to precise ones - "nice" to "striking"', 'Think of two Tier 2 vocabulary words (sophisticated everyday words)', 'Use your precise words in a sentence about the giraffe'],
      3: ['Choose two Tier 2 or Tier 3 vocabulary words to describe the giraffe', 'Explain why you chose those words over simpler alternatives', 'What impression do your word choices give the reader?'],
      4: ['Select vocabulary that carries specific connotations', 'How do your word choices shape the reader\'s impression?', 'Analyse the difference between your chosen words and simpler synonyms'],
      5: ['Analyse how vocabulary choices construct meaning and position readers', 'Discuss the connotations of at least two words you chose', 'How do your language choices reflect the author\'s attitude toward the subject?'],
    },
    starters: ['I chose the word "…" to describe the giraffe because…', 'A more precise word than "tall" is…', 'The vocabulary I used creates the impression that…'],
  },
  'koala': {
    heading: 'Narrative Structure',
    chips: [{ label:'Beginning', color:'#B45309' },{ label:'Problem', color:'#DC2626' },{ label:'Resolution', color:'#059669' },{ label:'Narrative', color:'#0284C7' }],
    hintsByStage: {
      1: ['Every story has a beginning, middle and end', 'What could happen to the koala at the start of the story?', 'Write a sentence to start a story about the koala'],
      2: ['A narrative needs: a setting, characters, a problem and a resolution', 'Write two sentences - one to start the story, one to end it', 'What problem might the koala face?'],
      3: ['A strong narrative opening hooks the reader straight away', 'What is the complication your koala faces?', 'How is the problem resolved? Write one sentence for each part'],
      4: ['Describe how narrative structure shapes the reader\'s experience', 'How do exposition, complication and resolution each create tension or release?', 'What narrative techniques (dialogue, description, pacing) could you use?'],
      5: ['Analyse how narrative structure creates meaning and reader response', 'How could you subvert the traditional narrative arc to create a different effect?', 'Discuss the relationship between narrative structure and theme'],
    },
    starters: ['The koala\'s story begins when…', 'The problem in this story is…', 'The resolution of the narrative shows…'],
  },
  'tiger': {
    heading: 'Sensory Imagery',
    chips: [{ label:'Sight', color:'#B45309' },{ label:'Sound', color:'#059669' },{ label:'Touch', color:'#0284C7' },{ label:'Imagery', color:'#DC2626' }],
    hintsByStage: {
      1: ['Write one thing you can see, one thing you can hear', 'Use describing words for what your senses notice', 'Write two sentences about the tiger\'s habitat'],
      2: ['Describe the habitat using two different senses', 'Use adjectives - what words describe exactly what you see, hear or feel?', 'Write three sentences using sensory language'],
      3: ['Use at least three senses in your description of the habitat', 'Choose precise words for each sensation', 'Explain how your sensory language creates a mood or atmosphere'],
      4: ['Describe the tiger\'s habitat using imagery from at least three senses', 'How does sensory language create atmosphere for the reader?', 'Which sense creates the strongest effect - and why?'],
      5: ['Analyse how sensory imagery positions the reader inside the scene', 'Discuss which sensory details you chose and why', 'How does your sensory language construct a particular mood or point of view?'],
    },
    starters: ['I could see…', 'The sound of…', 'The atmosphere of the tiger\'s habitat is…'],
  },
  'dingo': {
    heading: 'Informative Texts',
    chips: [{ label:'Topic sentence', color:'#B45309' },{ label:'Facts', color:'#059669' },{ label:'Text features', color:'#0284C7' },{ label:'Informative', color:'#DC2626' }],
    hintsByStage: {
      1: ['Write one true fact about the dingo', 'A fact is something that is true and can be checked', 'Write your fact in a full sentence'],
      2: ['An informative text has a topic sentence that says what it is about', 'Write a topic sentence about the dingo, then add two facts', 'How is an informative text different from a story?'],
      3: ['Write an informative paragraph with a topic sentence, two facts and a concluding sentence', 'Use specific vocabulary related to your topic', 'How do informative texts use language differently from narratives?'],
      4: ['Identify the features of an effective informative text (topic sentence, evidence, technical vocabulary)', 'How does language in an informative text differ from a persuasive text?', 'Analyse the purpose and audience of your informative writing'],
      5: ['Analyse the structural and language features of informative texts', 'Compare how informative and persuasive texts use evidence differently', 'Discuss how the intended audience shapes language choices in informative writing'],
    },
    starters: ['The dingo is…', 'One important fact about dingoes is…', 'An informative text about the dingo would include…'],
  },
  'lemur': {
    heading: 'Point of View',
    chips: [{ label:'First person', color:'#B45309' },{ label:'Third person', color:'#059669' },{ label:'Perspective', color:'#0284C7' },{ label:'Narrator', color:'#DC2626' }],
    hintsByStage: {
      1: ['First person uses "I" - third person uses "he", "she", "it" or "they"', 'Write one sentence from the lemur\'s point of view using "I"', 'How would the lemur describe its day?'],
      2: ['First person ("I") puts the reader inside the story', 'Write two sentences from the lemur\'s point of view', 'How does the story feel different when told by the character?'],
      3: ['Write a paragraph from the lemur\'s first-person perspective', 'How does first person create a different effect from third person?', 'What does the narrator know or not know in each perspective?'],
      4: ['Analyse how first and third person perspectives create different effects on the reader', 'How does the choice of perspective shape what information the reader receives?', 'Write from two different perspectives and compare the effect'],
      5: ['Discuss how narrative perspective constructs reader positioning', 'Analyse how an unreliable or limited narrator creates particular effects', 'How does the choice of narrator shape the themes and meaning of a text?'],
    },
    starters: ['From the lemur\'s point of view, "I…"', 'First person perspective makes the reader feel…', 'The narrative perspective creates the effect of…'],
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
    heading: 'Personification',
    chips: [{ label:'Personification', color:'#B45309' },{ label:'Human qualities', color:'#059669' },{ label:'Effect', color:'#0284C7' },{ label:'Figurative', color:'#DC2626' }],
    hintsByStage: {
      1: ['Personification gives a human quality to an animal or object', 'Try: "The buffalo smiled in the mud"', 'Write one sentence giving the buffalo a human feeling or action'],
      2: ['Personification makes writing more vivid and emotional', 'Write two sentences giving the buffalo human qualities', 'What emotion or action have you given it?'],
      3: ['Write a paragraph using personification to describe the buffalo', 'Explain what effect personification creates for the reader', 'How is personification different from a simile or metaphor?'],
      4: ['Use personification to create a specific mood or reader response', 'Analyse the effect your personification creates', 'How does personification differ from metaphor in the way it works on the reader?'],
      5: ['Analyse how personification constructs meaning and shapes reader positioning', 'Discuss the connotations of the human qualities you assigned to the buffalo', 'Compare the effect of personification to other figurative devices in creating empathy'],
    },
    starters: ['The buffalo…(human action/feeling)', 'I used personification to show that…', 'The effect of giving the buffalo human qualities is…'],
  },
  'concert-lawn': {
    heading: 'Poetry & Creative Writing',
    chips: [{ label:'Imagery', color:'#B45309' },{ label:'Rhyme', color:'#059669' },{ label:'Rhythm', color:'#0284C7' },{ label:'Poetic devices', color:'#DC2626' }],
    hintsByStage: {
      1: ['A poem uses special language to describe feelings and the world', 'Write two lines about the lawn that rhyme', 'Use a describing word (adjective) in each line'],
      2: ['Try writing two rhyming lines about the Concert Lawn using sensory language', 'A poetic device is a special language technique like rhyme, rhythm or alliteration', 'What words help the reader picture or feel the scene?'],
      3: ['Write a short poem (4 lines) about the Concert Lawn using one poetic device', 'Name the device you used and explain its effect', 'How does your poem create a mood or feeling?'],
      4: ['Write a short poem using at least two named poetic devices', 'Explain the effect of each device on the reader', 'How does your choice of form (rhyming, free verse) shape meaning?'],
      5: ['Write a poem about the Concert Lawn experience using multiple poetic devices', 'Analyse how your language and structural choices create meaning', 'Discuss how the form of your poem contributes to its overall effect'],
    },
    starters: ['The grass feels…', 'On the Concert Lawn,…', 'I used the device of… to create…'],
  },
  'blue-mountains-bushwalk': {
    heading: 'Recount Text',
    chips: [{ label:'Time connectives', color:'#B45309' },{ label:'Past tense', color:'#059669' },{ label:'First person', color:'#0284C7' },{ label:'Recount', color:'#DC2626' }],
    hintsByStage: {
      1: ['A recount tells us what happened in order', 'Use time words like "first", "then", "next", "finally"', 'Write two sentences about the walk in order'],
      2: ['A recount uses first person ("I") and past tense (e.g. "I walked", "I saw")', 'Include time connectives to sequence events', 'Write three sentences about what happened on the walk'],
      3: ['Write a recount paragraph using first person, past tense and time connectives', 'Include descriptive language to make the recount more engaging', 'How does a recount text differ from a narrative?'],
      4: ['Identify the key features of an effective recount (orientation, sequence, reorientation)', 'How does descriptive language improve a recount?', 'Analyse how the choice of details shapes the reader\'s understanding of events'],
      5: ['Analyse the structural and language features that make a recount effective', 'How does the writer\'s selection of events and details shape the reader\'s experience?', 'Compare the purpose and language features of a recount with a narrative'],
    },
    starters: ['First, we…', 'I noticed that…', 'A recount uses… to retell events because…'],
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
    ? (classStage <= 2 ? 'I noticed…' : classStage === 5 ? 'In my response I will use the technique of…' : 'I noticed the language technique of…')
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
               : isEnglish ? ('What action word (verb) best describes what this animal is doing right now?')
               : (S1_QUESTIONS[animalId] || 'What did you see?');
  const s1cues = isMaths   ? (mathsS1Cues[animalId] || ['What did you calculate?', 'Show your working.'])
               : isPdhpe   ? (pdhpeS1Cues[animalId] || ['Describe one thing you noticed', 'How does it connect to your own body?'])
               : isEnglish ? (['What is the animal doing?', 'Which word describes it best?'])
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
            {isPdhpe ? 'Concert Lawn' : 'Habitat Experience'}
          </h2>
          <p style={{ fontSize:'1rem', opacity:0.9, maxWidth:'520px', lineHeight:1.7, marginBottom:'1rem' }}>
            {isPdhpe
              ? 'Take off your shoes if it is safe to do so. Step onto the grass and notice how it makes you feel.'
              : 'Maths is not just numbers on a page. Mathematicians use observation, estimation and measurement to understand real places.'}
          </p>
          <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'14px', padding:'1rem 1.4rem', maxWidth:'480px', marginBottom:'1.5rem', textAlign:'left' }}>
            <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.4rem' }}>Take your shoes off if safe to do so.</p>
            <p style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.7rem' }}>⏱ Walk on the grass for 60 seconds.</p>
            <p style={{ fontSize:'0.82rem', opacity:0.85, marginBottom:'0.4rem', fontWeight:600 }}>
              {isPdhpe ? 'As you walk, notice:' : 'As you walk, think about:'}
            </p>
            {isPdhpe ? [
              'how the grass feels under your feet',
              'how your body feels in the open space',
              'how the fresh air and nature affect your mood',
              'how it feels to be active with others around you',
              'whether you feel more relaxed, energised or connected',
            ].map((pt, i) => (
              <p key={i} style={{ fontSize:'0.82rem', opacity:0.8, margin:'0.15rem 0', paddingLeft:'0.8rem' }}>– {pt}</p>
            )) : [
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
          <p style={{ fontSize:'1.1rem', opacity:0.9, maxWidth:'500px', lineHeight:1.7, marginBottom:'2rem' }}>
            {isPdhpe
              ? 'Stop. Look closely at the tiger. Think about what athletes could learn from this animal.'
              : 'Stop. Look closely. The zoo is full of hidden maths.'}
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
                {isPdhpe ? 'Observe now… what can sport learn from this animal?' : 'Observe now… find the hidden maths.'}
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
              {classStage >= 4 && <p style={{ fontSize:'0.82rem', color:'#aaa', marginBottom:'1rem', textAlign:'center', fontStyle:'italic' }}>{isMaths ? 'Show your full working and include units.' : isPdhpe ? 'Use PDHPE terminology and connect your observation to a body system or health concept.' : isEnglish ? 'Name the language technique you are using and explain its effect on the reader.' : 'Use specific evidence from your observation.'}</p>}
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
    </div>
  );
}
