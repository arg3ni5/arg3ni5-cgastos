import { create } from "zustand";
import { v } from "../styles/variables";
import dayjs, { Dayjs } from 'dayjs';
import { DataDesplegableMovimientosObj, DataDesplegables } from "../utils/dataEstatica";

export type TipoMovimiento = "g" | "i" | "b";

export interface Tipo {
  tipo: string;
  text: string;
  color: string;
  bgcolor: string;
  icono?: string;
}
interface OperacionesState {
  selectTipoMovimiento: Tipo;
  selectTipoCuenta: Tipo;
  selectTipoCategoria: Tipo;
  date: Dayjs;
  setToday: () => void;
  addMonth: () => void;
  substractMonth: () => void;
  setDate: (p: Dayjs) => void;
  setTipoMovimientos: (t: Tipo) => void;
  setTipoCuenta: (t: Tipo) => void;
  setTipoCategoria: (t: Tipo) => void;
}

export const useOperaciones = create<OperacionesState>((set, get) => ({
  selectTipoMovimiento: JSON.parse(localStorage.getItem("tipoMovimiento") || "null")
    || DataDesplegables.movimientos["g"] as Tipo,
  selectTipoCuenta: DataDesplegables.cuentas["d"] as Tipo,
  selectTipoCategoria: DataDesplegables.categorias["g"] as Tipo,
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
  setTipoMovimientos: (t: Tipo) => {
    localStorage.setItem("tipoMovimiento", JSON.stringify(t));
    set({
      selectTipoMovimiento: t
    })
  },
  setTipoCategoria: (p: Tipo) => {
    set({
      selectTipoCategoria: p,
    })
  },
  setTipoCuenta: (p: Tipo) => {
    set({
      selectTipoCuenta: p,
    })
  },
}));
