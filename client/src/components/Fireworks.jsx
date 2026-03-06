import { useEffect, useRef } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import './Fireworks.css';

const DEFAULT_COLORS = {
  Red: '#ff0043',
  Green: '#14fc56',
  Blue: '#1e7fff',
  Purple: '#e60aff',
  Gold: '#ffbf36',
  White: '#ffffff'
};

const Fireworks = ({ colors = DEFAULT_COLORS }) => {
  const { isDarkMode } = useDarkMode();
  const trailsCanvasRef = useRef(null);
  const mainCanvasRef = useRef(null);
  const skyCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const starsRef = useRef({});
  const shellsRef = useRef([]);
  const sparksRef = useRef({});
  const lastFrameTimeRef = useRef(0);
  const skyLightsRef = useRef([]);
  
  const COLOR_CODES = Object.values(colors);

  useEffect(() => {
    if (!isDarkMode) return;

    const trailsCanvas = trailsCanvasRef.current;
    const mainCanvas = mainCanvasRef.current;
    const skyCanvas = skyCanvasRef.current;
    if (!trailsCanvas || !mainCanvas || !skyCanvas) return;

    const trailsCtx = trailsCanvas.getContext('2d');
    const mainCtx = mainCanvas.getContext('2d');
    const skyCtx = skyCanvas.getContext('2d');
    
    // Convert hex to RGB helper
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    // Create color tuples for sky lighting
    const COLOR_TUPLES = {};
    COLOR_CODES.forEach(hex => {
      COLOR_TUPLES[hex] = hexToRgb(hex);
    });

    // Initialize star collections by color
    COLOR_CODES.forEach(color => {
      if (!starsRef.current[color]) {
        starsRef.current[color] = [];
      }
      if (!sparksRef.current[color]) {
        sparksRef.current[color] = [];
      }
    });

    // Set canvas size
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      trailsCanvas.width = width * dpr;
      trailsCanvas.height = height * dpr;
      mainCanvas.width = width * dpr;
      mainCanvas.height = height * dpr;
      skyCanvas.width = width * dpr;
      skyCanvas.height = height * dpr;
      trailsCtx.scale(dpr, dpr);
      mainCtx.scale(dpr, dpr);
      skyCtx.scale(dpr, dpr);
      // Reset context properties after scaling
      trailsCtx.globalAlpha = 1;
      mainCtx.globalAlpha = 1;
      skyCtx.globalAlpha = 1;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Sky light class for gradient effects
    class SkyLight {
      constructor(x, y, colors, radius, colorTuples) {
        this.x = x;
        this.y = y;
        this.colors = colors; // Array of color hex codes
        this.radius = radius;
        this.maxRadius = radius;
        this.life = 2000; // 2 seconds
        this.maxLife = this.life;
        this.intensity = 1;
        this.colorTuples = colorTuples;
      }
      
      update(deltaTime) {
        this.life -= deltaTime;
        // Fade out over time with smoother curve
        this.intensity = Math.max(0, Math.pow(this.life / this.maxLife, 1.5));
        // Expand slightly as it fades
        this.radius = this.maxRadius * (1 + (1 - this.intensity) * 0.3);
      }
      
      draw(ctx, width, height) {
        if (this.life <= 0 || this.intensity <= 0) return;
        
        // Calculate average color from all colors in the burst
        let totalR = 0, totalG = 0, totalB = 0;
        this.colors.forEach(hex => {
          const rgb = this.colorTuples[hex] || { r: 0, g: 0, b: 0 };
          totalR += rgb.r;
          totalG += rgb.g;
          totalB += rgb.b;
        });
        const count = this.colors.length || 1;
        const avgR = totalR / count;
        const avgG = totalG / count;
        const avgB = totalB / count;
        
        // Create smoother radial gradient with more color stops
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        
        // Much dimmer gradient - less bright
        const maxAlpha = this.intensity * 0.12; // Reduced to 12% for less brightness
        gradient.addColorStop(0, `rgba(${avgR}, ${avgG}, ${avgB}, ${maxAlpha * 0.8})`);
        gradient.addColorStop(0.15, `rgba(${avgR}, ${avgG}, ${avgB}, ${maxAlpha * 0.6})`);
        gradient.addColorStop(0.35, `rgba(${avgR}, ${avgG}, ${avgB}, ${maxAlpha * 0.4})`);
        gradient.addColorStop(0.55, `rgba(${avgR}, ${avgG}, ${avgB}, ${maxAlpha * 0.2})`);
        gradient.addColorStop(0.75, `rgba(${avgR}, ${avgG}, ${avgB}, ${maxAlpha * 0.1})`);
        gradient.addColorStop(1, `rgba(${avgR}, ${avgG}, ${avgB}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
    }

    // Star class
    class Star {
      constructor(x, y, color, angle, speed, life, speedOffX = 0, speedOffY = 0) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.color = color;
        this.speedX = Math.sin(angle) * speed + speedOffX;
        this.speedY = Math.cos(angle) * speed + speedOffY;
        this.life = life;
        this.fullLife = life;
        this.visible = true;
        this.sparkFreq = 0;
        this.sparkTimer = 0;
        this.sparkColor = color;
        this.sparkSpeed = 1;
        this.sparkLife = 750;
      }

      update() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.98; // air drag
        this.speedY *= 0.98;
        this.speedY += 0.02; // gravity
        this.life--;

        // Spark trail
        if (this.sparkFreq > 0) {
          this.sparkTimer--;
          if (this.sparkTimer <= 0) {
            this.sparkTimer = this.sparkFreq;
            const sparkAngle = Math.random() * Math.PI * 2;
            const sparkSpeed = Math.random() * this.sparkSpeed;
            const spark = new Spark(
              this.x,
              this.y,
              this.sparkColor,
              sparkAngle,
              sparkSpeed,
              this.sparkLife
            );
            if (!sparksRef.current[this.sparkColor]) {
              sparksRef.current[this.sparkColor] = [];
            }
            sparksRef.current[this.sparkColor].push(spark);
          }
        }
      }

      drawTrail(ctx) {
        // Draw trail line connecting current and previous position
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.prevX, this.prevY);
      }

      drawMain(ctx) {
        // Draw bright particle streak
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.speedX * 1.6, this.y - this.speedY * 1.6);
      }
    }

    // Spark class
    class Spark {
      constructor(x, y, color, angle, speed, life) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.color = color;
        this.speedX = Math.sin(angle) * speed;
        this.speedY = Math.cos(angle) * speed;
        this.life = life;
        this.fullLife = life;
      }

      update() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.9; // air drag
        this.speedY *= 0.9;
        this.speedY += 0.02; // gravity
        this.life--;
      }

      draw(ctx) {
        // Draw spark trail
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.prevX, this.prevY);
      }
    }

    // Shell class
    class Shell {
      constructor(x, y, shellType = 'crysanthemum', explosionColors = null) {
        this.x = x;
        this.y = y;
        this.shellType = shellType;
        const launchDistance = y - (window.innerHeight * 0.3);
        const launchVelocity = Math.pow(launchDistance * 0.04, 0.64);
        this.vy = -launchVelocity * (0.85 + Math.random() * 0.1);
        this.vx = (Math.random() - 0.5) * 0.3;
        // Set life based on time to reach target height
        this.life = Math.abs(launchDistance / this.vy) * 60; // Convert to frames
        this.maxLife = this.life;
        this.prevX = x;
        this.prevY = y;
        this.exploded = false;
        // Store explosion colors to match shell color
        this.explosionColors = explosionColors || COLOR_CODES;
        // Calculate shell color from explosion colors
        this.shellColor = this.calculateShellColor(this.explosionColors, COLOR_TUPLES);
      }
      
      calculateShellColor(colors, colorTuples) {
        // Calculate average color from explosion colors
        let totalR = 0, totalG = 0, totalB = 0;
        colors.forEach(hex => {
          const rgb = colorTuples[hex] || { r: 0, g: 0, b: 0 };
          totalR += rgb.r;
          totalG += rgb.g;
          totalB += rgb.b;
        });
        const count = colors.length || 1;
        const avgR = Math.round(totalR / count);
        const avgG = Math.round(totalG / count);
        const avgB = Math.round(totalB / count);
        return `rgb(${avgR}, ${avgG}, ${avgB})`;
      }

      update() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.02; // gravity
        this.vx *= 0.992; // air drag
        this.vy *= 0.992;
        this.life--;
        // No sparks/trails during ascent - clean shell
      }
      
      shouldExplode() {
        // Explode when shell reaches upper portion of screen (around 30-40% from top) or life runs out
        const targetHeight = window.innerHeight * 0.35;
        // Explode when shell reaches target height or life runs out
        // Also explode when shell starts falling (vy becomes positive after being negative)
        const isFalling = this.prevY < this.y && this.vy > 0;
        return this.life <= 0 || this.y <= targetHeight || isFalling;
      }

      explode() {
        // Use the pre-selected explosion colors (same as shell color)
        const selectedColors = this.explosionColors;
        const particleCount = 120 + Math.floor(Math.random() * 60);
        const spreadSize = 450 + Math.random() * 250;
        const speed = spreadSize / 96;
        const stars = [];
        
        // Create sky light effect with the same colors
        const skyLight = new SkyLight(
          this.x,
          this.y,
          selectedColors,
          spreadSize * 0.6,
          COLOR_TUPLES
        );
        skyLightsRef.current.push(skyLight);

        // Create spherical burst pattern (like original code)
        const PI_2 = Math.PI * 2;
        // Use single color for entire burst
        const burstColor = selectedColors[0];
        for (let i = 0; i < particleCount; i++) {
          // Create even distribution in a sphere
          const angle = (PI_2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
          const speedMult = 0.7 + Math.random() * 0.3;
          // All particles use the same color
          const color = burstColor;
          const life = 1200 + Math.random() * 500;
          
          const star = new Star(
            this.x,
            this.y,
            color,
            angle,
            speedMult * speed,
            life
          );
          
          // Add spark trail for glitter effect (like original code)
          if (Math.random() < 0.6) {
            star.sparkFreq = 200;
            star.sparkSpeed = 0.3;
            star.sparkLife = 300;
            // Use same color for sparks or white
            star.sparkColor = Math.random() < 0.7 ? color : '#ffffff';
            star.sparkTimer = Math.random() * star.sparkFreq;
          }

          stars.push(star);
        }

        return stars;
      }

      draw(ctx) {
        // Draw shell with color matching the explosion
        ctx.fillStyle = this.shellColor;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Add glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.shellColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    // Launch shell
    const launchShell = () => {
      const x = (0.18 + Math.random() * 0.64) * window.innerWidth;
      const y = window.innerHeight;
      const shellTypes = ['crysanthemum', 'ring', 'willow'];
      const shellType = shellTypes[Math.floor(Math.random() * shellTypes.length)];
      
      // Select only ONE color per firework
      const selectedColor = COLOR_CODES[Math.floor(Math.random() * COLOR_CODES.length)];
      const selectedColors = [selectedColor]; // Array with single color
      
      shellsRef.current.push(new Shell(x, y, shellType, selectedColors));
    };

    // Auto-launch shells - increased time between launches
    let autoLaunchTimer = 0;
    const getAutoLaunchInterval = () => 4000 + Math.random() * 3000; // 4-7 seconds between launches
    let autoLaunchInterval = getAutoLaunchInterval();

    // Animation loop
    const animate = (currentTime) => {
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;
      const frameTime = Math.min(deltaTime, 100); // Cap at 100ms

      // Clear trails with fade
      trailsCtx.fillStyle = 'rgba(0, 0, 0, 0.175)';
      trailsCtx.fillRect(0, 0, trailsCanvas.width, trailsCanvas.height);

      // Clear main canvas
      mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      
      // Update and draw sky lights (gradient effects)
      skyCtx.globalCompositeOperation = 'source-over';
      skyCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Slower fade for smoother effect
      skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);
      
      for (let i = skyLightsRef.current.length - 1; i >= 0; i--) {
        const skyLight = skyLightsRef.current[i];
        skyLight.update(frameTime);
        if (skyLight.life > 0 && skyLight.intensity > 0) {
          skyLight.draw(skyCtx, skyCanvas.width / (window.devicePixelRatio || 1), skyCanvas.height / (window.devicePixelRatio || 1));
        } else {
          skyLightsRef.current.splice(i, 1);
        }
      }

      // Update and draw shells
      for (let i = shellsRef.current.length - 1; i >= 0; i--) {
        const shell = shellsRef.current[i];
        shell.update();
        
        // Only draw shell if it hasn't exploded
        if (!shell.exploded) {
          shell.draw(mainCtx);
        }

        // Check if shell should explode
        if (shell.shouldExplode() && !shell.exploded) {
          shell.exploded = true;
          // Explode and create colorful stars
          const newStars = shell.explode();
          if (newStars && newStars.length > 0) {
            newStars.forEach(star => {
              if (!starsRef.current[star.color]) {
                starsRef.current[star.color] = [];
              }
              starsRef.current[star.color].push(star);
            });
          }
          shellsRef.current.splice(i, 1);
        } else if (shell.exploded) {
          shellsRef.current.splice(i, 1);
        }
      }

      // Update and draw stars - colorful explosions
      // Use lighten blend mode for trails canvas (like original code)
      trailsCtx.globalCompositeOperation = 'lighten';
      trailsCtx.lineWidth = 3;
      trailsCtx.lineCap = 'round';
      trailsCtx.globalAlpha = 1;
      
      // Draw stars grouped by color (matching original code structure)
      COLOR_CODES.forEach(color => {
        const stars = starsRef.current[color] || [];
        if (stars.length === 0) return;
        
        // Update all stars first
        for (let i = stars.length - 1; i >= 0; i--) {
          const star = stars[i];
          star.update();
          if (star.life <= 0) {
            stars.splice(i, 1);
          }
        }
        
        // Then draw all trails for this color
        trailsCtx.strokeStyle = color;
        trailsCtx.beginPath();
        stars.forEach(star => {
          if (star.visible && star.life > 0) {
            star.drawTrail(trailsCtx);
          }
        });
        trailsCtx.stroke();
      });

      // Draw main canvas with bright particles (white streaks)
      mainCtx.globalCompositeOperation = 'lighten';
      mainCtx.strokeStyle = '#fff';
      mainCtx.lineWidth = 1;
      mainCtx.lineCap = 'round';
      mainCtx.globalAlpha = 1;
      mainCtx.beginPath();
      
      COLOR_CODES.forEach(color => {
        const stars = starsRef.current[color] || [];
        stars.forEach(star => {
          if (star.visible && star.life > 0) {
            star.drawMain(mainCtx);
          }
        });
      });
      
      mainCtx.stroke();

      // Update and draw sparks - colorful spark trails
      trailsCtx.lineWidth = 1;
      trailsCtx.lineCap = 'butt';
      COLOR_CODES.forEach(color => {
        const sparks = sparksRef.current[color] || [];
        if (sparks.length === 0) return;
        
        trailsCtx.strokeStyle = color;
        trailsCtx.beginPath();

        for (let i = sparks.length - 1; i >= 0; i--) {
          const spark = sparks[i];
          spark.update();
          if (spark.life > 0) {
            spark.draw(trailsCtx);
          }

          if (spark.life <= 0) {
            sparks.splice(i, 1);
          }
        }

        trailsCtx.stroke();
      });

      trailsCtx.globalCompositeOperation = 'source-over';

      // Auto-launch
      autoLaunchTimer += frameTime;
      if (autoLaunchTimer >= autoLaunchInterval) {
        launchShell();
        autoLaunchTimer = 0;
        autoLaunchInterval = getAutoLaunchInterval();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    lastFrameTimeRef.current = performance.now();
    launchShell(); // Launch initial shell
    // Launch second shell after longer delay
    setTimeout(() => launchShell(), 3000);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clear all particles
      COLOR_CODES.forEach(color => {
        if (starsRef.current[color]) starsRef.current[color] = [];
        if (sparksRef.current[color]) sparksRef.current[color] = [];
      });
      shellsRef.current = [];
      skyLightsRef.current = [];
    };
  }, [isDarkMode]);

  if (!isDarkMode) return null;

  return (
    <div className="fireworks-container">
      <canvas ref={skyCanvasRef} id="sky-canvas" className="fireworks-canvas sky-canvas"></canvas>
      <canvas ref={trailsCanvasRef} id="trails-canvas" className="fireworks-canvas"></canvas>
      <canvas ref={mainCanvasRef} id="main-canvas" className="fireworks-canvas"></canvas>
    </div>
  );
};

export default Fireworks;
