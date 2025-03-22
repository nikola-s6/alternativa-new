import Image from 'next/image';
import { Button } from './ui/button';

export function BookPreview() {
  return (
    <div className='bg-white border-8 border-destructive'>
      <div className='bg-white border-8 border-primary'>
        <div className='bg-white p-8 border-8 border-destructive'>
          <div className=' flex flex-col-reverse lg:flex-row items-center gap-8'>
            <div className='w-full lg:w-1/2 space-y-8 flex flex-col'>
              <a
                href='/files/knjiga-srpski.pdf'
                download='Анатомија елитистичке демократије'
              >
                <Button
                  className='text-2xl font-bold w-full'
                  variant='destructive'
                >
                  Преузми на српском
                </Button>
              </a>
              <a
                href='/files/knjiga-engleski.pdf'
                download='The Anatomy of Elitist Democracy'
              >
                <Button className='text-2xl font-bold w-full' variant='default'>
                  Преузми на енглеском
                </Button>
              </a>
            </div>
            <div className='w-full lg:w-1/2 mt-8 lg:mt-0'>
              <div className='relative h-[400px] w-full overflow-hidden rounded-lg border-2 border-primary'>
                <Image
                  src='/book-cover.jpg?height=400&width=600'
                  alt='autonimija-elitisticke-demokratije'
                  fill
                  className='object-contain lg:object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end'>
                  <div className='p-6 text-white'>
                    <h3 className='text-2xl font-bold mb-2'>
                      АУТОНОМИЈА ЕЛИТИСТИЧКЕ ДЕМОКРАТИЈЕ
                    </h3>
                    <p>Пеђа Милосављевић</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
