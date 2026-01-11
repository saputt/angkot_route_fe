import React, { useState } from 'react';
import { X, ArrowRight, Bus, Building2, Map, ChevronUp, ChevronDown, Minus } from 'lucide-react';

const RightSidebar = ({ 
    selectedItem, sidebarType, searchResult, pois, routes, 
    onClose, onRouteClick, onPoiClick 
}) => {
    const [isStreetsExpanded, setIsStreetsExpanded] = useState(false);

    return (
        <aside className={`
            fixed md:relative 
            bottom-0 md:bottom-auto right-0 md:right-auto 
            w-full md:w-96 
            h-[47vh] md:h-full 
            bg-white border-t md:border-l border-gray-200 
            shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-xl 
            z-[1005] 
            flex flex-col flex-shrink-0 
            rounded-t-3xl md:rounded-none
            animate-in slide-in-from-bottom md:slide-in-from-right duration-300
        `}>
            {/* Grab Handle (Visual Mobile Only) */}
            <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4 pt-2 md:p-5 border-b border-gray-100 flex justify-between items-start bg-red">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        {sidebarType === 'navigation' ? 'Navigasi' : (sidebarType === 'route' ? 'Trayek' : 'Lokasi')}
                    </span>
                    <h2 className="font-bold text-gray-800 text-lg mt-1 md:mt-2 leading-tight line-clamp-1">
                        {sidebarType === 'navigation' ? 'Rute Perjalanan' : selectedItem.name}
                    </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar pb-20 md:pb-5">
                
                {/* --- KONTEN NAVIGASI --- */}
                {sidebarType === 'navigation' && searchResult && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-blue-50 p-3 md:p-4 rounded-xl border border-blue-100">
                            <div className="text-center w-1/3"><div className="text-[10px] text-gray-500 mb-1">Dari</div><div className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{searchResult.from.name}</div></div>
                            <ArrowRight className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
                            <div className="text-center w-1/3"><div className="text-[10px] text-gray-500 mb-1">Ke</div><div className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{searchResult.to.name}</div></div>
                        </div>
                        {/* Timeline Steps (Logic sama seperti sebelumnya) */}
                        <div className="relative border-l-2 border-gray-200 ml-4 space-y-6 py-2">
                           {/* Step Awal */}
                           <div className="relative pl-6"><div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div><p className="text-sm font-bold text-gray-800">Mulai</p><p className="text-xs text-gray-500">{searchResult.from.name}</p></div>
                           {/* Angkot 1 */}
                           <div className="relative pl-6">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center"><Bus className="w-2.5 h-2.5 text-blue-600"/></div>
                                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm active:scale-95 transition-transform cursor-pointer" onClick={() => onRouteClick(searchResult.routes[0])}>
                                    <div className="text-xs font-bold text-blue-600 mb-1">Naik Angkot</div><div className="font-bold text-gray-800 text-sm">{searchResult.routes[0].name}</div>
                                </div>
                            </div>
                            {/* ... (Logic Transit & Tujuan sama persis, copy paste dari kode sebelumnya) ... */}
                        </div>
                    </div>
                )}

                {/* --- KONTEN DETAIL RUTE --- */}
                {sidebarType === 'route' && selectedItem && (
                    <>
                        <div className={`${selectedItem.bg_color} p-4 rounded-xl border ${selectedItem.color} mb-6`}>
                            <h3 className={`text-sm font-bold ${selectedItem.text_color} mb-1`}>Deskripsi</h3>
                            <p className="text-sm text-gray-600">{selectedItem.detail}</p>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> Fasilitas</h3>
                        <div className="space-y-3 mb-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {selectedItem.passed_pois && selectedItem.passed_pois.map((poiId) => {
                                const poi = pois.find(p => p.id === poiId);
                                if (!poi) return null;
                                return (
                                    <div key={poiId} className="relative pl-10 group cursor-pointer" onClick={() => onPoiClick(poi)}>
                                        <div className="absolute left-[13px] top-3 w-3.5 h-3.5 bg-white border-2 border-gray-300 rounded-full z-10"></div>
                                        <div className="p-3 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center gap-3 active:bg-gray-50">
                                            <div className="text-gray-400">{poi.icon}</div>
                                            <div><p className="text-sm font-bold text-gray-700">{poi.name}</p></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* --- KONTEN DETAIL POI --- */}
                {sidebarType === 'poi' && selectedItem && (
                    <>
                       <div className="flex items-center gap-4 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">{selectedItem.icon}</div>
                            <div><p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{selectedItem.category}</p><p className="font-bold text-gray-800">{selectedItem.name}</p></div>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Bus className="w-4 h-4 text-blue-600" /> Angkot Lewat Sini</h3>
                        <div className="space-y-3">
                            {selectedItem.passed_by.map(angkotId => {
                                const angkot = routes.find(r => r.id === angkotId);
                                if (!angkot) return null;
                                return (
                                    <div key={angkot.id} onClick={() => onRouteClick(angkot)} className="p-3 border border-gray-100 rounded-xl shadow-sm active:bg-gray-50 cursor-pointer bg-white">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Angkot {angkot.id}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 line-clamp-1">{angkot.name}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
};
export default RightSidebar;