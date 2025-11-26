import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function formatTimeLabel(d) {
  if (!d) return "";
  try {
    const date = new Date(d);
    // For 24-hour view, show only time (hours and minutes)
    return date.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(d);
  }
}

export default function ChartsPanel({ data }) {
  // Filter data to only show last 24 hours
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const filteredData = data.filter((item) => {
    const itemTime = item.time instanceof Date ? item.time : new Date(item.time);
    return itemTime >= twentyFourHoursAgo;
  });
  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-3">
          O₂ Level Over Time
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis
                dataKey="time"
                tickFormatter={formatTimeLabel}
                minTickGap={20}
                stroke="currentColor"
                opacity={0.5}
              />
              <YAxis
                domain={[85, 100]}
                unit="%"
                stroke="currentColor"
                opacity={0.5}
              />
              <Tooltip labelFormatter={(v) => formatTimeLabel(v)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="oxygen"
                name="O₂ (%)"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4">
        <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-3">
          Pulse Rate Over Time
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis
                dataKey="time"
                tickFormatter={formatTimeLabel}
                minTickGap={20}
                stroke="currentColor"
                opacity={0.5}
              />
              <YAxis
                domain={[40, 140]}
                unit=" BPM"
                stroke="currentColor"
                opacity={0.5}
              />
              <Tooltip labelFormatter={(v) => formatTimeLabel(v)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="pulse"
                name="Pulse (BPM)"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4">
        <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-3">
          Body Temperature Over Time
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis
                dataKey="time"
                tickFormatter={formatTimeLabel}
                minTickGap={20}
                stroke="currentColor"
                opacity={0.5}
              />
              <YAxis
                domain={[35, 40]}
                unit="°C"
                stroke="currentColor"
                opacity={0.5}
              />
              <Tooltip labelFormatter={(v) => formatTimeLabel(v)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temp (°C)"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
