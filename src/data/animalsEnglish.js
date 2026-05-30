// English academic content for all 12 Taronga Tracka missions.
// NSW English K-10 2022 curriculum, literary devices, text types, and language analysis.
// Zoo animals as stimulus for real literacy and language concepts.

export const ENGLISH_ANIMALS = {

  // -- Chimpanzee -------------------------------------------------------------
  // English focus: Precise verbs and descriptive language, word types and vocabulary choice
  chimpanzee: {
    observationPrompt: 'Watch the chimpanzees move, eat and interact. Notice the precise actions they perform. Think about which words best describe exactly what you see.',
    writingPromptByStage: {
      1: 'Write a sentence about the chimpanzee using an action word (verb) to describe what it is doing.',
      2: 'Write two sentences about the chimpanzees using precise action words (verbs) to describe what they do.',
      3: 'Write a paragraph describing the chimpanzees using at least three precise verbs and two adjectives.',
      4: 'Write a description of the chimpanzees that uses precise verbs and specific noun groups to create a vivid image for the reader.',
      5: 'Analyse how a writer\'s choice of precise verbs shapes the reader\'s impression of an animal, then write your own description of the chimpanzees demonstrating this technique.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['verb', 'adjective', 'precise'],
      4: ['verb', 'noun group', 'precise', 'descriptive'],
      5: ['connotation', 'precise verb', 'verb choice', 'effect'],
    },
    questions: [
      {
        q: 'Precise Verbs and Word Choice',
        stageVariants: {
          1: 'A chimpanzee moves through the trees. Which word best describes exactly how it moves?',
          2: 'Which sentence uses the most precise verb to describe a chimpanzee\'s movement?',
          3: 'A writer wants to show the chimpanzee\'s agility and speed. Which sentence uses the most precise verb?',
          4: 'Which sentence uses precise verbs most effectively to create a vivid image of a chimpanzee?',
          5: 'Which sentence best demonstrates how precise verb choice shapes the connotations of a description?',
        },
        stageOptions: {
          1: ['The chimp goes through the trees', 'The chimp does things in the trees', 'The chimp swings through the trees', 'The chimp is in the trees'],
          2: ['The chimp moved to get the food', 'The chimp lunged forward and snatched the fruit', 'The chimp did something with the food', 'The chimp went over to the food'],
          3: ['The chimp walked to the branch and ate the leaf', 'The chimp leapt onto the branch, snatched the leaf and devoured it', 'The chimp moved to some branches and had some leaves', 'The chimp did something with the branches'],
          4: ['The chimp did many impressive things during the afternoon', 'The chimp made a big noise that could be heard from far away', 'The chimp exploded from the branch, hurtled through the canopy and seized the fruit mid-air', 'The chimp was active and moved around the enclosure quite a lot'],
          5: ['The chimp walked over and took the food from the keeper', 'The chimp obtained nourishment from the keeper during the afternoon session', 'The chimp erupted toward the keeper, wrested the fruit from his grasp and retreated to the canopy', 'The chimp participated in a feeding interaction with zoo staff'],
        },
        stageCorrect: { 1: 2, 2: 1, 3: 1, 4: 2, 5: 2 },
        stageFacts: {
          1: '"Swings" tells us exactly HOW the chimp moves. Precise verbs paint a clearer picture than vague words like "goes" or "does".',
          2: '"Lunged" and "snatched" are precise verbs that tell us exactly how the chimp moved. Vague words like "moved" and "went" give readers less to visualise.',
          3: '"Leapt", "snatched" and "devoured" are precise verbs that show speed and energy. Each one tells the reader something specific about how the action happened.',
          4: '"Exploded", "hurtled" and "seized" are powerful precise verbs. They create a vivid, energetic image that vague phrases like "did many impressive things" cannot match.',
          5: 'The verbs "erupted", "wrested" and "retreated" carry strong connotations of power, defiance and cunning. Precise verb choice shapes how the reader feels about the animal - not just what they see.',
        },
        options: ['The chimp swings through the trees', 'The chimp lunged forward and snatched the fruit', 'The chimp leapt, snatched and devoured', 'The chimp exploded, hurtled and seized', 'The chimp erupted, wrested and retreated'],
        correct: 2,
        fact: 'Precise verbs such as "lunges", "snatches" and "hurls" create a vivid image for the reader. Vague verbs like "goes" or "does" leave readers with nothing specific to picture.',
      },
    ],
  },

  // -- Gorilla ----------------------------------------------------------------
  // English focus: Simile and metaphor - identifying and creating figurative comparisons
  gorilla: {
    observationPrompt: 'Study the gorilla\'s size, posture and presence. Think about what other things - animals, objects, forces of nature - you could compare it to when writing about it.',
    writingPromptByStage: {
      1: 'Write a sentence comparing the gorilla to something else using the word "like" or "as".',
      2: 'Write a simile and a metaphor about the gorilla. Remember: a simile uses "like" or "as", a metaphor says something IS something else.',
      3: 'Write a simile and a metaphor about the gorilla and explain what effect each one creates for the reader.',
      4: 'Write a paragraph about the gorilla that includes both a simile and an extended metaphor, and explain how each device shapes the reader\'s impression.',
      5: 'Analyse the different effects of simile and extended metaphor, then write a description of the gorilla that uses both devices purposefully to position the reader.',
    },
    expectedAnswers: {
      1: [],
      2: ['simile', 'metaphor', 'like', 'as'],
      3: ['simile', 'metaphor', 'effect', 'like', 'as'],
      4: ['simile', 'metaphor', 'extended metaphor', 'effect'],
      5: ['simile', 'metaphor', 'extended metaphor', 'position', 'effect'],
    },
    questions: [
      {
        q: 'Simile and Metaphor',
        stageVariants: {
          1: 'Which sentence uses a simile to describe the gorilla?',
          2: 'Which of these is a METAPHOR (not a simile) about the gorilla?',
          3: 'Which sentence uses an extended metaphor to describe the gorilla?',
          4: 'Which best explains the difference between a simile and a metaphor?',
          5: 'Which statement best explains why a writer might choose a metaphor over a simile?',
        },
        stageOptions: {
          1: ['The gorilla is big and strong', 'The gorilla is like a boulder with eyes', 'The gorilla sat in the corner', 'The gorilla ate its lunch quickly'],
          2: ['The gorilla is as still as a statue', 'The gorilla looks like a giant', 'The gorilla is an ancient king surveying his kingdom', 'The gorilla moved slowly like a tank'],
          3: ['The gorilla is very large and heavy', 'The gorilla sat like a boulder in the corner', 'The gorilla is a boulder - immovable, ancient, worn smooth by time', 'The gorilla moved slowly across the enclosure'],
          4: ['A simile is longer than a metaphor', 'A simile compares using "like" or "as"; a metaphor states that one thing IS another', 'A metaphor only describes animals; a simile describes people', 'A simile is more accurate than a metaphor'],
          5: ['A metaphor is always more correct than a simile', 'A metaphor creates a more direct and complete identification between two things, making the comparison feel more absolute', 'A metaphor is easier to understand than a simile', 'A metaphor should only be used in poetry, not prose'],
        },
        stageCorrect: { 1: 1, 2: 2, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: '"Like a boulder with eyes" is a simile because it uses the word "like" to make a comparison. Similes always use "like" or "as".',
          2: '"An ancient king surveying his kingdom" is a metaphor because it states the gorilla IS a king - no "like" or "as". The other options are similes or literal descriptions.',
          3: 'An extended metaphor develops a comparison across several ideas: "a boulder - immovable, ancient, worn smooth by time" keeps building on the one comparison rather than stating it once.',
          4: 'A simile uses "like" or "as" to compare ("strong as an ox"). A metaphor states that one thing IS another ("he is an ox"). Both create comparisons, but a metaphor does so more directly.',
          5: 'A metaphor creates a stronger identification between two things. By saying the gorilla IS a king (not just LIKE one), the writer makes the comparison feel total and undeniable, pulling the reader in more completely.',
        },
        options: ['The gorilla is like a boulder with eyes', 'The gorilla is an ancient king', 'A simile uses "like"/"as"; a metaphor says IS', 'A metaphor creates a more direct and complete identification'],
        correct: 1,
        fact: 'A simile compares using "like" or "as" (the gorilla is like a boulder). A metaphor states that one thing IS another (the gorilla is a boulder). Both create vivid pictures, but a metaphor makes the comparison feel more total and absolute.',
      },
    ],
  },

  // -- Lion -------------------------------------------------------------------
  // English focus: Persuasive text type - argument structure and persuasive techniques
  lion: {
    observationPrompt: 'Watch the lion and think about why protecting this species matters. Consider what arguments you would make to persuade someone to support lion conservation.',
    writingPromptByStage: {
      1: 'Write one sentence explaining why we should protect lions.',
      2: 'Write two sentences persuading someone to care about protecting lions. Give one reason in each sentence.',
      3: 'Write a short persuasive paragraph about protecting lions. Include a clear argument and at least one persuasive technique.',
      4: 'Write a persuasive paragraph about lion conservation that uses a clear argument structure: claim, evidence and a call to action.',
      5: 'Write a persuasive response about lion conservation that uses at least two rhetorical techniques. Identify your techniques and explain how each positions the reader.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['argument', 'persuade', 'persuasive'],
      4: ['claim', 'evidence', 'call to action', 'argument'],
      5: ['rhetorical', 'technique', 'position', 'reader'],
    },
    questions: [
      {
        q: 'Persuasive Text Type and Argument Structure',
        stageVariants: {
          1: 'Which sentence is trying to PERSUADE you to do something?',
          2: 'Which of these is a persuasive text (trying to change someone\'s mind or actions)?',
          3: 'A persuasive text about lion conservation is most likely to include which feature?',
          4: 'Which option best describes the structure of an effective persuasive argument?',
          5: 'Which technique is most commonly used in persuasive texts to appeal to the reader\'s emotions?',
        },
        stageOptions: {
          1: ['Lions live in Africa and Asia', 'There are about 20,000 lions left', 'You should donate to save lions today!', 'Lions can sleep up to 20 hours a day'],
          2: ['Lions sleep up to 20 hours per day', 'We must protect lions before it is too late - donate now', 'The lion\'s scientific name is Panthera leo', 'Lions live in groups called prides'],
          3: ['A list of facts about lion habitat', 'A timeline of lion population decline', 'A strong opinion, supporting reasons and a call to action', 'A story told from the lion\'s point of view'],
          4: ['Begin with a question, then list facts and end with a picture', 'State a claim, provide evidence to support it, and end with a call to action', 'Describe the problem, write a story about it, then give your opinion', 'Use only statistics, no personal opinion, and avoid emotional language'],
          5: ['Listing statistics without emotional language', 'Using emotive language that makes the reader feel concern, urgency or sympathy', 'Providing only logical, fact-based arguments', 'Asking the reader to consider both sides equally'],
        },
        stageCorrect: { 1: 2, 2: 1, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: '"You should donate to save lions today!" is persuasive because it is trying to make you do something. The other sentences are informative - they give facts without asking you to act.',
          2: '"We must protect lions before it is too late - donate now" is persuasive. It uses emotive language ("before it is too late") and a direct call to action ("donate now") to change the reader\'s behaviour.',
          3: 'A persuasive text about conservation includes a strong opinion (lions must be saved), supporting reasons (habitat loss, numbers declining) and a call to action (what the reader should do).',
          4: 'An effective persuasive argument: state your claim clearly, support it with evidence (facts, statistics, examples) and end with a call to action that tells the reader what to do next.',
          5: 'Emotive language (words like "devastating", "innocent", "urgent") appeals to the reader\'s feelings. It is one of the most powerful persuasive techniques because it creates an emotional connection between the reader and the issue.',
        },
        options: ['You should donate to save lions today!', 'We must protect lions before it is too late - donate now', 'A strong opinion, reasons and a call to action', 'State a claim, provide evidence and end with a call to action', 'Emotive language that creates concern, urgency or sympathy'],
        correct: 2,
        fact: 'Persuasive texts aim to change the reader\'s mind or actions. They use a clear structure: claim, evidence and call to action. Emotive language, rhetorical questions and repetition are key persuasive techniques.',
      },
    ],
  },

  // -- Giraffe ----------------------------------------------------------------
  // English focus: Vocabulary and word choice - Tier 2 words and choosing precise/powerful language
  giraffe: {
    observationPrompt: 'Look at the giraffe\'s towering height, long neck and slow, elegant movements. Think about which words best capture what you are seeing - are there more precise or powerful words than the obvious ones?',
    writingPromptByStage: {
      1: 'Write one sentence about the giraffe using an interesting describing word (adjective).',
      2: 'Write two sentences about the giraffe. Try to use the most interesting and precise words you can instead of simple words like "big" or "nice".',
      3: 'Write a paragraph about the giraffe. Replace any vague or simple words with more precise, powerful alternatives.',
      4: 'Write a description of the giraffe that demonstrates deliberate word choice. Avoid vague or generic words and explain one word choice you made and why.',
      5: 'Analyse how Tier 2 vocabulary elevates writing, then write a description of the giraffe that demonstrates sophisticated word choice across nouns, verbs and adjectives.',
    },
    expectedAnswers: {
      1: [],
      2: ['adjective', 'precise', 'powerful'],
      3: ['precise', 'powerful', 'vocabulary', 'word choice'],
      4: ['word choice', 'precise', 'deliberate', 'vocabulary'],
      5: ['Tier 2', 'vocabulary', 'word choice', 'precise', 'connotation'],
    },
    questions: [
      {
        q: 'Vocabulary and Word Choice',
        stageVariants: {
          1: 'Which word is the best describing word (adjective) for a giraffe\'s neck?',
          2: 'Which sentence uses the most precise and interesting vocabulary to describe the giraffe?',
          3: 'A writer wants to describe the giraffe\'s movement powerfully. Which option shows the best vocabulary choice?',
          4: 'Which sentence shows the most deliberate and effective word choice across nouns, verbs and adjectives?',
          5: 'Which sentence best demonstrates how Tier 2 vocabulary elevates a description beyond the everyday?',
        },
        stageOptions: {
          1: ['Nice', 'Big', 'Towering', 'Good'],
          2: ['The giraffe is big and has a long neck', 'The giraffe walked over to a tree and ate', 'The giraffe, with its towering neck, moved with effortless elegance', 'The giraffe did some things near the trees'],
          3: ['The giraffe walked slowly', 'The giraffe moved around', 'The giraffe went somewhere', 'The giraffe glided across the savannah with unhurried grace'],
          4: ['The tall giraffe ate leaves off a tree on a hot day', 'The enormous giraffe used its tongue to get food in the afternoon', 'The giraffe\'s ossicones swayed as it stooped to graze, its elongated neck folding with surprising fluidity', 'The giraffe did a lot of eating using its really long neck in the enclosure'],
          5: ['The big giraffe ate from the trees', 'The giraffe used its long tongue to eat', 'The giraffe\'s reticulated coat shimmered as its columnar legs carried it toward the acacia', 'The tall giraffe walked around the very large enclosure slowly'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 3, 4: 2, 5: 2 },
        stageFacts: {
          1: '"Towering" is the most precise and powerful adjective here. Words like "nice", "big" and "good" are too vague to create a clear picture for the reader.',
          2: '"Towering neck" and "effortless elegance" are precise, vivid word choices. Vague phrases like "big and has a long neck" give the reader much less to imagine.',
          3: '"Glided" and "unhurried grace" are far more precise and evocative than "walked slowly" or "moved around". Precise vocabulary shows, rather than tells.',
          4: '"Ossicones", "elongated", "stooped" and "fluidity" are precise, well-chosen words across multiple word classes. This creates a vivid, specific picture that generic language cannot.',
          5: '"Reticulated", "columnar" and "acacia" are Tier 2 words - precise, subject-specific vocabulary that elevates the writing above everyday language and creates a more vivid, expert impression.',
        },
        options: ['Towering', 'The giraffe, with its towering neck, moved with effortless elegance', 'The giraffe glided across the savannah with unhurried grace', '"Ossicones", "elongated", "stooped" and "fluidity"', '"Reticulated", "columnar" and "acacia"'],
        correct: 2,
        fact: 'Strong vocabulary choice means selecting the most precise, specific and evocative word for the job. Tier 2 words - subject-specific, precise terms - elevate writing beyond the generic and help readers see exactly what you mean.',
      },
    ],
  },

  // -- Koala ------------------------------------------------------------------
  // English focus: Narrative structure - beginning, complication and resolution
  koala: {
    observationPrompt: 'Watch the koala and imagine its daily story: waking, eating, climbing, resting. Think about how you would structure this as a short narrative with a beginning, a problem and a resolution.',
    writingPromptByStage: {
      1: 'Write three sentences about the koala: what it does in the morning, what happens to it during the day, and how the day ends.',
      2: 'Write a short story about a koala\'s day that has a beginning, a problem (complication) and an ending (resolution).',
      3: 'Write a short narrative about a koala\'s day with a clear beginning, complication and resolution. Use the structure to shape your story.',
      4: 'Write a short narrative about the koala that uses narrative structure deliberately. Explain how your complication and resolution shape the meaning of the story.',
      5: 'Write a short narrative about the koala that uses narrative structure to create a specific effect or theme. Analyse how your structural choices achieve that effect.',
    },
    expectedAnswers: {
      1: [],
      2: ['beginning', 'complication', 'resolution', 'problem', 'ending'],
      3: ['beginning', 'complication', 'resolution', 'narrative structure'],
      4: ['beginning', 'complication', 'resolution', 'meaning', 'structure'],
      5: ['narrative structure', 'complication', 'resolution', 'effect', 'theme'],
    },
    questions: [
      {
        q: 'Narrative Structure',
        stageVariants: {
          1: 'A story about a koala has a beginning, a problem and an ending. Which part is missing from this story: "The koala climbed a tree. Luckily, it found a new branch with fresh leaves."?',
          2: 'Which part of a story is the complication?',
          3: 'A narrative about a koala follows: beginning - complication - resolution. Which option correctly explains the role of the complication?',
          4: 'In narrative structure, the resolution serves which purpose?',
          5: 'A writer ends a koala story with the koala descending from its tree, finding its favourite branch bare, and settling for an unfamiliar tree. What narrative function does this ending serve?',
        },
        stageOptions: {
          1: ['The beginning', 'The problem (complication)', 'The ending (resolution)', 'The setting'],
          2: ['The part where we first meet the characters', 'The problem or challenge that disrupts the story', 'The final part where everything is solved', 'The part that describes where the story is set'],
          3: ['It introduces the main character and setting', 'It provides the problem or obstacle that creates tension and drives the story forward', 'It wraps up loose ends and solves the problem', 'It describes the setting in the most detail'],
          4: ['To introduce new characters', 'To describe the setting in detail', 'To resolve the central conflict and provide a sense of closure', 'To create more tension than the complication'],
          5: ['It is a new complication that sets up a sequel', 'It acts as a complication because it disrupts the expected resolution', 'It is an open-ended resolution that leaves thematic ambiguity', 'It is the beginning of a new story'],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 1, 4: 2, 5: 2 },
        stageFacts: {
          1: 'The story is missing the complication (problem). A complete narrative needs a beginning (set up), complication (problem) and resolution (how it ends). Without the problem, there is no story!',
          2: 'The complication is the problem or challenge that disrupts normal life. Without it, there is no story. In a koala story, it might be: the koala\'s favourite branch breaks.',
          3: 'The complication creates the tension that makes a story interesting. It disrupts the opening situation and gives the narrative somewhere to go. Without a complication, there is no reason for the resolution.',
          4: 'The resolution provides closure by solving the central conflict introduced in the complication. It gives the reader a sense of completion and often carries the story\'s message or theme.',
          5: 'This is an open-ended (or ambiguous) resolution. Rather than fully solving the problem, it leaves the situation unresolved, creating thematic ambiguity - the reader must decide what it means for the koala\'s future.',
        },
        options: ['The problem (complication)', 'The problem or challenge that disrupts the story', 'It provides the problem that creates tension and drives the story', 'To resolve the central conflict and provide closure', 'An open-ended resolution that leaves thematic ambiguity'],
        correct: 1,
        fact: 'Narrative structure gives stories shape and meaning. The beginning sets up the world, the complication (problem) creates tension and drives the story forward, and the resolution provides closure - often where the story\'s deeper meaning is revealed.',
      },
    ],
  },

  // -- Tiger ------------------------------------------------------------------
  // English focus: Sensory imagery and descriptive writing - the five senses
  tiger: {
    observationPrompt: 'Watch the tiger and engage all your senses. What do you see, hear, smell or feel in this space? Think about how a writer uses sensory language to transport the reader to a place.',
    writingPromptByStage: {
      1: 'Write two sentences about the tiger - one about what you can see and one about what you might hear.',
      2: 'Write a sentence for each of the five senses describing what it might be like to stand near a tiger.',
      3: 'Write a descriptive paragraph about the tiger\'s habitat using at least three different senses. Label which sense each image appeals to.',
      4: 'Write a vivid description of the tiger\'s habitat that uses sensory imagery deliberately. Explain how your sensory choices create a specific atmosphere.',
      5: 'Write a descriptive piece about the tiger\'s habitat that uses sensory imagery to create atmosphere and mood. Analyse how your language choices position the reader.',
    },
    expectedAnswers: {
      1: [],
      2: ['sight', 'sound', 'smell', 'touch', 'taste', 'senses'],
      3: ['sensory', 'imagery', 'sight', 'sound', 'smell', 'touch'],
      4: ['sensory imagery', 'atmosphere', 'mood', 'senses'],
      5: ['sensory imagery', 'atmosphere', 'mood', 'position', 'reader'],
    },
    questions: [
      {
        q: 'Sensory Imagery and Descriptive Writing',
        stageVariants: {
          1: 'Which sentence uses a SOUND image to describe the tiger?',
          2: 'Which sentence uses the sense of TOUCH to describe the tiger\'s environment?',
          3: 'Which sentence uses sensory imagery most effectively to describe the tiger\'s habitat?',
          4: 'Which sentence best demonstrates how sensory imagery creates atmosphere?',
          5: 'Which sentence best shows how a writer uses sensory imagery to position the reader emotionally?',
        },
        stageOptions: {
          1: ['The tiger has orange and black stripes', 'The tiger is very heavy', 'A low rumble rolled through the air as the tiger paced', 'The tiger lived in the jungle'],
          2: ['The jungle smelled of wet earth and rotting leaves', 'The distant roar echoed through the trees', 'The damp air pressed against our skin like a warm, wet cloth', 'The vivid orange of the tiger\'s coat blazed through the green'],
          3: ['The tiger was in the forest', 'The trees were very tall and the tiger was big', 'The air was thick with heat; leaves rustled above as a low growl vibrated through the ground', 'The tiger\'s enclosure had plants and water features'],
          4: ['The forest had trees, animals and sounds', 'The heavy, humid air sat on our shoulders like a weight; somewhere in the shadows a branch snapped', 'It was warm in the tiger\'s habitat and there were jungle sounds', 'The tiger moved through a large, naturalistic enclosure with dense vegetation'],
          5: ['The tiger habitat had many different plants and rocks', 'The warm, golden light filtered through the canopy as the tiger\'s coat gleamed in the dappled shade, every ripple of muscle a reminder of quiet, coiled power', 'The tiger was in a large enclosure with trees and water', 'The tiger was described using various sensory details throughout the passage'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: '"A low rumble rolled through the air" is a sound image - it describes what you would HEAR. The other options describe appearance (sight) or give factual information.',
          2: '"Pressed against our skin like a warm, wet cloth" is a touch image (tactile). It describes how the air FEELS on the body, not how it looks, sounds or smells.',
          3: '"Air was thick with heat" (touch), "leaves rustled" (sound) and "low growl vibrated through the ground" (sound/touch) combine multiple senses to create an immersive picture of the habitat.',
          4: '"Heavy, humid air sat on our shoulders" (touch) and the snapping branch (sound) work together to create an atmosphere of weight, tension and unease - far more than a simple list of features.',
          5: '"Warm, golden light", "gleamed", "dappled shade" (all visual) and "quiet, coiled power" (implied kinaesthetic) work together to create a mood of awe and controlled danger. The reader is positioned to feel both wonder and respect for the tiger.',
        },
        options: ['A low rumble rolled through the air', '"Pressed against our skin like a warm, wet cloth"', '"Air thick with heat", "leaves rustled", "low growl vibrated"', '"Heavy, humid air sat on our shoulders" and the snapping branch', '"Warm, golden light", "gleamed", "quiet, coiled power"'],
        correct: 2,
        fact: 'Sensory imagery uses the five senses - sight, sound, smell, touch and taste - to put the reader inside a scene. Skilled writers choose sensory details deliberately to create a specific mood or atmosphere, not just to list what is there.',
      },
    ],
  },

  // -- Dingo ------------------------------------------------------------------
  // English focus: Informative text type and its features
  dingo: {
    observationPrompt: 'Watch the dingo and think about what facts you could share about it. An informative text teaches the reader something new - what would you include, and how would you organise it?',
    writingPromptByStage: {
      1: 'Write one sentence that tells the reader one fact about dingoes.',
      2: 'Write a short informative paragraph about the dingo. Start with a topic sentence and include two facts.',
      3: 'Write an informative paragraph about the dingo with a topic sentence, supporting facts and a concluding sentence.',
      4: 'Write an informative paragraph about the dingo that uses the key features of informative texts: topic sentence, factual information, present tense and technical vocabulary.',
      5: 'Write a short informative text about the dingo and identify the language features (such as tense, sentence types and vocabulary) that make it informative rather than persuasive or narrative.',
    },
    expectedAnswers: {
      1: [],
      2: ['topic sentence', 'fact', 'inform'],
      3: ['topic sentence', 'fact', 'concluding sentence', 'inform'],
      4: ['topic sentence', 'present tense', 'technical vocabulary', 'inform'],
      5: ['topic sentence', 'present tense', 'technical vocabulary', 'informative', 'language features'],
    },
    questions: [
      {
        q: 'Informative Text Type and Features',
        stageVariants: {
          1: 'Which sentence would you find in an INFORMATIVE text about dingoes?',
          2: 'Which is a topic sentence for an informative paragraph about dingoes?',
          3: 'Which paragraph is the best example of an informative text about dingoes?',
          4: 'Which language feature is most typical of informative (factual) texts?',
          5: 'Which sentence best shows the difference between an informative and a persuasive text about dingoes?',
        },
        stageOptions: {
          1: ['Save the dingo - it needs your help now!', 'Dingoes are wild Australian dogs found across most of the continent', 'The dingo howled sadly at the moon', 'I think dingoes are the most interesting animals'],
          2: ['I really love learning about dingoes', 'The dingo is a fascinating animal in my opinion', 'The dingo is a wild canine native to Australia', 'Australia should do more to protect dingoes'],
          3: [
            'Dingoes are amazing! They are so fast and clever. Everyone should care about them.',
            'Once upon a time, a dingo named Kali lived in the red desert of central Australia.',
            'The dingo (Canis lupus dingo) is a wild dog native to Australia. It lives in a variety of habitats including deserts, grasslands and forests. Dingoes are carnivores that hunt small mammals, reptiles and birds.',
            'In my opinion, dingoes are misunderstood animals. People should stop blaming them for livestock attacks.',
          ],
          4: ['First-person pronouns (I, we, my)', 'Emotive language (heartbreaking, urgent, cruel)', 'Present tense and technical or subject-specific vocabulary', 'Rhetorical questions and calls to action'],
          5: [
            'Both sentences would use the same language features, as they are about the same topic',
            '"The dingo is a wild canine" (informative - states a fact) vs "We must protect the dingo" (persuasive - calls for action)',
            'Informative texts always use more difficult words than persuasive texts',
            'Persuasive texts are always written in the first person; informative texts are always in the third person',
          ],
        },
        stageCorrect: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 },
        stageFacts: {
          1: '"Dingoes are wild Australian dogs found across most of the continent" is informative - it states a fact without opinion, emotion or storytelling. The other options are persuasive, narrative or personal.',
          2: '"The dingo is a wild canine native to Australia" is a topic sentence for an informative paragraph - it tells the reader the subject and introduces the main idea without opinion or emotion.',
          3: 'The third option is the best informative paragraph. It uses present tense, technical vocabulary ("Canis lupus dingo", "carnivores"), factual statements and no opinion or emotion - the key features of informative writing.',
          4: 'Informative texts use present tense ("dingoes hunt") and technical/subject-specific vocabulary. First-person pronouns, emotive language and rhetorical questions are features of personal or persuasive writing.',
          5: '"The dingo is a wild canine" gives a fact - it informs. "We must protect the dingo" tries to change the reader\'s behaviour - it persuades. The purpose (inform vs persuade) determines the language choices a writer makes.',
        },
        options: ['Dingoes are wild Australian dogs found across most of the continent', 'The dingo is a wild canine native to Australia', 'Present tense with technical and subject-specific vocabulary', '"The dingo is a wild canine" (inform) vs "We must protect the dingo" (persuade)'],
        correct: 1,
        fact: 'Informative texts teach the reader factual information. Key features include: a topic sentence, facts in present tense, technical vocabulary, and no personal opinion. These features are different from persuasive or narrative writing.',
      },
    ],
  },

  // -- Lemur ------------------------------------------------------------------
  // English focus: Point of view and narrative perspective - first vs third person
  lemur: {
    observationPrompt: 'Watch the lemur troop closely. Imagine telling their story from inside the troop (first person) versus describing it from the outside (third person). How would the reader\'s experience differ?',
    writingPromptByStage: {
      1: 'Imagine you are the lemur. Write two sentences starting with "I" to tell your story.',
      2: 'Write two versions of the same lemur event: one from the lemur\'s point of view (first person) and one from an observer\'s point of view (third person).',
      3: 'Write a short paragraph about the lemur in first person (as the lemur) and then rewrite it in third person. Explain one difference you notice.',
      4: 'Write a short narrative from the lemur\'s first-person perspective and explain how the point of view shapes the reader\'s experience of the story.',
      5: 'Write a short narrative about the lemur and analyse how the choice of narrative perspective (first vs third person) positions the reader differently in each.',
    },
    expectedAnswers: {
      1: [],
      2: ['first person', 'third person', 'point of view', 'I'],
      3: ['first person', 'third person', 'point of view', 'perspective'],
      4: ['first person', 'narrative perspective', 'point of view', 'reader experience'],
      5: ['first person', 'third person', 'narrative perspective', 'position', 'reader'],
    },
    questions: [
      {
        q: 'Narrative Point of View and Perspective',
        stageVariants: {
          1: 'Which sentence is written in FIRST PERSON (as if you are the lemur)?',
          2: 'Which pair correctly identifies the narrative perspective of each sentence?',
          3: 'A writer retells a lemur\'s escape from a predator. Which version creates more tension by using first-person perspective?',
          4: 'Which statement best explains the effect of using first-person perspective in a narrative?',
          5: 'Which statement best explains how narrative perspective positions the reader?',
        },
        stageOptions: {
          1: ['The lemur leapt into the trees', 'I leapt from branch to branch, heart racing', 'Lemurs can jump up to 9 metres', 'She watched the lemur leap away'],
          2: [
            '"I leapt into the trees" is third person; "The lemur leapt" is first person',
            '"I leapt into the trees" is first person; "The lemur leapt" is third person',
            'Both sentences are in third person',
            'Both sentences are in first person',
          ],
          3: [
            '"The lemur detected the predator and retreated into the canopy at high speed."',
            '"I froze. The shadow moved again. My heart hammered as I launched myself into the branches above."',
            '"Lemurs have a number of natural predators and have developed instinctive escape behaviours."',
            '"She watched as the lemur spotted the predator and quickly climbed out of reach."',
          ],
          4: [
            'First person gives the reader a detached, objective view of the story',
            'First person places the reader inside the narrator\'s mind, creating greater intimacy and emotional connection',
            'First person is more factually reliable than third person',
            'First person makes the story more difficult to understand because of the limited viewpoint',
          ],
          5: [
            'First and third person create identical reader experiences; the choice is purely stylistic',
            'First person positions the reader inside the narrator\'s experience, creating intimacy; third person creates distance, allowing the reader to observe more objectively',
            'Third person always creates more tension than first person',
            'Narrative perspective only affects the vocabulary used, not the reader\'s relationship to the story',
          ],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
        stageFacts: {
          1: '"I leapt from branch to branch, heart racing" is first person - the narrator is the lemur, using "I". First-person stories put you inside the character\'s experience.',
          2: '"I leapt" uses the first-person pronoun "I" - this is first person. "The lemur leapt" uses "the lemur" - this is third person, told from outside the character.',
          3: '"I froze. The shadow moved again..." uses first person to put us directly inside the lemur\'s fear. Short sentences and internal reactions create immediate, visceral tension that the detached third-person options cannot match.',
          4: 'First person places readers inside the narrator\'s consciousness - we feel what they feel. This creates intimacy and emotional connection. Third person allows a more detached, observational view.',
          5: 'First person positions the reader INSIDE the narrator\'s experience - feelings, thoughts and limitations are shared. Third person positions the reader as an observer, with more distance but potentially more information. Both choices are deliberate and shape the reader\'s relationship to the text.',
        },
        options: ['"I leapt from branch to branch, heart racing"', '"I leapt" is first person; "The lemur leapt" is third person', '"I froze. The shadow moved again. My heart hammered..."', 'First person places the reader inside the narrator\'s mind', 'First person = intimacy inside the experience; third person = observational distance'],
        correct: 1,
        fact: 'Narrative perspective is the "camera angle" of a story. First person (I/me) puts the reader inside the narrator\'s mind. Third person (he/she/they) watches from outside. Each choice positions the reader differently and creates different emotional effects.',
      },
    ],
  },

  // -- Sea Lion ---------------------------------------------------------------
  // English focus: Persuasive writing techniques - rhetorical devices
  'sea-lion': {
    observationPrompt: 'Watch the sea lions and think about the threats they face. What persuasive techniques would you use to convince someone to help protect them?',
    writingPromptByStage: {
      1: 'Write a sentence that makes someone want to help protect sea lions.',
      2: 'Write two sentences to persuade someone to protect sea lions. Try to make them feel something.',
      3: 'Write a short persuasive paragraph about protecting sea lions. Use at least one persuasive technique and name it.',
      4: 'Write a persuasive argument to protect sea lions that uses two different rhetorical techniques. Name each technique and explain its effect.',
      5: 'Write a persuasive response about sea lion conservation that uses three rhetorical techniques. For each, identify the technique, quote your example and analyse its effect on the reader.',
    },
    expectedAnswers: {
      1: [],
      2: ['persuade', 'emotive', 'technique'],
      3: ['persuasive technique', 'rhetorical question', 'emotive language', 'repetition'],
      4: ['rhetorical device', 'technique', 'effect', 'reader'],
      5: ['rhetorical device', 'technique', 'effect', 'reader', 'position'],
    },
    questions: [
      {
        q: 'Persuasive Techniques and Rhetorical Devices',
        stageVariants: {
          1: 'Which sentence is most likely to make someone WANT to help sea lions?',
          2: 'Which persuasive technique does this sentence use: "Every single day, sea lions die because of our plastic"?',
          3: 'Which rhetorical device is used in this sentence: "How many more must die before we act?"',
          4: 'A writer uses the phrase "drowning in plastic, dying for our silence, disappearing on our watch" three times in a speech. Which rhetorical device is this?',
          5: 'Which statement best explains why rhetorical questions are effective in persuasive texts?',
        },
        stageOptions: {
          1: ['Sea lions are marine mammals', 'Sea lions live near the coast', 'These playful, intelligent animals are dying because of our plastic - and we can stop it', 'There are several species of sea lion'],
          2: ['Rhetorical question - asking a question to make the reader think', 'Repetition - repeating a word for impact', 'Emotive language - using words that create a strong feeling', 'Statistics - using numbers to persuade'],
          3: ['Emotive language', 'Alliteration', 'Repetition', 'Rhetorical question'],
          4: ['Simile', 'Alliteration', 'Anaphora (repetition for effect)', 'Irony'],
          5: [
            'Rhetorical questions are effective because they contain factual information',
            'Rhetorical questions force the reader to mentally engage and answer for themselves, making them feel responsible and more likely to act',
            'Rhetorical questions are only effective in spoken speeches, not written texts',
            'Rhetorical questions are persuasive because they are always unanswerable',
          ],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 3, 4: 2, 5: 1 },
        stageFacts: {
          1: '"These playful, intelligent animals are dying because of our plastic - and we can stop it" uses emotive language ("playful", "intelligent", "dying") and a call to action to make the reader feel concern and empowerment.',
          2: '"Dying because of our plastic" uses emotive language - words designed to trigger an emotional response (guilt, sadness, urgency). The word "our" also implicates the reader directly.',
          3: '"How many more must die before we act?" is a rhetorical question - a question asked for effect, not to receive an answer. It positions the reader to feel urgency and personal responsibility.',
          4: 'Repeating "drowning in plastic, dying for our silence, disappearing on our watch" three times is anaphora - the deliberate repetition of a phrase at the start of successive clauses for rhetorical effect.',
          5: 'Rhetorical questions engage the reader\'s active thinking - they mentally supply an answer. This makes the reader feel implicated and responsible, which is far more persuasive than simply stating a fact.',
        },
        options: ['"Playful, intelligent animals are dying because of our plastic - and we can stop it"', 'Emotive language - words that create a strong feeling', 'Rhetorical question', 'Anaphora (repetition for effect)', 'Rhetorical questions force the reader to mentally engage and feel responsible'],
        correct: 3,
        fact: 'Persuasive writers use rhetorical devices to move their audience. Rhetorical questions engage readers and make them feel responsible. Emotive language triggers an emotional response. Repetition and anaphora build emphasis. Statistics add credibility.',
      },
    ],
  },

  // -- Asian Water Buffalo ----------------------------------------------------
  // English focus: Figurative language - personification
  'asian-water-buffalo': {
    observationPrompt: 'Look at the Asian water buffalo. Its slow, powerful presence, the way it seems to survey its territory. Think about how you could describe this animal as if it were a person, giving it human feelings and actions.',
    writingPromptByStage: {
      1: 'Write a sentence about the buffalo as if it has feelings. What is the buffalo thinking or feeling right now?',
      2: 'Write two sentences using personification to describe the buffalo. Give it human thoughts, feelings or actions.',
      3: 'Write a paragraph that uses personification to bring the buffalo to life. Label which words or phrases are personification.',
      4: 'Write a description of the buffalo that uses extended personification. Explain how the personification shapes the reader\'s impression of the animal.',
      5: 'Write a description of the buffalo that uses personification as an extended device. Analyse how personification works to position the reader and what values or ideas it projects onto the animal.',
    },
    expectedAnswers: {
      1: [],
      2: ['personification', 'human', 'feelings', 'actions'],
      3: ['personification', 'human quality', 'effect'],
      4: ['personification', 'extended personification', 'effect', 'impression'],
      5: ['personification', 'extended personification', 'position', 'values', 'project'],
    },
    questions: [
      {
        q: 'Personification',
        stageVariants: {
          1: 'Which sentence gives the buffalo HUMAN feelings or actions (personification)?',
          2: 'Which sentence is the best example of personification?',
          3: 'Which sentence uses personification rather than a simile or metaphor?',
          4: 'Which best explains what personification does in a piece of writing?',
          5: 'Which statement best analyses the effect of extended personification?',
        },
        stageOptions: {
          1: ['The buffalo has very large horns', 'The buffalo is dark brown in colour', 'The buffalo surveyed its kingdom with weary dignity', 'The buffalo weighs about 700 kg'],
          2: ['The buffalo stood as still as a rock', 'The buffalo is a powerful machine', 'The buffalo sighed, lowered its great head, and wondered if today would bring rain', 'The buffalo is very large and has curved horns'],
          3: ['The buffalo is like a tank on the battlefield', 'The buffalo is a wall of solid muscle', 'The wind whispered the buffalo\'s name across the open plain', 'The buffalo moved through the dust like a slow-moving storm'],
          4: ['Personification compares two unlike things using "like" or "as"', 'Personification gives human qualities, feelings or actions to non-human things, creating empathy and imaginative connection', 'Personification exaggerates a feature of a subject beyond what is literally true', 'Personification describes only animals, never objects or abstract ideas'],
          5: [
            'Extended personification weakens a text by making it seem childish or unrealistic',
            'Extended personification maintains a consistent human identity for a non-human subject across a text, drawing the reader into an imaginative relationship and projecting human values onto it',
            'Extended personification is only effective in poetry, not prose',
            'Extended personification simply means using personification more than once in a paragraph',
          ],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: '"Surveyed its kingdom with weary dignity" gives the buffalo human actions (surveying a kingdom) and human feelings (dignity, weariness). This is personification - giving human qualities to a non-human subject.',
          2: '"Sighed", "lowered its great head" and "wondered" all give the buffalo human feelings and actions. This is personification. The other options are a simile, a metaphor, and a literal description.',
          3: '"The wind whispered the buffalo\'s name" gives the wind a human action (whispering). Similes use "like" or "as"; metaphors say something IS something else. Personification gives human qualities directly to a non-human subject.',
          4: 'Personification gives human qualities (feelings, thoughts, actions) to animals, objects or ideas. It creates empathy - it invites the reader to emotionally connect with the subject as if it were a person.',
          5: 'Extended personification sustains a consistent human identity for a non-human subject throughout a piece of writing. This draws the reader into an imaginative relationship and projects human values and meanings onto the subject, shaping how the reader interprets it.',
        },
        options: ['The buffalo surveyed its kingdom with weary dignity', '"Sighed", "wondered" and "lowered its great head"', '"The wind whispered the buffalo\'s name"', 'Gives human qualities, creating empathy and imaginative connection', 'Maintains a consistent human identity, projecting human values onto the subject'],
        correct: 1,
        fact: 'Personification gives human qualities, feelings or actions to non-human things. It creates empathy by inviting the reader to connect emotionally with the subject. Extended personification maintains this human identity consistently across a whole text.',
      },
    ],
  },

  // -- Concert Lawn -----------------------------------------------------------
  // English focus: Poetry and creative writing - poetic devices
  'concert-lawn': {
    observationPrompt: 'Stand on the Concert Lawn and take in the open space, the sounds and the textures of the natural world around you. Think about how a poet would capture this moment - what images, sounds or patterns would they use?',
    writingPromptByStage: {
      1: 'Write a two-line rhyme about the Concert Lawn or something you can see or hear there.',
      2: 'Write a short poem (at least four lines) about the Concert Lawn using rhyme or alliteration.',
      3: 'Write a short poem about the Concert Lawn or nature around you that uses at least two poetic devices. Label each device you use.',
      4: 'Write a short poem about the Concert Lawn that uses at least three poetic devices deliberately. Explain how each device creates an effect.',
      5: 'Write a poem about the Concert Lawn and analyse how your poetic choices - including at least three devices - create a specific mood, theme or emotional effect for the reader.',
    },
    expectedAnswers: {
      1: [],
      2: ['rhyme', 'alliteration', 'poem'],
      3: ['poetic device', 'rhyme', 'rhythm', 'alliteration', 'imagery'],
      4: ['poetic device', 'rhyme', 'rhythm', 'alliteration', 'imagery', 'effect'],
      5: ['poetic device', 'mood', 'theme', 'effect', 'reader'],
    },
    questions: [
      {
        q: 'Poetic Devices',
        stageVariants: {
          1: 'Which pair of lines uses RHYME?',
          2: 'Which line uses ALLITERATION (the same starting sound repeated)?',
          3: 'Which line uses IMAGERY to paint a picture in the reader\'s mind?',
          4: 'Which statement best explains how rhythm works in a poem?',
          5: 'Which statement best analyses the combined effect of two or more poetic devices working together?',
        },
        stageOptions: {
          1: [
            'The grass is green / the sky is wide',
            'The wind blows across the lawn / birds sing in the trees',
            'The birds sing sweet / while children run and meet',
            'The lawn is large / with many trees growing there',
          ],
          2: ['The birds flew over the green lawn', 'Sunshine scattered silver seeds across the soil', 'The trees moved gently in the afternoon breeze', 'Children ran happily toward the stage'],
          3: ['The Concert Lawn is a good place to be', 'Many birds live near the Concert Lawn', 'The lawn stretched out like a green river flowing toward the stage', 'The grass was approximately 1.5 hectares in size'],
          4: [
            'Rhythm is only found in poems that rhyme',
            'Rhythm is the pattern of stressed and unstressed syllables that gives a poem its beat or musicality',
            'Rhythm refers to the number of lines in a poem',
            'Rhythm is created only by using punctuation at the end of each line',
          ],
          5: [
            'Poetic devices never work together - each creates its own separate effect',
            'When alliteration and imagery combine, the sound pattern draws attention to the image, making it more vivid and memorable for the reader',
            'Using more than one device weakens a poem by making it too complicated',
            'Devices only matter in structured poetry; free verse has no devices',
          ],
        },
        stageCorrect: { 1: 2, 2: 1, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: '"The birds sing sweet / while children run and meet" uses rhyme - "sweet" and "meet" share the same end sound. Rhyme creates a musical, memorable quality in poetry.',
          2: '"Sunshine scattered silver seeds across the soil" uses alliteration - the repeated "s" sound in "sunshine", "scattered", "silver", "seeds" and "soil". Alliteration creates a pleasing sound pattern and draws attention to the line.',
          3: '"A green river flowing toward the stage" is a simile used as imagery - it creates a picture in the reader\'s mind by comparing the lawn to a river. Pure factual statements like "the grass was 1.5 hectares" do not create images.',
          4: 'Rhythm is the pattern of stressed and unstressed syllables - it is the beat or musicality of a poem. It can make lines feel fast or slow, heavy or light, and creates a memorable sonic effect even without rhyme.',
          5: 'When alliteration (sound) and imagery (picture) combine, the sound pattern of the alliteration draws the reader\'s attention to the image, making it more striking and memorable. Devices work together to create layered effects.',
        },
        options: ['"The birds sing sweet / while children run and meet"', '"Sunshine scattered silver seeds across the soil"', '"The lawn stretched out like a green river flowing toward the stage"', 'Rhythm is the pattern of stressed and unstressed syllables that creates the poem\'s beat', 'Alliteration and imagery combine - sound draws attention to the image, making it more vivid'],
        correct: 1,
        fact: 'Poets use devices like rhyme, rhythm, alliteration and imagery to make their writing musical, vivid and memorable. Rhyme creates a sound pattern. Alliteration repeats opening sounds. Imagery creates pictures. Rhythm gives a poem its beat.',
      },
    ],
  },

  // -- Blue Mountains Bushwalk ------------------------------------------------
  // English focus: Recount text type
  // 3 questions: Q1 (Platypus) recount features, Q2 (Lizard) descriptive language in recount, Q3 (Lyrebird) onomatopoeia
  'blue-mountains-bushwalk': {
    observationPrompt: 'Walk through the Blue Mountains Bushwalk. Notice the sounds, the sights and the details of the natural environment. A recount tells the story of what you experienced - think about the language features that make a recount feel real and vivid.',
    writingPromptByStage: {
      1: 'Write three sentences about what you did and saw on the bushwalk, in the order it happened.',
      2: 'Write a short recount of your bushwalk using time connectives (first, then, next, finally) and "I" or "we".',
      3: 'Write a recount of the bushwalk in first person, past tense. Use time connectives and at least two descriptive words for each animal you saw.',
      4: 'Write a vivid recount of the Blue Mountains Bushwalk using the key features of recount writing. Identify two language choices you made and explain their effect.',
      5: 'Write a recount of the Blue Mountains Bushwalk that demonstrates control of language. Analyse how your choices of person, tense, connectives and descriptive language position the reader as a co-participant in the experience.',
    },
    expectedAnswers: {
      1: [],
      2: ['recount', 'first person', 'past tense', 'time connectives', 'I', 'we'],
      3: ['recount', 'first person', 'past tense', 'time connectives', 'descriptive'],
      4: ['recount', 'first person', 'past tense', 'time connectives', 'language features'],
      5: ['recount', 'first person', 'past tense', 'time connectives', 'position', 'reader'],
    },
    questions: [
      // questions[0]: Q1 - Platypus - Recount text features
      {
        q: 'Recount Text Features',
        stageVariants: {
          1: 'Which sentence sounds like part of a RECOUNT (a story about something that really happened)?',
          2: 'Which feature is NOT typically found in a recount text?',
          3: 'Which sentence best demonstrates the key features of a recount?',
          4: 'Which option correctly identifies the three most important language features of a recount?',
          5: 'Which statement best explains why recounts use first person and past tense together?',
        },
        stageOptions: {
          1: ['The platypus can swim and hunt underwater', 'We should protect the platypus from pollution', 'I spotted a platypus in the creek - it dived under the surface before I could get close', 'Once upon a time, a platypus named Pip lived in a creek'],
          2: ['Events in chronological (time) order', 'First-person pronouns (I, we)', 'Past tense verbs', 'A fictional main character and invented events'],
          3: [
            'Platypuses are interesting animals that use their bills to find food',
            'You should protect platypuses from pollution and habitat loss',
            'Yesterday, we walked along the creek path and spotted a platypus diving beneath the surface of the still water',
            'Once there was a platypus who loved swimming in creeks and finding food',
          ],
          4: [
            'Emotive language, statistics and rhetorical questions',
            'First person, past tense and time connectives (first, then, next)',
            'Second person, present tense and technical vocabulary',
            'Third person, future tense and figurative language',
          ],
          5: [
            'First person and past tense are used together simply because that is the grammatical rule for recounts',
            'First person signals that the narrator was there (personal voice); past tense signals it already happened (real experience). Together they give the reader access to an authentic, lived experience',
            'First person and past tense together always create the most persuasive texts',
            'Using first person and past tense is optional in a recount - the reader will understand either way',
          ],
        },
        stageCorrect: { 1: 2, 2: 3, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: '"I spotted a platypus in the creek" is a recount - it is a personal account of something that really happened, written in first person ("I") and past tense ("spotted"). Recounts retell real events.',
          2: 'A fictional main character and invented events belong in a narrative, not a recount. Recounts retell real events that actually happened, in the order they occurred.',
          3: '"Yesterday, we walked... and spotted a platypus" uses the three key features of a recount: first person ("we"), past tense ("walked", "spotted") and events in order with a time marker ("yesterday").',
          4: 'The three core language features of a recount are: first person (I/we - the narrator was there), past tense (it already happened) and time connectives (first, then, next, finally - to sequence events).',
          5: 'First person tells the reader the narrator was personally present. Past tense confirms the event already happened and is real. Together, these two features give the reader access to an authentic, lived experience - the foundation of recount writing.',
        },
        options: ['"I spotted a platypus in the creek - it dived before I could get close"', 'A fictional main character and invented events', '"Yesterday, we walked along the creek and spotted a platypus"', 'First person, past tense and time connectives', 'First person = narrator was there; past tense = it already happened; together = authentic lived experience'],
        correct: 1,
        fact: 'A recount retells real events in the order they happened. Key features: first-person pronouns (I/we), past tense verbs, and time connectives (first, then, next, finally). These features signal that the narrator was personally there and that the events really occurred.',
      },
      // questions[1]: Q2 - Lizard - Descriptive language in a recount
      {
        q: 'Descriptive Language in a Recount',
        stageVariants: {
          1: 'Which sentence uses a DESCRIBING WORD (adjective) in a recount?',
          2: 'Which sentence uses the BEST adjectives to describe a lizard in a recount?',
          3: 'Which sentence adds the most vivid description to a recount using adjectives and sensory language?',
          4: 'Which sentence best shows how descriptive language enhances a recount without losing its factual, personal quality?',
          5: 'Which statement best explains the role of descriptive language in a high-quality recount?',
        },
        stageOptions: {
          1: ['I saw a lizard on the rock', 'Lizards are reptiles that live in warm climates', 'I spotted a bright green lizard sunning itself on a flat, warm rock', 'We should appreciate lizards in their natural habitat'],
          2: ['I saw a lizard there on the walk', 'I noticed a lizard near some rocks', 'I saw a large, scaly lizard with a vivid blue tongue flicker from its mouth', 'A lizard ran across the path as we walked'],
          3: ['I saw a lizard during the bushwalk', 'There was a lizard and it was on a rock and it had blue colours', 'The lizard - its skin a mosaic of rust and gold - lifted its head and fixed me with one cold, amber eye', 'I observed a reptile of moderate size resting in a sunny location on the path'],
          4: [
            'Suddenly, a majestic, utterly breathtaking creature of incomprehensible beauty appeared before my stunned eyes',
            'I stepped around the corner and stopped. A blue-tongued lizard sat on the warm sandstone, its scales catching the afternoon sun',
            'There was a lizard. It was quite big. It had a blue tongue. I saw it.',
            'The blue-tongued lizard is an Australian reptile found in eastern states and territories',
          ],
          5: [
            'Descriptive language should be avoided in recounts because it makes the text less factually accurate',
            'Descriptive language in a recount makes the events vivid and immersive for the reader without sacrificing the first-person, past-tense structure that defines the text type',
            'Descriptive language changes a recount into a narrative, so it should only be used sparingly',
            'Descriptive language in a recount is only effective when used in the opening sentence',
          ],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: '"Bright green" and "flat, warm" are adjectives (describing words). Adding adjectives to a recount makes the events feel more vivid and real for the reader.',
          2: '"Large, scaly" and "vivid blue tongue" are precise adjectives that create a clear picture. They tell the reader exactly what was seen - much more effective than vague words like "there" or "near some rocks".',
          3: '"A mosaic of rust and gold" (colour imagery), "cold, amber eye" (sensory + colour) and the precise verb "fixed" all work together to create a vivid, immersive moment in the recount.',
          4: '"A blue-tongued lizard sat on the warm sandstone, its scales catching the afternoon sun" balances recount features (first person implied, past tense, real event) with precise descriptive language. It is vivid without being over-written.',
          5: 'Descriptive language (adjectives, precise verbs, sensory imagery) makes a recount immersive and vivid for the reader. It does not change the text type - the recount still uses first person, past tense and time sequence. It just makes those real events come alive.',
        },
        options: ['"Bright green" and "flat, warm" are adjectives that make events vivid', '"Large, scaly" and "vivid blue tongue" are precise adjectives', '"A mosaic of rust and gold", "cold, amber eye", precise verb "fixed"', '"A blue-tongued lizard sat on the warm sandstone, its scales catching the afternoon sun"', 'Descriptive language makes events vivid and immersive without changing the text type'],
        correct: 1,
        fact: 'Good recounts use adjectives and sensory language to make the experience vivid for the reader. Precise descriptive words ("scaly", "rust and gold", "amber eye") paint a clear picture without changing the key features of a recount: first person, past tense and real events in order.',
      },
      // questions[2]: Q3 - Lyrebird - Onomatopoeia and sound devices in nature writing
      {
        q: 'Onomatopoeia and Sound Devices in Nature Writing',
        stageVariants: {
          1: 'Which word SOUNDS like the noise it describes?',
          2: 'Which sentence uses ONOMATOPOEIA (a word that sounds like its meaning)?',
          3: 'Which sentence uses onomatopoeia most effectively in a nature description?',
          4: 'Which statement best explains how onomatopoeia works as a literary device?',
          5: 'Which statement best analyses the combined effect of onomatopoeia and alliteration in nature writing?',
        },
        stageOptions: {
          1: ['Tall', 'Graceful', 'Screech', 'Colourful'],
          2: ['The lyrebird is a large bird found in eastern Australia', 'The lyrebird is known for its impressive mimicry', 'The lyrebird\'s song was impressive and interesting to hear', 'The lyrebird trilled, clicked and buzzed through its extraordinary repertoire'],
          3: ['The lyrebird made a sound that could be heard from quite a distance', 'We heard the lyrebird before we saw it - its clear whistle cut through the still air, followed by a sharp crack like a whip', 'The lyrebird sang for several minutes before flying away', 'The lyrebird produced a range of vocalisations typical of its species'],
          4: [
            'Onomatopoeia is a device that uses rhyme to create a musical effect',
            'Onomatopoeia uses words whose pronunciation imitates the sound they describe, allowing readers to hear the description as they read it',
            'Onomatopoeia is only used in poetry, not in prose or recount writing',
            'Onomatopoeia describes the appearance of something using vivid visual language',
          ],
          5: [
            'Onomatopoeia and alliteration have identical effects and can always be substituted for each other',
            'Onomatopoeia creates the sound of the subject and alliteration draws sonic attention to it; together they create a vivid, immersive soundscape that pulls the reader into the scene',
            'Using onomatopoeia and alliteration together weakens a text by making it sound too poetic',
            'Alliteration only works in poetry; combining it with onomatopoeia in a recount is grammatically incorrect',
          ],
        },
        stageCorrect: { 1: 2, 2: 3, 3: 1, 4: 1, 5: 1 },
        stageFacts: {
          1: '"Screech" sounds like the noise it describes - the harsh, sharp sound of a screech. Onomatopoeia is when a word\'s pronunciation imitates the sound it names.',
          2: '"Trilled", "clicked" and "buzzed" all sound like the actions they describe. These are onomatopoeic words - their pronunciation imitates the lyrebird\'s sounds.',
          3: '"Whistle cut through" and "sharp crack like a whip" use onomatopoeic quality ("whistle", "crack") and precise sound imagery to immerse the reader in the experience. Pure factual descriptions ("a sound that could be heard") create no sound picture.',
          4: 'Onomatopoeia uses words whose sound imitates what they describe - "buzz", "crack", "trill", "screech". This invites the reader to hear the description as they read it, making it more immersive.',
          5: 'Onomatopoeia creates the actual sound of the subject in the reader\'s mind. Alliteration draws sonic attention to phrases through repeated sounds. Together, they create a rich soundscape - the reader does not just read about the sound, they hear it.',
        },
        options: ['"Screech" sounds like the noise it describes', '"Trilled", "clicked" and "buzzed" are onomatopoeic', '"Whistle cut through" and "sharp crack like a whip" use sound imagery', 'Onomatopoeia uses words whose pronunciation imitates the sound they describe', 'Onomatopoeia creates the sound; alliteration draws sonic attention - together they create an immersive soundscape'],
        correct: 1,
        fact: 'Onomatopoeia is when a word sounds like the noise it names - "buzz", "crack", "trill", "screech". It is a powerful device in nature writing because it helps readers hear what is being described, not just read about it. Combined with alliteration, it creates a vivid, immersive soundscape.',
      },
    ],
  },

};

export default ENGLISH_ANIMALS;
