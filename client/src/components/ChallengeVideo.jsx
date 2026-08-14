'use client';

import { useEffect, useRef } from 'react';
import './ChallengeVideo.css';

/**
 * Silent looping beauty shot — behaves like a GIF, not a video player.
 *
 * The `autoPlay` attribute is deliberate rather than a JS play() call: muted +
 * playsInline + autoplay is the combination browsers whitelist at parse time,
 * so it starts without asking. An earlier version drove playback from JS and
 * paused it off-screen, which left it showing player controls and needing a
 * click — exactly what a GIF shouldn't do.
 *
 * No controls, ever. If something pauses it (tab switch, power saving), the
 * listeners below quietly start it again.
 */
export default function ChallengeVideo({ src, poster, label }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const resume = () => {
      if (document.hidden || !video.paused) return;
      video.play().catch(() => {});
    };

    // Kick it once on mount in case the attribute alone didn't take.
    resume();

    document.addEventListener('visibilitychange', resume);
    window.addEventListener('focus', resume);
    video.addEventListener('loadeddata', resume);

    return () => {
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('focus', resume);
      video.removeEventListener('loadeddata', resume);
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
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={label}
          tabIndex={-1}
        />
      </div>
      {label && <figcaption className="cv__caption">{label}</figcaption>}
    </figure>
  );
}
