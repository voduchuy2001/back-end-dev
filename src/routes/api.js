import express from "express";
import authController from "../controllers/authController";
import authValidation from "../validations/authValidation";
import { validation } from "../middlewares/validation";
import { verifyToken, admin } from "../middlewares/verifyToken";

const router = express.Router();

const initAPIRoutes = (app) => {
    // Auth
    router.post('/register', authValidation.validateRegister(), validation, authController.register);
    router.post('/login', authValidation.validateLogin(), validation, authController.login);
    router.get('/auth-check', verifyToken, authController.authCheck);
    router.get('/get-all-users', [verifyToken, admin], authController.getAllUser);
    router.post('/refresh-token', authController.refreshToken);
    router.post('/logout', authController.logout)
    router.post('/update-password', authValidation.validateUpdatePassword(), validation, [verifyToken], authController.updatePassword)

    return app.use('/api/v1', router);
};

module.exports = initAPIRoutes;