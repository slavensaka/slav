import { useState, useMemo, useRef, useCallback } from 'react';
import { Menu, Navigation, Plus, Minus, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import L from 'leaflet';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar';
import { BottomSheet } from './components/BottomSheet';
import { kontrolneTocke } from './data/kontrolneTocke';
import { getPodrucjeByTockaId } from './data/podrucja';
import type { KontrolnaTocka } from './types';

function normalize(str: string): string {
  return str.toLowerCase()
    .replace(/[šŠ]/g, 's').replace(/[čČ]/g, 'c')
    .replace(/[ćĆ]/g, 'c').replace(/[žŽ]/g, 'z')
    .replace(/[đĐ]/g, 'd');
}

const STORAGE_KEY = 'obilaznica-posjeceni-v1';

function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveVisited(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

function App() {
  const [tocke, setTocke] = useState<KontrolnaTocka[]>(() => {
    const visited = loadVisited();
    if (visited.size === 0) return kontrolneTocke;
    return kontrolneTocke.map((t) => ({ ...t, posjecen: visited.has(t.id) }));
  });
  const [selectedPodrucje, setSelectedPodrucje] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTocka, setSelectedTocka] = useState<KontrolnaTocka | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [filterPosjecen, setFilterPosjecen] = useState<'svi' | 'posjeceni' | 'neposjeceni'>('svi');

  const mapRef = useRef<L.Map | null>(null);
  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  const toggleTocka = useCallback((id: string) => {
    setTocke((prev) => {
      const updated = prev.map((t) => t.id === id ? { ...t, posjecen: !t.posjecen } : t);
      const visited = new Set(updated.filter((t) => t.posjecen).map((t) => t.id));
      saveVisited(visited);
      return updated;
    });
    setSelectedTocka((prev) => prev?.id === id ? { ...prev, posjecen: !prev.posjecen } : prev);
  }, []);

  const filteredTocke = useMemo(() => {
    let result = tocke;
    if (selectedPodrucje !== null) {
      result = result.filter((kt) => kt.podrucjeId === selectedPodrucje);
    }
    if (searchTerm) {
      const lower = normalize(searchTerm);
      result = result.filter(
        (kt) => normalize(kt.naziv).includes(lower) || kt.id.toLowerCase().includes(lower),
      );
    }
    if (filterPosjecen === 'posjeceni') {
      result = result.filter((kt) => kt.posjecen === true);
    } else if (filterPosjecen === 'neposjeceni') {
      result = result.filter((kt) => kt.posjecen === false);
    }
    return result;
  }, [tocke, selectedPodrucje, searchTerm, filterPosjecen]);

  const handleTockaSelect = useCallback((tocka: KontrolnaTocka) => {
    setSelectedTocka(tocka);
    setSidebarOpen(false);
    mapRef.current?.flyTo([tocka.lat, tocka.lng], 14, { duration: 1.2 });
  }, []);

  const handleZoomToPodrucje = useCallback((podrucjeId: number) => {
    const regionTocke = tocke.filter((t) => t.podrucjeId === podrucjeId);
    if (regionTocke.length === 0 || !mapRef.current) return;
    const bounds = L.latLngBounds(regionTocke.map((t) => [t.lat, t.lng] as [number, number]));
    mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 11, animate: true });
  }, [tocke]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Vaš preglednik ne podržava geolokaciju.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 13, { duration: 1.5 });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          alert('Dozvola za lokaciju je odbijena. Omogući lokaciju u postavkama preglednika.');
        } else {
          alert('Nije moguće dohvatiti lokaciju. Pokušaj ponovo.');
        }
      },
      { timeout: 10000, maximumAge: 30000 },
    );
  };

  const sidebarProps = {
    allTocke: tocke,
    filteredTocke,
    selectedPodrucje,
    onPodrucjeSelect: setSelectedPodrucje,
    searchTerm,
    onSearchChange: setSearchTerm,
    filterPosjecen,
    onFilterPosjecenChange: setFilterPosjecen,
    onTockaSelect: handleTockaSelect,
    onToggleTocka: toggleTocka,
    selectedTocka,
    onClose: () => setSidebarOpen(false),
  };

  const selectedPodrucjeData = selectedTocka ? getPodrucjeByTockaId(selectedTocka.id) : undefined;

  return (
    <div className="h-screen w-screen flex overflow-hidden" style={{ background: '#0d1b2a' }}>

      {/* ── Desktop sidebar — AnimatePresence, pushes the map ── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            className="hidden lg:block flex-shrink-0 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: 320 }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            {/* Fixed-width inner so content doesn't squish during animation */}
            <div className="w-80 h-full">
              <Sidebar {...sidebarProps} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Map area ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Toggle button — top-left, visible when sidebar is closed */}
        <AnimatePresence>
          {!sidebarOpen && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 left-4 z-[1000] w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: 'rgba(8,18,35,0.32)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(100,160,220,0.22)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
              aria-label="Otvori izbornik"
            >
              <Menu className="w-5 h-5" style={{ color: '#a8c4de' }} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Map */}
        <MapView
          kontrolneTocke={filteredTocke}
          selectedTocka={selectedTocka}
          onTockaSelect={setSelectedTocka}
          onMapReady={handleMapReady}
          onMapClick={() => setSidebarOpen(false)}
        />

        {/* ── Floating controls — bottom right ── */}
        <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-2">
          {/* Zoom group */}
          <div className="flex flex-col rounded-xl overflow-hidden" style={{
            border: '1px solid rgba(100,160,220,0.22)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}>
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="w-10 h-10 flex items-center justify-center transition-colors"
              style={{ background: 'rgba(8,18,35,0.32)', borderBottom: '1px solid rgba(100,160,220,0.15)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(8,18,35,0.32)')}
              title="Povećaj"
            >
              <Plus className="w-4 h-4" style={{ color: '#ffffff' }} />
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="w-10 h-10 flex items-center justify-center transition-colors"
              style={{ background: 'rgba(8,18,35,0.32)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(8,18,35,0.32)')}
              title="Smanji"
            >
              <Minus className="w-4 h-4" style={{ color: '#ffffff' }} />
            </button>
          </div>
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            style={{
              background: locating ? 'rgba(255,255,255,0.12)' : 'rgba(8,18,35,0.32)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(100,160,220,0.22)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
              opacity: locating ? 0.85 : 1,
            }}
            onMouseEnter={(e) => { if (!locating) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={(e) => { if (!locating) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,18,35,0.32)'; }}
            title="Moja lokacija"
          >
            {locating
              ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#4ade80' }} />
              : <Navigation className="w-4 h-4" style={{ color: '#a8c4de' }} />
            }
          </button>
        </div>

{/* ── Bottom sheet — peak details ── */}
        <BottomSheet
          tocka={selectedTocka}
          podrucje={selectedPodrucjeData}
          onClose={() => setSelectedTocka(null)}
          onZoomToPodrucje={handleZoomToPodrucje}
        />
      </div>

      {/* ── Mobile drawer — overlay, AnimatePresence ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-y-0 left-80 right-0 z-[998]"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="lg:hidden fixed inset-y-0 left-0 z-[999] w-80"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            >
              <Sidebar {...sidebarProps} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
