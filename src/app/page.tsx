import { ProgressProvider } from '@/lib/progress-context';
import ScrollStage from '@/components/ui/ScrollStage';

export default function Home() {
  return (
    <ProgressProvider>
      <main>
        <ScrollStage>
          <div
            className="w-full h-full flex items-center justify-center font-display text-4xl"
            style={{ color: 'var(--cream)' }}
          >
            SCROLL STAGE PLACEHOLDER
          </div>
        </ScrollStage>
      </main>
    </ProgressProvider>
  );
}
