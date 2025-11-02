import mongoose from 'mongoose'

const sensorDataSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    o2Reading: { 
        type: Number, 
        required: true,
        min: 0,
        max: 100 
    },
    bodyTemperature: { 
        type: Number, 
        required: true,
        min: 30,
        max: 45 
    },
    pulseReading: { 
        type: Number, 
        required: true,
        min: 0,
        max: 250 
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { timestamps: true })

// Index for efficient queries by user and timestamp
sensorDataSchema.index({ userId: 1, timestamp: -1 })

export default mongoose.model('SensorData', sensorDataSchema)

