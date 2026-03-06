import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

// Helper: build headers with Bearer token when available
const authHeaders = (extra = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Restore user from localStorage instantly — no loading spinner on refresh
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      return saved && token ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Sync user → localStorage (never touches token — token only cleared explicitly)
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Background validation: if server says token is invalid, clear session silently
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // nothing to validate

    const controller = new AbortController();
    fetch(`${API_BASE}/api/auth/user`, {
      credentials: 'include',
      headers: authHeaders(),
      signal: controller.signal,
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          // Token is definitively invalid — clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        } else if (res.ok) {
          // Optionally refresh user data from server
          return res.json().then((fresh) => setUser(fresh));
        }
        // On other errors (500, network), do nothing — keep cached session
      })
      .catch(() => {
        // Network error / abort — keep user logged in
      });

    return () => controller.abort();
  }, []);

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders()
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('mcd_cart');
      setUser(null);
      setLoading(false);
      navigate('/');
    }
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/auth/update-profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: authHeaders(),
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setUser(prevUser => ({
        ...prevUser,
        ...data.user
      }));

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;