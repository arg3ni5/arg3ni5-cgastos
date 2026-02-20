import { useQuery } from "@tanstack/react-query";
import { DashboardTemplate, DataDesplegables, DataMovimientos, SpinnerLoader, useMovimientosStore, useOperaciones, useUsuariosStore } from "../index";
import { useEffect } from "react";

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
    queryFn: () =>
      mostrarMovimientos({
        anio: date.year(),
        mes: date.month() + 1,
        iduser: usuario?.id ?? 0,
        tipocategoria: 'b',
      }),
    enabled: !!usuario?.id && !!(date.month() + 1) && !!date.year(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (renamed from cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (loadingMovimientos) return <SpinnerLoader />;

  if (errorMovimientos) {
    return <h1>Error: {(errorMovimientos)?.message}</h1>;
  }
  return <DashboardTemplate />;
}
