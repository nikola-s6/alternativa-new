'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { NewsArticle } from '@/app/api/news/route';
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(date)
    .replace(/\//g, '.');
};

export function NewsSection() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const NewsSkeleton = () => (
    <div className='bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full'>
      <Skeleton className='h-48 w-full' />
      <div className='p-4 flex flex-col flex-grow'>
        <Skeleton className='h-6 w-3/4 mb-2' />
        <Skeleton className='h-6 w-1/2 mb-2' />
        <Skeleton className='h-4 w-1/4 mt-auto' />
      </div>
    </div>
  );

  return (
    <section className='bg-white pb-12'>
      <div className='bg-destructive py-6'>
        <h2 className='text-4xl font-extrabold text-center text-white'>
          ВЕСТИ
        </h2>
      </div>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loading
            ? Array(6)
              .fill(0)
              .map((_, index) => <NewsSkeleton key={index} />)
            : news.map((article) => (
              <div
                key={article.id}
                className='cursor-pointer bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full'
              >
                <div className='relative h-48'>
                  <Image
                    src={article.image || '/placeholder.svg'}
                    alt={article.title}
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
                <div className='p-4 flex flex-col flex-grow'>
                  <h3 className='text-xl font-semibold mb-2 flex-grow'>
                    {article.title}
                  </h3>
                  <p className='text-sm text-gray-500 mt-auto'>
                    {formatDate(article.date)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
