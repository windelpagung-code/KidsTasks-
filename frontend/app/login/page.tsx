"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api, { saveTokens } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      saveTokens(data.accessToken, data.refreshToken);
      router.push(data.mustChangePassword ? "/change-password" : "/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL — Brand ──────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[58%] relative overflow-hidden p-12"
        style={{ background: "linear-gradient(150deg, #0f0a1e 0%, #1e1250 35%, #3b1f7a 70%, #4c1d95 100%)" }}
      >
        {/* Orb decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full animate-float-slow"
            style={{ background: "radial-gradient(circle at center, rgba(139,92,246,0.25), transparent 70%)" }}
          />
          <div
            className="absolute top-[40%] -right-32 w-96 h-96 rounded-full animate-float"
            style={{ background: "radial-gradient(circle at center, rgba(192,132,252,0.2), transparent 70%)" }}
          />
          <div
            className="absolute -bottom-24 left-[20%] w-[420px] h-[420px] rounded-full"
            style={{ background: "radial-gradient(circle at center, rgba(99,102,241,0.2), transparent 70%)" }}
          />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
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

        {/* Main content */}
        <div className="relative z-10 flex flex-col justify-center flex-1 py-10">
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span className="text-white/85 text-sm font-medium">+12.847 famílias transformadas</span>
          </div>

          <h2
            className="text-5xl xl:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Seu filho vai{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #fbbf24, #f472b6, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              adorar fazer tarefas.
            </span>
            <br />
            Você vai adorar
            <br />
            os resultados.
          </h2>

          <p className="text-white/55 text-lg leading-relaxed max-w-md mb-10">
            Gamificação + mesada automática + recompensas reais. Crianças mais responsáveis em 30 dias — ou seu dinheiro de volta.
          </p>

          {/* Mini stats */}
          <div className="flex gap-8">
            {[
              { value: "94%", label: "aprovação dos pais" },
              { value: "30d", label: "para ver resultado" },
              { value: "R$0", label: "para começar" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-jakarta)" }}>
                  {s.value}
                </div>
                <div className="text-white/45 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 glass rounded-2xl p-6">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-white/75 text-sm leading-relaxed mb-4 italic">
            "Em 2 semanas meu filho começou a pedir para fazer tarefas. Nunca pensei que seria possível. O KidsTasks mudou nossa rotina — e a relação com meu filho."
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
            >
              A
            </div>
            <div>
              <div className="text-white text-sm font-semibold">Ana Paula M.</div>
              <div className="text-white/40 text-xs">Mãe de 2 filhos · São Paulo, SP</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ──────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center bg-white px-8 sm:px-14 lg:px-16">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <span className="text-2xl">🎯</span>
          <span className="font-bold text-xl text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>
            KidsTasks
          </span>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <div className="mb-8">
            <h1
              className="text-3xl font-extrabold text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Bem-vindo de volta
            </h1>
            <p className="text-gray-500 text-sm">
              Entre na sua conta e acompanhe as missões da família
            </p>
          </div>

          {searchParams.get("reset") === "ok" && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
              <span>✅</span>
              <span>Senha redefinida com sucesso!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Senha</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium transition"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Entrar na minha conta →"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-400 text-xs">ou continue com</span>
            </div>
          </div>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Entrar com Google
          </a>

          <p className="text-center text-gray-400 text-xs mt-6">
            Não tem conta?{" "}
            <Link href="/register" className="text-violet-600 font-semibold hover:text-violet-700 transition">
              Criar conta grátis
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
            {["🔒 SSL Seguro", "🇧🇷 Dados no Brasil", "✅ LGPD"].map((b) => (
              <span key={b} className="text-gray-400 text-[10px]">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(150deg, #0f0a1e, #3b1f7a)" }}>
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
