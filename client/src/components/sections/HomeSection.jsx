'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import LayItem from '../lay/LayItem';
import { ITEMS, MAT, STAGE } from '../../data/flatlay';
import { RESUME } from '../../data/site';

/**
 * Section 01 — the cutting mat.
 *
 * The chrome (menu, panel, nav pill) and the detail popup belong to the deck,
 * not here: they persist across every section, so a section owns only its own
 * surface and the objects on it.
 */
export default function HomeSection({ selected, onSelect }) {
  const staged = ITEMS.filter((i) => !i.anchor);
  const anchored = ITEMS.filter((i) => i.anchor);

  /* Entrance on mount only — see the note in LayItem. Re-animating on section
     change would make the slide read as two screens swapping. */
  const rise = (delay) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <div className="fl">
      <div className="fl__stage-wrap">
        <div className="fl__stage" style={{ '--w': STAGE.w, '--h': STAGE.h }}>
          <header className="fl__head">
            <motion.p className="fl__hi" {...rise(0)}>
              Hi I&apos;m
            </motion.p>
            <motion.h1 className="fl__name kelsi" {...rise(0.07)}>
              Mercedes Xiong
            </motion.h1>
            <motion.p className="fl__role" {...rise(0.14)}>
              <span>Full-stack developer</span>
              <span>CS @ UTDallas</span>
              <span>VP @ ACMUTD</span>
              {/* The only clickable thing in the masthead. .fl__head is
                  pointer-events: none so the composition underneath stays
                  hoverable through it, which means this link needs the
                  pointer events handed back explicitly — see .fl__role a. */}
              <a className="fl__resume" href={RESUME} target="_blank" rel="noreferrer">
                Résumé
              </a>
            </motion.p>
          </header>

          <motion.div
            className="fl__mat-wrap"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={MAT.src}
              alt=""
              width={MAT.iw}
              height={MAT.ih}
              priority
              sizes="(max-width: 860px) 226vw, 132vw"
              className="fl__mat"
              style={{
                '--x': MAT.x,
                '--y': MAT.y,
                '--w': MAT.w,
                '--mx': MAT.m.x,
                '--my': MAT.m.y,
                '--mw': MAT.m.w,
                '--mrot': `${MAT.m.rotate}deg`,
              }}
            />
          </motion.div>

          {staged.map((item, i) => (
            <LayItem
              key={item.id}
              item={item}
              index={i}
              selected={selected === item.id}
              onSelect={onSelect}
            />
          ))}
        </div>

        {/* Anchored objects live INSIDE the stage wrapper, not beside it.
            The wrapper is one stage tall and pinned to the top of the section,
            so a corner-anchored object lands in the first screenful. As a
            sibling of the wrapper it would resolve against the whole section —
            which for home is 1.8 screens, putting the sketchbook below the
            fold at rest. */}
        {anchored.map((item, i) => (
          <LayItem
            key={item.id}
            item={item}
            index={staged.length + i}
            selected={selected === item.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
