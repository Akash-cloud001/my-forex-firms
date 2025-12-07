"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

interface Canvas3DProps {
  mousePosition: { x: number; y: number };
  isDesktop: boolean;
}

function Canvas3D({ mousePosition, isDesktop }: Canvas3DProps) {
  return (
    <div className="relative w-full h-full">
      {/* <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
            Loading 3D Model...
          </div>
        }
      > */}
        <Canvas
          camera={{ position: [0, 0, 25], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: false,
            alpha: true,
            toneMappingExposure: 1.3,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
          }}
        >
          <Scene mousePosition={mousePosition} isDesktop={isDesktop} />
        </Canvas>
      {/* </Suspense> */}
    </div>
  );
}

export default Canvas3D;
