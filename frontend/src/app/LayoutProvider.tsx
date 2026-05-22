'use client';

import { usePathname } from 'next/navigation';

import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname.startsWith('/admin');

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  const hideLayout =
    isAdminRoute || isAuthRoute;

  return (
    <>
      {!hideLayout && <Navbar />}

      <main className="flex-1">
        {children}
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}