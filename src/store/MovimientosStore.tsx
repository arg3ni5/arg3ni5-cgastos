import { create } from "zustand";
import {
  MostrarMovimientosPorMesAño,
  InsertarMovimientos,
  EliminarMovimientos,
  RptMovimientosPorMesAño,
  MovimientosMesAnio,
  MovimientosMesAnioParams,
  RptMovimientosMesAnio,
  RptMovimientosMesAnioParams,
  MovimientoInsert,
  Movimiento,
  MovimientoUpdate,
  ActualizarMovimientos
} from "../index";

interface DataRptMovimientosAñoMes {
  i: RptMovimientosMesAnio;
  g: RptMovimientosMesAnio;
}
interface MovimientosState {
  datamovimientos: MovimientosMesAnio;
  rptParams: RptMovimientosMesAnioParams;
  dataRptMovimientosAñoMes: { i: RptMovimientosMesAnio, g: RptMovimientosMesAnio };
  totalMesAño: number;
  totalMesAñoPagados: number;
  totalMesAñoPendientes: number;
  parametros: MovimientosMesAnioParams;
  mostrarMovimientos: (p: MovimientosMesAnioParams) => Promise<MovimientosMesAnio | null>;
  calcularTotales: (response: MovimientosMesAnio) => void;
  insertarMovimientos: (p: MovimientoInsert) => Promise<void>;
  actualizarMovimientos: (p: MovimientoUpdate) => Promise<void>;
  eliminarMovimiento: (p: Movimiento) => Promise<void>;
  rptMovimientosAñoMes: (p: RptMovimientosMesAnioParams) => Promise<DataRptMovimientosAñoMes | null>;
}

export const useMovimientosStore = create<MovimientosState>()((set, get) => ({
  rptParams: {} as RptMovimientosMesAnioParams,
  datamovimientos: [],
  dataRptMovimientosAñoMes: { i: [], g: [] },
  totalMesAño: 0,
  totalMesAñoPagados: 0,
  totalMesAñoPendientes: 0,
  parametros: {} as MovimientosMesAnioParams,

  mostrarMovimientos: async (p: MovimientosMesAnioParams) => {
    const response = await MostrarMovimientosPorMesAño(p);
    set({ parametros: p });
    const { calcularTotales } = get();
    if (response) calcularTotales(response);
    set({ datamovimientos: response || [] });
    return response;
  },

  calcularTotales: (response: MovimientosMesAnio): void => {
    const dtPagados = response?.filter(item => Number(item.estado) === 1);
    const dtPendientes = response?.filter(item => Number(item.estado) === 0);

    const total = response?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;
    const tpagados = dtPagados?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;
    const tpendientes = dtPendientes?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;

    set({
      totalMesAño: total,
      totalMesAñoPagados: tpagados,
      totalMesAñoPendientes: tpendientes
    });
  },

  actualizarMovimientos: async (p: MovimientoUpdate): Promise<void> => {
    await ActualizarMovimientos(p);
    const { mostrarMovimientos, parametros } = get();
    await mostrarMovimientos(parametros);
  },

  insertarMovimientos: async (p: MovimientoInsert): Promise<void> => {
    await InsertarMovimientos(p);
    const { mostrarMovimientos, parametros } = get();
    await mostrarMovimientos(parametros);
  },

  eliminarMovimiento: async (p: Movimiento): Promise<void> => {
    await EliminarMovimientos(p);
    const { parametros, mostrarMovimientos } = get();
    await mostrarMovimientos(parametros);
  },

  rptMovimientosAñoMes: async (p: RptMovimientosMesAnioParams): Promise<DataRptMovimientosAñoMes> => {
    set({ rptParams: p });
    const i = p.tipocategoria === "i" || p.tipocategoria === "b" ?
      await RptMovimientosPorMesAño({ ...p, tipocategoria: "i" }) || [] : [];
    const g = p.tipocategoria === "i" || p.tipocategoria === "b" ?
      await RptMovimientosPorMesAño({ ...p, tipocategoria: "g" }) || [] : [];
    const response = { i, g };
    set({ dataRptMovimientosAñoMes: { i: i || [], g: g || [] } });
    return response;
  },
}));
