"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { saveTokens } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", familyName: "", email: "", password: "", lgpdConsent: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.lgpdConsent) { setError("Você precisa aceitar os termos para continuar"); return; }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      saveTokens(data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT — Brand panel ──────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12"
        style={{ background: "linear-gradient(150deg, #0f0a1e 0%, #1e1250 35%, #3b1f7a 70%, #4c1d95 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-[5%] w-[500px] h-[500px] rounded-full animate-float-slow"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)" }} />
          <div className="absolute bottom-0 right-[10%] w-80 h-80 rounded-full animate-float"
            style={{ background: "radial-gradient(circle, rgba(192,132,252,0.18), transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
            <span className="text-xl">🎯</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
            KidsTasks
          </span>
        </div>

        {/* Value props */}
        <div className="relative z-10 flex flex-col justify-center flex-1 py-10">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] mb-8"
            style={{ fontFamily: "var(--font-jakarta)" }}>
            Crie sua família<br />
            <span style={{
              background: "linear-gradient(90deg, #fbbf24, #f472b6, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              em menos de 2 minutos.
            </span>
          </h2>

          <div className="space-y-4">
            {[
              { icon: "🎮", title: "Gamificação real", desc: "XP, níveis, badges — a lógica dos jogos aplicada às tarefas da casa" },
              { icon: "💰", title: "Mesada automática", desc: "Calculada com base nas tarefas concluídas. Zero discussão." },
              { icon: "🛍️", title: "Loja de recompensas", desc: "Seu filho troca pontos por recompensas que você define." },
            ].map((v) => (
              <div key={v.title} className="flex gap-4 glass rounded-2xl p-4">
                <span className="text-2xl flex-shrink-0">{v.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{v.title}</div>
                  <div className="text-white/50 text-xs mt-0.5">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: "Grátis", label: "para começar" },
            { value: "30d", label: "garantia" },
            { value: "12k+", label: "famílias" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Form ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center bg-white px-8 sm:px-12 lg:px-14 py-10">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <span className="text-2xl">🎯</span>
          <span className="font-bold text-xl text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>KidsTasks</span>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <div className="mb-7">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
              Criar conta grátis
            </h1>
            <p className="text-gray-500 text-sm">Sem cartão de crédito. Cancele quando quiser.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Seu nome</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="Ana Silva" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome da família</label>
                <input type="text" required value={form.familyName}
                  onChange={(e) => setForm({ ...form, familyName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="Família Silva" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Senha</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder="Mínimo 8 caracteres, 1 maiúscula e 1 número" />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" checked={form.lgpdConsent}
                  onChange={(e) => setForm({ ...form, lgpdConsent: e.target.checked })}
                  className="sr-only" />
                <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition ${form.lgpdConsent ? "bg-violet-600 border-violet-600" : "border-gray-300 bg-white group-hover:border-violet-400"}`}>
                  {form.lgpdConsent && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 leading-relaxed">
                Concordo com os{" "}
                <span className="text-violet-600 font-semibold">Termos de Uso</span>{" "}
                e autorizo o tratamento dos meus dados conforme a LGPD.
              </span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-gray-900 text-sm transition-all disabled:opacity-60 active:scale-[0.98] shadow-md"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Criando sua família...
                </span>
              ) : "🚀 Criar conta grátis"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-400 text-xs">ou cadastre-se com</span>
            </div>
          </div>

          <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition">
            <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuar com Google
          </a>

          <p className="text-center text-gray-400 text-xs mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-700 transition">Entrar</Link>
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-gray-100">
            {["🔒 SSL Seguro", "🇧🇷 Dados no Brasil", "✅ LGPD"].map((b) => (
              <span key={b} className="text-gray-400 text-[10px]">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
