import {
  CategoriasTemplate,
  useCategoriasStore,
  useOperaciones,
  useUsuariosStore,
  SpinnerLoader,
  Categoria,
} from "../index";
import { useQuery } from "@tanstack/react-query";

interface QueryParams {
  idusuario: number;
  tipo: string;
}

export const Categorias = () => {
  const { tipo } = useOperaciones();
  const { datacategoria, mostrarCategorias } = useCategoriasStore();
  const { datausuarios } = useUsuariosStore();

  const { isLoading, error } = useQuery<Categoria[], Error>({
    queryKey: ["mostrar cuentas", tipo],
    queryFn: () =>
      mostrarCategorias({
        idusuario: datausuarios?.id,
        tipo
      } as QueryParams),
    enabled: !!datausuarios?.id,
  });

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <CategoriasTemplate data={datacategoria || []}>
    </CategoriasTemplate>
  );
};
