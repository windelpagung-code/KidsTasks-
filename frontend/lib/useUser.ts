import { useMemo } from "react";

interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  role: "admin" | "editor" | "viewer";
  exp: number;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function useUser() {
  return useMemo(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    const payload = decodeJwt(token);
    if (!payload) return null;
    return payload;
  }, []);
}

export function isAdmin(role?: string | null) {
  return role === "admin";
}

export function canEdit(role?: string | null) {
  return role === "admin" || role === "editor";
}
