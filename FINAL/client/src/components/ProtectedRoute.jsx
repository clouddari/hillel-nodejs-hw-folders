import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useContext } from "react";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
