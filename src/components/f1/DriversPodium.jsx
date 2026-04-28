import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const podiumHeights = {
  1: "h-28 sm:h-36 md:h-48",
  2: "h-20 sm:h-28 md:h-36",
  3: "h-14 sm:h-20 md:h-28",
};

export default function DriversPodium({ driversData = [] }) {
  // If no data, show placeholder
  if (!driversData || driversData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading driver standings...</p>
      </div>
    );
  }

  // Get top 3 drivers and format for podium
  const top3 = driversData.slice(0, 3);
  
  // Create podium order: 2nd (index 1), 1st (index 0), 3rd (index 2)
  const orderedDrivers = [
    top3[1], // 2nd place
    top3[0], // 1st place
    top3[2]  // 3rd place
  ].filter(driver => driver); // Filter out undefined if less than 3 drivers

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xs sm:text-sm md:text-base tracking-widest uppercase text-foreground">
          Driver Standings
        </h2>
      </div>

      <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6">
        {orderedDrivers.map((driver, i) => (
          <motion.div
            key={driver.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center flex-1 min-w-0"
          >
            <div className="mb-3 sm:mb-4 text-center w-full px-1">
              <div
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center text-sm sm:text-lg md:text-xl font-heading font-bold text-white border-2"
                style={{ borderColor: driver.color, background: `${driver.color}25` }}
              >
                {driver.position === 1 ? "1" : driver.position === 2 ? "2" : "3"}
              </div>
              <p className="font-heading text-[9px] sm:text-xs md:text-sm font-bold text-foreground tracking-wide leading-tight">
                <span className="sm:hidden">{driver.name.split(" ").slice(-1)[0]}</span>
                <span className="hidden sm:inline">{driver.name}</span>
              </p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 font-body truncate">
                {driver.team}
              </p>
              <p className="font-heading text-sm sm:text-base md:text-xl font-bold mt-1" style={{ color: driver.color }}>
                {driver.points}
                <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground ml-0.5 font-body font-normal">PTS</span>
              </p>
            </div>

            <div
              className={`w-full ${podiumHeights[driver.position]} rounded-t-lg relative overflow-hidden`}
              style={{
                background: `linear-gradient(180deg, ${driver.color}40 0%, ${driver.color}10 100%)`,
                borderTop: `3px solid ${driver.color}`,
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="font-heading text-2xl sm:text-4xl md:text-6xl font-black opacity-20 text-white select-none">
                  P{driver.position}
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
