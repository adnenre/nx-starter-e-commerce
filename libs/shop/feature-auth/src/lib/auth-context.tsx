import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RegisterData } from '@org/models';
import api from './api-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async (data: RegisterData) => {
    const res = await api.post('/api/auth/register', data);
    setUser(res.data.data.user);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    setUser(res.data.data.user);
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
