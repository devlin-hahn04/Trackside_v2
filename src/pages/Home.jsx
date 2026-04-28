import { motion } from "framer-motion";
import F1Header from "../components/f1/F1header";
import DriversPodium from "../components/f1/DriversPodium";
import ConstructorsPodium from "../components/f1/ConstructorsPodium";
import NextRace from "../components/f1/NextRace";
import { useScraperData } from "../lib/scraperData";

export default function Home() {
  const { loading, error, drivers, constructors, nextRace } = useScraperData();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111318" }}>
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-[#E8002D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-heading">Loading F1 Data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111318" }}>
        <div className="text-white text-center">
          <p className="font-heading text-red-500 mb-2">Error loading data</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#E8002D] rounded-lg text-white text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#111318" }}
    >
      {/* Speed lines background */}
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
      {/* Top red bar */}
      <div className="h-[4px] bg-gradient-to-r from-[#E8002D] via-[#ff4444] to-[#E8002D]" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <F1Header />
        
        {/* Show top 3 on podium */}
        <DriversPodium driversData={drivers} />
        <ConstructorsPodium constructorsData={constructors} />
        <NextRace raceData={nextRace} />

        {/* Footer */}
        <div className="text-center pb-6">
          <span className="font-heading text-sm text-muted-foreground tracking-widest">
          </span>
        </div>
      </div>
    </div>
  );
}
