import React, { useState, useRef } from 'react';
import { Search, Navigation, ChevronDown, Menu } from 'lucide-react'; // Tambah Menu icon
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import LeftSidebar from './components/layout/LeftSidebar';
import RightSidebar from './components/layout/RightSidebar';
import Dashboard from './components/layout/Dashboard';
import MapCanvas from './components/map/MapCanvas';

import { DUMMY_ROUTES, DUMMY_POIS, ROUTE_LOOKUP } from './assets/data/mockData.jsx';
import { fixLeafletIcon } from './utils/leafletHelpers';
import CustomDropdown from './components/ui/CostumDropdown.jsx';

fixLeafletIcon();

const App = () => {
  const [selectedItem, setSelectedItem] = useState(null); 
  const [sidebarType, setSidebarType] = useState(null); 
  const [mapTarget, setMapTarget] = useState(null);
  
  // STATE BARU: Kontrol Sidebar Kiri di Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [searchResult, setSearchResult] = useState(null); 
  const dashboardRef = useRef(null);

  const handleSearch = () => {
    // ... (Logic Search SAMA seperti sebelumnya)
    if (!origin || !destination) return;
    if (origin === destination) { alert("Asal dan Tujuan tidak boleh sama!"); return; }
    const startNode = DUMMY_POIS.find(p => p.id === origin);
    const endNode = DUMMY_POIS.find(p => p.id === destination);
    const lookupResult = ROUTE_LOOKUP[origin]?.[destination];

    if (lookupResult && lookupResult.length > 0) {
      const recommendedRoute = DUMMY_ROUTES.find(r => r.id === lookupResult[0]);
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
    // UX: Tutup menu mobile jika search ditekan
    setIsMobileMenuOpen(false);
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

  const closeSidebar = () => { setSelectedItem(null); setSidebarType(null); setSearchResult(null); setOrigin(""); setDestination(""); };
  const handleZoomRequest = (lat, lng, zoom = 16) => { setMapTarget({ center: [lat, lng], zoom }); };
  const scrollToDashboard = () => { dashboardRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-white">
      
      {/* SECTION 1: MAP */}
      <section className="h-screen w-full snap-start relative flex overflow-hidden">
        
        {/* SIDEBAR KIRI (Pass props isOpen) */}
        <LeftSidebar 
          routes={DUMMY_ROUTES} 
          selectedItem={selectedItem} 
          sidebarType={sidebarType} 
          onRouteClick={handleRouteClick}
          isOpen={isMobileMenuOpen} // Prop baru
          onClose={() => setIsMobileMenuOpen(false)} // Prop baru
        />

        <main className="flex-1 relative h-full flex flex-col min-w-0">
          
          {/* SEARCH BAR & MENU BUTTON */}
          <div className="absolute top-6 left-0 right-0 z-[1000] px-4 flex justify-center gap-3">
             
             {/* Tombol Hamburger (Mobile Only) */}
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="cursor-pointer md:hidden bg-white p-3 rounded-xl shadow-lg border border-gray-200 text-gray-700 active:bg-gray-50 h-17 w-17 flex items-center justify-center flex-shrink-0 hover:bg-gray-50/80"
             >
                <Menu className="w-6 h-6" />
             </button>

             {/* Search Inputs */}
             <div className="flex-1 max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 flex items-center gap-2 border border-white/50">
                {/* Di Mobile, dropdown kita buat agak simple tampilannya kalau perlu, tapi ini sudah cukup responsif krn flex-1 */}
                <CustomDropdown options={DUMMY_POIS} value={origin} onChange={setOrigin} placeholder="Asal..." iconColor="text-green-600"/>
                <div className="text-gray-300 px-0 md:px-1"><Navigation className="w-4 h-4 md:w-5 md:h-5 rotate-90" /></div>
                <CustomDropdown options={DUMMY_POIS} value={destination} onChange={setDestination} placeholder="Tujuan..." iconColor="text-red-600"/>
                <button onClick={handleSearch} className="bg-blue-600 text-white h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl shadow-md ml-1 md:ml-2">
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                </button>
             </div>
          </div>

          {/* Map Canvas */}
          <div className="flex-1 relative z-0">
              <MapCanvas 
                  routes={DUMMY_ROUTES} pois={DUMMY_POIS} mapTarget={mapTarget} selectedItem={selectedItem} sidebarType={sidebarType} searchResult={searchResult}
                  onRouteClick={handleRouteClick} onPoiClick={handlePoiClick} onZoomRequest={handleZoomRequest}
              />
          </div>

          {/* Tombol Scroll Statistik */}
          <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-[900] animate-bounce">
            <button onClick={scrollToDashboard} className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 text-xs md:text-sm font-semibold">
              Lihat Statistik <div className="bg-blue-600 text-white rounded-full p-1"><ChevronDown className="w-3 h-3 md:w-4 md:h-4" /></div>
            </button>
          </div>

        </main>

        {/* SIDEBAR KANAN (Akan jadi Bottom Sheet di Mobile) */}
        {(selectedItem || (sidebarType === 'navigation' && searchResult)) && (
            <RightSidebar 
              selectedItem={selectedItem} sidebarType={sidebarType} searchResult={searchResult} routes={DUMMY_ROUTES} pois={DUMMY_POIS}
              onClose={closeSidebar} onRouteClick={handleRouteClick} onPoiClick={handlePoiClick}
            />
        )}
      </section>

      {/* SECTION 2: DASHBOARD */}
      <section ref={dashboardRef} className="h-screen w-full snap-start bg-gray-50 flex items-center overflow-hidden">
         <Dashboard />
      </section>

    </div>
  );
};

export default App;