"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Search, ArrowLeft, FileText, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();
  
  const quickLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/firms', label: 'Browse Firms', icon: Building2 },
    { href: '/blogs', label: 'Blogs', icon: FileText },
    { href: '/reviews', label: 'Reviews', icon: Search },
  ];

  return (
    <section className="w-full overflow-hidden bg-background min-h-screen pt-24 pb-16 relative flex items-center justify-center">
      {/* Background gradient effects */}
      <div className="absolute -left-[200px] top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#F66435]/10 blur-[200px]" />
      <div className="absolute -right-[200px] top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#F66435]/10 blur-[200px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold gradient-text leading-none font-geist-sans">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-geist-sans">
            Page Not Found
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto font-geist-sans">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            asChild
            className="btn-grad hover:text-white px-8 py-6 text-base font-geist-sans"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Go to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base font-geist-sans"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>

      </div>
    </section>
  );
}
