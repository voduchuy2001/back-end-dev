import express from "express";
import authController from "../controllers/authController";
import productController from "../controllers/productController";
import authValidation from "../validations/authValidation";
import productValidation from "../validations/productValidation";
import { validation } from "../middleware/validation";
import { verifyToken, admin } from "../middleware/verifyToken";
import upload from "../config/cloudinary"

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
    router.put('/block-user/:id', [verifyToken, admin], authController.blockUser);
    router.put('/un-block-user/:id', [verifyToken, admin], authController.unBlockUser);
    router.post('/forgot-password', authValidation.validateForgotPassword(), validation, authController.forgotPassword)
    router.put('/reset-password/:token', authValidation.validateResetPassword(), validation, authController.resetPassword)

    // Product
    router.post('/create-product', productValidation.validateCreateProduct(), validation, [verifyToken, admin], productController.createProduct);
    router.put('/update-product/:id', productValidation.validateUpdateProduct(), validation, [verifyToken, admin], productController.updateProduct);
    router.get('/product-detail/:id', productController.productDetail);
    router.get('/get-all-products', productController.getAllProduct);
    router.post('/upload-img/:id', [verifyToken, admin], upload.array('image'), productController.uploadImg);

    return app.use('/api/v1', router);
};

module.exports = initAPIRoutes;