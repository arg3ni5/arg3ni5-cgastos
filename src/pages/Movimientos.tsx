import {
  useOperaciones,
  useUsuariosStore,
  SpinnerLoader,
  MovimientosTemplate,
  useMovimientosStore,
  DataMovimientos,
} from "../index";
import { useQuery } from "@tanstack/react-query";

export const Movimientos = () => {
  const { tipo, date } = useOperaciones();
  const { mostrarMovimientos } = useMovimientosStore();
  const { datausuarios } = useUsuariosStore();

  // Cargar movimientos
  const { isLoading: loadingMovimientos, error: errorMovimientos } = useQuery<DataMovimientos, Error>({
    queryKey: ["mostrar movimientos", date, tipo, datausuarios?.id],
    queryFn: () =>
      mostrarMovimientos({
        anio: date.year(),
        mes: date.month() + 1,
        iduser: datausuarios?.id ?? 0,
        tipocategoria: tipo,
      }),
    enabled: !!datausuarios?.id && !!(date.month() + 1) && !!date.year(),
  });

  if (loadingMovimientos) return <SpinnerLoader />;

  if (errorMovimientos) {
    return <h1>Error: {(errorMovimientos)?.message}</h1>;
  }

  return (
    <MovimientosTemplate />
  );
};
