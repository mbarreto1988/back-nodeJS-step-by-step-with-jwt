import { UserUseCases } from "../../../../application/users/user.useCases.js";

export async function getAllUsersController(req, res) {
  try {
    console.log("Usuario autenticado:", req.user)
    const users = await UserUseCases.getAllUsersUseCase();
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error en getAllUsersController:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}