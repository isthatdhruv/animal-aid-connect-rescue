
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "ngo" | "admin";
}

const ProtectedRoute = ({ 
  children, 
  requiredUserType 
}: ProtectedRouteProps) => {
  const { isAuthenticated, userType } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to appropriate login page based on required user type
    if (requiredUserType === "admin") {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/ngo/auth" replace />;
  }
  
  // If specific user type is required, check for it
  if (requiredUserType && userType !== requiredUserType) {
    if (requiredUserType === "admin") {
      return <Navigate to="/admin/login" replace />;
    } else if (requiredUserType === "ngo") {
      return <Navigate to="/ngo/auth" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
