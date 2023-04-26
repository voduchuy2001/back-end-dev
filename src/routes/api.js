import express from "express";
import authController from "../controllers/authController";
import productController from "../controllers/productController";
import { verifyToken, admin } from "../middleware/verifyToken";
import upload from "../config/cloudinary"

const router = express.Router();

const initAPIRoutes = (app) => {
    // Auth
    router.post('/register', authController.register);
    router.post('/activate', authController.verifyUser);
    router.post('/re-activate', authController.reVerifyUser);
    router.post('/login', authController.login);
    router.get('/auth-check', verifyToken, authController.auth);
    router.get('/get-users', [verifyToken, admin], authController.getUsers);
    router.post('/refresh-token', authController.refreshToken);
    router.post('/logout', authController.logout)
    router.post('/update-password',  [verifyToken], authController.updatePassword)
    router.put('/block-user/:id', [verifyToken, admin], authController.blockUser);
    router.put('/un-block-user/:id', [verifyToken, admin], authController.unBlockUser);
    router.post('/forgot-password', authController.forgotPassword)
    router.put('/reset-password/:token', authController.resetPassword)

    // Product
    router.post('/create-product', [verifyToken, admin], productController.createProduct);
    router.put('/update-product/:id',  [verifyToken, admin], productController.updateProduct);
    router.get('/product-detail/:id', productController.productDetail);
    router.get('/get-products', productController.getProducts);
    router.post('/upload-img/:id', [verifyToken, admin], upload.array('images'), productController.uploadImg);
    router.delete('/delete-img/:id/:imageId', [verifyToken, admin], productController.deleteImg);
    router.delete('/delete-product/:id', [verifyToken, admin], productController.deleteProduct);

    return app.use('/api/v1', router);
};

module.exports = initAPIRoutes;