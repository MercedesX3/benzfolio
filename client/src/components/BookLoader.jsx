import { useState, useEffect } from 'react';
import './BookLoader.css';

const BookLoader = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pages = Array.from({ length: 18 }, (_, i) => i);

  useEffect(() => {
    // The book closes at 96% of the animation (6.8s duration)
    // Start fade-out slightly before the book closes for smoother transition
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 6200); // Start fade-out at ~6.2s

    // Complete the transition after fade-out animation
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 6800); // Complete after fade animation (6.2s + 0.6s fade)

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`loader-container ${isFading ? 'fade-out' : ''}`}>
      <div className="book">
        <div className="inner">
          <div className="left"></div>
          <div className="middle"></div>
          <div className="right"></div>
          <ul>
            {pages.map((page) => (
              <li key={page}></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookLoader;
