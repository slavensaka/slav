import { useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import { motion, useMotionValue, animate, useDragControls, type PanInfo } from 'framer-motion';
import { Sidebar } from './Sidebar';

type SidebarSheetProps = Omit<ComponentProps<typeof Sidebar>, 'variant'> & {
  /** Kad se otvori kartica detalja vrha, sheet padne u peek da se ne sudaraju. */
  detailOpen: boolean;
};

const SHEET_VH = 0.92;   // visina sheeta u odnosu na viewport
const PEEK_PX = 132;     // koliko sheeta viri u peek stanju

const SNAP_SPRING = { type: 'spring' as const, stiffness: 420, damping: 42 };

export function SidebarSheet({ detailOpen, ...sidebarProps }: SidebarSheetProps) {
  const [vh, setVh] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 800));
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const didInit = useRef(false);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Snap pozicije (translateY): 0 = puno otvoreno, veći broj = više spušteno.
  const snaps = useMemo(() => {
    const H = SHEET_VH * vh;
    return {
      full: 0,
      half: Math.max(0, H - 0.5 * vh),
      peek: Math.max(0, H - PEEK_PX),
    };
  }, [vh]);

  const snapTo = (target: number) => {
    animate(y, target, SNAP_SPRING);
  };

  // Početno stanje = peek
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    y.set(snaps.peek);
  }, [snaps.peek, y]);

  // Kad se otvori detalj vrha → spusti u peek
  useEffect(() => {
    if (detailOpen) snapTo(snaps.peek);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailOpen]);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // projekcija po brzini — brz flick "prebaci" u sljedeći snap
    const projected = y.get() + info.velocity.y * 0.18;
    const candidates = [snaps.full, snaps.half, snaps.peek];
    let nearest = candidates[0];
    for (const c of candidates) {
      if (Math.abs(c - projected) < Math.abs(nearest - projected)) nearest = c;
    }
    snapTo(nearest);
  };

  // Tap na hvataljku: peek → half → full → peek
  const handleTap = () => {
    const cur = y.get();
    const order = [snaps.peek, snaps.half, snaps.full];
    // nađi najbliži trenutni indeks
    let idx = 0;
    let best = Infinity;
    order.forEach((v, i) => {
      const d = Math.abs(v - cur);
      if (d < best) { best = d; idx = i; }
    });
    const next = order[(idx + 1) % order.length];
    snapTo(next);
  };

  return (
    <motion.div
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: snaps.full, bottom: snaps.peek }}
      dragElastic={0.045}
      onDragEnd={handleDragEnd}
      style={{
        y,
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: `${SHEET_VH * 100}vh`,
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        background: '#0d1b2a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: '0 -8px 32px rgba(0,0,0,0.55)',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* ── Hvataljka — jedini drag okidač + tap za expand ── */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        onClick={handleTap}
        className="flex-shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ height: 26, touchAction: 'none' }}
        role="button"
        aria-label="Povuci ili tapni za otvaranje liste"
      >
        <div style={{ width: 40, height: 5, borderRadius: 99, background: '#2d5480' }} />
      </div>

      {/* ── Sadržaj ── */}
      <div className="flex-1 min-h-0">
        <Sidebar {...sidebarProps} variant="sheet" />
      </div>
    </motion.div>
  );
}
