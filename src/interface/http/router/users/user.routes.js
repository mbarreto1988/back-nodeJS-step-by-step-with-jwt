import { Router } from "express";
import { getAllUsersController } from "../../controllers/users/user.controller.js";

const router = Router();

router.get('/', getAllUsersController);

export default router;