'use client';

import { X } from 'lucide-react';

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

  return (
    <div className="fl__scrim" onClick={onClose} role="presentation">
      <article
        className="card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="card__close" onClick={onClose}>
          <X size={20} strokeWidth={2.5} />
          <span className="sr-only">Close</span>
        </button>

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

        {content.links?.map((l) => (
          <a key={l.href} className="card__link" href={l.href} target="_blank" rel="noreferrer">
            {l.label} →
          </a>
        ))}
      </article>
    </div>
  );
}
