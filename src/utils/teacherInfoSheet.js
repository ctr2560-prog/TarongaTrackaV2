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

export const EXHIBITS = {
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
    {
      name: 'Concert Lawn',
      obs:  'Habitat detective - sensory observation comparing the natural lawn environment with the city skyline',
      focusByStage: {
        1: 'Exploring an outdoor environment with the senses; noticing living and non-living things',
        2: 'Comparing natural and built environments; features that support living things',
        3: 'Comparing environments - how natural and urban spaces meet the needs of living things',
        4: 'Habitat comparison; biotic and abiotic factors across natural and built environments',
        5: 'Urban ecology; evaluating human impact and ecosystem services in contrasting environments',
      },
      tagsByStage: {
        1: ['Living World', 'Senses', 'Environments'],
        2: ['Habitats', 'Built Environments', 'Observation'],
        3: ['Ecosystems', 'Habitats', 'Human Impact'],
        4: ['Ecosystems', 'Abiotic Factors', 'Human Impact'],
        5: ['Urban Ecology', 'Human Impact', 'Ecosystem Services'],
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
  english: [
    {
      name: 'Chimpanzee',
      obs:  'Creative story writing - narrative with conflict, characters, setting and resolution built from behaviour graph data',
      focusByStage: {
        1: 'Simple story writing; naming a character, a problem and an ending',
        2: 'Narrative structure - beginning, middle and end built around a conflict',
        3: 'Developing setting, conflict and a satisfying resolution in a short narrative',
        4: 'Character development and theme; grounding narrative conflict in observed data',
        5: 'Crafting narrative tension and resolution to explore deeper themes of survival and hierarchy',
      },
      tagsByStage: {
        1: ['Imaginative Writing', 'Characters', 'Story Endings'],
        2: ['Narrative Structure', 'Conflict', 'Imaginative Writing'],
        3: ['Narrative', 'Setting', 'Resolution'],
        4: ['Character', 'Theme', 'Narrative Craft'],
        5: ['Theme', 'Narrative Tension', 'Authorial Choice'],
      },
    },
    {
      name: 'Western Lowland Gorilla',
      obs:  'Finish the story - writing a narrative ending grounded in live observation of the gorilla group',
      focusByStage: {
        1: 'Completing a story ending using what students can see right now',
        2: 'Writing story endings informed by observed animal behaviour',
        3: 'Using real observation to make narrative endings authentic and believable',
        4: 'Integrating specific observed detail (posture, movement, distance) into narrative endings',
        5: 'Writing endings that reflect observed social dynamics; resisting neat resolutions',
      },
      tagsByStage: {
        1: ['Story Endings', 'Observation', 'Imaginative Writing'],
        2: ['Narrative', 'Observation', 'Story Endings'],
        3: ['Narrative Craft', 'Authenticity', 'Observation'],
        4: ['Show Don\'t Tell', 'Narrative Detail', 'Observation'],
        5: ['Narrative Craft', 'Realism', 'Authorial Choice'],
      },
    },
    {
      name: 'African Lion',
      obs:  'Describing the eyes - figurative description using colour, comparison and imagery',
      focusByStage: {
        1: 'Colour words and simple comparisons - "the lion\'s eyes are like…"',
        2: 'Precise word choice; building comparisons with "like" or "as"',
        3: 'Layering imagery - colour, comparison and the feeling it creates',
        4: 'Explaining the effect imagery creates for the reader',
        5: 'Varying imagery deliberately; analysing how word choice positions the reader',
      },
      tagsByStage: {
        1: ['Describing Words', 'Comparison', 'Imagery'],
        2: ['Word Choice', 'Simile', 'Imagery'],
        3: ['Imagery', 'Figurative Language', 'Mood'],
        4: ['Imagery', 'Effect on Reader', 'Word Choice'],
        5: ['Imagery', 'Reader Positioning', 'Connotation'],
      },
    },
    {
      name: 'Giraffe',
      obs:  'Simile writing - crafting and explaining comparisons for the giraffe\'s height and movement',
      focusByStage: {
        1: 'Introducing similes - comparing using "like" or "as"',
        2: 'Writing similes and identifying what the two things have in common',
        3: 'Choosing accurate, vivid similes and explaining the choice',
        4: 'Analysing the effect a simile creates for the reader',
        5: 'Evaluating simile effectiveness - accuracy, vividness and intended effect',
      },
      tagsByStage: {
        1: ['Simile', 'Comparison', 'Describing Words'],
        2: ['Simile', 'Comparison', 'Word Choice'],
        3: ['Simile', 'Figurative Language', 'Justification'],
        4: ['Simile', 'Effect on Reader', 'Figurative Language'],
        5: ['Figurative Language', 'Evaluation', 'Reader Positioning'],
      },
    },
    {
      name: 'Sumatran Tiger',
      obs:  'Loss writing - responding to a passage about extinction and connecting it to the tiger in front of them',
      focusByStage: {
        1: 'Writing simple sentences that borrow a word or idea from a read passage',
        2: 'Connecting ideas from a passage to direct observation',
        3: 'Referring to a text - using a word, phrase or idea as evidence in writing',
        4: 'Quoting and integrating textual evidence to support a written response',
        5: 'Synthesising textual reference and observation in a controlled, reflective piece',
      },
      tagsByStage: {
        1: ['Responding to Texts', 'Vocabulary', 'Observation'],
        2: ['Responding to Texts', 'Making Connections', 'Evidence'],
        3: ['Textual Reference', 'Evidence', 'Responding to Texts'],
        4: ['Textual Evidence', 'Quotation', 'Analysis'],
        5: ['Synthesis', 'Textual Evidence', 'Reflective Writing'],
      },
    },
    {
      name: 'Koala',
      obs:  'Informative writing - building factual texts from exhibit signage',
      focusByStage: {
        1: 'Finding a fact on a sign and rewriting it in their own words',
        2: 'Topic sentences and supporting facts; simple informative structure',
        3: 'Informative text structure - topic sentence, evidence, concluding sentence',
        4: 'Precise factual language - third person, present tense, subject vocabulary',
        5: 'Audience and purpose - analysing how language choices suit the informative text type',
      },
      tagsByStage: {
        1: ['Informative Texts', 'Facts', 'Own Words'],
        2: ['Topic Sentences', 'Informative Texts', 'Facts'],
        3: ['Text Structure', 'Informative Texts', 'Evidence'],
        4: ['Factual Language', 'Text Structure', 'Register'],
        5: ['Audience & Purpose', 'Register', 'Language Analysis'],
      },
    },
    {
      name: 'Dingo',
      obs:  'Warrigal\'s story - first-person perspective writing at a narrative turning point',
      focusByStage: {
        1: 'Describing the dingo and a story character in simple sentences',
        2: 'Connecting a real animal to a story character through description',
        3: 'Writing in first person as a character - voice and feeling',
        4: 'Sensory first-person narration at a story\'s turning point',
        5: 'Using perspective deliberately; reflecting on how it shapes theme',
      },
      tagsByStage: {
        1: ['Describing Words', 'Characters', 'Story'],
        2: ['Making Connections', 'Character', 'Description'],
        3: ['First Person', 'Voice', 'Character Feelings'],
        4: ['Perspective', 'Sensory Language', 'Narrative Craft'],
        5: ['Perspective', 'Theme', 'Reader Positioning'],
      },
    },
    {
      name: 'Ring-tailed Lemur',
      obs:  'Creative story - narrative perspective choice (first vs third person) blending observation and game moments',
      focusByStage: {
        1: 'Choosing "I" or "the lemur" and writing what the animal is doing',
        2: 'Keeping a consistent perspective across a short story',
        3: 'Consistent perspective with sensory detail from observation and experience',
        4: 'Deliberate perspective choice; explaining how it affects the reader',
        5: 'Analysing how narrative perspective constructs reader positioning',
      },
      tagsByStage: {
        1: ['First Person', 'Third Person', 'Story'],
        2: ['Perspective', 'Consistency', 'Narrative'],
        3: ['Perspective', 'Sensory Language', 'Narrative'],
        4: ['Narrative Perspective', 'Effect on Reader', 'Craft'],
        5: ['Reader Positioning', 'Narrative Perspective', 'Analysis'],
      },
    },
    {
      name: 'Sea Lion',
      obs:  'Persuasive techniques - emotive language, rhetorical questions and evidence in conservation writing',
      focusByStage: {
        1: 'Persuasive words - using "must" and "should" to call for action',
        2: 'Emotive language supported by a fact',
        3: 'Combining emotive language, facts and rhetorical questions; naming the techniques',
        4: 'Using and naming multiple persuasive techniques; explaining how each positions the reader',
        5: 'Analysing how rhetorical devices construct argument and position audiences',
      },
      tagsByStage: {
        1: ['Persuasive Writing', 'Modal Verbs', 'Conservation'],
        2: ['Emotive Language', 'Evidence', 'Persuasive Writing'],
        3: ['Persuasive Devices', 'Rhetorical Questions', 'Evidence'],
        4: ['Persuasive Devices', 'Reader Positioning', 'Effect'],
        5: ['Rhetoric', 'Argument', 'Audience'],
      },
    },
    {
      name: 'Asian Water Buffalo',
      obs:  'Buffalo hooves - explanatory description linking observed features to their function',
      focusByStage: {
        1: 'Simple descriptive sentences about an observed feature',
        2: 'Describing a feature and suggesting what it helps the animal do',
        3: 'Structured explanation - description, function, reason',
        4: 'Cause-and-effect explanation connecting feature, function and habitat',
        5: 'Controlled explanatory writing linking observation, function and habitat',
      },
      tagsByStage: {
        1: ['Describing Words', 'Observation', 'Sentences'],
        2: ['Description', 'Explanation', 'Observation'],
        3: ['Explanatory Writing', 'Text Structure', 'Cause & Effect'],
        4: ['Explanation', 'Cause & Effect', 'Precision'],
        5: ['Explanatory Writing', 'Cohesion', 'Precision'],
      },
    },
    {
      name: 'Blue Mountains Bushwalk',
      obs:  'Listening recount - first person, past tense recount of the walk using sensory language and a model text',
      focusByStage: {
        1: 'Recounting what was heard in order, starting with "I heard…"',
        2: 'Recount features - first person, past tense and time connectives',
        3: 'Recount writing with sensory language, guided by a model text',
        4: 'Recount structure (orientation, sequence, reorientation); borrowing techniques from a model text',
        5: 'Analysing how person, tense and sensory detail position the reader in recount writing',
      },
      tagsByStage: {
        1: ['Recount', 'Listening', 'Sequencing'],
        2: ['Recount', 'Past Tense', 'Time Connectives'],
        3: ['Recount', 'Sensory Language', 'Model Texts'],
        4: ['Text Structure', 'Model Texts', 'Technique'],
        5: ['Reader Positioning', 'Language Analysis', 'Recount'],
      },
    },
    {
      name: 'Concert Lawn',
      obs:  'Through the tree\'s eyes - personification writing from the perspective of a century-old tree',
      focusByStage: {
        1: 'Imagining what a tree has seen; simple personification',
        2: 'Giving the tree a human emotion and voice',
        3: 'Personification grounded in real observation of the tree',
        4: 'Consistent voice and perspective; what personification reveals about time and nature',
        5: 'Intentional personification exploring impermanence, memory and the natural world',
      },
      tagsByStage: {
        1: ['Personification', 'Imagination', 'Story'],
        2: ['Personification', 'Voice', 'Feelings'],
        3: ['Personification', 'Observation', 'Figurative Language'],
        4: ['Voice', 'Personification', 'Theme'],
        5: ['Personification', 'Theme', 'Authorial Intent'],
      },
    },
  ],
};

export const SCORING = {
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
  english: {
    domains: [
      {
        label:'Language & Technique', color:'#7C3AED', lightBg:'#F5F3FF', lightBorder:'#DDD6FE', icon:'L',
        what:'Did the student use vivid, deliberate language or the technique named in the task?',
        criteria:[
          'Uses the target technique (simile, personification, emotive language, etc.) appropriately',
          'Word choices are specific and purposeful, not generic',
          'Language suits the audience and purpose of the text type',
        ],
        full:'5 pts - deliberate, effective technique with precise word choice',
        partial:'3 pts - technique attempted but generic or inconsistent',
        minimal:'1 pt - everyday language only, technique missing',
      },
      {
        label:'Structure & Purpose', color:'#0369a1', lightBg:'#EFF6FF', lightBorder:'#BFDBFE', icon:'S',
        what:'Did the response follow the required text type and answer the task?',
        criteria:[
          'Matches the required text type (narrative, recount, informative or persuasive)',
          'Ideas are sequenced logically for that text type',
          'Responds directly to the task prompt and observation',
        ],
        full:'5 pts - clear text-type structure that fully addresses the task',
        partial:'3 pts - partially structured or drifts from the task',
        minimal:'1 pt - unstructured response with little connection to the task',
      },
      {
        label:'Written Expression', color:'#059669', lightBg:'#F0FDF4', lightBorder:'#A7F3D0', icon:'W',
        what:'Did the student write clearly, in complete and controlled sentences?',
        criteria:[
          'Writes in complete sentences with correct punctuation',
          'Maintains a consistent voice, tense and perspective',
          'Uses vocabulary appropriate to their stage of learning',
        ],
        full:'5 pts - fluent, controlled writing with consistent voice',
        partial:'3 pts - ideas communicated but control is inconsistent',
        minimal:'1 pt - ideas difficult to follow or fragmentary',
      },
    ],
  },
};

export const STAGE_EXPECTATIONS = {
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
  english: {
    1: { label:'Stage 1 (Years 1–2)', minWords:3,  expectation:'Students draw or write simple descriptive sentences using the sentence starters provided. Accept labelled drawings alongside written responses.', starters:['I can see…', 'It is like…', 'The animal is…'] },
    2: { label:'Stage 2 (Years 3–4)', minWords:5,  expectation:'Students write 1–2 sentences following the text type modelled in the task (story, description or recount), using at least one descriptive word choice.', starters:['I noticed…', 'It looks like…', 'First… then…'] },
    3: { label:'Stage 3 (Years 5–6)', minWords:8,  expectation:'Students write a short structured response using at least one language technique (simile, emotive word or sensory detail) suited to the text type.', starters:['The animal is like…', 'I heard…', 'This makes me feel…'] },
    4: { label:'Stage 4 (Years 7–8)', minWords:10, expectation:'Students write a controlled response in the required text type, use and name a language technique, and comment on the effect it creates for the reader.', starters:['This creates the effect of…', 'The technique I used is…', 'As the passage describes…'] },
    5: { label:'Stage 5 (Years 9–10)', minWords:12, expectation:'Students craft deliberate, well-structured responses that analyse how language choices position the reader, drawing on both observation and textual evidence.', starters:['This imagery positions the reader to…', 'The choice of… suggests…', 'This is effective because…'] },
  },
};

export const NSW_OUTCOMES = {
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
      { code:'SC4-WS-08',  desc:'Communicates scientific concepts and ideas using a range of communication forms' },
      { code:'SC4-LIV-01', desc:'Describes the role, structure and function of a range of living systems and their components' },
    ],
    5: [
      { code:'SC5-WS-01',  desc:'Selects and uses scientific tools and instruments for accurate observations' },
      { code:'SC5-WS-08',  desc:'Communicates scientific arguments with evidence, using scientific language and terminology in a range of communication forms' },
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
    ],
    3: [
      { code:'MAO-WM-01',   desc:'Develops fluency by exploring and connecting mathematical concepts to solve problems and communicate reasoning' },
      { code:'MA3-DATA-01', desc:'Constructs, interprets and evaluates data displays including dot plots, line graphs and two-way tables' },
      { code:'MA3-FRC-01',  desc:'Compares, orders and calculates with fractions, decimals and percentages' },
    ],
    4: [
      { code:'MAO-WM-01',    desc:'Reasons, communicates and solves problems using mathematical concepts, skills and techniques' },
      { code:'MA4-RAT-C-01', desc:'Solves problems involving ratios and rates, and explores their graphical representation' },
      { code:'MA4-STA-C-01', desc:'Classifies and displays data using a variety of statistical representations and interprets results' },
    ],
    5: [
      { code:'MAO-WM-01',    desc:'Selects and applies appropriate mathematical techniques to reason, communicate and solve problems' },
      { code:'MA5-RAT-C-01', desc:'Applies ratios and rates to solve problems including financial mathematics and similar figures' },
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
      { code:'PH4-SHP-01', desc:'Plans for and uses strategies to participate in activities that encourage safety, health and lifelong physical activity' },
      { code:'PH4-SHW-01', desc:'Assesses the influence of contextual factors on attitudes and behaviours to propose strategies that enhance safety, health and wellbeing' },
      { code:'PH4-IBC-01', desc:'Investigates and explains factors that shape identity and sense of belonging' },
    ],
    5: [
      { code:'PH5-SHP-01', desc:'Designs, implements and evaluates plans to enhance safety, health and participation in lifelong physical activity' },
      { code:'PH5-SHW-01', desc:'Analyses the interrelationship between contextual factors, attitudes and behaviours to promote safety, health and wellbeing' },
      { code:'PH5-IBC-01', desc:'Analyses how identity and a sense of belonging contribute to the health and wellbeing of individuals and communities' },
    ],
  },
  english: {
    1: [
      { code:'EN1-CWT-01',   desc:'Plans, creates and revises texts written for different purposes, including paragraphs, using knowledge of vocabulary, text features and sentence structure' },
      { code:'EN1-UARL-01',  desc:'Understands and responds to literature by creating texts using similar structures, intentional language choices and features appropriate to audience and purpose' },
    ],
    2: [
      { code:'EN2-CWT-01',   desc:'Plans, creates and revises written texts for imaginative purposes, using text features, sentence-level grammar, punctuation and word-level language for effect' },
      { code:'EN2-CWT-02',   desc:'Plans, creates and revises written texts for informative purposes, using text features, sentence-level grammar, punctuation and word-level language for effect' },
      { code:'EN2-UARL-01',  desc:'Identifies and describes how ideas are represented in literature and strategically uses similar representations in their own texts' },
    ],
    3: [
      { code:'EN3-CWT-01',   desc:'Plans, creates and revises written texts for multiple purposes and audiences through selection of text features, sentence-level grammar, punctuation and word-level language' },
      { code:'EN3-UARL-01',  desc:'Analyses representations of ideas in literature through narrative, character, imagery, symbol and connotation, and adapts these representations when creating texts' },
      { code:'EN3-UARL-02',  desc:'Analyses representations of ideas in literature through genre and theme that reflect perspective and context, argument and authority, and adapts these representations when creating texts' },
    ],
    4: [
      { code:'EN4-URA-01',   desc:'Analyses how meaning is created through the use and interpretation of increasingly complex language forms, features and structures' },
      { code:'EN4-URB-01',   desc:'Examines and explains how texts represent ideas, experiences and values' },
      { code:'EN4-ECA-01',   desc:'Creates personal, creative and critical texts for a range of audiences by using linguistic and stylistic conventions of language to express ideas' },
    ],
    5: [
      { code:'EN5-URA-01',   desc:'Analyses how meaning is created through the use and interpretation of complex language forms, features and structures' },
      { code:'EN5-URB-01',   desc:'Evaluates how texts represent ideas and experiences, and how they can affirm or challenge values and attitudes' },
      { code:'EN5-ECA-01',   desc:'Crafts personal, creative and critical texts for a range of audiences by experimenting with and controlling language forms and features to shape meaning' },
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
  const resolvedOutcomes = (NSW_OUTCOMES[subject]?.[parseInt(stage, 10)] || outcomes || []).slice(0, 3);
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
    const tagHtml = tags.map(t => `<span class="t-tag">${t}</span>`).join('');
    return `
    <div class="ex-row">
      <div class="ex-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="ex-main">
        <div class="ex-name">${e.name}</div>
        <div class="ex-focus">${focus}</div>
        ${e.obs ? `<div class="ex-task">Task: ${e.obs}</div>` : ''}
        <div class="ex-tags">${tagHtml}</div>
      </div>
    </div>`;
  }).join('');

  const outcomeRows = resolvedOutcomes.map(o => `
    <div class="outcome-row">
      <span class="outcome-code">${o.code}</span>
      <span class="outcome-desc">${o.desc}</span>
    </div>`).join('');

  const domainCards = scoring.domains.map(d => `
    <div class="domain-card">
      <div class="domain-hd">
        <span class="domain-icon">${d.icon}</span>
        <div>
          <div class="domain-name">${d.label}</div>
          <div class="domain-pts">5 points</div>
        </div>
      </div>
      <p class="domain-q">${d.what}</p>
      <ul class="domain-ul">
        ${d.criteria.map(c => `<li>${c}</li>`).join('')}
      </ul>
      <div class="bands">
        <div class="band"><span class="dot" style="background:#059669"></span><span>${d.full}</span></div>
        <div class="band"><span class="dot" style="background:#D97706"></span><span>${d.partial}</span></div>
        <div class="band"><span class="dot" style="background:#DC2626"></span><span>${d.minimal}</span></div>
      </div>
    </div>`).join('');

  const portalRows = PORTAL_GUIDE.map(g => `
    <div class="portal-row">
      <div class="portal-num">${g.num}</div>
      <div class="portal-content">
        <div class="portal-title">${g.heading}</div>
        <div class="portal-body">${g.body}</div>
      </div>
    </div>`).join('');

  const syllabusLabel = isScience
    ? 'Science 7–10 (2023) / Science & Technology K–6 (2017)'
    : isMaths ? 'Mathematics K–10 (2022)'
    : isPdhpe ? 'PDHPE K–6 (2024) / PDHPE 7–10 (2024)'
    : 'English K–10 (2022)';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Taronga Tracka Teacher Information Sheet: ${subjectLabel} Stage ${stage}</title>
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
  line-height:1.65;
  color:${BRAND.ink};
  background:#EDEAE3;
  -webkit-font-smoothing:antialiased;
}

