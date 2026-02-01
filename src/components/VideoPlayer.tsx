import { useRef, useEffect, useState, useCallback } from 'react';
import { VIDEO_CONFIG, selectWeightedRandom } from '@/config/genfest.config';

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isFirstPlaythrough, setIsFirstPlaythrough] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(VIDEO_CONFIG.playlist[0]);
  const isTransitioning = useRef(false);

  const getNextVideo = useCallback(() => {
    if (isFirstPlaythrough) {
      const nextIndex = currentVideoIndex + 1;
      if (nextIndex < VIDEO_CONFIG.playlist.length) {
        return { video: VIDEO_CONFIG.playlist[nextIndex], index: nextIndex, endOfPlaythrough: false };
      } else {
        return { video: selectWeightedRandom(VIDEO_CONFIG.weights), index: -1, endOfPlaythrough: true };
      }
    } else {
      return { video: selectWeightedRandom(VIDEO_CONFIG.weights), index: -1, endOfPlaythrough: false };
    }
  }, [currentVideoIndex, isFirstPlaythrough]);

  const handleVideoEnd = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const { video, index, endOfPlaythrough } = getNextVideo();

    setTimeout(() => {
      if (endOfPlaythrough) {
        setIsFirstPlaythrough(false);
      }
      setCurrentVideoIndex(index);
      setCurrentSrc(video);
      isTransitioning.current = false;
    }, VIDEO_CONFIG.transitionDelay);
  }, [getNextVideo]);

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

    // Load and play new video when src changes
    video.load();
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
  }, [currentSrc]);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <video
        ref={videoRef}
        src={currentSrc}
        autoPlay
        muted={VIDEO_CONFIG.muted}
        playsInline={VIDEO_CONFIG.playsInline}
        onEnded={handleVideoEnd}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default VideoPlayer;
