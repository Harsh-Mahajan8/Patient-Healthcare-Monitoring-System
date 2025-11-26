export default function PatientSelector({
  value,
  onChange,
  className = "",
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm text-neutral-600 dark:text-neutral-300">
        Patient
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter patient name"
        className="rounded-xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 text-sm px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
      />
    </div>
  );
}
