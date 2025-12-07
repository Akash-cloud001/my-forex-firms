import React from 'react'
import { Model } from './Model'
import { OrbitControls } from '@react-three/drei'
import { useControls } from "leva";
const Scene = () => {
    // const {rx, ry, rz, px, py, pz} = useControls({
    //     rx: { value: 0, min: -Math.PI, max: Math.PI * 2 },
    //     ry: { value: -0.8, min: -Math.PI, max: Math.PI * 2 },
    //     rz: { value: 0, min: -Math.PI, max: Math.PI * 2 },

    //     px: { value: -10, min: -10, max: 10 },
    //     py: { value: 10, min: -10, max: 10 },
    //     pz: { value: -10, min: -10, max: 10 },
    // })
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.8} color={'#ffffff'} />
      
      {/* Main directional light from top-left (matching design) */}
      <directionalLight 
        position={[-10, 10, 5]} 
        intensity={2.5}
        color={'#ffffff'}
        castShadow
      />
      
      {/* Fill light from right */}
      <directionalLight 
        position={[10, 5, -5]} 
        intensity={1.0}
        color={'#ffffff'}
      />
      
      {/* Additional light from front */}
      <directionalLight 
        position={[0, 5, 10]} 
        intensity={1.5}
        color={'#ffffff'}
      />
      
      {/* Point light for extra brightness */}
      <pointLight 
        position={[-5, 8, 5]} 
        intensity={1.5}
        color={'#FFA500'}
      />
      
      {/* <Center> */}
      <Model scale={0.18} rotation={[0, -0.8, 0]}/>
      {/* </Center> */}
      {/* <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 2}
      /> */}
    </>
  )
}

export default Scene