import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type UserRole = 'customer' | 'vendor' | 'retailer' | 'wholesaler' | 'delivery_driver' | 'admin';

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  isEmailVerified: boolean;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IAuthContext {
  user: IUser | null;
  tokens: IAuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (data: any) => Promise<void>;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  googleLogin: (credential: string, role: UserRole) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setTokens: (tokens: IAuthTokens) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [tokens, setTokens] = useState<IAuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session on mount
  useEffect(() => {
    const savedTokens = localStorage.getItem('instacart_tokens');
    const savedUser = localStorage.getItem('instacart_user');
    if (savedTokens && savedUser) {
      try {
        setTokens(JSON.parse(savedTokens));
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('instacart_tokens');
        localStorage.removeItem('instacart_user');
      }
    }
    setIsLoading(false);
  }, []);

  const saveSession = (userData: IUser, tokenData: IAuthTokens) => {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('instacart_user', JSON.stringify(userData));
    localStorage.setItem('instacart_tokens', JSON.stringify(tokenData));
  };

  const clearSession = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('instacart_user');
    localStorage.removeItem('instacart_tokens');
  };

  const register = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Registration failed.');
    }
    return response.json();
  };

  const login = async (email: string, password: string, role: UserRole) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Login failed.');
    }
    const result = await response.json();
    if (result.user && result.tokens) {
      saveSession(result.user, result.tokens);
    }
    return result;
  };

  const googleLogin = async (credential: string, role: UserRole) => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, role }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Google login failed.');
    }
    const result = await response.json();
    if (result.user && result.tokens) {
      saveSession(result.user, result.tokens);
    }
    return result;
  };

  const logout = useCallback(() => {
    if (tokens?.refreshToken) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      }).catch(() => {});
    }
    clearSession();
  }, [tokens]);

  const refreshToken = async () => {
    if (!tokens?.refreshToken) {
      clearSession();
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });
      if (!response.ok) throw new Error('Refresh failed.');
      const result = await response.json();
      if (result.tokens) {
        setTokens(result.tokens);
        const currentUser = user;
        if (currentUser) {
          localStorage.setItem('instacart_tokens', JSON.stringify(result.tokens));
        }
      }
    } catch {
      clearSession();
    }
  };

  const isAuthenticated = !!user && !!tokens;

  return (
    <AuthContext.Provider value={{
      user,
      tokens,
      isLoading,
      isAuthenticated,
      register,
      login,
      googleLogin,
      logout,
      refreshToken,
      setTokens,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
};
