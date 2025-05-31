import { useEffect } from "react";
import {
  useOperaciones,
  useUsuariosStore,
  MovimientosTemplate,
  useMovimientosStore,
  DataMovimientos,
  useLoading,
} from "../index";
import { useQuery } from "@tanstack/react-query";

export const Movimientos = () => {
  const { selectTipoMovimiento: tipo, date } = useOperaciones();
  const { mostrarMovimientos, datamovimientos } = useMovimientosStore();
  const { usuario } = useUsuariosStore();
  const { setIsLoading } = useLoading();



  // Cargar movimientos
  const { isLoading, error } = useQuery<DataMovimientos, Error>({
    queryKey: ["mostrar movimientos", date, tipo, usuario?.id],
    queryFn: () =>
      mostrarMovimientos({
        anio: date.year(),
        mes: date.month() + 1,
        iduser: usuario?.id ?? 0,
        tipocategoria: tipo.tipo,
      }),
    enabled: datamovimientos == null || !!usuario?.id && !!(date.month() + 1) && !!date.year(),
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <MovimientosTemplate />
  );
};
