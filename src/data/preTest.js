// preTest.js — the five concept questions a Tracka Trek class answers before they start.
//
// ⚠️⚠️ NO ANIMALS IN HERE, DELIBERATELY. Cameron's brief: "think like normal school vibes with
//    no animal relation". The point is to measure what a student already knows about the
//    CONCEPT, so that the same concept met at an enclosure an hour later has something to be
//    compared against. An animal in the stem turns the baseline into a reading comprehension
//    question about an animal they have not seen yet.
//
// ⚠️ These are deliberately HARDER than the questions the animals ask. A pre-test that
//    everybody passes measures nothing. Expect a low score on the day and do not "fix" it by
//    softening these — the in-app questions are the ones pitched to be answerable at the
//    enclosure, and the gap between the two is the thing worth reading.
//
// ⚠️ Every set mirrors the concepts its subject already tests at an enclosure:
//      science  — adaptation, survival behaviour, food chains, classification, fair testing
//      maths    — percentage of a quantity, fraction/decimal/percentage, ratio, graphs, average
//      pdhpe    — macronutrients, components of fitness, energy systems, training
//      english  — conflict, figurative language, inference, structure
//    🚫 Do not add a question about something the excursion never touches. There would be
//       nothing to compare it to, and it would cost a student one of only five answers.
//
// ⚠️ `correct` is an index into `options`. The spread across 0-3 is kept roughly even on
//    purpose — see the note in zoosnoozAnimals.js. A set where the answer is usually third
//    teaches the shape of the test instead of the subject.

