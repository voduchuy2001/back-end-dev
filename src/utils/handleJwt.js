import jwt from "jsonwebtoken";

const generateAccessToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,
            role: role,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '3d' },
    )
}

const generateRefreshToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,
            role: role,
        },
        process.env.REFRESH_TOKEN,
        { expiresIn: '7d' },
    )
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}