import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2 } from 'lucide-react';
import type { KontrolnaTocka, Podrucje } from '../types';

interface BottomSheetProps {
  tocka: KontrolnaTocka | null;
  podrucje?: Podrucje;
  onClose: () => void;
  onZoomToPodrucje?: (id: number) => void;
}

export function BottomSheet({ tocka, podrucje, onClose, onZoomToPodrucje }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {tocka && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[500] rounded-t-3xl"
          style={{
            background: 'rgba(8, 18, 35, 0.32)',
            backdropFilter: 'blur(32px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
            border: '1px solid rgba(140, 190, 240, 0.22)',
            borderBottom: 'none',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
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

            {/* Close — absolute top-right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(100,160,220,0.2)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              aria-label="Zatvori"
            >
              <X className="w-4 h-4" style={{ color: '#7a9abb' }} />
            </button>

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap mb-5 pr-12">
              {tocka.posjecen && (
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
              )}

              {podrucje && (
                <button
                  onClick={() => onZoomToPodrucje?.(podrucje.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#ffffff',
                    cursor: onZoomToPodrucje ? 'pointer' : 'default',
                  }}
                  title={`Zumira na ${podrucje.naziv}`}
                  onMouseEnter={(e) => { if (onZoomToPodrucje) e.currentTarget.style.background = 'rgba(0,0,0,0.45)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: podrucje.boja }} />
                  {podrucje.naziv}
                </button>
              )}
            </div>

            {/* Title */}
            <h2
              className="text-2xl font-extrabold leading-snug mb-3"
              style={{ color: '#ffffff', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
            >
              {tocka.naziv}
            </h2>

            {/* Meta */}
            <div
              className="flex items-center gap-3 pb-5 mb-5"
              style={{ borderBottom: '1px solid rgba(100,160,220,0.15)' }}
            >
              <span className="text-sm font-mono" style={{ color: '#8ab8d8', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>#{tocka.id}</span>
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(140,190,240,0.3)' }} />
              <span className="text-sm" style={{ color: '#ffffff', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>Vrh Regije</span>
            </div>

            {/* CTA */}
            {tocka.linkVanjski && (
              <a
                href={tocka.linkVanjski}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(100,160,220,0.25)',
                  color: '#c8ddf0',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
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
