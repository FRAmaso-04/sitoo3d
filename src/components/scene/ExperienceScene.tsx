'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import SkyDome        from './SkyDome';
import Clouds         from './Clouds';
import FloatingIsland from './FloatingIsland';
import Dust           from './Dust';
import ModelCarousel  from './ModelCarousel';
import CameraRig      from './CameraRig';
import NoWebGLFallback from '../ui/NoWebGLFallback';

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function SceneLights() {
  return (
    <>
      <hemisphereLight
        color={new THREE.Color('#7E9AAA')}
        groundColor={new THREE.Color('#C79A72')}
        intensity={1.1}
      />
      <directionalLight
        position={[6, 8, 4]}
        color={new THREE.Color('#FFD580')}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-4, 2, -5]}
        color={new THREE.Color('#CC1111')}
        intensity={0.45}
      />
    </>
  );
}

function SceneFog() {
  const { scene } = useThree();
  useEffect(() => {
    const fog = new THREE.FogExp2(new THREE.Color('#C79A72'), 0.028);
    scene.fog = fog;
    return () => { scene.fog = null; };
  }, [scene]);
  return null;
}

interface ExperienceSceneProps {
  activeIndex?: number;
  onActiveChange?: (i: number) => void;
}

export default function ExperienceScene({
  activeIndex = 0,
  onActiveChange,
}: ExperienceSceneProps) {
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(isWebGLAvailable());
  }, []);

  if (!webgl) return <NoWebGLFallback />;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.5], fov: 45, near: 0.1, far: 200 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <AdaptiveDpr pixelated />
      <SceneFog />
      <SceneLights />
      <CameraRig />
      <Suspense fallback={null}>
        <SkyDome />
        <Clouds />
        <FloatingIsland />
        <Dust />
        <ModelCarousel activeIndex={activeIndex} onActiveChange={onActiveChange} />
      </Suspense>
    </Canvas>
  );
}
