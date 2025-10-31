import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../../infrastructure/repositories/auth/authRepository.js";
import { env } from "../../infrastructure/config/config.env.js";

export async function registerUseCase(data) {
  // 1️⃣ Validar si el email ya existe
  const existing = await AuthRepository.findByEmail(data.email);
  if (existing) {
    throw new Error("El email ya está registrado");
  }

  // 2️⃣ Hashear contraseña
  const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUNDS) || 10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  // 3️⃣ Crear usuario
  const createdUser = await AuthRepository.createUser({
    ...data,
    passwordHash
  });

  if (!createdUser) {
    throw new Error("Error al crear el usuario");
  }

  // 4️⃣ Generar tokens (igual que en login)
  const accessToken = jwt.sign(
    { id: createdUser.id, email: createdUser.email, role: createdUser.userRole },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: createdUser.id },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: `${env.REFRESH_TOKEN_EXPIRES_DAYS}d` }
  );

  // 5️⃣ Respuesta con usuario + tokens
  return {
    message: "Usuario registrado correctamente",
    user: {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      userName: createdUser.userName,
      email: createdUser.email,
      userRole: createdUser.userRole,
      createdAt: createdUser.createdAt
    },
    tokens: {
      accessToken,
      refreshToken
    }
  };
}

export async function loginUseCase(data) {
  const user = await AuthRepository.findByEmail(data.email);

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const validPassword = await bcrypt.compare(data.password, user.passwordHash);
  if (!validPassword) {
    throw new Error("Credenciales inválidas");
  }

  // 🪪 Generar tokens JWT
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.userRole },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: `${env.REFRESH_TOKEN_EXPIRES_DAYS}d` }
  );

  // 🧾 Devolver usuario sin password + tokens
  return {
    message: "Login exitoso",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      userRole: user.userRole
    },
    tokens: {
      accessToken,
      refreshToken
    }
  };
}