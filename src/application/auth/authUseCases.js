import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class AuthUseCases {
  constructor(authRepository, env) {
    this.authRepository = authRepository;
    this.env = env;
  }

  async registerUser(data) {
    const existing = await this.authRepository.findByEmail(data.email);
    if (existing) throw new Error("El email ya está registrado");

    const salt = await bcrypt.genSalt(Number(this.env.BCRYPT_SALT_ROUNDS) || 10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const createdUser = await this.authRepository.createUser({
      ...data,
      passwordHash,
    });

    if (!createdUser) throw new Error("Error al crear el usuario");

    // 🧩 Normalizamos los valores de expiración
    const accessExpire =
      this.env.ACCESS_TOKEN_EXPIRES_IN?.toString().trim().replaceAll('"', "") ||
      "1h";
    const refreshExpireDays = Number(this.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7;

    // 🔐 Generar tokens
    const accessToken = jwt.sign(
      { id: createdUser.id, email: createdUser.email, role: createdUser.userRole },
      this.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessExpire } // ej: "1h"
    );

    const refreshToken = jwt.sign(
      { id: createdUser.id },
      this.env.REFRESH_TOKEN_SECRET,
      { expiresIn: `${refreshExpireDays}d` } // ej: "7d"
    );

    return {
      message: "Usuario registrado correctamente",
      user: {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        userName: createdUser.userName,
        email: createdUser.email,
        userRole: createdUser.userRole,
        createdAt: createdUser.createdAt,
      },
      tokens: { accessToken, refreshToken },
    };
  }

  async loginUser(data) {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) throw new Error("Credenciales inválidas");

    const validPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!validPassword) throw new Error("Credenciales inválidas");

    // 🧩 Normalizamos expiraciones
    const accessExpire =
      this.env.ACCESS_TOKEN_EXPIRES_IN?.toString().trim().replaceAll('"', "") ||
      "1h";
    const refreshExpireDays = Number(this.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7;

    // 🔐 Generar tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.userRole },
      this.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessExpire }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      this.env.REFRESH_TOKEN_SECRET,
      { expiresIn: `${refreshExpireDays}d` }
    );

    return {
      message: "Login exitoso",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        userRole: user.userRole,
      },
      tokens: { accessToken, refreshToken },
    };
  }
}
