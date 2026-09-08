import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // No token → login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction
  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;