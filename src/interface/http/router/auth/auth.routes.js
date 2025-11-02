import { Router } from "express";
import AuthRepository from "../../../../infrastructure/repositories/auth/authRepository.js";
import AuthUseCases from "../../../../application/auth/authUseCases.js";
import AuthController from "../../controllers/auth/auth.controller.js";
import { env } from "../../../../infrastructure/config/config.env.js";

const router = Router();

// Inyección de dependencias 💉
const authRepository = new AuthRepository();
const authUseCases = new AuthUseCases(authRepository, env);
const authController = new AuthController(authUseCases);

// Rutas
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
