import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "../api/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "nutriscan_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载用户信息
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user to storage:", error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove user from storage:", error);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to update user in storage:", error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
