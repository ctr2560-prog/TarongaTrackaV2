import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { openAssessmentTaskNotification } from '../utils/assessmentTaskNotification';

const KLAS = [
  { id: 'science',  label: 'Science',  color: '#1A5238', light: '#E8F5EE', border: '#A8D5BB' },
  { id: 'maths',    label: 'Maths',    color: '#0369A1', light: '#E0F0FB', border: '#93C5E8' },
  { id: 'english',  label: 'English',  color: '#7C3AED', light: '#F0EBFD', border: '#C4B0F5' },
  { id: 'pdhpe',    label: 'PDHPE',    color: '#BE185D', light: '#FDE8F3', border: '#F0A0C8' },
];

const STAGE_COLORS = {
  'S2': '#2E7D55',
  'S3': '#0369A1',
  'S4': '#7C3AED',
  'S5': '#BE185D',
};

const FORMAT_COLORS = {
  'Written':              '#1A5238',
  'Creative Writing':     '#7C3AED',
  'Multimodal':           '#D97706',
  'Investigation':        '#0369A1',
  'Report':               '#0369A1',
  'Written / Report':     '#0369A1',
  'Written / Multimodal': '#D97706',
  'Extended Response':    '#BE185D',
  'Reflection / Presentation': '#BE185D',
  'Persuasive Writing':   '#BE185D',
};

// ── Evidence icon SVGs ────────────────────────────────────────────────────────
const IcoChart = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1.5" y="9" width="3" height="6" rx="1"/>
    <rect x="6.5" y="5" width="3" height="10" rx="1"/>
    <rect x="11.5" y="1.5" width="3" height="13.5" rx="1"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M5.5 8.2l2 2 3-3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoDoc = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 2a1 1 0 011-1h5l4 4v9a1 1 0 01-1 1h-8a1 1 0 01-1-1V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9.5 1v4H13.5M5.5 8h5M5.5 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IcoPin = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5C5.52 1.5 3.5 3.52 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.48-2.02-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IcoCalc = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 5.5h6M5 8.5h2M9 8.5h2M5 11.5h2M9 11.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IcoPencil = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9.5 3.5l3 3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IcoQuote = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 3h12a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H9.5L7 14V11H2a.5.5 0 01-.5-.5v-7A.5.5 0 012 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M5 7h6M5 9h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IcoLines = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M2 7.5h12M2 11h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IcoCompare = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 5.5h12M10.5 3l3 2.5-3 2.5M13.5 10.5H1.5M5.5 8l-3 2.5 3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── In-app evidence ───────────────────────────────────────────────────────────
const APP_EVIDENCE = {
  science: [
    { metric: 'Observation Score',  icon: <IcoChart />,   what: 'AI-scored observation across Behaviour, Detail and Writing, each out of 5.' },
    { metric: 'Quiz Result',        icon: <IcoCheck />,   what: 'Stage-differentiated MCQ with the specific distractor chosen recorded.' },
    { metric: 'Written Response',   icon: <IcoDoc />,     what: 'The student\'s own unedited words, portfolio, moderation or report-ready.' },
    { metric: 'Animals Visited',    icon: <IcoPin />,     what: 'Which enclosures the student engaged with, a field study participation log.' },
  ],
  maths: [
    { metric: 'Written Working',    icon: <IcoCalc />,    what: 'Step-by-step working for the stage-matched maths task, method not just answer.' },
    { metric: 'Quiz Result',        icon: <IcoCheck />,   what: 'Calculation MCQ with error-based distractors, reveals the exact misconception.' },
    { metric: 'Score Override',     icon: <IcoPencil />,  what: 'Override the AI score to apply your professional judgement on partial working.' },
  ],
  english: [
    { metric: 'Written Response',          icon: <IcoDoc />,     what: 'Creative or analytical piece using language techniques matched to stage.' },
    { metric: 'Language & Technique Score', icon: <IcoQuote />,  what: 'AI-assessed against stage-appropriate technique use, review alongside text.' },
    { metric: 'Written Expression Score',   icon: <IcoLines />,  what: 'Sentence structure, vocabulary and cohesion, useful as pre/post comparison.' },
    { metric: 'Quiz Result',               icon: <IcoCheck />,   what: 'Metalanguage identification question, tests technique knowledge at stage level.' },
  ],
  pdhpe: [
    { metric: 'Written Response',   icon: <IcoDoc />,     what: 'Connects animal behaviour or anatomy to human health, movement or wellbeing.' },
    { metric: 'Quiz Result',        icon: <IcoCheck />,   what: 'Stage-matched health/movement question, records correct answer and distractor.' },
    { metric: 'Comparison Score',   icon: <IcoCompare />, what: 'How well the student connected animal to human, a proxy for understanding not recall.' },
  ],
};

