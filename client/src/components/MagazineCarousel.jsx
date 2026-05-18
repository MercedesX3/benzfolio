import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MagazineViewer from './MagazineViewer';
import './MagazineCarousel.css';
import sage from '../data/magazines/sage.json';
import lumina from '../data/magazines/lumina.json';
import archer from '../data/magazines/archer.json';
import finterest from '../data/magazines/finterest.json';
import windle from '../data/magazines/windle.json';

const MagazineCarousel = ({ magazines = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const isProcessingRef = useRef(false);

  // Default magazines if none provided
  const defaultMagazines = [sage, lumina, archer, finterest, windle];

  const items = magazines.length > 0 ? magazines : defaultMagazines;

  const handlePrevious = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000); // Auto-rotate every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isProcessingRef.current) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        isProcessingRef.current = true;
        handlePrevious();
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 300);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        isProcessingRef.current = true;
        handleNext();
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handlePrevious, handleNext]);

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="magazine-carousel-container">
      <div className="magazine-carousel">
        <button
          className="carousel-button carousel-button-prev"
          onClick={handlePrevious}
          aria-label="Previous magazine"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="carousel-track">
          {items.map((magazine, index) => {
            const position = (index - currentIndex + items.length) % items.length;
            let transformClass = '';

            if (position === 0) {
              transformClass = 'center';
            } else if (position === 1 || (position === items.length - 1 && items.length > 2)) {
              transformClass = position === 1 ? 'right' : 'left';
            } else if (position === 2 || (position === items.length - 2 && items.length > 3)) {
              transformClass = position === 2 ? 'far-right' : 'far-left';
            } else {
              transformClass = 'hidden';
            }

            return (
              <div
                key={magazine.id || index}
                className={`carousel-item ${transformClass}`}
                style={{
                  '--index': index,
                  '--current': currentIndex,
                  '--total': items.length,
                }}
                onClick={() => setSelectedMagazine(magazine)}
              >
                <div className="magazine-card">
                  <Image
                    src={magazine.image}
                    alt={magazine.title || `Magazine ${index + 1}`}
                    fill
                    sizes="240px"
                    style={{ objectFit: 'cover' }}
                  />
                  {magazine.title && (
                    <div className="magazine-title">{magazine.title}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="carousel-button carousel-button-next"
          onClick={handleNext}
          aria-label="Next magazine"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to magazine ${index + 1}`}
          />
        ))}
      </div>

      {selectedMagazine && (
        <MagazineViewer
          magazine={selectedMagazine}
          onClose={() => setSelectedMagazine(null)}
        />
      )}
    </div>
  );
};

export default MagazineCarousel;

