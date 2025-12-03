import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextDefinition";

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user.rol !== "ADMIN") {
    return <Navigate to="/home-seller" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
