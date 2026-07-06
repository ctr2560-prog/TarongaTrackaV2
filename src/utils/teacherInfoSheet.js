const BRAND = {
  forest:     '#071E14',
  deep:       '#0A2F1F',
  mid:        '#1A5238',
  eucalyptus: '#2E7D55',
  sage:       '#4A7C61',
  mist:       '#A8C4B2',
  foam:       '#E8F2EC',
  canvas:     '#F7F4EF',
  parchment:  '#FAF8F4',
  ink:        '#1A1A17',
  charcoal:   '#3D3D38',
  slate:      '#6B6B62',
  mathsBlue:  '#0369a1',
  mathsBg:    '#EFF6FF',
  mathsBorder:'#BFDBFE',
  pdhpePurple:'#7C3AED',
  pdhpeBg:    '#F5F3FF',
  pdhpeBorder:'#DDD6FE',
  englishAmber:'#B45309',
  englishBg:   '#FFFBEB',
  englishBorder:'#FDE68A',
};

const EXHIBITS = {
  science: [
    {
      name: 'Chimpanzee',
      obs:  'Group dynamics observation and social behaviour description',
      focusByStage: {
        1: 'Animal behaviour and basic needs; recognising similarities between animals and people',
        2: 'Social grouping in animals; comparing chimpanzee and human behaviours',
        3: 'Primate social hierarchy, cooperation and learned behaviours',
        4: 'Primate group dynamics, behavioural ecology and tool-use in apes',
        5: 'Evolutionary basis of primate behaviour; cognition, sociality and primate culture',
      },
      tagsByStage: {
        1: ['Living World', 'Animal Behaviour', 'Observation'],
        2: ['Living World', 'Social Behaviour', 'Habitats'],
        3: ['Adaptations', 'Social Behaviour', 'Classification'],
        4: ['Working Scientifically', 'Classification', 'Behavioural Ecology'],
        5: ['Working Scientifically', 'Evolution', 'Behavioural Ecology'],
      },
    },
    {
      name: 'Western Lowland Gorilla',
      obs:  'Comparing gorilla and human features; diet and habitat quiz',
      focusByStage: {
        1: 'Living things and their basic needs; recognising animal features',
        2: 'Animal diet and habitat; comparing primates to humans',
        3: 'Primate adaptations and conservation status',
        4: 'Endangered species biology, habitat requirements and dietary ecology',
        5: 'Conservation genetics, population ecology and human–gorilla evolutionary relationships',
      },
      tagsByStage: {
        1: ['Living World', 'Needs of Living Things', 'Animal Features'],
        2: ['Habitats', 'Diet', 'Classification'],
        3: ['Adaptations', 'Conservation', 'Classification'],
        4: ['Working Scientifically', 'Endangered Species', 'Ecosystems'],
        5: ['Evolution', 'Conservation Genetics', 'Population Ecology'],
      },
    },
    {
      name: 'African Lion',
      obs:  'Predator behaviour and social interactions; micro-investigation quiz',
      focusByStage: {
        1: 'Animal behaviour; predators and prey; basic features of big cats',
        2: 'Social animals and food chains; predator features and hunting roles',
        3: 'Predator–prey relationships; pride social structure and territorial behaviour',
        4: 'Social predator ecology, sensory adaptations and prey–predator dynamics',
        5: 'Apex predator ecology, trophic cascades and savanna ecosystem function',
      },
      tagsByStage: {
        1: ['Living World', 'Food Chains', 'Animal Behaviour'],
        2: ['Food Chains', 'Predators & Prey', 'Social Behaviour'],
        3: ['Predator–Prey', 'Ecosystems', 'Adaptations'],
        4: ['Working Scientifically', 'Ecosystems', 'Adaptations'],
        5: ['Trophic Cascades', 'Ecosystem Dynamics', 'Apex Predators'],
      },
    },
    {
      name: 'Giraffe',
      obs:  'Height as structural adaptation; how body features aid survival',
      focusByStage: {
        1: 'Animal features; how body size helps animals find food and survive',
        2: 'Physical adaptations for feeding; comparing body features across animals',
        3: 'Structural adaptations; how height aids feeding and reduces heat stress',
        4: 'Physiological adaptations - cardiovascular system, thermoregulation and feeding ecology',
        5: 'Evolution of extreme morphology; natural selection evidence and physiological systems',
      },
      tagsByStage: {
        1: ['Living World', 'Animal Features', 'Needs of Living Things'],
        2: ['Adaptations', 'Habitats', 'Animal Features'],
        3: ['Structural Adaptations', 'Thermoregulation', 'Ecosystems'],
        4: ['Adaptations', 'Living Systems', 'Physiological Systems'],
        5: ['Evolution', 'Natural Selection', 'Physiological Systems'],
      },
    },
    {
      name: 'Sumatran Tiger',
      obs:  'Movement observation; population data and conservation threats quiz',
      focusByStage: {
        1: 'Animal movement and features; recognising big cats',
        2: 'Animal camouflage and adaptations; awareness of endangered animals',
        3: 'Camouflage as adaptation; critically endangered species and conservation strategies',
        4: 'Conservation biology; habitat fragmentation and apex predator ecology',
        5: 'Conservation genetics; metapopulation theory and human–wildlife conflict',
      },
      tagsByStage: {
        1: ['Living World', 'Animal Features', 'Animal Behaviour'],
        2: ['Adaptations', 'Camouflage', 'Endangered Species'],
        3: ['Adaptations', 'Conservation', 'Endangered Species'],
        4: ['Conservation Biology', 'Endangered Species', 'Ecosystem Dynamics'],
        5: ['Conservation Genetics', 'Evolution', 'Ecosystem Dynamics'],
      },
    },
    {
      name: 'Koala',
      obs:  'Resting posture; extinction timeline, grip adaptation and sleep quiz',
      focusByStage: {
        1: 'Australian animals and their basic needs; body features for climbing',
        2: 'Animal adaptations for survival; conservation awareness and threats to native species',
        3: 'Specialised diet and marsupial adaptations; threatened species and conservation biology',
        4: 'Metabolic adaptation to plant toxins; marsupial biology and threatened species ecology',
        5: 'Biotransformation of eucalyptus secondary metabolites; marsupial phylogeny; population decline modelling',
      },
      tagsByStage: {
        1: ['Living World', 'Australian Animals', 'Needs of Living Things'],
        2: ['Adaptations', 'Threatened Species', 'Australian Animals'],
        3: ['Specialised Adaptations', 'Threatened Species', 'Conservation'],
        4: ['Metabolic Adaptations', 'Marsupial Biology', 'Conservation Biology'],
        5: ['Evolution', 'Marsupial Phylogeny', 'Population Ecology'],
      },
    },
    {
      name: 'Dingo',
      obs:  'Appearance-based adaptation; ecological role in Australian ecosystems',
      focusByStage: {
        1: 'Animal features that aid survival; native Australian animals and their habitats',
        2: 'Native animal adaptations for environment; food chains and predator roles',
        3: 'Apex predator adaptations; ecological role, food webs and ecosystem balance',
        4: 'Native predator ecology; trophic regulation and ecosystem function',
        5: 'Trophic cascades; mesopredator release; dingo\'s role in ecosystem restoration',
      },
      tagsByStage: {
        1: ['Living World', 'Australian Animals', 'Habitats'],
        2: ['Food Chains', 'Adaptations', 'Australian Animals'],
        3: ['Apex Predators', 'Food Webs', 'Ecosystems'],
        4: ['Trophic Regulation', 'Ecosystem Dynamics', 'Native Species'],
        5: ['Trophic Cascades', 'Ecosystem Restoration', 'Conservation Biology'],
      },
    },
    {
      name: 'Ring-tailed Lemur',
      obs:  'Enclosure use and space; behaviour tally data collection',
      focusByStage: {
        1: 'Animal movement and senses; how animals use their environment',
        2: 'Animal behaviour and habitat use; observing and recording data',
        3: 'Behavioural ecology; space use, territory and animal communication',
        4: 'Habitat use patterns; scent communication, social hierarchy and territorial behaviour',
        5: 'Island biogeography; behavioural ecology and olfactory communication systems',
      },
      tagsByStage: {
        1: ['Living World', 'Animal Behaviour', 'Animal Senses'],
        2: ['Animal Behaviour', 'Habitats', 'Observation Skills'],
        3: ['Behavioural Ecology', 'Communication', 'Territoriality'],
        4: ['Working Scientifically', 'Behavioural Ecology', 'Social Structures'],
        5: ['Island Biogeography', 'Behavioural Ecology', 'Communication Systems'],
      },
    },
    {
      name: 'Sea Lion',
      obs:  'Human impact on marine life; plastic pollution pathway quiz',
      focusByStage: {
        1: 'Sea animals and their needs; how people can help or hurt animals',
        2: 'Human impact on animals and habitats; plastic pollution awareness',
        3: 'Marine habitat threats; plastic pollution pathways and conservation responses',
        4: 'Marine pollution ecology; conservation biology and human impact on marine mammals',
        5: 'Marine mammal ecology; ecotoxicology; evidence-based conservation strategies',
      },
      tagsByStage: {
        1: ['Living World', 'Human Impact', 'Habitats'],
        2: ['Human Impact', 'Marine Habitats', 'Pollution'],
        3: ['Conservation', 'Human Impact', 'Marine Ecosystems'],
        4: ['Working Scientifically', 'Conservation Biology', 'Marine Pollution'],
        5: ['Ecotoxicology', 'Marine Ecology', 'Conservation Strategies'],
      },
    },
    {
      name: 'Asian Water Buffalo',
      obs:  'Interspecies relationships; structural adaptation for soft-ground habitat',
      focusByStage: {
        1: 'Animal features that help them survive; relationships between animals',
        2: 'Animal adaptations for wet environments; interspecies relationships',
        3: 'Structural adaptations; ecological relationships and roles of large herbivores',
        4: 'Ecosystem engineering; herd ecology and domestication history',
        5: 'Megafauna ecology; domestication genetics and co-evolutionary relationships',
      },
      tagsByStage: {
        1: ['Living World', 'Animal Features', 'Habitats'],
        2: ['Adaptations', 'Wetland Ecosystems', 'Interspecies Relationships'],
        3: ['Structural Adaptations', 'Ecological Relationships', 'Ecosystems'],
        4: ['Ecosystem Engineering', 'Herd Ecology', 'Domestication'],
        5: ['Megafauna Ecology', 'Co-evolution', 'Conservation Genetics'],
      },
    },
    {
      name: 'Blue Mountains Bushwalk',
      obs:  'Soundscape observation; habitat organisms and biodiversity quiz',
      focusByStage: {
        1: 'Nature sounds and living things; recognising animals in their environment',
        2: 'Local ecosystems; biodiversity and identifying habitat features',
        3: 'Ecosystem observation and fieldwork skills; biodiversity and habitat relationships',
        4: 'Ecological field observation; biodiversity assessment and habitat interactions',
        5: 'Ecological field methods; abiotic–biotic factor analysis; biodiversity indices',
      },
      tagsByStage: {
        1: ['Living World', 'Animal Habitats', 'Observation'],
        2: ['Local Ecosystems', 'Biodiversity', 'Habitats'],
        3: ['Ecosystems', 'Biodiversity', 'Fieldwork Skills'],
        4: ['Working Scientifically', 'Biodiversity', 'Ecosystem Interactions'],
        5: ['Ecological Field Methods', 'Abiotic & Biotic Factors', 'Biodiversity Indices'],
      },
    },
  ],
  maths: [
    {
      name: 'Chimpanzee',
      obs:  'Recording three behaviours as percentages that sum to 100%',
      focusByStage: {
        1: 'Counting and categorising behaviours; recognising and recording amounts',
        2: 'Reading and comparing percentage values; checking totals sum to 100',
        3: 'Interpreting percentage data; proportional reasoning and pie chart analysis',
        4: 'Statistical analysis of behavioural data; percentages and data representation',
        5: 'Advanced data interpretation; statistical inference from behavioural distributions',
      },
      tagsByStage: {
        1: ['Counting', 'Number', 'Statistics'],
        2: ['Percentages', 'Statistics', 'Number'],
        3: ['Statistics', 'Percentages', 'Data Interpretation'],
        4: ['Statistics', 'Data Representation', 'Percentages'],
        5: ['Statistical Analysis', 'Statistical Inference', 'Data Interpretation'],
      },
    },
    {
      name: 'Western Lowland Gorilla',
      obs:  'Estimating mass ratio - student vs. silverback (approx. 200 kg)',
      focusByStage: {
        1: 'Comparing sizes using numbers; heavier and lighter in context',
        2: 'Estimating and comparing mass; multiplication and comparison problems',
        3: 'Ratio and proportion with large values; simplifying ratios',
        4: 'Ratio in simplest form; proportional reasoning with real-world mass data; diet calculations',
        5: 'Ratios, rates and proportional analysis of nutritional and conservation data',
      },
      tagsByStage: {
        1: ['Measurement', 'Number', 'Comparison'],
        2: ['Multiplication & Division', 'Measurement', 'Comparison'],
        3: ['Ratio', 'Proportion', 'Measurement'],
        4: ['Ratio & Proportion', 'Measurement', 'Data Analysis'],
        5: ['Ratio & Rates', 'Proportional Reasoning', 'Statistics'],
      },
    },
    {
      name: 'African Lion',
      obs:  'Counting lions; estimating enclosure area vs. real territory (260 km²)',
      focusByStage: {
        1: 'Counting objects; comparing quantities using more and fewer',
        2: 'Estimating and calculating area; comparing measurements in context',
        3: 'Area and scale; comparing estimated enclosure to real territory using multiplication',
        4: 'Area, scale maps and order-of-magnitude comparison; ratio applied to territory size',
        5: 'Scale modelling, geometric area calculations and statistical comparison of habitat data',
      },
      tagsByStage: {
        1: ['Counting', 'Number', 'Measurement'],
        2: ['Area', 'Measurement', 'Multiplication & Division'],
        3: ['Area', 'Scale', 'Multiplication & Division'],
        4: ['Area', 'Ratio', 'Scale Maps'],
        5: ['Measurement', 'Scale', 'Statistical Comparison'],
      },
    },
    {
      name: 'Giraffe',
      obs:  'Estimating giraffe height; ratio of student height to approx. 550 cm',
      focusByStage: {
        1: 'Comparing heights using informal units; taller and shorter in context',
        2: 'Estimating height using body length; length comparison and measurement',
        3: 'Ratio of heights; scale and proportion applied to real measurement problems',
        4: 'Ratio, proportion and scale; measurement in standard units and height ratio calculation',
        5: 'Proportional reasoning; measurement accuracy; ratio applied to biometric data analysis',
      },
      tagsByStage: {
        1: ['Measurement', 'Length', 'Comparison'],
        2: ['Length', 'Estimation', 'Measurement'],
        3: ['Ratio', 'Scale', 'Measurement'],
        4: ['Ratio & Proportion', 'Measurement', 'Scale'],
        5: ['Proportional Reasoning', 'Measurement', 'Ratio'],
      },
    },
    {
      name: 'Sumatran Tiger',
      obs:  'Open observation - patterns, shapes and numbers in the habitat; length quiz using tiger body measurements',
      focusByStage: {
        1: 'Spotting numbers, patterns and shapes; identifying a realistic measurement for a tiger\'s length',
        2: 'Division in context; how many smaller animals equal one tiger\'s length',
        3: 'Fractions applied to measurement; calculating body length when the tail is 1/4 of total length',
        4: 'Multi-step measurement; adding growth increments for body and tail over time',
        5: 'Algebraic expressions for growth; substituting into a linear model L = 1.0 + 0.12n',
      },
      tagsByStage: {
        1: ['Measurement', 'Number', 'Patterns'],
        2: ['Division', 'Measurement', 'Comparison'],
        3: ['Fractions', 'Measurement', 'Multi-step Problems'],
        4: ['Measurement', 'Multi-step Problems', 'Addition'],
        5: ['Algebra', 'Linear Models', 'Measurement'],
      },
    },
    {
      name: 'Koala',
      obs:  'Conservation financial maths - $15,000 per koala per year at Taronga',
      focusByStage: {
        1: 'Counting and time; recording how long the koala stays still vs. moving',
        2: 'Division in context; calculating how many days a food supply lasts',
        3: 'Fractions of a dollar amount; simplifying $4,500/$15,000 = 3/10; percentage of koalas lost in bushfires',
        4: 'Arithmetic sequences; multi-year budget planning with a constant annual increase',
        5: 'Percentage increase; predicting future costs using a flat annual dollar rise',
      },
      tagsByStage: {
        1: ['Time', 'Number', 'Counting'],
        2: ['Multiplication & Division', 'Number', 'Rates'],
        3: ['Fractions', 'Percentages', 'Multi-step Problems'],
        4: ['Financial Mathematics', 'Arithmetic Sequences', 'Multi-step Problems'],
        5: ['Financial Mathematics', 'Percentage Change', 'Prediction'],
      },
    },
    {
      name: 'Dingo',
      obs:  'Counting dingoes; calculating territory needed at 10 km² per animal',
      focusByStage: {
        1: 'Counting; simple multiplication in context (kangaroos eaten per week)',
        2: 'Division to find how many animals fit in a territory; multiplication for total area needed',
        3: 'Range and mean of territory sizes; multi-step calculations from real data',
        4: 'Rates and mean; calculating mean distance per dingo per day; food chain energy transfer (÷ 10 per trophic level)',
        5: 'Speed-to-mass ratio; comparing rates across species; evaluating efficiency using calculations',
      },
      tagsByStage: {
        1: ['Counting', 'Multiplication', 'Number'],
        2: ['Multiplication & Division', 'Area', 'Number'],
        3: ['Statistics', 'Multi-step Problems', 'Measurement'],
        4: ['Rates', 'Mean', 'Fractions & Division'],
        5: ['Ratio & Rates', 'Mathematical Modelling', 'Comparison'],
      },
    },
    {
      name: 'Ring-tailed Lemur',
      obs:  'Counting tail rings; calculating ratio of black to white rings',
      focusByStage: {
        1: 'Counting two groups; recording totals and comparing',
        2: 'Ratio concepts introduced; counting and recording with tallies',
        3: 'Ratios in simplest form; interpreting tally data statistically',
        4: 'Ratio, proportion and data analysis; reading and interpreting frequency tables',
        5: 'Statistical analysis of ratio data; measures of centre and spread from behavioural tallies',
      },
      tagsByStage: {
        1: ['Counting', 'Statistics', 'Number'],
        2: ['Ratio', 'Statistics', 'Counting'],
        3: ['Ratio', 'Statistics', 'Data Analysis'],
        4: ['Ratio & Proportion', 'Statistics', 'Data Analysis'],
        5: ['Statistics', 'Measures of Spread', 'Ratio'],
      },
    },
    {
      name: 'Sea Lion',
      obs:  'Size comparison to a person; fish supply cost at $8 per kg',
      focusByStage: {
        1: 'Multiplication in context; calculating total fish eaten over multiple days',
        2: 'Subtraction of large numbers; comparing male and female mass (300 kg vs. 85 kg)',
        3: 'Rates and multiplication; weekly feeding cost at $8/kg × 8 kg/day × 7 days = $448',
        4: 'Simple interest; P × r × t applied to a conservation fund ($5,000 at 4% for 3 years)',
        5: 'Sexual dimorphism ratios to 2 decimal places; comparing mass ratios across three species',
      },
      tagsByStage: {
        1: ['Multiplication', 'Rates', 'Number'],
        2: ['Subtraction', 'Measurement', 'Comparison'],
        3: ['Rates', 'Financial Mathematics', 'Multiplication'],
        4: ['Financial Mathematics', 'Simple Interest', 'Rates'],
        5: ['Ratio & Rates', 'Proportional Reasoning', 'Data Interpretation'],
      },
    },
    {
      name: 'Asian Water Buffalo',
      obs:  'Arm span vs. horn span (approx. 2 m); ratio and measurement comparison',
      focusByStage: {
        1: 'Comparing lengths; estimating using body measurements',
        2: 'Measuring and comparing length; estimating ratios informally',
        3: 'Ratio and scale; comparing arm span to horn span; fractions in measurement context',
        4: 'Ratio in simplest form; measurement and comparison; fractions and operations in real context',
        5: 'Ratio, proportional reasoning and measurement applied to biometric comparison',
      },
      tagsByStage: {
        1: ['Length', 'Measurement', 'Comparison'],
        2: ['Measurement', 'Length', 'Estimation'],
        3: ['Ratio', 'Fractions', 'Measurement'],
        4: ['Ratio', 'Fractions & Operations', 'Measurement'],
        5: ['Ratio', 'Proportional Reasoning', 'Measurement'],
      },
    },
    {
      name: 'Blue Mountains Bushwalk',
      obs:  'Sound tally (5 categories); sequence puzzle 20 + (4 × 5) = 40',
      focusByStage: {
        1: 'Tally counting; recording and comparing data; simple addition',
        2: 'Tally charts; comparing frequencies; basic data analysis from collected results',
        3: 'Data collection and frequency analysis; order of operations in sequence puzzles',
        4: 'Statistical analysis of tally data - mean, median, mode; algebraic sequences and order of operations',
        5: 'Statistical interpretation; measures of spread; algebraic sequence reasoning and evaluation of findings',
      },
      tagsByStage: {
        1: ['Statistics', 'Addition', 'Counting'],
        2: ['Statistics', 'Data Collection', 'Addition'],
        3: ['Statistics', 'Data Collection', 'Order of Operations'],
        4: ['Statistics', 'Algebra', 'Order of Operations'],
        5: ['Statistical Analysis', 'Algebraic Sequences', 'Data Evaluation'],
      },
    },
    {
      name: 'Concert Lawn',
      obs:  'Open maths observation walk; area and measurement quiz using lawn dimensions',
      focusByStage: {
        1: 'Area as length × width in a real setting; calculating with small whole numbers',
        2: 'Map scale (1 cm = 10 m); multiplying by a scale factor to find real-world measurements',
        3: 'Area calculation with larger dimensions (30 × 20 m); reading and applying measurements',
        4: 'Rates applied to area; multiplying area by a density rate (seeds per m²)',
        5: 'Division applied to area; calculating maximum capacity using area per person',
      },
      tagsByStage: {
        1: ['Area', 'Measurement', 'Multiplication'],
        2: ['Scale', 'Measurement', 'Multiplication'],
        3: ['Area', 'Measurement', 'Multiplication & Division'],
        4: ['Area', 'Rates', 'Measurement'],
        5: ['Area', 'Rates', 'Division'],
      },
    },
  ],
  pdhpe: [
    {
      name: 'Chimpanzee',
      obs:  'Lifestyle comparison chart - comparing physical activity, rest, social time and time outdoors between chimpanzees and students',
      focusByStage: {
        1: 'Recognising different types of physical activity; comparing animal and human daily habits',
        2: 'Comparing categories of activity (physical, rest, social) between chimpanzees and themselves',
        3: 'Analysing how physical activity, rest and social time each contribute to health and wellbeing',
        4: 'Evaluating lifestyle factors affecting health; comparing energy expenditure and health behaviours across species',
        5: 'Analysing the interrelationship between physical activity, rest and social connection and their impact on long-term wellbeing',
      },
      tagsByStage: {
        1: ['Physical Activity', 'Health Behaviours', 'Comparison'],
        2: ['Health Behaviours', 'Physical Activity', 'Comparison'],
        3: ['Health Concepts', 'Physical Activity', 'Lifestyle'],
        4: ['Health & Wellbeing', 'Lifestyle Factors', 'Movement'],
        5: ['Wellbeing Frameworks', 'Lifestyle Analysis', 'Interrelationships'],
      },
    },
    {
      name: 'Western Lowland Gorilla',
      obs:  'Diet challenge - identifying food groups in the gorilla\'s diet and connecting to human nutrition and health',
      focusByStage: {
        1: 'Identifying food groups; recognising healthy food choices and why food matters for our bodies',
        2: 'Categorising foods into groups; understanding how a balanced diet supports health and growth',
        3: 'Analysing how different food groups contribute to health; connecting dietary variety to physical performance',
        4: 'Evaluating food choices and their impact on health; understanding macronutrients and energy balance',
        5: 'Critically analysing dietary patterns and their relationship to long-term health, performance and wellbeing',
      },
      tagsByStage: {
        1: ['Nutrition', 'Health Behaviours', 'Food Groups'],
        2: ['Nutrition', 'Food Groups', 'Health Behaviours'],
        3: ['Nutrition', 'Health Concepts', 'Dietary Analysis'],
        4: ['Nutrition', 'Health & Wellbeing', 'Energy Balance'],
        5: ['Nutrition', 'Health Analysis', 'Wellbeing'],
      },
    },
    {
      name: 'African Lion',
      obs:  'Energy systems observation - noting rest vs. active time; connecting to ATP-PC system, BMR and human energy use',
      focusByStage: {
        1: 'Understanding that bodies need rest to recover; recognising rest and activity as part of a healthy day',
        2: 'Comparing active and rest time; understanding why animals and humans need both activity and rest',
        3: 'Understanding how energy systems work; rest as metabolic recovery; connecting to sport and exercise',
        4: 'Analysing energy systems (ATP-PC and aerobic); understanding basal metabolic rate; rest-to-work ratios in sport',
        5: 'Evaluating physiological principles of energy system demands; applying rest-to-work ratios to training and performance',
      },
      tagsByStage: {
        1: ['Physical Activity', 'Rest & Recovery', 'Health Behaviours'],
        2: ['Physical Activity', 'Rest & Recovery', 'Energy'],
        3: ['Energy Systems', 'Movement', 'Sport & Exercise'],
        4: ['Energy Systems', 'Exercise Physiology', 'Movement'],
        5: ['Exercise Physiology', 'Performance', 'Training Principles'],
      },
    },
    {
      name: 'Giraffe',
      obs:  'Cardiovascular comparison - observing the giraffe\'s neck and drinking posture; comparing giraffe heart to human heart',
      focusByStage: {
        1: 'Identifying the heart as a vital body part; understanding that the heart pumps blood around the body',
        2: 'Comparing heart size and function across animals; understanding how exercise makes our heart beat faster',
        3: 'Understanding how the heart and circulatory system work; measuring and interpreting changes in heart rate',
        4: 'Analysing cardiovascular adaptations; understanding blood pressure, heart rate and the impact of exercise on the heart',
        5: 'Evaluating cardiovascular health indicators and their relationship to lifelong physical activity and wellbeing',
      },
      tagsByStage: {
        1: ['Body Systems', 'Heart Health', 'Physical Activity'],
        2: ['Body Systems', 'Heart Health', 'Exercise'],
        3: ['Body Systems', 'Cardiovascular Health', 'Exercise'],
        4: ['Exercise Physiology', 'Cardiovascular Health', 'Movement'],
        5: ['Exercise Physiology', 'Lifelong Activity', 'Cardiovascular Health'],
      },
    },
    {
      name: 'Sumatran Tiger',
      obs:  'Movement observation - watching power, speed and patience; connecting animal movement qualities to sport and athletics',
      focusByStage: {
        1: 'Identifying movement qualities like speed and power; connecting animal movement to sport and play',
        2: 'Comparing movement qualities in animals and athletes; understanding skill-based physical activity',
        3: 'Analysing movement qualities of power, speed and patience as performance attributes in sport',
        4: 'Evaluating the role of power, speed and composure as performance qualities; applying movement concepts to athletic training',
        5: 'Analysing biomechanical principles of athletic movement; evaluating training principles using comparative observation',
      },
      tagsByStage: {
        1: ['Movement', 'Physical Activity', 'Sport'],
        2: ['Movement Skills', 'Sport', 'Physical Activity'],
        3: ['Movement Skills', 'Sport & Performance', 'Athletics'],
        4: ['Movement Concepts', 'Performance', 'Training Principles'],
        5: ['Biomechanics', 'Performance Analysis', 'Training'],
      },
    },
    {
      name: 'Koala',
      obs:  'Sleep and health observation - comparing 22 hours koala sleep to 8-10 hours human recommended sleep',
      focusByStage: {
        1: 'Understanding why sleep is important for our bodies; knowing how much sleep children need',
        2: 'Comparing sleep needs across species; understanding sleep as a key health behaviour',
        3: 'Analysing sleep as a health-promoting behaviour; understanding the consequences of sleep deprivation',
        4: 'Evaluating the relationship between sleep quality, duration and physical and mental health outcomes',
        5: 'Analysing the role of sleep in recovery, cognitive performance and long-term health and wellbeing',
      },
      tagsByStage: {
        1: ['Sleep & Rest', 'Health Behaviours', 'Body Needs'],
        2: ['Sleep & Rest', 'Health Behaviours', 'Wellbeing'],
        3: ['Sleep & Rest', 'Health Concepts', 'Wellbeing'],
        4: ['Sleep & Rest', 'Health & Wellbeing', 'Recovery'],
        5: ['Sleep & Rest', 'Performance', 'Health Analysis'],
      },
    },
    {
      name: 'Dingo',
      obs:  'Food as fuel - observing how dingoes hunt and move; connecting food choices to energy for activity',
      focusByStage: {
        1: 'Understanding food as fuel for the body; identifying healthy food choices that give us energy',
        2: 'Connecting food choices to energy for physical activity; understanding food groups and their role in health',
        3: 'Analysing how different foods provide energy for different activities; understanding nutrition for performance',
        4: 'Evaluating dietary choices and their role in supporting physical activity, recovery and health',
        5: 'Analysing the relationship between nutrition, energy systems and athletic performance',
      },
      tagsByStage: {
        1: ['Nutrition', 'Physical Activity', 'Health Behaviours'],
        2: ['Nutrition', 'Physical Activity', 'Health Behaviours'],
        3: ['Nutrition', 'Energy', 'Performance'],
        4: ['Nutrition', 'Performance', 'Health & Wellbeing'],
        5: ['Nutrition', 'Energy Systems', 'Performance Analysis'],
      },
    },
    {
      name: 'Ring-tailed Lemur',
      obs:  'Relationships and wellbeing - observing troop behaviour; connecting belonging and social connection to human wellbeing',
      focusByStage: {
        1: 'Identifying how friendships and belonging make us feel happy and healthy',
        2: 'Understanding how relationships and belonging contribute to wellbeing; identifying qualities of positive relationships',
        3: 'Analysing how social connection and belonging affect mental health and wellbeing',
        4: 'Evaluating the impact of social relationships and sense of belonging on identity and wellbeing',
        5: 'Analysing how identity, belonging and social connection contribute to individual and community health and wellbeing',
      },
      tagsByStage: {
        1: ['Relationships', 'Belonging', 'Wellbeing'],
        2: ['Relationships', 'Belonging', 'Wellbeing'],
        3: ['Relationships', 'Mental Health', 'Social Connection'],
        4: ['Identity & Belonging', 'Relationships', 'Wellbeing'],
        5: ['Identity & Belonging', 'Community', 'Wellbeing Frameworks'],
      },
    },
    {
      name: 'Sea Lion',
      obs:  'Human impacts and resilience - examining threats to sea lions and connecting to student strategies for positive action',
      focusByStage: {
        1: 'Recognising how people can help or harm animals; identifying actions we can take to protect living things',
        2: 'Understanding human impacts on the environment; exploring ways communities can protect wildlife and their own health',
        3: 'Analysing environmental threats and their impact on health; developing strategies for positive individual and community action',
        4: 'Evaluating the influence of human behaviour on environmental and community health; proposing action strategies',
        5: 'Analysing systemic environmental factors affecting health and wellbeing; evaluating individual and collective advocacy strategies',
      },
      tagsByStage: {
        1: ['Community', 'Environment', 'Health Behaviours'],
        2: ['Community', 'Environment', 'Health Behaviours'],
        3: ['Community Health', 'Environment', 'Action Strategies'],
        4: ['Community Health', 'Environment', 'Advocacy'],
        5: ['Health & Wellbeing', 'Community', 'Systemic Factors'],
      },
    },
    {
      name: 'Asian Water Buffalo',
      obs:  'Hydration and health - observing the buffalo\'s use of water for cooling; connecting to human hydration needs',
      focusByStage: {
        1: 'Understanding why the body needs water; identifying healthy hydration habits throughout the day',
        2: 'Connecting hydration to physical performance and health; understanding the body\'s water needs during activity',
        3: 'Analysing the role of hydration in health; understanding the effects of dehydration on physical and cognitive performance',
        4: 'Evaluating hydration strategies for physical activity; understanding fluid balance and its impact on health outcomes',
        5: 'Analysing the physiological mechanisms of hydration and thermoregulation; evaluating fluid intake recommendations across activity levels',
      },
      tagsByStage: {
        1: ['Hydration', 'Health Behaviours', 'Body Needs'],
        2: ['Hydration', 'Health Behaviours', 'Physical Activity'],
        3: ['Hydration', 'Health Concepts', 'Performance'],
        4: ['Hydration', 'Exercise Physiology', 'Health & Wellbeing'],
        5: ['Hydration', 'Thermoregulation', 'Performance Analysis'],
      },
    },
    {
      name: 'Blue Mountains Bushwalk',
      obs:  'Identity and environment - standing still and listening to the bush; writing about how the world around us shapes who we are',
      focusByStage: {
        1: 'Exploring identity through connection to place and nature; recognising features of personal identity',
        2: 'Identifying ways the environment, family and community shape who we are; understanding sense of identity',
        3: 'Analysing how environment, culture and experiences shape identity; connecting identity to health and wellbeing',
        4: 'Evaluating how contextual factors (environment, culture, relationships) shape identity and sense of belonging',
        5: 'Analysing the interrelationship between identity, belonging, environment and individual and community wellbeing',
      },
      tagsByStage: {
        1: ['Identity', 'Belonging', 'Wellbeing'],
        2: ['Identity', 'Belonging', 'Community'],
        3: ['Identity', 'Wellbeing', 'Contextual Factors'],
        4: ['Identity & Belonging', 'Contextual Factors', 'Wellbeing'],
        5: ['Identity & Belonging', 'Wellbeing Frameworks', 'Community'],
      },
    },
    {
      name: 'Concert Lawn',
      obs:  'Team challenge and outdoor reflection - participating in a group activity and reflecting on enjoyment of physical activity',
      focusByStage: {
        1: 'Participating in and reflecting on team activities; identifying what makes physical activity enjoyable',
        2: 'Reflecting on experiences of physical activity; understanding how enjoyment and teamwork support lifelong participation',
        3: 'Analysing factors that motivate participation in physical activity; understanding the role of enjoyment and social connection',
        4: 'Evaluating strategies to promote participation in physical activity; understanding intrinsic and extrinsic motivation',
        5: 'Analysing factors influencing lifelong physical activity participation; designing strategies to enhance motivation and enjoyment',
      },
      tagsByStage: {
        1: ['Physical Activity', 'Teamwork', 'Enjoyment'],
        2: ['Physical Activity', 'Teamwork', 'Motivation'],
        3: ['Physical Activity', 'Motivation', 'Social Connection'],
        4: ['Lifelong Activity', 'Motivation', 'Strategies'],
        5: ['Lifelong Activity', 'Motivation', 'Health Promotion'],
      },
    },
  ],
};

