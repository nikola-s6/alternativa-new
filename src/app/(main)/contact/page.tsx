import ContactFormPageContent from '@/components/ContactFormPageContent';
import { Suspense } from 'react';

export default function ContactPage() {
  return (
    <Suspense
      fallback={<div className='container mx-auto px-4 py-16'>Loading...</div>}
    >
      <ContactFormPageContent />
    </Suspense>
  );
}
