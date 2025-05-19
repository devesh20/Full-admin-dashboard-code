import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner/>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
