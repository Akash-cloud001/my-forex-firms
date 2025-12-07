import React, { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial, MeshPhysicalMaterial, Color } from 'three'

export function Model(props) {
  const { nodes, materials } = useGLTF('/model/model.gltf')
  
  // Enhance material with metallic properties and golden-orange color
  const enhancedMaterial = useMemo(() => {
    const material = nodes.mesh_0.material.clone()
    
    // Set metallic properties for golden-orange look
    if (material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial) {
      material.metalness = 0.9
      material.roughness = 0.3
      material.color = new Color('#FF8C42') // Golden-orange base color
      material.emissive = new Color('#FF6B00') // Emissive for brightness
      material.emissiveIntensity = 0.3
      if ('envMapIntensity' in material) {
        material.envMapIntensity = 1.5
      }
    }
    
    return material
  }, [nodes.mesh_0.material])
  
  return (
    <group {...props} dispose={null} castShadow receiveShadow>
      <group position={[-51.175, 50.004, 19.549]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh_0.geometry}
          material={enhancedMaterial}
          rotation={[0, Math.PI / 4, -Math.PI]}
          scale={[-0.195, 0.195, 0.195]}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/model/model.gltf')