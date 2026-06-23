// English academic content for all 12 Taronga Tracka missions.
// NSW English K-10 2022 curriculum, literary devices, text types, and language analysis.
// Zoo animals as stimulus for real literacy and language concepts.

export const ENGLISH_ANIMALS = {

  // -- Chimpanzee -------------------------------------------------------------
  // English focus: Planning, monitoring, revising and reflecting - story conflict from behavioural data
  chimpanzee: {
    observationPrompt: 'Watch the chimpanzees and build your behaviour graph. The behaviour they do least will become the conflict in your story - a famine, exhaustion, or something stopping them from moving freely.',
    writingPromptByStage: {
      1: 'Write a short story about a chimpanzee. Use the problem from your graph. What happens? How does it end?',
      2: 'Write a short story about a chimpanzee using the conflict from your graph. Include a beginning, a problem and an ending.',
      3: 'Write a short creative story about a chimpanzee group. Use the conflict from your graph as the problem the characters must face.',
      4: 'Write a short creative story about a chimpanzee group where the conflict from your graph drives the narrative.',
      5: 'Write a short creative story set among the chimpanzees. Use your graph\'s conflict as the central tension and explore what it reveals about the group.',
    },
    expectedAnswers: {
      1: ['beginning', 'problem', 'ending'],
      2: ['complication', 'conflict', 'resolution', 'plan'],
      3: ['conflict', 'complication', 'resolution', 'data', 'narrative'],
      4: ['conflict', 'narrative', 'meaning', 'data', 'plan'],
      5: ['conflict', 'narrative', 'theme', 'analyse', 'data'],
    },
    questions: [
      {
        q: 'Story Conflict from Graph Data',
        stageVariants: {
          1: 'Look at your graph. Which thing did the chimps do least?',
          2: 'Look at your graph. Which behaviour is the lowest bar? That becomes the problem in your story.',
          3: 'Look at your graph. Which behaviour is lowest? This is the conflict your story will be about.',
          4: 'Look at your graph. Which behaviour is lowest? As a writer, this becomes your story\'s central conflict.',
          5: 'Look at your graph. Which behaviour is lowest? This becomes the conflict at the heart of your narrative.',
        },
        stageOptions: {
          1: [
            'Not enough rest',
            'Not enough food',
            'Not enough movement',
            'All the same',
          ],
          2: [
            'Not enough rest',
            'Not enough food',
            'Not enough movement',
            'All the same',
          ],
          3: [
            'Not enough rest',
            'Not enough food',
            'Not enough movement',
            'No clear conflict',
          ],
          4: [
            'Not enough rest',
            'Not enough food',
            'Not enough movement',
            'No clear conflict',
          ],
          5: [
            'Not enough rest',
            'Not enough food',
            'Not enough movement',
            'No clear conflict',
          ],
        },
        stageCorrect: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        stageFacts: {
          1: 'The thing the chimps do least becomes the problem in your story. Writers look at what is missing and ask: "What if this went wrong?"',
          2: 'The lowest behaviour is the conflict — the problem that creates tension in your story. Writers look at what is missing or under threat and build a story around it.',
          3: 'Well identified. The lowest behaviour shows what is under pressure — and pressure creates story tension.',
          4: 'Good planning. Using your graph gives your conflict a real foundation — it makes the story feel grounded and believable.',
          5: 'The lowest behaviour reveals a tension in the group. Skilled writers use observed detail to build conflicts that feel real and meaningful.',
        },
        options: ['Not enough rest', 'Not enough food', 'Not enough movement', 'All the same'],
        correct: 0,
        fact: 'Good writers plan before they write. Using real observations - like a behaviour graph - to identify a conflict makes your story more grounded and believable. The thing that is missing or under threat is where tension lives.',
      },
    ],
  },

  // -- Gorilla ----------------------------------------------------------------
  // English focus: Reading comprehension leading to creative story completion using observation
  gorilla: {
    observationPrompt: 'Watch the gorilla group carefully. You are going to use what you observe right now to write the ending of a story. Notice who has power, how they move, and what the mood of the group is.',
    writingPromptByStage: {
      1: 'Watch the gorillas now. What happens to Kito? Does he get the burger? Write the ending of the story.',
      2: 'Watch the gorillas carefully. Use what you see to write what happens when Kito crosses the enclosure. Does Jabari react?',
      3: 'Observe the gorilla group. Use the real behaviour you see - movements, moods, power - to write a satisfying ending for Kito\'s story.',
      4: 'Watch the gorillas closely. Use your real observations to write an ending that reflects the group\'s actual dynamics. Think about how power works here.',
      5: 'Observe the gorilla group carefully. Write an ending that uses real observed detail to explore what the story reveals about gorilla society, power and survival.',
    },
    expectedAnswers: {
      1: ['burger', 'Kito', 'Jabari', 'ending'],
      2: ['Kito', 'Jabari', 'burger', 'ending'],
      3: ['Kito', 'Jabari', 'behaviour', 'ending', 'group'],
      4: ['power', 'dynamics', 'Kito', 'Jabari', 'ending'],
      5: ['power', 'society', 'Jabari', 'Kito', 'ending'],
    },
    questions: [
      {
        q: 'Reading Comprehension',
        passage: 'The Big Serve\n\nThe keeper had just left.\n\nSpread across the ground was the afternoon serve - bamboo stalks, broad leaves, a pile of termites, all stacked together the way the keepers always did it. A Gorilla Whopper.\n\nJabari, the silverback, had eaten first. He always did. Now he sat in the middle of the enclosure, watching nothing in particular.\n\nOne burger had not been touched.\n\nKito had been watching it for ten minutes.\n\nKito looked at Jabari. Jabari did not move.\n\nSlowly - very slowly - Kito began to cross the enclosure.',
        stageVariants: {
          1: 'What does Kito notice that the other gorillas have not?',
          2: 'Why does Kito move "slowly - very slowly"?',
          3: 'What does "Jabari did not move" tell us about the situation?',
          4: 'How does the writer create tension in this passage?',
          5: 'Why does the passage end with "Kito began to cross the enclosure"?',
        },
        stageOptions: {
          1: [
            'A new gorilla in the enclosure',
            'The keeper arriving with more food',
            'Jabari moving toward the leaves',
            'The untouched burger on the ground',
          ],
          2: [
            'He is tired from resting all morning',
            'He does not want to wake the sleeping gorillas',
            'He is showing the younger gorillas how to walk',
            'He does not want Jabari to notice him',
          ],
          3: [
            'Jabari is asleep',
            'Jabari has eaten and does not care',
            'Jabari is friendly and happy to share',
            'Jabari might have noticed Kito — the danger is still there',
          ],
          4: [
            'By using long, complicated sentences',
            'By describing the burger in detail',
            'By having Jabari speak out loud',
            'By showing Kito move carefully while Jabari watches in silence',
          ],
          5: [
            'To tell us Kito gets the burger safely',
            'To show what Jabari does next',
            'To explain how Jabari became the silverback',
            'To leave the reader unsure what happens — building suspense',
          ],
        },
        stageCorrect: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
        stageFacts: {
          1: 'Well done! Kito spotted the untouched burger. Good readers notice the small details that drive the story forward.',
          2: 'Good reading! Kito moves slowly so Jabari does not notice him. Even reaching for a leftover burger is risky when the silverback is watching.',
          3: 'Well identified. A still, watchful silverback is more threatening than an active one. We do not know if Jabari has noticed Kito — that uncertainty is the tension.',
          4: 'Good analysis. The tension comes from contrast — Kito moving quietly while Jabari sits perfectly still. The reader feels the risk before anything even happens.',
          5: 'Good analysis. By ending mid-action the writer leaves the reader unsure — we do not know if Kito succeeds, which makes us want to keep reading.',
        },
        options: [
          'The untouched Gorilla Whopper burger',
          'He does not want Jabari to notice him',
          'Jabari\'s stillness creates uncertainty about whether he has noticed Kito',
          'Through Kito\'s hesitation, contrasted with Jabari\'s stillness',
          'An unresolved moment that places the reader in suspense alongside Kito',
        ],
        correct: 0,
        fact: 'Good readers notice how writers create tension. In this passage, the tension comes from what is NOT said - we do not know if Jabari has noticed Kito, and that uncertainty keeps us reading.',
      },
    ],
  },

  // -- Lion -------------------------------------------------------------------
  // English focus: Imagery - sensory and visual language in descriptive writing
  lion: {
    observationPrompt: 'Zoom in on the lion\'s eyes. What colour are they? What do they remind you of? Use what you see to write a description.',
    writingPromptByStage: {
      1: 'Look at the lion\'s eyes. Write one sentence about what you see. Use a colour word and the word "like".',
      2: 'Look at the lion\'s eyes. Write two sentences — describe the colour and what the eyes remind you of. Use "like" or "as" in your comparison.',
      3: 'Look at the lion\'s eyes. Write a short paragraph describing what you see. Include at least one comparison — what do the eyes remind you of?',
      4: 'Look at the lion\'s eyes. Write a descriptive paragraph. Include one comparison and explain what effect it creates for the reader.',
      5: 'Look at the lion\'s eyes. Write a descriptive piece using at least two images. Explain how your language choices create an impression of the lion for the reader.',
    },
    expectedAnswers: {
      1: ['like', 'as', 'golden', 'amber', 'eyes'],
      2: ['like', 'as', 'colour', 'eyes'],
      3: ['like', 'as', 'eyes', 'because'],
      4: ['like', 'as', 'effect', 'reader', 'eyes'],
      5: ['effect', 'reader', 'language', 'eyes', 'imagery'],
    },
    questions: [
      {
        q: 'Identifying Strong Imagery',
        stageVariants: {
          1: 'Which sentence uses imagery to describe the lion?',
          2: 'Which sentence creates the STRONGEST image of the lion?',
          3: 'Which sentence best uses visual imagery to bring the lion to life?',
          4: 'A writer wants to convey the power and grace of the lion. Which sentence uses imagery most effectively?',
          5: 'Which statement best explains what makes imagery effective in writing?',
        },
        stageOptions: {
          1: ['The lion is an animal', 'The lion is sitting in the enclosure', 'The lion\'s golden coat blazed in the afternoon sun like a flame', 'The lion weighs about 180 kg'],
          2: ['The lion sat in the shade', 'The lion is a large predator', 'The lion\'s mane hung like a storm cloud around his face, heavy and dark', 'The lion looked at us'],
          3: ['The lion\'s eyes are yellow', 'The lion seemed comfortable in its enclosure', 'The lion\'s amber eyes cut through the shadows like two torches burning in the dark', 'Lions are found in Africa and Asia'],
          4: ['The lion is very powerful and moves with grace across the grass', 'The lion is like a large, graceful cat that moves smoothly', 'The lion flowed across the grass like liquid gold — every muscle a quiet promise of power', 'The powerful lion walked across the green grass of its enclosure'],
          5: ['Imagery is effective because it uses rhyme and rhythm to engage the reader', 'Imagery works best when it only describes colours and shapes, not sounds or feelings', 'Imagery is effective because it uses specific, sensory language to create a vivid picture in the reader\'s mind', 'Imagery means comparing two things using "like" or "as"'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: '"The lion\'s golden coat blazed like a flame" uses visual imagery — language that creates a picture in the reader\'s mind. "Blazed" and "like a flame" make the reader see the warmth and intensity of the lion\'s colour.',
          2: '"Mane hung like a storm cloud" is strong imagery — it compares the lion\'s mane to a storm cloud, giving an impression of darkness, heaviness and power. Good imagery makes the familiar look new.',
          3: '"Amber eyes like torches burning in the dark" uses colour (amber), light (torches) and contrast (dark) to create a striking picture. The reader can almost feel the intensity of the lion\'s gaze.',
          4: '"Flowed like liquid gold" suggests movement, colour and smoothness at once. "Every muscle a quiet promise of power" combines visual imagery with meaning — the reader sees both what the lion looks like and what it represents.',
          5: 'Effective imagery appeals to the senses — sight, sound, smell, touch. By using specific, sensory language, writers make readers feel they are experiencing something directly. The best imagery describes the familiar in an unexpected way, making the reader see it anew.',
        },
        options: ['The lion\'s golden coat blazed like a flame', 'The lion\'s mane hung like a storm cloud, heavy and dark', 'Amber eyes like torches burning in the dark', 'Flowed like liquid gold — every muscle a quiet promise of power', 'Specific, sensory language creates a vivid picture in the reader\'s mind'],
        correct: 2,
        fact: 'Imagery uses specific, sensory language to create a picture in the reader\'s mind. Effective imagery makes the reader feel they can see, hear or sense what the writer is describing — often through unexpected comparisons that make familiar things feel vivid and new.',
      },
    ],
  },

  // -- Giraffe ----------------------------------------------------------------
  // English focus: Vocabulary and word choice - Tier 2 words and choosing precise/powerful language
  giraffe: {
    observationPrompt: 'Look at the giraffe - its height, its neck, the way it moves. You are going to compare what you see to other things using simile. What is it as tall as? What does its movement remind you of?',
    writingPromptByStage: {
      1: 'Look at the giraffe. Write one simile about it using "as tall as" or "like".',
      2: 'Look at the giraffe. Write one simile about it and explain what you are comparing.',
      3: 'Observe the giraffe. Write one simile about it and explain why you chose that comparison.',
      4: 'Observe the giraffe. Write one simile and explain what effect it creates for the reader.',
      5: 'Observe the giraffe. Write one simile and analyse why that comparison is effective for the reader.',
    },
    expectedAnswers: {
      1: ['like', 'as'],
      2: ['like', 'as', 'comparing'],
      3: ['simile', 'like', 'as', 'because'],
      4: ['simile', 'effect', 'reader'],
      5: ['simile', 'effect', 'reader', 'effective'],
    },
    questions: [
      {
        q: 'Simile',
        stageVariants: {
          1: 'Complete the simile: The giraffe is as tall as a ___.',
          2: 'Which simile best matches the giraffe\'s real height?',
          3: 'Which simile best describes the giraffe\'s height?',
          4: 'Which simile best describes the giraffe\'s height?',
          5: 'Which is the most effective simile for the giraffe\'s height?',
        },
        stageOptions: {
          1: [
            'A person',
            'A tree',
            'A skyscraper',
            'An ant',
          ],
          2: [
            'As small as a person',
            'As tall as a tree',
            'As tall as a skyscraper',
            'As tiny as an ant',
          ],
          3: [
            'As small as a person',
            'As tall as a tree',
            'As tall as a skyscraper',
            'As tiny as an ant',
          ],
          4: [
            'As tall as a skyscraper',
            'As tall as a tree',
            'As small as a person',
            'As tiny as an ant',
          ],
          5: [
            'As tall as a skyscraper',
            'As tall as a tree',
            'As large as a house',
            'As tiny as an ant',
          ],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
        stageFacts: {
          1: 'A simile compares two things using "like" or "as". A giraffe grows to about 5-6 metres tall - about the same height as a tall tree. A person is around 1.7 metres, a skyscraper is hundreds of metres, and an ant is less than a centimetre!',
          2: '"As tall as a tree" is accurate - a giraffe can grow to about 5-6 metres, similar to a tall tree. A simile works best when the comparison is believable and helps the reader picture what you mean.',
          3: 'The best simile is both accurate and vivid. "As tall as a tree, its neck disappearing into the canopy" works because it is a real comparison AND the detail about the canopy adds a picture. Comparing to a skyscraper is so exaggerated it loses credibility.',
          4: 'A good simile must be both accurate and familiar. "As tall as a tree" works because the reader can picture a tree - it is a real, proportionate comparison. Exaggerated similes like a skyscraper can seem dramatic but feel unbelievable and undermine the writing.',
          5: 'An effective simile creates a comparison the reader can trust and visualise. "As tall as a tree" is proportionate and familiar. Gross exaggeration (a skyscraper) undermines credibility. A simile\'s power comes from precision and accuracy, not extremity.',
        },
        options: ['A tree', 'As tall as a tree', 'The giraffe stretched as tall as a tree, its neck disappearing into the canopy', '"As tall as a tree" - accurate and familiar so the reader can picture it', '"As tall as a tree" is accurate, familiar and proportionate - the reader can visualise it'],
        correct: 0,
        fact: 'A simile compares two things using "like" or "as". The best similes are accurate AND familiar - they help the reader picture what you mean. A giraffe really is about as tall as a tree, which makes it the perfect comparison.',
      },
    ],
  },

  // -- Koala ------------------------------------------------------------------
  // English focus: How texts represent ideas, experiences and values
  koala: {
    observationPrompt: 'Find the signs near the koala enclosure and read them carefully. Use the facts and information on the signs to write your own informative text about koalas.',
    writingPromptByStage: {
      1: 'Read the signs near the koala. Write two sentences about koalas using facts from the signs.',
      2: 'Read the signs near the koala. Write a short informative paragraph about koalas using facts from the signs.',
      3: 'Read the signs near the koala. Write an informative paragraph that includes a topic sentence, two or three facts from the signs, and a concluding sentence.',
      4: 'Read the signs near the koala. Write an informative paragraph using facts from the signs. Include a clear topic sentence and explain why the information matters to the reader.',
      5: 'Read the signs near the koala. Write an informative text using facts and language from the signs. Explain how your language choices suit the purpose and audience of an informative text.',
    },
    expectedAnswers: {
      1: ['koala', 'fact', 'sign'],
      2: ['koala', 'fact', 'sign', 'paragraph'],
      3: ['topic sentence', 'fact', 'sign', 'concluding'],
      4: ['topic sentence', 'fact', 'sign', 'inform', 'reader'],
      5: ['informative', 'language', 'purpose', 'audience', 'fact'],
    },
    questions: [
      {
        q: 'An Aussie Icon - Reading the Sign',
        stageVariants: {
          1: 'Read the "An Aussie Icon" sign near the koalas. What does the sign say is the main problem for koalas?',
          2: 'Read the "An Aussie Icon" sign. What is the sign mainly trying to tell you?',
          3: 'Read the sign. It has two parts — a problem and something being done about it. What is the problem?',
          4: 'Read the sign. It uses numbers like "10,000 koalas". Why does the writer use numbers like this?',
          5: 'Read the sign. It calls koalas "An Aussie Icon". What does the word "icon" mean here?',
        },
        stageOptions: {
          1: [
            'Habitat loss, disease, bushfires and drought',
            'Not enough food at the zoo',
            'They sleep too much',
            'They are hard to look after',
          ],
          2: [
            'Koalas are in danger and need our help',
            'Koalas are the most popular zoo animal',
            'Koalas are easy to look after',
            'Koalas live all over the world',
          ],
          3: [
            'Koalas are losing their homes and facing disease and bushfires',
            'Taronga Zoo does not have enough money',
            'Koalas cannot breed in captivity',
            'People do not care about koalas anymore',
          ],
          4: [
            'To show how serious the problem is with real facts',
            'To make the sign look longer',
            'Because all signs use numbers',
            'To show how many people visited the zoo',
          ],
          5: [
            'Something very important to Australian culture and identity',
            'A picture or symbol on a phone screen',
            'A type of Australian food',
            'A word meaning old or ancient',
          ],
        },
        stageCorrect: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        stageFacts: {
          1: 'The sign lists the real threats koalas face: habitat loss, disease, bushfires and drought. These are the challenges making it hard for koalas to survive in the wild.',
          2: 'The sign has one main message — koalas are in danger and people are working to save them. Signs like this are written to inform us and make us care about the issue.',
          3: 'The sign is structured as problem → solution. First it tells us the danger koalas face (habitat loss, disease, bushfires), then it tells us what Taronga is doing about it. This helps the reader understand why the work matters.',
          4: 'Writers use numbers and facts to make their writing feel real and trustworthy. "10,000 koalas" is more powerful than just saying "a lot of koalas" — it shows the reader exactly how serious the problem is.',
          5: 'An "icon" is something that stands for something bigger — it represents a whole idea or identity. Calling koalas an "Aussie Icon" means they are seen as an important symbol of Australia, not just an animal.',
        },
        options: [
          'Koalas have been heavily impacted by habitat loss, disease, bushfires and drought',
          'Koalas are in danger and people are working hard to protect them',
          'The problem koalas face, followed by the action being taken to solve it',
          'That koala conservation is an urgent, evidence-based concern that demands action',
          'They represent koalas as both a cultural and shared responsibility',
        ],
        correct: 0,
        fact: 'The "An Aussie Icon" sign tells us koalas are in danger from habitat loss, disease, bushfires and drought. Writers use facts, numbers and structure to help readers understand and care about an issue.',
      },
    ],
  },

  // -- Tiger ------------------------------------------------------------------
  // English focus: Loss writing - language techniques to convey grief and conservation urgency
  tiger: {
    observationPrompt: 'You photographed this animal as a wildlife journalist. Now use your photo and the passage about loss as your models. Look at the tiger in front of you. What do you see that carries the weight of what is being lost?',
    writingPromptByStage: {
      1: 'Look at the tiger. Write one sentence about what you see and one sentence using a word or idea from the passage.',
      2: 'Look at the tiger. Write two sentences about what is being lost. Use an idea or phrase from the passage.',
      3: 'Write a short paragraph about the tiger and loss. Refer to something from the passage in your writing.',
      4: 'Write a paragraph about the tiger and loss. Use ideas or quotes from the passage to support what you are saying.',
      5: 'Write a piece about the tiger and loss. Refer to the passage and explain how its ideas connect to what you can see in front of you.',
    },
    expectedAnswers: {
      1: ['tiger', 'losing', 'world'],
      2: ['tiger', 'losing', 'erased', 'world'],
      3: ['tiger', 'loss', 'passage', 'erased', 'world'],
      4: ['tiger', 'loss', 'erased', 'world', 'passage'],
      5: ['tiger', 'loss', 'passage', 'erased', 'world', 'losing'],
    },
    questions: [
      {
        q: 'Language Techniques in a Conservation Passage',
        stageVariants: {
          1: 'Which word from the passage makes you feel sad or worried?',
          2: "Why does the writer choose 'erased' instead of 'gone'?",
          3: "What technique is used in 'the forest… breathing'?",
          4: 'How does the writer use contrast to convey loss?',
          5: "The passage calls the tiger 'what the world is losing.' What does this framing do to the reader?",
        },
        stageOptions: {
          1: ['layered', 'ancient', 'erased', 'breathing'],
          2: [
            'Because it is a shorter, punchier word',
            "'Erased' suggests the tigers were deliberately removed, making the loss feel like a human choice, not an accident",
            "'Erased' and 'gone' mean exactly the same thing",
            'Because the letter E sounds powerful',
          ],
          3: [
            "Simile: comparing the forest to a person using 'like' or 'as'",
            'Alliteration: repeating the same letter at the start of words',
            'Personification: giving the forest a human quality (breathing)',
            'Onomatopoeia: a word that sounds like the noise it describes',
          ],
          4: [
            'By describing the forest as beautiful and the tigers as dangerous',
            'By using long sentences followed by short ones to slow the reader down',
            "By placing 'thousands' against 'fewer than 400', showing the gap between those numbers and what has already been lost",
            'By comparing Sumatran tigers to other endangered animals',
          ],
          5: [
            'It uses a rhetorical question to make the reader think',
            'It creates a simile that compares the tiger to something disappearing',
            'It positions the reader to feel grief rather than just admiration, making the tiger evidence of loss, not just a living animal',
            'It uses alliteration to draw the reader\'s attention to the key idea',
          ],
        },
        stageCorrect: { 1: 2, 2: 1, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: '"Erased" is the most powerful word in this passage. It suggests the tigers were deliberately removed, not that they simply disappeared. Writers choose words carefully to shape how the reader feels.',
          2: 'Word choice (diction) controls the reader\'s emotional response. "Erased" implies deliberate action and positions the reader to feel responsible, not just sad. Writers choose words for the exact connotations they carry, not just their basic meaning.',
          3: 'Personification gives human qualities to non-human things. "Breathing" makes the forest feel alive and vital, which makes its destruction feel like a death. Naming the technique helps you use it in your own writing.',
          4: 'Contrast is one of the most powerful tools a writer has. Placing "thousands" next to "fewer than 400" forces the reader to feel the scale of loss. It makes the abstract (extinction) concrete and urgent. Now use this technique in your own writing.',
          5: 'Positioning is how writers shape the reader\'s relationship to their subject. By framing the tiger as "what the world is losing," the writer makes the reader feel responsible, not just an observer. Skilled writers always consider how their language positions the reader to think, feel and act.',
        },
        options: ['"erased"', "'Erased' suggests deliberate removal, making it a human choice, not an accident", 'Personification: giving the forest a human quality (breathing)', "Contrast: 'thousands' vs 'fewer than 400'", 'It positions the reader to feel grief, making the tiger evidence of loss'],
        correct: 2,
        fact: 'Language techniques (contrast, personification, word choice) are how writers make readers feel the weight of their subject. "Erased", "breathing", "thousands vs 400" are all deliberate choices that position the reader to grieve, not just observe.',
      },
    ],
  },

  // -- Dingo ------------------------------------------------------------------
  // English focus: Dreaming story - Warrigal and the Mundurra - perspective, theme, cultural meaning
  dingo: {
    observationPrompt: 'Look at the dingo in front of you. Think about Warrigal from the story - hungry, old, determined. What do you notice about this animal?',
    writingPromptByStage: {
      1: 'Imagine you are Warrigal. Write one or two sentences about how you feel. Use "I".',
      2: 'Imagine you are Warrigal, tired and facing the hunter. Write a short paragraph using "I". What are you feeling?',
      3: 'Imagine you are Warrigal at the moment you turn to face the hunter. Write a short paragraph using "I". What are you thinking and feeling?',
      4: 'Imagine you are Warrigal at the moment you decide to speak instead of run. Write from his point of view using "I". Include what he is thinking, feeling, and doing.',
      5: 'Write as Warrigal at the turning point — the moment he decides to speak instead of run. Use "I" and include what he is thinking, feeling, and doing. Use what you can see in the real dingo to make your writing feel real.',
    },
    expectedAnswers: {
      1: ['dingo', 'Warrigal', 'see'],
      2: ['dingo', 'Warrigal', 'story'],
      3: ['I', 'Warrigal', 'hunter'],
      4: ['I', 'Warrigal', 'hunter', 'old'],
      5: ['perspective', 'theme', 'partnership', 'I'],
    },
    questions: [
      {
        q: 'Warrigal and the Mundurra',
        stageVariants: {
          1: 'Why does Warrigal stop running away from the hunter?',
          2: 'Why does the old mundurra lower his spear and sit down?',
          3: 'Warrigal calls the hunter "old brother." How does this change the situation?',
          4: 'What does the writer suggest is more powerful than the urge to survive alone?',
          5: 'The story ends: "So did all their descendants - men and dogs." What kind of story is this, and what does that ending do?',
        },
        stageOptions: {
          1: [
            'He is too fast for the hunter and stops to rest',
            'He cannot run any further - he is too old and tired',
            'He decides he wants to fight',
            'He wants to make friends straight away',
          ],
          2: [
            'He has caught Warrigal and is resting before eating him',
            'He thinks Warrigal is too skinny to bother with',
            'He is also exhausted from the chase, and Warrigal\'s words give him a reason to stop',
            'He has spotted another animal to hunt',
          ],
          3: [
            'It insults the hunter and makes him more angry',
            'It reminds the hunter they are enemies',
            'It reframes their relationship - instead of predator and prey, they share something in common',
            'It confuses the hunter who does not understand dingoes',
          ],
          4: [
            'Youth and physical strength',
            'The hunter\'s skill with the spear',
            'Recognising a shared struggle and choosing to cooperate',
            'The dingo\'s speed and cunning',
          ],
          5: [
            'It is an adventure story - the ending shows what happened to the main characters',
            'It is an informative text - the ending summarises facts about dingoes',
            'It is a Dreaming story - the ending extends meaning beyond two characters to explain the origin of the bond between humans and dogs across all time',
            'It is a persuasive text trying to convince readers to respect dingoes',
          ],
        },
        stageCorrect: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: 'Age and exhaustion level the playing field. When neither hunter can keep going, both must find another way. Warrigal uses words instead of speed - that is how the story turns.',
          2: 'Warrigal uses words as tools. By naming a shared identity - "old brother" - he gives the hunter a reason to stop. Language, not strength, changes everything.',
          3: 'Shared vulnerability is stronger than rivalry. The moment Warrigal names what they have in common, the hunter stops thinking of him as prey. Connection comes from recognising what we share.',
          4: 'The story suggests that cooperation, born from recognising a shared struggle, is more powerful than competing alone. Both hunter and dingo eat better together than separately.',
          5: 'This is a Dreaming story - a form of Aboriginal storytelling that carries cultural knowledge and explains how the world came to be. The ending moves from a single event to a universal truth: the bond between humans and dogs began with one act of choosing partnership over predation.',
        },
        options: [
          'He cannot run any further - he is too old and tired',
          'He is also exhausted, and Warrigal\'s words give him a reason to stop',
          'It reframes their relationship - instead of predator and prey, they share something',
          'Recognising a shared struggle and choosing to cooperate',
          'It is a Dreaming story - the ending explains the origin of the bond between humans and dogs',
        ],
        correct: 1,
        fact: 'Dreaming stories carry cultural knowledge and explain how relationships in the world came to be. "Warrigal and the Mundurra" is not just a story about two old hunters - it explains why humans and dingoes have lived and hunted together ever since.',
      },
    ],
  },

  // -- Lemur ------------------------------------------------------------------
  // English focus: Point of view and narrative perspective - first vs third person
  lemur: {
    observationPrompt: 'Look at the lemurs in front of you. Think about what you just experienced in the dance game: leaping, foraging, calling, basking in the sun. Use both what you can see right now AND the moments from the game to write your story.',
    writingPromptByStage: {
      1: 'Look at the lemurs. Use what you can see AND what happened in the game to write a short story. Write as the LEMUR using first person: use "I".',
      2: 'Look at the lemurs in front of you. Use what you observe right now AND the dance game moments to write a short story. Write as the LEMUR using first person: use "I".',
      3: 'Look at the lemurs. Use your real observations AND the game behaviours to write a short creative story in first person. Write as the LEMUR using "I". Explain in one sentence how your perspective shapes the reader.',
      4: 'Use the lemurs you can see right now AND the dance game moments to write a short creative story in first person. Write as the LEMUR using "I".',
      5: 'Use your direct observation of the lemurs AND the game experience as your story material. Write a short creative story as the LEMUR in first person using "I". Analyse how first person positions the reader and constructs meaning.',
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
  // English focus: Persuasive writing - justify the new enclosure design
  'sea-lion': {
    observationPrompt: 'Think about the enclosure you just designed. You chose pools, enrichment toys, sustainability features - now use those choices as EVIDENCE to persuade the Taronga directors to build it.',
    writingPromptByStage: {
      1: 'Write ONE sentence to convince the Taronga directors to build your new sea lion enclosure. Start with "The sea lions need..."',
      2: 'Write two sentences to persuade the Taronga directors to build your enclosure. Mention one feature you included in your design and explain why it helps.',
      3: 'Write a short paragraph persuading the Taronga directors to approve your enclosure design. Include a reason and evidence from your design choices.',
      4: 'Write a persuasive paragraph to the Taronga directors arguing for your enclosure design. Use evidence from your design, name one persuasive technique you used, and explain its effect.',
      5: 'Write a persuasive argument to the Taronga directors for your enclosure design. Use evidence from your design, one or more persuasive techniques, and explain how your language is designed to position the directors to agree.',
    },
    expectedAnswers: {
      1: [],
      2: ['need', 'because', 'design', 'enclosure'],
      3: ['evidence', 'because', 'design', 'enclosure', 'directors'],
      4: ['technique', 'evidence', 'effect', 'design', 'directors'],
      5: ['technique', 'evidence', 'effect', 'position', 'persuade', 'directors'],
    },
    questions: [
      {
        q: 'Justifying Your Enclosure Design',
        stageVariants: {
          1: 'Which sentence gives the BEST reason for building a new sea lion enclosure?',
          2: 'Which sentence best uses EVIDENCE to justify building the new enclosure?',
          3: 'Which argument would be MOST persuasive to Taronga directors when justifying a new enclosure?',
          4: 'A student writes: "Research shows sea lions need deep pools to perform natural diving - our design includes three large pools that meet this need." What makes this argument persuasive?',
          5: 'Which approach would make a persuasive case for a new sea lion enclosure MOST effective?',
        },
        stageOptions: {
          1: ['Sea lions live in water', 'Sea lions are in many zoos', 'It gives sea lions more space to swim, play and be healthy', 'Sea lions have been at Taronga for years'],
          2: ['I think sea lions are interesting', 'The enclosure is okay', 'Sea lions need deep pools and toys and our design includes both', 'Someone should help the sea lions'],
          3: ['Sea lions are cute to watch', 'The enclosure costs a lot', 'Our design is good for sea lions and the environment', 'We worked really hard on it'],
          4: ['It uses emotional language to make readers feel sorry', 'It repeats "sea lions" many times', 'It uses evidence to support a logical claim', 'It asks a question to engage the reader'],
          5: ['Use only emotional language', 'Focus on how exciting the design looks', 'Combine evidence with clear reasoning about how the design helps sea lions', 'Repeat your main point as many times as possible'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: 'The strongest justification focuses on what the animal needs and how the enclosure meets those needs. Mentioning swimming space, play and a healthy life gives the directors concrete reasons to say yes.',
          2: 'Using specific features from your design as evidence ("deep pools", "enrichment toys") makes your argument much stronger than a vague opinion. Evidence backs up your claim.',
          3: 'The most persuasive arguments consider what matters to the audience. Directors care about animal welfare AND sustainability - an argument that addresses both is more likely to succeed.',
          4: 'Linking a specific need ("natural diving") to a specific design choice ("three large pools") shows logical reasoning backed by evidence. This is far more persuasive than emotion alone.',
          5: 'The most effective persuasive writing combines evidence (your design choices), reasoning (why those choices help the sea lions) and awareness of the audience (what the directors value - animal welfare and sustainability).',
        },
        options: ['It gives sea lions more space to swim, play and be healthy', 'Sea lions need deep pools and toys and our design includes both', 'Our design is good for sea lions and the environment', 'It uses evidence to support a logical claim', 'Combine evidence with clear reasoning about how the design helps sea lions'],
        correct: 2,
        fact: 'Persuasive writing is strongest when it combines evidence, clear reasoning and audience awareness. Using your design choices as evidence, explaining why they help the sea lions, and connecting to what directors care about makes your argument hard to refuse.',
      },
    ],
  },

  // -- Asian Water Buffalo ----------------------------------------------------
  // English focus: Figurative language - personification
  // English focus: Informative writing - buffalo hooves as an adaptation
  'asian-water-buffalo': {
    observationPrompt: 'Look at the Asian water buffalo — especially its feet. Notice how large and wide-spread the hooves are. You are going to write an informative text explaining buffalo hooves and how they help this animal survive in muddy, wet environments.',
    writingPromptByStage: {
      1: 'Look at the buffalo\'s feet. Write one sentence about what the hooves look like.',
      2: 'Look at the buffalo\'s feet. Write two sentences — what do the hooves look like, and what do you think they help the buffalo do?',
      3: 'Look at the buffalo\'s hooves. Write a short paragraph — what do they look like, and how do they help the buffalo?',
      4: 'Look at the buffalo\'s hooves. Write a paragraph describing what they look like, what they do, and why they help the buffalo in muddy ground.',
      5: 'Look at the buffalo\'s hooves. Write a paragraph explaining how the hooves help the buffalo in its environment. Describe their shape and explain what job they do.',
    },
    expectedAnswers: {
      1: [],
      2: ['hooves', 'buffalo', 'mud', 'wide', 'spread', 'help'],
      3: ['hooves', 'wide', 'mud', 'weight', 'habitat', 'adapt'],
      4: ['adaptation', 'hooves', 'weight', 'mud', 'habitat', 'function', 'spread'],
      5: ['adaptation', 'structure', 'function', 'habitat', 'weight', 'distribute', 'environment'],
    },
    questions: [
      {
        q: 'Capital Letters & Full Stops',
        stageVariants: {
          1: 'Which sentence is written correctly?',
          2: 'Which sentence starts with a capital letter AND ends with a full stop?',
          3: 'Which sentence uses capital letters correctly?',
          4: 'Why does this sentence start with a capital letter? "Buffalo hooves spread their weight to stop them sinking in mud."',
          5: 'Which sentence is punctuated correctly?',
        },
        stageOptions: {
          1: [
            'asian water buffalo have wide hooves',
            'The buffalo splashed in the mud',
            'Asian water buffalo have wide hooves.',
            'buffalo hooves are big.',
          ],
          2: [
            'the buffalo has very wide hooves.',
            'Wide hooves help the buffalo walk in mud',
            'Buffalo hooves help them walk in muddy ground.',
            'buffalo hooves are flat',
          ],
          3: [
            'the Buffalo has wide hooves.',
            'Asian water buffalo live Near rivers.',
            'Asian water buffalo live near rivers.',
            'asian Water Buffalo live near rivers.',
          ],
          4: [
            'Because Buffalo is an important word',
            'Because every sentence starts with a capital letter',
            'Because it is a place name',
            'Because it is the animal\'s scientific name',
          ],
          5: [
            'buffalo hooves are wide and flat, they help the animal walk in mud',
            'Buffalo hooves are wide and flat. they help the animal walk in mud.',
            'Buffalo hooves are wide and flat. They help the animal walk in mud.',
            'Buffalo hooves are wide and flat, They help the animal walk in mud.',
          ],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 2 },
        stageFacts: {
          1: 'Every sentence needs a capital letter at the start and a full stop at the end. "Asian water buffalo have wide hooves." is correct because it starts with a capital A and ends with a full stop.',
          2: 'A correct sentence always starts with a capital letter and ends with a full stop. "Buffalo hooves help them walk in muddy ground." does both — the others are missing one or both.',
          3: 'The first word of a sentence always needs a capital letter. "Asian water buffalo live near rivers." is correct — it starts with a capital A and doesn\'t add extra capitals in the middle.',
          4: 'Every sentence must start with a capital letter — this is a basic rule of English. It doesn\'t matter what the word is, the first word always gets a capital.',
          5: 'When you write two sentences, each one needs its own capital letter and full stop. "Buffalo hooves are wide and flat. They help the animal walk in mud." — notice "They" gets a capital because it starts a new sentence.',
        },
        options: [
          'asian water buffalo have wide hooves',
          'Wide hooves help the buffalo walk in mud',
          'Asian water buffalo have wide hooves.',
          'buffalo hooves are big.',
        ],
        correct: 2,
        fact: 'Every sentence starts with a capital letter and ends with a full stop. "Asian water buffalo have wide hooves." is correct — it starts with a capital A and ends with a full stop.',
      },
    ],
  },

  // -- Concert Lawn -----------------------------------------------------------
  // English focus: Personification - giving a tree a human voice
  'concert-lawn': {
    observationPrompt: 'Walk to a tree near the Concert Lawn. Stand beside it and look up. Think about how old it might be and everything it might have witnessed over its lifetime. You are going to give this tree a human voice.',
    writingPromptByStage: {
      1: 'Find a tree near the Concert Lawn. Look at how big and old it is. Write what the tree might have seen in its life.',
      2: 'Find a tree near the Concert Lawn. Imagine it has been there for many years. Write what it might have seen or heard over its lifetime.',
      3: 'Find a tree near the Concert Lawn and observe it carefully. Use personification to give it a voice. Write what it might have seen and how it might have felt through the seasons and years.',
      4: 'Find an old tree near the Concert Lawn and observe it closely. Write a piece using personification to give the tree a perspective on its long life. What has it witnessed? What does it feel?',
      5: 'Find an old tree near the Concert Lawn. Write a piece that uses personification to give the tree a voice and perspective. Use your real observations to ground the writing in specific detail. Explore what the tree\'s long existence might reveal about time, nature and the human world around it.',
    },
    expectedAnswers: {
      1: [],
      2: ['tree', 'saw', 'heard', 'felt'],
      3: ['personification', 'tree', 'felt', 'watched', 'seasons'],
      4: ['personification', 'witnessed', 'perspective', 'voice'],
      5: ['personification', 'time', 'nature', 'perspective', 'human'],
    },
    questions: [
      {
        q: 'Personification',
        stageVariants: {
          1: 'Which sentence gives the tree a human quality?',
          2: 'Which sentence uses personification?',
          3: 'Which sentence uses personification to suggest the tree has wisdom or memory?',
          4: 'What does this sentence do? "The tree watched generations come and go, patient as stone."',
          5: 'What effect does personification create when writing about nature?',
        },
        stageOptions: {
          1: [
            'The tree is very tall and old',
            'The wind blew through the leaves',
            'The tree stretched out its arms to welcome us',
            'The tree is made of wood and bark',
          ],
          2: [
            'Trees can live for hundreds of years',
            'The sun was very bright today',
            'Many birds live in the canopy',
            'The old tree sighed as the last visitor left',
          ],
          3: [
            'The trunk of the tree is very thick',
            'The tree nodded slowly, as if it had heard it all before',
            'Trees absorb carbon dioxide',
            'The tree grew taller every year',
          ],
          4: [
            'It tells us a fact about how long trees live',
            'It compares the tree to stone',
            'It gives the tree human qualities, making it feel like a silent witness to time',
            'It uses rhyme to make it sound musical',
          ],
          5: [
            'It makes nature easier to understand by simplifying ideas',
            'It creates empathy by giving natural things human qualities, helping readers connect to the world around them',
            'It only works in poetry, not in prose',
            'It should be used sparingly because it weakens descriptive writing',
          ],
        },
        stageCorrect: { 1: 2, 2: 3, 3: 1, 4: 2, 5: 1 },
        stageFacts: {
          1: 'Personification gives human qualities to non-human things. "The ancient tree stretched out its arms" treats the branches as arms - that gives the tree a human feeling and makes it seem alive and welcoming.',
          2: '"The old tree sighed as the last visitor walked away" gives the tree a human action (sighing) and a sense of awareness. Personification makes non-human things feel emotionally present.',
          3: '"Nodded slowly, as if it had heard it all before" gives the tree wisdom and memory - human qualities that imply it has lived through many experiences. Personification of nature creates a sense of deep time and quiet knowledge.',
          4: 'By giving the tree the human ability to watch and feel patience, the writer creates the sense that the tree has been a silent witness to history. Personification makes the reader feel the tree\'s long life emotionally, not just intellectually.',
          5: 'Personification is one of the most powerful tools for writing about nature because it creates empathy. By attributing feelings, actions and awareness to natural things, writers position readers to care about and connect with the non-human world.',
        },
        options: [
          'The tree stretched out its arms to welcome us',
          'The old tree sighed as the last visitor left',
          'The tree nodded slowly, as if it had heard it all before',
          'It gives the tree human qualities, making it feel like a silent witness to time',
          'It creates empathy by giving natural things human qualities, helping readers connect to the world around them',
        ],
        correct: 0,
        fact: 'Personification gives human qualities (feelings, actions, voice) to non-human things like trees, wind and weather. It makes the natural world feel alive and emotionally meaningful, drawing the reader closer to it.',
      },
    ],
  },

  // -- Blue Mountains Bushwalk ------------------------------------------------
  // English focus: Recount text type
  // 3 questions: Q1 (Platypus) recount features, Q2 (Lizard) descriptive language in recount, Q3 (Lyrebird) onomatopoeia
  'blue-mountains-bushwalk': {
    observationPrompt: 'You have listened to this environment. Think about what you heard, what you noticed, what surprised you. Read the model recount text, then write your own.',
    writingPromptByStage: {
      1: 'Write a vivid recount of the bushwalk. What did you experience, hear and feel?',
      2: 'Write a vivid recount of the bushwalk. What did you experience, hear and feel?',
      3: 'Write a vivid recount of the bushwalk. What did you experience, hear and feel?',
      4: 'Write a vivid recount of the bushwalk. What did you experience, hear and feel?',
      5: 'Write a vivid recount of the bushwalk. What did you experience, hear and feel?',
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
