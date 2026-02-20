// Mock Zustand stores for testing
import { vi } from 'vitest';
import { testUtils } from '../setup';

export const mockUsuariosStore = {
  usuario: testUtils.mockUser,
  idusuario: testUtils.mockUser.id,
  setUsuario: vi.fn(),
  clearUsuario: vi.fn(),
  editartemamonedauser: vi.fn().mockResolvedValue(undefined),
  ObtenerUsuarioActual: vi.fn().mockResolvedValue(testUtils.mockUser)
};

export const mockAuthStore = {
  isAuth: false,
  datauserGoogle: [],
  signInWithGoogle: vi.fn().mockResolvedValue(undefined),
  signout: vi.fn().mockResolvedValue(undefined)
};

export const mockCuentaStore = {
  cuentas: [testUtils.mockCuenta],
  cuentaItemSelect: testUtils.mockCuenta,
  selectCuenta: vi.fn(),
  mostrarCuentas: vi.fn().mockResolvedValue([testUtils.mockCuenta]),
  insertarCuenta: vi.fn().mockResolvedValue(null),
  actualizarCuenta: vi.fn().mockResolvedValue(null),
  eliminarCuenta: vi.fn().mockResolvedValue(false)
};

export const mockCategoriasStore = {
  datacategoria: [testUtils.mockCategoria],
  categoriaItemSelect: testUtils.mockCategoria,
  parametros: null,
  mostrarCategorias: vi.fn().mockResolvedValue([testUtils.mockCategoria]),
  selectCategoria: vi.fn(),
  insertarCategorias: vi.fn().mockResolvedValue(undefined),
  eliminarCategoria: vi.fn().mockResolvedValue(undefined),
  eliminarCategoriasTodas: vi.fn().mockResolvedValue(undefined),
  editarCategoria: vi.fn().mockResolvedValue(undefined)
};

export const mockMovimientosStore = {
  datamovimientos: { i: [], g: [] },
  rptParams: {},
  dataRptMovimientosAñoMes: { i: [], g: [] },
  totalMesAño: 0,
  totalMesAñoPagados: 0,
  totalMesAñoPendientes: 0,
  parametros: {},
  mostrarMovimientos: vi.fn().mockResolvedValue({ i: [], g: [] }),
  calcularTotales: vi.fn(),
  insertarMovimientos: vi.fn().mockResolvedValue(undefined),
  actualizarMovimientos: vi.fn().mockResolvedValue(undefined),
  eliminarMovimiento: vi.fn().mockResolvedValue(undefined),
  rptMovimientosAñoMes: vi.fn().mockResolvedValue({ i: [], g: [] })
};

// Helper to reset all store mocks
export function resetStoreMocks() {
  vi.clearAllMocks();
}
