import jwt from "jsonwebtoken";
import { env } from "../../../../infrastructure/config/config.env.js";


export const AuthMiddleware = {

  verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
  
    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }
  
    const token = authHeader.split(" ")[1]; // "Bearer <token>"
  
    if (!token) {
      return res.status(401).json({ message: "Token inválido o ausente" });
    }
  
    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
      req.user = decoded; // lo guardamos para usar en controladores
      next();
    } catch (error) {
      return res.status(403).json({ message: "Token no válido o expirado" });
    }
  },
  
  
  authorizeRole(action) {
    return (req, res, next) => {
      try {
        const user = req.user; // viene del verifyToken
  
        if (!user) {
          return res.status(401).json({ message: "No autenticado" });
        }
  
        const { role } = user;
        const targetUserId = parseInt(req.params.id);
  
        // Lógica de permisos según acción
        switch (action) {
          case "updateUser":
            // Si es admin, solo puede cambiar roles
            if (role === "admin") {
              req.allowedFields = ["userRole"];
              return next();
            }
  
            // Si es user, solo puede modificar su propio perfil
            if (role === "user") {
              if (user.id !== targetUserId) {
                return res.status(403).json({ message: "No podés modificar otros usuarios" });
              }
              req.allowedFields = ["firstName", "lastName", "userName", "email", "password"];
              return next();
            }
  
            // Si llega acá, no tiene permisos
            return res.status(403).json({ message: "Rol no autorizado" });
  
          default:
            return res.status(400).json({ message: "Acción no válida" });
        }
      } catch (error) {
        console.error("Error en authorizeRole:", error.message);
        return res.status(500).json({ message: "Error en autorización" });
      }
    };
  }
}

