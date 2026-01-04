import { useState, useEffect, useRef } from 'react';
import './Playground.css';

const Playground = ({ onImagesLoading }) => {
  const [loadedImages, setLoadedImages] = useState(0);
  const [visibleImages, setVisibleImages] = useState(new Set());
  const loaderTimerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  
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

  useEffect(() => {
    startTimeRef.current = Date.now();
    
    // Start a timer - if images take more than 500ms to load, show loader
    loaderTimerRef.current = setTimeout(() => {
      if (loadedImages < images.length) {
        if (onImagesLoading) {
          onImagesLoading(true);
        }
      }
    }, 500);

    return () => {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // If all images are loaded, hide loader
    if (loadedImages === images.length) {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
      // Only hide loader if it was shown (i.e., loading took more than 500ms)
      const loadTime = Date.now() - startTimeRef.current;
      if (loadTime > 500 && onImagesLoading) {
        onImagesLoading(false);
      }
    }
  }, [loadedImages, images.length, onImagesLoading]);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => prev + 1);
    // Add a small delay for staggered animation
    setTimeout(() => {
      setVisibleImages(prev => new Set([...prev, index]));
    }, index * 50); // Stagger by 50ms per image
  };

  return (
    <div className="playground-container">
      <div className="playground-grid">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`playground-item ${visibleImages.has(index) ? 'visible' : ''}`}
          >
            <img 
              src={`/${image}`} 
              alt={`Playground ${index + 1}`}
              loading="eager"
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playground;

