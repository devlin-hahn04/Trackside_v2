import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useScraperData } from "../lib/scraperData";
import LogoDropdown from "../components/ui/LogoDropdown";
import F1Header from "../components/f1/F1header";

export default function DriversStandings() {
  const { loading, error, drivers, driverPhotosMap } = useScraperData();

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

  // Helper to get driver photo or fallback
  const getDriverPhoto = (driverName) => {
    const photo = driverPhotosMap?.get(driverName);
    if (photo) return photo;
    // Fallback: try to find by last name only
    const lastName = driverName.split(' ').pop();
    return driverPhotosMap?.get(lastName) || null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#111318" }}>
      {/* Speed lines background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(-8deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 62px)`,
        }}
      />
      {/* Top red bar */}
      <div className="h-[4px] bg-gradient-to-r from-[#E8002D] via-[#ff4444] to-[#E8002D]" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Logo and Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1" />
          <LogoDropdown />
        </div>
        
        <F1Header />


        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wider leading-tight">
          DRIVER<br />STANDINGS
        </h2>

        <div className="space-y-2.5">
          {drivers.map((driver, i) => {
            const driverPhoto = getDriverPhoto(driver.name);
            const lastName = driver.name.split(' ').pop() || driver.name;
            
            return (
              <motion.div
                key={driver.name}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.45, ease: "easeOut" }}
                className="relative overflow-hidden rounded-lg flex items-stretch"
                style={{ background: "#16191f", minHeight: "88px" }}
              >
                {/* Angled colored stripes on the left */}
                <div className="relative shrink-0" style={{ width: "56px" }}>
                  <div 
                    className="absolute inset-0" 
                    style={{ background: driver.color, clipPath: "polygon(0 0, 75% 0, 100% 100%, 0 100%)" }} 
                  />
                  <div 
                    className="absolute inset-0" 
                    style={{ background: driver.color, clipPath: "polygon(75% 0, 82% 0, 107% 100%, 100% 100%)", opacity: 0.85 }} 
                  />
                </div>

                {/* Position */}
                <div className="flex items-center justify-center shrink-0 px-3" style={{ background: "rgba(0,0,0,0.25)", minWidth: "64px" }}>
                  <span className="font-heading font-black text-white tracking-tighter" style={{ fontSize: "32px", lineHeight: 1 }}>
                    P{driver.position}
                  </span>
                </div>

                {/* Driver photo */}
                {driverPhoto && (
                  <div className="flex items-center justify-center shrink-0 px-2">
                    <img 
                      src={driverPhoto} 
                      alt={driver.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                {/* Driver info - only big name */}
                <div className="flex-1 flex flex-col justify-center px-3 py-3">
                  <p className="font-heading font-black text-white text-lg sm:text-xl leading-tight tracking-wide">{lastName.toUpperCase()}</p>
                  <p className="font-heading text-[9px] text-white/35 tracking-widest mt-0.5">{driver.team}</p>
                </div>

                {/* Points */}
                <div className="flex items-center justify-end px-4 shrink-0">
                  <p className="font-heading font-black text-white" style={{ fontSize: "24px", lineHeight: 1 }}>
                    {driver.points}
                    <span className="text-xs font-normal text-white/50 ml-1">pts</span>
                  </p>
                </div>

                {/* Speed lines overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none" 
                  style={{ backgroundImage: `repeating-linear-gradient(-12deg, transparent, transparent 12px, rgba(255,255,255,0.015) 12px, rgba(255,255,255,0.015) 13px)` }} 
                />

                {/* Bottom accent */}
                <div 
                  className="absolute bottom-0 left-0 h-[2px]" 
                  style={{ background: `linear-gradient(90deg, ${driver.color}, ${driver.color}80, transparent)`, width: "60%" }} 
                />
              </motion.div>
            );
          })}
        </div>

        <div className="text-center pb-6">
          <span className="font-heading text-sm text-muted-foreground tracking-widest">
          </span>
        </div>
      </div>
    </div>
  );
}
