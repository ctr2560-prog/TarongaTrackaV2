// zooyardAnimals.js — ZooYard (self-attest, no-GPS school program) content, Science v1
// Reuses the same animal ids as src/data/animals.js on purpose: same photos (/images/{id}.jpg),
// same badge art (/images/badge-{id}.webp), and koala/giraffe already have hand-tuned keyword
// scoring branches in scoring.js's scoreObservation(). Safe because ZooYard classes are entirely
// separate class documents from any daytime class.
//
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// THE SHAPE OF A HABITAT (settled 2026-10-01). Five beats, each doing one job:
//
//   photo unlock → video → quiz → two-minute watch → build it → write it up
//
// ⚠️ There is NO measurement step, and `fieldStudy` no longer exists. One was added on
// 2026-09-26 (pace out the canopy gap, run a concealment test, count sightline blockers) and
// removed on 2026-10-01 as one step too many. It was the most fragile part of the mode: the
// tiger method needed a partner, "blockers" needed interpreting, and it sat exactly between the
// watching and the building, which is where a speed bump hurts most. **Do not reinstate a
// counting activity.** If quantitative data is ever wanted again, harvest it from the watch
// itself ("how many birds landed?") rather than as a step of its own.
//
// ⚠️ THE ORGANISING RULE, and the thing to protect when editing content: each habitat names ONE
// environmental quality the animal depends on. The student spends two minutes noticing where
// that quality exists in their schoolyard and where it does not, and then builds something that
// provides it. `observation.focus` names the quality; `citizenScience` must answer that same
// quality and nothing else. Watching and building have to be about the same thing or the habitat
// falls apart into two unrelated tasks.
//
//   koala        connected trees            tiger        what we throw away
//   nura-diya    what belongs here          bushwalk     nowhere to nest
//   sea-lion     where the water goes       chimpanzee   nowhere for small things to live
//   gorilla      where our devices come from  rhino      where would anything drink
//
// ⚠️ Rewritten 2026-10-28. SIX of the eight changed, and the giraffe was REPLACED by Nura Diya
// (an Australian precinct, not a single animal) because a schoolyard cannot recreate savannah —
// the one thing it already has too much of is mown open space.
// ⚠️ TWO of the eight are no longer habitat builds: the tiger (palm oil poster) and the gorilla
// (phone collection box) reduce the school's FOOTPRINT on a real habitat instead. That is
// deliberate — planting a shrub in Sydney does nothing for a Sumatran tiger, and pretending
// otherwise was what made those two feel hollow. The other six still leave something physical
// in the schoolyard.
//
// ⚠️ Every action is deliberately DIFFERENT. Eight schoolyards of identical bird baths would be
// a worksheet. Check the list above before adding a ninth.
// ═══════════════════════════════════════════════════════════════════════════════════════════════

