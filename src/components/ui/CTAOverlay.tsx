'use client';

import { useEffect, useRef, useState } from 'react';
import { useProgressRef } from '@/lib/progress-context';
import { clamp01 } from '@/lib/utils';
import { DROPS } from '@/lib/drops';

interface CTAOverlayProps {
  activeIndex: number;
}

export default function CTAOverlay({ activeIndex }: CTAOverlayProps) {
  const progressRef = useProgressRef();
  const rafRef      = useRef<number>(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const tick = () => {
      const factor = clamp01((progressRef.current - 0.88) / 0.1);
      setOpacity(factor);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [progressRef]);

  const drop = DROPS[activeIndex];

  return (
    <div
      style={{
        position:        'fixed',
        inset:           0,
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             '16px',
        opacity,
        pointerEvents:   opacity > 0.5 ? 'auto' : 'none',
        zIndex:          30,
      }}
    >
      {/* Vignette scura leggera centrata */}
      <div style={{
        position:         'absolute',
        inset:            0,
        background:       'radial-gradient(ellipse at center, transparent 20%, rgba(8,8,8,0.55) 100%)',
        pointerEvents:    'none',
      }} />

      {/* Drop name */}
      <p style={{
        fontFamily:    'var(--font-mono, monospace)',
        fontSize:      '10px',
        letterSpacing: '0.3em',
        color:         drop.accent,
        margin:        0,
        position:      'relative',
      }}>
        {drop.code}
      </p>

      {/* Titolo */}
      <h2 style={{
        fontFamily:    '"Bebas Neue", var(--font-display, sans-serif)',
        fontSize:      'clamp(2.4rem, 5vw, 4rem)',
        letterSpacing: '0.18em',
        color:         'var(--white, #F5F5F0)',
        margin:        0,
        textShadow:    '0 2px 34px rgba(10,6,2,.7)',
        position:      'relative',
      }}>
        {drop.name}
      </h2>

      {/* Bottoni */}
      <div style={{
        display:   'flex',
        gap:       '16px',
        marginTop: '8px',
        position:  'relative',
      }}>
        <button
          style={{
            fontFamily:    'var(--font-mono, monospace)',
            fontSize:      '10px',
            letterSpacing: '0.22em',
            color:         drop.accent,
            border:        `1px solid ${drop.accent}`,
            background:    'transparent',
            padding:       '14px 28px',
            cursor:        'pointer',
            textTransform: 'uppercase',
            transition:    'background 0.2s ease-out, color 0.2s ease-out',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = drop.accent;
            (e.currentTarget as HTMLButtonElement).style.color      = '#080808';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color      = drop.accent;
          }}
        >
          ▶ EXPLORE THE DROP
        </button>

        <button
          style={{
            fontFamily:    'var(--font-mono, monospace)',
            fontSize:      '10px',
            letterSpacing: '0.22em',
            color:         'var(--smoke, #5A5246)',
            border:        '1px solid var(--smoke, #5A5246)',
            background:    'transparent',
            padding:       '14px 28px',
            cursor:        'pointer',
            textTransform: 'uppercase',
            transition:    'border-color 0.2s ease-out, color 0.2s ease-out',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color       = 'var(--cream, #E8D5B0)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cream, #E8D5B0)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color       = 'var(--smoke, #5A5246)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--smoke, #5A5246)';
          }}
        >
          CONTATTI
        </button>
      </div>
    </div>
  );
}
