import { Router } from 'express'
import SensorData from '../models/SensorData.js'

const router = Router()

// POST /api/sensor-data - Create new sensor reading
router.post('/', async (req, res) => {
    try {
        const { o2Reading, bodyTemperature, pulseReading, timestamp } = req.body

        if (!o2Reading || !bodyTemperature || !pulseReading) {
            return res.status(400).json({ message: 'Missing required fields: o2Reading, bodyTemperature, pulseReading' })
        }

        const sensorData = await SensorData.create({
            o2Reading: Number(o2Reading),
            bodyTemperature: Number(bodyTemperature),
            pulseReading: Number(pulseReading),
            timestamp: timestamp ? new Date(timestamp) : new Date()
        })

        res.status(201).json({
            id: sensorData._id,
            userId: sensorData.userId,
            o2Reading: sensorData.o2Reading,
            bodyTemperature: sensorData.bodyTemperature,
            pulseReading: sensorData.pulseReading,
            timestamp: sensorData.timestamp
        })
    } catch (err) {
        console.error('Error creating sensor data:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// GET /api/sensor-data - Get sensor data
router.get('/', async (req, res) => {
    try {
        const { range = '24h', start, end, limit } = req.query

        // Build date range
        const now = new Date()
        let startDate = new Date(now)
        let endDate = now

        if (start && end) {
            startDate = new Date(start)
            endDate = new Date(end)
        } else {
            // Always use last 24 hours
            startDate.setHours(now.getHours() - 24)
        }

        // Build query
        const query = {
            timestamp: { $gte: startDate, $lte: endDate }
        }

        let queryBuilder = SensorData.find(query)
            .sort({ timestamp: 1 })
            .select('o2Reading bodyTemperature pulseReading timestamp')

        if (limit) {
            queryBuilder = queryBuilder.limit(Number(limit))
        }

        const data = await queryBuilder

        // Transform to match frontend expected format
        const feeds = data.map(item => ({
            created_at: item.timestamp.toISOString(),
            field1: item.o2Reading.toString(),
            field2: item.pulseReading.toString(),
            field3: item.bodyTemperature.toString(),
        }))

        res.json({ feeds })
    } catch (err) {
        console.error('Error fetching sensor data:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// GET /api/sensor-data/latest - Get latest sensor reading
router.get('/latest', async (req, res) => {
    try {
        const latest = await SensorData.findOne()
            .sort({ timestamp: -1 })
            .select('o2Reading bodyTemperature pulseReading timestamp')

        if (!latest) {
            return res.json(null)
        }

        res.json({
            o2Reading: latest.o2Reading,
            bodyTemperature: latest.bodyTemperature,
            pulseReading: latest.pulseReading,
            timestamp: latest.timestamp
        })
    } catch (err) {
        console.error('Error fetching latest sensor data:', err)
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

export default router

