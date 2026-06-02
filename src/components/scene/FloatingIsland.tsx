'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Pine({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <coneGeometry args={[0.18, 0.6, 7]} />
        <meshStandardMaterial color="#1A2F1A" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <coneGeometry args={[0.12, 0.45, 7]} />
        <meshStandardMaterial color="#1A2F1A" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function FloatingIsland() {
  const groupRef = useRef<THREE.Group>(null);
  const tRef     = useRef(0);

  useFrame((_state, dt) => {
    tRef.current += dt;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(tRef.current * 0.4) * 0.06 - 1.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Top disc — grass/earth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.5, 0.22, 24]} />
        <meshStandardMaterial color="#2D4A1A" roughness={0.95} />
      </mesh>
      {/* Rocky underside cone */}
      <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.4, 1.4, 18]} />
        <meshStandardMaterial color="#6B5744" roughness={0.98} />
      </mesh>
      {/* Pine trees */}
      <Pine position={[-0.7, 0.11, 0.2]} />
      <Pine position={[0.6,  0.11, -0.3]} />
      <Pine position={[0.1,  0.11, 0.9]} />
    </group>
  );
}
