const express = require('express');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Farmer = require('../models/Farmer');
const Driver = require('../models/Driver');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', verifyToken, async (req, res) => {
    try {
        const { farmerId, driverId, vehicleId, bookingType, startDate, endDate, 
                durationType, quantity, totalPrice, paymentMethod, pickupLocation, 
                dropoffLocation, notes } = req.body;
        
        // Validate required fields
        if (!farmerId || !driverId || !vehicleId || !bookingType || !startDate || 
            !endDate || !durationType || !quantity || !totalPrice || !paymentMethod) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }
        
        // Check if vehicle is available
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle || !vehicle.availability) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vehicle is not available' 
            });
        }
        
        // Create new booking
        const booking = new Booking({
            farmerId,
            driverId,
            vehicleId,
            bookingType,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            durationType,
            quantity,
            totalPrice,
            paymentMethod,
            pickupLocation,
            dropoffLocation,
            notes
        });
        
        await booking.save();
        
        // Update vehicle availability
        vehicle.availability = false;
        await vehicle.save();
        
        // Update farmer booking count
        await Farmer.findByIdAndUpdate(farmerId, { $inc: { totalBookings: 1 } });
        
        res.status(201).json({ 
            success: true, 
            booking 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('farmerId', 'name phone')
            .populate('driverId', 'name phone')
            .populate('vehicleId', 'type brand model');
        
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }
        
        res.json({ 
            success: true, 
            booking 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status' 
            });
        }
        
        let booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }
        
        // If booking is being completed, update earnings
        if (status === 'completed') {
            const driver = await Driver.findById(booking.driverId);
            if (driver) {
                driver.totalTrips += 1;
                driver.totalEarnings += booking.totalPrice;
                await driver.save();
            }
        }
        
        // If booking is being cancelled, make vehicle available again
        if (status === 'cancelled') {
            const vehicle = await Vehicle.findById(booking.vehicleId);
            if (vehicle) {
                vehicle.availability = true;
                await vehicle.save();
            }
        }
        
        booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true }
        );
        
        res.json({ 
            success: true, 
            booking 
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