const SCORING = {
  science: {
    domains: [
      {
        label:'Behaviour', color:'#7C3AED', lightBg:'#F5F3FF', lightBorder:'#DDD6FE', icon:'B',
        what:'What did the student observe the animal doing?',
        criteria:[
          'Accurately names or describes an observable behaviour',
          'Uses spatial or temporal language (where, when, how)',
          'Distinguishes the animal\'s action from its environment',
        ],
        full:'5 pts - precise, specific behaviour with clear context',
        partial:'3 pts - general observation without specifics',
        minimal:'1 pt - vague or inaccurate description',
      },
      {
        label:'Use of Evidence', color:'#0369a1', lightBg:'#EFF6FF', lightBorder:'#BFDBFE', icon:'E',
        what:'Did the student cite specific observable details as evidence?',
        criteria:[
          'References visible physical features (body part, colour, size)',
          'Links the observation to a function or adaptation',
          'Uses quantitative or comparative language where appropriate',
        ],
        full:'5 pts - evidence clearly supports a scientific claim',
        partial:'3 pts - some detail present but not linked to a concept',
        minimal:'1 pt - very general, no evidence cited',
      },
      {
        label:'Scientific Language', color:'#059669', lightBg:'#F0FDF4', lightBorder:'#A7F3D0', icon:'S',
        what:'Did the student use appropriate scientific vocabulary?',
        criteria:[
          'Uses at least one subject-specific term correctly',
          'Writes in complete, coherent sentences',
          'Communicates ideas clearly and logically',
        ],
        full:'5 pts - fluent scientific register with correct terminology',
        partial:'3 pts - some scientific language but inconsistent',
        minimal:'1 pt - everyday language only, no scientific terms',
      },
    ],
  },
  maths: {
    domains: [
      {
        label:'Mathematical Observation', color:'#7C3AED', lightBg:'#F5F3FF', lightBorder:'#DDD6FE', icon:'O',
        what:'Did the student accurately record and describe mathematical data?',
        criteria:[
          'Correctly records counts, measurements or tally data',
          'Identifies a mathematical pattern or relationship',
          'Uses appropriate notation (=, ×, ÷, %, units)',
        ],
        full:'5 pts - accurate data with clear mathematical structure',
        partial:'3 pts - partially accurate, minor errors in recording',
        minimal:'1 pt - limited or incorrect data recording',
      },
      {
        label:'Reasoning & Working', color:'#0369a1', lightBg:'#EFF6FF', lightBorder:'#BFDBFE', icon:'R',
        what:'Did the student show working and justify their thinking?',
        criteria:[
          'Shows all steps in a calculation or sequence',
          'Explains why a strategy was chosen or answer is reasonable',
          'Identifies and applies the correct mathematical operation',
        ],
        full:'5 pts - complete working with clear justification',
        partial:'3 pts - working shown but justification missing',
        minimal:'1 pt - answer only, no working or reasoning',
      },
      {
        label:'Mathematical Communication', color:'#059669', lightBg:'#F0FDF4', lightBorder:'#A7F3D0', icon:'C',
        what:'Did the student communicate mathematical ideas clearly?',
        criteria:[
          'Uses correct vocabulary (product, quotient, ratio, etc.)',
          'Writes responses in full sentences where prompted',
          'Presents results with appropriate units',
        ],
        full:'5 pts - precise language, well-structured response',
        partial:'3 pts - some mathematical language, partially structured',
        minimal:'1 pt - informal language only, unclear communication',
      },
    ],
  },
  pdhpe: {
    domains: [
      {
        label:'Comparison', color:'#7C3AED', lightBg:'#F5F3FF', lightBorder:'#DDD6FE', icon:'C',
        what:'Did the student connect the animal\'s behaviour to their own life or a PDHPE health concept?',
        criteria:[
          'Explicitly links the observed animal behaviour to human health, identity or wellbeing',
          'Makes a specific and relevant comparison (not just "we are similar")',
          'Applies the animal example to their own life, body system or health behaviour',
        ],
        full:'5 pts - clear, specific comparison with strong PDHPE connection',
        partial:'3 pts - comparison attempted but vague or incomplete',
        minimal:'1 pt - response describes the animal without connecting to self or health',
      },
      {
        label:'Understanding', color:'#0369a1', lightBg:'#EFF6FF', lightBorder:'#BFDBFE', icon:'U',
        what:'Did the student demonstrate understanding of a PDHPE health concept?',
        criteria:[
          'Names or explains a relevant health concept (e.g. sleep, nutrition, cardiovascular, identity)',
          'Shows understanding of why the health concept matters for human wellbeing',
          'Uses accurate health or PDHPE vocabulary appropriate to their stage',
        ],
        full:'5 pts - accurate health concept with clear explanation of its importance',
        partial:'3 pts - health concept mentioned but explanation is limited',
        minimal:'1 pt - little or no health knowledge demonstrated',
      },
      {
        label:'Communication', color:'#059669', lightBg:'#F0FDF4', lightBorder:'#A7F3D0', icon:'W',
        what:'Did the student communicate their response clearly in complete sentences?',
        criteria:[
          'Writes in complete sentences with a capital letter and full stop',
          'Ideas are logically sequenced and easy to follow',
          'Uses appropriate vocabulary for their stage of learning',
        ],
        full:'5 pts - clear, well-structured response with correct punctuation',
        partial:'3 pts - response communicates ideas but sentences are incomplete or unclear',
        minimal:'1 pt - ideas present but difficult to understand or not in sentence form',
      },
    ],
  },
};

