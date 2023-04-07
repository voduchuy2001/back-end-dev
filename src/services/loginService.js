import User from "../models/user";
import bcrypt from "bcrypt";

const handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({email})

            if (!user) {
                resolve(false)
            } else {
                const comparePassword = await bcrypt.compare(password, user.password)
                if (!comparePassword) {
                    resolve(false)
                } else {
                    const data = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        isBlocked: user.isBlocked,
                    }
                    resolve(data)
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleLogin
}