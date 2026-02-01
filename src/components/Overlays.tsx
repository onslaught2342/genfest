import { memo } from 'react';

export const Scanlines = memo(() => (
  <div className="scanlines" aria-hidden="true" />
));

Scanlines.displayName = 'Scanlines';

export const Vignette = memo(() => (
  <div className="vignette" aria-hidden="true" />
));

Vignette.displayName = 'Vignette';

export const GlowBorder = memo(() => (
  <div
    className="fixed inset-0 z-[98] pointer-events-none"
    style={{
      boxShadow: 'inset 0 0 100px rgba(0, 255, 136, 0.1), inset 0 0 200px rgba(0, 255, 136, 0.05)',
    }}
    aria-hidden="true"
  />
));

GlowBorder.displayName = 'GlowBorder';
