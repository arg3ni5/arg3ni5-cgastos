import { useEffect } from "react";
import { CuentasTemplate } from "../components/templates/CuentasTemplate";
import { useLoading } from "../context/LoadingContext";
import { useCuentaStore } from "../store/CuentaStore";
import { useOperaciones } from "../store/OperacionesStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { Cuenta } from "../supabase/crudCuentas";
import { useQuery } from "@tanstack/react-query";

export function Cuentas() {
  const { selectTipoCuenta } = useOperaciones();
  const { cuentas, mostrarCuentas } = useCuentaStore();
  const { usuario } = useUsuariosStore();
  const { setIsLoading } = useLoading();

  const { isLoading, error } = useQuery<Cuenta[], Error>({
    queryKey: ["mostrar cuentas", selectTipoCuenta, usuario?.id],
    queryFn: () =>
      mostrarCuentas({
        idusuario: usuario?.id,
        tipo: selectTipoCuenta.tipo
      } as Cuenta),
    enabled: !!usuario?.id,
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <>
      <CuentasTemplate data={cuentas} />
    </>
  );
}
