const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication middleware - verifies JWT token
 */
const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            logger.warn('Authentication failed: No token provided');
            return res.status(401).json({
                success: false,
                message: 'Giriş icazəsi yoxdur'
            });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                logger.warn('Authentication failed: Invalid token', { error: err.message });
                return res.status(401).json({
                    success: false,
                    message: 'Etibarsız giriş məlumatları'
                });
            }

            // Set user info in request object
            req.user = decoded;
            next();
        });
    } catch (error) {
        logger.error('Authentication error:', { error: error.message, stack: error.stack });
        res.status(500).json({
            success: false,
            message: 'Server xətası'
        });
    }
};

/**
 * Role-based authorization middleware
 * @param {...string} roles - Roles that have access to the route
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn('Authorization failed: User not authenticated');
            return res.status(401).json({
                success: false,
                message: 'Giriş icazəsi yoxdur'
            });
        }

        if (!roles.includes(req.user.role)) {
            logger.warn(`Authorization failed: User role ${req.user.role} not authorized`, {
                requiredRoles: roles,
                userRole: req.user.role,
                userId: req.user.userId
            });
            return res.status(403).json({
                success: false,
                message: 'Bu əməliyyat üçün icazəniz yoxdur'
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorize
}; 