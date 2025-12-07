"use client";
import Image from "next/image";
import React, { Suspense } from "react"
import Scene from "./Scene"
import { Canvas } from "@react-three/fiber"
function FirstSection() {
  const gradientTextStyle = {
    background: "linear-gradient(180deg, #FFFFFF 0%, #999999 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0px 4px 4px rgba(255, 255, 255, 0.25)",
  };
  const stats = [
    // {
    //   value: "100+",
    //   label: "Verified Brokers",
    //   src: "/website/verified-broker.png",
    // },
    {
      value: "1000+",
      label: "Real Trader Complaints",
      src: "/website/real-trader.png",
    },
    { value: "1M+", label: "Monthly Views", src: "/website/monthly-views.png" },
  ];
  return (
    <div className="flex flex-row justify-evenly items-center min-h-screen">

      <div className="max-w-[470px] h-auto">
        <div className="text-left relative z-10">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl  font-semibold leading-tight whitespace-nowrap gradient-text"
          >
            Transparency,
          </h1>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl  font-semibold leading-tight whitespace-nowrap gradient-text"
          >
             Verified Ratings,
          </h1>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl  font-semibold leading-none gradient-text mt-2"
          >
            Traders Trust.
          </h1>
        </div>
       <div>
        <div className="flex flex-row items-center mt-4">
            {Array.from({length:3}).map((_,index)=>(
              <div key={index} className={`${index !== 0 ? '-ml-4':''}`}>
                <Image src={'/website/hero/trader'+(index+1)+'.png'} alt="verify-badge" height={48} width={48} />
              </div>
            ))}
            <div className="flex flex-col items-start text-white/60 ml-2 !mt-3">
                <p className="font-bold text-base md:text-[20px] leading-[100%]">
                  100+
                </p>
                <p className="text-base md:text-[20px] font-light tracking-[-0.05em]">
                  Verified Brokers
                </p>
              </div>
          </div>
       </div>
        <div className="flex flex-col mt-2 md:flex-row justify-start gap-8 w-full text-white relative z-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 justify-center  py-2  "
            >
              <div className=" w-6 h-6 2xl:w-8 2xl:h-8 rounded flex flex-col relative">
                <Image src={item.src} alt="verify-badge" fill />
              </div>
              <div className="flex gap-2 items-center text-white/60">
                <p className="font-bold text-base md:text-lg leading-[100%]">
                  {item.value}
                </p>
                <p className="text-base md:text-lg font-light tracking-[-0.05em] whitespace-nowrap">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-[300px] w-[700px] bg-[url('/website/hero-bg.png')] bg-no-repeat bg-center bg-cover z-0" />
        {/* <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-[539px] w-[950px] bg-[url('/website/hero-bg.png')] bg-no-repeat bg-center bg-cover z-0" /> */}
        <div className="w-full h-[539px] flex items-center justify-center text-white -mt-20">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading 3D Model...</div>}>
            <Canvas
              camera={{ position: [0, 0, 25], fov: 50 }}
              style={{ width: '500px', height: '539px' }}
              className="relative z-10"
              gl={{ antialias: true, alpha: true, toneMappingExposure: 1.3 }}
            >
              <Scene />
            </Canvas>
          </Suspense>

        </div>
      </div>

      {/* <div
        className="flex flex-col items-center bg-cover bg-center px-6 relative"
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-[539px] w-[950px] bg-[url('/website/hero-bg.png')] bg-no-repeat bg-center bg-cover z-0" />
        <div className="text-center relative z-10">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-semibold leading-normal gradient-text"
          >
            Transparency, Verified Ratings,
          </h1>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-semibold leading-none gradient-text mt-2"
          >
            Traders Trust.
          </h1>
        </div> */}

      {/* Stats Section */}
      {/* <div className="max-w-7xl mx-auto flex flex-col  md:flex-row justify-between w-full mt-8 md:mt-10 xl:mt-14 text-white relative z-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 justify-center  py-2  "
            >
              <div className=" w-6 h-6 2xl:w-8 2xl:h-8 rounded flex flex-col relative">
                <Image src={item.src} alt="verify-badge" fill />
              </div>
              <div className="flex gap-2 items-center text-white/60">
                <p className="font-bold text-base md:text-[20px] leading-[100%]">
                  {item.value}
                </p>
                <p className="text-base md:text-[20px] font-light tracking-[-0.05em]">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div> */}
      {/* </div> */}
    </div>
  );
}

export default FirstSection;
