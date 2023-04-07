import User from "../models/user";
import registerService from "../services/registerService";
import loginService from "../services/loginService";
import jwt from "../utils/jwt"

const register = async (req, res) => {
    try {
        const email = req.body.email
        const mobile = req.body.mobile
        const findUserByEmail = await User.findOne({ email: email })

        if (!findUserByEmail) {
            const findUserByMobile = await User.findOne({ mobile: mobile })
            if (findUserByMobile) {
                return res.status(400).json({
                    msg: 'Phone number already in use!'
                });
            } else {
                const hashPassword = await registerService.hashPassword(req.body.password)
                await User.create({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashPassword,
                    mobile: req.body.mobile
                })
                return res.status(200).json({
                    msg: 'Register success!',
                });
            }
        } else {
            return res.status(400).json({
                msg: 'E-mail already in use!'
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const login = async (req, res) => {
    try {
        const user = await loginService.handleLogin(req.body.email, req.body.password)

        if (!user) {
            return res.status(400).json({
                msg: 'These credentials do not match our records!'
            })
        } else {
            const accessToken = jwt.generateAccessToken(user.id, user.role)
            const refreshToken = jwt.generateRefreshToken(user.id, user.role)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({
                accessToken,
                msg: 'Login successfully!',
                user: user,
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const authCheck = async(req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(400).json({
                msg: 'User not found!'
            })
        } else {
            return res.status(200).json({
                msg: 'The user is logged in!',
                user: user
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

module.exports = {
    register,
    login,
    authCheck,
}