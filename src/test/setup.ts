// Test setup configuration for Vitest
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test utilities
export const testUtils = {
  mockUser: {
    id: 1,
    nombres: 'Test User',
    foto: null,
    idauth_supabase: 'test-auth-id',
    moneda: 'USD',
    pais: 'US',
    tema: '0'
  },
  
  mockCuenta: {
    id: 1,
    descripcion: 'Test Account',
    icono: '💰',
    tipo: 'efectivo',
    idusuario: 1,
    saldo_actual: 1000
  },
  
  mockCategoria: {
    id: 1,
    descripcion: 'Test Category',
    tipo: 'egreso',
    color: '#FF5733',
    icono: '🛒',
    idusuario: 1
  },
  
  mockMovimiento: {
    id: 1,
    descripcion: 'Test Movement',
    tipo: 'egreso',
    valor: 100,
    fecha: '2024-01-01',
    estado: '1',
    idcategoria: 1,
    idcuenta: 1
  }
};
