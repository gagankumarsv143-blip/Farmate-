const express = require('express');
const Vehicle = require('../models/Vehicle');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/vehicles
// @desc    Get all vehicles with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type, minPrice, maxPrice, lat, lng, radius, page = 1, limit = 10 } = req.query;
        
        // Build filter object
        let filter = {};
        
        if (type) {
            filter.type = type;
        }
        
        if (minPrice || maxPrice) {
            filter.hourlyRate = {};
            if (minPrice) filter.hourlyRate.$gte = Number(minPrice);
            if (maxPrice) filter.hourlyRate.$lte = Number(maxPrice);
        }
        
        // Geo-spatial query
        if (lat && lng && radius) {
            filter.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
                }
            };
        }
        
        // Only show available vehicles
        filter.availability = true;
        
        const vehicles = await Vehicle.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('driverId', 'name rating');
        
        const total = await Vehicle.countDocuments(filter);
        
        res.json({
            success: true,
            vehicles,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   GET /api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate('driverId', 'name phone rating');
        
        if (!vehicle) {
            return res.status(404).json({ 
                success: false, 
                message: 'Vehicle not found' 
            });
        }
        
        res.json({ 
            success: true, 
            vehicle 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   GET /api/vehicles/types
// @desc    Get all vehicle types
// @access  Public
router.get('/types', async (req, res) => {
    try {
        const types = await Vehicle.distinct('type');
        
        res.json({ 
            success: true, 
            types 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports = router;