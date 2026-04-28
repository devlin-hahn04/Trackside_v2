import { motion } from "framer-motion";
import { Flag } from "lucide-react";

export default function ConstructorsPodium({ constructorsData = [] }) {
  // If no data, show placeholder
  if (!constructorsData || constructorsData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading constructor standings...</p>
      </div>
    );
  }

  // Get top 3 constructors
  const top3 = constructorsData.slice(0, 3);
  const max = top3[0]?.points || 1;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xs sm:text-sm md:text-base tracking-widest uppercase text-foreground">
          Constructor Standings
        </h2>
      </div>

      <div className="flex flex-col justify-center flex-1 space-y-5 sm:space-y-7">
        {top3.map((team, i) => {
          const barWidth = (team.points / max) * 100;
          return (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.14, duration: 0.5, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 sm:gap-5">
                <span
                  className="font-heading text-xl sm:text-2xl md:text-3xl font-black w-7 sm:w-9 text-right shrink-0"
                  style={{ color: team.color }}
                >
                  {team.position}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1.5 gap-2">
                    <span className="font-heading text-[10px] sm:text-xs md:text-sm tracking-wider text-foreground truncate">
                      <span className="sm:hidden">{team.name.substring(0, 3).toUpperCase()}</span>
                      <span className="hidden sm:inline">{team.name}</span>
                    </span>
                    <span className="font-heading text-xs sm:text-sm md:text-base font-bold shrink-0" style={{ color: team.color }}>
                      {team.points}
                      <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground ml-1 font-body font-normal">PTS</span>
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: 0.6 + i * 0.14, duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
