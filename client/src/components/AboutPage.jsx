'use client';

import Image from 'next/image';
import { Instagram, ArrowUpRight } from 'lucide-react';
import SectionNav from './SectionNav';
import './AboutPage.css';

const SECTIONS = [
  { id: 'intro', label: 'About' },
  { id: 'shelf', label: 'Books & music' },
  { id: 'communities', label: 'Communities' },
];

/**
 * Every scroll-triggered animation on this page now goes through the shared
 * [data-reveal] system in useReveal. The previous version built its own
 * IntersectionObservers inside a setTimeout after mount, and the one watching
 * "My Communities" never fired — leaving the strongest section on the site
 * (VP of ACM, 180+ officers) permanently at opacity: 0.
 */

const BOOKS = [
  { title: 'Animal Farm', cover: '/book-covers/AnimalFarm.jpeg' },
  { title: 'Atmosphere', cover: '/book-covers/Atmosphere.jpg' },
  { title: 'Hamnet', cover: '/book-covers/Hamnet.jpg' },
  { title: 'The House in the Cerulean Sea', cover: '/book-covers/HouseCeruleanSea.jpg' },
  { title: 'Lovely War', cover: '/book-covers/LovelyWar.jpg' },
  { title: 'The Seven Husbands of Evelyn Hugo', cover: '/book-covers/SevenHusbands.jpg' },
  {
    title: 'This Is How You Lose the Time War',
    cover: '/book-covers/ThisIsHowYouLoseTheTimeWar.jpg',
  },
];

const MUSIC = [
  { title: 'Ariana Grande', cover: '/Album-covers/ArianaGrande.jpg' },
  { title: 'Have You Ever Seen The Rain', cover: '/Album-covers/HaveYouEverSeenTheRain.jpeg' },
  { title: 'Novo Amor', cover: '/Album-covers/NovoAmor.jpg' },
  { title: 'Stick Season', cover: '/Album-covers/StickSeason.jpg' },
  { title: 'The Night We Met', cover: '/Album-covers/TheNightWeMet.jpg' },
];

const COMMUNITY_PHOTOS = [
  { src: '/Community/Community Photos/100_0173.jpeg', caption: 'ACM Peechi Night', tilt: -2.5 },
  { src: '/Community/Community Photos/DSC09356.JPG', caption: 'Spring 2026 Kickoff', tilt: 1.8 },
  { src: '/Community/Community Photos/DSC09698.JPG', caption: 'Spring 2026 Board', tilt: -1.5 },
  { src: '/Community/Community Photos/f25 eos-34.JPG', caption: 'ACM Campus @ EOS', tilt: 2.3 },
];

const ACM_STATS = [
  { value: '180+', label: 'officers', accent: 'red' },
  { value: '9', label: 'divisions', accent: 'blue' },
  { value: '200+', label: 'members', accent: 'yellow' },
];

