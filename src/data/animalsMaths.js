// Maths academic content for all 12 Taronga Tracka missions.
// MCQs are directly tied to each animal's mission activity.
// NSW Mathematics K–10 2022 curriculum, zoo activities as stimulus.

export const MATHS_ANIMALS = {

  // ── Chimpanzee ─────────────────────────────────────────────────────────────
  // Activity: Set Resting / Feeding / Moving percentage sliders (must total 100%)
  chimpanzee: {
    observationPrompt: 'Record the three percentages you set. Calculate how many hours per day chimps spend on each behaviour.',
    writingPromptByStage: {
      1: 'Write the percentage you set for each behaviour. Which was the highest?',
      2: 'Write the three percentages you set. Add them up to check they total 100%.',
      3: 'Write the three percentages as fractions. Calculate the fraction of time chimps are NOT resting. Show your working.',
      4: 'Use your percentage graph to calculate how many hours per day chimps spend on each behaviour (out of 24 hours). Show your working.',
      5: 'Convert each behaviour percentage to a fraction, decimal, and hours-per-day. Comment on what the mathematical distribution reveals about chimpanzee ecology.',
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
    observationPrompt: 'Look at the silverback. How does its size compare to yours? Write the ratio of your estimated mass to the silverback\'s mass (about 200 kg) in simplest form.',
    writingPromptByStage: {
      1: 'Count every gorilla you can see. Draw a picture and write the number next to each one.',
      2: 'Estimate how much bigger the silverback looks compared to yourself. Write a comparison using numbers (e.g. the silverback looks __ times bigger than me).',
      3: 'A silverback weighs about 200 kg. Estimate your own mass in kg. Write the ratio of your mass to the silverback\'s mass in simplest form. If you weigh 50 kg the ratio simplifies to 1:4 - show how, then calculate your own.',
      4: 'A silverback eats 18 kg of food per day and has a body mass of 200 kg. Write the ratio of daily food intake to body mass in simplest form. Show your working.',
      5: 'Wild gorilla population has declined from 400,000 in 1980 to approximately 316,000 now (about 44 years). Write the ratio of current to 1980 population in simplest form. Calculate the average annual decline in gorilla numbers.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['1:4'],
      4: ['9:100'],
      5: ['79:100', '1909'],
    },
    questions: [
      {
        q: 'Gorilla Diet Quantities',
        stageVariants: {
          1: 'A gorilla eats 3 servings of leaves, 2 of bamboo, and 1 of fruit. How many servings altogether?',
          2: 'A gorilla eats 6 kg of leaves, 8 kg of bamboo, and 4 kg of fruit per day. How much food total?',
          3: 'Leaves make up 12 kg of a gorilla\'s 18 kg daily diet. What fraction of the diet is leaves?',
          4: 'Leaves make up 12 kg of a gorilla\'s 18 kg daily diet. What is the ratio of leaves to the remaining food? Give your answer in simplest form.',
          5: 'Gorilla diet ratio - leaves:bamboo:fruit:termites = 5:4:2:1. If total daily food = 18 kg, how many kg of leaves?',
        },
        stageOptions: {
          1: ['4', '5', '6', '7'],
          2: ['14 kg', '16 kg', '18 kg', '20 kg'],
          3: ['1/3', '1/2', '2/3', '3/4'],
          4: ['1:1', '2:1', '3:1', '4:1'],
          5: ['5 kg', '6 kg', '7.5 kg', '9 kg'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 2 },
        stageFacts: {
          1: '3 + 2 + 1 = 6 servings. Adding all groups gives the total.',
          2: '6 + 8 + 4 = 18 kg. Gorillas can eat up to 18 kg of food per day!',
          3: '12 out of 18 kg = 12/18. Divide both by 6 to get 2/3.',
          4: 'Leaves : rest = 12 : (18 − 12) = 12 : 6. Divide both by 6 → 2 : 1. Gorillas eat twice as much leaf matter as everything else combined.',
          5: 'Total parts = 5+4+2+1 = 12. Each part = 18 ÷ 12 = 1.5 kg. Leaves = 5 × 1.5 = 7.5 kg.',
        },
        options: ['6', '18 kg', '2/3', '2:1'],
        correct: 2,
        fact: 'Gorillas eat up to 18 kg per day - mostly leaves and bamboo, with some fruit and protein from termites.',
      },
      {
        q: 'Gorilla Whopper Rush - Diet Maths',
        stageVariants: {
          1: 'A gorilla eats 3 servings of leaves, 2 of bamboo, and 1 of fruit. How many servings altogether?',
          2: 'A gorilla eats 6 kg of leaves, 8 kg of bamboo, and 4 kg of fruit per day. How much food total?',
          3: 'Leaves make up 12 kg of a gorilla\'s 18 kg daily diet. What fraction of the diet is leaves?',
          4: 'Leaves make up 12 kg of a gorilla\'s 18 kg daily diet. What is the ratio of leaves to the remaining food? Give your answer in simplest form.',
          5: 'Gorilla diet ratio - leaves:bamboo:fruit:termites = 5:4:2:1. Total 18 kg per day. How many kg of leaves?',
        },
        stageOptions: {
          1: ['4', '5', '6', '7'],
          2: ['14 kg', '16 kg', '18 kg', '20 kg'],
          3: ['1/3', '1/2', '2/3', '3/4'],
          4: ['1:1', '2:1', '3:1', '4:1'],
          5: ['5 kg', '6 kg', '7.5 kg', '9 kg'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 2 },
        stageFacts: {
          1: '3 + 2 + 1 = 6 servings. Adding all groups gives the total.',
          2: '6 + 8 + 4 = 18 kg total food per day.',
          3: '12 ÷ 18 = 2/3. Simplify 12/18 by dividing both by 6.',
          4: 'Leaves : rest = 12 : (18 − 12) = 12 : 6. Divide both by 6 → 2 : 1. Gorillas eat twice as much leaf matter as everything else combined.',
          5: 'Total parts = 12. Each part = 1.5 kg. Leaves = 5 × 1.5 = 7.5 kg.',
        },
        options: ['6', '18 kg', '2/3', '2:1'],
        correct: 2,
        fact: 'Gorillas eat up to 18 kg per day - mostly leaves and bamboo. Use ratios and fractions to understand their diet.',
      },
    ],
  },

  // ── Lion ───────────────────────────────────────────────────────────────────
  // Activity: Camera zoom selection (2× / 5× / 10× / 20×) - magnification
  lion: {
    observationPrompt: 'Count the lions and estimate the enclosure area. Compare it to a real lion territory of up to 260 km².',
    writingPromptByStage: {
      1: 'Count the lions you can see. Are there more big lions or small lions? Write the numbers you observe.',
      2: 'Look at the enclosure. Estimate its length and width. Calculate the approximate area in steps or metres. Write your calculation.',
      3: 'A lion\'s territory is up to 260 km². If the territory were a square, how long would each side be? Show your working. Compare this to your estimate of the enclosure.',
      4: 'If a lion pride hunts successfully 1 in 5 attempts, what is the probability of 2 consecutive successful hunts? Write as a fraction and a decimal. Show your working.',
      5: 'A lion pride hunts successfully 1 in 5 attempts (20%). Compare this to a human basketball free-throw average of approximately 75%. Calculate the ratio of these success rates and discuss what this mathematical comparison tells you about hunting strategies in nature.',
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
    observationPrompt: 'Stand near the fence and estimate the giraffe\'s height. Calculate the ratio of your height to the giraffe\'s (approx. 550 cm). Express as a simplified fraction.',
    writingPromptByStage: {
      1: 'Stand near the fence. Is the giraffe taller than the fence? Taller than a nearby tree? Write what you compare and your answers.',
      2: 'Use your arm span to estimate the height of the giraffe. Record your estimate and explain your method. How many arm spans high is the giraffe?',
      3: 'Write your own height in cm. Calculate the ratio of your height to the giraffe\'s (approximately 550 cm). Express as a simplified fraction. Show your working.',
      4: 'A giraffe\'s heart weighs 11 kg and pumps blood 3.7 m up to the brain. For a human, heart-to-brain is about 30 cm. Calculate how many times further the giraffe\'s heart must pump blood. Show all working.',
      5: 'At birth a giraffe is about 1.8 m tall. At adulthood (~4 years) it reaches approximately 5.5 m. Calculate the average annual growth rate in cm/year. Express total growth as a percentage of the birth height. Show all working.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: [],
      4: ['12.3', '12'],
      5: ['92.5', '92', '206', '205'],
    },
    questions: [
      {
        q: 'Giraffe Height Estimation',
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
      1: 'Watch the koala for 2 minutes. Is it moving or still? Record how long it stayed still using a clock drawing or time.',
      2: 'A koala eats 1 kg of leaves per day. If you have 7 kg of leaves, how many days would that feed one koala? Write your number sentence and answer.',
      3: 'It costs $15,000 a year to care for one koala at Taronga. A school fundraiser raised $4,500. Write this as a simplified fraction of the annual care cost. Show your working.',
      4: 'Taronga plans a 5-year koala conservation programme. Year 1 budget: $180,000. Each year the budget increases by $12,000. What is the total programme cost over all 5 years? Show your working.',
      5: 'In 2020, Taronga spent $12,000 per koala per year. By 2024 this had risen to $15,000. Calculate the overall percentage increase. Then predict the 2026 cost if the same flat dollar rise continues each year.',
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
        q: 'Tiger Measurement - Scale and Length',
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
          1: 'A dingo eats 2 kangaroos per week. How many kangaroos does it eat in 4 weeks?',
          2: '5 kangaroos each eat 10 kg of grass per day. How many kg of grass is needed for all 5 for 3 days?',
          3: 'Grass has 1000 kJ. Only 1/10 of the energy transfers to kangaroos. How much energy do kangaroos receive?',
          4: 'Grass has 1000 kJ. Kangaroos receive 1/10 of the grass energy. Dingoes receive 1/10 of the kangaroo energy. How much energy does the dingo receive?',
          5: 'Sun → Grass (10,000 kJ) → Kangaroo (1/10) → Dingo (1/10) → Decomposer (1/10). How much energy do decomposers receive?',
        },
        stageOptions: {
          1: ['4', '6', '8', '10'],
          2: ['50 kg', '100 kg', '150 kg', '200 kg'],
          3: ['10 kJ', '100 kJ', '500 kJ', '900 kJ'],
          4: ['1 kJ', '10 kJ', '100 kJ', '500 kJ'],
          5: ['0.1 kJ', '1 kJ', '10 kJ', '100 kJ'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 1, 4: 1, 5: 2 },
        stageFacts: {
          1: '2 kangaroos × 4 weeks = 8 kangaroos. Multiplication gives the total over time.',
          2: '5 × 10 kg × 3 days = 150 kg. Multiply per-animal, per-day, by number of days.',
          3: '1/10 of 1000 kJ = 1000 ÷ 10 = 100 kJ reaching the kangaroos.',
          4: 'Kangaroo: 1000 ÷ 10 = 100 kJ. Dingo: 100 ÷ 10 = 10 kJ. Only 1/100 of original energy reaches the dingo!',
          5: '10,000 ÷ 10 ÷ 10 ÷ 10 = 10 kJ. Each level keeps only 1/10 of energy - that is why food chains are short.',
        },
        options: ['8', '150 kg', '100 kJ', '10 kJ'],
        correct: 2,
        fact: 'Only 1/10 of energy passes to each level in a food chain. That is why predators like dingoes are rare compared to grass.',
      },
    ],
  },

  // ── Lemur ──────────────────────────────────────────────────────────────────
  // Activity: 30s behaviour tally (Feeding/Resting/Moving/Social) + Dance Party rhythm game
  lemur: {
    observationPrompt: 'Look at the lemur\'s tail. Count the black rings and white rings. Calculate the ratio of black to white rings.',
    writingPromptByStage: {
      1: 'Look at the lemur\'s tail. Count the black rings and the white rings. Record both numbers.',
      2: 'Count as many tail rings as you can see. Write: ___black + ___white = ___total. Is this close to the known total of 25 rings?',
      3: 'A ring-tailed lemur has 13 black rings and 12 white rings (25 total). Calculate the ratio of black rings to white rings. Is this ratio close to 1:1? Show your working.',
      4: 'If there are 20 lemurs in a troop and each has 25 tail rings, how many rings are there in total? What fraction of the total rings are black? Express as a simplified fraction and a ratio. Show all working.',
      5: 'If each tail ring is approximately 2.4 cm wide, calculate the total length of rings alone. The actual tail is about 60 cm - what accounts for the difference? Express the difference as a percentage of the actual tail length. Show all working.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['13:12'],
      4: ['500', '13/25'],
      5: ['60'],
    },
    questions: [
    {
      q: 'Reading Your Behaviour Tally - Statistics',
      stageVariants: {
        1: 'Your tally: Feeding = 4, Resting = 3, Moving = 2, Social = 1. Which behaviour happened the MOST?',
        2: 'Your tally: Feeding = 8, Resting = 2, Moving = 6, Social = 4. What is the range of your data?',
        3: 'Your tally: Feeding = 8, Resting = 2, Moving = 6, Social = 4 (total = 20). Express the Moving count as a simplified fraction of all observations.',
        4: 'Your tally results sorted from lowest to highest: 2, 4, 6, 8. What is the median of this data set?',
        5: 'Class feeding tally counts: 8, 6, 10, 4, 7, 9, 5, 7. Calculate the mean. What is the median of this data set?',
      },
      stageOptions: {
        1: ['Moving', 'Resting', 'Feeding', 'Social'],
        2: ['4', '5', '6', '10'],
        3: ['1/4', '3/10', '1/3', '2/5'],
        4: ['4', '5', '6', '7'],
        5: ['Mean = 6, Median = 7', 'Mean = 7, Median = 7', 'Mean = 7, Median = 6.5', 'Mean = 7.5, Median = 7'],
      },
      stageCorrect: { 1: 2, 2: 2, 3: 1, 4: 1, 5: 1 },
      stageFacts: {
        1: 'The mode is the most common value. Feeding had 4 taps - more than any other behaviour.',
        2: 'Range = highest − lowest = 8 − 2 = 6. The range tells you how spread out your data is.',
        3: '6 ÷ 20 = 3/10. Divide both by 2 to simplify. Moving made up 3/10 of all observations.',
        4: 'Median of 4 values: find the mean of the 2 middle values. (4 + 6) ÷ 2 = 5.',
        5: 'Mean = (8+6+10+4+7+9+5+7) ÷ 8 = 56 ÷ 8 = 7. Sorted: 4,5,6,7,7,8,9,10. Median = (7+7) ÷ 2 = 7.',
      },
      options: ['Feeding', '6', '3/10', '5'],
      correct: 2,
      fact: 'Statistics summarises data using mode (most common), range (spread), median (middle value), and mean (average). Use these to analyse your lemur behaviour tally.',
    },
  ],
  },

  // ── Sea Lion ───────────────────────────────────────────────────────────────
  // Activity: $320 budget design challenge (E/W/S scores)
  'sea-lion': {
    observationPrompt: 'Watch the sea lion. Compare its size to a person. Fish costs $8 per kg - explore the financial side of sea lion care.',
    writingPromptByStage: {
      1: 'Watch the sea lion. Is it bigger or smaller than a person? Write 3 things you could measure about a sea lion.',
      2: 'A male sea lion weighs 300 kg and a female weighs 85 kg. What is the difference? How many times heavier is the male? Write a number sentence.',
      3: 'If fish costs $8/kg and the zoo feeds a sea lion 8 kg per day, calculate the weekly and annual feeding cost. Show your working.',
      4: 'Taronga invests $5,000 in a sea lion conservation fund at 4% simple interest per year. How much interest is earned after 3 years? What is the total amount in the fund? Show all working.',
      5: 'Calculate the sexual dimorphism ratio for sea lions (male mass ÷ female mass = 300 ÷ 85). Compare to gorillas (270 ÷ 90) and lions (190 ÷ 120). Calculate each ratio to 2 decimal places. What pattern do you notice?',
    },
    expectedAnswers: {
      1: [],
      2: ['215'],
      3: ['448', '23296', '23,296'],
      4: ['600', '5600'],
      5: ['3.53', '1.58'],
    },
    questions: [
    {
      q: 'Sea Lion Care - Rates and Financial Maths',
      stageVariants: {
        1: 'A sea lion eats 8 kg of fish per day. How many kg does it eat in 3 days?',
        2: 'A male sea lion weighs 300 kg and a female weighs 85 kg. What is the difference in their mass?',
        3: 'Fish costs $8 per kg. A sea lion eats 8 kg per day. How much does it cost to feed the sea lion for one week?',
        4: 'Taronga invests $5,000 in a sea lion conservation fund at 4% simple interest per year. How much interest is earned after 3 years?',
        5: 'Supplier A sells herring at $7/kg; Supplier B sells sardines at $5/kg. The sea lion needs at least 10 kg/day of herring OR 12 kg/day of sardines to be healthy. Calculate the daily cost for each supplier. Which is cheaper and by how much per day?',
      },
      stageOptions: {
        1: ['16 kg', '18 kg', '24 kg', '32 kg'],
        2: ['185 kg', '205 kg', '215 kg', '225 kg'],
        3: ['$336', '$392', '$448', '$560'],
        4: ['$200', '$400', '$600', '$800'],
        5: ['Supplier A by $10/day', 'Supplier A by $14/day', 'Supplier B by $10/day', 'Supplier B by $14/day'],
      },
      stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
      stageFacts: {
        1: '8 kg × 3 days = 24 kg. Multiply the daily rate by the number of days.',
        2: '300 - 85 = 215 kg difference. Male sea lions can weigh almost 4 times more than females.',
        3: '8 kg × $8 = $64 per day. $64 × 7 days = $448 per week. Multiply rate × quantity × time.',
        4: 'Simple interest = P × r × t = $5,000 × 0.04 × 3 = $600. This is the earned interest on the conservation fund.',
        5: 'Supplier A: 10 × $7 = $70/day. Supplier B: 12 × $5 = $60/day. Supplier B is cheaper by $10/day.',
      },
      options: ['24 kg', '215 kg', '$448', '$600'],
      correct: 2,
      fact: 'Rates compare quantities over time or cost. Multiply rate × quantity × time to find totals. Sea lions eat about 8 kg of fish every day!',
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
    observationPrompt: 'Stretch your arms out wide. Could you reach from horn tip to horn tip (approx. 2 m)? Calculate the ratio of your arm span to the horn span.',
    writingPromptByStage: {
      1: 'Stretch your arms out as wide as you can. Do you think you could reach from horn tip to horn tip? Write YES or NO and explain with a number.',
      2: 'Look at the water buffalo. Estimate its length from nose to tail in metres. Compare to the length of a standard car (4.5 m). Write a comparison.',
      3: 'The buffalo\'s horn span is about 200 cm. Measure your arm span in cm. Calculate the ratio of your arm span to the horn span. What fraction of the horn span is your arm span? Show your working.',
      4: 'You observe the water buffalo walking along the fence. It takes 3 minutes to walk 90 metres. Write an equation to find the buffalo\'s speed s in metres per minute. Solve it. How far would it walk at this speed in 7 minutes? Show your working.',
      5: 'A ranger models two buffalo populations. Population P starts at 12 animals and grows by 4 per year. Population Q starts at 20 and grows by 2 per year. Write an equation for each and find the year y when P = Q. Show all working.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: [],
      4: ['30', '210'],
      5: ['4'],
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
          3: '25/100 simplifies to 1/4. Divide both by the HCF (25): 25 ÷ 25 = 1, 100 ÷ 25 = 4.',
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
