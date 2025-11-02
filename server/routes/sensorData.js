import { Router } from 'express'
import SensorData from '../models/SensorData.js'
import { authenticateToken, requireAuth } from '../middleware/auth.js'

const router = Router()

// All routes require authentication middleware (but allows guests)
router.use(authenticateToken)

// POST /api/sensor-data - Create new sensor reading
router.post('/', requireAuth, async (req, res) => {
    try {
        const { o2Reading, bodyTemperature, pulseReading, timestamp } = req.body
        const userId = req.user.id

        if (!o2Reading || !bodyTemperature || !pulseReading) {
            return res.status(400).json({ message: 'Missing required fields: o2Reading, bodyTemperature, pulseReading' })
        }

        const sensorData = await SensorData.create({
            userId,
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

// GET /api/sensor-data - Get sensor data for authenticated user
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id
        const { range = '24h', start, end, limit } = req.query

        // Build date range
        const now = new Date()
        let startDate = new Date(now)
        let endDate = now

        if (start && end) {
            startDate = new Date(start)
            endDate = new Date(end)
        } else {
            if (range === '24h') startDate.setHours(now.getHours() - 24)
            else if (range === '7d') startDate.setDate(now.getDate() - 7)
            else if (range === '30d') startDate.setDate(now.getDate() - 30)
            else startDate.setHours(now.getHours() - 24)
        }

        // Build query
        const query = {
            userId,
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

// GET /api/sensor-data/latest - Get latest sensor reading for user
router.get('/latest', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id
        const latest = await SensorData.findOne({ userId })
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

