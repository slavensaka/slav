import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Check, CheckCircle2, Circle, Layers, BarChart3, Info, Trophy, Mountain, MousePointerClick } from 'lucide-react';
import type { KontrolnaTocka, Podrucje } from '../types';
import { podrucja } from '../data/podrucja';

interface SidebarProps {
  allTocke: KontrolnaTocka[];
  filteredTocke: KontrolnaTocka[];
  selectedPodrucje: number | null;
  onPodrucjeSelect: (id: number | null) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterPosjecen: 'svi' | 'posjeceni' | 'neposjeceni';
  onFilterPosjecenChange: (filter: 'svi' | 'posjeceni' | 'neposjeceni') => void;
  onTockaSelect: (tocka: KontrolnaTocka) => void;
  onToggleTocka: (id: string) => void;
  onZoomToPodrucje?: (id: number) => void;
  selectedTocka: KontrolnaTocka | null;
  onClose: () => void;
  /** 'panel' = desktop lijevi stupac; 'sheet' = mobilni bottom sheet (handle iznad renderira wrapper) */
  variant?: 'panel' | 'sheet';
}

const DISPLAY_FONT = "'Bricolage Grotesque', 'Inter', sans-serif";

const FILTER_OPTIONS = [
  { value: 'neposjeceni' as const, label: 'Neposjećeni', Icon: Circle },
  { value: 'posjeceni' as const, label: 'Posjećeni', Icon: CheckCircle2 },
  { value: 'svi' as const, label: 'Sve', Icon: Layers },
] as const;

const ACCORDION_SPRING = { type: 'spring' as const, stiffness: 380, damping: 32 };
const PILL_SPRING = { type: 'spring' as const, stiffness: 480, damping: 40 };

