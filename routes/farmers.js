const express = require('express');
const Farmer = require('../models/Farmer');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/farmers/:id
// @desc    Get farmer profile
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        
        if (!farmer) {
            return res.status(404).json({ 
                success: false, 
                message: 'Farmer not found' 
            });
        }
        
        res.json({ 
            success: true, 
            farmer 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   PUT /api/farmers/:id
// @desc    Update farmer profile
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { name, location, farmDetails, language } = req.body;
        
        // Build farmer object
        const farmerFields = {};
        if (name) farmerFields.name = name;
        if (location) farmerFields.location = location;
        if (farmDetails) farmerFields.farmDetails = farmDetails;
        if (language) farmerFields.language = language;
        
        let farmer = await Farmer.findById(req.params.id);
        
        if (!farmer) {
            return res.status(404).json({ 
                success: false, 
                message: 'Farmer not found' 
            });
        }
        
        farmer = await Farmer.findByIdAndUpdate(
            req.params.id,
            { $set: farmerFields },
            { new: true }
        );
        
        res.json({ 
            success: true, 
            farmer 
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