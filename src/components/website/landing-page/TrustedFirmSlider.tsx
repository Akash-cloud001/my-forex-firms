"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from "next/image";

const logos = [
  {
    name: "5%ers",
    link: "https://the5ers.com",
    url: "/website/firm/5s1.png",
  },
  {
    name: "Alpha Capital",
    link: "https://alphacapitalgroup.uk",
    url: "/website/firm/alpha1.png",
  },
  {
    name: "E8 Markets",
    link: "https://e8markets.com",
    url: "/website/firm/e81.png",
  },
  {
    name: "Funding Pips",
    link: "https://fundingpips.com",
    url: "/website/firm/fundingPips2.png",
  },
  {
    name: "5%ers",
    link: "https://the5ers.com",
    url: "/website/firm/5s1.png",
  },
  {
    name: "Alpha Capital",
    link: "https://alphacapitalgroup.uk",
    url: "/website/firm/alpha1.png",
  },
  {
    name: "E8 Markets",
    link: "https://e8markets.com",
    url: "/website/firm/e81.png",
  },
  {
    name: "Funding Pips",
    link: "https://fundingpips.com",
    url: "/website/firm/fundingPips2.png",
  },
  {
    name: "5%ers",
    link: "https://the5ers.com",
    url: "/website/firm/5s1.png",
  },
  {
    name: "Alpha Capital",
    link: "https://alphacapitalgroup.uk",
    url: "/website/firm/alpha1.png",
  },
  {
    name: "E8 Markets",
    link: "https://e8markets.com",
    url: "/website/firm/e81.png",
  },
  {
    name: "Funding Pips",
    link: "https://fundingpips.com",
    url: "/website/firm/fundingPips2.png",
  }
];


export default function TrustedFirmSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });
      setStart(true);
    }
  }

  return (
    <div className="pt-4 pb-12">
      <div className="flex flex-col justify-center items-center ">
        <h3 className="font-geist-sans font-semibold text-2xl text-primary text-shadow-white">
          Industry
        </h3>
        <h3 className="font-geist-sans font-semibold text-2xl leading-[100%] tracking-tight mt-0.5 gradient-text">
          Most Trusted Firms
        </h3>
      </div>
      <div 
        ref={containerRef}
        className="w-full py-12 overflow-hidden mx-auto max-w-7xl relative mask-[linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
      >
        <div
          ref={scrollerRef}
          className={`flex gap-12 shrink-0 w-max flex-nowrap ${
            start ? 'animate-scroll' : ''
          } hover:[animation-play-state:paused]`}
        >
          {logos.map((logo, index) => (
            <div
              key={index}
              className="shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 "
            >
              <a href={logo.link} target="_blank" rel="noopener noreferrer" className="cursor-pointer relative h-16 w-16">
                <Image
                  src={logo.url}
                  alt={logo.name}
                  fill
                  className="object-contain"
                />
              </a>
            </div>
          ))}
        </div>

        <style jsx>{`
          .text-shadow-white {
            text-shadow: 0px 4px 4px #ffffff26;
          }

          @keyframes scroll {
            to {
              transform: translateX(calc(-50% - 96px));
            }
          }

          .animate-scroll {
            animation: scroll 120s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
