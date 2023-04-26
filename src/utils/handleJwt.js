import jwt from "jsonwebtoken";

const generateAccessToken = (userId, role, blocked) => {
    return jwt.sign({
        id: userId,
        role: role,
        blocked: blocked
    },
        process.env.ACCESS_TOKEN,
        { expiresIn: '3d' },
    )
}

const generateRefreshToken = (userId, role, blocked) => {
    return jwt.sign({
        id: userId,
        role: role,
        blocked: blocked
    },
        process.env.REFRESH_TOKEN,
        { expiresIn: '7d' },
    )
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}