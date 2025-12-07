import React, { useRef } from 'react'
import { Model } from './Model'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const Scene = ({ mousePosition, isDesktop = false }) => {
  const { camera } = useThree()
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })
  
  // Camera rotation settings
  const damping = 0.05 // Smooth interpolation factor
  const maxRotationX = Math.PI / 9 // Limit vertical rotation (30 degrees)
  const maxRotationY = Math.PI / 9 // Limit horizontal rotation (60 degrees)
  
  // Initial camera position
  const cameraDistance = 25
  const targetPosition = [0, 0, 0] // Model center
  
  useFrame(() => {
    if (!isDesktop || !mousePosition) {
      // Smoothly return to center when mouse leaves or on touch devices
      targetRotation.current.x *= 0.95
      targetRotation.current.y *= 0.95
    } else {
      // Calculate target rotation based on mouse position
      // mousePosition is normalized to -1 to 1
      targetRotation.current.x = -mousePosition.y * maxRotationX
      targetRotation.current.y = -mousePosition.x * maxRotationY
    }
    
    // Smooth interpolation
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * damping
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * damping
    
    // Calculate camera position using spherical coordinates
    const spherical = new THREE.Spherical(
      cameraDistance,
      Math.PI / 2 + currentRotation.current.x, // theta (vertical)
      currentRotation.current.y // phi (horizontal)
    )
    
    const position = new THREE.Vector3()
    position.setFromSpherical(spherical)
    
    // Update camera position
    camera.position.copy(position)
    camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2])
  })
  
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
      
      <Model scale={0.18} rotation={[0, -0.8, 0]}/>
    </>
  )
}

export default Scene