"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="relative w-full  py-12 sm:py-16 md:py-20">
      {/* Background faded MF logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden h-[90%] w-[90%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image src="/mff-logo.svg" alt="My Forex Firms" fill className="object-contain opacity-[2%]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-12 lg:gap-16 mb-8 md:mb-12">
          {/* Left Column - Logo and Contact */}
          <div className="flex flex-col">
            {/* MF Logo */}
            <div className="mb-6 relative h-16 md:w-24 w-16 md:h-24">
              <Image src="/mff-logo.svg" alt="My Forex Firms" fill className="object-contain" />
            </div>
            
            {/* Contact Information */}
            <div className="space-y-2 text-white font-geist-sans text-sm sm:text-base opacity-70">
              <p>Official Email: <a href="mailto:support@myforexfirms.com" className="hover:text-[#F66435] transition-colors font-semibold">support@myforexfirms.com</a></p>
              <p>Discord: <a href="mailto:support@myforexfirms.com" className="hover:text-[#F66435] transition-colors font-semibold">support@myforexfirms.com</a></p>
            </div>
          </div>

          {/* Right Column - Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 md:gap-16">
            {/* PROP FIRMS Section */}
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-wide mb-4 font-geist-sans">
                PROP FIRMS
              </h3>
              <ul className="space-y-2 opacity-70">
                <li>
                  <Link href="/firms" className="text-white hover:text-[#F66435] transition-colors font-geist-sans text-sm sm:text-base">
                    All Prop Firms
                  </Link>
                </li>
                <li>
                  <Link href="/complaints" className="text-white hover:text-[#F66435] transition-colors font-geist-sans text-sm sm:text-base">
                    Complaints
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="text-white hover:text-[#F66435] transition-colors font-geist-sans text-sm sm:text-base">
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>

            {/* KNOW MORE Section */}
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-wide mb-4 font-geist-sans">
                KNOW MORE
              </h3>
              <ul className="space-y-2 opacity-70">
                <li>
                  <Link href="/about" className="text-white hover:text-[#F66435] transition-colors font-geist-sans text-sm sm:text-base">
                    About Us
                  </Link>
                </li>
                {/* <li>
                  <Link href="/how-it-works" className="text-white hover:text-[#F66435] transition-colors font-geist-sans text-sm sm:text-base">
                    How it works
                  </Link>
                </li> */}
                <li>
                  <Link href="/site-map" className="text-white hover:text-[#F66435] transition-colors font-geist-sans text-sm sm:text-base">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-400/10 mb-6 md:mb-8"></div>

        {/* Bottom Section - Copyright and Social Media */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Left Side - Copyright and Legal Links */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-white/20 text-xs sm:text-sm font-geist-sans">
            <span>My Forex Firms. All rights reserved.</span>
            <span className="hidden sm:inline">|</span>
            <Link href="/privacy-policy" className="hover:text-white/50 transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/terms-conditions" className="hover:text-white/50 transition-colors">
              Terms & Conditions
            </Link>
          </div>

          {/* Right Side - Social Media Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://x.com/Myforexfirms?t=sSgEgazE7haqqWME_vQ_yQ&s=09" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Twitter/X"
            >
              <Image 
                src="/images/social-brands/twitter.png" 
                alt="Twitter/X" 
                width={24} 
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </a>
            {/* <a 
              href="https://www.instagram.com/myforexfirms?igsh=eWdydHMyNmN5aTFk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <Image 
                src="/images/social-brands/instagram.png" 
                alt="Instagram" 
                width={24} 
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
