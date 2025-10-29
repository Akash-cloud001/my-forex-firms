"use client";
import Image from "next/image";
import React from "react";

function FirstSection() {
  const gradientTextStyle = {
    background: "linear-gradient(180deg, #FFFFFF 0%, #999999 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0px 4px 4px rgba(255, 255, 255, 0.25)",
  };
 const stats = [
    { value: "100+", label: "Verified Brokers", src: "/website/verified-broker.png" },
    { value: "1000+", label: "Real Trader Reviews", src: "/website/real-trader.png" },
    { value: "1M+", label: "Monthly Views", src: "/website/monthly-views.png" },
  ];
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="flex flex-col items-center bg-cover bg-center px-6"
        style={{
          backgroundImage: `url(/website/hero-bg.png)`,
          height: "539px",
          width: "950px",
        }}
      >
        {/* Hero Text */}
        <div className="text-center mt-12">
          <h1
            className="text-[60px] font-semibold leading-[1]"
            style={gradientTextStyle}
          >
            Transparency, Verified Ratings,
          </h1>
          <h1
            className="text-[60px] font-semibold leading-[1]"
            style={gradientTextStyle}
          >
            Traders Trust.
          </h1>
        </div>

        {/* Stats Section */}
        <div className="flex justify-between w-full mt-16 text-white">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 justify-center  py-2  "
            >
              <Image
                src={item.src}
                alt="verify-badge"
                height={28}
                width={28}
              />
              <div className="flex gap-2 items-center text-white/60">
                <p className="font-bold text-[20px] leading-[100%]">
                  {item.value}
                </p>
                <p className="text-[20px] font-light leading-[100%] tracking-[-0.05em]">
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
