import { JSX, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Switch } from "@mui/material";
import {
  useMovimientosStore,
  useCategoriasStore,
  useOperaciones,
  ListaGenerica,
  Selector,
  InputNumber,
  InputText,
  useCuentaStore,
  v,
  BtnForm,
  Accion,
  Movimiento,
  MovimientoInsert,
  showErrorMessage,
  MovimientoUpdate,
  useUsuariosStore,
  DataDesplegableMovimientos,
  Tipo,
  DataDesplegables,
  Cuenta,
} from "../../../index";
import { useQuery } from "@tanstack/react-query";
interface RegistrarMovimientosProps {
  setState: () => void;
  state: boolean;
  dataSelect: Movimiento | undefined;
  accion?: Accion;
}

interface FormInputs {
  fecha: string;
  descripcion: string;
  monto: number;
}

const esPagado = (estado: unknown): boolean => {
  if (typeof estado === "boolean") return estado;
  if (typeof estado === "number") return estado === 1;
  if (typeof estado === "string") {
    const valor = estado.trim().toLowerCase();
    return valor === "1" || valor === "true";
  }
  return false;
};

export const RegistrarMovimientos = ({ setState, dataSelect = {} as Movimiento, accion }: RegistrarMovimientosProps): JSX.Element => {
  const { cuentaItemSelect, mostrarCuentas, selectCuenta } = useCuentaStore();
  const { selectTipoMovimiento } = useOperaciones();
  const { idusuario } = useUsuariosStore();
  const { categoriaItemSelect, selectCategoria, mostrarCategorias } = useCategoriasStore();
  const { insertarMovimientos, actualizarMovimientos } = useMovimientosStore();

  const [estado, setEstado] = useState<boolean>(true);
  //const [ignorar, setIgnorar] = useState<boolean>(false);
  const [stateCategorias, setStateCategorias] = useState<boolean>(false);
  const [stateCuenta, setStateCuenta] = useState<boolean>(false);
  const [stateTipo, setStateTipo] = useState<boolean>(false);
  const tipoInicial = dataSelect?.tipo || (selectTipoMovimiento?.tipo !== "b" ? selectTipoMovimiento?.tipo : undefined);
  const [tipoMovimiento, setTipoMovimiento] = useState<Tipo>(
    (tipoInicial ? DataDesplegables.movimientos[tipoInicial] : undefined) || {} as Tipo
  );
  const fechaactual = new Date();

  useEffect(() => {
    const tipo = dataSelect?.tipo || (accion === "Nuevo" && selectTipoMovimiento?.tipo !== "b" ? selectTipoMovimiento?.tipo : undefined);
    if (tipo && DataDesplegables.movimientos[tipo]) {
      setTipoMovimiento(DataDesplegables.movimientos[tipo]);
    }
  }, [dataSelect?.tipo, accion, selectTipoMovimiento?.tipo]);

  useEffect(() => {
    if (accion === "Editar") {
      setEstado(esPagado(dataSelect?.estado));
      return;
    }
    if (accion === "Nuevo") {
      setEstado(true);
    }
  }, [accion, dataSelect?.estado, dataSelect?.id]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>(
    {
      defaultValues: {
        monto: dataSelect.valor || 0,
        descripcion: dataSelect.descripcion || "",
        fecha: dataSelect.fecha || fechaactual.toISOString().slice(0, 10),
      },
    }
  );

  const insertar = async (formData: FormInputs): Promise<void> => {
    if (categoriaItemSelect == null) {
      showErrorMessage("Seleccione una categoria");
      return;
    }
    if (cuentaItemSelect == null) {
      showErrorMessage("Seleccione una cuenta");
      return;
    }

    const baseData = {
      descripcion: formData.descripcion,
      estado: estado,
      fecha: formData.fecha,
      idcategoria: categoriaItemSelect.id,
      idcuenta: cuentaItemSelect.id,
      tipo: tipoMovimiento.tipo,
      valor: parseFloat(formData.monto.toString()),
    } as MovimientoInsert;
    try {
      console.log(baseData);
      await insertarMovimientos(baseData);
      setState();
    } catch (err) {
      console.error(err);
    }
  };

  const actualizar = async (formData: FormInputs): Promise<void> => {
    if (categoriaItemSelect == null) {
      showErrorMessage("Seleccione una categoria");
      return;
    }
    if (cuentaItemSelect == null) {
      showErrorMessage("Seleccione una cuenta");
      return;
    }

    const baseData = {
      descripcion: formData.descripcion,
      estado: estado,
      fecha: formData.fecha,
      id: dataSelect.id,
      idcategoria: categoriaItemSelect.id,
      idcuenta: cuentaItemSelect.id,
      tipo: tipoMovimiento.tipo,
      valor: parseFloat(formData.monto.toString()),
    } as MovimientoUpdate;
    try {
      await actualizarMovimientos(baseData);
      setState();
    }
    catch (err) {
      console.error(err);
    }
  }

  const estadoControl = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEstado(e.target.checked);
  };

  const cambiarTipo = (p: Tipo): void => {
    setTipoMovimiento(p);
    setStateTipo(!stateTipo);
  };

  const { data: cuentas } = useQuery({
    queryKey: ["cuentas", idusuario],
    queryFn: () => mostrarCuentas({ idusuario } as Cuenta),
    enabled: !!idusuario,
  });

  const { data: categorias } = useQuery({
    queryKey: ["categorias", tipoMovimiento?.tipo, idusuario],
    queryFn: () => mostrarCategorias({ tipo: tipoMovimiento?.tipo, idusuario }),
    enabled: !!idusuario && !!tipoMovimiento?.tipo,
  });

  return (
    <Container onClick={setState}>
      <div
        className="sub-contenedor"
        onClick={(e) => { e.stopPropagation(); }}>
        <div className="encabezado">
          <ContenedorDropdown>
            <Selector
              color="#e14e19"
              texto1={tipoMovimiento?.text ? accion + " " : ""}
              texto2={tipoMovimiento?.text || "Seleccione un tipo"}
              funcion={() => setStateTipo(!stateTipo)}
            />

            {stateTipo && (
              <ListaGenerica
                top="100%"
                btnClose={false}
                scroll="hidden"
                setState={() => setStateTipo(!stateTipo)}
                data={DataDesplegableMovimientos.filter(item => item.tipo != "b").map(item => ({
                  descripcion: item.text,
                  ...item,
                }))}
                funcion={cambiarTipo}
              />
            )}
          </ContenedorDropdown>
        </div>

        <form onSubmit={accion == "Nuevo" ? handleSubmit(insertar) : handleSubmit(actualizar)} className="formulario">
          <section>
            <WrapperPagoFecha>
              <ContainerFuepagado>
                <span>{<v.iconocheck />}</span>
                <label>Fue pagado:</label>
                <Switch
                  onChange={estadoControl}
                  checked={estado}
                  color="warning"
                />
              </ContainerFuepagado>
              <ContainerFecha>
                <label>Fecha:</label>
                <input
                  type="date"
                  {...register("fecha", { required: true })}
                ></input>
                {errors.fecha?.type === "required" && (<p>El campo es requerido</p>)}
              </ContainerFecha>
            </WrapperPagoFecha>

            <ContainerMonto>
              <label>Monto:</label>
              <InputNumber
                defaultValue={dataSelect.valor!}
                register={register}
                placeholder="Ingrese monto"
                errors={errors}
                icono={<v.iconocalculadora />}
              />
            </ContainerMonto>

            <div>
              <label>Descripción:</label>
              <InputText
                defaultValue={dataSelect.descripcion!}
                register={register}
                placeholder="Ingrese una descripcion"
                errors={errors}
              />
            </div>

            <ContenedorDropdown>
              <label>Cuenta: </label>
              <Selector
                color="#e14e19"
                texto1={cuentaItemSelect?.icono}
                texto2={cuentaItemSelect?.descripcion || "Seleccionar Cuenta"}
                funcion={() => setStateCuenta(!stateCuenta)}
              />
              {stateCuenta && (
                <ListaGenerica
                  top="100%"
                  scroll="auto"
                  setState={() => setStateCuenta(!stateCuenta)}
                  data={cuentas?.map(cuenta => ({
                    ...cuenta,
                    descripcion: cuenta.descripcion || '',
                    icono: cuenta.icono || ''
                  })) || []}
                  funcion={selectCuenta}
                />
              )}
            </ContenedorDropdown>

            <ContenedorDropdown>
              <label>Categoria: </label>
              <Selector
                color="#e14e19"
                texto1={categoriaItemSelect?.icono}
                texto2={categoriaItemSelect?.descripcion || "Seleccionar Categoria"}
                funcion={() => setStateCategorias(!stateCategorias)}
              />

              {stateCategorias && (
                <ListaGenerica
                  bottom="100%"
                  scroll="auto"
                  setState={() => setStateCategorias(!stateCategorias)}
                  data={categorias?.map(cat => ({
                    ...cat,
                    descripcion: cat.descripcion || '',
                    icono: cat.icono || ''
                  })) || []}
                  funcion={selectCategoria}
                />
              )}
            </ContenedorDropdown>
          </section>
          <ContenedorBotones>
            <StickyFooter>
              <BtnForm
                type="submit"
                titulo="Guardar"
                bgcolor="#DAC1FF"
                icono={<v.iconoguardar />}
              />
              <BtnForm
                funcion={setState}
                type="button"
                titulo="Cancelar"
                bgcolor="#ff4d4f"
                icono={<v.iconocerrar />}
              />
            </StickyFooter>
          </ContenedorBotones>
        </form>
      </div>
    </Container>
  );
}
const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 100;
  color: black;

  .sub-contenedor {
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;
    color: ${({ theme }) => theme.text};
    label {
      font-weight: 550;
    }
    .encabezado {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-items: center;
      margin-bottom: 20px;
      h1 {
        font-size: 30px;
        font-weight: 700;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      .contentBtnsave {
        padding-top: 10px;
        display: flex;
        justify-content: center;
      }
      section {
        padding-top: 5px;
        gap: 20px;
        display: flex;
        flex-direction: column;
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
      }
    }

    @media (max-width: 500px) {
      .sub-contenedor {
        padding: 12px 20px !important;
      }

      input {
        padding: 8px !important;
        font-size: 15px;
      }

      label {
        font-size: 14px;
      }
    }

  }
  @keyframes scale-up-bottom {
    0% {
      transform: scale(0.5);
      transform-origin: center bottom;
    }
    100% {
      transform: scale(1);
      transform-origin: center bottom;
    }
  }
`;

const WrapperPagoFecha = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  flex-wrap: nowrap;

  > div {
    flex: 1;
    min-width: 0; // evita que el contenido fuerce wrapping
  }

  @media (max-width: 500px) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`;
const ContainerMonto = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  label {
    margin-bottom: 5px;
    font-weight: 550;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;



const ContainerFuepagado = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 1;
  min-width: 205px;
`;

const ContenedorDropdown = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    white-space: nowrap;
  }

  > *:not(label) {
    flex: 1;
    width: 100%;
  }
`;

const ContainerFecha = styled.div`
  display: flex;
  flex: 1;
  gap: 10px;
  align-items: center;
  min-width: 205px;
  input {
    appearance: none;
    color: ${({ theme }) => theme.text};
    font-family: “Helvetica”, arial, sans-serif;
    font-size: 17px;
    border: none;
    background: ${({ theme }) => theme.bgtotal};
    padding: 4px;
    display: inline-block;
    visibility: visible;
    width: 140px;
    cursor: pointer;
    &:focus {
      border-radius: 10px;

      outline: 0;
      /* box-shadow: 0 0 5px 0.4rem rgba(252, 252, 252, 0.25); */
    }
  }
`;

const ContenedorBotones = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const StickyFooter = styled.div`
  margin-top: 20px;
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.bgtotal};
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  position: relative;
`;
