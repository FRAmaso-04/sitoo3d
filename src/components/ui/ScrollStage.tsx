'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProgressRef } from '@/lib/progress-context';

gsap.registerPlugin(ScrollTrigger);

interface ScrollStageProps {
  children: React.ReactNode;
  heightVh?: number;
}

export default function ScrollStage({ children, heightVh = 4 }: ScrollStageProps) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const progressRef = useProgressRef();

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useGSAP(() => {
    if (!wrapperRef.current || !stickyRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:  wrapperRef.current,
        start:    'top top',
        end:      'bottom bottom',
        pin:      stickyRef.current,
        scrub:    prefersReduced ? true : 0.5,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      },
    });

    tl.to({}, { duration: 1 });

    return () => tl.scrollTrigger?.kill();
  }, { scope: wrapperRef });

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${heightVh * 100}vh` }}
    >
      <div
        ref={stickyRef}
        style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
      >
        {children}
      </div>
    </div>
  );
}
