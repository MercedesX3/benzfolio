/**
 * The 15-second project reels.
 *
 * One clip per project, playing inside the popup. Every clip runs the same
 * five beats on the same clock — title, problem, product, outcome, rest — so
 * the set reads as a series rather than four unrelated animations. What
 * changes between projects is the CONTENT of each beat: SAGE parses a
 * transcript, Semantica draws an emotion arc, Lumina folds four feeds into one
 * number. The mechanism is the thing worth showing; a slideshow of screenshots
 * is not.
 *
 * These are rendered as motion, not video. A 15s mp4 at a size worth looking
 * at is megabytes per project and goes soft the moment it scales; this is a
 * few KB, stays crisp at any size, takes its colours from the design tokens
 * and can honour prefers-reduced-motion by composing to a still frame.
 *
 * `at` and `to` are seconds on the 15s timeline. Scenes read their own local
 * progress (0 → 1 across their window), so changing a beat's length here
 * re-times its animation without touching the drawing code.
 */

export const REEL_DURATION = 15;

/** The shared five-beat spine. Every reel uses these windows. */
export const BEATS = [
  { id: 'title', at: 0, to: 2.4 },
  { id: 'problem', at: 2.4, to: 6.2 },
  { id: 'product', at: 6.2, to: 11.2 },
  { id: 'outcome', at: 11.2, to: 14.2 },
  { id: 'rest', at: 14.2, to: 15 },
];

/**
 * Per-project copy and palette.
 *
 * `scene` picks the drawing code in components/reel/scenes.jsx. `accent` is the
 * project's own colour — the reel is the one place the site's single-accent
 * rule relaxes, because each clip is its own world for fifteen seconds.
 */
export const REELS = {
  /* Palettes are sampled from the live products, not chosen to match the
     portfolio. A clip that is the site's blue tells you nothing about what the
     thing actually looks like — and the first job of a demo is recognition.
     utdsage.com: near-black #101211, mint #5AED86, paper #ECF8F0. */
  sage: {
    scene: 'sage',
    accent: '#5AED86',
    accentSoft: '#1d2a22',
    ink: '#ECF8F0',
    subInk: '#7c8a82',
    dark: true,
    bg: '#101211',
    /* utdsage.com sets its headline in a serif on near-black. The portfolio's
       own display face here would make every clip look like the portfolio
       rather than like the product. */
    serif: true,
    title: 'SAGE',
    subtitle: 'Your AI-powered student advisor',
    problem: 'Advising books out weeks ahead.',
    product: 'Transcript in. Degree plan evaluated. Answer with its source.',
    /* The count is the picture; the label only has to say what it counts. */
    outcome: 'students served',
  },
  /* semantica.mjxiong.com: warm grey ground #D7D8D0, white cards, deep green
     #113E00 set in Libre Baskerville, and the four emotion lines below. */
  semantica: {
    scene: 'semantica',
    accent: '#113E00',
    accentSoft: '#e7e5e4',
    bg: '#D7D8D0',
    serif: true,
    /* Lifted from EmotionArc's ILLUSTRATIVE series in the Semantica repo —
       the same four colours and the same twelve values the app's own chart
       draws, so the clip is the product's chart rather than a lookalike. */
    emotions: [
      { label: 'Joy', color: '#4D8937', values: [0.55, 0.62, 0.5, 0.38, 0.3, 0.34, 0.26, 0.2, 0.42, 0.6, 0.74, 0.86] },
      { label: 'Sadness', color: '#6B5B95', values: [0.18, 0.2, 0.3, 0.42, 0.5, 0.46, 0.62, 0.7, 0.5, 0.34, 0.22, 0.14] },
      { label: 'Fear', color: '#8B5E34', values: [0.1, 0.16, 0.26, 0.3, 0.44, 0.58, 0.52, 0.66, 0.48, 0.3, 0.18, 0.1] },
      { label: 'Anger', color: '#B4695A', values: [0.08, 0.12, 0.22, 0.4, 0.34, 0.28, 0.46, 0.38, 0.24, 0.18, 0.1, 0.06] },
    ],
    /* The app's own chart furniture: dashed stone grid, muted axis labels, and
       the green it marks the selected section with. */
    grid: '#e7e5e4',
    axis: '#a8a29e',
    mark: '#4D8937',
    card: '#fafaf9',
    cardLine: '#e7e5e4',
    title: 'Semantica',
    subtitle: 'Find your next book by how it feels',
    problem: 'Tropes tell you what happens. Not how it feels.',
    product: 'Split into chapters. Read the emotion. Chart the arc. Bring it to life.',
    outcome: 'Soundtrack and character voices, from the arc',
  },
  /* Lexicon's own palette, straight from the challenge's colour step: built
     dark-first because the app is used outdoors mid-activity, with the blue
     carrying every interactive moment. */
  lexicon: {
    scene: 'lexicon',
    accent: '#009EE3',
    accentDeep: '#005BAE',
    accentSoft: '#1b2228',
    ink: '#FFFFFF',
    subInk: '#4D4D4D',
    dark: true,
    bg: '#0b0e10',
    title: 'Lexicon',
    subtitle: 'Translation for GoPro',
    problem: 'Translation breaks exactly when you cannot type.',
    product: 'Voice, text, camera — and the original never leaves the screen.',
    outcome: 'Seven screens, brief to final',
  },

  archer: {
    scene: 'archer',
    accent: '#8a5a2b',
    accentSoft: '#f0e4d6',
    title: 'Archer',
    subtitle: 'A dictionary for architects',
    problem: 'I kept sketching details I had no name for.',
    product: 'Every term carries a definition, a period, and a visual collection.',
    outcome: 'Built from my own sketchbook',
  },
  lumina: {
    scene: 'lumina',
    accent: '#6f7bff',
    accentSoft: '#1b1f3b',
    dark: true,
    title: 'Lumina',
    subtitle: 'Stargazing forecaster',
    problem: 'Five charts. No answer.',
    product: 'Cloud, moon, light pollution and events fold into one score.',
    outcome: 'ACM Projects Design Winner, F2024',
  },
};

export const getReel = (slug) => REELS[slug] ?? null;
