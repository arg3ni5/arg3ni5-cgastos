import { create } from "zustand";
import { v } from "../styles/variables";
export interface Tipo {
  tipo: string;
  text: string;
  color: string;
  bgcolor: string;
}
interface OperacionesState {
  tipo: string;
  tipoMovimiento: string;
  tipoCuenta: string;
  tituloBtnDes: string;
  tituloBtnDesCuentas: string;
  tituloBtnDesMovimientos: string;
  colorCategoria: string;
  bgCategoria: string;
  año: number;
  mes: number;
  setMes: (p: number) => void;
  setAño: (p: number) => void;
  setTipoMovimientos: (p: Tipo) => void;
  setTipoCuenta: (p: Tipo) => void;
  setTipo: (p: Tipo) => void;
}

export const useOperaciones = create<OperacionesState>((set, get) => ({
  tipo: "i",
  tipoMovimiento: "i",
  tipoCuenta: "d",
  tituloBtnDes: "Categorias ingresos",
  tituloBtnDesMovimientos: "Ingresos",
  tituloBtnDesCuentas: "Categorias Debito",
  colorCategoria: v.colorIngresos,
  bgCategoria: v.colorbgingresos,
  año: (new Date).getFullYear(),
  mes: (new Date).getMonth() + 1,
  setMes: (p: number) => {
    set({ mes: p });
  },
  setAño: (p: number) => {
    set({ año: p });
  },
  setTipoMovimientos: (p: Tipo) => {
    set({
      tipo: p.tipo,
      tituloBtnDesMovimientos: p.text,
      colorCategoria: p.color,
      bgCategoria: p.bgcolor,
    })
  },
  setTipo: (p: Tipo) => {
    set({
      tipo: p.tipo,
      tituloBtnDes: p.text,
      colorCategoria: p.color,
      bgCategoria: p.bgcolor,
    })
  },
  setTipoCuenta: (p: Tipo) => {
    set({
      tipoCuenta: p.tipo,
      tituloBtnDesCuentas: p.text,
      colorCategoria: p.color,
      bgCategoria: p.bgcolor,
    })
  },
}));
