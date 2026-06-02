'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DROPS } from '@/lib/drops';
import { useProgressRef } from '@/lib/progress-context';
import { clamp01 } from '@/lib/utils';

interface ExploreHUDProps {
  activeIndex: number;
  onSelect: (i: number) => void;
}

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

  const prev = () => onSelect((activeIndex - 1 + total) % total);
  const next = () => onSelect((activeIndex + 1) % total);

  if (opacity < 0.01) return null;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3"
      style={{ padding: '32px', zIndex: 20, opacity }}
    >
      {/* Drop info */}
      <div className="text-center">
        <p
          className="font-mono text-xs tracking-brand uppercase"
          style={{ color: 'var(--smoke)', textShadow: '0 2px 34px rgba(10,6,2,.6)' }}
        >
          {drop.code}
        </p>
        <h3
          className="font-display text-4xl leading-none tracking-brand uppercase"
          style={{ color: drop.accent, textShadow: '0 2px 34px rgba(10,6,2,.6)' }}
        >
          {drop.name}
        </h3>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <button
          onClick={prev}
          className="text-smoke hover:text-cream transition-colors"
          aria-label="Previous drop"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex gap-2 items-center">
          {DROPS.map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              aria-label={`Select drop ${i + 1}`}
              style={{
                width:        i === activeIndex ? 18 : 6,
                height:       6,
                borderRadius: '2px',
                background:   i === activeIndex ? 'var(--red)' : 'var(--smoke)',
                transition:   'width 0.2s ease-out, background 0.2s ease-out',
                border:       'none',
                cursor:       'pointer',
                padding:      0,
                display:      'block',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="text-smoke hover:text-cream transition-colors"
          aria-label="Next drop"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* CTA */}
      <button
        className="font-mono text-xs tracking-brand uppercase px-8 py-3 border border-red text-red hover:bg-red hover:text-white transition-colors"
        style={{ borderRadius: '2px', marginTop: '8px' }}
      >
        EXPLORE THE DROP
      </button>
    </div>
  );
}
