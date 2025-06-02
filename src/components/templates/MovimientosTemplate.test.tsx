import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react'; // Added 'act'
import '@testing-library/jest-dom';
import React from 'react';

import { MovimientosTemplate } from './MovimientosTemplate';
// Import concrete components needed for props, and types
import { DataDesplegables } from '../../utils/dataEstatica';
import { v } from '../../styles/variables';
import { Device } from '../../styles/breakpoints';
import { BtnIcono as ActualBtnIcono } from '../moleculas/BtnIcono';
import { Btndesplegable as ActualBtndesplegable } from '../moleculas/Btndesplegable';
import { ListaMenuDesplegable as ActualListaMenuDesplegable } from '../moleculas/ListaMenuDesplegable';
import { Tipo } from '../../types/types';

import { Tipo } from '../../types/types';

// Import functions/components to be mocked AND concrete values/components from '../../index'
import { 
  useOperaciones, 
  useMovimientosStore, 
  FiltrosMovimientosResponsive,
  Header,
  RegistrarMovimientos,
  CardTotales,
  CalendarioLineal,
  TablaMovimientos,
  Lottieanimacion,
  DataDesplegables, // Will be the auto-mocked version or actual if not mocked by value
  v,                 // Will be the auto-mocked version or actual
  Device,            // Will be the auto-mocked version or actual
  BtnIcono,          // Will be the auto-mocked version
  Btndesplegable,    // Will be the auto-mocked version
  ListaMenuDesplegable // Will be the auto-mocked version
} from '../../index'; 

// Mock the entire module '../../index'
// This ensures all named exports from '../../index' are mocked (auto-mocked by Vitest)
vi.mock('../../index');

// Now, vi.mocked can be used safely on the imported members to configure their mock behavior
const useOperacionesMock = vi.mocked(useOperaciones);
const useMovimientosStoreMock = vi.mocked(useMovimientosStore);
const MockedFiltrosMovimientosResponsive = vi.mocked(FiltrosMovimientosResponsive);
const HeaderMock = vi.mocked(Header);
const RegistrarMovimientosMock = vi.mocked(RegistrarMovimientos);
const CardTotalesMock = vi.mocked(CardTotales);
const CalendarioLinealMock = vi.mocked(CalendarioLineal);
const TablaMovimientosMock = vi.mocked(TablaMovimientos);
const LottieanimacionMock = vi.mocked(Lottieanimacion);

// For DataDesplegables, v, Device, BtnIcono, Btndesplegable, ListaMenuDesplegable
// if they are objects/functions, they are now auto-mocked by vi.mock('../../index');
// If DataDesplegables, v, Device are plain objects, their auto-mock might be an empty object.
// We might need to provide a mock implementation if the component relies on their actual values.
// However, for prop comparison, passing the auto-mocked reference is what matters.
// Let's assume for now that for prop comparison, using these directly is fine.
// If MovimientosTemplate needs actual values from DataDesplegables, v, Device, this might require
// more specific mocking for them (e.g. vi.mocked(DataDesplegables).mockReturnValue(actualDataDesplegables))

describe('MovimientosTemplate', () => {
  const mockSetTipoMovimientos = vi.fn();
  const mockTipoBalance: Tipo = { tipo: 'b', text: 'Balance', color: '#fff', bgcolor: '#000', icono: 'B' };

  beforeEach(() => {
    vi.clearAllMocks(); 

    useOperacionesMock.mockReturnValue({
      setTipoMovimientos: mockSetTipoMovimientos,
      selectTipoMovimiento: mockTipoBalance,
    });

    useMovimientosStoreMock.mockReturnValue({
      totalMesAño: 1000,
      totalMesAñoPagados: 500,
      totalMesAñoPendientes: 500,
      datamovimientos: { i: [], g: [] },
    });

    // Setup mock implementations for components that are part of MovimientosTemplate's structure
    MockedFiltrosMovimientosResponsive.mockImplementation(() => <div data-testid="filtros-responsive-mock">FiltrosResponsiveMock</div>);
    HeaderMock.mockImplementation(() => <div data-testid="header-mock">HeaderMock</div>);
    RegistrarMovimientosMock.mockImplementation(() => <div data-testid="registrar-movimientos-mock">RegistrarMovimientosMock</div>);
    CardTotalesMock.mockImplementation(() => <div data-testid="card-totales-mock">CardTotalesMock</div>);
    CalendarioLinealMock.mockImplementation(() => <div data-testid="calendario-lineal-mock">CalendarioLinealMock</div>);
    TablaMovimientosMock.mockImplementation(() => <div data-testid="tabla-movimientos-mock">TablaMovimientosMock</div>);
    LottieanimacionMock.mockImplementation(() => <div data-testid="lottie-animacion-mock">LottieAnimacionMock</div>);

    // If DataDesplegables, v, Device are used for their values and not just as references,
    // and if their auto-mocked versions are empty or unsuitable, we'd mock their values here.
    // For example, if DataDesplegables were auto-mocked as undefined:
    // vi.mocked(DataDesplegables).mockReturnValue({ movimientos: { ... } }); 
    // For now, we assume the auto-mocked references are sufficient for prop comparison.
  });

  it('renders FiltrosMovimientosResponsive and passes correct props', () => {
    render(<MovimientosTemplate />);

    expect(screen.getByTestId('filtros-responsive-mock')).toBeInTheDocument();
    expect(MockedFiltrosMovimientosResponsive).toHaveBeenCalled();

    // Now use the full expectedProps with references from the mocked '../../index'
    const expectedProps = {
      currentTipo_tipo: mockTipoBalance.tipo,
      onFiltroChange: expect.any(Function), // The actual function is created inside MovimientosTemplate
      dataDesplegables_movimientos: DataDesplegables.movimientos, // Use DataDesplegables from mocked '../../index'
      v_obj: v, // Use v from mocked '../../index'
      Device_obj: Device, // Use Device from mocked '../../index'
      BtnIcono_comp: BtnIcono, // Use BtnIcono from mocked '../../index'
      Btndesplegable_comp: Btndesplegable, // Use Btndesplegable from mocked '../../index'
      ListaMenuDesplegable_comp: ListaMenuDesplegable, // Use ListaMenuDesplegable from mocked '../../index'
    };
    
    expect(MockedFiltrosMovimientosResponsive).toHaveBeenCalledWith(
      expect.objectContaining(expectedProps),
      undefined 
    );
    
    const actualProps = MockedFiltrosMovimientosResponsive.mock.calls[0][0];
    const newTipo: Tipo = { tipo: 'i', text: 'Ingresos', color: '#0f0', bgcolor: '#00f', icono: 'I' };
    if (typeof actualProps.onFiltroChange === 'function') {
      act(() => {
        actualProps.onFiltroChange(newTipo);
      });
      expect(mockSetTipoMovimientos).toHaveBeenCalledWith(newTipo);
    } else {
      throw new Error("onFiltroChange prop was not a function");
    }
  });

  it('renders other main sections (smoke test)', () => {
    render(<MovimientosTemplate />);
    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('filtros-responsive-mock')).toBeInTheDocument(); 
    expect(screen.getAllByTestId('card-totales-mock').length).toBe(3);
    expect(screen.getByTestId('calendario-lineal-mock')).toBeInTheDocument();
  });
});
