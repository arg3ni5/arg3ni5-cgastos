import { Database, supabase } from "../index";
import { conexionInsertSchema, conexionUpdateSchema } from "../schemas/conexion.schema";
import { logger } from "../utils/logger";
import { showErrorMessage, showSuccessMessage } from "../utils/messages";
import { z } from "zod";

export type Conexion = Database["public"]["Tables"]["conexiones_usuarios"]["Row"];
export type ConexionInsert = Database["public"]["Tables"]["conexiones_usuarios"]["Insert"];
export type ConexionUpdate = Database["public"]["Tables"]["conexiones_usuarios"]["Update"];
export type ConexionQueryParams = Database["public"]["Tables"]["conexiones_usuarios"]["Row"];

export const InsertarConexion = async (c: ConexionInsert) => {
  try {
    // Validate data before inserting
    const validatedData = conexionInsertSchema.parse(c);
    
    const { data, error } = await supabase.from("conexiones_usuarios").insert(validatedData).select();

    if (error) {
      logger.error('Error al insertar conexión', { error, conexion: c });
      showErrorMessage(`Ya existe un registro con ${c.canal_username}. Agregue un nuevo nombre.`);
      throw error;
    }
    
    if (data) {
      logger.info('Conexión creada exitosamente', { conexionId: data[0]?.id });
      showSuccessMessage('Datos guardados', '✅ Éxito');
    }
    return data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      logger.error('Error de validación al insertar conexión', { error: errorMessage, conexion: c });
      showErrorMessage(`Datos inválidos: ${errorMessage}`);
    } else {
      logger.error('Error al insertar conexión', { error, conexion: c });
      // Error already shown above
    }
    throw error;
  }
}

export const MostrarConexiones = async (c: ConexionQueryParams): Promise<Conexion[] | null> => {
  try {
    const { data, error } = await supabase
      .from("conexiones_usuarios")
      .select()
      .eq("usuario_id", c.usuario_id);

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error al mostrar conexiones', { error, userId: c.usuario_id });
    showErrorMessage('No se pudieron cargar las conexiones. Por favor, intenta nuevamente.');
    return null;
  }
};

export async function EliminarConexiones(c: ConexionQueryParams) {
  try {
    const { error } = await supabase.from("conexiones_usuarios").delete().eq("id", c.id);

    if (error) throw error;
    logger.info('Conexión eliminada exitosamente', { conexionId: c.id });
  } catch (error) {
    logger.error('Error al eliminar conexión', { error, conexionId: c.id });
    showErrorMessage('No se pudo eliminar la conexión. Por favor, intenta nuevamente.');
    throw error;
  }
}
