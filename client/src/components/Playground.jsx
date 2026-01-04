import { useState } from 'react';
import './Playground.css';

const Playground = () => {
  const [visibleImages, setVisibleImages] = useState(new Set());
  
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

  const handleImageLoad = (index) => {
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

