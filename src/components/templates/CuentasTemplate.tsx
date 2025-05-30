import { Header, v, Btnfiltro, useOperaciones, Tipo, ContentFiltros, Btndesplegable, ListaMenuDesplegable, DataDesplegableCuenta, RegistrarCuentas, Cuenta, CuentaInsert, CuentaUpdate, Accion, showSuccessMessage, showErrorMessage } from "../../index";
import { useState } from "react";
import { useUsuariosStore, useCuentaStore } from "../../index";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Container, ContentFiltro } from "./CuentasTemplate.styles";

interface CuentasTemplateProps {
	data: Cuenta[];
}

export const CuentasTemplate = ({ data }: CuentasTemplateProps) => {
	const [state, setState] = useState(false);
	const [openRegistro, setOpenRegistro] = useState(false);
	const { usuario } = useUsuariosStore();
	const { mostrarCuentas, insertarCuenta, actualizarCuenta, eliminarCuenta } = useCuentaStore();
	const [accion, setAccion] = useState<Accion>("Nuevo");
	const [dataSelect, setDataSelect] = useState<CuentaInsert | CuentaUpdate>({});
	const [stateTipo, setStateTipo] = useState(false);
	const { colorCategoriaCuentaActual, tituloBtnDesCuentasActual, bgCategoriaCuentaActual, setTipoCuenta } = useOperaciones();

	const cambiarTipo = (p: Tipo) => {
		setTipoCuenta(p);
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

	const openEditModal = (cuenta: CuentaUpdate) => {
		setAccion("Editar");
		setDataSelect(cuenta);
		setOpenRegistro(true);
	};

	const { isLoading, error } = useQuery({
		queryKey: ["mostrar cuentas", usuario?.id],
		queryFn: () => {
			if (!usuario?.id) {
				throw new Error('User ID is not available');
			}
			return mostrarCuentas({ idusuario: usuario.id });
		},
		enabled: !!usuario?.id,
	});

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
			try {
				await eliminarCuenta(id);
				showSuccessMessage('Cuenta eliminada correctamente');
			} catch (error) {
				showErrorMessage('Error al eliminar la cuenta');
			}
		}
	};

	return (
		<Container onClick={cerrarDesplegables}>
			{openRegistro && (
				<RegistrarCuentas
					dataSelect={dataSelect}
					onClose={() => setOpenRegistro(false)}
					accion={accion}
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
							textcolor={colorCategoriaCuentaActual}
							bgcolor={bgCategoriaCuentaActual}
							text={tituloBtnDesCuentasActual}
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

				<ContentFiltro>
					<Btnfiltro
						funcion={nuevoRegistro}
						bgcolor={bgCategoriaCuentaActual}
						textcolor={colorCategoriaCuentaActual}
						icono={<v.agregar />}
					/>
				</ContentFiltro>
			</section>

			<section className="main">
				{data?.length > 0 ? (
					<div className="accounts-grid">
						{data.map((cuenta) => (
							<div key={cuenta.id} className="account-card">
								<div className="card-header">
									<span className="icon">{cuenta.icono}</span>
									<h3>{cuenta.descripcion}</h3>
								</div>
								<p className="balance">{usuario?.moneda} {cuenta.saldo_actual?.toFixed(2)}</p>
								<div className="card-actions">
									<button onClick={() => openEditModal(cuenta)}>✏️</button>
									<button onClick={() => handleDelete(cuenta.id)}>🗑️</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<p>No hay cuentas registradas</p>
				)}
			</section>
		</Container>
	);
}