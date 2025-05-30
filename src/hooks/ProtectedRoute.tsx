import { Navigate, Outlet } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useLoading } from "../context/LoadingContext";

interface ProtectedRouteProps {
  user: unknown;
  isLoading: boolean;
  redirectTo: string;
  children?: ReactNode;
}

export const ProtectedRoute = ({ user, redirectTo, children, isLoading = true }: ProtectedRouteProps) => {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    if (isLoading) setIsLoading(true);
    else setIsLoading(false);
  }, [isLoading])

  //if (!isLoading && user == null) return <Navigate replace to={redirectTo} />;
  return children ? <>{children}</> : <Outlet />;
};