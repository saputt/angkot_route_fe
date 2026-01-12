import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { MapPin, Activity, Share2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// IMPORT DATA DARI ADAPTER
import { DUMMY_ROUTES, DUMMY_POIS } from '../../assets/data/mockData.jsx';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50, damping: 20 } }
  };

  // ===========================================================================
  // 1. LOGIC: MENGOLAH DATA REAL (Leaderboard, Chart, Summary)
  // ===========================================================================
  
  const stats = useMemo(() => {
    // A. LEADERBOARD: Urutkan angkot berdasarkan jumlah POI yang dilewati
    const sortedRoutes = [...DUMMY_ROUTES]
        .map(r => ({
            ...r,
            poiCount: r.passed_pois ? r.passed_pois.length : 0 // Hitung panjang array
        }))
        .sort((a, b) => b.poiCount - a.poiCount) // Urutkan descending
        .slice(0, 5); // Ambil Top 5

    // Hitung persentase bar untuk leaderboard (Max count sebagai 100%)
    const maxCount = sortedRoutes[0]?.poiCount || 1;
    const leaderboard = sortedRoutes.map((r, idx) => ({
        rank: idx + 1,
        route: r.name,
        count: r.poiCount,
        pct: (r.poiCount / maxCount) * 100,
        // Warna dynamic berdasarkan rank
        color: idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-purple-500" : idx === 2 ? "bg-green-500" : "bg-orange-500"
    }));

    // B. CHART KATEGORI: Hitung jumlah POI per kategori
    const categoryCounts = {
        'Mall': 0, 'Kampus': 0, 'Kesehatan': 0, 'Transportasi': 0, 'Lainnya': 0
    };

    DUMMY_POIS.forEach(poi => {
        const cat = poi.category.toLowerCase();
        if (cat.includes('mall') || cat.includes('belanja')) categoryCounts['Mall']++;
        else if (cat.includes('kampus') || cat.includes('sekolah') || cat.includes('pendidikan')) categoryCounts['Kampus']++;
        else if (cat.includes('sakit') || cat.includes('sehat') || cat.includes('rs')) categoryCounts['Kesehatan']++;
        else if (cat.includes('terminal') || cat.includes('stasiun') || cat.includes('transport')) categoryCounts['Transportasi']++;
        else categoryCounts['Lainnya']++;
    });

    // C. SUMMARY CARDS
    // 1. Total Titik
    const totalPois = DUMMY_POIS.length;
    
    // 2. Hotspot (Titik paling banyak dilewati angkot)
    const hotspot = DUMMY_POIS.reduce((prev, current) => {
        return (prev.passed_by.length > current.passed_by.length) ? prev : current
    }, DUMMY_POIS[0]);

    // 3. Rata-rata Konektivitas (Avg POI per Rute)
    const totalConnections = DUMMY_ROUTES.reduce((acc, curr) => acc + (curr.passed_pois?.length || 0), 0);
    const avgConnectivity = (totalConnections / (DUMMY_ROUTES.length || 1)).toFixed(1);

    return { leaderboard, categoryCounts, totalPois, hotspot, avgConnectivity };
  }, []);


  // ===========================================================================
  // 2. CONFIG CHART.JS
  // ===========================================================================
  const chartData = {
    labels: ['Mall', 'Kampus', 'Kesehatan', 'Transport', 'Lainnya'],
    datasets: [{
        data: [
            stats.categoryCounts['Mall'], 
            stats.categoryCounts['Kampus'], 
            stats.categoryCounts['Kesehatan'], 
            stats.categoryCounts['Transportasi'],
            stats.categoryCounts['Lainnya']
        ],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e', '#94a3b8'],
        borderWidth: 0,
        hoverOffset: 10
    }],
  };

  const chartOptions = {
    cutout: '75%', responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 15, font: { size: 10, family: 'sans-serif' } } }
    }
  };


  // ===========================================================================
  // 3. RENDER UI
  // ===========================================================================
  return (
    <motion.div 
      className="w-full h-full px-6 md:px-12 py-10 flex flex-col bg-gray-50 overflow-y-auto md:overflow-hidden"
      variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 flex-shrink-0">
        <div className="mb-4 md:mb-0">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Analytics Overview</h2>
           <p className="text-gray-500 mt-2 text-sm md:text-lg">Data diolah secara real-time dari {stats.totalPois} titik pantau</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-xs md:text-sm font-medium text-gray-600">
           Status: Real Data Integration
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 flex-1 min-h-0 pb-10 md:pb-0">
        
        {/* KOLOM 1: LEADERBOARD REAL */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col h-auto md:h-full overflow-hidden">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-800 text-lg md:text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600"/> Top Coverage
             </h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
            {stats.leaderboard.map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm md:text-base font-bold text-gray-700 truncate max-w-[70%]">
                    <span className="mr-2 text-gray-300 font-mono">#{item.rank}</span> {item.route}
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">{item.count} POI</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 md:h-3 overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.pct}%` }} transition={{ duration: 1 }} className={`${item.color} h-full rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* KOLOM 2: DONUT CHART REAL */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col h-[400px] md:h-full">
          <h3 className="font-bold text-gray-800 mb-2 text-lg md:text-xl text-center">Distribusi Kategori</h3>
          <div className="flex-1 relative w-full flex items-center justify-center p-2">
             <div className="w-full max-w-[250px] md:max-w-[350px] aspect-square relative">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl md:text-5xl font-extrabold text-gray-800">100%</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* KOLOM 3: CARDS REAL */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 h-full">
          {[
            { label: "Total Data", val: stats.totalPois, sub: "Titik POI", icon: MapPin, color: "text-gray-300" },
            { label: "Hub Tersibuk", val: stats.hotspot?.name || "N/A", sub: `${stats.hotspot?.passed_by.length || 0} Rute Terhubung`, icon: Activity, color: "text-blue-600 bg-blue-500", textCol: "text-white" },
            { label: "Konektivitas", val: stats.avgConnectivity, sub: "Avg. POI per Trayek", icon: Share2, color: "text-white bg-gray-800" }
          ].map((c, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 flex items-center justify-between flex-1">
              <div className="flex flex-col justify-center">
                <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">{c.label}</p>
                {/* Handle text panjang untuk nama Hub */}
                <h4 className={`${c.val.toString().length > 15 ? 'text-lg md:text-xl' : 'text-2xl md:text-5xl'} font-extrabold text-gray-800 leading-tight`}>{c.val}</h4>
                <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">{c.sub}</p>
              </div>
              <div className={`h-16 w-16 md:h-24 md:w-24 flex-shrink-0 rounded-2xl flex items-center justify-center ${c.textCol || "text-gray-300"} ${c.color.includes('bg-') ? c.color : 'bg-gray-50'}`}>
                <c.icon className="w-8 h-8 md:w-10 md:h-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
export default Dashboard;