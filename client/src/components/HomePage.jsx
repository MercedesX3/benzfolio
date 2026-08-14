"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDown } from "lucide-react";
import BauhausScene from "./BauhausScene";
import SectionNav from "./SectionNav";
import { FEATURED_PROJECTS } from "../data/projects";
import "./HomePage.css";

const SECTIONS = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Selected work" },
  { id: "stats", label: "By the numbers" },
  { id: "scrapbook", label: "Off the clock" },
  { id: "contact", label: "Contact" },
];

/* ── Scrapbook fun-fact cards ─────────────────────────────── */

const STICKERS = [
  {
    src: "/stickers/book.png",
    label: "Fun fact #1",
    fact: "I am 750 books away from having my own library.",
    accent: "red",
    rotate: -4,
  },
  {
    src: "/stickers/5.png",
    label: "Fun fact #2",
    fact: "I've never been out of the country, but I'd love to see Italy or the UK for the architecture.",
    accent: "blue",
    rotate: 3,
  },
  {
    src: "/stickers/coffee.png",
    label: "Fun fact #3",
    fact: "One cup of coffee a day, minimum. Go-to order: caramel iced coffee with oat milk.",
    accent: "yellow",
    rotate: -2.5,
  },
  {
    src: "/stickers/9.png",
    label: "Fun fact #4",
    fact: "Born in California. One of my favorite memories is camping on the beach in Half Moon Bay.",
    accent: "blue",
    rotate: 4,
  },
];

const STATS = [
  { value: "2,000+", label: "students served by SAGE", accent: "blue" },
  { value: "180+", label: "ACM officers supported", accent: "red" },
  { value: "9", label: "divisions coordinated", accent: "yellow" },
  { value: "200+", label: "active ACM members", accent: "blue" },
];

const MARQUEE = [
  "Full-stack developer",
  "CS @ UT Dallas",
  "VP of ACM @ UTD",
  "AWS · React · Python",
  "Building things people use",
];

/* ── Typed greeting (personality, not a gate) ─────────────── */

function useTypedGreeting(finalText) {
  const [text, setText] = useState("");
  const timeouts = useRef([]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const queue = timeouts.current;
    const after = (fn, delay) => queue.push(window.setTimeout(fn, delay));

    // Reduced motion still gets the line, just without the keystrokes.
    if (reduced) {
      after(() => setText(finalText), 0);
      return () => {
        queue.forEach(window.clearTimeout);
        timeouts.current = [];
      };
    }

    let i = 0;
    const type = () => {
      if (i >= finalText.length) return;
      i += 1;
      setText(finalText.slice(0, i));
      after(type, 55);
    };
    after(type, 350);

    return () => {
      queue.forEach(window.clearTimeout);
      timeouts.current = [];
    };
  }, [finalText]);

  return text;
}

/* ── Page ─────────────────────────────────────────────────── */

