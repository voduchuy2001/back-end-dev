import jwt from "jsonwebtoken";

const generateAccessToken = (userId, role, isBlocked) => {
    return jwt.sign({
        id: userId,
        role: role,
        isBlocked: isBlocked
    },
        process.env.ACCESS_TOKEN,
        { expiresIn: '3d' },
    )
}

const generateRefreshToken = (userId, role, isBlocked) => {
    return jwt.sign({
        id: userId,
        role: role,
        isBlocked: isBlocked
    },
        process.env.REFRESH_TOKEN,
        { expiresIn: '7d' },
    )
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}