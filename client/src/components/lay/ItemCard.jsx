'use client';

import Link from 'next/link';
import { ArrowRight, Github, X } from 'lucide-react';
import ProjectReel from '../reel/ProjectReel';

/**
 * The detail popup.
 *
 * Owned by the deck rather than by a section, so it sits above the sliding
 * rail and does not travel with it. Plain HTML over the composition: it stays
 * crisp, keeps its place in the tab order, and a screen reader reads it as the
 * document content it is.
 */
export default function ItemCard({ item, onClose }) {
  if (!item) return null;
  const { content } = item;

  /* A project opens as a spread — clip on one side, words on the other.
     Everything else on the desk (the books, the polaroids) has no clip and
     stays the single narrow column it was. */
  const isProject = Boolean(content.slug);

  return (
    <div className="fl__scrim" onClick={onClose} role="presentation">
      <article
        className={`card${isProject ? ' card--project' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="card__close" onClick={onClose}>
          <X size={20} strokeWidth={2.5} />
          <span className="sr-only">Close</span>
        </button>

        {isProject && (
          <div className="card__media">
            <ProjectReel slug={content.slug} label={content.title} />
          </div>
        )}

        <div className={isProject ? 'card__text' : undefined}>
          <p className="card__kicker">{content.kicker}</p>
          <h2 id="card-title" className="card__title kelsi">
            {content.title}
          </h2>

          {content.stat && <p className="card__stat hand">{content.stat}</p>}
          <p className="card__body">{content.body}</p>

          {content.meta && (
            <ul className="card__meta">
              {content.meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}

          {(content.links || content.github || content.slug) && (
            <div className="card__actions">
              {/* The popup is the teaser; this is the way in. It leads the row
                  because reading the case study is the thing we want next. */}
              {content.slug && (
                <Link className="card__link card__link--case" href={`/projects/${content.slug}`}>
                  Read the case study
                  <ArrowRight size={17} strokeWidth={2.5} />
                </Link>
              )}
              {content.links?.map((l) => (
                <a key={l.href} className="card__link" href={l.href} target="_blank" rel="noreferrer">
                  {l.label} →
                </a>
              ))}
              {content.github && (
                <a
                  className="card__icon-link"
                  href={content.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${content.title} on GitHub`}
                  title="View on GitHub"
                >
                  <Github size={20} strokeWidth={2.25} />
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
