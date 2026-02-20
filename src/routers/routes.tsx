import { Routes, Route } from "react-router-dom";
import { Login, Home, ProtectedRoute, Configuracion, Categorias, Movimientos, Informes, Vincular, Conexiones, useUserAuth, Dashboard } from "../index";
import { Cuentas } from '../pages/Cuentas';
import AuthCallback from "../pages/AuthCallback";
interface ProtectedRouteProps {
  isLoading: boolean;
}

export const MyRoutes = ({ isLoading }: ProtectedRouteProps) => {
  const { user } = useUserAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute user={user} redirectTo="/" isLoading={isLoading} />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cuentas" element={<Cuentas />} />
        <Route path="/conexiones" element={<Conexiones />} />
        <Route path="/vincular" element={<Vincular />} />
        <Route path="/configurar" element={<Configuracion />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/informes" element={<Informes />} />
        <Route path="/acercade" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Route>
    </Routes>
  );
}
