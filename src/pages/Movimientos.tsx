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
  const { mostrarMovimientos } = useMovimientosStore();
  const { usuario } = useUsuariosStore();
  const { setIsLoading } = useLoading();
  const isDev = import.meta.env.DEV;

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
    enabled: !!usuario?.id && !!(date.month() + 1) && !!date.year(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (renamed from cacheTime)
    refetchOnMount: isDev ? "always" : true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
