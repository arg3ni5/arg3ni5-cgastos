import {
  AiOutlineHome,
  AiOutlineApartment,
  AiOutlineSetting,
  AiOutlineDashboard,
} from "react-icons/ai";
import { MdAccountBalance, MdOutlineAnalytics } from "react-icons/md";
import { TbPig } from "react-icons/tb"
import { v } from '../styles/variables';

export const DesplegableUser = [
  {
    text: "Mi perfil",
    icono: <v.iconoUser />,
    tipo: "miperfil",
  },
  {
    text: "Configuracion",
    icono: <v.iconoSettings />,
    tipo: "configuracion",
  },
  {
    text: "Cerrar sesión",
    icono: <v.iconoCerrarSesion />,
    tipo: "cerrarsesion",
  },
];

export const DataDesplegableCuenta = [
  {
    text: "Categoria Debito",
    color: v.colorGastos,
    tipo: "d",
    bgcolor: v.colorbgGastos,
  },
  {
    text: "Categoria Credito",
    color: v.colorIngresos,
    tipo: "c",
    bgcolor: v.colorbgingresos,
  },
];

export const DataDesplegableTipo = [
  {
    text: "Categoria gasto",
    color: v.colorGastos,
    tipo: "g",
    bgcolor: v.colorbgGastos,
  },
  {
    text: "Categoria ingreso",
    color: v.colorIngresos,
    tipo: "i",
    bgcolor: v.colorbgingresos,
  },
];
export const DataDesplegableMovimientos = [
  {
    text: "Gastos",
    color: v.colorGastos,
    tipo: "g",
    bgcolor: v.colorbgGastos,
    icono: "🧮"
  },
  {
    text: "Ingresos",
    color: v.colorIngresos,
    tipo: "i",
    bgcolor: v.colorbgingresos,
    icono: "💵"
  },
  {
    text: "Balance",
    color: v.colorBalance,
    tipo: "b",
    bgcolor: v.colorbgBalance,
    icono: "📊"
  },
];
export const DataDesplegables = {
  movimientos : Object.fromEntries(
    DataDesplegableMovimientos.map(item => [item.tipo, { ...item, text: item.text.replace(/s$/, "") }])
  ),
  cuentas : Object.fromEntries(
    DataDesplegableCuenta.map(item => [item.tipo, {...item, text: item.text.replace(/s$/, "") }])
  ),
  categorias : Object.fromEntries(
    DataDesplegableTipo.map(item => [item.tipo, {...item, text: item.text.replace(/s$/, "") }])
  )
}
export const DataDesplegableMovimientosObj = Object.fromEntries(
  DataDesplegableMovimientos.map(item => [item.tipo, { ...item, text: item.text.replace(/s$/, "") }])
);
const titulosPorTipo = {
  g: "Gastos",
  i: "Ingresos",
  b: "Balance",
} as const;

export const obtenerTitulo = (tipo: keyof typeof titulosPorTipo, estado: "pendientes" | "pagados") => {
  return `${titulosPorTipo[tipo]} ${estado}`;
}


//data SIDEBAR
export const LinksArray = [
  {
    label: "Home",
    icon: <AiOutlineHome />,
    to: "/",
  },
  {
    label: "Dashboard",
    icon: <AiOutlineDashboard />,
    to: "/dashboard",
  },
  {
    label: "Cuentas",
    icon: <MdAccountBalance />,
    to: "/cuentas",
  },
  {
    label: "Categorias",
    icon: <MdOutlineAnalytics />,
    to: "/categorias",
  },
  {
    label: "Movimientos",
    icon: <AiOutlineApartment />,
    to: "/movimientos",
  },
  {
    label: "Informes",
    icon: <MdOutlineAnalytics />,
    to: "/informes",
  },
  // {
  //   label: "Dashboard",
  //   icon: <RiDashboard3Line />,
  //   to: "/dashboard",
  // },
];
export const SecondarylinksArray = [
  {
    label: "Configuración",
    icon: <AiOutlineSetting />,
    to: "/configurar",
  },
  {
    label: "Acerca de",
    icon: <TbPig />,
    to: "/acercade",
  },
];
//temas
export const TemasData = [
  {
    icono: "🌞",
    descripcion: "light",

  },
  {
    icono: "🌚",
    descripcion: "dark",

  },
];
