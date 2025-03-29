import ContactFormPageContent from '@/components/ContactFormPageContent';
import { PageLoader } from '@/components/ui/page-loader';
import { Suspense } from 'react';

export default function ContactPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ContactFormPageContent />
    </Suspense>
  );
}
