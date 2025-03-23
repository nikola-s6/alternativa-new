'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { teamMembers } from '@/config/site';
import SecondaryHeader from '@/components/SecondaryHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function TeamPageContent() {
  const [openMemberIndex, setOpenMemberIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();

  // Check for member parameter in URL and open the corresponding modal
  useEffect(() => {
    const memberParam = searchParams.get('member');
    if (memberParam) {
      const memberIndex = Number.parseInt(memberParam, 10);
      if (
        !isNaN(memberIndex) &&
        memberIndex >= 0 &&
        memberIndex < teamMembers.length
      ) {
        // Set the open member index to show the dialog
        setOpenMemberIndex(memberIndex);
      }
    }
  }, [searchParams]);

  return (
    <main>
      <SecondaryHeader title='Наш тим' />

      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='bg-primary rounded-lg shadow-lg border-8 border-destructive mb-12'>
              <div className='w-full bg-destructive p-8'>
                <h2 className='text-4xl font-bold text-white mb-6 text-center'>
                  ЧУКАРИЦА НА ПРВОМ МЕСТУ
                </h2>
                <p className='text-white text-lg text-center'>
                  Упознајте наш тим посвећених стручњака који раде на томе да
                  Чукарица постане боље место за живот.
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className='bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 hover:border-destructive transition-all duration-300 transform hover:scale-105'
                >
                  <div className='relative h-80 w-full'>
                    {member.image ? (
                      <Image
                        src={member.image || '/placeholder.svg'}
                        alt={member.name}
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

                  <div className='p-6'>
                    <h3 className='text-2xl font-bold text-primary mb-2'>
                      {member.name}
                    </h3>
                    <p className='text-destructive font-semibold mb-4'>
                      {member.position}
                    </p>

                    <p className='text-gray-700 line-clamp-3 mb-4'>
                      {member.biography.split('\n')[0]}
                    </p>

                    <button
                      onClick={() => setOpenMemberIndex(index)}
                      className='bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors w-full'
                    >
                      Прочитај више
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Controlled Dialog for each team member */}
      {teamMembers.map((member, index) => (
        <Dialog
          key={index}
          open={openMemberIndex === index}
          onOpenChange={(open) => {
            if (!open) setOpenMemberIndex(null);
          }}
        >
          <DialogContent className='sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6'>
            <DialogHeader className='mb-4'>
              <DialogTitle className='text-2xl font-bold'>
                {member.name}
              </DialogTitle>
              <p className='text-destructive font-semibold mt-1 mb-2'>
                {member.position}
              </p>
            </DialogHeader>

            <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='relative h-64 md:h-full'>
                {member.image ? (
                  <Image
                    src={member.image || '/placeholder.svg'}
                    alt={member.name}
                    fill
                    className='object-cover rounded-lg'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-300 flex items-center justify-center rounded-lg'>
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

              <div className='md:col-span-2'>
                <div className='prose max-w-none'>
                  {member.biography.split('\n\n').map((paragraph, i) => (
                    <p key={i} className='mb-4'>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </main>
  );
}
