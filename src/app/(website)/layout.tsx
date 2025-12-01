import React from "react";
import Navbar from "@/components/website/navbar";
import BottomBar from "@/components/website/bottombar";
import Footer from "@/components/website/footer";
import AnimatedSection from "@/components/website/AnimatedSection";
import TradingViewTicker from "@/components/website/TradingViewTicker";
const WebsiteLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className="bg-background min-h-screen w-full pt-14">
      <Navbar />
      {children}
      <BottomBar />
      <AnimatedSection id="footer">
        <Footer />
      </AnimatedSection>
      <TradingViewTicker />
    </section>
  );
};

export default WebsiteLayout;
