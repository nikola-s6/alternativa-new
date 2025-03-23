import { Suspense } from 'react';
import TeamPageContent from '@/components/TeamPageContent';

export default function TeamPage() {
  return (
    <Suspense
      fallback={<div className='container mx-auto px-4 py-16'>Loading...</div>}
    >
      <TeamPageContent />
    </Suspense>
  );
}
