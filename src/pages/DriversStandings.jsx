import { motion } from "framer-motion";
import { useScraperData } from "../lib/scraperData";
import LogoDropdown from "../components/ui/LogoDropdown";
import F1Header from "../components/f1/F1header";

export default function DriversStandings() {
  const { loading, error, drivers } = useScraperData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111318" }}>
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-[#E8002D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-heading">Loading Driver Standings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111318" }}>
        <div className="text-white text-center">
          <p className="font-heading text-red-500 mb-2">Error loading data</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#111318" }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -8deg,
            transparent,
            transparent 60px,
            rgba(255,255,255,0.03) 60px,
            rgba(255,255,255,0.03) 62px
          )`,
        }}
      />
      
      <div className="h-[4px] bg-gradient-to-r from-[#E8002D] via-[#ff4444] to-[#E8002D]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex justify-end mb-4">
          <LogoDropdown />
        </div>
        
        <F1Header />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-wider mb-6">
            DRIVER STANDINGS
          </h2>
          
          <div className="bg-[#1a1d24] rounded-lg overflow-hidden border border-[#E8002D]/20">
            <table className="w-full">
              <thead className="bg-[#E8002D]/10 border-b border-[#E8002D]/30">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-heading text-sm">POS</th>
                  <th className="px-6 py-4 text-left text-white font-heading text-sm">DRIVER</th>
                  <th className="px-6 py-4 text-left text-white font-heading text-sm">TEAM</th>
                  <th className="px-6 py-4 text-right text-white font-heading text-sm">POINTS</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, index) => (
                  <motion.tr
                    key={driver.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-[#E8002D]/10 hover:bg-[#E8002D]/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-heading">
                      <span 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold"
                        style={{ backgroundColor: driver.color + '20', color: driver.color }}
                      >
                        {driver.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{driver.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: driver.color }}
                        />
                        <span className="text-gray-300 text-sm">{driver.team}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white font-bold text-xl">{driver.points}</span>
                      <span className="text-gray-400 text-sm ml-1">pts</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
