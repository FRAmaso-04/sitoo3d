'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Environment } from '@react-three/drei';
import * as THREE from 'three';
import SkyDome        from './SkyDome';
import Clouds         from './Clouds';
import Dust           from './Dust';
import FloatingIsland from './FloatingIsland';
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
      {/* Ambiente: cielo teal in alto, terra sage/crema in basso */}
      <hemisphereLight
        color={new THREE.Color('#8AB4C0')}
        groundColor={new THREE.Color('#C8B89A')}
        intensity={1.8}
      />
      {/* Sole principale — luce calda dall'alto-destra */}
      <directionalLight
        position={[6, 12, 5]}
        color={new THREE.Color('#FFF4E0')}
        intensity={3.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* Fill light — luce laterale sinistra, tono freddo per contrasto */}
      <directionalLight
        position={[-5, 3, 2]}
        color={new THREE.Color('#A8C8D8')}
        intensity={0.8}
      />
      {/* Rim terracotta — silhouette brand sull'arcade e shirt */}
      <directionalLight
        position={[-3, 0.5, -6]}
        color={new THREE.Color('#C06848')}
        intensity={0.7}
      />
    </>
  );
}

function SceneFog() {
  const { scene } = useThree();
  useEffect(() => {
    // Fog caldo che fonde i clouds lontani nell'orizzonte
    const fog = new THREE.FogExp2(new THREE.Color('#DDE3C0'), 0.016);
    scene.fog = fog;
    return () => { scene.fog = null; };
  }, [scene]);
  return null;
}

interface ExperienceSceneProps {
  activeIndex?: number;
}

export default function ExperienceScene({
  activeIndex = 0,
}: ExperienceSceneProps) {
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(isWebGLAvailable());
  }, []);

  if (!webgl) return <NoWebGLFallback />;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.0], fov: 45, near: 0.1, far: 200 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <AdaptiveDpr pixelated />
      <SceneFog />
      <SceneLights />
      <CameraRig />
      <Suspense fallback={null}>
        {/* Environment: riflessioni ambientali warm-sunset per materiali lucidi */}
        <Environment preset="sunset" background={false} />
        <SkyDome />
        <Clouds />
        <Dust />
        <FloatingIsland activeIndex={activeIndex} />
      </Suspense>
    </Canvas>
  );
}
