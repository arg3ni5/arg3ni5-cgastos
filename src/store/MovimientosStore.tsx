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

export interface DataRptMovimientosAñoMes {
  i: RptMovimientosMesAnio;
  g: RptMovimientosMesAnio;
}
export interface DataMovimientos {
  i: MovimientosMesAnio;
  g: MovimientosMesAnio;
}
interface MovimientosState {
  datamovimientos: DataMovimientos;
  rptParams: RptMovimientosMesAnioParams;
  dataRptMovimientosAñoMes: { i: RptMovimientosMesAnio, g: RptMovimientosMesAnio };
  totalMesAño: number;
  totalMesAñoPagados: number;
  totalMesAñoPendientes: number;
  parametros: MovimientosMesAnioParams;
  mostrarMovimientos: (p: MovimientosMesAnioParams) => Promise<DataMovimientos>;
  calcularTotales: (data: DataMovimientos) => void;
  insertarMovimientos: (p: MovimientoInsert) => Promise<void>;
  actualizarMovimientos: (p: MovimientoUpdate) => Promise<void>;
  eliminarMovimiento: (p: Movimiento) => Promise<void>;
  rptMovimientosAñoMes: (p: RptMovimientosMesAnioParams) => Promise<DataRptMovimientosAñoMes | null>;
}

export const useMovimientosStore = create<MovimientosState>()((set, get) => ({
  rptParams: {} as RptMovimientosMesAnioParams,
  datamovimientos: { i: [], g: [] },
  dataRptMovimientosAñoMes: { i: [], g: [] },
  totalMesAño: 0,
  totalMesAñoPagados: 0,
  totalMesAñoPendientes: 0,
  parametros: {} as MovimientosMesAnioParams,

  mostrarMovimientos: async (p: MovimientosMesAnioParams) => {
    set({ parametros: p });
    const i = p.tipocategoria === "i" || p.tipocategoria === "b" ?
      await MostrarMovimientosPorMesAño({ ...p, tipocategoria: "i" }) || [] : [];
    const g = p.tipocategoria === "g" || p.tipocategoria === "b" ?
      await MostrarMovimientosPorMesAño({ ...p, tipocategoria: "g" }) || [] : [];
    const response = { i, g };

    const { calcularTotales } = get();
    if (response) calcularTotales(response);
    set({ datamovimientos: { i: i || [], g: g || [] } });
    return response;
  },

  calcularTotales: (data: DataMovimientos): void => {
    const { parametros } = get();
    
    if (parametros.tipocategoria === "b") {
      const totalIngresos = data.i?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;
      const totalGastos = data.g?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;
      
      const ingPagados = data.i?.filter(item => Number(item.estado) === 1)
        .reduce((sum, item) => sum + Number(item.valor), 0) || 0;
      const gasPagados = data.g?.filter(item => Number(item.estado) === 1)
        .reduce((sum, item) => sum + Number(item.valor), 0) || 0;
      
      const ingPendientes = data.i?.filter(item => Number(item.estado) === 0)
        .reduce((sum, item) => sum + Number(item.valor), 0) || 0;
      const gasPendientes = data.g?.filter(item => Number(item.estado) === 0)
        .reduce((sum, item) => sum + Number(item.valor), 0) || 0;

      set({
        totalMesAño: totalIngresos - totalGastos,
        totalMesAñoPagados: ingPagados - gasPagados,
        totalMesAñoPendientes: ingPendientes - gasPendientes
      });
      return;
    }

    const tipo = parametros.tipocategoria === "i" ? "i" : "g";
    const movimientos = data[tipo];

    const dtPagados = movimientos?.filter(item => Number(item.estado) === 1);
    const dtPendientes = movimientos?.filter(item => Number(item.estado) === 0);

    const total = movimientos?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;
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
    const g = p.tipocategoria === "g" || p.tipocategoria === "b" ?
      await RptMovimientosPorMesAño({ ...p, tipocategoria: "g" }) || [] : [];
    const response = { i, g };
    set({ dataRptMovimientosAñoMes: { i: i || [], g: g || [] } });
    return response;
  },
}));
