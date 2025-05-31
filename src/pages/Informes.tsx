import { JSX, useEffect } from "react";
import { DataMovimientos, InformesTemplate, useLoading, useMovimientosStore, useOperaciones, useUsuariosStore } from "../index";
import { useQuery } from "@tanstack/react-query";


export const Informes = (): JSX.Element => {
  const { tipoMovimiento, date } = useOperaciones();
  const { mostrarMovimientos, datamovimientos } = useMovimientosStore();
  const { usuario } = useUsuariosStore();
  const { setIsLoading } = useLoading();

  // Cargar movimientos
  const { isLoading, error: errorMovimientos } = useQuery<DataMovimientos, Error>({
    queryKey: ["mostrar movimientos", `${date.year()}-${date.month() + 1}`, tipoMovimiento, usuario?.id],
    queryFn: () =>
      mostrarMovimientos({
        anio: date.year(),
        mes: date.month() + 1,
        iduser: usuario?.id ?? 0,
        tipocategoria: tipoMovimiento,
      }),
      enabled: !!usuario?.id && !!date
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  if (errorMovimientos) {
    return <h1>Error: {(errorMovimientos)?.message}</h1>;
  }
  return <InformesTemplate />;
};