// ⚠️ KEEP THE CORRECT ANSWERS SCATTERED. All eight sat at `correct: 0` until 2026-10-01, which
// is the same fault that was found and fixed on giraffe, buffalo and tiger in the daytime
// content: a class works out "always the first one" by the second habitat and stops reading the
// options. They are now spread two per position (0,1,2,3) with no two consecutive habitats
// sharing an index. When adding or rewording an MCQ, check the spread again rather than
// appending the right answer wherever it is convenient.
export const ZOOYARD_ANIMALS = [
  {
    id: 'koala',
    name: 'Koala',
    scientificName: 'Phascolarctos cinereus',
    image: '/images/koala.jpg',
    habitatArea: 'bushland',
    habitatLabel: 'Australian Bushland',
    habitatColor: '#7A8B6F',
    selfAttestWhere: 'Go and stand in the gap between two trees.',
    selfAttestPrompt: 'Any two trees in your schoolyard, or just outside it. Stand in the space between them.',
    selfAttestQuestion: 'Are you standing between two trees?',
    videoUrl: null,
    activity: {
      question: 'What is the single biggest threat to koalas surviving in the wild today?',
      options: ['Too much rain', 'Other koalas', 'Habitat loss from land clearing', 'Being too friendly'],
      correct: 2,
      fact: 'Land clearing for housing, farming and roads is the single biggest driver of koala decline. Without enough trees, koalas lose their food, shelter and safe pathways between habitats.',
    },
    observation: {
      seconds: 120,
      focus: 'Connected trees',
      title: 'Two minutes in the gap',
      instruction: 'Stand still in the gap and look up. Put the screen down. There is nothing to write yet.',
      lookFor: [
        'How far apart are these two trees, and what is in between them?',
        'Could something travel from one to the other without touching the ground?',
        'What would an animal have to cross, and what could catch it down there?',
      ],
    },
    citizenScience: {
      id: 'koala-close-the-gap',
      title: 'Close the Gap',
      icon: '🌱',
      brief: 'You just stood in the space that separates one tree from the next. Make that gap smaller.',
      primary: 'Plant a native tree or shrub in the gap between your two trees.',
      fallback: 'If your school cannot plant anything, find a plant that is already growing in the gap and water it properly instead. A plant that survives the summer is worth more than one that is planted and forgotten.',
      steps: [
        'Ask your teacher where you are allowed to plant, or which plant needs water.',
        'Pick a spot roughly halfway between the two trees.',
        'Dig a hole twice as wide as the pot, and just as deep.',
        'Tip the plant out, sit it in, and firm the soil around it.',
        'Water it well, then tell your teacher who waters it next.',
      ],
      photoPrompt: 'Photograph what you planted or watered, with the gap behind it.',
    },
    writingPromptByStage: {
      1: 'You stood in the gap between two trees, then planted or watered something in it. How does your plant help a koala?',
      2: 'You stood in the gap a koala would have to cross, then added or cared for a plant in it. Koalas are not safe on the ground. How will your plant help?',
      3: 'You stood in the gap between the trees, then planted or watered something there. Explain how your plant makes that crossing safer for a koala.',
      4: 'You stood in the gap that separates the trees in your schoolyard, then planted or watered something in it. Explain what gaps like that mean for a koala moving through, and how much difference one plant really makes.',
      5: 'You stood in the gap that separates the trees in your schoolyard, then planted or watered something in it. Explain how fragmented canopy affects a koala population over time, not just one animal, and what it would take to reconnect it properly.',
    },
  },
  {
    id: 'tiger',
    name: 'Sumatran Tiger',
    scientificName: 'Panthera tigris sumatrae',
    image: '/images/tiger.jpg',
    habitatArea: 'rainforest',
    habitatLabel: 'Sumatran Rainforest',
    habitatColor: '#E86A33',
    selfAttestWhere: 'Go and stand at the bins.',
    selfAttestPrompt: 'The rubbish bins at your school. The canteen bins, or the ones in the playground.',
    selfAttestQuestion: 'Are you standing at the bins?',
    videoUrl: null,
    activity: {
      question: 'What is the main reason Sumatran tiger habitat is disappearing?',
      options: ['Rainforest cleared for palm oil and paper plantations', 'Rising sea levels', 'Tigers moving to cities', 'Too many tigers competing for space'],
      correct: 0,
      fact: 'Sumatra\'s rainforest is being cleared at a rapid rate for palm oil and paper plantations, fragmenting the last wild spaces tigers need to hunt and roam. Palm oil is in roughly half the packaged food in a supermarket, which is why it is worth knowing how to spot it.',
    },
    observation: {
      seconds: 120,
      focus: 'What we throw away',
      title: 'Two minutes at the bins',
      instruction: 'Stand still and look at what is in the bins and on the ground around them. Put the screen down, and do not touch anything.',
      lookFor: [
        'How much of what you can see is food packaging rather than food?',
        'Pick one wrapper. How many ingredients would you guess are on the back of it?',
        'How much of this came from a plant that had to grow somewhere?',
      ],
    },
    citizenScience: {
      id: 'tiger-palm-oil',
      title: 'Spot the Palm Oil',
      icon: '🪧',
      brief: 'Tiger forest is cleared to grow palm oil, and palm oil is in about half the packaged food in a supermarket. Most people have no idea they are buying it.',
      primary: 'Check the ingredients on wrappers from your own lunch or the canteen, find the ones with palm oil, and make a poster that shows people how to spot it.',
      fallback: 'If you cannot find wrappers to check, make the poster from the hidden names alone. Palm oil is often listed as vegetable oil, palmitate, palm kernel, glyceryl stearate or sodium lauryl sulfate.',
      steps: [
        'Collect a few clean wrappers from your lunch or the canteen.',
        'Read the ingredients. Palm oil often hides as "vegetable oil" or a long chemical name.',
        'Sort them into two piles: has it, or does not.',
        'Make a poster showing the hidden names people should look for.',
        'Put it where people choose food. The canteen, not the classroom wall.',
      ],
      photoPrompt: 'Photograph your poster where you put it up.',
    },
    writingPromptByStage: {
      1: 'You looked at what gets thrown away at your school, then made a poster about palm oil. How does what we buy change things for a tiger?',
      2: 'You looked in the bins, then found out that palm oil is in a lot of the food we eat. Explain how buying food in Australia can change a forest in Sumatra.',
      3: 'You looked at the packaging your school throws away, then made a poster about palm oil. Explain the link between a wrapper in your bin and a tiger losing its forest.',
      4: 'You looked at what your school throws away, then made a poster about palm oil. Explain how demand for one ingredient can clear a forest, and whether telling people about it actually changes anything.',
      5: 'You looked at what your school throws away, then made a poster about palm oil. Explain why palm oil is difficult to avoid and difficult to replace, and evaluate whether consumer awareness or certification is the more realistic lever for protecting tiger habitat.',
    },
  },
  {
    id: 'nura-diya',
    name: 'Nura Diya Australia',
    scientificName: 'Taronga’s Australian precinct',
    image: '/images/blue-mountains-bushwalk.jpg',
    habitatArea: 'country',
    habitatLabel: 'Nura Diya Australia',
    habitatColor: '#A8502D',
    selfAttestWhere: 'Go and find the most Australian place in your schoolyard.',
    selfAttestPrompt: 'A place, not a thing. A patch of bush, a rock, a native garden bed, somewhere nobody has landscaped. Somewhere that could only be here.',
    selfAttestQuestion: 'Does this place feel like it belongs here?',
    videoUrl: null,
    activity: {
      question: 'Most of Australia’s mammals, reptiles and frogs are found nowhere else on Earth. What does that mean if they disappear here?',
      options: [
        'They can move to another country',
        'Nothing — the same animals live overseas',
        'Zoos overseas would still have plenty of them',
        'They are gone from the whole world, not just from Australia',
      ],
      correct: 3,
      fact: 'Most of Australia’s mammals, reptiles and frogs live here and nowhere else. That means an Australian extinction is a world extinction — there is no population somewhere else to come back from. Australia has already lost more mammal species than any other country.',
    },
    observation: {
      seconds: 120,
      focus: 'What belongs here',
      title: 'Two minutes in this place',
      instruction: 'Stand still and look at this place properly. Put the screen down. There is nothing to write yet.',
      lookFor: [
        'What is here that could only be in Australia?',
        'How much of the rest of your school could be anywhere in the world?',
        'If this place were gone next term, who would notice?',
      ],
    },
    citizenScience: {
      id: 'nura-diya-speak-up',
      title: 'Speak Up for Your Place',
      icon: '✉️',
      brief: 'Taronga protects Australian wildlife. So can your school. Tell them what you have got here and what you are going to do about it.',
      primary: 'Write a letter to Taronga about your school’s own environment: what lives here, what this place means to you, and how your class is going to protect it.',
      fallback: 'If you cannot send a letter, make a sign for the place instead, so everyone else at your school knows what is there and why it matters.',
      steps: [
        'Name the place. Where is it, and what is in it?',
        'Say what lives there, or what could live there.',
        'Say what it means to you. This part is yours, not a fact.',
        'Say what your class is going to do to protect it.',
        'Sign it from your class and your school, not your full name.',
      ],
      photoPrompt: 'Photograph your letter, or the place you wrote about.',
    },
    writingPromptByStage: {
      1: 'You found the most Australian place in your schoolyard. What lives there, and how will you look after it?',
      2: 'You found a place in your schoolyard that belongs here. Describe it, and say one thing your class will do to protect it.',
      3: 'You found the most Australian place in your schoolyard and wrote to Taronga about it. Explain why that place matters and what would be lost if it went.',
      4: 'You found the most Australian place in your schoolyard and made the case for protecting it. Explain why Australian species matter differently from species found in many countries, and what your school can realistically do.',
      5: 'You found the most Australian place in your schoolyard and made the case for protecting it. Explain why endemism raises the stakes of local habitat loss, and evaluate whether small protected patches like yours do meaningful conservation work or mainly do educational work.',
    },
  },
  {
    id: 'blue-mountains-bushwalk',
    name: 'Blue Mountains Bushwalk',
    scientificName: 'Blue Mountains National Park',
    image: '/images/blue-mountains-bushwalk.jpg',
    habitatArea: 'bushland',
    habitatLabel: 'Australian Bushland',
    habitatColor: '#7A8B6F',
    selfAttestWhere: 'Go and stand under the biggest, oldest tree you can find.',
    selfAttestPrompt: 'The oldest one at your school. Thick trunk, big branches, the one that was here before the buildings.',
    selfAttestQuestion: 'Are you under a big old tree?',
    videoUrl: null,
    activity: {
      question: 'Many Australian birds and mammals can only nest in tree hollows. How long does a hollow take to form?',
      options: ['A few weeks', 'Over a hundred years', 'One season', 'They are built by the birds'],
      correct: 1,
      fact: 'Hollows are not built. They form slowly as a branch breaks and the wood rots out, and in many eucalypts that takes more than a century. Over 300 Australian species depend on them, and a schoolyard full of young trees has almost none.',
    },
    observation: {
      seconds: 120,
      focus: 'Nowhere to nest',
      title: 'Two minutes looking up',
      instruction: 'Stand under the branches and look up into the tree. Put the screen down. There is nothing to write yet.',
      lookFor: [
        'Can you see a hole or a hollow anywhere in this tree?',
        'How old would you guess this tree is, and how old are the others nearby?',
        'If a bird needed a hole to nest in today, where would it go?',
      ],
    },
    citizenScience: {
      id: 'bushwalk-nest-box',
      title: 'Build a Nest Box',
      icon: '🪵',
      brief: 'Hollows take a hundred years. A nest box takes an afternoon, and it does the same job until the trees catch up.',
      primary: 'Build or assemble a nest box and fix it to a tree, facing away from the afternoon sun.',
      fallback: 'If you cannot build or hang one, find out which species at your school would use a hollow and design the right box for it: the hole size decides who gets in.',
      steps: [
        'Find out which bird or possum you are building for. The hole size decides.',
        'Build or assemble the box, with a lid you can open to check it later.',
        'Ask your teacher where it can be fixed, and how high.',
        'Face the hole away from the afternoon sun and the wind.',
        'Write the date on it, and agree who checks it next term.',
      ],
      photoPrompt: 'Photograph your box on the tree, with the trunk behind it.',
    },
    writingPromptByStage: {
      1: 'You looked for a hole in an old tree and made a nest box. Who might live in it?',
      2: 'You looked for hollows in your schoolyard and did not find many, so you made a nest box. Explain why a bird needs a hole to nest in.',
      3: 'You looked for tree hollows, then built a nest box. Explain why hollows are hard to replace and how your box helps.',
      4: 'You looked for tree hollows in your schoolyard, then built a nest box. Explain why a hollow takes so long to form, and what happens to hollow-dependent species in a place with only young trees.',
      5: 'You looked for tree hollows in your schoolyard, then built a nest box. Explain why hollow scarcity is a long-term bottleneck for Australian wildlife, and evaluate how far artificial boxes can substitute for the real thing.',
    },
  },
  {
    id: 'sea-lion',
    name: 'Australian Sea Lion',
    scientificName: 'Neophoca cinerea',
    image: '/images/sea-lion.jpg',
    habitatArea: 'coast',
    habitatLabel: 'Australian Coast',
    habitatColor: '#2A7C9B',
    selfAttestWhere: 'Go and stand next to a drain.',
    selfAttestPrompt: 'A stormwater grate, a gutter, a downpipe. Anywhere water leaves your school.',
    selfAttestQuestion: 'Are you standing next to somewhere water runs away?',
    videoUrl: null,
    activity: {
      question: 'How does rubbish dropped in a schoolyard kilometres from the sea end up in the ocean?',
      options: [
        'It is carried there by birds',
        'It does not, rubbish stays where it falls',
        'It evaporates and falls as rain at sea',
        'Rain washes it into drains, and drains run to creeks and then the sea',
      ],
      correct: 3,
      fact: 'Stormwater is not treated. Anything on hard ground when it rains goes down a grate and comes out in a creek, a river and then the sea, usually within a day. Australian sea lions are one of the rarest sea lions in the world and entanglement in marine debris is a documented cause of death, particularly for pups.',
    },
    observation: {
      seconds: 120,
      focus: 'Where the water goes',
      title: 'Two minutes at the drain',
      instruction: 'Stand still and look at the ground around you. Put the screen down, and do not pick anything up yet.',
      lookFor: [
        'Which way does the ground slope? Where would water run?',
        'What is lying around that would travel with it?',
        'What is the smallest piece of rubbish you can find?',
      ],
    },
    citizenScience: {
      id: 'sea-lion-twenty-pieces',
      title: 'Twenty Pieces',
      icon: '🧤',
      brief: 'Everything you just looked at is one rainfall away from a creek. Take twenty pieces of it out of the system.',
      primary: 'With gloves or a pickup tool, collect twenty pieces of rubbish from between you and that drain, and bin them.',
      fallback: 'If you cannot safely pick it up, count twenty pieces instead, photograph the worst spot, and report it so it can be cleared properly.',
      steps: [
        'Put gloves on, or use a pickup tool. Never bare hands.',
        'Start at the drain and work back along your line.',
        'Count as you go. Twenty pieces, however small.',
        'Leave anything sharp or broken. Tell a teacher instead.',
        'Bin it, then wash your hands.',
      ],
      photoPrompt: 'Photograph your twenty pieces before they go in the bin.',
    },
    writingPromptByStage: {
      1: 'You picked up twenty pieces of rubbish near a drain. Where would they have gone if you had left them?',
      2: 'You collected twenty pieces of rubbish before they reached the drain. Explain how rubbish at school can end up in the sea.',
      3: 'You removed twenty pieces of rubbish from the stormwater path. Explain the journey a piece of litter takes from your schoolyard to the ocean.',
      4: 'You removed twenty pieces of rubbish from the stormwater path. Explain how schoolyard litter becomes marine debris, and why small pieces are more dangerous than large ones.',
      5: 'You removed twenty pieces of rubbish from the stormwater path. Explain why stormwater is a major pathway for marine debris, and evaluate whether clean-ups address the problem or only its symptoms.',
    },
  },
  {
    id: 'chimpanzee',
    name: 'Chimpanzee',
    scientificName: 'Pan troglodytes',
    image: '/images/chimpanzee.jpg',
    habitatArea: 'forest',
    habitatLabel: 'African Forest',
    habitatColor: '#6B7F5A',
    selfAttestWhere: 'Go and stand in the garden.',
    selfAttestPrompt: 'Any planted area. The messier and more mixed up, the better.',
    selfAttestQuestion: 'Are you standing somewhere with plants growing in it?',
    videoUrl: null,
    activity: {
      question: 'Chimpanzees use tools to fish insects out of termite mounds. What does that tell you about insects in a forest?',
      options: [
        'They are worth the effort, because almost everything depends on them',
        'They are only eaten when there is no fruit',
        'Only young chimpanzees eat them',
        'They are a problem the forest would be better without',
      ],
      correct: 0,
      fact: 'Jane Goodall watched a chimpanzee strip a twig to fish for termites in 1960, and it changed what we thought made humans different. Insects are worth that effort because they are the base of the whole food web: lose them and everything above them goes too.',
    },
    observation: {
      seconds: 120,
      focus: 'Nowhere for small things to live',
      title: 'Two minutes in the garden',
      instruction: 'Crouch down and look closely into the planting. Put the screen down. There is nothing to write yet.',
      lookFor: [
        'Can you find anything alive that is smaller than your fingernail?',
        'Where could something that small shelter from the sun, the rain and being stepped on?',
        'How many different kinds of hiding place are there, and how many are the same?',
      ],
    },
    citizenScience: {
      id: 'chimp-bug-hotel',
      title: 'Build a Bug Hotel',
      icon: '🐝',
      brief: 'Different insects need completely different homes. One kind of space houses almost nothing. Many kinds house a lot.',
      primary: 'Build a bug hotel with as many different hole sizes and materials as you can: bamboo, drilled wood, hollow stems, bark, pine cones.',
      fallback: 'If you cannot build a frame, bundle hollow stems tightly together with string and wedge the bundle somewhere dry and out of the wind.',
      steps: [
        'Collect materials with holes of different sizes. Variety is the whole point.',
        'Pack them tightly into a box, a tin or a bundle so nothing rattles loose.',
        'Make sure the holes face outwards and the back is closed.',
        'Wedge it somewhere dry, off the ground, out of the afternoon sun.',
        'Leave it alone. Check in a month to see who moved in.',
      ],
      photoPrompt: 'Photograph your bug hotel, close enough to see the different hole sizes.',
    },
    writingPromptByStage: {
      1: 'You looked for small creatures in the garden and built them a home. Why do they need somewhere to hide?',
      2: 'You looked for places small creatures could live, then built a bug hotel. Explain why you made the holes different sizes.',
      3: 'You looked at how few hiding places your garden had, then built a bug hotel. Explain why insects matter to everything bigger than them.',
      4: 'You looked at how few places small creatures had to live, then built a bug hotel with many different spaces. Explain why variety of shelter matters as much as amount of shelter, and what a place loses without its insects.',
      5: 'You looked at how few places small creatures had to live, then built a bug hotel. Explain the role of invertebrates as the base of a food web, and evaluate what a single structure can and cannot do for local invertebrate diversity.',
    },
  },
  {
    id: 'gorilla',
    name: 'Western Lowland Gorilla',
    scientificName: 'Gorilla gorilla gorilla',
    image: '/images/gorilla.jpg',
    habitatArea: 'forest',
    habitatLabel: 'African Forest',
    habitatColor: '#6B7F5A',
    selfAttestWhere: 'Go to where the most people in your school walk past.',
    selfAttestPrompt: 'The office, the library, the front door. Somewhere everybody passes.',
    selfAttestQuestion: 'Is this somewhere lots of people walk past?',
    videoUrl: null,
    activity: {
      question: 'Old mobile phones contain a metal called coltan. Why does that matter to a gorilla?',
      options: [
        'Gorillas are frightened by the noise phones make',
        'Phones are made from trees',
        'Coltan is mined out of the forest gorillas live in',
        'It does not affect them at all',
      ],
      correct: 2,
      fact: 'Coltan is mined in Central Africa, in and around the forests where gorillas and chimpanzees live, and the mining clears habitat and brings hunting with it. Millions of unused phones sit in drawers across Australia. Taronga runs a phone recycling campaign with MobileMuster for exactly this reason.',
    },
    observation: {
      seconds: 120,
      focus: 'Where our devices come from',
      title: 'Two minutes counting devices',
      instruction: 'Stand still and count every device you can see: tablets, phones, laptops, screens, the whiteboard. Put your own screen down after you have counted.',
      lookFor: [
        'How many devices can you see from where you are standing?',
        'How many old phones would you guess are sitting in drawers at your house?',
        'Where did the metal inside all of them come from?',
      ],
    },
    citizenScience: {
      id: 'gorilla-phone-box',
      title: 'Start the Phone Drive',
      icon: '📦',
      brief: 'Taronga collects old phones so the metal inside them is reused instead of mined out of gorilla forest. Your job is not to collect them all. Your job is to start it.',
      primary: 'Build and decorate a phone collection box, label it with why it matters, and put it where the whole school walks past.',
      fallback: 'If your school cannot host a box, make a card for students to take home that tells families how to recycle an old phone.',
      steps: [
        'Find a sturdy box with a lid and cut a slot in the top.',
        'Decorate it so people look at it twice.',
        'Write on it what goes in, and why: the metal inside is mined from gorilla forest.',
        'Ask the office where it is allowed to live, and put it there.',
        'Agree with your teacher who empties it and where the phones go.',
      ],
      photoPrompt: 'Photograph your box where you put it, with people walking past if you can.',
    },
    writingPromptByStage: {
      1: 'You made a box for old phones. How does recycling a phone help a gorilla?',
      2: 'You counted the devices in your school, then made a collection box for old phones. Explain what old phones have to do with gorillas.',
      3: 'You counted the devices around you, then started a phone drive. Explain how mining for phone metals affects gorilla habitat.',
      4: 'You counted the devices around you, then started a phone drive. Explain the chain between a phone in a drawer in Australia and a forest in Central Africa, and why recycling breaks that chain.',
      5: 'You counted the devices around you, then started a phone drive. Explain how demand for mineral resources drives habitat loss, and evaluate whether recycling schemes meaningfully reduce that demand or mainly raise awareness.',
    },
  },
  {
    id: 'rhino',
    name: 'Greater One-Horned Rhino',
    scientificName: 'Rhinoceros unicornis',
    image: '/images/rhino.jpg',
    habitatArea: 'wetland',
    habitatLabel: 'Floodplain Grassland',
    habitatColor: '#5C7A8A',
    selfAttestWhere: 'Go and stand out in the open sun, with no shade at all.',
    selfAttestPrompt: 'The middle of a playground, an open path, anywhere the sun hits hard.',
    selfAttestQuestion: 'Are you standing somewhere out in the open sun?',
    videoUrl: null,
    activity: {
      question: 'Greater one-horned rhinos spend hours a day in water and mud. What is that mostly for?',
      options: ['Hunting fish', 'Cooling down and getting rid of biting insects', 'Hiding from other rhinos', 'Drinking, and nothing else'],
      correct: 1,
      fact: 'They are strong swimmers and wallow for hours to regulate their temperature and shed parasites. An animal that cannot cool down cannot survive a hot day, no matter how much food is around it. Water is not a luxury in a hot place. It is the thing that decides who can live there.',
    },
    observation: {
      seconds: 120,
      focus: 'Where would anything drink',
      title: 'Two minutes in the sun',
      instruction: 'Stand still out in the open and look around you. Put the screen down. There is nothing to write yet.',
      lookFor: [
        'Where is the nearest water an animal could actually reach and drink?',
        'How far would a bird have to fly from here to find any?',
        'On the hottest day of summer, where would anything out here go?',
      ],
    },
    citizenScience: {
      id: 'rhino-water-in-the-open',
      title: 'Water in the Open',
      icon: '💧',
      brief: 'You just looked for water an animal could drink and probably found none. Put some out.',
      primary: 'Set out a shallow dish of water where a drinking bird has a clear view all around it, off the ground and away from anywhere a cat could hide.',
      fallback: 'If water is not allowed at your school, make a shaded cool spot instead: a board or tile raised on stones over bare soil, with a finger-width gap underneath.',
      steps: [
        'Choose an open spot with a clear view all the way around.',
        'Keep it away from bushes or fences a cat could hide behind.',
        'Raise it off the ground if you can: a stump, a brick, a table.',
        'Fill it shallow, no deeper than your finger, and put a stone in it so insects can climb out.',
        'Agree with your class who refills it each week.',
      ],
      photoPrompt: 'Photograph your water, with the open ground around it in shot.',
    },
    writingPromptByStage: {
      1: 'You looked for water an animal could drink, then put some out. Who might come and use it?',
      2: 'You looked for water in your schoolyard and did not find much, so you put some out. Explain why animals need water on a hot day.',
      3: 'You looked for water an animal could reach, then put some out in the open. Explain why a rhino spends hours in water, and why your dish helps here.',
      4: 'You looked for water an animal could reach, then put some out in the open. Explain why a rhino wallows, and why access to water decides which animals can survive a hot place.',
      5: 'You looked for water an animal could reach, then put some out in the open. Explain thermoregulation as a limit on where a species can live, and evaluate how much difference a single water source makes in an urban environment.',
    },
  },
];

