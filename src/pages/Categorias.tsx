import { useEffect } from "react";
import {
  CategoriasTemplate,
  useCategoriasStore,
  useOperaciones,
  useUsuariosStore,
  Categoria,
  useLoading,
} from "../index";
import { useQuery } from "@tanstack/react-query";

interface QueryParams {
  idusuario: number;
  tipo: string;
}

export const Categorias = () => {
  const { tipo } = useOperaciones();
  const { datacategoria, mostrarCategorias } = useCategoriasStore();
  const { usuario } = useUsuariosStore();
  const { setIsLoading } = useLoading();

  const { isLoading, error } = useQuery<Categoria[], Error>({
    queryKey: ["mostrar cuentas", tipo],
    queryFn: () =>
      mostrarCategorias({
        idusuario: usuario?.id,
        tipo
      } as QueryParams),
    enabled: !!usuario?.id,
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <CategoriasTemplate data={datacategoria || []}>
    </CategoriasTemplate>
  );
};
