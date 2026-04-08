"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { addItemToCart, checkoutCart, fetchCart, removeCartItem, updateCartItem } from "@/lib/cartApi";

const CartContext = createContext(null);

function emptyCart() {
  return {
    items: [],
    summary: {
      itemCount: 0,
      subtotal: 0,
    },
  };
}

export default function CartProvider({ children }) {
  const { status } = useAuth();
  const [cart, setCart] = useState(emptyCart());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      if (status !== "authenticated") {
        setCart(emptyCart());
        return;
      }

      setLoading(true);
      try {
        const payload = await fetchCart();
        if (!isActive) {
          return;
        }
        setCart(payload?.data || emptyCart());
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error?.status === 401 || error?.status === 403) {
          setCart(emptyCart());
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [status]);

  async function refreshCart() {
    if (status !== "authenticated") {
      setCart(emptyCart());
      return emptyCart();
    }

    const payload = await fetchCart();
    const nextCart = payload?.data || emptyCart();
    setCart(nextCart);
    return nextCart;
  }

  async function addToCart(input) {
    const payload = await addItemToCart(input);
    const nextCart = payload?.data || emptyCart();
    setCart(nextCart);
    return nextCart;
  }

  async function setQuantity(productId, quantity) {
    const payload = await updateCartItem(productId, quantity);
    const nextCart = payload?.data || emptyCart();
    setCart(nextCart);
    return nextCart;
  }

  async function removeFromCart(productId) {
    const payload = await removeCartItem(productId);
    const nextCart = payload?.data || emptyCart();
    setCart(nextCart);
    return nextCart;
  }

  async function checkout() {
    const payload = await checkoutCart();
    setCart(emptyCart());
    return payload;
  }

  const value = useMemo(
    () => ({
      cart,
      loading,
      refreshCart,
      addToCart,
      setQuantity,
      removeFromCart,
      checkout,
    }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
