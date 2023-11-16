// routes/protectedRoute.tsx
import { useNavigate } from "@remix-run/react";
import React, { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const useAuth = () => {
  const navigate = useNavigate();
  const authToken =
    typeof window !== "undefined" &&
    localStorage.getItem("sb-yrfibbmnmjpkkkiftrux-auth-token") !== null;

  const isAuthenticated = () => {
    return !!authToken; // Convert to boolean for simplicity
  };

  const requireAuth = () => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  };

  return {
    isAuthenticated,
    requireAuth,
  };
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { requireAuth } = useAuth();

  useEffect(() => {
    requireAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  return <>{children}</>;
};

export default ProtectedRoute;
