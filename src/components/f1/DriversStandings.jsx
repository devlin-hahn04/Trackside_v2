// src/components/f1/DriversStandings.jsx
import { motion } from "framer-motion";

export default function DriverStandings({ driversData = [] }) {
  if (!driversData || driversData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading driver standings...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wider mb-5 leading-tight">
        DRIVER<br />STANDINGS
      </h2>
      <div className="space-y-3">
        {driversData.map((driver, i) => (
          <motion.div
            key={driver.name}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.13, duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-lg flex items-stretch"
            style={{ background: "#16191f", minHeight: "100px" }}
          >
            {/* Angled colored stripes on the left */}
            <div className="relative shrink-0" style={{ width: "60px" }}>
              <div
                className="absolute inset-0"
                style={{
                  background: driver.color || "#E8002D",
                  clipPath: "polygon(0 0, 75% 0, 100% 100%, 0 100%)",
                }}
              />
            </div>

            {/* Position */}
            <div
              className="flex items-center justify-center shrink-0 px-4"
              style={{ background: "rgba(0,0,0,0.25)", minWidth: "72px" }}
            >
              <span
                className="font-heading font-black text-white tracking-tighter"
                style={{ fontSize: "38px", lineHeight: 1 }}
              >
                P{driver.position}
              </span>
            </div>

            {/* Driver info */}
            <div className="flex-1 flex flex-col justify-center px-3 py-3">
              <p className="font-heading text-[10px] text-white/40 tracking-widest">
                {driver.name.split(' ')[0] || driver.name}
              </p>
              <p className="font-heading font-black text-white text-xl sm:text-2xl leading-tight tracking-wide">
                {driver.name.split(' ').pop() || driver.name}
              </p>
              <p className="font-heading text-[9px] text-white/35 tracking-widest mt-0.5">{driver.team}</p>
              <p className="font-heading font-black text-white mt-2" style={{ fontSize: "26px", lineHeight: 1 }}>
                {driver.points}
                <span className="text-sm font-normal text-white/55 ml-1.5">pts</span>
              </p>
            </div>

            {/* Number badge */}
            <div className="absolute top-3 right-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: driver.color || "#E8002D", border: `2px solid rgba(255,255,255,0.2)` }}
              >
                <span className="font-heading text-[10px] font-black text-white">#{driver.position}</span>
              </div>
            </div>

            {/* Bottom color accent */}
            <div
              className="absolute bottom-0 left-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, ${driver.color || "#E8002D"}, transparent)`,
                width: "70%",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
