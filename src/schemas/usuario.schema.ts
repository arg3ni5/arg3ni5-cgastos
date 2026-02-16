import { z } from 'zod';

// Base Usuario schema
export const usuarioSchema = z.object({
  id: z.number().int().positive(),
  nombres: z.string(),
  foto: z.string().nullable(),
  idauth_supabase: z.string().nullable(),
  moneda: z.string().nullable(),
  pais: z.string().nullable(),
  tema: z.string().nullable()
});

// Schema for inserting a new Usuario
export const usuarioInsertSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  foto: z.string().url('La foto debe ser una URL válida').nullable().optional(),
  idauth_supabase: z.union([z.string().uuid('El ID de autenticación debe ser un UUID válido'), z.null()]).optional(),
  moneda: z.string().length(3, 'La moneda debe ser un código ISO de 3 letras (ej: USD, EUR)').nullable().optional(),
  pais: z.string().length(2, 'El país debe ser un código ISO de 2 letras (ej: US, ES)').nullable().optional(),
  tema: z.enum(['0', '1'], {
    errorMap: () => ({ message: 'El tema debe ser "0" (claro) o "1" (oscuro)' })
  }).nullable().optional()
});

// Schema for updating a Usuario
export const usuarioUpdateSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres').optional(),
  foto: z.string().url('La foto debe ser una URL válida').nullable().optional(),
  idauth_supabase: z.union([z.string().uuid('El ID de autenticación debe ser un UUID válido'), z.null()]).optional(),
  moneda: z.string().length(3, 'La moneda debe ser un código ISO de 3 letras (ej: USD, EUR)').nullable().optional(),
  pais: z.string().length(2, 'El país debe ser un código ISO de 2 letras (ej: US, ES)').nullable().optional(),
  tema: z.enum(['0', '1'], {
    errorMap: () => ({ message: 'El tema debe ser "0" (claro) o "1" (oscuro)' })
  }).nullable().optional()
});

// Type exports
export type UsuarioSchema = z.infer<typeof usuarioSchema>;
export type UsuarioInsertSchema = z.infer<typeof usuarioInsertSchema>;
export type UsuarioUpdateSchema = z.infer<typeof usuarioUpdateSchema>;
