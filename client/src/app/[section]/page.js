import Deck from '@/components/Deck';
import Welcome from '@/components/Welcome';
import { SECTIONS } from '@/data/sections';

/**
 * A deck section as a real URL — /projects, /about — rather than a hash on
 * '/'. Every one of them renders exactly the same page as the root; the Deck
 * reads the path on mount and opens on that section, so a deep link lands in
 * the right place and the address bar stays clean while the nav slides.
 *
 * `dynamicParams = false` matters: without it any single-segment path would
 * render the deck, so /nonsense would silently be the home page instead of a
 * 404. Only the ids below exist.
 */
export function generateStaticParams() {
  return SECTIONS.filter((s) => s.id !== 'home').map((s) => ({ section: s.id }));
}

export const dynamicParams = false;

export default function SectionPage() {
  return (
    <>
      <Welcome />
      <Deck />
    </>
  );
}
