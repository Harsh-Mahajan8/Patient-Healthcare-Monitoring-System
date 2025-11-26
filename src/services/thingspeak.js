// ThingSpeak data service with simulation fallback

const DEFAULT_CHANNEL_ID = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || '';
const DEFAULT_READ_API_KEY = import.meta.env.VITE_THINGSPEAK_READ_KEY || '';

// Map field numbers to metrics (adjust to your ThingSpeak channel mapping)
// field1: oxygen, field2: pulse, field3: temperature
const FIELD_MAP = {
    oxygen: 'field1',
    pulse: 'field2',
    temperature: 'field3',
};

function buildUrl({ channelId, readKey, results, start, end }) {
    const params = new URLSearchParams();
    if (readKey) params.set('api_key', readKey);
    if (results) params.set('results', String(results));
    if (start) params.set('start', start.toISOString());
    if (end) params.set('end', end.toISOString());
    return `https://api.thingspeak.com/channels/${channelId}/feeds.json?${params.toString()}`;
}

function simulateData(count = 50, end = new Date()) {
    const data = [];
    let t = new Date(end);
    for (let i = count - 1; i >= 0; i--) {
        const ts = new Date(t.getTime() - i * 60 * 60 * 1000 / 2); // 30 min intervals
        // Generate smooth-ish random data within reasonable ranges
        const oxygen = 94 + Math.sin(i / 7) * 3 + Math.random() * 2;
        const pulse = 65 + Math.cos(i / 5) * 8 + Math.random() * 5;
        const temperature = 36.4 + Math.sin(i / 9) * 0.6 + Math.random() * 0.3;
        data.push({
            created_at: ts.toISOString(),
            [FIELD_MAP.oxygen]: oxygen.toFixed(1),
            [FIELD_MAP.pulse]: pulse.toFixed(0),
            [FIELD_MAP.temperature]: temperature.toFixed(1),
        });
    }
    return { feeds: data };
}

export async function fetchThingSpeakData({
    channelId = DEFAULT_CHANNEL_ID,
    readKey = DEFAULT_READ_API_KEY,
    range = '24h',
} = {}) {
    const now = new Date();
    const end = now;
    let start = new Date(now);
    let results;
    // Always use last 24 hours
    start.setHours(now.getHours() - 24);

    try {
        if (!channelId) throw new Error('Missing channel id');
        const url = buildUrl({ channelId, readKey, start, end, results });
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json || !json.feeds) throw new Error('Invalid response');
        return json;
    } catch (err) {
        // Fallback to simulation if there is any error or missing config
        return simulateData(96, end); // 48 hours of half-hourly points
    }
}

export function mapFeedsToSeries(feeds) {
    return feeds.map(f => ({
        time: new Date(f.created_at),
        oxygen: f[FIELD_MAP.oxygen] ? Number(f[FIELD_MAP.oxygen]) : null,
        pulse: f[FIELD_MAP.pulse] ? Number(f[FIELD_MAP.pulse]) : null,
        temperature: f[FIELD_MAP.temperature] ? Number(f[FIELD_MAP.temperature]) : null,
    }));
}

export function latestValues(series) {
    if (!series || series.length === 0) return null;
    const last = series[series.length - 1];
    return {
        time: last.time,
        oxygen: last.oxygen,
        pulse: last.pulse,
        temperature: last.temperature,
    };
}

