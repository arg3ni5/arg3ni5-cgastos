import { create } from "zustand";
import { v } from "../styles/variables";
import dayjs, { Dayjs } from 'dayjs';

export type TipoMovimiento = "g" | "i" | "b";
export interface Tipo {
  tipo: TipoMovimiento;
  text: string;
  color: string;
  bgcolor: string;
}
interface OperacionesState {
  tipo: TipoMovimiento;
  tipoMovimiento: string;
  tipoCuenta: string;
  tituloBtnDes: string;
  tituloBtnDesCuentas: string;
  tituloBtnDesMovimientos: string;
  colorCategoria: string;
  bgCategoria: string;
  date: Dayjs;
  setToday: () => void;
  addMonth: () => void;
  substractMonth: () => void;
  setDate: (p: Dayjs) => void;
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
  date: dayjs(),
  setToday: () => {
    set({ date: dayjs() });
  },
  addMonth: () => {
    const newValue = get().date.add(1, 'month');
    set({ date: newValue });
  },
  substractMonth: () => {
    const newValue = get().date.subtract(1, 'month');
    set({ date: newValue });
  },
  setDate: (d: Dayjs) => {
    set({ date: d });
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
