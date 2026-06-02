'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { ProgressProvider } from '@/lib/progress-context';
import ScrollStage from '@/components/ui/ScrollStage';
import ChapterOverlay from '@/components/ui/ChapterOverlay';
import StoryPanel from '@/components/ui/StoryPanel';
import ExploreHUD from '@/components/ui/ExploreHUD';
import ScrollHint from '@/components/ui/ScrollHint';
import IntroSection from '@/components/layout/IntroSection';
import OutroSection from '@/components/layout/OutroSection';

const ExperienceScene = dynamic(
  () => import('@/components/scene/ExperienceScene'),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: 'var(--dark)' }}
      >
        <p className="font-mono text-smoke text-xs tracking-brand uppercase animate-pulse">
          LOADING...
        </p>
      </div>
    ),
  }
);

export default function Home() {
  const [storyOpen,   setStoryOpen]   = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectDrop = useCallback((i: number) => setActiveIndex(i), []);

  return (
    <ProgressProvider>
      <IntroSection />

      <ScrollStage>
        <div className="relative w-full h-full">
          <ExperienceScene
            activeIndex={activeIndex}
            onActiveChange={handleSelectDrop}
          />
          <ChapterOverlay onHotspotClick={() => setStoryOpen(true)} />
          <ExploreHUD activeIndex={activeIndex} onSelect={handleSelectDrop} />
          <ScrollHint />
        </div>
      </ScrollStage>

      <OutroSection />

      <StoryPanel open={storyOpen} onClose={() => setStoryOpen(false)} />
    </ProgressProvider>
  );
}
