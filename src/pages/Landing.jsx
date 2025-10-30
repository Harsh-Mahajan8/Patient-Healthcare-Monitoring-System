import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartPulse,
  ShieldCheck,
  Activity,
  Thermometer,
  UserPlus,
  LogIn,
  User,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  function handleContinue(role) {
    // Persist a lightweight session flag for demonstration
    localStorage.setItem("phms_role", role);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white dark:from-neutral-950 dark:to-neutral-950">
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 grid place-content-center rounded-xl bg-brand-500 text-white shadow ring-1 ring-white/10">
            <HeartPulse size={20} />
          </div>
          <div>
            <div className="text-sm text-brand-700 dark:text-brand-300 tracking-wide font-semibold uppercase">
              Patient Healthcare Monitoring System
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Monitor vitals in real time
            </div>
          </div>
        </div>
        <button
          onClick={() => setDark((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-black/5 dark:border-white/5 bg-white/70 dark:bg-neutral-900/70 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-white dark:hover:bg-neutral-800 transition"
        >
          {dark ? "Light" : "Dark"}
        </button>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100"
            >
              Your patient's health, visualized clearly.
            </motion.h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-300 text-lg">
              Stay on top of oxygen levels, pulse rate, and body temperature
              with a clean, real‑time dashboard.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card p-4">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                  <Activity size={18} />
                  <span className="font-medium">Live Vitals</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Auto-refresh every minute with alerts.
                </p>
              </div>
              <div className="card p-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <ShieldCheck size={18} />
                  <span className="font-medium">Reliable</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  ThingSpeak integration with graceful fallback.
                </p>
              </div>
              <div className="card p-4">
                <div className="flex items-center gap-2 text-orange-500">
                  <Thermometer size={18} />
                  <span className="font-medium">Insights</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Trends for 24h, 7d, and 30d.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Access the dashboard
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Sign in, create an account, or continue as guest.
              </p>

              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleContinue("login");
                }}
              >
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-300">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-300">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 text-white px-4 py-2 text-sm font-medium shadow hover:bg-brand-600 transition"
                >
                  <LogIn size={16} /> Sign In
                </button>
              </form>

              <div className="my-4 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                <span>Or</span>
                <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              </div>

              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleContinue("signup");
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-300">
                      Full name
                    </label>
                    <input
                      required
                      placeholder="Jane Doe"
                      className="mt-1 w-full rounded-xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-300">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="mt-1 w-full rounded-xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-300">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Create a password"
                      className="mt-1 w-full rounded-xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-300">
                      Confirm
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      className="mt-1 w-full rounded-xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium shadow hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 transition"
                >
                  <UserPlus size={16} /> Create Account
                </button>
              </form>

              <button
                onClick={() => handleContinue("guest")}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 shadow-sm hover:bg-white dark:hover:bg-neutral-800 transition"
              >
                <User size={16} /> Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} Patient Healthcare Monitoring System
      </footer>
    </div>
  );
}
