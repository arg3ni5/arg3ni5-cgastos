import { Navigate, Outlet } from "react-router-dom";
import { ReactNode } from "react";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";

interface ProtectedRouteProps {
  user: unknown;
  isLoading: boolean;
  redirectTo: string;
  children?: ReactNode;
}

export const ProtectedRoute = ({ user, redirectTo, children, isLoading = true }: ProtectedRouteProps) => {
  if (isLoading) return <SpinnerLoader/>;

  if (user == null) return <Navigate replace to={redirectTo} />;
  return children ? <>{children}</> : <Outlet />;
};
