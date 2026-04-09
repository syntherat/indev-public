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

export async function fetchCart() {
  return requestJson("/api/cart");
}

export async function addItemToCart({ productId, slug, quantity = 1 }) {
  return requestJson("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, slug, quantity }),
  });
}

export async function updateCartItem(productId, quantity) {
  return requestJson(`/api/cart/items/${encodeURIComponent(productId)}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(productId) {
  return requestJson(`/api/cart/items/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
}

export async function checkoutCart() {
  return requestJson("/api/cart/checkout", {
    method: "POST",
  });
}

export async function verifyCheckout(paymentDetails) {
  return requestJson("/api/cart/checkout/verify", {
    method: "POST",
    body: JSON.stringify(paymentDetails),
  });
}
