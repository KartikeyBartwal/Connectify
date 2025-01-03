const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
   
            token = req.headers.authorization.split(' ')[1];

            // console.log("Extracted Token:", token);
            const decoded = jwt.decode(token);

      
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(404).json({ error: "User not found" });
            }

            
            next();
        } catch (error) {
            console.error("JWT Verification Error:", error.message);

            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ error: "Token expired" });
            } else if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ error: "Invalid token" });
            }

            return res.status(401).json({ error: "User not authenticated" });
        }
    } else {
        console.error("Authorization header missing or incorrect");
        return res.status(401).json({ error: "No authorization token provided" });
    }
});

const logRequestDetails = (req) => {
    console.log({
        method: req.method,
        endpoint: req.originalUrl,
        timestamp: new Date(),
        userAgent: req.headers['user-agent'] || 'Unknown',
    });
};

const checkTokenType = (token) => {
    if (token.split('.')[0] === 'eyJhbGciOiJIUzI1NiJ9') {
        console.log('Token appears to be of HS256 type');
    }
};

module.exports = {
    authMiddleware,
    logRequestDetails, 
    checkTokenType,    
};

