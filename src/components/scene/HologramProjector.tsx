'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HologramProjectorProps {
  accent: string;
  position?: [number, number, number];
}

export default function HologramProjector({
  accent,
  position = [0, 0.26, -1.8],
}: HologramProjectorProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const tRef     = useRef(0);

  useFrame((_s, dt) => {
    tRef.current += dt;
    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(tRef.current * 1.5) * 0.4;
    }
  });

  const accentColor = new THREE.Color(accent);

  return (
    <group position={position}>
      {/* Base cilindrica */}
      <mesh castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.25, 12]} />
        <meshStandardMaterial color="#1a1010" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Lente superiore */}
      <mesh position={[0, 0.17, 0]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial
          color={accent}
          roughness={0.1}
          metalness={0.3}
          emissive={accentColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Anello decorativo attorno alla lente */}
      <mesh position={[0, 0.17, 0]}>
        <torusGeometry args={[0.11, 0.015, 6, 16]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Beam (cono invertito verso l'alto) */}
      <mesh position={[0, 1.36, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.6, 2.2, 16, 1, true]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.09}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Secondo layer beam, leggermente più opaco al centro */}
      <mesh position={[0, 1.36, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.28, 2.2, 12, 1, true]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Luce che illumina la maglietta dall'alto del beam */}
      <pointLight
        ref={lightRef}
        position={[0, 2.5, 0]}
        color={accent}
        intensity={3}
        distance={4}
        decay={2}
      />
    </group>
  );
}
