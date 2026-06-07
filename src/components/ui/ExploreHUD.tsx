'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DROPS } from '@/lib/drops';
import { useProgressRef } from '@/lib/progress-context';
import { clamp01 } from '@/lib/utils';
import EightBitButton from './8bit-button';

interface ExploreHUDProps {
  activeIndex: number;
  onSelect: (i: number) => void;
}

const DROP_STATS = [
  { material: 'HEAVY COTTON', weight: '280 GSM', edition: 'LIMITED DROP' },
  { material: 'BRUSHED COTTON', weight: '320 GSM', edition: 'EXCLUSIVE RUN' },
  { material: 'FRENCH TERRY', weight: '260 GSM', edition: 'OPEN EDITION' },
];

const Corner = ({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const corners: Record<string, React.CSSProperties> = {
    tl: { top: 28, left: 28, borderTop: '1px solid var(--smoke)', borderLeft: '1px solid var(--smoke)' },
    tr: { top: 28, right: 28, borderTop: '1px solid var(--smoke)', borderRight: '1px solid var(--smoke)' },
    bl: { bottom: 28, left: 28, borderBottom: '1px solid var(--smoke)', borderLeft: '1px solid var(--smoke)' },
    br: { bottom: 28, right: 28, borderBottom: '1px solid var(--smoke)', borderRight: '1px solid var(--smoke)' },
  };
  return (
    <div style={{ position: 'absolute', width: 32, height: 32, ...corners[pos] }} />
  );
};

export default function ExploreHUD({ activeIndex, onSelect }: ExploreHUDProps) {
  const progressRef = useProgressRef();
  const [opacity, setOpacity] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      const factor = clamp01((progressRef.current - 0.88) / 0.12);
      setOpacity(factor);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progressRef]);

  const total = DROPS.length;
  const drop  = DROPS[activeIndex];
  const stats = DROP_STATS[activeIndex] ?? DROP_STATS[0];

  const prev = () => onSelect((activeIndex - 1 + total) % total);
  const next = () => onSelect((activeIndex + 1) % total);

  if (opacity < 0.01) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity, zIndex: 20 }}
    >
      {/* Corner brackets — colore scuro su sfondo chiaro */}
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      {/* Halation diffusa ai bordi della scena */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(248,237,216,0.18) 100%)',
      }} />

      {/* Top header */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 20, paddingTop: 32,
        }}
      >
        <div style={{ width: 48, height: 1, background: 'rgba(90,82,70,0.4)' }} />
        <span
          className="font-pixel"
          style={{ fontSize: '0.42rem', letterSpacing: '0.18em', color: 'rgba(90,82,70,0.7)' }}
        >
          COLLECTION SELECT · SINCE 2004
        </span>
        <div style={{ width: 48, height: 1, background: 'rgba(90,82,70,0.4)' }} />
      </div>

      {/* Bottom panel — frosted cream glass */}
      <div
        className="pointer-events-auto"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 40px 32px',
          background: 'linear-gradient(0deg, rgba(248,237,216,0.92) 60%, rgba(248,237,216,0) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Diffusion glow sopra il pannello */}
        <div style={{
          position: 'absolute', top: -40, left: 0, right: 0, height: 80,
          background: 'linear-gradient(0deg, rgba(255,240,210,0.4), transparent)',
          filter: 'blur(12px)',
          pointerEvents: 'none',
        }} />
        {/* Divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(90,82,70,0.3) 20%, rgba(90,82,70,0.3) 80%, transparent)',
          marginBottom: 20,
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'end',
          gap: 24,
        }}>

          {/* LEFT — drop code + stats */}
          <div>
            <p
              className="font-pixel"
              style={{ fontSize: '0.45rem', color: 'rgba(90,82,70,0.7)', letterSpacing: '0.15em', marginBottom: 10 }}
            >
              {drop.code}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['MATERIAL', stats.material],
                ['WEIGHT', stats.weight],
                ['EDITION', stats.edition],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span
                    className="font-pixel"
                    style={{ fontSize: '0.38rem', color: 'rgba(90,82,70,0.6)', letterSpacing: '0.1em', minWidth: 58 }}
                  >
                    {k}
                  </span>
                  <span style={{ width: 1, height: 8, background: 'rgba(90,82,70,0.35)', flexShrink: 0 }} />
                  <span
                    className="font-pixel"
                    style={{ fontSize: '0.38rem', color: 'var(--dark)', letterSpacing: '0.08em' }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER — drop name large + glow */}
          <div style={{ textAlign: 'center' }}>
            <h3
              className="font-display leading-none uppercase"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
                letterSpacing: '0.1em',
                color: drop.accent,
              }}
            >
              {drop.name}
            </h3>
          </div>

          {/* RIGHT — navigation + CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
            {/* Arrows + dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={prev}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(90,82,70,0.6)', padding: 2 }}
                aria-label="Previous drop"
              >
                <ChevronLeft size={18} />
              </button>

              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {DROPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onSelect(i)}
                    aria-label={`Select drop ${i + 1}`}
                    style={{
                      width: i === activeIndex ? 22 : 7,
                      height: 7,
                      borderRadius: 0,
                      background: i === activeIndex ? drop.accent : 'rgba(90,82,70,0.4)',
                      boxShadow: i === activeIndex ? `0 0 14px ${drop.accent}80` : 'none',
                      transition: 'all 0.25s ease-out',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(90,82,70,0.6)', padding: 2 }}
                aria-label="Next drop"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* CTA */}
            <EightBitButton>
              ▶ EXPLORE THE DROP
            </EightBitButton>
          </div>
        </div>
      </div>
    </div>
  );
}
