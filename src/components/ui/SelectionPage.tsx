'use client';

import dynamic from 'next/dynamic';
import { useRef, useCallback } from 'react';
import { DROPS } from '@/lib/drops';

// Video isola tra nuvole — Higgsfield (same as intro, no people)
const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_3DfGbyKHrWrCOlXUdGY1E3htqZx/hf_20260606_114357_4ae7e709-bae2-46bc-99f7-80c704e8cc8d.mp4';

const SelectionCanvas = dynamic(
  () => import('./SelectionCanvasInner'),
  { ssr: false, loading: () => null }
);

interface SelectionPageProps {
  activeIndex: number;
  onSelect: (i: number) => void;
  inspectSectionId?: string;
}

export default function SelectionPage({
  activeIndex,
  onSelect,
  inspectSectionId = 'scroll-stage',
}: SelectionPageProps) {
  const activeDrop = DROPS[activeIndex];

  const handlePrev = useCallback(() => {
    onSelect((activeIndex - 1 + DROPS.length) % DROPS.length);
  }, [activeIndex, onSelect]);

  const handleNext = useCallback(() => {
    onSelect((activeIndex + 1) % DROPS.length);
  }, [activeIndex, onSelect]);

  const handleInspect = useCallback(() => {
    const el = document.getElementById(inspectSectionId);
    el?.scrollIntoView({ behavior: 'smooth' });
  }, [inspectSectionId]);

  return (
    <section
      id="selection-page"
      className="relative overflow-hidden"
      style={{ height: '100vh', background: '#0A0806' }}
      aria-label="Select a drop to inspect"
    >
      {/* ── video background ────────────────────────────────── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src={VIDEO_URL}
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.88,
        }}
      />

      {/* ── grain overlay ───────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
          opacity: 0.045,
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── dark gradient bottom — readable HUD ─────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '38%',
          background: 'linear-gradient(to top, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.6) 60%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── top header ──────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', top: 32, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ height: 1, width: 80, background: 'rgba(148,132,102,0.4)' }} />
          <p
            className="font-pixel"
            style={{ fontSize: '0.38rem', color: 'var(--smoke)', letterSpacing: '0.22em' }}
          >
            SELECT YOUR DROP
          </p>
          <div style={{ height: 1, width: 80, background: 'rgba(148,132,102,0.4)' }} />
        </div>
      </div>

      {/* ── corner brackets ─────────────────────────────────── */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => {
        const base: React.CSSProperties = {
          position: 'absolute', width: 28, height: 28, zIndex: 10, pointerEvents: 'none',
        };
        const sides: Record<string, React.CSSProperties> = {
          tl: { top: 20, left: 20, borderTop: '1px solid rgba(148,132,102,0.4)', borderLeft: '1px solid rgba(148,132,102,0.4)' },
          tr: { top: 20, right: 20, borderTop: '1px solid rgba(148,132,102,0.4)', borderRight: '1px solid rgba(148,132,102,0.4)' },
          bl: { bottom: 20, left: 20, borderBottom: '1px solid rgba(148,132,102,0.4)', borderLeft: '1px solid rgba(148,132,102,0.4)' },
          br: { bottom: 20, right: 20, borderBottom: '1px solid rgba(148,132,102,0.4)', borderRight: '1px solid rgba(148,132,102,0.4)' },
        };
        return <div key={pos} aria-hidden="true" style={{ ...base, ...sides[pos] }} />;
      })}

      {/* ── 3D canvas: isole + cilindri ─────────────────────── */}
      <SelectionCanvas activeIndex={activeIndex} onSelect={onSelect} />

      {/* ── model labels in 3D space (CSS-based) ────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '22%',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            width: '88%',
            maxWidth: 900,
            textAlign: 'center',
          }}
        >
          {DROPS.map((d, i) => (
            <div
              key={d.code}
              style={{
                opacity: i === activeIndex ? 1 : 0.38,
                transition: 'opacity 0.35s ease-out',
              }}
            >
              <p
                className="font-pixel"
                style={{
                  fontSize: '0.3rem',
                  color: 'var(--smoke)',
                  letterSpacing: '0.18em',
                  marginBottom: 4,
                }}
              >
                {d.code}
              </p>
              <p
                className="font-display uppercase"
                style={{
                  fontSize: i === activeIndex ? 'clamp(1rem, 3vw, 1.8rem)' : 'clamp(0.75rem, 2vw, 1.2rem)',
                  color: i === activeIndex ? d.accent : 'var(--smoke)',
                  letterSpacing: '0.18em',
                  lineHeight: 1.1,
                  transition: 'all 0.4s ease-out',
                }}
              >
                {d.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── bottom HUD ──────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 10,
          padding: '0 32px 32px',
        }}
      >
        {/* Divider */}
        <div style={{
          width: '100%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(148,132,102,0.35), transparent)',
          marginBottom: 24,
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}>
          {/* Left: drop stats */}
          <div style={{ flex: 1 }}>
            <p className="font-pixel" style={{ fontSize: '0.3rem', color: 'var(--smoke)', letterSpacing: '0.18em', marginBottom: 6 }}>
              MATERIAL
            </p>
            <p className="font-mono" style={{ fontSize: '0.55rem', color: 'var(--cream)', letterSpacing: '0.12em' }}>
              280GSM RING-SPUN COTTON
            </p>
            <p className="font-pixel" style={{ fontSize: '0.28rem', color: 'rgba(148,132,102,0.6)', letterSpacing: '0.15em', marginTop: 4 }}>
              PRE-SHRUNK · GARMENT-DYED · DROP COLLECTION
            </p>
          </div>

          {/* Center: navigation + name */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {/* Big drop name */}
            <p
              className="font-display uppercase"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                color: activeDrop.accent,
                letterSpacing: '0.2em',
                lineHeight: 1,
              }}
            >
              {activeDrop.name}
            </p>

            {/* Navigation row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button
                onClick={handlePrev}
                aria-label="Previous drop"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(148,132,102,0.4)',
                  color: 'var(--smoke)',
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  transition: 'color 0.2s ease-out, border-color 0.2s ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--cream)';
                  e.currentTarget.style.borderColor = 'var(--cream)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--smoke)';
                  e.currentTarget.style.borderColor = 'rgba(148,132,102,0.4)';
                }}
              >
                ‹
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: 8 }}>
                {DROPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onSelect(i)}
                    aria-label={`Select drop ${i + 1}`}
                    style={{
                      width: i === activeIndex ? 20 : 8,
                      height: 4,
                      background: i === activeIndex ? activeDrop.accent : 'rgba(148,132,102,0.35)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.35s ease-out',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next drop"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(148,132,102,0.4)',
                  color: 'var(--smoke)',
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  transition: 'color 0.2s ease-out, border-color 0.2s ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--cream)';
                  e.currentTarget.style.borderColor = 'var(--cream)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--smoke)';
                  e.currentTarget.style.borderColor = 'rgba(148,132,102,0.4)';
                }}
              >
                ›
              </button>
            </div>
          </div>

          {/* Right: CTA */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleInspect}
              className="font-pixel"
              style={{
                fontSize: '0.4rem',
                padding: '14px 28px',
                background: 'transparent',
                border: `1px solid ${activeDrop.accent}`,
                color: activeDrop.accent,
                letterSpacing: '0.22em',
                cursor: 'pointer',
                transition: 'background 0.2s ease-out, color 0.2s ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = activeDrop.accent;
                e.currentTarget.style.color = '#0A0806';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = activeDrop.accent;
              }}
            >
              ▶ INSPECT DROP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
