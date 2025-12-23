const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const Driver = require('../models/Driver');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Generate OTP (mock implementation)
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs in memory (in production, use Redis or database)
const otpStore = {};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to user's phone
// @access  Public
router.post('/send-otp', async (req, res) => {
    try {
        const { phone, userType } = req.body;

        // Validate input
        if (!phone || !userType) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number and user type are required' 
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP (in production, this should be stored in a secure way)
        otpStore[phone] = otp;
        
        // In a real application, you would send the OTP via SMS service
        console.log(`OTP for ${phone}: ${otp}`);
        
        res.status(200).json({ 
            success: true, 
            message: 'OTP sent successfully' 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, otp, userType } = req.body;

        // Validate input
        if (!phone || !otp || !userType) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone, OTP, and user type are required' 
            });
        }

        // Check if OTP matches
        if (otpStore[phone] !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP' 
            });
        }

        let user, token;
        
        if (userType === 'farmer') {
            // Check if farmer exists
            user = await Farmer.findOne({ phone });
            
            // If farmer doesn't exist, create new farmer
            if (!user) {
                user = new Farmer({ phone });
                await user.save();
            }
        } else if (userType === 'driver') {
            // Check if driver exists
            user = await Driver.findOne({ phone });
            
            // If driver doesn't exist, create new driver
            if (!user) {
                user = new Driver({ phone });
                await user.save();
            }
        } else {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid user type' 
            });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                type: userType
            }
        };

        token = jwt.sign(payload, process.env.JWT_SECRET || 'farmate_secret_key', {
            expiresIn: '7d'
        });

        // Remove OTP from store
        delete otpStore[phone];

        res.status(200).json({ 
            success: true, 
            token,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                type: userType
            }
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