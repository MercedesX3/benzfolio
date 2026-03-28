import { useState, useEffect, useRef, useCallback } from 'react';
import Fireworks from './Fireworks';
import './HomePage.css';

const placementFromClass = (className) =>
  className.match(/home-sticker--([a-z]+)/)?.[1] || 'tl';

/**
 * Default sticker image sizing (all optional fields on each sticker merge into this).
 * - widthMin / widthMax: px bounds for clamp()
 * - widthVw: middle term uses this many vw (fluid)
 * - maxHeightVh: max height in vh
 */
const STICKER_SIZE_DEFAULT = {
  widthMin: 72,
  widthVw: 14,
  widthMax: 140,
  maxHeightVh: 28,
};

function stickerSizeStyle(sizeOverride = {}) {
  const s = { ...STICKER_SIZE_DEFAULT, ...sizeOverride };
  return {
    '--sticker-w-min': `${s.widthMin}px`,
    '--sticker-w-max': `${s.widthMax}px`,
    '--sticker-w-vw': String(s.widthVw),
    '--sticker-max-vh': String(s.maxHeightVh),
  };
}

const HOME_STICKERS = [
  {
    src: '/stickers/book.png',
    className: 'home-sticker home-sticker--tl',
    direction: 'down',
    emoji: '',
    label: 'Fun fact #1',
    fact: 'I am 750 books away from having my own library.',
    color: '#FFD6E0',
    tape: 'tape-pink',
  },
  {
    src: '/stickers/5.png',
    className: 'home-sticker home-sticker--tr',
    direction: 'down',
    emoji: '',
    label: 'Fun fact #2',
    fact: "I have never been out of the country but if I could I would love to go to Italy or the UK for the architecture.",
    color: '#FFF3CD',
    tape: 'tape-yellow',
  },
  {
    src: '/stickers/coffee.png',
    className: 'home-sticker home-sticker--bl',
    direction: 'up',
    emoji: '',
    label: 'Fun fact #3',
    fact: 'I drink at least one cup of coffe every day and my go-to order is a caramel iced coffee with oat milk.',
    color: '#D4EDFF',
    tape: 'tape-blue',
  },
  {
    src: '/stickers/9.png',
    className: 'home-sticker home-sticker--br',
    direction: 'up',
    emoji: '',
    label: 'Fun fact #4',
    fact: "I was born in California and one of my favorite memories is camping on the beach in Half Moon Bay.",
    color: '#D4F5E0',
    tape: 'tape-green',
  },
  {
    src: '/stickers/cowboy-hat.png',
    className: 'home-sticker home-sticker--on-oval',
    placement: 'oval',
    /* Decorative only — no fun-fact card. Sits on top-left of the greeting oval. */
    size: { widthMin: 72, widthVw: 11, widthMax: 130, maxHeightVh: 22 },
  },
];

const FunFactCard = ({ sticker, onClose }) => {
  const isDown = sticker.direction === 'down';

  return (
    <div
      className={`fun-fact-card fun-fact-card--${isDown ? 'down' : 'up'}`}
      style={{ '--card-bg': sticker.color }}
      role="dialog"
      aria-label={sticker.label}
    >
      <div className={`fun-fact-tape ${sticker.tape}`} />

      <button
        className="fun-fact-close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
      >
        ×
      </button>

      <p className="fun-fact-label">{sticker.label}</p>
      <div className="fun-fact-emoji">{sticker.emoji}</div>
      <p className="fun-fact-text">{sticker.fact}</p>
      <div className="fun-fact-fold" />
    </div>
  );
};

const HomePage = ({ isVisible = true }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [activeSticker, setActiveSticker] = useState(null);
  const timeoutsRef = useRef([]);
  const isRunningRef = useRef(false);

  const emojis = ['👋', '😊', '✨'];
  const finalText = "Hi it's Mercedes!";

  useEffect(() => {
    if (activeSticker === null) return;
    const onPointerDown = (e) => {
      if (!e.target.closest('.home-sticker-wrapper')) {
        setActiveSticker(null);
      }
    };
    // Defer so the same gesture that opens the card doesn’t hit this listener first
    const t = window.setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown);
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [activeSticker]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setActiveSticker(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleStickerClick = useCallback((index) => {
    setActiveSticker(prev => (prev === index ? null : index));
  }, []);

  useEffect(() => {
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

    const addTimeout = (fn, delay) => {
      const timeout = setTimeout(fn, delay);
      timeoutsRef.current.push(timeout);
    };

    addTimeout(() => {
      let emojiIndex = 0;
      const typeEmoji = () => {
        if (emojiIndex < emojis.length) {
          setDisplayText(emojis.slice(0, emojiIndex + 1).join(''));
          emojiIndex++;
          addTimeout(typeEmoji, 300);
        } else {
          addTimeout(() => {
            let currentText = emojis.join('');
            const deleteEmojis = () => {
              if (currentText.length > 0) {
                currentText = currentText.slice(0, -1);
                setDisplayText(currentText);
                addTimeout(deleteEmojis, 100);
              } else {
                addTimeout(() => {
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

  useEffect(() => {
    const id = setInterval(() => setShowCursor(p => !p), 530);
    return () => clearInterval(id);
  }, []);

  const ovalSticker = HOME_STICKERS.find((s) => s.placement === 'oval');

  return (
    <div className={`home-page ${!isVisible ? 'slide-up' : ''}`}>
      <div className="home-canvas">
        <Fireworks />
        <div className="home-content">
          <div className="home-text-box">
            <div className="home-text-oval-cluster">
              {ovalSticker && (
                <div
                  className="home-sticker-wrapper home-sticker-wrapper--on-oval"
                  style={stickerSizeStyle(ovalSticker.size)}
                >
                  <img
                    src={ovalSticker.src}
                    alt=""
                    className={ovalSticker.className}
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    aria-hidden="true"
                  />
                </div>
              )}
              <span className="home-text">
                {displayText}
                {showCursor && <span className="cursor">|</span>}
              </span>
            </div>
          </div>
        </div>

        <div className="home-stickers">
          {HOME_STICKERS.map((sticker, index) =>
            sticker.placement === 'oval' ? null : (
            <div
              key={sticker.src}
              className={`home-sticker-wrapper home-sticker-wrapper--${placementFromClass(sticker.className)}`}
              data-direction={sticker.direction}
              style={stickerSizeStyle(sticker.size)}
            >
              <img
                src={sticker.src}
                alt={sticker.label}
                className={`${sticker.className} ${activeSticker === index ? 'sticker-active' : ''}`}
                draggable={false}
                loading="eager"
                decoding="async"
                onClick={() => handleStickerClick(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleStickerClick(index)}
                aria-expanded={activeSticker === index}
                aria-haspopup="dialog"
              />
              {activeSticker === index && (
                <FunFactCard
                  sticker={sticker}
                  onClose={() => setActiveSticker(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;