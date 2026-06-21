// Returns { greeting, options, responses } for each screen context.
// stage: 1-5, subject: 'science'|'maths'|'english'|'pdhpe'

export function getGuideContent(screen, stage = 4, subject = 'science', animal = null) {
  switch (screen) {
    case 'quiz':              return quizContent(stage, subject);
    case 'observation':       return observationContent(stage, subject, animal);
    case 'mission-chimp':     return missionChimp(stage, subject);
    case 'mission-gorilla':   return missionGorilla(stage, subject);
    case 'gorilla-reading':   return gorillaReading(stage);
    case 'mission-lion':      return missionLion(stage, subject);
    case 'mission-tiger':     return missionTiger(stage, subject);
    case 'mission-giraffe':   return missionGiraffe(stage, subject);
    case 'mission-lemur':     return missionLemur(stage, subject);
    case 'mission-dingo':     return missionDingo(stage, subject);
    case 'dingo-reading':     return dingoReading(stage);
    case 'mission-sealion':   return missionSealion(stage, subject);
    case 'mission-bushwalk':  return missionBushwalk(stage, subject);
    case 'mission-buffalo':   return missionBuffalo(stage, subject);
    case 'mission-concertlawn': return missionConcertLawn(stage, subject);
    default:                  return mapContent();
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function byStage(map, stage) {
  return map[stage] ?? map[Math.max(...Object.keys(map).filter(k => k <= stage).map(Number))] ?? '';
}

function bySubject(map, subject) {
  return map[subject] ?? map.science ?? '';
}

function byStageSubject(map, stage, subject) {
  const s = stage <= 3 ? 'low' : subject;
  return map[s] ?? map.science ?? '';
}

const QUIZ_HELP = `Read each option carefully. Try to eliminate the ones that definitely don't fit, then choose the best answer from what's left!`;

const WRONG_HELP = `That's okay! After you answer, you'll see the correct answer and a fact explaining why. Mistakes are how we learn — your best guess is always worth trying!`;

function quizStuck(stage, subject) {
  if (stage <= 2) return `Think about what you just saw at the animal. What was it doing? Use that memory to help you pick the best answer!`;
  if (stage === 3) return `Re-read the question slowly. Look for key words like "most", "least", "because", or "best" — they tell you exactly what kind of answer to look for.`;
  const s4 = {
    science: `Think about how this animal survives. Does the answer connect to its habitat, diet, or an adaptation you've learned about?`,
    maths:   `Look at the numbers. What operation links what you know to what the question is asking for? Try writing it out.`,
    english: `Read each option again. Which one is most specific, or uses the language technique the question describes?`,
    pdhpe:   `Connect the question to what you know about the body. Which answer relates most directly to movement, health, or a body system?`,
  };
  const s5 = {
    science: `Think deeper — which answer explains not just WHAT happens, but WHY or HOW it works at a biological level?`,
    maths:   `Break it down: what given values do you have, what are you solving for, and which formula links them?`,
    english: `Consider the specific technique — which option demonstrates it in the most intentional and effective way?`,
    pdhpe:   `Apply physiological reasoning — which answer best demonstrates the body system concept in this context?`,
  };
  return stage >= 5 ? (s5[subject] ?? s5.science) : (s4[subject] ?? s4.science);
}

function quizHint(stage, subject) {
  if (stage <= 3) return `Cover the options and think of your own answer first. Then find the option that's closest to what you came up with!`;
  const map = {
    science: `Think about what you know about this animal's habitat or diet — does that help you narrow it down to one or two options?`,
    maths:   `Try working backwards — which answer makes mathematical sense with the numbers in the question?`,
    english: `Ask yourself: what specific writing feature is this question about? Focus on finding that feature in the options.`,
    pdhpe:   `Think about what you know about the human body or physical activity — which answer fits best with the health concept?`,
  };
  return bySubject(map, subject);
}

// ─── Standard Quiz ────────────────────────────────────────────────────────────

function quizContent(stage, subject) {
  return {
    greeting: `Need help with this question? Choose what you need below!`,
    options: [
      { label: 'What do I need to do?',    key: 'what'  },
      { label: "I'm stuck on this question", key: 'stuck' },
      { label: 'Give me a hint',           key: 'hint'  },
      { label: 'What if I get it wrong?',  key: 'wrong' },
    ],
    responses: {
      what:  QUIZ_HELP,
      stuck: quizStuck(stage, subject),
      hint:  quizHint(stage, subject),
      wrong: WRONG_HELP,
    },
  };
}

// ─── Observation / Writing ────────────────────────────────────────────────────

// Per-animal, per-subject specific hints for the observation writing task.
// Each entry has { what, start } — both telling the student about THIS specific task.
const ANIMAL_OBS_HINTS = {
  'chimpanzee': {
    science: {
      what:  `Write about chimpanzee group dynamics — describe the social interactions you saw, how they communicate (gestures, sounds, expressions), and the different group roles you noticed.`,
      start: `Start with "I observed that the chimpanzees were..." and describe one specific social behaviour you actually saw.`,
    },
    maths: {
      what:  `Write your percentage analysis — record your three behaviour percentages (resting, feeding, moving), show they add to 100%, and then convert each to hours per day.`,
      start: `Start with "I recorded that the chimpanzees spent ...% resting, ...% feeding, and ...% moving." then show your step-by-step calculation.`,
    },
    pdhpe: {
      what:  `Compare chimpanzee lifestyle habits to healthy human habits — describe one similarity, one difference from the chart, and one chimp habit you could adopt to improve your own health.`,
      start: `Start with "I noticed that chimpanzees..." and connect their lifestyle to a healthy habit for humans.`,
    },
    english: {
      what:  `Write a short creative story using the conflict from your behaviour graph — give your chimpanzee character a name, build the conflict from the data, and write a resolution.`,
      start: `Start with "Deep in the forest..." or "Once, a chimpanzee named..." and introduce the conflict straight away.`,
    },
  },
  'gorilla': {
    science: {
      what:  `Reflect on gorilla behaviour — describe body language and posture, how they move and interact, any facial expressions or sounds, and anything that reminded you of human behaviour.`,
      start: `Start with "The gorilla showed..." and pick the most human-like thing you noticed about its body language or behaviour.`,
    },
    maths: {
      what: {
        1: `Write the ratio of leaves to fruit using a colon (:). Name both foods you are comparing and write which one the gorilla eats more of.`,
        2: `Write how many times heavier the gorilla is than a student, then write the comparison as a ratio (student : gorilla). Show the division you used to find "how many times heavier".`,
        3: `Write your ratio in 3 steps: (1) write the ratio 12 : 6, (2) find the number that divides evenly into both, (3) write the simplified ratio. Show your working clearly.`,
        4: `Write your ratio in 3 steps: (1) write your estimated mass as a ratio to 200 kg, (2) find the highest common factor (the biggest number that divides evenly into both numbers), (3) divide both sides and write the simplified ratio. Show all working.`,
        5: `Write your 3-step working: Step 1 — add the ratio parts (5+4+2+1). Step 2 — divide 18 kg by the total parts to find what 1 part equals. Step 3 — multiply by 5 to find the kg of leaves. Show each calculation.`,
      },
      start: {
        1: `Start with "The gorilla eats ___ servings of leaves and ___ serving of fruit, so the ratio of leaves to fruit is __ : __."`,
        2: `Start with "A silverback weighs 200 kg and a student weighs 40 kg. 200 ÷ 40 = ___, so the gorilla is ___ times heavier. The ratio student : gorilla is __ : __."`,
        3: `Start with "Leaves : other food = 12 : 6. The number that divides evenly into both is ___. 12 ÷ ___ = ___ and 6 ÷ ___ = ___, so the simplified ratio is __ : __."`,
        4: `Start with "My estimated mass is ___ kg. Ratio: ___ : 200. The highest common factor is ___. Dividing both sides by ___ gives me __ : __."`,
        5: `Start with "Total ratio parts: 5 + 4 + 2 + 1 = ___. One part = 18 ÷ ___ = ___ kg. Leaves = ___ × 5 = ___ kg."`,
      },
    },
    pdhpe: {
      what:  `Write about nutrition and healthy eating — name two types of food the gorilla eats, link them to food groups, and explain why eating a variety of foods matters for health.`,
      start: `Start with "Gorillas eat..." and connect their plant-based diet to what the body needs to stay healthy.`,
    },
    english: {
      what:  `Finish the story about Kito and Jabari — use what you can observe RIGHT NOW in the enclosure to make your ending feel real. Look at their posture, movement, and who holds power.`,
      start: `Start with "Jabari turned slowly and..." or "The enclosure went quiet when..." and bring in something you can actually see happening right now.`,
    },
  },
  'lion': {
    science: {
      what:  `Write a conservation reflection — why do lions matter to the ecosystem, what role do they play in the food chain, and what threats do they face?`,
      start: `Start with "Lions are important to the ecosystem because..." then describe one thing we would lose if lions disappeared.`,
    },
    maths: {
      what:  `Write your territory and probability working — estimate the territory area using square roots, then calculate the probability of two successful hunts in a row as a fraction and as a decimal.`,
      start: `Start with "I estimated the territory area as approximately ..." then show your probability calculation step by step.`,
    },
    pdhpe: {
      what:  `Write about energy systems — explain the ATP-PC system used in short explosive bursts, how phosphocreatine is replenished during aerobic recovery, and connect this to the lion's rest-to-activity ratio.`,
      start: `Start with "The lion uses the ATP-PC system when..." and explain how its long rest periods link to energy system recovery.`,
    },
    english: {
      what:  `Write descriptive imagery about the lion — use language that appeals to the senses and include at least one unexpected comparison (not just "big" or "strong"). Think about what impression you want to create.`,
      start: `Start with "The lion's..." or "Like a ..., the lion..." and choose the single most striking visual detail you can see right now.`,
    },
  },
  'giraffe': {
    science: {
      what:  `Write about the giraffe's adaptations — describe specific physical features you can observe, explain how each feature helps the giraffe survive, and note what the giraffe is doing right now.`,
      start: `Start with "The giraffe's [feature] helps it to..." and name a specific physical feature — neck, tongue, legs, colouring — that you can actually see.`,
    },
    maths: {
      what: {
        1: `Write two comparisons about the giraffe's height. Use numbers — is it taller than the fence? About how many times taller than you? Include the unit (metres or cm) in your comparisons.`,
        2: `Write your arm-span estimate. How many arm spans did you count? What is your arm span in cm? Show the multiplication to get your total height estimate.`,
        3: `Write your ratio in 3 steps: (1) write your height and 550 cm as a ratio ( __ : 550 ), (2) find the number that divides evenly into both, (3) write the simplified ratio. Show all working.`,
        4: `Write the comparison: how many times longer is the giraffe's neck than yours? Show the division: 180 ÷ 15 = ___. Then write a sentence explaining what that number means.`,
        5: `Write your 3-part working: (1) total growth (540 − 180 = ___ cm), (2) average growth per year (___ ÷ 4 = ___ cm/year), (3) the fraction of adult height at birth (180/540) and simplify it. Show each calculation.`,
      },
      start: {
        1: `Start with "The giraffe is taller than the fence because..." then add one more comparison with a number: "It looks about ___ times taller than..."`,
        2: `Start with "My arm span is about ___ cm. I estimated the giraffe is about ___ arm spans tall, so ___ × ___ = ___ cm."`,
        3: `Start with "My height is ___ cm. Ratio: ___ : 550. The number that divides evenly into both is ___." Then show each division step.`,
        4: `Start with "The giraffe's neck is 180 cm and my neck is about 15 cm. 180 ÷ 15 = ___, so the giraffe's neck is ___ times longer than mine."`,
        5: `Start with "Total growth: 540 − 180 = ___ cm. Average per year: ___ ÷ 4 = ___ cm/year. Fraction at birth: 180/540 = ..." then show your simplification.`,
      },
    },
    pdhpe: {
      what:  `Write about the cardiovascular system — compare the giraffe's heart (11 kg, very high pressure) to a human heart in size, rate and function, and connect this to how exercise affects heart health.`,
      start: `Start with "The giraffe's heart is..." and compare at least one feature (size, rate, or pressure) to what you know about the human heart.`,
    },
    english: {
      what:  `Write a simile about the giraffe — use "like" or "as...as" to compare the giraffe's height or movement to something, then explain why you chose that comparison and what effect it creates.`,
      start: `Start with "The giraffe is as tall as..." or "Its neck stretches like..." and make sure the comparison is something the reader can clearly picture.`,
    },
  },
  'tiger': {
    science: {
      what:  `Write about the Silent Forest — describe the sounds you heard, any smells, what you could see around the tiger's habitat, and how the environment supports the tiger's survival.`,
      start: `Start with "At the tiger habitat, I could hear/smell..." and describe the most striking sensory experience from the environment.`,
    },
    maths: {
      what:  `Record your hidden maths observations — aim for at least 4 different categories: patterns (stripes, symmetry), shapes, numbers (count or estimate), distances, and comparisons. Use mathematical vocabulary.`,
      start: `Start with "Mathematical observations at the tiger habitat:" then list each one clearly — what you noticed and where you saw it.`,
    },
    pdhpe: {
      what:  `Connect the tiger's physical qualities to sporting performance — describe its power, speed, and patient stillness, and explain what athletes could learn from watching this animal.`,
      start: `Start with "From watching the tiger, an athlete could learn..." and describe one specific quality — explosive power, patience, or muscle use — and which sport it applies to.`,
    },
    english: {
      what:  `Write a loss piece about the Sumatran tiger — use your photo as evidence and include at least one technique from the passage (contrast, personification, or powerful word choice). Remember: fewer than 400 remain.`,
      start: `Start with "This tiger is..." or "What the world is losing is..." or "Fewer than 400..." and choose your most powerful opening line.`,
    },
  },
  'dingo': {
    science: {
      what:  `Write about the dingo's camouflage — describe the colour and texture of the fur, the colour of the surrounding environment, how well the dingo blends in, and how camouflage helps it survive.`,
      start: `Start with "The dingo's fur is..." and describe the colour and texture, then explain how that helps it stay hidden.`,
    },
    maths: {
      what:  `Write your territory and distance working — calculate the range (max − min) and mean of dingo territories, or calculate the daily travel distance per dingo. Show all working with units (km²).`,
      start: `Start with "The range of dingo territory is ...km² − ...km² = ..." or "If 6 dingoes share 420 km..." then show every calculation step.`,
    },
    pdhpe: {
      what:  `Connect the dingo's need for food to human performance — explain what your body needs before physical activity, why food quality and timing matters, and what happens without enough fuel.`,
      start: `Start with "Just like the dingo, my body needs..." and connect the dingo's diet to what fuels human movement.`,
    },
    english: {
      what:  `Write as Warrigal — take the dingo's perspective at the turning point and describe what he sees, hears, and feels in that moment. Use first person and show his decision.`,
      start: `Start with "I could run no further..." or "When I turned to face him..." and stay in Warrigal's first-person perspective throughout.`,
    },
  },
  'lemur': {
    science: {
      what:  `Write about how the lemurs use their enclosure — where they are (ground, trees, platforms), what they are doing there, how they move between spaces, and which needs (feeding, resting, social) are being met.`,
      start: `Start with "The lemurs are using the [ground/trees/platform] to..." and describe what specific need that area meets for them.`,
    },
    maths: {
      what: {
        1: `Count all the rings on the lemur's tail and write the total. A ring-tailed lemur usually has 25 rings.`,
        2: `Count the rings on one lemur's tail. Then multiply by 4 (the number of lemurs in the group) to find the total. Write: ___ × 4 = ___.`,
        3: `Count the rings on one lemur and use it as the average. Multiply by 6 to find the total for the group. Show your working: ___ × 6 = ___.`,
        4: `Count the rings on the lemur — this is the average per lemur. Multiply by 20 (the Taronga troop size) to find the total. Write the full multiplication with units.`,
        5: `Count the rings and calculate the total for 20 lemurs. Then explain whether sampling just 1 lemur gives a reliable average — what would make the estimate more accurate?`,
      },
      start: {
        1: `Start with "I counted ___ rings on the lemur's tail..."`,
        2: `Start with "I counted ___ rings on one lemur. Multiplied by 4 lemurs: ___ × 4 = ___"`,
        3: `Start with "I counted ___ rings. For 6 lemurs: ___ × 6 = ___ rings altogether"`,
        4: `Start with "I counted ___ rings per lemur. For 20 lemurs: ___ × 20 = ___ rings total"`,
        5: `Start with "I counted ___ rings on one lemur. For the whole troop of 20: ___ × 20 = ___. Sampling just 1 lemur..."`,
      },
    },
    pdhpe: {
      what:  `Compare lemur social bonds to human relationships — describe how the troop looks after each other, then explain how your own relationships with others affect your physical and mental health.`,
      start: `Start with "Just like lemurs, humans need..." and connect the idea of belonging and connection to a real health outcome.`,
    },
    english: {
      what:  `Write a creative story using your perspective from the game — blend what you can see NOW in the enclosure with the game moments (leaping, foraging, calling, resting). Choose first or third person and stay consistent.`,
      start: `Start with "I leapt into the branches and..." or "The lemur stretched its ringed tail and..." and make sure your opening sets the perspective clearly.`,
    },
  },
  'sea-lion': {
    science: {
      what:  `Write about humans and the ocean — describe what you can observe in the water and enclosure, any signs of human presence, how human activities may affect sea lion health, and what a healthy ocean looks like.`,
      start: `Start with "Humans affect sea lions by..." and give a specific example from what you observed in the enclosure.`,
    },
    maths: {
      what: {
        1: `Work out the total cost over 4 days. Write: daily cost × number of days = total. Show the number sentence.`,
        2: `Multiply kg per day by cost per kg to find the daily food cost. Write your number sentence and include units ($).`,
        3: `Two steps: (1) find the daily cost (4 kg × $8), then (2) multiply by 7 to find the weekly cost. Show both calculations clearly.`,
        4: `Use Interest = P × r × t. P = $500, r = 0.10 (10% as a decimal), t = 1 year. Multiply to find the interest, then add it to $500 to find the total. Show every step.`,
        5: `Three steps: (1) weekly cost at $6/kg, (2) weekly cost at $4/kg, (3) the weekly saving. Show every calculation with units.`,
      },
      start: {
        1: `Start with "The zoo spends $5 per day, so in 4 days: $5 × 4 = ___"`,
        2: `Start with "Fish costs $8 per kg. The sea lion eats 4 kg per day, so: 4 × $8 = ___"`,
        3: `Start with "Step 1: daily cost = 4 × $8 = $___. Step 2: weekly cost = $32 × 7 = $___"`,
        4: `Start with "Using Interest = P × r × t: $500 × 0.10 × 1 = $___. Total = $500 + $___ = $___"`,
        5: `Start with "At $6/kg: 8 × $6 × 7 = $___. At $4/kg: 8 × $4 × 7 = $___. Weekly saving: $___ − $___ = $___"`,
      },
    },
    pdhpe: {
      what:  `Persuade the Taronga directors to fund your enclosure design — use specific features from your design as evidence, include at least one persuasive technique, and think about what the directors care about (animal welfare and sustainability).`,
      start: `Start with "Dear Taronga Directors," and immediately name one specific feature from your design as your opening argument.`,
    },
    english: {
      what:  `Write a persuasive paragraph about sea lions — use at least two persuasive techniques (rhetorical question, emotive language, repetition, statistics), name them, and explain the effect each has on the audience.`,
      start: `Start with a rhetorical question like "Should we really allow sea lions to..." or an emotive opening that makes the reader feel the urgency of the issue.`,
    },
  },
  'asian-water-buffalo': {
    science: {
      what:  `Write about the helpful relationships near the buffalo — describe any other animals you can see nearby, how they interact with the buffalo, where they are positioned, and why this relationship may benefit one or both animals.`,
      start: `Start with "Near the buffalo, I noticed..." and describe what you saw, then explain what each animal might gain from the interaction.`,
    },
    maths: {
      what: {
        1: `Write YES or NO about whether your arm span could reach the horn span (200 cm), and include your estimated arm span in cm to back up your answer.`,
        2: `Write your estimate of the buffalo's length in metres and compare it to a car (4.5 m). Include numbers in your comparison — is it longer or shorter, and by how much?`,
        3: `Write your ratio in 3 steps: (1) estimate your arm span in cm and write the ratio arm span : 200, (2) find the number that divides evenly into both, (3) write the simplified ratio. Show all working.`,
        4: `Write your 2-step rate calculation: (1) speed = distance ÷ time = 60 ÷ 3 = ___ m/min, (2) distance in 5 minutes = speed × 5 = ___ m. Show both steps with units.`,
        5: `Write your 3-part answer: (1) the completed table (Years 0–3), (2) the rule for year y (hint: it starts at 10 and adds 5 each year), (3) the population after 6 years. Show your substitution.`,
      },
      start: {
        1: `Start with "My arm span is about ___ cm. The horn span is 200 cm, so I [could / could not] reach it because..."`,
        2: `Start with "I estimated the buffalo is about ___ m long. A car is 4.5 m, so the buffalo is ___ m [longer/shorter] than a car."`,
        3: `Start with "My arm span is ___ cm. Ratio: ___ : 200. The number that divides evenly into both is ___." Then show your simplified ratio.`,
        4: `Start with "Speed = 60 ÷ 3 = ___ m/min. In 5 minutes, the buffalo would walk ___ × 5 = ___ m."`,
        5: `Start with "Year 0 = 10, Year 1 = ___, Year 2 = ___, Year 3 = ___. Rule: animals = 10 + 5 × y. After 6 years: 10 + 5 × 6 = ___."`,
      },
    },
    pdhpe: {
      what:  `Write about hydration and health — connect the buffalo's need for water to your own body's hydration needs during physical activity, and describe the signs and effects of dehydration.`,
      start: `Start with "Just like the buffalo, my body needs water to..." and describe what happens to your body when you don't drink enough during exercise.`,
    },
    english: {
      what:  `Write an informative text about the buffalo's hooves — describe their structure (wide, cloven/split), explain their function (distribute weight, grip in mud), and connect to the buffalo's wetland habitat.`,
      start: `Start with "Buffalo hooves are..." and describe exactly what you can see, then explain what that structure does for the animal.`,
    },
  },
  'koala': {
    science: {
      what:  `Write about the koala's behaviour — describe what it is doing right now, explain why it behaves this way, how this helps it survive, and what adaptations you can observe.`,
      start: `Start with "The koala is..." and describe one specific behaviour, then explain why it makes sense for this animal's survival.`,
    },
    maths: {
      what:  `Write your financial maths and fractions working — show the fraction of the annual care cost covered by the fundraiser, calculate the year 5 conservation budget, or work out the percentage increase in care costs. Show all steps.`,
      start: `Start with "The annual care cost is $15,000. I calculated..." and show your working for each step clearly.`,
    },
    pdhpe: {
      what:  `Compare koala sleep needs (up to 22 hours) to human sleep recommendations, explain what sleep does for your body, and connect adequate sleep to a specific health outcome.`,
      start: `Start with "The koala sleeps up to 22 hours, while humans need..." and explain why this difference exists and what sleep does for each body.`,
    },
    english: {
      what:  `Write an informative text about the koala — start with a clear topic sentence, support it with at least two facts from the signs around you, and use precise factual language (third person, present tense).`,
      start: `Start with "Koalas are..." or "According to the sign,..." and make your topic sentence state clearly what your text is about.`,
    },
  },
  'concert-lawn': {
    science: {
      what:  `Describe the habitat experience at the Concert Lawn — write about how the ground felt (soft, cool, uneven), the temperature of the grass, how this environment differs from concrete, and what you noticed about being in a natural space.`,
      start: `Start with "The ground felt..." and describe the sensation, then compare it to what walking on a hard surface feels like.`,
    },
    maths: {
      what:  `Write your maths in the wild observations — include at least 3 categories: an estimate (e.g. lawn dimensions), a measurement (steps × 0.6 m), and a comparison (grass vs concrete). Use mathematical vocabulary.`,
      start: `Start with "I estimated..." then include your measurement calculation, and finish with a comparison using a mathematical word like "approximately" or "twice as".`,
    },
    pdhpe: {
      what:  `Describe how being active outdoors on the Concert Lawn made your body and mood feel — include one physical feeling and one emotional feeling, then connect this to a health benefit of outdoor activity.`,
      start: `Start with "Being on the lawn made me feel..." and describe both how your body felt and how your mood changed.`,
    },
    english: {
      what:  `Write from the perspective of the old tree at the Concert Lawn — use personification to give it a voice, choose two or three specific things it might have witnessed, and use your real observation of the tree to make the writing specific.`,
      start: `Start with "For a hundred years, I have stood here and watched..." or "The tree remembered the day when..." and use details from the actual tree you can see.`,
    },
  },
  'blue-mountains-bushwalk': {
    science: {
      what:  `Write about what you heard on the bushwalk — describe specific sounds (birds, wind, water, leaves), how loud or quiet the environment was, how the sounds made you feel, and how this compares to a built environment.`,
      start: `Start with "I heard..." and name specific sounds, then describe how they made you feel and how that differs from everyday city sounds.`,
    },
    maths: {
      what:  `Write your sound observation maths — record your tally for each sound category (birds, leaves, water, people, other), calculate the total, and express the most common sound as a fraction of the total. Simplify the fraction.`,
      start: `Start with "My tally results: birds: ..., leaves: ..., water: ..., people: ..., other: ..." then calculate the total and write your fraction.`,
    },
    pdhpe: {
      what:  `Reflect on how the world around you shapes your identity — use the bushwalk as your starting point, name two things from your world (family, culture, friends, experiences, place) that shape who you are, and connect this to your wellbeing.`,
      start: `Start with "The world around me shapes my identity by..." or "When I stood still and listened, I noticed..." and connect the experience to your own life.`,
    },
    english: {
      what:  `Write a first-person recount of what you heard and experienced on the bushwalk — use past tense, sensory language, and refer to the model text for technique. Aim to capture one specific moment (the waterfall, the lizard, or the lyrebird).`,
      start: `Start with "I heard..." or "The first thing I noticed was..." and use specific sounds and moments — not general descriptions like "it was nice".`,
    },
  },
};

function obsWhat(stage, subject, animal) {
  const hint = animal && ANIMAL_OBS_HINTS[animal]?.[subject];
  if (hint) {
    if (typeof hint.what === 'object') return byStage(hint.what, stage);
    if (stage <= 2) {
      const suffix = {
        science: ` Keep it simple — even a sentence or two about what you saw is great!`,
        maths:   ` Keep it simple — write a number or two that you noticed or counted.`,
        english: ` Keep it simple — use your own describing words to write about it.`,
        pdhpe:   ` Keep it simple — write one thing you noticed and what it made you think about.`,
      };
      return hint.what + (suffix[subject] ?? suffix.science);
    }
    return hint.what;
  }
  const low = {
    science: `Write what you saw! What did the animal look like and what was it doing? Any observation is a great one!`,
    maths:   `Write what you noticed using numbers where you can. What could you count or estimate about the animal?`,
    english: `Describe the animal using your senses. What did it look like? Sound like? How did it move? Use describing words!`,
    pdhpe:   `Write what you noticed about how the animal moves or uses its body. What stood out to you?`,
  };
  const mid = {
    science: `Write what you observed about the animal, then try to explain WHY it might behave that way. Use what you know about animals.`,
    maths:   `Write your observation using numbers. What could you measure, count, or estimate? Show your thinking!`,
    english: `Describe the animal using specific details, then write a sentence about what stood out to you most.`,
    pdhpe:   `Describe what you noticed about the animal's movement or body, then explain one way this connects to health or fitness.`,
  };
  const high = {
    science: `Write a detailed observation, then explain how it connects to a concept like adaptation, habitat, or survival behaviour.`,
    maths:   `Show your working! Write what you observed, your calculation, and what your result tells you.`,
    english: `Write a detailed description using a language technique, then explain what effect your word choice creates for the reader.`,
    pdhpe:   `Describe what you observed about the animal's body or movement, then connect it to a specific health or body system concept.`,
  };
  const adv = {
    science: `Write a precise scientific observation, then explain the mechanism or process behind it. Use correct terminology.`,
    maths:   `State your observation, show all working with correct notation, and write a conclusion about what the data means.`,
    english: `Write a sophisticated analysis identifying specific language features and explaining their effect on meaning with evidence.`,
    pdhpe:   `Write a detailed analysis connecting your observation to a body system, supported by physiological reasoning.`,
  };
  if (stage <= 2) return bySubject(low, subject);
  if (stage === 3) return bySubject(mid, subject);
  if (stage === 4) return bySubject(high, subject);
  return bySubject(adv, subject);
}

function obsStart(stage, subject, animal) {
  const hint = animal && ANIMAL_OBS_HINTS[animal]?.[subject];
  if (hint) return typeof hint.start === 'object' ? byStage(hint.start, stage) : hint.start;
  if (stage <= 2) return `Start with "I saw..." or "The animal was..." — just describe what you noticed first!`;
  if (stage === 3) return `Start with your main observation: "I observed that..." Then add one detail that surprised you.`;
  const s4 = {
    science: `Start with: "I observed..." then follow with "This is an example of..." or "This shows that..."`,
    maths:   `Start with your data: "I recorded..." then show your calculation and interpret the result.`,
    english: `Start with a strong description, then identify the technique: "The [feature] creates..." or "This example of [technique]..."`,
    pdhpe:   `Start with what you saw: "I noticed..." then connect it: "This relates to... because..."`,
  };
  if (stage === 4) return bySubject(s4, subject);
  return `Start with a clear topic sentence stating your main finding. Then support it with evidence and analysis.`;
}

function obsWords(subject) {
  const map = {
    science: `Try words like: adapt, habitat, behaviour, predator, prey, camouflage, species, ecosystem, diet, survival, nocturnal...`,
    maths:   `Try words like: estimate, approximately, ratio, percentage, proportion, calculate, represent, data, total, compare...`,
    english: `Try words like: imagery, simile, metaphor, personification, tone, contrast, suggests, creates, conveys, describes...`,
    pdhpe:   `Try words like: movement, coordination, muscle, cardiovascular, flexibility, strength, wellbeing, body system, physical activity...`,
  };
  return bySubject(map, subject);
}

function obsLength(stage) {
  return byStage({
    1: `Even 1–2 sentences is great! Just make sure you've described what you saw.`,
    2: `Aim for 2–3 sentences — what you saw, what it was doing, and one detail.`,
    3: `A short paragraph — about 3–4 sentences with an observation AND a reason.`,
    4: `A solid paragraph — observation, explanation, and connection to the topic. Quality beats length!`,
    5: `A well-structured paragraph or two with clear reasoning and evidence. Aim for depth, not just length.`,
  }, stage);
}

function observationContent(stage, subject, animal) {
  return {
    greeting: `Need help with your writing? I can give you some tips without giving the answer away!`,
    options: [
      { label: 'What do I need to write?', key: 'what'   },
      { label: 'How do I start?',          key: 'start'  },
      { label: 'What words can I use?',    key: 'words'  },
      { label: 'How long should it be?',   key: 'length' },
    ],
    responses: {
      what:   obsWhat(stage, subject, animal),
      start:  obsStart(stage, subject, animal),
      words:  obsWords(subject),
      length: obsLength(stage),
    },
  };
}

// ─── Missions ─────────────────────────────────────────────────────────────────

function missionBase(what, stuck, stage, subject) {
  return {
    greeting: `Need a hand with this activity? Let me help without giving it away!`,
    options: [
      { label: 'What do I need to do?',       key: 'what'     },
      { label: "I'm stuck on the activity",   key: 'stuck'    },
      { label: 'Help with the question',      key: 'question' },
      { label: 'What if I get it wrong?',     key: 'wrong'    },
    ],
    responses: {
      what,
      stuck,
      question: quizStuck(stage, subject),
      wrong:    WRONG_HELP,
    },
  };
}

function missionChimp(stage, subject) {
  const what = subject === 'english'
    ? `Use the sliders to build a behaviour graph! Watch the chimpanzees and set how much time they spend Resting, Feeding, and Moving — the three numbers must add up to 100. The behaviour with the LOWEST percentage becomes the conflict for your story!`
    : `Use the sliders to build a behaviour graph! Set how much time you think chimps spend Resting, Feeding, and Moving. The three numbers must add up to exactly 100 — watch the total as you drag!`;
  const stuck = subject === 'english'
    ? `If your total goes over 100, slide one number down before moving another up. Watch which behaviour you see LEAST — that's the one the chimp group is missing, and it becomes the problem in your story.`
    : `If your total goes over 100, slide one number down before moving another up. Watch the chimps — which behaviour are you seeing MOST? Give that one the highest percentage.`;
  const question = subject === 'english'
    ? `Look at YOUR OWN graph bars — the correct answer should match the behaviour with the LOWEST percentage on YOUR graph. Check which slider is smallest before you tap an answer.`
    : `Look at YOUR OWN graph bars — the correct answer should match the behaviour with the HIGHEST percentage on YOUR graph. Check which slider is tallest before you tap an answer.`;
  return {
    greeting: `Need a hand with this activity? Let me help without giving it away!`,
    options: [
      { label: 'What do I need to do?',       key: 'what'     },
      { label: "I'm stuck on the activity",   key: 'stuck'    },
      { label: 'Help with the question',      key: 'question' },
      { label: 'What if I get it wrong?',     key: 'wrong'    },
    ],
    responses: { what, stuck, question, wrong: WRONG_HELP },
  };
}

function missionGorilla(stage, subject) {
  const what = subject === 'maths'
    ? `It's a memory challenge! Study the Gorilla Whopper ingredients carefully — pay attention to the AMOUNTS (how many kg of each food type). Build the stack in the correct order, then answer a maths question about those food quantities.`
    : subject === 'pdhpe'
    ? `It's a memory challenge! Study the Gorilla Whopper ingredients carefully — think about the FOOD GROUPS you see (fruits, leaves, bamboo). Build the stack in the correct order, then answer a nutrition question about what gorillas eat and why.`
    : `It's a memory challenge! Study the Gorilla Whopper ingredients carefully, then build the stack in the correct order before time runs out. Tap each ingredient in the sequence you remembered.`;
  const stuck = `Focus on the top and bottom items first — they're easiest to anchor in your memory. Then work out the middle. Look for any clues in the ingredient names or sizes that hint at the order.`;
  const mathsQuestion = (() => {
    if (stage <= 1) return `The question asks you to add up servings of food. Count each type — leaves, bamboo, and fruit — then add them all together. What does 3 + 2 + 1 equal?`;
    if (stage === 2) return `You have three amounts to add: leaves, bamboo, and fruit (all in kg). Try adding the two smaller numbers first, then add the biggest. What's your total?`;
    if (stage === 3) return `This is a fractions question. A fraction compares a part to the whole. You know how many kg are leaves, and you know the total kg. Write it as a fraction: leaves ÷ total. Then simplify — what number divides evenly into both?`;
    if (stage === 4) return `This is a ratio question. A ratio compares two amounts using a colon (:). First work out how much food is NOT leaves (total minus leaves). Then write leaves : remaining. Simplify by finding the highest common factor (the biggest number that divides evenly into both numbers).`;
    return `This uses ratio with multiple parts. Step 1: add all the ratio numbers together to find the total parts. Step 2: divide 18 kg by that total to find what one part equals. Step 3: multiply by the leaves number in the ratio.`;
  })();
  const question = subject === 'maths'
    ? mathsQuestion
    : subject === 'pdhpe'
    ? `The question is about gorilla nutrition and food groups. Leaves and bamboo are plant-based (like vegetables) and fruit is a carbohydrate. Think about what nutrients these provide and how a plant-based diet supports the gorilla's energy needs.`
    : quizStuck(stage, subject);
  return {
    greeting: `Need a hand with this activity? Let me help without giving it away!`,
    options: [
      { label: 'What do I need to do?',       key: 'what'     },
      { label: "I'm stuck on the activity",   key: 'stuck'    },
      { label: 'Help with the question',      key: 'question' },
      { label: 'What if I get it wrong?',     key: 'wrong'    },
    ],
    responses: { what, stuck, question, wrong: WRONG_HELP },
  };
}

function missionLion(stage, subject) {
  const what = subject === 'english'
    ? `Zoom in on the lion using the camera buttons. Study what you can see at each zoom level — the specific details you notice (colour, texture, expression, shape) will help you answer the imagery question below your photo.`
    : subject === 'pdhpe'
    ? `Zoom in on the lion using the camera buttons. Watch how it moves — does it explode into action or stay still for long stretches? Then answer a question about which energy system the lion relies on most.`
    : `Use the zoom buttons to magnify your view of the lion, then use the magnification formula shown on screen. Hold your device steady for 5 seconds once you've zoomed in!`;
  const stuck = subject === 'english'
    ? `Look at your zoomed photo carefully. What is the single most striking visual detail — colour, texture, shape, or expression? Think about what that specific thing would feel like, smell like, or remind you of. The imagery question will focus on one particular feature.`
    : subject === 'pdhpe'
    ? `Watch the lion for a moment before answering. Is it mostly resting or does it move suddenly in short powerful bursts? Short explosive sprints = ATP-PC system. Long steady movement = aerobic system. The lion's rest-to-action ratio is the key clue.`
    : `Use the formula: Magnification = Image Size divided by Actual Size. Write down the two numbers from the question first, then divide. Which answer matches your result?`;
  return missionBase(what, stuck, stage, subject);
}

function missionTiger(stage, subject) {
  const what = subject === 'english'
    ? `Read the passage about the Sumatran tiger carefully — the question will ask about a specific language technique used in the text. Take your time with the whole passage before looking at the options.`
    : subject === 'pdhpe'
    ? `Take a photo of the tiger, then use the slider to estimate its length from nose to tail. Then watch HOW it moves — patience, stillness, explosive bursts. You'll answer a question about what athletes could learn from observing the tiger!`
    : subject === 'maths'
    ? `Take a photo of the tiger, then use the slider to estimate its length from nose to tail. After measuring, you'll answer a maths question that uses your estimate in a calculation — a comparison, a fraction, or a formula!`
    : `Take a photo of the tiger, then use the slider to estimate its length from nose to tail. Compare it to something familiar — a car is about 4 metres, a door is about 2 metres!`;
  const stuck = subject === 'english'
    ? `Re-read the passage looking for specific language techniques — similes, metaphors, vivid verbs, or contrast. The question will name a technique; look for where the passage uses it and what effect it has.`
    : subject === 'pdhpe'
    ? `A tiger's length is usually 2–3.5 m. But also study HOW it uses its body — does it wear itself out constantly or stay patient and burst into action? That contrast between stillness and explosive power (Type II fast-twitch fibres) is what the question is about.`
    : subject === 'maths'
    ? `Tigers are usually 2–3.5 m nose to tail. For the maths question: think about comparisons (how many of a smaller animal fit alongside the tiger?), or substitute your estimate into the formula or ratio shown.`
    : `Tigers are usually between 2 and 3.5 metres long. Think about how big you are (around 1.5 m) and imagine how many of you would fit nose-to-tail alongside the tiger.`;
  return missionBase(what, stuck, stage, subject);
}

function missionGiraffe(stage, subject) {
  const what = subject === 'english'
    ? `Take a photo of the giraffe — try to capture as much of its full height as possible. Look carefully at what you can see in the photo, then answer the simile question below it.`
    : subject === 'pdhpe'
    ? `Take a photo of the giraffe, then use the slider to estimate its height from hooves to horns. The giraffe's enormous height creates extreme cardiovascular demands — you'll answer a question about the cardiovascular system and how the giraffe's heart compares to a human's!`
    : `Take a photo of the giraffe, then slide the ruler to estimate its height from hooves to horns. Then you'll answer a ratio or measurement question using your estimate!`;
  const stuck = subject === 'english'
    ? `Study your photo carefully. What is the most striking feature — the height, the long neck, the colouring? Think about what that feature reminds you of, then choose the simile that best captures it.`
    : subject === 'pdhpe'
    ? `A giraffe's neck is about 1.8 m — imagine pumping blood that far up with every heartbeat! Its heart weighs about 11 kg and generates very high blood pressure. For the question: compare giraffe heart size, rate, and pressure to what you know about the human heart during exercise.`
    : `A giraffe's neck alone is about 1.8 metres — that's roughly your height! Total height is usually 4.5–6 metres. Use the ruler overlay to line up top to bottom, then use that measurement for the ratio calculation.`;
  const mathsQuestion = (() => {
    if (stage <= 1) return `This is a division question. You need to find how many 0.5 m fit into 4 m. Try: 4 ÷ 0.5. Hint: dividing by 0.5 is the same as multiplying by 2!`;
    if (stage === 2) return `Find the difference between your estimate and the actual height. Subtract the smaller from the bigger: 5.0 − 4.5 = ___. Which answer matches that gap?`;
    if (stage === 3) return `A fraction shows a part of a whole. The neck (2 m) is the part, and the total height (5 m) is the whole. Write it as neck ÷ total = 2/5. Does that fraction simplify?`;
    if (stage === 4) return `Write the ratio as neck : total height = 2.5 : 5.5. These are decimals — multiply both by 2 to get whole numbers first, then check if they simplify further.`;
    return `Divide the giraffe's height by the person's height: 5.5 ÷ 1.75. Try this step by step: how many times does 1.75 go into 5.5? Round your final answer to 1 decimal place.`;
  })();
  const question = subject === 'maths' ? mathsQuestion : quizStuck(stage, subject);
  return {
    greeting: `Need a hand with this activity? Let me help without giving it away!`,
    options: [
      { label: 'What do I need to do?',       key: 'what'     },
      { label: "I'm stuck on the activity",   key: 'stuck'    },
      { label: 'Help with the question',      key: 'question' },
      { label: 'What if I get it wrong?',     key: 'wrong'    },
    ],
    responses: { what, stuck, question, wrong: WRONG_HELP },
  };
}

function missionLemur(stage, subject) {
  if (subject === 'english') {
    return {
      greeting: `Need a hand with the lemur dance? Let me help!`,
      options: [
        { label: 'What do I need to do?',    key: 'what'  },
        { label: "I'm stuck on the game",    key: 'stuck' },
        { label: 'What are story moments?',  key: 'why'   },
        { label: 'What if I miss beats?',    key: 'wrong' },
      ],
      responses: {
        what:  `This is a rhythm game! When the beat pulses, tap a behaviour button — leaping, foraging, calling, resting, or sunbathing — to decide what your lemur does. The moments you collect become the raw material for your story on the next screen.`,
        stuck: `Watch for the beat indicator to pulse, then tap quickly. You don't need to tap every beat — just when you want your lemur to do something. Try choosing different behaviours for more variety in your story!`,
        why:   `After the game, you'll see your "story moments" — like "I leapt between branches" or "I searched for food". These become the key events in your first or third person lemur story on the writing screen.`,
        wrong: `There are no wrong answers in this game! Any combination works. More variety in your taps = more interesting story moments to write about. Just have fun with it!`,
      },
    };
  }
  const what = subject === 'pdhpe'
    ? `Watch the lemurs for 30 seconds and tap the behaviour buttons every time you see that behaviour happening. Count every single one! Then get ready for the rhythm game.`
    : `Watch the lemurs carefully and record what behaviours you observe using the tally buttons. Take note of which behaviours you see most and least.`;
  const stuck = subject === 'pdhpe'
    ? `Focus on one lemur at a time rather than all of them. What is it doing RIGHT NOW? Tap that button, then move to another lemur. Quick eyes help here!`
    : `If it's hard to tell what a lemur is doing, look at where it is and what's in its mouth or hands — that's usually a clue to whether it's feeding, resting, or moving.`;
  const mathsQuestion = `Look at each behaviour on your graph. For each one, compare your solid bar to the dashed real-world bar. Which pair of bars has the BIGGEST gap between them? That behaviour is your answer.`;
  const question = subject === 'maths' ? mathsQuestion : quizStuck(stage, subject);
  return {
    greeting: `Need a hand with this activity? Let me help without giving it away!`,
    options: [
      { label: 'What do I need to do?',       key: 'what'     },
      { label: "I'm stuck on the activity",   key: 'stuck'    },
      { label: 'Help with the question',      key: 'question' },
      { label: 'What if I get it wrong?',     key: 'wrong'    },
    ],
    responses: { what, stuck, question, wrong: WRONG_HELP },
  };
}

function missionDingo(stage, subject) {
  const what = subject === 'english'
    ? `After reading the story, you'll see the key events mixed up. TAP them in the order they happen in the story — from Warrigal stalking his prey all the way through to the final outcome. Look for what happens FIRST and LAST to anchor your sequence.`
    : `Tap the organisms in the correct food chain order — from what gets its energy from the sun, through the herbivore, the predator, all the way to the decomposer at the end. Think about who eats who!`;
  const stuck = subject === 'english'
    ? `Find the very first event (what was Warrigal doing at the start of the story?) and the very last one (how does the story end — what happens between Warrigal and the mundurra?). Tap those first and last, then fill in the middle using cause-and-effect order.`
    : subject === 'maths'
    ? `The order is: Sun (energy source) → Grass (makes food from sunlight) → Kangaroo (eats grass) → Dingo (eats kangaroo) → Decomposer (breaks down dead matter). The decomposer ALWAYS goes last — it's not eaten by anything in this chain.`
    : `Start with the Sun — it's not eaten, it's the energy SOURCE. Then: Grass uses that energy, Kangaroo eats grass, Dingo eats kangaroo. Don't forget the Decomposer goes last — it breaks dead matter back into soil!`;
  const question = subject === 'maths'
    ? `The maths question is about energy transfer in the food chain. At each step, the consumer gets roughly 1/10 of the energy from the level below. If grass starts with 1000 kJ: Kangaroo gets 1/10 = 100 kJ; Dingo gets 1/10 of that = 10 kJ.`
    : subject === 'pdhpe'
    ? `The question connects the dingo's need to hunt for food to YOUR body's energy needs. The dingo works hard physically for every meal. Think about which foods give YOU the best energy before physical activity — and why.`
    : quizStuck(stage, subject);
  return {
    greeting: `Need a hand with this activity? Let me help without giving it away!`,
    options: [
      { label: 'What do I need to do?',       key: 'what'     },
      { label: "I'm stuck on the activity",   key: 'stuck'    },
      { label: 'Help with the question',      key: 'question' },
      { label: 'What if I get it wrong?',     key: 'wrong'    },
    ],
    responses: { what, stuck, question, wrong: WRONG_HELP },
  };
}

function missionSealion(stage, subject) {
  const what = subject === 'english'
    ? `Design a sea lion enclosure — tap the USE button on each item to add it to your design, then stay within the $320 budget! At the end, you'll answer a question about WHY one of your chosen items is good for sea lion wellbeing. The correct reason always connects to what the animal actually NEEDS.`
    : `Design a sea lion enclosure by tapping USE on items to add them to the design. Each item goes into its zone automatically. Stay within the $320 budget shown at the top. Think about what sea lions need to be healthy AND happy!`;
  const stuck = subject === 'english'
    ? `If you're over budget, remove a lower-priority item. For the final question: ask yourself WHY each item matters to the sea lion specifically. The best justification connects to the animal's real needs (health, enrichment, safety), not how it looks or how cheap it is.`
    : `Each item snaps into its zone automatically when you tap USE — you can drag to reposition afterwards. If you're over budget, remove a lower-priority item. Ask yourself: what does the sea lion absolutely NEED versus what would just be nice to have?`;
  const mathsQuestion = (() => {
    if (stage <= 1) return `This is a multiplication question. The sea lion eats 8 kg every day. How many days? Try: 8 × 3 = ___. Which answer matches?`;
    if (stage === 2) return `This is a subtraction question. Take the smaller weight away from the bigger one: 250 − 100 = ___. Which answer matches?`;
    if (stage === 3) return `This is a rate question — multiply quantity × cost per kg: 7 kg × $8 = ___. Which answer matches?`;
    if (stage === 4) return `This is simple interest. Use: Interest = P × r × t. P = $1,000, r = 0.05 (that's 5% as a decimal), t = 2 years. Step 1: 1,000 × 0.05 = ___. Step 2: multiply by 2. Which answer matches?`;
    return `This is a cost comparison. Step 1: Supplier A daily cost: 10 × $6 = ___. Step 2: Supplier B daily cost: 10 × $4 = ___. Step 3: Find the saving — subtract the cheaper total from the more expensive one. Which answer matches?`;
  })();
  const question = subject === 'maths'
    ? mathsQuestion
    : subject === 'pdhpe'
    ? `The question is about sea lion wellbeing. Think about what the animal NEEDS — not just what looks nice. Consider space to swim, enrichment for mental health, and shelter. Which answer connects most directly to a real physical or psychological need?`
    : subject === 'english'
    ? `The question asks why a specific enclosure item supports sea lion wellbeing. Look for the answer that explains the REASON behind the choice — connecting the item to the animal's real needs (health, enrichment, safety), not just its appearance.`
    : quizStuck(stage, subject);
  return {
    greeting: `Need a hand with this activity? Let me help without giving it away!`,
    options: [
      { label: 'What do I need to do?',       key: 'what'     },
      { label: "I'm stuck on the activity",   key: 'stuck'    },
      { label: 'Help with the question',      key: 'question' },
      { label: 'What if I get it wrong?',     key: 'wrong'    },
    ],
    responses: { what, stuck, question, wrong: WRONG_HELP },
  };
}

function missionBushwalk(stage, subject) {
  const what = subject === 'english'
    ? `Solve three riddle clues to find hidden animals! Read each clue carefully and type the animal's name to unlock the next one. Spelling must be exact — use the hint button if you're unsure.`
    : subject === 'maths'
    ? `Solve three animal riddles! The first clue uses a cipher code — decode the letters using the key shown on screen. Clues 2 and 3 are maths riddles involving ratios and number patterns — read them carefully and think before selecting.`
    : `Solve three riddle clues to identify hidden animals! Read each clue carefully and select the correct answer. Look for specific details about the animal's habitat, sound, movement, or diet.`;
  const stuck = subject === 'english'
    ? `Read the clue again slowly. What does it describe — the animal's sound, colour, home, or what it eats? Focus on the most specific detail and think of animals that match.`
    : subject === 'maths'
    ? `For clue 1 (cipher): decode one letter at a time using the key on screen. For clue 2 (ratio): think about which number is a fraction or multiple of another. For clue 3 (pattern): what rule connects the sequence of numbers — add, multiply, or double?`
    : `Look for the most specific word in the clue. What environment does it describe? What sound does it make? What does it eat? Focus on that one detail and match it to an animal you know.`;
  return missionBase(what, stuck, stage, subject);
}

function missionBuffalo(stage, subject) {
  const what = `Tap the screen to make the buffalo swim upward — stop tapping and it sinks! Guide it through as many gates as you can without touching the walls. Find a steady tapping rhythm and watch ahead for the next gap.`;
  const stuck = `Don't overcorrect — a few gentle taps at a steady rhythm works better than rapid-fire tapping. Look one gate ahead, not just the current one. It gets easier once you find your rhythm!`;
  const mathsQuestion = (() => {
    if (stage <= 1) return `This is a subtraction question. You started with 100 gates total. How many did you NOT pass? Try: 100 − 7 = ___. Which answer matches?`;
    if (stage === 2) return `This is a multiplication question. You passed 10 gates and each earns 5 points. Try: 10 × 5 = ___. Which answer matches your total?`;
    if (stage === 3) return `This is a fractions question. You passed 25 out of 100 gates — write it as a fraction: 25/100. Now simplify: what number divides evenly into both 25 and 100?`;
    if (stage === 4) return `This is a division question. Your friend scored 56 points and each gate earns 4 points. Try: 56 ÷ 4 = ___ gates. Which answer matches?`;
    return `This question has two parts. Gates 1–10 earn 2 points each: 10 × 2 = ___. Gates 11–20 earn 5 points each: 10 × 5 = ___. Add both totals together for your final score.`;
  })();
  const question = subject === 'maths'
    ? mathsQuestion
    : subject === 'pdhpe'
    ? `The question is about hydration. Just like the buffalo rolls in water to cool down and keep going, YOUR body needs water during physical activity. Think about what happens to your heart rate, temperature, and performance when you don't drink enough.`
    : subject === 'english'
    ? `The question asks you to identify informative writing. Look for the sentence that uses third person, present tense, and factual language about buffalo hooves — no opinions, no storytelling, just clear factual explanation.`
    : `The question is about the buffalo's adaptation — focus on its wide, cloven hooves. Think about what "cloven" means (split in two) and how wide hooves help an animal that lives in muddy, wet environments where the ground is soft.`;
  return {
    greeting: `Need a hand with this activity? Let me help without giving it away!`,
    options: [
      { label: 'What do I need to do?',       key: 'what'     },
      { label: "I'm stuck on the activity",   key: 'stuck'    },
      { label: 'Help with the question',      key: 'question' },
      { label: 'What if I get it wrong?',     key: 'wrong'    },
    ],
    responses: { what, stuck, question, wrong: WRONG_HELP },
  };
}

function missionConcertLawn(stage, subject) {
  const what = subject === 'maths'
    ? byStage({
        1: `Complete the team activity on the Concert Lawn, then answer a maths question about its area! While you're there, try to estimate the length and width of the lawn.`,
        3: `Work as a team, then answer a maths question using the Concert Lawn's dimensions. Think about area = length × width while you're standing on it!`,
        4: `Complete the team challenge, then apply area or measurement maths to the Concert Lawn. You'll need to multiply the dimensions or divide the total area to answer the question.`,
        5: `Complete the teamwork challenge, then use the Concert Lawn's real dimensions (35 m × 22 m) in an area or capacity calculation. Think about how many people fit in the space!`,
      }, stage)
    : subject === 'pdhpe'
    ? byStage({
        1: `This is a team relay challenge! Work together and cheer each other on. After the challenge, you'll answer a question about what helped your team succeed.`,
        3: `Work as a team to complete the Human Knot or relay challenge. After, you'll answer a question about teamwork — what was most important: speed, communication, or listening?`,
        4: `Complete the team challenge, then reflect on what made your team most effective. The question is about teamwork and communication — the answer isn't about who's fastest or strongest.`,
        5: `This is a leadership and teamwork challenge. After completing it, you'll answer a question about what effective leadership looks like in a team — think about listening, adapting, and including everyone.`,
      }, stage)
    : subject === 'english'
    ? byStage({
        1: `After the team activity, find a tree near the Concert Lawn! Look at how big and old it is. You'll answer a question about which sentence gives the tree a human quality.`,
        3: `Complete the challenge, then find an old tree on the Concert Lawn. You'll answer a question about personification — which sentence makes the tree FEEL or THINK like a human? Look for the one that gives the tree a human emotion or action.`,
        4: `After the team challenge, you'll answer a personification question. The best answer gives the tree a human quality (watching, feeling, being patient) AND explains what effect that creates for the reader.`,
        5: `Complete the challenge, then you'll analyse the EFFECT of personification in nature writing. The question asks how personification positions the reader, not just what technique is named.`,
      }, stage)
    : byStage({
        1: `This is a team activity on the Concert Lawn! Work together, then answer a question comparing what you see here to what you'd see in the city across the water.`,
        3: `Work as a team to complete the challenge, then compare the Concert Lawn to the Sydney city environment. What do both share? What makes the lawn different from a concrete built environment?`,
        4: `Complete the team challenge, then answer a habitat question about the Concert Lawn versus the city. Think about what natural features (plants, soil, sunlight) allow the lawn to support more living things.`,
        5: `After the challenge, you'll answer a question about biodiversity in natural versus built environments. Think about how soil, plants, and natural features enable more species to survive than a concrete environment does.`,
      }, stage);
  const stuck = subject === 'maths'
    ? byStage({
        1: `Count your steps to estimate how long and wide the lawn is. Multiply length × width to find the area — your steps are roughly 60 cm each!`,
        3: `Write the formula first: Area = length × width. Substitute the two numbers from the question. For scale questions, multiply the map measurement by the scale factor.`,
        4: `Area = length × width. For capacity: divide total area by the space needed per person. Write out each step clearly before calculating.`,
        5: `Use 35 × 22 = 770 m². For capacity, divide 770 by the space needed per person (2.5 m²). Show each step — estimate first, then calculate exactly.`,
      }, stage)
    : subject === 'pdhpe'
    ? byStage({
        1: `Talk to your team about what to do first. Cheering each other on and making sure no one is left behind is the whole point of the challenge!`,
        3: `Stop and think about what's NOT working. Is everyone communicating? Try giving someone who hasn't spoken yet a clear role. The challenge is designed to need everyone.`,
        4: `Pause and regroup. For the question: think about the Human Knot specifically — what actually made it untangle? Force or patient communication and listening?`,
        5: `Think about what effective leadership really means: listening, communicating clearly, and adapting when things don't go to plan — making everyone feel included, not just the most skilled.`,
      }, stage)
    : subject === 'english'
    ? byStage({
        1: `Look at the tree. Which sentence makes it FEEL or DO something like a human? Look for verbs like "watched", "stretched", "sighed", or "welcomed".`,
        3: `Personification gives a non-human thing a human quality. Find the sentence where the tree THINKS, FEELS, or ACTS like a person — not just a description of what it looks like.`,
        4: `Read each option and ask: which one gives the tree a human quality AND creates an emotional effect in the reader? The best answer does both.`,
        5: `The best answer explains the EFFECT on the reader — how personification creates empathy by positioning us to experience the world from the tree's non-human perspective.`,
      }, stage)
    : byStage({
        1: `Look around you at the Concert Lawn. Does sunlight reach here? Can you see plants, grass, birds? Now imagine a city road. What does the lawn have that the road doesn't?`,
        3: `Think about what makes a space "natural" versus "human-built". The lawn has plants and soil — what do those allow to live here that wouldn't survive on concrete?`,
        4: `The question compares natural and built environments. Focus on what the lawn's natural features (plants, soil, open space) support that a city environment cannot.`,
        5: `Think about biodiversity: how do soil, plants, and habitat features create conditions for more living things to survive? What does a natural environment provide that concrete cannot?`,
      }, stage);
  return missionBase(what, stuck, stage, subject);
}

// ─── English reading screens ──────────────────────────────────────────────────

function gorillaReading(stage) {
  const stuck = byStage({
    1: `Re-read the story slowly and look for the sentence that most directly answers the question. The answer is right there in the text!`,
    2: `Find the key moment in the story — who is doing what, and where? Read just that part again carefully.`,
    3: `The answer might not be stated directly. What does Kito's action tell you about his feelings or intentions? Use the text as evidence.`,
    4: `Think about what the question is really asking — is it about WHAT happened, or WHY, or what it MEANS? Find evidence from the text to support the best option.`,
    5: `Consider the whole passage. What is the deeper tension? Which option captures the dynamic between power, risk, and social behaviour most precisely?`,
  }, stage);
  const hint = byStage({
    1: `Find the paragraph where the question happens. Read just that bit again — the answer should be right there.`,
    2: `Think about what actually happened in the story. Which option matches something you read? Eliminate the ones that didn't happen.`,
    3: `Re-read the paragraph where Kito or Jabari makes a decision. What does their choice show? Use that moment to pick the best answer.`,
    4: `Which option is most supported by evidence from the text? The best answer connects to something specific you read, not just something that sounds plausible.`,
    5: `Look at how the author frames the relationship between the two gorillas. Which option captures that framing most precisely — think subtext, not just surface events.`,
  }, stage);
  return {
    greeting: `Need help with the story? I can guide you without giving the answer away!`,
    options: [
      { label: 'What do I need to do?',     key: 'what'  },
      { label: "I'm stuck on the question", key: 'stuck' },
      { label: 'Give me a hint',            key: 'hint'  },
      { label: 'What if I get it wrong?',   key: 'wrong' },
    ],
    responses: {
      what:  `Read "The Big Serve" carefully — it's a story about Kito and Jabari, two gorillas competing over food. Then answer the comprehension question at the bottom. Read the whole story before you look at the options!`,
      stuck,
      hint,
      wrong: WRONG_HELP,
    },
  };
}

function dingoReading(stage) {
  const how = byStage({
    1: `Read the story all the way through. When you're done, you'll sort the events in order on the next screen. Just focus on understanding what happens!`,
    2: `Read each paragraph and ask yourself: "What happens here?" Look for words like "then" and "after" that show the order of events.`,
    3: `Read like a detective. Find the most important event in each paragraph. Think about what comes first, what causes what, and how the story ends.`,
    4: `Track how the relationship between Warrigal and the mundurra changes. Look for the turning point — the moment when everything shifts. That's the key event.`,
    5: `As you read, consider how the author builds tension. How does the power balance shift between the two characters? What does each paragraph add to the story's meaning?`,
  }, stage);
  return {
    greeting: `Need help with the Warrigal story? Here are some reading tips!`,
    options: [
      { label: 'What do I need to do?',       key: 'what' },
      { label: 'How should I read it?',        key: 'how'  },
      { label: 'Who are the characters?',      key: 'who'  },
      { label: "What's the story about?",      key: 'hint' },
    ],
    responses: {
      what: `Read the Warrigal Dreaming story carefully all the way to the end. On the next screen you'll put the key events in the order they happened — so pay attention to WHAT happens and WHEN as you read.`,
      how,
      who:  `Warrigal is an old dingo — tired and hungry but clever with words. The mundurra is an old Aboriginal hunter who is also hungry. They start as enemies, but something unexpected happens when they finally face each other.`,
      hint: `The story follows Warrigal on a hunt. Things go wrong when a hunter arrives and chases him. Watch for the turning point — the moment when Warrigal stops running and uses words instead of speed. That's what the whole story leads to.`,
    },
  };
}

// ─── Map screen (original content) ────────────────────────────────────────────

function mapContent() {
  return {
    greeting: `Hey there! I'm Dr. Cam, your Taronga Zoo guide. What do you need help with?`,
    options: [
      { label: 'Finding an animal',    key: 'navigate' },
      { label: 'What distance means',  key: 'distance' },
      { label: 'How to unlock',        key: 'unlock'   },
      { label: 'Getting a badge',      key: 'badge'    },
      { label: 'Where to start',       key: 'start'    },
    ],
    responses: {
      navigate: `See the yellow arrow on each animal card? It shows you which direction to walk! Follow the arrow and watch the distance number shrink.`,
      distance: `That number shows how many metres away the animal is. Keep walking and you'll see it get smaller and smaller!`,
      unlock:   `When you're close enough, the card will glow and say 'Tap to Discover.' Just give it a tap and you've found it!`,
      badge:    `Complete the activity at each animal — answer the quiz and write your observation — and you'll earn a badge!`,
      start:    `Look at the list — the closest animal is at the top! That's your first stop. Follow the yellow arrow and you're on your way!`,
    },
  };
}
