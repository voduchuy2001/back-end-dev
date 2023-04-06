import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

const initAPIRoutes = (app) => {
    // Auth
    router.post('/register', authController.register);

    return app.use('/api', router);
};

module.exports = initAPIRoutes;