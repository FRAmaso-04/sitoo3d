'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ProgressProvider } from '@/lib/progress-context';
import ScrollStage from '@/components/ui/ScrollStage';
import ChapterOverlay from '@/components/ui/ChapterOverlay';
import StoryPanel from '@/components/ui/StoryPanel';

const ExperienceScene = dynamic(
  () => import('@/components/scene/ExperienceScene'),
  { ssr: false }
);

export default function Home() {
  const [storyOpen, setStoryOpen] = useState(false);

  return (
    <ProgressProvider>
      <main>
        <ScrollStage>
          <div className="relative w-full h-full">
            <ExperienceScene />
            <ChapterOverlay onHotspotClick={() => setStoryOpen(true)} />
          </div>
        </ScrollStage>
      </main>
      <StoryPanel open={storyOpen} onClose={() => setStoryOpen(false)} />
    </ProgressProvider>
  );
}
