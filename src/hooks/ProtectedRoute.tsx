import { Navigate, Outlet } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  user: unknown;
  redirectTo: string;
  children?: ReactNode;
}

export const ProtectedRoute = ({ user, redirectTo, children }: ProtectedRouteProps) => {
  if (user == null) return <Navigate replace to={redirectTo} />;
  return children ? <>{children}</> : <Outlet />;
};
