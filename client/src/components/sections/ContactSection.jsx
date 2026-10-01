'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { STAGE } from '../../data/flatlay';
import { EMAIL, RESUME, SOCIALS } from '../../data/site';
import './ContactSection.css';

/**
 * Section 04 — contact.
 *
 * The one section with no objects on it: after three screens of composition,
 * the last one is type on the bare ground. That contrast is the point — it
 * reads as the end of the site rather than a fourth arrangement.
 *
 * Built from her footer sketch: the MX mark at the left, two columns of links
 * at the right. The email is the addition. A screen called Contact whose only
 * way to reach her is a column of link labels would be missing its own job, so
 * the address is the largest thing on it.
 *
 * Two link columns rather than one list, because they are different kinds of
 * link: the left column moves you around this site, the right column leaves
 * it. Everything in the right column opens in a new tab.
 */
const social = (label) => SOCIALS.find((s) => s.label === label)?.href;

/* Her sketch lists LinkedIn, GitHub, Goodreads in that order — SOCIALS is
   ordered for the nav pill, so the column is spelled out rather than mapped. */
const ELSEWHERE = [
  { label: 'LinkedIn', href: social('LinkedIn') },
  { label: 'GitHub', href: social('GitHub') },
  { label: 'Goodreads', href: social('Goodreads') },
  { label: 'Email', href: `mailto:${EMAIL}` },
];

export default function ContactSection({ onNavigate }) {
  const rise = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  });

  /* The site column drives the deck rather than the browser: onNavigate is
     the deck's own goTo, so these slide like every other nav link instead of
     reloading the page onto the same composition. */
  const site = [
    { label: 'Home', id: 'home' },
    { label: 'Projects', id: 'projects' },
    { label: 'About', id: 'about' },
  ];

  return (
    <div className="ct">
      <div className="fl__stage-wrap">
        <div className="fl__stage" style={{ '--w': STAGE.w, '--h': STAGE.h }}>
          <motion.p className="ct__mark kelsi" {...rise(0)}>
            MX
          </motion.p>

          <motion.div className="ct__lead" {...rise(0.08)}>
            <p className="ct__kicker">Say hello</p>
            <a className="ct__email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <p className="ct__note">
              Looking for a software engineering or design roles. I’m currently open to new opportunities and would love to hear from you.
            </p>
          </motion.div>

          <motion.div className="ct__cols" {...rise(0.16)}>
            <nav className="ct__col" aria-label="Site">
              <p className="ct__col-head">Site</p>
              {site.map((s) => (
                <a
                  key={s.id}
                  className="ct__link"
                  href={s.id === 'home' ? '/' : `/${s.id}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    if (onNavigate?.(s.id)) e.preventDefault();
                  }}
                >
                  {s.label}
                </a>
              ))}
              <a className="ct__link" href={RESUME} target="_blank" rel="noreferrer">
                Résumé
              </a>
            </nav>

            <nav className="ct__col" aria-label="Elsewhere">
              <p className="ct__col-head">Elsewhere</p>
              {ELSEWHERE.map((l) => (
                <a
                  key={l.label}
                  className="ct__link"
                  href={l.href}
                  target={l.href?.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Portrait only — the phone mockup fills the lower half of this
              screen with the plane, where the desktop layout has the link
              columns and a footer line instead. CSS hides it above the
              breakpoint. */}
          <Image
            src="/flatlay/panel-plane.webp"
            alt=""
            width={434}
            height={583}
            loading="eager"
            aria-hidden="true"
            sizes="(max-width: 860px) 40vw, 30vw"
            className="ct__plane"
          />

          <motion.p className="ct__foot" {...rise(0.24)}>
            Designed and built by Mercedes Xiong
          </motion.p>
        </div>
      </div>
    </div>
  );
}
