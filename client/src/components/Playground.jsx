'use client';

import Image from 'next/image';
import './Playground.css';

/**
 * Scrapbook photo wall.
 *
 * NOTE: captions are intentionally blank — I don't know where these were
 * taken, and inventing captions on a portfolio is worse than having none.
 * Fill in `caption` below and it renders automatically; leave it empty and
 * the photo just shows its frame. A one-liner each is what turns this page
 * from a camera roll into personality, so it's worth doing.
 */
const PHOTOS = [
  { src: '/playground pics/IMG_0252.JPG', caption: '', tilt: -2.4, accent: 'red' },
  { src: '/playground pics/IMG_0293.JPG', caption: '', tilt: 1.8, accent: 'blue' },
  { src: '/playground pics/IMG_0406.JPG', caption: '', tilt: -1.2, accent: 'yellow' },
  { src: '/playground pics/IMG_0509.JPG', caption: '', tilt: 2.6, accent: 'blue' },
  { src: '/playground pics/IMG_0618.JPG', caption: '', tilt: -2.8, accent: 'yellow' },
  { src: '/playground pics/IMG_0628.JPG', caption: '', tilt: 1.4, accent: 'red' },
  { src: '/playground pics/IMG_0629.JPG', caption: '', tilt: -1.6, accent: 'blue' },
  { src: '/playground pics/IMG_0630.JPG', caption: '', tilt: 2.2, accent: 'yellow' },
  { src: '/playground pics/IMG_0639.JPG', caption: '', tilt: -2.1, accent: 'red' },
  { src: '/playground pics/IMG_0652.JPG', caption: '', tilt: 1.7, accent: 'blue' },
  { src: '/playground pics/IMG_4628.jpg', caption: '', tilt: -1.9, accent: 'yellow' },
  { src: '/playground pics/IMG_9152.JPG', caption: '', tilt: 2.4, accent: 'red' },
];

export default function Playground() {
  return (
    <div className="playground">
      <div className="page-shell">
        <header className="page-head">
          <p className="eyebrow" style={{ '--mark': 'var(--yellow)' }}>
            Camera roll
          </p>
          <h1 className="page-head__title">Playground</h1>
          <p className="page-head__lede">
            Buildings I liked, places I went, things I noticed. Sketching
            architecture is the hobby; this is the evidence.
          </p>
          <div className="page-head__marks" aria-hidden="true">
            <i className="mark mark--tri" />
            <i className="mark mark--circle" />
            <i className="mark mark--square" />
          </div>
        </header>

        <div className="wall">
          {PHOTOS.map((photo, i) => (
            <figure
              key={photo.src}
              className={`polaroid polaroid--${photo.accent}`}
              style={{ '--tilt': `${photo.tilt}deg`, '--reveal-delay': `${(i % 3) * 90}ms` }}
              data-reveal
            >
              <span className="tape polaroid__tape" />
              <div className="polaroid__frame">
                <Image
                  src={photo.src}
                  alt={photo.caption || 'Photo from Mercedes’ camera roll'}
                  width={900}
                  height={1200}
                  sizes="(max-width: 560px) 90vw, (max-width: 1000px) 44vw, 30vw"
                  className="polaroid__img"
                  priority={i < 3}
                />
              </div>
              {photo.caption && (
                <figcaption className="polaroid__caption hand">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
