import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  hue: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
    const particleCount = isMobile ? 50 : 120;
    const frameInterval = isMobile ? 40 : 25;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5 - 0.3,
        opacity: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        hue: 120 + Math.random() * 40, // Green to cyan range
      }));
      sparksRef.current = [];
    };

    resizeCanvas();
    initParticles();

    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeCanvas();
        initParticles();
      }, 200);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Spawn random sparks
    const spawnSpark = () => {
      if (sparksRef.current.length < 30) {
        sparksRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1,
          maxLife: 60 + Math.random() * 60,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const draw = (timestamp: number) => {
      if (timestamp - lastTimeRef.current < frameInterval) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTimeRef.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const sparks = sparksRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Maybe spawn a spark
      if (Math.random() > 0.9) spawnSpark();

      // Draw and update sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        s.vx *= 0.98;
        s.vy *= 0.98;

        const lifeRatio = 1 - s.life / s.maxLife;
        if (lifeRatio <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        // Draw spark with trail
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
        gradient.addColorStop(0, `rgba(200, 255, 200, ${lifeRatio})`);
        gradient.addColorStop(0.3, `rgba(0, 255, 136, ${lifeRatio * 0.6})`);
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
        
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        // Wrap around screen
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Pulsing opacity
        const pulseFactor = 0.5 + 0.5 * Math.sin(p.pulse);
        const currentOpacity = p.opacity * pulseFactor;

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${currentOpacity})`);
        gradient.addColorStop(0.3, `hsla(${p.hue}, 100%, 50%, ${currentOpacity * 0.5})`);
        gradient.addColorStop(0.6, `hsla(${p.hue}, 100%, 40%, ${currentOpacity * 0.2})`);
        gradient.addColorStop(1, 'hsla(150, 100%, 50%, 0)');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${currentOpacity})`;
        ctx.fill();
      }

      // Draw connecting lines between nearby particles
      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
              const alpha = (1 - dist / 150) * 0.15;
              ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Ambient glow spots
      for (let i = 0; i < 3; i++) {
        const time = timestamp * 0.0003 + i * 2;
        const x = (Math.sin(time) * 0.4 + 0.5) * width;
        const y = (Math.cos(time * 0.7) * 0.4 + 0.5) * height;
        const size = 200 + Math.sin(time * 2) * 50;
        
        const ambient = ctx.createRadialGradient(x, y, 0, x, y, size);
        ambient.addColorStop(0, 'rgba(0, 255, 136, 0.03)');
        ambient.addColorStop(0.5, 'rgba(0, 200, 100, 0.01)');
        ambient.addColorStop(1, 'rgba(0, 150, 80, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = ambient;
        ctx.fill();
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
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ParticleField;
