import { Suspense } from 'react';
import NewsDetailContent from '@/components/NewsDetailsContent';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<NewsDetailSkeleton />}>
      <NewsDetailContent id={params.id} />
    </Suspense>
  );
}

function NewsDetailSkeleton() {
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
