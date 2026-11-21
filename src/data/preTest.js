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
      { concept: 'adaptation', q: "An adaptation is a feature that helps a living thing to...",
        options: ["survive where it lives", "grow more quickly", "change its colour at will", "live forever"], correct: 0 },
      { concept: 'food chains', q: "In a food chain, what does the arrow mean?",
        options: ["Who runs away from who", "Is eaten by", "Lives near", "Is bigger than"], correct: 1 },
      { concept: 'classification', q: "Which feature do ALL mammals share?",
        options: ["They feed their young milk", "They lay eggs", "They live on land", "They can fly"], correct: 0 },
      { concept: 'behaviour', q: "An animal that is active at night and sleeps in the day is called...",
        options: ["extinct", "a predator", "endangered", "nocturnal"], correct: 3 },
      { concept: 'data', q: "A bar graph shows four animals. The tallest bar means that animal was...",
        options: ["seen the most", "the biggest", "the fastest", "seen the least"], correct: 0 },
    ],
    3: [
      { concept: 'adaptation', q: "Thick fur in a cold place is a structural adaptation. Which of these is a BEHAVIOURAL one?",
        options: ["Resting in shade at midday", "Having sharp claws", "Having a long tail", "Having large ears"], correct: 0 },
      { concept: 'food chains', q: "In a food chain, a plant is called a...",
        options: ["consumer", "producer", "predator", "decomposer"], correct: 1 },
      { concept: 'survival', q: "Two animals in one habitat need the same food. This is an example of...",
        options: ["camouflage", "competition", "migration", "hibernation"], correct: 1 },
      { concept: 'fair testing', q: "In a fair test, how many things should you change at a time?",
        options: ["None", "Two", "As many as you like", "One"], correct: 3 },
      { concept: 'classification', q: "Scientists group living things mainly by their...",
        options: ["colour", "size", "usefulness to people", "shared features"], correct: 3 },
    ],
    4: [
      { concept: 'adaptation', q: "Which pair are BOTH behavioural adaptations?",
        options: ["Webbed feet and gills", "Thick fur and sharp teeth", "Migrating and hunting at dusk", "Camouflage and long legs"], correct: 2 },
      { concept: 'energy flow', q: "Only about 10% of the energy at one level of a food chain reaches the next. Most of the rest is...",
        options: ["lost as heat and used for living", "stored in bones", "passed to decomposers only", "turned into water"], correct: 0 },
      { concept: 'survival', q: "A species' population falls sharply after a new predator arrives. The most likely cause is...",
        options: ["increased competition for shelter", "a longer breeding season", "a change in classification", "higher predation reducing survival"], correct: 3 },
      { concept: 'fair testing', q: "In an experiment, the variable you deliberately change is the...",
        options: ["independent variable", "controlled variable", "dependent variable", "constant"], correct: 0 },
      { concept: 'data', q: "A graph shows a steady rise then a sudden drop. The drop is best described as...",
        options: ["proof the data is wrong", "a continuation of the trend", "an anomaly in the trend", "the average"], correct: 2 },
    ],
    5: [
      { concept: 'natural selection', q: "A trait becomes more common over generations because the individuals with it...",
        options: ["want it more", "develop it during their lives", "survive and reproduce more", "are physically stronger"], correct: 2 },
      { concept: 'energy flow', q: "Why are there usually fewer top predators than herbivores in an ecosystem?",
        options: ["They need far more space to roam and hunt", "They are the ones most hunted by humans", "They breed more slowly than their prey do", "Energy is lost at each level, so less supports them"], correct: 3 },
      { concept: 'ecosystems', q: "Which is an ABIOTIC factor?",
        options: ["Soil temperature", "Competition for food", "A population of insects", "Bacteria in the soil"], correct: 0 },
      { concept: 'fair testing', q: "Repeating a measurement several times mainly improves the...",
        options: ["validity", "independent variable", "accuracy of the equipment", "reliability"], correct: 3 },
      { concept: 'data', q: "A conclusion is only valid if it is supported by...",
        options: ["the hypothesis", "the evidence collected", "the opinion of the group", "the longest bar on the graph"], correct: 1 },
    ],
  },

  // ── Mathematics ────────────────────────────────────────────────────────────────────────
  maths: {
    2: [
      { concept: 'fractions', q: "What is half of 18?",
        options: ["8", "9", "10", "12"], correct: 1 },
      { concept: 'graphs', q: "A picture graph uses one symbol for 2 animals. How many animals do 5 symbols show?",
        options: ["7", "8", "10", "12"], correct: 2 },
      { concept: 'fractions', q: "Which fraction is the largest?",
        options: ["1/8", "1/3", "1/4", "1/2"], correct: 3 },
      { concept: 'time', q: "How many minutes are there in a quarter of an hour?",
        options: ["10", "15", "20", "25"], correct: 1 },
      { concept: 'number', q: "A group of 24 is split equally into 4 teams. How many in each team?",
        options: ["4", "5", "6", "8"], correct: 2 },
    ],
    3: [
      { concept: 'percentage', q: "What is 25% of 60?",
        options: ["12", "15", "20", "25"], correct: 1 },
      { concept: 'equivalence', q: "Which decimal is the same as 3/4?",
        options: ["0.25", "0.34", "0.75", "0.43"], correct: 2 },
      { concept: 'graphs', q: "On a column graph, one column is twice the height of another. That means it is...",
        options: ["two more", "two per cent more", "half as many", "twice as many"], correct: 3 },
      { concept: 'average', q: "What is the average of 4, 6 and 8?",
        options: ["5", "6", "7", "9"], correct: 1 },
      { concept: 'ratio', q: "A recipe uses 2 cups of oats for every 1 cup of seeds. For 6 cups of oats you need...",
        options: ["2 cups of seeds", "3 cups of seeds", "4 cups of seeds", "6 cups of seeds"], correct: 1 },
    ],
    4: [
      { concept: 'percentage', q: "What is 37.5% of 24?",
        options: ["7.5", "8", "9", "9.6"], correct: 2 },
      { concept: 'equivalence', q: "Which set shows the SAME value three ways?",
        options: ["0.4, 4%, 2/5", "0.4, 40%, 2/5", "0.04, 40%, 1/4", "4.0, 40%, 4/5"], correct: 1 },
      { concept: 'ratio', q: "A group spends 12 hours resting and 4 hours moving. How many times more is resting?",
        options: ["2", "3", "4", "8"], correct: 1 },
      { concept: 'average', q: "Four results are 10, 10, 10 and 50. Which is TRUE?",
        options: ["The mean and median are both 20", "The mean is 20 and the median is 10", "The mean is 10 and the median is 20", "The mean is 50"], correct: 1 },
      { concept: 'rate', q: "An animal walks 150 m in 5 minutes. At that rate, how far in 12 minutes?",
        options: ["300 m", "330 m", "360 m", "420 m"], correct: 2 },
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
      { concept: 'graphs', q: "A line of best fit is used to...",
        options: ["join every point exactly", "show the overall trend in the data", "find the largest value", "prove the hypothesis"], correct: 1 },
    ],
  },

  // ── PDHPE ──────────────────────────────────────────────────────────────────────────────
  pdhpe: {
    2: [
      { concept: 'nutrition', q: "Which of these is the best everyday source of energy?",
        options: ["Lollies", "Soft drink", "Wholegrain bread", "Chips"], correct: 2 },
      { concept: 'fitness', q: "Why do we warm up before exercise?",
        options: ["To get the body ready and avoid injury", "To use up our energy before we start", "To make our muscles feel tired first", "To cool the muscles down before moving"], correct: 0 },
      { concept: 'body systems', q: "What happens to your heart rate when you run?",
        options: ["It goes down", "It stays the same", "It stops", "It goes up"], correct: 3 },
      { concept: 'fitness', q: "Which activity needs the most FLEXIBILITY?",
        options: ["Sprinting", "Jogging", "Lifting a heavy box", "Stretching to reach your toes"], correct: 3 },
      { concept: 'wellbeing', q: "How much sleep does a primary-aged child need each night?",
        options: ["About 4 hours", "About 6 hours", "About 9 to 11 hours", "About 14 hours"], correct: 2 },
    ],
    3: [
      { concept: 'nutrition', q: "Which macronutrient does the body use FIRST for quick energy?",
        options: ["Carbohydrate", "Protein", "Fat", "Water"], correct: 0 },
      { concept: 'fitness', q: "Being able to keep going for a long time is...",
        options: ["muscular strength", "flexibility", "power", "endurance"], correct: 3 },
      { concept: 'nutrition', q: "Protein is mostly used by the body to...",
        options: ["give instant energy", "store fat", "keep you warm", "build and repair muscle"], correct: 3 },
      { concept: 'energy systems', q: "A 100 m sprint uses mostly...",
        options: ["aerobic energy", "stored fat", "fast, short-burst energy", "oxygen from the blood"], correct: 2 },
      { concept: 'wellbeing', q: "The best measure of whether exercise is working hard enough is...",
        options: ["how sweaty you are", "how raised your heart rate is", "how long you take", "how sore you feel tomorrow"], correct: 1 },
    ],
    4: [
      { concept: 'fitness', q: "Muscular POWER is best described as...",
        options: ["force applied slowly and steadily over time", "how long a muscle can keep working for", "force applied quickly — strength and speed together", "the range of movement available at a joint"], correct: 2 },
      { concept: 'nutrition', q: "Fibre, starch and natural sugars are all types of...",
        options: ["carbohydrate", "fat", "protein", "mineral"], correct: 0 },
      { concept: 'energy systems', q: "Which activity relies most on the AEROBIC system?",
        options: ["A 10 second sprint", "A single heavy lift", "A standing jump", "A 3 km run"], correct: 3 },
      { concept: 'training', q: "In the FITT principle, the second T stands for...",
        options: ["Time", "Type", "Tempo", "Target"], correct: 1 },
      { concept: 'fitness', q: "A test of how far you can reach past your toes is measuring...",
        options: ["flexibility", "agility", "balance", "coordination"], correct: 0 },
    ],
    5: [
      { concept: 'energy systems', q: "Which energy system supplies most of the energy for an all-out effort lasting about 8 seconds?",
        options: ["ATP-PC (alactacid)", "Lactic acid", "Aerobic", "Fat metabolism"], correct: 0 },
      { concept: 'fitness', q: "Muscular ENDURANCE differs from muscular STRENGTH because endurance is about...",
        options: ["the greatest force in one effort", "how fast a muscle contracts", "repeating a force without tiring", "the range of a joint"], correct: 2 },
      { concept: 'training', q: "Applying progressive overload means...",
        options: ["training until you cannot continue", "resting longer between sets", "repeating the same session exactly", "gradually increasing the demand on the body"], correct: 3 },
      { concept: 'nutrition', q: "Fat is a useful fuel for long, low-intensity activity because it...",
        options: ["releases energy fastest", "is used before carbohydrate", "needs no oxygen to use", "stores a lot of energy per gram"], correct: 3 },
      { concept: 'body systems', q: "A fitter person's resting heart rate is usually LOWER because the heart...",
        options: ["beats with less force", "holds less blood", "pumps more blood per beat", "needs less oxygen"], correct: 2 },
    ],
  },

  // ── English ────────────────────────────────────────────────────────────────────────────
  english: {
    2: [
      { concept: 'figurative language', q: "\"As quiet as a mouse\" is an example of a...",
        options: ["question", "metaphor", "rhyme", "simile"], correct: 3 },
      { concept: 'structure', q: "The part of a story where the problem happens is the...",
        options: ["orientation", "complication", "resolution", "title"], correct: 1 },
      { concept: 'word choice', q: "Which word best describes someone moving very quietly?",
        options: ["stomped", "shouted", "ran", "crept"], correct: 3 },
      { concept: 'inference', q: "A character slams a door and will not speak. You can infer they are...",
        options: ["hungry", "upset", "sleepy", "lost"], correct: 1 },
      { concept: 'structure', q: "The ending, where the problem is sorted out, is called the...",
        options: ["orientation", "complication", "resolution", "description"], correct: 2 },
    ],
    3: [
      { concept: 'figurative language', q: "\"The wind was a howling wolf\" is a metaphor because it...",
        options: ["says one thing IS another", "compares using 'like'", "repeats a sound", "asks a question"], correct: 0 },
      { concept: 'inference', q: "Inferring means working out something the writer...",
        options: ["suggests without saying", "states clearly", "got wrong", "repeats twice"], correct: 0 },
      { concept: 'conflict', q: "A story where the main character battles a storm is a conflict between...",
        options: ["character and nature", "character and self", "character and character", "character and society"], correct: 0 },
      { concept: 'word choice', q: "Writers choose precise verbs mainly to...",
        options: ["make the writing longer and more detailed", "create a clearer picture for the reader", "show off a wider vocabulary", "take up more of the page"], correct: 1 },
      { concept: 'structure', q: "A paragraph usually begins with a sentence that...",
        options: ["gives the main idea", "gives an example", "asks the reader a question", "repeats the last paragraph"], correct: 0 },
    ],
    4: [
      { concept: 'conflict', q: "A character who cannot decide what is right is experiencing which conflict?",
        options: ["Character and nature", "Character and society", "Character and self", "Character and character"], correct: 2 },
      { concept: 'figurative language', q: "\"The branches reached for her\" gives the tree human qualities. This is...",
        options: ["a simile", "personification", "hyperbole", "alliteration"], correct: 1 },
      { concept: 'tone and mood', q: "TONE is the writer's attitude; MOOD is...",
        options: ["the narrator's identity", "the speed of the plot", "the setting of the story", "the feeling created in the reader"], correct: 3 },
      { concept: 'evidence', q: "In an analytical paragraph, a quotation should be followed by...",
        options: ["another quotation", "a summary of the plot", "an explanation of its effect", "your opinion of the book"], correct: 2 },
      { concept: 'structure', q: "Withholding information to make a reader keep going creates...",
        options: ["dialogue", "resolution", "exposition", "tension"], correct: 3 },
    ],
    5: [
      { concept: 'symbolism', q: "An object that stands for a larger idea is working as...",
        options: ["a symbol", "a motif", "a simile", "an anecdote"], correct: 0 },
      { concept: 'structure', q: "Placing two contrasting images side by side to make a point is...",
        options: ["juxtaposition", "repetition", "foreshadowing", "allusion"], correct: 0 },
      { concept: 'perspective', q: "A narrator the reader cannot fully trust is described as...",
        options: ["omniscient", "first person", "limited", "unreliable"], correct: 3 },
      { concept: 'evidence', q: "The strongest analysis explains how a technique...",
        options: ["shapes meaning for the reader", "appears in the text", "was used by other writers", "fits the word count"], correct: 0 },
      { concept: 'conflict', q: "In a text where a character fights an unjust rule, the central conflict is...",
        options: ["character and self", "character and nature", "character and society", "character and technology"], correct: 2 },
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
