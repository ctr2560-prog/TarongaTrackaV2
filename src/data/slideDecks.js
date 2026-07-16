// slideDecks.js — 32 pre/post excursion slide decks for Taronga Tracka
// 4 subjects × 4 stages × 2 timings = 32 decks

export const SUBJ_META = {
  science: { label: 'Science & Technology', color: '#1A5238', light: 'rgba(26,82,56,0.15)',   border: 'rgba(26,82,56,0.35)' },
  maths:   { label: 'Mathematics',          color: '#0369A1', light: 'rgba(3,105,161,0.15)',  border: 'rgba(3,105,161,0.35)' },
  english: { label: 'English',              color: '#7C3AED', light: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.35)' },
  pdhpe:   { label: 'PDHPE',                color: '#BE185D', light: 'rgba(190,24,93,0.15)',  border: 'rgba(190,24,93,0.35)' },
}

// ---------------------------------------------------------------------------
// BRAIN BREAKS
// ---------------------------------------------------------------------------
const BRAIN_BREAKS = [
  {
    name: 'Animal Charades',
    instruction: 'Split into pairs. One person acts out a Taronga Zoo animal — no sounds allowed! Your partner has 30 seconds to guess. Swap and go again. Who can act out the trickiest animal?',
  },
  {
    name: 'Safari Sketch',
    instruction: 'You have exactly 60 seconds to draw a Taronga Zoo animal. No words — just drawing. Show the class and see who can guess it fastest. Most creative wins!',
  },
  {
    name: 'Conservation Countdown',
    instruction: 'Stand up! Call out one fact about any Taronga animal you remember. Sit down after you\'ve shared. Keep going until everyone is seated. No repeating facts!',
  },
  {
    name: 'Animal Alphabet',
    instruction: 'Starting from A, take turns around the room naming a different animal for each letter. Miss a letter or hesitate and you\'re out. How far can the class get before someone is stumped?',
  },
  {
    name: 'Keeper Questions',
    instruction: 'You\'re a Taronga zookeeper for 60 seconds. What three questions would you need answered every morning to know an animal is healthy? Share your questions — class rates the best three.',
  },
  {
    name: 'Habitat Hustle',
    instruction: 'On the count of 3, everyone move as if you\'re in a... JUNGLE (teacher calls it). Then: OCEAN. Then: SAVANNA. Then: RAINFOREST. You have 20 seconds per habitat — commit to the movement!',
  },
  {
    name: 'Species Showdown',
    instruction: 'Two animals enter the arena — one wins. Teacher names two animals from Taronga. Vote: which has the BEST adaptation for survival? You have 30 seconds to defend your choice to a partner. Class debate!',
  },
  {
    name: 'Zoo Emoji',
    instruction: 'Using only emojis (or quick sketches if no device), describe an animal from Taronga Zoo. Show a partner — can they decode your message and name the animal?',
  },
]

