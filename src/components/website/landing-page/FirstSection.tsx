"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Canvas3D from "./Canvas3D";
import AnimatedNumber from "@/components/common/AnimatedNumber";

// Hook to detect if device is desktop (not touch)
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if device has touch capability
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Also check for pointer media query (more reliable)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;

    // Desktop = has fine pointer (mouse) and no touch, or has both but prefers fine pointer
    const prefersPointer = window.matchMedia(
      "(pointer: fine) and (hover: hover)"
    ).matches;

    setIsDesktop((hasPointer && !hasTouch) || prefersPointer);

    // Listen for changes
    const mediaQuery = window.matchMedia(
      "(pointer: fine) and (hover: hover)"
    );
    const handleChange = () => {
      setIsDesktop(mediaQuery.matches && !hasTouch);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
}

function FirstSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const isDesktop = useIsDesktop();

  const gradientTextStyle = {
    background: "linear-gradient(180deg, #FFFFFF 0%, #999999 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0px 4px 4px rgba(255, 255, 255, 0.25)",
  } as React.CSSProperties;

  const stats = [
    {
      value: "1000+",
      label: "Real Trader Complaints",
      src: "/website/real-trader.png",
    },
    { value: "1M+", label: "Monthly Views", src: "/website/monthly-views.png" },
  ];

  // Handle mouse movement for camera rotation (desktop only)
  useEffect(() => {
    if (!isDesktop || !canvasRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Calculate normalized mouse position (-1 to 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      // Smoothly return to center
      setMousePosition({ x: 0, y: 0 });
    };

    const canvasContainer = canvasRef.current;
    canvasContainer.addEventListener("mousemove", handleMouseMove);
    canvasContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvasContainer.removeEventListener("mousemove", handleMouseMove);
      canvasContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDesktop]);

  return (
    <div
      ref={canvasRef}
      className="relative flex flex-col-reverse md:flex-row justify-center md:justify-evenly items-center min-h-screen px-4 md:px-8 lg:px-0 mt-24 md:mt-0 overflow-hidden"
    >
      {/* LEFT SECTION - TEXT */}
      <div className="relative z-10 max-w-[320px] sm:max-w-[400px] lg:max-w-[470px] h-auto  w-full">
        <div className="text-left">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight whitespace-nowrap gradient-text"
            style={gradientTextStyle}
          >
            Transparency,
          </h1>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight whitespace-nowrap w-full gradient-text"
            style={gradientTextStyle}
          >
            Verified Ratings,
          </h1>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-none gradient-text mt-2"
            style={gradientTextStyle}
          >
            Traders Trust.
          </h1>
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={index !== 0 ? "-ml-4" : ""}>
                <Image
                  src={"/website/hero/trader" + (index + 1) + ".png"}
                  alt="verify-badge"
                  height={48}
                  width={48}
                />
              </div>
            ))}
            <div className="flex flex-col items-start text-white/60 ml-2 !mt-3">
              <AnimatedNumber
                value="100+"
                className="font-bold text-base md:text-[20px] leading-[100%]"
              />
              <p className="text-base md:text-[20px] font-light tracking-[-0.05em]">
                Verified Brokers
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-2 lg:flex-row justify-start lg:gap-8 w-full text-white relative z-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2 justify-start py-2"
            >
              <div className="w-6 h-6 2xl:w-8 2xl:h-8 rounded flex flex-col relative">
                <Image src={item.src} alt="verify-badge" fill />
              </div>
              <div className="flex gap-2 items-center text-white/60">
                <AnimatedNumber
                  value={item.value}
                  className="font-bold text-base md:text-lg leading-[100%]"
                />
                <p className="text-base md:text-lg font-light tracking-[-0.05em] whitespace-nowrap">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SECTION - 3D CANVAS */}
      <div className="relative z-0 pointer-events-none">
        <div className="absolute -bottom-20 lg:bottom-10 left-1/2 -translate-x-1/2 h-[300px] w-[700px] bg-[url('/website/hero-bg.png')] bg-no-repeat bg-center bg-cover z-0" />

        <div className="w-[400px] h-[400px] lg:w-[500px] lg:h-[539px] flex items-center justify-center text-white -mt-20 relative z-0">
          <Canvas3D mousePosition={mousePosition} isDesktop={isDesktop} />
        </div>
      </div>
    </div>
  );
}

export default FirstSection;
