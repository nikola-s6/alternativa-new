'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SecondaryHeader from '@/components/SecondaryHeader';
import { formatDate } from '@/lib/helpers';

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  image: string | null;
  published: boolean;
  createdAt: string;
  publishDate: string;
  updatedAt: string;
};

export default function NewsDetailContent({ id }: { id: string }) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/news/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('News article not found');
          }
          throw new Error('Failed to fetch news article');
        }

        const data = await response.json();
        setArticle(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto'>
          <Skeleton className='w-full h-[400px] rounded-lg mb-8' />
          <Skeleton className='w-3/4 h-12 mb-6' />
          <div className='space-y-4'>
            <Skeleton className='w-full h-6' />
            <Skeleton className='w-full h-6' />
            <Skeleton className='w-2/3 h-6' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Error</h2>
          <p className='text-gray-600 mb-8'>{error}</p>
          <Button onClick={handleGoBack} className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Назад
          </Button>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <main>
      <SecondaryHeader title='Вести' />

      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <Button
              variant='outline'
              onClick={handleGoBack}
              className='mb-8 flex items-center gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              Назад
            </Button>

            {article.image && (
              <div className='relative w-full h-[400px] mb-8 rounded-lg overflow-hidden shadow-lg'>
                <Image
                  src={article.image || '/placeholder.svg'}
                  alt={article.title}
                  fill
                  className='object-cover'
                  priority
                />
              </div>
            )}

            <h1 className='text-3xl md:text-4xl font-bold text-primary mb-4'>
              {article.title}
            </h1>

            <p className='text-sm text-gray-500 mb-8'>
              Објављено {formatDate(article.publishDate)}
            </p>

            <div
              className='prose max-w-none'
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