.page{
  max-width:820px;
  margin:32px auto;
  background:#fff;
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 24px 80px rgba(7,30,20,0.16);
}

/* ── HEADER ── */
.hdr{
  background:${BRAND.forest};
  padding:44px 52px 0;
  position:relative;
  overflow:hidden;
}
.hdr-glow{
  position:absolute;
  top:-120px; right:-100px;
  width:340px; height:340px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(46,125,85,0.4) 0%, transparent 70%);
  pointer-events:none;
}
.hdr-top{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:24px;
  margin-bottom:30px;
  position:relative;
}
.hdr-logo{ height:72px; width:auto; display:block; }
.hdr-right{ text-align:right; flex-shrink:0; padding-top:6px; }
.hdr-subject{
  display:inline-block;
  background:${accentColor};
  color:#fff;
  font-size:8pt;
  font-weight:800;
  letter-spacing:0.16em;
  text-transform:uppercase;
  padding:7px 20px;
  border-radius:40px;
}
.hdr-stage{
  display:block;
  font-size:8.5pt;
  color:${BRAND.mist};
  letter-spacing:0.06em;
  margin-top:9px;
  font-weight:500;
}
.hdr-title{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:25pt;
  font-weight:normal;
  color:#fff;
  letter-spacing:0.03em;
  line-height:1.08;
  position:relative;
}
.hdr-sub{
  font-size:9.5pt;
  color:${BRAND.mist};
  margin-top:8px;
  letter-spacing:0.04em;
  position:relative;
}
.hdr-meta{
  display:flex;
  flex-wrap:wrap;
  gap:8px 26px;
  margin-top:28px;
  padding:16px 0 20px;
  border-top:1px solid rgba(168,196,178,0.22);
  position:relative;
}
.meta-item{
  display:flex; align-items:center; gap:7px;
  font-size:7.5pt;
  color:${BRAND.mist};
  letter-spacing:0.05em;
}
.meta-dot{ width:4px; height:4px; border-radius:50%; background:${accentColor}; flex-shrink:0; }

