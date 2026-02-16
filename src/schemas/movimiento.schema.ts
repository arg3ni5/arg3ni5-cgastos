import { z } from 'zod';

// Base Movimiento schema
export const movimientoSchema = z.object({
  id: z.number().int().positive(),
  descripcion: z.string().nullable(),
  tipo: z.string(),
  valor: z.number().nullable(),
  fecha: z.string().nullable(),
  estado: z.string().nullable(),
  idcategoria: z.number().int().positive().nullable(),
  idcuenta: z.number().int().positive().nullable()
});

// Schema for inserting a new Movimiento
export const movimientoInsertSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida').max(200, 'La descripción no puede exceder 200 caracteres').nullable().optional(),
  tipo: z.enum(['ingreso', 'egreso'], {
    errorMap: () => ({ message: 'El tipo debe ser "ingreso" o "egreso"' })
  }),
  valor: z.number()
    .positive('El valor debe ser un número positivo')
    .finite('El valor debe ser un número válido')
    .nullable()
    .optional(),
  fecha: z.string()
    .datetime({ message: 'La fecha debe ser una fecha válida en formato ISO' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'La fecha debe estar en formato YYYY-MM-DD'))
    .nullable()
    .optional(),
  estado: z.string().nullable().optional(),
  idcategoria: z.number().int().positive('El ID de categoría debe ser un número positivo').nullable().optional(),
  idcuenta: z.number().int().positive('El ID de cuenta debe ser un número positivo').nullable().optional()
});

// Schema for updating a Movimiento
export const movimientoUpdateSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida').max(200, 'La descripción no puede exceder 200 caracteres').nullable().optional(),
  tipo: z.enum(['ingreso', 'egreso'], {
    errorMap: () => ({ message: 'El tipo debe ser "ingreso" o "egreso"' })
  }).optional(),
  valor: z.number()
    .positive('El valor debe ser un número positivo')
    .finite('El valor debe ser un número válido')
    .nullable()
    .optional(),
  fecha: z.string()
    .datetime({ message: 'La fecha debe ser una fecha válida en formato ISO' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'La fecha debe estar en formato YYYY-MM-DD'))
    .nullable()
    .optional(),
  estado: z.string().nullable().optional(),
  idcategoria: z.number().int().positive().nullable().optional(),
  idcuenta: z.number().int().positive().nullable().optional()
});

// Type exports
export type MovimientoSchema = z.infer<typeof movimientoSchema>;
export type MovimientoInsertSchema = z.infer<typeof movimientoInsertSchema>;
export type MovimientoUpdateSchema = z.infer<typeof movimientoUpdateSchema>;
