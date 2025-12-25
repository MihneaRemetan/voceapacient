import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { authApi, User } from '../services/api';

/* =========================
   TYPES
========================= */

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name?: string,
    county?: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

/* =========================
   CONTEXT
========================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =========================
   PROVIDER
========================= */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     CHECK AUTH ON START
  ========================= */

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('checkAuth failed', error);
      // NU ștergem tokenul aici (evităm logout accidental)
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOGIN
  ========================= */

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });

    // 🔴 LINIA CARE CONTEAZĂ
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
  };

  /* =========================
     REGISTER
  ========================= */

  const register = async (
    email: string,
    password: string,
    name?: string,
    county?: string
  ) => {
    const response = await authApi.register({
      email,
      password,
      name,
      county,
    });

    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /* =========================
     UPDATE USER
  ========================= */

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  /* =========================
     PROVIDER VALUE
  ========================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
