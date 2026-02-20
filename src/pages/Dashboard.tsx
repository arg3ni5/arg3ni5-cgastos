import { useQuery } from "@tanstack/react-query";
import { DashboardTemplate, DataDesplegables, DataMovimientos, SpinnerLoader, useMovimientosStore, useOperaciones, useUsuariosStore } from "../index";
import { useEffect } from "react";
import { logger } from "../utils/logger";

export const Dashboard = () => {
  const { date, setTipoMovimientos } = useOperaciones();
  const { mostrarMovimientos } = useMovimientosStore();
  const { usuario } = useUsuariosStore();  

  useEffect(() => {
    setTipoMovimientos(DataDesplegables.movimientos['b']);
  }, [setTipoMovimientos]);

  // Cargar movimientos
  const { isLoading: loadingMovimientos, error: errorMovimientos } = useQuery<DataMovimientos, Error>({
    queryKey: ["mostrar movimientos", date, usuario?.id],
    queryFn: () => {
      if (!usuario?.id) {
        logger.warn('Usuario no disponible para cargar movimientos');
        throw new Error("Usuario no disponible");
      }
      return mostrarMovimientos({
        anio: date.year(),
        mes: date.month() + 1,
        iduser: usuario.id,
        tipocategoria: 'b',
      });
    },
    enabled: !!usuario?.id && !!(date.month() + 1) && !!date.year(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (renamed from cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Mostrar loader mientras se cargan los datos
  if (loadingMovimientos) return <SpinnerLoader />;

  // Si hay error en la query
  if (errorMovimientos) {
    logger.error('Error al cargar movimientos en Dashboard', { error: errorMovimientos });
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error al cargar los datos</h2>
        <p>{(errorMovimientos)?.message}</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Por favor, recarga la página o intenta más tarde</p>
      </div>
    );
  }

  // Si no hay usuario cargado, mostrar spinner (debería ser rápido)
  if (!usuario?.id) {
    return <SpinnerLoader />;
  }

  return <DashboardTemplate />;
}