const STAGE_EXPECTATIONS = {
  science: {
    1: { label:'Stage 1 (Years 1–2)', minWords:3,  expectation:'Students draw or write simple observations. Accept labelled diagrams alongside written responses.', starters:['I saw…', 'I can see…', 'It has…'] },
    2: { label:'Stage 2 (Years 3–4)', minWords:5,  expectation:'Students write 1–2 sentences describing what they observe, naming the body part or action observed.', starters:['I noticed…', 'The animal…', 'I can see that…'] },
    3: { label:'Stage 3 (Years 5–6)', minWords:8,  expectation:'Students describe what they observed, identify one feature or behaviour, and give a reason why the animal might do this.', starters:['I noticed…', 'I think this is because…', 'This helps the animal…'] },
    4: { label:'Stage 4 (Years 7–8)', minWords:10, expectation:'Students write a clear observation (what + where/how), link it to a relevant biological concept, and explain the connection to survival or function.', starters:['I observed that…', 'This may help the animal because…', 'This feature appears to…'] },
    5: { label:'Stage 5 (Years 9–10)', minWords:12, expectation:'Students apply scientific reasoning using direct observation evidence. Responses should reference scientific vocabulary and connect to broader ecological or evolutionary concepts.', starters:['Based on my observation…', 'This is significant because…', 'This adaptation allows the animal to…'] },
  },
  maths: {
    1: { label:'Stage 1 (Years 1–2)', minWords:3,  expectation:'Students count and record objects or sounds using tally marks and simple number sentences. Basic addition and subtraction in context.', starters:['I counted…', 'I can see…', 'There were…'] },
    2: { label:'Stage 2 (Years 3–4)', minWords:5,  expectation:'Students use multiplication, division and measurement in context. They record their working and explain their answer in a sentence.', starters:['I worked out…', 'I used…', 'The answer is… because…'] },
    3: { label:'Stage 3 (Years 5–6)', minWords:8,  expectation:'Students apply fractions, decimals, percentages and measurement. Full working shown with mathematical vocabulary to explain reasoning.', starters:['I calculated…', 'The difference is…', 'To find this I…'] },
    4: { label:'Stage 4 (Years 7–8)', minWords:10, expectation:'Students use algebraic reasoning, ratios and statistical thinking. Full working shown with justification of the method chosen.', starters:['Using the equation…', 'The ratio shows…', 'I can prove this because…'] },
    5: { label:'Stage 5 (Years 9–10)', minWords:12, expectation:'Students apply advanced algebra, statistical reasoning and mathematical proof. Responses evaluate the validity of claims using data and communicate conclusions precisely.', starters:['The data indicates…', 'This is statistically significant because…', 'Applying the formula…'] },
  },
  pdhpe: {
    1: { label:'Stage 1 (Years 1–2)', minWords:3,  expectation:'Students draw or write simple connections between the animal and a health habit or body need. Accept labelled drawings alongside written responses.', starters:['This animal…', 'I am like this animal because…', 'This makes me think about…'] },
    2: { label:'Stage 2 (Years 3–4)', minWords:5,  expectation:'Students write 1–2 sentences linking the animal\'s behaviour to their own life, naming a specific health habit, body system or wellbeing concept.', starters:['I noticed that…', 'This reminds me of…', 'This connects to my health because…'] },
    3: { label:'Stage 3 (Years 5–6)', minWords:8,  expectation:'Students describe what they observed, identify a health or wellbeing concept, and explain how it connects to human health or their own life.', starters:['I observed…', 'This connects to health because…', 'Just like this animal, I…'] },
    4: { label:'Stage 4 (Years 7–8)', minWords:10, expectation:'Students write a clear comparison between the animal\'s behaviour and human health, reference a PDHPE concept, and explain the connection to their own wellbeing or identity.', starters:['Observing this animal shows…', 'This relates to the PDHPE concept of…', 'This impacts health because…'] },
    5: { label:'Stage 5 (Years 9–10)', minWords:12, expectation:'Students apply PDHPE concepts using observation evidence, connect to health and wellbeing frameworks, and evaluate the implications for their own lifestyle or community health.', starters:['This observation demonstrates…', 'Applying the concept of…', 'This is significant for wellbeing because…'] },
  },
};

