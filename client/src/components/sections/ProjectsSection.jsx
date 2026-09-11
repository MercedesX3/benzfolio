'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import LayItem from '../lay/LayItem';
import { PROJECT_ITEMS, PROJECT_MAT } from '../../data/sections';
import { STAGE } from '../../data/flatlay';
import './ProjectsSection.css';

/**
 * Section 02 — the work, laid out as print.
 *
 * Each project is a magazine cover or a device on a violet mat. The mat is a
 * CSS rectangle rather than an image (see PROJECT_MAT in data/sections.js).
 *
 * Entrances run once on mount, not on arrival. The rail's slide is the whole
 * transition, and re-animating content as a section arrives would make the two
 * sections read as separate screens swapping rather than one continuous move.
 * (Scroll-triggered `whileInView` would not work here either: every section is
 * technically on screen the whole time, because the rail moves and the viewport
 * does not.)
 */
/**
 * The mat's manifest entry describes the VIOLET BODY. The image frame is
 * bigger than that — the surrounding shadow is part of the PNG — so convert
 * body geometry into frame geometry before positioning it.
 */
function matFrame(mat) {
  const frame = ({ x, y, w }) => {
    const fw = w / mat.bodyW;
    const fh = fw * (mat.ih / mat.iw);
    return [Math.round(x - mat.inset.left * fw), Math.round(y - mat.inset.top * fh), Math.round(fw)];
  };
  const [x, y, w] = frame(mat);
  /* Both spaces get converted, because the body-to-frame conversion is not a
     scale — it depends on the width — so the portrait numbers cannot be
     derived from the desktop ones by CSS. */
  const [mx, my, mw] = frame(mat.m);
  return { '--x': x, '--y': y, '--w': w, '--mx': mx, '--my': my, '--mw': mw };
}

export default function ProjectsSection({ selected, onSelect }) {
  /* Entrance on mount only — see the note in LayItem. */
  const rise = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <div className="pj">
      <div className="fl__stage-wrap">
        <div className="fl__stage" style={{ '--w': STAGE.w, '--h': STAGE.h }}>
          <header className="pj__head">
            <motion.p className="pj__kicker" {...rise(0)}>
              Welcome to
            </motion.p>
            <motion.h2 className="pj__title kelsi" {...rise(0.07)}>
              Projects
            </motion.h2>
            <motion.p className="pj__list" {...rise(0.14)}>
              <span>Sage</span>
              <span>Semantica</span>
              <span>Archer</span>
              <span>Lumina</span>
            </motion.p>
          </header>

          {/* The mat slides up from under the objects. Wrapped, and the
              wrapper is stage-sized and absolutely positioned — a transform on
              a bare static wrapper would become the containing block for the
              absolutely positioned mat and collapse its percentage geometry. */}
          <motion.div
            className="fl__mat-wrap"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={PROJECT_MAT.src}
              alt=""
              width={PROJECT_MAT.iw}
              height={PROJECT_MAT.ih}
              loading="eager"
              className="pj__mat"
              style={matFrame(PROJECT_MAT)}
            />
          </motion.div>

          {PROJECT_ITEMS.map((item, i) => (
            <LayItem
              key={item.id}
              item={item}
              index={i}
              selected={selected === item.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
