import Image from 'next/image';
import { ContactForm } from './contactForm';

export function HomeSection() {
  return (
    <section className='relative min-h-[600px] overflow-hidden flex items-center'>
      {/* Background Image with Gradient Overlay */}
      <div className='absolute inset-0'>
        <Image
          src='/home.jpg'
          alt='Portrait'
          fill
          className='object-cover object-[60%_20%] transform scale-110'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent'></div>
      </div>

      {/* Content Container */}
      <div className='relative container mx-auto px-4 h-full'>
        <div className='grid grid-cols-2 h-full items-center'>
          {/* Form Section */}
          <div className='col-span-2 md:col-span-1 py-12'>
            <div className='max-w-md space-y-8'>
              <div>
                <h2 className='text-4xl font-extrabold text-white mb-4 text-center'>
                  ЧУКАРИЦА НА ПРВОМ МЕСТУ
                </h2>
              </div>
              <ContactForm />
            </div>
          </div>
          {/* Empty right side for background visibility */}
          <div className='hidden md:block'></div>
        </div>
      </div>
    </section>
  );
}
