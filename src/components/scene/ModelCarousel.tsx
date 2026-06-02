'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DROPS } from '@/lib/drops';
import { clamp01, damp } from '@/lib/utils';
import { useProgressRef } from '@/lib/progress-context';
import DropModel from './DropModel';

const SLOT_CENTER = { pos: new THREE.Vector3(0, 0, 0),        scale: 1.0  };
const SLOT_LEFT   = { pos: new THREE.Vector3(-3.9, -0.5, -1), scale: 0.62 };
const SLOT_RIGHT  = { pos: new THREE.Vector3(3.9, -0.5, -1),  scale: 0.62 };

function getSlot(activeIndex: number, dropIndex: number, total: number) {
  if (dropIndex === activeIndex) return SLOT_CENTER;
  const left  = (activeIndex - 1 + total) % total;
  const right = (activeIndex + 1) % total;
  if (dropIndex === left)  return SLOT_LEFT;
  if (dropIndex === right) return SLOT_RIGHT;
  return null;
}

interface ItemState {
  pos:   THREE.Vector3;
  scale: number;
  rot:   number;
  time:  number;
}

interface ModelCarouselProps {
  activeIndex?:    number;
  onActiveChange?: (index: number) => void;
}

export default function ModelCarousel({
  activeIndex: controlledIndex = 0,
  onActiveChange,
}: ModelCarouselProps) {
  const progressRef = useProgressRef();
  const activeRef   = useRef(0);
  const { raycaster, camera, gl } = useThree();
  const meshRefs  = useRef<(THREE.Group | null)[]>(DROPS.map(() => null));
  const states    = useRef<ItemState[]>(
    DROPS.map(() => ({ pos: new THREE.Vector3(0, 0, 0), scale: 0, rot: 0, time: 0 }))
  );

  useEffect(() => {
    activeRef.current = controlledIndex;
  }, [controlledIndex]);

  const handleSelect = useCallback((i: number) => {
    activeRef.current = i;
    onActiveChange?.(i);
  }, [onActiveChange]);

  useEffect(() => {
    const canvas  = gl.domElement;
    const onClick = (e: MouseEvent) => {
      const ef = clamp01((progressRef.current - 0.88) / 0.12);
      if (ef < 0.5) return;

      const rect  = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(mouse, camera);

      const candidates = meshRefs.current
        .map((g, i) => ({ g, i }))
        .filter(({ g, i }) => g !== null && i !== activeRef.current);

      for (const { g, i } of candidates) {
        if (raycaster.intersectObjects(g!.children, true).length > 0) {
          handleSelect(i);
          break;
        }
      }
    };
    canvas.addEventListener('click', onClick);
    return () => canvas.removeEventListener('click', onClick);
  }, [camera, gl, raycaster, progressRef, handleSelect]);

  useFrame((_s, dt) => {
    const progress = progressRef.current;
    const ef       = clamp01((progress - 0.88) / 0.12);
    const active   = activeRef.current;
    const total    = DROPS.length;

    DROPS.forEach((_drop, i) => {
      const mesh  = meshRefs.current[i];
      const state = states.current[i];
      if (!mesh) return;

      state.time += dt;

      const slot        = getSlot(active, i, total);
      const targetScale = slot ? slot.scale * ef : 0;
      const targetPos   = slot
        ? slot.pos
        : (i < active ? SLOT_LEFT.pos : SLOT_RIGHT.pos);

      state.scale = damp(state.scale, targetScale, 6, dt);
      state.pos.lerp(targetPos, 1 - Math.exp(-6 * dt));

      mesh.position.copy(state.pos);
      mesh.scale.setScalar(state.scale);

      const isActive  = i === active;
      const spinSpeed = isActive ? (0.05 + 0.4 * ef) : 0.12;
      state.rot += dt * spinSpeed;
      mesh.rotation.y = state.rot;
      mesh.rotation.z = Math.sin(state.time * 0.25) * 0.02;
    });
  });

  return (
    <>
      {DROPS.map((drop, i) => (
        <DropModel
          key={drop.code}
          ref={(el: THREE.Group | null) => { meshRefs.current[i] = el; }}
          garmentColor={drop.garment}
        />
      ))}
    </>
  );
}
