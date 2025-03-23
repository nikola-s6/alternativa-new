'use client';

import { redirect } from 'next/dist/server/api-utils';
import Image from 'next/image';
import Link from 'next/link';

type ProgramCardProps = {
  title: string;
  image: string;
  link: string;
};

export function ProgramCard({ title, image, link }: ProgramCardProps) {
  return (
    <Link href={'/program#' + link}>
      <div className='bg-gray-100 rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer'>
        <div className='relative h-40 overflow-hidden'>
          <Image
            src={image || '/placeholder.svg'}
            alt={title}
            fill
            className='object-cover transition-transform duration-300 ease-in-out transform hover:scale-110'
          />
        </div>
        <div className='p-4'>
          <h3 className='text-lg text-center font-semibold'>{title}</h3>
        </div>
      </div>
    </Link>
  );
}
