import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { MapPin, Activity, Share2, TrendingUp } from 'lucide-react';
// IMPORT FRAMER MOTION
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  
  // --- KONFIGURASI ANIMASI ---
  // Container: Mengatur jeda antar anak elemen (stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  // Item: Animasi muncul dari bawah ke atas
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 50, damping: 20 } 
    }
  };

  // --- DATA CHART & LEADERBOARD (SAMA SEPERTI SEBELUMNYA) ---
  const chartData = {
    labels: ['Mall/Perbelanjaan', 'Pendidikan/Kampus', 'Kesehatan', 'Transportasi Publik'],
    datasets: [{
        data: [30, 25, 20, 25],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e'],
        borderWidth: 0,
        hoverOffset: 10
    }],
  };

  const chartOptions = {
    cutout: '75%', // Donut lebih tipis biar modern
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 11, family: 'sans-serif' } }
      }
    }
  };

  const leaderboardData = [
    { rank: 1, route: "05 | Cicaheum - Ledeng", count: 18, pct: 90, color: "bg-blue-500" },
    { rank: 2, route: "17 | Dago - Pasar Induk", count: 14, pct: 75, color: "bg-purple-500" },
    { rank: 3, route: "01 | Abd Muis - Kb. Kelapa", count: 11, pct: 60, color: "bg-green-500" },
    { rank: 4, route: "15 | Margahayu - Ledeng", count: 7, pct: 40, color: "bg-orange-500" },
    { rank: 5, route: "02 | Ledeng - Kalapa", count: 4, pct: 20, color: "bg-gray-400" },
    { rank: 6, route: "06 | Ciroyom - Cicaheum", count: 3, pct: 15, color: "bg-gray-300" },
  ];

  return (
    // UBAH WRAPPER JADI motion.div
    <motion.div 
      className="w-full h-full px-12 py-10 flex flex-col bg-gray-50 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Animasi jalan saat elemen masuk layar (scroll)
      viewport={{ once: true, amount: 0.2 }} // Animasi sekali saja
    >
      
      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-8 flex-shrink-0">
        <div>
           <h2 className="text-4xl font-bold text-gray-800 tracking-tight">Analytics Overview</h2>
           <p className="text-gray-500 mt-2 text-lg">Statistik konektivitas dan persebaran rute angkot Kota Bandung</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
           Last Update: Januari 2026
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* KOLOM 1: LEADERBOARD */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col h-full overflow-hidden hover:shadow-2xl transition-shadow duration-500">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600"/> Top Coverage
             </h3>
             <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">By SOI Count</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
            {leaderboardData.map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-base font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                    <span className="mr-3 text-gray-300 font-mono">#{item.rank}</span> {item.route}
                  </span>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">{item.count} Points</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.pct}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} // Animasi progress bar jalan
                    className={`${item.color} h-full rounded-full`} 
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* KOLOM 2: DONUT CHART */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
          <h3 className="font-bold text-gray-800 mb-2 text-xl text-center">Distribusi Kategori SOI</h3>
          <p className="text-gray-400 text-sm text-center mb-8">Proporsi jenis fasilitas publik yang terlayani</p>
          
          <div className="flex-1 relative w-full flex items-center justify-center p-4">
             <div className="w-full max-w-[350px] aspect-square relative">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-5xl font-extrabold text-gray-800 tracking-tighter">100%</span>
                    <span className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">Coverage</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* KOLOM 3: SUMMARY CARDS (STACKED) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          
          {/* Menggunakan variants itemVariants untuk setiap kartu agar muncul berurutan */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-center justify-between flex-1 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-default">
            <div className="flex flex-col justify-center h-full">
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Total Data</p>
              <h4 className="text-7xl font-extrabold text-gray-800 tracking-tight">50</h4>
              <p className="text-gray-500 font-medium mt-2">Titik Point of Interest</p>
            </div>
            <div className="h-24 w-24 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
              <MapPin className="w-10 h-10" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-center justify-between flex-1 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-default">
            <div className="flex flex-col justify-center h-full">
              <p className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2">Most Connected Hub</p>
              <h4 className="text-3xl font-bold text-gray-800 leading-tight">Stasiun<br/>Bandung</h4>
              <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                 <Activity className="w-4 h-4 text-blue-600"/>
                 <span className="text-sm font-bold text-blue-700">8 Rute Terhubung</span>
              </div>
            </div>
            <div className="h-24 w-24 bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Activity className="w-10 h-10" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-center justify-between flex-1 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-default">
             <div className="flex flex-col justify-center h-full">
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Connectivity Rate</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-6xl font-extrabold text-gray-800 tracking-tight">5.4</h4>
              </div>
              <p className="text-gray-500 font-medium mt-2">Avg. SOI per Trayek</p>
            </div>
            <div className="h-24 w-24 bg-gray-800 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-gray-300">
              <Share2 className="w-10 h-10" />
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;