export const ZOOYARD_HABITAT_META = {
  bushland:  { label: 'Australian Bushland', color: '#7A8B6F' },
  rainforest: { label: 'Sumatran Rainforest', color: '#E86A33' },
  // ⚠️ Replaced 'savannah' on 2026-10-28 when the giraffe became Nura Diya. No ZooYard
  //    habitat is African savannah any more. 🚫 Do not re-add savannah without an animal.
  country:   { label: 'Nura Diya Australia', color: '#A8502D' },
  coast:     { label: 'Australian Coast',    color: '#2A7C9B' },
  forest:    { label: 'African Forest',      color: '#6B7F5A' },
  wetland:   { label: 'Floodplain Grassland', color: '#5C7A8A' },
};

// Richer per-habitat visual theme — used for the more immersive activity/quiz screens.
// Distinct from habitatColor (a single accent used for badges etc.) — this carries a full
// gradient + texture + iconography so each habitat feels like a different place, not just
// a different accent colour.
export const ZOOYARD_HABITAT_THEME = {
  bushland: {
    icon: '🌳',
    videoBg: '/videos/habitat-bushland.mp4',
    bgGradient: 'linear-gradient(160deg, #1B2410 0%, #33461F 45%, #5C7233 85%, #8AA354 100%)',
    cardGradient: 'linear-gradient(160deg, #E5E8DE, #FFFFFF)',
    accent: '#5C7233',
    accentSoft: '#E8EBE2',
    accentBorder: 'rgba(92,114,51,0.4)',
  },
  rainforest: {
    icon: '🌴',
    videoBg: '/videos/habitat-rainforest.mp4',
    bgGradient: 'linear-gradient(160deg, #061512 0%, #0D2E24 45%, #164A38 85%, #226B4D 100%)',
    cardGradient: 'linear-gradient(160deg, #DCE7E3, #FFFFFF)',
    accent: '#226B4D',
    accentSoft: '#E0EAE6',
    accentBorder: 'rgba(34,107,77,0.4)',
  },
  // ⚠️ Reuses the BUSHLAND video deliberately: there is no Nura Diya footage, and Australian
  //    bush is the honest stand-in. The red-earth palette is what separates it on screen.
  //    `/videos/habitat-savannah.mp4` (3.5MB) is now unreferenced — delete it when convenient.
  country: {
    icon: '🦘',
    videoBg: '/videos/habitat-bushland.mp4',
    bgGradient: 'linear-gradient(160deg, #2A1008 0%, #5C2414 45%, #8F3D22 85%, #C2622F 100%)',
    cardGradient: 'linear-gradient(160deg, #F5E6DE, #FFFFFF)',
    accent: '#A8502D',
    accentSoft: '#F5E6DE',
    accentBorder: 'rgba(168,80,45,0.4)',
  },

  // ⚠️ These three have `videoBg: null` — there is no ambient habitat video for coast, African
  // forest or floodplain yet. The write-up screen checks for it and falls back to the gradient,
  // so a null is safe; a path to a file that does not exist is NOT, it renders a broken <video>.
  // The three existing clips are also heavy (savannah 3.5MB, bushland 2.8MB) for a whole class
  // on a school network, so think before commissioning three more.
  coast: {
    icon: '🌊',
    videoBg: null,
    bgGradient: 'linear-gradient(160deg, #04161F 0%, #0B2F42 45%, #14566E 85%, #2A7C9B 100%)',
    cardGradient: 'linear-gradient(160deg, #DDE8ED, #FFFFFF)',
    accent: '#2A7C9B',
    accentSoft: '#DFEAF0',
    accentBorder: 'rgba(42,124,155,0.4)',
  },
  forest: {
    icon: '🌳',
    videoBg: null,
    bgGradient: 'linear-gradient(160deg, #101A0C 0%, #26361C 45%, #435A30 85%, #6B7F5A 100%)',
    cardGradient: 'linear-gradient(160deg, #E4E8DD, #FFFFFF)',
    accent: '#4F6B39',
    accentSoft: '#E7EBE0',
    accentBorder: 'rgba(79,107,57,0.4)',
  },
  wetland: {
    icon: '💧',
    videoBg: null,
    bgGradient: 'linear-gradient(160deg, #0D1A1F 0%, #1F3A44 45%, #3D6070 85%, #5C7A8A 100%)',
    cardGradient: 'linear-gradient(160deg, #E0E7EA, #FFFFFF)',
    accent: '#456A7C',
    accentSoft: '#E2EAEE',
    accentBorder: 'rgba(69,106,124,0.4)',
  },
};

// ⚠️ `ZOOYARD_CITIZEN_SCIENCE_TASK` (the standalone "Habitat Hero" task that used to unlock
// after all three habitats) was removed on 2026-09-28. It was absorbed: every animal now carries
// its own `citizenScience` block, run immediately after that habitat's measurement so the thing
// built is a response to the number just taken. Do not reintroduce a single end-of-session task
// alongside these — it would ask students to build a fourth thing for no measured reason.
