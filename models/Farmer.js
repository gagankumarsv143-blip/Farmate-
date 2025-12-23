const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
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
    farmDetails: {
        size: String,
        crops: [String],
        additionalInfo: String
    },
    language: {
        type: String,
        default: 'en'
    },
    memberSince: {
        type: Date,
        default: Date.now
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    avgRating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Farmer', farmerSchema);