import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar as CalendarIcon, CheckCircle2, Clock } from "lucide-react";
import { useScraperData } from "../lib/scraperData";
import LogoDropdown from "../components/ui/LogoDropdown";
import F1Header from "../components/f1/F1header";

const statusConfig = {
  completed: { label: "COMPLETED", color: "#ffffff30", textColor: "#ffffff50", accent: "#ffffff20" },
  next: { label: "NEXT RACE", color: "#E8002D", textColor: "#ffffff", accent: "#E8002D" },
  upcoming: { label: "UPCOMING", color: "#3671C6", textColor: "#ffffff", accent: "#3671C6" },
};

export default function Calendar() {
  const { loading, error, fullSchedule = [] } = useScraperData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111318" }}>
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-[#E8002D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-heading">Loading Calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111318" }}>
        <div className="text-white text-center">
          <p className="font-heading text-red-500 mb-2">Error loading calendar</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Get today's date for comparison
  const today = new Date();
  
  // Find the next race index to determine status
  let nextRaceIndex = -1;
  for (let i = 0; i < fullSchedule.length; i++) {
    const raceDate = new Date(fullSchedule[i].date);
    if (raceDate > today) {
      nextRaceIndex = i;
      break;
    }
  }

  // Add status to each race
  const racesWithStatus = fullSchedule.map((race, index) => {
    const raceDate = new Date(race.date);
    let status;
    if (raceDate < today) {
      status = "completed";
    } else if (index === nextRaceIndex) {
      status = "next";
    } else {
      status = "upcoming";
    }
    return { ...race, status };
  });

  const completedCount = racesWithStatus.filter(r => r.status === "completed").length;
  const totalCount = racesWithStatus.length;

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


        {/* Title + progress */}
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wider leading-tight">
            RACE<br />CALENDAR
          </h2>
          <div className="text-right">
            <p className="font-heading text-3xl font-black text-white">{completedCount}<span className="text-white/40">/{totalCount}</span></p>
            <p className="font-heading text-[9px] text-white/40 tracking-widest">RACES COMPLETE</p>
          </div>
        </div>

        {/* Season progress bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#0a0c10" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : 0 }}
            transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #E8002D, #ff4444)" }}
          />
        </div>

        {/* Race list */}
        <div className="space-y-2.5">
          {racesWithStatus.map((race, i) => {
            const cfg = statusConfig[race.status];
            const isNext = race.status === "next";
            return (
              <motion.div
                key={race.round}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.4, ease: "easeOut" }}
                className="relative overflow-hidden rounded-lg flex items-stretch"
                style={{
                  background: isNext ? "#1e1015" : "#16191f",
                  minHeight: "72px",
                  border: `1px solid ${cfg.accent}${isNext ? "60" : "20"}`,
                }}
              >
                {/* Round number tab */}
                <div
                  className="relative shrink-0 flex flex-col items-center justify-center px-3"
                  style={{
                    background: `${cfg.accent}20`,
                    borderRight: `2px solid ${cfg.accent}40`,
                    minWidth: "52px",
                  }}
                >
                  <span className="font-heading text-[9px] text-white/30 tracking-widest">RND</span>
                  <span className="font-heading text-xl font-black" style={{ color: cfg.accent === "#ffffff20" ? "#ffffff40" : cfg.accent }}>
                    {String(race.round).padStart(2, "0")}
                  </span>
                </div>

                {/* Race info */}
                <div className="flex-1 flex flex-col justify-center px-4 py-2.5 gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-heading text-sm font-black tracking-wide ${race.status === "completed" ? "text-white/40" : "text-white"}`}>
                      {race.name}
                    </span>
                    {isNext && (
                      <div className="flex items-center gap-1 bg-[#E8002D] px-1.5 py-0.5 rounded-sm">
                        <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        <span className="font-heading text-[8px] font-bold text-white tracking-widest">NEXT</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 font-heading text-[10px] text-white/35 tracking-wide">
                      <MapPin className="w-2.5 h-2.5" />
                      {race.location}
                    </span>
                  </div>
                  <span className="font-heading text-[9px] text-white/25 tracking-wider">{race.circuit}</span>
                </div>

                {/* Date + status */}
                <div className="flex flex-col items-end justify-center px-3 shrink-0 gap-1">
                  <div className="flex items-center gap-1.5">
                    {race.status === "completed"
                      ? <CheckCircle2 className="w-3 h-3 text-white/25" />
                      : <Clock className="w-3 h-3" style={{ color: cfg.accent }} />
                    }
                    <span className="font-heading text-[9px] tracking-widest" style={{ color: race.status === "completed" ? "#ffffff30" : cfg.accent }}>
                      {cfg.label}
                    </span>
                  </div>
                  <span className="font-heading text-[10px] font-bold text-white/50">{race.date}</span>
                </div>

                {/* Speed lines overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: `repeating-linear-gradient(-12deg, transparent, transparent 12px, rgba(255,255,255,0.012) 12px, rgba(255,255,255,0.012) 13px)` }}
                />

                {/* Bottom accent for upcoming/next races */}
                {race.status !== "completed" && (
                  <div
                    className="absolute bottom-0 left-12 h-[2px]"
                    style={{ right: 0, background: `linear-gradient(90deg, ${cfg.accent}60, transparent)` }}
                  />
                )}
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
