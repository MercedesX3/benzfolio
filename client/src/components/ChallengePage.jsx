'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ChallengeVideo from './ChallengeVideo';
import './ChallengePage.css';

/**
 * The product journey for a single design challenge: brief → framing →
 * typography → colour → screens → outcome. Numbered steps, because the point
 * of the page is the order things were decided in, not just the final shots.
 */

const STEP_ACCENTS = ['red', 'green', 'yellow', 'green', 'red'];

function Step({ index, title, lede, children }) {
  return (
    <section className="step" data-reveal>
      <header className="step__head">
        <span
          className="step__num display"
          style={{ '--accent': `var(--${STEP_ACCENTS[index % STEP_ACCENTS.length]})` }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <h2 className="step__title display">{title}</h2>
          {lede && <p className="step__lede">{lede}</p>}
        </div>
      </header>
      <div className="step__body">{children}</div>
    </section>
  );
}

export default function ChallengePage({ challenge }) {
  const { breakdown, typography, palette, screens, outcome } = challenge;
  let step = 0;

  return (
    <article className="challenge-page">
      <div className="page-shell">
        {/* ── Header ─────────────────────────────────── */}
        <header className="cp-head">
          <Link href="/#work" className="cp-back">
            <ArrowLeft size={16} /> All work
          </Link>

          <p className="eyebrow" style={{ '--mark': 'var(--red)' }}>
            Design challenge
          </p>

          <h1 className="cp-title display">{challenge.name}</h1>

          <p className="cp-brief">
            <span className="cp-brief__label">The brief</span>
            {challenge.brief}
          </p>

          <p className="cp-summary">{challenge.summary}</p>

          <dl className="cp-meta">
            <div>
              <dt>Role</dt>
              <dd>{challenge.role}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{challenge.year}</dd>
            </div>
            <div>
              <dt>Screens</dt>
              <dd>{screens.items.length}</dd>
            </div>
          </dl>
        </header>

        {/* ── Beauty shot ────────────────────────────── */}
        {challenge.video && (
          <div className="cp-video" data-reveal>
            <ChallengeVideo
              src={challenge.video.src}
              poster={challenge.video.poster}
              label={challenge.video.label}
            />
          </div>
        )}

        {/* ── 01 Framing ─────────────────────────────── */}
        <Step index={step++} title={breakdown.title} lede={breakdown.lede}>
          <ol className="breakdown">
            {breakdown.points.map((point, i) => (
              <li className="breakdown__item" key={point}>
                <span className="breakdown__num" aria-hidden="true">
                  {i + 1}
                </span>
                <p className="breakdown__text">{point}</p>
              </li>
            ))}
          </ol>
        </Step>

        {/* ── 02 Typography ──────────────────────────── */}
        <Step index={step++} title={typography.title} lede={typography.lede}>
          <div className="type-block">
            <div className="type-specimen">
              <Image
                src={typography.image}
                alt={typography.alt}
                width={421}
                height={423}
                sizes="(max-width: 780px) 90vw, 420px"
                className="type-specimen__img"
              />
            </div>

            <ul className="type-list">
              {typography.faces.map((face) => (
                <li className="type-face" key={face.name}>
                  <p className="type-face__role">{face.role}</p>
                  <p className="type-face__name">{face.name}</p>
                  <p className="type-face__note">{face.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </Step>

        {/* ── 03 Colour ──────────────────────────────── */}
        <Step index={step++} title={palette.title} lede={palette.lede}>
          <div className="palette">
            {palette.swatches.map((swatch) => (
              <div
                className={`swatch swatch--${swatch.text}`}
                key={swatch.name}
                style={{ '--swatch': swatch.hex }}
              >
                <p className="swatch__name">{swatch.name}</p>
                <div className="swatch__foot">
                  <span className="swatch__hex">{swatch.hex}</span>
                  <span className="swatch__role">{swatch.role}</span>
                </div>
              </div>
            ))}
          </div>
        </Step>

        {/* ── 04 Screens ─────────────────────────────── */}
        <Step index={step++} title={screens.title} lede={screens.lede}>
          <div className="screens">
            {screens.items.map((screen, i) => (
              <figure className="screen" key={screen.src}>
                <div className="screen__frame">
                  <Image
                    src={screen.src}
                    alt={`${challenge.name} — ${screen.title}`}
                    width={402}
                    height={846}
                    sizes="(max-width: 560px) 80vw, (max-width: 1000px) 40vw, 280px"
                    className="screen__img"
                    priority={i < 2}
                  />
                </div>
                <figcaption className="screen__caption">
                  <p className="screen__title">{screen.title}</p>
                  <p className="screen__text">{screen.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Step>

        {/* ── 05 Outcome ─────────────────────────────── */}
        <Step index={step++} title={outcome.title}>
          <div className="outcome">
            {outcome.body.map((para) => (
              <p className="outcome__text" key={para.slice(0, 32)}>
                {para}
              </p>
            ))}
          </div>
        </Step>

        <div className="cp-foot">
          <Link href="/#work" className="btn btn--ghost">
            <ArrowLeft size={18} /> Back to work
          </Link>
        </div>
      </div>
    </article>
  );
}
