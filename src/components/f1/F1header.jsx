import { motion } from "framer-motion";

export default function F1Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
       2026 Season 
      </h1>
    </motion.div>
  );
}
