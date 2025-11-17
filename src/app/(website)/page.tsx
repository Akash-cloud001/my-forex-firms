"use client";

import ComingSoon from "@/components/website/coming-soon/ComingSoon";
import FirmListSection from "@/components/website/landing-page/FirmListSection";
import FirstSection from "@/components/website/landing-page/FirstSection";
import TrustedFirmSlider from "@/components/website/landing-page/TrustedFirmSlider";
import Reviews from "@/components/website/Reviews";
import Faq from "@/components/website/Faq";
import Blogs from "@/components/website/Blogs";
import Subscribe from "@/components/website/Subscribe";
// import TrustedFirmSlider from "@/components/website/landing-page/TrustedFirmSlider";

export default function Page() {
  return<>
  {/* <ComingSoon />; */}
  <main className="w-full min-h-screen bg-background overflow-hidden">
    <FirstSection/>
    <TrustedFirmSlider/>
    <FirmListSection/>
    <Reviews/>
    <Faq/>
    <Blogs/>
    <Subscribe/>
    
  </main>
  
  </>
  
}
