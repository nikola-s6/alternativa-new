'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import YouTube from 'react-youtube';
import useEmblaCarousel from 'embla-carousel-react';
import type { Video } from '@/app/api/videos/route';
import { Skeleton } from '@/components/ui/skeleton';

export function YouTubeSection() {
  const [windowWidth, setWindowWidth] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);
  const [useEmbla, setUseEmbla] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideos, setPlayingVideos] = useState(0);
  const isPlaying = playingVideos > 0; // Derived state
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        setVideos(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (emblaApi && playingVideos === 0) emblaApi.scrollNext();
    }, 5000);
  }, [emblaApi, playingVideos]);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const checkEmbla = () => {
      if (wrapper.current) {
        setUseEmbla(!(windowWidth > videos.length * 304));
      }
    };
    checkEmbla();
    if (emblaApi) {
      const handleSelect = () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on('select', handleSelect);
      startAutoplay();

      return () => {
        stopAutoplay();
        emblaApi.off('select', handleSelect);
      };
    }
    window.addEventListener('resize', checkEmbla, false);
    window.addEventListener('orientationchange', checkEmbla, false);
  }, [emblaApi, startAutoplay, stopAutoplay, windowWidth]);

  useEffect(() => {
    const handleResize = () => {
      if (wrapper.current) setWindowWidth(wrapper.current.clientWidth);
    };

    handleResize();

    window.addEventListener('resize', handleResize, false);
    window.addEventListener('orientationchange', handleResize, false);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const handleVideoStateChange = (
    event: { target: any; data: number },
    index: number
  ) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      setPlayingVideos((prev) => prev + 1);
      stopAutoplay();
      if (emblaApi && emblaApi.selectedScrollSnap() !== index) {
        emblaApi.scrollTo(index);
      }
    } else if (
      event.data === YouTube.PlayerState.PAUSED ||
      event.data === YouTube.PlayerState.ENDED
    ) {
      setPlayingVideos((prev) => {
        const newCount = Math.max(0, prev - 1);
        if (newCount === 0) {
          startAutoplay();
        }
        return newCount;
      });
    }
  };

  const LoadingSkeleton = () => (
    <div className='flex-shrink-0 w-[300px] mx-2 sm:mx-3'>
      <div className='relative w-full mb-4 overflow-hidden rounded-lg shadow-lg'>
        <Skeleton className='w-full h-[169px]' />
      </div>
      <Skeleton className='h-6 w-3/4 mx-auto' />
    </div>
  );

  return (
    <section
      className='py-16 relative overflow-hidden'
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,51,110,0.95), rgba(0,51,110,0.8)), url('/cukarica/slika2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-4xl font-extrabold text-center mb-12 text-white'>
          ДИСЦИПЛИНА. ОДГОВОРНОСТ. РЕЗУЛТАТИ.
        </h2>
        <div className='w-full' ref={wrapper}>
          {isLoading || !useEmbla ? (
            <div className='w-full flex justify-around'>
              {isLoading
                ? Array(3)
                  .fill(0)
                  .map((_, index) => <LoadingSkeleton key={index} />)
                : videos.map((video, index) => (
                  <div
                    key={video.id}
                    className='flex-shrink-0 w-[300px] mx-2 sm:mx-3'
                  >
                    <div className='relative w-full mb-4 overflow-hidden rounded-lg shadow-lg'>
                      <YouTube
                        videoId={video.id}
                        opts={{
                          height: '169',
                          width: '300',
                          playerVars: {
                            autoplay: 0,
                            controls: 1,
                            modestbranding: 1,
                          },
                        }}
                        onStateChange={(event) =>
                          handleVideoStateChange(event, index)
                        }
                        className='w-full'
                      />
                    </div>
                    <h3 className='text-xl font-semibold text-white text-center'>
                      {video.title}
                    </h3>
                  </div>
                ))}
            </div>
          ) : (
            <div className='overflow-hidden' ref={useEmbla ? emblaRef : null}>
              <div className='flex'>
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className='flex-shrink-0 w-[300px] mx-2 sm:mx-3'
                  >
                    <div className='relative w-full mb-4 overflow-hidden rounded-lg shadow-lg'>
                      <YouTube
                        videoId={video.id}
                        opts={{
                          height: '169',
                          width: '300',
                          playerVars: {
                            autoplay: 0,
                            controls: 1,
                            modestbranding: 1,
                          },
                        }}
                        onStateChange={(event) =>
                          handleVideoStateChange(event, index)
                        }
                        className='w-full'
                      />
                    </div>
                    <h3 className='text-xl font-semibold text-white text-center'>
                      {video.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
