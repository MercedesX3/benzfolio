'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import LayItem from '../lay/LayItem';
import { ABOUT_ITEMS, ABOUT_MAT, ABOUT_SHELF } from '../../data/sections';
import { STAGE } from '../../data/flatlay';
import { ABOUT_LINKS } from '../../data/site';
import './AboutSection.css';

/**
 * Section 03 — the cork board.
 *
 * Same grammar as the other two sections: a surface with objects lying on it,
 * authored in the 1440 x 1024 design space and scaled as a unit. What changes
 * is the surface (a pinned board rather than a mat) and the fact that none of
 * these objects open a card — they are things about her, not work to click
 * through. LayItem handles that distinction itself: no `content`, no button.
 *
 * The two objects on the left — the record and the ACM poster — sit on the
 * grey, off the board. They are in a separate manifest only so the board's
 * contents stay one readable list; they render identically.
 *
 * Entrances run once on mount, not on arrival. The rail's slide is the whole
 * transition; re-animating on arrival would make the sections read as separate
 * screens swapping rather than one surface moving past.
 */
export default function AboutSection() {
  const rise = (delay) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <div className="ab">
      <div className="fl__stage-wrap">
        <div className="fl__stage" style={{ '--w': STAGE.w, '--h': STAGE.h }}>
          <header className="ab__head">
            <motion.p className="ab__kicker" {...rise(0)}>
              Learn a little bit about me!
            </motion.p>
            <motion.h2 className="ab__name kelsi" {...rise(0.07)}>
              Mercedes
            </motion.h2>
            <motion.p className="ab__links" {...rise(0.14)}>
              {ABOUT_LINKS.map((link) =>
                link.href ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <span key={link.label}>{link.label}</span>
                )
              )}
            </motion.p>
          </header>

          {/* The board slides up from under what's pinned to it. Wrapped,
              and the wrapper is stage-sized and absolutely positioned: a
              transform on a bare static wrapper would become the containing
              block for the absolutely positioned board and collapse its
              percentage geometry. */}
          <motion.div
            className="fl__mat-wrap"
            initial={{ opacity: 0, y: 52 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={ABOUT_MAT.src}
              alt=""
              width={ABOUT_MAT.iw}
              height={ABOUT_MAT.ih}
              loading="eager"
              className="ab__board"
              style={{ '--x': ABOUT_MAT.x, '--y': ABOUT_MAT.y, '--w': ABOUT_MAT.w }}
            />
          </motion.div>

          {ABOUT_SHELF.map((item, i) => (
            <LayItem key={item.id} item={item} index={i} />
          ))}

          {/* Everything pinned to the board moves as one group, so the CSS
              can slide it right into whatever cork is actually visible —
              see .ab__pins. Absolutely positioned and stage-sized, because
              a transform on a static wrapper would become the containing
              block for its absolute children and collapse the percentage
              geometry they are placed with. */}
          <div className="ab__pins">
            {ABOUT_ITEMS.map((item, i) => (
              <LayItem key={item.id} item={item} index={ABOUT_SHELF.length + i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
