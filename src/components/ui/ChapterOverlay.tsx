'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgressRef } from '@/lib/progress-context';

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
    body: '280gsm ring-spun cotton · pre-shrunk · garment-dyed',
  },
  {
    id: 3, start: 0.54, end: 0.72,
    position: 'bottom-8 left-8',
    kicker: 'THE BACK / 背面',
    title: 'THE RED PINE',
    body: 'Un punto cliccabile sulla grafica apre la storia del brand.',
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
      setActiveId(active?.id ?? null);
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
            className={`absolute ${chapter.position} max-w-sm pointer-events-auto`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{ padding: '32px' }}
          >
            <p
              className="font-mono text-red tracking-brand text-xs uppercase mb-2"
              style={{ textShadow: '0 2px 34px rgba(10,6,2,.6)' }}
            >
              {chapter.kicker}
            </p>
            <h2
              className="font-display text-off-white text-5xl leading-none tracking-brand uppercase"
              style={{ textShadow: '0 2px 34px rgba(10,6,2,.6)' }}
            >
              {chapter.title}
            </h2>
            {chapter.jp && (
              <p
                className="font-jp text-cream text-lg mt-2 tracking-wide"
                style={{ textShadow: '0 2px 34px rgba(10,6,2,.6)' }}
              >
                {chapter.jp}
              </p>
            )}
            {chapter.body && (
              <p
                className="font-body text-smoke text-sm mt-3 leading-relaxed"
                style={{ textShadow: '0 2px 34px rgba(10,6,2,.6)' }}
              >
                {chapter.body}
              </p>
            )}
            {chapter.hasHotspot && (
              <button
                onClick={onHotspotClick}
                className="mt-4 border border-red text-red font-mono text-xs tracking-brand px-4 py-2 uppercase hover:bg-red hover:text-white transition-colors"
                style={{ borderRadius: '2px' }}
              >
                VIEW STORY →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
