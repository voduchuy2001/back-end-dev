import User from "../models/user"

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
                const newUser = await User.create({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
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
            msg: "500",
            error: error
        })
    }
}

module.exports = {
    register,
}