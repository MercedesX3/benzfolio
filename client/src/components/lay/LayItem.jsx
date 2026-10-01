'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

/**
 * One object lying on a mat — a phone, a polaroid, a poster.
 *
 * Extracted so the home flat-lay and the projects section share one
 * implementation. They previously would have needed the same hover halo,
 * rotation, focus ring and label markup duplicated in two places, which is
 * exactly the sort of thing that drifts apart after a few rounds of tweaks.
 *
 * Two placement modes, chosen by whether the item carries an `anchor`:
 *   • staged   — design-space x/y/w, which FlatLay.css turns into percentages
 *                of the fixed-aspect stage
 *   • anchored — raw CSS offsets pinning it to a corner of the viewport, for
 *                objects that must touch the real screen edge
 *
 * The entrance runs ONCE, on mount, and is never re-triggered when a section
 * becomes current. That is deliberate: the deck's whole motion is the rail
 * sliding, and if each section's objects also faded and rose on arrival, the
 * two sections would read as separate screens being swapped. Animating only on
 * mount leaves the slide as a single continuous movement — the sections feed
 * into one another, which is the intended feel.
 *
 * `index` staggers that one entrance so objects land in sequence rather than
 * all together.
 */
export default function LayItem({ item, selected, onSelect, index = 0, animate = true }) {
  /* An object is interactive if it has a card to open. That's the whole test.
     The cork board's stickers and books carry no `content`, so they render as
     plain images that only tilt on hover — no button, no white halo, nothing
     in the tab order. The halo is this site's signal for "click me and a card
     opens", and putting it on something inert is a promise the object can't
     keep. */
  const interactive = Boolean(item.content) && typeof onSelect === 'function';

  const geometry = item.anchor
    ? { right: item.anchor.right, bottom: item.anchor.bottom, width: item.anchor.width }
    : { '--x': item.x, '--y': item.y, '--w': item.w };

  /* Both placements ship as custom properties and the media query picks one.
     No JS decides this — a layout that depended on a matchMedia read would
     have to wait for the client, and the first paint would be the wrong one.

     An item with no `m` has no portrait placement and is hidden there: the
     phone composition is not the desktop one scaled down, and a couple of
     objects (the Lumina phones) simply do not appear in it. */
  const style = {
    ...geometry,
    zIndex: item.z,
    '--rot': `${item.rotate}deg`,
    '--rot-hover': `${item.hoverRotate}deg`,
    ...(item.m ? { '--mx': item.m.x, '--my': item.m.y, '--mw': item.m.w } : null),
  };
  const place = item.m ? '' : 'fl__item--no-mobile';

  const motionProps = {
    initial: animate ? { opacity: 0, y: 26, scale: 0.97 } : false,
    animate: animate ? { opacity: 1, y: 0, scale: 1 } : false,
    transition: { duration: 0.62, delay: 0.16 + index * 0.075, ease: [0.16, 1, 0.3, 1] },
  };

  /* The image's REAL intrinsic size, not a square placeholder.
      Browsers derive `aspect-ratio` from the width/height attributes, so a
      wrong pair reserves a wrong-shaped box: with `width: 640 height: 640`
      every object laid out square until its bitmap arrived and then snapped
      to its true shape.

      `loading="eager"` because these images ARE the site, not decoration
      further down a long page. The sections live inside a clipped,
      transform-translated rail, and Chrome's lazy-load heuristics decided
      most of them were not in the viewport and never fetched them at all —
      objects rendered as empty buttons. There are a few dozen images total
      and the reader reaches any section in one click, so there is nothing for
      deferring to save. */
  /**
   * What width this object actually renders at, as a `sizes` the browser can
   * act on.
   *
   * Every object used to declare the same `620px`, which is true of none of
   * them: the mat is 1400px wide on a laptop and a sticky note is 160. The
   * browser picks its srcset candidate from this number, so one value for
   * everything means fetching a 1280px file for a 160px sticker and, on a
   * wide screen, too small a file for the big ones.
   *
   * An object's width tracks its share of the 1440 design space, so that is
   * what it declares — but in px, and never above the 620px every object used
   * to claim.
   *
   * The vw version of this is what you reach for first, and it broke the home
   * page: declaring the Semantica tablet at 57vw pushed it to a variant the
   * browser would not finish decoding, and the object vanished from the
   * composition entirely while every smaller one was fine. The cap means no
   * image ever asks for MORE than it did before — small objects simply stop
   * asking for far too much.
   *
   * Portrait keeps vw, where the stage really is the full viewport width.
   * Anchored objects carry their own CSS width and state it directly.
   */
  const sizes = item.anchor
    ? item.anchor.width
    : `(max-width: 860px) ${Math.ceil(((item.m?.w ?? item.w) / 804) * 100)}vw, ${Math.min(
        620,
        Math.ceil(item.w * 1.15)
      )}px`;

  const picture = (
    <Image
      src={item.src}
      alt={interactive ? '' : item.label}
      width={item.iw}
      height={item.ih}
      sizes={sizes}
      loading="eager"
      className="fl__img"
    />
  );

  if (!interactive) {
    return (
      <motion.div
        className={`fl__item fl__item--still ${place} ${
          item.spin ? 'fl__item--spin' : ''
        } ${item.anchor ? 'fl__item--anchored' : ''}`}
        style={style}
        {...motionProps}
      >
        {picture}
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      className={`fl__item ${place} ${item.anchor ? 'fl__item--anchored' : ''} ${
        selected ? 'is-active' : ''
      }`}
      style={style}
      onClick={() => onSelect(item.id)}
      aria-label={`${item.label} — open details`}
      {...motionProps}
    >
      {picture}
      <span className="fl__tag hand" aria-hidden="true">
        {item.label}
      </span>
    </motion.button>
  );
}
