import { Suspense } from 'react';
import NewsListContent from '@/components/NewsListContent';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewsListPage() {
  return (
    <Suspense fallback={<NewsListSkeleton />}>
      <NewsListContent />
    </Suspense>
  );
}

function NewsListSkeleton() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <Skeleton className='h-12 w-full max-w-md mx-auto mb-8' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className='bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full'
            >
              <Skeleton className='h-48 w-full' />
              <div className='p-4 flex flex-col flex-grow'>
                <Skeleton className='h-6 w-3/4 mb-2' />
                <Skeleton className='h-6 w-1/2 mb-2' />
                <Skeleton className='h-4 w-1/4 mt-auto' />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
