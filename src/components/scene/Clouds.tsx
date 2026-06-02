'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function buildCloudTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0,   'rgba(240,228,210,0.88)');
  grad.addColorStop(0.4, 'rgba(235,217,182,0.55)');
  grad.addColorStop(1,   'rgba(220,195,155,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

interface CloudDatum {
  x: number;
  y: number;
  z: number;
  scale: number;
  speed: number;
  layer: 0 | 1;
}

export default function Clouds() {
  const groupRef = useRef<THREE.Group>(null);
  const texture  = useMemo(() => buildCloudTexture(256), []);
  const reduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const clouds: CloudDatum[] = useMemo(() => {
    const rng = (min: number, max: number) => Math.random() * (max - min) + min;
    return Array.from({ length: 45 }, (_, i) => {
      const far = i < 25;
      return {
        x:     rng(-40, 40),
        y:     far ? rng(4, 9)     : rng(1.5, 4),
        z:     far ? rng(-35, -10) : rng(-8, 5),
        scale: far ? rng(3, 7)     : rng(5, 12),
        speed: far ? rng(0.5, 1.2) : rng(1.8, 3.2),
        layer: (far ? 0 : 1) as 0 | 1,
      };
    });
  }, []);

  useFrame((_state, dt) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((sprite, i) => {
      sprite.position.x += clouds[i].speed * dt * (reduced ? 0.05 : 1);
      if (sprite.position.x > 50) sprite.position.x = -50;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <sprite
          key={i}
          position={[c.x, c.y, c.z]}
          scale={[c.scale, c.scale * 0.55, 1]}
        >
          <spriteMaterial
            map={texture}
            depthWrite={false}
            transparent
            opacity={c.layer === 1 ? 0.75 : 0.55}
          />
        </sprite>
      ))}
    </group>
  );
}
