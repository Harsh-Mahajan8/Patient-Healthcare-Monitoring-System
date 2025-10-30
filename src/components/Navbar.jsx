import { Moon, Sun, HeartPulse, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({
  dark,
  onToggleDark,
  patientName,
  lastUpdated,
}) {
  return (
    <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60 border-b border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="h-10 w-10 grid place-content-center rounded-xl bg-brand-500 text-white shadow ring-1 ring-white/10">
                <HeartPulse size={20} />
              </div>
            </motion.div>
            <div>
              <div className="text-sm text-brand-700 dark:text-brand-300 tracking-wide font-semibold uppercase">
                Patient Healthcare Monitoring System
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <Stethoscope size={14} />
                <span className="truncate">{patientName}</span>
                <span aria-hidden>•</span>
                <span className="truncate">Last updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onToggleDark}
            className="inline-flex items-center gap-2 rounded-xl border border-black/5 dark:border-white/5 bg-white/70 dark:bg-neutral-900/70 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-white dark:hover:bg-neutral-800 transition"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            <span>{dark ? "Light" : "Dark"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
