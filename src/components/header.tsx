'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { menuItems, socialItems } from '@/config/site';
import { SocialIcon } from './SocialIcon';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      id='header'
      className='sticky top-0 z-50 bg-white shadow-md border-b-4 border-solid border-destructive'
    >
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='block'>
              <Image
                src='/logos/white.jpg'
                alt='Logo'
                width={100}
                height={40}
                className='h-10 w-auto'
              />
            </Link>
          </div>

          <div className='flex items-center justify-start space-x-10'>
            {/* Desktop Menu */}
            {!isMobile && (
              <nav className='hidden md:flex space-x-8'>
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='text-gray-600 border-b-2 border-transparent transition-[border-color] duration-300 ease-in-out hover:text-gray-900  hover:border-destructive'
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            {/* Connect Button (Desktop) */}
            {!isMobile && (
              <Button asChild>
                <Link href='/contact' className='font-extrabold'>
                  Прикључи се
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className='md:hidden text-gray-600 hover:text-gray-900 focus:outline-none'
            >
              {isMobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Social Media Badges */}
      {!isMobileMenuOpen && (
        <div className='border-t-2 border-gray-200'>
          <div className='container mx-auto px-4'>
            <div className='flex justify-center items-center h-12 space-x-6'>
              {socialItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:text-destructive transition-colors'
                >
                  <SocialIcon icon={item.icon} />
                  <span className='sr-only'>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className='fixed inset-0 bg-white z-50 overflow-y-auto'>
          <div className='flex justify-between items-center p-4 border-b'>
            <Link href='/' className='block'>
              <Image
                src='/logos/white.jpg'
                alt='Logo'
                width={100}
                height={40}
                className='h-10 w-auto'
              />
            </Link>
            <button
              onClick={toggleMobileMenu}
              className='text-gray-600 hover:text-gray-900 focus:outline-none'
            >
              <X className='h-6 w-6' />
            </button>
          </div>
          <nav className='flex-grow flex flex-col justify-center items-center space-y-8 pt-10'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-xl border-b-2 border-transparent transition-[border-color] duration-300 ease-in-out text-gray-600 hover:text-gray-900 hover:border-destructive'
                onClick={toggleMobileMenu}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className='mt-8'>
              <Link
                className='font-extrabold'
                href='/contact'
                onClick={toggleMobileMenu}
              >
                Прикључи се
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