/* ── PRINT BAR ── */
.print-bar{
  background:${BRAND.parchment};
  border-bottom:1px solid #ECE7DD;
  padding:13px 52px;
  display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.print-hint{ font-size:8pt; color:${BRAND.slate}; }
.print-btn{
  display:flex; align-items:center; gap:8px;
  background:${accentColor}; color:#fff;
  border:none; padding:9px 24px;
  border-radius:40px; font-size:8.5pt; font-weight:700;
  letter-spacing:0.06em; cursor:pointer;
  font-family:'DM Sans',sans-serif;
}
.print-btn:hover{ opacity:0.88; }

/* ── BODY ── */
.body{ padding:52px 52px 56px; }

/* ── SECTION ── */
.section{ margin-bottom:46px; }
.section:last-child{ margin-bottom:0; }
.sec-kicker{
  font-size:7pt; font-weight:800;
  color:${accentColor};
  text-transform:uppercase;
  letter-spacing:0.24em;
  margin-bottom:7px;
}
.sec-title{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:16.5pt;
  font-weight:normal;
  color:${BRAND.forest};
  letter-spacing:0.02em;
  line-height:1.15;
}
.sec-rule{
  width:44px; height:3px;
  background:${accentColor};
  border-radius:2px;
  margin:12px 0 22px;
}

/* ── OVERVIEW ── */
.overview-grid{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.ov-card{
  background:${BRAND.parchment};
  border-radius:14px;
  padding:20px 22px;
}
.ov-label{
  font-size:7pt; font-weight:800;
  color:${accentColor};
  text-transform:uppercase; letter-spacing:0.16em;
  margin-bottom:8px;
}
.ov-val{ font-size:9pt; color:${BRAND.charcoal}; line-height:1.65; }
.ov-val strong{ color:${BRAND.forest}; }

/* ── STAGE ── */
.stage-box{
  background:${accentLight};
  border-radius:16px;
  padding:24px 28px;
  display:grid;
  grid-template-columns:auto 1fr;
  gap:26px;
  align-items:start;
}
.stage-stat{
  text-align:center;
  padding:4px 26px 4px 2px;
  border-right:1px solid ${accentBorder};
}
.stage-stat-num{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:23pt;
  color:${accentColor};
  line-height:1;
  white-space:nowrap;
}
.stage-stat-label{
  font-size:6.5pt; font-weight:800;
  color:${BRAND.slate};
  text-transform:uppercase; letter-spacing:0.14em;
  margin-top:7px;
}
.stage-text{ font-size:9.5pt; color:${BRAND.charcoal}; line-height:1.65; margin-bottom:14px; }
.stage-kicker{
  font-size:7pt; font-weight:800;
  color:${accentColor};
  text-transform:uppercase; letter-spacing:0.14em;
  margin-bottom:8px;
}
.starters{ display:flex; flex-wrap:wrap; gap:7px; }
.starter{
  background:#fff;
  color:${accentColor};
  border:1px solid ${accentBorder};
  font-size:8pt; font-style:italic;
  padding:4px 14px; border-radius:40px;
}

/* ── EXHIBITS ── */
.ex-list{ display:flex; flex-direction:column; }
.ex-row{
  display:flex; gap:20px;
  padding:16px 0;
  border-bottom:1px solid #F0EDE6;
}
.ex-row:first-child{ padding-top:2px; }
.ex-row:last-child{ border-bottom:none; padding-bottom:2px; }
.ex-num{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:11pt;
  color:${accentColor};
  min-width:32px;
  line-height:1.35;
  flex-shrink:0;
}
.ex-main{ flex:1; }
.ex-name{ font-size:10pt; font-weight:700; color:${BRAND.forest}; margin-bottom:3px; }
.ex-focus{ font-size:8.5pt; color:${BRAND.charcoal}; line-height:1.6; }
.ex-task{ font-size:8pt; color:${BRAND.slate}; font-style:italic; margin-top:3px; }
.ex-tags{ display:flex; flex-wrap:wrap; gap:5px; margin-top:8px; }
.t-tag{
  background:${accentLight};
  color:${accentColor};
  border:1px solid ${accentBorder};
  font-size:6.5pt; font-weight:700;
  letter-spacing:0.06em; text-transform:uppercase;
  padding:2px 10px; border-radius:40px;
}

/* ── OUTCOMES ── */
.outcomes-list{ display:flex; flex-direction:column; gap:10px; }
.outcome-row{ display:flex; align-items:flex-start; gap:13px; }
.outcome-code{
  flex-shrink:0;
  background:${accentLight};
  color:${accentColor};
  border:1px solid ${accentBorder};
  font-size:7.5pt; font-weight:800;
  padding:3px 11px; border-radius:6px;
  letter-spacing:0.04em;
  margin-top:2px;
  font-variant-numeric:tabular-nums;
}
.outcome-desc{ font-size:9pt; color:${BRAND.charcoal}; line-height:1.6; }

/* ── SCORING ── */
.scoring-intro{
  font-size:9.5pt; color:${BRAND.charcoal};
  line-height:1.65;
  max-width:660px;
  margin-bottom:20px;
}
.scoring-intro strong{ color:${BRAND.forest}; }
.domain-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.domain-card{
  background:#fff;
  border:1px solid #ECE8E0;
  border-radius:16px;
  padding:18px;
}
.domain-hd{ display:flex; align-items:center; gap:11px; margin-bottom:13px; }
.domain-icon{
  width:34px; height:34px; border-radius:11px;
  background:${accentLight};
  color:${accentColor};
  border:1px solid ${accentBorder};
  display:flex; align-items:center; justify-content:center;
  font-size:11pt; font-weight:800; flex-shrink:0;
}
.domain-name{ font-size:9.5pt; font-weight:800; color:${BRAND.forest}; line-height:1.2; }
.domain-pts{ font-size:6.5pt; font-weight:700; color:${BRAND.slate}; text-transform:uppercase; letter-spacing:0.1em; margin-top:2px; }
.domain-q{ font-size:8pt; color:${BRAND.slate}; font-style:italic; margin-bottom:10px; line-height:1.5; }
.domain-ul{ padding-left:15px; margin-bottom:12px; }
.domain-ul li{ font-size:8.5pt; color:${BRAND.charcoal}; margin-bottom:4px; line-height:1.5; }
.bands{ display:flex; flex-direction:column; gap:6px; border-top:1px solid #F0EDE6; padding-top:11px; }
.band{ display:flex; align-items:flex-start; gap:8px; font-size:8pt; color:${BRAND.charcoal}; line-height:1.4; }
.dot{ width:7px; height:7px; border-radius:50%; flex-shrink:0; margin-top:3px; }

/* ── PORTAL ── */
.portal-list{ display:flex; flex-direction:column; }
.portal-row{
  display:flex; align-items:flex-start; gap:20px;
  padding:16px 0;
  border-bottom:1px solid #F0EDE6;
}
.portal-row:first-child{ padding-top:2px; }
.portal-row:last-child{ border-bottom:none; padding-bottom:0; }
.portal-num{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:15pt; font-weight:normal;
  color:${accentColor};
  letter-spacing:0.04em; flex-shrink:0;
  line-height:1; padding-top:3px; min-width:34px;
}
.portal-title{ font-size:10pt; font-weight:700; color:${BRAND.forest}; margin-bottom:4px; }
.portal-body{ font-size:8.5pt; color:${BRAND.charcoal}; line-height:1.65; }

/* ── FOOTER ── */
.ftr{
  background:${BRAND.forest};
  padding:24px 52px;
  display:flex; align-items:center; justify-content:space-between;
}
.ftr-left{ display:flex; align-items:center; gap:16px; }
.ftr-logo{ height:34px; width:auto; opacity:0.9; }
.ftr-divider{ width:1px; height:24px; background:rgba(168,196,178,0.3); }
.ftr-name{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:10.5pt; font-weight:normal;
  color:#fff; letter-spacing:0.05em;
}
.ftr-right{ text-align:right; font-size:7.5pt; color:${BRAND.sage}; line-height:1.6; }

/* ── PRINT ── */
@media print{
  body{ background:#fff; }
  .page{ max-width:none; margin:0; border-radius:0; box-shadow:none; }
  .print-bar{ display:none!important; }
  .hdr,.ftr,.hdr-subject,.hdr-glow,
  .sec-rule,.ov-card,.stage-box,
  .t-tag,.outcome-code,.starter,
  .domain-icon,.dot,.meta-dot{
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  }
  .section{ page-break-inside:avoid; }
  .domain-card{ page-break-inside:avoid; }
  .portal-row{ page-break-inside:avoid; }
  .ex-row{ page-break-inside:avoid; }
}
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="hdr">
    <div class="hdr-glow"></div>
    <div class="hdr-top">
      <img src="${origin}/images/logo.png" alt="Taronga Tracka" class="hdr-logo">
      <div class="hdr-right">
        <span class="hdr-subject">${subjectLabel}</span>
        <span class="hdr-stage">${stageMeta?.label || 'Stage ' + stage}</span>
      </div>
    </div>
    <div class="hdr-title">Teacher Information Sheet</div>
    <div class="hdr-sub">Everything you need to run and assess your Taronga Tracka excursion.</div>
    <div class="hdr-meta">
      <div class="meta-item"><span class="meta-dot"></span> ${subjectLabel} · ${stageMeta?.label || 'Stage ' + stage}</div>
      <div class="meta-item"><span class="meta-dot"></span> NSW Curriculum Aligned · ${syllabusLabel}</div>
      <div class="meta-item"><span class="meta-dot"></span> Prepared ${today}</div>
    </div>
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
      <div class="sec-kicker">Section 01</div>
      <div class="sec-title">About This Activity</div>
      <div class="sec-rule"></div>
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
      <div class="sec-kicker">Section 02</div>
      <div class="sec-title">Observation Writing: Stage ${stage} Expectations</div>
      <div class="sec-rule"></div>
      <div class="stage-box">
        <div class="stage-stat">
          <div class="stage-stat-num">≥ ${stageMeta?.minWords || 10}</div>
          <div class="stage-stat-label">Minimum<br>Words</div>
        </div>
        <div>
          <p class="stage-text">${stageMeta?.expectation || ''}</p>
          <div class="stage-kicker">Suggested sentence starters (display or read to students before the task)</div>
          <div class="starters">
            ${(stageMeta?.starters || []).map(s => `<span class="starter">${s}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 03 Exhibits -->
    <div class="section">
      <div class="sec-kicker">Section 03</div>
      <div class="sec-title">Exhibits &amp; Learning Focus</div>
      <div class="sec-rule"></div>
      <div class="ex-list">${exhibitRows}</div>
    </div>

    <!-- 04 Outcomes -->
    <div class="section">
      <div class="sec-kicker">Section 04</div>
      <div class="sec-title">NSW Curriculum Outcomes Analysed</div>
      <div class="sec-rule"></div>
      <div class="outcomes-list">
        ${outcomeRows || '<p style="font-size:9pt;color:#888">No outcomes available for this selection.</p>'}
      </div>
    </div>

    <!-- 05 Scoring -->
    <div class="section">
      <div class="sec-kicker">Section 05</div>
      <div class="sec-title">How Responses Are Scored</div>
      <div class="sec-rule"></div>
      <div class="scoring-intro">
        Each written observation is scored across <strong>three domains</strong> (5 points each = 15 points total per exhibit). Scores are generated automatically and can be reviewed and overridden by the teacher at any time in the portal.
      </div>
      <div class="domain-grid">${domainCards}</div>
    </div>

    <!-- 06 Portal -->
    <div class="section">
      <div class="sec-kicker">Section 06</div>
      <div class="sec-title">Analysing Data in the Teacher Portal</div>
      <div class="sec-rule"></div>
      <div class="portal-list">${portalRows}</div>
    </div>

  </div><!-- /body -->

  <!-- Footer -->
  <div class="ftr">
    <div class="ftr-left">
      <img src="${origin}/images/logo.png" alt="Taronga Tracka" class="ftr-logo">
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
