import Image from 'next/image';
import { Button } from './ui/button';

export function BookPreview() {
  return (
    <section className='bg-white pb-12'>
      <div className='bg-destructive py-6'>
        <h2 className='text-4xl font-extrabold text-center text-white'>
          КЊИГЕ
        </h2>
      </div>
      <div className='container mx-auto px-4 py-8 flex flex-col gap-8 items-center justify-center'>
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
                  АНАТОМИЈА ЕЛИТИСТИЧКЕ ДЕМОКРАТИЈЕ
                </h3>
                <p>Пеђа Милосављевић</p>
              </div>
            </div>
          </div>
        </div>
        <a
          href='/files/knjiga-srpski.pdf'
          download='Анатомија елитистичке демократије'
        >
          <Button
            className='text-lg lg:text-xl font-bold w-full'
            variant='destructive'
          >
            Преузми на српском
          </Button>
        </a>
        <a
          href='/files/knjiga-engleski.pdf'
          download='The Anatomy of Elitist Democracy'
        >
          <Button
            className='text-lg lg:text-xl font-bold w-full'
            variant='default'
          >
            Преузми на енглеском
          </Button>
        </a>
      </div>
    </section>
  );
}
