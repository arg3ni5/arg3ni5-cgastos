import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { CuentasTemplate } from "../components/templates/CuentasTemplate";
import { useCuentaStore } from "../store/CuentaStore";
import { useOperaciones } from "../store/OperacionesStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { Cuenta, CuentasQueryParams } from "../supabase/crudCuentas";
import { useQuery } from "@tanstack/react-query";

export function Cuentas() {
  const { tipo } = useOperaciones();
  const { cuentas, mostrarCuentas } = useCuentaStore();
  const { usuario } = useUsuariosStore();

  const { isLoading, error } = useQuery<Cuenta[], Error>({
    queryKey: ["mostrar categorias", tipo],
    queryFn: () =>
      mostrarCuentas({
        idusuario: usuario?.id,
        tipo
      } as CuentasQueryParams),
    enabled: !!usuario?.id,
  });

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }
  return (
    <>
      <CuentasTemplate data={cuentas} />
    </>
  );
}
