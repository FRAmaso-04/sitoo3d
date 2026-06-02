'use client';

import { motion } from 'framer-motion';

export default function IntroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center"
      style={{
        height:     '100vh',
        background: 'var(--dark)',
        padding:    '32px',
        overflow:   'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <p className="font-mono text-smoke text-xs tracking-wide uppercase mb-4">
          AN EXPEDITION INTO THE UNKNOWN
        </p>
        <h1
          className="font-display text-off-white uppercase leading-none"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', letterSpacing: '0.1em' }}
        >
          NEVER STOP<br />EXPLORING
        </h1>
        <p className="font-jp text-cream text-xl mt-4 tracking-wide">
          探索は止まらない
        </p>
        <p className="font-mono text-smoke text-xs tracking-brand mt-6 uppercase">
          SINCE 2004
        </p>
      </motion.div>

      {/* Horizontal accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--smoke), transparent)' }}
      />
    </section>
  );
}
