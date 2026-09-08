import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { getPendingRegistrations } from '../../api/client';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout, authError, setAuthError } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError('');

    if (!username.trim() || !password) {
      setLocalError('Username and password are required.');
      return;
    }

    setLoading(true);
    const creds = { username: username.trim(), password };

    try {
      const { ok, status, data } = await getPendingRegistrations(creds);

      if (status === 401) {
        logout('Invalid credentials');
        setLocalError('Invalid credentials');
        return;
      }

      if (!ok) {
        setLocalError(data?.message || 'Unable to sign in. Please try again.');
        return;
      }

      login(creds.username, creds.password);
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setLocalError('Unable to reach the server. Please ensure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  const errorMessage = localError || authError;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white border-b border-slate-700">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-slate-300">Admin Portal</p>
            <h1 className="text-lg font-semibold">Land Record Review</h1>
          </div>
          <Link to="/register" className="text-sm text-slate-200 hover:text-white underline-offset-2 hover:underline">
            Public register
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-1">Administrator sign in</h2>
          <p className="text-sm text-slate-500 mb-6">
            Credentials are kept in memory for this session only and are not stored in the browser.
          </p>

          {errorMessage && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-600"
                placeholder="Admin username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-600"
                placeholder="Admin password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md text-sm font-semibold text-white ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
