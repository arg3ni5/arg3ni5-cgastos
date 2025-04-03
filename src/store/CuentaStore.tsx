import { create } from "zustand";
import { MostrarCuentas, InsertarCuenta, ActualizarCuenta, EliminarCuenta, Cuenta, CuentaInsert } from "../index";

interface CuentaStore {
  cuentaItemSelect: Cuenta[];
  datacuentas: Cuenta[];
  mostrarCuentas: (p: { idusuario: number }) => Promise<Cuenta | null>;
  insertarCuenta: (cuenta: CuentaInsert) => Promise<Cuenta | null>;
  actualizarCuenta: (id: number, cuenta: Partial<Cuenta>) => Promise<Cuenta | null>;
  eliminarCuenta: (id: number) => Promise<boolean>;
}

export const useCuentaStore = create<CuentaStore>((set, get) => ({
  cuentaItemSelect: [],
  datacuentas: [],
  mostrarCuentas: async (p) => {
    const response = await MostrarCuentas(p);
    if (response) {
      set({ datacuentas: [response] });
      set({ cuentaItemSelect: [response] });
    }
    return response;
  },
  insertarCuenta: async (cuenta) => {
    const response = await InsertarCuenta(cuenta);
    if (response) {
      const currentData = get().datacuentas;
      set({ datacuentas: [...currentData, response] });
    }
    return response;
  },
  actualizarCuenta: async (id, cuenta) => {
    const response = await ActualizarCuenta(id, cuenta);
    if (response) {
      const currentData = get().datacuentas;
      const updatedData = currentData.map(item => 
        item.id === id ? response : item
      );
      set({ datacuentas: updatedData });
    }
    return response;
  },
  eliminarCuenta: async (id) => {
    const success = await EliminarCuenta(id);
    if (success) {
      const currentData = get().datacuentas;
      const filteredData = currentData.filter(item => item.id !== id);
      set({ datacuentas: filteredData });
    }
    return success;
  }
}));
