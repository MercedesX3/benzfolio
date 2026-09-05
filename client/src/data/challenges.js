/**
 * Design challenges — self-directed product exercises, each written up as the
 * journey from brief to screens rather than just a final shot.
 *
 * The home page shows the short version in a sheet; /work/[slug] renders the
 * full journey.
 */

export const CHALLENGES = [
  {
    slug: 'gopro-translation',
    name: 'Lexicon',
    brief: 'Design a translation tool for GoPro',
    kicker: 'Design challenge · Mobile app',
    summary:
      'A translation companion for GoPro users — voice, text, and camera, built for the moments when you are somewhere unfamiliar and need to understand what is being said or written around you.',
    /* Device mockup with a transparent ground — framed light on the card. */
    cover: '/challenges/gopro-translation/card-cover.png',
    year: '2026',
    role: 'Product design · UI',

    /* The short version, shown in the home page's project sheet before the
       reader commits to the full journey below. */
    sheet: {
      stack: ['Self-directed brief', 'Figma', 'Mobile', 'Type & colour'],
      steps: [
        {
          title: 'Set my own brief',
          body: 'No client, no prompt handed to me — I picked a company with a real constraint (action cameras, hands busy, unfamiliar places) and wrote the brief myself.',
        },
        {
          title: 'Framed the problem',
          body: "Travel translation breaks down exactly when you can't type: mid-hike, mid-dive, mid-conversation. So voice, text, and camera all had to be first-class inputs, not buried modes.",
        },
        {
          title: 'Type and colour decisions',
          body: "Borrowed GoPro's high-contrast, gear-first language and pushed it toward legibility outdoors — heavy weights, big hit targets, colour used only for state.",
        },
        {
          title: 'Where it landed',
          body: 'A home screen built around one action and three input paths, with the full journey — sketches through final frames — written up as a case study.',
        },
      ],
    },

    /* Silent 4s loop — opens the journey before the written breakdown. */
    video: {
      src: '/challenges/gopro-translation/walkthrough.mp4',
      label: 'Lexicon — onboarding',
    },

    /* Step 1 — the framing exercise the whole thing started from. */
    breakdown: {
      title: 'Defining the challenge',
      lede:
        'Before any screens, I forced the product into three short sentences. If I could not say what it was in a line, I did not understand it well enough to design it.',
      points: [
        'AI-powered translation tool for GoPro users.',
        'Translates voice, text, and camera instructions across languages.',
        'Designed for fast, context-aware communication during adventures.',
      ],
    },

    /* Step 2 — type */
    typography: {
      title: 'Typography',
      lede:
        'A display face with GoPro’s squared-off, technical character for titles, paired with a neutral grotesque for anything a user actually has to read quickly.',
      image: '/challenges/gopro-translation/typography.png',
      alt:
        'Typography specimen: TRT Fluke Demo as the title typeface, Albert Sans as the UI typeface',
      faces: [
        {
          role: 'Title typeface',
          name: 'TRT Fluke Demo',
          note: 'Wide, squared terminals that echo the GoPro wordmark. Headlines only.',
        },
        {
          role: 'UI typeface',
          name: 'Albert Sans',
          note: 'Geometric but quiet. Holds up at small sizes and in long translation strings.',
        },
      ],
    },

    /* Step 3 — colour */
    palette: {
      title: 'Colour',
      lede:
        'Built dark-first: the app gets used outdoors, mid-activity, often one-handed. Blue carries every interactive moment so translation output is never confused with chrome.',
      swatches: [
        { name: 'Off White Parchment', hex: '#FFFFFF', role: 'Text', text: 'dark' },
        { name: 'Blue', hex: '#009EE3', role: 'Accent', text: 'light' },
        { name: 'Deep Blue', hex: '#005BAE', role: 'Accent', text: 'light' },
        { name: 'Charcoal', hex: '#4D4D4D', role: 'Sub text', text: 'light' },
      ],
    },

    /* Step 4 — the screens */
    screens: {
      title: 'The screens',
      lede:
        'Seven screens covering the full path: first launch, setup, the connected home state, live translation in both connected and disconnected states, and saved output.',
      items: [
        {
          src: '/challenges/gopro-translation/onboarding.png',
          title: 'Onboarding',
          caption:
            'Leads with the promise in the user’s own words — conversations, surroundings, and footage — so the value is clear before any setup is asked for.',
        },
        {
          src: '/challenges/gopro-translation/language-setup.png',
          title: 'Language setup — primary',
          caption:
            'Picks the primary language first. One decision per screen keeps first launch from feeling like a form.',
        },
        {
          src: '/challenges/gopro-translation/language-setup-2.png',
          title: 'Language setup — targets',
          caption:
            'Same layout, second question. Repeating the pattern makes the second step feel like momentum rather than another hurdle.',
        },
        {
          src: '/challenges/gopro-translation/home.png',
          title: 'Home',
          caption:
            'Camera connection sits up top, the language pair is the largest object on screen, and Voice / Text / Both sets the mode. Recent translations sit underneath for quick repeats.',
        },
        {
          src: '/challenges/gopro-translation/live-translation.png',
          title: 'Live translation',
          caption:
            'Original above, translation below, in one bubble — you never lose what was actually said. Sides and colour separate you from the person you are talking to. Pause, Stop, and Save stay in reach.',
        },
        {
          src: '/challenges/gopro-translation/live-translation-disconnected.png',
          title: 'Live translation — not connected',
          caption:
            'The failure state is designed, not an afterthought. It names the problem, lists nearby cameras, and offers one clear way forward instead of an error toast.',
        },
        {
          src: '/challenges/gopro-translation/scan-result.png',
          title: 'Saved translations',
          caption:
            'Translations become files you can export, so a conversation on a trip is still useful once you are home.',
        },
      ],
    },

    /* Step 5 — closing note. Draft; edit freely. */
    outcome: {
      title: 'What it adds up to',
      body: [
        'The through-line is that translation happens while something else is going on. Someone using this is mid-conversation, mid-hike, or standing in front of a sign they cannot read — so every screen is built around one primary decision, with the largest tap targets on the thing you need most.',
        'Two choices carried the most weight. Keeping the original text alongside the translation, rather than replacing it, means a bad translation is recoverable in conversation. And treating the disconnected state as a real screen — with named cameras and a way forward — acknowledges that hardware pairing is where this product most often breaks.',
      ],
    },
  },
];

export const getChallenge = (slug) => CHALLENGES.find((c) => c.slug === slug);
