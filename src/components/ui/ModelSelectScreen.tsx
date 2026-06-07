'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DROPS } from '@/lib/drops';
import { useProgressRef } from '@/lib/progress-context';
import { clamp01 } from '@/lib/utils';
import EightBitButton from './8bit-button';

const WireframeGlobe = dynamic(() => import('./wireframe-dotted-globe'), { ssr: false });

interface ModelSelectScreenProps {
  activeIndex: number;
  onSelect: (i: number) => void;
}

export default function ModelSelectScreen({ activeIndex, onSelect }: ModelSelectScreenProps) {
  const progressRef = useProgressRef();
  const [factor, setFactor] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      const f = clamp01((progressRef.current - 0.88) / 0.12);
      setFactor(f);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [progressRef]);

  if (factor < 0.01) return null;

  const total = DROPS.length;
  const prev = () => onSelect((activeIndex - 1 + total) % total);
  const next = () => onSelect((activeIndex + 1) % total);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: factor, zIndex: 25 }}
    >
      {/* Dark overlay — copre la scena 3D nella sezione selezione */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(30,26,22,0.88)',
        backdropFilter: 'blur(4px)',
      }} />

      {/* Scanlines arcade */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 6px)',
      }} />

      {/* Corner brackets */}
      {(['tl','tr','bl','br'] as const).map((pos) => {
        const base: React.CSSProperties = { position: 'absolute', width: 36, height: 36 };
        const map: Record<string, React.CSSProperties> = {
          tl: { top: 24, left: 24, borderTop: '1px solid var(--smoke)', borderLeft: '1px solid var(--smoke)' },
          tr: { top: 24, right: 24, borderTop: '1px solid var(--smoke)', borderRight: '1px solid var(--smoke)' },
          bl: { bottom: 24, left: 24, borderBottom: '1px solid var(--smoke)', borderLeft: '1px solid var(--smoke)' },
          br: { bottom: 24, right: 24, borderBottom: '1px solid var(--smoke)', borderRight: '1px solid var(--smoke)' },
        };
        return <div key={pos} style={{ ...base, ...map[pos] }} />;
      })}

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 16, paddingTop: 28,
      }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(148,132,102,0.4))' }} />
        <span className="font-pixel" style={{ fontSize: '0.45rem', color: 'var(--smoke)', letterSpacing: '0.22em' }}>
          SELECT YOUR DROP
        </span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(148,132,102,0.4), transparent)' }} />
      </div>

      {/* Globe cards — centrati verticalmente */}
      <div
        className="pointer-events-auto"
        style={{
          position: 'absolute',
          top: '50%', left: 0, right: 0,
          transform: 'translateY(-55%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 32,
          padding: '0 48px',
        }}
      >
        {DROPS.map((drop, i) => {
          const isActive = i === activeIndex;
          const globeSize = isActive ? 220 : 150;
          return (
            <div
              key={drop.code}
              onClick={() => onSelect(i)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.55,
                transform: isActive ? 'scale(1)' : 'scale(0.9)',
                transition: 'all 0.4s ease-out',
              }}
            >
              {/* Globe frame */}
              <div style={{
                position: 'relative',
                padding: 2,
                border: isActive ? `1px solid ${drop.accent}` : '1px solid rgba(148,132,102,0.3)',
                transition: 'border-color 0.4s ease-out',
              }}>
                {/* Active selection indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: -1, left: -1, right: -1, bottom: -1,
                    border: `2px solid ${drop.accent}`,
                    pointerEvents: 'none',
                  }} />
                )}
                <WireframeGlobe
                  width={globeSize}
                  height={globeSize}
                  accentColor={drop.accent}
                  active={isActive}
                />
              </div>

              {/* Drop label */}
              <div style={{ textAlign: 'center' }}>
                <p className="font-pixel" style={{
                  fontSize: '0.35rem', color: 'var(--smoke)', letterSpacing: '0.18em', marginBottom: 5,
                }}>
                  {drop.code}
                </p>
                <p className="font-display uppercase" style={{
                  fontSize: isActive ? '1.4rem' : '1rem',
                  color: isActive ? drop.accent : 'rgba(221,227,192,0.5)',
                  letterSpacing: '0.08em',
                  transition: 'all 0.4s ease-out',
                }}>
                  {drop.name}
                </p>
                {isActive && (
                  <p className="font-pixel" style={{
                    fontSize: '0.32rem', color: 'var(--teal)', letterSpacing: '0.12em', marginTop: 4,
                  }}>
                    ▶ SELECTED
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom controls */}
      <div
        className="pointer-events-auto"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 40px 28px',
          background: 'linear-gradient(0deg, rgba(30,26,22,0.95) 60%, transparent)',
        }}
      >
        {/* Divider */}
        <div style={{
          height: 1, marginBottom: 18,
          background: 'linear-gradient(90deg, transparent, rgba(148,132,102,0.35) 20%, rgba(148,132,102,0.35) 80%, transparent)',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: drop stats */}
          <div>
            <p className="font-pixel" style={{ fontSize: '0.4rem', color: 'var(--smoke)', letterSpacing: '0.14em', marginBottom: 4 }}>
              {DROPS[activeIndex].code}
            </p>
            <p className="font-pixel" style={{ fontSize: '0.35rem', color: 'rgba(148,132,102,0.7)', letterSpacing: '0.1em' }}>
              LIMITED EDITION · PREMIUM COTTON
            </p>
          </div>

          {/* Center: arrows + dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={prev} style={{
              background: 'none', border: '1px solid rgba(148,132,102,0.4)',
              color: 'var(--smoke)', cursor: 'pointer', padding: '4px 8px',
            }}>
              <ChevronLeft size={14} />
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              {DROPS.map((_, i) => (
                <button key={i} onClick={() => onSelect(i)} style={{
                  width: i === activeIndex ? 24 : 7, height: 7, borderRadius: 0,
                  background: i === activeIndex ? DROPS[activeIndex].accent : 'rgba(148,132,102,0.35)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.25s ease-out',
                }} />
              ))}
            </div>
            <button onClick={next} style={{
              background: 'none', border: '1px solid rgba(148,132,102,0.4)',
              color: 'var(--smoke)', cursor: 'pointer', padding: '4px 8px',
            }}>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Right: CTA */}
          <EightBitButton>▶ EXPLORE THE DROP</EightBitButton>
        </div>
      </div>
    </div>
  );
}
