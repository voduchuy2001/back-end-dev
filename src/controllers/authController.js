import User from "../models/user";
import handleHashPassword from "../utils/handleHashPassword";
import handleJwt from "../utils/handleJwt";
import handleMail from "../utils/handleMail";
import bcrypt from "bcrypt";
const crypto = require('crypto');
import jwt from "jsonwebtoken";
const { paginateSearch } = require('../utils/handlePaginate');

const register = async (req, res) => {
    try {
        const findUserByEmail = await User.findOne({ email: req.body.email })

        if (!findUserByEmail) {
            const hashPassword = await handleHashPassword.hashPassword(req.body.password);
            const user = await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashPassword,
            })

            const verifyToken = crypto.randomBytes(32).toString('hex')
            await user.updateOne({
                verifyToken: crypto.createHash('sha256').update(verifyToken).digest('hex'),
                verifyTokenExpired: Date.now() + 15 * 60 * 1000
            });

            const emailTemplate = `You are receiving this email because we received because we need to authenticate you as a real user.This link will expire in 15 minutes. 
            <a href=${process.env.URL_SERVER}/api/v1/activate/${verifyToken}>Click here</a>`

            const data = {
                subject: "Activated account",
                email: user.email,
                html: emailTemplate,
            }

            const sendingMail = await handleMail(data);

            if (!sendingMail) {
                return res.status(400).json({
                    msg: 'Mailing fail!'
                })
            } else {
                return res.status(200).json({
                    msg: 'A active account email has been sent to your email!'
                })
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

const verifyUser = async (req, res) => {
    try {
        const { verifyToken } = req.body;
        const hashedToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
        const activeUser = await User.findOne({
            verifyToken: hashedToken,
            verifyTokenExpired: { $gt: Date.now() },
        });

        if (!activeUser) {
            return res.status(400).json({
                msg: "Token Expired, Please try again later!"
            })
        } else {
            activeUser.verifyToken = null;
            activeUser.verifyTokenExpired = null;
            activeUser.verifiedAt = Date.now();

            await activeUser.save();
            return res.status(200).json({
                msg: "User is activated"
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const reVerifyUser = async (req, res) => {
    try {
        const { email } = req.body;
        const findUserByEmail = await User.findOne({ email: email })
        if (!findUserByEmail) {
            return res.status(400).json({
                msg: "User does not exist!"
            })
        } else {
            const verifyToken = crypto.randomBytes(32).toString('hex')
            await findUserByEmail.updateOne({
                verifyToken: crypto.createHash('sha256').update(verifyToken).digest('hex'),
                verifyTokenExpired: Date.now() + 15 * 60 * 1000
            });

            const emailTemplate = `You are receiving this email because we received because we need to authenticate you as a real user.This link will expire in 15 minutes. 
            <a href=${process.env.URL_SERVER}/api/v1/activate/${verifyToken}>Click here</a>`

            const data = {
                subject: "Activated account",
                email: req.body.email,
                html: emailTemplate,
            }

            const sendingMail = await handleMail(data);

            if (!sendingMail) {
                return res.status(400).json({
                    msg: 'Mailing fail!'
                })
            } else {
                return res.status(200).json({
                    msg: 'A active account email has been sent to your email!'
                })
            }
        }
    }
    catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).json({
                msg: 'These credentials do not match our records!'
            })
        } else {
            const comparePassword = await bcrypt.compare(req.body.password, user.password)
            if (!comparePassword) {
                return res.status(400).json({
                    msg: 'Password does not match!'
                })
            } else {
                const accessToken = handleJwt.generateAccessToken(user.id, user.role, user.blocked)
                const refreshToken = handleJwt.generateRefreshToken(user.id, user.role, user.blocked)
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
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const auth = async (req, res) => {
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

const refreshToken = async (req, res) => {
    try {
        const cookie = req.cookies
        if (!cookie.refreshToken) {
            return res.status(400).json({
                msg: 'Do not have refresh token in cookie!'
            })
        } else {
            await jwt.verify(cookie.refreshToken, process.env.REFRESH_TOKEN, (err, decode) => {
                if (err) {
                    return res.status(400).json({
                        msg: 'Invalid refresh token!'
                    })
                } else {
                    const newAccessToken = handleJwt.generateAccessToken(decode.id, decode.role, decode.blocked)
                    return res.status(200).json({
                        accessToken: newAccessToken
                    })
                }
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const logout = async (req, res) => {
    try {
        const cookie = req.cookies
        if (!cookie.refreshToken) {
            return res.status(400).json({
                msg: 'Do not have refresh token in cookie!'
            })
        } else {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true
            })
            return res.status(200).json({
                msg: 'User is logout'
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const getUsers = async (req, res) => {
    try {
        const searchText = req.query.search
        const page = req.query.page || 1
        const limit = req.query.limit || 10

        const users = await paginateSearch(User, searchText, { page: page, limit: limit });
        if (!users) {
            return res.status(400).json({
                msg: 'No users found!'
            })
        } else {
            return res.status(200).json({
                msg: 'Users list!',
                users: users
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const updatePassword = async (req, res) => {
    try {
        const oldPassword = req.body.oldPassword
        const user = await User.findById(req.user.id)
        const comparePassword = await bcrypt.compare(oldPassword, user.password)
        if (!comparePassword) {
            return res.status(400).json({
                msg: "Wrong password!"
            })
        } else {
            const hashPassword = await hashPasswordService.hashPassword(req.body.password)
            user.password = hashPassword
            await user.save()
            return res.status(200).json({
                msg: "Updated password!"
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const blockUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOne({ _id: id })
        if (!user) {
            return res.status(400).json({
                msg: "Not found user!"
            })
        } else {
            user.blocked = true
            await user.save()
            return res.status(200).json({
                msg: "Blocked!"
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const unBlockUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOne({ _id: id })
        if (!user) {
            return res.status(400).json({
                msg: "Not found user!"
            })
        } else {
            user.blocked = false
            await user.save()
            return res.status(200).json({
                msg: "Un blocked!"
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).json({
                msg: 'These credentials do not match our records!'
            })
        } else {
            const resetToken = crypto.randomBytes(32).toString('hex')
            await user.updateOne({
                passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
                passwordResetExpired: Date.now() + 15 * 60 * 1000
            });
            const emailTemplate = `You are receiving this email because we received a password reset request for your account.This password reset link will expire in 15 minutes. 
            <a href=${process.env.URL_SERVER}/api/v1/reset-password/${resetToken}>Click here</a>`

            const data = {
                subject: "Forgot Password",
                email: user.email,
                html: emailTemplate,
            }

            const sendingMail = await handleMail(data);
            if (!sendingMail) {
                return res.status(400).json({
                    msg: 'Mailing fail!'
                })
            } else {
                return res.status(200).json({
                    msg: 'A confirmation email has been sent to your email!'
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpired: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({
                msg: "Token Expired, Please try again later!"
            })
        } else {
            const hashPassword = await hashPasswordService.hashPassword(password)
            user.password = hashPassword
            user.passwordResetToken = null;
            user.passwordResetExpired = null;
            await user.save();
            return res.status(200).json({
                msg: "Updated password"
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

module.exports = {
    register,
    verifyUser,
    reVerifyUser,
    login,
    auth,
    getUsers,
    refreshToken,
    logout,
    updatePassword,
    blockUser,
    unBlockUser,
    forgotPassword,
    resetPassword,
}