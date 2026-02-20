// Test setup configuration for Vitest
// This file will be used to configure the test environment
// Note: This file requires vitest and @testing-library/react to be installed.
// Run: npm install -D vitest @testing-library/react @testing-library/jest-dom
// Uncomment the imports below after installing the dependencies:

// import { afterEach } from 'vitest';
// import { cleanup } from '@testing-library/react';

// Cleanup after each test
// Uncomment after installing dependencies:
// afterEach(() => {
//   cleanup();
// });

// Mock environment variables for tests
if (typeof process !== 'undefined' && process.env) {
  process.env.VITE_APP_SUPABASE_URL = 'https://test.supabase.co';
  process.env.VITE_APP_SUPABASE_ANON_KEY = 'test-anon-key';
  process.env.VITE_APP_ENV = 'test';
  process.env.VITE_SESSION_TIMEOUT = '3600000'; // 1 hour
}

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
