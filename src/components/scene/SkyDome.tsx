'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function buildSkyTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0.00, '#3E6E94');
  grad.addColorStop(0.30, '#7E9AAA');
  grad.addColorStop(0.58, '#C9784E');
  grad.addColorStop(0.78, '#DBAE7E');
  grad.addColorStop(1.00, '#EBD9B6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function SkyDome() {
  const { scene } = useThree();

  useEffect(() => {
    const tex = buildSkyTexture(512);
    scene.background = tex;
    return () => {
      tex.dispose();
      scene.background = null;
    };
  }, [scene]);

  return null;
}
