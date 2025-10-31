import { registerSchema, loginSchema } from "../../../shemas/auth/auth.schema.js";
import { registerUseCase, loginUseCase } from "../../../../application/auth/authUseCases.js";

export const registerController = async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await registerUseCase(validated);
    res.status(201).json(result);
  } catch (error) {
    // 🧩 Validación de Zod
    if (error.name === "ZodError") {
        const formatted = error.issues.map(err => ({
        field: err.path.join("."),
        message: err.message
        }));

        return res.status(400).json({
        message: "Errores de validación",
        errors: formatted
        });
    }

    // 🧩 Otros errores (negocio, DB, etc)
    console.error("❌ Error en registerController:", error.message);
    res.status(400).json({ message: error.message || "Error desconocido" });
    }
};

export const loginController = async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await loginUseCase(validated);
    res.status(200).json(result);
  } catch (error) {
    if (error.name === "ZodError") {
      const formatted = error.issues.map(err => ({
        field: err.path.join("."),
        message: err.message
      }));
      return res.status(400).json({
        message: "Errores de validación",
        errors: formatted
      });
    }
    res.status(401).json({ message: error.message || "Error en login" });
  }
};