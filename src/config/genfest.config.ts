// GenFest Master Configuration
// Control all visual effects and video playback from here

export const VIDEO_CONFIG = {
  // Video playlist in initial playback order
  playlist: [
    '/welcome.webm',
    '/generians.webm', 
    '/arise.webm',
  ],
  
  // Weighted chances for random selection after first playthrough (must sum to 100)
  weights: {
    '/welcome.webm': 50,     // 50% chance
    '/generians.webm': 25,   // 25% chance
    '/arise.webm': 25,       // 25% chance
  },
  
  // Delay between video switches in milliseconds
  transitionDelay: 100,
  
  // Video playback settings
  muted: true,
  playsInline: true,
};

export const MATRIX_CONFIG = {
  // Character set for matrix rain
  chars: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789',
  
  // Desktop settings
  desktop: {
    fontSize: 16,
    speed: 1.0,
    fadeAlpha: 0.05,
    glowBlur: 20,
    frameInterval: 33,
    columnSpacing: 1.2,
    trailLength: 8,
  },
  
  // Mobile settings (performance optimized)
  mobile: {
    fontSize: 12,
    speed: 0.8,
    fadeAlpha: 0.08,
    glowBlur: 8,
    frameInterval: 50,
    columnSpacing: 1.4,
    trailLength: 5,
  },
};

export const PARTICLE_CONFIG = {
  // Desktop settings
  desktop: {
    particleCount: 120,
    connectionDistance: 150,
    particleSpeed: 0.5,
    sparkSpawnRate: 0.02,
    sparkLifespan: 60,
    orbCount: 5,
    orbSpeed: 0.3,
    orbSize: { min: 50, max: 150 },
  },
  
  // Mobile settings (performance optimized)
  mobile: {
    particleCount: 40,
    connectionDistance: 80,
    particleSpeed: 0.3,
    sparkSpawnRate: 0.01,
    sparkLifespan: 40,
    orbCount: 2,
    orbSpeed: 0.2,
    orbSize: { min: 30, max: 80 },
  },
};

export const OVERLAY_CONFIG = {
  // Scanlines
  scanlines: {
    enabled: true,
    opacity: 0.03,
    size: '4px',
  },
  
  // Vignette effect
  vignette: {
    enabled: true,
    intensity: 0.4,
  },
  
  // Glow border
  glowBorder: {
    enabled: true,
    color: 'hsl(142, 100%, 50%)',
    blur: 100,
    spread: 50,
  },
};

// Utility to detect mobile
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) || window.innerWidth < 768;
};

// Weighted random selection utility
export const selectWeightedRandom = (weights: Record<string, number>): string => {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let random = Math.random() * total;
  
  for (const [video, weight] of entries) {
    random -= weight;
    if (random <= 0) return video;
  }
  
  return entries[0][0];
};
