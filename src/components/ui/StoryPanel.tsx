'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface StoryPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function StoryPanel({ open, onClose }: StoryPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className="fixed top-0 right-0 h-full w-full max-w-md bg-dark border-l border-smoke overflow-y-auto"
          style={{ zIndex: 50, padding: '32px' }}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-smoke hover:text-cream transition-colors"
            aria-label="Close story panel"
          >
            <X size={20} />
          </button>

          <p className="font-mono text-red text-xs tracking-brand uppercase mb-4">
            THE RED PINE
          </p>
          <h3 className="font-display text-cream text-4xl leading-tight mb-6">
            A SYMBOL OF ENDURANCE
          </h3>
          <p className="font-body text-smoke text-sm leading-relaxed mb-4">
            Il pino rosso — Pinus sylvestris — cresce nelle regioni più fredde del pianeta.
            Nei paesi nordici simboleggia la resilienza: sopravvive ai venti artici, alle
            nevicate pesanti, all&apos;isolamento totale.
          </p>
          <p className="font-body text-smoke text-sm leading-relaxed mb-4">
            L&apos;artwork del drop riprende questa sagoma stilizzata: nero su rosso, silueta
            pulita, nessun dettaglio superfluo. Come un&apos;iscrizione su una pietra di confine
            — permanente, diretta.
          </p>
          <p className="font-mono text-smoke text-xs tracking-brand mt-8">
            SINCE 2004 / 探索は止まらない
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