export default function HomePage() {
  // A Set, not a single index: opening one fun fact used to close whichever
  // was already open, so cards vanished as you clicked around. They're
  // independent now — read them all at once if you like.
  const [openStickers, setOpenStickers] = useState(() => new Set());
  const greeting = useTypedGreeting("Hi, it's Mercedes!");

  const toggleSticker = useCallback((index) => {
    setOpenStickers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenStickers(new Set());
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="home">
      <SectionNav sections={SECTIONS} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero" id="top">
        <div className="hero__grid" aria-hidden="true" />

        <div className="hero__inner page-shell">
          <div className="hero__col">
            <p className="hero__greeting hand">
              {greeting}
              <span className="hero__caret" aria-hidden="true" />
            </p>

            <h1 className="hero__title display">
              <span className="hero__line">Mercedes</span>
              <span className="hero__line hero__line--offset">
                Xiong
                <i className="hero__dot" aria-hidden="true" />
              </span>
            </h1>

            <p className="hero__role">
              Full-stack developer · CS @ UT Dallas · VP of ACM @ UTD
            </p>

            <p className="hero__lede">
              I build things people actually use — most recently{" "}
              <strong>SAGE</strong>, an AI advising platform that has helped{" "}
              <strong>2,000+ UT Dallas students</strong> plan their degrees.
            </p>

            <div className="hero__actions">
              <Link href="/work" className="btn btn--primary">
                See the work <ArrowRight size={18} />
              </Link>
              <a
                href="/Mercedes_Xiong_Resume_Summer2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost"
              >
                Resume
              </a>
            </div>
          </div>

          {/* The 3D rig gets its own column so it can never sit on the type */}
          <div className="hero__stage">
            <BauhausScene />
          </div>
        </div>

        <div className="hero__cue" aria-hidden="true">
          <ArrowDown size={18} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <div className="marquee__group" key={copy}>
              {MARQUEE.map((item) => (
                <span className="marquee__item" key={`${copy}-${item}`}>
                  {item}
                  <i className="marquee__dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED WORK ────────────────────────────────── */}
      <section className="section section--work" id="work">
        <div className="page-shell">
          <header className="section__head" data-reveal>
            <p className="eyebrow" style={{ "--mark": "var(--red)" }}>
              Selected work
            </p>
            <h2 className="section__title display">Things I built</h2>
          </header>

          <div className="featured">
            {FEATURED_PROJECTS.map((project, i) => (
              <article
                key={project.slug}
                className={`feature feature--${project.accent}`}
                data-reveal
                style={{ "--reveal-delay": `${i * 110}ms` }}
              >
                <Link href="/work" className="feature__link">
                  <div className="feature__media">
                    <span className="tape feature__tape" />
                    <Image
                      src={project.image}
                      alt={`${project.name} cover`}
                      width={520}
                      height={700}
                      sizes="(max-width: 900px) 90vw, 460px"
                      className="feature__img"
                    />
                  </div>

                  <div className="feature__body">
                    <p className="feature__kicker">{project.kicker}</p>
                    <h3 className="feature__name display">{project.name}</h3>

                    {project.metric && (
                      <p className="feature__metric">
                        <strong>{project.metric.value}</strong>
                        <span>{project.metric.label}</span>
                      </p>
                    )}

                    <p className="feature__blurb">{project.blurb}</p>

                    <ul className="chips">
                      {project.lead.map((tech) => (
                        <li className="chip" key={tech}>
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <span className="feature__more">
                      Read the case study <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="section__foot" data-reveal>
            <Link href="/work" className="btn btn--ghost">
              All five projects <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────── */}
      <section className="stats" id="stats">
        <div className="page-shell">
          <div className="stats__row">
            {STATS.map((stat, i) => (
              <div
                className={`stat stat--${stat.accent}`}
                key={stat.label}
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` }}
              >
                <p className="stat__value display">{stat.value}</p>
                <p className="stat__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCRAPBOOK ────────────────────────────────────── */}
      <section className="section section--scrap" id="scrapbook">
        <div className="page-shell">
          <header className="section__head" data-reveal>
            <p className="eyebrow" style={{ "--mark": "var(--yellow)" }}>
              Off the clock
            </p>
            <h2 className="section__title display">The other stuff</h2>
            <p className="section__lede">
              Click a sticker. There is no deeper meaning to any of this.
            </p>
          </header>

          <div className="scrapbook">
            {STICKERS.map((sticker, i) => {
              const isOpen = openStickers.has(i);
              return (
                <div
                  key={sticker.src}
                  className={`scrap scrap--${sticker.accent} ${isOpen ? "is-open" : ""}`}
                  style={{
                    "--rot": `${sticker.rotate}deg`,
                    "--reveal-delay": `${i * 90}ms`,
                  }}
                  data-reveal
                >
                  <button
                    type="button"
                    className="scrap__button"
                    onClick={() => toggleSticker(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="tape scrap__tape" />
                    <Image
                      src={sticker.src}
                      alt=""
                      width={200}
                      height={200}
                      className="scrap__img"
                      aria-hidden="true"
                    />
                    <span className="scrap__label">{sticker.label}</span>
                  </button>

                  <div className="scrap__fact" hidden={!isOpen}>
                    <p className="hand">{sticker.fact}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section className="contact" id="contact">
        <div className="page-shell contact__inner">
          <div className="contact__marks" aria-hidden="true">
            <i className="mark mark--circle" />
            <i className="mark mark--tri" />
            <i className="mark mark--square" />
          </div>

          <h2 className="contact__title display">
            Let&apos;s build
            <br />
            something
          </h2>

          <p className="contact__lede">
            I&apos;m looking for summer 2026 software engineering internships.
            If you have one, I&apos;d love to hear about it.
          </p>

          <div className="contact__actions">
            <a
              href="mailto:mercedesx935@gmail.com"
              className="btn btn--primary"
            >
              mercedesx935@gmail.com <ArrowRight size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/mercedes-xiong"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
