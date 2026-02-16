import { create } from "zustand";
import { MostrarCuentas, InsertarCuenta, ActualizarCuenta, EliminarCuenta, Cuenta, CuentaInsert } from "../index";
import { logger } from "../utils/logger";

interface CuentaStore {
  cuentas: Cuenta[];
  cuentaItemSelect: Cuenta;
  selectCuenta: (p: Cuenta) => void;
  mostrarCuentas: (p: Cuenta) => Promise<Cuenta[]>;
  insertarCuenta: (cuenta: CuentaInsert) => Promise<Cuenta | null>;
  actualizarCuenta: (id: number, cuenta: Partial<Cuenta>) => Promise<Cuenta | null>;
  eliminarCuenta: (id: number) => Promise<boolean>;
}

export const useCuentaStore = create<CuentaStore>((set, get) => ({
  cuentaItemSelect: {} as Cuenta,
  cuentas: [],

  mostrarCuentas: async (p) => {
    try {
      const response = await MostrarCuentas(p);
      if (response) {
        set({ cuentas: response });
        const billetera = response.filter(item => item.descripcion === "Billetera")[0];
        if (billetera) {
          set({ cuentaItemSelect: billetera });
        }
        logger.debug('Cuentas cargadas exitosamente', { count: response.length });
      }
      return response || [];
    } catch (error) {
      logger.error('Error al mostrar cuentas en store', { error, userId: p.idusuario });
      return [];
    }
  },

  selectCuenta: (p) => {
    set({ cuentaItemSelect: p });
    logger.debug('Cuenta seleccionada', { cuentaId: p.id });
  },

  insertarCuenta: async (cuenta) => {
    try {
      const response = await InsertarCuenta(cuenta);
      if (response) {
        const currentData = get().cuentas;
        set({ cuentas: [...currentData, response] });
        logger.debug('Cuenta agregada al store', { cuentaId: response.id });
      }
      return response;
    } catch (error) {
      logger.error('Error al insertar cuenta en store', { error, cuenta });
      return null;
    }
  },

  actualizarCuenta: async (id, cuenta) => {
    try {
      const response = await ActualizarCuenta(id, cuenta);
      if (response) {
        const currentData = get().cuentas;
        const updatedData = currentData.map(item =>
          item.id === id ? response : item
        );
        set({ cuentas: updatedData });
        logger.debug('Cuenta actualizada en store', { cuentaId: id });
      }
      return response;
    } catch (error) {
      logger.error('Error al actualizar cuenta en store', { error, cuentaId: id });
      return null;
    }
  },

  eliminarCuenta: async (id) => {
    try {
      const success = await EliminarCuenta(id);
      if (success) {
        const currentData = get().cuentas;
        const filteredData = currentData.filter(item => item.id !== id);
        set({ cuentas: filteredData });
        logger.debug('Cuenta eliminada del store', { cuentaId: id });
      }
      return success;
    } catch (error) {
      logger.error('Error al eliminar cuenta en store', { error, cuentaId: id });
      return false;
    }
  }
}));
