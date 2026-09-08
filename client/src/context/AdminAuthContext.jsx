import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [credentials, setCredentials] = useState(null);
  const [authError, setAuthError] = useState('');

  const login = useCallback((username, password) => {
    setCredentials({ username, password });
    setAuthError('');
  }, []);

  const logout = useCallback((message = '') => {
    setCredentials(null);
    setAuthError(message);
  }, []);

  const value = useMemo(
    () => ({
      credentials,
      isAuthenticated: Boolean(credentials),
      authError,
      setAuthError,
      login,
      logout,
    }),
    [credentials, authError, login, logout]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
