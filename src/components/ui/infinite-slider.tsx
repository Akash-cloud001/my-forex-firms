"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from "next/image";

export interface SliderImage {
  name: string;
  link: string;
  url: string;
}

interface InfiniteSliderProps {
  images: SliderImage[];
  direction?: 'left' | 'right';
  className?: string;
  gap?: string;
  animationDuration?: number;
}

const animationStyles = `
@keyframes infinite-slider-scroll {
  to {
    transform: translateX(calc(-50% - 96px));
  }
}

.infinite-slider-animate-scroll {
  animation: infinite-slider-scroll var(--animation-duration, 120s) linear infinite;
  animation-direction: var(--animation-direction, forwards);
}
`;

export default function InfiniteSlider({
  images,
  direction = 'left',
  className = '',
  gap = 'gap-12',
  animationDuration = 120,
}: InfiniteSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  // Inject keyframes on mount
  useEffect(() => {
    if (typeof document !== "undefined" && !document.getElementById("infinite-slider-animations")) {
      const styleTag = document.createElement("style");
      styleTag.id = "infinite-slider-animations";
      styleTag.innerHTML = animationStyles;
      document.head.appendChild(styleTag);
    }
  }, []);

  const addAnimation = React.useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      const currentChildren = scrollerRef.current.children.length;
      const originalCount = images.length;
      
      // Only duplicate if we haven't already
      if (currentChildren === originalCount) {
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            // Always append duplicates at the end
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });
      }
      
      // Set CSS custom properties for animation direction and duration
      if (containerRef.current) {
        containerRef.current.style.setProperty(
          '--animation-direction',
          direction === 'left' ? 'forwards' : 'reverse'
        );
        containerRef.current.style.setProperty(
          '--animation-duration',
          `${animationDuration}s`
        );
      }
      
      setStart(true);
    }
  }, [images, direction, animationDuration]);

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const timer = requestAnimationFrame(() => {
      addAnimation();
    });
    return () => cancelAnimationFrame(timer);
  }, [addAnimation]);

  return (
    <div 
      ref={containerRef}
      className={`w-full py-12 overflow-hidden mx-auto max-w-7xl relative mask-[linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] ${className}`}
    >
      <div
        ref={scrollerRef}
        className={`flex ${gap} shrink-0 w-max flex-nowrap ${
          start ? 'infinite-slider-animate-scroll' : ''
        } hover:[animation-play-state:paused]`}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 "
          >
            <a href={image.link} target="_blank" rel="noopener noreferrer" className="cursor-pointer relative h-16 w-16">
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-contain"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
