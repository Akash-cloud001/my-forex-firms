"use client";
import Image from "next/image";
import React from "react";
import TrustedFirmSlider from "./TrustedFirmSlider";
import FirmListSection from "./FirmListSection";

function FirstSection() {
  const gradientTextStyle = {
    background: "linear-gradient(180deg, #FFFFFF 0%, #999999 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0px 4px 4px rgba(255, 255, 255, 0.25)",
  };
  const stats = [
    {
      value: "100+",
      label: "Verified Brokers",
      src: "/website/verified-broker.png",
    },
    {
      value: "1000+",
      label: "Real Trader Reviews",
      src: "/website/real-trader.png",
    },
    { value: "1M+", label: "Monthly Views", src: "/website/monthly-views.png" },
  ];
  return (
    <div className="flex flex-col justify-start items-center min-h-screen pt-32">
      <div
        className="flex flex-col items-center bg-cover bg-center px-6 relative"
      >
        <div className="absolute -top-10 left-0 h-[539px] w-[950px] bg-[url('/website/hero-bg.png')] bg-no-repeat bg-center bg-cover z-0" />
        {/* Hero Text */}
        <div className="text-center relative z-10">
          <h1
            className="text-6xl 2xl:text-7xl font-semibold leading-none gradient-text"
          >
            Transparency, Verified Ratings,
          </h1>
          <h1
            className="text-6xl 2xl:text-7xl font-semibold leading-none gradient-text mt-2"
          >
            Traders Trust.
          </h1>
        </div>

        {/* Stats Section */}
        <div className="flex justify-between w-full mt-14 text-white relative z-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 justify-center  py-2  "
            >
              <Image src={item.src} alt="verify-badge" height={28} width={28} />
              <div className="flex gap-2 items-center text-white/60">
                <p className="font-bold text-[20px] leading-[100%]">
                  {item.value}
                </p>
                <p className="text-[20px] font-light tracking-[-0.05em]">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FirstSection;
