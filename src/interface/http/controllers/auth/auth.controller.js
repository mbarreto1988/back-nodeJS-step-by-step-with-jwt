import { registerSchema, loginSchema } from "../../../shemas/auth/auth.schema.js";

export default class AuthController {
  constructor(authUseCases) {
    this.authUseCases = authUseCases;

    // Bind para mantener el contexto del this
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req, res) {
    try {
      // Validación de entrada
      const validated = registerSchema.parse(req.body);

      const result = await this.authUseCases.registerUser(validated);

      return res.status(201).json(result);
    } catch (error) {
      // Errores de validación Zod
      if (error.name === "ZodError") {
        const formatted = error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          message: "Errores de validación",
          errors: formatted,
        });
      }

      console.error("❌ Error en registerController:", error.message);
      res.status(400).json({ message: error.message || "Error desconocido" });
    }
  }

  async login(req, res) {
    try {
      const validated = loginSchema.parse(req.body);

      const result = await this.authUseCases.loginUser(validated);

      return res.status(200).json(result);
    } catch (error) {
      if (error.name === "ZodError") {
        const formatted = error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          message: "Errores de validación",
          errors: formatted,
        });
      }

      console.error("❌ Error en loginController:", error.message);
      res.status(401).json({ message: error.message || "Error en login" });
    }
  }
}
