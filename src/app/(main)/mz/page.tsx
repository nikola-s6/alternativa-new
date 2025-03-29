import NeighborhoodPageContent from '@/components/NeighbourhoodPageContent';
import { PageLoader } from '@/components/ui/page-loader';
import { Suspense } from 'react';

export default function NeighborhoodPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <NeighborhoodPageContent />
    </Suspense>
  );
}