export const PRE_TEST = {

  // ── Science ────────────────────────────────────────────────────────────────────────────
  science: {
    2: [
      { concept: 'adaptation', q: "A desert animal that only comes out at night is using which kind of adaptation?",
        options: ["a structural adaptation", "a food chain", "a life cycle stage", "a behavioural adaptation"], correct: 3 },
      { concept: 'food chains', q: "In a food chain, the arrow points...",
        options: ["from the eater to its food", "from the food to the thing that eats it", "from the biggest to the smallest", "from the animals to the plants"], correct: 1 },
      { concept: 'classification', q: "Which group has a backbone, feathers, and lays eggs?",
        options: ["Reptiles", "Birds", "Mammals", "Amphibians"], correct: 1 },
      { concept: 'behaviour', q: "An animal most active at dawn and dusk is called...",
        options: ["nocturnal", "diurnal", "hibernating", "crepuscular"], correct: 3 },
      { concept: 'data', q: "Two bars on a graph are exactly the same height. That means...",
        options: ["both were counted the same number of times", "they are the same animal", "the graph has been drawn wrongly", "one is twice the other"], correct: 0 },
    ],
    3: [
      { concept: 'adaptation', q: "Thick fur in a cold place is a structural adaptation. Which of these is a BEHAVIOURAL one?",
        options: ["Having large ears", "Having sharp claws", "Having a long tail", "Resting in shade at midday"], correct: 3 },
      { concept: 'food chains', q: "If every plant in a food chain died, which animals would be affected FIRST?",
        options: ["The top predators", "The decomposers", "The herbivores", "All of them at the same time"], correct: 2 },
      { concept: 'survival', q: "Two animals in one habitat need the same food. This is an example of...",
        options: ["camouflage", "hibernation", "migration", "competition"], correct: 3 },
      { concept: 'fair testing', q: "In a fair test, the things you deliberately keep the same are called the...",
        options: ["results", "controlled variables", "independent variable", "method"], correct: 1 },
      { concept: 'classification', q: "Two animals look almost identical but cannot breed together. They are...",
        options: ["the same species", "a male and a female", "the same animal at different ages", "different species"], correct: 3 },
    ],
    4: [
      { concept: 'adaptation', q: "Which pair are BOTH behavioural adaptations?",
        options: ["Migrating and hunting at dusk", "Thick fur and sharp teeth", "Webbed feet and gills", "Camouflage and long legs"], correct: 0 },
      { concept: 'energy flow', q: "A food chain rarely has more than four or five levels. The best explanation is that...",
        options: ["too little energy is left to support another level", "predators would grow too large to feed themselves", "there are not enough different species on Earth", "the sun does not provide enough light energy"], correct: 0 },
      { concept: 'survival', q: "A species' population falls sharply after a new predator arrives. The most likely cause is...",
        options: ["increased competition for shelter", "a longer breeding season", "a change in classification", "higher predation reducing survival"], correct: 3 },
      { concept: 'fair testing', q: "In an experiment, the variable you MEASURE is the...",
        options: ["independent variable", "dependent variable", "controlled variable", "hypothesis"], correct: 1 },
      { concept: 'data', q: "One result sits far away from the pattern of all the others. It should be...",
        options: ["deleted from the data", "averaged with the rest", "treated as the real answer", "investigated and reported"], correct: 3 },
    ],
    5: [
      { concept: 'natural selection', q: "Natural selection cannot work on a population with no variation, because...",
        options: ["no individual has an advantage to pass on", "the population is too small", "mutations cannot happen", "the environment never changes"], correct: 0 },
      { concept: 'energy flow', q: "About 10% of energy passes between levels. Of 10 000 kJ at the plants, roughly how much reaches the third level?",
        options: ["10 kJ", "100 kJ", "1 000 kJ", "3 300 kJ"], correct: 1 },
      { concept: 'ecosystems', q: "Which is an ABIOTIC factor?",
        options: ["Competition for food", "Soil temperature", "A population of insects", "Bacteria in the soil"], correct: 1 },
      { concept: 'fair testing', q: "A test that actually measures what it set out to measure is described as...",
        options: ["valid", "reliable", "accurate", "repeatable"], correct: 0 },
      { concept: 'data', q: "Two variables rise together across a data set. This shows...",
        options: ["that one of them must be causing the other", "nothing that can be used in a conclusion", "that the experiment has not been done fairly", "a correlation, which is not the same as cause"], correct: 3 },
    ],
  },

  // ── Mathematics ────────────────────────────────────────────────────────────────────────
  maths: {
    2: [
      { concept: 'fractions', q: "What is one third of 24?",
        options: ["6", "8", "9", "12"], correct: 1 },
      { concept: 'graphs', q: "On a picture graph one symbol stands for 4 animals. How many animals do 6 and a half symbols show?",
        options: ["24", "26", "28", "30"], correct: 1 },
      { concept: 'fractions', q: "Which fraction is the largest?",
        options: ["1/2", "2/5", "3/8", "1/3"], correct: 0 },
      { concept: 'time', q: "How many minutes are there in three quarters of an hour?",
        options: ["30", "35", "45", "50"], correct: 2 },
      { concept: 'number', q: "A group of 36 is split equally into 4 teams. How many in each team?",
        options: ["6", "8", "9", "12"], correct: 2 },
    ],
    3: [
      { concept: 'percentage', q: "What is 15% of 80?",
        options: ["8", "12", "15", "20"], correct: 1 },
      { concept: 'equivalence', q: "Which decimal is the same as 3/8?",
        options: ["0.325", "0.375", "0.38", "0.83"], correct: 1 },
      { concept: 'graphs', q: "One column is three times the height of another. The value it shows is...",
        options: ["three more", "three times as many", "a third as many", "three per cent more"], correct: 1 },
      { concept: 'average', q: "The mean of 5, 7 and one more number is 8. What is the missing number?",
        options: ["8", "10", "12", "14"], correct: 2 },
      { concept: 'ratio', q: "A mix uses 2 cups of oats for every 1 cup of seeds. For 9 cups of oats you need...",
        options: ["3 cups of seeds", "4 cups of seeds", "4.5 cups of seeds", "6 cups of seeds"], correct: 2 },
    ],
    4: [
      { concept: 'percentage', q: "What is 37.5% of 24?",
        options: ["7.5", "8", "9", "9.6"], correct: 2 },
      { concept: 'equivalence', q: "Which set shows the SAME value three ways?",
        options: ["0.4, 4%, 2/5", "0.4, 40%, 2/5", "0.04, 40%, 1/4", "4.0, 40%, 4/5"], correct: 1 },
      { concept: 'ratio', q: "A day of 24 hours is 12 hours resting and 4 hours moving. The ratio of moving to the WHOLE day is...",
        options: ["1 : 3", "1 : 4", "1 : 6", "1 : 12"], correct: 2 },
      { concept: 'average', q: "Four results are 10, 10, 10 and 50. Which is TRUE?",
        options: ["The mean and median are both 20", "The mean is 50", "The mean is 10 and the median is 20", "The mean is 20 and the median is 10"], correct: 3 },
      { concept: 'rate', q: "An animal walks 150 m in 5 minutes. At that rate, how long to walk 420 m?",
        options: ["12 minutes", "14 minutes", "15 minutes", "16 minutes"], correct: 1 },
    ],
    5: [
      { concept: 'percentage change', q: "A population falls from 80 to 60. What is the percentage decrease?",
        options: ["20%", "25%", "30%", "33%"], correct: 1 },
      { concept: 'reverse percentage', q: "After a 20% increase a count is 96. What was it before?",
        options: ["76", "76.8", "80", "86"], correct: 2 },
      { concept: 'ratio', q: "24 hours are shared in the ratio 5 : 3 between resting and moving. Resting is...",
        options: ["12 hours", "13 hours", "15 hours", "16 hours"], correct: 2 },
      { concept: 'average', q: "Adding one very large value to a data set affects the...",
        options: ["mean much more than the median", "median much more than the mean", "mean and median equally", "neither"], correct: 0 },
      { concept: 'graphs', q: "Which average is LEAST affected by one very large value?",
        options: ["The mean", "The median", "The range", "They are affected equally"], correct: 1 },
    ],
  },

  // ── PDHPE ──────────────────────────────────────────────────────────────────────────────
  pdhpe: {
    2: [
      { concept: 'nutrition', q: "Which food gives the longest lasting energy?",
        options: ["A sports drink", "White sugar", "A lolly", "Wholegrain bread"], correct: 3 },
      { concept: 'fitness', q: "Why do we warm up before exercise?",
        options: ["To cool the muscles down before moving", "To use up our energy before we start", "To make our muscles feel tired first", "To get the body ready and avoid injury"], correct: 3 },
      { concept: 'body systems', q: "Your breathing rate rises during exercise mainly to...",
        options: ["get more oxygen to the muscles", "cool the body down", "use up more food", "slow the heart down"], correct: 0 },
      { concept: 'fitness', q: "Which activity needs the most FLEXIBILITY?",
        options: ["Sprinting", "Jogging", "Stretching to reach your toes", "Lifting a heavy box"], correct: 2 },
      { concept: 'wellbeing', q: "How much sleep does a primary-aged child need each night?",
        options: ["About 4 hours", "About 6 hours", "About 9 to 11 hours", "About 14 hours"], correct: 2 },
    ],
    3: [
      { concept: 'nutrition', q: "Which macronutrient gives the most energy per gram?",
        options: ["Carbohydrate", "Protein", "Fibre", "Fat"], correct: 3 },
      { concept: 'fitness', q: "Being able to keep going for a long time is...",
        options: ["endurance", "flexibility", "power", "muscular strength"], correct: 0 },
      { concept: 'nutrition', q: "Protein is mostly used by the body to...",
        options: ["build and repair muscle", "store fat", "keep you warm", "give instant energy"], correct: 0 },
      { concept: 'energy systems', q: "A 400 m run leaves the legs burning. That burning is linked to...",
        options: ["the lactic acid system", "the ATP-PC system", "the aerobic system", "using stored fat"], correct: 0 },
      { concept: 'wellbeing', q: "The best measure of whether exercise is working hard enough is...",
        options: ["how sweaty you are", "how long you take", "how raised your heart rate is", "how sore you feel tomorrow"], correct: 2 },
    ],
    4: [
      { concept: 'fitness', q: "Muscular POWER is best described as...",
        options: ["force applied quickly — strength and speed together", "how long a muscle can keep working for", "force applied slowly and steadily over time", "the range of movement available at a joint"], correct: 0 },
      { concept: 'nutrition', q: "Fibre, starch and natural sugars are all types of...",
        options: ["carbohydrate", "fat", "protein", "mineral"], correct: 0 },
      { concept: 'energy systems', q: "Which system can keep working the longest WITHOUT oxygen?",
        options: ["ATP-PC", "They all need oxygen", "Aerobic", "Lactic acid"], correct: 3 },
      { concept: 'training', q: "In the FITT principle, the second T stands for...",
        options: ["Time", "Type", "Tempo", "Target"], correct: 1 },
      { concept: 'fitness', q: "A beep test is mainly a measure of...",
        options: ["muscular power", "flexibility", "cardiovascular endurance", "agility"], correct: 2 },
    ],
    5: [
      { concept: 'energy systems', q: "Which energy system supplies most of the energy for an all-out effort lasting about 8 seconds?",
        options: ["ATP-PC (alactacid)", "Lactic acid", "Aerobic", "Fat metabolism"], correct: 0 },
      { concept: 'fitness', q: "Muscular ENDURANCE differs from muscular STRENGTH because endurance is about...",
        options: ["the greatest force in one effort", "how fast a muscle contracts", "repeating a force without tiring", "the range of a joint"], correct: 2 },
      { concept: 'training', q: "Applying progressive overload means...",
        options: ["gradually increasing the demand on the body", "resting longer between sets", "repeating the same session exactly", "training until you cannot continue"], correct: 0 },
      { concept: 'nutrition', q: "Fat is a useful fuel for long, low-intensity activity because it...",
        options: ["stores a lot of energy per gram", "is used before carbohydrate", "needs no oxygen to use", "releases energy fastest"], correct: 0 },
      { concept: 'body systems', q: "A fitter person's resting heart rate is usually LOWER because the heart...",
        options: ["pumps more blood per beat", "holds less blood", "beats with less force", "needs less oxygen"], correct: 0 },
    ],
  },

  // ── English ────────────────────────────────────────────────────────────────────────────
  english: {
    2: [
      { concept: 'figurative language', q: "Which sentence contains a simile?",
        options: ["The night was a blanket.", "Silence filled the room.", "The wind whispered softly.", "She was as quiet as a mouse."], correct: 3 },
      { concept: 'structure', q: "The part of a story where the problem happens is the...",
        options: ["orientation", "complication", "resolution", "title"], correct: 1 },
      { concept: 'word choice', q: "Which verb best suggests someone moving quietly AND nervously?",
        options: ["crept", "walked", "strolled", "marched"], correct: 0 },
      { concept: 'inference', q: "A character slams a door, then apologises an hour later. You can infer they...",
        options: ["are still angry", "were never upset", "did not notice", "regret losing their temper"], correct: 3 },
      { concept: 'structure', q: "The ending, where the problem is sorted out, is called the...",
        options: ["orientation", "complication", "resolution", "description"], correct: 2 },
    ],
    3: [
      { concept: 'figurative language', q: "Which sentence contains a metaphor?",
        options: ["The wind howled like a wolf.", "The wind was very loud.", "The wind was a howling wolf.", "The wind sounded wolfish."], correct: 2 },
      { concept: 'inference', q: "Inferring means working out something the writer...",
        options: ["got wrong", "states clearly", "suggests without saying", "repeats twice"], correct: 2 },
      { concept: 'conflict', q: "A story where the main character battles a storm is a conflict between...",
        options: ["character and self", "character and character", "character and nature", "character and society"], correct: 2 },
      { concept: 'word choice', q: "Changing \"walked\" to \"trudged\" mainly affects the...",
        options: ["length of the sentence", "number of characters", "tense of the verb", "impression the reader forms"], correct: 3 },
      { concept: 'structure', q: "A topic sentence is most useful to a reader because it...",
        options: ["signals what the paragraph will argue", "gives the strongest example first", "repeats the words of the question", "introduces the quotation that follows"], correct: 0 },
    ],
    4: [
      { concept: 'conflict', q: "A character who cannot decide what is right is experiencing which conflict?",
        options: ["Character and self", "Character and society", "Character and nature", "Character and character"], correct: 0 },
      { concept: 'figurative language', q: "\"The branches reached for her\" gives the tree human qualities. This is...",
        options: ["a simile", "hyperbole", "personification", "alliteration"], correct: 2 },
      { concept: 'tone and mood', q: "TONE is the writer's attitude; MOOD is...",
        options: ["the narrator's identity", "the feeling created in the reader", "the setting of the story", "the speed of the plot"], correct: 1 },
      { concept: 'evidence', q: "In an analytical paragraph, a quotation should be followed by...",
        options: ["another quotation", "a summary of the plot", "your opinion of the book", "an explanation of its effect"], correct: 3 },
      { concept: 'structure', q: "Withholding information to make a reader keep going creates...",
        options: ["dialogue", "tension", "exposition", "resolution"], correct: 1 },
    ],
    5: [
      { concept: 'symbolism', q: "An object that stands for a larger idea is working as...",
        options: ["an anecdote", "a motif", "a simile", "a symbol"], correct: 3 },
      { concept: 'structure', q: "Placing two contrasting images side by side to make a point is...",
        options: ["allusion", "repetition", "foreshadowing", "juxtaposition"], correct: 3 },
      { concept: 'perspective', q: "A narrator the reader cannot fully trust is described as...",
        options: ["omniscient", "first person", "unreliable", "limited"], correct: 2 },
      { concept: 'evidence', q: "The strongest analysis explains how a technique...",
        options: ["fits the word count", "appears in the text", "was used by other writers", "shapes meaning for the reader"], correct: 3 },
      { concept: 'conflict', q: "In a text where a character fights an unjust rule, the central conflict is...",
        options: ["character and self", "character and society", "character and nature", "character and technology"], correct: 1 },
    ],
  },
};

// Tracka Trek runs four subjects. Anything else — and a class with no subject set — falls back
// to science, which is the programme's default and the only set that assumes no prior unit.
export const PRE_TEST_FALLBACK_SUBJECT = 'science';

export function getPreTest(subject, stage) {
  const bySubject = PRE_TEST[subject] || PRE_TEST[PRE_TEST_FALLBACK_SUBJECT];
  // ⚠️ Stage 1 classes exist in the wild and there is no Stage 1 set; they get the Stage 2
  //    questions rather than nothing. 🚫 Never return an empty array — the screen would show
  //    a student five blank cards and no way forward.
  return bySubject[stage] || bySubject[2] || [];
}
