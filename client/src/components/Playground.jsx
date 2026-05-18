import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './Playground.css';

const Playground = () => {
  const [visibleImages, setVisibleImages] = useState(new Set());
  const imageRefs = useRef([]);

  const images = [
    'playground pics/IMG_0252.JPG',
    'playground pics/IMG_0293.JPG',
    'playground pics/IMG_0406.JPG',
    'playground pics/IMG_0509.JPG',
    'playground pics/IMG_0618.JPG',
    'playground pics/IMG_0628.JPG',
    'playground pics/IMG_0629.JPG',
    'playground pics/IMG_0630.JPG',
    'playground pics/IMG_0639.JPG',
    'playground pics/IMG_0652.JPG',
    'playground pics/IMG_4628.jpg',
    'playground pics/IMG_9152.JPG',
  ];

  // Intersection Observer for scroll-triggered fade-in animations
  useEffect(() => {
    const observers = [];

    imageRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Use requestAnimationFrame for smoother animation trigger
              requestAnimationFrame(() => {
                setVisibleImages(prev => new Set([...prev, index]));
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '150px' }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const handleImageError = (index, e) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="playground-container">
      <div className="playground-grid">
        {images.map((image, index) => (
          <div
            key={index}
            ref={el => imageRefs.current[index] = el}
            className={`playground-item ${visibleImages.has(index) ? 'fade-in-item' : ''}`}
            style={visibleImages.has(index) ? {
              transitionDelay: `${index * 0.06}s`
            } : {}}
          >
            <Image
              src={`/${image}`}
              alt={`Playground ${index + 1}`}
              width={0}
              height={0}
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              style={{ width: '100%', height: 'auto' }}
              priority={index < 4}
              onError={(e) => handleImageError(index, e)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playground;

