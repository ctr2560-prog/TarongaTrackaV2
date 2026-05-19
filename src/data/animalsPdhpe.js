// PDHPE academic content for all 12 Taronga Tracka missions.
// NSW PDHPE K–10 2022 curriculum — physiology, mental health, and wellbeing.
// Zoo animals as stimulus for real physiological and psychological concepts.

export const PDHPE_ANIMALS = {

  // ── Chimpanzee ─────────────────────────────────────────────────────────────
  // PDHPE focus: Lifestyle comparison — chimp vs. student habits, healthy habit adoption
  chimpanzee: {
    observationPrompt: 'Watch the chimpanzees. Notice how they move, rest and spend time together. Use your graph to compare their daily habits with your own.',
    writingPromptByStage: {
      1: 'Look at your graph. Write one thing the chimpanzee does that is the SAME as you, and one thing that is DIFFERENT.',
      2: 'Look at your graph. Write one way the chimpanzee lifestyle is similar to yours and one way it is different. What is one healthy habit you could copy from the chimp?',
      3: 'Using your graph, compare the chimpanzee lifestyle to your own. Describe one similarity and one difference. Explain how copying one chimp habit could improve your health.',
      4: 'Compare the lifestyle of the chimpanzees you observed to your own. Use your graph as evidence. How are they similar? How are they different? What healthy habits could you take from the chimpanzee?',
      5: 'Evaluate how the chimpanzee lifestyle compares to your own using your graph as evidence. For two specific behaviours, explain how the chimp habit addresses a determinant of health and assess whether your own habits support or undermine the same determinant.',
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
            'It combines regular movement, social connection and a varied diet — all key determinants of health',
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
          1: 'Moving your body and eating lots of different healthy foods every day — just like chimps do — is great for your health!',
          2: 'Physical activity strengthens muscles and bones, boosts mood, improves sleep and reduces the risk of many diseases.',
          3: 'Chimpanzees naturally meet three key determinants of health: physical activity, social connection and a varied, plant-rich diet.',
          4: 'Physical activity (cardiovascular and musculoskeletal health) and social connection (mental health, cortisol regulation, sense of belonging) are both clearly addressed by a chimpanzee\'s natural lifestyle.',
          5: 'Natural environments provide multi-dimensional stimulation — physical, social and psychological — that supports the full biopsychosocial model of health, unlike sedentary, isolated conditions.',
        },
        options: ['Moving your body and eating a variety of foods', 'It helps your body and mind stay strong', 'It combines movement, social connection and varied diet', 'Physical activity and social connection'],
        correct: 1,
        fact: 'Chimpanzee lifestyles naturally address key determinants of health — physical activity, social connection, dietary variety and time in nature — providing a practical model for human health promotion.',
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
          2: 'Eating a wide variety of plant foods provides a range of nutrients, fibre and antioxidants — just like the chimpanzee\'s naturally varied diet.',
          3: 'More movement, outdoor time and less screen time are the three lifestyle shifts most directly supported by studying chimpanzee daily habits.',
          4: 'Outdoor physical activity with peers is linked to improved cardiovascular health, stronger mental health, reduced anxiety, better sleep and higher vitamin D levels.',
          5: 'Daily physical activity of 60+ minutes in outdoor social settings addresses physical, psychological and social determinants of health simultaneously — closely mirroring the natural chimpanzee lifestyle.',
        },
        options: ['Sleep helps you grow and feel good', 'Eating a wide variety of plant-based foods', 'Moving more, spending time outdoors and reducing screen time', 'Increasing daily activity in outdoor social settings'],
        correct: 2,
        fact: 'The chimp lifestyle model — daily movement, outdoor time, social connection and a varied plant-rich diet — maps directly onto the evidence-based pillars of human health promotion.',
      },
    ],
  },

  // ── Gorilla ────────────────────────────────────────────────────────────────
  // PDHPE focus: Nutrition and diet — food variety, nutrients, food groups, dietary guidelines
  gorilla: {
    observationPrompt: 'Watch the gorilla eat. Gorillas spend hours every day choosing leaves, fruit, bamboo and bark. Think about what their diet tells us about eating for health.',
    writingPromptByStage: {
      1: 'What food do gorillas eat? Write one food you eat that is healthy for your body.',
      2: 'Gorillas eat mostly plants like leaves and fruit. Write two healthy foods you eat and explain why each one is good for your body.',
      3: 'Gorillas eat a wide variety of plant foods every day. Explain why eating a variety of different foods is important for your health. Name two food groups and describe what each one does for your body.',
      4: 'Using the gorilla\'s diet as an example, explain why variety is important in a healthy diet. Describe two food groups, the key nutrients they provide, and the role those nutrients play in keeping the body healthy.',
      5: 'Evaluate how the gorilla\'s plant-rich, varied diet supports multiple health outcomes. In your answer, name specific nutrients (such as fibre, vitamins, minerals and plant protein), explain their physiological roles, and discuss the implications for adolescent dietary guidelines.',
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
            'Eating variety has no proven link to health — it is only about taste preference',
          ],
        },
        stageCorrect: { 1: 1, 2: 0, 3: 0, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Fruit and vegetables give your body vitamins and energy. Gorillas eat mostly plants — and they are one of the strongest animals on Earth!',
          2: 'Carbohydrates are the body\'s main energy source. Gorillas get their energy from plant carbohydrates like fruit and leaves.',
          3: 'Different foods provide different nutrients — vitamins, minerals, protein and fibre. Eating a variety means your body gets everything it needs to grow and stay healthy.',
          4: 'Protein is essential for building and repairing every cell in the body — muscles, skin, organs and enzymes. Gorillas get protein from leaves and insects without eating meat.',
          5: 'High dietary fibre supports healthy digestion and reduces bowel disease risk. Vitamins and minerals support immune function and cell repair. Low saturated fat reduces cholesterol and cardiovascular disease risk.',
        },
        options: ['Fruit and vegetables', 'Carbohydrates', 'To get all the nutrients your body needs', 'It builds and repairs muscles', 'High fibre and low saturated fat reduces disease risk'],
        correct: 0,
        fact: 'Gorillas eat up to 18 kg of plant food every day — a naturally balanced, high-fibre diet. This variety gives them everything they need to grow, stay strong and stay healthy.',
      },
      {
        q: 'What Do Gorillas Actually Eat?',
        stageVariants: {
          1: 'In the game you fed the gorillas leaves, bamboo and fruit. What kind of foods are these?',
          2: 'In the game, gorillas ordered leaves, bamboo, fruit and termites. Which food group makes up MOST of a gorilla\'s diet?',
          3: 'You served gorillas leaves, bamboo and fruit in the game. What is the main nutrient these plant foods provide?',
          4: 'Gorillas eat mostly leaves, bamboo and fruit — all plants. Which macronutrient do they get the most of from these foods?',
          5: 'A gorilla\'s diet is mostly leaves, bamboo and fruit, with termites for protein. Which statement best explains how this diet supports their health?',
        },
        stageOptions: {
          1: ['Meat foods', 'Dairy foods', 'Junk foods', 'Plant foods'],
          2: ['Meat and fish', 'Dairy products like milk and cheese', 'Processed grains and cereals', 'Vegetables, fruit and plants'],
          3: ['Saturated fat and cholesterol', 'Added sugar and salt', 'Artificial flavours and preservatives', 'Fibre, vitamins and minerals'],
          4: ['Fat — from the oils in leaves', 'Protein — leaves are a complete protein source', 'Sodium — bamboo is high in salt', 'Carbohydrates — from the natural sugars and fibre in plants'],
          5: [
            'Eating mostly leaves means gorillas are protein-deficient and rely on termites to survive',
            'Bamboo and fruit are high in saturated fat which builds their thick muscles',
            'Termites provide all the energy they need so plant foods are just for bulk',
            'Plant foods provide fibre, vitamins and carbohydrates for energy, while termites add protein — together covering all their nutritional needs',
          ],
        },
        stageCorrect: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
        stageFacts: {
          1: 'Leaves, bamboo and fruit are all plant foods. Gorillas eat mostly plants — and they are one of the strongest animals on Earth!',
          2: 'Gorillas eat mostly vegetables, fruit and plants. They spend up to 6 hours a day foraging for plant food. The termites add a small amount of protein.',
          3: 'Leaves, bamboo and fruit are packed with fibre, vitamins and minerals. These nutrients help the body grow, fight sickness and keep digestion healthy.',
          4: 'The natural sugars and fibre in leaves, bamboo and fruit are all types of carbohydrate — the body\'s main energy source. That\'s how gorillas fuel their enormous bodies without eating meat.',
          5: 'A gorilla\'s plant-heavy diet gives them fibre for digestion, vitamins for immunity and complex carbohydrates for energy. Termites top up their protein for muscle repair — a naturally balanced diet with no processed food.',
        },
        options: ['Plant foods', 'Vegetables, fruit and plants', 'Fibre, vitamins and minerals', 'Carbohydrates from natural sugars and fibre in plants', 'Plant foods provide fibre and carbohydrates while termites add protein'],
        correct: 3,
        fact: 'Gorillas eat mostly plants — leaves, bamboo and fruit give them carbohydrates, fibre and vitamins, while termites add protein. It\'s a naturally balanced diet that fuels one of the world\'s strongest animals.',
      },
    ],
  },

  // ── Lion ───────────────────────────────────────────────────────────────────
  // PDHPE focus: Rest/recovery and energy systems — sleep, BMR, aerobic vs anaerobic, rest-to-activity ratio
  lion: {
    observationPrompt: 'Watch the lion — is it resting or active? Think about why large predators rest so much and what energy systems they use during their brief bursts of hunting activity.',
    writingPromptByStage: {
      1: 'Is the lion awake or asleep right now? Write why you think sleep is good for your body.',
      2: 'Lions sleep up to 20 hours a day. Write two things your body does while you are sleeping that help you stay healthy.',
      3: 'Lions sprint to catch prey but rest most of the day. Identify the energy system used during a sprint hunt and the energy system used during rest. Explain why lions need such long recovery periods.',
      4: 'Explain the difference between aerobic and anaerobic energy systems. Describe how a lion\'s hunting sprint relies on the ATP-PC (phosphocreatine) system and what happens to muscles during the recovery period that follows.',
      5: 'A lion sleeps approximately 20 hours per day. Evaluate the physiological importance of this rest-to-activity ratio. In your answer, refer to BMR (basal metabolic rate), ATP-PC system replenishment, growth hormone secretion during slow-wave sleep, and the adaptive advantage of energy conservation for a high-cost predator.',
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
        q: 'Energy Systems and Recovery',
        stageVariants: {
          1: 'Lions run very fast for a short time to catch food, then rest for a long time. Why do they need to rest?',
          2: 'Which energy system gives you a quick burst of energy for a short sprint — like a lion chasing prey?',
          3: 'A lion sprints for 6 seconds to catch prey. Which energy system powers this activity?',
          4: 'After a lion\'s sprint, which substance must be replenished in the muscles before another maximum-effort sprint is possible?',
          5: 'A lion\'s sprint relies on the ATP-PC system (lasts ~10 seconds) before lactic acid accumulates. Full phosphocreatine replenishment takes approximately 3–5 minutes. Which statement BEST evaluates why lions rest between hunts rather than immediately chasing again?',
        },
        stageOptions: {
          1: ['Because they are bored', 'To give their muscles time to recover', 'Because they are not hungry', 'Because it is night-time'],
          2: ['Aerobic system', 'Anaerobic ATP-PC system', 'Digestive system', 'Lymphatic system'],
          3: ['Aerobic (oxygen-based) system', 'ATP-PC (phosphocreatine) system', 'Glycolytic lactic acid system', 'Both aerobic and anaerobic equally'],
          4: ['Haemoglobin', 'Glycogen only', 'Phosphocreatine (PCr)', 'Cortisol'],
          5: [
            'Lions rest because they are cold-blooded and need sun to recharge energy',
            'Phosphocreatine stores are depleted in ~10 seconds and require 3–5 min aerobic recovery to replenish — making immediate re-sprint physiologically impossible',
            'Lions rest because aerobic capacity is unlimited and resting conserves oxygen',
            'Lactic acid clears in under 30 seconds, so rest is purely behavioural not physiological',
          ],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 1, 4: 2, 5: 1 },
        stageFacts: {
          1: 'Rest gives muscles time to repair and replenish energy stores. Without rest, the body cannot perform at its best.',
          2: 'The ATP-PC (phosphocreatine) system provides immediate anaerobic energy for high-intensity efforts lasting up to about 10 seconds.',
          3: 'The ATP-PC system powers maximum-intensity efforts under ~10 seconds. A lion\'s hunting sprint is a perfect example of this anaerobic energy pathway.',
          4: 'Phosphocreatine (PCr) is the substrate that regenerates ATP during the ATP-PC system. Full PCr replenishment requires 3–5 minutes of aerobic recovery.',
          5: 'PCr stores are exhausted in ~10 seconds. Aerobic metabolism during rest replenishes them over 3–5 minutes. This physiological constraint — not behaviour — dictates the lion\'s rest-to-hunt ratio.',
        },
        options: ['To give their muscles time to recover', 'Anaerobic ATP-PC system', 'ATP-PC (phosphocreatine) system', 'Phosphocreatine (PCr)'],
        correct: 1,
        fact: 'A lion\'s sprint depletes phosphocreatine stores in about 10 seconds. Full replenishment via aerobic metabolism takes 3–5 minutes — explaining why lions rest 20 hours a day and hunt in brief bursts.',
      },
    ],
  },

  // ── Giraffe ────────────────────────────────────────────────────────────────
  // PDHPE focus: Cardiovascular system — blood pressure, heart rate, cardiac output, exercise response
  giraffe: {
    observationPrompt: 'Watch the giraffe lower its head to drink — this extraordinary feat requires a cardiovascular system unlike any other animal\'s, with lessons for understanding human heart health.',
    writingPromptByStage: {
      1: 'Put your hand on your chest and feel your heartbeat. Count how many beats you feel in 10 seconds. What is your heart doing?',
      2: 'Your heart pumps blood around your body. Write two things that happen to your heart rate when you exercise. What happens when you rest?',
      3: 'A giraffe\'s heart must pump blood 3.7 m up to its brain. A human heart pumps blood about 30 cm to the brain. Calculate how many times further the giraffe\'s heart must work. Explain why a giraffe has such high blood pressure.',
      4: 'Explain cardiac output using the formula: Cardiac Output = Heart Rate × Stroke Volume. Describe how a giraffe\'s cardiovascular adaptations (large heart, high blood pressure, specialised valves) prevent fainting when it lowers its head to drink.',
      5: 'A giraffe\'s resting blood pressure is approximately 280/180 mmHg — twice that of humans (120/80 mmHg). Evaluate the cardiovascular adaptations that make this possible without causing vessel damage, and analyse what happens to cardiac output (CO = HR × SV) during exercise in both giraffes and humans. Discuss implications for understanding cardiovascular disease risk in humans.',
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
        q: 'Heart Rate and Cardiovascular Response',
        stageVariants: {
          1: 'What happens to your heart rate when you run fast?',
          2: 'Which of these will make your heart beat FASTER?',
          3: 'Cardiac output = Heart Rate × Stroke Volume. If HR = 70 bpm and SV = 70 mL, what is cardiac output in mL/min?',
          4: 'A giraffe\'s resting heart rate is about 40 bpm with a stroke volume of 60 L per beat. What is its approximate cardiac output per minute?',
          5: 'During exercise, a trained athlete\'s stroke volume increases from 70 mL to 110 mL while heart rate rises from 60 to 150 bpm. Calculate resting and exercise cardiac output. What cardiovascular adaptation accounts for the increased stroke volume?',
        },
        stageOptions: {
          1: ['It slows down', 'It stays the same', 'It speeds up', 'It stops'],
          2: ['Sleeping', 'Sitting quietly', 'Sprinting', 'Reading'],
          3: ['490 mL/min', '4,900 mL/min', '140 mL/min', '700 mL/min'],
          4: ['240 L/min', '2,400 L/min', '40 L/min', '2.4 L/min'],
          5: [
            'Rest: 4,200 mL/min; Exercise: 16,500 mL/min; Cardiac hypertrophy increases stroke volume',
            'Rest: 4,200 mL/min; Exercise: 12,000 mL/min; Higher haemoglobin increases stroke volume',
            'Rest: 9,000 mL/min; Exercise: 16,500 mL/min; Faster breathing increases stroke volume',
            'Rest: 4,200 mL/min; Exercise: 16,500 mL/min; Reduced peripheral resistance increases heart rate',
          ],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 1, 4: 0, 5: 0 },
        stageFacts: {
          1: 'Your heart beats faster during exercise to deliver more oxygen-rich blood to working muscles.',
          2: 'Exercise (like sprinting) increases heart rate. The heart works harder to supply muscles with oxygen and remove carbon dioxide.',
          3: 'CO = 70 × 70 = 4,900 mL/min. This is approximately 4.9 litres of blood pumped every minute at rest.',
          4: 'A giraffe\'s cardiac output = 40 bpm × 60 L = 2,400 L/min — an enormous volume driven by an 11 kg heart.',
          5: 'Rest: 60 × 70 = 4,200 mL/min. Exercise: 150 × 110 = 16,500 mL/min. Cardiac hypertrophy (enlargement of the left ventricle wall) is the key adaptation that increases stroke volume in trained athletes.',
        },
        options: ['It speeds up', 'Sprinting', '4,900 mL/min', '2,400 L/min'],
        correct: 2,
        fact: 'Cardiac Output = Heart Rate × Stroke Volume. A giraffe\'s 11 kg heart generates blood pressure twice that of humans — essential to pump blood 3.7 m up its neck to the brain.',
      },
    ],
  },

  // ── Tiger ──────────────────────────────────────────────────────────────────
  // PDHPE focus: Muscle fibre types — fast-twitch vs slow-twitch, captive stress, environmental enrichment and mental health
  tiger: {
    observationPrompt: 'Watch the tiger\'s movement and body — notice its explosive power versus its patient stillness, and consider what its muscles and its mental state tell us about physiology and wellbeing.',
    writingPromptByStage: {
      1: 'Watch the tiger move. Is it moving slowly or quickly? Point to a muscle on your own leg. Write what muscles help you run.',
      2: 'Tigers can sprint very fast but only for a short time. Write about a sport or activity that needs short bursts of speed. How does that feel in your muscles?',
      3: 'Name the two types of muscle fibres (slow-twitch and fast-twitch). Write one activity that mainly uses each type. Explain why a tiger\'s sprint relies more on one type than the other.',
      4: 'Compare Type I (slow-twitch) and Type II (fast-twitch) muscle fibres in terms of speed of contraction, fatigue resistance, and energy source. Explain which fibre type dominates during a tiger\'s ambush sprint and why.',
      5: 'A tiger in captivity may develop stereotypic pacing behaviour — a sign of chronic psychological stress. Explain how elevated cortisol (from chronic HPA axis activation) affects muscle recovery, immune function, and sleep quality. Evaluate how environmental enrichment programmes address both the physiological and psychological dimensions of tiger welfare using the biopsychosocial model.',
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
        q: 'Muscle Fibre Types and Physical Performance',
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
          1: 'Fast-twitch (Type II) muscles in the legs fire rapidly for explosive movements like jumping, sprinting, and pouncing.',
          2: 'Sprinting uses fast-twitch Type II fibres for explosive, high-force contractions over a short duration.',
          3: 'Type I slow-twitch fibres are fatigue-resistant and oxygen-efficient — ideal for sustained aerobic activities like distance running.',
          4: 'Type II fast-twitch fibres contract 3–5× faster than Type I but fatigue quickly because they rely on anaerobic ATP-PC and glycolytic pathways rather than aerobic metabolism.',
          5: 'Chronic cortisol elevation inhibits muscle protein synthesis (reducing muscle mass), suppresses immune function, disrupts slow-wave sleep (reducing growth hormone), and causes psychological stress — all contributing to stereotypic pacing and poorer overall welfare.',
        },
        options: ['Your fast-twitch leg muscles', 'Sprinting 50 metres', 'A long-distance run', 'Contract quickly but fatigue rapidly'],
        correct: 1,
        fact: 'Type II fast-twitch fibres power a tiger\'s explosive sprint. Chronic stress elevates cortisol, which impairs muscle repair, suppresses immunity, and disrupts sleep — explaining why environmental enrichment is critical to captive tiger welfare.',
      },
    ],
  },

  // ── Koala ──────────────────────────────────────────────────────────────────
  // PDHPE focus: Sleep and recovery — sleep stages, growth hormone, nutrition quality, metabolic rate
  koala: {
    observationPrompt: 'Watch the koala — it is almost certainly asleep. Think about what its body is doing during all those hours of rest, and what sleeping that much tells us about nutrition, energy, and recovery.',
    writingPromptByStage: {
      1: 'The koala is probably sleeping. Write how many hours you sleep each night. Write one way sleep helps your body.',
      2: 'Koalas sleep up to 22 hours a day. Write two things that happen in your body while you sleep. Why is sleep important for children your age?',
      3: 'Koalas sleep so much because eucalyptus leaves are low in energy and hard to digest. Explain how sleep helps the body save energy and recover. Describe what happens to growth hormone during sleep.',
      4: 'Explain the relationship between sleep stages and recovery. During which stage of sleep is growth hormone (GH) released in the highest amounts? Describe how poor sleep affects both physical performance and mental health, using the terms cortisol, immune function, and adenosine.',
      5: 'A koala\'s Basal Metabolic Rate (BMR) is exceptionally low, matching its low-energy eucalyptus diet. Evaluate the physiological mechanisms by which deep slow-wave sleep (SWS) supports recovery: include growth hormone secretion, cortisol suppression, protein synthesis, immune system consolidation, and memory consolidation. Compare koala sleep requirements to the recommended 8–10 hours for adolescents and justify the health consequences of chronic sleep deprivation for teenagers.',
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
        q: 'Sleep Stages and Recovery',
        stageVariants: {
          1: 'Why is sleep important for your body?',
          2: 'Which of these is a benefit of getting enough sleep each night?',
          3: 'During which stage of sleep does the body release the most growth hormone?',
          4: 'Growth hormone (GH) is released during which specific sleep stage, and what does it do?',
          5: 'Chronic sleep deprivation (under 7 hours/night) in teenagers leads to which of the following physiological consequences?',
        },
        stageOptions: {
          1: ['It makes you bored', 'It helps your body heal and grow', 'It wastes time', 'It makes you cold'],
          2: ['Faster hair growth', 'Better concentration and mood', 'Increased hunger all day', 'Weaker immune system'],
          3: ['During light sleep (Stage 1)', 'During REM (dreaming) sleep', 'During deep slow-wave sleep (Stage 3)', 'Just before waking up'],
          4: ['During REM sleep; GH converts fat to muscle rapidly', 'During slow-wave sleep (Stage 3); GH stimulates tissue repair and protein synthesis', 'During Stage 1 light sleep; GH reduces heart rate', 'During waking rest; GH suppresses cortisol production'],
          5: [
            'Reduced cortisol, improved reaction time, and increased muscle hypertrophy',
            'Elevated cortisol, impaired immunity, reduced GH secretion, decreased cognitive performance, and increased injury risk',
            'Increased melatonin, lower BMR, improved mood, and faster sprint times',
            'Elevated adenosine clearance, improved memory consolidation, and reduced cortisol',
          ],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Sleep allows the body to repair muscles, consolidate memories, fight infection, and release growth hormone for development.',
          2: 'Adequate sleep improves concentration, emotional regulation, immune function, and physical performance — all critical for health.',
          3: 'The majority of growth hormone is released during Stage 3 deep slow-wave sleep (SWS). This is when most tissue repair and protein synthesis occurs.',
          4: 'During SWS (Stage 3), the pituitary gland releases GH in large pulses. GH drives protein synthesis, muscle repair, and fat metabolism — making quality sleep essential for athletic recovery.',
          5: 'Chronic sleep deprivation elevates cortisol (stress hormone), suppresses GH, impairs immune function, reduces cognitive performance, slows reaction time, and significantly increases injury risk in young athletes.',
        },
        options: ['It helps your body heal and grow', 'Better concentration and mood', 'During deep slow-wave sleep (Stage 3)', 'During slow-wave sleep (Stage 3); GH stimulates tissue repair and protein synthesis'],
        correct: 1,
        fact: 'Koalas sleep 18–22 hours daily because eucalyptus is so low in energy. During deep slow-wave sleep, the body releases growth hormone, repairs tissues, and consolidates memories — making sleep the most powerful recovery tool available.',
      },
    ],
  },

  // ── Dingo ──────────────────────────────────────────────────────────────────
  // PDHPE focus: Endurance and aerobic fitness — VO2 max, heart rate zones, target heart rate calculation
  dingo: {
    observationPrompt: 'Watch the dingo\'s movement — it is built for covering vast distances across the Australian landscape, which makes it a perfect model for understanding endurance, aerobic fitness, and heart rate.',
    writingPromptByStage: {
      1: 'Place your hand on your chest and feel your heart beat. Write whether it beats faster or slower after you do 10 star jumps.',
      2: 'Dingoes can run for hours across long distances. Write the difference between a sprint (short and fast) and endurance exercise (longer and steady). Which one is better for heart health?',
      3: 'Calculate your Maximum Heart Rate (MHR) using the formula: MHR = 220 − age. If you are 12 years old, find your MHR. Then calculate 60–80% of your MHR — this is the aerobic training zone.',
      4: 'VO2 max measures how much oxygen the body can use during maximum exercise. Explain why a dingo has a high VO2 max compared to a lion. Describe how heart rate training zones (50–85% MHR) relate to aerobic capacity development.',
      5: 'Evaluate the use of heart rate training zones (Zone 1–5) as a tool for developing aerobic fitness. A dingo\'s VO2 max is estimated at 70 mL/kg/min (elite endurance athlete range). Compare this to the average human VO2 max (35–45 mL/kg/min) and explain the cardiovascular and muscular adaptations — including stroke volume, capillary density, and mitochondrial density in Type I fibres — that account for the difference.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['208', '124.8', '166.4', '125', '166'],
      4: ['VO2 max', 'oxygen', 'aerobic'],
      5: [],
    },
    questions: [
      {
        q: 'Target Heart Rate and Aerobic Training Zones',
        stageVariants: {
          1: 'After running around, your heart beats faster. What does this tell you about exercise and your heart?',
          2: 'Which type of exercise is best for training your heart and lungs to work better over time?',
          3: 'A 13-year-old uses MHR = 220 − 13 = 207 bpm. What is 70% of their Maximum Heart Rate?',
          4: 'VO2 max is the gold standard measure of aerobic fitness. What does VO2 max measure?',
          5: 'A 16-year-old athlete trains in Zone 3 (70–80% MHR). MHR = 204 bpm. Which heart rate range defines their Zone 3 training zone, and what cardiovascular adaptation does consistent Zone 3 training primarily produce?',
        },
        stageOptions: {
          1: ['Exercise makes your heart stop working', 'Exercise makes your heart work harder and gets stronger', 'Exercise has no effect on the heart', 'Exercise weakens the heart over time'],
          2: ['Watching TV', 'Stretching only', 'Aerobic exercise like jogging or swimming', 'One very short sprint per week'],
          3: ['145 bpm', '155 bpm', '144.9 bpm', '165 bpm'],
          4: ['The maximum speed an athlete can run', 'The maximum volume of oxygen the body can use per minute during exercise', 'The resting heart rate after sleep', 'The number of breaths per minute at rest'],
          5: [
            'HR: 143–163 bpm; adaptation: increased resting heart rate',
            'HR: 122–143 bpm; adaptation: increased stroke volume and cardiac output',
            'HR: 143–163 bpm; adaptation: increased stroke volume and improved mitochondrial density',
            'HR: 163–184 bpm; adaptation: increased lung capacity only',
          ],
        },
        stageCorrect: { 1: 1, 2: 2, 3: 2, 4: 1, 5: 2 },
        stageFacts: {
          1: 'Exercise increases heart rate — the heart is a muscle, and like all muscles, it gets stronger and more efficient with regular training.',
          2: 'Aerobic exercise (sustained moderate activity like jogging, cycling, or swimming) trains the cardiovascular and respiratory systems to deliver oxygen more efficiently.',
          3: '70% of 207 = 0.70 × 207 = 144.9 ≈ 145 bpm. This is the lower end of the aerobic training zone for a 13-year-old.',
          4: 'VO2 max (maximal oxygen uptake) measures the maximum volume of oxygen the body can extract and use during intense exercise — the key indicator of aerobic fitness.',
          5: 'Zone 3: 70–80% of 204 = 143–163 bpm. Consistent Zone 3 training increases stroke volume (heart pumps more per beat), improves mitochondrial density in Type I muscle fibres, and enhances capillary networks — all raising VO2 max.',
        },
        options: ['Exercise makes your heart work harder and gets stronger', 'Aerobic exercise like jogging or swimming', '144.9 bpm', 'The maximum volume of oxygen the body can use per minute during exercise'],
        correct: 1,
        fact: 'VO2 max measures the maximum oxygen the body uses during exercise. Dingoes have VO2 max values comparable to elite endurance athletes — developed through vast daily distances. Use MHR = 220 − age to calculate your own aerobic training zone.',
      },
    ],
  },

  // ── Lemur ──────────────────────────────────────────────────────────────────
  // PDHPE focus: Social health and belonging — oxytocin, cortisol reduction, social bonding, biopsychosocial model
  lemur: {
    observationPrompt: 'Watch the lemurs huddled together in their troop — this physical closeness is not just warmth, it is the biology of belonging, and it produces measurable changes in the brain and body.',
    writingPromptByStage: {
      1: 'Watch the lemurs cuddle together. How do you feel when you are with people you care about? Write one word.',
      2: 'Lemurs huddle in groups to stay warm and feel safe. Write two ways that feeling connected to a group helps you feel healthy in your body and mind.',
      3: 'Oxytocin is sometimes called the "bonding hormone." Explain what oxytocin is and give two examples of human behaviours (like hugging or laughing with friends) that trigger its release. Why is this important for mental health?',
      4: 'Explain how oxytocin and cortisol interact in the stress response. Describe the biopsychosocial model and explain how social bonding in lemur troops addresses all three dimensions of health (biological, psychological, and social).',
      5: 'A lemur troop of 15 animals huddles, grooms, and communicates constantly. Using the biopsychosocial model and the social determinants of health framework, evaluate how belonging to a social group produces measurable biological changes (cortisol reduction, oxytocin release, immune function), psychological benefits (identity, self-worth, emotional regulation), and social benefits (collective safety, resource sharing). Link this to evidence on the health impacts of social isolation in humans.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: ['oxytocin', 'bonding'],
      4: ['oxytocin', 'cortisol', 'biopsychosocial'],
      5: [],
    },
    questions: [
      {
        q: 'Oxytocin, Cortisol, and Social Health',
        stageVariants: {
          1: 'How do you usually feel after spending time laughing with friends?',
          2: 'Which hormone is sometimes called the "bonding hormone" because it makes us feel connected and safe?',
          3: 'Which of these human activities is MOST likely to trigger an oxytocin release?',
          4: 'Cortisol and oxytocin have an inverse relationship during social bonding. What does "inverse relationship" mean in this context?',
          5: 'The biopsychosocial model views health through three lenses. Which option CORRECTLY maps all three dimensions to lemur troop social behaviour?',
        },
        stageOptions: {
          1: ['Tired and sad', 'Happy, calm, and energised', 'Nervous and anxious', 'Angry and frustrated'],
          2: ['Cortisol', 'Adrenaline', 'Oxytocin', 'Insulin'],
          3: ['Watching TV alone in a dark room', 'Hugging a close friend', 'Running a solo timed sprint', 'Studying silently'],
          4: ['When one increases the other also increases', 'When oxytocin rises, cortisol tends to decrease', 'Both are released together during exercise', 'They have no relationship to each other'],
          5: [
            'Biological: running speed; Psychological: food preferences; Social: territory size',
            'Biological: reduced cortisol and improved immunity; Psychological: sense of identity and belonging; Social: mutual grooming, warmth, and collective defence',
            'Biological: oxytocin blocks sleep; Psychological: fear of predators; Social: food competition',
            'Biological: increased heart rate; Psychological: improved memory; Social: individual foraging',
          ],
        },
        stageCorrect: { 1: 1, 2: 2, 3: 1, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Positive social interactions release oxytocin, which reduces cortisol and creates feelings of calm, happiness, and safety — a direct biological effect of friendship.',
          2: 'Oxytocin — released during physical touch, eye contact, and positive social interaction — is strongly linked to trust, bonding, and reduced anxiety.',
          3: 'Physical affection like hugging triggers the highest oxytocin release. This is why positive social contact produces measurable reductions in heart rate and cortisol.',
          4: 'Inverse relationship means that as oxytocin rises (during bonding), cortisol falls. Social connection directly counteracts the physiological stress response.',
          5: 'The biopsychosocial model maps all three: Biological (lower cortisol, stronger immunity via oxytocin), Psychological (identity, belonging, emotional security), Social (grooming rituals, troop cohesion, collective warmth and protection).',
        },
        options: ['Happy, calm, and energised', 'Oxytocin', 'Hugging a close friend', 'When oxytocin rises, cortisol tends to decrease'],
        correct: 1,
        fact: 'Oxytocin — the bonding hormone — is released during social contact and directly suppresses cortisol. Lemur troop huddles are biology in action: social connection measurably improves physical and mental health outcomes.',
      },
    ],
  },

  // ── Sea Lion ───────────────────────────────────────────────────────────────
  // PDHPE focus: Aquatic fitness and respiratory system — dive reflex, haemoglobin, cardiovascular-respiratory interdependence
  'sea-lion': {
    observationPrompt: 'Watch the sea lion dive and hold its breath underwater — it is demonstrating one of the most remarkable respiratory and cardiovascular adaptations in the animal kingdom.',
    writingPromptByStage: {
      1: 'Watch the sea lion swim and dive. Take a deep breath and hold it. Count how many seconds you can hold it. Write your result.',
      2: 'Sea lions hold their breath for many minutes underwater. Write what happens to your breathing rate after you exercise hard. Why does your body need more oxygen during exercise?',
      3: 'Haemoglobin in red blood cells carries oxygen around the body. Explain how sea lions carry more oxygen in their blood than humans, and why this helps them dive for up to 10 minutes.',
      4: 'The mammalian dive reflex reduces heart rate (bradycardia) and redirects blood to vital organs during submersion. Explain how this cardiovascular-respiratory adaptation allows sea lions to extend dive duration. Include haemoglobin concentration and oxygen storage in your answer.',
      5: 'Sea lions have haemoglobin concentrations approximately twice those of humans and a resting heart rate that drops from ~100 bpm to ~20 bpm during a dive (dive bradycardia). Evaluate the interdependence of the cardiovascular and respiratory systems during a 10-minute dive. In your answer, discuss oxygen loading (haemoglobin saturation), peripheral vasoconstriction, myoglobin in muscles, CO2 tolerance, and what this reveals about the limits of human breath-hold performance (typically 60–90 seconds in untrained individuals).',
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
        q: 'Respiratory System and Dive Physiology',
        stageVariants: {
          1: 'Why does your breathing get faster when you exercise?',
          2: 'What does the respiratory system do for your body?',
          3: 'Which substance in red blood cells carries oxygen to the muscles?',
          4: 'The mammalian dive reflex causes bradycardia during submersion. What is bradycardia?',
          5: 'A sea lion\'s haemoglobin concentration is approximately twice that of a human. Which statement BEST explains why this adaptation extends dive duration?',
        },
        stageOptions: {
          1: ['Because you are bored', 'Because your muscles need more oxygen during exercise', 'Because it is hot outside', 'Because you ate too much'],
          2: ['It breaks down food into nutrients', 'It brings oxygen into the body and removes carbon dioxide', 'It pumps blood around the body', 'It filters waste from the blood'],
          3: ['Plasma', 'White blood cells', 'Haemoglobin', 'Platelets'],
          4: ['An increase in heart rate during exercise', 'A decrease in heart rate during submersion in water', 'An increase in breathing rate', 'A reduction in blood pressure during rest'],
          5: [
            'Higher haemoglobin means more red blood cells that reduce blood viscosity, allowing faster flow to muscles',
            'Higher haemoglobin concentration means each litre of blood carries more oxygen, extending the duration of aerobic cellular respiration before anaerobic pathways are activated',
            'Higher haemoglobin causes faster CO2 removal, allowing longer breath-holds through faster exhalation',
            'Higher haemoglobin stimulates more adrenaline production, suppressing the urge to breathe',
          ],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Exercising muscles use oxygen faster and produce more CO2. The respiratory system increases breathing rate to match this demand.',
          2: 'The respiratory system\'s primary role is gas exchange — bringing oxygen into the bloodstream and removing carbon dioxide produced by cellular metabolism.',
          3: 'Haemoglobin — the iron-containing protein in red blood cells — binds to oxygen in the lungs and transports it to every cell in the body.',
          4: 'Bradycardia means a slowed heart rate. During the dive reflex, heart rate can drop by 50–80%, reducing oxygen consumption by vital organs and extending dive time.',
          5: 'Greater haemoglobin concentration means more oxygen molecules carried per litre of blood. Combined with high myoglobin in muscles and the dive reflex, this allows extended aerobic respiration during a dive without triggering anaerobic pathways.',
        },
        options: ['Because your muscles need more oxygen during exercise', 'It brings oxygen into the body and removes carbon dioxide', 'Haemoglobin', 'A decrease in heart rate during submersion in water'],
        correct: 1,
        fact: 'Sea lions\' dive reflex slows their heart rate by up to 80% and redirects blood to the brain and heart. Combined with haemoglobin concentrations twice those of humans, they can dive for 10+ minutes — a masterclass in cardiovascular-respiratory interdependence.',
      },
    ],
  },

  // ── Asian Water Buffalo ────────────────────────────────────────────────────
  // PDHPE focus: Musculoskeletal health — bone density, muscle hypertrophy, Type I/II fibres, resistance training
  'asian-water-buffalo': {
    observationPrompt: 'Look at the water buffalo\'s massive frame — its bone structure, muscle bulk, and posture reveal how the musculoskeletal system adapts to load-bearing work over a lifetime.',
    writingPromptByStage: {
      1: 'Look at the water buffalo\'s legs. They are very big and strong. Point to your own leg muscles. Write one activity that makes your leg muscles stronger.',
      2: 'Water buffaloes carry heavy loads and plough fields. Write two ways that physical work strengthens your bones and muscles. Why is it important to keep your bones healthy?',
      3: 'Bone density increases with weight-bearing exercise. Explain why this happens and name two activities that help improve bone density. Why is this especially important for young people?',
      4: 'Define bone density and explain how resistance exercise produces bone remodelling (via osteoblast activity). Identify which muscle fibre types (Type I or Type II) are most developed in a working buffalo performing sustained load-bearing, and explain the concept of muscle hypertrophy.',
      5: 'A working water buffalo performs sustained load-bearing activity for 6–8 hours daily over many years. Evaluate the long-term musculoskeletal adaptations this produces — including bone mineral density (BMD) via the piezoelectric effect and osteoblast activation, Type I slow-twitch fibre hypertrophy, joint cartilage loading, and tendon/ligament strengthening. Compare these adaptations to the benefits of progressive resistance training for adolescent bone health and discuss why peak bone mass achieved before age 30 is a key predictor of osteoporosis risk in later life.',
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
        q: 'Bone Density, Muscle Hypertrophy, and Resistance Training',
        stageVariants: {
          1: 'Which activity is best for making your bones stronger?',
          2: 'Why is weight-bearing exercise (like walking or jumping) good for your bones?',
          3: 'Which type of exercise MOST effectively increases bone density?',
          4: 'Resistance exercise triggers osteoblast activity. What do osteoblasts do?',
          5: 'An adolescent who performs progressive resistance training 3× per week over 12 months is most likely to achieve which of the following musculoskeletal adaptations?',
        },
        stageOptions: {
          1: ['Swimming only', 'Jumping and running', 'Sitting at a desk', 'Eating only soft foods'],
          2: ['It makes bones lighter', 'It stresses bones, which makes them grow stronger and denser', 'It has no effect on bones', 'It makes bones softer and more flexible'],
          3: ['Swimming laps in a pool', 'Watching sport on TV', 'Progressive resistance training and weight-bearing activity', 'Yoga only (no load)'],
          4: ['They break down old bone tissue', 'They build new bone tissue, increasing bone mineral density', 'They produce red blood cells', 'They contract muscle fibres during exercise'],
          5: [
            'Decreased bone mineral density, reduced muscle mass, and increased injury risk',
            'Increased bone mineral density, muscle hypertrophy (Type I and Type II), improved tendon strength, and better joint stability',
            'Increased bone density only in upper limbs, with no effect on lower limb musculature',
            'Rapid increase in height, with no change in muscle fibre type composition',
          ],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Weight-bearing activities like running and jumping place stress on bones, stimulating osteoblasts to build new bone tissue — making bones denser and stronger.',
          2: 'Mechanical stress from weight-bearing exercise stimulates osteoblast activity (bone-building cells), which deposits new bone mineral and increases bone density over time.',
          3: 'Progressive resistance training and weight-bearing activity (running, jumping, gymnastics) produce the greatest improvements in bone mineral density — especially during adolescence when bone is most responsive.',
          4: 'Osteoblasts are bone-building cells that deposit calcium and phosphate minerals into the bone matrix, increasing bone mineral density in response to mechanical loading.',
          5: 'Progressive resistance training increases BMD, stimulates Type I and Type II muscle fibre hypertrophy, strengthens tendons and ligaments, and improves joint stability — making adolescence the ideal window for building musculoskeletal health foundations.',
        },
        options: ['Jumping and running', 'It stresses bones, which makes them grow stronger and denser', 'Progressive resistance training and weight-bearing activity', 'They build new bone tissue, increasing bone mineral density'],
        correct: 1,
        fact: 'The water buffalo\'s massive frame is the result of a lifetime of load-bearing work. Osteoblasts build new bone in response to mechanical stress — which is why weight-bearing exercise during adolescence is the single most effective way to build peak bone mass and prevent osteoporosis later in life.',
      },
    ],
  },

  // ── Blue Mountains Bushwalk ────────────────────────────────────────────────
  // PDHPE focus: Aerobic exercise response and nature-based mental health
  // 3 questions: Q1 resting HR, Q2 aerobic exercise type, Q3 nature and cortisol
  'blue-mountains-bushwalk': {
    observationPrompt: 'Breathe in the bush air, listen to the sounds around you, and notice how your body feels walking through this natural environment — then consider what science says about nature\'s effect on heart rate, stress hormones, and mental wellbeing.',
    writingPromptByStage: {
      1: 'Write how you feel in your body and mind right now, walking through the bush. Use two feeling words.',
      2: 'After this bushwalk, write whether your heart beats faster or slower than when you sit still. Why do you think that is? Write one other way being outdoors helps your health.',
      3: 'Calculate your target aerobic heart rate for this walk using: Target HR = 60–80% of (220 − your age). Is a bushwalk aerobic or anaerobic exercise? Explain how you know.',
      4: 'Cortisol is a stress hormone. Explain what cortisol does in the body and describe two mechanisms by which spending time in natural environments (like this bushwalk) reduces cortisol levels. Include reference to the HPA axis and autonomic nervous system.',
      5: 'Evaluate the evidence for nature-based physical activity as a strategy for improving both physiological and psychological wellbeing. In your answer, refer to aerobic exercise adaptation (heart rate zones, VO2 max, cardiac output), cortisol suppression via parasympathetic activation, the attention restoration theory (ART), and the role of green exercise in addressing the social determinants of mental health. Suggest how schools could use evidence-based outdoor physical activity programmes to improve student wellbeing outcomes.',
    },
    expectedAnswers: {
      1: [],
      2: [],
      3: [],
      4: ['cortisol', 'HPA axis', 'parasympathetic'],
      5: [],
    },
    questions: [
      // questions[0] — Q1: Resting heart rate for teenagers
      {
        q: 'What is a normal resting heart rate for a healthy teenager?',
        stageVariants: {
          1: 'When you sit still and rest, how many times does your heart beat each minute?',
          2: 'What is a normal resting heart rate for a healthy person your age?',
          3: 'What is the typical resting heart rate range for a healthy teenager?',
          4: 'A resting heart rate of 60–80 bpm in a teenager indicates what about their cardiovascular fitness?',
          5: 'A cross-country runner has a resting heart rate of 48 bpm. Compared to the typical teenage resting heart rate of 60–80 bpm, which cardiovascular adaptation BEST explains this lower resting heart rate?',
        },
        stageOptions: {
          1: ['About 5 times', 'About 20 times', 'About 60–80 times', 'About 200 times'],
          2: ['10–20 bpm', '40–50 bpm', '60–80 bpm', '120–140 bpm'],
          3: ['20–40 bpm', '40–55 bpm', '60–80 bpm', '100–120 bpm'],
          4: ['The heart is beating too fast — likely under stress', 'Normal cardiovascular function — the heart is efficient and healthy', 'The heart is working too hard even at rest', 'The heart is about to stop'],
          5: [
            'Smaller heart chambers requiring more beats to move the same volume of blood',
            'Increased stroke volume due to cardiac hypertrophy — the heart pumps more blood per beat, needing fewer beats per minute',
            'Lower haemoglobin concentration reducing oxygen delivery per beat',
            'Increased resting cortisol suppressing heart rate artificially',
          ],
        },
        stageCorrect: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: 'A healthy resting heart rate is about 60–80 beats per minute. Your heart is working even when you are still!',
          2: 'A normal resting heart rate for a healthy teenager is 60–80 bpm. Athletes may have lower resting heart rates due to a stronger, more efficient heart.',
          3: '60–80 bpm is the normal resting heart rate range for teenagers. Well-trained athletes can have resting heart rates as low as 40–50 bpm.',
          4: 'A resting heart rate of 60–80 bpm indicates a healthy, normally functioning cardiovascular system — the heart is efficiently pumping blood without excessive effort.',
          5: 'Endurance training causes cardiac hypertrophy — the left ventricle wall thickens, increasing stroke volume. A larger stroke volume means the heart pumps more blood per beat, achieving the same cardiac output at a lower heart rate.',
        },
        options: ['About 60–80 times', '60–80 bpm', '60–80 bpm', 'Normal cardiovascular function — the heart is efficient and healthy'],
        correct: 2,
        fact: 'A normal resting heart rate for teenagers is 60–80 bpm. Regular aerobic exercise like bushwalking gradually lowers resting heart rate by increasing stroke volume — a sign of a healthier, more efficient heart.',
      },
      // questions[1] — Q2: Aerobic exercise type (brisk walking)
      {
        q: 'What type of exercise is brisk walking — aerobic or anaerobic?',
        stageVariants: {
          1: 'When you walk fast and feel your heart beating faster, what type of exercise is this?',
          2: 'Brisk walking raises your heart rate and makes you breathe faster. What type of exercise is it?',
          3: 'Brisk walking uses oxygen for energy over a long time. What does the word "aerobic" mean?',
          4: 'Which energy system predominantly powers a 45-minute brisk bushwalk?',
          5: 'A group of students complete a 6-kilometre bushwalk at moderate intensity (65% MHR) for 75 minutes. Which statement BEST describes the primary energy system and the physiological adaptations that would result from repeating this activity 3× per week for 8 weeks?',
        },
        stageOptions: {
          1: ['Anaerobic exercise', 'Aerobic exercise', 'No exercise at all', 'Stretching only'],
          2: ['Anaerobic — short and explosive', 'Aerobic — sustained and uses oxygen', 'Neither — walking is not real exercise', 'Both equally'],
          3: ['Without oxygen', 'With oxygen — aerobic exercise uses oxygen for sustained energy', 'Only involving arms', 'Using lactic acid as the main fuel'],
          4: ['ATP-PC (phosphocreatine) system', 'Lactic acid anaerobic system', 'Aerobic oxidative system', 'ATP-PC and lactic acid in equal amounts'],
          5: [
            'ATP-PC system; adaptations include increased phosphocreatine stores and fast-twitch muscle hypertrophy',
            'Aerobic oxidative system; adaptations include increased stroke volume, improved VO2 max, greater mitochondrial density in Type I fibres, and reduced resting heart rate',
            'Lactic acid system; adaptations include increased lactate threshold and Type II fibre hypertrophy',
            'Aerobic system only in the legs; no cardiovascular adaptation occurs from low-intensity walking',
          ],
        },
        stageCorrect: { 1: 1, 2: 1, 3: 1, 4: 2, 5: 1 },
        stageFacts: {
          1: 'Aerobic exercise uses oxygen and can be sustained for a longer time. Walking, jogging, and swimming are all aerobic activities.',
          2: 'Brisk walking is aerobic exercise — it raises heart rate into the aerobic zone and uses oxygen to produce energy for sustained activity.',
          3: '"Aerobic" means "with oxygen." The aerobic energy system uses oxygen to produce ATP continuously, making it perfect for sustained activities like walking.',
          4: 'A 45-minute walk at moderate intensity is powered almost entirely by the aerobic oxidative system — using oxygen to convert carbohydrates and fats into ATP continuously.',
          5: 'The aerobic oxidative system powers this sustained moderate-intensity activity. Regular aerobic training produces increased stroke volume, improved VO2 max, greater mitochondrial density in slow-twitch (Type I) fibres, and reduced resting heart rate — all measurable cardiovascular adaptations.',
        },
        options: ['Aerobic exercise', 'Aerobic — sustained and uses oxygen', 'With oxygen — aerobic exercise uses oxygen for sustained energy', 'Aerobic oxidative system'],
        correct: 1,
        fact: 'Brisk walking is aerobic exercise — it uses oxygen to sustain energy production. A 45-minute bushwalk trains the aerobic oxidative system, improving cardiac output, VO2 max, and mitochondrial efficiency over time.',
      },
      // questions[2] — Q3: Nature and stress hormone cortisol
      {
        q: 'Which stress hormone DECREASES when you spend time in nature?',
        stageVariants: {
          1: 'Which feeling does spending time in a forest or bush usually give you?',
          2: 'Scientists have found that time in nature reduces stress. Which hormone causes the "stressed" feeling?',
          3: 'Which hormone produced by the body DECREASES when you spend quiet time in a natural environment like a bush walk?',
          4: 'Research shows cortisol levels drop after 20 minutes in a natural green environment. Which nervous system branch is activated by nature, causing this cortisol reduction?',
          5: 'The Attention Restoration Theory (ART) proposes that natural environments restore directed attention capacity. Which combination of effects BEST explains the simultaneous reduction in cortisol and improvement in mood during green exercise like a bushwalk?',
        },
        stageOptions: {
          1: ['More stressed and scared', 'Calmer and happier', 'Angry and irritated', 'No different from being indoors'],
          2: ['Oxytocin', 'Melatonin', 'Cortisol', 'Insulin'],
          3: ['Oxytocin — the bonding hormone increases', 'Adrenaline — it spikes during outdoor activity', 'Cortisol — the stress hormone decreases', 'Growth hormone — it stops during walking'],
          4: ['Sympathetic nervous system (fight-or-flight)', 'Parasympathetic nervous system (rest-and-digest)', 'Somatic nervous system', 'Central nervous system only'],
          5: [
            'Sympathetic activation raises cortisol while exercise releases endorphins, creating a net neutral effect on mood',
            'Parasympathetic activation suppresses HPA axis cortisol output; aerobic exercise releases endorphins; fractal visual patterns in nature restore directed attention, reducing cognitive fatigue and improving mood simultaneously',
            'Cortisol rises during aerobic exercise but nature sounds suppress adrenaline, leaving cortisol unchanged overall',
            'The ART effect only applies indoors; green exercise works purely through aerobic cardiovascular benefits',
          ],
        },
        stageCorrect: { 1: 1, 2: 2, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Being in nature — especially bushland or forests — reliably reduces feelings of stress and increases feelings of calm and happiness. This is a documented physiological effect.',
          2: 'Cortisol is the primary stress hormone, released by the adrenal glands when the HPA axis is activated. Time in nature measurably reduces cortisol concentrations.',
          3: 'Cortisol — the body\'s main stress hormone — decreases during and after time spent in natural environments. Studies show cortisol drops of 12–21% after 20 minutes in nature compared to urban settings.',
          4: 'Natural environments activate the parasympathetic (rest-and-digest) nervous system, which inhibits the HPA axis and reduces cortisol production — the opposite of the stress-driven sympathetic (fight-or-flight) response.',
          5: 'Green exercise combines aerobic endorphin release, parasympathetic HPA suppression (reducing cortisol), and the attentional restoration effect — where natural fractal patterns allow the prefrontal cortex to recover from cognitive fatigue, producing simultaneous physiological and psychological wellbeing benefits.',
        },
        options: ['Calmer and happier', 'Cortisol', 'Cortisol — the stress hormone decreases', 'Parasympathetic nervous system (rest-and-digest)'],
        correct: 2,
        fact: 'Cortisol — the stress hormone — drops measurably within 20 minutes of being in a natural environment. Green exercise like this bushwalk activates the parasympathetic nervous system, suppresses HPA axis output, and releases endorphins — a triple benefit for mental and physical health.',
      },
    ],
  },

  // ── Concert Lawn ───────────────────────────────────────────────────────────
  // PDHPE focus: Physical activity, heart rate response, enjoyment and intrinsic motivation for lifelong physical activity
  'concert-lawn': {
    observationPrompt: 'Stand on the Concert Lawn and take a moment to notice how your body feels in the open space — then think about how enjoyment of physical activity relates to lifelong health habits.',
    writingPromptByStage: {
      1: 'Run across the Concert Lawn and back. Write how your body felt before and after. Was your heart beating faster after running?',
      2: 'After running or playing on the lawn, write how your heart rate changed. Write one activity you enjoy and how it makes you feel physically and emotionally.',
      3: 'Intrinsic motivation means doing something because you enjoy it, not for a reward. Write why you think enjoyment is important for making physical activity a lifelong habit. Give two examples of activities you personally find enjoyable and explain why.',
      4: 'Explain the relationship between enjoyment, intrinsic motivation, and long-term physical activity participation. Describe how heart rate responds to moderate physical activity on the Concert Lawn and what cardiovascular benefits result from regular participation in enjoyable activities.',
      5: 'Evaluate the role of intrinsic motivation and positive affect in sustaining lifelong physical activity habits. Use the Self-Determination Theory (SDT) to explain how autonomy, competence, and relatedness during recreational activities (like those on the Concert Lawn) lead to internalised motivation. Connect this to cardiovascular health outcomes (resting heart rate, VO2 max, cardiac output) and the social determinants of health framework. Suggest evidence-based strategies for school PE programmes that foster intrinsic motivation.',
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
        q: 'Intrinsic Motivation and Heart Rate Response to Physical Activity',
        stageVariants: {
          1: 'After running and playing on the Concert Lawn, which of these describes how your body feels?',
          2: 'Which is the BEST reason to do physical activity regularly throughout your life?',
          3: 'What does "intrinsic motivation" mean in relation to physical activity?',
          4: 'Which statement BEST explains why enjoyment of physical activity predicts long-term participation in exercise?',
          5: 'Self-Determination Theory (SDT) identifies three basic psychological needs that drive intrinsic motivation. Which option correctly maps all three needs to a recreational game on the Concert Lawn?',
        },
        stageOptions: {
          1: ['Exactly the same as before running', 'Heart beating faster, breathing harder, feeling warmer', 'Heart beating more slowly, feeling cold', 'No change — only intense sport changes the body'],
          2: ['To win competitions and trophies', 'Because a teacher makes you', 'Because it makes your body and mind healthier and feels good', 'To look a certain way'],
          3: ['Being forced to exercise by someone else', 'Exercising only when there is a prize', 'Being motivated to exercise because you genuinely enjoy it', 'Avoiding exercise altogether'],
          4: ['People avoid activities that make them feel good', 'When activity is enjoyable, it is more likely to become a regular habit, leading to sustained cardiovascular and mental health benefits', 'Enjoyment has no effect on long-term exercise participation', 'Physical rewards are more effective than enjoyment for building habits'],
          5: [
            'Autonomy: being told what sport to play; Competence: always losing; Relatedness: playing alone',
            'Autonomy: choosing which game to play; Competence: developing and demonstrating skills; Relatedness: playing with and belonging to a group',
            'Autonomy: following a strict exercise programme; Competence: being fastest in the group; Relatedness: competing against others',
            'Autonomy: winning a prize; Competence: being told you are the best; Relatedness: playing against strangers',
          ],
        },
        stageCorrect: { 1: 1, 2: 2, 3: 2, 4: 1, 5: 1 },
        stageFacts: {
          1: 'Physical activity raises heart rate, increases breathing rate, and warms the body — signs that the cardiovascular and respiratory systems are working harder to supply muscles with oxygen.',
          2: 'Regular physical activity improves cardiovascular health, mental wellbeing, bone density, sleep quality, and mood — benefits that last a lifetime when activity becomes a personal habit.',
          3: 'Intrinsic motivation means being driven to do something because it is personally rewarding and enjoyable — the strongest predictor of sustained, lifelong physical activity.',
          4: 'Enjoyment creates positive emotional associations with exercise. When activity feels good, people are more likely to repeat it — gradually building a habit that delivers long-term cardiovascular, musculoskeletal, and mental health benefits.',
          5: 'SDT\'s three needs: Autonomy (freely choosing the activity), Competence (developing and displaying skills), and Relatedness (feeling connected to others in the group). All three are met by freely chosen, skill-based games played with friends — the optimal conditions for intrinsic motivation.',
        },
        options: ['Heart beating faster, breathing harder, feeling warmer', 'Because it makes your body and mind healthier and feels good', 'Being motivated to exercise because you genuinely enjoy it', 'When activity is enjoyable, it is more likely to become a regular habit, leading to sustained cardiovascular and mental health benefits'],
        correct: 1,
        fact: 'Enjoyment is the strongest predictor of lifelong physical activity. Self-Determination Theory shows that when autonomy, competence, and social connection are met — like in a free game on the Concert Lawn — intrinsic motivation develops, and cardiovascular health benefits follow naturally.',
      },
    ],
  },

};

export default PDHPE_ANIMALS;
