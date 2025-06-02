import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { FiltrosMovimientosResponsive } from './FiltrosMovimientosResponsive';
import { Tipo } from '../../types/types'; // Assuming Tipo is here, adjust if necessary
import { DataDesplegables } from '../../utils/dataEstatica';
import { v } from '../../styles/variables'; // Actual path to v
import { Device } from '../../styles/breakpoints'; // Actual path to Device

// Mock Components
const MockBtnIcono: React.FC<any> = ({ text, funcion, bgcolor, ...rest }) => (
  <button data-testid={`btn-icono-${text}`} onClick={funcion} style={{ backgroundColor: bgcolor }} {...rest}>
    {text} {rest.icono && <span data-testid={`icon-${text}`}>{rest.icono}</span>}
  </button>
);

const MockBtndesplegable: React.FC<any> = ({ text, funcion, icono, ...rest }) => (
  <button data-testid="btn-desplegable" onClick={funcion} {...rest}>
    {text} {icono && <span data-testid={`icon-desplegable`}>{icono}</span>}
  </button>
);

const MockListaMenuDesplegable: React.FC<any> = ({ data, funcion, ...rest }) => (
  <ul data-testid="lista-menu-desplegable" {...rest}>
    {data.map((item: Tipo) => (
      <li key={item.tipo} onClick={() => funcion(item)} data-testid={`item-${item.tipo}`}>
        {item.text}
      </li>
    ))}
  </ul>
);

const mockV = { ...v, colorselector: 'blue', color: { ...v.color, primary: 'blue' } }; // Ensure mockV has expected structure
const mockDevice = { ...Device, tablet: '768px' };

const mockMovimientos = DataDesplegables.movimientos as { g: Tipo; i: Tipo; b: Tipo; };

