import { z } from 'zod';

// Esquema base
export const userBaseSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  userName: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' }),
  email: z.string().refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: 'Debe ser un email válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

// Para POST → todos requeridos
export const createUserSchema = userBaseSchema;

// Para PUT → todos requeridos (como reemplaza)
export const updateUserSchema = userBaseSchema;

// Para PATCH → opcionales
export const patchUserSchema = userBaseSchema.partial();