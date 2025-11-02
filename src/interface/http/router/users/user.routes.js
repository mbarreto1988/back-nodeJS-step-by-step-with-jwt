// 1️⃣ Dependencias externas
import { Router } from "express";

// 2️⃣ Configuración e infraestructura base
import { env } from "../../../../infrastructure/config/config.env.js";

// 3️⃣ Dominio / aplicación
import { createUserSchema, updateUserSchema, patchUserSchema } from "../../../shemas/users/user.schema.js";
import UserUseCases from "../../../../application/users/user.useCases.js";
import UserRepository from "../../../../infrastructure/repositories/users/userRepository.js";

// 4️⃣ Interfaz (middlewares y controladores)
import { validate } from "../../middlewares/users/validate.middleware.js";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware.js";
import UserController from "../../controllers/users/user.controller.js";

// 5️⃣ Inyección de dependencias
const userRepository = new UserRepository();
const userUseCases = new UserUseCases(userRepository);
const userController = new UserController(userUseCases, env);

// 6️⃣ Definición de rutas
const router = Router();

router.get("/", userController.getAllUsersController);
router.get("/:id", userController.getUserByIdController);
router.post("/", validate(createUserSchema), userController.createUserController);
router.put("/:id", validate(updateUserSchema), userController.updateUserController);
router.patch(
  "/:id",
  AuthMiddleware.authorizeRole("updateUser"),
  validate(patchUserSchema),
  userController.patchUserController
);
router.delete("/:id", userController.deleteUserController);

// 7️⃣ Export
export default router;
