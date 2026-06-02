'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressRef } from '@/lib/progress-context';

export default function ScrollHint() {
  const progressRef = useProgressRef();
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      setVisible(progressRef.current < 0.04);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [progressRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 20 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-smoke text-xs tracking-brand uppercase">
            SCROLL TO EXPLORE
          </p>
          <motion.div
            className="w-px bg-smoke"
            style={{ height: 32 }}
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
