import sage from './magazines/sage.json';
import lumina from './magazines/lumina.json';
import archer from './magazines/archer.json';
import finterest from './magazines/finterest.json';
import windle from './magazines/windle.json';

/**
 * Display layer over the raw project JSON.
 *
 * The JSON files stay the source of truth for the cover image and the live
 * links; everything below is the story the project sheet tells — a short
 * blurb, the stack, and the four decisions the build actually turned on.
 *
 * `span` is how many columns the card takes in the work grid (out of four),
 * and `tall` doubles its row height. The first two projects get the big
 * squares; the rest run as a band underneath.
 */

export const PROJECTS = [
  {
    slug: 'sage',
    name: 'SAGE',
    kind: 'AI advising platform',
    image: sage.image,
    href: sage.website,
    linkLabel: 'Visit utdsage.com',
    span: 2,
    tall: true,
    blurb:
      'An AI advising platform for UT Dallas — transcript parsing, degree evaluation, and a RAG chatbot that answers course-planning questions in plain language.',
    stack: ['AWS Lambda', 'Pinecone', 'LangChain', 'Gemini', 'React'],
    steps: [
      {
        title: 'Found the real problem',
        body: 'Advising appointments book out weeks ahead, so students plan degrees off forum posts. I scoped SAGE around the two questions students actually ask: what do I still need, and what should I take next.',
      },
      {
        title: 'Parsed the transcript',
        body: 'Built a parser that turns a raw transcript into structured course history, then mapped it against degree-plan requirements so evaluation is deterministic — not something the model guesses at.',
      },
      {
        title: 'Grounded the chatbot',
        body: 'Catalog and policy documents are chunked and embedded into Pinecone; LangChain retrieves the relevant passages and Gemini answers in plain language with the source in view.',
      },
      {
        title: 'Shipped it to 2,000+ students',
        body: 'Serverless on AWS Lambda so cost tracks usage during registration spikes, with a React front end built alongside the ACM team and iterated on real student questions.',
      },
    ],
  },
  {
    slug: 'lumina',
    name: 'Lumina',
    kind: 'Stargazing forecaster',
    image: lumina.image,
    href: lumina.github,
    linkLabel: 'View on GitHub',
    span: 2,
    tall: true,
    blurb:
      'Weather, moon phase, light pollution, and celestial events folded into one score that tells you when and where the sky is actually worth looking at.',
    stack: ['React Native', 'Data pipelines', 'Mobile'],
    steps: [
      {
        title: 'Started from frustration',
        body: 'Every stargazing app hands you five separate charts and lets you do the math. I wanted one number that answers: is tonight worth the drive?',
      },
      {
        title: 'Folded four feeds into one score',
        body: 'Cloud cover, moon phase, light pollution, and celestial events pull from separate sources, get normalised, and combine into a single weighted viewing score.',
      },
      {
        title: 'Designed for the dark',
        body: "A low-light interface — dark surfaces, minimal chrome — so the screen doesn't wreck your night vision while you are out there.",
      },
      {
        title: 'Built it mobile-first',
        body: 'React Native so one codebase runs on the phone you actually take outside, with the last forecast cached for spots with no signal.',
      },
    ],
  },
  {
    slug: 'archer',
    name: 'Archer',
    kind: 'Architecture dictionary',
    image: archer.image,
    href: null,
    linkLabel: null,
    span: 2,
    tall: false,
    blurb:
      "A living dictionary that puts architecture's vocabulary and visual collections at designers' fingertips.",
    stack: ['Next.js', 'React', 'styled-components', 'Redis'],
    steps: [
      {
        title: 'Sketching buildings, missing words',
        body: 'I sketch buildings for fun and kept hitting terms I had no name for. Archer started as my own glossary and grew into a browsable reference.',
      },
      {
        title: 'Structured the vocabulary',
        body: 'Every term carries a definition, a period, and a visual collection — so the entry teaches by example instead of by paragraph.',
      },
      {
        title: 'Made it fast',
        body: 'Next.js rendering with Redis caching on lookups, so search feels instant even as the collection of terms and imagery grows.',
      },
      {
        title: 'Typeset like a reference book',
        body: 'styled-components let me build a strict type scale and spacing system — dictionary discipline, on screen.',
      },
    ],
  },
  {
    slug: 'finterest',
    name: 'Finterest',
    kind: 'Social finance app',
    image: finterest.image,
    href: null,
    linkLabel: null,
    span: 2,
    tall: false,
    blurb:
      'A mobile-first take on investing built around the social side of money — bringing opportunities into users’ pockets.',
    stack: ['React Native', 'Firebase', 'Plaid API', 'Node.js'],
    steps: [
      {
        title: 'Money is a group chat',
        body: "First investments almost always come from a friend's recommendation. Finterest builds that in instead of pretending investing is solitary.",
      },
      {
        title: 'Connected real accounts',
        body: 'Plaid handles bank linking and balances, so the app works against real data without ever touching raw credentials.',
      },
      {
        title: 'Kept the feed live',
        body: 'Firebase for auth and realtime sync, with a Node service handling the heavier aggregation off-device.',
      },
      {
        title: 'Designed the trust layer',
        body: 'Clear provenance on every shared idea — who posted it, when, and what happened since — so social does not turn into hype.',
      },
    ],
  },
  {
    slug: 'windle',
    name: 'Windle',
    kind: 'Hyperlocal weather PWA',
    image: windle.image,
    href: null,
    linkLabel: null,
    span: 2,
    tall: false,
    blurb:
      'Hyperlocal forecasts and alerts delivered as a progressive web app, so it works anywhere without an install.',
    stack: ['Vue.js', 'FastAPI', 'Python', 'PWA'],
    steps: [
      {
        title: 'No install, no excuse',
        body: 'Weather is a thirty-second need. Shipping as a PWA means a link is the whole onboarding — no store, no download.',
      },
      {
        title: 'Went hyperlocal',
        body: 'A FastAPI service in Python interpolates station data down to the block, because campus weather and airport weather are not the same weather.',
      },
      {
        title: 'Made alerts useful',
        body: 'Push notifications fire on thresholds you set — rain in the next hour, temperature drops — rather than a generic daily digest.',
      },
      {
        title: 'Offline by default',
        body: 'Service worker caching keeps the last forecast readable with no connection, and the Vue front end stays light enough to load on campus wifi.',
      },
    ],
  },
];
