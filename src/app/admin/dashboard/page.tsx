import { Suspense } from 'react';
import AdminDashboardContent from '@/components/AdminDashboardContent';

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={<div className='container mx-auto px-4 py-16'>Loading...</div>}
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
