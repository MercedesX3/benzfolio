'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Github, Linkedin, Menu, X } from 'lucide-react';
import { ITEMS, MAT, NAV, STAGE } from '../../data/flatlay';
import { EMAIL, RESUME, SOCIALS } from '../../data/site';
import './FlatLay.css';

/**
 * The desk, photographed from above.
 *
 * ── Why a fixed stage rather than a fluid layout ───────────────────────────
 * This is a composition, not a document. The polaroids overlap the mat's grid
 * lines in a particular way, the iPad tucks under the nav pill, the sketchbook
 * runs off the right edge — all of that is design, and all of it breaks the
 * moment objects reflow independently. So the stage is authored at exactly the
 * mockup's 1440 × 1024 and scaled as a unit, the way a poster scales. Every
 * spatial relationship survives at any window size.
 *
 * The scale factor is computed in CSS (`--stage-scale`) from viewport units, so
 * resizing costs nothing — no resize listener, no re-render, no layout thrash.
 */
export default function FlatLay() {
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const item = ITEMS.find((i) => i.id === active) ?? null;

  const close = useCallback(() => setActive(null), []);

  /* Escape closes whatever is open, innermost first. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (active) setActive(null);
      else if (menuOpen) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, menuOpen]);

  return (
    <div className="fl">
      {/* ── Fixed chrome: sits outside the scaled stage so it stays legible
             at any window size ──────────────────────────────────────────── */}
      <button
        type="button"
        className="fl__menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
        <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
      </button>

      {menuOpen && (
        <nav className="fl__drawer" aria-label="Menu">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)}>
              {n.label}
            </a>
          ))}
          <a href={RESUME} target="_blank" rel="noreferrer">
            Résumé
          </a>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </nav>
      )}

      {/* ── The scaled stage ─────────────────────────────────────────────── */}
      <div className="fl__stage-wrap">
        <div
          className="fl__stage"
          style={{ '--w': STAGE.w, '--h': STAGE.h }}
        >
          <header className="fl__head">
            <p className="fl__hi">Hi I&apos;m</p>
            <h1 className="fl__name kelsi">Mercedes Xiong</h1>
            <p className="fl__role">
              <span>Full-stack developer</span>
              <span>CS @ UTDallas</span>
              <span>VP @ ACMUTD</span>
            </p>
          </header>

          {/* The mat. Not a button — it is the surface everything rests on. */}
          <Image
            src={MAT.src}
            alt=""
            width={1588}
            height={1201}
            priority
            className="fl__mat"
            style={{ '--x': MAT.x, '--y': MAT.y, '--w': MAT.w }}
          />

          {ITEMS.map((it) => (
            <button
              type="button"
              key={it.id}
              className={`fl__item ${active === it.id ? 'is-active' : ''}`}
              style={{
                /* Unitless design-space numbers; FlatLay.css turns them into
                   percentages of the stage. Passing px here would pin objects
                   to absolute sizes and break the composition on resize. */
                '--x': it.x,
                '--y': it.y,
                '--w': it.w,
                zIndex: it.z,
                '--rot': `${it.rotate}deg`,
                '--rot-hover': `${it.hoverRotate}deg`,
              }}
              onClick={() => setActive(it.id)}
              aria-label={`${it.label} — open details`}
            >
              <Image
                src={it.src}
                alt=""
                width={it.w * 2}
                height={it.w * 2}
                sizes="(max-width: 900px) 60vw, 520px"
                className="fl__img"
              />
              <span className="fl__tag hand" aria-hidden="true">
                {it.label}
              </span>
            </button>
          ))}

        </div>
      </div>

      {/* Floating nav pill */}
      <nav className="fl__pill" aria-label="Primary">
        <a
          href={SOCIALS.find((s) => s.label === 'GitHub')?.href}
          target="_blank"
          rel="noreferrer"
          className="fl__pill-icon"
          aria-label="GitHub"
        >
          <Github size={22} />
        </a>
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className="fl__pill-link">
            {n.label}
          </a>
        ))}
        <a
          href={SOCIALS.find((s) => s.label === 'LinkedIn')?.href}
          target="_blank"
          rel="noreferrer"
          className="fl__pill-icon"
          aria-label="LinkedIn"
        >
          <Linkedin size={22} />
        </a>
      </nav>

      {/* ── The popup ────────────────────────────────────────────────────── */}
      {item && (
        <div className="fl__scrim" onClick={close} role="presentation">
          <article
            className="card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="card__close" onClick={close}>
              <X size={20} strokeWidth={2.5} />
              <span className="sr-only">Close</span>
            </button>

            <p className="card__kicker">{item.content.kicker}</p>
            <h2 id="card-title" className="card__title kelsi">
              {item.content.title}
            </h2>

            {item.content.stat && (
              <p className="card__stat hand">{item.content.stat}</p>
            )}

            <p className="card__body">{item.content.body}</p>

            {item.content.meta && (
              <ul className="card__meta">
                {item.content.meta.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            )}

            {item.content.links?.map((l) => (
              <a
                key={l.href}
                className="card__link"
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                {l.label} →
              </a>
            ))}
          </article>
        </div>
      )}

      {/* Real, readable content for anyone who cannot use the composition —
          search engines, screen readers, and a phone too small to lay this
          out. Visually hidden, not display:none, so it is still announced. */}
      <div className="sr-only">
        <h2>Projects</h2>
        <ul>
          {ITEMS.map((it) => (
            <li key={it.id}>
              <strong>{it.content.title}</strong> — {it.content.body}
            </li>
          ))}
        </ul>
        <p>
          Contact: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </div>
    </div>
  );
}
