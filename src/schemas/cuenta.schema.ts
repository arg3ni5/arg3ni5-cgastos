import { z } from 'zod';

// Base Cuenta schema
export const cuentaSchema = z.object({
  id: z.number().int().positive(),
  descripcion: z.string().min(1, 'La descripción es requerida').max(100, 'La descripción no puede exceder 100 caracteres'),
  icono: z.string().nullable(),
  tipo: z.string().nullable(),
  idusuario: z.number().int().positive().nullable(),
  saldo_actual: z.number().nullable()
});

// Schema for inserting a new Cuenta
export const cuentaInsertSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida').max(100, 'La descripción no puede exceder 100 caracteres'),
  icono: z.string().nullable().optional(),
  tipo: z.string().min(1, 'El tipo es requerido').nullable(),
  idusuario: z.number().int().positive('El ID de usuario debe ser un número positivo').nullable().optional(),
  saldo_actual: z.number().finite('El saldo debe ser un número válido').nullable().optional().default(0)
});

// Schema for updating a Cuenta
export const cuentaUpdateSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida').max(100, 'La descripción no puede exceder 100 caracteres').optional(),
  icono: z.string().nullable().optional(),
  tipo: z.string().nullable().optional(),
  idusuario: z.number().int().positive().nullable().optional(),
  saldo_actual: z.number().finite('El saldo debe ser un número válido').nullable().optional()
});

// Type exports
export type CuentaSchema = z.infer<typeof cuentaSchema>;
export type CuentaInsertSchema = z.infer<typeof cuentaInsertSchema>;
export type CuentaUpdateSchema = z.infer<typeof cuentaUpdateSchema>;
