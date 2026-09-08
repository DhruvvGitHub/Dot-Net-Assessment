import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  approveRegistration,
  getPendingRegistrations,
  getRegistrations,
  rejectRegistration,
} from '../../api/client';

const FILTERS = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'ALL', label: 'All' },
];

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

function statusBadge(status) {
  const key = String(status || '').toUpperCase();
  const styles = {
    PENDING: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${styles[key] || 'bg-slate-100 text-slate-700'}`}>
      {key || '—'}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { credentials, logout } = useAdminAuth();
  const [filter, setFilter] = useState('PENDING');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectFieldError, setRejectFieldError] = useState('');

  const handleUnauthorized = useCallback(() => {
    logout('Invalid credentials');
    navigate('/admin', { replace: true });
  }, [logout, navigate]);

  const loadRows = useCallback(async () => {
    if (!credentials) return;
    setLoading(true);
    setListError('');
    setActionError('');

    try {
      const response =
        filter === 'PENDING'
          ? await getPendingRegistrations(credentials)
          : await getRegistrations(credentials, filter === 'ALL' ? undefined : filter);

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        setListError(response.data?.message || 'Failed to load registrations.');
        setRows([]);
        return;
      }

      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.content)
          ? response.data.content
          : Array.isArray(response.data?.registrations)
            ? response.data.registrations
            : [];

      setRows(list);
    } catch {
      setListError('Unable to reach the server. Please ensure the API is running.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [credentials, filter, handleUnauthorized]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const onApprove = async (id) => {
    setActionError('');
    setActionLoadingId(id);
    try {
      const { ok, status, data } = await approveRegistration(id, credentials);

      if (status === 401) {
        handleUnauthorized();
        return;
      }

      if (status === 409) {
        setActionError(data?.message || 'This registration was already reviewed. Refreshing list…');
        await loadRows();
        return;
      }

      if (!ok) {
        setActionError(data?.message || 'Approve failed.');
        return;
      }

      if (filter === 'PENDING') {
        setRows((prev) => prev.filter((row) => row.id !== id));
      } else {
        await loadRows();
      }
    } catch {
      setActionError('Unable to reach the server.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openReject = (row) => {
    setRejectTarget(row);
    setRejectReason('');
    setRejectFieldError('');
    setActionError('');
  };

  const closeReject = () => {
    if (actionLoadingId) return;
    setRejectTarget(null);
    setRejectReason('');
    setRejectFieldError('');
  };

  const onRejectConfirm = async () => {
    const reason = rejectReason.trim();
    if (!reason) {
      setRejectFieldError('Rejection reason is required.');
      return;
    }

    const id = rejectTarget.id;
    setActionLoadingId(id);
    setRejectFieldError('');

    try {
      const { ok, status, data } = await rejectRegistration(id, reason, credentials);

      if (status === 401) {
        handleUnauthorized();
        return;
      }

      if (status === 409) {
        setActionError(data?.message || 'This registration was already reviewed. Refreshing list…');
        setRejectTarget(null);
        await loadRows();
        return;
      }

      if (!ok) {
        setRejectFieldError(data?.message || 'Reject failed.');
        return;
      }

      setRejectTarget(null);
      if (filter === 'PENDING') {
        setRows((prev) => prev.filter((row) => row.id !== id));
      } else {
        await loadRows();
      }
    } catch {
      setRejectFieldError('Unable to reach the server.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-slate-300">Admin Portal</p>
            <h1 className="text-lg font-semibold">Registration Review Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/register" className="text-slate-200 hover:text-white underline-offset-2 hover:underline">
              Public form
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/admin', { replace: true });
              }}
              className="px-3 py-1.5 rounded border border-slate-500 text-slate-100 hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
                  filter === item.key
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={loadRows}
            className="self-start px-3 py-1.5 rounded-md text-sm border border-slate-300 bg-white hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {actionError && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
            {actionError}
          </div>
        )}
        {listError && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-800">
            {listError}
          </div>
        )}

        <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Age</th>
                  <th className="px-4 py-3 font-semibold">Aadhar</th>
                  <th className="px-4 py-3 font-semibold">Mobile</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                      Loading registrations…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                      No registrations found for this filter.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const busy = actionLoadingId === row.id;
                    const isPending = String(row.status || 'PENDING').toUpperCase() === 'PENDING';
                    return (
                      <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{row.name}</td>
                        <td className="px-4 py-3">{row.age}</td>
                        <td className="px-4 py-3 font-mono text-xs">{row.aadharMasked || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{row.mobile}</td>
                        <td className="px-4 py-3">{row.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                        <td className="px-4 py-3">{statusBadge(row.status || 'PENDING')}</td>
                        <td className="px-4 py-3">
                          {isPending ? (
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => onApprove(row.id)}
                                className={`px-2.5 py-1 rounded text-xs font-semibold text-white ${
                                  busy ? 'bg-emerald-300 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800'
                                }`}
                              >
                                {busy ? '…' : 'Approve'}
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => openReject(row)}
                                className={`px-2.5 py-1 rounded text-xs font-semibold text-white ${
                                  busy ? 'bg-red-300 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'
                                }`}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="w-full max-w-md rounded-lg bg-white border border-slate-200 shadow-xl p-5">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Reject registration</h3>
            <p className="text-sm text-slate-500 mb-4">
              Provide a reason for rejecting <span className="font-medium text-slate-800">{rejectTarget.name}</span>.
            </p>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Rejection reason</label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-600"
              placeholder="Enter rejection reason"
            />
            {rejectFieldError && (
              <p className="mt-1.5 text-xs text-red-600">{rejectFieldError}</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeReject}
                disabled={Boolean(actionLoadingId)}
                className="px-3 py-2 rounded-md text-sm border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onRejectConfirm}
                disabled={Boolean(actionLoadingId)}
                className={`px-3 py-2 rounded-md text-sm font-semibold text-white ${
                  actionLoadingId ? 'bg-red-300 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                {actionLoadingId ? 'Rejecting…' : 'Confirm reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
