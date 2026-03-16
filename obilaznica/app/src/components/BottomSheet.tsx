import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, MapPin, CheckCircle2, Hash } from 'lucide-react';
import type { KontrolnaTocka, Podrucje } from '../types';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:          '#0d1b2a',
  card:        '#112240',
  border:      '#1d3461',
  textPrimary: '#ffffff',
  textSecond:  '#a8c4de',
  textMuted:   '#5a7fa8',
  btnPrimary:  '#1e4976',
  btnHover:    '#1a5a96',
} as const;

// ─── Props ────────────────────────────────────────────────────────────────────
interface BottomSheetProps {
  tocka: KontrolnaTocka | null;
  podrucje?: Podrucje;
  onClose: () => void;
  onZoomToPodrucje?: (id: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function BottomSheet({ tocka, podrucje, onClose, onZoomToPodrucje }: BottomSheetProps) {

  // ESC closes
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);
  useEffect(() => {
    if (!tocka) return;
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [tocka, onKey]);

  const visited = tocka?.posjecen ?? false;

  return (
    <AnimatePresence>
      {tocka && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 999,
              background: 'rgba(0,0,0,0.45)',
            }}
          />

          {/*
            ── FLOATING CARD ──────────────────────────────────────────────────
            Pozicionirano: 16px od dna, 16px od lijevog i desnog ruba.
            Sve inline — nema ovisnosti o Tailwind skeneru.
          */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,       // 16px od dna
              left: 16,         // 16px od lijevog ruba
              right: 16,        // 16px od desnog ruba
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={tocka?.naziv}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{ opacity: 0,    y: 16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 38 }}
              style={{
                pointerEvents: 'auto',
                width: '100%',
                maxWidth: 440,        // cap na desktopu
                borderRadius: 20,     // svi kutovi zaobljeni (lebdi!)
                background: C.bg,
                border: `1px solid ${C.border}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
              {/* ── flex-col: header / content / footer ── */}
              <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflow: 'hidden' }}>

                {/* ════ HEADER ═══════════════════════════════════════════ */}
                <div style={{ flexShrink: 0, padding: '16px 20px 12px' }}>

                  {/* Region chip + close in one row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>

                    {/* Left: region chip */}
                    {podrucje && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px', borderRadius: 99,
                        background: C.card, border: `1px solid ${C.border}`,
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: podrucje.boja, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMuted }}>
                          {podrucje.naziv}
                        </span>
                      </div>
                    )}

                    {/* Close button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onClose(); }}
                      aria-label="Zatvori"
                      style={{
                        flexShrink: 0, width: 32, height: 32, borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: C.card, border: `1px solid ${C.border}`, cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = C.card)}
                    >
                      <X size={14} color={C.textMuted} />
                    </button>
                  </div>

                  {/* Peak name */}
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
                    {tocka.naziv}
                  </h2>

                  {/* Subtitle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Hash size={13} color={C.textMuted} />
                    <span style={{ fontFamily: 'monospace', fontSize: 14, color: C.textSecond }}>{tocka.id}</span>
                    <span style={{ color: C.border, fontSize: 14 }}>•</span>
                    <span style={{ fontSize: 14, color: C.textMuted }}>Vrh Regije</span>
                  </div>

                  {/* Regija ispod subtitle-a */}
                  {podrucje && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: podrucje.boja, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.textSecond, fontWeight: 500 }}>{podrucje.naziv}</span>
                    </div>
                  )}

                  {/* Posjećen badge */}
                  {visited && (
                    <div style={{ marginTop: 10 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.07em', textTransform: 'uppercase',
                        background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', color: '#4ade80',
                      }}>
                        <CheckCircle2 size={12} />
                        Posjećen
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: C.border, margin: '0 20px' }} />

                {/* ════ FOOTER — buttons ══════════════════════════════════ */}
                <div style={{ flexShrink: 0, padding: '14px 20px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* Primary */}
                  {tocka.linkVanjski && (
                    <a
                      href={tocka.linkVanjski}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px 16px', borderRadius: 12,
                        background: C.btnPrimary, border: '1px solid #1e5a96',
                        color: C.textPrimary, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = C.btnHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = C.btnPrimary)}
                    >
                      <ExternalLink size={15} />
                      Posjeti HPO portal
                    </a>
                  )}

                  {/* Secondary: 2 cols */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {podrucje && onZoomToPodrucje ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onZoomToPodrucje(podrucje.id); onClose(); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          padding: '10px 12px', borderRadius: 12,
                          background: C.card, border: `1px solid ${C.border}`,
                          color: C.textSecond, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = C.card)}
                      >
                        <MapPin size={14} />
                        Regija
                      </button>
                    ) : <div />}

                    <button
                      onClick={(e) => { e.stopPropagation(); onClose(); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '10px 12px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
                        color: C.textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    >
                      <X size={14} />
                      Zatvori
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
