import { motion, AnimatePresence } from 'framer-motion';
import { X, Mountain, MapPin, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
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
          className="absolute bottom-0 left-0 right-0 z-[500] bg-white rounded-t-2xl overflow-hidden"
          style={{
            boxShadow: '0 -4px 32px rgba(0,0,0,0.12), 0 -1px 4px rgba(0,0,0,0.06)',
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0.05, bottom: 0.25 }}
          onDragEnd={(_, { offset }) => {
            if (offset.y > 80) onClose();
          }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none">
            <div className="w-9 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="px-5 pb-safe-bottom">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex-1 pr-3">
                {podrucje && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: podrucje.boja }}
                    />
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                      {podrucje.naziv}
                    </p>
                  </div>
                )}
                <h2 className="text-base font-bold text-gray-900 leading-snug">
                  {tocka.naziv}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">#{tocka.id}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {tocka.posjecen ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-100">
                    <CheckCircle2 className="w-3 h-3" />
                    Završen
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold border border-amber-100">
                    <Clock className="w-3 h-3" />
                    Aktivan
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Zatvori"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Info grid */}
            {(tocka.nadmorskaVisina || podrucje) && (
              <div className="grid grid-cols-2 gap-2.5 py-4">
                {tocka.nadmorskaVisina && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Mountain className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[11px] text-gray-400 font-medium">Visina</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {tocka.nadmorskaVisina.toLocaleString()} m n.v.
                    </p>
                  </div>
                )}
                {podrucje && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[11px] text-gray-400 font-medium">Regija</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate">{podrucje.naziv}</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {tocka.opis && (
              <p className="text-sm text-gray-500 leading-relaxed pb-4">
                {tocka.opis}
              </p>
            )}

            {/* CTA */}
            {tocka.linkVanjski && (
              <div className="pb-5">
                <a
                  href={tocka.linkVanjski}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#2E7D32] hover:bg-[#1B5E20] active:bg-[#1B5E20] text-white rounded-xl font-semibold text-sm transition-colors"
                  style={{ boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Otvori na HPO portalu
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
