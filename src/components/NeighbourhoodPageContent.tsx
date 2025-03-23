'use client';

import { useEffect, useState } from 'react';
import { neighborhoods } from '@/config/site';
import SecondaryHeader from '@/components/SecondaryHeader';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { normalizeStringForSearch } from '@/lib/helpers';
import { useSearchParams } from 'next/navigation';

export default function NeighborhoodPageContent() {
  const searchParams = useSearchParams();
  // Initialize searchTerm with the URL parameter value if it exists
  const mzParam = searchParams.get('mesnaZajednica');
  const initialSearchTerm = (() => {
    if (mzParam) {
      const mz = neighborhoods.find((m) => m.value === mzParam);
      return mz ? mz.title : '';
    }
    return '';
  })();

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredNeighborhoods = neighborhoods.filter((neighborhood) => {
    const normalizedSearch = normalizeStringForSearch(searchTerm);
    return (
      normalizeStringForSearch(neighborhood.title).includes(normalizedSearch) ||
      normalizeStringForSearch(neighborhood.responsiblePerson).includes(
        normalizedSearch
      )
    );
  });

  return (
    <main>
      <SecondaryHeader title='Месне заједнице' />

      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-primary rounded-lg shadow-lg border-8 border-destructive mb-8'>
              <div className='w-full bg-destructive p-8'>
                <h2 className='text-4xl font-bold text-white mb-6 text-center'>
                  ЧУКАРИЦА НА ПРВОМ МЕСТУ
                </h2>
                <p className='text-white text-lg text-center'>
                  Наш одговорна лица месних заједница су ту за вас.
                  Контактирајте их за сва питања и предлоге.
                </p>
              </div>

              <div className='p-8'>
                <div className='relative mb-8'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <Input
                    placeholder='Претражите месну заједницу или име одговорног лица...'
                    className='pl-10 bg-white/10 text-white placeholder:text-gray-400 border-white/20'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {filteredNeighborhoods.map((neighborhood) => (
                    <div
                      key={neighborhood.value}
                      className='bg-white/10 rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-colors'
                    >
                      <h3 className='text-xl font-bold text-white mb-2'>
                        {neighborhood.title}
                      </h3>
                      <div className='text-gray-200 mb-4'>
                        <p className='mb-1'>
                          <span className='font-semibold'>Одговорно лице:</span>{' '}
                          {neighborhood.responsiblePerson}
                        </p>
                        <p>
                          <span className='font-semibold'>Телефон:</span>{' '}
                          {neighborhood.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='text-center'>
              <p className='text-primary mb-4'>
                Уколико имате додатна питања можете нас контактирати путем
                форме.
              </p>
              <Link href='/contact'>
                <Button variant='destructive'>Попуни формулар</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
