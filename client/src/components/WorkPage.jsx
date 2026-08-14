'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Github, Globe } from 'lucide-react';
import MagazineViewer from './MagazineViewer';
import SectionNav from './SectionNav';
import { PROJECTS } from '../data/projects';
import { CHALLENGES } from '../data/challenges';
import './WorkPage.css';

const SECTIONS = [
  { id: 'projects', label: 'Work' },
  { id: 'design-challenges', label: 'Design challenges' },
];

/**
 * Replaces the auto-rotating cover carousel.
 *
 * The carousel showed five unlabelled covers ("Sage Cover") and moved every
 * four seconds, so the substance — what each thing is, what it's built with,
 * who it reached — only existed behind a click. Here it's all on the surface.
 */
export default function WorkPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="work-page">
      <SectionNav sections={SECTIONS} />

      <div className="page-shell">
        <header className="page-head" id="projects">
          <p className="eyebrow" style={{ '--mark': 'var(--blue)' }}>
            Five projects
          </p>
          <h1 className="page-head__title">Work</h1>
          <p className="page-head__lede">
            Full-stack builds, from an AI advising platform used by thousands of
            students to a stargazing forecaster. Open any card for the full case
            study.
          </p>
          <div className="page-head__marks" aria-hidden="true">
            <i className="mark mark--circle" />
            <i className="mark mark--quarter" />
            <i className="mark mark--tri" />
          </div>
        </header>

        <div className="work-grid">
          {PROJECTS.map((project, i) => (
            <article
              key={project.slug}
              className={`card card--${project.accent}`}
              data-reveal
              style={{ '--reveal-delay': `${(i % 2) * 90}ms` }}
            >
              <div className="card__index display" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="card__media">
                <span className="tape card__tape" />
                <Image
                  src={project.image}
                  alt={`${project.name} cover`}
                  width={520}
                  height={700}
                  sizes="(max-width: 760px) 80vw, 300px"
                  className="card__img"
                />
              </div>

              <div className="card__body">
                <p className="card__kicker">{project.kicker}</p>
                <h2 className="card__name display">{project.name}</h2>

                {project.metric && (
                  <p className="card__metric">
                    <strong>{project.metric.value}</strong>
                    <span>{project.metric.label}</span>
                  </p>
                )}

                <p className="card__blurb">{project.blurb}</p>

                <ul className="chips card__chips">
                  {project.lead.map((tech) => (
                    <li className="chip" key={tech}>
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="card__actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => setSelected(project)}
                  >
                    Case study <ArrowUpRight size={18} />
                  </button>

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-link"
                      aria-label={`${project.name} on GitHub`}
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-link"
                      aria-label={`${project.name} live site`}
                    >
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Design challenges ────────────────────────── */}
        <section className="challenges" id="design-challenges">
          <header className="challenges__head" data-reveal>
            <p className="eyebrow" style={{ '--mark': 'var(--yellow)' }}>
              Self-directed
            </p>
            <h2 className="challenges__title display">Design challenges</h2>
            <p className="challenges__lede">
              Briefs I set myself, worked end to end. Each one opens as the full
              journey — how I framed the problem, the type and colour decisions,
              and where it landed.
            </p>
          </header>

          <div className="challenge-grid">
            {CHALLENGES.map((challenge, i) => (
              <article
                key={challenge.slug}
                className={`challenge challenge--${challenge.accent}`}
                data-reveal
                style={{ '--reveal-delay': `${i * 90}ms` }}
              >
                <Link
                  href={`/work/${challenge.slug}`}
                  className="challenge__link"
                >
                  <div className="challenge__media">
                    <span className="tape challenge__tape" />
                    <Image
                      src={challenge.cover}
                      alt={`${challenge.name} home screen`}
                      width={1920}
                      height={1920}
                      sizes="(max-width: 760px) 60vw, 260px"
                      className="challenge__img"
                    />
                  </div>

                  <div className="challenge__body">
                    <p className="challenge__kicker">{challenge.kicker}</p>
                    <h3 className="challenge__name display">{challenge.name}</h3>
                    <p className="challenge__brief">“{challenge.brief}”</p>
                    <p className="challenge__summary">{challenge.summary}</p>

                    <span className="challenge__more">
                      See the journey <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>

      {selected && (
        <MagazineViewer magazine={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
