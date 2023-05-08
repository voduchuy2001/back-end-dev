import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
    try {
        if (req?.headers?.authorization?.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1]
            jwt.verify(token, process.env.ACCESS_TOKEN, (err, decode) => {
                if (err) {
                    return res.status(400).json({
                        msg: 'Invalid access token!'
                    })
                } else {
                    req.user = decode
                    next()
                }
            })
        } else {
            return res.status(400).json({
                msg: 'Require authentication!'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const admin = (req, res, next) => {
    try {
        const { role } = req.user
        if (role !== 'admin') {
            return res.status(401).json({
                msg: 'Access denied, you do not have permission!'
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

const blocked = (req, res, next) => {
    try {
        const { isBlocked } = req.user
        if (isBlocked !== false) {
            return res.status(401).json({
                msg: 'Access denied, your account has been blocked!'
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

const verified = (req, res, next) => {
    try {
        const { verifiedAt } = req.user
        if (verifiedAt !== false) {
            return res.status(401).json({
                msg: 'Must be verified!'
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    verifyToken,
    admin,
    blocked,
    verified,
}