import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const dropsRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Extended character set for more visual variety
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\@#$%^&*ゲンフェスト';
    
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
    
    // More intense settings
    const fontSize = isMobile ? 14 : 18;
    const speed = isMobile ? 0.8 : 1.0;
    const fadeAlpha = isMobile ? 0.08 : 0.05; // Slower fade = longer trails
    const glow = isMobile ? 8 : 20;
    const frameInterval = isMobile ? 50 : 33; // ~30fps for smoother animation
    const columnSpacing = isMobile ? 1.2 : 1.0;

    let columns = 0;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      columns = Math.floor(window.innerWidth / (fontSize * columnSpacing));
      dropsRef.current = Array.from(
        { length: columns },
        () => Math.random() * -window.innerHeight // Start above screen for staggered entry
      );
    };

    resizeCanvas();

    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resizeCanvas, 200);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });

    const draw = (timestamp: number) => {
      if (timestamp - lastTimeRef.current < frameInterval) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTimeRef.current = timestamp;

      // Fade effect - slower fade for longer trails
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px "MS Gothic", monospace`;
      ctx.textBaseline = 'top';

      const drops = dropsRef.current;
      const len = drops.length;
      const height = window.innerHeight;

      for (let i = 0; i < len; i++) {
        const x = i * fontSize * columnSpacing;
        const y = drops[i];
        
        if (y < 0) {
          drops[i] += fontSize * speed;
          continue;
        }

        const char = chars[Math.floor(Math.random() * chars.length)];

        // Bright head character with intense glow
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = glow;
        ctx.fillStyle = '#ffffff'; // Pure white head
        ctx.fillText(char, x, y);

        // Secondary bright trail
        ctx.shadowBlur = glow * 0.6;
        ctx.fillStyle = '#88ffaa';
        const char2 = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char2, x, y - fontSize);

        // Fading trail characters
        ctx.shadowBlur = 0;
        for (let t = 2; t < 8; t++) {
          const trailY = y - fontSize * t;
          if (trailY < 0) break;
          const opacity = 1 - (t / 8);
          ctx.fillStyle = `rgba(0, ${Math.floor(170 + 85 * opacity)}, ${Math.floor(85 + 50 * opacity)}, ${opacity * 0.8})`;
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(trailChar, x, trailY);
        }

        // Reset drop with varied timing
        if (y > height + fontSize * 8) {
          if (Math.random() > 0.95) {
            drops[i] = Math.random() * -200;
          }
        } else {
          drops[i] += fontSize * speed * (0.8 + Math.random() * 0.4); // Variable speed
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default MatrixRain;
