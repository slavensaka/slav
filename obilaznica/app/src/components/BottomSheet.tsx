import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import type { KontrolnaTocka, Podrucje } from '../types';

interface BottomSheetProps {
  tocka: KontrolnaTocka | null;
  podrucje?: Podrucje;
  onClose: () => void;
}

export function BottomSheet({ tocka, podrucje, onClose }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {tocka && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[500] rounded-t-3xl overflow-hidden"
          style={{
            background: '#0f1f35',
            border: '1px solid #1d3461',
            borderBottom: 'none',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.55)',
            /* On desktop, limit width so it doesn't span full map */
            maxWidth: '480px',
            margin: '0 auto',
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0.05, bottom: 0.25 }}
          onDragEnd={(_, { offset }) => { if (offset.y > 80) onClose(); }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing select-none">
            <div className="w-10 h-1 rounded-full" style={{ background: '#2d4a6a' }} />
          </div>

          <div className="px-6 pt-3 pb-7">

            {/* Row 1 — badges + close */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status badge */}
                {tocka.posjecen ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{
                      background: 'rgba(34,197,94,0.15)',
                      border: '1px solid rgba(34,197,94,0.4)',
                      color: '#4ade80',
                    }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Završen
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{
                      background: 'rgba(251,191,36,0.12)',
                      border: '1px solid rgba(251,191,36,0.35)',
                      color: '#fbbf24',
                    }}
                  >
                    <Clock className="w-3 h-3" />
                    Aktivan
                  </span>
                )}

                {/* Region badge */}
                {podrucje && (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#8ab0cc',
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: podrucje.boja }}
                    />
                    {podrucje.naziv}
                  </span>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: '#1a3050', border: '1px solid #1d3461' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#253f60')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1a3050')}
                aria-label="Zatvori"
              >
                <X className="w-4 h-4" style={{ color: '#7a9abb' }} />
              </button>
            </div>

            {/* Row 2 — title */}
            <h2
              className="text-2xl font-extrabold leading-tight mb-3"
              style={{ color: '#ffffff' }}
            >
              {tocka.naziv}
            </h2>

            {/* Row 3 — meta */}
            <p className="text-sm mb-6" style={{ color: '#5a7fa8' }}>
              <span className="font-mono" style={{ color: '#4a6a8a' }}>ID: #{tocka.id}</span>
              <span className="mx-2" style={{ color: '#1d3461' }}>·</span>
              Kategorija: Vrh Regije
            </p>

            {/* CTA */}
            {tocka.linkVanjski && (
              <a
                href={tocka.linkVanjski}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  background: '#112240',
                  border: '1px solid #1d3461',
                  color: '#a8c4de',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1a3050')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#112240')}
              >
                <ExternalLink className="w-4 h-4" />
                Posjeti HPO portal
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
