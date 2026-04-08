const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function fetchCurrentUser() {
  return requestJson("/api/auth/me");
}

export async function logout() {
  return requestJson("/api/auth/logout", {
    method: "POST",
  });
}

export function getAuthBaseUrl() {
  return API_BASE_URL;
}