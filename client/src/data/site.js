/**
 * Everything the page says about Mercedes that isn't a project.
 *
 * Kept in one module so copy edits never mean hunting through JSX.
 * File paths run through encodeURI because two of the asset folders have
 * spaces in their names.
 */

export const EMAIL = 'mercedesx935@gmail.com';
export const RESUME = '/Mercedes_Xiong_Resume_Summer2026.pdf';

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/MercedesX3' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mercedes-xiong' },
  {
    label: 'Goodreads',
    href: 'https://www.goodreads.com/user/show/124363498-mjx-xjm',
  },
];

/* Drives both the header nav and the mobile drawer. */
export const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'playground', label: 'Playground' },
  { id: 'about', label: 'About' },
];

export const MARQUEE = [
  { text: 'Full-stack developer', dot: 'var(--red)' },
  { text: 'CS @ UT Dallas', dot: 'var(--yellow)' },
  { text: 'VP of ACM @ UTD', dot: 'var(--green)' },
  { text: 'AWS · React · Python', dot: 'var(--red)' },
  { text: 'Building things people use', dot: 'var(--yellow)' },
];

export const STATS = [
  { value: '2,000+', label: 'students served by SAGE' },
  { value: '180+', label: 'ACM officers supported' },
  { value: '9', label: 'divisions coordinated' },
  { value: '200+', label: 'active ACM members' },
];

const COMMUNITY = '/Community/Community Photos/';

export const ACM_PHOTOS = [
  { file: '100_0173.jpeg', caption: 'ACM Peechi night', rotate: -2 },
  { file: 'DSC09356.JPG', caption: 'Spring 2026 kickoff', rotate: 1.6 },
  { file: 'DSC09698.JPG', caption: 'Spring 2026 board', rotate: -1.2 },
  { file: 'f25 eos-34.JPG', caption: 'ACM campus @ EOS', rotate: 2.2 },
].map((photo) => ({ ...photo, src: encodeURI(COMMUNITY + photo.file) }));

export const STOPS = [
  {
    tag: 'School',
    title: 'CS @ UT Dallas',
    body: 'Computer science major, learning how systems fit together — and how companies compartmentalize information in the products people use every day.',
  },
  {
    tag: 'Community',
    title: 'Officer, ACM @ UTD',
    body: 'Joined the largest tech community on campus and started running workshops and events for students trying to break into tech.',
  },
  {
    tag: 'Current',
    title: 'Vice President, ACM @ UTD',
    body: 'Supporting 180+ officers across 9 divisions and 200+ active members, keeping fun, useful programming shipping every semester.',
  },
  {
    tag: 'Shipped',
    title: 'Built SAGE',
    body: 'Led an AI advising platform to 2,000+ UT Dallas students — transcript parsing, degree evaluation, and a RAG chatbot for course planning.',
  },
  {
    tag: 'Open road',
    title: 'Next stop',
    body: 'Looking for a summer 2026 software engineering internship where I can build things people actually use.',
  },
];

export const SKILLS = [
  {
    label: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'C++'],
  },
  {
    label: 'Frontend',
    items: [
      'React',
      'Next.js',
      'React Native',
      'Vue.js',
      'styled-components',
      'Three.js',
    ],
  },
  {
    label: 'Backend & data',
    items: [
      'Node.js',
      'FastAPI',
      'AWS Lambda',
      'Firebase',
      'Redis',
      'Pinecone',
      'LangChain',
    ],
  },
  {
    label: 'Design & tools',
    items: ['Figma', 'Git', 'Vercel', 'Plaid API', 'Gemini', 'Prototyping'],
  },
];

const PLAYGROUND_DIR = '/playground pics/';

export const PLAYGROUND_PHOTOS = [
  'IMG_0252.JPG',
  'IMG_0293.JPG',
  'IMG_0406.JPG',
  'IMG_0509.JPG',
  'IMG_0618.JPG',
  'IMG_0628.JPG',
  'IMG_0629.JPG',
  'IMG_0639.JPG',
].map((file, i) => ({
  src: encodeURI(PLAYGROUND_DIR + file),
  rotate: i % 2 ? 1.6 : -1.8,
}));

export const ABOUT_PARAGRAPHS = [
  "Thanks so much for coming to check me out. I'm a CS major at UT Dallas and an aspiring full-stack developer.",
  'I love trying to understand how companies compartmentalize their information on websites and apps — and I believe life is greater with hash tables (most of the time).',
  'In my free time you can find me reading, sketching buildings, or listening to indie music, or the 80s, or the 70s, or the 60s (the list goes on).',
];

export const BOOKS = [
  'AnimalFarm.jpeg',
  'Atmosphere.jpg',
  'Hamnet.jpg',
  'HouseCeruleanSea.jpg',
  'LovelyWar.jpg',
  'SevenHusbands.jpg',
  'ThisIsHowYouLoseTheTimeWar.jpg',
].map((file) => `/book-covers/${file}`);

export const ALBUMS = [
  'ArianaGrande.jpg',
  'HaveYouEverSeenTheRain.jpeg',
  'NovoAmor.jpg',
  'StickSeason.jpg',
  'TheNightWeMet.jpg',
].map((file) => `/Album-covers/${file}`);

export const NOW = [
  {
    label: 'Building',
    body: "Scaling SAGE's degree-evaluation engine so advising answers stay right every catalog year.",
  },
  {
    label: 'Leading',
    body: 'Spring semester programming for ACM @ UTD — 9 divisions, one calendar.',
  },
  {
    label: 'Looking for',
    body: `Summer 2026 SWE internships. Say hi: ${EMAIL}`,
  },
];

export const DISCLAIMER =
  "I don't like driving or birds. But I do believe that sometimes your biggest fears end up becoming the things that push you forward.";
