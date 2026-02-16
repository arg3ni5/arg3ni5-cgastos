// Mock Zustand stores for testing
import { testUtils } from '../setup';

export const mockUsuariosStore = {
  usuario: testUtils.mockUser,
  idusuario: testUtils.mockUser.id,
  setUsuario: jest.fn(),
  clearUsuario: jest.fn(),
  editartemamonedauser: jest.fn(),
  ObtenerUsuarioActual: jest.fn().mockResolvedValue(testUtils.mockUser)
};

export const mockAuthStore = {
  isAuth: false,
  datauserGoogle: [],
  signInWithGoogle: jest.fn(),
  signout: jest.fn()
};

export const mockCuentaStore = {
  cuentas: [testUtils.mockCuenta],
  cuentaItemSelect: testUtils.mockCuenta,
  selectCuenta: jest.fn(),
  mostrarCuentas: jest.fn().mockResolvedValue([testUtils.mockCuenta]),
  insertarCuenta: jest.fn(),
  actualizarCuenta: jest.fn(),
  eliminarCuenta: jest.fn()
};

export const mockCategoriasStore = {
  datacategoria: [testUtils.mockCategoria],
  categoriaItemSelect: testUtils.mockCategoria,
  parametros: null,
  mostrarCategorias: jest.fn().mockResolvedValue([testUtils.mockCategoria]),
  selectCategoria: jest.fn(),
  insertarCategorias: jest.fn(),
  eliminarCategoria: jest.fn(),
  eliminarCategoriasTodas: jest.fn(),
  editarCategoria: jest.fn()
};

export const mockMovimientosStore = {
  datamovimientos: { i: [], g: [] },
  rptParams: {},
  dataRptMovimientosAñoMes: { i: [], g: [] },
  totalMesAño: 0,
  totalMesAñoPagados: 0,
  totalMesAñoPendientes: 0,
  parametros: {},
  mostrarMovimientos: jest.fn().mockResolvedValue({ i: [], g: [] }),
  calcularTotales: jest.fn(),
  insertarMovimientos: jest.fn(),
  actualizarMovimientos: jest.fn(),
  eliminarMovimiento: jest.fn(),
  rptMovimientosAñoMes: jest.fn().mockResolvedValue({ i: [], g: [] })
};

// Helper to reset all store mocks
export function resetStoreMocks() {
  Object.values(mockUsuariosStore).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear();
    }
  });
  Object.values(mockAuthStore).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear();
    }
  });
  Object.values(mockCuentaStore).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear();
    }
  });
  Object.values(mockCategoriasStore).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear();
    }
  });
  Object.values(mockMovimientosStore).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear();
    }
  });
}
