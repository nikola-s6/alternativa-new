'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import SecondaryHeader from '@/components/SecondaryHeader';
import type { NewsArticle } from '@/app/api/news/route';
import { formatDate, normalizeStringForSearch } from '@/lib/helpers';
import { NewsPlaceholder } from './NewsPlaceholder';

export default function NewsListContent() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/news');

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNews(data);
        setFilteredNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    // Filter news based on search term
    if (searchTerm.trim() === '') {
      setFilteredNews(news);
    } else {
      const search = normalizeStringForSearch(searchTerm);
      const filtered = news.filter((article) =>
        normalizeStringForSearch(article.title).includes(search)
      );
      setFilteredNews(filtered);
    }
  }, [searchTerm, news]);

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
    <main>
      <SecondaryHeader title='Вести' />

      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto mb-12'>
            <div className='bg-primary rounded-lg shadow-lg border-8 border-destructive mb-8'>
              <div className='w-full bg-destructive p-8'>
                <h2 className='text-4xl font-bold text-white mb-6 text-center'>
                  Најновије вести
                </h2>
                <p className='text-white text-lg text-center'>
                  Будите у току на најновијим вестима и дешавањима
                </p>
              </div>

              <div className='p-8'>
                <div className='relative mb-8'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <Input
                    placeholder='Претражите вести'
                    className='pl-10 bg-white/10 text-white placeholder:text-gray-400 border-white/20'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <NewsSkeleton key={index} />
                ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className='text-center py-12'>
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                Вести нису пронађене
              </h3>
              <p className='text-gray-500'>
                {searchTerm
                  ? 'Пробајте са другачијим текстом'
                  : 'Покушајте поново мало касније'}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredNews.map((article) => (
                <Link
                  href={`/news/${article.id}`}
                  key={article.id}
                  className='bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300'
                >
                  <div className='relative h-48'>
                    {article.image ? (
                      <Image
                        src={article.image || '/placeholder.svg'}
                        alt={article.title}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <NewsPlaceholder />
                    )}
                  </div>
                  <div className='p-4 flex flex-col flex-grow'>
                    <h3 className='text-xl font-semibold mb-2 flex-grow'>
                      {article.title}
                    </h3>
                    <p className='text-sm text-gray-500 mt-auto'>
                      {formatDate(article.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
