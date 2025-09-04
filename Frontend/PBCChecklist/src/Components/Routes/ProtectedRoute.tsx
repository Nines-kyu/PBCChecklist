import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../Services/Auth";
import type { JSX } from "react";

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
