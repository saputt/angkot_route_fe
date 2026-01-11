import React, { useRef, useState } from 'react';
import { Search, Navigation, ChevronDown } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import Components
import Dashboard from './components/layout/Dashboard'; // Import Dashboard baru
import MapCanvas from './components/map/MapCanvas';

// Import Data & Utils
import { DUMMY_ROUTES, DUMMY_POIS, ROUTE_LOOKUP } from './assets/data/mockData.jsx';
import { fixLeafletIcon } from './utils/leafletHelpers';
import LeftSidebar from './components/layout/leftSidebar.jsx';
import RightSidebar from './components/layout/rightSidebar.jsx';
import CustomDropdown from './components/ui/CostumDropdown.jsx';

fixLeafletIcon();

const App = () => {
  // State UI
  const [selectedItem, setSelectedItem] = useState(null); 
  const [sidebarType, setSidebarType] = useState(null); 
  const [mapTarget, setMapTarget] = useState(null);

  // State Search
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [searchResult, setSearchResult] = useState(null); 

  // --- LOGIC SEARCH (Sama seperti sebelumnya) ---
  const handleSearch = () => {
    if (!origin || !destination) return;
    if (origin === destination) { alert("Asal dan Tujuan tidak boleh sama!"); return; }

    const startNode = DUMMY_POIS.find(p => p.id === origin);
    const endNode = DUMMY_POIS.find(p => p.id === destination);

    const lookupResult = ROUTE_LOOKUP[origin]?.[destination];

    if (lookupResult && lookupResult.length > 0) {
      const recommendedRouteId = lookupResult[0]; 
      const recommendedRoute = DUMMY_ROUTES.find(r => r.id === recommendedRouteId);
      const result = { type: 'direct', routes: [recommendedRoute], from: startNode, to: endNode };
      setSearchResult(result); setSidebarType('navigation'); setSelectedItem(null); 
      setMapTarget({ bounds: L.latLngBounds([startNode.lat, startNode.lng], [endNode.lat, endNode.lng]) });
    } else {
      const routeA = DUMMY_ROUTES.find(r => r.id === startNode.passed_by[0]);
      const routeB = DUMMY_ROUTES.find(r => r.id === endNode.passed_by[0]);
      if(!routeA || !routeB) { alert("Rute tidak ditemukan."); return; }
      const result = { type: 'transit', routes: [routeA, routeB], from: startNode, to: endNode, transitPoint: "Simpang Dago" };
      setSearchResult(result); setSidebarType('navigation');
      setMapTarget({ bounds: L.latLngBounds([startNode.lat, startNode.lng], [endNode.lat, endNode.lng]) });
    }
  };

  const handleRouteClick = (route) => {
    setSearchResult(null); 
    if (selectedItem?.id === route.id && sidebarType === 'route') {
      setSelectedItem(null); setSidebarType(null);
    } else {
      setSelectedItem(route); setSidebarType('route');
      if(route.coordinates.length > 0) setMapTarget({ center: route.coordinates[Math.floor(route.coordinates.length/2)], zoom: 14 });
    }
  };

  const handlePoiClick = (poi) => {
    setSearchResult(null);
    setSelectedItem(poi); setSidebarType('poi'); setMapTarget({ center: [poi.lat, poi.lng], zoom: 17 });
  };

  const closeSidebar = () => {
    setSelectedItem(null); setSidebarType(null); setSearchResult(null); setOrigin(""); setDestination("");
  };

  const handleZoomRequest = (lat, lng, zoom = 16) => {
    setMapTarget({ center: [lat, lng], zoom });
  };

  // 1. BUAT REF UNTUK DASHBOARD SECTION
  const dashboardRef = useRef(null);

  // 2. FUNGSI UNTUK SCROLL KE BAWAH SECARA SMOOTH
  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // CONTAINER UTAMA DENGAN SNAP SCROLL
    // h-screen: Tinggi 100% layar
    // overflow-y-scroll: Agar bisa discroll vertikal
    // snap-y snap-mandatory: Kunci efek "jepret"
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      
      {/* --- SECTION 1: MAP INTERFACE (Full Screen) --- */}
      <section className="h-screen w-full snap-start relative flex overflow-hidden">
        
        {/* SIDEBAR KIRI (Tetap di Section 1) */}
        <LeftSidebar 
          routes={DUMMY_ROUTES} 
          selectedItem={selectedItem} 
          sidebarType={sidebarType} 
          onRouteClick={handleRouteClick} 
        />

        {/* MAIN MAP AREA */}
        <main className="flex-1 relative h-full flex flex-col min-w-0">
          
          {/* Search Bar Overlay */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[1000] w-[95%] max-w-3xl">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 flex items-center gap-2 border border-white/50">
              <CustomDropdown options={DUMMY_POIS} value={origin} onChange={setOrigin} placeholder="Pilih titik awal..." iconColor="text-green-600"/>
              <div className="text-gray-300 px-1"><Navigation className="w-5 h-5 rotate-90" /></div>
              <CustomDropdown options={DUMMY_POIS} value={destination} onChange={setDestination} placeholder="Pilih titik tujuan..." iconColor="text-red-600"/>
              <button onClick={handleSearch} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 flex items-center justify-center rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95 ml-2">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Map Canvas */}
          <div className="flex-1 relative z-0">
              <MapCanvas 
                  routes={DUMMY_ROUTES}
                  pois={DUMMY_POIS}
                  mapTarget={mapTarget}
                  selectedItem={selectedItem}
                  sidebarType={sidebarType}
                  searchResult={searchResult}
                  onRouteClick={handleRouteClick}
                  onPoiClick={handlePoiClick}
                  onZoomRequest={handleZoomRequest}
              />
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[1000] animate-bounce">
            <button 
              onClick={scrollToDashboard}
              className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 hover:bg-blue-50 transition-colors text-sm font-semibold"
            >
              Lihat Statistik
              <div className="bg-blue-600 text-white rounded-full p-1">
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
          </div>
        </main>

        {/* SIDEBAR KANAN (Tetap di Section 1) */}
        {(selectedItem || (sidebarType === 'navigation' && searchResult)) && (
            <RightSidebar 
              selectedItem={selectedItem}
              sidebarType={sidebarType}
              searchResult={searchResult}
              routes={DUMMY_ROUTES}
              pois={DUMMY_POIS}
              onClose={closeSidebar}
              onRouteClick={handleRouteClick}
              onPoiClick={handlePoiClick}
              onZoomRequest={handleZoomRequest}
            />
        )}
      </section>

      {/* SECTION 2: DASHBOARD */}
      {/* Pasang 'ref={dashboardRef}' disini agar tombol tahu tujuannya */}
      <section ref={dashboardRef} className="h-screen w-full snap-start bg-gray-50 flex items-center">
         <Dashboard />
      </section>

    </div>
  );
};

export default App;