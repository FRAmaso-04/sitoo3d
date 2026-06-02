import dynamic from 'next/dynamic';
import { ProgressProvider } from '@/lib/progress-context';
import ScrollStage from '@/components/ui/ScrollStage';

const ExperienceScene = dynamic(
  () => import('@/components/scene/ExperienceScene'),
  { ssr: false }
);

export default function Home() {
  return (
    <ProgressProvider>
      <main>
        <ScrollStage>
          <div className="relative w-full h-full">
            <ExperienceScene />
          </div>
        </ScrollStage>
      </main>
    </ProgressProvider>
  );
}