// ---------------------------------------------------------------------------
// CONTENT DATA
// ---------------------------------------------------------------------------
const CONTENT = {
  science: {
    2: {
      topic: 'Living Things & Habitats',
      outcomes: ['ST2-4LW-S', 'ST2-2DP-T'],
      li: 'Identify the features and behaviours of animals that help them survive in their habitat.',
      sc: [
        'I can name at least two features of an animal and explain how they help it survive',
        'I can observe an animal at the zoo and record what I notice',
        'I can link an animal\'s behaviour to its needs — food, safety, or shelter',
      ],
      preDiscussion: {
        heading: 'What Do We Already Know?',
        context: 'Over the past few weeks we have been learning about living things, habitats and what animals need to survive. Before we head to Taronga Zoo in a few days, let\'s explore what you already know and what you\'re still curious about.',
        prompts: [
          'Turn and talk: name one animal and describe what it needs to survive in its natural habitat. What would happen if just one of those things was taken away?',
          'What is a habitat? Can you think of three very different habitats and name one animal that lives in each? What is special about each animal\'s body that suits its home?',
          'Why do some animals have sharp claws, thick fur or bright colours? What do you think these features help them do — and could they survive without them?',
          'At Taronga Zoo we\'ll use an app called Taronga Tracka to record what we see. What do you think makes a really great animal observation? What details would you write down?',
        ],
        trackaNotes: 'In Taronga Tracka, you will navigate to animal enclosures on a map, watch the animals carefully, and write an observation about what you see them doing. The app scores your writing based on how specific and detailed it is — so think about what you\'ll focus on for each animal, and remember that one excellent sentence is worth more than four vague ones.',
        teacherNote: 'Use this discussion 2–3 days before the excursion to activate prior knowledge. Draw out what students already know and help them form questions they genuinely want to answer at the zoo.',
      },
      postDiscussion: {
        heading: 'Welcome Back — Let\'s Debrief',
        context: 'A couple of days ago you visited Taronga Zoo and used Taronga Tracka to make real animal observations. Before we dive into our post-visit activities, let\'s take some time to share what we saw, what surprised us, and what we\'re still thinking about.',
        prompts: [
          'Share one moment from the zoo visit that you\'re still thinking about — what made it stick in your memory?',
          'Which animal did you observe most carefully? What was it doing when you recorded your observation in Tracka?',
          'Did any animal do something that surprised or confused you? What did you think was happening, and what might have caused that behaviour?',
          'If you could go back and look more closely at one thing, what would it be — and why would that extra time help your science understanding?',
        ],
        teacherNote: 'Use this as an open debrief before moving into post-visit content. There are no wrong answers — the goal is reconnecting with the experience before formal analysis begins.',
      },
      preContent: [
        {
          heading: 'What Do Animals Need?',
          bullets: [
            'Every living animal — from a tiny beetle to a mighty elephant — needs the same basic things to survive: food for energy, clean water to stay hydrated, shelter to stay safe, and air to breathe. Without any one of these essentials, an animal cannot live for long, which is why the habitat it lives in is so incredibly important.',
            'Some animals have incredible features called adaptations that help them survive in their specific environment. A polar bear\'s thick white fur keeps it warm in the freezing Arctic, a camel\'s hump stores fat for long desert journeys, and a stick insect looks exactly like a twig so predators walk straight past. At Taronga Zoo in a few days, you\'ll meet animals from rainforests, savannas, oceans and coasts — every one of them perfectly suited to where they come from.',
          ],
        },
        {
          heading: 'Habitats Around the World',
          bullets: [
            'A habitat is the natural home of an animal — the place where it finds food, water, shelter and everything else it needs to raise its young and stay alive. Taronga Zoo cares for animals from some of the world\'s most extraordinary and diverse habitats, from the dense Sumatran rainforest to the wide open African savanna, and each animal\'s body is specifically built to match the conditions of its home.',
            'When human activity destroys a habitat — through land clearing, pollution or the changing climate — the animals that depend on it can face extinction. Taronga Zoo plays a vital role in protecting species that are struggling to survive in the wild, giving them a safe home and supporting active conservation programs in their natural habitats around the world.',
          ],
        },
        {
          heading: 'Getting Ready to Observe',
          bullets: [
            'In a few days you will visit Taronga Zoo and use the Taronga Tracka app to make real observations of the animals in their enclosures. Your job is to watch carefully and write about what you see — not just what the animal looks like, but what it is actually doing and why that behaviour might be important for its survival.',
            'Think about what a great scientific observation sounds like: "the tiger was sitting" tells us very little, but "the tiger paced slowly along the fence line, pausing to sniff the air and raise its head" tells a scientist something real. The Tracka app scores your observations based on how specific and detailed your writing is, so every precise word counts.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'What Did We Discover?',
          bullets: [
            'A couple of days ago you were at Taronga Zoo watching real animals in their enclosures, and now it\'s time to think carefully about what you found. Share with the class: what was the most surprising behaviour or feature you observed, and how does it connect to what that animal needs to survive in the wild?',
            'Look back at your Tracka observation and find your single best sentence — the one that describes something specific the animal was doing. Read it aloud. As a class, can you identify which survival need that behaviour was serving — food, safety, shelter, or social connection?',
          ],
        },
        {
          heading: 'Features and Survival',
          bullets: [
            'When you were at Taronga Zoo, you were watching animals that have been shaped by millions of years of evolution to survive in their specific habitats. Think about the animal you observed most closely: what physical features — teeth, feet, colouring, eyes, limbs — stood out to you, and what does each one help the animal do?',
            'Scientists call the connection between an animal\'s features and its survival "conservation biology" — the study of how living things cope with threats to their existence. If the wild habitat of your chosen animal was destroyed tomorrow, which of its features would give it the best chance of adapting, and which would make survival very difficult?',
          ],
        },
        {
          heading: 'Linking Animals to Habitats',
          bullets: [
            'Every animal at Taronga Zoo comes from a specific wild habitat with its own climate, food sources, predators and shelter. When you observed your chosen animal, you were seeing a creature that has been perfectly shaped by its wild home — even though it was standing in an enclosure in Mosman, its body tells the story of where it came from.',
            'Taronga\'s conservation work is about making sure these animals still have wild habitats to return to, and that their populations remain strong enough to survive into the future. The observations you made with Tracka are the kind of detailed records that real field scientists use — and every specific detail you noticed contributes to understanding what makes these species thrive.',
          ],
        },
      ],
      preChecklist: [
        'Choose 3 animals you most want to observe — write them down now',
        'For each animal: decide what specific feature or behaviour you\'ll focus on',
        'Which things from class can you connect to each animal?',
        'Read the Tracka scoring guide — what makes an observation earn full marks?',
      ],
      postAction: [
        'Animal Habitat Diorama',
        'Choose one animal you observed at Taronga Zoo. Create a 3D diorama (shoebox, cardboard, natural materials) showing its wild habitat. Include the animal, 3 things it needs to survive, and a fact card about threats to this habitat. Present your diorama to the class.',
      ],
      exitPre: [
        'Name one animal you already know about and describe one feature that helps it survive.',
        'What question do you most want to answer on the excursion?',
      ],
      exitPost: [
        'Name one feature of the animal you observed and explain WHY it helps the animal survive.',
        'Rate your confidence: Still learning / Getting there / Got it',
      ],
    },
    3: {
      topic: 'Ecosystems & Biodiversity',
      outcomes: ['ST3-4LW-S', 'ST3-5LW-T'],
      li: 'Describe the roles of organisms in an ecosystem and explain how biodiversity supports ecosystem health.',
      sc: [
        'I can construct a food web using animals from Taronga Zoo',
        'I can explain what would happen if one species was removed from an ecosystem',
        'I can use my Tracka observations as scientific evidence in an explanation',
      ],
      preDiscussion: {
        heading: 'Thinking About Ecosystems',
        context: 'In class we have been exploring ecosystems, food webs and biodiversity. Before your visit to Taronga Zoo in a few days, let\'s connect what we\'ve been learning to what you\'ll actually observe in the enclosures.',
        prompts: [
          'What is a food web? Can someone sketch a simple one on the board — include a producer, two consumers and a predator, and label each level?',
          'If one animal in a food web completely disappeared, what do you think would happen to the other animals? Would all food webs respond the same way?',
          'What does biodiversity mean, and why does it matter for an ecosystem\'s health? Can you think of a real example where losing one species caused problems for others?',
          'At Taronga Zoo you\'ll use Tracka to observe animals and record their role in an ecosystem. What clues in an animal\'s behaviour or body would help you figure out where it sits in a food web?',
        ],
        trackaNotes: 'In Taronga Tracka, each observation is scored on how precisely you describe what the animal is doing and why. For Stage 3 Science, focus on the animal\'s role — is it a producer, consumer or predator? Record specific behaviours that give you clues about its diet, its relationships with other animals, and what would change in its ecosystem if it disappeared.',
        teacherNote: 'Use this discussion 2–3 days before the excursion to activate prior learning on ecosystems and biodiversity. Push students to articulate what they already know before the zoo experience deepens their understanding.',
      },
      postDiscussion: {
        heading: 'Back From the Zoo — What Did We Find?',
        context: 'A couple of days ago you visited Taronga Zoo and observed real animals in their enclosures. Before we analyse our data and begin our post-visit work, let\'s spend a few minutes reconnecting to what we experienced together.',
        prompts: [
          'Who can share an observation that gave them a clue about where an animal sits in a food web? What specific behaviour or feature made you think that?',
          'Were any of the animals at Taronga critically endangered in the wild? How did knowing that change the way you looked at the animal?',
          'Did you notice any behaviours that you found hard to explain scientifically? What hypotheses did you form about what the animal was doing and why?',
          'Looking back at your Tracka observations, what do you wish you had noticed or recorded differently — and why would that extra detail have made your science stronger?',
        ],
        teacherNote: 'Use this as an open debrief before diving into scientific analysis. Encourage students to be honest about what they found confusing — this sets up richer investigation in the post-visit activities that follow.',
      },
      preContent: [
        {
          heading: 'Food Webs at Taronga',
          bullets: [
            'Every animal at Taronga Zoo has a role in a food web — from the producers at the base right up to the apex predators at the top. The flow of energy moves from producers to primary consumers to secondary consumers to predators, and every single link in that chain depends on the one below it to survive.',
            'If just one species is removed from a food web, the effects can ripple outward in ways that are difficult to predict — some populations explode because their predators are gone, others crash because their food source has disappeared. In a few days at Taronga Zoo, you\'ll see animals that represent many different levels of real food webs, and your job is to use your observations to figure out where each one belongs.',
          ],
        },
        {
          heading: 'Why Biodiversity Matters',
          bullets: [
            'Biodiversity — the variety of different species living in an ecosystem — is what makes that ecosystem resilient. Taronga Zoo protects over 4,000 animals across more than 350 species, many of which are critically endangered in the wild, and the zoo\'s conservation work is focused on making sure these species don\'t disappear from the planet forever.',
            'When biodiversity falls, entire ecosystems become fragile and less able to recover from disruptions like drought, disease or human interference. Zoos like Taronga are not just places to see animals — they are active participants in international breeding programs, field conservation projects and the scientific research that gives threatened species a chance at survival.',
          ],
        },
        {
          heading: 'Your Tracka Mission',
          bullets: [
            'When you visit Taronga Zoo in a few days, your Tracka mission is to observe animals and think like an ecologist — someone who studies the relationships between living things. For each animal you observe, ask yourself: what does it eat, what eats it, and what would change in its ecosystem if it was gone tomorrow?',
            'The more specific your Tracka observation, the more scientific value it has. Write about exactly what the animal is doing, not just what it looks like — a feeding behaviour, a social interaction, or a territorial display will tell you far more about its role in an ecosystem than a description of its fur colour.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Building Our Class Food Web',
          bullets: [
            'Let\'s use what everyone observed at Taronga Zoo to build a class food web together on the board. Share which animals you observed, what you saw them doing, and what clues that gave you about their diet and their role in their ecosystem — together we can map the connections between species across multiple enclosures.',
            'A completed class food web is actually a form of scientific data — it shows the relationships that exist between real species, and it makes visible what would be lost if any one of those species disappeared. Look at your own Tracka observation and ask: is the animal you described a producer, a consumer, or a predator, and what depends on it being there?',
          ],
        },
        {
          heading: 'Biodiversity Under Threat',
          bullets: [
            'The animals you observed at Taronga Zoo are among the most at-risk species on Earth — the Sumatran Tiger has fewer than 600 individuals remaining in the wild, and gorilla populations have dropped by more than 60% in three decades due to habitat loss, poaching and disease. Each one of these animals represents an entire strand in a complex food web that would unravel if they were lost.',
            'Taronga\'s conservation programs — breeding, research, field work and community education — are designed to slow and reverse these declines, but protecting biodiversity requires action at every level, from international agreements right down to the choices individual communities make about land and resources. The observation you recorded in Tracka is a small piece of the evidence base that helps scientists understand these animals and argue for their protection.',
          ],
        },
        {
          heading: 'Evidence from Our Visit',
          bullets: [
            'Look back at your highest-scoring Tracka observation and identify what made it scientifically strong — was it the specific behaviour you described, the detail about the animal\'s physical features, or the way you connected what you saw to a larger ecological idea? These are exactly the qualities that make a field observation useful in a real research context.',
            'A strong scientific observation is one that could be read by someone who wasn\'t there and still give them clear, specific information about what the animal was doing and why it matters. Swap your observation with a partner, give them one specific piece of feedback, and then think about: how could your observation be developed into evidence in a scientific report about this species?',
          ],
        },
      ],
      preChecklist: [
        'Write down what you already know about food chains and ecosystems',
        'Which animals at Taronga do you think are apex predators?',
        'How will you identify an animal\'s role in a food web from observation alone?',
        'Plan which enclosures to visit to see the widest variety of species',
      ],
      postAction: [
        'Ecosystem Explainer Video',
        'In groups of 3–4, create a 60-second explainer video about one animal you observed at Taronga. Your video must include: the animal\'s role in its ecosystem, at least one threat it faces in the wild, and one action people can take to help. Upload to your class folder — class votes on the most persuasive video.',
      ],
      exitPre: [
        'Draw a simple food chain with 3 organisms. Label each as producer, primary consumer, or predator.',
        'What is one question about ecosystems you hope the zoo visit will help you answer?',
      ],
      exitPost: [
        'Draw a food chain with 3 organisms that includes an animal you observed at the zoo.',
        'Explain in one sentence what would happen if the predator in your food chain disappeared.',
      ],
    },
    4: {
      topic: 'Adaptations & Classification',
      outcomes: ['SC4-14LW', 'SC4-15LW'],
      li: 'Analyse the structural and behavioural adaptations of animals and link them to survival advantages in their ecosystem.',
      sc: [
        'I can identify and classify an animal using biological taxonomy',
        'I can describe at least two adaptations and explain their survival value using scientific vocabulary',
        'I can write a scientific observation using precise terminology',
      ],
      preDiscussion: {
        heading: 'Classifications & Adaptations',
        context: 'Over recent weeks we have been exploring biological classification and the relationship between structural and behavioural adaptations and survival advantage. In a few days you will put this knowledge to work at Taronga Zoo.',
        prompts: [
          'Can you name all seven levels of Linnaean taxonomy? What do the terms "genus" and "species" actually mean for an organism — why do scientists use Latin names rather than common names?',
          'What is the difference between a structural adaptation and a behavioural adaptation? Give a clear example of each from an animal you know, and explain the survival advantage each one provides.',
          'How do adaptations arise in a population over time? What role does natural selection play in determining which adaptations persist across generations?',
          'At Taronga Zoo you\'ll use Tracka to observe and record specific adaptations. What will you look for to determine whether a behaviour is instinctive or learned — and does that distinction matter scientifically?',
        ],
        trackaNotes: 'In Taronga Tracka, your observation score depends on the scientific precision of your language. For Stage 4 Science, name specific adaptations, describe their structure, and explain their survival value — using correct biological terminology such as "countershading", "prehensile" or "binocular vision" will lift your score significantly.',
        teacherNote: 'This discussion is for 2–3 days before the excursion. Ensure students have activated their classification and adaptation knowledge before they apply it in the field.',
      },
      postDiscussion: {
        heading: 'Adaptations in Action — Debrief',
        context: 'A couple of days ago you visited Taronga Zoo and directly observed the structural and behavioural adaptations we have been studying. Let\'s take time now to reflect on what you saw and begin connecting your observations to the scientific concepts.',
        prompts: [
          'What is the single most impressive adaptation you observed? What specific evidence from your Tracka observation supports your claim about its survival value?',
          'Did you observe any behaviours that you couldn\'t immediately explain scientifically? What hypotheses did you form, and what would you need to observe to test them?',
          'How did observing a live animal differ from studying adaptations in class? What did the direct observation experience add that textbooks and diagrams cannot?',
          'Looking at your Tracka observation, where do you think you used the most precise scientific language — and where could you have been more specific in your terminology?',
        ],
        teacherNote: 'This debrief should begin 2 days after the excursion while the experience is still vivid. Push students to use classification and adaptation vocabulary when sharing — vague responses should be challenged with "what specific feature did you actually observe?"',
      },
      preContent: [
        {
          heading: 'Classification at the Zoo',
          bullets: [
            'Biological classification — Linnaean taxonomy — organises all living things into a hierarchy: Kingdom, Phylum, Class, Order, Family, Genus and Species. Taronga Zoo houses mammals, birds, reptiles, fish and invertebrates, and being able to classify each animal tells you immediately what features it shares with its relatives and what makes it unique as a species.',
            'When you visit Taronga in a few days, try to predict the full taxonomic classification of at least one animal before you read the enclosure sign — all mammals share warm blood, fur or hair, live young and mammary glands, which narrows it down quickly. The goal is to see classification not as a memorisation task but as a tool for understanding relationships between living things.',
          ],
        },
        {
          heading: 'Structural vs Behavioural Adaptations',
          bullets: [
            'Structural adaptations are physical features — beak shape, fur thickness, eye position, limb length — that have developed over many generations because they give individuals a survival advantage. Behavioural adaptations are actions — nocturnal activity, camouflage posture, migration, social hierarchy — that serve the same purpose but through what the animal does rather than what it looks like. Both are heritable, encoded in DNA and passed to offspring.',
            'At Taronga Zoo in a few days, your mission is to identify at least two structural adaptations and one behavioural adaptation for each animal you observe, and to link each directly to a specific survival advantage — not just "it helps it survive" but precisely how, in what context, and against what threat. Using scientific vocabulary in that explanation is what separates a strong observation from a basic one.',
          ],
        },
        {
          heading: 'Your Observation Strategy',
          bullets: [
            'When you arrive at each enclosure at Taronga Zoo, resist the urge to immediately start writing — spend the first 60 seconds just watching. Look for what the animal is actively doing, note whether it is solitary or social, and identify at least one behaviour that tells you something specific about how it interacts with its environment or other animals.',
            'Then record three things in Tracka: one structural adaptation you can observe directly, one behavioural adaptation you have witnessed, and the survival advantage each one provides using precise scientific language. Remember that your observation score reflects not just what you noticed but how accurately and specifically you were able to describe it in writing.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Adaptation Analysis',
          bullets: [
            'You have now observed real animals with a scientist\'s eye and recorded their adaptations as primary data in Taronga Tracka. Share with the class: what was the most impressive structural or behavioural adaptation you observed, what specific evidence from your observation supports your claim, and could that same adaptation function effectively in a completely different ecosystem?',
            'Push your thinking further: what does the adaptation you observed tell you about the evolutionary history of that species — about the selection pressures its ancestors faced over thousands of generations? And what evidence of those evolutionary pressures can you still see in the animal\'s body or behaviour today?',
          ],
        },
        {
          heading: 'Conservation Science',
          bullets: [
            'Taronga\'s breeding programs depend on deep scientific knowledge of genetics and adaptation — because if a captive population loses genetic diversity, its members become less able to adapt to new challenges, making the entire breeding program less effective as a conservation strategy. This is why international breeding programs use genetic studbooks to track relatedness and deliberately pair animals from different bloodlines.',
            'The adaptations you observed at Taronga are the product of millions of years of selection in specific wild environments — but captivity changes the selection pressures an animal faces, meaning zoo-born individuals may gradually lose some of the traits that would help them survive in the wild. This tension between conservation and captivity is one of the most important debates in modern conservation science.',
          ],
        },
        {
          heading: 'Evaluating Our Observations',
          bullets: [
            'Review your Tracka observation scores and identify which domain — behaviour description, specific detail or writing quality — was your weakest, then consider why: was it a lack of observation time, a lack of scientific vocabulary, or simply not knowing what to look for? Being honest about where your scientific writing fell short is the first step to improving it.',
            'Compare your observation with a partner who observed the same animal and identify at least two differences — not just in what you wrote, but in what you chose to notice. The fact that two people can observe the same animal and produce very different records is itself a scientific lesson about the role of prior knowledge and observation focus in field research.',
          ],
        },
      ],
      preChecklist: [
        'Review the classification hierarchy — Kingdom to Species — before you arrive',
        'For each enclosure: identify whether the animal is mammal, bird, reptile, etc.',
        'Plan to observe at least one structural AND one behavioural adaptation per animal',
        'Note: what is the animal doing? Is this voluntary play or a stress behaviour?',
      ],
      postAction: [
        'Adaptation Field Report',
        'Write a 400–500 word scientific report on one animal you observed at Taronga Zoo. Structure: Introduction (classification + wild habitat), Body (3 adaptations with diagrams), Analysis (how each adaptation links to survival), Conclusion (conservation status + main threats). Include your Tracka observation as primary evidence.',
      ],
      exitPre: [
        'Name two structural adaptations of an animal you already know. Explain the survival advantage of each.',
        'Write a one-sentence hypothesis: "I predict the [animal] will show [adaptation] because [reason]."',
      ],
      exitPost: [
        'Name one structural and one behavioural adaptation of your chosen animal. Explain the survival advantage of each.',
        'Extension: How might climate change affect this adaptation over the next 50 generations?',
      ],
    },
    5: {
      topic: 'Evolution & Conservation',
      outcomes: ['SC5-14LW', 'SC5-15LW'],
      li: 'Evaluate how natural selection drives adaptation and assess the role of conservation science in managing the evolutionary fitness of endangered species.',
      sc: [
        'I can explain natural selection using variation, selection pressure, and differential reproduction',
        'I can analyse an animal\'s adaptations as products of evolutionary history',
        'I can construct a reasoned argument about conservation ethics using scientific evidence',
      ],
      preDiscussion: {
        heading: 'Evolution, Selection & Conservation',
        context: 'In recent units we have examined evolutionary theory, natural selection and the role of genetics in population fitness. Before your Taronga Zoo visit in a few days, let\'s interrogate these concepts through the lens of what you\'re about to observe.',
        prompts: [
          'What is the mechanism of natural selection? Can you explain it without using the phrase "survival of the fittest" — what are the four components that Darwin identified, and why does each one matter?',
          'How does captivity change the selection pressures acting on a zoo-born animal? Does a zoo animal evolve in the same way as its wild counterpart, and what evidence would you need to answer that question definitively?',
          'What is genetic diversity and why does it matter for a species facing an existential threat? How does inbreeding reduce a population\'s adaptive fitness over time?',
          'Taronga participates in international Species Survival Plans. Do you believe captive conservation can genuinely preserve a species\' evolutionary fitness — or does it simply delay extinction? What evidence would shift your position?',
        ],
        trackaNotes: 'In Taronga Tracka, your observation is your primary data. For Stage 5 Science, treat your observation as a field ecologist would — form a hypothesis before you observe, record precise evidence, and note what your observation does and doesn\'t prove. Your Tracka data will form the foundation of your post-visit investigation.',
        teacherNote: 'At Stage 5, push students toward critical thinking — the goal is not just to recall content but to interrogate what conservation actually means scientifically and ethically. This discussion should happen 2–3 days before the visit.',
      },
      postDiscussion: {
        heading: 'Critiquing Conservation — What Did You See?',
        context: 'A couple of days ago you visited Taronga Zoo with a scientist\'s lens, collecting primary observational data and examining the evolutionary and conservation arguments we have been studying. Now it\'s time to critique what you found.',
        prompts: [
          'What evidence from your observation most directly connects to evolutionary theory? How would you use it as evidence in a scientific argument — and what are its limitations as primary data?',
          'Did anything at the zoo challenge or complicate your prior assumptions about captive conservation? Be specific about what you observed and why it was cognitively disruptive.',
          'Looking at your Tracka observation as primary data — what are its genuine strengths as scientific evidence, and what are its clear limitations that a peer reviewer would identify?',
          'If you were a conservation geneticist advising Taronga\'s breeding program for one species you observed, what specific recommendation would you make based on what you saw — and what further data would you need?',
        ],
        teacherNote: 'At Stage 5 this debrief should function as a seminar-style discussion. Push students to evaluate, not just describe. Encourage those who disagree about the value of captive conservation to articulate their argument with specific evidence from their observations.',
      },
      preContent: [
        {
          heading: 'Evidence for Evolution',
          bullets: [
            'The theory of evolution by natural selection is supported by multiple independent lines of evidence: the fossil record showing change over geological time, comparative anatomy revealing homologous structures with the same evolutionary origin but different modern functions — such as the human arm, whale flipper and bat wing — and DNA analysis demonstrating shared ancestry across species that look nothing alike.',
            'When you visit Taronga Zoo in a few days, you have an opportunity to observe evolutionary evidence directly: look for vestigial structures — features that have been reduced or repurposed over evolutionary time — and homologous structures shared between distantly related species. Ask yourself what each adaptation tells you about the selection pressures the animal\'s ancestors faced, and what that reveals about the environment they evolved in.',
          ],
        },
        {
          heading: 'Natural Selection in Action',
          bullets: [
            'Natural selection operates through four components: variation exists within populations, some variants survive and reproduce at higher rates than others due to selection pressure, those successful variants pass their traits to offspring, and over many generations the population changes. This process is not goal-directed — it is purely statistical, operates on existing variation, and cannot anticipate future environments.',
            'Captivity fundamentally alters the selection pressures an animal experiences: there are no predators, food is provided, and mates are chosen by humans rather than through competition. This means zoo-born animals face entirely different selection pressures than their wild counterparts — raising the critical question of whether captive breeding genuinely preserves evolutionary fitness or simply maintains individuals in biological stasis.',
          ],
        },
        {
          heading: 'Conservation Genetics',
          bullets: [
            'Small, isolated populations are vulnerable to inbreeding — the mating of closely related individuals — which reduces genetic diversity and increases the expression of harmful recessive alleles. Taronga participates in international Species Survival Plans (SSP) and maintains genetic studbooks that track the relatedness of every individual in the global captive population, deliberately pairing animals from different bloodlines to maximise diversity.',
            'The ethical dimensions of captive conservation are genuinely contested: critics argue that keeping animals in captivity is inherently unjust, that zoo populations lose wild behaviours across generations, and that the resources spent on charismatic megafauna could save more biodiversity if redirected to habitat protection. Proponents point to species like the Arabian Oryx and the Lord Howe Island Stick Insect, both recovered from near-extinction through captive programs. Your observation in a few days will give you primary evidence to evaluate this debate.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Evolution Evidence Debrief',
          bullets: [
            'You have now observed animals that are the products of millions of years of natural selection, and your Tracka data is primary observational evidence about those products. Share with the class: which adaptation you observed most clearly showed the mark of evolutionary history — and can you identify the specific selection pressure that likely drove its development in the animal\'s ancestral environment?',
            'Consider whether the animal you observed is still actively evolving in any meaningful sense — what evidence from your observation would support or challenge this claim? And how does the zoo environment change which traits are advantageous, potentially creating entirely new selection pressures that would not exist in the wild?',
          ],
        },
        {
          heading: 'Critiquing Conservation Science',
          bullets: [
            'Captive conservation has produced genuine success stories: the Arabian Oryx was declared extinct in the wild in 1972 and successfully reintroduced through captive breeding; the Lord Howe Island Stick Insect was rediscovered in 2001 and is now being bred at Melbourne Zoo for eventual reintroduction. But these successes sit alongside important limitations: captive animals can lose wild foraging, predator-avoidance and social behaviours across generations, and captive populations show measurable reductions in genetic diversity over time even with careful management.',
            'The fundamental question for conservation science is not whether captive programs work, but whether they are the best use of limited resources and whether they address the root causes of species decline. Maintaining a viable captive population of tigers costs millions of dollars annually — money that could alternatively fund the habitat protection that addresses the actual reason tigers are endangered in the first place. This is not a question with a simple answer, and your observation is one small piece of evidence in a much larger and more complex scientific and ethical debate.',
          ],
        },
        {
          heading: 'Reflection on Primary Data',
          bullets: [
            'Compare your Tracka observation with a peer who observed the same animal and identify what drove the difference in your scores — was it observation focus, scientific vocabulary, or the specific behaviours you chose to record? A field biologist would spend hours at a single enclosure and produce hundreds of words of observation notes; consider what your brief observation captured and what it necessarily missed.',
            'Identify one claim in your observation that you made confidently but that actually requires stronger evidence — a behaviour you interpreted as meaning something specific, but which could equally have had a different explanation. Learning to distinguish between what you directly observed and what you inferred from that observation is one of the most important skills in scientific writing.',
          ],
        },
      ],
      preChecklist: [
        'Review the mechanisms of natural selection before the visit',
        'For each animal: hypothesise the selection pressure that drove its key adaptation',
        'Think about: does captivity expose the animal to the same pressures as the wild?',
        'This evidence will form the foundation of your post-visit investigation',
      ],
      postAction: [
        'Conservation Policy Brief',
        'Write a 600–800 word policy brief addressed to the NSW Environment Minister arguing for or against expanding Taronga\'s captive breeding program for one critically endangered species you observed. Include: evolutionary biology rationale, current population data, ethical considerations, and a clear recommendation. Format professionally with headings, references, and your Tracka observation as Appendix A.',
      ],
      exitPre: [
        'Explain the difference between a structural and a behavioural adaptation. Give one example of each.',
        'Write a one-sentence definition of natural selection in your own words.',
      ],
      exitPost: [
        'Explain why genetic diversity matters for a species\' long-term survival. Use a specific animal as your example.',
        'Evaluate one limitation of using zoo observations as evidence in an evolutionary biology argument.',
      ],
    },
  },

  maths: {
    2: {
      topic: 'Data, Measurement & Patterns',
      outcomes: ['MA2-DATA-01', 'MA2-GM-02'],
      li: 'Collect, organise and display data from real-world animal observations and identify number and measurement patterns.',
      sc: [
        'I can create a tally chart and column graph using zoo data',
        'I can measure and compare lengths and masses using formal units',
        'I can identify and continue a number pattern and explain the rule',
      ],
      preDiscussion: {
        heading: 'Maths Is Everywhere — Even at the Zoo',
        context: 'In our recent maths lessons we have been exploring data, measurement and patterns. In a few days you will visit Taronga Zoo — and the exciting thing is that real-world mathematics is woven into everything you will see and do there.',
        prompts: [
          'What kinds of things at a zoo could you count, measure or collect data about? Try to think of at least five different types of information you could record as numbers.',
          'If you wanted to display the number of each type of animal in a zoo, what kind of graph would you use — a column graph, a picture graph, or something else? Why would that graph work best?',
          'A giraffe is about 5.5 metres tall. Can you think of a way to estimate that if you were standing next to one, using things you already know how to measure?',
          'In Taronga Tracka, you earn points for your animal observations. If you earn 10 points for a good observation and 20 for an excellent one, what patterns might you notice in your total score as you visit more animals?',
        ],
        trackaNotes: 'In Taronga Tracka, every animal you observe earns you points based on the quality of your description. For Maths, focus on what you can count, measure or calculate — the number of animals in an enclosure, their estimated size, or the number of behaviours you observe. Recording real numbers at the zoo will give you data to work with back in class.',
        teacherNote: 'Use this discussion 2–3 days before the excursion to help students see mathematics as something they\'ll encounter naturally at the zoo. Encourage them to design a simple tally chart they can take with them.',
      },
      postDiscussion: {
        heading: 'Our Zoo Data — Let\'s Look at the Numbers',
        context: 'A couple of days ago you visited Taronga Zoo and collected real-world data through your Taronga Tracka observations. Before we analyse this data formally, let\'s talk about what you noticed and what surprised you.',
        prompts: [
          'What was the most surprising number you encountered at the zoo — it could be an animal\'s weight, height, age, or your own Tracka score?',
          'Did you notice any patterns while you were at the zoo — in the sizes of animals, in the numbers on signs, or in anything else that you counted or measured?',
          'If we combined all our class Tracka scores into one data set, what kinds of questions could we answer with that information?',
          'What would you count or measure differently if you went back to the zoo — and why would that data be more useful?',
        ],
        teacherNote: 'This open discussion is designed to surface students\' natural mathematical noticing before moving into formal data analysis. Accept informal language at this stage — precision comes in the activities that follow.',
      },
      preContent: [
        {
          heading: 'Collecting Data at the Zoo',
          bullets: [
            'Data is information we collect to answer a question — and at Taronga Zoo in a few days, there will be real mathematical data all around you. You can collect data by counting (how many animals in each enclosure?), by measuring (how tall does the giraffe appear?), or by carefully observing and recording what you see animals doing over time.',
            'A tally chart is one of the simplest and most useful ways to organise data as you collect it — one mark for each item you count, grouped into fives so they\'re easy to add up later. Before your visit, design a tally chart that you could use to count animals by type — mammal, bird, reptile, fish or invertebrate — and think about what question that data would help you answer.',
          ],
        },
        {
          heading: 'Graphs and Displays',
          bullets: [
            'Once you have collected data, a graph helps you see patterns and comparisons that are hard to spot in a list of numbers. Column graphs are perfect for showing totals in different categories — each column represents one group, and the height of the column shows how many. Picture graphs use symbols where one symbol might represent two or more items, which is useful when the numbers are large.',
            'After your Taronga Zoo visit in a few days, you will create a class graph of the animals everyone observed using Tracka. Think about this now: what would a column graph of "animals observed by type" tell a zookeeper that they couldn\'t find out just by walking around themselves? Good data displays answer questions that individual observations cannot.',
          ],
        },
        {
          heading: 'Patterns at the Zoo',
          bullets: [
            'Number patterns are sequences where each number follows a rule — and they appear naturally in animal data if you know what to look for. A tiger has 4 legs, a centipede has 100, and a starfish has 5 arms — these are all number facts you could use as the starting point for a pattern. At the zoo, look at the information signs near each enclosure: can you spot a doubling pattern, an adding pattern, or something more complex?',
            'Taronga Tracka awards points based on your observation quality, and your scores across multiple animals form their own number sequence. After the visit, look at your scores: is there a pattern in which animals scored highest? What rule could explain that pattern, and does it tell you something about where your observation writing was strongest?',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Our Class Data',
          bullets: [
            'Let\'s combine everyone\'s data on the board and see what our class collected as a whole. Share your animal observation counts, your Tracka scores, and any measurements you recorded — together we have a much richer data set than any one person could collect alone, and displaying it as a class graph will reveal patterns that individual data can\'t show.',
            'Look at the class column graph we\'ve created: which animal did our class observe most, and which the least? What might explain that difference — was it because some animals were easier to find, more interesting to observe, or more visible in their enclosures? And what question could a Taronga zookeeper answer if they had access to this exact data?',
          ],
        },
        {
          heading: 'Measurement Discoveries',
          bullets: [
            'At Taronga Zoo, you were surrounded by extraordinary measurements — a giraffe stands 5.5 metres tall, a fully grown male gorilla weighs up to 180 kilograms, and a Komodo dragon can run at 20 kilometres per hour. Think about the biggest animal you observed: how did you know it was the biggest, and what unit of measurement would you use to compare it accurately to other animals you saw?',
            'Now let\'s solve some real measurement problems together using the facts we collected. If a female gorilla weighs 70 kilograms and a male weighs 180 kilograms, what is the difference? If the zoo map shows the tiger enclosure is 120 metres from the gorilla enclosure, and you walked to 4 different enclosures, how far did you walk in total? Show all your working — the steps matter as much as the answer.',
          ],
        },
        {
          heading: 'Patterns in Animal Facts',
          bullets: [
            'Number patterns hide inside animal data if you look for them carefully. A Sumatran Tiger has a lifespan of about 15 years in the wild and up to 26 years in captivity — what is the difference, and can you create a number pattern starting with those two numbers? Look at your Tracka scores too: can you spot a pattern in which observations earned the highest points, and what rule would explain it?',
            'Create a two-step number pattern that starts with a real animal fact from your zoo visit as the first number. Share your pattern with a partner and challenge them to find the rule — then swap and try theirs. Thinking about number patterns this way — anchored in real data — helps you see mathematics not as an abstract exercise but as a tool for understanding the world around you.',
          ],
        },
      ],
      preChecklist: [
        'Design a tally chart to record which types of animals you see',
        'Plan to count: how many animals are in each enclosure you visit?',
        'Think about: what would you measure if you could — height? speed? weight?',
        'Look for number patterns in prices, distances, or animal facts at the zoo',
      ],
      postAction: [
        'Animal Data Poster',
        'Choose 4 animals from your Taronga visit. Create a data poster showing: a tally chart of their features, a column or picture graph comparing a measurement (height, mass, or lifespan), and one number pattern you found in the data. Present your poster and explain what your data tells us.',
      ],
      exitPre: [
        'Write one thing you could count or measure on the excursion.',
        'Continue this pattern: 5, 10, 20, 40, ___, ___ — what is the rule?',
      ],
      exitPost: [
        'Write one thing you measured or counted at the zoo. Show it as a number sentence.',
        'Can you continue this pattern? 5, 10, 20, 40, ___, ___ — what\'s the rule?',
      ],
    },
    3: {
      topic: 'Statistics, Chance & Measurement',
      outcomes: ['MA3-DATA-01', 'MA3-CHAN-01'],
      li: 'Collect and interpret statistical data from zoo observations, describe probability using fractions and percentages, and apply measurement concepts to real contexts.',
      sc: [
        'I can calculate and interpret mean, median and mode from a data set',
        'I can express probability as a fraction, decimal and percentage',
        'I can calculate area and perimeter and convert between units of measurement',
      ],
      preDiscussion: {
        heading: 'Statistics, Chance & Real Data',
        context: 'Over recent lessons we have been working on mean, median and mode, probability, and measurement. In a few days your Taronga Zoo excursion will give you a genuine real-world data set to work with — your Tracka scores, observation times, and animal facts from the enclosures.',
        prompts: [
          'In your own words, what is the difference between mean, median and mode? When would you choose each one to best represent a data set — and can you think of a situation where the mean would be misleading?',
          'If 8 of 20 animals at the zoo are from Africa, how would you express the probability of randomly visiting an African animal enclosure first? Write it as a fraction, a decimal and a percentage.',
          'Taronga Zoo covers 7 hectares. Can you estimate what that looks like — how many school ovals, classrooms or football fields might fit inside 70,000 square metres?',
          'What two pieces of numerical data will you deliberately collect during your zoo visit? Think about what question you want to be able to answer with that data when you return to class.',
        ],
        trackaNotes: 'In Taronga Tracka, you receive a numerical score for each animal observation. Record your score for each animal carefully — these numbers will form your primary data set in class. For Stage 3 Maths, you will calculate the mean, median and mode of your class scores, construct statistical displays, and solve probability problems using real zoo data.',
        teacherNote: 'This discussion 2–3 days before the visit helps students see themselves as data collectors going into the field. Encourage them to design a simple recording sheet they can actually use on the day.',
      },
      postDiscussion: {
        heading: 'Let\'s Look at Our Data Together',
        context: 'A couple of days ago you visited Taronga Zoo and collected real numerical data through the Taronga Tracka app. Now we have a genuine data set to analyse — your scores, animal facts and measurements. Let\'s start by sharing what you noticed.',
        prompts: [
          'What was your total Tracka score — was it higher or lower than you expected, and what do you think made the biggest difference to your result?',
          'Did you find any statistics at the zoo — animal population numbers, weights, lifespans — that genuinely surprised you? Share the number and what made it surprising.',
          'If we put all our class scores in order from lowest to highest, what do you estimate the median score might be — and how is the median different from the mean?',
          'Did anything at the zoo feel random or unpredictable? How might you describe that randomness using the probability language we\'ve been learning?',
        ],
        teacherNote: 'Begin with this open sharing discussion before moving to formal analysis. Gather class scores on the board as students share — this naturally sets up the statistical work that follows.',
      },
      preContent: [
        {
          heading: 'Mean, Median and Mode',
          bullets: [
            'Three measures of central tendency help us summarise a data set in different ways: the mean is calculated by adding all values and dividing by the count, giving us the "fair share" if the data were spread equally; the median is the middle value when all values are ordered from smallest to largest; and the mode is the value that appears most frequently. Each one tells a different story about the same data.',
            'Practice using animal data: the lifespans of Taronga\'s big cats are approximately 10, 12, 15, 15 and 18 years. Calculate the mean lifespan, identify the median, and name the mode — then consider which measure would be most useful if you were a zookeeper trying to plan for the long-term health of your collection, and why the other two might give a misleading picture.',
          ],
        },
        {
          heading: 'Chance and Probability',
          bullets: [
            'Probability describes how likely an event is to occur, and we calculate it by dividing the number of favourable outcomes by the total number of possible outcomes. If Taronga Zoo has 350 species and 40 of them are mammals, then the probability of the first enclosure you visit housing a mammal is 40/350 — which we can simplify and express as a fraction, a decimal and a percentage, three different ways of saying the same thing.',
            'Probability isn\'t just about simple counts — it requires careful thinking about what "equally likely" actually means in context. Is it equally likely that any two animals appear at the front of their enclosure at the same time as each other? Probably not — some animals are more active, more visible, and more likely to be near visitors at certain times of day. At Taronga Zoo in a few days, you\'ll be making probability judgements about animal behaviour without even realising it.',
          ],
        },
        {
          heading: 'Measurement and Area',
          bullets: [
            'Taronga Zoo covers approximately 7 hectares — that is 70,000 square metres — which gives you a sense of the scale involved in designing and managing a world-class zoo. Understanding area and perimeter is essential for zookeepers who need to plan enclosure sizes, calculate feeding quantities per square metre, and ensure each animal has enough space to behave naturally and maintain good physical health.',
            'Before your visit in a few days, try to estimate the area of one enclosure using the zoo map — is it closer to 100 square metres, 1,000 square metres, or 10,000 square metres? What unit would you use to express that most usefully? Back in class, we\'ll use real enclosure dimensions to practise area and perimeter calculations in a context that matters.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Class Score Statistics',
          bullets: [
            'Let\'s build our class data set together by sharing Tracka scores on the board. Once we have all the scores, we\'ll calculate the mean by adding them all and dividing by the number of students, identify the median by ordering them and finding the middle, and name the mode if one score appears more than once. Then we\'ll draw a dot plot to see the shape of our distribution — is it clustered, spread out, or skewed in one direction?',
            'When you look at our class dot plot, identify any outliers — values that sit far from the cluster of most scores. An outlier in our class data is interesting because it raises a question: was that student having an exceptional day, did they spend longer observing, did they choose a more observable animal, or is there another explanation? Outliers in real data sets always invite investigation rather than dismissal.',
          ],
        },
        {
          heading: 'Probability at the Zoo',
          bullets: [
            'Now let\'s apply probability to the real context of our zoo visit. If Taronga has approximately 350 species and 40 are mammals, express P(visiting a mammal enclosure) as a fraction, decimal and percentage. In your Tracka quiz, if a question has four options and you have no idea of the correct answer, P(guessing correctly) = 1/4 = 0.25 = 25% — now think about how confident you actually were during the quiz, and whether your results reflect that.',
            'Think about this: on your zoo visit, was it equally likely that you would observe any particular behaviour in any animal at any moment? The answer is no — probability in the real world is rarely uniform. Some behaviours are rare and require patience, some animals are more active at certain times of day, and some enclosures make observation much easier than others. This is why statisticians talk about probability distributions rather than single probability values.',
          ],
        },
        {
          heading: 'Measurement in Context',
          bullets: [
            'Using the measurements you collected or observed at the zoo, let\'s solve some real-world problems. A keeper prepares 5 kilograms of food per large mammal per day — how much food is that per week, per month, and per year for one animal? If the zoo expanded by 20%, what would its new area be in hectares? Work through each problem showing your full method — in maths, correct working is worth as much as a correct answer.',
            'Think about unit selection: which unit would you use to measure the total area of the zoo grounds (hectares), the food prepared for one animal (kilograms), and the distance between two enclosures (metres)? Choosing the right unit for the right scale is a mathematical skill that matters in real professional contexts — zookeepers, architects and environmental scientists all make these decisions routinely.',
          ],
        },
      ],
      preChecklist: [
        'Design a recording sheet to collect at least two types of numerical data at the zoo',
        'Plan to record your Tracka score for each animal you observe',
        'Think about: time spent observing vs score — is there a connection?',
        'Estimate the area of the largest enclosure you can see on the zoo map',
      ],
      postAction: [
        'Zoo Statistics Report',
        'You are a junior zookeeper preparing a statistical report for Taronga\'s board. Using your Tracka data and at least 3 other zoo facts: calculate mean, median and mode for two data sets, display your data in two different graph types, and include one probability question with a full solution. Present as a formal document with title, sections and conclusion.',
      ],
      exitPre: [
        'Write the difference between mean, median and mode in your own words.',
        'If 8 of 20 animals at the zoo are from Africa, what is P(African animal)? Write as a fraction, decimal and %.',
      ],
      exitPost: [
        'Class scores: 45, 62, 78, 62, 90, 55. Find the mean, median and mode.',
        'If 8 of 20 animals at the zoo are from Africa, what is P(visiting an African animal first)?',
      ],
    },
    4: {
      topic: 'Data Analysis, Algebra & Finance',
      outcomes: ['MA4-DAT-C-01', 'MA4-ALG-C-01', 'MA4-FIN-C-01'],
      li: 'Apply statistical analysis, algebraic modelling and financial mathematics to real-world conservation and zoo management contexts.',
      sc: [
        'I can construct and interpret statistical displays including box-and-whisker plots',
        'I can write and evaluate algebraic expressions and formulae',
        'I can apply percentage calculations and financial maths to real-world scenarios with full justification',
      ],
      preDiscussion: {
        heading: 'Algebra, Data & Zoo Finance',
        context: 'In our current unit we have been exploring algebraic expressions, statistical analysis and financial mathematics. Before your Taronga Zoo visit in a few days, let\'s think about how these tools apply to the real-world mathematics of running a world-class conservation organisation.',
        prompts: [
          'The Taronga Tracka scoring formula is: score = (behaviour + detail + writing) ÷ 15 × 100. Can you write this as an algebraic expression using variables? What is the maximum possible score, and what combination of values achieves it?',
          'If a breeding program costs $180,000 per species and Taronga has a $2.4 million conservation budget, how many programs can they run simultaneously? What percentage of the budget does each one consume?',
          'How would you construct a box-and-whisker plot of our class Tracka scores after the visit? What would Q1, the median, Q3 and the IQR each tell you about how the class performed?',
          'What variable would you deliberately collect at the zoo to test the hypothesis that longer observation time leads to a higher Tracka score — and how would you control for confounding variables?',
        ],
        trackaNotes: 'Your Tracka score is a real algebraic variable. The scoring formula uses three components (b, d, w) each out of 5. Record your score for each animal, then use the formula to reverse-engineer which component let you down most. This is the data you\'ll use in your post-visit statistical analysis.',
        teacherNote: 'Use this discussion 2–3 days before the excursion. Push students to see the zoo as a mathematical environment — frame questions they\'ll actually be able to answer with the data they collect.',
      },
      postDiscussion: {
        heading: 'Analysing Our Zoo Data',
        context: 'A couple of days ago you used the Taronga Tracka app and collected real data from your zoo observations. Before we dive into formal analysis, let\'s spend a few minutes sharing what you noticed about the numbers — your scores, the statistics at the enclosures, and any surprises.',
        prompts: [
          'What was your highest Tracka score — and can you use the formula to figure out which component (behaviour, detail or writing) gave you the most points?',
          'Did you collect any numerical data from signs or keeper information at the zoo? What figure surprised you most, and why?',
          'If we construct a box-and-whisker plot of the class scores, what shape do you predict the distribution will have — symmetrical, left-skewed or right-skewed? What would cause each shape?',
          'Taronga spends approximately $80 million per year to operate. How much is that per day? Per animal, if there are 4,000 animals in the collection?',
        ],
        teacherNote: 'Open with this discussion to activate mathematical thinking before formal analysis. Encourage students to cite actual numbers rather than approximations — precision matters here.',
      },
      preContent: [
        {
          heading: 'Statistical Displays for Analysis',
          bullets: [
            'Beyond the mean, median and mode, powerful statistical displays reveal the distribution of a data set — how spread out it is, where the values cluster, and whether there are unusual outliers. A box-and-whisker plot shows five key values simultaneously: the minimum, Q1, the median, Q3 and the maximum, with the interquartile range (IQR) representing the middle 50% of data. When you look at Taronga\'s wild tiger population data from 2000 to 2024 on a histogram, what trend does the shape of the distribution reveal?',
            'In a few days at Taronga Zoo, you will collect your own Tracka score for each animal you observe — these scores will form a real data set that the class will analyse together using box-and-whisker plots, frequency tables and measures of spread. Before you go, think about what shape you predict the class data will take: will most scores cluster in the middle, or will there be a wide spread with outliers at both ends?',
          ],
        },
        {
          heading: 'Algebra and Animal Populations',
          bullets: [
            'Algebra allows us to model situations where values change over time using variables and formulae. Let p represent the current population of a species and r represent the annual growth rate as a decimal — then the population after n years can be modelled as F = p × (1 + r)^n, an exponential function. If Taronga\'s breeding program adds approximately 5 tigers per year to the global captive population, write an algebraic model of captive population growth and graph it with x as years and y as total population.',
            'The Taronga Tracka scoring formula is itself an algebraic expression: score = (b + d + w) ÷ 15 × 100, where b, d and w each represent a component score out of 5. When you visit the zoo in a few days, record your component scores for each animal so you can substitute them into the formula back in class — and consider algebraically what combination of b, d and w gives the maximum score before any quiz bonus is added.',
          ],
        },
        {
          heading: 'Financial Maths in Conservation',
          bullets: [
            'Running Taronga Zoo costs approximately $80 million per year — covering animal care, keeper salaries, veterinary services, infrastructure, conservation programs and education. Adult tickets cost approximately $45 and child tickets approximately $25, which means the zoo needs to carefully model its attendance revenue to determine the break-even point where ticket income covers operating costs. If costs rise by 3% per year, what ticket price would be needed in five years to maintain the same revenue ratio?',
            'Taronga\'s WILD LIFE Conservation Fund receives approximately $2.4 million annually for field conservation work. If a single species captive breeding program costs $180,000 per year, the fund can support 13 programs — but what if the allocation changed to 60% field programs and 40% captive breeding? Model both scenarios algebraically, calculate each allocation as a percentage of the total, and prepare to argue which distribution you think better serves Taronga\'s conservation mission.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Statistical Analysis of Class Data',
          bullets: [
            'Let\'s construct a box-and-whisker plot of our class Tracka scores together. First, enter all scores on the board and order them from smallest to largest, then identify the minimum, Q1, median (Q2), Q3 and maximum values. Calculate the IQR by subtracting Q1 from Q3 — this tells us how consistent the middle half of our class was. Are there any outliers sitting more than 1.5 × IQR beyond Q1 or Q3?',
            'Now compare the spread of our data to what you predicted before the visit. What does the shape of the distribution tell us about how consistently the class performed? If we had two different subjects\' Tracka data sets side by side, we could use the IQR to compare which subject showed greater consistency — and then ask the much more interesting question of what drove that difference.',
          ],
        },
        {
          heading: 'Algebra from the Scoring Formula',
          bullets: [
            'The Tracka scoring formula — score = (b + d + w) ÷ 15 × 100 — is an algebraic model of your observation performance. Using the component scores you recorded at the zoo, substitute your values of b, d and w and calculate your score, then verify it matches your Tracka result. Now try the reverse: if your total score was 73.3 and your behaviour and detail scores were both 4 out of 5, what was your writing score?',
            'Work with a partner who observed the same animal and compare your scores component by component — the differences between your b, d and w values will tell you more about your respective writing strengths than the total score alone. Then ask: what is the maximum possible score without the quiz bonus, and what is the minimum set of component values that still produces a score above 80?',
          ],
        },
        {
          heading: 'Conservation Funding Analysis',
          bullets: [
            'Taronga\'s WILD LIFE Conservation Fund allocates $2.4 million annually across a range of conservation programs. If 60% of that funding goes to field programs in endangered species\' home countries and 40% funds captive breeding at the zoo itself, calculate the dollar amount for each category and express each as a percentage of the total. At $180,000 per species program, how many captive breeding programs does the 40% allocation sustain?',
            'Now prepare a 2-minute financial argument for how you would allocate the $2.4 million differently, based on what you observed at the zoo and what you know about the relative effectiveness of field versus captive conservation. Use actual numbers in your argument — the strongest case will be the one that clearly models the trade-offs using algebra and percentage calculations, not just general principles.',
          ],
        },
      ],
      preChecklist: [
        'Review algebraic substitution — you\'ll use the Tracka scoring formula at the zoo',
        'Design a data collection sheet to record your score per animal',
        'Think about: what financial decisions does a zookeeper make daily?',
        'Estimate: what does it cost to feed a large mammal for one year?',
      ],
      postAction: [
        'Conservation Finance Model',
        'Build a financial model for a new Taronga conservation program. Choose one endangered animal you observed. Research: current wild population, annual program cost, projected outcome over 10 years. Use algebra to model population growth, construct a statistical display of projected data, and calculate the cost per animal saved. Present as a 5-slide deck with all calculations shown.',
      ],
      exitPre: [
        'The Tracka formula is: score = (b + d + w) / 15 × 100. If b = 4, d = 4, w = 3, find the score (no quiz bonus).',
        'A zoo has a budget of $500k for 3 programs costing $120k, $200k and $180k. What % of budget is each?',
      ],
      exitPost: [
        'The Tracka formula is: score = (b + d + w) / 15 × 100. If the score is 73.3 and b = d = 4, find w.',
        'A zoo has a budget of $500k for 3 programs costing $120k, $200k and $180k. What % of budget is each?',
      ],
    },
    5: {
      topic: 'Statistical Modelling & Probability',
      outcomes: ['MA5-DAT-C-01', 'MA5-PRO-C-01'],
      li: 'Apply bivariate data analysis, exponential modelling and compound probability to evaluate real-world conservation outcomes with mathematical rigour.',
      sc: [
        'I can construct a scatter plot and interpret a line of best fit equation',
        'I can build and solve exponential population models',
        'I can calculate compound probability and apply it to multi-stage conservation scenarios',
      ],
      preDiscussion: {
        heading: 'Mathematical Modelling in Conservation',
        context: 'In our recent work we have examined bivariate data analysis, exponential functions and compound probability. Before your Taronga Zoo visit in a few days, let\'s build a framework for how these mathematical tools apply to real conservation challenges.',
        prompts: [
          'If the Sumatran Tiger population was approximately 600 in 1990 and 400 in 2024, how would you set up an exponential model P(t) = P₀ × b^t? What value would you calculate first, and how would you interpret the meaning of b in this conservation context?',
          'You hypothesise that longer observation time correlates with a higher Tracka score. What variables would you define as x and y, how would you collect the data, and how would you interpret the gradient of the line of best fit in a meaningful real-world sentence?',
          'P(captive breeding succeeds) = 0.7 and P(habitat is protected) = 0.4. If both are required for species survival, what is P(species survives)? If only one is required, how does the calculation change — and which scenario gives the species a better chance?',
          'What are the genuine mathematical limitations of using a simple exponential model to predict the extinction date of an endangered species in the real world?',
        ],
        trackaNotes: 'Your Tracka data is your primary data set for a bivariate analysis. Record your observation time (x) and your Tracka score (y) for each animal. Back in class you\'ll plot these on a scatter diagram, calculate the line of best fit, and interpret the gradient and intercept in the context of the zoo observation task.',
        teacherNote: 'At Stage 5, mathematical framing should precede the visit — students should arrive at the zoo with a specific mathematical question they are trying to answer with the data they collect.',
      },
      postDiscussion: {
        heading: 'Mathematical Analysis — Let\'s Begin',
        context: 'A couple of days ago you visited Taronga Zoo and collected the data that will underpin a rigorous mathematical investigation. Before we begin formal analysis, let\'s check in on what you observed, what the numbers looked like, and what your data set contains.',
        prompts: [
          'Did you record your observation time and Tracka score for each animal? Even informally, do you notice any relationship between the two variables — does more time seem to produce a higher score?',
          'What was the most striking quantitative fact you encountered at the zoo — a population number, an animal measurement, or a statistic on an information sign?',
          'Does your data appear to support or challenge the hypothesis that longer observation time leads to a higher Tracka score — or is the relationship more complex than that?',
          'If your scatter plot contains an outlier, what mathematical and contextual explanations might account for it — and should you remove it from your analysis?',
        ],
        teacherNote: 'Begin the post-visit session with this discussion to surface numerical observations before formal statistical analysis. Share scores on the board to build the class bivariate data set.',
      },
      preContent: [
        {
          heading: 'Bivariate Data and Correlation',
          bullets: [
            'A scatter plot displays the relationship between two numerical variables — one on each axis — and allows us to describe and quantify any correlation that exists between them. Correlation can be positive (both variables increase together), negative (one increases as the other decreases), or essentially zero (no visible pattern). The strength of a correlation is described not just qualitatively but through the equation of the line of best fit: y = mx + b, where the gradient m and the y-intercept b each have a specific real-world meaning.',
            'Before your visit to Taronga Zoo in a few days, form a hypothesis: is there a positive correlation between the time you spend observing an animal and the score you receive in Tracka? If yes, what would you expect the gradient of the line of best fit to represent — and what would a very steep gradient versus a very shallow gradient each tell you about the relationship between time and quality of observation?',
          ],
        },
        {
          heading: 'Exponential Models in Ecology',
          bullets: [
            'Population growth and decline can be modelled using exponential functions of the form P(t) = P₀ × b^t, where P₀ is the initial population, b is the growth factor per time period, and t is time. When b > 1 the population grows; when 0 < b < 1 the population declines. The Sumatran Tiger had a wild population of approximately 600 in 1990 and approximately 400 in 2024 — use these two data points to calculate the value of b, then use your model to project when the population would reach 100 individuals at this rate.',
            'Exponential models are powerful but they have real limitations as conservation tools: they assume a constant rate of change, ignore carrying capacity, cannot account for sudden environmental disruptions, and extrapolate far beyond the data they are built from. As you visit Taronga Zoo in a few days and observe endangered species in person, consider what factors in their real-world situation would make a simple exponential model too crude to be genuinely useful in a policy brief.',
          ],
        },
        {
          heading: 'Compound Probability in Conservation',
          bullets: [
            'Compound probability allows us to calculate the likelihood of multiple events occurring together or in sequence. For independent events, P(A and B) = P(A) × P(B), and P(A or B) = P(A) + P(B) − P(A and B). In a conservation context: if P(captive breeding program succeeds) = 0.7 and P(natural habitat is protected) = 0.4, and both outcomes are required for the species to survive, then P(species survives) = 0.7 × 0.4 = 0.28 — a sobering 28%. If only one of the two is sufficient, the probability increases significantly.',
            'Expected value extends probability into decision-making: if Program A has P(success) = 0.8 and delivers an outcome valued at 1,000 animal births over 10 years, its expected value is 800. If Program B has P(success) = 0.5 and delivers 2,500 births, its expected value is 1,250 — suggesting Program B is mathematically superior despite its lower probability of success. At Taronga Zoo in a few days, think about what values you would assign to the outcomes of the different conservation programs you learn about.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Regression Analysis',
          bullets: [
            'Using the bivariate data you collected at Taronga Zoo — observation time on the x-axis and Tracka score on the y-axis — plot your class data set as a scatter diagram. Use Desmos or GeoGebra to find the line of best fit and determine its equation in the form y = mx + b. Write the gradient m as a complete sentence: "For every additional minute spent observing, the Tracka score changes by approximately ___ points." Does this interpretation make real-world sense?',
            'Identify any outliers on your scatter plot — data points that sit noticeably far from the line of best fit — and write a mathematical and contextual explanation for each. An outlier doesn\'t automatically mean an error; it might represent a student who chose a very active animal, who had prior knowledge of the species, or who simply wrote with unusual precision. The process of explaining outliers is where the mathematics and the real world genuinely connect.',
          ],
        },
        {
          heading: 'Population Modelling Workshop',
          bullets: [
            'Open Desmos and enter the Sumatran Tiger wild population data: approximately 600 in 1990 and 400 in 2024. Fit an exponential model of the form P(t) = a × b^t to the two data points, calculate the values of a and b, and use your model to project when the population would fall below 100 individuals if the current rate of decline continued unchanged. Check the fit of your model against any intermediate data points you can find, and calculate or estimate the R² value to quantify how well your model describes the real trend.',
            'Now critically evaluate your model: what assumptions does it make that are clearly unrealistic? A simple exponential model ignores carrying capacity, assumes a constant rate of decline, and cannot account for conservation interventions. Try replacing your exponential model with a logistic model that incorporates a floor value of 50 individuals (reflecting the minimum viable population) — how does the projection change, and which model do you think is more honest about the real-world situation?',
          ],
        },
        {
          heading: 'Probability Decision Analysis',
          bullets: [
            'Taronga must allocate limited conservation funding between two competing programs. Program A has P(success) = 0.8 and costs $300,000; Program B has P(success) = 0.5 and costs $150,000. Calculate the expected value of each program using E = P(success) × outcome value, where you define "outcome value" as the number of animals successfully protected over 10 years. On purely mathematical grounds, which program does expected value theory recommend — and does your answer change if you define "outcome value" differently?',
            'Now add an ethical dimension to your analysis: expected value theory treats all outcomes as interchangeable if their mathematical value is equal, but in conservation, losing a critically endangered species is qualitatively different from losing a species with a stable wild population. Write a 3-sentence argument for which program you would fund, using both your expected value calculation AND an ethical justification that goes beyond the mathematics.',
          ],
        },
      ],
      preChecklist: [
        'Review exponential functions and scatter plots before the visit',
        'Design a bivariate data collection sheet: time observing vs score per animal',
        'Think about: what two variables at the zoo are most likely to be correlated?',
        'Predict: will the line of best fit have a positive or negative gradient?',
      ],
      postAction: [
        'Mathematical Conservation Report',
        'Produce a full mathematical investigation (800–1000 words + all working) on one of: (a) exponential population modelling for an endangered Taronga animal — build, validate and critique a predictive model; OR (b) statistical analysis of Tracka observation data — test a hypothesis using a scatter plot, regression equation and interpretation. Include all graphs, equations and a written conclusion. Submit as a formal report.',
      ],
      exitPre: [
        'A population follows P(t) = 600 × 0.94^t. What is the population after 10 years? Show full working.',
        'Two events are independent: P(A) = 0.6, P(B) = 0.7. Find P(A and B) and P(A or B).',
      ],
      exitPost: [
        'A population follows P(t) = 600 × 0.94^t. When does the population fall below 200? Show working.',
        'Two conservation events are independent: P(A) = 0.6, P(B) = 0.7. Find P(A and B) and P(A or B).',
      ],
    },
  },

  english: {
    2: {
      topic: 'Observation & Descriptive Writing',
      outcomes: ['EN2-VOCAB-01', 'EN2-COMP-01'],
      li: 'Use precise vocabulary, vivid verbs and descriptive detail to write engaging animal observations.',
      sc: [
        'I can use at least three types of describing words — adjectives, verbs and adverbs — in my writing',
        'I can write a complex sentence about an animal\'s behaviour',
        'I can explain the meaning of three new vocabulary words I found at the zoo',
      ],
      preDiscussion: {
        heading: 'Words That Bring Animals to Life',
        context: 'In our English lessons recently we have been exploring how writers choose their words carefully to paint pictures in a reader\'s mind. In a few days you will visit Taronga Zoo, where you\'ll use the Taronga Tracka app to write real animal observations that will be scored on the strength of your language choices.',
        prompts: [
          'What is a strong verb? Can you give me five verbs that describe the way a big cat might move — that are more powerful and more precise than "walked" or "ran"?',
          'What is the difference between "the gorilla sat against the rock" and "the gorilla hunched against the rough grey rock, its heavy knuckles resting on the damp ground"? What exactly did the second writer do that the first writer didn\'t?',
          'What are adjectives and adverbs? Can you give me one precise adjective and one useful adverb that you might use to describe an animal\'s colour, texture or way of moving?',
          'When we visit the zoo in a few days, you\'ll need to write a real observation for each animal. What do you think you should actually include to make it a strong, interesting piece of writing?',
        ],
        trackaNotes: 'In Taronga Tracka, your observation is scored on three things: the behaviour you describe, the specific detail you include, and the quality of your writing. For English, the most important thing is to use precise, powerful language — strong verbs, vivid adjectives, and specific detail. One excellent sentence is worth more than five vague ones.',
        teacherNote: 'Use this discussion 2–3 days before the excursion. Help students develop a writer\'s eye before they arrive — the goal is for them to approach the animals as a subject to describe, not just something to look at.',
      },
      postDiscussion: {
        heading: 'Let\'s Share Our Writing',
        context: 'A couple of days ago you visited Taronga Zoo and used Taronga Tracka to write real animal observations. Before we develop these into a larger piece of writing, let\'s celebrate the best language choices from your visit and think about what made them powerful.',
        prompts: [
          'Would someone share their favourite sentence from their Tracka observation? Tell us: what strong verb or precise adjective did you use, and why did you choose that word over a simpler one?',
          'Did you collect any new vocabulary words from signs or keeper cards at the zoo? Share one word, explain what it means, and use it in a new sentence about the animal you observed.',
          'What was the most interesting or surprising behaviour you wrote about? Read your sentence aloud — can the class picture exactly what the animal was doing?',
          'If you could go back and improve just one sentence from your observation, what would you change — and what specific language choice would you make to lift it?',
        ],
        teacherNote: 'Begin this session positively by inviting students to read their best sentence aloud. Build a class verb wall of strong verbs and precise adjectives collected during the visit.',
      },
      preContent: [
        {
          heading: 'Wow Words for Animals',
          bullets: [
            'Writers who describe animals powerfully choose their verbs with great care — instead of "the tiger walked", a skilled writer might write "the tiger prowled", "stalked", "paced" or "padded", because each of those words creates a slightly different picture in the reader\'s mind. Strong verbs do more work than weak ones: pounce, groom, lunge, splash, trumpet, slither — each one tells you not just what the animal is doing but how it is doing it.',
            'Precise adjectives and adverbs make descriptions vivid and specific: "striped, amber-eyed, silky-furred, razor-clawed" tell us something exact, while "big" or "nice" tell us almost nothing at all. At Taronga Zoo in a few days, collect at least five strong vocabulary words — verbs, adjectives and adverbs — from the animals you observe and the signs you read. These will become the building blocks of your best writing.',
          ],
        },
        {
          heading: 'What Makes a Great Observation?',
          bullets: [
            'A great animal observation describes what you actually see in specific, concrete detail — not just what the animal looks like, but what it is actively doing, which part of its body is involved, and how it is moving. Compare these two sentences: "The gorilla was big and strong" tells a reader nothing useful, while "The gorilla gripped the wooden beam with both feet, hanging at a slight angle as it reached down to collect a piece of food" gives the reader a precise, vivid picture they can see in their mind.',
            'Use your senses as a writer — not just sight, but sound, movement and texture. At Taronga Zoo in a few days, before you write your Tracka observation, spend 30 seconds just watching and noticing: what is the animal doing with its body? What is it responding to? What would a person who wasn\'t there need to know to picture this exact moment? The answers to those questions are what great observation writing contains.',
          ],
        },
        {
          heading: 'Getting Ready to Write',
          bullets: [
            'At Taronga Zoo in a few days, you will be a writer collecting material for your observations. One of the best things you can do is to find words you don\'t know from the signs and keeper information cards near each enclosure — write down what you think they mean, and then check whether you\'re right. Using one genuinely new and specific word in your Tracka observation shows real vocabulary growth, and the app rewards that kind of precision.',
            'Remember that the Tracka app scores your writing based on how specific and detailed it is — a vague observation earns low points no matter how long it is, while a precise, vivid sentence earns high points even if it is short. Think of it this way: every word you write should be doing a clear job. If you can remove a word and the sentence still makes perfect sense, that word probably wasn\'t doing enough work.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Sharing Our Best Sentences',
          bullets: [
            'The best way to improve as a writer is to study writing that works — and we now have a whole classroom full of real animal observations from the excursion to learn from. Read your favourite sentence from your Tracka observation aloud: the class will identify what made it powerful — was it a strong verb, a precise adjective, a specific physical detail, or an unexpected comparison that brought the animal to life in an unexpected way?',
            'After each sentence is shared, the class will find the single strongest word choice and add it to our class verb and adjective wall. Then everyone will take one sentence from their own observation and upgrade it using a suggestion or technique they\'ve noticed in a classmate\'s writing — because the goal is not just to celebrate what\'s already good, but to get better at making deliberate language choices.',
          ],
        },
        {
          heading: 'Vocabulary We Discovered',
          bullets: [
            'Share the new words you collected from signs, keeper cards and information panels at Taronga Zoo. For each word, tell the class what it means, which animal it was connected to, and use it in a new example sentence about that animal. Together as a class, we will create a vocabulary glossary where every new word is recorded with its meaning and an example sentence — these become permanent tools for your writing.',
            'Now try to group the words by type — are they scientific and technical, descriptive and sensory, or positional and structural? Different types of vocabulary serve different purposes in writing, and knowing which type to reach for in which situation is one of the most important skills a writer develops over time. Which new word from your zoo visit was most useful for describing the specific way your chosen animal moved or behaved?',
          ],
        },
        {
          heading: 'Text Features of Animal Writing',
          bullets: [
            'At Taronga Zoo you were surrounded by different types of writing — enclosure signs, keeper information cards, conservation campaign panels, interactive displays and maps — and each one used different text features to communicate effectively with its audience. Think about the signs you read: did they use headings, bold text, labelled diagrams, statistics, or rhetorical questions? Why do you think the writers made those specific choices?',
            'A zoo sign and a creative story both use words, but they are completely different text types with different purposes, different audiences and different structures. Understanding how text type shapes language choices — formal versus informal, instructive versus descriptive, factual versus emotional — is one of the key skills you\'ll develop in your post-visit writing project, where you\'ll get to choose which features best suit your own purpose and audience.',
          ],
        },
      ],
      preChecklist: [
        'Write 5 strong verbs that describe how animals move — these are your "wow words"',
        'Think about your senses: what will you SEE? HEAR? Notice about movement?',
        'Practice writing one complex sentence about an animal you already know',
        'Look out for new vocabulary words at the zoo and collect at least 3',
      ],
      postAction: [
        'Animal Information Report',
        'Write an information report (200–300 words) about one animal you observed at Taronga Zoo. Use three sections: Introduction (what the animal is, where it lives), Features (what it looks like — use 5 precise describing words), and Behaviour (what it does — use 4 strong verbs). Add a labelled diagram. Include at least two vocabulary words you discovered at the zoo.',
      ],
      exitPre: [
        'Write one sentence about an animal using a strong verb, a precise adjective AND an adverb.',
        'Which is a better word in this sentence — and why? The lion [walked / prowled / went] through the grass.',
      ],
      exitPost: [
        'Write one sentence about an animal you observed using a strong verb, a precise adjective AND an adverb.',
        'Circle the best word and explain your choice: The gorilla [sat / hunched / rested] against the rock.',
      ],
    },
    3: {
      topic: 'Informational & Persuasive Writing',
      outcomes: ['EN3-VOCAB-01', 'EN3-COMP-01'],
      li: 'Write structured informational and persuasive texts using evidence from the zoo visit, formal vocabulary and clear argument structures.',
      sc: [
        'I can write a persuasive paragraph using CEEL structure with evidence from the zoo',
        'I can use at least three persuasive techniques in my writing',
        'I can use formal vocabulary and connective language to strengthen my argument',
      ],
      preDiscussion: {
        heading: 'Building an Argument About Conservation',
        context: 'In our recent English lessons we have been developing persuasive writing skills — constructing arguments, using evidence, and applying the CEEL structure. In a few days you will visit Taronga Zoo, and your first-hand observations will become the evidence that powers your post-visit persuasive writing.',
        prompts: [
          'What is a CEEL paragraph? Can someone walk me through the structure — Claim, Evidence, Explanation, Link — using an example argument about any topic you know well?',
          'What makes a piece of evidence strong in a persuasive argument? Is a personal observation stronger or weaker than a statistic — or does it depend on the claim you\'re supporting?',
          'What persuasive techniques have we studied? Which do you find most effective as a reader — and can you explain why that technique works on you specifically?',
          'When you visit the zoo in a few days, what specific observations or facts do you want to collect that could become strong evidence in a persuasive essay about conservation?',
        ],
        trackaNotes: 'In Taronga Tracka, your animal observation becomes your primary evidence. For English Stage 3, write your observation as if it\'s going to become the centrepiece of a CEEL paragraph — be specific, be descriptive, and note anything surprising or emotionally significant that a persuasive writer could use powerfully.',
        teacherNote: 'Use this discussion 2–3 days before the excursion to prime students to think like writers gathering material. The goal is for them to arrive at the zoo with a persuasive argument already forming in their minds.',
      },
      postDiscussion: {
        heading: 'Your Evidence Is In — Let\'s Discuss',
        context: 'A couple of days ago you visited Taronga Zoo and gathered real first-hand evidence through your Taronga Tracka observations. Before you begin drafting your persuasive writing, let\'s discuss what you collected and how it might work in an argument about conservation.',
        prompts: [
          'What one fact, observation or experience from the zoo surprised you most — and how could you use it as specific evidence in a persuasive essay?',
          'Did Taronga itself use any persuasive techniques in their signs, videos or keeper talks? What technique did you notice, and what effect did it have on you as an audience member?',
          'Which animal gave you the strongest, most specific observation that you could use as CEEL evidence? Read the key sentence from your Tracka observation aloud.',
          'Has visiting the zoo changed your personal position on whether zoos help or harm wildlife conservation — and if it has, what specifically was the observation that shifted your thinking?',
        ],
        teacherNote: 'This debrief connects emotional experience to persuasive purpose. Students who feel strongly about what they saw are most likely to write with genuine conviction — channel that energy into evidence-based argument.',
      },
      preContent: [
        {
          heading: 'Text Structures for Information',
          bullets: [
            'Informational writing uses structures that help readers follow complex ideas clearly. A Problem-Solution structure ("This species is endangered because... Taronga is addressing this by...") is powerful for conservation writing because it identifies a threat and presents a response. Cause-Effect ("Due to habitat loss, gorilla populations have declined by more than 60% in three decades") creates a logical chain that builds understanding. Compare-Contrast ("Chimpanzees and gorillas both... however, they differ in...") helps readers see relationships between similar things.',
            'Choosing the right structure for your purpose matters enormously: a zoo sign uses short, punchy information blocks with labels; a research report uses formal headers, evidence and references; a letter to council uses direct address, a clear request and a logical argument sequence. In a few days at Taronga Zoo, look at the different types of writing you encounter and ask yourself: what structure is this writer using, and is it the right choice for their audience and purpose?',
          ],
        },
        {
          heading: 'The Language of Persuasion',
          bullets: [
            'Persuasive writers have a toolkit of techniques they deploy deliberately to influence how readers think and feel. Rhetorical questions invite the reader to agree without being told to: "Can we really afford to lose another species?" Statistics function as hard evidence: "Over 60% of primate species are now threatened with extinction." Expert authority borrows credibility: "According to Taronga\'s chief conservation scientist..." And emotive language creates an emotional connection: "These magnificent creatures face an increasingly uncertain future."',
            'The most effective persuasive writing uses a combination of these techniques — hard evidence to establish credibility, emotional language to create engagement, and rhetorical questions to draw the reader into agreement. At Taronga Zoo in a few days, notice where the institution itself uses persuasive language — on signs, in keeper talks, in their conservation messaging — and think about which techniques appear most frequently and why.',
          ],
        },
        {
          heading: 'Building a CEEL Argument',
          bullets: [
            'CEEL is a paragraph structure for persuasive writing that ensures every argument is fully developed rather than merely stated. The Claim is your position in one strong, specific sentence. The Evidence supports that claim with a fact, statistic, expert opinion, or concrete example. The Explanation unpacks the evidence — it explains WHY the evidence supports your claim, not just what the evidence says. The Link connects the paragraph back to your overall argument.',
            'A common mistake in CEEL writing is to make the explanation too short — writers present the evidence and assume the reader will understand why it matters, but strong persuasive writing never assumes. Practice now: write one CEEL paragraph arguing that Taronga Zoo plays an important role in protecting endangered species. Use a specific statistic as your evidence, and make your explanation at least two sentences long — that is where the real persuasive work happens.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Evidence from Our Visit',
          bullets: [
            'At Taronga Zoo a couple of days ago, you gathered genuine first-hand evidence for persuasive writing — and first-hand evidence from direct observation is one of the most powerful types a writer can use because it is personal, specific and impossible to dispute. Share with the class: what fact or observation from your Tracka visit genuinely surprised you, and what conservation argument could it support? Is the evidence specific enough to be persuasive, or does it need more precise detail to do its job?',
            'Look at your Tracka observation and identify the single most powerful sentence for persuasive purposes — not the longest or most detailed sentence, but the one that would have the greatest impact on a reader who cares about conservation. Now check: is the evidence in that sentence specific (names, numbers, exact behaviours) or vague (general impressions)? Specific evidence persuades; vague evidence merely suggests.',
          ],
        },
        {
          heading: 'Evaluating Persuasive Techniques',
          bullets: [
            'Read the conservation text your teacher has selected — this could be a Taronga campaign advertisement, a keeper information card, or an excerpt from a conservation website — and identify every persuasive technique the writer has used. Look for: rhetorical questions, statistics, emotive language, expert authority, repetition, inclusive language ("we", "our"), and appeals to the future or to children. Which technique appears most frequently, and which single technique do you think is most effective in this specific text?',
            'Here is a genuinely difficult question worth discussing honestly: can persuasive writing be dishonest? Where is the line between choosing emotive language strategically and manipulating an audience unfairly? Did Taronga\'s communication at the zoo ever feel manipulative rather than informative to you — and what would make you trust or distrust a conservation message from an organisation that clearly has its own interests in promoting conservation?',
          ],
        },
        {
          heading: 'Feedback and Redrafting',
          bullets: [
            'Swap your CEEL paragraph with a partner and read theirs carefully with a writer\'s eye. Give them one genuine strength — something specific about their language choices, their evidence, or their explanation that actually works — and one specific improvement: not "make it better" but exactly what change you would make to the wording, evidence or structure, and why that change would strengthen the argument.',
            'Now redraft your paragraph incorporating the feedback you received — and be honest about whether the change made it stronger or not, because not all feedback is correct and learning to evaluate feedback is itself an important writing skill. Read both versions aloud to yourself: which is more persuasive, and what specific change made the biggest difference to how convincing the paragraph feels?',
          ],
        },
      ],
      preChecklist: [
        'Write your position statement: do you think zoos help or harm wildlife conservation?',
        'Find one statistic about an endangered animal to use as evidence in your writing',
        'Practice the CEEL structure: Claim → Evidence → Explanation → Link',
        'List three persuasive techniques — plan to use one in your zoo observation writing',
      ],
      postAction: [
        'Conservation Argument Essay',
        'Write a 350–500 word persuasive essay arguing for one conservation action to protect an animal you observed at Taronga Zoo. Use at least three different persuasive techniques, CEEL structure for each body paragraph, evidence from your zoo visit, and formal vocabulary throughout. Include a title, introduction, two body paragraphs, and a conclusion.',
      ],
      exitPre: [
        'Write a one-sentence claim about conservation using an animal you know. Then write one piece of evidence to support it.',
        'Which persuasive technique is used here? "Can we really let the last 600 tigers disappear on our watch?"',
      ],
      exitPost: [
        'Write one CEEL paragraph arguing that Taronga Zoo is important for conservation. Use evidence from your visit.',
        'Identify two persuasive techniques in this sentence: "Magnificent creatures like the Sumatran Tiger will vanish forever unless we act now."',
      ],
    },
    4: {
      topic: 'Analytical Writing & Close Reading',
      outcomes: ['EN4-ECA-C-01', 'EN4-ECB-C-01'],
      li: 'Analyse how language choices create meaning and effect in conservation texts, and apply analytical writing skills to evaluate zoo observation writing.',
      sc: [
        'I can write an analytical TEEL paragraph with a specific quote and language explanation',
        'I can identify and explain the effect of figurative language in a text',
        'I can analyse my own observation writing and identify deliberate language choices',
      ],
      preDiscussion: {
        heading: 'Language, Purpose & the Text We\'ll Read',
        context: 'In our recent units we have been analysing how writers make deliberate language choices to position their audience and create specific effects. In a few days you will visit Taronga Zoo, where you will encounter multiple conservation texts — and create one of your own in the form of a Tracka observation.',
        prompts: [
          'What does it mean to "analyse" a text rather than just describe it? What is the difference between saying what a text is about and explaining what it does to the reader?',
          'What is a TEEL paragraph? Can you identify all four components in this sentence: "Taronga positions itself as a conservation hero through its use of emotive imagery, constructing an implied community of concerned citizens who share responsibility for the natural world"?',
          'What are some specific examples of figurative language — metaphor, personification, imagery — and what emotional or intellectual effect can each technique create in an audience?',
          'When you observe animals at the zoo and use Tracka to record your observations, you are producing a text with a purpose and an audience. Who reads a Tracka observation, and what language choices would best serve that reader?',
        ],
        trackaNotes: 'Your Tracka observation is itself a text with a purpose, an audience and deliberate language choices. For English Stage 4, approach your observation analytically — choose strong verbs deliberately, construct complex sentences with purpose, and consider how a reader would respond to your language choices. You will be asked to analyse your own observation as a text after the visit.',
        teacherNote: 'This discussion should happen 2–3 days before the excursion. The aim is for students to approach the zoo visit not just as an experience but as an opportunity to gather texts they will later analyse and produce.',
      },
      postDiscussion: {
        heading: 'The Zoo as a Text — Let\'s Analyse',
        context: 'A couple of days ago you visited Taronga Zoo and immersed yourself in a rich environment of conservation texts — signs, keeper talks, video installations, and your own Tracka observation. Before we begin our formal language analysis, let\'s share what you noticed.',
        prompts: [
          'What is one piece of language from a Taronga sign, video or keeper card that stood out to you? What technique was used — and what specific effect did it create on you as an audience member?',
          'Reread your Tracka observation now. What is one word or phrase you chose deliberately, and what effect were you trying to create for the reader of your observation?',
          'Did you notice any figurative language at the zoo? Where did you find it, and what did it do to you emotionally or intellectually as a reader?',
          'Whose point of view did Taronga\'s conservation texts centre? Who or what was absent from their narrative — and does that absence matter?',
        ],
        teacherNote: 'This debrief functions as a text analysis warm-up. Encourage students to bring specific examples from their visit — the more concrete the reference, the more productive the analytical discussion that follows.',
      },
      preContent: [
        {
          heading: 'Text Purpose and Audience',
          bullets: [
            'Every text is constructed for a specific purpose and a specific audience — and these two decisions shape every other choice a writer makes, from vocabulary to sentence length to tone. A zoo enclosure sign and a scientific field report might describe the same animal using many of the same facts, but their language choices are completely different: one uses short sentences, accessible vocabulary and emotional hooks; the other uses technical terminology, formal register and hedged claims.',
            'Before your Taronga Zoo visit in a few days, practise identifying purpose and audience in different text types: what is the purpose of a keeper information card, and how does it differ from a conservation campaign advertisement? Who is the audience for a scientific field report versus a zoo education program? How does knowing the audience change which words you choose and how long your sentences are?',
          ],
        },
        {
          heading: 'TEEL Language Analysis',
          bullets: [
            'TEEL is the structure for analytical writing: Topic sentence (a clear analytical claim about the text), Evidence (a specific quote or textual reference in inverted commas), Explanation (unpacking the language choice and analysing its effect on the reader), and Link (connecting back to your overarching argument about the text\'s purpose). The explanation is the most important part — it\'s where analytical thinking actually happens, not just in identifying the technique but in articulating precisely why the writer made that choice and what it achieves.',
            'Practice now with a real example from a Taronga conservation campaign. Take this sentence: "Every breath these creatures take may be among their last." Write a full TEEL paragraph: make a claim about what the writer is doing, quote the sentence as evidence, explain the specific effect of "every breath" and "may be among their last" on the reader, and link back to your argument about how this text positions its audience. A strong explanation is at least two sentences.',
          ],
        },
        {
          heading: 'Figurative Language for Effect',
          bullets: [
            'Figurative language creates meaning beyond the literal — and in conservation writing, it is one of the most powerful tools available because it makes abstract threats feel immediate and real. Metaphor: "The tiger is a ghost in the grass — visible but already vanishing." Personification: "The forest mourns its lost inhabitants one species at a time." Both examples create a specific emotional response that a plain factual statement cannot achieve, and both make a specific ideological argument about the relationship between humans and the natural world.',
            'At Taronga Zoo in a few days, treat yourself as a language collector as well as an animal observer. Look for figurative language on information signs, in keeper talks, in conservation campaign materials and in video installations — notice when writers reach for metaphor, personification, alliteration or imagery rather than plain language, and ask yourself what specific effect they were trying to create in their audience by making that choice.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Close Reading of Zoo Texts',
          bullets: [
            'Let\'s examine a Taronga conservation text together — a sign, campaign excerpt or keeper script — using the close reading skills we\'ve been developing. Read the text once for meaning, then read it again annotating for: figurative language, specific word choices that seem deliberate, structural features like repetition or sentence length variation, and any moments where you feel the writer is directly trying to position you as a reader.',
            'Now write one TEEL paragraph analysing how this text positions its audience. Make a specific analytical claim in your topic sentence — not "this text uses emotive language" but "Taronga\'s use of collective pronouns and present tense urgency positions the audience as already complicit in conservation, making passive non-action feel personally irresponsible." The more precise your claim, the more rigorous your analysis can be.',
          ],
        },
        {
          heading: 'Your Observation as a Text',
          bullets: [
            'Reread your Tracka observation now — not as the writer who produced it, but as an analyst examining someone else\'s work. Identify: strong verb choices, precise nouns, any hedging language ("appeared to", "seemed to"), any figurative language you used deliberately or accidentally, and any moment where your language choices seem particularly effective or particularly weak. What purpose does your observation serve as a text, and who is its audience?',
            'Now revise one section of your observation — not to add more content, but to make your language choices more deliberate and analytically defensible. Every word you keep should be earning its place; every word you change should be changed for a specific reason you can articulate. Write a brief note beside your revision explaining what change you made and why the new language works better for your purpose and audience.',
          ],
        },
        {
          heading: 'Comparative Analysis',
          bullets: [
            'Compare two texts about the same animal — a children\'s zoo brochure and a scientific field report — and analyse how purpose and audience shape every aspect of the language: vocabulary level, sentence length, use of technical terminology, presence or absence of emotional language, structural choices, and the implied relationship between writer and reader. Which text is more persuasive? Which is more accurate? Which is more accessible — and do those three qualities pull in different directions?',
            'Here is the genuinely difficult question: can a single text be simultaneously persuasive, accurate and accessible? What are the trade-offs, and which trade-off does Taronga appear to make most consistently in its public communication? The answer to that question says something important not just about Taronga\'s communication strategy, but about the fundamental challenge of communicating science and conservation to a public audience.',
          ],
        },
      ],
      preChecklist: [
        'Review figurative language techniques: metaphor, personification, imagery, alliteration',
        'Practice writing one TEEL paragraph analysing a short text you choose yourself',
        'At the zoo: collect examples of language that you find effective or surprising',
        'Your Tracka observation will become a text you analyse — write it carefully',
      ],
      postAction: [
        'Language Analysis Essay',
        'Write a 500–600 word analytical essay examining how language is used in Taronga Zoo\'s conservation communication. Select two texts (a keeper sign, campaign video transcript, or your own Tracka observation). Analyse: figurative language, word choice, sentence structure, and how these choices position the audience. Use TEEL paragraphs throughout. Your own Tracka observation may be included as a primary text.',
      ],
      exitPre: [
        'Identify the language technique and explain its effect: "The last tiger paces in a shrinking world, its amber eyes searching for what no longer exists."',
        'Write a TEEL topic sentence for an essay arguing that conservation language is deliberately designed to create emotion.',
      ],
      exitPost: [
        'Write a TEEL paragraph analysing the figurative language in: "The forest mourns its lost inhabitants one species at a time."',
        'Identify two language choices in your own Tracka observation and explain why you made them.',
      ],
    },
    5: {
      topic: 'Critical Analysis & Multimodal Texts',
      outcomes: ['EN5-ECA-C-01', 'EN5-ECB-C-01'],
      li: 'Critically analyse how ideology is constructed in conservation texts and compose sophisticated multimodal arguments using evidence from first-hand zoo observation.',
      sc: [
        'I can identify and analyse ideological positioning in a multimodal conservation text',
        'I can construct a critical argument with counterargument and synthesis',
        'I can evaluate my own Tracka observation as an ideologically positioned text',
      ],
      preDiscussion: {
        heading: 'Ideology, Representation & the Conservation Narrative',
        context: 'In our critical literacy studies we have examined how texts construct ideology and position readers within particular worldviews. In a few days you will visit Taronga Zoo — an institution that produces significant conservation communication. Approach this visit as a critical analyst, not simply a visitor.',
        prompts: [
          'What do we mean when we say a text "embeds ideology"? Can you give an example from a text we have studied where this is clearly visible — and explain what worldview that text normalises?',
          'Whose voice is typically centred in Western conservation narratives — and whose voices are typically absent? What are the implications of those absences for how conservation is understood and practised?',
          'Is it possible to communicate about nature, animals or conservation without ideological positioning? Defend your answer with specific reasoning.',
          'When you produce an observation in Taronga Tracka, you are creating a text within an institution\'s framework. What ideological assumptions does the scoring system itself make about animals, knowledge and the purpose of a zoo visit?',
        ],
        trackaNotes: 'Your Tracka observation is primary source material for your critical analysis. At Stage 5, notice not only what you observe but the framework within which you are being asked to observe — the scoring criteria, the vocabulary prompts, the institutional setting. All of this is ideologically constructed, and your critical essay will engage with it.',
        teacherNote: 'This discussion is for 2–3 days before the excursion. At Stage 5, the goal is to send students into the zoo with a critical lens already calibrated — they should be noticing how the institution communicates as much as they are observing the animals.',
      },
      postDiscussion: {
        heading: 'Deconstructing the Conservation Narrative',
        context: 'A couple of days ago you visited Taronga Zoo as critical analysts, collecting textual evidence of how a major conservation institution constructs its narrative and positions its audience. Before you begin your critical essay, let\'s open the discussion.',
        prompts: [
          'What was the most ideologically loaded text or visual you encountered at Taronga? What worldview did it embed, and how — through language, image selection, composition, or structural choices?',
          'Did your visit reinforce or challenge your pre-existing assumptions about zoos and conservation? Be specific about what you observed and why it was or wasn\'t cognitively disruptive.',
          'Looking at your Tracka observation as a text: what ideology does it embed? What assumptions does the scoring framework make about the value of certain kinds of knowledge over others?',
          'If you were redesigning one element of Taronga\'s conservation communication to represent a more equitable or critical perspective, what would you change — and why would that change matter?',
        ],
        teacherNote: 'At Stage 5, this is a seminar-style critical discussion. Don\'t rush to resolve tensions — productive disagreement is the goal. Students should leave this discussion with a clear critical argument beginning to form.',
      },
      preContent: [
        {
          heading: 'Critical Reading — Ideology in Texts',
          bullets: [
            'Critical literacy requires us to read not just for meaning but for ideology — the embedded worldview that every text carries and normalises. Conservation texts are no different from any other texts in this respect: they make specific claims about who is responsible for nature, who has the authority to speak about it, and what counts as valid knowledge. Taronga\'s narrative — the Western zoo as conservation hero — is a particular story told from a particular position, and critical reading asks us to identify whose perspective is centred and whose voices are structurally absent.',
            'In a few days at Taronga Zoo, approach every text you encounter — signs, keeper talks, conservation campaigns, interactive displays — as a critical analyst rather than a passive consumer. Ask: what assumptions does this text make about animals and their relationship to humans? Whose conservation knowledge is being legitimised here, and whose is being ignored? What would this narrative look like if it were told from a different cultural or geographical position?',
          ],
        },
        {
          heading: 'Multimodal Text Analysis',
          bullets: [
            'Multimodal texts communicate through multiple simultaneous modes: linguistic (words), visual (images, colour, layout), audio (sound, music, voice), spatial (arrangement, proximity, size), and gestural (movement, posture, expression in images). Each mode carries ideological weight independently, and the interaction between modes creates complex layers of meaning. In a multimodal conservation text, what is foregrounded — placed prominently, shown at large scale, given the most visual weight — and what is marginalised or absent?',
            'Analyse Taronga\'s visual communication before your visit: what story does their use of colour, typography, animal imagery and human-animal proximity tell before you read a single word? What emotions are constructed through image selection, and what ideological position about the relationship between humans and nature does that emotional construction assume? At the zoo in a few days, extend this analysis to the physical environment itself — what ideological choices are embedded in the design of the enclosures and the visitor experience?',
          ],
        },
        {
          heading: 'Constructing a Critical Argument',
          bullets: [
            'Critical essays do not merely describe — they evaluate, challenge and construct an argument that acknowledges complexity and contradiction. The structure of a sophisticated critical argument moves from position (your thesis) through counterargument (the strongest version of the opposing view) to rebuttal (why your position still holds despite the counterargument) and synthesis (what a nuanced reading of the evidence actually concludes). Academic critical language includes: "This positions the audience to...", "One might argue... however...", "This reading is complicated by...", "The text\'s ideological investment in... reveals..."',
            'Draft a thesis for a critical essay: is Taronga\'s conservation narrative genuinely empowering for audiences, or does it ultimately reproduce a paternalistic relationship between Western institutions and the natural world? The strongest thesis is one that cannot be answered with a simple yes or no — it must acknowledge the evidence on both sides and stake a position that is specific, arguable and supported by textual analysis.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Critical Analysis Debrief',
          bullets: [
            'Share with the class: what ideology underpins Taronga\'s conservation narrative, and what specific textual evidence from your visit supports that reading? Push past broad observations — "they use emotional language" — to genuinely analytical claims: what specific ideological assumption does that emotional language normalise, and who does it serve? The question of who benefits from a particular narrative is always a useful starting point for ideological analysis.',
            'Here is the hardest question worth sitting with: is it possible to communicate about conservation without any ideological positioning at all? If not — and most critical theorists would argue it is not — then the question is not whether to embed ideology but which ideology to embed, and whose interests it should serve. Has your visit to Taronga changed how you think about this question, or has it simply confirmed what you already suspected?',
          ],
        },
        {
          heading: 'Multimodal Text Workshop',
          bullets: [
            'Share your draft multimodal composition with a peer and ask them to perform a brief ideological analysis: what worldview does your text embed, is it intentional, and are your visual and linguistic choices working together coherently to construct a unified argument? The goal of this peer analysis is not to judge whether your ideology is correct, but to surface the assumptions that are embedded in your own communication choices — assumptions you may not have noticed because they are so normalised for you.',
            'Revise one specific element of your composition to strengthen the ideological clarity or the critical self-awareness of your message. This might mean choosing a different image, rewriting a caption, adjusting the visual hierarchy, or adding a brief reflexive statement that acknowledges your own positioning as a composer. A text that knows what ideology it is constructing and owns it explicitly is more intellectually honest than one that pretends to be neutral.',
          ],
        },
        {
          heading: 'Reflective Writing',
          bullets: [
            'Take five minutes to write freely: how did the Taronga excursion — the physical experience of observing live animals in a conservation institution — change or reinforce your pre-existing assumptions about zoos, conservation, and the relationship between humans and the natural world? Be honest rather than impressive: the most valuable critical reflection is the one that identifies a genuine assumption you held before the visit and examines honestly whether the experience challenged it or simply confirmed what you already believed.',
            'Identify one specific assumption you held before the visit that was genuinely and uncomfortably challenged — not superficially complicated, but actually disrupted. How will that disruption change the way you write about animals and nature in the critical essay you are about to begin? And what does the experience of observing a live, breathing animal at close range add to your thinking that no text — however sophisticated its ideology — can fully provide?',
          ],
        },
      ],
      preChecklist: [
        'Review ideology, hegemony and representation as critical concepts',
        'At the zoo: notice whose voices are present and whose are absent in Taronga\'s communication',
        'Collect examples where Taronga\'s language positions the audience in a specific way',
        'Your Tracka observation is a text you\'ll produce within an institutional framework — reflect on this',
      ],
      postAction: [
        'Critical Multimodal Essay & Original Text',
        'Produce: (a) A 700–900 word critical essay analysing ideology in TWO Taronga texts — one visual/digital, one written — examining how they construct conservation and position their audience (use TEEL, critical vocabulary and zoo visit evidence); AND (b) A short original multimodal text (poster, video script or digital composition) presenting an alternative conservation narrative, with a 150-word reflection on the ideological choices you made.',
      ],
      exitPre: [
        'Explain how one visual or language choice in a Taronga text positions its audience ideologically. Use specific terminology.',
        'Draft a thesis statement for a critical essay about whether Taronga\'s conservation narrative is empowering or paternalistic.',
      ],
      exitPost: [
        'Explain how one visual or language choice in a Taronga text positions its audience ideologically.',
        'Why is it impossible to create a truly "neutral" conservation text? Argue in 3 sentences using critical terminology.',
      ],
    },
  },

  pdhpe: {
    2: {
      topic: 'Health, Movement & Wellbeing',
      outcomes: ['PD2-2', 'PD2-4', 'PD2-10'],
      li: 'Identify how animals meet their health needs through movement and behaviour, and connect these to our own health and wellbeing practices.',
      sc: [
        'I can describe how an animal moves and what health need this movement meets',
        'I can identify at least two ways animals and humans have similar health needs',
        'I can observe animal body language and describe what emotion it might be showing',
      ],
      preDiscussion: {
        heading: 'Bodies in Motion — Ours and Theirs',
        context: 'In our recent PDHPE lessons we have been exploring how movement and health are connected, and how different animals use their bodies in different ways to meet their needs. In a few days you will visit Taronga Zoo, where you\'ll observe real animals and connect what you see to what you know about health and wellbeing.',
        prompts: [
          'What are some different ways animals move? Can you name five types of animal movement — and try one right now? What part of your body did you have to use to do it?',
          'What do animals and humans both need to stay healthy? Let\'s make a list together — what needs do we actually have in common, and where do animal needs differ from ours?',
          'Have you ever seen an animal that looked stressed, bored or unhappy — in real life, in a video, or at a zoo? How could you tell? What clues did its body language give you?',
          'When you use Taronga Tracka to observe an animal at the zoo in a few days, you\'ll be looking at how it moves and what that tells you about its health and wellbeing. What kind of clues would you look for in the animal\'s movement?',
        ],
        trackaNotes: 'In Taronga Tracka, your observation is scored on how specifically you describe what the animal is doing. For PDHPE, focus on the animal\'s movement — what it\'s doing with its body, why it might be moving that way, and what health need that movement is serving. The more clearly you connect what you observe to a health concept, the higher your score.',
        teacherNote: 'Use this discussion 2–3 days before the excursion. Help students develop a health-focused observation lens — they should be thinking about bodies, movement and wellbeing as they plan for the visit.',
      },
      postDiscussion: {
        heading: 'What Did Our Bodies Tell Us?',
        context: 'A couple of days ago you visited Taronga Zoo and used Taronga Tracka to observe animals moving, resting, socialising and interacting with their environment. Before we begin our post-visit activities, let\'s share what stood out to us about animal health, movement and wellbeing.',
        prompts: [
          'What was the most impressive or surprising animal movement you saw at the zoo — and what was the animal using its body to do? What health need was that movement serving?',
          'Did any animal look stressed, bored or unhappy to you? What clues in its body language or behaviour suggested that — and how is that similar to or different from how humans show those emotions?',
          'What is one thing you noticed about an animal\'s health or behaviour that connects directly to something we\'ve been learning about human health in PDHPE?',
          'If a zookeeper asked for your advice about how to help one animal you observed feel more enriched and healthy, what would you suggest — and why?',
        ],
        teacherNote: 'Open this discussion warmly — students often have strong emotional responses to the animals they observed. Channel these responses toward health and movement concepts before beginning the formal PDHPE activities.',
      },
      preContent: [
        {
          heading: 'Animals and Movement',
          bullets: [
            'Different animals move in completely different ways to meet completely different needs — a tiger stalks prey using explosive power and precise muscle control, a sea lion uses its flexible flippers to propel itself effortlessly through water, and a gorilla walks on its knuckles to distribute its enormous weight across four contact points. Every type of animal movement requires specific body adaptations, and understanding the connection between how an animal is built and how it moves is the key to understanding its health and wellbeing.',
            'Movement is not just about getting from one place to another — for animals, it serves social, emotional and survival purposes too. Play behaviour in young animals develops coordination and social bonds; pacing in captive animals can signal psychological stress; grooming between individuals maintains hygiene and strengthens relationships. Before your Taronga Zoo visit in a few days, think about which animal movements you are most curious about observing, and what those movements might tell you about the animal\'s physical and emotional health.',
          ],
        },
        {
          heading: 'Health Needs We Share',
          bullets: [
            'Wild animals need the same fundamental things we do to stay healthy: food for energy, clean water for hydration, shelter for safety, adequate sleep for recovery, and social connection for emotional wellbeing. Animals in the wild move constantly — hunting, foraging, exploring, escaping, playing — and this movement keeps them physically and mentally healthy. When animals in captivity have limited space or limited opportunities for natural behaviour, they can develop signs of stress that are not unlike the effects of a sedentary, restricted lifestyle in humans.',
            'At Taronga Zoo in a few days, you will have the opportunity to observe whether the animals appear healthy and enriched, or whether any show signs of stress or boredom. Zookeepers work actively to provide "enrichment" — new objects, puzzle feeders, social opportunities and environmental complexity — to ensure animals can meet their health needs even in a zoo setting. As you observe, think about: how would you know if this animal was thriving, and what evidence would you be looking for?',
          ],
        },
        {
          heading: 'Your PDHPE Observation Focus',
          bullets: [
            'For PDHPE, your Tracka observation is most valuable when it focuses on HOW the animal moves and WHY it moves that way — connecting what you see directly to health concepts you already understand. Is the movement vigorous exercise, careful predatory stalking, gentle social grooming, or anxious repetitive pacing? Each type of movement tells you something different about the animal\'s physical and emotional state, and naming that connection explicitly is what earns the highest Tracka scores in PDHPE.',
            'Try to link each behaviour you observe to a specific human health concept: a tiger\'s stalking behaviour uses the same muscle coordination principles as a human\'s controlled athletic movement; a gorilla\'s social grooming serves the same emotional bonding function as human physical contact and care. The stronger and more specific the connection you can draw between the animal\'s behaviour and a human health concept, the richer your observation will be — and the more meaningful this visit will be as a PDHPE learning experience.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Movement Observations',
          bullets: [
            'Share with the class: what was the most impressive animal movement you observed at Taronga Zoo, and what was the animal using its body to do? Let\'s try to replicate some of those movements right now — gorilla knuckle-walk, sea lion flipper-propulsion, tiger slow stalk — and notice which muscles you need to engage, what your centre of balance feels like, and how your body feels different from its normal resting position. Movement education starts with your own body.',
            'Now compare: how do a gorilla and a sea lion use their bodies differently to achieve movement, and what does each difference tell you about the environment and survival challenges the species evolved for? Cast your class vote — which animal at Taronga is the best natural "athlete" by the broadest definition of athletic excellence, and what specific evidence from your observation supports that claim?',
          ],
        },
        {
          heading: 'Health and Environment',
          bullets: [
            'As you observed the animals at Taronga Zoo, did they appear healthy — and what specific evidence led you to that conclusion? Did any animals display behaviours that you interpreted as signs of stress, boredom or poor wellbeing, and how would you distinguish between a stress behaviour and a natural behaviour if you weren\'t sure? Zookeepers monitor these signals constantly, using the same kind of careful behavioural observation you practised with Tracka.',
            'Taronga\'s zookeepers are essentially providing the full range of health support that their animals need — nutritional management, physical health monitoring, psychological enrichment, social relationship management and veterinary care. In that sense, they play a role that combines elements of a personal trainer, dietitian, psychologist and GP, all for a patient who cannot self-report. What can observing how zookeepers care for animals teach us about what genuinely healthy environments look like — for any living being?',
          ],
        },
        {
          heading: 'Emotional Wellbeing',
          bullets: [
            'Emotional wellbeing is not just a human concept — zookeepers and animal behaviourists recognise emotional states in animals through their body language, behaviour patterns and physiological responses. A gorilla that repeatedly rocks back and forth, a tiger that paces the same path obsessively, or a chimpanzee that refuses social interaction are all displaying behaviours that may indicate psychological stress — the animal equivalent of what we might call anxiety, boredom or depression in a human context.',
            'Enrichment for zoo animals — puzzle feeders, new objects, social opportunities, environmental complexity — is designed to meet the same psychological need for stimulation and purpose that humans meet through learning, social connection and creative activity. Think about your own school day: which aspects of your school experience provide genuine enrichment for your brain and body, and which feel like the equivalent of an animal pacing in a small enclosure? The comparison is worth taking seriously.',
          ],
        },
      ],
      preChecklist: [
        'Think about 3 different ways animals move — what health benefit does each movement provide?',
        'Plan to observe: what emotions can you see in an animal\'s body language at the zoo?',
        'List the health needs you share with animals: food, water, shelter, sleep, movement, social connection',
        'At the zoo: look for signs of stress AND signs of happiness in animal behaviour',
      ],
      postAction: [
        'Health & Movement Poster',
        'Create an A3 poster comparing the health and movement needs of one Taronga Zoo animal to a human. Include: 3 types of movement each does and why, 2 emotions shown through body language, a "day in the life" comparing the animal\'s routine to yours, and one thing YOU could do to support this animal\'s welfare. Make it visual and informative.',
      ],
      exitPre: [
        'Write one way your health needs are similar to an animal\'s and one way they are different.',
        'Which animal movement do you most want to observe on the excursion and why?',
      ],
      exitPost: [
        'Name one movement you saw an animal doing at Taronga Zoo. Explain WHY you think it was moving that way.',
        'Write one way your health is similar to an animal\'s health and one way it is different.',
      ],
    },
    3: {
      topic: 'Physical Activity & Health Choices',
      outcomes: ['PD3-1', 'PD3-4', 'PD3-10'],
      li: 'Analyse animal movement using biomechanical principles and explore the links between environmental health, wildlife conservation and human wellbeing.',
      sc: [
        'I can analyse animal movement using biomechanical vocabulary including force, balance, flexibility and power',
        'I can explain the "One Health" concept using a specific real-world example',
        'I can design a physical activity inspired by an animal movement I observed at the zoo',
      ],
      preDiscussion: {
        heading: 'Biomechanics & the One Health Connection',
        context: 'In our PDHPE studies we have been examining how biomechanical principles apply to movement, and exploring the "One Health" concept — the idea that human health, animal health and ecosystem health are fundamentally connected. In a few days you will investigate these ideas at Taronga Zoo.',
        prompts: [
          'What is biomechanics? Can you name three biomechanical principles and describe how you\'ve observed them in sport or physical activity — for instance, how does centre of gravity affect balance in a sport you play?',
          'What does "One Health" actually mean? If a forest near a city is cleared for housing, trace the chain of effects: what happens to wildlife, then to local waterways, then to air quality, then to community health?',
          'Gorillas walk on their knuckles rather than upright — what biomechanical reason might explain this posture, given the gorilla\'s body mass and centre of gravity?',
          'At the zoo in a few days you\'ll observe animals moving and connect that to biomechanical concepts. Which animal are you most interested in analysing, and what specific movement quality do you want to focus on?',
        ],
        trackaNotes: 'Your Tracka observation is your biomechanical data. For Stage 3 PDHPE, describe the animal\'s movement using biomechanical vocabulary — force, balance, power, coordination, flexibility — and explain what health purpose that movement serves. The more precisely you connect movement to health concepts, the higher your score.',
        teacherNote: 'This discussion is for 2–3 days before the excursion. Students should arrive at the zoo with at least one biomechanical question already formed — this transforms the visit from passive observation into purposeful investigation.',
      },
      postDiscussion: {
        heading: 'Biomechanics in Action — Debrief',
        context: 'A couple of days ago you visited Taronga Zoo with biomechanics and One Health as your analytical frameworks. Before we move into our formal post-visit activities, let\'s share what you observed and begin connecting it to the health concepts we\'ve been studying.',
        prompts: [
          'Which animal movement did you find most biomechanically impressive — and what specific principle (force, balance, power, coordination or flexibility) best explains why that movement is remarkable?',
          'Did anything you saw at the zoo make the One Health connection feel more real or concrete? Can you describe the specific moment or observation that made it click?',
          'What was the most challenging movement to analyse or describe using biomechanical vocabulary — and what made it difficult to put into precise language?',
          'If a zookeeper asked you to design an enrichment activity for one animal you observed, what would you design — and what specific biomechanical quality would it develop or challenge?',
        ],
        teacherNote: 'Use this discussion to bridge the experiential and the analytical. Students who can describe specific movements and connect them to biomechanical terms are ready for the formal design task that follows.',
      },
      preContent: [
        {
          heading: 'Animal Biomechanics',
          bullets: [
            'Biomechanics is the study of how physical forces shape movement — and animals are extraordinary demonstrations of biomechanical principles in action. A gorilla walks on its knuckles because this distributes its enormous body weight over a wider base, lowering its centre of gravity and maintaining stability in dense forest undergrowth. A cheetah can accelerate from 0 to 100 km/h in approximately 3 seconds because its spine acts as a spring, flexing and extending with each stride to dramatically increase its stride length and generate explosive forward force.',
            'These principles are not unique to animals — they are the same principles that govern human athletic movement, and understanding them can improve sporting performance just as they reflect millions of years of evolutionary optimisation in wildlife. Before your Taronga Zoo visit in a few days, apply biomechanics vocabulary to your favourite sport or physical activity: where do you generate force? How does your centre of gravity shift during movement? What role does flexibility play in your range of motion?',
          ],
        },
        {
          heading: 'Movement for Different Purposes',
          bullets: [
            'Animals move for fundamentally different reasons depending on their ecological role, and understanding the purpose behind a movement helps you analyse its biomechanical demands correctly. Predators move for stealth, explosive acceleration and sustainable power over distance — think about the controlled, silent movement of a stalking big cat versus the sustained energy of a long-distance pursuit. Prey animals move for agility, rapid direction change, and maintaining constant environmental awareness — their movement is characterised by alertness and reactivity rather than directed intent.',
            'Social animals use movement for communication, bonding, play and group coordination — the grooming movements of primates, the synchronised swimming of sea lions, the play-wrestling of young carnivores. At Taronga Zoo in a few days, categorise the movements you observe: is this sprint, patrol, play, forage or escape behaviour? Identifying the purpose of a movement is the first step in analysing its biomechanical demands and understanding what it tells you about the animal\'s health and wellbeing.',
          ],
        },
        {
          heading: '"One Health" — We\'re All Connected',
          bullets: [
            'The "One Health" principle recognises that human health, animal health and ecosystem health are not separate systems — they are deeply and inescapably interconnected. Environmental pollution affects wildlife first, then enters food chains and water systems that humans depend on. The destruction of natural habitats reduces biodiversity, which increases the risk of zoonotic disease outbreaks — diseases that jump from animal populations to humans. When tigers disappear from a forest, the deer population explodes, vegetation is stripped, rivers silt up, and downstream human water supplies are affected.',
            'Taronga Zoo\'s conservation work is driven by the understanding that protecting wildlife ultimately protects human health too — not as a secondary benefit, but as a fundamental consequence of the ecological relationships that sustain all life on Earth. Before your visit in a few days, think of one local environmental action — a community garden, a waterway clean-up, a native planting program — that would simultaneously benefit wildlife and improve community health outcomes, and be ready to explain the chain of effects.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Biomechanics Debrief',
          bullets: [
            'Share with the class: which animal movement at Taronga Zoo was biomechanically most impressive to you, and which specific principle — levers, force generation, centre of gravity, momentum, flexibility — best explains why that movement is so effective? Now design a human exercise drill that trains the same movement quality: if you were inspired by a sea lion\'s underwater agility, what exercise develops the same combination of core stability and limb coordination in a human body?',
            'Lead the class in your 2-minute exercise drill now — and as you teach it, narrate the biomechanical focus out loud: what body parts are engaged, what principle you\'re training, and how the drill connects to the animal movement that inspired it. Teaching movement to others and explaining the biomechanical rationale simultaneously is one of the most powerful PDHPE learning activities there is.',
          ],
        },
        {
          heading: '"One Health" Discussion',
          bullets: [
            'Share with the class: did your visit to Taronga Zoo change or deepen your understanding of the link between nature and human health? Consider this scenario: a local wetland is drained for a housing development. Trace the full chain of effects — on the wildlife that lived there, on the insect and bird populations that depended on it, on local air quality and flood management, on the health of people living nearby. At what point in that chain does environmental damage become a human health issue?',
            'As a class, create a "One Health Pledge" — three specific, realistic actions that your class commits to taking this term that would simultaneously benefit wildlife conservation and improve community health. Make each pledge as concrete as possible: not "reduce waste" but "bring a reusable container to the canteen every day and redirect the saving to a Taronga conservation donation." Specific commitments produce specific results.',
          ],
        },
        {
          heading: 'Movement Reflection',
          bullets: [
            'Review your Tracka observation from the zoo visit and identify which aspect of movement you described most precisely — and which aspect you described most vaguely. Now upgrade one sentence by replacing a weak movement verb or a vague description with a biomechanical term: "the tiger walked along the fence" becomes "the tiger moved along the perimeter in a slow, controlled stalk, each paw placed with precise, low-impact force that minimised sound and maintained a stable centre of gravity throughout." Which version tells you more about the animal\'s health and movement capacity?',
            'Ask yourself: how could a Taronga zookeeper use the movement observations you recorded in Tracka to improve this animal\'s welfare? A detailed record of how an animal moves, how often it moves, and what triggers different types of movement is exactly the kind of behavioural data that zookeepers use to design enrichment programs, identify early signs of health problems, and evaluate whether changes to an enclosure are improving or reducing the animal\'s quality of life.',
          ],
        },
      ],
      preChecklist: [
        'Review biomechanical terms: centre of gravity, force, power, flexibility, coordination',
        'Plan to observe the movement of at least 3 different types of animals at the zoo',
        'Think about: how does the animal\'s body structure relate to the way it moves?',
        'Look for evidence of the "One Health" connection during your visit',
      ],
      postAction: [
        'Animal-Inspired Movement Program',
        'Design a 4-week movement program for Stage 3 students inspired by 4 animals from Taronga Zoo. For each week and animal: describe the animal\'s key movement quality, design 3 fitness activities inspired by this movement (with diagrams), explain the health benefit for humans, and link to the "One Health" concept. Present as a program booklet with clear instructions and a conclusion.',
      ],
      exitPre: [
        'Write the definition of "One Health" in your own words. Give one example of the connection.',
        'Name one biomechanical term and describe how you could observe it in an animal\'s movement.',
      ],
      exitPost: [
        'Describe one animal movement you observed at Taronga Zoo using at least two biomechanical terms.',
        'Explain in two sentences how protecting this animal\'s habitat could benefit human health.',
      ],
    },
    4: {
      topic: 'Fitness, Movement Concepts & Advocacy',
      outcomes: ['PD4-2', 'PD4-5', 'PD4-10'],
      li: 'Analyse components of fitness and determinants of health in animals, and evaluate conservation as a form of environmental health advocacy using the Ottawa Charter framework.',
      sc: [
        'I can apply at least 4 components of fitness to an analysis of animal movement',
        'I can explain how biological, behavioural and environmental determinants affect animal health',
        'I can map conservation strategies to the Ottawa Charter for Health Promotion action areas',
      ],
      preDiscussion: {
        heading: 'Fitness, Health Determinants & the Ottawa Charter',
        context: 'In our recent PDHPE units we have examined the components of fitness, the determinants of health, and the Ottawa Charter for Health Promotion. In a few days you will apply all three frameworks to observing animals at Taronga Zoo and analysing conservation as a form of environmental health advocacy.',
        prompts: [
          'Name the five components of fitness. For each one, name a zoo animal where that component is clearly essential for survival — and explain why: which component is most important for a tiger, a sea lion, a gorilla, and a giraffe?',
          'The Ottawa Charter lists five action areas for health promotion. Which one do you think most closely describes what Taronga Zoo does as an institution, and can you give a specific example that justifies your choice?',
          'How do biological, behavioural and environmental determinants of health apply differently to a tiger living in the wild in Sumatra versus a tiger living in Taronga Zoo?',
          'Is conservation a form of health advocacy? Make a case — what is the "health" being promoted, and who or what is the target population being protected?',
        ],
        trackaNotes: 'In Taronga Tracka, your observation is your evidence. For Stage 4 PDHPE, observe animal movement with specific fitness components in mind — name them, describe what you see, and explain the survival advantage they provide. After the visit you will map Taronga\'s conservation programs to the Ottawa Charter action areas using your zoo observations as supporting evidence.',
        teacherNote: 'Push students to form specific hypotheses about fitness, health determinants and the Ottawa Charter before they arrive — this investment in prior thinking makes their observations richer and more analytically purposeful.',
      },
      postDiscussion: {
        heading: 'Conservation as Health Advocacy — Debrief',
        context: 'A couple of days ago you visited Taronga Zoo and observed animals with a PDHPE analytical lens — examining fitness components, health determinants and the ways Taronga functions as a health promotion organisation. Before we begin our formal advocacy work, let\'s open the discussion.',
        prompts: [
          'Which animal demonstrated the most impressive overall fitness profile — and which component appeared to be limited by the zoo environment compared to what you would expect in the wild?',
          'Did you observe evidence of biological, behavioural or environmental health determinants at work in any enclosure? Describe a specific observation that illustrated one of these determinants clearly.',
          'Can you map what Taronga does to the Ottawa Charter action areas? Which action area does Taronga\'s work most closely and most powerfully align with?',
          'Has visiting the zoo changed how you think about environmental health as a genuine component of human wellbeing — not a distant ecological issue but a direct and personal one?',
        ],
        teacherNote: 'This debrief bridges the zoo experience to the Ottawa Charter framework. Challenge vague responses with: "What did you actually observe that makes you say that?" Specificity is the mark of genuine analytical thinking.',
      },
      preContent: [
        {
          heading: 'Fitness Components in Wildlife',
          bullets: [
            'The five components of fitness — strength, endurance, flexibility, power, speed and coordination — can be observed directly in animals whose survival depends entirely on their physical capabilities. A Sumatran Tiger needs explosive power and agility for hunting; a sea lion requires cardiovascular endurance and extraordinary flexibility to hunt underwater; a gorilla depends on exceptional muscular strength and precise coordination; a giraffe maintains balance through a combination of flexibility and structural stability. Understanding which component dominates in each species reveals what its ecological niche demands of its body.',
            'Before your Taronga Zoo visit in a few days, rank the fitness components for two specific animals you plan to observe: which one is most important for survival, which is second, and which matters least? The reasoning behind your ranking — not just the ranking itself — is what demonstrates genuine PDHPE analytical thinking. And be prepared to revise your ranking based on what you actually observe, because animals in enclosures sometimes display fitness characteristics that are difficult to predict from theory alone.',
          ],
        },
        {
          heading: 'Determinants of Health',
          bullets: [
            'The determinants of health framework recognises that health outcomes are shaped by biological factors (genetics, age, immune function, hormonal balance), behavioural factors (diet, physical activity levels, stress management strategies), and environmental factors (habitat quality, exposure to pollutants, climate conditions). For a tiger in captivity, biological determinants include its genetic heritage and disease resistance; behavioural determinants include how much it moves, what it eats, and whether it can express natural hunting behaviours; environmental determinants include enclosure size, temperature management, and the presence of other animals.',
            'The socioeconomic determinants of wildlife health are less often discussed but equally important: conservation funding levels, government policy on habitat protection, public awareness and advocacy, and the political will to enforce international wildlife agreements all directly affect whether a species thrives or declines. At Taronga Zoo in a few days, look for evidence of how the zoo manages each category of health determinant — and think about which ones are within their control and which ones are determined by forces entirely outside their enclosure boundaries.',
          ],
        },
        {
          heading: 'Ottawa Charter Meets Conservation',
          bullets: [
            'The Ottawa Charter for Health Promotion (1986) identifies five action areas for creating healthy environments: Build Healthy Public Policy (wildlife protection legislation, international conservation agreements), Create Supportive Environments (national parks, wildlife corridors, marine protected areas), Strengthen Community Action (conservation NGOs, citizen science programs, community-led land management), Develop Personal Skills (conservation education, field research training, environmental literacy), and Reorient Health Services (redirecting institutional resources toward conservation and prevention).',
            'Taronga Zoo actively operates across all five of these action areas, making it a useful case study for understanding the Ottawa Charter in a non-traditional health context. In a few days at the zoo, look for specific evidence of each action area in Taronga\'s programs, communications and facilities — and be prepared to argue which one Taronga does most effectively, and which one represents the biggest gap between their stated commitment and their observable practice.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Fitness Analysis Debrief',
          bullets: [
            'Share your fitness analysis: which animal at Taronga demonstrated the highest overall fitness profile, and what specific observational evidence supports your claim? Did captivity appear to limit any fitness component — did the enclosure size, the absence of natural hunting opportunities, or the presence of humans appear to affect the animal\'s physical capabilities or motivation to move? If you observed a limitation, design one specific enrichment activity that would target and develop the weakest fitness component you identified.',
            'Consider whether your chosen animal would benefit more from physical enrichment (larger space, obstacles, foraging challenges, movement complexity) or cognitive enrichment (puzzle feeders, novel objects, problem-solving tasks, social interaction). This is not a rhetorical question — zookeepers make this judgment based on the same kind of behavioural observation you carried out, and the answer depends on which type of deficit you identified in the animal\'s current environment.',
          ],
        },
        {
          heading: 'Conservation as Health Advocacy',
          bullets: [
            'Map Taronga\'s work onto the five Ottawa Charter action areas: where is Taronga\'s conservation work strongest — which action area does it most powerfully exemplify — and where is it weakest or most absent? Consider that a conservation officer working on species recovery programs and a health promotion worker designing community wellbeing initiatives share more skills than either might expect: both analyse determinants, both design targeted interventions, both evaluate outcomes, and both must advocate to resource allocators who have competing priorities.',
            'Environmental degradation is now recognised as a direct human health issue: biodiversity loss increases the risk of zoonotic disease outbreaks (COVID-19 being the most recent example), habitat destruction reduces the air and water quality that human communities depend on, and climate change driven by human industry is fundamentally a health threat. Identify one specific local environmental action that your class could take this term that would simultaneously protect local wildlife and demonstrably improve community health, and be ready to argue for it using both the Ottawa Charter and the One Health framework.',
          ],
        },
        {
          heading: 'Reflection',
          bullets: [
            'Review your Tracka observation and assess it honestly through a PDHPE analytical lens: did you name specific fitness components, did you identify which health determinants were visible in the animal\'s behaviour, and did you connect your observation to any Ottawa Charter action area? If your observation focused mainly on what the animal looked like rather than on its health and movement capacity, identify exactly where you would rewrite it — and what specific PDHPE vocabulary would you use to lift it to an analytical level.',
            'Reflect on the biggest conceptual shift this excursion asked you to make: seeing health not as a personal fitness concept but as a system connecting human, animal and environmental wellbeing. Has the zoo visit changed how you understand health as a PDHPE concept — and if yes, what specifically was the observation, moment or idea that produced that shift? The most powerful learning is the kind you can point to precisely.',
          ],
        },
      ],
      preChecklist: [
        'Review the 5 Ottawa Charter action areas before the visit',
        'List the 5 components of fitness — plan to identify each in at least one animal you observe',
        'Think about: how do biological, behavioural and environmental determinants show up in zoo animals?',
        'At the zoo: look for evidence of how Taronga promotes health advocacy through its programs',
      ],
      postAction: [
        'Conservation Health Advocacy Campaign',
        'Create a health promotion campaign advocating for the protection of one critically endangered Taronga animal. Apply all 5 Ottawa Charter action areas in your campaign. Include: a statistical analysis of the animal\'s population decline, an explanation of how this species\' extinction would affect human health (One Health principle), and a clear call-to-action for your target audience (your school community). Present as a professional campaign package.',
      ],
      exitPre: [
        'Name two fitness components you expect to observe in animals at the zoo. Explain why each component is important for that animal\'s survival.',
        'Select one Ottawa Charter action area and explain how it could be applied to wildlife conservation.',
      ],
      exitPost: [
        'Name two fitness components visible in an animal you observed. Explain how each aids its survival.',
        'Select one Ottawa Charter action area. How could it be applied to protect the specific animal you studied?',
      ],
    },
    5: {
      topic: 'Performance Analysis & Health Equity',
      outcomes: ['PD5-2', 'PD5-5', 'PD5-10'],
      li: 'Apply biomechanical analysis to evaluate animal performance, critically examine equity in conservation, and design evidence-based health and conservation advocacy.',
      sc: [
        'I can apply Newton\'s laws and biomechanical principles to analyse animal movement performance',
        'I can critique equity in conservation funding and decision-making with specific evidence',
        'I can design an advocacy campaign that combines evidence, emotional resonance and a clear theory of change',
      ],
      preDiscussion: {
        heading: 'Performance Analysis & Conservation Equity',
        context: 'In our recent PDHPE studies we have applied biomechanical analysis to performance, examined equity in health systems, and explored evidence-based advocacy design. In a few days you will apply all of these frameworks at Taronga Zoo — and begin building an advocacy project grounded in what you observe.',
        prompts: [
          'Apply Newton\'s second law — force equals mass times acceleration — to predict one specific movement you expect to observe at the zoo. What mass and acceleration would be involved, and what force would be generated?',
          'Conservation funding is not distributed equitably — flagship species like tigers receive disproportionate funding compared to less charismatic species like insects or amphibians. Is this ethically justifiable, and what principles would you use to argue either way?',
          'What makes advocacy evidence-based? How is evidence-based advocacy fundamentally different from advocacy that relies primarily on emotional appeal — and are they ever in tension?',
          'When you use Taronga Tracka to record your observation, you are producing knowledge within an institution\'s framework. Whose knowledge does the scoring system privilege — and what types of animal knowledge does it structurally marginalise?',
        ],
        trackaNotes: 'At Stage 5, your Tracka data is the starting point for a rigorous investigation, not an end in itself. Record your observation with the biomechanical question you formed in this lesson clearly in mind. After the visit you\'ll use your observation as evidence in a critical advocacy project examining both performance and equity dimensions of conservation.',
        teacherNote: 'At Stage 5, students should arrive at the zoo with a specific analytical question in each domain — biomechanical, equity and advocacy. This pre-framing is essential for a rich, purposeful investigation rather than general observation.',
      },
      postDiscussion: {
        heading: 'Performance, Equity & Advocacy — Let\'s Interrogate',
        context: 'A couple of days ago you visited Taronga Zoo with an analytical toolkit spanning biomechanics, equity and advocacy. Before you begin your investigation, let\'s use this discussion to surface what you observed, what challenged you, and what questions you\'re still sitting with.',
        prompts: [
          'What specific biomechanical observation did you make that you\'re most confident you could use in a formal analysis? Which of Newton\'s laws applies, and how would you describe the force, mass and acceleration involved?',
          'Did anything you saw at Taronga reveal an equity issue in conservation — a species that seemed under-resourced, a narrative that centred some voices while silencing others, a program that served some stakeholders at the expense of others?',
          'What would your advocacy project need to do differently from Taronga\'s existing communication to genuinely address the equity gap you identified — not just describe it, but produce real-world change?',
          'Looking back at your Tracka observation: what does it tell you about conservation that no zoo sign can, and conversely, what can a zoo sign tell you that your 2-minute observation fundamentally cannot?',
        ],
        teacherNote: 'At Stage 5, this is a high-level seminar discussion. Encourage productive disagreement — students who can articulate what they observed AND what they found unsatisfying or incomplete are ready for rigorous investigation.',
      },
      preContent: [
        {
          heading: 'Biomechanics and Performance Analysis',
          bullets: [
            'Advanced biomechanical analysis applies Newton\'s three laws to understand animal movement in precise physical terms: Newton\'s First Law (an animal at rest or in uniform motion continues that way unless acted upon by a net force) explains why a predator must apply force to accelerate toward prey; Newton\'s Second Law (F = ma) explains why a larger animal requires more force to achieve the same acceleration as a smaller one; Newton\'s Third Law (every action has an equal and opposite reaction) explains how an animal\'s leg muscles push against the ground to propel the body forward.',
            'Performance analysis in wildlife research involves identifying joint angles during movement, measuring force application points, and calculating energy transfer efficiency across the kinetic chain. Before your Taronga Zoo visit in a few days, select one animal and form a specific biomechanical question: what forces are involved in a tiger\'s pounce? How does a sea lion\'s flipper generate efficient propulsive force underwater? How does a gorilla\'s skeletal structure allow it to carry its body mass on its knuckles without injury? Arrive at the zoo ready to observe with that question in mind.',
          ],
        },
        {
          heading: 'Health Equity in Conservation',
          bullets: [
            'Health equity — the principle that all people should have equal opportunity to achieve their full health potential — has an ecological equivalent in conservation equity: the principle that allocation of conservation resources should be based on ecological need rather than aesthetic appeal or public profile. In practice, funding is heavily skewed toward charismatic megafauna: tigers, gorillas, elephants and pandas receive disproportionate resources compared to less photogenic but often more ecologically significant species like insects, amphibians and freshwater fish.',
            'There is also a geographical dimension to conservation inequity: most biodiversity exists in tropical regions that are predominantly low-income nations, while most conservation funding originates from high-income nations — creating a dynamic where wealthy countries determine which species in poorer countries are worth saving, and on what terms. At Taronga Zoo in a few days, look for evidence of this dynamic in the species represented, the stories told, and the voices that are present or absent in the zoo\'s conservation narrative.',
          ],
        },
        {
          heading: 'Evidence-Based Advocacy Design',
          bullets: [
            'Effective advocacy is built on three foundations: a clearly identified problem with specific evidence, a precisely targeted audience with the power to create change, and a theory of change that explains how the advocacy will produce the desired outcome. Taronga\'s own conservation campaigns demonstrate both the strengths and limitations of advocacy in practice: their emotional engagement with charismatic animals is highly effective at generating public support, but their campaigns can sometimes obscure the systemic drivers — habitat destruction, regulatory failure, international trade — that actually need to change.',
            'At Taronga Zoo in a few days, collect the evidence you\'ll need for your advocacy project: precise biomechanical observations, equity observations, statistical facts from information signs, and any personal observations that would carry emotional resonance in a campaign. The most powerful advocacy combines emotional resonance and rigorous evidence — the kind that makes an audience feel something AND gives them specific, credible reasons to act.',
          ],
        },
      ],
      postContent: [
        {
          heading: 'Performance Analysis Debrief',
          bullets: [
            'Share your biomechanical analysis: which animal\'s movement was most complex to explain using Newton\'s laws, and where did your analysis get stuck? How did captivity appear to affect the animal\'s performance capacity — were there signs of muscle atrophy, reduced range of motion, low motivation to move, or restricted expression of natural movement patterns? Design a specific enclosure modification that would maximise the biomechanical performance of your chosen animal — not a general enrichment activity but a precise physical environment change with a clear biomechanical rationale.',
            'Research question for class discussion: what does existing longitudinal data show about wild versus captive animal fitness outcomes over the long term? Multiple studies have found significant reductions in muscle mass, bone density and cardiovascular capacity in long-term captive populations. If these findings are accurate, what are the implications for the validity of captive conservation as a strategy for maintaining species fitness — and does Taronga\'s work engage honestly with this limitation?',
          ],
        },
        {
          heading: 'Conservation Equity Critique',
          bullets: [
            'Let\'s debate a genuinely contested question: should conservation funding prioritise critically endangered megafauna whose loss would have high public visibility, or less charismatic species like invertebrates and amphibians whose loss would have greater ecological impact? Make the strongest possible case for your position, anticipate the most compelling counterargument, and rebut it specifically. Then consider: who is absent from Taronga\'s conservation narrative — local communities in the countries where their target species live, Indigenous knowledge holders, the animals themselves as stakeholders in their own conservation?',
            'Does the zoo experience — even when it is as thoughtfully designed as Taronga\'s — ultimately reinforce rather than challenge the assumptions that drive conservation inequity: that Western institutions know best, that nature must be managed rather than protected on its own terms, that biodiversity has value primarily in relation to human aesthetic and emotional preferences? What would a genuinely equitable global conservation framework actually look like, and who would need to give up power to make it possible?',
          ],
        },
        {
          heading: 'Advocacy Project Development',
          bullets: [
            'Share your advocacy concept with a peer and ask them to evaluate it on four dimensions: evidence strength (are your claims specific, accurate and verifiable?), audience clarity (do you know exactly who has the power to create the change you\'re seeking?), theory of change (is the causal pathway from your advocacy to your desired outcome logically coherent?), and emotional resonance (will your audience feel something, not just know something, after encountering your advocacy?). The single most important change that would strengthen most advocacy projects is usually specificity — more specific evidence, more specific target audience, more specific call to action.',
            'Present your final advocacy concepts to the class, and after all presentations vote on which is most likely to create real-world change — not which is most emotionally moving or most visually impressive, but which has the clearest theory of change and the most credible path from the advocacy to the actual outcome. The gap between advocacy that makes people feel something and advocacy that actually changes something is where the most important PDHPE thinking lives.',
          ],
        },
      ],
      preChecklist: [
        'Review Newton\'s three laws and how they apply to movement analysis',
        'Plan to observe one animal with a specific biomechanical question in mind',
        'Think about: who benefits from and who is disadvantaged by conservation as currently practised?',
        'At the zoo: notice whose voices are present and whose are absent in Taronga\'s messaging',
      ],
      postAction: [
        'Evidence-Based Conservation Advocacy Project',
        'Produce a complete advocacy project for protecting one critically endangered Taronga animal. Required components: (a) Biomechanical analysis of the animal\'s movement with annotated diagrams; (b) Equity analysis — who are the key stakeholders and whose voices are marginalised in this species\' conservation?; (c) A "One Health" argument for why protecting this species benefits human health; (d) A full advocacy campaign (platform of your choice) with target audience, evidence base, call-to-action and evaluation framework. Include a 200-word critical reflection on your advocacy choices.',
      ],
      exitPre: [
        'Apply one of Newton\'s three laws to predict how a specific animal at the zoo will move. Be precise about force, mass and acceleration.',
        'Identify one equity issue in current wildlife conservation. Who is advantaged? Who is disadvantaged?',
      ],
      exitPost: [
        'Apply one of Newton\'s laws to explain a movement you observed at the zoo. Be specific about force, mass and acceleration.',
        'Identify one equity issue in wildlife conservation. Who is advantaged and who is disadvantaged? Explain in 3 sentences.',
      ],
    },
  },
}

// ---------------------------------------------------------------------------
// GENERATION LOGIC
// ---------------------------------------------------------------------------
const SUBJECTS = ['science', 'maths', 'english', 'pdhpe']
const STAGES = [2, 3, 4, 5]
const TIMINGS = ['pre', 'post']

const ANIMAL_IMGS = [
  'tiger.jpg', 'lion.jpg', 'giraffe.jpg', 'gorilla.jpg',
  'chimpanzee.jpg', 'dingo.jpg', 'koala.jpg', 'lemur.jpg',
]

function brainBreakIndex(subject, stage, timing) {
  const si = SUBJECTS.indexOf(subject)
  const ti = timing === 'pre' ? 0 : 1
  return (si * 4 + (stage - 2) + ti * 3) % 8
}

export const DECKS = []

let imgIdx = 0

for (const timing of TIMINGS) {
  for (const subject of SUBJECTS) {
    for (const stage of STAGES) {
      const data = CONTENT[subject][stage]
      const bb = BRAIN_BREAKS[brainBreakIndex(subject, stage, timing)]
      const contentSlides = timing === 'pre' ? data.preContent : data.postContent

      const appliedSlide = timing === 'pre'
        ? {
            type: 'applied',
            variant: 'pre',
            timing,
            subject,
            stage,
            checklist: data.preChecklist,
          }
        : {
            type: 'applied',
            variant: 'post',
            timing,
            subject,
            stage,
            actionTitle: data.postAction[0],
            actionDesc: data.postAction[1],
          }

      const discussionData = timing === 'pre' ? data.preDiscussion : data.postDiscussion

      const slides = [
        { type: 'title' },
        { type: 'li-sc', li: data.li, sc: data.sc },
        { type: 'video', timing },
        { type: 'app-preview' },
        ...(discussionData ? [{ type: 'discussion', ...discussionData }] : []),
        ...contentSlides.map(s => ({ type: 'content', heading: s.heading, bullets: s.bullets })),
        { type: 'brain-break', stageIndex: brainBreakIndex(subject, stage, timing), name: bb.name, instruction: bb.instruction },
        appliedSlide,
        { type: 'exit-ticket', questions: timing === 'pre' ? data.exitPre : data.exitPost },
      ]

      DECKS.push({
        id: `${timing}-${subject}-s${stage}`,
        subject,
        stage,
        timing,
        title: data.topic,
        outcomes: data.outcomes,
        img: ANIMAL_IMGS[imgIdx++ % ANIMAL_IMGS.length],
        slides,
      })
    }
  }
}
