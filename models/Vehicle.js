const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Tractor', 'Rotavator', 'Cultivator', 'Harvester', 'Power Tiller', 
               'Water Tanker', 'Mini Truck', 'Ploughing Machine', 'Sprayer', 'Other']
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    dailyRate: {
        type: Number,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    images: [{
        url: String,
        publicId: String
    }],
    documents: [{
        type: String, // URLs to RC, Insurance, etc.
    }],
    features: [String],
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);