import { Suspense } from 'react';
import AdminDashboardContent from '@/components/AdminDashboardContent';
import { PageLoader } from '@/components/ui/page-loader';

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
