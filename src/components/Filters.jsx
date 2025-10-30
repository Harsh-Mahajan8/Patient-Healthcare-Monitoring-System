export default function Filters({ range, onChange }) {
  const options = [
    { id: "24h", label: "Last 24h" },
    { id: "7d", label: "7 days" },
    { id: "30d", label: "30 days" },
  ];
  return (
    <div className="flex items-center gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          className={`px-3 py-1.5 text-sm rounded-xl border shadow-sm transition ${
            range === o.id
              ? "bg-brand-500 text-white border-brand-500"
              : "bg-white/70 dark:bg-neutral-900/70 text-neutral-700 dark:text-neutral-200 border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-neutral-800"
          }`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
