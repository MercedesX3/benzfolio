'use client';

import { useEffect, useRef } from 'react';
import './ChallengeVideo.css';

/**
 * Silent looping beauty shot for a challenge.
 *
 * Autoplay is started from JS rather than the `autoplay` attribute so it can
 * be withheld under prefers-reduced-motion — those visitors get controls and
 * decide for themselves. If a browser refuses the play() promise (some power
 * or data-saver modes do), controls appear as the fallback rather than the
 * video sitting there looking broken.
 *
 * Playback pauses while off-screen so a looping video isn't burning CPU
 * halfway down a long page.
 */
export default function ChallengeVideo({ src, poster, label }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      video.controls = true;
      // Nudge off frame zero so there's a real image to look at rather than
      // an empty box, since nothing is going to autoplay for these visitors.
      const paintFirstFrame = () => {
        if (video.paused) video.currentTime = 0.5;
      };
      if (video.readyState >= 1) paintFirstFrame();
      else video.addEventListener('loadedmetadata', paintFirstFrame, { once: true });
      return undefined;
    }

    let allowed = true;
    let onScreen = true;

    const tryPlay = () => {
      if (!allowed || !onScreen || document.hidden) return;
      video.play().catch(() => {});
    };

    video.play().catch(() => {
      allowed = false;
      video.controls = true;
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) tryPlay();
        else video.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(video);

    // Browsers pause playback in a backgrounded tab, and coming back doesn't
    // change intersection — so without this the hero sits frozen on return.
    const onVisibility = () => {
      if (!document.hidden) tryPlay();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <figure className="cv">
      <div className="cv__frame">
        <video
          ref={videoRef}
          className="cv__video"
          src={src}
          poster={poster}
          width={1280}
          height={720}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
        />
      </div>
      {label && <figcaption className="cv__caption">{label}</figcaption>}
    </figure>
  );
}
