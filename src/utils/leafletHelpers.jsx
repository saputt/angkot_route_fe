import L from 'leaflet';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix Icon Default Leaflet yang suka error di React
export const fixLeafletIcon = () => {
    const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
};

// Fungsi bikin Icon Custom (warna-warni)
export const createCustomIcon = (iconComponent, colorClass) => {
    return L.divIcon({
      html: renderToStaticMarkup(
        <div className={`w-8 h-8 rounded-full ${colorClass} border-2 border-white shadow-lg flex items-center justify-center`}>
          {iconComponent}
        </div>
      ),
      className: 'custom-marker-icon', 
      iconSize: [32, 32],
      iconAnchor: [16, 32], 
      popupAnchor: [0, -32]
    });
};