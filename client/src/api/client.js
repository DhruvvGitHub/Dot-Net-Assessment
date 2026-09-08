const BASE_URL = 'http://localhost:8080';

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

/**
 * Central API client for public + admin endpoints.
 * @param {string} path - e.g. "/api/register"
 * @param {{ method?: string, body?: unknown, basicAuth?: { username: string, password: string } }} options
 */
export async function apiRequest(path, { method = 'GET', body, basicAuth } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (basicAuth?.username != null && basicAuth?.password != null) {
    headers.Authorization = `Basic ${btoa(`${basicAuth.username}:${basicAuth.password}`)}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await parseBody(response);

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export function registerApplicant(payload) {
  return apiRequest('/api/register', { method: 'POST', body: payload });
}

export function getRegistrationStatus(id) {
  return apiRequest(`/api/register/${id}/status`);
}

export function getPendingRegistrations(basicAuth) {
  return apiRequest('/api/admin/registrations/pending', { basicAuth });
}

export function getRegistrations(basicAuth, status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiRequest(`/api/admin/registrations${query}`, { basicAuth });
}

export function approveRegistration(id, basicAuth) {
  return apiRequest(`/api/admin/registrations/${id}/approve`, {
    method: 'POST',
    basicAuth,
  });
}

export function rejectRegistration(id, reason, basicAuth) {
  return apiRequest(`/api/admin/registrations/${id}/reject`, {
    method: 'POST',
    body: { reason },
    basicAuth,
  });
}
