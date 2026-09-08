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
 * `index` staggers the entrance so a section's objects land one after another
 * rather than all at once. The animation runs on `whileInView` for the home
 * section (visible on load) but is driven by `active` for later sections,
 * because a section sitting off-screen in a translated rail still counts as
 * "in view" to IntersectionObserver — the rail moves, the viewport doesn't.
 */
export default function LayItem({ item, active, selected, onSelect, index = 0, animate = true }) {
  const geometry = item.anchor
    ? { right: item.anchor.right, bottom: item.anchor.bottom, width: item.anchor.width }
    : { '--x': item.x, '--y': item.y, '--w': item.w };

  return (
    <motion.button
      type="button"
      className={`fl__item ${item.anchor ? 'fl__item--anchored' : ''} ${
        selected ? 'is-active' : ''
      }`}
      style={{ ...geometry, zIndex: item.z, '--rot': `${item.rotate}deg`, '--rot-hover': `${item.hoverRotate}deg` }}
      onClick={() => onSelect(item.id)}
      aria-label={`${item.label} — open details`}
      initial={animate ? { opacity: 0, y: 26, scale: 0.97 } : false}
      animate={animate ? (active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 26, scale: 0.97 }) : false}
      transition={{
        duration: 0.62,
        delay: active ? 0.16 + index * 0.075 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* The image's REAL intrinsic size, not a square placeholder.
          Browsers derive `aspect-ratio` from the width/height attributes, so a
          wrong pair reserves a wrong-shaped box: with `width: 640 height: 640`
          every object laid out square until its bitmap arrived and then
          snapped to its true shape.

          `loading="eager"` because these images ARE the site, not decoration
          further down a long page. The sections live inside a clipped,
          transform-translated rail, and Chrome's lazy-load heuristics decided
          most of them were not in the viewport and never fetched them at all —
          objects rendered as empty buttons. There are about ten images total
          and the reader reaches any section in one click, so there is nothing
          for deferring to save. */}
      <Image
        src={item.src}
        alt=""
        width={item.iw}
        height={item.ih}
        sizes="(max-width: 900px) 60vw, 620px"
        loading="eager"
        className="fl__img"
      />
      <span className="fl__tag hand" aria-hidden="true">
        {item.label}
      </span>
    </motion.button>
  );
}
