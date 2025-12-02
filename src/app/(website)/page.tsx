"use client";

import ComingSoon from "@/components/website/coming-soon/ComingSoon";
import FirmListSection from "@/components/website/landing-page/FirmListSection";
import FirstSection from "@/components/website/landing-page/FirstSection";
import TrustedFirmSlider from "@/components/website/landing-page/TrustedFirmSlider";
import Reviews from "@/components/website/Reviews";
import Faq from "@/components/website/Faq";
import Blogs from "@/components/website/Blogs";
import Subscribe from "@/components/website/Subscribe";
import AnimatedSection from "@/components/website/AnimatedSection";
// import TrustedFirmSlider from "@/components/website/landing-page/TrustedFirmSlider";

export default function Page() {
  return<>
  {/* <ComingSoon />; */}
  <main className="w-full min-h-screen bg-background overflow-hidden">
    <AnimatedSection id="first-section">
    <FirstSection/>
    </AnimatedSection>

    <AnimatedSection id="trusted-firm-slider">
    <TrustedFirmSlider/>
    </AnimatedSection>

    <AnimatedSection id="firm-list-section">
    <FirmListSection/>
    </AnimatedSection>

    {/* <AnimatedSection id="reviews">
    <Reviews/>
    </AnimatedSection> */}
    <AnimatedSection id="blogs">
    <Blogs/>
    </AnimatedSection>

    <AnimatedSection id="faq">
    <Faq/>
    </AnimatedSection>

    
    <AnimatedSection id="subscribe">
    <Subscribe/>
    </AnimatedSection>
  </main>
  
  </>
  
}
