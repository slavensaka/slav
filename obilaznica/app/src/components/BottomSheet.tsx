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
          className="absolute bottom-0 left-0 right-0 z-[500] rounded-t-3xl"
          style={{
            background: '#0f1f35',
            border: '1px solid #1d3461',
            borderBottom: 'none',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.55)',
            maxWidth: '520px',
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
          <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing select-none">
            <div className="w-10 h-1 rounded-full" style={{ background: '#2d4a6a' }} />
          </div>

          {/* Content */}
          <div className="px-6 pt-4 pb-8">

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {tocka.posjecen ? (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                  style={{
                    background: 'rgba(34,197,94,0.15)',
                    border: '1px solid rgba(34,197,94,0.4)',
                    color: '#4ade80',
                  }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Završen
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                  style={{
                    background: 'rgba(251,191,36,0.12)',
                    border: '1px solid rgba(251,191,36,0.35)',
                    color: '#fbbf24',
                  }}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Aktivan
                </span>
              )}

              {podrucje && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#8ab0cc',
                  }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: podrucje.boja }} />
                  {podrucje.naziv}
                </span>
              )}

              {/* Close — pushed to far right */}
              <button
                onClick={onClose}
                className="ml-auto w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: '#1a3050', border: '1px solid #1d3461' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#253f60')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1a3050')}
                aria-label="Zatvori"
              >
                <X className="w-4 h-4" style={{ color: '#7a9abb' }} />
              </button>
            </div>

            {/* Title */}
            <h2
              className="text-2xl font-extrabold leading-snug mb-3"
              style={{ color: '#ffffff' }}
            >
              {tocka.naziv}
            </h2>

            {/* Meta */}
            <div
              className="flex items-center gap-3 pb-5 mb-5"
              style={{ borderBottom: '1px solid #1d3461' }}
            >
              <span className="text-sm font-mono" style={{ color: '#3d5a7a' }}>#{tocka.id}</span>
              <span className="w-1 h-1 rounded-full" style={{ background: '#1d3461' }} />
              <span className="text-sm" style={{ color: '#4a6a8a' }}>Vrh Regije</span>
            </div>

            {/* CTA */}
            {tocka.linkVanjski && (
              <a
                href={tocka.linkVanjski}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors"
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
