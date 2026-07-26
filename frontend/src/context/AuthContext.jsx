import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cp_token') || null);
  const [loading, setLoading] = useState(true); // checking stored token on mount

  // ── Verify stored token on mount ────────────────────────────────────────────
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token invalid/expired — clear it
          localStorage.removeItem('cp_token');
          setToken(null);
          setUser(null);
        }
      } catch {
        // Network error — keep token, might recover
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []); // run only once on mount

  // ── Persist token to localStorage whenever it changes ───────────────────────
  useEffect(() => {
    if (token) {
      localStorage.setItem('cp_token', token);
    } else {
      localStorage.removeItem('cp_token');
    }
  }, [token]);

  // ── register ─────────────────────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, password }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  // ── login ────────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {}
    setToken(null);
    setUser(null);
  }, [token]);

  // ── loginWithToken (used by OAuth callback) ──────────────────────────────────
  const loginWithToken = useCallback(async (rawToken) => {
    setToken(rawToken);
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${rawToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (_) {}
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    loginWithToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
