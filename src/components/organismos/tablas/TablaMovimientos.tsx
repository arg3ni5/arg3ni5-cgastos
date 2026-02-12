import styled from "styled-components";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper'; // Make sure Swiper types are imported if needed for Swiper instance methods
import 'swiper/css';
import {
  Accion,
  ContentAccionesTabla,
  hexToRgba,
  Movimiento,
  MovimientosMesAnio,
  Paginacion,
  Tipo,
  useMovimientosStore,
} from "../../../index";
import Swal from "sweetalert2";
import { v } from "../../../styles/variables";
import { JSX, useState, useRef, useEffect } from "react"; // Added useEffect
import { convertToMovimiento } from '../../../supabase/crudMovimientos';

// If you need specific Swiper modules, import them here, e.g.:
// import { Navigation, Pagination } from 'swiper/modules';
// SwiperCore.use([Navigation, Pagination]);


interface TablaMovimientosProps {
  titulo?: string;
  tipo: Tipo;
  color: string;
  data: MovimientosMesAnio | null;
  setOpenRegistro: (value: boolean) => void;
  setDataSelect: (data: Movimiento) => void;
  setAccion: (value: Accion) => void;
}

export const TablaMovimientos = ({
  titulo,
  tipo,
  color,
  data,
  setOpenRegistro,
  setDataSelect,
  setAccion,
}: TablaMovimientosProps): JSX.Element | null => {
  if (data == null) {
    return null;
  }

  const [pagina, setPagina] = useState<number>(1);
  const [porPagina, setPorPagina] = useState<number>(10);
  const [activeSwiperKey, setActiveSwiperKey] = useState<string | null>(null);
  const swiperRefs = useRef<Record<string, SwiperCore>>({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768); // 48em * 16px/em = 768px

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mx = data.length / porPagina;
  const maximo = mx < 1 ? 1 : mx;

  const { eliminarMovimiento } = useMovimientosStore();

  const eliminar = (p: Movimiento): void => {
    Swal.fire({
      title: "¿Estás seguro(a)(e)?",
      text: "Una vez eliminado, ¡no podrá recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarMovimiento({ id: p.id } as Movimiento);
      }
    });
  };

  const editar = (data: Movimiento): void => {
    setOpenRegistro(true);
    setDataSelect({ ...data, tipo: tipo.tipo });
    setAccion("Editar");
  };

  return (
    <>
      <Container $bgcolor={tipo.bgcolor || ''} $color={tipo.color || ''}>
        {titulo && (<h2>{titulo}</h2>)}
        <table className="responsive-table">
          <thead>
            <tr>
              <th scope="col">Pagado</th>
              <th scope="col">Fecha</th>
              <th scope="col">Descripcion</th>
              <th scope="col">Categoria</th>
              <th scope="col">Cuenta</th>
              <th scope="col">Valor</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data
              .slice(
                (pagina - 1) * porPagina,
                (pagina - 1) * porPagina + porPagina
              )
              .map((item) => {
                const itemKey = item.id; // Assuming item.id is unique
                return (
                  <tr key={itemKey} className="swipeable-row">
                    <td colSpan={7} style={{ padding: 0, overflow: 'hidden' }}> {/* Adjusted colSpan to 7 based on original headers */}
                      <SwiperStyled
                        enabled={!isDesktop} // Disable Swiper on desktop
                        onSwiper={(swiper) => {
                          swiperRefs.current[itemKey] = swiper;
                        }}
                        onSlideChange={(swiper) => {
                          if (isDesktop) return; // Do not handle slide changes if Swiper is disabled
                          if (swiper.activeIndex === 1) { // Actions slide is open
                            if (activeSwiperKey && activeSwiperKey !== itemKey) {
                              swiperRefs.current[activeSwiperKey]?.slideTo(0);
                            }
                            setActiveSwiperKey(itemKey);
                          } else if (swiper.activeIndex === 0 && activeSwiperKey === itemKey) {
                            setActiveSwiperKey(null);
                          }
                        }}
                        onTransitionEnd={(swiper) => { // Ensure slides are reset if isDesktop becomes true
                          if (isDesktop && swiper.activeIndex === 1) {
                            swiper.slideTo(0, 0); // Reset to first slide without animation
                          }
                        }}
                        watchSlidesProgress={!isDesktop} // Only watch progress if enabled
                        touchReleaseOnEdges={!isDesktop}
                        longSwipesRatio={isDesktop ? 0.5 : 0.1} // Make swipes harder on desktop if still somehow active
                        shortSwipes={isDesktop ? true : false}
                        slidesPerView={1}
                        spaceBetween={0}
                        allowTouchMove={!isDesktop} // Explicitly disable touch move on desktop
                      >
                        <SwiperSlide>
                          <RowContentWrapper>
                            <CellData data-title="Situacion">
                              <Situacion
                                $bgcolor={item.estado == "1" ? "#69e673" : "#b3b3b3"}
                              ></Situacion>
                            </CellData>
                            <CellData data-title="Fecha">{item.fecha}</CellData>
                            <CellData data-title="Descripcion">{item.descripcion}</CellData>
                            <CellData data-title="Categoria">{item.categoria}</CellData>
                            <CellData data-title="Cuenta">{item.cuenta}</CellData>
                            <CellData data-title="Monto">{item.valorymoneda}</CellData>
                          </RowContentWrapper>
                        </SwiperSlide>
                        <SwiperSlide>
                          <ActionsSlideContainer>
                            <ContentAccionesTabla
                              funcionEditar={() => {
                                editar(convertToMovimiento(item));
                                swiperRefs.current[itemKey]?.slideTo(0); // Close slider on action
                                setActiveSwiperKey(null);
                              }}
                              funcionEliminar={() => {
                                eliminar(convertToMovimiento(item));
                                swiperRefs.current[itemKey]?.slideTo(0); // Close slider on action
                                setActiveSwiperKey(null);
                              }}
                            />
                          </ActionsSlideContainer>
                        </SwiperSlide>
                      </SwiperStyled>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="pagination">

          {maximo > 1 && <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} color={color} />}
        </div>
      </Container>
    </>
  );
}
interface ContainerProps {
  $bgcolor: string;
  $color: string;
}
const Container = styled.div<ContainerProps>`
  border-radius: 25px;
  width: 100%;
  background-color: ${(props) => hexToRgba(props.$color, 0.14)};

  position: relative;
  margin: 5% 3%;

  h2 {
    padding: 20px;
  }
  .pagination{
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media (min-width: ${v.bpbart}) {
    margin: 0;
  }
  @media (min-width: ${v.bphomer}) {
    margin: 2em auto;
    max-width: ${v.bphomer};
  }
  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    @media (min-width: ${v.bpbart}) {
      font-size: 0.9em;
    }
    @media (min-width: ${v.bpmarge}) {
      font-size: 1em;
    }
    thead {
      // On mobile, thead is hidden by default by responsive styles below.
      // For desktop, it remains as is.
      @media (max-width: calc(${v.bpbart} - 1px)) {
        display: none; // Explicitly hide if not already fully handled by existing responsive styles
      }
      position: absolute;
      padding: 0;
      border: 0;
      height: 1px;
      width: 1px;
      overflow: hidden;
      @media (min-width: ${v.bpbart}) {
        position: relative;
        height: auto;
        width: auto;
        overflow: auto;
        display: table-header-group; // Ensure it's treated as a header group on desktop
      }
      th {
        border-bottom: 2px solid rgba(115, 115, 115, 0.32);
        font-weight: normal;
        text-align: center;
        color: ${({ theme }) => theme.text};
        &:first-of-type {
          text-align: center;
        }
      }
    }
    tbody {
      // On mobile, tbody, tr, th, td are display: block.
      // This new structure with Swiper respects that for mobile.
      @media (min-width: ${v.bpbart}) {
        display: table-row-group;
      }
      tr.swipeable-row { // Styles for the new Swiper row
        // On mobile, tr is display: block.
        // On desktop, it needs to be display: table-row.
        @media (min-width: ${v.bpbart}) {
          display: table-row;
          td { // The single td holding the Swiper should act like a normal td
            display: table-cell;
            // Reset any specific mobile styling for this cell on desktop
            overflow: visible;
          }
        }
      }
      // Original responsive styles that make the table card-like on mobile
      // These might need adjustment if they conflict with Swiper's structure
      & > tr:not(.swipeable-row), // Apply to original tr if any are left, or adjust
      & > tr > th,
      & > tr > td:not([colspan="7"]) { // Exclude our swiper cell from some of these if needed
        @media (max-width: calc(${v.bpbart} - 1px)) {
          display: block;
          padding: 0; // Original style, check if Swiper needs this overridden
          text-align: left;
          white-space: normal;
        }
      }
       tr:not(.swipeable-row) { // Original tr styles
        @media (min-width: ${v.bpbart}) {
          display: table-row;
        }
      }

      th, // Original th, td styles
      td:not([colspan="7"]) { // Exclude our swiper cell from some of these if needed
        padding: 0.5em;
        vertical-align: middle;
        @media (min-width: ${v.bplisa}) {
          padding: 0.75em 0.5em;
        }
        @media (min-width: ${v.bpbart}) {
          display: table-cell;
          padding: 0.5em;
        }
        @media (min-width: ${v.bpmarge}) {
          padding: 0.75em 0.5em;
        }
        @media (min-width: ${v.bphomer}) {
          padding: 0.75em;
        }
      }
      // Original tbody specific styles
      & { // Referring to tbody
          @media (min-width: ${v.bpbart}) {
            display: table-row-group;
          }
          tr { // This will also apply to .swipeable-row
            margin-bottom: 1em; // This might affect layout if Swiper has its own height
             @media (min-width: ${v.bpbart}) {
                display: table-row;
                border-width: 1px;
             }
             &:last-of-type {
                margin-bottom: 0;
             }
             &:nth-of-type(even) {
                @media (min-width: ${v.bpbart}) {
                    background-color: rgba(151, 151, 151, 0.12);
                }
             }
          }
          th[scope="row"] { // This was for the first cell in original layout
            @media (min-width: ${v.bplisa}) {
              border-bottom: 1px solid rgba(161, 161, 161, 0.32);
            }
            @media (min-width: ${v.bpbart}) {
              background-color: transparent;
              text-align: center;
              color: ${({ theme }) => theme.text};
            }
          }
          td { // General td styling
             text-align: right; // This makes data appear on right on mobile
             @media (min-width: ${v.bpbart}) { // Desktop
                border-bottom: 1px solid rgba(161, 161, 161, 0.32);
                text-align: center;
             }
          }
          td[data-title="Acciones"] { // No longer directly used by Swiper layout for actions cell styling
            @media (max-width: 768px) {
              // padding: 0.5em; // Previous change, may not be needed if Swiper handles padding
            }
          }
          td[data-type="currency"] {
            font-weight:600;
          }
          // This :before is crucial for mobile view data labeling.
          // It needs to be replicated for CellData or RowContentWrapper
          td[data-title]:before {
            content: attr(data-title);
            float: left;
            font-size: 0.8em;
            @media (min-width: ${v.bplisa}) {
              font-size: 0.9em;
            }
            @media (min-width: ${v.bpbart}) {
              content: none; // Hidden on desktop
            }
          }
      }
    }
  }
`;

// Styled Swiper component
const SwiperStyled = styled(Swiper)`
  width: 100%;
  // Potentially set a fixed height or min-height for rows if content varies
  // &.swiper-container { } // For global Swiper styles if needed

  .swiper-slide {
    // By default, Swiper slides have width: 100%.
    // The actions slide might need a specific width.
    // align-items: stretch; // Make slides same height
  }
`;

const RowContentWrapper = styled.div`
  display: flex; // For horizontal layout of cells
  flex-wrap: wrap; // Allow wrapping on very small screens if necessary
  padding: 0.5em; // Mimic original cell padding
  background-color: ${({ theme }) => theme.body}; // Ensure background for swipe

  // Replicate mobile "card" view style
  @media (max-width: calc(${v.bpbart} - 1px)) {
    flex-direction: column; // Stack cells vertically
  }
`;

const CellData = styled.div`
  padding: 0.5em 0.25em; // Mimic cell padding
  flex-basis: 100%; // Default for stacked mobile view

  @media (max-width: calc(${v.bpbart} - 1px)) {
    text-align: right; // Align data to the right as in original
    &:before {
      content: attr(data-title);
      float: left;
      font-size: 0.8em;
      color: ${({ theme }) => theme.text}; // Ensure title is visible
      font-weight: bold;
    }
  }

  // Desktop-like layout (flex items in a row)
  @media (min-width: ${v.bpbart}) { // Corresponds to 48em (e.g., 768px if 1em=16px)
    border-bottom: 1px solid rgba(161, 161, 161, 0.32); // Mimic original td border
    &:not(:last-child) {
      border-right: 1px solid rgba(161, 161, 161, 0.12); // Vertical lines between cells
    }
    // Default text align for desktop cells, can be overridden per data-title
    text-align: left;
    padding: 0.75em 0.5em; // Consistent padding for desktop cells
  }

  &[data-title="Situacion"] {
    @media (min-width: ${v.bpbart}) {
      flex-basis: 60px;
      flex-grow: 0;
      flex-shrink: 0;
      justify-content: center; // Center the icon
      align-items: center; // Center the icon
      text-align: center;
    }
    // Common style for mobile (already flex for icon centering)
    display: flex;
    justify-content: center; // For mobile before title appears, or if title is short
    align-items: center; // For mobile
     &::before { // Mobile specific title alignment for Situacion
        @media (max-width: calc(${v.bpbart} - 1px)) {
          text-align: left; // Align title to left for this specific cell
          width: auto; // allow title to take its space
          margin-right: 5px; // space between title and icon
          float: none; // Override default float for this specific case if needed
        }
    }
  }
  &[data-title="Fecha"] {
    @media (min-width: ${v.bpbart}) {
      flex-basis: 120px; // Fixed width for date
      flex-grow: 0;
      flex-shrink: 0;
      text-align: left;
    }
  }
  &[data-title="Descripcion"] {
    @media (min-width: ${v.bpbart}) {
      flex-basis: 0; // Allow flex-grow to determine width
      flex-grow: 1; // Takes up remaining space
      text-align: left;
      // word-break: break-all; // If descriptions are very long and need to wrap
    }
  }
  &[data-title="Categoria"] {
    @media (min-width: ${v.bpbart}) {
      flex-basis: 130px;
      flex-grow: 0;
      flex-shrink: 0;
      text-align: left;
    }
  }
  &[data-title="Cuenta"] {
    @media (min-width: ${v.bpbart}) {
      flex-basis: 130px;
      flex-grow: 0;
      flex-shrink: 0;
      text-align: left;
    }
  }
  &[data-title="Monto"] {
    font-weight: 600; // Common style for mobile and desktop
    @media (min-width: ${v.bpbart}) {
      flex-basis: 120px;
      flex-grow: 0;
      flex-shrink: 0;
      text-align: right;
    }
  }
`;

const ActionsSlideContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end; // Align buttons to the right
  padding: 0.5em;
  background-color: ${({ theme }) => theme.body}; // Or a different color for actions
  height: 100%; // Try to match row height

  // Make sure ContentAccionesTabla's children (buttons) are spaced out
  & > div { // Assuming ContentAccionesTabla renders a div container for its buttons
    display: flex; // Ensure buttons inside ContentAccionesTabla are also flex items if needed
    gap: 15px;
    // Ensure buttons are visible and properly styled even if slide is narrow
    // This container itself is a direct child of a SwiperSlide.
    // The ContentAccionesTabla component's internal styling will determine button layout.
  }
  // On desktop, when swiper is disabled, this slide should not be visible or take space
  @media (min-width: ${v.bpbart}) {
     display: none; // Hide actions slide container on desktop
  }
`;

interface ColorcontentProps {
  $alto?: string;
  $ancho?: string;
  color?: string;
}

interface PagadoProps {
  $bgcolor: string;
}

const Colorcontent = styled.div<ColorcontentProps>`
  justify-content: center;
  min-height: ${(props) => props.$alto};
  width: ${(props) => props.$ancho};
  display: block;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  text-align: center;
`;

const Pagado = styled.div<PagadoProps>`
  display: flex;
  justify-content: center;
  &::before {
    content: "";
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${(props) => props.$bgcolor};
  }
`;
