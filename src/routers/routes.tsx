import { Routes, Route } from "react-router-dom";
import { Login, Home, ProtectedRoute, Configuracion, Categorias, Movimientos, Informes, Vincular, Conexiones, useUserAuth } from "../index";
export function MyRoutes() {
  const { user } = useUserAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute user={user} redirectTo="/login" />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/conexiones" element={<Conexiones />} />
        <Route path="/vincular" element={<Vincular />} />
        <Route path="/configurar" element={<Configuracion />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/informes" element={<Informes />} />
        <Route path="/acercade" element={<Home />} />
      </Route>
    </Routes>
  );
}
