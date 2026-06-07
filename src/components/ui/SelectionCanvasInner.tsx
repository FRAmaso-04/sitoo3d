'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import SelectionScene from '@/components/scene/SelectionScene';

interface Props {
  activeIndex: number;
  onSelect: (i: number) => void;
}

// Wrapped canvas — imported dynamically (ssr: false) from SelectionPage
export default function SelectionCanvasInner({ activeIndex, onSelect }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.2, 10], fov: 52, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0, zIndex: 2 }}
    >
      <Suspense fallback={null}>
        <SelectionScene activeIndex={activeIndex} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  );
}
