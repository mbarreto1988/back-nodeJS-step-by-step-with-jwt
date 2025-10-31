import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  userName: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' }),
  email: z.string().refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: 'Debe ser un email válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export const loginSchema = z.object({
  email: z.string().email(1, { message:"Debe ser un email válido"}),
  password: z.string().min(1, { message: "La contraseña es obligatoria"})
});
