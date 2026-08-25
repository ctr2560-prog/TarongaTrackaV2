// PDHPE academic content for all 12 Taronga Tracka missions.
// NSW PDHPE K–10 2022 curriculum, physiology, mental health, and wellbeing.
// Zoo animals as stimulus for real physiological and psychological concepts.

export const PDHPE_ANIMALS = {

  // ── Chimpanzee ─────────────────────────────────────────────────────────────
  // PDHPE focus: Lifestyle comparison, chimp vs. student habits, healthy habit adoption
  chimpanzee: {
    observationPrompt: 'Watch the chimpanzees. Notice how they move, rest and spend time together. Use your graph to compare their daily habits with your own.',
    writingPromptByStage: {
      1: 'Look at your graph. What does the chimpanzee do that is the same as you?',
      2: 'Look at your graph. How is the chimpanzee\'s day the same as yours, and how is it different?',
      3: 'Use your graph to compare the chimpanzee\'s day with your own. What could you copy?',
      4: 'Use your graph as evidence. What healthy habits could you take from the chimpanzee?',
      5: 'Use your graph as evidence. Explain how two chimpanzee habits support determinants of health, and assess whether your own habits do the same.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['similar', 'different'],
      4: ['determinant'],
      5: ['biopsychosocial'],
    },
    questions: [
      {
        q: 'Chimp Lifestyle and Health',
        stageVariants: {
          1: 'Chimpanzees move around, play and eat lots of different foods every day. Which of these habits helps keep YOU healthy too?',
          2: 'Chimpanzees spend about 4 hours being active every day. Why is daily physical activity important for your health?',
          3: 'The lifestyle comparison shows chimps are active, social and eat a wide variety of plants. Which statement best explains why this combination promotes health?',
          4: 'A chimpanzee\'s daily lifestyle directly addresses multiple determinants of health. Which two determinants does it MOST clearly support?',
          5: 'Research shows chimpanzees in natural environments have lower cortisol and stronger immune function than sedentary, socially isolated ones. Which explanation best accounts for this?',
        },
        stageOptions: {
          1: ['Eating lots of chips', 'Moving your body and eating a variety of foods', 'Staying inside all day', 'Watching TV'],
          2: ['It makes you tired', 'It helps your body and mind stay strong and healthy', 'It is only important for adults', 'It has no effect on mood'],
          3: [
            'It combines regular movement, social connection and a varied diet, all key determinants of health',
            'Chimps are healthy simply because they live in trees',
            'Only social connection matters for health',
            'Physical activity is the only determinant that counts',
          ],
          4: ['Physical activity and social connection', 'Screen time and homework load', 'Genetics and height', 'School attendance and income'],
          5: [
            'Wild chimps eat more calories, which explains the difference',
            'Natural environments provide physical, social and psychological stimulation that addresses multiple health determinants simultaneously',
            'Captive chimps are unhealthier because they receive veterinary care',
            'Genetic differences between wild and captive populations explain the health gap',
          ],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 0, 4: 0, 5: 1 },
        stageFacts: {
          1: 'Moving your body and eating lots of different healthy foods every day, just like chimps do, is great for your health!',
          2: 'Physical activity strengthens muscles and bones, boosts mood, improves sleep and reduces the risk of many diseases.',
          3: 'Chimpanzees naturally meet three key determinants of health: physical activity, social connection and a varied, plant-rich diet.',
          4: 'Physical activity (cardiovascular and musculoskeletal health) and social connection (mental health, cortisol regulation, sense of belonging) are both clearly addressed by a chimpanzee\'s natural lifestyle.',
          5: 'Natural environments provide multi-dimensional stimulation, physical, social and psychological, that supports the full biopsychosocial model of health, unlike sedentary, isolated conditions.',
        },
        options: ['Moving your body and eating a variety of foods', 'It helps your body and mind stay strong', 'It combines movement, social connection and varied diet', 'Physical activity and social connection'],
        correct: 1,
        fact: 'Chimpanzee lifestyles naturally address key determinants of health, physical activity, social connection, dietary variety and time in nature, providing a practical model for human health promotion.',
      },
      {
        q: 'Healthy Habits We Can Learn',
        stageVariants: {
          1: 'Chimpanzees sleep about 10 hours every night. Why is getting enough sleep important for you?',
          2: 'Chimpanzees eat over 80 different types of food, mostly plants and fruit. What does this suggest about healthy eating?',
          3: 'Looking at the comparison, which ONE change inspired by chimp habits would most benefit students today?',
          4: 'A student starts spending 60 minutes outdoors with friends after school instead of sitting on screens. Which health benefits would this chimp-inspired change most likely produce?',
          5: 'Based on epidemiological evidence, which chimpanzee-inspired lifestyle intervention has the strongest evidence for improving multiple health outcomes in adolescents simultaneously?',
        },
        stageOptions: {
          1: ['Sleep helps you grow, heal and feel good', 'Sleep has no effect on health', 'You should sleep as little as possible', 'Sleep only helps older people'],
          2: ['Eating only one type of food is healthiest', 'Eating a wide variety of plant-based foods supports good health', 'Humans should eat exactly like chimps', 'Fruit is the only food that matters'],
          3: ['Moving more, spending time outdoors and reducing screen time', 'Sleeping on branches', 'Eating only plants', 'Foraging instead of buying food'],
          4: ['Improved cardiovascular fitness, better mood and reduced anxiety', 'Reduced exposure to UV light', 'Higher screen literacy from less practice', 'Stronger bones from sitting on harder ground'],
          5: [
            'Reducing calorie intake to match wild chimpanzee diets',
            'Increasing daily physical activity to 60+ minutes in outdoor social settings, addressing physical, psychological and social determinants together',
            'Eliminating all processed foods and substituting with foraged food',
            'Reducing social interaction to improve academic focus',
          ],
        },
        stageCorrect: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 1 },
        stageFacts: {
          1: 'Sleep is when your body grows, repairs muscles and strengthens memory. Children and teenagers need 8-10 hours each night.',
          2: 'Eating a wide variety of plant foods provides a range of nutrients, fibre and antioxidants, just like the chimpanzee\'s naturally varied diet.',
          3: 'More movement, outdoor time and less screen time are the three lifestyle shifts most directly supported by studying chimpanzee daily habits.',
          4: 'Outdoor physical activity with peers is linked to improved cardiovascular health, stronger mental health, reduced anxiety, better sleep and higher vitamin D levels.',
          5: 'Daily physical activity of 60+ minutes in outdoor social settings addresses physical, psychological and social determinants of health simultaneously, closely mirroring the natural chimpanzee lifestyle.',
        },
        options: ['Sleep helps you grow and feel good', 'Eating a wide variety of plant-based foods', 'Moving more, spending time outdoors and reducing screen time', 'Increasing daily activity in outdoor social settings'],
        correct: 2,
        fact: 'The chimp lifestyle model, daily movement, outdoor time, social connection and a varied plant-rich diet, maps directly onto the evidence-based pillars of human health promotion.',
      },
    ],
  },

  // ── Gorilla ────────────────────────────────────────────────────────────────
  // PDHPE focus: Nutrition and diet, food variety, nutrients, food groups, dietary guidelines
  gorilla: {
    observationPrompt: 'Watch the gorilla eat. Gorillas spend hours every day choosing leaves, fruit, bamboo and bark. Think about what their diet tells us about eating for health.',
    writingPromptByStage: {
      1: 'Gorillas eat lots of different plants. Write one healthy food you eat.',
      2: 'Gorillas eat many different plants. Write two healthy foods you eat and why they are good for you.',
      3: 'Gorillas eat a wide variety of plants. Why is eating a variety of foods good for your health?',
      4: 'Using the gorilla\'s diet as an example, explain why variety is important in a healthy diet.',
      5: 'Using the gorilla\'s diet as an example, explain why variety is important in a healthy diet. Name specific nutrients and their role in the body.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['variety', 'food group', 'nutrients', 'healthy'],
      4: ['nutrients', 'food group', 'variety'],
      5: ['nutrients', 'fibre', 'vitamins'],
    },
    questions: [
      {
        q: 'Gorilla Diet',
        stageVariants: {
          1: 'Gorillas eat leaves, fruit and bamboo every day. Which food below is the healthiest choice for YOU?',
          2: 'Gorillas eat plant foods for energy and nutrients. Which food group gives your body the most energy?',
          3: 'Gorillas eat a wide variety of plant foods. Why is it important for humans to eat a variety of different foods?',
          4: 'Gorillas get protein from termites and leaves without eating meat. Which best explains why protein is essential for the human body?',
          5: 'A gorilla\'s diet is high in fibre, vitamins and plant protein with almost no saturated fat. Which statement best explains why a diet like this supports long-term health?',
        },
        stageOptions: {
          1: ['Chips and soft drink', 'Fruit and vegetables', 'Lollies and cake', 'Fried chicken'],
          2: ['Carbohydrates (bread, rice, pasta)', 'Soft drinks and lollies', 'Fats (butter, oil)', 'Water only'],
          3: ['To get all the nutrients your body needs', 'Because eating the same food every day is boring', 'So you can eat more overall', 'To make meals look more colourful'],
          4: ['It provides energy for sprinting', 'It builds and repairs muscles, organs and cells', 'It is the only food group the body needs', 'It makes bones denser'],
          5: [
            'Plant diets have fewer kilojoules so the body stores less fat regardless of other factors',
            'High fibre intake supports digestion, vitamins aid cell function, and low saturated fat reduces cardiovascular disease risk',
            'Plant foods contain no protein so the body relies on stored energy instead',
            'Eating variety has no proven link to health, it is only about taste preference',
          ],
        },
        stageCorrect: { 1: 1, 2: 0, 3: 0, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Fruit and vegetables give your body vitamins and energy. Gorillas eat mostly plants, and they are one of the strongest animals on Earth!',
          2: 'Carbohydrates are the body\'s main energy source. Gorillas get their energy from plant carbohydrates like fruit and leaves.',
          3: 'Different foods provide different nutrients, vitamins, minerals, protein and fibre. Eating a variety means your body gets everything it needs to grow and stay healthy.',
          4: 'Protein is essential for building and repairing every cell in the body, muscles, skin, organs and enzymes. Gorillas get protein from leaves and insects without eating meat.',
          5: 'High dietary fibre supports healthy digestion and reduces bowel disease risk. Vitamins and minerals support immune function and cell repair. Low saturated fat reduces cholesterol and cardiovascular disease risk.',
        },
        options: ['Fruit and vegetables', 'Carbohydrates', 'To get all the nutrients your body needs', 'It builds and repairs muscles', 'High fibre and low saturated fat reduces disease risk'],
        correct: 0,
        fact: 'Gorillas eat up to 18 kg of plant food every day, a naturally balanced, high-fibre diet. This variety gives them everything they need to grow, stay strong and stay healthy.',
      },
      {
        q: 'What Do Gorillas Actually Eat?',
        stageVariants: {
          1: 'In the game you fed the gorillas leaves, bamboo and fruit. What kind of foods are these?',
          2: 'In the game, gorillas ordered leaves, bamboo, fruit and termites. Which food group makes up MOST of a gorilla\'s diet?',
          3: 'You served gorillas leaves, bamboo and fruit in the game. What is the main nutrient these plant foods provide?',
          4: 'Gorillas eat mostly leaves, bamboo and fruit, all plants. Which macronutrient do they get the most of from these foods?',
          5: 'A gorilla\'s diet is mostly leaves, bamboo and fruit, with termites for protein. Which statement best explains how this diet supports their health?',
        },
        stageOptions: {
          1: ['Meat foods', 'Dairy foods', 'Junk foods', 'Plant foods'],
          2: ['Meat and fish', 'Dairy products like milk and cheese', 'Processed grains and cereals', 'Vegetables, fruit and plants'],
          3: ['Saturated fat and cholesterol', 'Added sugar and salt', 'Artificial flavours and preservatives', 'Fibre, vitamins and minerals'],
          4: ['Fat, from the oils in leaves', 'Protein, leaves are a complete protein source', 'Sodium, bamboo is high in salt', 'Carbohydrates, from the natural sugars and fibre in plants'],
          5: [
            'Eating mostly leaves means gorillas are protein-deficient and rely on termites to survive',
            'Bamboo and fruit are high in saturated fat which builds their thick muscles',
            'Termites provide all the energy they need so plant foods are just for bulk',
            'Plant foods provide fibre, vitamins and carbohydrates for energy, while termites add protein, together covering all their nutritional needs',
          ],
        },
        stageCorrect: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
        stageFacts: {
          1: 'Leaves, bamboo and fruit are all plant foods. Gorillas eat mostly plants, and they are one of the strongest animals on Earth!',
          2: 'Gorillas eat mostly vegetables, fruit and plants. They spend up to 6 hours a day foraging for plant food. The termites add a small amount of protein.',
          3: 'Leaves, bamboo and fruit are packed with fibre, vitamins and minerals. These nutrients help the body grow, fight sickness and keep digestion healthy.',
          4: 'The natural sugars and fibre in leaves, bamboo and fruit are all types of carbohydrate, the body\'s main energy source. That\'s how gorillas fuel their enormous bodies without eating meat.',
          5: 'A gorilla\'s plant-heavy diet gives them fibre for digestion, vitamins for immunity and complex carbohydrates for energy. Termites top up their protein for muscle repair, a naturally balanced diet with no processed food.',
        },
        options: ['Plant foods', 'Vegetables, fruit and plants', 'Fibre, vitamins and minerals', 'Carbohydrates from natural sugars and fibre in plants', 'Plant foods provide fibre and carbohydrates while termites add protein'],
        correct: 3,
        fact: 'Gorillas eat mostly plants, leaves, bamboo and fruit give them carbohydrates, fibre and vitamins, while termites add protein. It\'s a naturally balanced diet that fuels one of the world\'s strongest animals.',
      },
    ],
  },

  // ── Lion ───────────────────────────────────────────────────────────────────
  // PDHPE focus: Rest/recovery and energy systems, sleep, BMR, aerobic vs anaerobic, rest-to-activity ratio
  lion: {
    observationPrompt: 'Watch the lion, is it resting or active? Think about why large predators rest so much and what energy systems they use during their brief bursts of hunting activity.',
    writingPromptByStage: {
      1: 'Lions have strong back legs for pouncing. What do you do that needs strong legs?',
      2: 'Lions use fast, strong muscles to pounce. Write one thing you do that needs fast, strong muscles.',
      3: 'Lions use muscular power to sprint and pounce. What is muscular power, and when do you use it?',
      4: 'Using the lion as an example, explain what muscular power is and when you use it.',
      5: 'Using the lion as an example, explain what muscular power is and how it differs from muscular strength.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['anaerobic', 'aerobic', 'ATP-PC'],
      4: ['ATP-PC', 'anaerobic', 'aerobic', 'phosphocreatine'],
      5: [],
    },
    questions: [
      {
        q: 'Fitness Components, Muscular Power',
        stageVariants: {
          1: 'Look at the lion\'s body and muscles. What helps a lion sprint fast and leap onto prey?',
          2: 'Zoom in on the lion and look at its muscles. Which fitness component lets lions sprint and jump in short powerful bursts?',
          3: 'Use the zoom to closely observe the lion\'s body and muscle structure. Which fitness component best explains how lions sprint, leap and overpower prey in short bursts?',
          4: 'Zoom in to observe the lion\'s muscle structure. Which fitness component, involving both force and velocity, underpins the lion\'s explosive sprinting and leaping onto prey?',
          5: 'Zoom in on the lion\'s musculature. A lion\'s hunt lasts under 10 seconds, driven by fast-twitch muscle fibres. Which fitness component is defined as force × velocity?',
        },
        stageOptions: {
          1: ['Stretching and bending', 'Muscular power', 'Running for a long time', 'Staying balanced'],
          2: ['Flexibility', 'Muscular power', 'Cardiovascular fitness', 'Balance'],
          3: ['Flexibility', 'Muscular power', 'Cardiovascular endurance', 'Balance'],
          4: ['Muscular strength', 'Muscular power', 'Cardiovascular endurance', 'Flexibility'],
          5: ['Muscular strength', 'Muscular power', 'Aerobic capacity', 'Anaerobic threshold'],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Muscular power is the ability to exert maximum force in the shortest possible time. Lions use explosive muscular power to sprint and take down prey.',
          2: 'Muscular power combines strength and speed. A lion\'s powerful hindquarters allow it to accelerate rapidly and deliver force when leaping onto prey.',
          3: 'Muscular power is force × velocity. Lions have heavily muscled shoulders and hindquarters that generate the explosive force needed for short hunting bursts.',
          4: 'Muscular power underpins a lion\'s hunting ability, their fast-twitch muscle fibres produce rapid, forceful contractions ideal for sprinting and overpowering prey.',
          5: 'Muscular power is the product of force and velocity. A lion\'s high fast-twitch fibre composition enables peak anaerobic power output during the brief ATP-PC phase of a hunt.',
        },
        options: ['Flexibility', 'Muscular power', 'Cardiovascular endurance', 'Balance'],
        correct: 1,
        fact: 'Muscular power combines strength and speed. Lions have heavily muscled bodies that generate explosive force, perfect for short, high-intensity bursts of sprinting and overpowering prey.',
      },
    ],
  },

  // ── Giraffe ────────────────────────────────────────────────────────────────
  // PDHPE focus: Cardiovascular system, blood pressure, heart rate, cardiac output, exercise response
  giraffe: {
    observationPrompt: 'Look at the size of the giraffe next to a person. Think about how far its heart has to push blood to reach its head, and what that means for the size of the heart doing the pushing.',
    writingPromptByStage: {
      1: 'Look at the giraffe next to a person. Is its heart bigger or smaller than yours? Why?',
      2: 'Compare the giraffe\'s body to your own. Does it need a bigger heart? Why?',
      3: 'Compare the giraffe\'s body to a human body. Does the giraffe need a bigger heart, and why?',
      4: 'Compare the giraffe\'s body to a human body. Does it have a bigger heart, and why does it need one?',
      5: 'Compare the giraffe\'s body to a human body. Explain why its heart must be bigger, and what that means for its blood pressure.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['12.3', '12'],
      4: ['cardiac output', 'heart rate', 'stroke volume'],
      5: [],
    },
    questions: [
      {
        q: 'Giraffe Heart and Blood Pressure',
        stageVariants: {
          1: 'How far does a giraffe\'s heart pump blood to reach its head?',
          2: 'About how far does a giraffe\'s heart pump blood to reach its head?',
          3: 'About how far must a giraffe\'s heart pump blood from its chest up to its head?',
          4: 'About how far must a giraffe\'s heart pump blood from its chest to its head?',
          5: 'About how far must a giraffe\'s heart pump blood from the chest to the head?',
        },
        // Mirrors GIRAFFE_PDHPE_MCQ in GiraffeMission.jsx, which is what actually renders for
        // PDHPE classes. Kept in step so the two can never contradict each other.
        stageOptions: {
          1: ['2 cm', '2 m', '20 m', '200 m'],
          2: ['5 cm', '50 m', '2 m', '500 m'],
          3: ['2 m', '20 cm', '30 m', '300 m'],
          4: ['15 m', '150 m', '1.5 cm', '2 m'],
          5: ['20 cm', '2 m', '22 m', '220 m'],
        },
        stageCorrect: { 1: 1, 2: 2, 3: 0, 4: 3, 5: 1 },
        stageFacts: {
          1: 'About 2 m. That is a long way to push blood uphill, which is why a giraffe needs such a powerful heart.',
          2: 'About 2 m, roughly the height of a doorway. Your own heart only pushes blood about 30 cm up to your brain.',
          3: 'About 2 m. Pushing blood that high needs about twice the blood pressure a human has.',
          4: 'About 2 m, around seven times further than a human heart pumps upward. That is why giraffes have the highest blood pressure of any land animal.',
          5: 'About 2 m. Blood must be pushed that far against gravity, which is why a giraffe\'s heart weighs about 11 kg and its blood pressure is roughly double ours.',
        },
        options: ['2 cm', '2 m', '20 m', '200 m'],
        correct: 1,
        fact: 'A giraffe\'s heart weighs about 11 kg and generates roughly twice the blood pressure of a human, which is what it takes to pump blood 2 m up its neck to the brain.',
      },
    ],
  },

  // ── Tiger ──────────────────────────────────────────────────────────────────
  // PDHPE focus: Muscle fibre types, fast-twitch vs slow-twitch, captive stress, environmental enrichment and mental health
  tiger: {
    observationPrompt: 'Watch the tiger closely. Look at how it moves, how it waits, and how powerful its body is. Think about what athletes could learn from this animal.',
    writingPromptByStage: {
      1: 'Watch the tiger. What could a sports player learn from how the tiger moves?',
      2: 'Watch the tiger move. What could an athlete learn from the tiger to help them in sport?',
      3: 'Observe the tiger\'s movement and body. What sporting qualities can you see? What could an athlete take away from watching this animal?',
      4: 'Observe the tiger closely. What physical and mental qualities does the tiger show? What could elite athletes learn from it?',
      5: 'Observe the tiger\'s explosive power, patience and muscular build. What lessons could this offer for elite sporting performance and training?',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['Type I', 'Type II', 'fast-twitch', 'slow-twitch'],
      4: ['Type II', 'fast-twitch', 'ATP-PC', 'anaerobic'],
      5: [],
    },
    questions: [
      {
        q: 'Tiger Muscle Groups',
        stageVariants: {
          1: 'Which muscles help you jump as HIGH and as FAST as possible?',
          2: 'Which activity mainly uses fast-twitch muscle fibres?',
          3: 'Type I slow-twitch fibres are best for which type of activity?',
          4: 'Which characteristic correctly describes Type II fast-twitch muscle fibres compared to Type I?',
          5: 'A Sumatran tiger ambushes prey in a 3-second sprint. Chronic captive stress elevates cortisol. Which statement BEST evaluates the combined effect on the tiger\'s musculoskeletal and psychological health?',
        },
        stageOptions: {
          1: ['The muscles in your hair', 'Your fast-twitch leg muscles', 'Your digestive muscles', 'Your eyelid muscles'],
          2: ['Running a marathon', 'Sitting quietly', 'Sprinting 50 metres', 'Walking to school'],
          3: ['A 100 m sprint', 'A long-distance run', 'Throwing a javelin', 'A powerlifting squat'],
          4: ['Contract slowly and resist fatigue well', 'Contract quickly but fatigue rapidly', 'Use oxygen as their primary fuel', 'Are more common in endurance athletes'],
          5: [
            'Cortisol boosts Type II fibre recruitment, improving sprint performance; captivity has no psychological effect',
            'Chronic cortisol elevation impairs muscle protein synthesis, suppresses immunity, disrupts sleep, and combined with reduced movement causes muscle atrophy and stereotypic behaviour',
            'Elevated cortisol only affects Type I fibres; fast-twitch performance is unaffected in captive tigers',
            'Environmental enrichment raises cortisol further, which increases alertness and sprint readiness',
          ],
        },
        stageCorrect: { 1: 1, 2: 2, 3: 1, 4: 1, 5: 1 },
        stageFacts: {
          1: 'The big muscles in your legs. They are what push you off the ground when you jump.',
          2: 'Sprinting. Short, fast bursts use different muscle fibres from long, steady activity.',
          3: 'Type I slow-twitch fibres are fatigue-resistant and oxygen-efficient, ideal for sustained aerobic activities like distance running.',
          4: 'Type II fast-twitch fibres contract 3–5× faster than Type I but fatigue quickly because they rely on anaerobic ATP-PC and glycolytic pathways rather than aerobic metabolism.',
          5: 'Chronic cortisol elevation inhibits muscle protein synthesis (reducing muscle mass), suppresses immune function, disrupts slow-wave sleep (reducing growth hormone), and causes psychological stress, all contributing to stereotypic pacing and poorer overall welfare.',
        },
        options: ['Your fast-twitch leg muscles', 'Sprinting 50 metres', 'A long-distance run', 'Contract quickly but fatigue rapidly'],
        correct: 1,
        fact: 'Type II fast-twitch fibres power a tiger\'s explosive sprint. Chronic stress elevates cortisol, which impairs muscle repair, suppresses immunity, and disrupts sleep, explaining why environmental enrichment is critical to captive tiger welfare.',
      },
    ],
  },

  // ── Koala ──────────────────────────────────────────────────────────────────
  // PDHPE focus: Sleep and recovery, sleep stages, growth hormone, nutrition quality, metabolic rate
  koala: {
    observationPrompt: 'Watch the koala, it is almost certainly asleep. Think about what its body is doing during all those hours of rest, and what sleeping that much tells us about nutrition, energy, and recovery.',
    writingPromptByStage: {
      1: 'The koala sleeps up to 22 hours a day. Compare that to how much you sleep. Why is sleep important for your health?',
      2: 'The koala sleeps up to 22 hours a day to rest and recover. Compare koala sleep to human sleep. What does sleep do for your body?',
      3: 'The koala sleeps most of the day to rest and recover. Compare koala sleep to what humans need. What does sleep do for your health and body?',
      4: 'The koala sleeps up to 22 hours to recover from a low-energy diet. Compare this to human sleep needs. What happens to your health when you do not get enough sleep?',
      5: 'The koala\'s extreme sleep is an adaptation to its low-energy diet. Compare koala sleep to recommended human sleep. What are the health consequences of chronic sleep deprivation for teenagers?',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['growth hormone', 'GH'],
      4: ['slow-wave', 'deep sleep', 'growth hormone', 'cortisol'],
      5: [],
    },
    questions: [
      {
        q: 'Koala Sleep Patterns and Human Health',
        stageVariants: {
          1: 'Find the koala sign. How many hours does it say koalas sleep each day?',
          2: 'Find the koala sign. It says koalas sleep 18–20 hours a day. How does that compare to how much sleep YOU need to stay healthy?',
          3: 'Find the koala sign. It says koalas sleep 18–20 hours because eucalyptus gives them very little energy. What is the main reason humans need 8–10 hours of sleep each night?',
          4: 'Use the information on the koala sign. How does the koala\'s 18–20 hours of sleep compare to the 8–10 hours recommended for teenagers, and why does each species need sleep?',
          5: 'The koala sign shows they sleep 18–20 hours to survive on their low-energy diet. If a student consistently slept only 5 hours instead of the recommended 8–10, what would likely happen to their health over time?',
        },
        stageOptions: {
          1: ['2–4 hours', '18–20 hours', '8–10 hours', '24 hours'],
          2: ['Koalas and humans need the same amount of sleep', 'Koalas need much more; humans only need 8–10 hours to stay healthy', 'Humans need more sleep than koalas', 'Neither species needs that much sleep'],
          3: ['To save energy from a low-nutrient diet like koalas', 'To help the body recover, grow and stay healthy', 'To keep their body temperature low overnight', 'Because humans get tired faster than other animals'],
          4: ['Both sleep for the same reason: to digest food', 'Both need sleep to stay healthy, but koalas sleep to save energy while humans sleep to recover, repair and grow', 'Koalas sleep more because they are naturally lazier', 'Humans need more sleep than koalas but choose not to get it'],
          5: ['They would adapt and function normally on less sleep', 'Their body would struggle to recover, grow and fight illness, affecting physical and mental health', 'They would become more focused as their body becomes more efficient', 'Their muscles would strengthen because they spend more time being active'],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Koalas sleep 18–20 hours a day! Teenagers need 8–10 hours. Sleep helps both species grow, heal and recharge for the next day.',
          2: 'Sleep helps both koalas and humans recover. For koalas it conserves precious energy from their low-calorie diet. For humans it repairs muscles, boosts immunity and improves mood.',
          3: 'While koalas sleep to save energy from eucalyptus, humans sleep for tissue repair, growth and immune support. Both species depend on sleep to stay healthy.',
          4: 'Koalas sleep 18–20 hours to save energy from their low-nutrient diet. Humans sleep 8–10 hours to recover, repair and recharge. Both species depend on sleep to stay healthy, just for slightly different reasons.',
          5: 'When teenagers don\'t get enough sleep, their body can\'t properly repair muscles, grow, or fight off illness. Over time this also affects mood, concentration and energy, just like a koala that can\'t rest properly would struggle to survive on its low-energy diet.',
        },
        options: ['About 8–10 hours', 'It helps their bodies recover and stay healthy', 'For body repair, growth and immune support', 'Koalas sleep to conserve energy; humans sleep for tissue repair, growth hormone release and immune function'],
        correct: 1,
        fact: 'Koalas sleep 18–20 hours a day because eucalyptus is so low in energy and hard to digest. Teenagers need 8–10 hours for different reasons: sleep repairs muscles, releases growth hormone, strengthens immunity and consolidates memories.',
      },
    ],
  },

  // ── Dingo ──────────────────────────────────────────────────────────────────
  // PDHPE focus: Eating to fuel activity, food as fuel for movement and performance
  dingo: {
    observationPrompt: 'Watch the dingo move. In the wild it hunts for every meal, running kilometres each day. It has to physically work for its food and then use that food to fuel the next hunt. Think about how what you eat affects how you move and perform.',
    writingPromptByStage: {
      1: 'The dingo runs to hunt. What food gives you energy to run and play?',
      2: 'The dingo eats to fuel the hunt. What two foods give you energy to be active?',
      3: 'The dingo eats to fuel its hunt. What should you eat to fuel sport, and why?',
      4: 'The dingo fuels its next hunt with what it eats. What should you eat to fuel activity, and why?',
      5: 'Like the dingo between hunts, how does what you eat before and after activity affect performance and recovery?',
    },
    expectedAnswers: {
      1: [],
      2: ['energy', 'carbohydrate', 'protein'],
      3: ['energy', 'food', 'performance'],
      4: ['carbohydrate', 'protein', 'hydration', 'recovery'],
      5: ['carbohydrate', 'protein', 'hydration', 'recovery', 'performance'],
    },
    questions: [
      {
        q: 'Eating to Fuel Activity',
        stageVariants: {
          1: 'The dingo needs food to have enough energy to hunt. What happens to YOUR body when you try to be active without eating enough?',
          2: 'The dingo hunts best when it is well fed. Which food would give you the best energy before sport or physical activity?',
          3: 'Before a long hunt, the dingo needs fuel. Which meal would best prepare a student for 60 minutes of sport?',
          4: 'The dingo eats to fuel its next hunt. What is the MAIN role of food in relation to physical activity for humans?',
          5: 'A student has PE immediately after lunch. Which nutrition strategy would best support their performance and recovery?',
        },
        stageOptions: {
          1: ['You feel exactly the same', 'You get faster because your body uses stored energy efficiently', 'You feel tired, weak and find it hard to concentrate', 'Your muscles get stronger from working harder'],
          2: ['A can of energy drink', 'A bag of lollies', 'A banana or wholegrain sandwich', 'A glass of water only'],
          3: ['A large greasy meal one hour before', 'Skipping lunch to feel lighter during sport', 'A balanced meal with carbohydrates and some protein 1 to 2 hours before', 'Nothing, the body performs better when fasted'],
          4: ['Food is mainly for enjoyment and has little effect on activity', 'Food only matters after exercise for recovery', 'Food provides the energy and nutrients the body needs to move, perform and recover', 'Only protein matters for physical activity'],
          5: ['Eat nothing and drink only water to avoid side stitches', 'Eat a large high-fat meal for maximum energy stores', 'Eat a light meal with carbohydrates and protein before, then rehydrate and have a protein-rich snack after', 'Skip lunch and refuel only after PE'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: 'Without enough food, your body runs low on fuel. You feel tired, weak and find it hard to concentrate or perform. Just like a dingo that hasn\'t eaten can\'t hunt effectively, your body can\'t perform well without the right fuel.',
          2: 'Bananas and wholegrain sandwiches provide carbohydrates that your body converts to glucose quickly. That glucose is what your muscles use during activity. Energy drinks and lollies give a short spike followed by a crash.',
          3: 'A balanced meal with carbohydrates and some protein 1 to 2 hours before activity gives your body time to digest and convert food into fuel. Carbohydrates are your muscles\' primary energy source during exercise.',
          4: 'Food provides the energy your body needs to move, and the nutrients it needs to grow, repair and recover. Without enough of the right food, physical performance drops. The dingo\'s whole day is built around eating to fuel movement.',
          5: 'A light meal with carbohydrates before PE tops up your energy stores. Rehydrating after and eating a protein-rich snack supports muscle repair and recovery. Skipping meals or eating too much too close to activity both hurt performance.',
        },
        options: ['You feel exactly the same', 'You get faster because your body uses stored energy', 'You feel tired, weak and find it hard to concentrate', 'Your muscles get stronger from working harder'],
        correct: 2,
        fact: 'Just like the dingo eats to fuel its next hunt, your body needs food to perform. Carbohydrates give you energy for movement, protein helps your muscles recover, and staying hydrated keeps everything working. What you eat directly affects how you move.',
      },
    ],
  },

  // ── Lemur ──────────────────────────────────────────────────────────────────
  // PDHPE focus: Social health and belonging, oxytocin, cortisol reduction, social bonding, biopsychosocial model
  lemur: {
    observationPrompt: 'Watch the lemur troop carefully, notice how they split their time between eating, resting, moving and being together. These four behaviours map directly onto the four pillars of human health.',
    writingPromptByStage: {
      1: 'Lemurs stay close to their troop and look after each other. How are your relationships with friends or family similar to the lemurs? How do those relationships make you feel?',
      2: 'Lemurs live in troops and rely on each other every day. How are your relationships with friends or family similar to the lemur troop? How do those relationships affect how you feel?',
      3: 'Lemurs live in troops and depend on their relationships to survive and feel safe. Compare the lemur\'s relationships to your own. How do your relationships with others affect your health and wellbeing?',
      4: 'Lemurs rely on their troop for safety, comfort and belonging. Compare the lemur\'s social bonds to human relationships. How do our relationships with others affect our physical and mental health?',
      5: 'Lemurs depend on strong social bonds within their troop for survival and wellbeing. Compare the lemur\'s relationships to human social connections. How do relationships with others affect both physical and mental health outcomes?',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['nutrition', 'rest', 'physical activity', 'social'],
      4: ['nutrition', 'rest', 'physical activity', 'social connection'],
      5: [],
    },
    questions: [
      {
        q: 'Which health behaviour did the lemur troop demonstrate most in your observation?',
        stageVariants: {
          1: 'Look at your tally. Which healthy behaviour did you observe the lemurs doing most?',
          2: 'Based on your observation tally, which health behaviour was most common in the lemur troop?',
          3: 'Using your ethogram data, which health behaviour did the ring-tailed lemur troop demonstrate most during your observation?',
          4: 'Your ethogram recorded four health behaviours. Which was most frequent, and which pillar of health does it represent?',
          5: 'Analyse your ethogram. Which health behaviour was the dominant determinant of the ring-tailed lemur troop\'s activity pattern during your observation period?',
        },
        stageOptions: {
          1: ['Eating and feeding', 'Resting and sleeping', 'Moving and playing', 'Being with others'],
          2: ['Nutrition, eating', 'Rest, resting and sleeping', 'Physical activity, moving', 'Social connection, being together'],
          3: ['Nutrition', 'Rest and recovery', 'Physical activity', 'Social connection'],
          4: ['Nutrition', 'Rest and recovery', 'Physical activity', 'Social connection and belonging'],
          5: ['Nutritional intake', 'Rest and recovery', 'Physical activity', 'Social connection as a health determinant'],
        },
        stageCorrect: { 1: -1, 2: -1, 3: -1, 4: -1, 5: -1 },
        stageFacts: {
          1: 'Lemurs naturally balance eating, resting, moving and being social, the same four things that keep us healthy too! Your tally shows which one they prioritised most today.',
          2: 'Lemurs divide their time across four key health behaviours, just like humans need to. Whichever you observed most today shows what the troop was prioritising for their survival and wellbeing.',
          3: 'Ring-tailed lemurs instinctively balance nutrition, rest, physical activity and social connection. These four behaviours map directly onto the pillars of human health, and your ethogram shows which one dominated today.',
          4: 'Each of the four behaviours you tracked represents a pillar of health: nutrition for energy, rest for recovery, physical activity for fitness, and social connection for mental wellbeing. Your data shows which one the troop prioritised most in this window of observation.',
          5: 'Lemurs naturally allocate time across all four health determinants, nutrition, rest, physical activity and social connection. Your ethogram captures a snapshot of this balance. The behaviour you observed most was the troop\'s dominant health strategy during this period.',
        },
        options: ['Eating and feeding', 'Resting and sleeping', 'Moving and playing', 'Being with others'],
        correct: -1,
        fact: 'Lemurs naturally balance eating, resting, moving and social connection, the same four pillars that underpin human health. Whatever you observed most is the behaviour the troop was prioritising for their survival and wellbeing today.',
      },
    ],
  },

  // ── Sea Lion ───────────────────────────────────────────────────────────────
  // PDHPE focus: Aquatic fitness and respiratory system, dive reflex, haemoglobin, cardiovascular-respiratory interdependence
  'sea-lion': {
    observationPrompt: 'Watch the sea lion dive and hold its breath underwater, it is demonstrating one of the most remarkable respiratory and cardiovascular adaptations in the animal kingdom.',
    writingPromptByStage: {
      1: 'Sea lions face threats from humans like pollution and fishing. Just like the sea lion keeps going, what do YOU do when things get tough?',
      2: 'Sea lions face human threats like plastic pollution and overfishing. Just like the sea lion must adapt and survive, what strategies do you use when you face a challenge?',
      3: 'Sea lions face human impacts like pollution, overfishing and climate change. Just like the sea lion must adapt to survive, what resilience strategies help you overcome challenges in your own life?',
      4: 'Sea lions face serious human impacts including pollution, overfishing and climate change. Just like sea lions must find ways to survive these threats, what strategies help you overcome challenges and build resilience?',
      5: 'Sea lions face multiple human-caused threats including plastic pollution, overfishing and climate change. Just as sea lions must adapt and persist to survive, what personal resilience strategies do you draw on when facing challenges, and why do those strategies work?',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['haemoglobin', 'oxygen'],
      4: ['dive reflex', 'bradycardia', 'haemoglobin'],
      5: [],
    },
    questions: [
      {
        q: 'Challenge and Change, Decision Making',
        stageVariants: {
          1: 'In the game you had to choose what to spend your budget on. When you face a challenge in real life, what is a helpful first step?',
          2: 'In the game you couldn\'t buy everything with your budget. When you face a challenge and can\'t do it all at once, what is a good strategy?',
          3: 'The game asked you to balance three different areas. Which approach works best when managing a personal challenge?',
          4: 'You made trade-off decisions with a limited budget. Which best describes an effective decision-making strategy when facing a significant challenge or change?',
          5: 'Reflect on the trade-offs you made in the game. Why is a structured decision-making process more effective than reacting emotionally when facing challenge and change?',
        },
        stageOptions: {
          1: ['Panic and act straight away', 'Stop and think about what you can do', 'Ignore it and hope it goes away', 'Wait for someone else to fix it'],
          2: ['Try to do everything at once', 'Break it into smaller steps and tackle them one at a time', 'Give up if it feels too hard', 'Do the hardest part last and avoid it for now'],
          3: ['React immediately without thinking it through', 'Consider how the challenge affects different parts of your life and balance your response', 'Focus on one area only and ignore the rest', 'Always ask someone else to decide for you'],
          4: ['Make a quick decision based on feeling alone', 'Identify the problem, consider your options, weigh the consequences and choose the best action available', 'Avoid making any decision to prevent making a mistake', 'Always choose the option that takes the least effort'],
          5: ['Emotional reactions are faster and always more effective in a crisis', 'Structured decision-making reduces impulsive mistakes, considers consequences and leads to better outcomes, especially for complex or ongoing challenges', 'A structured process always leads to the perfect outcome', 'Structured approaches only work for small challenges, not major life changes'],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
        stageFacts: {
          1: 'When you face a challenge, stopping to think before you act helps you make better decisions, just like you thought carefully about your budget in the game!',
          2: 'Breaking a challenge into smaller steps makes it feel less overwhelming. Tackling one thing at a time is one of the most effective coping strategies there is.',
          3: 'Challenges often affect different parts of our lives at once. Thinking about how they connect, like balancing the three categories in the game, helps us respond more effectively.',
          4: 'Good decision-making means identifying the problem, listing your options, thinking about consequences and choosing the best available action. This works for budget decisions and real-life challenges alike.',
          5: 'Structured decision-making reduces the chance of choices we later regret. When facing major challenge and change, taking time to consider your options and their consequences consistently leads to better outcomes than acting on emotion alone.',
        },
        options: ['Stop and think about what you can do', 'Break it into smaller steps and tackle them one at a time', 'Consider how the challenge affects different parts of your life and balance your response', 'Identify the problem, consider your options, weigh the consequences and choose the best action available'],
        correct: 1,
        fact: 'Just like the budget game required you to weigh up competing priorities, real challenges rarely have a perfect solution. Effective decision-making, identifying your options, weighing consequences and taking considered action, is a skill that makes navigating challenge and change much more manageable.',
      },
    ],
  },

  // ── Asian Water Buffalo ────────────────────────────────────────────────────
  // PDHPE focus: Musculoskeletal health, bone density, muscle hypertrophy, Type I/II fibres, resistance training
  'asian-water-buffalo': {
    observationPrompt: 'Look at the water buffalo\'s massive frame, its bone structure, muscle bulk, and posture reveal how the musculoskeletal system adapts to load-bearing work over a lifetime.',
    writingPromptByStage: {
      1: 'The buffalo rolls in water and mud to stay cool. Why do YOU need to drink water when you are active or hot?',
      2: 'The buffalo needs water to cool down and keep going. Why is drinking water important for your body when you are active?',
      3: 'The buffalo relies on water to stay cool and keep working. Why does your body need water during physical activity and what happens if you do not drink enough?',
      4: 'The buffalo needs water to survive heat and hard work. What does hydration do for your body during physical activity and what are the signs that you are not drinking enough?',
      5: 'The buffalo relies on water to regulate its temperature and keep performing. Why is hydration important for physical performance and health, and what are the effects of dehydration on the body during exercise?',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['bone density', 'osteoblast', 'weight-bearing'],
      4: ['osteoblast', 'Type I', 'slow-twitch', 'hypertrophy'],
      5: [],
    },
    questions: [
      {
        q: 'Hydration and Staying Cool During Exercise',
        stageVariants: {
          1: 'The buffalo rolls in water to stay cool. Why do you need to drink water when you exercise?',
          2: 'You sweat when you exercise. What does sweating do for your body?',
          3: 'How does your body cool itself down when you exercise?',
          4: 'What happens to your body if you do not drink enough while exercising in the heat?',
          5: 'A student exercises for an hour in the heat without drinking. What happens to their body?',
        },
        // The answer used to be option A in all five stages. Moved around so a class cannot
        // pattern-match its way through.
        stageOptions: {
          1: ['To replace the water you sweat out', 'Because water tastes good', 'Water does not help when you exercise', 'Only adults need water'],
          2: ['It makes you feel cold straight away', 'It cools you down as it dries on your skin', 'It does nothing to your temperature', 'It only happens when you are sick'],
          3: ['It stores the heat in your muscles', 'It stops blood going to your skin', 'Sweat dries on your skin and takes the heat away', 'It slows you down automatically'],
          4: ['Your heart works harder and you get tired faster', 'You get better at exercising', 'You sweat more to make up for it', 'Your muscles get stronger'],
          5: ['Body temperature drops and the muscles work better', 'Blood volume falls, heart rate rises and performance drops', 'Sweating keeps body temperature perfectly stable', 'Muscles use stored water, so nothing changes for an hour'],
        },
        stageCorrect: { 1: 0, 2: 1, 3: 2, 4: 0, 5: 1 },
        stageFacts: {
          1: 'You lose water when you sweat. Drinking puts it back, so your body keeps working properly.',
          2: 'Sweat dries on your skin and carries heat away with it. That is how your body cools itself.',
          3: 'Blood moves to your skin and you sweat. As the sweat dries it takes heat with it, the same job the buffalo does by sitting in water and mud.',
          4: 'Without enough water your heart has to work harder, you heat up, and you tire and lose focus faster. Even a little dehydration makes a real difference.',
          5: 'Less water means less blood volume, so the heart beats faster to keep up. Body temperature climbs and both your body and your thinking slow down. That is why you drink before and during exercise, not just after.',
        },
        options: ['To replace the water you sweat out', 'Because water tastes good', 'Water does not help when you exercise', 'Only adults need water'],
        correct: 0,
        fact: 'Like the buffalo sitting in water and mud to stay cool, your body uses sweat to get rid of heat. If you do not drink to replace it, your heart works harder, you heat up and you tire faster.',
      },
    ],
  },

  // ── Blue Mountains Bushwalk ────────────────────────────────────────────────
  // PDHPE focus: Aerobic exercise response and nature-based mental health
  // 3 questions: Q1 resting HR, Q2 aerobic exercise type, Q3 nature and cortisol
  'blue-mountains-bushwalk': {
    observationPrompt: 'Breathe in the bush air, listen to the sounds around you, and notice how your body feels walking through this natural environment, then consider what science says about nature\'s effect on heart rate, stress hormones, and mental wellbeing.',
    writingPromptByStage: {
      1: 'When you stood still and listened to the birds and bush, what did you notice? Write two ways the world around you shapes who you are.',
      2: 'When you stood still and listened to the bush, what did you feel? Write about two ways the world around you shapes your identity.',
      3: 'You stood still and listened to the bush around you. Just like these animals are shaped by their environment, write about two ways the world around you shapes your identity.',
      4: 'You stood still and listened to the birds and bush sounds. Just like these animals are shaped by their environment, how does the world around you shape your identity and wellbeing?',
      5: 'Standing still in the bush, listening to birds and nature, you became part of the environment. Just like these animals, the world around you shapes who you are. Write about how your environment shapes your identity and connects to your wellbeing.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: [],
      4: ['cortisol', 'HPA axis', 'parasympathetic'],
      5: [],
    },
    questions: [
      // questions[0], Q1: Platypus (identity doesn't fit one box)
      {
        q: 'Which animal at Taronga shows that identity doesn\'t have to fit into just one box?',
        stageVariants: {
          1: 'Which animal at Taronga shows us that we don\'t have to fit into just one box?',
          2: 'Which animal at Taronga shows that you can have lots of different parts to who you are?',
          3: 'Which animal best shows that identity can be made up of many different, unexpected parts?',
          4: 'Which animal demonstrates that a unique combination of traits can form a powerful and distinctive identity?',
          5: 'Which animal best demonstrates that a unique combination of traits can form a powerful and distinctive identity?',
        },
        stageOptions: {
          1: ['Koala', 'Tiger', 'Platypus', 'Giraffe'],
          2: ['Koala', 'Tiger', 'Platypus', 'Giraffe'],
          3: ['Koala', 'Tiger', 'Platypus', 'Giraffe'],
          4: ['Koala', 'Tiger', 'Platypus', 'Giraffe'],
          5: ['Koala', 'Tiger', 'Platypus', 'Giraffe'],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
        stageFacts: {
          1: 'The platypus! It\'s a mammal that lays eggs, has a duck bill and is venomous, it doesn\'t fit into just one category. Just like the platypus, your identity is made up of many unique parts.',
          2: 'The platypus has features from so many different animals, just like you! Your identity is shaped by your family, culture, experiences and values, all at once.',
          3: 'The platypus defies easy categorisation. Identity works the same way, it\'s a unique combination of culture, values, experiences and relationships that makes each person who they are.',
          4: 'The platypus, venomous, egg-laying and electrically sensing. Its identity is defined by a unique combination of traits, not by fitting a single category. Personal identity works the same way.',
          5: 'The platypus cannot be reduced to a single category, it is the product of a unique combination of traits. Human identity similarly emerges from the intersection of culture, values, experiences, relationships and context.',
        },
        options: ['Koala', 'Tiger', 'Platypus', 'Giraffe'],
        correct: 2,
        fact: 'The platypus is one of the most unique animals on Earth, a mammal that lays eggs, has a bill and is venomous. Just like the platypus, our identity doesn\'t have to fit neatly into one box.',
      },
      // questions[1], Q2: Lizard (environment shapes identity)
      {
        q: 'I am a large statue and I represent a cold-blooded animal that needs the sun to survive. Just like this animal, my wellbeing is shaped by my environment. What am I?',
        stageVariants: {
          1: 'I am a large statue and I represent a cold-blooded animal that needs the sun and warm ground to survive. Just like this animal, my wellbeing is shaped by my environment. What am I?',
          2: 'I am a large statue and I represent an animal that cannot heat its own body without its surroundings. Just like this animal, my wellbeing is shaped by my environment. What am I?',
          3: 'I am a large statue and I represent a reptile entirely shaped by its environment. Just like this animal, my wellbeing is shaped by my environment. What am I?',
          4: 'I am a large statue. Just like this animal, my wellbeing is shaped by my environment. What am I?',
          5: 'I am a large statue and I represent an ectothermic reptile with no capacity to override its environment. Just like this animal, my wellbeing is shaped by my environment. What am I?',
        },
        stageOptions: {
          1: ['Platypus', 'Koala', 'Lyrebird', 'Lizard'],
          2: ['Platypus', 'Koala', 'Lyrebird', 'Lizard'],
          3: ['Platypus', 'Koala', 'Lyrebird', 'Lizard'],
          4: ['Platypus', 'Koala', 'Lyrebird', 'Lizard'],
          5: ['Platypus', 'Koala', 'Lyrebird', 'Lizard'],
        },
        stageCorrect: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
        stageFacts: {
          1: 'The lizard! Cold-blooded animals rely on their environment to stay warm. Just like the lizard, the world around us, our family, school and community, shapes who we become.',
          2: 'The lizard relies on its surroundings to regulate its temperature. In the same way, our environment, the people we grow up with, our culture and community, plays a big role in shaping our identity.',
          3: 'The lizard cannot regulate its own body temperature; it is entirely shaped by its environment. Similarly, our identity is strongly influenced by the world we grow up in, including family, culture and community.',
          4: 'The lizard. Its physical state is determined by the environment around it. Human identity is similarly shaped by social, cultural and community environments, though unlike the lizard, we can reflect on and actively shape our own identity.',
          5: 'The lizard. As an ectotherm, it has no internal temperature regulation; its state is externally determined. Human identity, while more complex, is similarly shaped by social, cultural and historical contexts. Unlike the lizard, however, humans can critically reflect on these influences and develop a sense of agency over their identity.',
        },
        options: ['Platypus', 'Koala', 'Lyrebird', 'Lizard'],
        correct: 3,
        fact: 'The lizard is cold-blooded; its environment determines its body temperature. Just like the lizard, the environment we grow up in plays a powerful role in shaping who we are.',
      },
      // questions[2], Q3: Lyrebird (authentic identity vs copying others)
      {
        q: 'Which bird shows us the difference between copying others and staying true to your own identity?',
        stageVariants: {
          1: 'Which bird can copy almost any sound it hears, but still has its own unique call?',
          2: 'Which bird teaches us that there\'s a difference between copying others and being yourself?',
          3: 'Which bird shows that being influenced by others doesn\'t have to mean losing your true identity?',
          4: 'Which bird best represents the tension between social influence and authentic identity?',
          5: 'Which bird best represents the tension between social conformity and authentic identity?',
        },
        stageOptions: {
          1: ['Lyrebird', 'Platypus', 'Goanna', 'Kookaburra'],
          2: ['Lyrebird', 'Platypus', 'Goanna', 'Kookaburra'],
          3: ['Lyrebird', 'Platypus', 'Goanna', 'Kookaburra'],
          4: ['Lyrebird', 'Platypus', 'Goanna', 'Kookaburra'],
          5: ['Lyrebird', 'Platypus', 'Goanna', 'Kookaburra'],
        },
        stageCorrect: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        stageFacts: {
          1: 'The lyrebird! It can copy almost any sound, but it also has its own beautiful call. Just like the lyrebird, we can be inspired by others while still being ourselves.',
          2: 'The lyrebird copies sounds from its environment, but beneath all the mimicry, its own unique call remains. Identity works the same way, we\'re influenced by others, but our true self is still there.',
          3: 'The lyrebird mimics almost everything it hears, yet its own call persists. This mirrors the challenge many young people face, being influenced by peers and media while staying true to who they actually are.',
          4: 'The lyrebird. Its extraordinary mimicry represents the social pressure to absorb and reflect others\' identities. But the lyrebird\'s own call never disappears, just as authentic identity persists beneath social conformity pressure.',
          5: 'The lyrebird. Its mimicry reflects the complex interplay between social influence and authentic identity. While it absorbs environmental sounds, its own call endures, a metaphor for how individuals navigate peer pressure and media influence while maintaining an authentic sense of self.',
        },
        options: ['Lyrebird', 'Platypus', 'Goanna', 'Kookaburra'],
        correct: 0,
        fact: 'The lyrebird can mimic almost any sound, but beneath all the copying, its own call remains. Just like the lyrebird, being influenced by others doesn\'t mean losing your own identity. Your true self is always there.',
      },
    ],
  },

  // ── Concert Lawn ───────────────────────────────────────────────────────────
  // PDHPE focus: Physical activity, heart rate response, enjoyment and intrinsic motivation for lifelong physical activity
  'concert-lawn': {
    observationPrompt: 'Stand on the Concert Lawn and take a moment to notice how your body feels in the open space, then think about how enjoyment of physical activity relates to lifelong health habits.',
    writingPromptByStage: {
      1: 'How did being on the Concert Lawn make you feel? Write one thing about your body and one thing about your mood.',
      2: 'How did being active on the Concert Lawn make you feel? Write about how your body felt and how it affected your mood.',
      3: 'How did being active on the Concert Lawn make you feel? Write about how it affected your body, your mood and your connection to others.',
      4: 'How did being on the Concert Lawn make you feel physically and emotionally? Connect this experience to your health and wellbeing.',
      5: 'How did being active on the Concert Lawn make you feel? Write about the connection between physical activity, outdoor spaces and your overall health and wellbeing.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['intrinsic', 'enjoyment'],
      4: ['intrinsic motivation', 'heart rate', 'cardiovascular'],
      5: [],
    },
    questions: [
      {
        q: 'Team Challenge, Concert Lawn',
        stageVariants: {
          1: 'What helped your team get everyone across?',
          2: 'What made your team successful?',
          3: 'Which factor was most important to your team\'s success?',
          4: 'What was most important for untangling the Human Knot successfully?',
          5: 'What does effective leadership in a team challenge look like?',
        },
        stageOptions: {
          1: ['Running as fast as possible alone', 'Pushing past slower teammates', 'Ignoring what the rest of the team was doing', 'Cheering each other on and waiting for everyone'],
          2: ['Only the best throwers doing the passing', 'Going as fast as possible without looking at others', 'Letting one person do most of the work', 'Communicating, encouraging and working together'],
          3: ['Each person only doing what they were best at', 'Having the fastest person go last', 'Competing against your own teammates', 'Clear roles, communication and supporting each other'],
          4: ['The strongest person pulling everyone into position', 'Moving as fast as possible without talking', 'Having one person stay still while others moved around them', 'Listening to each other, communicating clearly and moving step by step'],
          5: ['Making all decisions without asking the team', 'Ensuring the most skilled players did all the work', 'Focusing purely on the result, not how the team felt', 'Listening to the team, communicating clearly and adapting when things went wrong'],
        },
        stageCorrect: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
        stageFacts: {
          1: 'In a relay, cheering each other on and making sure no one is left behind makes the challenge more enjoyable and successful for the whole team!',
          2: 'When teams communicate and encourage each other, they make fewer mistakes and keep everyone engaged, not just the most skilled players.',
          3: 'When everyone has a clear role and supports each other, teams perform better than when individuals just focus on themselves.',
          4: 'The Human Knot untangles through small, patient steps and clear communication, not by force. In teams, listening and adjusting together is always more powerful than one person trying to pull everyone into place.',
          5: 'The best leaders listen, communicate clearly and adapt when things don\'t go to plan. They make everyone feel valued, not just the most talented players.',
        },
        options: ['Running as fast as possible alone', 'Pushing past slower teammates', 'Ignoring what the rest of the team was doing', 'Cheering each other on and waiting for everyone'],
        correct: 3,
        fact: 'Great teams are built on communication, clear roles and mutual support. When everyone feels included and encouraged, the whole group performs better, on the Concert Lawn and beyond.',
      },
    ],
  },

};

export default PDHPE_ANIMALS;
