import { Suspense } from 'react';
import MatrixRain from '@/components/MatrixRain';
import ParticleField from '@/components/ParticleField';
import VideoPlayer from '@/components/VideoPlayer';
import { Scanlines, Vignette, GlowBorder } from '@/components/Overlays';

const Index = () => {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Background Effects Layer (z-index 0-5) */}
      <MatrixRain />
      <ParticleField />

      {/* Video Layer (z-index 10) */}
      <Suspense fallback={null}>
        <VideoPlayer />
      </Suspense>

      {/* Overlay Effects (z-index 98-100) */}
      <GlowBorder />
      <Vignette />
      <Scanlines />
    </div>
  );
};

export default Index;
