'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = '', showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : '0.25em' }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

const PrismaHero = () => {
  return (
    <section className="h-screen w-full">
      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: '0' }}>

        {/* Video isola volante generato con Higgsfield */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_3DfGbyKHrWrCOlXUdGY1E3htqZx/hf_20260606_114357_4ae7e709-bae2-46bc-99f7-80c704e8cc8d.mp4"
        />

        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: '128px 128px',
            opacity: 0.05,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Gradient overlay — leggero per non coprire il cielo */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(52,52,52,0.15) 0%, transparent 40%, rgba(52,52,52,0.55) 100%)',
          }}
        />

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(52,52,52,0.7)', backdropFilter: 'blur(8px)',
            padding: '8px 24px',
          }}
        >
          <div style={{ width: 24, height: 1, background: 'var(--smoke)' }} />
          <span
            className="font-pixel"
            style={{ fontSize: '0.4rem', letterSpacing: '0.2em', color: 'var(--cream)' }}
          >
            SEASON ONE · EXPEDITION SERIES
          </span>
          <div style={{ width: 24, height: 1, background: 'var(--smoke)' }} />
        </motion.div>

        {/* Corner brackets */}
        {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => {
          const base: React.CSSProperties = { position: 'absolute', width: 36, height: 36 };
          const sides: Record<string, React.CSSProperties> = {
            tl: { top: 24, left: 24, borderTop: '1px solid rgba(221,227,192,0.5)', borderLeft: '1px solid rgba(221,227,192,0.5)' },
            tr: { top: 24, right: 24, borderTop: '1px solid rgba(221,227,192,0.5)', borderRight: '1px solid rgba(221,227,192,0.5)' },
            bl: { bottom: 24, left: 24, borderBottom: '1px solid rgba(221,227,192,0.5)', borderLeft: '1px solid rgba(221,227,192,0.5)' },
            br: { bottom: 24, right: 24, borderBottom: '1px solid rgba(221,227,192,0.5)', borderRight: '1px solid rgba(221,227,192,0.5)' },
          };
          return <div key={pos} style={{ ...base, ...sides[pos] }} />;
        })}

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: '0 40px 16px' }}>
          <div className="grid grid-cols-12 items-end gap-4">

            {/* Title */}
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-display leading-none uppercase"
                style={{
                  fontSize: 'clamp(4rem, 18vw, 18rem)',
                  letterSpacing: '-0.02em',
                  color: 'var(--cream)',
                  lineHeight: 0.85,
                }}
              >
                <WordsPullUp text="NEVER STOP" />
              </h1>
            </div>

            {/* Description + CTA */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5" style={{ paddingBottom: 32 }}>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: '0.8rem',
                  lineHeight: 1.6,
                  color: 'rgba(235,217,182,0.8)',
                  letterSpacing: '0.04em',
                }}
              >
                An expedition into the unknown.<br />
                Heavy cotton, heavy intentions.<br />
                <span style={{ color: 'var(--teal)', fontFamily: 'var(--font-jp)' }}>探索は止まらない</span>
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="font-pixel"
                  style={{
                    fontSize: '0.38rem',
                    color: 'var(--red)',
                    letterSpacing: '0.18em',
                    display: 'block',
                    marginBottom: 12,
                  }}
                >
                  SINCE 2004
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Blinking scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 1.5, ease: 'linear' }}
          style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}
        >
          <span
            className="font-pixel"
            style={{ fontSize: '0.42rem', color: 'rgba(221,227,192,0.7)', letterSpacing: '0.2em' }}
          >
            ▼ SCROLL TO EXPLORE ▼
          </span>
        </motion.div>

      </div>
    </section>
  );
};

export { PrismaHero };
