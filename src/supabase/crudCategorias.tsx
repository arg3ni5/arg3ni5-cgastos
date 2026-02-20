import { Database, supabase } from "../index";
import { categoriaInsertSchema, categoriaUpdateSchema } from "../schemas/categoria.schema";
import { logger } from "../utils/logger";
import { showErrorMessage, showSuccessMessage } from "../utils/messages";
import { z } from "zod";

export type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
export type CategoriaInsert = Database["public"]["Tables"]["categorias"]["Insert"];
export type CategoriaUpdate = Database["public"]["Tables"]["categorias"]["Update"];
export interface CategoriaQueryParams {
  idusuario: number;
  tipo?: string;
  id?: number;
}

export const InsertarCategorias = async (p: CategoriaInsert): Promise<void> => {
  try {
    // Validate data before inserting
    const validatedData = categoriaInsertSchema.parse(p);
    
    const { data, error } = await supabase
      .from("categorias")
      .insert(validatedData)
      .select();

    if (error) {
      logger.error('Error al insertar categoría', { error, categoria: p });
      showErrorMessage(`Ya existe un registro con ${p.descripcion}. Agregue una nueva descripción.`);
      throw error;
    }
    
    if (data) {
      logger.info('Categoría creada exitosamente', { categoriaId: data[0]?.id });
      showSuccessMessage('Datos guardados', '✅ Éxito');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      logger.error('Error de validación al insertar categoría', { error: errorMessage, categoria: p });
      showErrorMessage(`Datos inválidos: ${errorMessage}`);
    } else {
      logger.error('Error al insertar categoría', { error, categoria: p });
      // Error already shown above, just log it
    }
  }
};

export const MostrarCategorias = async (p: CategoriaQueryParams): Promise<Categoria[] | null> => {
  try {
    const { data, error } =
      p.tipo ?
        await supabase
          .from("categorias")
          .select()
          .eq("idusuario", p.idusuario)
          .eq("tipo", p.tipo || '')
          .order("id", { ascending: false }) :
        await supabase
          .from("categorias")
          .select()
          .eq("idusuario", p.idusuario)
          .order("id", { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error al mostrar categorías', { error, userId: p.idusuario });
    showErrorMessage('No se pudieron cargar las categorías. Por favor, intenta nuevamente.');
    return null;
  }
};

export const EliminarCategorias = async (p: CategoriaQueryParams): Promise<void> => {
  try {
    if (!p.id) {
      throw new Error("ID is required");
    }
    if (!p.idusuario) {
      throw new Error("ID usuario is required");
    }
    
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("idusuario", p.idusuario)
      .eq("id", p.id);
    
    if (error) throw error;
    logger.info('Categoría eliminada exitosamente', { categoriaId: p.id });
  } catch (error) {
    logger.error('Error al eliminar categoría', { error, categoriaId: p.id });
    showErrorMessage('No se pudo eliminar la categoría. Por favor, intenta nuevamente.');
    throw error;
  }
};

export const EditarCategorias = async (p: CategoriaUpdate): Promise<void> => {
  try {
    if (!p.id) {
      throw new Error("ID is required");
    }
    if (!p.idusuario) {
      throw new Error("ID usuario is required");
    }
    
    // Validate data before updating
    const validatedData = categoriaUpdateSchema.parse(p);
    
    const { error } = await supabase
      .from("categorias")
      .update(validatedData)
      .eq("idusuario", p.idusuario)
      .eq("id", p.id);
    
    if (error) throw error;
    logger.info('Categoría actualizada exitosamente', { categoriaId: p.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      logger.error('Error de validación al editar categoría', { error: errorMessage, categoriaId: p.id });
      showErrorMessage(`Datos inválidos: ${errorMessage}`);
    } else {
      logger.error('Error al editar categoría', { error, categoriaId: p.id });
      showErrorMessage('No se pudo editar la categoría. Por favor, intenta nuevamente.');
    }
    throw error;
  }
};

export const EliminarCategoriasTodas = async (p: Pick<CategoriaQueryParams, 'idusuario'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("idusuario", p.idusuario);
    
    if (error) throw error;
    
    logger.info('Todas las categorías eliminadas exitosamente', { userId: p.idusuario });
    showSuccessMessage('Datos reseteados', '✅ Éxito');
  } catch (error) {
    logger.error('Error al eliminar todas las categorías', { error, userId: p.idusuario });
    showErrorMessage('No se pudieron eliminar las categorías. Por favor, intenta nuevamente.');
    throw error;
  }
};