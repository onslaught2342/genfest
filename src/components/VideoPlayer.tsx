import { useRef, useEffect } from 'react';

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        video.muted = true;
        try {
          await video.play();
        } catch {
          // Autoplay blocked
        }
      }
    };

    playVideo();

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <video
        ref={videoRef}
        src="/output.webm"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default VideoPlayer;
