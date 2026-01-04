import { useEffect, useState } from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-image-wrapper">
          <img 
            src="/about_pic.JPG" 
            alt="Mercedes Xiong" 
            className={`about-image ${isVisible ? 'fade-in' : ''}`}
          />
        </div>
        <div className="about-content">
          <p className={`about-text ${isVisible ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
            Hi! Thank's so much for coming to check me out! My name is Mercedes Xiong, a current CS major @UTD and an aspiring full stack developer!
          </p>
          <p className={`about-text ${isVisible ? 'fade-in' : ''}`} style={{ animationDelay: '0.4s' }}>
            I love trying to understand how companies compartmentalize their information on websites and apps and believe that life is greater with hash tables (most of the time)
          </p>
          <p className={`about-text ${isVisible ? 'fade-in' : ''}`} style={{ animationDelay: '0.6s' }}>
            In my free time, you can find me reading, sketching buildings, or listening to indie music or the 80s or 70s or 60s (the list goes on and on).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

