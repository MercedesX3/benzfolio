'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import ProjectReel from '../reel/ProjectReel';
import ChallengeVideo from '../ChallengeVideo';
import CaseNav from './CaseNav';
import '../flatlay/FlatLay.css';
import './CaseStudy.css';

/**
 * A project's case study — the desk, continued.
 *
 * The deck does not scroll: it slides between full-viewport sections. This
 * page is the one place the site scrolls, and that is the point — the flat-lay
 * is a surface you look at, and a case study is a thing you read through. The
 * fiction survives because what you scroll past is still objects on a desk:
 * sheets of paper pinned down, artwork taped at an angle, notes in the margin.
 *
 * ── Motion ────────────────────────────────────────────────────────────────
 * Three things move, and each answers a question:
 *   • the progress rail — where am I
 *   • sheets rising as they enter — what just arrived
 *   • artwork drifting a few percent against the scroll — what is this made of
 * Everything is transform and opacity. The parallax range is deliberately tiny
 * (±18px); a big range reads as a gimmick and makes the page feel loose.
 */

/** One chapter: a sheet of paper, its margin note, and its artifact. */
function Chapter({ chapter, index, reduced }) {
  const ref = useRef(null);
  /* Measured as the chapter crosses the viewport, so the artifact's drift is
     tied to the reader's position rather than to a timer. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const y = reduced ? 0 : drift;

  /* Chapters alternate sides, the way things land on a desk when you keep
     putting the next page down beside the last one. */
  const side = index % 2 === 0 ? 'left' : 'right';
  /* A chapter with no artwork is an argument, not an exhibit. Letting it hold
     the full width reads as a deliberate change of pace; leaving it in one
     column of two just looks like a missing image. */
  const solo = !chapter.artifact;

  return (
    <section className={`cs__chapter cs__chapter--${side}${solo ? ' cs__chapter--solo' : ''}`} ref={ref}>
      {/* The sheet and its note are one column. They were siblings of the
          artifact once, and the note — which spans the full width — opened a
          new grid row, dropping the artifact beneath the text instead of
          beside it. */}
      <div className="cs__col">
        <motion.article
          className="cs__sheet"
          initial={reduced ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="cs__pin" aria-hidden="true" />
          <p className="cs__chapter-no">{String(index + 1).padStart(2, '0')}</p>
          <h2 className="cs__chapter-title">{chapter.title}</h2>
          <p className="cs__chapter-body">{chapter.body}</p>

          {chapter.result && <p className="cs__result">{chapter.result}</p>}
        </motion.article>

        {chapter.note && (
          <motion.p
            className="cs__note hand"
            initial={reduced ? false : { opacity: 0, rotate: -3 }}
            whileInView={{ opacity: 1, rotate: -2 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            aria-hidden="true"
          >
            {chapter.note}
          </motion.p>
        )}
      </div>

      {chapter.artifact && (
        <motion.figure className="cs__artifact" style={{ y }}>
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotate: chapter.artifact.tilt ?? 0 }}
          >
            {chapter.artifact.video ? (
              <ChallengeVideo src={chapter.artifact.video} label={chapter.artifact.alt} />
            ) : (
              <Image
                src={chapter.artifact.src}
                alt={chapter.artifact.alt}
                width={chapter.artifact.w}
                height={chapter.artifact.h}
                sizes="(max-width: 900px) 86vw, 42vw"
                style={{ '--ar': chapter.artifact.w / chapter.artifact.h }}
              />
            )}
          </motion.div>
        </motion.figure>
      )}
    </section>
  );
}

export default function CaseStudy({ study, next }) {
  const reduced = useReducedMotion();
  const pageRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  /* Springing the rail keeps it from twitching on a trackpad's sub-pixel
     scroll events without lagging behind a real swipe. */
  const rail = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <main className="cs" ref={pageRef}>
      {/* Where am I. Fixed, hairline, and the only persistent chrome. */}
      <motion.span className="cs__rail" style={{ scaleY: rail }} aria-hidden="true" />

      <CaseNav />

      <Link href="/projects" className="cs__back">
        <ArrowLeft size={17} strokeWidth={2.5} />
        Back to the desk
      </Link>

      <header className="cs__hero">
        <motion.p
          className="eyebrow"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {study.kicker}
        </motion.p>

        <motion.h1
          className="cs__title kelsi"
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {study.title}
        </motion.h1>

        <motion.p
          className="cs__lede"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          {study.lede}
        </motion.p>

        {/* The clip and the facts side by side. The facts used to sit in a
            strip under the clip and the links at the very bottom of the
            page, so the three things a recruiter checks first — what was my
            part, what is it built with, can I see it — were a full scroll
            away, while the right half of the hero sat empty. */}
        <div className="cs__show">
          <motion.div
            className="cs__reel"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectReel slug={study.slug} label={study.title} />
          </motion.div>

          <motion.aside
            className="cs__aside"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <dl className="cs__facts">
              <div>
                <dt>{study.stat.label}</dt>
                <dd className="cs__stat">{study.stat.value}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{study.role}</dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>{study.year}</dd>
              </div>
            </dl>

            <div className="cs__stack">
              <h2 className="eyebrow">Built with</h2>
              <ul>
                {study.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            {study.links.length > 0 && (
              <div className="cs__links">
                {study.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="cs__link">
                    {l.label}
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </a>
                ))}
              </div>
            )}
          </motion.aside>
        </div>
      </header>

      <div className="cs__chapters">
        {study.chapters.map((chapter, i) => (
          <Chapter key={chapter.title} chapter={chapter} index={i} reduced={reduced} />
        ))}
      </div>

      {/* Screens whose argument is the sequence rather than any one frame.
          They close the page as a set, instead of becoming four more
          alternating chapters that all say "and then this screen". */}
      {study.gallery && (
        <section className="cs__gallery">
          <header className="cs__gallery-head">
            <h2 className="cs__gallery-title">{study.gallery.title}</h2>
            <p className="cs__gallery-lede">{study.gallery.lede}</p>
          </header>

          <ul className="cs__strip">
            {study.gallery.items.map((item, i) => (
              <motion.li
                key={item.src}
                initial={reduced ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  width={study.gallery.w}
                  height={study.gallery.h}
                  sizes="(max-width: 900px) 44vw, 22vw"
                />
                <span>{item.caption}</span>
              </motion.li>
            ))}
          </ul>
        </section>
      )}

      <footer className="cs__foot">
        {/* The links again, for someone who has just read to the end and now
            wants to see the thing. The stack is not repeated — it is a fact,
            and it is already at the top. */}
        {study.links.length > 0 && (
          <div className="cs__links cs__links--row">
            {study.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="cs__link">
                {l.label}
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </a>
            ))}
          </div>
        )}

        {next && (
          <Link href={`/projects/${next.slug}`} className="cs__next">
            <span className="eyebrow">Next</span>
            <span className="cs__next-title kelsi">{next.title}</span>
            <span className="cs__next-kicker">{next.kicker}</span>
          </Link>
        )}
      </footer>
    </main>
  );
}
