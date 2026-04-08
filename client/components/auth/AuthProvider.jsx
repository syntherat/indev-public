"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, logout as logoutRequest } from "@/lib/authApi";

const AUTH_STORAGE_KEY = "indev.user";

const AuthContext = createContext(null);

function readStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function storeUser(user) {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const cachedUser = readStoredUser();

    if (cachedUser) {
      setUser(cachedUser);
      setStatus("authenticated");
    }

    let isActive = true;

    const validateSession = async () => {
      try {
        const payload = await fetchCurrentUser();

        if (!isActive) {
          return;
        }

        if (payload?.data) {
          setUser(payload.data);
          setStatus("authenticated");
          storeUser(payload.data);
          return;
        }

        setUser(null);
        setStatus("anonymous");
        storeUser(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error?.status === 401 || error?.status === 403) {
          setUser(null);
          setStatus("anonymous");
          storeUser(null);
          return;
        }

        if (cachedUser) {
          setUser(cachedUser);
          setStatus("authenticated");
          return;
        }

        setStatus("anonymous");
      }
    };

    validateSession();

    return () => {
      isActive = false;
    };
  }, []);

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setStatus("anonymous");
      storeUser(null);
    }
  }

  return <AuthContext.Provider value={{ user, status, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}