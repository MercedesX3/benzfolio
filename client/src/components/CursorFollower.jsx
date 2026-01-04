import { useState, useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const followerRef = useRef(null);
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId;
    
    const updateCursor = (e) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      // Linear interpolation (lerp) for smooth following
      const lerp = (start, end, factor) => start + (end - start) * factor;
      const smoothFactor = 0.15; // Lower = smoother but slower, Higher = faster but less smooth
      
      currentPosition.current = {
        x: lerp(currentPosition.current.x, targetPosition.current.x, smoothFactor),
        y: lerp(currentPosition.current.y, targetPosition.current.y, smoothFactor)
      };
      
      setPosition({
        x: currentPosition.current.x,
        y: currentPosition.current.y
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={followerRef}
      className={`cursor-follower-starburst ${isVisible ? 'visible' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="starburst-beam beam-1"></div>
      <div className="starburst-beam beam-2"></div>
      <div className="starburst-beam beam-3"></div>
      <div className="starburst-beam beam-4"></div>
      <div className="starburst-beam beam-5"></div>
      <div className="starburst-beam beam-6"></div>
      <div className="starburst-beam beam-7"></div>
      <div className="starburst-beam beam-8"></div>
    </div>
  );
};

export default CursorFollower;

