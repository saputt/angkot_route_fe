import React from 'react';
import { Bus } from 'lucide-react';

const LeftSidebar = ({ routes, selectedItem, sidebarType, onRouteClick }) => {
  return (
    <aside className="w-80 h-full bg-white shadow-xl z-20 flex flex-col border-r border-gray-200 flex-shrink-0">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Bus className="text-blue-600" /> Roukot</h1>
        <p className="text-xs text-gray-400 mt-1">Sistem Informasi Rute Angkot Bandung</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {routes.map((route) => (
          <div 
            key={route.id} 
            onClick={() => onRouteClick(route)} 
            className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 border-l-4 hover:shadow-md 
            ${selectedItem?.id === route.id && sidebarType === 'route' ? `${route.color} bg-blue-50` : "border-transparent hover:bg-gray-50 bg-white"}`}
          >
            <h3 className={`font-semibold text-sm ${selectedItem?.id === route.id && sidebarType === 'route' ? "text-blue-700" : "text-gray-700"}`}>
                {route.name}
            </h3>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LeftSidebar;