export async function apiPost(path: string, body: unknown, token?: string) {
  return request(path, { method: "POST", body: JSON.stringify(body) }, token);
}

export async function apiGet(path: string, token?: string) {
  return request(path, { method: "GET" }, token);
}

async function request(path: string, init: RequestInit, token?: string) {
  const base = (process.env.API_URL || "http://localhost:8080").replace(/\/$/, "");
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: response.ok, status: response.status, data };
}
