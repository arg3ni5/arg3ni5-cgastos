import { z } from 'zod';

// Base Categoria schema
export const categoriaSchema = z.object({
  id: z.number().int().positive(),
  descripcion: z.string().nullable(),
  tipo: z.string().nullable(),
  color: z.string().nullable(),
  icono: z.string().nullable(),
  idusuario: z.number().int().positive().nullable()
});

// Schema for inserting a new Categoria
export const categoriaInsertSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida').max(100, 'La descripción no puede exceder 100 caracteres').nullable().optional(),
  tipo: z.enum(['ingreso', 'egreso'], {
    errorMap: () => ({ message: 'El tipo debe ser "ingreso" o "egreso"' })
  }).nullable().optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe ser un código hexadecimal válido (ej: #FF5733)')
    .nullable()
    .optional(),
  icono: z.string().nullable().optional(),
  idusuario: z.number().int().positive('El ID de usuario debe ser un número positivo').nullable().optional()
});

// Schema for updating a Categoria
export const categoriaUpdateSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida').max(100, 'La descripción no puede exceder 100 caracteres').nullable().optional(),
  tipo: z.enum(['ingreso', 'egreso'], {
    errorMap: () => ({ message: 'El tipo debe ser "ingreso" o "egreso"' })
  }).nullable().optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe ser un código hexadecimal válido (ej: #FF5733)')
    .nullable()
    .optional(),
  icono: z.string().nullable().optional(),
  idusuario: z.number().int().positive().nullable().optional()
});

// Type exports
export type CategoriaSchema = z.infer<typeof categoriaSchema>;
export type CategoriaInsertSchema = z.infer<typeof categoriaInsertSchema>;
export type CategoriaUpdateSchema = z.infer<typeof categoriaUpdateSchema>;
