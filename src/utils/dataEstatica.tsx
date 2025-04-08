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
    text: "Categorias gastos",
    color: v.colorGastos,
    tipo: "g",
    bgcolor: v.colorbgGastos,
  },
  {
    text: "Categorias ingresos",
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
  },
  {
    text: "Ingresos",
    color: v.colorIngresos,
    tipo: "i",
    bgcolor: v.colorbgingresos,
  },
  {
    text: "Balance",
    color: v.colorBalance,
    tipo: "b",
    bgcolor: v.colorbgBalance,
  },
];

//data SIDEBAR
export const LinksArray = [
  {
    label: "Home",
    icon: <AiOutlineHome />,
    to: "/",
  },
  {
    label: "Cuentas",
    icon: <MdAccountBalance  />,
    to: "/cuentas",
  },
  {
    label: "Dashboard",
    icon: <AiOutlineDashboard  />,
    to: "/dashboard",
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
