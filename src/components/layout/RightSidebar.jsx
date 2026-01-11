import React, { useState } from 'react';
import { X, ArrowRight, Bus, Building2, Map, ChevronUp, ChevronDown } from 'lucide-react';

const rightSidebar = ({ 
    selectedItem, sidebarType, searchResult, pois, routes, 
    onClose, onRouteClick, onPoiClick, onZoomRequest 
}) => {
    // State lokal untuk accordion jalan
    const [isStreetsExpanded, setIsStreetsExpanded] = useState(false);

    return (
        <aside className="w-96 h-full bg-white border-l border-gray-200 shadow-xl z-20 flex flex-col flex-shrink-0 animate-in slide-in-from-right duration-300">
            {/* Header Sidebar */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        {sidebarType === 'navigation' ? 'Hasil Pencarian' : (sidebarType === 'route' ? 'Informasi Trayek' : 'Detail Lokasi')}
                    </span>
                    <h2 className="font-bold text-gray-800 text-lg mt-2 leading-tight">
                        {sidebarType === 'navigation' ? 'Rute Perjalanan' : selectedItem.name}
                    </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                
                {/* --- KONTEN NAVIGASI --- */}
                {sidebarType === 'navigation' && searchResult && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="text-center w-1/3"><div className="text-xs text-gray-500 mb-1">Dari</div><div className="font-bold text-gray-800 text-sm leading-tight">{searchResult.from.name}</div></div>
                            <ArrowRight className="text-blue-400 w-5 h-5" />
                            <div className="text-center w-1/3"><div className="text-xs text-gray-500 mb-1">Ke</div><div className="font-bold text-gray-800 text-sm leading-tight">{searchResult.to.name}</div></div>
                        </div>
                        <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 py-2">
                            <div className="relative pl-6"><div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div><p className="text-sm font-bold text-gray-800">Titik Awal</p><p className="text-xs text-gray-500">{searchResult.from.name}</p></div>
                            {/* Step Angkot 1 */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center"><Bus className="w-2.5 h-2.5 text-blue-600"/></div>
                                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onRouteClick(searchResult.routes[0])}>
                                    <div className="text-xs font-bold text-blue-600 mb-1">Naik Angkot</div><div className="font-bold text-gray-800 text-sm">{searchResult.routes[0].name}</div><div className="text-xs text-gray-500 mt-1">Estimasi rute langsung</div>
                                </div>
                            </div>
                            {/* Transit Logic */}
                            {searchResult.type === 'transit' && (
                                <>
                                    <div className="relative pl-6"><div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-400 border-2 border-white"></div><p className="text-sm font-bold text-gray-800">Transit / Oper Angkot</p><p className="text-xs text-gray-500">Di {searchResult.transitPoint || "Titik Persimpangan"}</p></div>
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center"><Bus className="w-2.5 h-2.5 text-orange-600"/></div>
                                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onRouteClick(searchResult.routes[1])}>
                                            <div className="text-xs font-bold text-orange-600 mb-1">Oper ke Angkot</div><div className="font-bold text-gray-800 text-sm">{searchResult.routes[1].name}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="relative pl-6"><div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div><p className="text-sm font-bold text-gray-800">Tiba di Tujuan</p><p className="text-xs text-gray-500">{searchResult.to.name}</p></div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-xl text-xs text-yellow-800 border border-yellow-100"><span className="font-bold">Catatan:</span> Pastikan bertanya kepada supir sebelum naik.</div>
                    </div>
                )}

                {/* --- KONTEN DETAIL RUTE --- */}
                {sidebarType === 'route' && selectedItem && (
                    <>
                        <div className={`${selectedItem.bg_color} p-4 rounded-xl border ${selectedItem.color} mb-6`}>
                            <h3 className={`text-sm font-bold ${selectedItem.text_color} mb-1`}>Deskripsi Rute</h3>
                            <p className="text-sm text-gray-600">{selectedItem.detail}</p>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> Fasilitas Terlewati</h3>
                        <div className="space-y-3 mb-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {selectedItem.passed_pois && selectedItem.passed_pois.map((poiId) => {
                                const poi = pois.find(p => p.id === poiId);
                                if (!poi) return null;
                                return (
                                    <div key={poiId} className="relative pl-10 group cursor-pointer" onClick={() => onPoiClick(poi)}>
                                        <div className="absolute left-[13px] top-3 w-3.5 h-3.5 bg-white border-2 border-gray-300 rounded-full group-hover:border-blue-500 group-hover:scale-110 transition-all z-10"></div>
                                        <div className="p-3 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-3">
                                            <div className="text-gray-400 group-hover:text-blue-500">{poi.icon}</div>
                                            <div><p className="text-sm font-bold text-gray-700 group-hover:text-blue-700">{poi.name}</p><p className="text-[10px] text-gray-400">{poi.category}</p></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {/* Dropdown Nama Jalan */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden mt-4 ">
                            <button onClick={() => setIsStreetsExpanded(!isStreetsExpanded)} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Map className="w-4 h-4 text-gray-500" /> List Nama Jalan</span>
                                {isStreetsExpanded ? <ChevronUp className="w-4 h-4 text-gray-500"/> : <ChevronDown className="w-4 h-4 text-gray-500"/>}
                            </button>
                            {isStreetsExpanded && (
                                <div className="bg-white p-2">
                                    {selectedItem.streets && selectedItem.streets.map((street, idx) => (
                                        <div key={idx} className="px-4 py-3 text-sm text-gray-600 border-l-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all ml-2 cursor-pointer flex justify-between items-center group">
                                            {street.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* --- KONTEN DETAIL POI --- */}
                {sidebarType === 'poi' && selectedItem && (
                    <>
                        <div className="flex items-center gap-4 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">{selectedItem.icon}</div>
                            <div><p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{selectedItem.category}</p><p className="font-bold text-gray-800">{selectedItem.name}</p></div>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Bus className="w-4 h-4 text-blue-600" /> Angkot yang Lewat Sini</h3>
                        <div className="space-y-3">
                            {selectedItem.passed_by.map(angkotId => {
                                const angkot = routes.find(r => r.id === angkotId);
                                if (!angkot) return null;
                                return (
                                    <div key={angkot.id} onClick={() => onRouteClick(angkot)} className="p-3 border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group bg-white">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Angkot {angkot.id < 10 ? `0${angkot.id}` : angkot.id}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700 line-clamp-1">{angkot.name}</p>
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

export default rightSidebar;