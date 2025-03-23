import NeighborhoodPageContent from '@/components/NeighbourhoodPageContent';
import { Suspense } from 'react';

export default function NeighborhoodPage() {
  return (
    <Suspense
      fallback={<div className='container mx-auto px-4 py-16'>Loading...</div>}
    >
      <NeighborhoodPageContent />
    </Suspense>
  );
}
