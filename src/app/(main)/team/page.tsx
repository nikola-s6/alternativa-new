import { Suspense } from 'react';
import TeamPageContent from '@/components/TeamPageContent';
import { PageLoader } from '@/components/ui/page-loader';

export default function TeamPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <TeamPageContent />
    </Suspense>
  );
}
