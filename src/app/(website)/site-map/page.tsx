"use client";

import React from 'react';
import Link from 'next/link';
import AnimatedSection from '@/components/website/AnimatedSection';

export default function SitemapPage() {
  const sitemapLinks = {
    propFirms: [
      { href: '/', label: 'Home' },
      { href: '/firms', label: 'Firms' },
      { href: '/reviews', label: 'Reviews' },
      { href: '/blogs', label: 'Blogs' },
    ],
    resources: [
      { href: '/about', label: 'About Us' },
      { href: '/blogs', label: 'Blog' },
    ],
    company: [
      // { href: '/about', label: 'About Us' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-conditions', label: 'Terms & Conditions' },
      { href: '/site-map', label: 'Sitemap' },
    ],
    getHelp: [
      { href: '/contact-us', label: 'Contact Us' },
      // { href: '/about', label: 'How it Works' },
    ],
  };

  return (
    <AnimatedSection id="site-map-page">
      <section className="w-full overflow-hidden bg-background h-auto mt-24 pb-24 relative">
        <div className="absolute -left-[200px] top-1/2 -translate-y-1/2   h-[400px] w-[400px] rounded-full bg-[#F66435]/10 blur-[200px]" />
        <div className="absolute -right-[200px] top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#F66435]/10 blur-[200px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4 font-geist-sans">
              Sitemap
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto font-geist-sans">
              Explore the My Forex Firms sitemap for easy navigation across our platform
            </p>
          </div>

          {/* Sitemap Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {/* Column 1: Prop Firms */}
            <div className="flex flex-col">
              <h2 className="text-white font-bold text-lg mb-4 font-geist-sans">
                Prop Firms
              </h2>
              <ul className="space-y-3">
                {sitemapLinks.propFirms.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors font-geist-sans text-sm sm:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="flex flex-col">
              <h2 className="text-white font-bold text-lg mb-4 font-geist-sans">
                Resources
              </h2>
              <ul className="space-y-3">
                {sitemapLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors font-geist-sans text-sm sm:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="flex flex-col">
              <h2 className="text-white font-bold text-lg mb-4 font-geist-sans">
                Company
              </h2>
              <ul className="space-y-3">
                {sitemapLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors font-geist-sans text-sm sm:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Get Help */}
            <div className="flex flex-col">
              <h2 className="text-white font-bold text-lg mb-4 font-geist-sans">
                Get Help
              </h2>
              <ul className="space-y-3">
                {sitemapLinks.getHelp.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors font-geist-sans text-sm sm:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
