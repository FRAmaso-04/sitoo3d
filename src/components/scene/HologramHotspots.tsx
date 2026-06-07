'use client';

import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useProgressRef } from '@/lib/progress-context';
import { clamp01 } from '@/lib/utils';
import { DROPS } from '@/lib/drops';

interface HologramHotspotsProps {
  activeIndex: number;
  position?: [number, number, number];
}

// Posizioni locali relative al gruppo FloatingIsland
// Shirt center: [0, 1.70, -2.2] — spots intorno a questa posizione
const SPOTS = [
  { id: 'weight', pos: [-0.88, 1.95, -2.2] as [number,number,number], label: '280GSM',    detail: 'Heavyweight ring-spun cotton' },
  { id: 'cotton', pos: [ 0.88, 2.10, -2.2] as [number,number,number], label: 'RING-SPUN', detail: 'Pre-shrunk garment-dyed' },
  { id: 'code',   pos: [ 0,    2.45, -2.2] as [number,number,number], label: '',           detail: '' },
] as const;

export default function HologramHotspots({
  activeIndex,
  position = [0, 0, 0],
}: HologramHotspotsProps) {
  const progressRef = useProgressRef();
  // opacity come stato React — aggiornato da useFrame (parent è dentro Canvas)
  const [opacity, setOpacity] = useState(0);
  const prevOpacity = useRef(0);

  useFrame(() => {
    const factor = clamp01((progressRef.current - 0.52) / 0.06);
    // Aggiorna stato solo se cambia di abbastanza — evita re-render inutili
    if (Math.abs(factor - prevOpacity.current) > 0.01) {
      prevOpacity.current = factor;
      setOpacity(factor);
    }
  });

  const drop = DROPS[activeIndex];

  return (
    <group position={position}>
      {SPOTS.map((spot) => {
        const label  = spot.id === 'code' ? drop.code : spot.label;
        const detail = spot.id === 'code' ? drop.name : spot.detail;

        return (
          <Html
            key={spot.id}
            position={spot.pos}
            center
            style={{ pointerEvents: opacity > 0.5 ? 'auto' : 'none' }}
          >
            <HotspotTag
              label={label}
              detail={detail}
              accent={drop.accent}
              opacity={opacity}
            />
          </Html>
        );
      })}
    </group>
  );
}

function HotspotTag({
  label,
  detail,
  accent,
  opacity,
}: {
  label: string;
  detail: string;
  accent: string;
  opacity: number;
}) {
  const divRef   = useRef<HTMLDivElement>(null);
  const expanded = useRef(false);

  const toggle = () => {
    expanded.current = !expanded.current;
    if (divRef.current) {
      const inner = divRef.current.querySelector<HTMLSpanElement>('.hotspot-detail');
      if (inner) inner.style.maxWidth = expanded.current ? '160px' : '0px';
    }
  };

  return (
    <div
      ref={divRef}
      onClick={toggle}
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '6px',
        cursor:       'pointer',
        opacity:      Math.min(1, Math.max(0, opacity * 2 - 0.2)),
        transition:   'opacity 0.2s ease-out',
        userSelect:   'none',
        whiteSpace:   'nowrap',
      }}
    >
      {/* Dot indicatore */}
      <span style={{
        display:      'inline-block',
        width:        '6px',
        height:       '6px',
        borderRadius: '50%',
        background:   accent,
        boxShadow:    `0 0 6px ${accent}`,
        flexShrink:   0,
      }} />

      {/* Label pill */}
      <span style={{
        fontFamily:    'monospace',
        fontSize:      '9px',
        letterSpacing: '0.18em',
        color:         accent,
        border:        `1px solid ${accent}`,
        background:    'rgba(0,0,0,0.72)',
        padding:       '3px 7px',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>

      {/* Detail — espande al click */}
      <span
        className="hotspot-detail"
        style={{
          fontFamily:    'monospace',
          fontSize:      '8px',
          letterSpacing: '0.1em',
          color:         'rgba(255,255,255,0.55)',
          overflow:      'hidden',
          maxWidth:      '0px',
          transition:    'max-width 0.3s ease-out',
        }}
      >
        {detail}
      </span>
    </div>
  );
}
