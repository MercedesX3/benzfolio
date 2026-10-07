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

/**
 * The three links under the name on the About section.
 *
 * Spotify has no URL yet. An entry with no href is left off the page
 * entirely: it used to render as greyed-out text, which read as a broken link
 * rather than a placeholder. Fill the href in and it appears with no other
 * change.
 */
export const ABOUT_LINKS = [
  { label: 'Spotify', href: '' },
  {
    label: 'Goodreads',
    href: 'https://www.goodreads.com/user/show/124363498-mjx-xjm',
  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mercedes-xiong' },
];

/**
 * The links in the header and the footer.
 *
 * These are the deck's own sections, and they are PATHS rather than hashes:
 * every section is a real route (/projects, /about) and the deck opens on the
 * one in the URL. The old list — work, playground, about — pointed at
 * `/#work` and `/#playground`, which stopped existing when the site became a
 * deck, so two of the five footer links went nowhere.
 *
 * Kept in step with PILL_NAV in data/flatlay.js, which is the same set.
 */
export const SECTIONS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

/**
 * The words on the About board.
 *
 * Everything on the cork is a picture, which is charming and tells a
 * recruiter nothing — so the space above it carries two short paragraphs in
 * her own voice. Every claim is one the rest of the site already evidences.
 */
export const ABOUT_BIO = [
  "I'm a CS student at UT Dallas who builds full-stack products and designs the screens they live on — lately SAGE, an AI advisor used by 2,000+ students, and Semantica, which charts how a book feels chapter by chapter.",
  "I'm also VP of ACM @ UTD. Off the clock: reading, sketching buildings, and indie records from whichever decade I'm stuck in. Life is greater with hash tables (most of the time).",
];

/* What she reaches for first, not everything she has touched. */
export const TOOLBOX = ['React', 'Next.js', 'TypeScript', 'Python', 'AWS', 'Figma'];

export const DISCLAIMER =
  "I don't like driving or birds. But I do believe that sometimes your biggest fears end up becoming the things that push you forward.";