function Shelf({ title, count, linkLabel, linkHref, items, accent, wide }) {
  return (
    <section className="shelf">
      <header className="shelf__head">
        <h2 className="shelf__title display">
          {title} <span className="shelf__count">({count})</span>
        </h2>
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shelf__link"
        >
          {linkLabel} <ArrowUpRight size={15} />
        </a>
      </header>

      <div className={`shelf__grid ${wide ? 'shelf__grid--wide' : ''}`}>
        {items.map((item, i) => (
          <div
            key={item.cover}
            className={`shelf__item shelf__item--${accent}`}
            data-reveal
            style={{ '--reveal-delay': `${i * 70}ms` }}
          >
            <Image
              src={item.cover}
              alt={item.title}
              width={400}
              height={600}
              sizes="180px"
              className="shelf__cover"
            />
            <span className="shelf__caption">{item.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="about">
      <SectionNav sections={SECTIONS} />

      <div className="page-shell">
        {/* ── Intro ──────────────────────────────────────── */}
        <header className="page-head about__head" id="intro">
          <p className="eyebrow" style={{ '--mark': 'var(--red)' }}>
            Who&apos;s behind this
          </p>
          <h1 className="page-head__title">About</h1>
        </header>

        <div className="about__intro">
          <figure className="about__photo" data-reveal>
            <span className="tape about__photo-tape" />
            <Image
              src="/about_pic.JPG"
              alt="Mercedes Xiong"
              width={800}
              height={1000}
              sizes="(max-width: 780px) 70vw, 340px"
              className="about__photo-img"
              priority
            />
          </figure>

          <div className="about__copy" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <p className="about__text about__text--lead">
              I&apos;m Mercedes — a CS major at UT Dallas and an aspiring
              full-stack developer.
            </p>
            <p className="about__text">
              I love figuring out how companies compartmentalize information
              across their websites and apps, and I believe life is greater with
              hash tables (most of the time).
            </p>
            <p className="about__text">
              In my free time you can find me reading, sketching buildings, or
              listening to indie music — or the 80s, or the 70s, or the 60s. The
              list goes on.
            </p>

            <div className="about__marks" aria-hidden="true">
              <i className="mark mark--circle" />
              <i className="mark mark--tri" />
              <i className="mark mark--quarter" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Shelves ──────────────────────────────────────── */}
      <div className="about__band" id="shelf">
        <div className="page-shell">
          <Shelf
            title="Books"
            count={BOOKS.length}
            linkLabel="Goodreads"
            linkHref="https://www.goodreads.com/user/show/124363498-mjx-xjm"
            items={BOOKS}
            accent="red"
          />
          <Shelf
            title="Music"
            count={MUSIC.length}
            linkLabel="Spotify"
            linkHref="https://open.spotify.com/user/qx3ln2174vntd3mrddj604qxx?si=dd63669d32f747ea"
            items={MUSIC}
            accent="blue"
            wide
          />
        </div>
      </div>

      {/* ── Communities ──────────────────────────────────── */}
      <section className="communities" id="communities">
        <div className="page-shell">
          <header className="communities__head" data-reveal>
            <p className="eyebrow" style={{ '--mark': 'var(--yellow)' }}>
              My communities
            </p>
            <h2 className="communities__title display">ACM @ UTD</h2>
          </header>

          <div className="communities__lead" data-reveal>
            <div className="communities__org">
              <Image
                src="/Community/Peechi LOgo.png"
                alt=""
                width={56}
                height={56}
                className="communities__logo"
              />
              <div>
                <p className="communities__role">Vice President</p>
                <a
                  href="https://www.instagram.com/acmutd/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="communities__social"
                  aria-label="ACM @ UTD on Instagram"
                >
                  <Instagram size={16} /> @acmutd
                </a>
              </div>
            </div>

            <p className="communities__desc">
              I&apos;m the vice president of ACM @ UTD, helping build a
              supportive community for students to learn and grow in tech —
              running workshops and events across nine divisions.
            </p>
          </div>

          <div className="communities__stats">
            {ACM_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`acm-stat acm-stat--${stat.accent}`}
                data-reveal
                style={{ '--reveal-delay': `${i * 90}ms` }}
              >
                <p className="acm-stat__value display">{stat.value}</p>
                <p className="acm-stat__label">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="communities__photos">
            {COMMUNITY_PHOTOS.map((photo, i) => (
              <figure
                key={photo.src}
                className="community-photo"
                data-reveal
                style={{ '--tilt': `${photo.tilt}deg`, '--reveal-delay': `${i * 90}ms` }}
              >
                <span className="tape community-photo__tape" />
                <div className="community-photo__frame">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    width={800}
                    height={600}
                    sizes="(max-width: 700px) 80vw, 280px"
                    className="community-photo__img"
                  />
                </div>
                <figcaption className="community-photo__caption hand">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="communities__foot">
            Interested in joining ACM @ UTD? Email{' '}
            <a href="mailto:contact@acmutd.co" className="communities__link">
              contact@acmutd.co
            </a>{' '}
            or head to{' '}
            <a
              href="https://acmutd.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="communities__link"
            >
              acmutd.co
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
