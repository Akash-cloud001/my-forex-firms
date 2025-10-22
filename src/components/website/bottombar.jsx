"use client";
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
const bottombar = () => {
  const pathname = usePathname();
  
  // Hide bottombar on home page
  if (pathname === '/') {
    return null;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <section className="w-12 h-12 rounded-full border border-border bg-white/10 backdrop-blur-sm fixed bottom-4 right-4 md:right-8 z-50 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
            <Link href="/post-review" className='relative block w-6 h-6 '>
              <Image src="/website/review-btn.svg" alt="review" fill className='object-contain' />
            </Link>
          </section>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-black/90 text-white border-none">
          <p>Post Review</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default bottombar