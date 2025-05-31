import { create } from "zustand";
import { MostrarCuentas, InsertarCuenta, ActualizarCuenta, EliminarCuenta, Cuenta, CuentaInsert } from "../index";

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
    const response = await MostrarCuentas(p);
    if (response) {
      set({ cuentas: response });
      set({ cuentaItemSelect: response.filter(item => item.descripcion === "Billetera")[0] });
    }
    return response || [];
  },

  selectCuenta: (p) => {
    set({ cuentaItemSelect: p });
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
