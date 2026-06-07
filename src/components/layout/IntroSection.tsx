'use client';

import { motion } from 'framer-motion';

export default function IntroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center"
      style={{
        height: '100vh',
        background: 'var(--dark)',
        padding: '32px',
        overflow: 'hidden',
      }}
    >
      {/* Corner brackets */}
      {(['tl','tr','bl','br'] as const).map((pos) => {
        const base: React.CSSProperties = { position: 'absolute', width: 40, height: 40 };
        const sides: Record<string, React.CSSProperties> = {
          tl: { top: 28, left: 28, borderTop: '1px solid var(--smoke)', borderLeft: '1px solid var(--smoke)' },
          tr: { top: 28, right: 28, borderTop: '1px solid var(--smoke)', borderRight: '1px solid var(--smoke)' },
          bl: { bottom: 28, left: 28, borderBottom: '1px solid var(--smoke)', borderLeft: '1px solid var(--smoke)' },
          br: { bottom: 28, right: 28, borderBottom: '1px solid var(--smoke)', borderRight: '1px solid var(--smoke)' },
        };
        return <div key={pos} style={{ ...base, ...sides[pos] }} />;
      })}

      {/* Scanlines */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.018) 2px, rgba(255,255,255,0.018) 4px)',
        }}
      />

      {/* Season badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ marginBottom: 32 }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 32, height: 1, background: 'var(--smoke)' }} />
          <span
            className="font-pixel"
            style={{ fontSize: '0.45rem', letterSpacing: '0.2em', color: 'var(--smoke)' }}
          >
            SEASON ONE · EXPEDITION SERIES
          </span>
          <div style={{ width: 32, height: 1, background: 'var(--smoke)' }} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {/* Kicker in pixel font */}
        <p
          className="font-pixel"
          style={{
            fontSize: '0.42rem',
            color: 'var(--red)',
            letterSpacing: '0.2em',
            marginBottom: 20,
          }}
        >
          AN EXPEDITION INTO THE UNKNOWN
        </p>

        {/* Main title — stays Bebas Neue, cinematic impact */}
        <h1
          className="font-display text-off-white uppercase leading-none"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            letterSpacing: '0.1em',
          }}
        >
          NEVER STOP<br />EXPLORING
        </h1>

        {/* Japanese */}
        <p className="font-jp text-cream text-xl mt-4 tracking-wide">
          探索は止まらない
        </p>

        {/* Since — pixel font */}
        <p
          className="font-pixel"
          style={{
            fontSize: '0.4rem',
            color: 'var(--smoke)',
            letterSpacing: '0.18em',
            marginTop: 24,
          }}
        >
          SINCE 2004
        </p>
      </motion.div>

      {/* Blinking press-start */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 1.2, ease: 'linear' }}
        style={{ position: 'absolute', bottom: 56 }}
      >
        <span
          className="font-pixel"
          style={{ fontSize: '0.5rem', color: 'var(--cream)', letterSpacing: '0.18em' }}
        >
          ▼ SCROLL TO EXPLORE ▼
        </span>
      </motion.div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--smoke), transparent)' }}
      />
    </section>
  );
}
