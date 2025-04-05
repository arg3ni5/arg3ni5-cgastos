import { create } from "zustand";
import { MostrarCuentas, InsertarCuenta, ActualizarCuenta, EliminarCuenta, Cuenta, CuentaInsert } from "../index";

interface CuentaStore {
  cuentaItemSelect: Cuenta[];
  cuentas: Cuenta[];
  mostrarCuentas: (p: { idusuario: number }) => Promise<Cuenta[]>;
  insertarCuenta: (cuenta: CuentaInsert) => Promise<Cuenta | null>;
  actualizarCuenta: (id: number, cuenta: Partial<Cuenta>) => Promise<Cuenta | null>;
  eliminarCuenta: (id: number) => Promise<boolean>;
}

export const useCuentaStore = create<CuentaStore>((set, get) => ({
  cuentaItemSelect: [],
  cuentas: [],

  mostrarCuentas: async (p) => {
    const response = await MostrarCuentas(p);
    if (response) {
      set({ cuentas: response });
      set({ cuentaItemSelect: response });
    }
    return response || [];
  },

  insertarCuenta: async (cuenta) => {
    const response = await InsertarCuenta(cuenta);
    if (response) {
      const currentData = get().cuentas;
      set({ cuentas: [...currentData, response] });
    }
    return response;
  },

  actualizarCuenta: async (id, cuenta) => {
    const response = await ActualizarCuenta(id, cuenta);
    if (response) {
      const currentData = get().cuentas;
      const updatedData = currentData.map(item =>
        item.id === id ? response : item
      );
      set({ cuentas: updatedData });
    }
    return response;
  },

  eliminarCuenta: async (id) => {
    const success = await EliminarCuenta(id);
    if (success) {
      const currentData = get().cuentas;
      const filteredData = currentData.filter(item => item.id !== id);
      set({ cuentas: filteredData });
    }
    return success;
  }
}));
