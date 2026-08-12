import sage from './magazines/sage.json';
import lumina from './magazines/lumina.json';
import archer from './magazines/archer.json';
import finterest from './magazines/finterest.json';
import windle from './magazines/windle.json';

/**
 * Display layer over the raw project JSON.
 *
 * `metric` is deliberately only set where the number is verifiable. The
 * solutionImpact copy in archer/finterest/windle.json still contains
 * placeholder figures ("$2M in sales", "10,000+ active users",
 * "50,000 downloads") that don't match those projects — surfacing unverified
 * numbers on a portfolio is worse than showing none, so those cards lead with
 * what they actually are and what they're built with instead.
 */
export const PROJECTS = [
  {
    ...sage,
    slug: 'sage',
    name: 'SAGE',
    kicker: 'AI advising platform',
    blurb:
      'An AI advising platform for UT Dallas — transcript parsing, degree evaluation, and a RAG chatbot that answers course-planning questions in plain language.',
    metric: { value: '2,000+', label: 'UTD students served' },
    accent: 'blue',
    lead: ['AWS Lambda', 'Pinecone', 'LangChain', 'Gemini', 'React'],
    featured: true,
  },
  {
    ...lumina,
    slug: 'lumina',
    name: 'Lumina',
    kicker: 'Stargazing forecaster',
    blurb:
      'Weather, moon phase, light pollution, and celestial events folded into one score that tells you when and where the sky is actually worth looking at.',
    metric: null,
    accent: 'yellow',
    lead: ['React Native', 'Data pipelines', 'Mobile'],
    featured: true,
  },
  {
    ...archer,
    slug: 'archer',
    name: 'Archer',
    kicker: 'Architecture dictionary',
    blurb:
      "A living dictionary that puts architecture's vocabulary and visual collections at designers' fingertips.",
    metric: null,
    accent: 'red',
    lead: ['Next.js', 'React', 'styled-components', 'Redis'],
  },
  {
    ...finterest,
    slug: 'finterest',
    name: 'Finterest',
    kicker: 'Social finance app',
    blurb:
      'A mobile-first take on investing built around the social side of money — bringing opportunities into users’ pockets.',
    metric: null,
    accent: 'blue',
    lead: ['React Native', 'Firebase', 'Plaid API', 'Node.js'],
  },
  {
    ...windle,
    slug: 'windle',
    name: 'Windle',
    kicker: 'Hyperlocal weather PWA',
    blurb:
      'Hyperlocal forecasts and alerts delivered as a progressive web app, so it works anywhere without an install.',
    metric: null,
    accent: 'yellow',
    lead: ['Vue.js', 'FastAPI', 'Python', 'PWA'],
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
