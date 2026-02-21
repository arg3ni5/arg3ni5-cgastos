// Mock Zustand stores for testing
// Note: This file requires vitest to be installed. Run: npm install -D vitest
// Uncomment the imports below after installing vitest:
// import { vi } from 'vitest';
import { testUtils } from '../setup';

export const mockUsuariosStore = {
  usuario: testUtils.mockUser,
  idusuario: testUtils.mockUser.id,
  setUsuario: () => {},
  clearUsuario: () => {},
  editartemamonedauser: () => Promise.resolve(),
  ObtenerUsuarioActual: () => Promise.resolve(testUtils.mockUser)
};

export const mockAuthStore = {
  isAuth: false,
  datauserGoogle: [],
  signInWithGoogle: () => Promise.resolve(undefined),
  signout: () => Promise.resolve()
};

export const mockCuentaStore = {
  cuentas: [testUtils.mockCuenta],
  cuentaItemSelect: testUtils.mockCuenta,
  selectCuenta: () => {},
  mostrarCuentas: () => Promise.resolve([testUtils.mockCuenta]),
  insertarCuenta: () => Promise.resolve(null),
  actualizarCuenta: () => Promise.resolve(null),
  eliminarCuenta: () => Promise.resolve(false)
};

export const mockCategoriasStore = {
  datacategoria: [testUtils.mockCategoria],
  categoriaItemSelect: testUtils.mockCategoria,
  parametros: null,
  mostrarCategorias: () => Promise.resolve([testUtils.mockCategoria]),
  selectCategoria: () => {},
  insertarCategorias: () => Promise.resolve(),
  eliminarCategoria: () => Promise.resolve(),
  eliminarCategoriasTodas: () => Promise.resolve(),
  editarCategoria: () => Promise.resolve()
};

export const mockMovimientosStore = {
  datamovimientos: { i: [], g: [] },
  rptParams: {},
  dataRptMovimientosAñoMes: { i: [], g: [] },
  totalMesAño: 0,
  totalMesAñoPagados: 0,
  totalMesAñoPendientes: 0,
  parametros: {},
  mostrarMovimientos: () => Promise.resolve({ i: [], g: [] }),
  calcularTotales: () => {},
  insertarMovimientos: () => Promise.resolve(),
  actualizarMovimientos: () => Promise.resolve(),
  eliminarMovimiento: () => Promise.resolve(),
  rptMovimientosAñoMes: () => Promise.resolve({ i: [], g: [] })
};

// Helper to reset all store mocks
// After installing vitest, you can implement proper mock reset functionality
export function resetStoreMocks() {
  // Placeholder - implement with vi.fn() after installing vitest
  console.log('Reset store mocks - install vitest to use vi.fn() functionality');
}
