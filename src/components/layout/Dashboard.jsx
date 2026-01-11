import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { MapPin, Activity, Share2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const chartData = {
    labels: ['Mall', 'Kampus', 'Kesehatan', 'Transport'], // Label dipersingkat buat mobile
    datasets: [{
        data: [30, 25, 20, 25],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e'],
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

  const leaderboardData = [
    { rank: 1, route: "05 | Cicaheum - Ledeng", count: 18, pct: 90, color: "bg-blue-500" },
    { rank: 2, route: "17 | Dago - Pasar Induk", count: 14, pct: 75, color: "bg-purple-500" },
    { rank: 3, route: "01 | Abd Muis - Kb. Kelapa", count: 11, pct: 60, color: "bg-green-500" },
    { rank: 4, route: "15 | Margahayu - Ledeng", count: 7, pct: 40, color: "bg-orange-500" },
  ];

  return (
    <motion.div 
      // UBAH: px-6 (Mobile) -> md:px-12 (Desktop)
      className="w-full h-full px-6 md:px-12 py-10 flex flex-col bg-gray-50 overflow-y-auto md:overflow-hidden"
      variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 flex-shrink-0">
        <div className="mb-4 md:mb-0">
           {/* Font size menyesuaikan layar */}
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Analytics Overview</h2>
           <p className="text-gray-500 mt-2 text-sm md:text-lg">Statistik konektivitas angkot Kota Bandung</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-xs md:text-sm font-medium text-gray-600">
           Update: Jan 2026
        </div>
      </motion.div>

      {/* UBAH: grid-cols-1 (Mobile) -> lg:grid-cols-12 (Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 flex-1 min-h-0 pb-10 md:pb-0">
        
        {/* KOLOM 1 */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col h-auto md:h-full overflow-hidden">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-800 text-lg md:text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600"/> Top Coverage
             </h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
            {leaderboardData.map((item, idx) => (
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

        {/* KOLOM 2 (Chart) */}
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

        {/* KOLOM 3 (Cards) */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 h-full">
          {[
            { label: "Total Data", val: "50", sub: "Titik POI", icon: MapPin, color: "text-gray-300" },
            { label: "Hub Tersibuk", val: "Stasiun", sub: "8 Rute", icon: Activity, color: "text-blue-600 bg-blue-500", textCol: "text-white" },
            { label: "Konektivitas", val: "5.4", sub: "Avg. per Trayek", icon: Share2, color: "text-white bg-gray-800" }
          ].map((c, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 flex items-center justify-between flex-1">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">{c.label}</p>
                <h4 className="text-2xl md:text-5xl font-extrabold text-gray-800">{c.val}</h4>
                <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">{c.sub}</p>
              </div>
              <div className={`h-16 w-16 md:h-24 md:w-24 rounded-2xl flex items-center justify-center ${c.textCol || "text-gray-300"} ${c.color.includes('bg-') ? c.color : 'bg-gray-50'}`}>
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