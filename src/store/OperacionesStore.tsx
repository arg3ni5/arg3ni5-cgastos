import { create } from "zustand";
import { v } from "../styles/variables";
export interface TipoMovimiento {
  tipo: string;
  text: string;
  color: string;
  bgcolor: string;
}
export interface Tipo {
  tipo: string;
  text: string;
  color: string;
  bgcolor: string;
}
interface OperacionesState {
  tipo: string;
  tituloBtnDes: string;
  tituloBtnDesMovimientos: string;
  colorCategoria: string;
  bgCategoria: string;
  año: number;
  mes: number;
  setMes: (p: number) => void;
  setAño: (p: number) => void;
  setTipoMovimientos: (p: TipoMovimiento) => void;
  setTipo: (p: Tipo) => void;
}

export const useOperaciones = create<OperacionesState>((set, get) => ({
  tipo: "i",
  tituloBtnDes: "Categorias ingresos",
  tituloBtnDesMovimientos: "Ingresos",
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
  setTipoMovimientos: (p: TipoMovimiento) => {
    set({ tipo: p.tipo })
    set({
      tituloBtnDesMovimientos: p.text
    });
    set({
      colorCategoria: p.color,
    });
    set({
      bgCategoria: p.bgcolor,
    });
  },
  setTipo: (p: Tipo) => {
    set({ tipo: p.tipo })
    set({
      tituloBtnDes: p.text
    });
    set({
      colorCategoria: p.color,
    });
    set({
      bgCategoria: p.bgcolor,
    });
  },
}));