// ── Post-visit tasks ──────────────────────────────────────────────────────────
const POST_TASKS = {
  science: [
    {
      title: 'Field Report',
      stages: ['S2', 'S3'],
      format: 'Written',
      desc: 'Students revise and extend their in-app observation into a structured field report with heading, observations, explanation and conclusion.',
      appLink: 'Pull the raw response from Class Insights as their starting draft.',
      steps: [
        'Read your original excursion observation carefully — your teacher will give you a copy. This is your first draft.',
        'Plan your field report with four sections: a heading, an introduction (which animal you observed, where and when), an observations section, and a conclusion.',
        'Rewrite and extend your observations — describe what the animal looked like, what it was doing, and what its enclosure was like, using science words.',
        'Explain at least one thing the animal needs to survive and how its body features help it get what it needs.',
        'Finish with a conclusion that sums up the most interesting thing you learned about the animal.',
        'Check your spelling, punctuation and sentences before submitting your final report to your teacher.',
      ],
      criteria: [
        'Write a structured field report with a clear heading, observation section and conclusion',
        'Describe the animal\'s appearance and behaviour using science words appropriate to your stage',
        'Explain at least one thing the animal needs to survive and how its features help it do this',
      ],
      marking: [
        'Produces a well-structured field report with a clear heading, observation section and conclusion. Describes the animal\'s appearance and behaviour with precise, accurate science vocabulary. Explains clearly how the animal\'s features help it survive, using specific evidence from the excursion.',
        'Produces a structured field report with most required sections. Describes the animal\'s appearance and behaviour with relevant science detail. Explains how the animal\'s features help it survive with some supporting evidence.',
        'Produces a report with some structure. Describes observable features of the animal with general detail. Attempts an explanation of the animal\'s needs or adaptations, though the link may be incomplete.',
        'Produces a basic response with limited structure. Describes some features of the animal with minimal science vocabulary. Attempts to address the animal\'s needs but the explanation is unclear or very brief.',
        'Produces a minimal response. Very limited description of the animal and little or no explanation of what it needs to survive.',
      ],
      resources: [
        'Your written observation from the Taronga Tracka app (Class Insights)',
        'Photos or sketches made during the excursion',
        'Field report writing frame (provided by your teacher)',
        'NSW Science & Technology syllabus glossary',
      ],
    },
    {
      title: 'Adaptation Explanation',
      stages: ['S3', 'S4'],
      format: 'Written / Multimodal',
      desc: 'Choose one animal and explain how two adaptations help it survive, using at least one piece of excursion evidence and one from prior knowledge.',
      appLink: 'Behaviour and Detail domain scores give a rubric-ready starting point.',
      steps: [
        'Choose one animal you observed on the excursion and re-read your written observation of it.',
        'Identify two adaptations — a body feature (structural) or a behaviour — that help this animal survive in its environment.',
        'For each adaptation, explain how it works and why the animal needs it, using scientific vocabulary such as structural, behavioural, habitat and survival.',
        'Support your explanation with at least one piece of evidence from your excursion observation and at least one piece from research or prior knowledge.',
        'Present your work as a written explanation, or as a multimodal piece (poster or slides) if your teacher directs, and submit it with your evidence clearly labelled.',
      ],
      criteria: [
        'Identify two adaptations for one animal with clear links to your excursion observation',
        'Explain how each adaptation helps the animal survive using precise scientific vocabulary',
        'Support your explanation with at least one piece of excursion evidence and one piece of prior knowledge',
      ],
      marking: [
        'Identifies two specific, accurate adaptations with precise links to the excursion observation. Explains how each adaptation functions for survival with sophisticated scientific vocabulary and clear reasoning. Integrates excursion evidence and prior knowledge seamlessly.',
        'Identifies two relevant adaptations with clear links to the excursion. Explains how each helps the animal survive with appropriate scientific vocabulary. Includes both excursion evidence and prior knowledge.',
        'Identifies two adaptations with general links to the excursion. Explains how at least one helps the animal survive. Uses some scientific vocabulary. Includes at least one type of evidence.',
        'Identifies one or two adaptations with limited link to the excursion. Explanation of survival function is basic or incomplete. Limited use of scientific vocabulary. Evidence base is weak.',
        'Identifies an adaptation with minimal explanation or link to the excursion. Very limited scientific vocabulary or evidence.',
      ],
      resources: [
        'Your written observation from the Taronga Tracka app (Class Insights)',
        'Behaviour and Detail domain scores as a starting benchmark',
        'NSW Science syllabus glossary of terms',
        'Textbook and teacher-approved research sources',
      ],
    },
    {
      title: 'Ecosystem Relationships',
      stages: ['S4'],
      format: 'Report',
      desc: 'Using dingo food chain mission data, describe feeding relationships and evaluate what would happen if one organism was removed.',
      appLink: 'Dingo quiz result (energy transfer) + written observation = two pieces of evidence.',
      steps: [
        'Review your dingo observation and your quiz result on energy transfer from the excursion.',
        'Map the dingo\'s food chain — identify the producers, consumers, predators and prey, and show the direction of energy transfer.',
        'Describe at least two feeding relationships in the ecosystem, using evidence from your mission data.',
        'Choose one organism in the food chain and evaluate what would happen to the ecosystem if it was removed — trace the effects step by step through the chain.',
        'Write up your work as a structured report with headings (Introduction, Feeding Relationships, Evaluation, Conclusion), using scientific vocabulary throughout.',
      ],
      criteria: [
        'Describe at least two feeding relationships in the dingo\'s ecosystem using evidence from the mission',
        'Evaluate what would happen to the ecosystem if one organism was removed, with justified reasoning',
        'Use scientific vocabulary including producer, consumer, predator, prey and energy transfer throughout',
      ],
      marking: [
        'Accurately describes two or more feeding relationships with specific reference to the dingo mission. Evaluates the ecosystem impact of removing an organism with sophisticated, justified reasoning. Uses scientific vocabulary with precision and fluency throughout.',
        'Accurately describes two feeding relationships with reference to the mission. Explains the ecosystem impact of removing an organism with clear reasoning. Uses appropriate scientific vocabulary consistently.',
        'Describes feeding relationships with some accuracy and mission reference. Explains the impact of removing an organism with general reasoning. Uses some scientific vocabulary.',
        'Describes a feeding relationship with limited accuracy or mission reference. Attempts to explain ecosystem impact but reasoning is unclear. Limited scientific vocabulary used.',
        'Makes a minimal attempt to describe a feeding relationship. Very limited reference to the mission or scientific vocabulary.',
      ],
      resources: [
        'Your written dingo observation from the Taronga Tracka app (Class Insights)',
        'Dingo quiz result (energy transfer question)',
        'NSW Science syllabus — Ecosystem section',
        'Teacher-approved research sources on dingo ecology',
      ],
    },
    {
      title: 'Biodiversity & Conservation Argument',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Construct a scientific argument for why biodiversity matters using conservation facts from across the Tracka missions.',
      appLink: 'Conservation Gallery class submissions can be used as stimulus material.',
      steps: [
        'Gather conservation facts and your written observations from at least two of the animals you studied on the excursion.',
        'Develop a clear thesis statement answering the question: why does biodiversity matter?',
        'Build your argument with at least three supporting points, each backed by evidence from the excursion or your research.',
        'Evaluate one real conservation strategy (for example, a Taronga breeding or recovery program) using data and scientific reasoning — does the evidence show it works?',
        'Structure your extended response with an introduction stating your thesis, body paragraphs developing each point with evidence, and a conclusion that weighs the argument.',
      ],
      criteria: [
        'Construct a scientific argument for the importance of biodiversity using evidence from at least two Tracka missions',
        'Evaluate a conservation strategy with accurate data and scientific reasoning',
        'Structure and communicate your argument using precise biological terminology and logical sequencing',
      ],
      marking: [
        'Constructs a sophisticated, evidence-based argument for biodiversity with perceptive reasoning drawn from at least two missions. Evaluates a conservation strategy with precise data and nuanced scientific judgement. Communicates with sophisticated biological terminology and a compelling logical structure.',
        'Constructs a clear, well-supported argument for biodiversity using evidence from two missions. Evaluates a conservation strategy with appropriate data and reasoning. Communicates with accurate biological terminology and clear structure.',
        'Constructs an argument for biodiversity with some evidence from Tracka missions. Addresses a conservation strategy with general reasoning. Uses appropriate biological vocabulary with some lapses in precision or structure.',
        'Makes a general argument for biodiversity with limited excursion evidence. Identifies a conservation strategy but evaluation is incomplete. Biological vocabulary is limited.',
        'Produces a minimal argument with very limited reference to biodiversity or excursion evidence.',
      ],
      resources: [
        'Written observations from at least two animals in the Taronga Tracka app (Class Insights)',
        'Conservation Gallery class submissions (if available)',
        'NSW Science syllabus — Biological Diversity / Ecosystems',
        'Teacher-approved conservation research sources',
      ],
    },
    {
      title: 'Comparative Animal Study',
      stages: ['S5'],
      format: 'Investigation',
      desc: 'Compare two animals\' evolutionary adaptations, ecological niches and conservation status using observation writing as primary field data.',
      appLink: 'Export observations from at least two animals per student from Class Insights.',
      steps: [
        'Select two animals you observed on the excursion and gather your written observations for both — these are your primary field data.',
        'Research each animal\'s evolutionary adaptations, ecological niche and current conservation status using the IUCN Red List and teacher-approved sources.',
        'Compare and contrast the two animals: how do their adaptations suit their different niches, and what evolutionary pressures shaped them?',
        'Evaluate the conservation status of each animal — what threats do they face, and how effective are current protections?',
        'Present your work as a scientific investigation with these sections: Aim, Method (how your field data was collected), Results/Comparison, Discussion, and an evidence-based Conclusion.',
      ],
      criteria: [
        'Compare the evolutionary adaptations and ecological niches of two animals using your observation writing as primary field data',
        'Evaluate the conservation status of each animal with supporting evidence and biological reasoning',
        'Produce a cohesive scientific investigation using precise biological terminology and a clear evidence-based conclusion',
      ],
      marking: [
        'Produces a perceptive, evidence-rich comparative investigation with insightful analysis of both animals\' adaptations, niches and conservation status. Uses observation writing as authoritative primary data. Communicates with sophisticated biological terminology and a compelling evidence-based conclusion.',
        'Produces an effective comparative study with clear analysis of adaptations, niches and conservation status for both animals. Makes strong use of observation writing as primary data. Communicates with precise biological terminology and a clear conclusion.',
        'Produces a sound comparative study that addresses adaptations and conservation status for both animals. Uses observation writing as evidence, though depth of analysis may vary. Communicates with appropriate biological vocabulary.',
        'Produces a basic comparison of two animals with limited analysis of adaptations or conservation. Limited use of observation writing as primary evidence. Biological vocabulary is inconsistent.',
        'Produces a minimal comparative response with very limited analysis or use of excursion evidence.',
      ],
      resources: [
        'Written observations for at least two animals from the Taronga Tracka app (Class Insights)',
        'NSW Science Stage 5 syllabus — Evolution and Biodiversity',
        'IUCN Red List (iucnredlist.org)',
        'Teacher-approved research sources',
      ],
    },
  ],
  maths: [
    {
      title: 'Maths Journal',
      stages: ['S2', 'S3'],
      format: 'Written',
      desc: 'Write up the in-app maths working in a maths journal with a sketch of the animal and a sentence explaining what the calculation shows.',
      appLink: 'The written working response from Class Insights is the starting point.',
      steps: [
        'Collect your maths working from the excursion — your teacher will give you a copy of what you wrote in the app.',
        'Rewrite your working neatly in your maths journal, showing every step with a correct number sentence or notation.',
        'Draw a sketch of the animal and label at least one measurement or quantity on it (for example its height, mass or how much it eats).',
        'Write one sentence explaining what your calculation shows and why it is interesting.',
        'Check your calculation and your presentation carefully before handing in your journal.',
      ],
      criteria: [
        'Present mathematical working clearly in a journal format using correct notation for your stage',
        'Include a sketch of the animal with at least one measurement or quantity labelled',
        'Write one sentence explaining what your calculation shows and why it is interesting',
      ],
      marking: [
        'Presents complete, correct working in journal format with precise notation. Includes a detailed, labelled sketch with accurate measurements. Explains what the calculation shows with clarity and insight.',
        'Presents working clearly in journal format with mostly correct notation. Includes a labelled sketch with relevant measurements. Explains what the calculation shows clearly.',
        'Presents working in journal format with some notation. Includes a sketch with some labelling. Explains what the calculation shows in general terms.',
        'Presents some working in a journal format with limited notation or labelling. Sketch is basic. Explanation of the calculation is minimal.',
        'Produces a minimal journal entry with very limited mathematical working or explanation.',
      ],
      resources: [
        'Your written maths response from the Taronga Tracka app (Class Insights)',
        'Class notes from the excursion',
        'Maths journal template (provided by your teacher)',
        'NSW Mathematics syllabus glossary',
      ],
    },
    {
      title: 'Data Investigation',
      stages: ['S3', 'S4'],
      format: 'Investigation',
      desc: 'Use class observation data to pose and answer a statistical question — graph, calculate mean/median, and draw conclusions.',
      appLink: 'Use class-level scores from Class Insights as the dataset.',
      steps: [
        'Pose a clear statistical question that the class observation data can answer (for example: "What was the most commonly observed behaviour across our class?").',
        'Organise the class data your teacher shares with you into a clear table.',
        'Construct an appropriate graph of the data with a title, labelled axes and an even scale.',
        'Calculate the mean and/or median of the data, showing all working.',
        'Write a conclusion that directly answers your statistical question, referring to your graph and calculations as evidence.',
      ],
      criteria: [
        'Pose a clear statistical question and explain how you will use class observation data to answer it',
        'Construct an appropriate, labelled graph and calculate mean and/or median accurately',
        'Draw a conclusion that directly answers your statistical question with reference to the data',
      ],
      marking: [
        'Poses a clear, insightful statistical question. Constructs a precise, well-labelled graph and accurately calculates mean and median with full working. Draws a sophisticated conclusion with direct reference to statistical evidence.',
        'Poses a clear statistical question. Constructs an appropriate, labelled graph and accurately calculates mean or median. Draws a clear, data-referenced conclusion.',
        'Poses a statistical question. Constructs a graph with some labelling and calculates mean or median with minor errors. Draws a general conclusion with some data reference.',
        'Poses a question with limited statistical focus. Attempts a graph and a calculation with errors. Conclusion is general and has limited data reference.',
        'Poses a minimal question and attempts a graph or calculation with significant errors. Little or no conclusion drawn.',
      ],
      resources: [
        'Class observation scores shared by your teacher from Class Insights',
        'NSW Mathematics syllabus — Statistics and Probability',
        'Graph paper or digital graphing tool (as directed by your teacher)',
        'Calculator',
      ],
    },
    {
      title: 'Conservation Cost Analysis',
      stages: ['S4'],
      format: 'Written / Report',
      desc: 'Extend the koala care cost data to research a full conservation program budget — percentage changes, ratios and projections.',
      appLink: 'Koala written response (financial maths working) provides the starting calculation.',
      steps: [
        'Start with your koala care cost calculation from the excursion — this is your baseline figure.',
        'Using the conservation cost data provided by your teacher, calculate the percentage changes in costs across the program (for example year-on-year increases).',
        'Express at least two key cost comparisons as ratios (for example veterinary care to food costs).',
        'Construct a projected 12-month budget for a full koala conservation program, showing all working for every figure.',
        'Write a short report that justifies each calculation and explains in context what your numbers show about the real cost of conservation.',
      ],
      criteria: [
        'Apply percentage change calculations to koala care cost data with full, correct working',
        'Construct a projected conservation program budget using ratios and percentage reasoning',
        'Justify all calculations and communicate findings using mathematical language in context',
      ],
      marking: [
        'Accurately applies percentage change and ratio with full, efficient working. Constructs a detailed, realistic budget projection with precise mathematical justification. Communicates findings fluently in context using accurate mathematical language.',
        'Accurately applies percentage change and ratio with mostly complete working. Constructs a logical budget projection with appropriate justification. Communicates findings clearly in context.',
        'Applies percentage change and ratio with some working and minor errors. Constructs a basic budget projection. Communicates findings in context with some mathematical language.',
        'Attempts percentage change or ratio with limited working or errors. Budget projection is incomplete or has significant errors. Mathematical communication is unclear.',
        'Makes a minimal attempt at calculation. Budget projection is largely absent or incorrect.',
      ],
      resources: [
        'Your written koala response from the Taronga Tracka app (Class Insights)',
        'Koala conservation cost data (provided by your teacher)',
        'NSW Mathematics syllabus — Financial Mathematics / Rates and Ratios',
        'Calculator',
      ],
    },
    {
      title: 'Proportional Reasoning Task',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Apply proportional reasoning to compare animal measurements (mass, food intake, territory) across two animals. Full working required.',
      appLink: 'Gorilla, sea lion and giraffe in-app tasks all generate proportional reasoning evidence.',
      steps: [
        'Choose two animals and gather their measurements (mass, daily food intake, territory size) from your in-app tasks and the data sheet provided by your teacher.',
        'Set up ratios or rates comparing the two animals, with correct units on every quantity.',
        'Make at least two meaningful proportional comparisons — for example, food intake per kilogram of body mass, or territory size relative to body size.',
        'Show every step of your working and justify why you chose each method.',
        'Communicate your findings as an extended response, ending with a conclusion about what the proportional comparison reveals that the raw numbers alone do not.',
      ],
      criteria: [
        'Apply proportional reasoning to compare measurements across two animals with complete, correct working',
        'Use ratio, rate or scale factor correctly with appropriate units throughout',
        'Communicate each step of your mathematical reasoning clearly, justifying your method',
      ],
      marking: [
        'Applies sophisticated proportional reasoning across both animals with complete, efficient working. Uses ratio, rate and scale factor with precision and correct units. Communicates reasoning with mathematical fluency and clear justification of every step.',
        'Applies proportional reasoning across both animals with mostly complete working. Uses ratio or rate correctly with appropriate units. Communicates reasoning clearly with justification.',
        'Applies proportional reasoning with some working. Uses ratio or rate with minor unit or calculation errors. Communicates reasoning with some justification.',
        'Attempts proportional reasoning with limited working or significant errors. Units or method may be incorrect. Mathematical communication is limited.',
        'Makes a minimal attempt at proportional reasoning. Working is largely absent or incorrect.',
      ],
      resources: [
        'Your written observations for Gorilla, Sea Lion and/or Giraffe from the Taronga Tracka app (Class Insights)',
        'NSW Mathematics syllabus — Proportional Reasoning / Rates and Ratios',
        'Calculator and ruler for any scale work',
        'Teacher-provided animal data sheet',
      ],
    },
    {
      title: 'Statistical Analysis & Inference',
      stages: ['S5'],
      format: 'Investigation',
      desc: 'Use the class chimpanzee behaviour percentages to calculate mean, range and standard deviation, then draw inferences and identify error sources.',
      appLink: 'Collect chimpanzee behaviour percentages from each student\'s response in Class Insights.',
      steps: [
        'Collect the class chimpanzee behaviour percentage dataset from your teacher.',
        'Calculate the mean, range and standard deviation of the dataset, showing full working for each.',
        'Represent the data in an appropriate statistical display (histogram, box plot or dot plot) with correct labels and scale.',
        'Draw at least two statistical inferences about what the class observed, supported by your calculations.',
        'Identify and explain at least two potential sources of error in how the data was collected, and describe how each would affect the results.',
      ],
      criteria: [
        'Calculate mean, range and standard deviation for the class chimpanzee behaviour dataset with full working',
        'Represent the data in an appropriate statistical display with correct labels and scale',
        'Draw statistical inferences and identify at least two potential sources of error in the data collection',
      ],
      marking: [
        'Calculates mean, range and standard deviation accurately with full, clear working. Produces a precisely labelled, appropriately chosen statistical display. Draws sophisticated, evidence-based inferences and identifies two or more specific, well-reasoned sources of error.',
        'Calculates mean, range and standard deviation accurately with clear working. Produces a well-labelled statistical display. Draws clear inferences and identifies two sources of error with reasoning.',
        'Calculates mean and range accurately; standard deviation has minor errors. Produces a labelled statistical display. Draws general inferences and identifies one or two sources of error.',
        'Calculates mean with some accuracy; range or standard deviation contain errors. Statistical display has some labelling. Inferences are general; one source of error identified.',
        'Attempts calculations with significant errors. Display is minimal or unlabelled. Very limited inference or error identification.',
      ],
      resources: [
        'Class chimpanzee behaviour percentage data shared by your teacher from Class Insights',
        'NSW Mathematics Stage 5 syllabus — Statistical Analysis',
        'Calculator or spreadsheet software',
        'Graph paper or digital graphing tool (as directed by your teacher)',
      ],
    },
  ],
  english: [
    {
      title: 'Observation Piece: Revised & Extended',
      stages: ['S2', 'S3'],
      format: 'Creative Writing',
      desc: 'Students identify one technique they used in their in-app response, then revise and extend the piece to three paragraphs with peer editing.',
      appLink: 'The raw in-app response is the first draft — pull it from Class Insights.',
      steps: [
        'Re-read your original observation from the excursion — your teacher will give you a copy. This is your first draft.',
        'Find and name one language technique you used (a describing word, simile or comparison). If you can\'t find one, plan where you could add one.',
        'Plan how to grow your piece to three paragraphs — think about what you saw, what you heard, and how the moment felt.',
        'Swap your draft with a partner and use the peer editing checklist to suggest improvements for each other.',
        'Apply your partner\'s suggestions, then write and carefully check your final version before publishing it.',
      ],
      criteria: [
        'Identify and name one language technique used in your original in-app observation',
        'Revise and extend the piece to three paragraphs with added descriptive detail',
        'Write in clear, accurate sentences with peer-editing improvements applied',
      ],
      marking: [
        'Clearly identifies a language technique by name and explains its effect with insight. Produces a well-developed three-paragraph piece with rich descriptive detail and perceptive peer-editing improvements. Writing is controlled, accurate and engaging throughout.',
        'Identifies a language technique by name. Produces a three-paragraph piece with good descriptive detail and clear peer-editing improvements. Writing is clear and mostly accurate.',
        'Names a language technique with general reference. Produces two or three paragraphs with some descriptive detail. Peer-editing improvements are evident. Writing is generally clear.',
        'Names a technique with limited accuracy. Produces one or two paragraphs with basic detail. Some improvements evident. Writing has errors that affect clarity.',
        'Makes a minimal attempt to name a technique or extend the piece. Very limited detail or improvement.',
      ],
      resources: [
        'Your original written observation from the Taronga Tracka app (Class Insights)',
        'Peer editing checklist (provided by your teacher)',
        'NSW English syllabus glossary of language techniques',
        'Stage-appropriate mentor texts provided by your teacher',
      ],
    },
    {
      title: 'Descriptive / Imaginative Writing',
      stages: ['S3', 'S4'],
      format: 'Creative Writing',
      desc: 'Using the in-app English task as stimulus, write a complete imaginative text set at Taronga with at least three named language techniques.',
      appLink: 'English observation writing + technique quiz result = two pieces of evidence.',
      steps: [
        'Use your in-app English writing as stimulus — choose a moment, animal or place at Taronga to be the setting of your imaginative text.',
        'Plan a complete text with a clear opening that establishes the setting, a developed body, and a resolution.',
        'Draft your text, deliberately weaving in at least three language techniques (for example simile, metaphor, personification, sensory imagery).',
        'Name each technique you used — annotate it in the margin or list it below your text with the line where it appears.',
        'Edit your draft for control of language suited to your audience and purpose, then submit the final text with your annotations.',
      ],
      criteria: [
        'Use and correctly name at least three language techniques in your imaginative text',
        'Write a complete, structured text with a clear opening, body and resolution',
        'Demonstrate control of language appropriate to your text type, audience and purpose',
      ],
      marking: [
        'Uses at least three language techniques with precision and clear purpose; names each correctly. Produces a sophisticated, fully structured imaginative text with a compelling opening, cohesive body and resonant resolution. Demonstrates excellent language control appropriate to text type and audience.',
        'Uses three language techniques appropriately; names each correctly. Produces a well-structured text with a clear opening, body and resolution. Demonstrates strong language control appropriate to text type and audience.',
        'Uses two or three language techniques with some accuracy; names at least two. Produces a structured text with most required elements. Demonstrates general language control appropriate to the task.',
        'Uses one or two language techniques with limited accuracy. Structure is partial. Language control is inconsistent.',
        'Attempts a text with minimal technique use or structure. Very limited language control.',
      ],
      resources: [
        'Your written English observation from the Taronga Tracka app (Class Insights)',
        'NSW English syllabus — Imaginative/Descriptive Writing',
        'Language techniques reference sheet (provided by your teacher)',
        'Mentor texts and vocabulary lists provided by your teacher',
      ],
    },
    {
      title: 'Persuasive Text',
      stages: ['S4'],
      format: 'Persuasive Writing',
      desc: 'Write a persuasive speech or letter arguing for the conservation of one animal, using rhetorical questions, emotive language and statistics.',
      appLink: 'Sea lion persuasive writing task gives a ready-made scaffold and starting evidence.',
      steps: [
        'Choose one animal from the excursion and take a clear position on why it must be protected.',
        'Research at least one statistic about the animal or its threats from a teacher-approved source to strengthen your argument.',
        'Plan your text: a position statement, three supporting points (each with evidence), and a call to action.',
        'Draft your speech or letter, deliberately using rhetorical questions and emotive language for persuasive effect.',
        'Edit your draft so the persuasive voice is sustained from the first line to the last, then submit it (or deliver it as a speech if your teacher directs).',
      ],
      criteria: [
        'Use rhetorical questions, emotive language and at least one statistic in your persuasive text',
        'Structure your argument with a clear position statement, supporting points and a call to action',
        'Sustain a persuasive voice and control language choices for effect throughout',
      ],
      marking: [
        'Uses rhetorical questions, emotive language and statistics with precision and clear persuasive intent. Produces a compelling, fully structured argument with a powerful position statement, well-developed supporting points and a memorable call to action. Sustains a sophisticated persuasive voice with deliberate language control throughout.',
        'Uses rhetorical questions, emotive language and a statistic effectively. Produces a well-structured argument with a clear position, supporting points and call to action. Maintains a persuasive voice with mostly controlled language choices.',
        'Uses some persuasive techniques including at least one statistic. Structure is mostly present. Persuasive voice is evident but inconsistent.',
        'Attempts persuasive techniques with limited effectiveness. Structure is partial. Persuasive voice is inconsistent.',
        'Produces a minimal attempt at persuasion with very limited technique use or structure.',
      ],
      resources: [
        'Your written sea lion observation from the Taronga Tracka app (Class Insights)',
        'NSW English syllabus — Persuasive/Argumentative Writing',
        'Persuasive writing scaffold and technique reference (provided by your teacher)',
        'Conservation statistics from teacher-approved websites',
      ],
    },
    {
      title: 'Comparative Textual Analysis',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Compare how the in-app reading text and a published wildlife article use language to position the reader — technique, effect, evidence.',
      appLink: 'Gorilla and dingo reading tasks both generate quotable textual evidence.',
      steps: [
        'Re-read the in-app reading text (gorilla or dingo) and the published wildlife article your teacher provides.',
        'Identify the language techniques each text uses to position the reader, and collect short quotes from both texts as evidence.',
        'Compare the purposes, audiences and effects of the two texts using precise metalanguage (tone, register, modality, imagery).',
        'Plan a structured analytical response with a clear thesis about how the two texts position their readers differently.',
        'Write your response, sustaining the argument across all paragraphs and integrating quoted evidence with analysis in every body paragraph.',
      ],
      criteria: [
        'Identify and analyse how each text uses language techniques to position the reader, with textual evidence',
        'Compare the purposes, audiences and effects of both texts using precise metalanguage',
        'Construct a structured analytical response with a clear argument sustained across all paragraphs',
      ],
      marking: [
        'Identifies and analyses language techniques in both texts with perceptive insight and precise textual evidence. Compares purpose, audience and effect with sophisticated metalanguage. Constructs a compelling, well-structured analytical argument sustained throughout.',
        'Identifies and analyses techniques in both texts with clear textual evidence. Compares purpose, audience and effect using appropriate metalanguage. Constructs a structured analytical response with a clear argument.',
        'Identifies techniques in both texts with some textual evidence. Compares purpose and audience with general metalanguage. Structure is mostly present with a developing argument.',
        'Identifies techniques in one or both texts with limited evidence. Comparison is partial. Metalanguage is limited and argument is unclear.',
        'Makes a minimal attempt to identify techniques or compare texts. Very limited metalanguage or structure.',
      ],
      resources: [
        'Your written observation from the Taronga Tracka app — Gorilla and/or Dingo missions (Class Insights)',
        'Published wildlife article provided by your teacher',
        'NSW English syllabus — Textual Analysis',
        'Metalanguage reference sheet provided by your teacher',
      ],
    },
    {
      title: 'Multimodal Feature Article',
      stages: ['S5'],
      format: 'Multimodal',
      desc: 'Produce a digital or print feature article about one conservation issue, incorporating observation writing, a self-taken image and language analysis.',
      appLink: 'In-app observation writing + ZooSnooz video clips (if applicable) as primary evidence.',
      steps: [
        'Choose one conservation issue you encountered on the excursion to be the focus of your feature article.',
        'Gather your primary material: your observation writing and a self-taken (or teacher-approved) image from the excursion.',
        'Plan the article like a journalist: headline, standfirst, body sections with subheadings, and where your image will sit with its caption.',
        'Write the article, applying language techniques with deliberate purpose for your chosen audience.',
        'Add a short written analysis (150–200 words) explaining how your language and image choices work together to position the reader.',
        'Publish on the approved platform or template and submit both the article and your analysis.',
      ],
      criteria: [
        'Integrate written observation, image and language analysis cohesively in a multimodal form',
        'Apply language techniques with clear purpose and analyse their effect on the reader',
        'Demonstrate understanding of how multimodal elements combine to construct meaning for a specific audience',
      ],
      marking: [
        'Integrates written, visual and analytical elements with sophistication and clear cohesion. Applies language techniques with precise purpose and analyses their effect with perceptive insight. Demonstrates nuanced understanding of how multimodal elements construct meaning for a specific audience.',
        'Integrates written, visual and analytical elements effectively. Applies language techniques with clear purpose and analyses their effect. Demonstrates clear understanding of how multimodal elements work together.',
        'Integrates written, visual and analytical elements with some cohesion. Applies language techniques and attempts analysis of effect. Demonstrates general understanding of multimodal construction.',
        'Includes written and visual elements with limited cohesion. Language technique use is limited. Understanding of multimodal construction is basic.',
        'Produces a minimal multimodal attempt with very limited integration of elements or analysis.',
      ],
      resources: [
        'Your written observation from the Taronga Tracka app (Class Insights)',
        'A self-taken or teacher-approved image from the excursion',
        'NSW English Stage 5 syllabus — Multimodal Texts',
        'Teacher-approved publishing platform or template',
      ],
    },
  ],
  pdhpe: [
    {
      title: 'Movement & Body Reflection',
      stages: ['S2', 'S3'],
      format: 'Written',
      desc: 'Compare how the observed animal moves to how the student\'s own body moves in sport or play — and what athletes could learn from it.',
      appLink: 'PDHPE observation writing gives the animal evidence. Students add the human connection.',
      steps: [
        'Re-read your excursion observation about how the animal moves — your teacher will give you a copy.',
        'Describe the animal\'s movement in detail: how it walks, runs, climbs, balances or swims.',
        'Compare the animal\'s movement to a movement you do in sport or play — what is the same, and what is different?',
        'Explain one thing athletes or everyday people could learn from this animal about movement or staying healthy.',
        'Write your reflection in clear sentences using PDHPE words, and check it carefully before handing it in.',
      ],
      criteria: [
        'Describe how the observed animal moves and connect it clearly to a movement or activity you do',
        'Explain what athletes or people could learn from this animal about health or movement',
        'Communicate your reflection in clear sentences using PDHPE vocabulary appropriate to your stage',
      ],
      marking: [
        'Describes the animal\'s movement with precision and makes an insightful, well-developed connection to personal health or movement. Articulates clearly what athletes could learn, using accurate PDHPE vocabulary. Writing is fluent and well-organised.',
        'Describes the animal\'s movement clearly and makes a relevant connection to personal movement. Explains what athletes could learn with some PDHPE vocabulary. Writing is clear and organised.',
        'Describes the animal\'s movement and attempts a connection to personal movement. Makes a general statement about what athletes could learn. Uses some PDHPE vocabulary.',
        'Describes movement with limited connection to personal activity. Attempt at athlete learning is very general. Limited PDHPE vocabulary used.',
        'Produces a minimal response with very limited description or connection to health and movement.',
      ],
      resources: [
        'Your written PDHPE observation from the Taronga Tracka app (Class Insights)',
        'NSW PDHPE syllabus — Movement and Physical Activity',
        'Class notes and any handouts from the excursion',
        'Health and PE vocabulary list (provided by your teacher)',
      ],
    },
    {
      title: 'Energy Systems Analysis',
      stages: ['S4'],
      format: 'Written / Report',
      desc: 'Using the lion mission as stimulus, write a detailed analysis of ATP-PC and aerobic energy systems, including a diagram and rest-to-work ratios.',
      appLink: 'Lion PDHPE quiz result (energy systems) + observation writing = two pieces of evidence.',
      steps: [
        'Review your lion observation and your quiz result on energy systems from the excursion.',
        'Describe the ATP-PC and aerobic energy systems, and link each one to a phase of the lion\'s hunting behaviour (explosive sprint versus long rest and recovery).',
        'Calculate rest-to-work ratios based on the lion\'s activity pattern, showing your working, and explain what the ratios mean.',
        'Draw and correctly label a diagram showing which energy system dominates over time during activity.',
        'Apply your findings to human athletic performance — for example, compare a sprinter\'s and an endurance athlete\'s energy demands — and write up the whole analysis as a structured report.',
      ],
      criteria: [
        'Accurately describe the ATP-PC and aerobic energy systems and link each to the lion\'s hunting behaviour',
        'Calculate rest-to-work ratios relevant to the lion\'s activity pattern and explain their significance',
        'Apply energy systems knowledge to human athletic performance with a correctly labelled diagram',
      ],
      marking: [
        'Accurately and insightfully describes both energy systems with precise links to lion hunting behaviour. Calculates rest-to-work ratios with full working and explains their significance with depth. Produces a detailed, correctly labelled diagram and applies energy systems to human performance with sophisticated reasoning.',
        'Accurately describes both energy systems with clear links to lion behaviour. Calculates rest-to-work ratios with appropriate working. Produces a labelled diagram and applies energy systems to human performance clearly.',
        'Describes both energy systems with some accuracy and general links to lion behaviour. Calculates rest-to-work ratios with minor errors. Diagram has some labelling. Application to human performance is present but general.',
        'Describes one or both energy systems with limited accuracy. Attempts rest-to-work ratio with errors. Diagram is basic. Application to human performance is unclear.',
        'Makes a minimal attempt to describe energy systems. Very limited connection to the lion mission, ratio calculation or human performance.',
      ],
      resources: [
        'Your written lion observation from the Taronga Tracka app (Class Insights)',
        'Lion PDHPE quiz result (energy systems question)',
        'NSW PDHPE Stage 4 syllabus — Energy Systems',
        'Textbook and teacher-approved research sources',
        'Calculator',
      ],
    },
    {
      title: 'Cardiovascular System Investigation',
      stages: ['S4'],
      format: 'Investigation',
      desc: 'Research and compare the giraffe cardiovascular system to the human cardiovascular system during exercise, connecting to effects of physical activity.',
      appLink: 'Giraffe PDHPE observation writing (cardiovascular comparison) is the primary evidence.',
      steps: [
        'Start from your giraffe observation, then research the giraffe cardiovascular system using teacher-approved sources.',
        'Describe the features unique to giraffe anatomy — its heart size, extremely high blood pressure and specialised valves — with accurate anatomical detail.',
        'Compare the giraffe cardiovascular system to the human cardiovascular system during exercise, using PDHPE terminology (heart rate, stroke volume, blood pressure).',
        'Connect your comparison to the effects of regular physical activity on the human cardiovascular system over time.',
        'Write up your work as an investigation with these sections: Aim, Research, Comparison, and Conclusion.',
      ],
      criteria: [
        'Research and accurately describe the giraffe cardiovascular system, including features unique to its anatomy',
        'Compare the giraffe and human cardiovascular systems during exercise using PDHPE terminology',
        'Connect your investigation to the effects of physical activity on the human cardiovascular system',
      ],
      marking: [
        'Researches and accurately describes the giraffe cardiovascular system with precise anatomical detail. Makes an insightful, well-supported comparison to the human cardiovascular system during exercise. Connects findings to physical activity effects with sophisticated PDHPE reasoning and terminology.',
        'Accurately describes the giraffe cardiovascular system with relevant detail. Makes a clear comparison to the human cardiovascular system. Connects findings to the effects of physical activity with appropriate PDHPE vocabulary.',
        'Describes the giraffe cardiovascular system with general accuracy. Makes a comparison to the human system with some PDHPE vocabulary. Connection to physical activity effects is present but incomplete.',
        'Describes the giraffe cardiovascular system with limited accuracy. Comparison to the human system is partial. Connection to physical activity is very general.',
        'Produces a minimal response with limited description of either cardiovascular system.',
      ],
      resources: [
        'Your written giraffe observation from the Taronga Tracka app (Class Insights)',
        'NSW PDHPE Stage 4 syllabus — The Human Body',
        'Teacher-approved research sources on giraffe anatomy',
        'Cardiovascular system diagram (provided by your teacher)',
      ],
    },
    {
      title: 'Wellbeing & Community Connections',
      stages: ['S3', 'S4'],
      format: 'Reflection / Presentation',
      desc: 'Drawing on lemur social behaviour, reflect on how belonging and community support physical and mental wellbeing. Present with personal examples.',
      appLink: 'Lemur PDHPE observation writing is the stimulus. Students link to their own life.',
      steps: [
        'Re-read your lemur observation about how the troop behaves together.',
        'Describe how lemurs live in social groups and connect this to the human concepts of belonging and community.',
        'Explain how social connection supports both physical and mental wellbeing, referring to a health model your teacher provides (for example the biopsychosocial model).',
        'Add personal examples — where do you experience belonging (team, family, class, club) and how does it support your wellbeing?',
        'Prepare a short presentation of your reflection with at least one visual aid, and present it to the class or your teacher.',
      ],
      criteria: [
        'Describe lemur social behaviour and connect it clearly to the concept of belonging and community',
        'Explain how social connection supports physical and mental wellbeing with reference to a health model',
        'Present your reflection with personal examples and at least one visual aid',
      ],
      marking: [
        'Describes lemur social behaviour with precision and makes an insightful connection to belonging and community. Explains the wellbeing link with sophisticated reference to a health model. Presents with compelling personal examples and a clear, purposeful visual aid.',
        'Describes lemur social behaviour clearly and connects it to belonging and community. Explains the wellbeing link with appropriate health model reference. Includes personal examples and a clear visual aid.',
        'Describes lemur social behaviour and makes a general connection to community and wellbeing. References a health model with some explanation. Includes a personal example and a visual aid.',
        'Describes lemur behaviour with limited connection to wellbeing concepts. Health model reference is minimal. Personal example or visual aid may be absent.',
        'Produces a minimal response with very limited connection to lemur behaviour, wellbeing or health models.',
      ],
      resources: [
        'Your written lemur observation from the Taronga Tracka app (Class Insights)',
        'NSW PDHPE syllabus — Wellbeing and Mental Health',
        'Biopsychosocial model or WHO definition of health (provided by your teacher)',
        'Presentation platform as directed by your teacher',
      ],
    },
    {
      title: 'Nutritional Needs & Performance',
      stages: ['S4', 'S5'],
      format: 'Extended Response',
      desc: 'Using the dingo hunting mission, research nutritional requirements for sustained physical performance and compare to dietary guidelines for athletes.',
      appLink: 'Dingo PDHPE quiz (food for energy) + observation writing give the animal-side evidence.',
      steps: [
        'Review your dingo observation and your quiz result on food for energy from the excursion.',
        'Research the nutritional requirements for sustained physical performance — energy needs, macronutrients and hydration — using the dingo\'s hunting endurance as your stimulus.',
        'Compare those requirements to the Australian Dietary Guidelines and established guidelines for athletes, with supporting evidence for each comparison.',
        'Evaluate the role nutrition plays in physical performance — what happens when needs are met, and what happens when they are not?',
        'Write your work as an extended response with an introduction, body paragraphs addressing each criterion, and a conclusion, using precise PDHPE vocabulary.',
      ],
      criteria: [
        'Research and describe the nutritional requirements for sustained physical performance using the dingo hunting mission as stimulus',
        'Compare nutritional requirements to established guidelines for athletes with supporting evidence',
        'Evaluate the role of nutrition in physical performance using precise PDHPE vocabulary and health literacy',
      ],
      marking: [
        'Researches and precisely describes nutritional requirements with sophisticated links to the dingo hunting context. Makes a well-supported, evidence-rich comparison to athlete guidelines. Evaluates the role of nutrition with nuanced PDHPE reasoning and advanced health literacy.',
        'Accurately describes nutritional requirements with relevant links to the dingo context. Makes a clear comparison to athlete guidelines with supporting evidence. Evaluates nutrition\'s role with appropriate PDHPE vocabulary.',
        'Describes nutritional requirements with general accuracy and some links to the dingo context. Compares to athlete guidelines with some evidence. Evaluates nutrition\'s role with general PDHPE vocabulary.',
        'Describes nutritional requirements with limited accuracy. Comparison to guidelines is incomplete. Evaluation of nutrition\'s role is very general.',
        'Produces a minimal response with very limited description of nutritional requirements or connection to the dingo mission.',
      ],
      resources: [
        'Your written dingo observation from the Taronga Tracka app (Class Insights)',
        'Dingo PDHPE quiz result (food for energy question)',
        'NSW PDHPE syllabus — Nutrition and Physical Performance',
        'Australian Dietary Guidelines and teacher-approved sports nutrition sources',
        'Calculator',
      ],
    },
  ],
};

