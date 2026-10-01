/**
 * The long version of each project.
 *
 * The popup is the teaser; this is what opens when someone wants the whole
 * story. It lives at /projects/<slug>.
 *
 * Content rule: everything here is true and already evidenced somewhere in the
 * repo — the project JSON, the flat-lay copy, the resume. Where a project has
 * no measured outcome, the `result` says what was built rather than inventing
 * a number. A padded case study is worse than a short one.
 *
 * ── Shape ──────────────────────────────────────────────────────────────────
 * `chapters` are the scroll beats. Each is one idea with one supporting
 * artifact, in the order the build actually went: what was broken, what I
 * decided, what it cost, what came out.
 *
 * `note` is the handwritten margin note on that chapter — an aside in her
 * voice, not a summary of the paragraph next to it. If it only repeats the
 * body, leave it out.
 *
 * `artifact` is a real asset in public/. Nothing here is a mockup of a screen
 * that does not exist.
 */

export const CASE_STUDIES = {
  sage: {
    slug: 'sage',
    title: 'SAGE',
    kicker: 'AI advising platform',
    year: '2024 — 2025',
    role: 'Full-stack · ACM Projects team',
    lede: 'Advising at UT Dallas books out weeks ahead, so students plan their degrees off forum posts and group chats. SAGE answers the two questions they actually ask — what do I still need, and what should I take next — and shows its source while it does.',
    stat: { value: '2,000+', label: 'students served' },
    stack: ['AWS Lambda', 'DynamoDB', 'S3', 'API Gateway', 'Pinecone', 'Gemini', 'LangChain', 'React', 'Firebase'],
    links: [
      { label: 'Visit utdsage.com', href: 'https://utdsage.com/' },
      { label: 'Source on GitHub', href: 'https://github.com/acmutd/sage-site' },
    ],
    chapters: [
      {
        title: 'The appointment you cannot get',
        body: 'Registration opens, advising is booked solid, and the answer you need is a ten-minute question. So students ask the group chat instead, and the group chat is confidently wrong about prerequisites. I scoped SAGE around the gap: not replacing an advisor, answering the part that never needed one.',
        note: 'every October, the same panic',
        artifact: { src: '/magazine-covers/sage-cover.png', alt: 'SAGE cover', w: 629, h: 838, tilt: -2 },
      },
      {
        title: 'Parse first, generate second',
        body: 'The transcript gets parsed into structured course history and evaluated against the degree plan deterministically — plain code, no model involved. That was the call the whole project turned on: a language model should never be the thing deciding whether you have met a requirement. It gets to explain the result, not compute it.',
        note: 'the model explains. it does not decide.',
      },
      {
        title: 'Grounding the chatbot',
        body: 'Catalog and policy documents are chunked and embedded into Pinecone; LangChain retrieves the passages that matter and Gemini answers in plain language with the citation in view. If an answer cannot be traced back to a document, that is a bug, not a quirk.',
        note: 'an answer you cannot check is a rumour',
        artifact: { src: '/project-pictures/SAGE-TRIPLE-OFFICIAL.png', alt: 'SAGE screens', w: 1600, h: 1000, tilt: 1.5 },
      },
      {
        title: 'Shipping into a spike',
        body: 'Usage is nothing for months and then everything for two weeks, so it runs serverless on Lambda and costs what it is used. Built with the ACM Projects team and iterated against the questions students actually sent, which were never the questions we designed for.',
        result: 'Live at utdsage.com, used by more than 2,000 students.',
      },
    ],
  },

  semantica: {
    slug: 'semantica',
    title: 'Semantica',
    kicker: 'Book discovery, by feeling',
    year: '2025',
    role: 'Design and build, solo',
    lede: 'You never finish a book and want "more fiction." You want the specific thing that one did to you. Semantica reads a book chapter by chapter, maps the emotions in each one, and charts how they change from the first page to the last — then uses that arc to recommend, to score a soundtrack, and to give the characters a voice.',
    stat: { value: '6', label: 'emotions, tracked per section' },
    stack: ['Next.js', 'HuggingFace', 'BART-MNLI', 'Figma'],
    links: [
      { label: 'Visit semantica.mjxiong.com', href: 'https://semantica.mjxiong.com/' },
      { label: 'Source on GitHub', href: 'https://github.com/MercedesX3/Semantica-v2' },
    ],
    chapters: [
      {
        title: 'Tropes tell you what happens',
        body: 'Recommendations lean on genre and tropes — enemies to lovers, the chosen one, the locked-room mystery. But two books with the same tropes can feel completely different to read. The useful axis is where a story is warm, where it aches, where the dread builds and where it finally breaks, and nothing was sorting on it.',
        note: 'the shelf knows the category, not the feeling',
        artifact: {
          src: '/semantica/hifi/home.png',
          alt: 'The Semantica home page',
          w: 1800,
          h: 920,
          tilt: -1.5,
        },
      },
      {
        title: 'Chapter by chapter, not book by book',
        body: 'The pipeline is four steps: split the book into sections, score each section for joy, sadness, fear, anger, disgust and surprise, chart those scores across the book, then bring the result to life. Scoring per chapter rather than per book is the whole difference — a single average flattens the turn, and the turn is the part you remember.',
        note: 'one number per book hides the shape',
      },
      {
        title: 'The arc is the interface',
        body: 'Every book opens on its own emotional arc: six lines over ten sections, with the overall mix beside it — Frankenstein runs mostly fear, at 30% across the book. A recommender that only outputs a ranked list asks for trust it has not earned. Putting the arc on the surface lets you disagree with it, and disagreeing is how you find the next book.',
        note: 'let people argue with the match',
        artifact: {
          src: '/semantica/hifi/emotional-arc.png',
          alt: 'Sentiment analysis and the emotional arc for Frankenstein, beside the soundtrack panel',
          w: 1400,
          h: 1349,
          tilt: 1.2,
        },
      },
      {
        title: 'What the arc unlocks',
        body: 'Once a book has an arc, the arc can drive more than a recommendation. It scores a soundtrack that follows the story section by section, and gives each speaker a distinct voice for audiobook-style clips. Bring your own book too: upload a PDF and the analysis runs entirely in the browser, so the file is never uploaded or shared.',
        result: 'Live at semantica.mjxiong.com — five classics analyzed, from Frankenstein to The Great Gatsby.',
        artifact: {
          src: '/semantica/hifi/explore.png',
          alt: 'The Explore page, showing the analyzed classics',
          w: 1800,
          h: 853,
          tilt: -1,
        },
      },
    ],
  },

  /**
   * Lexicon moved here from /work/gopro-translation, which now redirects.
   * It is a design project rather than a build, so the chapters follow the
   * design decisions — the brief, the type, the colour, the one screen
   * choice that carried the most weight — and every screen shown is a real
   * frame from the Figma file.
   */
  lexicon: {
    slug: 'lexicon',
    title: 'Lexicon',
    kicker: 'Design challenge · Mobile app',
    year: '2026',
    role: 'Product design · UI',
    lede: 'A translation companion for GoPro users — voice, text and camera, for the moments when you are somewhere unfamiliar and need to understand what is being said or written around you. No client and no prompt: I picked the constraint and wrote the brief myself.',
    stat: { value: '7', label: 'screens, brief to final' },
    stack: ['Self-directed brief', 'Figma', 'Mobile', 'Type & colour'],
    links: [],
    /* The remaining screens, shown together at the end. Four of the seven are
       artifacts in the chapters above; these are the ones whose argument is
       the sequence rather than any single frame. */
    gallery: {
      title: 'The rest of the set',
      lede: 'Setup is two screens asking one question each, and saved translations export as files — so a conversation on a trip is still useful once you are home.',
      items: [
        { src: '/challenges/gopro-translation/onboarding.png', caption: 'Onboarding' },
        { src: '/challenges/gopro-translation/language-setup.png', caption: 'Language setup — primary' },
        { src: '/challenges/gopro-translation/language-setup-2.png', caption: 'Language setup — targets' },
        { src: '/challenges/gopro-translation/scan-result.png', caption: 'Saved translations' },
      ],
      w: 402,
      h: 874,
    },
    chapters: [
      {
        title: 'Three sentences before any screens',
        body: 'I forced the product into three short lines before drawing anything: an AI translation tool for GoPro users; voice, text and camera across languages; built for fast, context-aware communication during adventures. If I could not say what it was in a line, I did not understand it well enough to design it.',
        note: 'no client. I picked the constraint.',
        /* The walkthrough belongs to this chapter rather than floating above
           the page: it is the onboarding, and running it under the clip put
           two dark 16:9 blocks back to back. */
        artifact: {
          video: '/challenges/gopro-translation/walkthrough.mp4',
          alt: 'Lexicon — onboarding walkthrough',
        },
      },
      {
        title: 'The keyboard is the wrong first input',
        body: 'Travel translation breaks down exactly when you cannot type — mid-hike, mid-dive, mid-conversation. So voice, text and camera all had to be first-class inputs rather than buried modes, and the home screen had to make the choice between them in one tap.',
        note: 'hands busy is the normal case',
      },
      {
        title: 'Borrowed the gear language, pushed it to legibility',
        body: "A display face with GoPro's squared-off, technical character carries the titles — TRT Fluke Demo — paired with Albert Sans for anything a user actually has to read quickly, because it holds up at small sizes and in long translation strings. Heavy weights, big hit targets, colour used only for state.",
        artifact: {
          src: '/challenges/gopro-translation/typography.png',
          alt: 'Typography specimen: TRT Fluke Demo for titles, Albert Sans for UI',
          w: 421,
          h: 423,
          tilt: 1.2,
        },
      },
      {
        title: 'Dark-first, because it lives outdoors',
        body: 'The app gets used outside, mid-activity, often one-handed, so it is built dark-first with blue carrying every interactive moment — #009EE3 for actions and #005BAE for depth. That rule means translation output is never confused with chrome, which matters when you are reading a stranger\'s sentence off a phone in the sun.',
        artifact: {
          src: '/challenges/gopro-translation/home.png',
          alt: 'The Lexicon home screen: camera connection, language pair, and the Voice / Text / Both modes',
          w: 402,
          h: 874,
          tilt: -1,
        },
      },
      {
        title: 'Keep the original on screen',
        body: 'Original above, translation below, in one bubble — you never lose what was actually said, so a bad translation is recoverable in conversation rather than a dead end. Sides and colour separate you from the person you are talking to, and Pause, Stop and Save stay in reach the whole time.',
        note: 'a bad translation should be recoverable',
        artifact: {
          src: '/challenges/gopro-translation/live-translation.png',
          alt: 'Live translation: the original sentence above its translation in a single bubble',
          w: 402,
          h: 874,
          tilt: 1.5,
        },
      },
      {
        title: 'The failure state is a screen, not a toast',
        body: 'Hardware pairing is where this product most often breaks, so the disconnected state got designed like any other screen: it names the problem, lists nearby cameras and offers one clear way forward. Saved translations export as files, so a conversation on a trip is still useful once you are home.',
        result: 'Seven screens covering the full path — first launch, setup, connected home, live translation in both states, and saved output.',
        artifact: {
          src: '/challenges/gopro-translation/live-translation-disconnected.png',
          alt: 'The not-connected state, naming the problem and listing nearby cameras',
          w: 402,
          h: 874,
          tilt: -1.2,
        },
      },
    ],
  },

  archer: {
    slug: 'archer',
    title: 'Archer',
    kicker: 'A dictionary for architects',
    year: '2024',
    role: 'Design and build, solo',
    lede: 'I sketch buildings for fun and kept hitting details I could draw but not name. Archer is the reference I wanted: every term carries a definition, a period, and a visual collection, so an entry teaches by example instead of by paragraph.',
    stat: { value: 'A–Z', label: 'built from my own sketchbook' },
    stack: ['Next.js', 'React', 'styled-components', 'Redis'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/MercedesX3/archer' }],
    chapters: [
      {
        title: 'Drawing something you cannot name',
        body: 'You can render an arch perfectly and still not know that the wedge-shaped stones in it are voussoirs. Not knowing the word is not a vocabulary problem — it means you cannot search for it, cannot read about why it works, and cannot ask anyone a precise question about it.',
        note: 'from my own sketchbook, mostly',
        artifact: { src: '/magazine-covers/archer-cover.png', alt: 'Archer cover', w: 629, h: 838, tilt: -2 },
      },
      {
        title: 'The entry is a collection',
        body: 'A definition alone teaches nothing — architectural terms are visual facts. So every entry pairs the text with a period and a collection of examples, and the collection is the part that does the work. The definition is there to confirm what the images already told you.',
        note: 'the pictures teach. the words confirm.',
      },
      {
        title: 'Typeset like a reference book',
        body: 'styled-components let me hold a strict type scale and spacing system across every entry, because a dictionary that sets each page differently stops reading as a dictionary. Redis caches lookups so search stays instant as the collection grows.',
        artifact: { src: '/flatlay/archer-ipad.png', alt: 'Archer on an iPad', w: 1149, h: 1039, tilt: 1.5 },
      },
      {
        title: 'Still growing',
        body: 'It started as a private glossary and became a browsable reference, which means the backlog is now every term I have not drawn yet. That is the right kind of backlog.',
        result: 'A living reference, added to whenever the sketchbook runs ahead of the vocabulary.',
      },
    ],
  },

  lumina: {
    slug: 'lumina',
    title: 'Lumina',
    kicker: 'Stargazing forecaster',
    year: '2024',
    role: 'Design and build · ACM Projects',
    lede: 'Every stargazing app hands you five charts and lets you do the maths. Lumina folds cloud cover, moon phase, light pollution and celestial events into one score that answers the only question that matters: is tonight worth the drive?',
    stat: { value: 'F2024', label: 'ACM Projects Design Winner' },
    stack: ['React Native', 'Data pipelines', 'Mobile'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/MercedesX3/Lumina' }],
    chapters: [
      {
        title: 'Four answers, none of them the answer',
        body: 'Cloud cover lives in one app, moon phase in another, light pollution on a map you have to pan, events in a newsletter. Each is correct and none of them tells you whether to get in the car. The work was not gathering the data — it was being willing to collapse it into one number.',
        note: 'nobody wants a dashboard at 11pm',
        artifact: { src: '/magazine-covers/lumina-cover.png', alt: 'Lumina cover', w: 629, h: 838, tilt: 2 },
      },
      {
        title: 'One weighted score',
        body: 'Four feeds get normalised onto a common scale and combined with weights that reflect what actually ruins a night — cloud beats everything, a full moon beats a dark sky site. The score is deliberately opinionated. An average would have been honest and useless.',
        note: 'cloud cover wins every argument',
      },
      {
        title: 'Designed for the dark',
        body: 'Dark surfaces, minimal chrome, nothing bright enough to wreck your night vision while you are standing in a field. The last forecast caches on device, because the places worth driving to are the places with no signal.',
        artifact: { src: '/project-pictures/LUMINA-EVENT-OFFICIAL.png', alt: 'Lumina event screen', w: 1600, h: 1000, tilt: -1.5 },
      },
      {
        title: 'What it won',
        body: 'Built with React Native so it runs on the phone you actually take outside, and shown at the ACM Projects showcase at the end of the semester.',
        result: 'ACM Projects Design Winner, Fall 2024.',
      },
    ],
  },
};

export const CASE_SLUGS = Object.keys(CASE_STUDIES);

export const getCaseStudy = (slug) => CASE_STUDIES[slug] ?? null;

/**
 * The order the pages hand off in, which is the order the objects lie on the
 * projects mat — not the order of this file.
 *
 * Archer is not on that mat any more; it is reachable from the sketchbook on
 * the home desk. So it keeps its page and its place in the loop, at the end,
 * rather than being dropped or silently reordering the four on the mat.
 */
const NEXT_ORDER = ['sage', 'semantica', 'lexicon', 'lumina', 'archer'];

/** The next project in the set, so the page ends with a way onward. */
export function getNextCase(slug) {
  const i = NEXT_ORDER.indexOf(slug);
  if (i === -1) return null;
  return CASE_STUDIES[NEXT_ORDER[(i + 1) % NEXT_ORDER.length]];
}
