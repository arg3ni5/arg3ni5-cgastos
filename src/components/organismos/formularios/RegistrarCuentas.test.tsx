import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegistrarCuentas } from './RegistrarCuentas';
import { useCuentaStore } from '../../../store/CuentaStore';
import { useUsuariosStore } from '../../../store/AuthStore'; // Assuming AuthStore is where useUsuariosStore is
import { vi } from 'vitest'; // Or jest if using Jest

// Mocking stores
vi.mock('../../../store/CuentaStore');
vi.mock('../../../store/AuthStore'); // Adjust path if useUsuariosStore is elsewhere

const mockInsertarCuenta = vi.fn();
const mockActualizarCuenta = vi.fn();
const mockOnClose = vi.fn();

const mockUsuario = { id: 1, moneda: 'USD' }; // Example user data

describe('RegistrarCuentas Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockInsertarCuenta.mockClear();
    mockActualizarCuenta.mockClear();
    mockOnClose.mockClear();

    (useCuentaStore as any).mockReturnValue({
      insertarCuenta: mockInsertarCuenta,
      actualizarCuenta: mockActualizarCuenta,
    });
    (useUsuariosStore as any).mockReturnValue({
      usuario: mockUsuario,
    });
  });

  test('renders correctly for "Nuevo" action', () => {
    render(
      <RegistrarCuentas
        onClose={mockOnClose}
        dataSelect={{}}
        accion="Nuevo"
      />
    );
    expect(screen.getByText('Registrar nueva cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descripción de la cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument(); // Saldo actual
    expect(screen.getByText('Icono')).toBeInTheDocument();
  });

  test('calls insertarCuenta on submit for "Nuevo" action', async () => {
    render(
      <RegistrarCuentas
        onClose={mockOnClose}
        dataSelect={{}}
        accion="Nuevo"
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Descripción de la cuenta'), { target: { value: 'Cuenta de Ahorros' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '1000' } });
    // Icon selection might be harder to test without more details on EmojiPicker

    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(mockInsertarCuenta).toHaveBeenCalledWith(expect.objectContaining({
        descripcion: 'Cuenta de Ahorros',
        saldo_actual: 1000,
        idusuario: mockUsuario.id,
        // icono: default or selected icon
      }));
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  test('renders correctly for "Editar" action and pre-fills data', () => {
    const cuentaData = {
      id: 1,
      descripcion: 'Cuenta Vieja',
      saldo_actual: 500,
      icono: '🏦',
      idusuario: mockUsuario.id,
    };
    render(
      <RegistrarCuentas
        onClose={mockOnClose}
        dataSelect={cuentaData}
        accion="Editar"
      />
    );
    expect(screen.getByText('Editar cuenta')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Cuenta Vieja')).toBeInTheDocument();
    expect(screen.getByDisplayValue('500')).toBeInTheDocument();
    // Check if icon is set (might need to inspect the input value directly)
    const iconInput = screen.getByDisplayValue('🏦') as HTMLInputElement;
    expect(iconInput).toBeInTheDocument();

  });

  test('calls actualizarCuenta on submit for "Editar" action', async () => {
    const cuentaData = {
      id: 1,
      descripcion: 'Cuenta Vieja',
      saldo_actual: 500,
      icono: '🏦',
      idusuario: mockUsuario.id,
    };
    render(
      <RegistrarCuentas
        onClose={mockOnClose}
        dataSelect={cuentaData}
        accion="Editar"
      />
    );

    fireEvent.change(screen.getByDisplayValue('Cuenta Vieja'), { target: { value: 'Cuenta Editada' } });
    fireEvent.change(screen.getByDisplayValue('500'), { target: { value: '750' } });

    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(mockActualizarCuenta).toHaveBeenCalledWith(cuentaData.id, expect.objectContaining({
        descripcion: 'Cuenta Editada',
        saldo_actual: 750,
        idusuario: mockUsuario.id,
        // icono: current icon
      }));
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  // Add more tests:
  // - Emoji picker interaction (if feasible)
  // - Validation errors (if react-hook-form errors are displayed)
  // - onClose being called when 'x' is clicked
});
