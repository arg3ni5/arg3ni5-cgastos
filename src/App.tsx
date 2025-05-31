// @barrel ignore
import { MyRoutes, Sidebar, Device, Light, Dark, AuthContextProvider, Menuambur, useUsuariosStore, Login, SpinnerLoader } from "./index";
import { useLocation } from "react-router-dom";
import { createContext, JSX, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { styled } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { LoadingProvider } from "./context/LoadingContext";
import { GlobalStyles } from "./styles/GlobalStyles";

type ThemeContextType = typeof Dark | null;



export const ThemeContext = createContext<ThemeContextType>(null);
function App(): JSX.Element {
  const { setUsuario, ObtenerUsuarioActual } = useUsuariosStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const { data: usuario, isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios"],
    queryFn: ObtenerUsuarioActual,
  });  

  useEffect(() => {
    if (usuario) {
      setUsuario(usuario);
    }
  }, [usuario]);
  

  if (pathname !== "/login" && isLoading) return <SpinnerLoader />;
  if (error) return <h1>Error: {error.message}</h1>;

  const theme = usuario?.tema === "0" ? "light" : "dark";

  const themeStyle = theme === "light" ? Light : Dark;


  return (
    <>
      <ThemeContext.Provider value={Dark}>
        <LoadingProvider>
          <ThemeProvider theme={themeStyle}>
            <GlobalStyles />
            <AuthContextProvider>
              {pathname != "/login" ? (
                <Container className={sidebarOpen ? "active" : ""}>
                  <div className="ContentSidebar">
                    <Sidebar state={sidebarOpen} setState={() => setSidebarOpen(!sidebarOpen)} />
                  </div>
                  <div className="ContentMenuambur">
                    <Menuambur />
                  </div>

                  <Containerbody>
                    <MyRoutes isLoading={isLoading} />
                  </Containerbody>
                </Container>
              ) : (
                <Login />
              )}
            </AuthContextProvider>
          </ThemeProvider>
        </LoadingProvider>
      </ThemeContext.Provider>
    </>
  );
}
const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  background: ${({ theme }) => theme.bgtotal};
  transition: all 0.2s ease-in-out;

  .ContentSidebar {
    display: none;
  }
  .ContentMenuambur {
    display: block;
    position: absolute;
    left: 20px;
  }
  @media ${Device.tablet} {
    grid-template-columns: 65px 1fr;
    &.active {
      grid-template-columns: 220px 1fr;
    }
    .ContentSidebar {
      display: initial;
    }
    .ContentMenuambur {
      display: none;
    }
  }
`;
const Containerbody = styled.div`
  grid-column: 1;
  width: 100%;
  @media ${Device.tablet} {
    grid-column: 2;
  }
`;
export default App;
