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

// Function to refresh the JWT token if it's expired, providing a new one
const refreshAuthToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Issue a new JWT token
        const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token: newToken });
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired refresh token" });
    }
});

// Function to log out the user by invalidating the token (client-side action)
const logoutUser_authmiddleware_js = asyncHandler(async (req, res) => {
    // This function will only handle client-side logout, so there is no server-side token invalidation here.
    res.status(200).json({ message: "User logged out successfully" });
});

// Function to check if the user is an admin
const checkAdmin_authmiddleware_js = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ error: "User is not an admin" });
    }
});

module.exports = { authMiddleware, refreshAuthToken, logoutUser_authmiddleware_js, checkAdmin_authmiddleware_js };
