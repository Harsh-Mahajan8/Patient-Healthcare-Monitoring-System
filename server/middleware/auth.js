import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        // For guest users, allow access but set req.user to null
        req.user = null
        return next()
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = { id: decoded.sub, email: decoded.email }
        next()
    } catch (err) {
        // Invalid token, treat as guest
        req.user = null
        next()
    }
}

export function requireAuth(req, res, next) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authentication required' })
    }
    next()
}

