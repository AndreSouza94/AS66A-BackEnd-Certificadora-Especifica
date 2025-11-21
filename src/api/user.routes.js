import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as calcController from "../controllers/calc.controller.js";
import * as tokenAuth from "../services/token.service.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.get("/historico", tokenAuth.tokenValido, calcController.getCalculo);
router.delete("/historico", tokenAuth.tokenValido, calcController.deleteHistorico);
router.post("/calcular", tokenAuth.tokenValido, calcController.calcular);

export default router;