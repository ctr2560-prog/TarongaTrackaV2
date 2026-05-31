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
          1: 'Look at your graph. Which thing did the chimps do least? This could be the problem in a chimpanzee story.',
          2: 'Your graph shows how the chimps spent their time. Which behaviour is lowest? This is the conflict - the problem that drives your story.',
          3: 'Using your graph, identify the lowest behaviour. In your story plan, this is the conflict the chimpanzees must face. Which conflict does your graph suggest?',
          4: 'Your graph reveals a behavioural pattern. Which behaviour is lowest? As a writer, this becomes your story\'s central conflict - the problem that shapes the whole narrative.',
          5: 'Using your observational data, identify the lowest behaviour. This data-informed conflict is the foundation of your narrative. Which conflict does your graph suggest you develop?',
        },
        stageOptions: {
          1: [
            'Not enough rest - the chimps are worn out',
            'Not enough food - the chimps are hungry',
            'Not enough movement - the chimps are stuck',
            'All the same - no clear problem',
          ],
          2: [
            'Lack of rest - exhaustion threatens the group',
            'Food shortage - the group faces a feeding crisis',
            'Lack of movement - something is stopping the chimps',
            'Balanced - no strong conflict appears',
          ],
          3: [
            'Lack of rest - fatigue or stress is disrupting the group',
            'Food scarcity - a famine or competition for resources',
            'Restricted movement - illness, injury or loss of territory',
            'All behaviours are balanced - no single conflict is clear',
          ],
          4: [
            'Rest deprivation - the group\'s survival is threatened by exhaustion',
            'Feeding crisis - scarcity or competition for food drives the conflict',
            'Movement restriction - isolation, illness or territorial threat limits the group',
            'Behavioural balance - no dominant conflict, suggesting a subtler tension',
          ],
          5: [
            'Rest deprivation - a conflict rooted in fatigue, stress or social disruption',
            'Feeding crisis - a conflict exploring survival, scarcity or social hierarchy',
            'Movement restriction - a conflict built on isolation, illness or territorial loss',
            'Behavioural equilibrium - a nuanced tension without a single dominant conflict',
          ],
        },
        stageCorrect: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        stageFacts: {
          1: 'Great story planning! The thing the chimps do least becomes the problem in your story. Writers often start with a real observation and ask: "What if this went wrong?"',
          2: 'Good planning! The lowest behaviour is the conflict - the problem that creates tension in your story. A writer looks at what is missing or under threat and builds a narrative around it.',
          3: 'Well identified. Using real data to inform a conflict is how professional writers work. The lowest behaviour reveals what is under pressure - and pressure creates narrative tension.',
          4: 'Strong planning. Data-informed conflicts are more grounded and believable. By using your graph you are building a narrative on real observed behaviour, not just imagination.',
          5: 'Excellent analytical planning. The lowest behaviour reveals a latent tension in the group. Skilled writers use observed detail to construct conflicts that feel authentic and thematically rich.',
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
          2: 'Why does Kito move "slowly - very slowly" across the enclosure?',
          3: 'What does "Jabari did not move" suggest about the situation?',
          4: 'How does the writer build tension in this passage?',
          5: 'What narrative technique does the writer use to end the passage, and why is it effective?',
        },
        stageOptions: {
          1: [
            'A new gorilla entering the enclosure',
            'The keeper arriving with food',
            'Jabari moving toward the leaves',
            'The untouched Gorilla Whopper burger',
          ],
          2: [
            'He is tired after a long morning of resting',
            'He is being careful not to wake the sleeping gorillas',
            'He is teaching the younger gorillas how to walk',
            'He does not want Jabari to notice him moving toward the burger',
          ],
          3: [
            'Jabari is asleep and completely unaware of Kito',
            'Jabari has already eaten and does not want the burger',
            'Jabari is friendly and always lets younger gorillas take food',
            'The danger is still present - Jabari\'s stillness creates uncertainty about whether he has noticed Kito',
          ],
          4: [
            'By using long, complex sentences that slow the pace of the action',
            'By describing the burger in great detail so the reader understands its importance',
            'By having Jabari speak and make his intentions clear',
            'Through Kito\'s careful observation and hesitation, contrasted with Jabari\'s watchful stillness',
          ],
          5: [
            'A cliffhanger that immediately reveals what the silverback does next',
            'A resolved ending where Kito successfully claims the burger without consequence',
            'A flashback that explains how Jabari first became the silverback',
            'An open, unresolved moment - "Kito began to cross" leaves the outcome uncertain, placing the reader in suspense alongside Kito',
          ],
        },
        stageCorrect: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
        stageFacts: {
          1: 'Well done! Kito spotted the untouched burger. Good readers notice the important details that drive the story forward.',
          2: 'Good reading! Kito moves slowly because he does not want to attract Jabari\'s attention. When a younger gorilla challenges the silverback - even for a burger - there are real consequences.',
          3: 'Well identified. A still, watchful silverback is more threatening than an active one. The reader does not know if Jabari has noticed Kito - that uncertainty IS the tension.',
          4: 'Good analysis. The tension comes from contrast - Kito\'s quiet intention against the group\'s stillness. The reader sees Kito\'s risk even before Jabari reacts.',
          5: 'Excellent analysis. By ending mid-action, the writer leaves the reader in the same uncertainty as Kito. We do not know if he will succeed - which compels us to read on.',
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
    observationPrompt: 'Zoom in and look at the lion closely — its coat, eyes, mane and the way it holds itself. You are going to use imagery: language that creates a vivid picture in the reader\'s mind. What specific details can you see? What do the colours and textures remind you of?',
    writingPromptByStage: {
      1: 'Look at the lion. Write one sentence that creates an image — describe its colour, size or movement using a vivid word or comparison.',
      2: 'Look at the lion carefully. Write two sentences using imagery to describe what you see. Think about its coat, eyes, mane or the way it moves.',
      3: 'Observe the lion closely. Write a short paragraph using imagery to describe what you see. Include at least two specific sensory details.',
      4: 'Observe the lion. Write a descriptive paragraph using imagery to bring the lion to life for the reader. Include specific visual details and an unexpected comparison.',
      5: 'Observe the lion carefully. Write a descriptive piece using imagery to create a vivid impression of the lion. Choose language that surprises the reader and makes them see the lion in a new way. Consider how your word choices position the reader.',
    },
    expectedAnswers: {
      1: ['like', 'as', 'golden', 'amber', 'lion'],
      2: ['like', 'as', 'imagery', 'colour', 'lion'],
      3: ['imagery', 'like', 'as', 'lion', 'because'],
      4: ['imagery', 'like', 'as', 'effect', 'reader', 'lion'],
      5: ['imagery', 'effect', 'reader', 'language', 'position', 'lion'],
    },
    questions: [
      {
        q: 'Imagery in Descriptive Writing',
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
          2: 'Read the "An Aussie Icon" sign. What is the main message the sign wants you to understand?',
          3: 'Read the "An Aussie Icon" sign. The sign is divided into two sections. What idea does this two-part structure represent?',
          4: 'Read the "An Aussie Icon" sign. It uses specific statistics: "10,000 Koalas" and "extinct by 2050". What value do these details represent?',
          5: 'Read the "An Aussie Icon" sign. It calls koalas "An Aussie Icon" and notes conservation work is "proudly supported by Visa". How do these two choices together construct a particular set of values?',
        },
        stageOptions: {
          1: [
            'Koalas have been heavily impacted by habitat loss, disease, bushfires and drought',
            'Koalas do not have enough food at the zoo',
            'Koalas are sleeping too much',
            'Koalas are difficult to look after in a zoo',
          ],
          2: [
            'Koalas are in danger and people are working hard to protect them',
            'Koalas are Australia\'s most popular zoo animal',
            'Bushfires only happened in 2019 and 2020',
            'Visa is the most important conservation organisation in Australia',
          ],
          3: [
            'The problem koalas face, followed by the action being taken to solve it',
            'There are two types of koalas in Australia',
            'Two different zoos that help koalas survive',
            'The past history and future plans of Taronga Zoo',
          ],
          4: [
            'That koala conservation is an urgent, evidence-based concern that demands action',
            'That the problem is too big to ever fix',
            'That science and data are less important than personal stories',
            'That only large organisations like Taronga can make a difference',
          ],
          5: [
            'They represent koalas as both a cultural and shared responsibility, linking national identity with conservation values',
            'They suggest koalas are only valuable because of corporate sponsorship',
            'They imply that Australian identity is defined entirely by wildlife',
            'They suggest Visa is more important than the koalas themselves',
          ],
        },
        stageCorrect: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        stageFacts: {
          1: 'The sign tells us koalas face "habitat loss, disease, bushfires and drought." These are the real challenges facing koalas in the wild. The sign uses this information to help us understand why koalas need our help.',
          2: 'The sign has two main ideas: the threat to koalas (habitat loss, disease, bushfires) and the positive action being taken (Taronga\'s conservation commitment). Together they represent the value of protecting Australian wildlife.',
          3: 'The two-section structure (threat then commitment) is deliberate. It represents a problem-solution pattern that guides the reader from concern to hope. This is how writers shape the way readers understand and feel about an issue.',
          4: 'Using specific statistics ("10,000 Koalas", "12 million hectares", "extinct by 2050") represents the value that conservation must be grounded in evidence. These numbers create urgency and credibility, positioning the reader to take the issue seriously.',
          5: '"An Aussie Icon" positions koalas as part of Australian cultural identity - a shared national value. The corporate sponsorship note links that cultural value to commercial responsibility. Together, they represent conservation as both a community and a corporate obligation.',
        },
        options: [
          'Koalas have been heavily impacted by habitat loss, disease, bushfires and drought',
          'Koalas are in danger and people are working hard to protect them',
          'The problem koalas face, followed by the action being taken to solve it',
          'That koala conservation is an urgent, evidence-based concern that demands action',
          'They represent koalas as both a cultural and shared responsibility',
        ],
        correct: 0,
        fact: 'The "An Aussie Icon" sign represents the value of conservation through its language, structure and evidence. Writers make deliberate choices about what ideas to include, how to organise them, and what words to use - all to shape what readers think, feel and value.',
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
          1: ['Sea lions are animals that live in the water', 'Sea lions are found in many zoos around the world', 'The new enclosure will give sea lions more space to swim, play and live a healthy life', 'Sea lions have been at Taronga Zoo for many years'],
          2: ['I think sea lions are very interesting animals', 'The sea lion enclosure at Taronga is okay', 'Sea lions need deep pools and enrichment toys to stay healthy - our new design includes both', 'Someone should help the sea lions'],
          3: ['Sea lions are cute and people like watching them', 'The enclosure will cost a lot of money to build', 'Our design balances animal wellbeing and sustainability - it is good for the sea lions AND the environment', 'We worked really hard on the design'],
          4: ['It uses emotional language to make the reader feel sorry for the sea lions', 'It repeats the word "sea lions" many times', 'It uses evidence and expert knowledge to support a logical claim', 'It asks a rhetorical question to engage the reader'],
          5: ['Use only emotional language to make the directors feel guilty', 'Focus on how exciting the new design looks for zoo visitors', 'Combine evidence from your design with clear reasoning about how each feature benefits the sea lions and the zoo\'s sustainability goals', 'Repeat your main point as many times as possible'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: 'The strongest justification focuses on what the animal needs and how the enclosure meets those needs. Mentioning swimming space, play and a healthy life gives the directors concrete reasons to say yes.',
          2: 'Using specific features from your design as evidence ("deep pools", "enrichment toys") makes your argument much stronger than a vague opinion. Evidence backs up your claim.',
          3: 'The most persuasive arguments consider what matters to the audience. Directors care about animal welfare AND sustainability - an argument that addresses both is more likely to succeed.',
          4: 'Linking a specific need ("natural diving") to a specific design choice ("three large pools") shows logical reasoning backed by evidence. This is far more persuasive than emotion alone.',
          5: 'The most effective persuasive writing combines evidence (your design choices), reasoning (why those choices help the sea lions) and awareness of the audience (what the directors value - animal welfare and sustainability).',
        },
        options: ['The new enclosure gives sea lions more space to swim, play and live healthily', 'Sea lions need deep pools and enrichment - our design includes both', 'Our design balances animal wellbeing and sustainability', 'It uses evidence and expert knowledge to support a logical claim', 'Combine design evidence with clear reasoning about animal welfare and sustainability'],
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
      1: 'Write one sentence telling someone what buffalo hooves look like or what they do.',
      2: 'Write two sentences to inform someone about buffalo hooves. Include what they look like and what they help the buffalo do.',
      3: 'Write a short informative paragraph about buffalo hooves. Include what they look like, what they do, and why this helps the buffalo.',
      4: 'Write an informative paragraph about buffalo hooves as an adaptation. Include what they look like, how they function, and why this suits the buffalo\'s habitat.',
      5: 'Write an informative response explaining how buffalo hooves are adapted to their environment. Include structural features, function, and the relationship between the adaptation and the buffalo\'s habitat.',
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
        q: 'Buffalo Hooves',
        stageVariants: {
          1: 'What makes buffalo hooves special compared to most animals?',
          2: 'What do wide, splayed hooves help the buffalo do?',
          3: 'Why do buffalo have wide, spreading hooves?',
          4: 'How do buffalo hooves help them survive in their natural swampy habitat?',
          5: 'Which sentence best explains the relationship between buffalo hoof structure and their environment?',
        },
        stageOptions: {
          1: ['Buffalo hooves are very small and delicate', 'Buffalo hooves are very soft and flexible', 'Buffalo hooves are wide and spread out to stop the buffalo sinking in mud', 'Buffalo hooves are bright and shiny in colour'],
          2: ['Run much faster than other large animals', 'Climb steep and rocky hills easily', 'Walk through muddy and swampy ground without sinking', 'Swim underwater for long distances'],
          3: ['To make noise when they walk so predators hear them coming', 'To grip onto tree branches when they rest at night', 'To spread their weight across soft, wet ground so they do not sink', 'To dig deep holes in the earth for shelter'],
          4: ['They are thin and sharp, cutting through thick mud quickly', 'They contain air pockets that help the buffalo float in deep water', 'They spread wide to distribute the buffalo\'s weight, giving grip and stability in wet, muddy ground', 'They are covered in rough skin that absorbs moisture from the ground'],
          5: ['Buffalo hooves are hardened by contact with dry soil, which strengthens the outer shell over time', 'The narrow shape of buffalo hooves allows them to pierce through dense vegetation on the forest floor', 'Buffalo hooves are wide and cloven, distributing the animal\'s substantial weight across soft, wet ground — a structural adaptation to marshy, swampy habitats', 'Buffalo hooves grow continuously throughout their life to compensate for wear on rocky terrain'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: 'Buffalo hooves are wide and spread out — this is called being "splayed". It stops the buffalo\'s heavy body from sinking into soft, muddy ground, just like snowshoes help people walk on snow.',
          2: 'Wide, splayed hooves work like snowshoes — they spread the buffalo\'s weight over a larger area, stopping them from sinking when walking through swampy or flooded ground.',
          3: 'Buffalo are adapted to wet, muddy environments like rice paddies and swamps. Their wide, spreading hooves distribute their weight so they can walk across soft ground without getting stuck.',
          4: 'The wide, cloven (split) hooves of the buffalo act like natural snowshoes, spreading their heavy weight (up to 700 kg) across a larger surface area. This gives them stability and grip in the swampy, flooded habitats where they evolved.',
          5: 'The buffalo\'s wide, cloven hooves are a structural adaptation to wetland habitats. By spreading across soft mud, they distribute the animal\'s weight over a wider surface area — preventing sinking and providing traction in the swampy environments where Asian water buffalo evolved.',
        },
        options: ['Very wide and spread out, stopping them sinking in mud', 'Walk through muddy and swampy ground without sinking', 'Spread their weight across soft, wet ground so they do not sink', 'Wide and cloven, distributing weight — a structural adaptation to swampy habitats', 'Wide and cloven, distributing weight across soft wet ground — adapted to swampy habitats'],
        correct: 2,
        fact: 'Asian water buffalo have wide, cloven (split) hooves that spread out to distribute their heavy weight across soft, muddy ground. This adaptation lets them walk through swamps and flooded rice paddies without sinking — essential for survival in their natural wetland habitat.',
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
          4: 'Which statement best explains how personification works in this sentence: "The tree watched generations come and go, patient as stone"?',
          5: 'Which analysis best explains the effect of personification on the reader in a piece about nature?',
        },
        stageOptions: {
          1: [
            'The tree is very tall and old',
            'The wind blew through the leaves',
            'The ancient tree stretched out its arms to welcome us',
            'The tree is made of wood and bark',
          ],
          2: [
            'Trees can live for hundreds of years',
            'The sun was very bright today',
            'Many birds live in the canopy',
            'The old tree sighed as the last visitor walked away',
          ],
          3: [
            'The trunk of the tree is very thick',
            'The tree nodded slowly in the breeze, as if it had heard it all before',
            'Trees absorb carbon dioxide during photosynthesis',
            'The tree grew taller every year',
          ],
          4: [
            'It tells us a fact about how long trees live',
            'It uses a simile to compare the tree to stone',
            'It gives the tree human qualities (watching, patience), making the reader feel the tree has experienced and endured the passage of time',
            'It uses rhyme to make the sentence sound musical',
          ],
          5: [
            'Personification makes texts about nature easier to understand by simplifying complex ideas',
            'By giving natural things human qualities, personification creates empathy - it positions the reader to experience the world from a non-human perspective, deepening emotional engagement with the environment',
            'Personification is only effective in poetry and does not work in prose',
            'Personification replaces precise descriptive language and should be used sparingly',
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
          'The ancient tree stretched out its arms to welcome us',
          'The old tree sighed as the last visitor walked away',
          'The tree nodded slowly, as if it had heard it all before',
          'It gives the tree human qualities, making the reader feel the tree has experienced the passage of time',
          'By giving natural things human qualities, personification creates empathy and positions the reader to experience the world from a non-human perspective',
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
