'use client';

import { useRef, useEffect, useState } from 'react';
import { useProgressRef } from '@/lib/progress-context';
import { clamp01 } from '@/lib/utils';
import { DROPS } from '@/lib/drops';

interface ArcadeHUDProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ArcadeHUD({ activeIndex, onSelect }: ArcadeHUDProps) {
  const progressRef = useProgressRef();
  const divRef      = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);
  const [opacity, setOpacity] = useState(0);

  // Aggiorna opacity tramite RAF per leggere progress senza useState costoso
  useEffect(() => {
    const tick = () => {
      const factor = clamp01((progressRef.current - 0.52) / 0.06);
      setOpacity(factor);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [progressRef]);

  const drop = DROPS[activeIndex];
  const prev = () => onSelect((activeIndex - 1 + DROPS.length) % DROPS.length);
  const next = () => onSelect((activeIndex + 1) % DROPS.length);

  return (
    <div
      ref={divRef}
      style={{
        position:        'fixed',
        bottom:          '32px',
        left:            '50%',
        transform:       'translateX(-50%)',
        opacity,
        pointerEvents:   opacity > 0.3 ? 'auto' : 'none',
        transition:      'none',
        zIndex:          20,
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        gap:             '10px',
        userSelect:      'none',
      }}
    >
      {/* Linea 1: codice + frecce + dots + nome */}
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '18px',
      }}>
        <span style={{
          fontFamily:    'var(--font-mono, monospace)',
          fontSize:      '10px',
          letterSpacing: '0.22em',
          color:         drop.accent,
          opacity:       0.7,
        }}>
          {drop.code}
        </span>

        {/* Freccia sx */}
        <button
          onClick={prev}
          aria-label="Drop precedente"
          style={{
            background:   'none',
            border:       `1px solid ${drop.accent}`,
            color:        drop.accent,
            width:        '28px',
            height:       '28px',
            cursor:       'pointer',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            fontSize:     '14px',
          }}
        >
          ‹
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {DROPS.map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              aria-label={`Seleziona drop ${i + 1}`}
              style={{
                width:        i === activeIndex ? '10px' : '6px',
                height:       i === activeIndex ? '10px' : '6px',
                borderRadius: '50%',
                background:   i === activeIndex ? drop.accent : 'rgba(255,255,255,0.3)',
                border:       'none',
                cursor:       'pointer',
                padding:      0,
                transition:   'all 0.25s ease-out',
              }}
            />
          ))}
        </div>

        {/* Freccia dx */}
        <button
          onClick={next}
          aria-label="Drop successivo"
          style={{
            background:   'none',
            border:       `1px solid ${drop.accent}`,
            color:        drop.accent,
            width:        '28px',
            height:       '28px',
            cursor:       'pointer',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            fontSize:     '14px',
          }}
        >
          ›
        </button>

        {/* Nome drop */}
        <span style={{
          fontFamily:    '"Bebas Neue", var(--font-display, sans-serif)',
          fontSize:      '18px',
          letterSpacing: '0.18em',
          color:         drop.accent,
          textShadow:    '0 2px 18px rgba(10,6,2,.7)',
        }}>
          {drop.name}
        </span>
      </div>

      {/* Linea 2: stats */}
      <div style={{
        fontFamily:    'var(--font-mono, monospace)',
        fontSize:      '9px',
        letterSpacing: '0.2em',
        color:         'rgba(232,213,176,0.6)',
        textShadow:    '0 2px 12px rgba(10,6,2,.5)',
      }}>
        280GSM · RING-SPUN · GARMENT-DYED
      </div>
    </div>
  );
}
