const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET
// console.log(secret)

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if(!token) return res.status(401).json({error: 'No token provided'})

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' })
        req.user = user
        next()
    })
}

module.exports = authenticateToken