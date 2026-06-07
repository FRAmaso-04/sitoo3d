'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ArcadeMachine     from './ArcadeMachine';
import HologramProjector from './HologramProjector';
import HologramShirt     from './HologramShirt';
import HologramHotspots  from './HologramHotspots';
import { DROPS } from '@/lib/drops';

interface FloatingIslandProps {
  activeIndex: number;
}

// Isola radius = 1.6 | top surface at local y = +0.11
// Arcade H = 1.25 → center at 0.11 + 0.625 = 0.735 → position.y = 0.735
// Hologram shirt: behind arcade at z = -2.2, y = 1.7 (visible above arcade top 0.11+1.25=1.36)
// Projector: on island surface behind arcade at y = 0.26, z = -2.2

const ARCADE_POS:    [number, number, number] = [0, 0.735, 0];
const PROJECTOR_POS: [number, number, number] = [0, 0.26,  -2.2];
const SHIRT_POS:     [number, number, number] = [0, 1.70,  -2.2];

export default function FloatingIsland({ activeIndex }: FloatingIslandProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tRef     = useRef(0);

  useFrame((_state, dt) => {
    tRef.current += dt;
    if (groupRef.current) {
      // Bob sinusoidale senza offset Y — isola fluttua attorno all'origine
      groupRef.current.position.y = Math.sin(tRef.current * 0.38) * 0.07;
    }
  });

  const drop = DROPS[activeIndex];

  return (
    <group ref={groupRef}>
      {/* ── Top disc ── erba/terra con leggero bordo roccioso ── */}
      <mesh receiveShadow>
        <cylinderGeometry args={[1.6, 1.48, 0.22, 32]} />
        <meshStandardMaterial color="#344E1A" roughness={0.92} metalness={0.0} />
      </mesh>

      {/* Bordo/ciglio erboso leggermente più scuro */}
      <mesh position={[0, 0.105, 0]} receiveShadow>
        <torusGeometry args={[1.55, 0.06, 5, 32]} />
        <meshStandardMaterial color="#2A3D13" roughness={0.98} />
      </mesh>

      {/* Strato di roccia sotto il disco erboso */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[1.44, 1.2, 0.16, 20]} />
        <meshStandardMaterial color="#5C4D3A" roughness={0.98} />
      </mesh>

      {/* Cono roccioso pendente */}
      <mesh position={[0, -0.76, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.2, 1.35, 20]} />
        <meshStandardMaterial color="#6B5744" roughness={0.97} />
      </mesh>

      {/* Dettaglio: piccole rocce sull'orlo — 4 punti cardinali */}
      {([[-1.3,0.18,0],[1.3,0.18,0],[0,0.18,1.3],[0,0.18,-1.3]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#5A4535" roughness={0.99} />
        </mesh>
      ))}

      {/* ── Arcade machine sul centro dell'isola ── */}
      <ArcadeMachine position={ARCADE_POS} activeIndex={activeIndex} />

      {/* ── Proiettore ologramma — dietro l'arcade ── */}
      <HologramProjector accent={drop.accent} position={PROJECTOR_POS} />

      {/* ── Ologramma maglietta ── */}
      <HologramShirt activeIndex={activeIndex} position={SHIRT_POS} />

      {/* ── Hotspot tag ── */}
      <HologramHotspots activeIndex={activeIndex} />
    </group>
  );
}
