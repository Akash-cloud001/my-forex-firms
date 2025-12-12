"use client";

import React from 'react';
import InfiniteSlider, { SliderImage } from "@/components/ui/infinite-slider";

const logos: SliderImage[] = [
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
  return (
    <div className="pb-16">
      <div className="flex items-center justify-center mb-4 w-full  ">
          <h1 className="font-geist-sans font-semibold text-3xl leading-[100%] tracking gradient-text text-center relative">
            Prop Firms
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-foreground/80 to-transparent rounded-3xl shadow-md"></div>
          </h1>
        </div>
            <InfiniteSlider images={logos} direction="left" />
        <div className="-mt-12">
            <InfiniteSlider images={logos} direction="right" />
        </div>
    </div>
  );
}