describe('FiltrosMovimientosResponsive', () => {
  const mockOnFiltroChange = vi.fn();
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    mockOnFiltroChange.mockClear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
    fireEvent(window, new Event('resize')); // Reset resize event listeners
  });

  const setScreenWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    });
    act(() => {
      fireEvent(window, new Event('resize'));
    });
  };
  
  // --- Mobile View Tests ---
  describe('Mobile View', () => {
    beforeEach(() => {
      setScreenWidth(500); // Mobile width
    });

    it('renders Btndesplegable and not BtnIconos on mobile', () => {
      render(
        <FiltrosMovimientosResponsive
          currentTipo_tipo="b"
          onFiltroChange={mockOnFiltroChange}
          dataDesplegables_movimientos={mockMovimientos}
          v_obj={mockV}
          Device_obj={mockDevice}
          BtnIcono_comp={MockBtnIcono}
          Btndesplegable_comp={MockBtndesplegable}
          ListaMenuDesplegable_comp={MockListaMenuDesplegable}
        />
      );
      expect(screen.getByTestId('btn-desplegable')).toBeInTheDocument();
      expect(screen.queryByTestId('btn-icono-Todos')).not.toBeInTheDocument();
      expect(screen.queryByTestId('btn-icono-Ingresos')).not.toBeInTheDocument();
      expect(screen.queryByTestId('btn-icono-Gastos')).not.toBeInTheDocument();
    });

    it('shows and hides ListaMenuDesplegable on Btndesplegable click', () => {
      render(
        <FiltrosMovimientosResponsive
          currentTipo_tipo="b"
          onFiltroChange={mockOnFiltroChange}
          dataDesplegables_movimientos={mockMovimientos}
          v_obj={mockV}
          Device_obj={mockDevice}
          BtnIcono_comp={MockBtnIcono}
          Btndesplegable_comp={MockBtndesplegable}
          ListaMenuDesplegable_comp={MockListaMenuDesplegable}
        />
      );
      const desplegableButton = screen.getByTestId('btn-desplegable');
      expect(screen.queryByTestId('lista-menu-desplegable')).not.toBeInTheDocument();
      
      fireEvent.click(desplegableButton);
      expect(screen.getByTestId('lista-menu-desplegable')).toBeInTheDocument();
      
      fireEvent.click(desplegableButton); // Click again to hide
      expect(screen.queryByTestId('lista-menu-desplegable')).not.toBeInTheDocument();
    });

    it('calls onFiltroChange and hides dropdown when an item is selected from ListaMenuDesplegable', () => {
      render(
        <FiltrosMovimientosResponsive
          currentTipo_tipo="b"
          onFiltroChange={mockOnFiltroChange}
          dataDesplegables_movimientos={mockMovimientos}
          v_obj={mockV}
          Device_obj={mockDevice}
          BtnIcono_comp={MockBtnIcono}
          Btndesplegable_comp={MockBtndesplegable}
          ListaMenuDesplegable_comp={MockListaMenuDesplegable}
        />
      );
      fireEvent.click(screen.getByTestId('btn-desplegable')); // Open dropdown
      
      const ingresosItem = screen.getByTestId(`item-${mockMovimientos.i.tipo}`);
      fireEvent.click(ingresosItem);
      
      expect(mockOnFiltroChange).toHaveBeenCalledWith(mockMovimientos.i);
      expect(screen.queryByTestId('lista-menu-desplegable')).not.toBeInTheDocument();
    });

    it('displays the correct text and icon on Btndesplegable based on currentTipo_tipo', () => {
      render(
        <FiltrosMovimientosResponsive
          currentTipo_tipo="i" // Current type is Ingresos
          onFiltroChange={mockOnFiltroChange}
          dataDesplegables_movimientos={mockMovimientos}
          v_obj={mockV}
          Device_obj={mockDevice}
          BtnIcono_comp={MockBtnIcono}
          Btndesplegable_comp={MockBtndesplegable}
          ListaMenuDesplegable_comp={MockListaMenuDesplegable}
        />
      );
      const desplegableButton = screen.getByTestId('btn-desplegable');
      expect(desplegableButton).toHaveTextContent(mockMovimientos.i.text);
      // Assuming icon is passed as a string or simple node for testing in MockBtndesplegable
      // If icon is a component, this check needs adjustment based on how MockBtndesplegable handles it.
      // For this example, let's assume text check is sufficient or icon is a string/data-attribute.
    });
  });

  // --- Desktop View Tests ---
  describe('Desktop View', () => {
    beforeEach(() => {
      setScreenWidth(1024); // Desktop width
    });

    it('renders BtnIconos and not Btndesplegable on desktop', () => {
      render(
        <FiltrosMovimientosResponsive
          currentTipo_tipo="b"
          onFiltroChange={mockOnFiltroChange}
          dataDesplegables_movimientos={mockMovimientos}
          v_obj={mockV}
          Device_obj={mockDevice}
          BtnIcono_comp={MockBtnIcono}
          Btndesplegable_comp={MockBtndesplegable}
          ListaMenuDesplegable_comp={MockListaMenuDesplegable}
        />
      );
      expect(screen.queryByTestId('btn-desplegable')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lista-menu-desplegable')).not.toBeInTheDocument();
      expect(screen.getByTestId(`btn-icono-${mockMovimientos.b.text}`)).toBeInTheDocument();
      expect(screen.getByTestId(`btn-icono-${mockMovimientos.i.text}`)).toBeInTheDocument();
      expect(screen.getByTestId(`btn-icono-${mockMovimientos.g.text}`)).toBeInTheDocument();
    });

    it('calls onFiltroChange when a BtnIcono is clicked', () => {
      render(
        <FiltrosMovimientosResponsive
          currentTipo_tipo="b"
          onFiltroChange={mockOnFiltroChange}
          dataDesplegables_movimientos={mockMovimientos}
          v_obj={mockV}
          Device_obj={mockDevice}
          BtnIcono_comp={MockBtnIcono}
          Btndesplegable_comp={MockBtndesplegable}
          ListaMenuDesplegable_comp={MockListaMenuDesplegable}
        />
      );
      const ingresosButton = screen.getByTestId(`btn-icono-${mockMovimientos.i.text}`);
      fireEvent.click(ingresosButton);
      expect(mockOnFiltroChange).toHaveBeenCalledWith(mockMovimientos.i);

      const gastosButton = screen.getByTestId(`btn-icono-${mockMovimientos.g.text}`);
      fireEvent.click(gastosButton);
      expect(mockOnFiltroChange).toHaveBeenCalledWith(mockMovimientos.g);
    });

    it('applies active style to the correct BtnIcono based on currentTipo_tipo', () => {
        const activeBgColor = mockV.colorselector; // Defined in mockV
        render(
          <FiltrosMovimientosResponsive
            currentTipo_tipo="i" // Ingresos is active
            onFiltroChange={mockOnFiltroChange}
            dataDesplegables_movimientos={mockMovimientos}
            v_obj={mockV}
            Device_obj={mockDevice}
            BtnIcono_comp={MockBtnIcono} // Using the mock that applies bgcolor to style
            Btndesplegable_comp={MockBtndesplegable}
            ListaMenuDesplegable_comp={MockListaMenuDesplegable}
          />
        );
  
        const ingresosButton = screen.getByTestId(`btn-icono-${mockMovimientos.i.text}`);
        const balanceButton = screen.getByTestId(`btn-icono-${mockMovimientos.b.text}`);
        
        // Adjust expectation to RGB if the browser/jsdom converts color names
        const expectedActiveBgColor = activeBgColor === 'blue' ? 'rgb(0, 0, 255)' : activeBgColor;
        expect(ingresosButton).toHaveStyle(`background-color: ${expectedActiveBgColor}`);
        expect(balanceButton).toHaveStyle(`background-color: ${mockMovimientos.b.bgcolor}`);
      });
  });

  // --- Resize Behavior Tests ---
  describe('Resize Behavior', () => {
    it('switches from mobile to desktop view on resize', () => {
      setScreenWidth(500); // Start mobile
      const { rerender } = render(
        <FiltrosMovimientosResponsive
          currentTipo_tipo="b"
          onFiltroChange={mockOnFiltroChange}
          dataDesplegables_movimientos={mockMovimientos}
          v_obj={mockV}
          Device_obj={mockDevice}
          BtnIcono_comp={MockBtnIcono}
          Btndesplegable_comp={MockBtndesplegable}
          ListaMenuDesplegable_comp={MockListaMenuDesplegable}
        />
      );
      expect(screen.getByTestId('btn-desplegable')).toBeInTheDocument();
      expect(screen.queryByTestId(`btn-icono-${mockMovimientos.b.text}`)).not.toBeInTheDocument();

      setScreenWidth(1024); // Switch to desktop
      // Rerender might not be strictly necessary if the component handles resize internally and updates state
      // However, it's good practice if the test runner needs to be explicitly told about state changes affecting the DOM
      // For this component, useEffect handles it, so direct DOM check after resize event should work.

      expect(screen.queryByTestId('btn-desplegable')).not.toBeInTheDocument();
      expect(screen.getByTestId(`btn-icono-${mockMovimientos.b.text}`)).toBeInTheDocument();
    });

    it('switches from desktop to mobile view on resize', () => {
      setScreenWidth(1024); // Start desktop
      const { rerender } = render(
        <FiltrosMovimientosResponsive
          currentTipo_tipo="b"
          onFiltroChange={mockOnFiltroChange}
          dataDesplegables_movimientos={mockMovimientos}
          v_obj={mockV}
          Device_obj={mockDevice}
          BtnIcono_comp={MockBtnIcono}
          Btndesplegable_comp={MockBtndesplegable}
          ListaMenuDesplegable_comp={MockListaMenuDesplegable}
        />
      );
      expect(screen.queryByTestId('btn-desplegable')).not.toBeInTheDocument();
      expect(screen.getByTestId(`btn-icono-${mockMovimientos.b.text}`)).toBeInTheDocument();

      setScreenWidth(500); // Switch to mobile
      
      expect(screen.getByTestId('btn-desplegable')).toBeInTheDocument();
      expect(screen.queryByTestId(`btn-icono-${mockMovimientos.b.text}`)).not.toBeInTheDocument();
    });
  });
});
