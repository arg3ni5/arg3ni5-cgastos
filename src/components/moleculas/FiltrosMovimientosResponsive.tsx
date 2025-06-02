import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v, Device, BtnIcono as BtnIconoOriginal, Btndesplegable as BtndesplegableOriginal, ListaMenuDesplegable as ListaMenuDesplegableOriginal, Tipo } from '../../index'; // Main index
import { DataDesplegables } from '../../utils/dataEstatica'; // Static data

// Props interface
interface FiltrosMovimientosResponsiveProps {
  currentTipo_tipo: string;
  onFiltroChange: (tipo: Tipo) => void;
  dataDesplegables_movimientos: { g: Tipo; i: Tipo; b: Tipo };
  v_obj: typeof v; 
  Device_obj: typeof Device; 
  BtnIcono_comp: typeof BtnIconoOriginal;
  Btndesplegable_comp: typeof BtndesplegableOriginal;
  ListaMenuDesplegable_comp: typeof ListaMenuDesplegableOriginal;
}

const MobileContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const DesktopContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StyledListaMenuDesplegableContainer = styled.div`
  position: absolute;
  top: calc(100% + 5px); // Position below the button
  left: 0;
  right: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.bgtotal}; 
  border: 1px solid ${({ theme }) => theme.gray300};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const FiltrosMovimientosResponsive: React.FC<FiltrosMovimientosResponsiveProps> = (props) => {
  const {
    currentTipo_tipo,
    onFiltroChange,
    dataDesplegables_movimientos,
    v_obj,
    Device_obj,
    BtnIcono_comp: BtnIcono, // Alias to use in JSX
    Btndesplegable_comp: Btndesplegable, // Alias to use in JSX
    ListaMenuDesplegable_comp: ListaMenuDesplegable, // Alias to use in JSX
  } = props;

  const tabletBreakpoint = parseInt(Device_obj.tablet.replace('px', ''), 10);
  const [isMobile, setIsMobile] = useState(window.innerWidth < tabletBreakpoint);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const currentIsMobile = window.innerWidth < tabletBreakpoint;
      if (currentIsMobile !== isMobile) {
        setIsMobile(currentIsMobile);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tabletBreakpoint, isMobile]);

  // Correctly typed data from props
  const gastos = dataDesplegables_movimientos.g as Tipo;
  const ingresos = dataDesplegables_movimientos.i as Tipo;
  const balance = dataDesplegables_movimientos.b as Tipo;

  const handleFilterSelect = (tipo: Tipo) => {
    onFiltroChange(tipo);
    setShowDropdown(false);
  };

  const getCurrentFilterData = (): Tipo => {
    if (currentTipo_tipo === ingresos.tipo) return ingresos;
    if (currentTipo_tipo === gastos.tipo) return gastos;
    return balance; // Default to balance
  };
  
  const currentFilterData = getCurrentFilterData();
  
  // Use a color from v_obj for active state, provide a fallback
  const activeBgColor = v_obj.colorselector ?? v_obj.color.primary ?? '#007bff';


  if (isMobile) {
    return (
      <MobileContainer>
        <Btndesplegable
          text={currentFilterData.text}
          icono={currentFilterData.icono}
          bgcolor={currentFilterData.bgcolor}
          textcolor={currentFilterData.color}
          funcion={() => setShowDropdown(prev => !prev)}
        />
        {showDropdown && (
          <StyledListaMenuDesplegableContainer>
            <ListaMenuDesplegable
              data={[balance, ingresos, gastos]}
              funcion={(p) => handleFilterSelect(p as Tipo)} 
            />
          </StyledListaMenuDesplegableContainer>
        )}
      </MobileContainer>
    );
  }

  // Desktop view
  return (
    <DesktopContainer>
      <BtnIcono
        icono={balance.icono}
        textcolor={balance.color}
        bgcolor={currentTipo_tipo === balance.tipo ? activeBgColor : balance.bgcolor}
        text={balance.text} 
        funcion={() => handleFilterSelect(balance)}
      />
      <BtnIcono
        icono={ingresos.icono}
        textcolor={ingresos.color}
        bgcolor={currentTipo_tipo === ingresos.tipo ? activeBgColor : ingresos.bgcolor}
        text={ingresos.text}
        funcion={() => handleFilterSelect(ingresos)}
      />
      <BtnIcono
        icono={gastos.icono}
        textcolor={gastos.color}
        bgcolor={currentTipo_tipo === gastos.tipo ? activeBgColor : gastos.bgcolor}
        text={gastos.text}
        funcion={() => handleFilterSelect(gastos)}
      />
    </DesktopContainer>
  );
};
