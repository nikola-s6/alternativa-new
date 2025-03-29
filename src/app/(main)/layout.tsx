import Footer from '@/components/footer';
import Header from '@/components/header';
import type React from 'react';
import '../news-content.css';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
