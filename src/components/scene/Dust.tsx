'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 160;

export default function Dust() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds, geometry } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds    = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      speeds[i] = 0.3 + Math.random() * 0.7;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { positions, speeds, geometry };
  }, []);

  useFrame((_state, dt) => {
    if (!pointsRef.current) return;
    const attr = geometry.attributes.position as THREE.BufferAttribute;
    const pos  = attr.array as Float32Array;
    const t    = performance.now() * 0.001;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     += speeds[i] * dt * 0.5;
      pos[i * 3 + 1] += Math.sin(t * 0.3 + i) * dt * 0.04;
      if (pos[i * 3] > 10) pos[i * 3] = -10;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={new THREE.Color('#E8D5B0')}
        size={0.015}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}