export function Sidebar({
  allTocke,
  filteredTocke,
  selectedPodrucje,
  onPodrucjeSelect,
  searchTerm,
  onSearchChange,
  filterPosjecen,
  onFilterPosjecenChange,
  onTockaSelect,
  onToggleTocka,
  onZoomToPodrucje,
  selectedTocka,
  onClose,
  variant = 'panel',
}: SidebarProps) {
  const [expandedPodrucja, setExpandedPodrucja] = useState<number[]>([]);
  const [activeModal, setActiveModal] = useState<'stats' | 'guide' | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isSheet = variant === 'sheet';

  const tockeByPodrucje = useMemo(() => {
    const grouped: Record<number, KontrolnaTocka[]> = {};
    allTocke.forEach((kt) => {
      const pid = kt.podrucjeId || 0;
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(kt);
    });
    return grouped;
  }, [allTocke]);

  const filteredTockeByPodrucje = useMemo(() => {
    const grouped: Record<number, KontrolnaTocka[]> = {};
    filteredTocke.forEach((kt) => {
      const pid = kt.podrucjeId || 0;
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(kt);
    });
    return grouped;
  }, [filteredTocke]);

  const togglePodrucje = (id: number) => {
    const isExpanding = !expandedPodrucja.includes(id);
    setExpandedPodrucja((prev) =>
      isExpanding ? [...prev, id] : prev.filter((p) => p !== id),
    );
    if (isExpanding) onZoomToPodrucje?.(id);
  };

  const getPodrucjeStats = (p: Podrucje) => {
    const tocke = tockeByPodrucje[p.id] || [];
    const visited = tocke.filter((t) => t.posjecen).length;
    return {
      total: tocke.length,
      visited,
      unvisited: tocke.length - visited,
      percentage: tocke.length > 0 ? (visited / tocke.length) * 100 : 0,
    };
  };

  const totalStats = useMemo(() => {
    const visited = allTocke.filter((t) => t.posjecen).length;
    return {
      total: allTocke.length,
      visited,
      unvisited: allTocke.length - visited,
      percentage: (visited / allTocke.length) * 100,
    };
  }, [allTocke]);

  const filteredPodrucja = useMemo(
    () => podrucja.filter((p) => (filteredTockeByPodrucje[p.id]?.length ?? 0) > 0),
    [filteredTockeByPodrucje],
  );

  const filterCounts: Record<'svi' | 'neposjeceni' | 'posjeceni', number> = {
    svi: totalStats.total,
    neposjeceni: totalStats.unvisited,
    posjeceni: totalStats.visited,
  };

  // ── Auto-scroll & auto-expand when peak selected from map ──────────────
  useEffect(() => {
    if (!selectedTocka || !listRef.current) return;
    const pid = selectedTocka.podrucjeId || 0;
    if (pid && !expandedPodrucja.includes(pid)) {
      setExpandedPodrucja((prev) => [...prev, pid]);
    }
    const timer = setTimeout(() => {
      const el = listRef.current?.querySelector(`[data-tocka-id="${selectedTocka.id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 280);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTocka?.id]);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: 'radial-gradient(120% 60% at 50% 0%, #10233a 0%, #0d1b2a 55%)',
        borderRight: isSheet ? 'none' : '1px solid #1d3461',
      }}
    >

      {/* ── Header ─────────────────────────────────────── */}
      <div className={`px-5 ${isSheet ? 'pt-2 pb-4' : 'pt-6 pb-5'} flex-shrink-0`}>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h1
              className="text-[22px] font-extrabold leading-none tracking-tight truncate"
              style={{ color: '#ffffff', fontFamily: DISPLAY_FONT }}
            >
              Obilaznica
            </h1>
            <p className="text-[11px] font-medium mt-1.5 tracking-wide" style={{ color: '#5a7fa8' }}>
              HPO · {totalStats.visited} od {totalStats.total} vrhova
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-[26px] font-extrabold leading-none tabular-nums"
              style={{ color: '#4ade80', fontFamily: DISPLAY_FONT }}
            >
              {totalStats.percentage.toFixed(0)}
              <span className="text-base align-top" style={{ color: '#2f6f45' }}>%</span>
            </span>
            {!isSheet && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d3461' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                aria-label="Zatvori"
              >
                <X className="w-4 h-4" style={{ color: '#7a9abb' }} />
              </button>
            )}
          </div>
        </div>

        {/* Progres traka */}
        <div className="h-1 rounded-full overflow-hidden mt-3.5" style={{ background: '#132743' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalStats.percentage}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 18 }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #16a34a, #4ade80)', boxShadow: '0 0 8px rgba(74,222,128,0.35)' }}
          />
        </div>
      </div>

      {/* ── Segmentirani filter — sliding pill ── */}
      <div className="px-5 pb-4 flex-shrink-0">
        <div
          className="relative flex p-1 rounded-2xl"
          style={{ background: '#0a1626', border: '1px solid #16294a', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)' }}
        >
          {FILTER_OPTIONS.map(({ value, label, Icon }) => {
            const isActive = filterPosjecen === value;
            return (
              <button
                key={value}
                onClick={() => onFilterPosjecenChange(value)}
                className="relative flex-1 flex flex-col items-center justify-center gap-1 rounded-xl select-none"
                style={{ minHeight: 58 }}
                aria-pressed={isActive}
                title={label}
              >
                {isActive && (
                  <motion.div
                    layoutId={`segpill-${variant}`}
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                      boxShadow: '0 4px 14px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
                    }}
                    transition={PILL_SPRING}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <Icon className="w-3 h-3" style={{ color: isActive ? 'rgba(3,20,10,0.85)' : '#4a7099' }} />
                  <span
                    className="text-[9px] uppercase tracking-widest font-bold leading-none"
                    style={{ color: isActive ? 'rgba(3,20,10,0.85)' : '#4a7099' }}
                  >
                    {label}
                  </span>
                </span>
                <span
                  className="relative z-10 text-xl font-extrabold leading-none tabular-nums"
                  style={{ color: isActive ? '#ffffff' : '#7aa6d0', fontFamily: DISPLAY_FONT }}
                >
                  {filterCounts[value]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search ────────────────────────────────────── */}
      <div className="px-5 pb-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#3f6289' }} />
          <input
            type="text"
            placeholder="Pretraži vrhove ili regije…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm transition-all focus:outline-none"
            style={{ background: '#0f2038', border: '1px solid #1d3461', color: '#ffffff' }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1px solid rgba(74,222,128,0.5)';
              e.currentTarget.style.background = '#12294a';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid #1d3461';
              e.currentTarget.style.background = '#0f2038';
            }}
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#1d3461' }}
              >
                <X className="w-3 h-3" style={{ color: '#8ab0cc' }} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Active region chip */}
        <AnimatePresence>
          {selectedPodrucje !== null && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              transition={ACCORDION_SPRING}
              className="mt-2 overflow-hidden"
            >
              <button
                onClick={() => onPodrucjeSelect(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
              >
                <X className="w-3 h-3" />
                {podrucja.find((p) => p.id === selectedPodrucje)?.naziv}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── List ──────────────────────────────────────── */}
      <div ref={listRef} className="flex-1 overflow-y-auto min-h-0 px-4 pb-4">
        {searchTerm ? (
          /* ── Search results ── */
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider px-1 pb-1" style={{ color: '#3f6289' }}>
              {filteredTocke.length} {filteredTocke.length === 1 ? 'rezultat' : 'rezultata'}
            </p>
            <AnimatePresence mode="popLayout">
              {filteredTocke.map((tocka, idx) => {
                const p = podrucja.find((p) => p.id === tocka.podrucjeId);
                const isSelected = selectedTocka?.id === tocka.id;
                return (
                  <motion.div
                    key={tocka.id}
                    data-tocka-id={tocka.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: idx * 0.012, type: 'spring', stiffness: 400, damping: 30 }}
                    onClick={() => onTockaSelect(tocka)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                    style={{
                      background: isSelected ? 'rgba(34,197,94,0.14)' : '#0f2038',
                      border: `1px solid ${isSelected ? 'rgba(34,197,94,0.4)' : '#1a3155'}`,
                    }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p?.boja ?? '#94A3B8', opacity: tocka.posjecen ? 0.45 : 1 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold truncate" style={{ color: tocka.posjecen ? '#5a7a9a' : '#dbeafe' }}>
                        {tocka.naziv}
                      </p>
                      <p className="text-[10px] truncate mt-0.5" style={{ color: '#456486' }}>{p?.naziv}</p>
                    </div>
                    <ToggleCheck posjecen={!!tocka.posjecen} onClick={(e) => { e.stopPropagation(); onToggleTocka(tocka.id); }} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* ── Grouped regions ── */
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredPodrucja.map((p, idx) => {
                const tocke = filteredTockeByPodrucje[p.id] || [];
                const stats = getPodrucjeStats(p);
                const isExpanded = expandedPodrucja.includes(p.id);
                const done = stats.percentage >= 100;
                if (stats.total === 0) return null;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02, type: 'spring', stiffness: 400, damping: 30 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: isExpanded ? '#102542' : '#0f2038',
                      border: `1px solid ${isExpanded ? '#254a7a' : '#1a3155'}`,
                    }}
                  >
                    {/* Region header */}
                    <button
                      onClick={() => togglePodrucje(p.id)}
                      className="w-full px-4 py-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        {/* Kolut boje regije + stanje */}
                        <span className="relative flex-shrink-0 w-3 h-3">
                          <span className="absolute inset-0 rounded-full" style={{ backgroundColor: p.boja }} />
                          {done && (
                            <span className="absolute -inset-1 rounded-full" style={{ border: '1.5px solid #4ade80' }} />
                          )}
                        </span>
                        <p className="flex-1 text-[15px] font-bold truncate" style={{ color: '#f1f6ff', fontFamily: DISPLAY_FONT }}>
                          {p.naziv}
                        </p>
                        <span
                          className="text-[13px] font-bold tabular-nums flex-shrink-0"
                          style={{ color: done ? '#4ade80' : '#6a90ba', fontFamily: DISPLAY_FONT }}
                        >
                          {stats.visited}<span style={{ color: '#3f6289' }}>/{stats.total}</span>
                        </span>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={PILL_SPRING} className="flex-shrink-0">
                          <ChevronDown className="w-4 h-4" style={{ color: '#4a6a8a' }} />
                        </motion.div>
                      </div>

                      {/* Progres */}
                      <div className="h-1.5 rounded-full overflow-hidden mt-2.5" style={{ background: '#132743' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${stats.percentage}%`,
                            background: done ? 'linear-gradient(90deg,#16a34a,#4ade80)' : `linear-gradient(90deg, ${p.boja}, #4ade80)`,
                          }}
                        />
                      </div>
                    </button>

                    {/* Expanded peaks — trail rail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={ACCORDION_SPRING}
                          className="overflow-hidden"
                        >
                          <div className="relative pl-7 pr-3 pb-2 pt-1">
                            {/* vertikalna staza (trail) */}
                            <span
                              className="absolute top-2 bottom-4"
                              style={{ left: 18, width: 2, borderRadius: 2, background: `linear-gradient(180deg, ${p.boja}, ${p.boja}44)` }}
                            />
                            {tocke.map((tocka, ti) => {
                              const isSelected = selectedTocka?.id === tocka.id;
                              return (
                                <div
                                  key={tocka.id}
                                  data-tocka-id={tocka.id}
                                  onClick={() => onTockaSelect(tocka)}
                                  className="relative flex items-center gap-2.5 py-2 pl-3 pr-1 rounded-lg cursor-pointer transition-colors"
                                  onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.035)'; }}
                                  onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                                  style={{
                                    background: isSelected ? 'rgba(34,197,94,0.12)' : 'transparent',
                                    borderBottom: ti < tocke.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                  }}
                                >
                                  {/* čvor na stazi */}
                                  <span
                                    className="absolute rounded-full"
                                    style={{
                                      left: -3, top: '50%', marginTop: -5, width: 10, height: 10,
                                      background: tocka.posjecen ? '#4ade80' : '#102542',
                                      border: `2px solid ${tocka.posjecen ? '#4ade80' : p.boja}`,
                                      boxShadow: tocka.posjecen ? '0 0 8px rgba(74,222,128,0.5)' : 'none',
                                    }}
                                  />
                                  <span
                                    className="text-[13px] font-medium truncate flex-1"
                                    style={{
                                      color: isSelected ? '#4ade80' : tocka.posjecen ? '#4a6a8a' : '#c3d8ef',
                                      textDecoration: tocka.posjecen && !isSelected ? 'line-through' : 'none',
                                    }}
                                  >
                                    {tocka.naziv}
                                  </span>
                                  <ToggleCheck posjecen={!!tocka.posjecen} onClick={(e) => { e.stopPropagation(); onToggleTocka(tocka.id); }} />
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Donja traka: Statistika / Upute ── */}
      <div
        className="flex-shrink-0 grid grid-cols-2"
        style={{ borderTop: '1px solid #1a3155', background: '#0b1a2e' }}
      >
        <FooterTab Icon={BarChart3} label="Statistika" iconColor="#4ade80" onClick={() => setActiveModal('stats')} />
        <FooterTab Icon={Info} label="Upute" iconColor="#60a5fa" divider onClick={() => setActiveModal('guide')} />
      </div>

      {/* ── Modali (Statistika / Upute) — portal na body zbog transformiranog sheeta ── */}
      {createPortal(
        <AnimatePresence>
          {activeModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveModal(null)}
                style={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'rgba(3,8,18,0.66)', backdropFilter: 'blur(3px)' }}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                style={{
                  position: 'fixed', zIndex: 1401,
                  left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
                  width: 'calc(100% - 32px)', maxWidth: 420, maxHeight: '82vh',
                  display: 'flex', flexDirection: 'column',
                  background: 'radial-gradient(120% 60% at 50% 0%, #10233a 0%, #0d1b2a 60%)',
                  border: '1px solid #254a7a', borderRadius: 20,
                  boxShadow: '0 24px 60px rgba(0,0,0,0.6)', overflow: 'hidden',
                }}
              >
                {/* Header modala */}
                <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #1a3155' }}>
                  <div className="flex items-center gap-2.5">
                    {activeModal === 'stats'
                      ? <BarChart3 className="w-5 h-5" style={{ color: '#4ade80' }} />
                      : <Info className="w-5 h-5" style={{ color: '#60a5fa' }} />}
                    <h2 className="text-lg font-extrabold" style={{ color: '#ffffff', fontFamily: DISPLAY_FONT }}>
                      {activeModal === 'stats' ? 'Statistika' : 'Upute'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d3461' }}
                    aria-label="Zatvori"
                  >
                    <X className="w-4 h-4" style={{ color: '#7a9abb' }} />
                  </button>
                </div>

                {/* Sadržaj */}
                <div className="overflow-y-auto px-5 py-5">
                  {activeModal === 'stats'
                    ? <StatsContent podrucja={podrucja} getStats={getPodrucjeStats} total={totalStats} />
                    : <GuideContent />}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

/** Tipka u donjoj traci. */
function FooterTab({ Icon, label, iconColor, divider, onClick }: {
  Icon: typeof BarChart3; label: string; iconColor: string; divider?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 py-3.5 transition-colors"
      style={{ color: '#a8c4de', borderLeft: divider ? '1px solid #1a3155' : 'none' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <Icon className="w-4 h-4" style={{ color: iconColor }} />
      <span className="text-[13px] font-semibold">{label}</span>
    </button>
  );
}

const StatCard = ({ n, label, color }: { n: number; label: string; color: string }) => (
  <div className="rounded-xl px-3 py-3 text-center" style={{ background: '#0f2038', border: '1px solid #1a3155' }}>
    <div className="text-2xl font-extrabold tabular-nums leading-none" style={{ color, fontFamily: DISPLAY_FONT }}>{n}</div>
    <div className="text-[10px] font-semibold uppercase tracking-wider mt-1.5" style={{ color: '#5a7fa8' }}>{label}</div>
  </div>
);

/** Sadržaj modala: statistika napretka. */
function StatsContent({ podrucja, getStats, total }: {
  podrucja: Podrucje[];
  getStats: (p: Podrucje) => { total: number; visited: number; unvisited: number; percentage: number };
  total: { total: number; visited: number; unvisited: number; percentage: number };
}) {
  const rows = podrucja.map((p) => ({ p, s: getStats(p) })).filter((x) => x.s.total > 0);
  const done = rows.filter((x) => x.s.percentage >= 100).length;
  const inProgress = rows.filter((x) => x.s.percentage > 0 && x.s.percentage < 100).length;
  const notStarted = rows.filter((x) => x.s.percentage === 0).length;
  const closest = rows
    .filter((x) => x.s.percentage > 0 && x.s.percentage < 100)
    .sort((a, b) => b.s.percentage - a.s.percentage)
    .slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Ukupno */}
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-extrabold tabular-nums leading-none" style={{ color: '#4ade80', fontFamily: DISPLAY_FONT }}>
            {total.percentage.toFixed(0)}
          </span>
          <span className="text-xl font-bold" style={{ color: '#2f6f45' }}>%</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: '#dbeafe' }}>
            {total.visited} od {total.total} vrhova
          </p>
          <div className="h-2 rounded-full overflow-hidden mt-2" style={{ background: '#132743' }}>
            <div className="h-full rounded-full" style={{ width: `${total.percentage}%`, background: 'linear-gradient(90deg,#16a34a,#4ade80)' }} />
          </div>
        </div>
      </div>

      {/* Regije breakdown */}
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard n={done} label="Završene" color="#4ade80" />
        <StatCard n={inProgress} label="U tijeku" color="#f59e0b" />
        <StatCard n={notStarted} label="Nezapočete" color="#6a90ba" />
      </div>

      {/* Preostalo */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
        <Mountain className="w-5 h-5 flex-shrink-0" style={{ color: '#f59e0b' }} />
        <p className="text-sm" style={{ color: '#fcd34d' }}>
          Još <strong className="font-extrabold">{total.unvisited}</strong> vrhova do potpune obilaznice
        </p>
      </div>

      {/* Najbliže završetku */}
      {closest.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Trophy className="w-4 h-4" style={{ color: '#4ade80' }} />
            <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#5a7fa8' }}>Najbliže završetku</p>
          </div>
          <div className="space-y-2">
            {closest.map(({ p, s }) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.boja }} />
                <span className="text-[13px] font-medium flex-1 truncate" style={{ color: '#c3d8ef' }}>{p.naziv}</span>
                <span className="text-[12px] font-bold tabular-nums flex-shrink-0" style={{ color: '#6a90ba' }}>{s.visited}/{s.total}</span>
                <div className="w-14 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ background: '#132743' }}>
                  <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, background: `linear-gradient(90deg, ${p.boja}, #4ade80)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Sadržaj modala: kratke upute. */
function GuideContent() {
  const steps = [
    { Icon: MousePointerClick, title: 'Odaberi vrh', text: 'Klikni marker na karti ili red u listi da vidiš detalje i link na HPO portal.' },
    { Icon: Check, title: 'Označi posjećeno', text: 'Klikni kružić pored vrha. Kvačica = posjećeno; napredak se sprema automatski.' },
    { Icon: Layers, title: 'Filtriraj', text: 'Prebacuj između Neposjećeni / Posjećeni / Sve u gornjoj traci.' },
    { Icon: Search, title: 'Pretraži', text: 'Traži po imenu vrha, ID-u (npr. 7.4) ili nazivu regije.' },
    { Icon: Mountain, title: 'Regije', text: 'Klikni regiju da je proširiš i zumiraš na karti. Svaka ima svoju boju i napredak.' },
  ];
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed" style={{ color: '#a8c4de' }}>
        <strong style={{ color: '#dbeafe' }}>HPO</strong> (Hrvatska planinarska obilaznica) je sustav kontrolnih točaka po planinama Hrvatske.
        Ova aplikacija prati koje si vrhove posjetio.
      </p>
      <div className="space-y-3">
        {steps.map(({ Icon, title, text }, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#0f2038', border: '1px solid #1d3461' }}>
              <Icon className="w-4 h-4" style={{ color: '#4ade80' }} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold" style={{ color: '#f1f6ff' }}>{title}</p>
              <p className="text-[12px] leading-snug mt-0.5" style={{ color: '#7a9abb' }}>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Okrugli checkbox toggle — jasan i dodirni (≥28px). */
function ToggleCheck({ posjecen, onClick }: { posjecen: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      title={posjecen ? 'Označi kao nedovršeno' : 'Označi kao završeno'}
      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
      style={{
        background: posjecen ? '#22c55e' : 'transparent',
        border: `1.5px solid ${posjecen ? '#22c55e' : '#2f5480'}`,
        boxShadow: posjecen ? '0 0 10px rgba(34,197,94,0.35)' : 'none',
      }}
    >
      {posjecen && <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: '#052e12' }} />}
    </button>
  );
}
