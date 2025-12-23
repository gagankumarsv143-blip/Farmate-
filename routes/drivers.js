const express = require('express');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/drivers/:id
// @desc    Get driver profile
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        
        if (!driver) {
            return res.status(404).json({ 
                success: false, 
                message: 'Driver not found' 
            });
        }
        
        res.json({ 
            success: true, 
            driver 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   PUT /api/drivers/:id
// @desc    Update driver profile
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { name, email, location, licenseNumber, aadharNumber, isAvailable } = req.body;
        
        // Build driver object
        const driverFields = {};
        if (name) driverFields.name = name;
        if (email) driverFields.email = email;
        if (location) driverFields.location = location;
        if (licenseNumber) driverFields.licenseNumber = licenseNumber;
        if (aadharNumber) driverFields.aadharNumber = aadharNumber;
        if (isAvailable !== undefined) driverFields.isAvailable = isAvailable;
        
        let driver = await Driver.findById(req.params.id);
        
        if (!driver) {
            return res.status(404).json({ 
                success: false, 
                message: 'Driver not found' 
            });
        }
        
        driver = await Driver.findByIdAndUpdate(
            req.params.id,
            { $set: driverFields },
            { new: true }
        );
        
        res.json({ 
            success: true, 
            driver 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   POST /api/drivers/:id/vehicles
// @desc    Add vehicle to driver
// @access  Private
router.post('/:id/vehicles', verifyToken, async (req, res) => {
    try {
        const { type, brand, model, year, registrationNumber, hourlyRate, dailyRate, features, description } = req.body;
        
        // Create new vehicle
        const vehicle = new Vehicle({
            driverId: req.params.id,
            type,
            brand,
            model,
            year,
            registrationNumber,
            hourlyRate,
            dailyRate,
            features,
            description
        });
        
        await vehicle.save();
        
        // Add vehicle to driver's vehicle list
        await Driver.findByIdAndUpdate(
            req.params.id,
            { $push: { vehicleIds: vehicle.id } }
        );
        
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

module.exports = router;