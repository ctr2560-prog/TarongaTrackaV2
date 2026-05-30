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
  const isScience    = subject === 'science';
  const subjectLabel = isScience ? 'Science' : 'Mathematics';
  const accentColor  = isScience ? BRAND.mid       : BRAND.mathsBlue;
  const accentLight  = isScience ? BRAND.foam       : BRAND.mathsBg;
  const accentBorder = isScience ? BRAND.mist       : BRAND.mathsBorder;
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
  background:linear-gradient(90deg, ${accentColor} 0%, ${isScience ? BRAND.eucalyptus : '#0ea5e9'} 100%);
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
      <img src="${origin}/images/logo.png" alt="Taronga" class="hdr-logo">
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
    <div class="meta-item"><span class="meta-dot"></span> NSW Curriculum Aligned · ${isScience ? 'Science 7–10 (2023) / Science & Technology K–6 (2017)' : 'Mathematics K–10 (2022)'}</div>
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
            : 'Mathematics - real-world numeracy: data collection, operations, algebraic reasoning and statistical thinking in zoo context.'}</div>
        </div>
        <div class="ov-card">
          <div class="ov-label">At Each Exhibit</div>
          <div class="ov-val">${isScience
            ? '① Students complete a written observation task scored across 3 domains. ② Students answer a 3-question multiple choice quiz on animal biology and ecology.'
            : '① Students solve a maths clue or puzzle linking to the next exhibit. ② Students complete a 3-question maths quiz using animal data. ③ At Blue Mountains: data collection (sound tally) + written response.'}</div>
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
      <img src="${origin}/images/logo.png" alt="Taronga" class="ftr-logo">
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
