import { useState, useMemo } from 'react';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar';
import { kontrolneTocke } from './data/kontrolneTocke';
import type { KontrolnaTocka } from './types';

function App() {
  const [selectedPodrucje, setSelectedPodrucje] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTocka, setSelectedTocka] = useState<KontrolnaTocka | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterPosjecen, setFilterPosjecen] = useState<'svi' | 'posjeceni' | 'neposjeceni'>('svi');

  // Centralized filtering logic
  const filteredTocke = useMemo(() => {
    let result = kontrolneTocke;

    // 1. Filter by selected area
    if (selectedPodrucje !== null) {
      result = result.filter((kt) => kt.podrucjeId === selectedPodrucje);
    }

    // 2. Filter by search term
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((kt) => kt.naziv.toLowerCase().includes(lower) || kt.id.toLowerCase().includes(lower));
    }

    // 3. Filter by posjecen status
    if (filterPosjecen === 'posjeceni') {
      result = result.filter((kt) => kt.posjecen === true);
    } else if (filterPosjecen === 'neposjeceni') {
      result = result.filter((kt) => kt.posjecen === false);
    }

    return result;
  }, [selectedPodrucje, searchTerm, filterPosjecen]);

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-[999]
          w-80 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <Sidebar
          allTocke={kontrolneTocke}
          filteredTocke={filteredTocke}
          selectedPodrucje={selectedPodrucje}
          onPodrucjeSelect={setSelectedPodrucje}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterPosjecen={filterPosjecen}
          onFilterPosjecenChange={setFilterPosjecen}
          onTockaSelect={setSelectedTocka}
          selectedTocka={selectedTocka}
        />
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView
          kontrolneTocke={filteredTocke}
          selectedTocka={selectedTocka}
          onTockaSelect={setSelectedTocka}
        />

        {/* Stats overlay */}
        <div className="absolute bottom-4 right-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredTocke.length}</span>
            {' '}kontrolnih točaka
          </p>
        </div>
      </div>

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[998]"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
