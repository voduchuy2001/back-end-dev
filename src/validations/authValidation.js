import { body } from "express-validator";

const validateRegister = () => [
    body('email').notEmpty().withMessage('Email is required!')
        .isEmail().withMessage('Email format wrong!'),
    body('password').notEmpty().withMessage('Password is required!')
        .isLength({ min: 6 }).withMessage('Password min 6 characters'),
    body('mobile').notEmpty().withMessage('Mobile is required!'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required')
]

const validateLogin = () => [
    body('email').notEmpty().withMessage('Email is required!')
        .isEmail().withMessage('Email format wrong!'),
    body('password').notEmpty().withMessage('Password is required!')
]

const validateUpdatePassword = () => [
    body('oldPassword').notEmpty().withMessage('Old password is required!'),
    body('password').notEmpty().withMessage('Password is required!')
]

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdatePassword,
}