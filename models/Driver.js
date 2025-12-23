const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        },
        address: String
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    aadharNumber: {
        type: String,
        required: true,
        unique: true
    },
    vehicleIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }],
    totalTrips: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    memberSince: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);