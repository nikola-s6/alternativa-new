import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { menuItems, socialItems } from '@/config/site';

const Footer = () => {
  return (
    <footer className='bg-primary text-white relative'>
      {/* Social media section with offset box effect */}
      <div className='absolute left-1/2 -translate-x-1/2 -top-8 w-full max-w-2xl'>
        <div className='relative mx-4'>
          {/* Offset background */}
          <div className='absolute inset-0 bg-destructive translate-x-2 translate-y-2 rounded-lg'></div>
          {/* White box */}
          <div className='relative bg-white rounded-lg p-8'>
            <div className='flex justify-center items-center space-x-12'>
              {socialItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 text-primary hover:text-destructive transition-colors'
                >
                  <item.icon className='h-10 w-10' />
                  <span className='sr-only'>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className='container mx-auto px-4 pt-24 pb-12'>
        <div className='flex flex-col items-center'>
          {/* Logo */}
          <Link href='/' className='mb-12'>
            <Image
              src='/logos/blue.jpg'
              alt='Logo'
              width={150}
              height={60}
              className='h-15 w-auto'
            />
          </Link>

          {/* Navigation */}
          <nav className='mb-8'>
            <ul className='flex flex-wrap justify-center space-x-16'>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-xl font-medium hover:text-gray-300'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Button */}
          <Button asChild variant='custom'>
            <Link href='/'>Прикључи се</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