const NSW_OUTCOMES = {
  science: {
    1: [
      { code:'ST1-1WS-S', desc:'Observes, questions and collects data to communicate and compare ideas' },
      { code:'ST1-4LW-S', desc:'Describes the behaviours and needs of living things and the features of their environment that help them survive' },
    ],
    2: [
      { code:'ST2-1WS-S', desc:'Conducts investigations by observing, questioning, planning, predicting, testing and communicating' },
      { code:'ST2-4LW-S', desc:'Compares features of living things and examines how environments affect living things' },
    ],
    3: [
      { code:'ST3-1WS-S', desc:'Plans and conducts scientific investigations to answer questions or solve problems' },
      { code:'ST3-4LW-S', desc:'Examines the role of living things in the environment and the effect of environmental change' },
    ],
    4: [
      { code:'SC4-WS-01',  desc:'Uses scientific tools and instruments for observations' },
      { code:'SC4-WS-05',  desc:'Uses a variety of ways to process and represent data' },
      { code:'SC4-WS-06',  desc:'Uses data to identify trends, patterns and relationships, and draw conclusions' },
      { code:'SC4-WS-08',  desc:'Communicates scientific concepts and ideas using a range of communication forms' },
      { code:'SC4-CLS-01', desc:'Describes the unique features of cells in living things and how structural features can be used to classify organisms' },
      { code:'SC4-LIV-01', desc:'Describes the role, structure and function of a range of living systems and their components' },
    ],
    5: [
      { code:'SC5-WS-01',  desc:'Selects and uses scientific tools and instruments for accurate observations' },
      { code:'SC5-WS-06',  desc:'Analyses data from investigations to identify trends, patterns and relationships, and draws conclusions' },
      { code:'SC5-WS-08',  desc:'Communicates scientific arguments with evidence, using scientific language and terminology in a range of communication forms' },
      { code:'SC5-ENV-01', desc:'Analyses the impact of human activity on the natural world' },
      { code:'SC5-GEV-01', desc:'Describes the relationship between the diversity of living things and the theory of evolution' },
    ],
  },
  maths: {
    1: [
      { code:'MAO-WM-01',   desc:'Develops understanding and fluency by exploring and connecting mathematical concepts and communicating thinking' },
      { code:'MA1-DATA-01', desc:'Gathers and organises data, displays data in lists, tables and picture graphs, and interprets results' },
      { code:'MA1-GM-01',   desc:'Describes and compares lengths and distances using uniform informal units, metres and centimetres' },
    ],
    2: [
      { code:'MAO-WM-01',   desc:'Applies mathematical reasoning and communicates thinking when solving problems' },
      { code:'MA2-DATA-01', desc:'Collects discrete data and constructs graphs using a given scale' },
      { code:'MA2-MR-01',   desc:'Represents and uses the structure of multiplicative relations to 10 x 10 to solve problems' },
      { code:'MA2-GM-01',   desc:'Estimates, measures and compares lengths, distances and perimeters in metres, centimetres and millimetres' },
    ],
    3: [
      { code:'MAO-WM-01',   desc:'Develops fluency by exploring and connecting mathematical concepts to solve problems and communicate reasoning' },
      { code:'MA3-DATA-01', desc:'Constructs, interprets and evaluates data displays including dot plots, line graphs and two-way tables' },
      { code:'MA3-FRC-01',  desc:'Compares, orders and calculates with fractions, decimals and percentages' },
      { code:'MA3-GM-01',   desc:'Selects appropriate units to estimate, measure and calculate lengths, perimeters and converts between units' },
    ],
    4: [
      { code:'MAO-WM-01',    desc:'Reasons, communicates and solves problems using mathematical concepts, skills and techniques' },
      { code:'MA4-RAT-C-01', desc:'Solves problems involving ratios and rates, and explores their graphical representation' },
      { code:'MA4-FRC-C-01', desc:'Operates with fractions, decimals and percentages in a variety of contexts' },
      { code:'MA4-ALG-C-01', desc:'Generalises number properties to operate with algebraic expressions and equations' },
      { code:'MA4-STA-C-01', desc:'Classifies and displays data using a variety of statistical representations and interprets results' },
    ],
    5: [
      { code:'MAO-WM-01',    desc:'Selects and applies appropriate mathematical techniques to reason, communicate and solve problems' },
      { code:'MA5-RAT-C-01', desc:'Applies ratios and rates to solve problems including financial mathematics and similar figures' },
      { code:'MA5-ALG-C-01', desc:'Develops and applies algebraic techniques to expand, factorise and solve equations and inequalities' },
      { code:'MA5-STA-C-01', desc:'Interprets and critically analyses statistical data and evaluates the validity of claims and predictions' },
    ],
  },
  pdhpe: {
    1: [
      { code:'PH1-MSP-01', desc:'Demonstrates fundamental movement skills and fair play in physical activities' },
      { code:'PH1-IHW-01', desc:'Describes factors that contribute to identity, health and wellbeing' },
      { code:'PH1-SMI-01', desc:'Describes and demonstrates self-management and interpersonal skills in a range of contexts' },
    ],
    2: [
      { code:'PH2-MSP-01', desc:'Applies movement skills, strategies and teamwork in physical activities' },
      { code:'PH2-IHW-01', desc:'Explains how related factors influence identity, health and wellbeing' },
      { code:'PH2-SMI-01', desc:'Explains and applies self-management and interpersonal skills in a range of contexts' },
    ],
    3: [
      { code:'PH3-MSP-01', desc:'Refines and applies movement skills, strategies and collaboration in physical activities' },
      { code:'PH3-IHW-01', desc:'Analyses how health behaviours and contextual factors influence health, wellbeing and participation in physical activity' },
      { code:'PH3-SMI-01', desc:'Applies self-management and interpersonal skills to manage situations and promote health, safety and wellbeing' },
    ],
    4: [
      { code:'PH4-MSS-01', desc:'Transfers movement skills and concepts for use in a range of dynamic movement environments' },
      { code:'PH4-SHP-01', desc:'Plans for and uses strategies to participate in activities that encourage safety, health and lifelong physical activity' },
      { code:'PH4-SHW-01', desc:'Assesses the influence of contextual factors on attitudes and behaviours to propose strategies that enhance safety, health and wellbeing' },
      { code:'PH4-IBC-01', desc:'Investigates and explains factors that shape identity and sense of belonging' },
      { code:'PH4-SMI-01', desc:'Refines and applies self-management and interpersonal skills to manage complex situations' },
    ],
    5: [
      { code:'PH5-MSS-01', desc:'Refines and transfers movement skills and concepts for adaptation in a range of dynamic movement environments' },
      { code:'PH5-SHP-01', desc:'Designs, implements and evaluates plans to enhance safety, health and participation in lifelong physical activity' },
      { code:'PH5-SHW-01', desc:'Analyses the interrelationship between contextual factors, attitudes and behaviours to promote safety, health and wellbeing' },
      { code:'PH5-IBC-01', desc:'Analyses how identity and a sense of belonging contribute to the health and wellbeing of individuals and communities' },
      { code:'PH5-SMI-01', desc:'Evaluates and adapts self-management and interpersonal skills to manage complex situations' },
    ],
  },
};

