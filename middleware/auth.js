const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const Driver = require('../models/Driver');

const verifyToken = async (req, res, next) => {
    // Get token from header
    let token = req.header('x-auth-token');
    
    // Fallback to authorization header
    if (!token) {
        token = req.header('authorization');
        if (token && token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
    }
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token, authorization denied' 
        });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'farmate_secret_key');
        
        // Get user based on token payload
        const { id, type } = decoded.user;
        
        if (type === 'farmer') {
            req.user = await Farmer.findById(id);
        } else if (type === 'driver') {
            req.user = await Driver.findById(id);
        }
        
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token is not valid' 
            });
        }
        
        req.userType = type;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ 
            success: false, 
            message: 'Token is not valid' 
        });
    }
};

module.exports = { verifyToken };