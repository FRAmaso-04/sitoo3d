'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useProgressRef } from '@/lib/progress-context';
import { smoothstep, lerp, damp } from '@/lib/utils';

// 6 keyframe Cartesiani — isola al centro della scena (Y≈0)
// Arcade center: world Y ≈ 0.735 | Shirt center: world Y ≈ 1.70 | Projector: Y ≈ 0.26
// KF4-KF5 identici: camera ferma durante interazione arcade (progress 0.55→1.00)
const KEYFRAMES = [
  { p: 0.00, px:  0,   py: 13,  pz:  3,  lx: 0, ly:  0,    lz: 0, fov: 50 }, // vista zenitale — isola piccola sotto
  { p: 0.15, px:  0,   py:  5,  pz: 11,  lx: 0, ly:  0,    lz: 0, fov: 46 }, // Higgsfield ref — isola intera, orizzonte
  { p: 0.30, px:  1.4, py:  3,  pz:  8,  lx: 0, ly:  0.4,  lz: 0, fov: 42 }, // avvicinamento obliquo 3/4
  { p: 0.45, px:  0.5, py:  1.8,pz:  6,  lx: 0, ly:  0.7,  lz: 0, fov: 38 }, // atterraggio — arcade frontale visibile
  { p: 0.55, px:  0,   py:  1.5,pz:  4.8,lx: 0, ly:  0.7,  lz: 0, fov: 36 }, // STATICA — arcade centrato, shirt sopra
  { p: 1.00, px:  0,   py:  1.5,pz:  4.8,lx: 0, ly:  0.7,  lz: 0, fov: 36 }, // STATICA
] as const;

type KF = (typeof KEYFRAMES)[number];

function sampleKeyframes(progress: number) {
  // Clamp to valid range
  const p = Math.max(0, Math.min(1, progress));

  let kA: KF = KEYFRAMES[0];
  let kB: KF = KEYFRAMES[KEYFRAMES.length - 1];

  for (let i = 1; i < KEYFRAMES.length; i++) {
    if (p <= KEYFRAMES[i].p) {
      kA = KEYFRAMES[i - 1];
      kB = KEYFRAMES[i];
      break;
    }
  }

  const span = kB.p - kA.p;
  const t    = span < 0.0001 ? 1 : smoothstep(kA.p, kB.p, p);

  return {
    px:  lerp(kA.px,  kB.px,  t),
    py:  lerp(kA.py,  kB.py,  t),
    pz:  lerp(kA.pz,  kB.pz,  t),
    lx:  lerp(kA.lx,  kB.lx,  t),
    ly:  lerp(kA.ly,  kB.ly,  t),
    lz:  lerp(kA.lz,  kB.lz,  t),
    fov: lerp(kA.fov, kB.fov, t),
  };
}

export default function CameraRig() {
  const progressRef = useProgressRef();
  const { camera }  = useThree();

  const curPos  = useRef(new THREE.Vector3(0, 14, 2));
  const curLook = useRef(new THREE.Vector3(0, 0, 0));
  const curFov  = useRef(48);

  useFrame((_state, dt) => {
    const s = sampleKeyframes(progressRef.current);

    // Damped lerp verso target — 6 = velocità di follow
    curPos.current.set(
      damp(curPos.current.x, s.px, 6, dt),
      damp(curPos.current.y, s.py, 6, dt),
      damp(curPos.current.z, s.pz, 6, dt),
    );
    curLook.current.set(
      damp(curLook.current.x, s.lx, 6, dt),
      damp(curLook.current.y, s.ly, 6, dt),
      damp(curLook.current.z, s.lz, 6, dt),
    );
    curFov.current = damp(curFov.current, s.fov, 4, dt);

    camera.position.copy(curPos.current);
    camera.lookAt(curLook.current);
    if ('fov' in camera) {
      (camera as THREE.PerspectiveCamera).fov = curFov.current;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
  });

  return null;
}
