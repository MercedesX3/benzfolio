import Image from 'next/image';
import './Duck.css';

/**
 * Three-frame waddle cycle. The frames are stacked and cross-faded on a
 * shared 0.48s loop rather than swapped in state — no re-renders, and the
 * animation keeps running while React is busy elsewhere.
 */

const FRAMES = ['/duck/duck-1.png', '/duck/duck-2.png', '/duck/duck-3.png'];

export default function Duck({ size = 64, className = '', priority = false }) {
  return (
    <span
      className={`duck ${className}`}
      style={{ '--duck-size': `${size}px` }}
      aria-hidden="true"
    >
      {FRAMES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={61}
          height={63}
          priority={priority}
          className="duck__frame"
          style={{ '--frame': i }}
        />
      ))}
    </span>
  );
}
