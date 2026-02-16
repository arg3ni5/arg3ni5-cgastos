import { z } from 'zod';

// Base Conexion schema
export const conexionSchema = z.object({
  id: z.number().int().positive(),
  canal: z.string(),
  canal_user_id: z.string(),
  canal_username: z.string().nullable(),
  usuario_id: z.number().int().positive(),
  vinculado_en: z.string().nullable()
});

// Schema for inserting a new Conexion
export const conexionInsertSchema = z.object({
  canal: z.enum(['google', 'facebook', 'twitter', 'github'], {
    errorMap: () => ({ message: 'El canal debe ser uno de: google, facebook, twitter, github' })
  }),
  canal_user_id: z.string().min(1, 'El ID de usuario del canal es requerido'),
  canal_username: z.string().nullable().optional(),
  usuario_id: z.number().int().positive('El ID de usuario debe ser un número positivo'),
  vinculado_en: z.string()
    .datetime({ message: 'La fecha debe ser una fecha válida en formato ISO' })
    .nullable()
    .optional()
});

// Schema for updating a Conexion
export const conexionUpdateSchema = z.object({
  canal: z.enum(['google', 'facebook', 'twitter', 'github'], {
    errorMap: () => ({ message: 'El canal debe ser uno de: google, facebook, twitter, github' })
  }).optional(),
  canal_user_id: z.string().min(1, 'El ID de usuario del canal es requerido').optional(),
  canal_username: z.string().nullable().optional(),
  usuario_id: z.number().int().positive().optional(),
  vinculado_en: z.string()
    .datetime({ message: 'La fecha debe ser una fecha válida en formato ISO' })
    .nullable()
    .optional()
});

// Type exports
export type ConexionSchema = z.infer<typeof conexionSchema>;
export type ConexionInsertSchema = z.infer<typeof conexionInsertSchema>;
export type ConexionUpdateSchema = z.infer<typeof conexionUpdateSchema>;