const PORTAL_GUIDE = [
  { num:'01', heading:'Radar Chart',        body:'Each student has a radar chart showing scores across the three domains. A balanced shape indicates strength across all areas. A spike in one domain with low others may indicate a student who observes well but struggles to communicate, or vice versa. Look for systematic patterns across the whole class.' },
  { num:'02', heading:'Common Issues',      body:'Automatically identifies the most frequently underperforming domain across the class. Use this as the basis for a whole-class debrief or targeted mini-lesson before students move to the next exhibit.' },
  { num:'03', heading:'Student Groups',     body:'Students are sorted into three achievement bands based on their total score. Each band includes a specific teaching prompt. Use these for differentiated follow-up tasks or targeted questioning during the excursion debrief.' },
  { num:'04', heading:'How It\'s Marked',   body:'Lists the criteria for each domain so you can share these with students before the activity. Setting clear expectations before the observation task consistently improves response quality and specificity.' },
  { num:'05', heading:'Per-Student Detail', body:'Tap any student row to see their full written response, individual domain scores, AI-generated feedback and improvement tips. You can override any score using the edit controls if you disagree with the automated assessment.' },
];

function svgDownloadIcon() {
  return `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

export function openTeacherInfoSheet(subject, stage, outcomes) {
  const resolvedOutcomes = outcomes || NSW_OUTCOMES[subject]?.[parseInt(stage, 10)] || [];
  const isScience  = subject === 'science';
  const isMaths    = subject === 'maths';
  const isPdhpe    = subject === 'pdhpe';
  const isEnglish  = subject === 'english';
  const subjectLabel = isScience ? 'Science' : isMaths ? 'Mathematics' : isPdhpe ? 'PDHPE' : 'English';
  const accentColor  = isScience ? BRAND.mid          : isMaths ? BRAND.mathsBlue   : isPdhpe ? BRAND.pdhpePurple  : BRAND.englishAmber;
  const accentLight  = isScience ? BRAND.foam         : isMaths ? BRAND.mathsBg     : isPdhpe ? BRAND.pdhpeBg     : BRAND.englishBg;
  const accentBorder = isScience ? BRAND.mist         : isMaths ? BRAND.mathsBorder : isPdhpe ? BRAND.pdhpeBorder : BRAND.englishBorder;
  const stageNum     = parseInt(stage, 10);
  const stageMeta    = STAGE_EXPECTATIONS[subject]?.[stageNum] || STAGE_EXPECTATIONS[subject]?.[4];
  const exhibits     = EXHIBITS[subject]  || EXHIBITS.science;
  const scoring      = SCORING[subject]   || SCORING.science;
  const origin       = window.location.origin;
  const today        = new Date().toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' });

  const exhibitRows = exhibits.map((e, i) => {
    const focus = e.focusByStage?.[stageNum] || e.focusByStage?.[4] || '';
    const tags  = e.tagsByStage?.[stageNum]  || e.tagsByStage?.[4]  || [];
    const tagHtml = tags.map(t => `<span class="t-tag" style="background:${accentColor}">${t}</span>`).join('');
    return `
    <tr>
      <td class="t-num">${String(i + 1).padStart(2, '0')}</td>
      <td class="t-name">${e.name}</td>
      <td class="t-focus">
        <div class="t-tags">${tagHtml}</div>
        <span class="t-focus-main">${focus}</span>
        ${e.obs ? `<span class="t-focus-obs">Task: ${e.obs}</span>` : ''}
      </td>
    </tr>`;
  }).join('');

  const outcomeRows = resolvedOutcomes.map(o => `
    <div class="outcome-row">
      <span class="outcome-code" style="background:${accentColor}">${o.code}</span>
      <span class="outcome-desc">${o.desc}</span>
    </div>`).join('');

  const domainCards = scoring.domains.map(d => `
    <div class="domain-card">
      <div class="domain-hd" style="background:${d.color}">
        <span class="domain-icon">${d.icon}</span>
        <div>
          <div class="domain-name">${d.label}</div>
          <div class="domain-pts">out of 5 points</div>
        </div>
      </div>
      <div class="domain-body">
        <p class="domain-q">${d.what}</p>
        <ul class="domain-ul">
          ${d.criteria.map(c => `<li>${c}</li>`).join('')}
        </ul>
        <div class="bands">
          <div class="band b-full"><span class="dot" style="background:#059669"></span><span>${d.full}</span></div>
          <div class="band b-part"><span class="dot" style="background:#D97706"></span><span>${d.partial}</span></div>
          <div class="band b-min"><span class="dot"  style="background:#DC2626"></span><span>${d.minimal}</span></div>
        </div>
      </div>
    </div>`).join('');

  const portalRows = PORTAL_GUIDE.map(g => `
    <div class="portal-row">
      <div class="portal-num" style="color:${accentColor}">${g.num}</div>
      <div class="portal-content">
        <div class="portal-title">${g.heading}</div>
        <div class="portal-body">${g.body}</div>
      </div>
    </div>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Taronga Tracka - Teacher Information Sheet - ${subjectLabel} Stage ${stage}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
@font-face {
  font-family:'TarongaHeadline';
  src:url('${origin}/images/TarongaHeadline-Regular.ttf') format('truetype');
  font-weight:normal; font-style:normal;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

body{
  font-family:'DM Sans',system-ui,sans-serif;
  font-size:10pt;
  line-height:1.6;
  color:${BRAND.ink};
  background:#E8E4DC;
}

/* ── Page shell ── */
.page{
  max-width:800px;
  margin:0 auto;
  background:#fff;
  box-shadow:0 8px 40px rgba(7,30,20,0.18);
}

/* ── TOP STRIPE ── */
.top-stripe{
  height:5px;
  background:linear-gradient(90deg, ${accentColor} 0%, ${isScience ? BRAND.eucalyptus : isMaths ? '#0ea5e9' : isPdhpe ? '#a855f7' : '#d97706'} 100%);
}

/* ── HEADER ── */
.hdr{
  background:${BRAND.forest};
  padding:28px 40px 24px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:24px;
  position:relative;
}
.hdr::after{
  content:'';
  position:absolute;
  bottom:0; left:0; right:0;
  height:1px;
  background:rgba(168,196,178,0.2);
}
.hdr-left{
  display:flex;
  align-items:center;
  gap:20px;
}
.hdr-logo{
  height:52px;
  width:auto;
  display:block;
  flex-shrink:0;
}
.hdr-divider{
  width:1px;
  height:44px;
  background:rgba(168,196,178,0.35);
  flex-shrink:0;
}
.hdr-wordmark{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:18pt;
  font-weight:normal;
  color:#fff;
  letter-spacing:0.06em;
  line-height:1.15;
}
.hdr-tagline{
  font-size:8pt;
  color:${BRAND.mist};
  letter-spacing:0.14em;
  text-transform:uppercase;
  margin-top:3px;
  font-weight:500;
}
.hdr-right{
  text-align:right;
  flex-shrink:0;
}
.hdr-subject{
  display:inline-block;
  background:${accentColor};
  color:#fff;
  font-size:8.5pt;
  font-weight:700;
  letter-spacing:0.1em;
  text-transform:uppercase;
  padding:5px 16px;
  border-radius:40px;
  margin-bottom:6px;
}
.hdr-stage{
  display:block;
  font-size:8pt;
  color:${BRAND.mist};
  letter-spacing:0.05em;
  font-weight:400;
}

/* ── META BAR ── */
.meta-bar{
  background:${BRAND.deep};
  padding:10px 40px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}
.meta-item{
  display:flex;
  align-items:center;
  gap:6px;
  font-size:7.5pt;
  color:${BRAND.mist};
  letter-spacing:0.05em;
}
.meta-dot{
  width:4px; height:4px;
  border-radius:50%;
  background:${BRAND.sage};
  flex-shrink:0;
}

/* ── PRINT BAR ── */
.print-bar{
  background:${accentLight};
  border-bottom:1px solid ${accentBorder};
  padding:10px 40px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}
.print-hint{ font-size:8pt; color:${BRAND.slate}; }
.print-btn{
  display:flex; align-items:center; gap:7px;
  background:${accentColor}; color:#fff;
  border:none; padding:8px 22px;
  border-radius:40px; font-size:8.5pt; font-weight:700;
  letter-spacing:0.06em; cursor:pointer;
  font-family:'DM Sans',sans-serif;
}
.print-btn:hover{ opacity:0.88; }

/* ── BODY ── */
.body{padding:36px 40px 48px}

/* ── SECTION ── */
.section{margin-bottom:32px}
.section-hdr{
  display:flex; align-items:baseline; gap:12px;
  border-bottom:2px solid ${BRAND.forest};
  padding-bottom:8px; margin-bottom:18px;
}
.section-num{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:9pt; font-weight:normal;
  color:${accentColor};
  letter-spacing:0.18em;
  text-transform:uppercase;
  flex-shrink:0;
  padding-top:3px;
}
.section-title{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:13.5pt;
  font-weight:normal;
  color:${BRAND.forest};
  letter-spacing:0.03em;
  line-height:1.2;
}

/* ── OVERVIEW GRID ── */
.overview-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}
.ov-card{
  background:${BRAND.parchment};
  border:1px solid ${BRAND.mist};
  border-radius:8px;
  padding:14px 16px;
  position:relative;
  overflow:hidden;
}
.ov-card::before{
  content:'';
  position:absolute;
  top:0; left:0;
  width:3px; height:100%;
  background:${accentColor};
  border-radius:8px 0 0 8px;
}
.ov-label{
  font-size:7pt; font-weight:700;
  color:${accentColor};
  text-transform:uppercase; letter-spacing:0.12em;
  margin-bottom:5px;
}
.ov-val{
  font-size:9pt;
  color:${BRAND.charcoal};
  line-height:1.5;
}

/* ── STAGE BOX ── */
.stage-box{
  display:grid;
  grid-template-columns:auto 1fr;
  gap:0;
  border:1px solid ${accentBorder};
  border-radius:10px;
  overflow:hidden;
}
.stage-accent{
  width:6px;
  background:${accentColor};
}
.stage-inner{
  padding:16px 20px;
  background:${accentLight};
}
.stage-kicker{
  font-size:7pt; font-weight:700;
  color:${accentColor};
  text-transform:uppercase; letter-spacing:0.12em;
  margin-bottom:5px;
}
.stage-pill{
  display:inline-block;
  background:${BRAND.forest}; color:#fff;
  font-size:7.5pt; font-weight:700;
  padding:2px 10px; border-radius:4px;
  letter-spacing:0.05em;
  margin-bottom:8px;
}
.stage-text{
  font-size:9.5pt; color:${BRAND.charcoal};
  line-height:1.55; margin-bottom:10px;
}
.starters{display:flex; flex-wrap:wrap; gap:6px; margin-top:2px}
.starter{
  background:${accentColor}; color:#fff;
  font-size:8pt; font-style:italic;
  padding:3px 11px; border-radius:40px;
}

/* ── EXHIBIT TABLE ── */
.ex-table{
  width:100%; border-collapse:collapse;
  font-size:9pt; border:1px solid ${BRAND.mist};
  border-radius:8px; overflow:hidden;
}
.ex-table thead tr{
  background:${BRAND.forest}; color:#fff;
}
.ex-table th{
  padding:9px 12px; text-align:left;
  font-size:7.5pt; font-weight:700;
  letter-spacing:0.1em; text-transform:uppercase;
}
.ex-table td{ padding:8px 12px; border-bottom:1px solid ${BRAND.mist}; vertical-align:top }
.ex-table tbody tr:last-child td{ border-bottom:none }
.ex-table tbody tr:nth-child(even){ background:${BRAND.parchment} }
.ex-table tbody tr:nth-child(odd) { background:#fff }
.t-num  { width:36px; color:${BRAND.slate}; font-size:8pt; font-weight:700; font-variant-numeric:tabular-nums }
.t-name { width:165px; font-weight:600; color:${BRAND.forest} }
.t-focus{ color:${BRAND.charcoal} }
.t-tags       { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:5px }
.t-tag        { display:inline-block; color:#fff; font-size:7pt; font-weight:700; letter-spacing:0.05em; padding:2px 8px; border-radius:40px }
.t-focus-main { display:block; font-size:8.5pt; color:${BRAND.charcoal}; line-height:1.45 }
.t-focus-obs  { display:block; font-size:7.5pt; color:${BRAND.slate}; margin-top:3px; font-style:italic }

/* ── OUTCOMES ── */
.outcomes-list{ display:flex; flex-direction:column; gap:8px }
.outcome-row{ display:flex; align-items:flex-start; gap:10px }
.outcome-code{
  flex-shrink:0; color:#fff;
  font-size:7.5pt; font-weight:800;
  font-family:'DM Sans', monospace;
  padding:3px 9px; border-radius:5px;
  letter-spacing:0.03em; margin-top:1px;
}
.outcome-desc{ font-size:9pt; color:${BRAND.charcoal}; line-height:1.5 }

/* ── DOMAIN CARDS ── */
.domain-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px }
.domain-card{ border:1px solid ${BRAND.mist}; border-radius:10px; overflow:hidden }
.domain-hd{
  padding:12px 14px; color:#fff;
  display:flex; align-items:center; gap:10px;
}
.domain-icon{
  width:28px; height:28px; border-radius:50%;
  background:rgba(255,255,255,0.2);
  display:flex; align-items:center; justify-content:center;
  font-size:11pt; font-weight:800; flex-shrink:0;
}
.domain-name{ font-size:9.5pt; font-weight:700; line-height:1.2 }
.domain-pts { font-size:7.5pt; opacity:0.8; margin-top:1px }
.domain-body{ padding:12px 14px; background:#fff }
.domain-q{ font-size:8pt; color:${BRAND.slate}; font-style:italic; margin-bottom:9px; line-height:1.4 }
.domain-ul{ padding-left:14px; margin-bottom:10px }
.domain-ul li{ font-size:8.5pt; color:${BRAND.charcoal}; margin-bottom:3px; line-height:1.4 }
.bands{ display:flex; flex-direction:column; gap:5px; border-top:1px solid ${BRAND.mist}; padding-top:9px }
.band{ display:flex; align-items:flex-start; gap:7px; font-size:8pt; line-height:1.35 }
.dot{ width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:2px }
.b-full { color:#065F46 }
.b-part { color:#78350F }
.b-min  { color:#7F1D1D }

/* ── PORTAL ── */
.portal-list{ display:flex; flex-direction:column; gap:0 }
.portal-row{
  display:flex; align-items:flex-start; gap:16px;
  padding:13px 0; border-bottom:1px solid ${BRAND.mist};
}
.portal-row:last-child{ border-bottom:none }
.portal-num{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:15pt; font-weight:normal;
  letter-spacing:0.04em; flex-shrink:0;
  line-height:1; padding-top:2px; min-width:32px;
}
.portal-title{ font-size:10pt; font-weight:700; color:${BRAND.forest}; margin-bottom:3px }
.portal-body { font-size:8.5pt; color:${BRAND.charcoal}; line-height:1.55 }

/* ── SCORING INTRO BOX ── */
.scoring-intro{
  background:${BRAND.parchment};
  border:1px solid ${BRAND.mist};
  border-radius:8px; padding:13px 16px;
  font-size:9pt; color:${BRAND.charcoal};
  line-height:1.55; margin-bottom:16px;
}
.scoring-intro strong{ color:${BRAND.forest} }

/* ── FOOTER ── */
.ftr{
  background:${BRAND.forest};
  padding:16px 40px;
  display:flex; align-items:center; justify-content:space-between;
}
.ftr-left{ display:flex; align-items:center; gap:14px }
.ftr-logo{ height:28px; width:auto; opacity:0.85 }
.ftr-divider{ width:1px; height:22px; background:rgba(168,196,178,0.3) }
.ftr-name{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:10pt; font-weight:normal;
  color:#fff; letter-spacing:0.05em;
}
.ftr-right{ text-align:right; font-size:7.5pt; color:${BRAND.sage}; line-height:1.55 }

/* ── PRINT ── */
@media print{
  body{ background:#fff }
  .page{ max-width:none; box-shadow:none }
  .print-bar{ display:none!important }
  .top-stripe,.hdr,.meta-bar,.ftr,
  .domain-hd,.ex-table thead tr,
  .ov-card::before,.stage-accent,
  .hdr-subject,.outcome-code,.starter,.stage-pill,
  .portal-num{
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  }
  .section{ page-break-inside:avoid }
  .domain-card{ page-break-inside:avoid }
  .portal-row{ page-break-inside:avoid }
}
</style>
</head>
<body>
<div class="page">

  <!-- Accent stripe -->
  <div class="top-stripe"></div>

  <!-- Header -->
  <div class="hdr">
    <div class="hdr-left">
      <img src="${origin}/images/tracka-logo-white.png" alt="Taronga" class="hdr-logo">
      <div class="hdr-divider"></div>
      <div>
        <div class="hdr-wordmark">Taronga Tracka</div>
        <div class="hdr-tagline">Teacher Information Sheet</div>
      </div>
    </div>
    <div class="hdr-right">
      <span class="hdr-subject">${subjectLabel}</span>
      <span class="hdr-stage">${stageMeta?.label || 'Stage ' + stage}</span>
    </div>
  </div>

  <!-- Meta bar -->
  <div class="meta-bar">
    <div class="meta-item"><span class="meta-dot"></span> ${subjectLabel} · Stage ${stage} · ${stageMeta?.label || ''}</div>
    <div class="meta-item"><span class="meta-dot"></span> NSW Curriculum Aligned · ${isScience ? 'Science 7–10 (2023) / Science & Technology K–6 (2017)' : isMaths ? 'Mathematics K–10 (2022)' : isPdhpe ? 'PDHPE K–6 (2024) / PDHPE 7–10 (2024)' : 'English K–10 (2022)'}</div>
    <div class="meta-item"><span class="meta-dot"></span> Prepared ${today}</div>
  </div>

  <!-- Print bar -->
  <div class="print-bar">
    <span class="print-hint">Share with your teaching team or File › Print to save as PDF.</span>
    <button class="print-btn" onclick="window.print()">
      ${svgDownloadIcon()}
      Print / Save as PDF
    </button>
  </div>

  <div class="body">

    <!-- 01 About -->
    <div class="section">
      <div class="section-hdr">
        <span class="section-num">01</span>
        <span class="section-title">About This Activity</span>
      </div>
      <div class="overview-grid">
        <div class="ov-card">
          <div class="ov-label">Platform</div>
          <div class="ov-val">Taronga Tracka is a structured field-learning tool for zoo-based excursions. Students log in with a shared class code and complete activities independently at each exhibit on their own device.</div>
        </div>
        <div class="ov-card">
          <div class="ov-label">Subject Focus</div>
          <div class="ov-val">${isScience
            ? 'Science - animal biology, ecology, adaptations and scientific investigation skills applied in a live field setting.'
            : isMaths
            ? 'Mathematics - real-world numeracy: data collection, operations, algebraic reasoning and statistical thinking in zoo context.'
            : isPdhpe
            ? 'PDHPE - health behaviours, body systems, identity, wellbeing and physical activity applied through animal observation in a real-world field setting.'
            : 'English - language analysis, vocabulary, literary devices and text response skills applied through structured animal observation.'}</div>
        </div>
        <div class="ov-card">
          <div class="ov-label">At Each Exhibit</div>
          <div class="ov-val">${isScience
            ? '① Students complete a written observation task scored across 3 domains. ② Students answer a 3-question multiple choice quiz on animal biology and ecology.'
            : isMaths
            ? '① Students solve a maths clue or puzzle linking to the next exhibit. ② Students complete a 3-question maths quiz using animal data. ③ At Blue Mountains: data collection (sound tally) + written response.'
            : isPdhpe
            ? '① Students complete a written observation task connecting the animal to a PDHPE health concept, scored across 3 domains. ② Students answer a 3-question multiple choice quiz on health, physical activity and wellbeing.'
            : '① Students complete a written observation task applying language and literacy skills, scored across 3 domains. ② Students answer a 3-question multiple choice quiz on vocabulary, language devices and text analysis.'}</div>
        </div>
        <div class="ov-card">
          <div class="ov-label">Assessment &amp; Scoring</div>
          <div class="ov-val">AI-assisted scoring with full teacher override. Results visible in real-time on the Teacher Portal. <strong>Observation: 15 pts</strong> (5 pts × 3 domains). <strong>Quiz: 20 pts</strong> per correct first-attempt answer.</div>
        </div>
      </div>
    </div>

    <!-- 02 Stage expectations -->
    <div class="section">
      <div class="section-hdr">
        <span class="section-num">02</span>
        <span class="section-title">Observation Writing - Stage ${stage} Expectations</span>
      </div>
      <div class="stage-box">
        <div class="stage-accent"></div>
        <div class="stage-inner">
          <div class="stage-kicker">Minimum response length</div>
          <span class="stage-pill">≥ ${stageMeta?.minWords || 10} words</span>
          <p class="stage-text">${stageMeta?.expectation || ''}</p>
          <div class="stage-kicker" style="margin-top:2px">Suggested sentence starters - display or read to students before the task</div>
          <div class="starters">
            ${(stageMeta?.starters || []).map(s => `<span class="starter">${s}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 03 Exhibits -->
    <div class="section">
      <div class="section-hdr">
        <span class="section-num">03</span>
        <span class="section-title">Exhibits &amp; Learning Focus</span>
      </div>
      <table class="ex-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Exhibit</th>
            <th>Syllabus Links · Stage ${stage} Focus · Observation Task</th>
          </tr>
        </thead>
        <tbody>${exhibitRows}</tbody>
      </table>
    </div>

    <!-- 04 Outcomes -->
    <div class="section">
      <div class="section-hdr">
        <span class="section-num">04</span>
        <span class="section-title">NSW Curriculum Outcomes Assessed</span>
      </div>
      <div class="outcomes-list">
        ${outcomeRows || '<p style="font-size:9pt;color:#888">No outcomes available for this selection.</p>'}
      </div>
    </div>

    <!-- 05 Scoring -->
    <div class="section">
      <div class="section-hdr">
        <span class="section-num">05</span>
        <span class="section-title">How Responses Are Scored</span>
      </div>
      <div class="scoring-intro">
        Each written observation is scored across <strong>three domains</strong> (5 points each = 15 points total per exhibit). Scores are generated automatically and can be reviewed and overridden by the teacher at any time in the portal.
      </div>
      <div class="domain-grid">${domainCards}</div>
    </div>

    <!-- 06 Portal -->
    <div class="section">
      <div class="section-hdr">
        <span class="section-num">06</span>
        <span class="section-title">Analysing Data in the Teacher Portal</span>
      </div>
      <div class="portal-list">${portalRows}</div>
    </div>

  </div><!-- /body -->

  <!-- Footer -->
  <div class="ftr">
    <div class="ftr-left">
      <img src="${origin}/images/tracka-logo-white.png" alt="Taronga" class="ftr-logo">
      <div class="ftr-divider"></div>
      <span class="ftr-name">Taronga Tracka</span>
    </div>
    <div class="ftr-right">
      ${subjectLabel} · Stage ${stage}<br>
      taronga.org.au · Education Programs
    </div>
  </div>

</div><!-- /page -->
</body>
</html>`;

  const blob = new Blob([html], { type:'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
}
