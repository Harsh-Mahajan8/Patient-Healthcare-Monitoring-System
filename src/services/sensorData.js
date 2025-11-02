// MongoDB-based sensor data service

// Map field numbers to metrics (keeping same format as ThingSpeak for compatibility)
const FIELD_MAP = {
    oxygen: 'field1',
    pulse: 'field2',
    temperature: 'field3',
};

function getAuthToken() {
    return localStorage.getItem('phms_token') || null
}

function getAuthHeaders() {
    const token = getAuthToken()
    const headers = {
        'Content-Type': 'application/json',
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

export async function fetchSensorData({
    range = '24h',
} = {}) {
    const now = new Date()
    const end = now
    let start = new Date(now)
    
    if (range === '24h') start.setHours(now.getHours() - 24)
    else if (range === '7d') start.setDate(now.getDate() - 7)
    else if (range === '30d') start.setDate(now.getDate() - 30)
    else start.setHours(now.getHours() - 24)

    try {
        const token = getAuthToken()
        if (!token) {
            // No auth token - return empty data or fallback
            return { feeds: [] }
        }

        const url = `/api/sensor-data?range=${range}`
        const res = await fetch(url, {
            headers: getAuthHeaders(),
        })

        if (!res.ok) {
            if (res.status === 401) {
                // User not authenticated - return empty data
                return { feeds: [] }
            }
            throw new Error(`HTTP ${res.status}`)
        }

        const json = await res.json()
        if (!json || !json.feeds) {
            return { feeds: [] }
        }
        return json
    } catch (err) {
        console.error('Error fetching sensor data:', err)
        // Return empty data on error
        return { feeds: [] }
    }
}

export function mapFeedsToSeries(feeds) {
    return feeds.map(f => ({
        time: new Date(f.created_at),
        oxygen: f[FIELD_MAP.oxygen] ? Number(f[FIELD_MAP.oxygen]) : null,
        pulse: f[FIELD_MAP.pulse] ? Number(f[FIELD_MAP.pulse]) : null,
        temperature: f[FIELD_MAP.temperature] ? Number(f[FIELD_MAP.temperature]) : null,
    }))
}

export function latestValues(series) {
    if (!series || series.length === 0) return null
    const last = series[series.length - 1]
    return {
        time: last.time,
        oxygen: last.oxygen,
        pulse: last.pulse,
        temperature: last.temperature,
    }
}

export async function createSensorReading({ o2Reading, bodyTemperature, pulseReading, timestamp }) {
    try {
        const token = getAuthToken()
        if (!token) {
            throw new Error('Authentication required')
        }

        const url = `/api/sensor-data`
        const res = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                o2Reading,
                bodyTemperature,
                pulseReading,
                timestamp: timestamp || new Date().toISOString(),
            }),
        })

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
            throw new Error(error.message || `HTTP ${res.status}`)
        }

        return await res.json()
    } catch (err) {
        console.error('Error creating sensor reading:', err)
        throw err
    }
}

