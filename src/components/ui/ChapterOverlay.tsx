'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgressRef } from '@/lib/progress-context';
import EightBitButton from './8bit-button';

interface Chapter {
  id: number;
  start: number;
  end: number;
  position: string;
  kicker: string;
  title: string;
  body?: string;
  jp?: string;
  hasHotspot?: boolean;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1, start: 0.00, end: 0.22,
    position: 'top-8 left-8',
    kicker: '61°38\'21"N  12°41\'21"E',
    title: 'NEVER STOP EXPLORING',
    jp: '探索は止まらない',
  },
  {
    id: 2, start: 0.28, end: 0.48,
    position: 'bottom-8 right-8',
    kicker: 'MATERIAL 001',
    title: 'HEAVYWEIGHT COTTON',
    body: '280gsm ring-spun · pre-shrunk · garment-dyed',
  },
  {
    id: 3, start: 0.54, end: 0.72,
    position: 'bottom-8 left-8',
    kicker: 'THE BACK / 背面',
    title: 'THE RED PINE',
    body: 'Ogni punto racconta l\'esplorazione.',
    hasHotspot: true,
  },
  {
    id: 4, start: 0.80, end: 0.92,
    position: 'top-8 left-1/2 -translate-x-1/2',
    kicker: 'DROP COLLECTION',
    title: 'SINCE 2004',
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ChapterOverlayProps {
  onHotspotClick?: () => void;
}

export default function ChapterOverlay({ onHotspotClick }: ChapterOverlayProps) {
  const progressRef = useProgressRef();
  const [activeId, setActiveId] = useState<number | null>(1);
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      const p      = progressRef.current;
      const active = CHAPTERS.find((c) => p >= c.start && p <= c.end);
      const newId  = active?.id ?? null;
      setActiveId((prev) => (prev !== newId ? newId : prev));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [progressRef]);

  const chapter = CHAPTERS.find((c) => c.id === activeId) ?? null;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      <AnimatePresence mode="wait">
        {chapter && (
          <motion.div
            key={chapter.id}
            className={`absolute ${chapter.position} w-[calc(100%-2rem)] sm:max-w-sm pointer-events-auto`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{ padding: '32px' }}
          >
            {/* Chapter index in pixel font */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span
                className="font-pixel"
                style={{ fontSize: '0.38rem', color: 'var(--smoke)', letterSpacing: '0.15em' }}
              >
                {String(chapter.id).padStart(2, '0')} /
              </span>
              {/* Kicker — pixel font, red */}
              <p
                className="font-pixel"
                style={{
                  fontSize: '0.38rem',
                  color: 'var(--red)',
                  letterSpacing: '0.15em',
                }}
              >
                {chapter.kicker}
              </p>
            </div>

            {/* Title — stays Bebas Neue */}
            <h2
              className="font-display leading-none tracking-brand uppercase"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: 'var(--dark)',
              }}
            >
              {chapter.title}
            </h2>

            {chapter.jp && (
              <p
                className="font-jp text-lg mt-2 tracking-wide"
                style={{ color: 'var(--smoke)' }}
              >
                {chapter.jp}
              </p>
            )}

            {chapter.body && (
              <p
                className="font-pixel mt-3"
                style={{
                  fontSize: '0.38rem',
                  color: 'rgba(90,82,70,0.85)',
                  letterSpacing: '0.08em',
                  lineHeight: 1.9,
                }}
              >
                {chapter.body}
              </p>
            )}

            {chapter.hasHotspot && (
              <div style={{ marginTop: 16 }}>
                <EightBitButton variant="outline" onClick={onHotspotClick}>
                  VIEW STORY →
                </EightBitButton>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
