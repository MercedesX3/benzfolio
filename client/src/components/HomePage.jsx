'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Duck from './Duck';
import DuckIntro from './DuckIntro';
import ProjectSheet from './ProjectSheet';
import ContactForm from './ContactForm';
import { PROJECTS } from '../data/projects';
import { CHALLENGES } from '../data/challenges';
import {
  ABOUT_PARAGRAPHS,
  ACM_PHOTOS,
  ALBUMS,
  BOOKS,
  MARQUEE,
  NOW,
  PLAYGROUND_PHOTOS,
  RESUME,
  SKILLS,
  SOCIALS,
  STATS,
  STOPS,
} from '../data/site';
import './HomePage.css';

const number = (i) => String(i + 1).padStart(2, '0');

/* The three signal lights under the hero, in traffic-light order. */
const LIGHTS = [
  { href: '#work', color: 'var(--green)', label: 'Jump to the work' },
  { href: '#playground', color: 'var(--yellow)', label: 'Jump to the playground' },
  { href: '#contact', color: 'var(--red)', label: 'Jump to contact' },
];

const [challenge] = CHALLENGES;

export default function HomePage() {
  const [openIndex, setOpenIndex] = useState(null);

  /* Projects and the design challenge share one sheet, so they share one
     shape. The challenge sends readers on to its full journey page. */
  const sheetItems = useMemo(
    () => [
      ...PROJECTS.map((project, i) => ({ ...project, n: number(i) })),
      {
        n: number(PROJECTS.length),
        name: challenge.name,
        kind: challenge.kicker,
        image: challenge.cover,
        blurb: challenge.summary,
        stack: challenge.sheet.stack,
        steps: challenge.sheet.steps,
        href: `/work/${challenge.slug}`,
        linkLabel: 'See the full journey',
        internal: true,
      },
    ],
    []
  );

  const closeSheet = useCallback(() => setOpenIndex(null), []);

  return (
    <div className="home">
      <DuckIntro />

      <ProjectSheet
        item={openIndex === null ? null : sheetItems[openIndex]}
        onClose={closeSheet}
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" id="top">
        <div className="hero__inner page-shell">
          <h1 className="hero__title">
            <span className="hero__hi display">Hi I&apos;m</span>
            <span className="hero__name display">Mercedes Xiong</span>
            <Duck size={70} className="hero__duck" priority />
          </h1>

          <p className="hero__role">
            <span>Full-stack developer</span>
            <i aria-hidden="true">/</i>
            <span>CS @ UT Dallas</span>
            <i aria-hidden="true">/</i>
            <span>VP @ ACM UTD</span>
          </p>

          <p className="hero__lede">
            I build things people actually use — most recently{' '}
            <strong>SAGE</strong>, an AI advising platform that has helped{' '}
            <strong>2,000+ UT&nbsp;Dallas students</strong> plan their degrees.
          </p>

          <div className="hero__lights">
            {LIGHTS.map((light) => (
              <a
                key={light.href}
                href={light.href}
                className="light"
                style={{ '--light': light.color }}
                aria-label={light.label}
              />
            ))}
          </div>

          <p className="hero__hint">Click a light</p>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[0, 1].map((copy) => (
            <div className="ticker__group sign" key={copy}>
              {MARQUEE.map((item) => (
                <span className="ticker__item" key={`${copy}-${item.text}`}>
                  {item.text}
                  <i style={{ color: item.dot }}>●</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── WORK ─────────────────────────────────────────── */}
      <section className="section work" id="work">
        <div className="page-shell">
          <header className="work__head" data-reveal>
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="section__title display">Things I built</h2>
            </div>
            <p className="work__lede">
              Five projects, from an AI advising platform used by thousands of
              students to a stargazing forecaster. Open any card for the full
              case study.
            </p>
          </header>

          <div className="work__grid">
            {PROJECTS.map((project, i) => (
              <button
                type="button"
                key={project.slug}
                className={`card ${project.tall ? 'card--tall' : ''}`}
                onClick={() => setOpenIndex(i)}
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` }}
              >
                <Image
                  src={project.image}
                  alt=""
                  width={720}
                  height={720}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="card__img"
                />

                <span className="card__num sign">{number(i)}</span>
                <span className="card__peel" aria-hidden="true" />

                <span className="card__tags">
                  <span className="card__name">{project.name}</span>
                  {project.stack.slice(0, 3).map((tech) => (
                    <span className="card__tag" key={tech}>
                      {tech}
                    </span>
                  ))}
                </span>
              </button>
            ))}

            <button
              type="button"
              className="card-challenge"
              onClick={() => setOpenIndex(PROJECTS.length)}
              data-reveal
            >
              <span>
                <span className="eyebrow card-challenge__eyebrow">
                  Self-directed
                </span>
                <span className="card-challenge__title display">
                  Design challenges
                </span>
                <span className="card-challenge__body">
                  Briefs I set myself, worked end to end — framing, type and
                  colour decisions, and where it landed. Starting with “design a
                  translation tool for GoPro”.
                </span>
              </span>
              <span className="card-challenge__more">See the journey →</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── NUMBERS ──────────────────────────────────────── */}
      <section className="numbers">
        <div className="page-shell">
          <p className="eyebrow numbers__eyebrow">By the numbers</p>

          <div className="numbers__row">
            {STATS.map((stat, i) => (
              <div
                className="stat"
                key={stat.label}
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` }}
              >
                <p className="stat__value sign">{stat.value}</p>
                <p className="stat__label">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="polaroids">
            {ACM_PHOTOS.map((photo, i) => (
              <figure
                className="polaroid"
                key={photo.src}
                style={{ '--rot': `${photo.rotate}deg`, '--reveal-delay': `${i * 80}ms` }}
                data-reveal
              >
                <div className="polaroid__frame">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    width={640}
                    height={480}
                    sizes="(max-width: 900px) 45vw, 280px"
                    className="polaroid__img"
                  />
                </div>
                <figcaption className="polaroid__caption">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROUTE ────────────────────────────────────────── */}
      <section className="section route">
        <div className="page-shell">
          <header className="section__head" data-reveal>
            <p className="eyebrow">The route so far</p>
            <h2 className="section__title display">Stops along the way</h2>
          </header>

          <ol className="stops">
            {STOPS.map((stop, i) => (
              <li className="stop" key={stop.title} data-reveal>
                <span className="stop__num sign">{number(i)}</span>
                <div>
                  <div className="stop__head">
                    <h3 className="stop__title display">{stop.title}</h3>
                    <span className="stop__tag">{stop.tag}</span>
                  </div>
                  <p className="stop__body">{stop.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="checker-wipe" aria-hidden="true" />

      {/* ── SKILLS ───────────────────────────────────────── */}
      <section className="section skills">
        <div className="page-shell">
          <header className="section__head" data-reveal>
            <p className="eyebrow skills__eyebrow">Under the hood</p>
            <h2 className="section__title display">Skills &amp; tools</h2>
          </header>

          <div className="skills__grid">
            {SKILLS.map((group, i) => (
              <div
                className="skill-group"
                key={group.label}
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` }}
              >
                <h3 className="skill-group__label">{group.label}</h3>
                <ul className="chips">
                  {group.items.map((item) => (
                    <li className="chip skill-chip" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAYGROUND ───────────────────────────────────── */}
      <section className="playground" id="playground">
        <div className="page-shell">
          <p className="eyebrow playground__eyebrow">Off the clock</p>
          <h2 className="section__title display">Playground</h2>
          <p className="section__lede">
            Photos, sketches, and detours. There is no deeper meaning to any of
            this.
          </p>
        </div>

        <div className="reel" aria-hidden="true">
          <div className="reel__track">
            {[0, 1].map((copy) =>
              PLAYGROUND_PHOTOS.map((photo) => (
                <div
                  className="reel__shot"
                  key={`${copy}-${photo.src}`}
                  style={{ '--rot': `${photo.rotate}deg` }}
                >
                  <Image
                    src={photo.src}
                    alt=""
                    width={520}
                    height={640}
                    sizes="260px"
                    className="reel__img"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section className="section about" id="about">
        <div className="page-shell about__grid">
          <div data-reveal>
            <div className="about__portrait">
              <Image
                src="/aboutme.jpeg"
                alt="Mercedes Xiong"
                width={800}
                height={1000}
                sizes="(max-width: 900px) 90vw, 420px"
                className="about__portrait-img"
              />
            </div>

            <div className="about__socials">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about__social"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div data-reveal>
            <p className="eyebrow">About</p>
            <h2 className="section__title display">The driver</h2>

            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p className="about__text" key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}

            <div className="shelf">
              <h3 className="shelf__label">Currently reading</h3>
              <div className="shelf__row">
                {BOOKS.map((src) => (
                  <div className="shelf__book" key={src}>
                    <Image
                      src={src}
                      alt=""
                      width={200}
                      height={300}
                      sizes="108px"
                      className="shelf__img"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="shelf">
              <h3 className="shelf__label">On repeat</h3>
              <div className="shelf__row">
                {ALBUMS.map((src) => (
                  <div className="shelf__album" key={src}>
                    <Image
                      src={src}
                      alt=""
                      width={220}
                      height={220}
                      sizes="108px"
                      className="shelf__img"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RIGHT NOW ────────────────────────────────────── */}
      <section className="now">
        <div className="page-shell now__grid">
          <div>
            <p className="eyebrow now__eyebrow">Green light</p>
            <h2 className="section__title display">Right now</h2>
          </div>

          {NOW.map((entry, i) => (
            <div
              className="now__card"
              key={entry.label}
              data-reveal
              style={{ '--reveal-delay': `${i * 80}ms` }}
            >
              <p className="now__label">{entry.label}</p>
              <p className="now__body">{entry.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section className="section contact" id="contact">
        <div className="page-shell">
          <header className="contact__head" data-reveal>
            <p className="eyebrow">Contact</p>
            <h2 className="section__title display">Let&apos;s build something</h2>
            <p className="contact__lede">
              I&apos;m looking for summer 2026 software engineering internships.
              If you have one, I&apos;d love to hear about it.
            </p>
          </header>

          <ContactForm resume={RESUME} />
        </div>
      </section>
    </div>
  );
}
