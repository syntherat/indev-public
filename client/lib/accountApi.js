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

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed");
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
}

export async function fetchAccountProfile() {
  return requestJson("/api/account/profile");
}

export async function updateAccountProfile({ contactNumber, country, postalCode }) {
  return requestJson("/api/account/profile", {
    method: "PATCH",
    body: JSON.stringify({ contactNumber, country, postalCode }),
  });
}

export async function fetchAccountOrders() {
  return requestJson("/api/account/orders");
}

export async function fetchLibraryDownloadUrl(productId) {
  return requestJson(`/api/account/library/${encodeURIComponent(productId)}/download-url`);
}
