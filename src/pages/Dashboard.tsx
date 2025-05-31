import { useQuery } from "@tanstack/react-query";
import { DashboardTemplate, DataDesplegableMovimientosObj, DataMovimientos, SpinnerLoader, useMovimientosStore, useOperaciones, useUsuariosStore } from "../index";
import { useEffect } from "react";
export const Dashboard = () => {
  const { tipoMovimiento, date, setTipoMovimientos } = useOperaciones();
  const { mostrarMovimientos, datamovimientos } = useMovimientosStore();
  const { usuario } = useUsuariosStore();

  

  useEffect(() => {
    console.log(DataDesplegableMovimientosObj['b']);

    setTipoMovimientos(DataDesplegableMovimientosObj['b']);
  }, [setTipoMovimientos]);

  // Cargar movimientos
  const { isLoading: loadingMovimientos, error: errorMovimientos } = useQuery<DataMovimientos, Error>({
    queryKey: ["mostrar movimientos", date, tipoMovimiento, usuario?.id],
    queryFn: () =>
      mostrarMovimientos({
        anio: date.year(),
        mes: date.month() + 1,
        iduser: usuario?.id ?? 0,
        tipocategoria: tipoMovimiento,
      }),
    enabled: datamovimientos == null || !!usuario?.id && !!(date.month() + 1) && !!date.year(),
  });

  if (loadingMovimientos) return <SpinnerLoader />;

  if (errorMovimientos) {
    return <h1>Error: {(errorMovimientos)?.message}</h1>;
  }
  return <DashboardTemplate />;
}
