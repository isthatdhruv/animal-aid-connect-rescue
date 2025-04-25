
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userType: "ngo" | "admin" | null;
  login: (userData: User, type: "ngo" | "admin") => void;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  name?: string;
  status?: string;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<"ngo" | "admin" | null>(null);

  useEffect(() => {
    // Check local storage for saved session on initial load
    const savedUser = localStorage.getItem("user");
    const savedUserType = localStorage.getItem("userType");
    
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType as "ngo" | "admin");
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User, type: "ngo" | "admin") => {
    setUser(userData);
    setUserType(type);
    setIsAuthenticated(true);
    
    // Save to local storage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userType", type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    
    // Clear from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
