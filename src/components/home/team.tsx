'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { TeamMember, teamMembers } from '@/config/site';
import Link from 'next/link';

const TeamMemberCard: React.FC<TeamMember & { index: number }> = ({
  name,
  image,
  position,
  index,
}) => (
  <div className='flex-shrink-0 w-64 mx-2 sm:mx-3 cursor-grab active:cursor-grabbing'>
    <Link href={`/team?member=${index}`}>
      <div className='relative w-full h-64 mb-4 overflow-hidden rounded-lg border-4 border-white shadow-lg'>
        {image ? (
          <Image
            src={image || '/placeholder.svg'}
            alt={name}
            fill
            className='object-cover'
          />
        ) : (
          <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
            <svg
              className='w-32 h-32 text-gray-500'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}
      </div>
    </Link>
    <h3 className='text-xl font-semibold text-white text-center'>{name}</h3>
    <p className='text-sm text-gray-300 text-center leading-none'>{position}</p>
  </div>
);

export function TeamSection() {
  const [windowWidth, setWindowWidth] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);
  const [useEmbla, setUseEmbla] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: true,
    skipSnaps: true,
  });

  useEffect(() => {
    const checkEmbla = () => {
      if (wrapper.current) {
        setUseEmbla(!(windowWidth > teamMembers.length * 272));
      }
    };
    checkEmbla();
    if (emblaApi) {
      let intervalId: NodeJS.Timeout;

      const startAutoplay = () => {
        intervalId = setInterval(() => {
          emblaApi.scrollNext();
        }, 3000);
      };

      const stopAutoplay = () => {
        clearInterval(intervalId);
      };

      startAutoplay();

      emblaApi.on('pointerDown', stopAutoplay);
      emblaApi.on('pointerUp', startAutoplay);

      return () => {
        stopAutoplay();
        emblaApi.off('pointerDown', stopAutoplay);
        emblaApi.off('pointerUp', startAutoplay);
      };
    }
  }, [emblaApi, windowWidth]);

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
          НАШ ТИМ
        </h2>
        <div ref={wrapper}>
          {useEmbla ? (
            <div className='overflow-hidden' ref={emblaRef}>
              <div className='flex'>
                {teamMembers.map((member, index) => (
                  <TeamMemberCard index={index} key={index} {...member} />
                ))}
              </div>
            </div>
          ) : (
            <div className='w-full flex justify-center'>
              {teamMembers.map((member, index) => (
                <TeamMemberCard index={index} key={index} {...member} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
