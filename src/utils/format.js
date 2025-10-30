export function formatTimestamp(ts) {
    if (!ts) return '—';
    try {
        const d = new Date(ts);
        return d.toLocaleString();
    } catch {
        return String(ts);
    }
}

export function celsius(value) {
    return `${Number(value).toFixed(1)}°C`;
}

export function bpm(value) {
    return `${Number(value).toFixed(0)} BPM`;
}

export function percent(value) {
    return `${Number(value).toFixed(0)}%`;
}

export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

