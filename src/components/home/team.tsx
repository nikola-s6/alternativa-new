'use client';

import type React from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

type TeamMember = {
  name: string;
  image: string;
};

const teamMembers: TeamMember[] = [
  { name: 'Филип Калмаревић', image: '/team/filip-kalmarevic.jpg' },
  { name: 'Пеђа Милосављевић', image: '/team/pedja-milosavljevic.jpg' },
  { name: 'Филип Калмаревић 1', image: '/team/filip-kalmarevic.jpg' },
  { name: 'Пеђа Милосављевић 1', image: '/team/pedja-milosavljevic.jpg' },
  { name: 'Филип Калмаревић 2', image: '/team/filip-kalmarevic.jpg' },
  { name: 'Пеђа Милосављевић 2', image: '/team/pedja-milosavljevic.jpg' },
  { name: 'Филип Калмаревић 3', image: '/team/filip-kalmarevic.jpg' },
  { name: 'Пеђа Милосављевић 3', image: '/team/pedja-milosavljevic.jpg' },
  { name: 'Филип Калмаревић 4', image: '/team/filip-kalmarevic.jpg' },
  { name: 'Пеђа Милосављевић 4', image: '/team/pedja-milosavljevic.jpg' },
];

const TeamMemberCard: React.FC<TeamMember> = ({ name, image }) => (
  <div className='flex-shrink-0 w-64 mx-2 sm:mx-3'>
    <div className='relative w-full h-64 mb-4 overflow-hidden rounded-lg border-4 border-white shadow-lg'>
      <Image
        src={image || '/placeholder.svg'}
        alt={name}
        fill
        className='object-cover'
      />
    </div>
    <h3 className='text-xl font-semibold text-white text-center'>{name}</h3>
  </div>
);

export function TeamSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: true,
    skipSnaps: true,
  });

  useEffect(() => {
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
  }, [emblaApi]);

  return (
    <section className='py-16 bg-primary'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold text-center mb-12 text-white'>
          Наш тим
        </h2>
        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex'>
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
