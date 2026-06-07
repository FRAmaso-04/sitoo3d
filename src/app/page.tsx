'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { ProgressProvider } from '@/lib/progress-context';
import ScrollStage  from '@/components/ui/ScrollStage';
import ArcadeHUD    from '@/components/ui/ArcadeHUD';
import CTAOverlay   from '@/components/ui/CTAOverlay';
import { PrismaHero } from '@/components/ui/prisma-hero';
import OutroSection from '@/components/layout/OutroSection';

const ExperienceScene = dynamic(
  () => import('@/components/scene/ExperienceScene'),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: 'var(--sky-top)' }}
      >
        <p style={{
          fontFamily:    'monospace',
          fontSize:      '0.7rem',
          color:         'var(--cream)',
          letterSpacing: '0.2em',
        }}>
          LOADING...
        </p>
      </div>
    ),
  }
);

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleSelect = useCallback((i: number) => setActiveIndex(i), []);

  return (
    <ProgressProvider>

      {/* INTRO — video Higgsfield, isola tra le nuvole */}
      <PrismaHero />

      {/* ESPERIENZA — scroll cinematografico 600vh, stop-motion camera */}
      <div id="scroll-stage">
        <ScrollStage>
          <div className="relative w-full h-full">

            {/* Scena 3D: SkyDome + isola + arcade + ologramma */}
            <ExperienceScene activeIndex={activeIndex} />

            {/* HUD selettore drop — appare da progress ~0.52 */}
            <ArcadeHUD activeIndex={activeIndex} onSelect={handleSelect} />

            {/* CTA finale — appare da progress ~0.88 */}
            <CTAOverlay activeIndex={activeIndex} />

          </div>
        </ScrollStage>
      </div>

      {/* OUTRO */}
      <OutroSection />

    </ProgressProvider>
  );
}
