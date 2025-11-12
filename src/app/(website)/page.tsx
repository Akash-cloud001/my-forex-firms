"use client";

import ComingSoon from "@/components/website/coming-soon/ComingSoon";
import FirmListSection from "@/components/website/landing-page/FirmListSection";
import FirstSection from "@/components/website/landing-page/FirstSection";
import TrustedFirmSlider from "@/components/website/landing-page/TrustedFirmSlider";
// import TrustedFirmSlider from "@/components/website/landing-page/TrustedFirmSlider";

export default function Page() {
  return<>
  {/* <ComingSoon />; */}
  <main className="w-full min-h-screen bg-background overflow-hidden">
    <FirstSection/>
    <TrustedFirmSlider/>
    <FirmListSection/>
  </main>
  
  </>
  
}
