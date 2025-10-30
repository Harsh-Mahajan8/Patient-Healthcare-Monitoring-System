import { motion } from "framer-motion";

export default function VitalsCard({
  title,
  value,
  unit,
  Icon,
  color = "text-brand-600",
  subtext,
}) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="card p-5"
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-11 w-11 grid place-content-center rounded-xl bg-gradient-to-br from-brand-500/15 to-brand-500/5 ${color}`}
        >
          {Icon && <Icon size={22} />}
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {title}
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {value}
              {unit && (
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 ml-1">
                  {unit}
                </span>
              )}
            </div>
          </div>
          {subtext && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {subtext}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
