"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setSent(true);
      if (data._devLink) setDevLink(data._devLink);
    } catch {
      setError("Erro ao processar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="text-2xl font-bold text-gray-800">Esqueceu a senha?</h1>
          <p className="text-gray-500 mt-1 text-sm">Informe seu e-mail e enviaremos o link de redefinição</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
              <p className="text-green-700 font-medium">✅ Instruções enviadas!</p>
              <p className="text-green-600 text-sm mt-1">Verifique seu e-mail e siga as instruções para redefinir a senha.</p>
            </div>
            {devLink && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-left">
                <p className="text-xs font-semibold text-yellow-700 mb-1">⚙️ Ambiente de desenvolvimento — link direto:</p>
                <a href={devLink} className="text-xs text-blue-600 underline break-all">{devLink}</a>
              </div>
            )}
            <Link href="/login" className="text-purple-600 font-semibold hover:underline text-sm">
              ← Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="seu@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar link de redefinição"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-5">
              <Link href="/login" className="text-purple-600 font-semibold hover:underline">
                ← Voltar para o login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
