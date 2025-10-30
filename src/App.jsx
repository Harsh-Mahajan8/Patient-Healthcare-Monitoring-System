import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import VitalsCard from "./components/VitalsCard.jsx";
import ChartsPanel from "./components/ChartsPanel.jsx";
import Footer from "./components/Footer.jsx";
import PatientSelector from "./components/PatientSelector.jsx";
import Filters from "./components/Filters.jsx";
import Loader from "./components/Loader.jsx";
import {
  fetchThingSpeakData,
  mapFeedsToSeries,
  latestValues,
} from "./services/thingspeak.js";
import { celsius, bpm, percent, formatTimestamp } from "./utils/format.js";
import { Activity, Thermometer, HeartPulse } from "lucide-react";

const PATIENTS = [
  { id: "alice", name: "Alice Johnson" },
  { id: "bob", name: "Bob Smith" },
  { id: "carol", name: "Carol Lee" },
];

export default function App() {
  const [dark, setDark] = useState(
    () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches ||
      localStorage.getItem("theme") === "dark"
  );
  const [range, setRange] = useState("24h");
  const [patientId, setPatientId] = useState(PATIENTS[0].id);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const patient = useMemo(
    () => PATIENTS.find((p) => p.id === patientId) || PATIENTS[0],
    [patientId]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const json = await fetchThingSpeakData({ range });
      const data = mapFeedsToSeries(json.feeds || []);
      setSeries(data);
      setLastUpdated(formatTimestamp(new Date()));
    } catch (e) {
      setError("Failed to fetch data. Showing simulated values.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60 * 1000); // refresh every minute
    return () => clearInterval(id);
  }, [range, patientId]);

  const latest = latestValues(series);

  return (
    <div className="min-h-full">
      <Navbar
        dark={dark}
        onToggleDark={() => setDark((v) => !v)}
        patientName={patient.name}
        lastUpdated={lastUpdated || "—"}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <PatientSelector
              patients={PATIENTS}
              value={patientId}
              onChange={setPatientId}
            />
          </div>
          <Filters range={range} onChange={setRange} />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-amber-300/40 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 space-y-4">
            {loading && !latest ? (
              <Loader />
            ) : (
              <div className="space-y-4">
                <VitalsCard
                  title="Oxygen Saturation"
                  value={latest ? Number(latest.oxygen).toFixed(0) : "—"}
                  unit="%"
                  Icon={Activity}
                  color="text-sky-600"
                  subtext="SpO₂"
                />
                <VitalsCard
                  title="Pulse Rate"
                  value={latest ? Number(latest.pulse).toFixed(0) : "—"}
                  unit="BPM"
                  Icon={HeartPulse}
                  color="text-emerald-600"
                  subtext="Beats per minute"
                />
                <VitalsCard
                  title="Body Temperature"
                  value={latest ? Number(latest.temperature).toFixed(1) : "—"}
                  unit="°C"
                  Icon={Thermometer}
                  color="text-orange-600"
                  subtext="Celsius"
                />
              </div>
            )}
          </section>

          <section className="lg:col-span-7">
            <div className="card p-4">
              {loading && series.length === 0 ? (
                <Loader />
              ) : (
                <ChartsPanel data={series} />
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
