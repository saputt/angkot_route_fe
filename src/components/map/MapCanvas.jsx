import React from 'react';
import { MapContainer, TileLayer, ZoomControl, Polyline, Tooltip, Marker, Popup } from 'react-leaflet';
import { CirclePlay, CircleStop } from 'lucide-react';
import MapUpdater from './MapUpdater';
import { createCustomIcon } from '../../utils/leafletHelpers';

const MapCanvas = ({ 
    routes, pois, mapTarget, 
    selectedItem, sidebarType, searchResult, 
    onRouteClick, onPoiClick, onZoomRequest 
}) => {
    return (
        <MapContainer center={[-6.9175, 107.6191]} zoom={13} scrollWheelZoom={true} zoomControl={false} className="h-full w-full">
            <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"/>
            <ZoomControl position="bottomright" />
            
            {/* Logic Zoom */}
            <MapUpdater targetLocation={mapTarget} />

            {/* RENDER POLYLINE (RUTE) */}
            {routes.map((route) => {
                let opacity = 0.7; let weight = 4;
                const isNavMode = sidebarType === 'navigation' && searchResult;
                const isRouteMode = sidebarType === 'route' && selectedItem;

                if (isRouteMode) {
                    if (selectedItem.id === route.id) { opacity = 1; weight = 6; } else { opacity = 0.1; }
                } else if (isNavMode) {
                    const isInResult = searchResult.routes.some(r => r.id === route.id);
                    if (isInResult) { opacity = 1; weight = 6; } else { opacity = 0.1; }
                }

                return (
                    <Polyline 
                        key={route.id} 
                        positions={route.coordinates} 
                        pathOptions={{ color: route.hexColor, opacity: opacity, weight: weight }}
                        eventHandlers={{
                            click: () => onRouteClick(route),
                            mouseover: (e) => { e.target.openTooltip(); if(!isRouteMode && !isNavMode) e.target.setStyle({weight:7, opacity:1}); },
                            mouseout: (e) => { e.target.closeTooltip(); if(!isRouteMode && !isNavMode) e.target.setStyle({weight:4, opacity:0.7}); }
                        }}
                    >
                        <Tooltip sticky direction="top" className="custom-tooltip font-bold text-xs">{route.name}</Tooltip>
                    </Polyline>
                );
            })}

            {/* MARKER POI */}
            {pois.map(poi => (
                <Marker key={poi.id} position={[poi.lat, poi.lng]} eventHandlers={{ click: () => onPoiClick(poi) }}>
                    <Popup className="custom-popup"><div className="p-1 font-bold text-sm text-gray-800">{poi.name}</div></Popup>
                </Marker>
            ))}

            {/* MARKER NAVIGASI (ASAL & TUJUAN) */}
            {sidebarType === 'navigation' && searchResult && (
                <>
                    <Marker position={[searchResult.from.lat, searchResult.from.lng]} icon={createCustomIcon(<CirclePlay className="w-5 h-5 text-white fill-current"/>, "bg-green-500")} zIndexOffset={1000} />
                    <Marker position={[searchResult.to.lat, searchResult.to.lng]} icon={createCustomIcon(<CircleStop className="w-5 h-5 text-white fill-current"/>, "bg-red-500")} zIndexOffset={1000} />
                </>
            )}
        </MapContainer>
    );
};

export default MapCanvas;