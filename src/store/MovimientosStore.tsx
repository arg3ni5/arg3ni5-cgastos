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
import { logger } from "../utils/logger";

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
  dataRptMovimientosAñoMes: DataRptMovimientosAñoMes;
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

const esPagado = (estado: unknown): boolean => {
  if (typeof estado === "boolean") return estado;
  if (typeof estado === "number") return estado === 1;
  if (typeof estado === "string") {
    const valor = estado.trim().toLowerCase();
    return valor === "1" || valor === "true";
  }
  return false;
};

export const useMovimientosStore = create<MovimientosState>()((set, get) => ({
  rptParams: {} as RptMovimientosMesAnioParams,
  datamovimientos: {} as DataMovimientos,
  dataRptMovimientosAñoMes: {} as DataRptMovimientosAñoMes,
  totalMesAño: 0,
  totalMesAñoPagados: 0,
  totalMesAñoPendientes: 0,
  parametros: {} as MovimientosMesAnioParams,

  mostrarMovimientos: async (p: MovimientosMesAnioParams) => {
    try {
      set({ parametros: p });
      const i = p.tipocategoria === "i" || p.tipocategoria === "b" ?
        await MostrarMovimientosPorMesAño({ ...p, tipocategoria: "i" }) || [] : [];
      const g = p.tipocategoria === "g" || p.tipocategoria === "b" ?
        await MostrarMovimientosPorMesAño({ ...p, tipocategoria: "g" }) || [] : [];
      const response = { i, g };

      const { calcularTotales } = get();
      if (response) calcularTotales(response);
      set({ datamovimientos: { i: i || [], g: g || [] } });
      logger.debug('Movimientos cargados exitosamente', {
        ingresos: i?.length || 0,
        gastos: g?.length || 0
      });
      return response;
    } catch (error) {
      logger.error('Error al mostrar movimientos en store', { error, params: p });
      return { i: [], g: [] };
    }
  },

  calcularTotales: (data: DataMovimientos): void => {
    try {
      const { parametros } = get();

      if (parametros.tipocategoria === "b") {
        const totalIngresos = data.i?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;
        const totalGastos = data.g?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;

        const ingPagados = data.i?.filter(item => esPagado(item.estado))
          .reduce((sum, item) => sum + Number(item.valor), 0) || 0;
        const gasPagados = data.g?.filter(item => esPagado(item.estado))
          .reduce((sum, item) => sum + Number(item.valor), 0) || 0;

        const ingPendientes = data.i?.filter(item => !esPagado(item.estado))
          .reduce((sum, item) => sum + Number(item.valor), 0) || 0;
        const gasPendientes = data.g?.filter(item => !esPagado(item.estado))
          .reduce((sum, item) => sum + Number(item.valor), 0) || 0;

        logger.debug('Totales calculados (ambos)', {
          totalIngresos, totalGastos, ingPagados, gasPagados, ingPendientes, gasPendientes
        });

        set({
          totalMesAño: totalIngresos - totalGastos,
          totalMesAñoPagados: ingPagados - gasPagados,
          totalMesAñoPendientes: ingPendientes - gasPendientes
        });
        return;
      }

      const tipo = parametros.tipocategoria === "i" ? "i" : "g";
      const movimientos = data[tipo];

      const dtPagados = movimientos?.filter(item => esPagado(item.estado));
      const dtPendientes = movimientos?.filter(item => !esPagado(item.estado));

      const total = movimientos?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;
      const tpagados = dtPagados?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;
      const tpendientes = dtPendientes?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;

      set({
        totalMesAño: total,
        totalMesAñoPagados: tpagados,
        totalMesAñoPendientes: tpendientes
      });

      logger.debug('Totales calculados', { tipo, total, tpagados, tpendientes });
    } catch (error) {
      logger.error('Error al calcular totales', { error, data });
    }
  },

  actualizarMovimientos: async (p: MovimientoUpdate): Promise<void> => {
    try {
      await ActualizarMovimientos(p);
      const { mostrarMovimientos, parametros } = get();
      await mostrarMovimientos(parametros);
      logger.debug('Movimiento actualizado y lista refrescada', { movimientoId: p.id });
    } catch (error) {
      logger.error('Error al actualizar movimiento en store', { error, movimientoId: p.id });
      throw error;
    }
  },

  insertarMovimientos: async (p: MovimientoInsert): Promise<void> => {
    try {
      await InsertarMovimientos(p);
      const { mostrarMovimientos, parametros } = get();
      await mostrarMovimientos(parametros);
      logger.debug('Movimiento insertado y lista refrescada');
    } catch (error) {
      logger.error('Error al insertar movimiento en store', { error, movimiento: p });
      throw error;
    }
  },

  eliminarMovimiento: async (p: Movimiento): Promise<void> => {
    try {
      await EliminarMovimientos(p);
      const { parametros, mostrarMovimientos } = get();
      await mostrarMovimientos(parametros);
      logger.debug('Movimiento eliminado y lista refrescada', { movimientoId: p.id });
    } catch (error) {
      logger.error('Error al eliminar movimiento en store', { error, movimientoId: p.id });
      throw error;
    }
  },

  rptMovimientosAñoMes: async (p: RptMovimientosMesAnioParams): Promise<DataRptMovimientosAñoMes> => {
    try {
      set({ rptParams: p });
      const i = p.tipocategoria === "i" || p.tipocategoria === "b" ?
        await RptMovimientosPorMesAño({ ...p, tipocategoria: "i" }) || [] : [];
      const g = p.tipocategoria === "g" || p.tipocategoria === "b" ?
        await RptMovimientosPorMesAño({ ...p, tipocategoria: "g" }) || [] : [];
      const response = { i, g };
      set({ dataRptMovimientosAñoMes: { i: i || [], g: g || [] } });
      logger.debug('Reporte de movimientos generado', { params: p });
      return response;
    } catch (error) {
      logger.error('Error al generar reporte de movimientos', { error, params: p });
      return { i: [], g: [] };
    }
  },
}));
