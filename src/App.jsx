import { useEffect, useState, useRef } from "react";
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
import { createSensorReading } from "./services/sensorData.js";
import { celsius, bpm, percent, formatTimestamp } from "./utils/format.js";
import { Activity, Thermometer, HeartPulse, Play, Square } from "lucide-react";

export default function App() {
  const [dark, setDark] = useState(
    () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches ||
      localStorage.getItem("theme") === "dark"
  );
  const [patientName, setPatientName] = useState("");
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const monitoringIntervalRef = useRef(null);
  const lastReadingRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Filter data to only show last 24 hours
  function filterLast24Hours(data) {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return data.filter((item) => {
      const itemTime =
        item.time instanceof Date ? item.time : new Date(item.time);
      return itemTime >= twentyFourHoursAgo;
    });
  }

  async function load() {
    try {
      setLoading(true);
      setError("");
      const json = await fetchThingSpeakData({ range: "24h" });
      const data = mapFeedsToSeries(json.feeds || []);
      // Filter to only show last 24 hours
      const filteredData = filterLast24Hours(data);
      setSeries(filteredData);
      setLastUpdated(formatTimestamp(new Date()));
    } catch (e) {
      setError("Failed to fetch data. Showing simulated values.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isMonitoring) {
      load();
      const id = setInterval(load, 60 * 1000); // refresh every minute
      return () => clearInterval(id);
    }
  }, [isMonitoring]);

  // Generate random sensor reading with dynamic variation
  function generateRandomReading() {
    const now = new Date();

    // Safe ranges for vital signs
    const OXYGEN_MIN = 90;
    const OXYGEN_MAX = 100;
    const PULSE_MIN = 60;
    const PULSE_MAX = 120;
    const TEMP_MIN = 36.0;
    const TEMP_MAX = 37.5;

    let oxygen, pulse, temperature;

    if (lastReadingRef.current) {
      const last = lastReadingRef.current;
      const lastTime =
        last.time instanceof Date
          ? last.time.getTime()
          : new Date(last.time).getTime();
      const timeSinceLast = now.getTime() - lastTime;

      // Add time-based variation to ensure continuous change
      // Use a combination of sine wave and random for natural variation
      const timeVariation = Math.sin(now.getTime() / 30000) * 0.3;

      // Generate values with more variation while staying in safe ranges
      // Oxygen: varies by ±2% with time-based component
      oxygen = last.oxygen + (Math.random() - 0.5) * 2.5 + timeVariation;
      oxygen = Math.max(OXYGEN_MIN, Math.min(OXYGEN_MAX, oxygen));

      // Pulse: varies by ±8 BPM with time-based component
      pulse = last.pulse + (Math.random() - 0.5) * 8 + timeVariation * 3;
      pulse = Math.max(PULSE_MIN, Math.min(PULSE_MAX, pulse));

      // Temperature: varies by ±0.4°C with time-based component
      temperature =
        last.temperature + (Math.random() - 0.5) * 0.4 + timeVariation * 0.1;
      temperature = Math.max(TEMP_MIN, Math.min(TEMP_MAX, temperature));

      // Ensure minimum change to keep data dynamic
      if (Math.abs(oxygen - last.oxygen) < 0.1) {
        oxygen = last.oxygen + (Math.random() > 0.5 ? 0.2 : -0.2);
        oxygen = Math.max(OXYGEN_MIN, Math.min(OXYGEN_MAX, oxygen));
      }
      if (Math.abs(pulse - last.pulse) < 1) {
        pulse = last.pulse + (Math.random() > 0.5 ? 2 : -2);
        pulse = Math.max(PULSE_MIN, Math.min(PULSE_MAX, pulse));
      }
      if (Math.abs(temperature - last.temperature) < 0.05) {
        temperature = last.temperature + (Math.random() > 0.5 ? 0.1 : -0.1);
        temperature = Math.max(TEMP_MIN, Math.min(TEMP_MAX, temperature));
      }
    } else {
      // Initial values within safe ranges
      oxygen = 94 + Math.random() * 4; // 94-98%
      pulse = 70 + Math.random() * 20; // 70-90 BPM
      temperature = 36.4 + Math.random() * 0.8; // 36.4-37.2°C
    }

    const reading = {
      time: now,
      oxygen: Number(oxygen.toFixed(1)),
      pulse: Number(pulse.toFixed(0)),
      temperature: Number(temperature.toFixed(1)),
    };

    lastReadingRef.current = reading;
    return reading;
  }

  // Store reading and update display
  async function addReading(reading) {
    // Add to series immediately for display
    setSeries((prev) => {
      const newSeries = [...prev, reading];
      // Filter to only show last 24 hours
      return filterLast24Hours(newSeries);
    });
    setLastUpdated(formatTimestamp(new Date()));

    // Store reading via API
    try {
      await createSensorReading({
        o2Reading: reading.oxygen,
        bodyTemperature: reading.temperature,
        pulseReading: reading.pulse,
        timestamp: reading.time.toISOString(),
      });
    } catch (err) {
      // Log error but continue displaying data
      console.error("Could not save to API:", err);
    }
  }

  // Start/Stop monitoring
  function toggleMonitoring() {
    if (isMonitoring) {
      // Stop monitoring
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
        monitoringIntervalRef.current = null;
      }
      setIsMonitoring(false);
    } else {
      // Start monitoring
      setIsMonitoring(true);
      // Generate first reading immediately
      const reading = generateRandomReading();
      addReading(reading);

      // Generate new reading every 5 seconds
      monitoringIntervalRef.current = setInterval(() => {
        const reading = generateRandomReading();
        addReading(reading);
      }, 5000);
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, []);

  const latest = latestValues(series);

  return (
    <div className="min-h-full">
      <Navbar
        dark={dark}
        onToggleDark={() => setDark((v) => !v)}
        patientName={patientName || "—"}
        lastUpdated={lastUpdated || "—"}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <PatientSelector value={patientName} onChange={setPatientName} />
            <button
              onClick={toggleMonitoring}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition ${
                isMonitoring
                  ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50"
                  : "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50"
              }`}
            >
              {isMonitoring ? (
                <>
                  <Square size={16} />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Start</span>
                </>
              )}
            </button>
          </div>
          <Filters />
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
