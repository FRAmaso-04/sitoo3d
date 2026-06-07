'use client';

import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DROPS } from '@/lib/drops';

// Geometria isola inline (senza bob interno — il bob è gestito dal gruppo padre)
function IslandGeo({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Piano erboso superiore */}
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[1.2, 1.1, 0.18, 20]} />
        <meshStandardMaterial color="#2D4A1A" roughness={0.95} />
      </mesh>
      {/* Cono roccioso sotto */}
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.0, 1.1, 16]} />
        <meshStandardMaterial color="#6B5744" roughness={0.98} />
      </mesh>
      {/* Pino */}
      <group position={[0.3, 0.2, 0.1]}>
        <mesh position={[0, 0.25, 0]}>
          <coneGeometry args={[0.15, 0.45, 7]} />
          <meshStandardMaterial color="#1A2F1A" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <coneGeometry args={[0.1, 0.32, 7]} />
          <meshStandardMaterial color="#1A2F1A" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

interface StationProps {
  drop: (typeof DROPS)[number];
  position: [number, number, number];
  isActive: boolean;
  phase: number;
  onSelect: () => void;
}

function Station({ drop, position, isActive, phase, onSelect }: StationProps) {
  const groupRef  = useRef<THREE.Group>(null);
  const cylRef    = useRef<THREE.Mesh>(null);
  const tRef      = useRef(phase);
  const rotRef    = useRef(0);

  useFrame((_s, dt) => {
    tRef.current += dt;
    // Spin globo — sempre attivo, il modello gira come il pianeta wireframe
    rotRef.current += dt * (isActive ? 0.09 : 0.05);

    if (groupRef.current) {
      // Bob sinusoidale dell'isola intera (isola + modello insieme)
      groupRef.current.position.y =
        position[1] + Math.sin(tRef.current * 0.4) * 0.06;
    }
    if (cylRef.current) {
      cylRef.current.rotation.y = rotRef.current;
      // Micro-oscillazione vento
      cylRef.current.rotation.z = Math.sin(tRef.current * 0.3) * 0.018;
    }
  });

  const scale = isActive ? 1.0 : 0.68;

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {/* Isola */}
      <IslandGeo />

      {/* Cilindro placeholder maglietta — sopra l'isola */}
      <mesh ref={cylRef} position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.72, 0.78, 2.0, 64]} />
        <meshStandardMaterial color={drop.garment} roughness={0.82} metalness={0.08} />
      </mesh>
    </group>
  );
}

interface SelectionSceneProps {
  activeIndex: number;
  onSelect: (i: number) => void;
}

export default function SelectionScene({ activeIndex, onSelect }: SelectionSceneProps) {
  const handleSelect = useCallback((i: number) => onSelect(i), [onSelect]);

  return (
    <>
      {/* Luci diurne */}
      <hemisphereLight
        color={new THREE.Color('#749A96')}
        groundColor={new THREE.Color('#DDE3C0')}
        intensity={1.5}
      />
      <directionalLight
        position={[5, 10, 4]}
        color={new THREE.Color('#FFF8EE')}
        intensity={3.0}
        castShadow
      />
      <directionalLight
        position={[-4, 1, -5]}
        color={new THREE.Color('#B56152')}
        intensity={0.5}
      />

      {/* Le 3 stazioni — isola + modello */}
      {DROPS.map((drop, i) => (
        <Station
          key={drop.code}
          drop={drop}
          position={[i === 0 ? -4.2 : i === 1 ? 0 : 4.2, i === 1 ? 0.3 : 0, 0]}
          isActive={i === activeIndex}
          phase={i * 1.3}
          onSelect={() => handleSelect(i)}
        />
      ))}
    </>
  );
}
