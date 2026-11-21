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
        options: ["from the eater to its food", "from the animals to the plants", "from the biggest to the smallest", "from the food to the thing that eats it"], correct: 3 },
      { concept: 'classification', q: "Which group has a backbone, feathers, and lays eggs?",
        options: ["Birds", "Reptiles", "Mammals", "Amphibians"], correct: 0 },
      { concept: 'behaviour', q: "An animal most active at dawn and dusk is called...",
        options: ["nocturnal", "diurnal", "hibernating", "crepuscular"], correct: 3 },
      { concept: 'data', q: "Two bars on a graph are exactly the same height. That means...",
        options: ["both were counted the same number of times", "they are the same animal", "the graph has been drawn wrongly", "one is twice the other"], correct: 0 },
    ],
    3: [
      { concept: 'adaptation', q: "Thick fur in a cold place is a structural adaptation. Which of these is a BEHAVIOURAL one?",
        options: ["Having large ears", "Resting in shade at midday", "Having a long tail", "Having sharp claws"], correct: 1 },
      { concept: 'food chains', q: "If every plant in a food chain died, which animals would be affected FIRST?",
        options: ["The herbivores", "The decomposers", "The top predators", "All of them at the same time"], correct: 0 },
      { concept: 'survival', q: "Two animals in one habitat need the same food. This is an example of...",
        options: ["camouflage", "hibernation", "migration", "competition"], correct: 3 },
      { concept: 'fair testing', q: "In a fair test, the things you deliberately keep the same are called the...",
        options: ["controlled variables", "results", "independent variable", "method"], correct: 0 },
      { concept: 'classification', q: "Two animals look almost identical but cannot breed together. They are...",
        options: ["the same species", "a male and a female", "the same animal at different ages", "different species"], correct: 3 },
    ],
    4: [
      { concept: 'adaptation', q: "Which pair are BOTH behavioural adaptations?",
        options: ["Camouflage and long legs", "Thick fur and sharp teeth", "Webbed feet and gills", "Migrating and hunting at dusk"], correct: 3 },
      { concept: 'energy flow', q: "A food chain rarely has more than four or five levels. The best explanation is that...",
        options: ["too little energy is left to support another level", "predators would grow too large to feed themselves", "there are not enough different species on Earth", "the sun does not provide enough light energy"], correct: 0 },
      { concept: 'survival', q: "A species' population falls sharply after a new predator arrives. The most likely cause is...",
        options: ["higher predation reducing survival", "a longer breeding season", "a change in classification", "increased competition for shelter"], correct: 0 },
      { concept: 'fair testing', q: "In an experiment, the variable you MEASURE is the...",
        options: ["independent variable", "controlled variable", "dependent variable", "hypothesis"], correct: 2 },
      { concept: 'data', q: "One result sits far away from the pattern of all the others. It should be...",
        options: ["investigated and reported", "averaged with the rest", "treated as the real answer", "deleted from the data"], correct: 0 },
    ],
    5: [
      { concept: 'natural selection', q: "Natural selection cannot work on a population with no variation, because...",
        options: ["no individual has an advantage to pass on", "the population is too small", "mutations cannot happen", "the environment never changes"], correct: 0 },
      { concept: 'energy flow', q: "About 10% of energy passes between levels. Of 10 000 kJ at the plants, roughly how much reaches the third level?",
        options: ["10 kJ", "100 kJ", "1 000 kJ", "3 300 kJ"], correct: 1 },
      { concept: 'ecosystems', q: "Which is an ABIOTIC factor?",
        options: ["Soil temperature", "Competition for food", "A population of insects", "Bacteria in the soil"], correct: 0 },
      { concept: 'fair testing', q: "A test that actually measures what it set out to measure is described as...",
        options: ["accurate", "reliable", "valid", "repeatable"], correct: 2 },
      { concept: 'data', q: "Two variables rise together across a data set. This shows...",
        options: ["that one of them must be causing the other", "a correlation, which is not the same as cause", "that the experiment has not been done fairly", "nothing that can be used in a conclusion"], correct: 1 },
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
        options: ["3/8", "2/5", "1/2", "1/3"], correct: 2 },
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
        options: ["three more", "three per cent more", "a third as many", "three times as many"], correct: 3 },
      { concept: 'average', q: "The mean of 5, 7 and one more number is 8. What is the missing number?",
        options: ["8", "10", "12", "14"], correct: 2 },
      { concept: 'ratio', q: "A mix uses 2 cups of oats for every 1 cup of seeds. For 9 cups of oats you need...",
        options: ["3 cups of seeds", "4 cups of seeds", "4.5 cups of seeds", "6 cups of seeds"], correct: 2 },
    ],
    4: [
      { concept: 'percentage', q: "In a group of 32, a quarter chose A and 37.5% chose B. How many more chose B than A?",
        options: ["2", "4", "6", "8"], correct: 1 },
      { concept: 'equivalence', q: "Which of these is the largest?",
        options: ["0.62", "62%", "5/8", "3/5"], correct: 2 },
      { concept: 'ratio', q: "A day of 24 hours is 12 hours resting and 4 hours moving. The ratio of moving to the WHOLE day is...",
        options: ["1 : 3", "1 : 4", "1 : 6", "1 : 12"], correct: 2 },
      { concept: 'average', q: "Five results are 4, 4, 6, 8 and 28. Which is TRUE?",
        options: ["The mean is 6 and the median is 10", "The mean is 10 and the median is 6", "The mean and median are both 6", "The mean and median are both 10"], correct: 1 },
      { concept: 'rate', q: "An animal walks 150 m in 5 minutes. At that rate, how long to walk 420 m?",
        options: ["12 minutes", "14 minutes", "15 minutes", "16 minutes"], correct: 1 },
    ],
    5: [
      { concept: 'percentage change', q: "A count falls from 80 to 60, then rises by 20%. What is it now?",
        options: ["64", "68", "72", "76"], correct: 2 },
      { concept: 'reverse percentage', q: "After a 20% increase a count is 96. What was it before?",
        options: ["76", "76.8", "80", "86"], correct: 2 },
      { concept: 'ratio', q: "24 hours are shared in the ratio 5 : 3 between resting and moving. Resting is...",
        options: ["12 hours", "13 hours", "15 hours", "16 hours"], correct: 2 },
      { concept: 'average', q: "A sample of 40 found 15% were marked. In a population of 600, about how many are marked?",
        options: ["60", "75", "90", "120"], correct: 2 },
      { concept: 'graphs', q: "Which average is LEAST affected by one very large value?",
        options: ["The mean", "The median", "The range", "They are affected equally"], correct: 1 },
    ],
  },

  // ── PDHPE ──────────────────────────────────────────────────────────────────────────────
  pdhpe: {
    2: [
      { concept: 'nutrition', q: "Which food gives the longest lasting energy?",
        options: ["A sports drink", "White sugar", "A lolly", "Wholegrain bread"], correct: 3 },
      { concept: 'fitness', q: "Warming up raises your heart rate before you start so that...",
        options: ["your heart can have a rest", "the muscles use less energy", "you feel tired more slowly", "more oxygen reaches the muscles"], correct: 3 },
      { concept: 'body systems', q: "Your breathing rate rises during exercise mainly to...",
        options: ["cool the body down", "get more oxygen to the muscles", "use up more food", "slow the heart down"], correct: 1 },
      { concept: 'fitness', q: "Which PAIR of activities both need good flexibility?",
        options: ["Sprinting and lifting", "Throwing and catching", "Jogging and walking", "Gymnastics and hurdling"], correct: 3 },
      { concept: 'wellbeing', q: "How much sleep does a primary-aged child need each night?",
        options: ["About 4 hours", "About 6 hours", "About 9 to 11 hours", "About 14 hours"], correct: 2 },
    ],
    3: [
      { concept: 'nutrition', q: "Which macronutrient gives the most energy per gram?",
        options: ["Carbohydrate", "Protein", "Fibre", "Fat"], correct: 3 },
      { concept: 'fitness', q: "Which component of fitness lets one muscle repeat a movement many times without tiring?",
        options: ["Cardiovascular endurance", "Power", "Muscular strength", "Muscular endurance"], correct: 3 },
      { concept: 'nutrition', q: "After hard exercise, protein is most needed to...",
        options: ["repair muscle tissue", "replace lost water", "provide instant energy", "store energy as fat"], correct: 0 },
      { concept: 'energy systems', q: "A 400 m run leaves the legs burning. That burning is linked to...",
        options: ["using stored fat", "the ATP-PC system", "the aerobic system", "the lactic acid system"], correct: 3 },
      { concept: 'wellbeing', q: "Two people run together at the same speed. One has a much lower heart rate. That person is probably...",
        options: ["working harder", "heavier", "fitter", "not trying"], correct: 2 },
    ],
    4: [
      { concept: 'fitness', q: "Muscular POWER is best described as...",
        options: ["force applied slowly and steadily over time", "how long a muscle can keep working for", "force applied quickly — strength and speed together", "the range of movement available at a joint"], correct: 2 },
      { concept: 'nutrition', q: "Which PAIR are both carbohydrates?",
        options: ["Fibre and protein", "Starch and fibre", "Starch and fat", "Protein and fat"], correct: 1 },
      { concept: 'energy systems', q: "Which system can keep working the longest WITHOUT oxygen?",
        options: ["ATP-PC", "Lactic acid", "Aerobic", "They all need oxygen"], correct: 1 },
      { concept: 'training', q: "Going from three sessions a week to five changes which part of FITT?",
        options: ["Type", "Intensity", "Time", "Frequency"], correct: 3 },
      { concept: 'fitness', q: "A beep test is mainly a measure of...",
        options: ["cardiovascular endurance", "flexibility", "muscular power", "agility"], correct: 0 },
    ],
    5: [
      { concept: 'energy systems', q: "Which energy system supplies most of the energy for an all-out effort lasting about 8 seconds?",
        options: ["Fat metabolism", "Lactic acid", "Aerobic", "ATP-PC (alactacid)"], correct: 3 },
      { concept: 'fitness', q: "A one-repetition maximum test is a measure of...",
        options: ["muscular endurance", "maximal muscular strength", "muscular power", "flexibility"], correct: 1 },
      { concept: 'training', q: "An athlete stops improving after months of identical sessions. Which principle has been ignored?",
        options: ["Specificity", "Recovery", "Progressive overload", "Reversibility"], correct: 2 },
      { concept: 'nutrition', q: "Fat is a useful fuel for long, low-intensity activity because it...",
        options: ["stores a lot of energy per gram", "is used before carbohydrate", "needs no oxygen to use", "releases energy fastest"], correct: 0 },
      { concept: 'body systems', q: "Stroke volume is best described as...",
        options: ["the blood pumped per beat", "the beats per minute", "the oxygen used per minute", "the blood pumped per minute"], correct: 0 },
    ],
  },

  // ── English ────────────────────────────────────────────────────────────────────────────
  english: {
    2: [
      { concept: 'figurative language', q: "Which sentence contains a simile?",
        options: ["The night was a blanket.", "She was as quiet as a mouse.", "The wind whispered softly.", "Silence filled the room."], correct: 1 },
      { concept: 'structure', q: "The part of a story where the problem happens is the...",
        options: ["orientation", "complication", "resolution", "title"], correct: 1 },
      { concept: 'word choice', q: "Which verb best suggests someone moving quietly AND nervously?",
        options: ["crept", "walked", "strolled", "marched"], correct: 0 },
      { concept: 'inference', q: "A character slams a door, then apologises an hour later. You can infer they...",
        options: ["regret losing their temper", "were never upset", "did not notice", "are still angry"], correct: 0 },
      { concept: 'structure', q: "The ending, where the problem is sorted out, is called the...",
        options: ["orientation", "complication", "resolution", "description"], correct: 2 },
    ],
    3: [
      { concept: 'figurative language', q: "Which sentence contains a metaphor?",
        options: ["The wind howled like a wolf.", "The wind was very loud.", "The wind sounded wolfish.", "The wind was a howling wolf."], correct: 3 },
      { concept: 'inference', q: "Inferring means working out something the writer...",
        options: ["suggests without saying", "states clearly", "got wrong", "repeats twice"], correct: 0 },
      { concept: 'conflict', q: "A story where the main character battles a storm is a conflict between...",
        options: ["character and self", "character and nature", "character and character", "character and society"], correct: 1 },
      { concept: 'word choice', q: "Changing \"walked\" to \"trudged\" mainly affects the...",
        options: ["length of the sentence", "number of characters", "impression the reader forms", "tense of the verb"], correct: 2 },
      { concept: 'structure', q: "A topic sentence is most useful to a reader because it...",
        options: ["gives the strongest example first", "signals what the paragraph will argue", "repeats the words of the question", "introduces the quotation that follows"], correct: 1 },
    ],
    4: [
      { concept: 'conflict', q: "A character must choose between loyalty to a friend and loyalty to their family. This is a conflict of...",
        options: ["character and character", "character and self", "character and society", "character and nature"], correct: 1 },
      { concept: 'figurative language', q: "Which sentence uses personification?",
        options: ["The fog crept in on silent feet.", "The fog was as thick as soup.", "The fog was a grey wall.", "The fog covered the whole valley."], correct: 0 },
      { concept: 'tone and mood', q: "A writer describes a party in short, clipped sentences and cold grey colours. The MOOD created is...",
        options: ["celebratory", "nostalgic", "uneasy", "comic"], correct: 2 },
      { concept: 'evidence', q: "Which sentence does the most analytical work?",
        options: ["The metaphor 'a grey wall' makes the fog feel like a barrier.", "The writer has used a metaphor in line four of the extract.", "There is a great deal of description of the fog in this extract.", "The fog is one of the most important parts of the whole story."], correct: 0 },
      { concept: 'structure', q: "Short sentences through a chase scene mainly change the...",
        options: ["pace", "setting", "narrator", "theme"], correct: 0 },
    ],
    5: [
      { concept: 'symbolism', q: "A caged bird appears every time the narrator mentions home. Repeated like that, it is working as...",
        options: ["a simile", "a pun", "an anecdote", "a motif"], correct: 3 },
      { concept: 'structure', q: "A writer places a wedding scene immediately after a funeral. The technique is...",
        options: ["allusion", "foreshadowing", "repetition", "juxtaposition"], correct: 3 },
      { concept: 'perspective', q: "A narrator insists they are perfectly calm while describing their own shaking hands. The reader should treat them as...",
        options: ["unreliable", "omniscient", "third person", "objective"], correct: 0 },
      { concept: 'evidence', q: "A paragraph that lists three techniques without saying what they do is weak because it...",
        options: ["uses too few quotations", "repeats the question", "is too short for the marker", "describes rather than analyses"], correct: 3 },
      { concept: 'conflict', q: "A character campaigns against a law that everyone around them accepts. The conflict is...",
        options: ["character and self", "character and character", "character and nature", "character and society"], correct: 3 },
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
