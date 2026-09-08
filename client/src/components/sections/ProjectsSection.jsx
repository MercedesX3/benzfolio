'use client';

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
 * Everything keys its entrance off `active` rather than `whileInView`: this
 * section lives inside a rail that is translated up into place, and to an
 * IntersectionObserver a translated element is still "in view" — the rail
 * moves, the viewport never does. So scroll-triggered animation would fire on
 * page load, long before the reader arrives, and the section would be sitting
 * still by the time they got here.
 */
export default function ProjectsSection({ active, selected, onSelect }) {
  const rise = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: active ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.6, delay: active ? delay : 0, ease: [0.16, 1, 0.3, 1] },
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

          {/* The mat slides up from under the objects. */}
          <motion.div
            className="pj__mat"
            style={{
              '--x': PROJECT_MAT.x,
              '--y': PROJECT_MAT.y,
              '--w': PROJECT_MAT.w,
              '--h': PROJECT_MAT.h,
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {PROJECT_ITEMS.map((item, i) => (
            <LayItem
              key={item.id}
              item={item}
              index={i}
              active={active}
              selected={selected === item.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
