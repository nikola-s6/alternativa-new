import { Button } from '../ui/button';
import Link from 'next/link';
import { ProgramCard } from './programCard';

type ProgramCard = {
  title: string;
  image: string;
};

const programCards: ProgramCard[] = [
  {
    title: 'Нови пројекти',
    image: '/program/infrastruktura.png',
  },
  { title: 'Рад локалне самоуправе', image: '/program/samouprava.png' },
  { title: 'Брига о деци и младима', image: '/program/mladi.png' },
  { title: 'Заштита животне средине', image: '/program/sredina.png' },
  { title: 'Развој туризма и спорта', image: '/program/sport.png' },
  { title: 'Већа улагања у културу', image: '/program/kultura.png' },
];

export function ProgramSection() {
  return (
    <section className='bg-white p-8 border-8 border-destructive'>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row lg:items-center'>
          <div className='lg:w-1/3 mb-8 lg:mb-0'>
            <h2 className='text-primary text-4xl lg:text-5xl font-extrabold text-center lg:text-left lg:leading-tight'>
              ПРОГРАМ ЗА ЧУКАРИЦУ НА ПРВОМ МЕСТУ
            </h2>
            <Button asChild>
              <Link href='/' className='font-extrabold'>
                Прочитај више
              </Link>
            </Button>
          </div>
          <div className='lg:w-2/3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {programCards.map((card, index) => (
                <ProgramCard key={index} {...card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
