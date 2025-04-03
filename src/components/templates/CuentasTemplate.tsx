import { Header, v, Btnfiltro, useOperaciones, Tipo, ContentFiltros, Btndesplegable, ListaMenuDesplegable, DataDesplegableCuenta, RegistrarCuentas, Cuenta, CuentaInsert, CuentaUpdate } from "../../index";
import { useState } from "react";
import { useUsuariosStore, useCuentaStore } from "../../index";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Container, ContentFiltro } from "./CuentasTemplate.styles";

export const CuentasTemplate = () => {
	const [state, setState] = useState(false);
	const [openRegistro, setOpenRegistro] = useState(false);
	const { datausuarios } = useUsuariosStore();
	const { mostrarCuentas, datacuentas, insertarCuenta, actualizarCuenta, eliminarCuenta } = useCuentaStore();
	const [accion, setAccion] = useState("");
	const [dataSelect, setDataSelect] = useState<CuentaInsert | CuentaUpdate>();
	const [stateTipo, setStateTipo] = useState(false);
	const { colorCategoria, tituloBtnDes, bgCategoria, setTipo, tipo } = useOperaciones();

	const cambiarTipo = (p: Tipo) => {
		setTipo(p);
		setStateTipo(!stateTipo);
		setState(false);
	};

	const cerrarDesplegables = () => {
		setStateTipo(false);
		setState(false);
	};

	const openTipo = () => {
		setStateTipo(!stateTipo);
		setState(false);
	};

	const openUser = () => {
		setState(!state);
		setStateTipo(false);
	};

	const nuevoRegistro = () => {
		setOpenRegistro(!openRegistro);
		setAccion("Nuevo");
		setDataSelect({});
	};

	const { isLoading, error } = useQuery({
		queryKey: ["mostrar cuentas", datausuarios?.id],
		queryFn: () => {
			if (!datausuarios?.id) {
				throw new Error('User ID is not available');
			}
			return mostrarCuentas({ idusuario: datausuarios.id });
		},
		enabled: !!datausuarios?.id,
	});

	const handleUpdate = async (cuenta: CuentaUpdate) => {
		const { value: formValues } = await Swal.fire({
			title: 'Editar Cuenta',
			html: `
        <input id="descripcion" class="swal2-input" placeholder="Descripción" value="${cuenta.descripcion}">
        <input id="saldo" type="number" class="swal2-input" placeholder="Saldo" value="${cuenta.saldo_actual}">
        <input id="icono" class="swal2-input" placeholder="Icono" value="${cuenta.icono}">
      `,
			focusConfirm: false,
			preConfirm: () => {
				return {
					descripcion: (document.getElementById('descripcion') as HTMLInputElement).value,
					saldo_actual: Number((document.getElementById('saldo') as HTMLInputElement).value),
					icono: (document.getElementById('icono') as HTMLInputElement).value,
				}
			}
		});

		if (!cuenta.id) {
			return;
		}

		if (formValues) {
			await actualizarCuenta(cuenta.id, formValues);
		}
	};

	const handleDelete = async (id: number) => {
		const result = await Swal.fire({
			title: '¿Estás seguro?',
			text: "No podrás revertir esta acción",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		});

		if (result.isConfirmed) {
			await eliminarCuenta(id);
			Swal.fire('Eliminado', 'La cuenta ha sido eliminada', 'success');
		}
	};

	return (
		<Container onClick={cerrarDesplegables}>
			{openRegistro && (
				<RegistrarCuentas
					dataSelect={dataSelect || {}}
					onClose={() => setOpenRegistro(!openRegistro)}
					accion={accion as "Editar" | "Crear"}
				/>
			)}

			<header className="header">
				<Header stateConfig={{ state: state, setState: openUser }} />
			</header>

			<section className="tipo">
				<ContentFiltros>
					<div
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<Btndesplegable
							textcolor={colorCategoria}
							bgcolor={bgCategoria}
							text={tituloBtnDes}
							funcion={openTipo}
						/>
						{stateTipo && (
							<ListaMenuDesplegable
								data={DataDesplegableCuenta}
								top="112%"
								funcion={(p) => cambiarTipo(p as Tipo)}
							/>
						)}
					</div>
				</ContentFiltros>
			</section>

			<section className="area2">
				<ContentFiltro>
					<Btnfiltro
						funcion={nuevoRegistro}
						bgcolor={bgCategoria}
						textcolor={colorCategoria}
						icono={<v.agregar />}
					/>
				</ContentFiltro>
			</section>

			<section className="main">
				{isLoading && <p>Cargando cuentas...</p>}
				{error && <p>Error al cargar las cuentas</p>}
				{datacuentas?.length > 0 ? (
					<div className="accounts-grid">
						{datacuentas.map((cuenta) => (
							<div key={cuenta.id} className="account-card">
								<div className="card-header">
									<span className="icon">{cuenta.icono}</span>
									<h3>{cuenta.descripcion}</h3>
								</div>
								<p className="balance">{datausuarios?.moneda} {cuenta.saldo_actual?.toFixed(2)}</p>
								<div className="card-actions">
									<button onClick={() => handleUpdate(cuenta)}>✏️</button>
									<button onClick={() => handleDelete(cuenta.id)}>🗑️</button>
								</div>
							</div>
						))}
					</div>
				) : (
					!isLoading && <p>No hay cuentas registradas</p>
				)}
			</section>
		</Container>
	);
}