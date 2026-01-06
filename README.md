# Patient Healthcare Monitoring System (React + Tailwind)

A modern, responsive dashboard that visualizes patient vitals (O2, Pulse, Temperature) using live ThingSpeak data or a simulated fallback.

## Tech Stack

- React (Vite)
- Tailwind CSS (dark mode supported)
- Recharts (line charts)
- Framer Motion (animations)
- Lucide Icons

  
#** Live Link**:  https://patient-healthcare-monitoring-syste.vercel.app/
## Quick Start

```bash
npm install
npm run dev
```

## Configure ThingSpeak (optional)

Create a `.env` file at project root:

```bash
VITE_THINGSPEAK_CHANNEL_ID=YOUR_CHANNEL_ID
VITE_THINGSPEAK_READ_KEY=YOUR_READ_API_KEY
```

If not provided or if the network fails, the app falls back to simulated data.

## Field Mapping

- field1: Oxygen (%)
- field2: Pulse (BPM)
- field3: Temperature (Celsius)

Update `src/services/thingspeak.js` if your channel differs.

## Build

```bash
npm run build
npm run preview
```
