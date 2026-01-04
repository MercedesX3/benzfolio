import { useState, useEffect, useRef } from 'react';
import './HomePage.css';

const HomePage = ({ isVisible = true }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const timeoutsRef = useRef([]);
  const isRunningRef = useRef(false);

  const emojis = ['👋', '😊', '✨'];
  const finalText = "Hi it's Mercedes!";

  useEffect(() => {
    // Clear all timeouts
    const clearAll = () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];
    };

    if (!isVisible) {
      setDisplayText('');
      isRunningRef.current = false;
      clearAll();
      return;
    }

    if (isRunningRef.current) return;
    isRunningRef.current = true;

    // Helper to add timeout
    const addTimeout = (fn, delay) => {
      const timeout = setTimeout(() => {
        fn();
      }, delay);
      timeoutsRef.current.push(timeout);
    };

    // Phase 0: Just blinker (initial state) - 1 second
    addTimeout(() => {
      // Phase 1: Type emojis
      let emojiIndex = 0;
      const typeEmoji = () => {
        if (emojiIndex < emojis.length) {
          setDisplayText(emojis.slice(0, emojiIndex + 1).join(''));
          emojiIndex++;
          addTimeout(typeEmoji, 300);
        } else {
          // Wait a bit after all emojis are typed - 800ms
          addTimeout(() => {
            // Phase 2: Delete emojis
            let currentText = emojis.join('');
            const deleteEmojis = () => {
              if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                setDisplayText(currentText);
                addTimeout(deleteEmojis, 100);
              } else {
                // Wait a bit after deletion - 500ms
                addTimeout(() => {
                  // Phase 3: Type final text
                  let textIndex = 0;
                  const typeFinalText = () => {
                    if (textIndex < finalText.length) {
                      setDisplayText(finalText.slice(0, textIndex + 1));
                      textIndex++;
                      addTimeout(typeFinalText, 100);
                    }
                  };
                  typeFinalText();
                }, 500);
              }
            };
            deleteEmojis();
          }, 800);
        }
      };
      typeEmoji();
    }, 1000);

    return () => {
      clearAll();
      isRunningRef.current = false;
    };
  }, [isVisible]);

  // Cursor blink animation
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className={`home-page ${!isVisible ? 'slide-up' : ''}`}>
      <div className="home-canvas">
        <div className="home-content">
          <div className="home-text-box">
            <span className="home-text">
              {displayText}
              {showCursor && <span className="cursor">|</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

