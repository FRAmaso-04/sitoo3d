'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function buildSkyTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base gradient — più luminoso e saturo
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0.00, '#9BBFBB');  // teal chiaro in alto
  grad.addColorStop(0.28, '#749A96');  // teal mid
  grad.addColorStop(0.54, '#B56152');  // terracotta sunset
  grad.addColorStop(0.74, '#C4A882');  // oro caldo
  grad.addColorStop(1.00, '#DDE3C0');  // sage cream all'orizzonte
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Effetto halation — alone solare in alto a destra
  // Halation solare — teal-bianco in alto a destra
  const sun = ctx.createRadialGradient(
    size * 0.72, size * 0.08, 0,
    size * 0.72, size * 0.08, size * 0.5
  );
  sun.addColorStop(0,    'rgba(255,252,245,0.80)');
  sun.addColorStop(0.2,  'rgba(220,240,238,0.42)');
  sun.addColorStop(0.5,  'rgba(116,154,150,0.12)');
  sun.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, size, size);

  // Diffusion calda verso l'orizzonte — terracotta/oro
  const mid = ctx.createRadialGradient(size/2, size*0.65, 0, size/2, size*0.65, size*0.45);
  mid.addColorStop(0,   'rgba(221,227,192,0.55)');
  mid.addColorStop(0.4, 'rgba(196,168,130,0.22)');
  mid.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = mid;
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
