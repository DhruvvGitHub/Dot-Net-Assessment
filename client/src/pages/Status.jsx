import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getRegistrationStatus } from '../api/client';

const statusStyles = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
};

export default function Status() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const [lookupId, setLookupId] = useState(routeId || '');
  const [loading, setLoading] = useState(Boolean(routeId));
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!routeId) {
      setLoading(false);
      setResult(null);
      setError('');
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      setResult(null);
      try {
        const { ok, status, data } = await getRegistrationStatus(routeId);
        if (cancelled) return;

        if (ok) {
          setResult(data);
        } else if (status === 404) {
          setError(data?.message || 'Registration not found.');
        } else {
          setError(data?.message || 'Unable to fetch registration status.');
        }
      } catch {
        if (!cancelled) {
          setError('Unable to reach the server. Please ensure the API is running.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [routeId]);

  const onLookup = (e) => {
    e.preventDefault();
    const trimmed = lookupId.trim();
    if (!trimmed) {
      setError('Registration ID cannot be empty');
      return;
    }
    navigate(`/status/${trimmed}`);
  };

  const statusKey = result?.status?.toUpperCase?.() || result?.status;
  const badgeClass = statusStyles[statusKey] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white border-b border-slate-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-slate-300">Government Portal</p>
            <h1 className="text-lg font-semibold">Registration Status</h1>
          </div>
          <Link to="/register" className="text-sm text-slate-200 hover:text-white underline-offset-2 hover:underline">
            New registration
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-1">Check my registration status</h2>
          <p className="text-sm text-slate-500 mb-6">
            Enter the Registration ID you received after submitting the form.
          </p>

          <form onSubmit={onLookup} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Registration ID"
              className="flex-1 px-3.5 py-3 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-600"
            />
            <button
              type="submit"
              className="px-4 py-3 rounded-md bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              Check status
            </button>
          </form>

          {loading && (
            <p className="text-sm text-slate-500">Fetching status…</p>
          )}

          {error && !loading && (
            <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-800">
              {error}
            </div>
          )}

          {result && !loading && (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3 text-sm">
              <p>
                <span className="text-slate-500">Registration ID:</span>{' '}
                <span className="font-semibold">{result.id ?? routeId}</span>
              </p>
              <p className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500">Status:</span>
                <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
                  {statusKey}
                </span>
              </p>
              {statusKey === 'REJECTED' && (result.rejectionReason || result.reason) && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-slate-500 mb-1">Rejection reason</p>
                  <p className="text-slate-900">{result.rejectionReason || result.reason}</p>
                </div>
              )}
              {result.message && statusKey === 'PENDING' && (
                <p className="text-slate-600">{result.message}</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
