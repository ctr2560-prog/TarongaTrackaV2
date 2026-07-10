// Maths academic content for all 12 Taronga Tracka missions.
// MCQs are directly tied to each animal's mission activity.
// NSW Mathematics K–10 2022 curriculum, zoo activities as stimulus.

export const MATHS_ANIMALS = {

  // ── Chimpanzee ─────────────────────────────────────────────────────────────
  // Activity: Set Resting / Feeding / Moving percentage sliders (must total 100%)
  chimpanzee: {
    observationPrompt: 'Record the three percentages you set. Calculate how many hours per day chimps spend on each behaviour.',
    writingPromptByStage: {
      1: 'Which behaviour did you record the most? Write its name and percentage.',
      2: 'Write the percentage for your most-recorded behaviour. If there were 10 chimps, how many would be doing that behaviour? Write your number sentence.',
      3: 'Write the percentage for your most-recorded behaviour. Write it as a fraction out of 100, then simplify it. Show your working.',
      4: 'Use your most-recorded behaviour percentage to calculate how many hours per day chimps spend on that behaviour (out of 24 hours). Show your working.',
      5: 'Convert all three of your behaviour percentages to a fraction, a decimal, and hours per day (out of 24 hours). Show all working.',
    },
    expectedAnswers: {
      1: [],
      2: ['100'],
      3: [],
      4: ['24'],
      5: [],
    },
    questions: [
      {
        q: 'Reading Your Behaviour Graph',
        stageVariants: {
          1: 'Your graph shows Feeding: 40 out of 100. If there are 10 chimps, how many would be feeding?',
          2: 'Your graph shows chimps feed for 25% of a 10-hour active period. How many hours is that?',
          3: 'Your graph shows Resting: 40%, Feeding: 35%, Moving: 25%. What fraction of time is NOT resting?',
          4: 'Your graph shows chimps spend 37.5% of a 24-hour day foraging. How many hours is that?',
          5: 'Your graph shows Feeding: 35%, Moving: 25%, Resting: 40%. How many hours and minutes per 24-hour day is chimp active time (Feeding + Moving)?',
        },
        stageOptions: {
          1: ['2', '3', '4', '5'],
          2: ['1.5 hours', '2 hours', '2.5 hours', '3 hours'],
          3: ['1/4', '2/5', '3/5', '3/4'],
          4: ['7 hours', '8 hours', '9 hours', '10 hours'],
          5: ['12h 0min', '13h 12min', '14h 24min', '15h 36min'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: '40% means 40 out of every 100. Scaled to 10 chimps: 40/100 × 10 = 4 chimps feeding.',
          2: '25% of 10 hours = 0.25 × 10 = 2.5 hours feeding.',
          3: 'NOT resting = 35% + 25% = 60% = 3/5 of their time.',
          4: '37.5% of 24 h = 0.375 × 24 = 9 hours foraging each day.',
          5: 'Active = 35% + 25% = 60%. 60% × 24 = 14.4 h = 14 hours 24 minutes.',
        },
        options: ['2', '2.5 hours', '3/5', '9 hours'],
        correct: 2,
        fact: '60% of a chimp\'s day is spent on active behaviours - use Percentage × Total to find how many hours.',
      },
    ],
  },

  // ── Gorilla ────────────────────────────────────────────────────────────────
  // Activity: Gorilla Whopper Rush - stack Leaves / Bamboo / Fruit / Termites in order
  gorilla: {
    observationPrompt: 'Compare your size to the silverback. Estimate your mass in kg. Write the ratio of your mass to the gorilla\'s mass (about 200 kg). Simplify if you can.',
    writingPromptByStage: {
      1: 'The gorilla\'s stack has 3 servings of leaves, 2 of bamboo and 1 of fruit. How many servings altogether? Write your number sentence.',
      2: 'A gorilla eats 6 kg of leaves, 4 kg of bamboo and 2 kg of fruit each day. How much food altogether? Write your number sentence.',
      3: 'A gorilla eats 12 kg of food every day. How much does it eat in one week? Write your multiplication and answer.',
      4: 'A gorilla eats 6 kg of leaves each day. Leaves cost $2 per kg. Step 1: How many kg does it eat in a week? Step 2: What is the weekly cost? Show your working.',
      5: 'A gorilla eats 6 kg of leaves at $2 per kg and 4 kg of bamboo at $3 per kg each day. Step 1: Find the weekly cost of leaves. Step 2: Find the weekly cost of bamboo. Step 3: What is the total weekly food cost? Show all working.',
    },
    expectedAnswers: {
      1: ['3:1'],
      2: ['5', '1:5'],
      3: ['2:1'],
      4: ['1:4'],
      5: ['7.5', '7.5 kg'],
    },
    questions: [
      {
        q: 'Gorilla Diet Quantities',
        stageVariants: {
          1: 'A gorilla eats 3 servings of leaves, 2 of bamboo, and 1 of fruit. How many servings altogether?',
          2: 'A gorilla eats 6 kg of leaves, 8 kg of bamboo, and 4 kg of fruit per day. How much food total?',
          3: 'A gorilla eats 6 kg of leaves out of 12 kg of food. What fraction of its diet is leaves?',
          4: 'A gorilla eats 12 kg of leaves and 6 kg of other food each day. How many times more leaves does it eat than other food?',
          5: 'Leaves make up 12 kg of a gorilla\'s 18 kg daily diet. What is the ratio of leaves to the remaining food? Give your answer in simplest form.',
        },
        stageOptions: {
          1: ['4', '5', '6', '7'],
          2: ['14 kg', '16 kg', '18 kg', '20 kg'],
          3: ['1/4', '1/3', '1/2', '2/3'],
          4: ['2 times', '3 times', '4 times', '6 times'],
          5: ['1:1', '2:1', '3:1', '4:1'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 0, 5: 1 },
        stageFacts: {
          1: '3 + 2 + 1 = 6 servings. Adding all groups gives the total.',
          2: '6 + 8 + 4 = 18 kg. Gorillas can eat up to 18 kg of food per day!',
          3: '6 out of 12 kg = 6/12. Divide both by 6 to get 1/2 — leaves make up exactly half a gorilla\'s diet.',
          4: '12 ÷ 6 = 2. Gorillas eat twice as much leaf matter as everything else combined.',
          5: 'Leaves : rest = 12 : (18 − 12) = 12 : 6. Divide both by 6 → 2 : 1. Gorillas eat twice as much leaf matter as everything else combined.',
        },
        options: ['6', '18 kg', '2/3', '2:1'],
        correct: 2,
        fact: 'Gorillas eat up to 18 kg per day - mostly leaves and bamboo, with some fruit and protein from termites.',
      },
    ],
  },

  // ── Lion ───────────────────────────────────────────────────────────────────
  // Activity: Camera zoom selection (2× / 5× / 10× / 20×) - magnification
  lion: {
    observationPrompt: 'Count the lions and estimate the enclosure area. Compare it to a real lion territory of up to 260 km².',
    writingPromptByStage: {
      1: 'Count the lions in the enclosure. Write the number you counted.',
      2: 'Count the lions. Each lion eats 8 kg of meat per day. How much meat do all the lions eat in one day? Write your number sentence.',
      3: 'Count the lions. Each lion eats 8 kg of meat per day. How much does the whole pride eat in one week (7 days)? Show your working.',
      4: 'Count the lions. Each lion eats 8 kg of meat per day. Step 1: How much does the whole pride eat in one day? Step 2: How much in one month (30 days)? Show your working.',
      5: 'Count the lions. Each lion eats 8 kg of meat per day. A successful hunt provides 40 kg of meat. Step 1: How much meat does the whole pride need in one week? Step 2: How many successful hunts does the pride need each week to feed everyone? Show all working.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['16.1', '16'],
      4: ['1/25', '0.04'],
      5: [],
    },
    questions: [
      {
        q: 'Lion Micro Investigation',
        stageVariants: {
          1: 'What happens when you zoom in on the lion?',
          2: 'When you zoom in, what happens to the image?',
          3: 'The image is 10 mm. The real lion is 200 cm. Which is bigger?',
          4: 'Lion Micro Investigation',
          5: 'Use the zoom to find the smallest text on the sign. Work out which zoom level allows you to read it clearly.',
        },
        stageOptions: {
          1: ['A. It gets bigger', 'B. It gets smaller', 'C. It stays the same', 'D. It disappears'],
          2: ['A. It gets bigger', 'B. It gets smaller', 'C. It disappears', 'D. Nothing changes'],
          3: ['A. The image (10 mm)', 'B. The real lion (200 cm)', 'C. They are the same', 'D. Not sure'],
          4: ['A', 'B', 'C', 'D'],
          5: ['A', 'B', 'C', 'D'],
        },
        stageCorrect: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Zooming in makes the image appear larger - that\'s what magnification does.',
          2: 'When you zoom in, the image appears bigger on screen. This is magnification in action.',
          3: 'The real lion at 200 cm is far bigger than a 10 mm image. The photo is a tiny representation of the real animal.',
          4: 'The zoom feature lets you see fine details by making small things appear bigger.',
          5: 'Higher zoom levels magnify more - choose the one that makes the text readable.',
        },
        options: ['A. Bigger', 'B. Smaller', 'C. The same', 'D. Not sure'],
        correct: 1,
        fact: 'Lions are apex predators. The zoom lets you observe fine details - like fur texture and eye colour - from a safe distance.',
      },
    ],
  },

  // ── Giraffe ────────────────────────────────────────────────────────────────
  // Activity: Camera capture + slider 2.0–8.0 m (giraffe height estimation)
  giraffe: {
    observationPrompt: 'Stand near the giraffe and estimate its height. Write the ratio of your height to the giraffe\'s (about 550 cm). Try to simplify your ratio.',
    writingPromptByStage: {
      1: 'A giraffe is 550 cm tall. Write your height in cm. Is the giraffe taller or shorter than you?',
      2: 'A giraffe is 550 cm tall. You are about ___ cm tall. How much taller is the giraffe? Write your subtraction.',
      3: 'A giraffe is 550 cm tall. You are about ___ cm tall. How many times taller is the giraffe than you? Round to the nearest whole number. Show your working.',
      4: 'A giraffe\'s neck is 180 cm long. Your neck is about 15 cm long. How many times longer is the giraffe\'s neck than yours? Show your working.',
      5: 'A baby giraffe is 180 cm tall at birth. An adult is 550 cm. Step 1: How much does it grow in total? Step 2: If it reaches adult height in 4 years, what is the average growth per year? Show all working.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: [],
      4: ['12'],
      5: ['360', '90', '1/3'],
    },
    questions: [
      {
        q: 'Giraffe Height',
        stageVariants: {
          1: 'A giraffe is 4 m tall. How many half-metres (0.5 m) make up its full height?',
          2: 'Your slider showed 5.0 m. The actual giraffe is 4.5 m tall. By how many metres were you off?',
          3: 'A giraffe is 5 m tall. Its neck is 2 m. What fraction of the giraffe\'s height is its neck?',
          4: 'A giraffe is 5.5 m tall. Its neck is 2.5 m long. What is the ratio of neck length to total height in simplest form?',
          5: 'A giraffe stands 5.5 m tall. A person stands 1.75 m tall. How many times taller is the giraffe? Give your answer to 1 decimal place.',
        },
        stageOptions: {
          1: ['4', '6', '8', '10'],
          2: ['0.25 m', '0.5 m', '1.0 m', '1.5 m'],
          3: ['1/4', '1/3', '2/5', '1/2'],
          4: ['4:9', '5:11', '1:2', '2:5'],
          5: ['2.8 times', '3.0 times', '3.1 times', '3.2 times'],
        },
        stageCorrect: { 1: 2, 2: 1, 3: 2, 4: 1, 5: 2 },
        stageFacts: {
          1: '4 m ÷ 0.5 = 8 half-metres. Dividing by the unit size tells us how many fit in.',
          2: '|5.0 − 4.5| = 0.5 m error. The absolute difference is your estimation error.',
          3: '2 ÷ 5 = 2/5. The neck makes up 40% of the giraffe\'s total height.',
          4: 'Neck : Total = 2.5 : 5.5. Multiply both by 2 to get 5 : 11. The neck is just under half the giraffe\'s total height.',
          5: '5.5 ÷ 1.75 ≈ 3.14. Rounded to 1 decimal place = 3.1 times. Giraffes tower over humans!',
        },
        options: ['8', '0.5 m', '2/5', '5:11'],
        correct: 2,
        fact: 'Ratios compare two quantities. Neck : Total height = 5 : 11 - the neck makes up just under half of a giraffe\'s height.',
      },
    ],
  },

  // ── Koala ──────────────────────────────────────────────────────────────────
  // Activity: Standard quiz at the koala enclosure
  koala: {
    observationPrompt: 'Watch the koala. Is it moving or still? Taronga spends $15,000 per year caring for each koala - explore the financial maths of koala conservation.',
    writingPromptByStage: {
      1: 'Taronga spends $15,000 a year caring for each koala. Write that number. How many thousands is that?',
      2: 'Taronga spends $15,000 a year on each koala. How much does it cost to care for 2 koalas for one year? Write your number sentence.',
      3: 'Taronga spends $15,000 a year on each koala. How much does it cost to care for one koala over 3 years? Show your working.',
      4: 'Taronga has 5 koalas. Each costs $15,000 per year. Step 1: What is the total annual cost? Step 2: What is the total cost over 3 years? Show your working.',
      5: 'In 2020 it cost $12,000 per koala per year. By 2024 this had risen to $15,000. Step 1: How much more does it cost now? Step 2: Calculate the percentage increase. Show all working.',
    },
    expectedAnswers: {
      1: [],
      2: ['7'],
      3: ['3/10'],
      4: ['1020000', '1,020,000'],
      5: ['25', '16500', '16,500'],
    },
    questions: [
      {
        q: 'Koala Conservation - An Aussie Icon',
        stageVariants: {
          1: 'How many koalas were lost in the 2019/20 bushfires?',
          2: '10,000 koalas were lost in the fires. How many groups of 1,000 is that?',
          3: 'Find the "An Aussie Icon" sign at the koala enclosure. Use the number of koalas lost in 2019/20 from the sign. If there were 80,000 koalas before the fires, what percentage were lost?',
          4: 'Find the "An Aussie Icon" sign. Use the extinction year shown on the sign and a starting population of 80,000 koalas in 2020 to calculate the average annual loss.',
          5: 'Find the "An Aussie Icon" sign. Use the koalas lost and a starting population of 80,000 to calculate the annual percentage loss. If this rate repeats each year, how many koalas remain after 2 years?',
        },
        stageOptions: {
          1: ['100', '1,000', '100,000', '10,000'],
          2: ['1', '5', '100', '10'],
          3: ['2.5%', '5%', '20%', '12.5%'],
          4: ['About 1,300', 'About 2,000', 'About 5,000', 'About 2,700'],
          5: ['70,000', '64,000', '62,500', '61,250'],
        },
        stageCorrect: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
        stageFacts: {
          1: '10,000 koalas were lost in the 2019/20 fires - enough to fill a large sports stadium.',
          2: '10,000 ÷ 1,000 = 10 groups. Place value helps us understand how large numbers compare.',
          3: '10,000 ÷ 80,000 = 0.125 = 12.5%. Losing 1 in 8 koalas in a single season is catastrophic.',
          4: '80,000 ÷ 30 years ≈ 2,667 per year - more than 7 koalas lost every single day.',
          5: '80,000 × 0.875² = 61,250. Compound decline is faster than linear - nearly 19,000 are gone in just 2 years.',
        },
        options: ['100', '1,000', '100,000', '10,000'],
        correct: 3,
        fact: 'The 2019/20 bushfires saw an estimated loss of 10,000 koalas. At the current rate of decline, koalas could be extinct by 2050.',
      },
    ],
  },

  // ── Tiger ──────────────────────────────────────────────────────────────────
  // Activity: Camera capture + slider 1.0–4.0 m (tiger body length measurement)
  tiger: {
    observationPrompt: 'Stop. Look closely. What patterns, shapes, numbers, distances, movements or comparisons can you notice?',
    writingPromptByStage: {
      1: 'Look around the tiger habitat. What numbers, patterns or shapes can you spot? Write or draw at least 2 things you notice.',
      2: 'Look around carefully. Can you spot any patterns, shapes or numbers? What comparisons can you make? Write what you notice.',
      3: 'Stop. Look closely. What patterns, shapes, numbers, distances, movements or comparisons can you notice? Write at least 3 mathematical observations.',
      4: 'Stop. Look closely at everything around the tiger habitat. What patterns, shapes, numbers, distances, movements or comparisons can you notice? Describe each observation using mathematical vocabulary.',
      5: 'Stop. Look closely. What patterns, shapes, numbers, distances, movements or comparisons can you notice? List at least 5 distinct mathematical observations. Use precise mathematical vocabulary and include estimates or calculations where possible.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    },
    questions: [
      {
        q: 'Sumatran Tiger Length',
        stageVariants: {
          1: 'An adult tiger is between 2 and 3 metres long. Which measurement could be a Sumatran tiger\'s length?',
          2: 'A tiger is 2.5 m long. A dachshund is 50 cm long. How many dachshunds laid end-to-end equal the tiger?',
          3: 'A tiger is 2.4 m long. Its tail makes up 1/4 of its total length. How long is the body without the tail?',
          4: 'A tiger\'s body is 2.0 m and its tail is 0.8 m. Its body grows by 10 cm and its tail grows by 32 cm over 2 years. By how many cm did it grow altogether?',
          5: 'Tiger length model: L = 1.0 + 0.12n metres, where n = age in months (max 12). At 12 months, what is the tiger\'s estimated length?',
        },
        stageOptions: {
          1: ['0.5 m', '1.0 m', '1.5 m', '2.5 m'],
          2: ['2', '4', '5', '6'],
          3: ['0.6 m', '1.0 m', '1.8 m', '2.0 m'],
          4: ['32 cm', '38 cm', '42 cm', '48 cm'],
          5: ['1.44 m', '2.12 m', '2.44 m', '2.88 m'],
        },
        stageCorrect: { 1: 3, 2: 2, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: 'Adult Sumatran tigers are 2.2–2.5 m long. 2.5 m is within the correct range.',
          2: '250 cm ÷ 50 cm = 5 dachshunds laid end to end.',
          3: 'Tail = 1/4 × 2.4 = 0.6 m. Body = 2.4 − 0.6 = 1.8 m.',
          4: 'Total growth = 10 cm + 32 cm = 42 cm. Add the growth in each body section.',
          5: 'L = 1.0 + 0.12 × 12 = 1.0 + 1.44 = 2.44 m at 12 months of age.',
        },
        options: ['2.5 m', '5', '1.8 m', '42 cm'],
        correct: 2,
        fact: 'Sumatran tigers are 2.2–2.5 m long. Use scale and measurement skills to estimate animal sizes from a distance.',
      },
    ],
  },

  // ── Concert Lawn ───────────────────────────────────────────────────────────
  // Activity: Standard quiz at the Concert Lawn (area/measurement/pacing)
  'concert-lawn': {
    observationPrompt: 'What maths did you notice while walking on the Concert Lawn?',
    writingPromptByStage: {
      1: 'What maths did you notice while walking on the Concert Lawn? Write or draw 2 things - one about a number you noticed and one about how the ground felt.',
      2: 'What maths did you notice while walking on the Concert Lawn? Try to include a number, a comparison, and a description of the surface.',
      3: 'What maths did you notice while walking on the Concert Lawn? Try to include at least one estimate, one measurement, and one comparison. Show your thinking.',
      4: 'What maths did you notice while walking on the Concert Lawn? Include at least three of these: an estimate, a measurement, a comparison, a pattern, a number, a shape or surface description. Use mathematical vocabulary.',
      5: 'What maths did you notice while walking on the Concert Lawn? Include at least four of these: an estimate, a measurement, a comparison, a pattern, a number, a shape or surface description. Use precise mathematical language and justify your observations.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    },
    questions: [
      {
        q: 'Concert Lawn - Area and Measurement',
        stageVariants: {
          1: 'The Concert Lawn is 10 m long and 5 m wide. What is its area?',
          2: 'On the zoo map, 1 cm = 10 m. The Concert Lawn is 4 cm on the map. How long is it in real life?',
          3: 'The Concert Lawn is about 30 m × 20 m. What is its area in m²?',
          4: 'The Concert Lawn has an area of 600 m². You plant grass at 5 seeds per m². How many seeds are needed?',
          5: 'Concert Lawn: 35 m × 22 m. An event needs 2.5 m² per person. What is the maximum number of people?',
        },
        stageOptions: {
          1: ['25 m²', '30 m²', '50 m²', '75 m²'],
          2: ['4 m', '14 m', '40 m', '400 m'],
          3: ['300 m²', '500 m²', '600 m²', '900 m²'],
          4: ['1500', '2000', '2500', '3000'],
          5: ['280', '308', '350', '440'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 3, 5: 1 },
        stageFacts: {
          1: 'Area = length × width = 10 × 5 = 50 m².',
          2: '4 cm × 10 = 40 m. Multiply map length by the scale factor.',
          3: '30 × 20 = 600 m². Area = length × width.',
          4: '600 × 5 = 3000 seeds. Multiply area by the density.',
          5: 'Max people = Area ÷ Space per person = 770 ÷ 2.5 = 308.',
        },
        options: ['50 m²', '40 m', '600 m²', '3000'],
        correct: 2,
        fact: 'Area = length × width. Measuring the Concert Lawn with pacing is a real field-measurement technique.',
      },
    ],
  },

  // ── Dingo ──────────────────────────────────────────────────────────────────
  // Activity: Food Chain Builder - Sun → Grass → Kangaroo → Dingo → Decomposer
  dingo: {
    observationPrompt: 'Count the dingoes. Calculate how much territory they would need if each requires 10 km². Compare this to a real dingo territory of 10–70 km².',
    writingPromptByStage: {
      1: 'Count the dingoes in the enclosure. Are there more or fewer than 5? Write a number sentence about what you see.',
      2: 'If each dingo needs 10 km² of territory, how many dingoes could fit in a 70 km² territory? Draw an array to show your thinking.',
      3: 'Dingo territory ranges from 10–70 km². Calculate the range and mean territory size. Show your working.',
      4: 'A pack of 6 dingoes collectively covers 420 km in a week. Calculate the mean distance per dingo per day. What assumptions does this calculation require?',
      5: 'Compare the speed-to-body-mass ratio of a dingo (60 km/h, 15 kg) to a cheetah (110 km/h, 60 kg). Calculate a ratio of km/h per kg for each. Which animal is more efficient relative to its size? Justify using your calculations.',
    },
    expectedAnswers: {
      1: [],
      2: ['7'],
      3: ['60', '40'],
      4: ['10'],
      5: ['4', '1.83'],
    },
    questions: [
      {
        q: 'Dingo Food Chain - Energy Transfer',
        stageVariants: {
          1: 'A dingo catches 4 rabbits on Monday and 3 on Tuesday. How many rabbits did it catch altogether?',
          2: 'A pack of 5 dingoes each catches 4 rabbits. How many rabbits did the pack catch altogether?',
          3: 'A pack of 5 dingoes hunts for 3 days. Each dingo catches 4 rabbits per day. How many rabbits altogether?',
          4: 'A kangaroo has 1000 kJ of energy. Dingoes receive 1/10 of this. How much energy does the dingo get?',
          5: 'Grass has 1000 kJ. Kangaroos receive 1/10 of the grass energy. Dingoes receive 1/10 of the kangaroo energy. How much energy does the dingo receive?',
        },
        stageOptions: {
          1: ['5', '6', '7', '8'],
          2: ['10', '15', '20', '25'],
          3: ['40', '50', '60', '70'],
          4: ['10 kJ', '50 kJ', '100 kJ', '500 kJ'],
          5: ['1 kJ', '10 kJ', '100 kJ', '500 kJ'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 1 },
        stageFacts: {
          1: '4 + 3 = 7 rabbits. Dingoes are opportunistic hunters — they eat whatever they can catch.',
          2: '5 × 4 = 20 rabbits. A dingo pack hunts cooperatively to catch more prey.',
          3: '5 × 4 × 3 = 60 rabbits. Multiply dingoes × daily catch × number of days.',
          4: '1000 ÷ 10 = 100 kJ. Only 1/10 of energy transfers between levels in a food chain.',
          5: 'Kangaroo: 1000 ÷ 10 = 100 kJ. Dingo: 100 ÷ 10 = 10 kJ. Only 1/100 of original energy reaches the dingo!',
        },
        options: ['7', '20', '60', '100 kJ'],
        correct: 2,
        fact: 'Only 1/10 of energy passes to each level in a food chain. That is why predators like dingoes are rare compared to grass.',
      },
    ],
  },

  // ── Lemur ──────────────────────────────────────────────────────────────────
  // Activity: 30s behaviour tally (Feeding/Resting/Moving/Social) + Dance Party rhythm game
  lemur: {
    observationPrompt: 'Count the rings on the lemur\'s tail. If this is the average number of rings, how many rings would the whole group have altogether?',
    writingPromptByStage: {
      1: 'Count the rings on one lemur\'s tail. Write the number.',
      2: 'Count the rings on one lemur\'s tail. There are 4 lemurs in the group. How many rings do they have altogether? Write your number sentence.',
      3: 'Count the rings on one lemur\'s tail. There are 4 lemurs here and 6 at another exhibit. How many rings altogether? Show your working.',
      4: 'Count the rings on one lemur\'s tail. There are 20 lemurs at Taronga. How many rings in total? Show your multiplication.',
      5: 'Count the rings on one lemur\'s tail. Taronga has 20 lemurs. Step 1: How many rings in total? Step 2: A baby lemur has half the usual number of rings — how does that change the total if one adult is replaced by the baby? Show all working.',
    },
    expectedAnswers: {
      1: ['25', '24', '26'],
      2: ['100', '25'],
      3: ['150', '25'],
      4: ['500', '25'],
      5: ['500', '25'],
    },
    questions: [
    {
      q: 'Comparing Your Graph to Real-World Data',
      stageVariants: {
        1: 'Look at your graph. Which behaviour shows the BIGGEST difference between your solid observation bar and the dashed real-world bar?',
        2: 'Look at your graph. Which behaviour shows the BIGGEST difference between your solid observation bar and the dashed real-world bar?',
        3: 'Look at your graph. Which behaviour shows the BIGGEST difference between your solid observation bar and the dashed real-world bar?',
        4: 'Look at your graph. Which behaviour shows the BIGGEST difference between your solid observation bar and the dashed real-world bar?',
        5: 'Look at your graph. Which behaviour shows the BIGGEST difference between your solid observation bar and the dashed real-world bar?',
      },
      stageOptions: {
        1: ['Feeding', 'Resting', 'Moving', 'Social'],
        2: ['Feeding', 'Resting', 'Moving', 'Social'],
        3: ['Feeding', 'Resting', 'Moving', 'Social'],
        4: ['Feeding', 'Resting', 'Moving', 'Social'],
        5: ['Feeding', 'Resting', 'Moving', 'Social'],
      },
      stageCorrect: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      stageFacts: {
        1: 'Great analysis! A big gap between your bar and the dashed bar means that behaviour was more or less common than usual when you observed.',
        2: 'When your observation bar is much taller or shorter than the dashed bar, it shows your lemurs were behaving differently from the typical pattern at that moment.',
        3: 'Scientists compare field observations to known data to check whether their sample is representative. A big difference is worth investigating — what might have caused it?',
        4: 'A large gap between observed and expected data can mean the sample was influenced by external factors — time of day, weather, nearby visitors, or just chance.',
        5: 'In data science, the difference between observed and expected values is called the deviation. Large deviations raise a research question: why did this behaviour differ so much?',
      },
      options: ['Feeding', 'Resting', 'Moving', 'Social'],
      correct: 0,
      fact: 'Comparing your observation to real-world data is the heart of field science. A big difference is interesting — it means something unusual was happening when you observed!',
    },
  ],
  },

  // ── Sea Lion ───────────────────────────────────────────────────────────────
  // Activity: $320 budget design challenge (E/W/S scores)
  'sea-lion': {
    observationPrompt: 'Watch the sea lion. Fish costs $8 per kg — work out the cost of feeding a sea lion.',
    writingPromptByStage: {
      1: 'The zoo spends $5 each day on fish for the sea lion. How much do they spend in 4 days? Write your number sentence.',
      2: 'Fish costs $8 per kg. The sea lion eats 4 kg per day. How much does 1 day of food cost? Write a number sentence.',
      3: 'Fish costs $8 per kg. The sea lion eats 4 kg per day. Step 1: How much does 1 day cost? Step 2: How much does 1 week (7 days) cost? Show your working.',
      4: 'A male sea lion weighs 250 kg and a female weighs 100 kg. How much do 3 males and 2 females weigh altogether? Show your working.',
      5: 'A male sea lion weighs 250 kg and a female weighs 100 kg. The zoo has 2 males and 4 females. Each animal eats 5% of its body weight in fish per day. How much fish is needed for all sea lions in one day? Show all working.',
    },
    expectedAnswers: {
      1: ['20'],
      2: ['32'],
      3: ['32', '224'],
      4: ['50', '550'],
      5: ['336', '224', '112'],
    },
    questions: [
    {
      q: 'Sea Lion Care - Rates and Financial Maths',
      stageVariants: {
        1: 'A sea lion eats 8 kg of fish per day. How many kg does it eat in 3 days?',
        2: 'A male sea lion weighs 250 kg and a female weighs 100 kg. What is the difference in their mass?',
        3: 'Fish costs $8 per kg. A sea lion eats 7 kg of fish in one day. How much does 1 day\'s food cost?',
        4: 'Fish costs $8 per kg. A sea lion eats 4 kg per day. How much does 3 days of food cost?',
        5: 'Fish costs $6 per kg. A sea lion eats 5 kg per day. How much does one week of food cost?',
      },
      stageHints: {
        1: ['The sea lion eats 8 kg every single day.', 'Multiply: daily amount × number of days → 8 × 3 = ___'],
        2: ['Difference means subtract the smaller number from the bigger one.', 'Try: 250 − 100 = ___'],
        3: ['Rate questions: multiply quantity × cost per unit.', 'Try: 7 kg × $8 = ___'],
        4: ['Step 1: Find the daily cost → 4 kg × $8 = ___', 'Step 2: Multiply by 3 days → daily cost × 3 = ___'],
        5: ['Step 1: Find the daily cost → 5 kg × $6 = ___', 'Step 2: Multiply by 7 days → daily cost × 7 = ___'],
      },
      stageOptions: {
        1: ['16 kg', '18 kg', '24 kg', '32 kg'],
        2: ['100 kg', '125 kg', '150 kg', '175 kg'],
        3: ['$48', '$52', '$56', '$64'],
        4: ['$72', '$84', '$96', '$108'],
        5: ['$180', '$200', '$210', '$240'],
      },
      stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
      stageFacts: {
        1: '8 kg × 3 days = 24 kg. Multiply the daily rate by the number of days.',
        2: '250 − 100 = 150 kg. Male sea lions can weigh more than twice as much as females.',
        3: '7 kg × $8 = $56. Multiply the quantity by the rate to find the total cost.',
        4: '4 kg × $8 = $32 per day. $32 × 3 days = $96. Multiply the daily cost by the number of days.',
        5: '5 kg × $6 = $30 per day. $30 × 7 days = $210. Multiply the daily cost by the number of days in a week.',
      },
      options: ['24 kg', '150 kg', '$56', '$100'],
      correct: 2,
      fact: 'Rates compare quantities over time or cost. Multiply rate × quantity to find totals. Sea lions eat about 8 kg of fish every day!',
    },
  ],
  },

  // ── Blue Mountains Bushwalk ────────────────────────────────────────────────
  // Activity: 3 riddle clues - Clue 1: Platypus, Clue 2: Lizard, Clue 3: Lyrebird
  // BushwalkMission uses questions[0], questions[1], questions[2] for the 3 clues
  'blue-mountains-bushwalk': {
    observationPrompt: 'Close your eyes and listen for 30 seconds. Tally the sounds you hear. Which sound did you hear the most, and how do you know?',
    writingPromptByStage: {
      1: 'Which sound did you hear the most? Write the sound and how many times you counted it.',
      2: 'Write your tally for each type of sound. Which had the most? Write a number sentence to compare two of them.',
      3: 'Write your tally for each sound category and the total. Which sound was most common? Compare two categories using > or < and explain using your numbers.',
      4: 'Write your tally counts and total. Write the most common sound as a fraction of the total. Simplify if possible. What does this fraction tell you about the environment?',
      5: 'Write your tally and total. Express each category as a percentage. Identify the modal sound type and justify using your data. Calculate the ratio of the most to the least common sound.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    },
    questions: [
      // questions[0] - Clue 1: Platypus cipher (WATERFALL)
      {
        q: 'What animal lives where the code leads?',
        options: ['Platypus', 'Echidna', 'Koala', 'Lyrebird'],
        correct: 0,
        fact: '23–1–20–5–18–6–1–12–12 → W–A–T–E–R–F–A–L–L → WATERFALL. Platypuses are monotremes - the only egg-laying mammals!',
      },
      // questions[1] - Clue 2: Lizard (4:1 scale)
      {
        q: 'What animal is it?',
        options: ['Turtle', 'Frog', 'Snake', 'Lizard'],
        correct: 3,
        fact: 'A 4:1 scale means the display is 4 times larger than the real animal. Lizards are cold-blooded reptiles - they bask in the sun to warm up.',
      },
      // questions[2] - Clue 3: Lyrebird (sequence puzzle - maths only)
      {
        q: 'What bird did you find?',
        options: ['Kookaburra', 'Magpie', 'Lyrebird', 'Cockatoo'],
        correct: 2,
        fact: '20 + (4 × 5) = 20 + 20 = 40 sounds. Lyrebirds can mimic over 20 different sounds - including chainsaws and cameras!',
      },
    ],
  },

  // ── Asian Water Buffalo ────────────────────────────────────────────────────
  // Activity: River Run flappy bird game (score = gates passed, max 100)
  'asian-water-buffalo': {
    observationPrompt: 'Stretch your arms out wide. Could you reach from horn tip to horn tip (approx. 2 m)? Write the ratio of your arm span to the horn span and simplify it.',
    writingPromptByStage: {
      1: 'Stretch your arms out as wide as you can. Do you think you could reach from horn tip to horn tip (200 cm)? Write YES or NO and explain with a number.',
      2: 'Look at the water buffalo. Estimate its length from nose to tail in metres. Is it longer or shorter than a car (4.5 m)? Write a comparison and include numbers.',
      3: 'The buffalo\'s horn span is about 200 cm. Estimate your arm span in cm. Step 1: Write the ratio arm span : 200. Step 2: Find the number that divides evenly into both. Step 3: Write the simplified ratio. Show your working.',
      4: 'The buffalo walks 60 metres in 3 minutes. Step 1: Find its speed in metres per minute (distance ÷ time). Step 2: Use your answer to calculate how far it would walk in 5 minutes. Show your working.',
      5: 'A buffalo herd starts with 10 animals and grows by 5 each year. Step 1: Complete the table — Year 0 = 10, Year 1 = ___, Year 2 = ___, Year 3 = ___. Step 2: Write a rule for the number of animals after y years. Step 3: Use your rule to find the population after 6 years.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: [],
      4: ['20', '100'],
      5: ['40'],
    },
    questions: [
      {
        q: 'River Run Score - Fractions and Operations',
        stageVariants: {
          1: 'You passed 7 out of 100 gates. How many gates did you NOT pass?',
          2: 'You passed 10 gates and each earns 5 points. What is your total score?',
          3: 'You passed 25 gates out of 100. Express the number of gates passed as a simplified fraction.',
          4: 'Your friend scored 56 points. Each gate earns 4 points. How many gates did your friend pass?',
          5: 'You passed 20 gates. Gates 1–10 earned 2 points each; gates 11–20 earned 5 points each. What is your total score?',
        },
        stageOptions: {
          1: ['7', '27', '63', '93'],
          2: ['40', '50', '55', '60'],
          3: ['1/5', '1/4', '3/10', '2/5'],
          4: ['10', '12', '14', '16'],
          5: ['60', '65', '70', '75'],
        },
        stageCorrect: { 1: 3, 2: 1, 3: 1, 4: 2, 5: 2 },
        stageFacts: {
          1: '100 − 7 = 93 gates missed. Subtraction tells us what remains.',
          2: '10 × 5 = 50 points. Multiplying gives the total score.',
          3: '25/100 simplifies to 1/4. Divide both by the highest common factor (the biggest number that divides evenly into both) — which is 25: 25 ÷ 25 = 1, 100 ÷ 25 = 4.',
          4: 'Gates = Score ÷ Points per gate = 56 ÷ 4 = 14 gates.',
          5: 'Gates 1–10: 10 × 2 = 20. Gates 11–20: 10 × 5 = 50. Total = 70 points.',
        },
        options: ['93', '50', '1/4', '14'],
        correct: 2,
        fact: 'Fractions describe part of a total. 25 out of 100 = 1/4. Use fractions and operations to analyse your River Run score.',
      },
    ],
  },

};
