'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { ProgressProvider } from '@/lib/progress-context';
import ScrollStage from '@/components/ui/ScrollStage';
import ChapterOverlay from '@/components/ui/ChapterOverlay';
import StoryPanel from '@/components/ui/StoryPanel';
import ExploreHUD from '@/components/ui/ExploreHUD';

const ExperienceScene = dynamic(
  () => import('@/components/scene/ExperienceScene'),
  { ssr: false }
);

export default function Home() {
  const [storyOpen,   setStoryOpen]   = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectDrop = useCallback((i: number) => setActiveIndex(i), []);

  return (
    <ProgressProvider>
      <main>
        <ScrollStage>
          <div className="relative w-full h-full">
            <ExperienceScene
              activeIndex={activeIndex}
              onActiveChange={handleSelectDrop}
            />
            <ChapterOverlay onHotspotClick={() => setStoryOpen(true)} />
            <ExploreHUD activeIndex={activeIndex} onSelect={handleSelectDrop} />
          </div>
        </ScrollStage>
      </main>
      <StoryPanel open={storyOpen} onClose={() => setStoryOpen(false)} />
    </ProgressProvider>
  );
}
