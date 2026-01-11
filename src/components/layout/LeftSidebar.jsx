import React from 'react';
import { Bus, X } from 'lucide-react';

const LeftSidebar = ({ routes, selectedItem, sidebarType, onRouteClick, isOpen, onClose }) => {
  return (
    <>
      {/* BACKDROP GELAP (Hanya di Mobile saat menu buka) */}
      {isOpen && (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[1001] md:hidden backdrop-blur-sm transition-opacity"
        ></div>
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`
          fixed md:relative inset-y-0 left-0 z-[1002]
          w-72 md:w-80 h-full bg-white shadow-2xl md:shadow-xl border-r border-gray-200
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Bus className="text-blue-600" /> Roukot
            </h1>
            <p className="text-xs text-gray-400 mt-1">Angkot Bandung</p>
          </div>
          {/* Tombol Close (Mobile Only) */}
          <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {routes.map((route) => (
            <div 
              key={route.id} 
              onClick={() => {
                  onRouteClick(route);
                  onClose(); // Tutup sidebar pas klik di mobile
              }} 
              className={`
                group p-4 rounded-xl cursor-pointer transition-all duration-200 border-l-4 hover:shadow-md 
                ${selectedItem?.id === route.id && sidebarType === 'route' ? `${route.color} bg-blue-50` : "border-transparent hover:bg-gray-50 bg-white"}
              `}
            >
              <h3 className={`font-semibold text-sm ${selectedItem?.id === route.id && sidebarType === 'route' ? "text-blue-700" : "text-gray-700"}`}>
                  {route.name}
              </h3>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default LeftSidebar;