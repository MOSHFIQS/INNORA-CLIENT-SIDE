'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AppLayout({ children }) {
     const pathname = usePathname();
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
     }, []);

     const isDashboard = pathname?.startsWith('/dashboard');

     if (isDashboard) {
          return <div className="min-h-screen bg-gray-100 dark:bg-[#151515]">{children}</div>;
     }

     return (
          <>
               <Navbar />
               <div className="flex flex-col bg-white dark:bg-[#1c1c1c] min-h-screen">
                    <ScrollToTopButton />
                    {children}
               </div>
               <Footer />
          </>
     );
}
