import { useState, useEffect, useRef } from 'react';
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

  // Preload first 4 images for immediate display
  useEffect(() => {
    const preloadImages = images.slice(0, 4);
    preloadImages.forEach((image) => {
      const img = new Image();
      img.src = `/${image}`;
    });
  }, []);

  // Intersection Observer for scroll-triggered fade-in animations
  useEffect(() => {
    const observers = [];

    imageRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleImages(prev => new Set([...prev, index]));
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const handleImageLoad = (index) => {
    // Image loaded, but visibility is controlled by Intersection Observer
  };

  const handleImageError = (index, e) => {
    // Hide broken/missing images
    e.target.style.display = 'none';
  };

  return (
    <div className="playground-container">
      <div className="playground-grid">
        {images.map((image, index) => (
          <div
            key={index}
            ref={el => imageRefs.current[index] = el}
            className={`playground-item ${visibleImages.has(index) ? 'fade-in-item' : ''}`}
          >
            <img
              src={`/${image}`}
              alt={`Playground ${index + 1}`}
              loading={index < 4 ? 'eager' : 'lazy'}
              fetchPriority={index < 4 ? 'high' : 'auto'}
              decoding="async"
              onLoad={() => handleImageLoad(index)}
              onError={(e) => handleImageError(index, e)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playground;

