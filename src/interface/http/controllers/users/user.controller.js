import bcrypt from "bcryptjs";

export default class UserController {
  constructor(userUseCases, env) {
    this.userUseCases = userUseCases;
    this.env = env;
    this.bcrypt = bcrypt;

    // ✅ usamos arrow functions para no perder el this
    this.getAllUsersController = async (req, res) => {
      try {
        console.log("Usuario autenticado:", req.user);
        const users = await this.userUseCases.getAllUsersUseCase();
        res.status(200).json(users);
      } catch (error) {
        console.error("❌ Error en getAllUsersController:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    };

    this.getUserByIdController = async (req, res) => {
      try {
        const { id } = req.params;
        const user = await this.userUseCases.getUserByIdUseCase(id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json(user);
      } catch (error) {
        console.error("❌ Error en getUserByIdController:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    };

    this.createUserController = async (req, res) => {
      try {
        const { firstName, lastName, userName, email, password } = req.body;

        if (!password)
          return res.status(400).json({ message: "La contraseña es obligatoria" });

        const saltRounds = Number(this.env.BCRYPT_SALT_ROUNDS) || 10;
        const passwordHash = await this.bcrypt.hash(password, saltRounds);

        const newUser = await this.userUseCases.createUserUseCase({
          firstName,
          lastName,
          userName,
          email,
          passwordHash,
        });

        res.status(201).json({
          message: "Usuario creado correctamente",
          user: newUser,
        });
      } catch (error) {
        console.error("❌ Error en createUserController:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    };

    this.updateUserController = async (req, res) => {
      try {
        const { id } = req.params;
        const { firstName, lastName, userName, email } = req.body;

        if (!firstName || !lastName || !userName || !email)
          return res.status(400).json({
            message: "Campos requeridos: firstName, lastName, userName, email",
          });

        const updatedUser = await this.userUseCases.updateUserUseCase(id, {
          firstName,
          lastName,
          userName,
          email,
        });

        if (!updatedUser)
          return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("❌ Error en updateUserController:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    };

    this.patchUserController = async (req, res) => {
      try {
        const { id } = req.params;
        const fields = req.body;

        if (!Object.keys(fields).length)
          return res.status(400).json({
            message: "Debe enviar al menos un campo para actualizar",
          });

        const updatedUser = await this.userUseCases.patchUserUseCase(id, fields);

        if (!updatedUser)
          return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("❌ Error en patchUserController:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    };

    this.deleteUserController = async (req, res) => {
      try {
        const { id } = req.params;
        const deleted = await this.userUseCases.deleteUserUseCase(id);

        if (!deleted)
          return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json({
          message: "Usuario eliminado correctamente",
          deleted,
        });
      } catch (error) {
        console.error("❌ Error en deleteUserController:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    };
  }
}
