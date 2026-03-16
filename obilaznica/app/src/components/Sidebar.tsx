import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, MapPin, CheckCircle, Circle } from 'lucide-react';
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
}

const FILTER_OPTIONS = [
  { value: 'neposjeceni' as const, label: 'Neposjećeni' },
  { value: 'posjeceni' as const, label: 'Posjećeni' },
  { value: 'svi' as const, label: 'Sve' },
] as const;

// Spring config shared across accordion expansions
const ACCORDION_SPRING = { type: 'spring' as const, stiffness: 380, damping: 32 };
// Spring config for the sliding pill in segmented control
const PILL_SPRING = { type: 'spring' as const, stiffness: 500, damping: 38 };

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
}: SidebarProps) {
  const [expandedPodrucja, setExpandedPodrucja] = useState<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

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

    // Auto-expand the region that contains the selected peak
    const pid = selectedTocka.podrucjeId || 0;
    if (pid && !expandedPodrucja.includes(pid)) {
      setExpandedPodrucja((prev) => [...prev, pid]);
    }

    // After expand animation settles, scroll to the item
    const timer = setTimeout(() => {
      const el = listRef.current?.querySelector(`[data-tocka-id="${selectedTocka.id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 280);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTocka?.id]);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: '#0d1b2a', borderRight: '1px solid #1d3461' }}
    >

      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #1d3461' }}>
        <div className="flex items-center gap-3 mb-5">
          <img
            src="/01-01-1024x1007.png"
            alt="PD Izletnik"
            className="w-9 h-9 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight tracking-tight" style={{ color: '#ffffff' }}>
              Osobna Obilaznica
            </h1>
            <p className="text-[11px] font-medium" style={{ color: '#5a7fa8' }}>HPO Planinska obilaznica</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: '#1d3461' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1a3050')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#1d3461')}
            aria-label="Zatvori"
          >
            <X className="w-4 h-4" style={{ color: '#7a9abb' }} />
          </button>
        </div>

        {/* ── Progress bar ──────────────────────────────── */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-medium" style={{ color: '#5a7fa8' }}>Ukupni progres</span>
            <span className="text-[11px] font-bold tabular-nums" style={{ color: '#4CAF50' }}>
              {totalStats.percentage.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1d3461' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalStats.percentage}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 18 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #2E7D32, #4CAF50)' }}
            />
          </div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="px-3 py-3" style={{ borderBottom: '1px solid #1d3461' }}>
        <div className="flex gap-2">
          {FILTER_OPTIONS.map(({ value, label }) => {
            const isActive = filterPosjecen === value;
            return (
              <motion.button
                key={value}
                onClick={() => onFilterPosjecenChange(value)}
                className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl cursor-pointer select-none"
                whileTap={{ y: 2, boxShadow: isActive
                  ? '0 1px 0 #166534'
                  : '0 1px 0 #0f2340',
                }}
                style={isActive ? {
                  background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                  border: '1px solid #15803d',
                  boxShadow: '0 4px 0 #14532d, 0 6px 12px rgba(34,197,94,0.3)',
                } : {
                  background: 'linear-gradient(180deg, #1a3a5c 0%, #142d4a 100%)',
                  border: '1px solid #2d5480',
                  boxShadow: '0 4px 0 #0d1e33, 0 6px 12px rgba(0,0,0,0.3)',
                }}
              >
                <span
                  className="text-[9px] uppercase tracking-widest font-bold leading-none"
                  style={{ color: isActive ? 'rgba(0,0,0,0.75)' : '#4a7aaa' }}
                >
                  {label}
                </span>
                <span
                  className="text-2xl font-extrabold leading-none tabular-nums"
                  style={{ color: isActive ? '#ffffff' : '#6a9cc8' }}
                >
                  {filterCounts[value]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Search ────────────────────────────────────── */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #1d3461' }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Pretraži vrhove..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 pr-8 py-2.5 rounded-xl text-sm transition-all focus:outline-none"
            style={{ background: '#112240', border: '1px solid #1d3461', color: '#ffffff' }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1px solid rgba(76,175,80,0.5)';
              e.currentTarget.style.background = '#142b45';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid #1d3461';
              e.currentTarget.style.background = '#112240';
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
                onMouseEnter={(e) => (e.currentTarget.style.background = '#264070')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1d3461')}
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
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
              >
                <X className="w-3 h-3" />
                {podrucja.find((p) => p.id === selectedPodrucje)?.naziv}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search results banner */}
      <AnimatePresence>
        {searchTerm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={ACCORDION_SPRING}
            className="px-4 py-2 overflow-hidden flex-shrink-0"
            style={{
              background: 'rgba(251,191,36,0.08)',
              borderBottom: '1px solid rgba(251,191,36,0.15)',
            }}
          >
            <p className="text-xs flex items-center gap-1.5" style={{ color: '#fbbf24' }}>
              <Search className="w-3 h-3" />
              Pronađeno <strong>{filteredTocke.length}</strong>{' '}
              {filteredTocke.length === 1 ? 'vrh' : 'vrhova'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── List ──────────────────────────────────────── */}
      <div ref={listRef} className="flex-1 overflow-y-auto min-h-0 px-3 py-3">
        {searchTerm ? (
          /* ── Search results ── */
          <div className="space-y-1">
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
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer"
                    style={{
                      background: isSelected ? '#2E7D32' : '#112240',
                      border: `1px solid ${isSelected ? '#2E7D32' : '#1d3461'}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p?.boja ?? '#94A3B8', opacity: tocka.posjecen ? 0.5 : 1 }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{
                        color: isSelected ? '#ffffff' : tocka.posjecen ? '#4a6a8a' : '#c8ddf0',
                      }}>
                        {tocka.naziv}
                      </p>
                      <p className="text-[10px] truncate mt-0.5" style={{
                        color: isSelected ? 'rgba(187,247,208,0.8)' : '#4a6a8a',
                      }}>
                        {p?.naziv}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleTocka(tocka.id); }}
                      title={tocka.posjecen ? 'Označi kao nedovršeno' : 'Označi kao završeno'}
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: tocka.posjecen ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.06)' }}
                    >
                      {tocka.posjecen
                        ? <CheckCircle className="w-3.5 h-3.5" style={{ color: isSelected ? '#bbf7d0' : '#4CAF50' }} />
                        : <Circle className="w-3.5 h-3.5" style={{ color: '#4a6a8a' }} />
                      }
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* ── Grouped regions ── */
          <div className="space-y-1.5">
            <AnimatePresence mode="popLayout">
              {filteredPodrucja.map((p, idx) => {
                const tocke = filteredTockeByPodrucje[p.id] || [];
                const stats = getPodrucjeStats(p);
                const isExpanded = expandedPodrucja.includes(p.id);

                if (stats.total === 0) return null;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02, type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    {/* Region card header */}
                    <button
                      onClick={() => togglePodrucje(p.id)}
                      className="w-full px-3 py-3 rounded-xl text-left transition-colors"
                      style={{
                        background: '#112240',
                        border: '1px solid #1d3461',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#1a3050';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#1d3461';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#112240';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#1d3461';
                      }}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.boja }} />
                        <p className="flex-1 text-sm font-semibold truncate" style={{ color: '#ffffff' }}>
                          {p.naziv}
                        </p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[10px] font-semibold tabular-nums" style={{ color: '#5a7fa8' }}>
                            {stats.visited}/{stats.total}
                          </span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={PILL_SPRING}
                          >
                            <ChevronDown className="w-3.5 h-3.5" style={{ color: '#4a6a8a' }} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Mini progress bar */}
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1d3461' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${stats.percentage}%`,
                            background: stats.percentage === 100
                              ? 'linear-gradient(90deg, #2E7D32, #4CAF50)'
                              : 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                          }}
                        />
                      </div>

                      {stats.unvisited > 0 && (
                        <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: '#f59e0b' }}>
                          <MapPin className="w-2.5 h-2.5" />
                          {stats.unvisited} preostalo
                        </p>
                      )}
                    </button>

                    {/* Expanded peaks — spring accordion */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={ACCORDION_SPRING}
                          className="ml-3 mt-1 space-y-0.5 overflow-hidden"
                        >
                          {tocke.map((tocka) => {
                            const isSelected = selectedTocka?.id === tocka.id;
                            return (
                              <div
                                key={tocka.id}
                                data-tocka-id={tocka.id}
                                onClick={() => onTockaSelect(tocka)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                                style={{ background: isSelected ? 'rgba(76,175,80,0.12)' : 'transparent' }}
                                onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = '#1a3050'; }}
                                onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                              >
                                <span
                                  className="text-xs font-medium truncate flex-1"
                                  style={{
                                    color: isSelected ? '#4CAF50' : tocka.posjecen ? '#3a5a7a' : '#a8c4de',
                                    textDecoration: tocka.posjecen && !isSelected ? 'line-through' : 'none',
                                    fontWeight: isSelected ? 600 : undefined,
                                  }}
                                >
                                  {tocka.naziv}
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onToggleTocka(tocka.id); }}
                                  title={tocka.posjecen ? 'Označi kao nedovršeno' : 'Označi kao završeno'}
                                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                                  style={{ background: tocka.posjecen ? 'rgba(76,175,80,0.15)' : 'transparent' }}
                                >
                                  {tocka.posjecen
                                    ? <CheckCircle className="w-3.5 h-3.5" style={{ color: '#4CAF50' }} />
                                    : <Circle className="w-3.5 h-3.5" style={{ color: '#2a4a6a' }} />
                                  }
                                </button>
                              </div>
                            );
                          })}
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
    </div>
  );
}
