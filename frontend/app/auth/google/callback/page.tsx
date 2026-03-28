"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveTokens } from "@/lib/api";

function GoogleCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken);
      router.replace("/dashboard");
    } else {
      router.replace("/login?error=google");
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0f0a1e, #3b1f7a)" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="text-4xl mb-3 animate-spin">⚙️</div>
        <p className="text-gray-600">Autenticando com Google...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f0a1e, #3b1f7a)" }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-4xl mb-3 animate-spin">⚙️</div>
          <p className="text-gray-600">Autenticando com Google...</p>
        </div>
      </div>
    }>
      <GoogleCallback />
    </Suspense>
  );
}
