import { useQuery } from "@tanstack/react-query";
import { DashboardTemplate, DataMovimientos, SpinnerLoader, useMovimientosStore, useOperaciones, useUsuariosStore } from "../index";
export const Dashboard = () => {
  const { tipo, date } = useOperaciones();
  const { mostrarMovimientos, datamovimientos } = useMovimientosStore();
  const { usuario } = useUsuariosStore();

  // Cargar movimientos
  const { isLoading: loadingMovimientos, error: errorMovimientos } = useQuery<DataMovimientos, Error>({
    queryKey: ["mostrar movimientos", date, tipo, usuario?.id],
    queryFn: () =>
      mostrarMovimientos({
        anio: date.year(),
        mes: date.month() + 1,
        iduser: usuario?.id ?? 0,
        tipocategoria: tipo,
      }),
    enabled: datamovimientos == null || !!usuario?.id && !!(date.month() + 1) && !!date.year(),
  });

  if (loadingMovimientos) return <SpinnerLoader />;

  if (errorMovimientos) {
    return <h1>Error: {(errorMovimientos)?.message}</h1>;
  }
  return <DashboardTemplate />;
}
