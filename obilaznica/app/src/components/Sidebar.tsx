import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, MapPin } from 'lucide-react';
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
  selectedTocka: KontrolnaTocka | null;
}

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
  selectedTocka,
}: SidebarProps) {
  const [expandedPodrucja, setExpandedPodrucja] = useState<number[]>([]);

  // Group kontrolne tocke by podrucje
  const tockeByPodrucje = useMemo(() => {
    const grouped: Record<number, KontrolnaTocka[]> = {};
    allTocke.forEach((kt) => {
      const pid = kt.podrucjeId || 0;
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(kt);
    });
    return grouped;
  }, [allTocke]);

  const togglePodrucje = (id: number) => {
    setExpandedPodrucja((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const getPodrucjeStats = (podrucje: Podrucje) => {
    const tocke = tockeByPodrucje[podrucje.id] || [];
    const visited = tocke.filter(t => t.posjecen).length;
    const unvisited = tocke.length - visited;
    return { total: tocke.length, visited, unvisited, percentage: tocke.length > 0 ? (visited / tocke.length) * 100 : 0 };
  };

  const totalStats = useMemo(() => {
    const visited = allTocke.filter(t => t.posjecen).length;
    return {
      total: allTocke.length,
      visited,
      unvisited: allTocke.length - visited,
      percentage: (visited / allTocke.length) * 100
    };
  }, [allTocke]);

  // Filter područja prema filterPosjecen
  const filteredPodrucja = useMemo(() => {
    return podrucja.filter((podrucje) => {
      const tocke = tockeByPodrucje[podrucje.id] || [];
      if (tocke.length === 0) return false;

      if (filterPosjecen === 'svi') {
        return true;
      } else if (filterPosjecen === 'neposjeceni') {
        // Prikazati samo područja koja imaju barem jedan neposjećen vrh
        return tocke.some(t => !t.posjecen);
      } else if (filterPosjecen === 'posjeceni') {
        // Prikazati samo područja koja imaju barem jedan posjećen vrh
        return tocke.some(t => t.posjecen);
      }
      return true;
    });
  }, [tockeByPodrucje, filterPosjecen]);

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen flex flex-col bg-slate-900 border-r border-slate-800 overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* Logo/Title */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute left-0">
              <img
                src="/01-01-1024x1007.png"
                alt="PD Izletnik Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Obilaznica</h1>
          </div>

          {/* Filter Cards */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onFilterPosjecenChange('svi')}
              className={`rounded-lg p-3 text-center transition-all ${
                filterPosjecen === 'svi'
                  ? 'bg-blue-600 border-2 border-blue-400'
                  : 'bg-slate-800/50 border-2 border-transparent hover:bg-slate-800'
              }`}
            >
              <p className={`text-[10px] uppercase tracking-wide mb-1 ${
                filterPosjecen === 'svi' ? 'text-blue-100' : 'text-slate-400'
              }`}>Svi</p>
              <p className={`text-xl font-bold ${
                filterPosjecen === 'svi' ? 'text-white' : 'text-white'
              }`}>{totalStats.total}</p>
            </button>
            <button
              onClick={() => onFilterPosjecenChange('neposjeceni')}
              className={`rounded-lg p-3 text-center transition-all ${
                filterPosjecen === 'neposjeceni'
                  ? 'bg-amber-500 border-2 border-amber-300'
                  : 'bg-amber-500/10 border-2 border-amber-500/20 hover:bg-amber-500/20'
              }`}
            >
              <p className={`text-[10px] uppercase tracking-wide mb-1 ${
                filterPosjecen === 'neposjeceni' ? 'text-amber-50' : 'text-amber-400'
              }`}>Aktivni</p>
              <p className={`text-xl font-bold ${
                filterPosjecen === 'neposjeceni' ? 'text-white' : 'text-amber-400'
              }`}>{totalStats.unvisited}</p>
            </button>
            <button
              onClick={() => onFilterPosjecenChange('posjeceni')}
              className={`rounded-lg p-3 text-center transition-all ${
                filterPosjecen === 'posjeceni'
                  ? 'bg-emerald-500 border-2 border-emerald-300'
                  : 'bg-emerald-500/10 border-2 border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              <p className={`text-[10px] uppercase tracking-wide mb-1 ${
                filterPosjecen === 'posjeceni' ? 'text-emerald-50' : 'text-emerald-400'
              }`}>Završeni</p>
              <p className={`text-xl font-bold ${
                filterPosjecen === 'posjeceni' ? 'text-white' : 'text-emerald-400'
              }`}>{totalStats.visited}</p>
            </button>
          </div>

        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-slate-800">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Pretraži vrhove..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <X className="w-3 h-3 text-slate-300" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Active Filter Chip */}
        <AnimatePresence>
          {selectedPodrucje !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="mt-3"
            >
              <button
                onClick={() => onPodrucjeSelect(null)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-all group"
              >
                <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                {podrucja.find((p) => p.id === selectedPodrucje)?.naziv}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results Banner */}
      <AnimatePresence>
        {searchTerm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20"
          >
            <p className="text-xs text-amber-400 flex items-center gap-2">
              <Search className="w-3 h-3" />
              Pronađeno <strong>{filteredTocke.length}</strong> {filteredTocke.length === 1 ? 'vrh' : 'vrhova'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent hover:scrollbar-thumb-slate-600 min-h-0">
        {searchTerm ? (
          /* Search Results */
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredTocke.map((tocka, idx) => {
                const podrucje = podrucja.find((p) => p.id === tocka.podrucjeId);
                return (
                  <motion.button
                    key={tocka.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.02, duration: 0.2 }}
                    onClick={() => onTockaSelect(tocka)}
                    className={`w-full group px-3 py-2.5 text-left rounded-lg transition-all ${
                      selectedTocka?.id === tocka.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800/30 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: podrucje?.boja || '#666',
                          opacity: tocka.posjecen ? 0.4 : 1,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${tocka.posjecen ? 'opacity-50' : ''}`}>
                          {tocka.id}. {tocka.naziv}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{podrucje?.naziv}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Grouped by Area */
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredPodrucja.map((podrucje, idx) => {
                const allTockeInPodrucje = tockeByPodrucje[podrucje.id] || [];

                // Filter peaks within area
                const tocke = allTockeInPodrucje.filter(tocka => {
                  if (filterPosjecen === 'svi') return true;
                  if (filterPosjecen === 'neposjeceni') return !tocka.posjecen;
                  if (filterPosjecen === 'posjeceni') return tocka.posjecen;
                  return true;
                });

                const isExpanded = expandedPodrucja.includes(podrucje.id);
                const stats = getPodrucjeStats(podrucje);

                if (stats.total === 0) return null;

                return (
                  <motion.div
                    key={podrucje.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                  >
                    {/* Area Header */}
                    <button
                      onClick={() => togglePodrucje(podrucje.id)}
                      className="w-full group px-4 py-3 rounded-lg bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div
                            className="w-3 h-3 rounded-md flex-shrink-0"
                            style={{ backgroundColor: podrucje.boja }}
                          />
                          <p className="font-semibold text-white text-sm truncate">
                            {podrucje.id}. {podrucje.naziv}
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="text-slate-400 flex-shrink-0"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {stats.total} vrhova
                        </span>
                        {stats.unvisited > 0 && (
                          <span className="text-[10px] text-red-400 flex items-center gap-1">
                            <X className="w-3 h-3" />
                            {stats.unvisited}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Expanded Peaks List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1.5 ml-5 space-y-1 overflow-hidden"
                        >
                          {tocke.map((tocka, tIdx) => (
                            <motion.button
                              key={tocka.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ delay: tIdx * 0.02, duration: 0.15 }}
                              onClick={() => onTockaSelect(tocka)}
                              className={`w-full px-3 py-2 text-left rounded-md transition-all ${
                                selectedTocka?.id === tocka.id
                                  ? 'bg-blue-600 text-white'
                                  : tocka.posjecen
                                  ? 'bg-slate-800/20 hover:bg-slate-800/40 text-slate-400'
                                  : 'bg-slate-800/20 hover:bg-slate-800 text-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-xs font-medium truncate ${tocka.posjecen && selectedTocka?.id !== tocka.id ? 'line-through' : ''}`}>
                                  {tocka.id}. {tocka.naziv}
                                </span>
                              </div>
                            </motion.button>
                          ))}
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

      {/* Progress Bar - Bottom */}
      <div className="px-6 py-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Progres</span>
          <span className="text-xs font-bold text-white">{totalStats.percentage.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalStats.percentage}%` }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          />
        </div>
      </div>

    </motion.div>
  );
}
