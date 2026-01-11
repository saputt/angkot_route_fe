import React from 'react';
import { ShoppingBag, GraduationCap, Stethoscope, Bus, Building2, MapPin } from 'lucide-react';

// ==============================================================================
// BAGIAN 1: SIMULASI FILE JSON 1 (DATA ANGKOT)
// Nanti ini diganti dengan import data_angkot_v2_FINAL.json
// ==============================================================================
export const RAW_ANGKOT_DATA = [
  { 
    id: 1, 
    route_name: "01 | Abdul Muis - Kebon Kelapa", 
    color_hex: "#22c55e",
    description: "Rute utara ke selatan melewati balaikota.",
    list_jalan: [
        { name: "Jl. Merdeka", lat: -6.912, lng: 107.610 }, 
        { name: "Jl. Asia Afrika", lat: -6.920, lng: 107.612 }
    ],
    geometry: [ // Array LatLng
      [-6.912, 107.605], [-6.913, 107.606], [-6.914, 107.608], 
      [-6.915, 107.610], [-6.916, 107.612], [-6.920, 107.612], 
      [-6.922, 107.605]
    ]
  },
  { 
    id: 5, 
    route_name: "05 | Cicaheum - Ledeng", 
    color_hex: "#3b82f6",
    description: "Rute panjang melewati PVJ dan UPI.",
    list_jalan: [
        { name: "Jl. Diponegoro", lat: -6.900, lng: 107.615 }, 
        { name: "Jl. Sukajadi", lat: -6.895, lng: 107.598 }
    ],
    geometry: [
      [-6.885, 107.595], [-6.890, 107.596], [-6.895, 107.598], 
      [-6.900, 107.605], [-6.910, 107.610], [-6.914, 107.602], 
      [-6.917, 107.619]
    ]
  },
  { 
    id: 15, 
    route_name: "15 | Margahayu - Ledeng", 
    color_hex: "#f97316",
    description: "Melewati jalan Soekarno Hatta.",
    list_jalan: [
        { name: "Jl. Soekarno Hatta", lat: -6.945, lng: 107.650 }
    ],
    geometry: [
      [-6.945, 107.650], [-6.940, 107.640], [-6.935, 107.630], 
      [-6.930, 107.620], [-6.925, 107.615], [-6.906, 107.610], 
      [-6.896, 107.598]
    ]
  },
  { 
    id: 17, 
    route_name: "17 | Dago - Pasar Induk", 
    color_hex: "#a855f7",
    description: "Rute pasar.",
    list_jalan: [
        { name: "Jl. Ir H Djuanda", lat: -6.890, lng: 107.610 }
    ],
    geometry: [
      [-6.890, 107.610], [-6.900, 107.608], [-6.914, 107.601]
    ]
  },
];

// ==============================================================================
// BAGIAN 2: SIMULASI FILE JSON 2 (DATA SOI / TEMPAT)
// Nanti ini diganti dengan import soi_final.json
// Perhatikan: Tidak ada Icon Component di sini, hanya String "category"
// ==============================================================================
export const RAW_SOI_DATA = [
  { id: 'pvj', name: 'Paris Van Java (PVJ)', lat: -6.8894, lng: 107.5959, category: 'Mall', passed_by_angkot: [5] },
  { id: 'itb', name: 'Institut Teknologi Bandung', lat: -6.8915, lng: 107.6107, category: 'Kampus', passed_by_angkot: [5, 17] },
  { id: 'rshs', name: 'RS Hasan Sadikin', lat: -6.8966, lng: 107.5978, category: 'Kesehatan', passed_by_angkot: [5, 15] },
  { id: 'stasiun', name: 'Stasiun Bandung', lat: -6.9147, lng: 107.6016, category: 'Transportasi', passed_by_angkot: [1, 5, 17] },
  { id: 'bec', name: 'Istana BEC', lat: -6.906, lng: 107.610, category: 'Mall', passed_by_angkot: [1, 15] },
];

// ==============================================================================
// BAGIAN 3: SIMULASI FILE JSON 3 (LOOKUP TABLE / PRE-COMPUTED)
// Nanti ini diganti dengan import rute_lookup.json
// Format: { "ID_ASAL": { "ID_TUJUAN": [LIST_ANGKOT_YANG_BISA_DIPAKAI] } }
// ==============================================================================
export const RAW_LOOKUP_TABLE = {
    "pvj": {
        "itb": [5], // Dari PVJ ke ITB bisa naik 05
        "rshs": [5],
        "stasiun": [5],
        "bec": [] // Kosong artinya tidak ada rute langsung (perlu transit)
    },
    "stasiun": {
        "pvj": [5],
        "itb": [5, 17], // Bisa naik 05 atau 17
        "bec": [1]
    },
    "bec": {
        "stasiun": [1],
        "rshs": [15]
    }
    // ... dan seterusnya untuk semua kombinasi (hasil generate python kamu nanti)
};


// ==============================================================================
// BAGIAN 4: HELPER & EXPORT FINAL
// Bagian ini bertugas "Menggabungkan" data mentah di atas agar siap dipakai App.jsx
// ==============================================================================

// Helper untuk mengubah String Kategori menjadi Icon React
const getIconByCategory = (category) => {
    const props = { className: "w-4 h-4 text-white" };
    switch (category) {
        case 'Mall': return <ShoppingBag {...props} />;
        case 'Kampus': return <GraduationCap {...props} />;
        case 'Kesehatan': return <Stethoscope {...props} />;
        case 'Transportasi': return <Bus {...props} />;
        default: return <MapPin {...props} />;
    }
};

// 1. Export Data POI yang sudah dipasangi Icon (Biar App.jsx ga error)
export const DUMMY_POIS = RAW_SOI_DATA.map(poi => ({
    ...poi,
    icon: getIconByCategory(poi.category),
    passed_by: poi.passed_by_angkot // Mapping nama field biar sesuai App.jsx
}));

// 2. Export Data Routes (Mapping nama field biar sesuai App.jsx)
export const DUMMY_ROUTES = RAW_ANGKOT_DATA.map(r => ({
    id: r.id,
    name: r.route_name,
    color: `border-[${r.color_hex}]`, // Hack Tailwind dynamic class (caution)
    bg_color: "bg-gray-50",
    text_color: "text-gray-700",
    hexColor: r.color_hex,
    detail: r.description,
    streets: r.list_jalan,
    coordinates: r.geometry,
    // Kita ambil data passed_pois secara dinamis dari RAW_SOI_DATA
    // (Logic ini nanti sebenernya tugas Python, tapi kita simulasi di sini)
    passed_pois: RAW_SOI_DATA
        .filter(poi => poi.passed_by_angkot.includes(r.id))
        .map(poi => poi.id)
}));

// 3. Export Lookup Table
export const ROUTE_LOOKUP = RAW_LOOKUP_TABLE;