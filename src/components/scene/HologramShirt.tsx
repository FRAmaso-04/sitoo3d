'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DROPS } from '@/lib/drops';
import { damp } from '@/lib/utils';

interface HologramShirtProps {
  activeIndex: number;
  position?: [number, number, number];
}

// Silhouette 2D di una t-shirt — ShapeGeometry per un ologramma realistico
function createShirtShape() {
  const s = new THREE.Shape();
  // Corpo: orlo in basso
  s.moveTo(-0.5, -0.65);
  s.lineTo( 0.5, -0.65);
  // Lato destro su fino all'ascella
  s.lineTo( 0.5,  0.22);
  // Manica destra (sporgenza laterale)
  s.lineTo( 0.85,  0.30);
  s.lineTo( 0.85,  0.55);
  s.lineTo( 0.50,  0.55);
  // Spalla destra → colletto
  s.lineTo( 0.28,  0.70);
  // Curva del colletto
  s.quadraticCurveTo( 0.14, 0.80,  0.0, 0.80);
  s.quadraticCurveTo(-0.14, 0.80, -0.28, 0.70);
  // Spalla sinistra → manica
  s.lineTo(-0.50,  0.55);
  s.lineTo(-0.85,  0.55);
  s.lineTo(-0.85,  0.30);
  s.lineTo(-0.50,  0.22);
  // Lato sinistro giù
  s.lineTo(-0.5, -0.65);
  s.closePath();
  return s;
}

export default function HologramShirt({
  activeIndex,
  position = [0, 1.6, -2.0],
}: HologramShirtProps) {
  const [displayIndex, setDisplayIndex] = useState(activeIndex);

  const groupRef    = useRef<THREE.Group>(null);
  const solidMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wireMatRef  = useRef<THREE.MeshBasicMaterial>(null);
  const pointRef    = useRef<THREE.PointLight>(null);
  const opacityRef  = useRef(0);
  const fadingOut   = useRef(false);
  const nextIndex   = useRef(activeIndex);
  const tRef        = useRef(0);
  const rotRef      = useRef(0);

  useEffect(() => {
    // Fade-in iniziale
    opacityRef.current = 0;
  }, []);

  useEffect(() => {
    if (activeIndex === displayIndex) return;
    nextIndex.current = activeIndex;
    fadingOut.current = true;
  }, [activeIndex, displayIndex]);

  useFrame((_s, dt) => {
    tRef.current += dt;
    // Rotazione 0.55 rad/s — visibile e cinematografica
    rotRef.current += dt * 0.55;

    if (groupRef.current) {
      groupRef.current.rotation.y = rotRef.current;
      groupRef.current.rotation.z = Math.sin(tRef.current * 0.28) * 0.02;
    }

    // Cross-fade
    if (fadingOut.current) {
      opacityRef.current = damp(opacityRef.current, 0, 9, dt);
      if (opacityRef.current < 0.04) {
        setDisplayIndex(nextIndex.current);
        fadingOut.current  = false;
        opacityRef.current = 0;
      }
    } else if (opacityRef.current < 0.84) {
      opacityRef.current = damp(opacityRef.current, 0.88, 9, dt);
    }

    const op = opacityRef.current;
    if (solidMatRef.current) solidMatRef.current.opacity = op;
    if (wireMatRef.current)  wireMatRef.current.opacity  = op * 0.55;
    if (pointRef.current) {
      pointRef.current.intensity = 3.2 * (op / 0.88);
      // Luce che pulsa leggermente
      pointRef.current.intensity += Math.sin(tRef.current * 2.1) * 0.15;
    }
  });

  const drop   = DROPS[displayIndex];
  const accent = new THREE.Color(drop.accent);

  // Geometria a forma di t-shirt, costruita una volta per drop (memoized)
  const shirtGeo = useMemo(() => {
    const shape = createShirtShape();
    const extrudeSettings = { depth: 0.06, bevelEnabled: false };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Centra la geometria
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const cx = (box.max.x + box.min.x) / 2;
    const cy = (box.max.y + box.min.y) / 2;
    geo.translate(-cx, -cy, -0.03); // centro X,Y e centra Z sul piano
    return geo;
  }, []);

  return (
    <group position={position}>
      {/* Corpo olografico: shape solida */}
      <group ref={groupRef}>
        <mesh geometry={shirtGeo} castShadow>
          <meshStandardMaterial
            ref={solidMatRef}
            color={accent}
            emissive={accent}
            emissiveIntensity={0.75}
            roughness={0.6}
            metalness={0.0}
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Layer wireframe: griglia olografica sovrapposta */}
        <mesh geometry={shirtGeo}>
          <meshBasicMaterial
            ref={wireMatRef}
            color={accent}
            wireframe
            transparent
            opacity={0.45}
          />
        </mesh>

        {/* Scanlines: piano orizzontale traslucido */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.9, 1.55, 1, 32]} />
          <meshBasicMaterial
            color={accent}
            wireframe
            transparent
            opacity={0.06}
          />
        </mesh>
      </group>

      {/* PointLight da sotto con accent — effetto proiettore */}
      <pointLight
        ref={pointRef}
        position={[0, -1.4, 0]}
        color={drop.accent}
        intensity={3.2}
        distance={4.0}
        decay={2}
      />

      {/* Halo surround */}
      <pointLight
        position={[0, 0.1, 0.3]}
        color={drop.accent}
        intensity={0.6}
        distance={2.5}
        decay={2}
      />
    </group>
  );
}
