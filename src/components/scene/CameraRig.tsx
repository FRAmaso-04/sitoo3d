'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useProgressRef } from '@/lib/progress-context';
import { smoothstep, lerp, damp } from '@/lib/utils';

const KEYFRAMES = [
  { p: 0.00, theta:    0, r: 5.0, y: 0.0, ly:  0.0 },
  { p: 0.28, theta:  -55, r: 3.8, y: 0.2, ly:  0.2 },
  { p: 0.55, theta: -180, r: 5.2, y: 0.1, ly:  0.0 },
  { p: 0.80, theta: -300, r: 5.5, y: 0.2, ly:  0.1 },
  { p: 1.00, theta: -360, r: 6.2, y: 0.2, ly: -0.2 },
] as const;

type Keyframe = { p: number; theta: number; r: number; y: number; ly: number };

function sampleKeyframes(progress: number) {
  let kA: Keyframe = KEYFRAMES[0];
  let kB: Keyframe = KEYFRAMES[KEYFRAMES.length - 1];

  for (let i = 1; i < KEYFRAMES.length; i++) {
    if (progress <= KEYFRAMES[i].p) {
      kA = KEYFRAMES[i - 1];
      kB = KEYFRAMES[i];
      break;
    }
  }

  const span = kB.p - kA.p;
  const t    = span < 0.0001 ? 1 : smoothstep(kA.p, kB.p, progress);

  return {
    theta: lerp(kA.theta, kB.theta, t) * (Math.PI / 180),
    r:     lerp(kA.r,     kB.r,     t),
    y:     lerp(kA.y,     kB.y,     t),
    ly:    lerp(kA.ly,    kB.ly,    t),
  };
}

export default function CameraRig() {
  const progressRef = useProgressRef();
  const curPos  = useRef(new THREE.Vector3(0, 0, 5.0));
  const curLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, dt) => {
    const { camera } = state;
    const s = sampleKeyframes(progressRef.current);

    const tx = Math.sin(s.theta) * s.r;
    const tz = Math.cos(s.theta) * s.r;

    curPos.current.set(
      damp(curPos.current.x, tx,  5, dt),
      damp(curPos.current.y, s.y, 5, dt),
      damp(curPos.current.z, tz,  5, dt),
    );
    curLook.current.set(
      damp(curLook.current.x, 0,    5, dt),
      damp(curLook.current.y, s.ly, 5, dt),
      damp(curLook.current.z, 0,    5, dt),
    );

    camera.position.copy(curPos.current);
    camera.lookAt(curLook.current);
  });

  return null;
}
