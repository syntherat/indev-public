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

export function fetchProductReviews(slug) {
  return requestJson(`/api/products/${encodeURIComponent(String(slug || "").trim())}/reviews`);
}

export function createProductReview(body) {
  return requestJson("/api/reviews", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
