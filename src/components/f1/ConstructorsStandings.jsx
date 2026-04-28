// src/components/f1/ConstructorsStandings.jsx
import { motion } from "framer-motion";

export default function ConstructorStandings({ constructorsData = [] }) {
  if (!constructorsData || constructorsData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading constructor standings...</p>
      </div>
    );
  }

  const maxPoints = constructorsData[0]?.points || 1;

  return (
    <div>
      <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wider mb-5 leading-tight">
        CONSTRUCTOR<br />STANDINGS
      </h2>
      <div className="space-y-3">
        {constructorsData.map((team, i) => (
          <motion.div
            key={team.name}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-lg flex items-stretch"
            style={{
              background: "#16191f",
              minHeight: "68px",
              border: `1px solid ${team.color || "#E8002D"}25`,
            }}
          >
            {/* Angled left tab */}
            <div
              className="relative shrink-0 flex items-center justify-center"
              style={{
                background: team.color || "#E8002D",
                width: "56px",
                clipPath: "polygon(0 0, 78% 0, 100% 100%, 0 100%)",
              }}
            >
              <span className="font-heading text-2xl font-black text-white z-10 -mr-3">{team.position}</span>
            </div>

            {/* Name + bar */}
            <div className="flex-1 flex flex-col justify-center px-3 py-2 gap-2">
              <span className="font-heading text-sm font-black text-white tracking-wider">{team.name}</span>
              <div className="h-3 rounded overflow-hidden" style={{ background: "#0a0c10" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(team.points / maxPoints) * 100}%` }}
                  transition={{ delay: 0.7 + i * 0.12, duration: 1.1, ease: "easeOut" }}
                  className="h-full rounded"
                  style={{
                    background: `linear-gradient(90deg, ${team.color || "#E8002D"}dd, ${team.color || "#E8002D"}66)`,
                    boxShadow: `0 0 8px ${team.color || "#E8002D"}60`,
                  }}
                />
              </div>
            </div>

            {/* Points */}
            <div
              className="flex items-center justify-center px-4 shrink-0"
              style={{ borderLeft: `2px solid ${team.color || "#E8002D"}30` }}
            >
              <span className="font-heading font-black text-white text-xl">
                {team.points}
                <span className="text-xs text-white/50 font-normal ml-1">pts</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
