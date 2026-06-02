'use client';

import { forwardRef } from 'react';
import * as THREE from 'three';

interface DropModelProps {
  garmentColor: string;
}

const DropModel = forwardRef<THREE.Group, DropModelProps>(
  function DropModel({ garmentColor }, ref) {
    return (
      <group ref={ref}>
        <mesh>
          <cylinderGeometry args={[0.8, 0.85, 2.2, 64]} />
          <meshStandardMaterial
            color={new THREE.Color(garmentColor)}
            roughness={0.82}
            metalness={0.08}
          />
        </mesh>
      </group>
    );
  }
);

export default DropModel;
