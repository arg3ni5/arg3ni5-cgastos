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
  const { selectTipoCategoria } = useOperaciones();
  const { datacategoria, mostrarCategorias } = useCategoriasStore();
  const { usuario } = useUsuariosStore();
  const { setIsLoading } = useLoading();

  const { isLoading, error, refetch } = useQuery<Categoria[], Error>({
    queryKey: ["mostrar cuentas", selectTipoCategoria, usuario?.id],
    queryFn: () =>
      mostrarCategorias({
        idusuario: usuario?.id,
        tipo: selectTipoCategoria.tipo,
      } as QueryParams),
    enabled: false, // desactivar ejecución automática
  });
  
  useEffect(() => {
    if (usuario?.id) {
      refetch(); // ejecutar manualmente cuando esté disponible
    }
  }, [usuario?.id, selectTipoCategoria, refetch]);
  

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
