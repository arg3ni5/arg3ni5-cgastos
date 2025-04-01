import styled from "styled-components";
import {
  BtnCircular,
  v,
  ListaMenuDesplegable,
  DesplegableUser,
  useAuthStore,
  useUserAuth,
} from "../../index";
import { MouseEventHandler } from "react";

// Tipar el estado de visibilidad del menú
interface StateConfig {
  state: boolean;
  setState: MouseEventHandler<HTMLDivElement>;
}

// Tipar el tipo esperado por la función del menú
interface MenuOption {
  tipo: string;
  [key: string]: any; // Por si hay otros campos
}

export const DataUser = ({ stateConfig }: { stateConfig: StateConfig }) => {
  const { user } = useUserAuth(); // user: { name: string; picture: string } | null
  const { signout } = useAuthStore();

  const funcionXtipo = async (p: MenuOption) => {
    if (p.tipo === "cerrarsesion") {
      await signout();
    }
  };

  return (
    <Container onClick={stateConfig.setState}>
      <div className="imgContainer">
        <img src={user?.picture} alt="Foto de perfil" />
      </div>

      <BtnCircular
        icono={<v.iconocorona />}
        width="25px"
        height="25px"
        bgcolor={`linear-gradient(15deg, rgba(255, 88, 58, 0.86) 9%, #f8bf5b 100%)`}
        textcolor="#ffffff"
        fontsize="11px"
        translatex="-75px"
        translatey="-12px"
      />
      <span className="nombre">{user?.name}</span>

      {stateConfig.state && (
        <ListaMenuDesplegable
          data={DesplegableUser}
          top="62px"
          funcion={funcionXtipo}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  top: 0;
  right: 0;
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 50px;
  margin: 15px;
  cursor: pointer;
  .imgContainer {
    height: 40px;
    width: 40px;
    min-height: 40px;
    min-width: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      object-fit: cover;
    }
  }
  &:hover {
    background-color: ${({ theme }) => theme.bg3};
  }
  .nombre {
    width: 100%;
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: break-word;
  }
`;