// Flatten all tasks into one array with kla attached
const ALL_TASKS = Object.entries(POST_TASKS).flatMap(([klaId, tasks]) =>
  tasks.map(t => ({ ...t, klaId }))
);

export default function AssessmentIdeasScreen() {
  const { setCurrentScreen } = useApp();
  const [filterKla, setFilterKla]   = useState('science');
  const [filterStage, setFilterStage] = useState('all');
  const [printStage, setPrintStage] = useState(4);

  const activeKla  = KLAS.find(k => k.id === filterKla);
  const heroColor  = activeKla?.color  ?? '#1A5238';
  const heroLight  = activeKla?.light  ?? '#E8F5EE';

  const evidenceItems = filterKla === 'all'
    ? Object.values(APP_EVIDENCE).flat().filter((v, i, arr) => arr.findIndex(x => x.metric === v.metric) === i)
    : APP_EVIDENCE[filterKla] ?? [];

  const visibleTasks = ALL_TASKS.filter(t => {
    const klaOk   = filterKla === 'all' || t.klaId === filterKla;
    const stageOk = filterStage === 'all' || t.stages.includes(`S${filterStage}`);
    return klaOk && stageOk;
  });

  return (
    <div style={{ minHeight:'100vh', background:'#F3F1EC', fontFamily:'var(--t-font)' }}>

      {/* ── Topbar ── */}
      <div style={{ background:'white', borderBottom:'1px solid #E5E2DA', padding:'0.75rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => setCurrentScreen('teacherDashboard')}
          style={{ background:'none', border:'1px solid #E5E2DA', color:'var(--t-deep)', padding:'0.4rem 0.9rem', borderRadius:999, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Dashboard
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="" style={{ height:'22px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <span className="taronga-title" style={{ fontSize:'0.95rem', color:'var(--t-deep)', letterSpacing:'0.08em', fontWeight:400 }}>ASSESSMENT IDEAS</span>
            <span style={{ fontSize:'0.7rem', color:'var(--t-slate)', marginLeft:'0.6rem' }}>Teacher Portal</span>
          </div>
        </div>
      </div>

      {/* ── Hero: Taronga Tracka as Assessment ── */}
      <div style={{ background:'#071E14', color:'white', padding:'3rem 1.5rem 2.5rem' }}>
        <div style={{ maxWidth:1180, margin:'0 auto' }}>

          {/* Kicker */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1rem' }}>
            <div style={{ width:36, height:3, borderRadius:2, background:'#2E7D55' }} />
            <span style={{ fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase', color:'#A8C4B2' }}>
              In-Excursion Assessment
            </span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'2rem', alignItems:'start', flexWrap:'wrap' }}>
            <div>
              <h2 className="taronga-title" style={{ margin:'0 0 0.6rem', fontSize:'2.4rem', fontWeight:400, letterSpacing:'0.02em', lineHeight:1.1, color:'white' }}>
                Taronga Tracka<br/>as Assessment
              </h2>
              <p style={{ margin:'0 0 1.75rem', fontSize:'0.9rem', color:'#A8C4B2', lineHeight:1.7, maxWidth:560 }}>
                The excursion is the assessment. Every student response, quiz result and score is captured automatically and waiting in Class Insights the moment they submit.
              </p>

              {/* Evidence chips */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem', marginBottom:'1.75rem' }}>
                {evidenceItems.map(ev => (
                  <div key={ev.metric} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'0.6rem 0.85rem', display:'flex', alignItems:'flex-start', gap:'0.55rem', maxWidth:240 }}>
                    <span style={{ display:'flex', alignItems:'center', marginTop:'0.1rem', flexShrink:0, color:'rgba(255,255,255,0.75)' }}>{ev.icon}</span>
                    <div>
                      <div style={{ fontSize:'0.75rem', fontWeight:700, color:'white', marginBottom:'0.15rem' }}>{ev.metric}</div>
                      <div style={{ fontSize:'0.68rem', color:'#A8C4B2', lineHeight:1.5 }}>{ev.what}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Class Insights callout */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.6rem', background:'rgba(46,125,85,0.25)', border:'1px solid rgba(46,125,85,0.4)', borderRadius:8, padding:'0.6rem 1rem', fontSize:'0.78rem', color:'#A8D5BB' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Find all of this in <strong style={{ color:'white' }}>Class Insights → select your class → tap any student</strong>
              </div>
            </div>

            {/* Print AT panel */}
            <div style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:16, padding:'1.5rem', minWidth:240, flexShrink:0 }}>
              <div style={{ fontSize:'0.62rem', fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', color:'#A8C4B2', marginBottom:'0.75rem' }}>Print AT Notification</div>
              <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.6)', lineHeight:1.6, margin:'0 0 1rem' }}>Generate a print-ready NSW Assessment Task Notification for the in-excursion fieldwork observation.</p>

              {/* KLA selector */}
              <div style={{ marginBottom:'0.75rem' }}>
                <div style={{ fontSize:'0.6rem', fontWeight:700, color:'#A8C4B2', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.4rem' }}>Subject</div>
                <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap' }}>
                  {KLAS.map(k => (
                    <button key={k.id}
                      onClick={() => setFilterKla(filterKla === k.id ? 'all' : k.id)}
                      style={{ padding:'0.3rem 0.65rem', borderRadius:999, border:'none', fontSize:'0.7rem', fontWeight:700, cursor:'pointer', background: filterKla === k.id ? k.color : 'rgba(255,255,255,0.1)', color: filterKla === k.id ? 'white' : 'rgba(255,255,255,0.6)', transition:'all 0.15s' }}>
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage selector */}
              <div style={{ marginBottom:'1rem' }}>
                <div style={{ fontSize:'0.6rem', fontWeight:700, color:'#A8C4B2', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.4rem' }}>Stage</div>
                <div style={{ display:'flex', gap:'0.35rem' }}>
                  {[2,3,4,5].map(s => (
                    <button key={s} onClick={() => setPrintStage(s)}
                      style={{ width:34, height:34, borderRadius:8, border:'none', fontSize:'0.82rem', fontWeight:800, cursor:'pointer', background: printStage === s ? (activeKla?.color ?? '#2E7D55') : 'rgba(255,255,255,0.1)', color: printStage === s ? 'white' : 'rgba(255,255,255,0.55)', transition:'all 0.15s' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openAssessmentTaskNotification(filterKla === 'all' ? 'science' : filterKla, printStage, 'in-excursion', null)}
                style={{ width:'100%', padding:'0.7rem', borderRadius:8, border:'none', background:'linear-gradient(135deg,#1A5238,#2E7D55)', color:'white', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.03em' }}>
                Print AT Notification →
              </button>
              <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', marginTop:'0.5rem', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem' }}>
                {filterKla === 'all' ? 'Science' : activeKla?.label}
                <svg width="3" height="3" viewBox="0 0 3 3"><circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,255,255,0.3)"/></svg>
                Stage {printStage}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background:'white', borderBottom:'1px solid #E5E2DA', padding:'0 1.5rem', position:'sticky', top:57, zIndex:90 }}>
        <div style={{ maxWidth:1180, margin:'0 auto', display:'flex', alignItems:'center', gap:'0', overflowX:'auto' }}>

          {/* KLA tabs */}
          <div style={{ display:'flex', gap:'0', flexShrink:0 }}>
            {[{ id:'all', label:'All KLAs', color:'#1A1A17' }, ...KLAS].map(k => {
              const isActive = filterKla === k.id;
              return (
                <button key={k.id} onClick={() => setFilterKla(k.id)}
                  style={{ padding:'0.85rem 1.1rem', background:'none', border:'none', borderBottom: isActive ? `3px solid ${k.color ?? '#1A1A17'}` : '3px solid transparent', fontSize:'0.82rem', fontWeight: isActive ? 700 : 500, color: isActive ? (k.color ?? '#1A1A17') : '#6B6B62', cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s', marginBottom:'-1px' }}>
                  {k.label}
                </button>
              );
            })}
          </div>

          <div style={{ flex:1 }} />

          {/* Stage filter */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0, padding:'0.5rem 0' }}>
            <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#6B6B62', textTransform:'uppercase', letterSpacing:'0.08em' }}>Stage</span>
            {['all',2,3,4,5].map(s => (
              <button key={s} onClick={() => setFilterStage(s)}
                style={{ padding:'0.3rem 0.6rem', borderRadius:999, border:`1.5px solid ${filterStage === s ? '#1A5238' : '#E5E2DA'}`, background: filterStage === s ? '#1A5238' : 'white', color: filterStage === s ? 'white' : '#6B6B62', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Card grid ── */}
      <div style={{ maxWidth:1180, margin:'0 auto', padding:'2rem 1.5rem 3rem' }}>

        {/* Section heading */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
          <h3 style={{ margin:0, fontSize:'1.1rem', fontWeight:700, color:'#1A1A17' }}>
            Post-Visit Assessment Tasks
          </h3>
          <span style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.78rem', color:'#6B6B62' }}>
            {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''}
            {filterKla !== 'all' && <><svg width="3" height="3" viewBox="0 0 3 3"><circle cx="1.5" cy="1.5" r="1.5" fill="#9A9A92"/></svg>{activeKla?.label}</>}
            {filterStage !== 'all' && <><svg width="3" height="3" viewBox="0 0 3 3"><circle cx="1.5" cy="1.5" r="1.5" fill="#9A9A92"/></svg>Stage {filterStage}</>}
          </span>
        </div>

        {visibleTasks.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem 2rem', color:'#6B6B62' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'0.75rem' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="21" cy="21" r="14" stroke="#CBD5CC" strokeWidth="2.5"/>
                <path d="M31 31l10 10" stroke="#CBD5CC" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ margin:0, fontWeight:600 }}>No tasks match that filter combination.</p>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1.1rem' }}>
          {visibleTasks.map(task => {
            const klaObj    = KLAS.find(k => k.id === task.klaId);
            const fmtColor  = FORMAT_COLORS[task.format] ?? '#6B6B62';
            const firstStage = parseInt(task.stages[0].replace('S',''), 10);

            return (
              <div key={`${task.klaId}-${task.title}`}
                style={{ background:'white', borderRadius:16, overflow:'hidden', border:'1px solid #E5E2DA', display:'flex', flexDirection:'column', transition:'box-shadow 0.15s, transform 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 32px rgba(7,30,20,0.10)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>

                {/* Coloured top band */}
                <div style={{ height:6, background:`linear-gradient(90deg, ${klaObj?.color}, ${klaObj?.color}88)` }} />

                {/* Card body */}
                <div style={{ padding:'1.1rem 1.2rem 0.85rem', flex:1, display:'flex', flexDirection:'column' }}>

                  {/* Tags row */}
                  <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexWrap:'wrap', marginBottom:'0.65rem' }}>
                    <span style={{ background: klaObj?.light, color: klaObj?.color, border:`1px solid ${klaObj?.border}`, borderRadius:999, padding:'0.15rem 0.6rem', fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                      {klaObj?.label}
                    </span>
                    {task.stages.map(s => (
                      <span key={s} style={{ background:`${STAGE_COLORS[s]}15`, color:STAGE_COLORS[s], border:`1px solid ${STAGE_COLORS[s]}40`, borderRadius:999, padding:'0.15rem 0.5rem', fontSize:'0.62rem', fontWeight:800, letterSpacing:'0.06em' }}>
                        {s}
                      </span>
                    ))}
                    <span style={{ marginLeft:'auto', background:`${fmtColor}12`, color:fmtColor, border:`1px solid ${fmtColor}30`, borderRadius:999, padding:'0.15rem 0.55rem', fontSize:'0.62rem', fontWeight:700 }}>
                      {task.format}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{ margin:'0 0 0.5rem', fontSize:'1rem', fontWeight:700, color:'#1A1A17', lineHeight:1.25 }}>{task.title}</h4>

                  {/* Description */}
                  <p style={{ margin:'0 0 0.75rem', fontSize:'0.8rem', color:'#4A4A42', lineHeight:1.65, flex:1 }}>{task.desc}</p>

                  {/* App evidence callout */}
                  <div style={{ background:'#F7F5F0', borderRadius:8, padding:'0.5rem 0.7rem', marginBottom:'0.85rem', display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
                    <span style={{ fontSize:'0.65rem', fontWeight:800, color:klaObj?.color, textTransform:'uppercase', letterSpacing:'0.08em', flexShrink:0, marginTop:'0.1rem' }}>App evidence</span>
                    <span style={{ fontSize:'0.72rem', color:'#6B6B62', lineHeight:1.5 }}>{task.appLink}</span>
                  </div>

                  {/* Print button */}
                  <button
                    onClick={() => openAssessmentTaskNotification(task.klaId, firstStage, 'post-visit', task)}
                    style={{ width:'100%', padding:'0.6rem', borderRadius:8, border:`1.5px solid ${klaObj?.color}`, background:'white', color:klaObj?.color, fontSize:'0.77rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', transition:'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = klaObj?.color; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = klaObj?.color; }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Print AT Notification
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        @media (max-width: 720px) {
          .assess-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
