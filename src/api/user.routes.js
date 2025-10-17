import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as calcController from "../controllers/calc.controller.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.post("/calc", calcController.calc);

export default router;