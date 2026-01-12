import React from 'react';
import { ShoppingBag, GraduationCap, Stethoscope, Bus, Building2, MapPin, Activity, Train } from 'lucide-react';

// ==============================================================================
// 1. IMPORT REAL JSON DATA
// Pastikan nama file sesuai dengan yang ada di folder assets/data/
// ==============================================================================
import RAW_ANGKOT from './data_angkot_v2_WITH_DISTANCE.json';
import RAW_SOI from './soi_final.json';
import RAW_LOOKUP from './rute_lookup.json';

// ==============================================================================
// 2. HELPER FUNCTIONS (UTILITIES)
// ==============================================================================

// Helper: Bikin ID Unik (Slug) dari Nama (Contoh: "Stasiun Bandung" -> "stasiun-bandung")
const generateId = (name) => {
    if (!name) return 'unknown';
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

// Helper: Mapping Warna Text ke Hex Code Modern
const getColorFromText = (colorText) => {
    const text = colorText ? colorText.toLowerCase() : '';
    if (text.includes('hijau')) return '#22c55e'; // Green 500
    if (text.includes('biru')) return '#3b82f6';  // Blue 500
    if (text.includes('kuning')) return '#eab308'; // Yellow 500
    if (text.includes('merah')) return '#ef4444';  // Red 500
    if (text.includes('ungu')) return '#a855f7';   // Purple 500
    if (text.includes('coklat') || text.includes('cokelat')) return '#92400e'; // Amber 800
    if (text.includes('abu')) return '#6b7280';    // Gray 500
    if (text.includes('hitam')) return '#1f2937';  // Gray 800
    if (text.includes('pink')) return '#ec4899';   // Pink 500
    if (text.includes('oranye') || text.includes('orange')) return '#f97316'; // Orange 500
    return '#64748b'; // Default Slate 500
};

// Helper: Pilih Icon berdasarkan Kategori
const getIconByCategory = (category) => {
    const props = { className: "w-4 h-4 text-white" };
    // Normalisasi text kategori biar ga sensitif huruf besar/kecil
    const cat = category ? category.toLowerCase() : '';

    if (cat.includes('mall') || cat.includes('belanja') || cat.includes('pasar')) return <ShoppingBag {...props} />;
    if (cat.includes('kampus') || cat.includes('sekolah') || cat.includes('pendidikan')) return <GraduationCap {...props} />;
    if (cat.includes('sakit') || cat.includes('kesehatan') || cat.includes('rs')) return <Stethoscope {...props} />;
    if (cat.includes('stasiun') || cat.includes('kereta')) return <Train {...props} />;
    if (cat.includes('terminal') || cat.includes('transport')) return <Bus {...props} />;
    if (cat.includes('simpang') || cat.includes('jalan')) return <Activity {...props} />;
    
    return <MapPin {...props} />;
};


// ==============================================================================
// 3. ADAPTERS (MENGUBAH JSON ASLI -> FORMAT UI)
// ==============================================================================

// --- ADAPTER SOI (POIS) ---
export const DUMMY_POIS = RAW_SOI.map((poi) => ({
    id: generateId(poi.nama),       // Generate ID biar konsisten
    name: poi.nama,
    lat: poi.lat,
    lng: poi.lng,
    category: poi.kategori,
    icon: getIconByCategory(poi.kategori),
    passed_by: poi.id_angkot_lewat  // Array ID Angkot [1, 5, etc]
}));


// --- ADAPTER ANGKOT (ROUTES) ---
export const DUMMY_ROUTES = RAW_ANGKOT.map((angkot) => {
    // Tentukan warna hex
    const hexColor = getColorFromText(angkot.warna);
    
    // Ambil list jalan (string) dan ubah jadi object (karena UI butuh object)
    // Cek apakah lintasan_jalan ada isinya
    const streetsData = angkot.forward?.lintasan_jalan 
        ? angkot.forward.lintasan_jalan.map(jalanName => ({ name: jalanName }))
        : [];

    return {
        id: angkot.id_angkot,
        name: `${angkot.id_angkot < 10 ? '0' + angkot.id_angkot : angkot.id_angkot} | ${angkot.jurusan}`, // Format: "05 | Cicaheum - Ledeng"
        
        // Styling
        color: `border-[${hexColor}]`, // Note: Tailwind mungkin butuh safelist untuk dynamic class ini
        bg_color: "bg-gray-50",
        text_color: "text-gray-700",
        hexColor: hexColor,
        
        detail: `Trayek rute ${angkot.jurusan} (${angkot.warna})`,
        
        // Geometry Map (Ambil dari forward geometry)
        // Format di JSON: [[lat, lng], [lat, lng]] -> Leaflet aman
        coordinates: angkot.forward?.geometry || [], 
        
        // List Nama Jalan
        streets: streetsData,

        // REVERSE LOOKUP: Cari POI mana saja yang dilewati angkot ini
        // (Karena di JSON angkot ga ada list POI, kita cek dari DUMMY_POIS)
        passed_pois: DUMMY_POIS
            .filter(poi => poi.passed_by.includes(angkot.id_angkot))
            .map(poi => poi.id)
    };
});


// --- ADAPTER LOOKUP TABLE ---
// Python Output Keys: "Nama Tempat Asli"
// UI Requirement Keys: "id-tempat-slug"
// Kita harus convert keys nya agar match dengan DUMMY_POIS.id
export const ROUTE_LOOKUP = {};

Object.keys(RAW_LOOKUP).forEach(asalName => {
    const asalId = generateId(asalName);
    ROUTE_LOOKUP[asalId] = {};

    const tujuanObj = RAW_LOOKUP[asalName];
    Object.keys(tujuanObj).forEach(tujuanName => {
        const tujuanId = generateId(tujuanName);
        ROUTE_LOOKUP[asalId][tujuanId] = tujuanObj[tujuanName];
    });
});