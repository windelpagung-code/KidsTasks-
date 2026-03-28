"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api, { clearTokens } from "@/lib/api";
import { useUser, isAdmin } from "@/lib/useUser";

const allNav = [
  { href: "/dashboard",            label: "Início",         icon: "🏠", roles: ["admin", "editor", "viewer"] },
  { href: "/dashboard/tasks",      label: "Tarefas",        icon: "📋", roles: ["admin", "editor", "viewer"] },
  { href: "/dashboard/children",   label: "Filhos",         icon: "👧", roles: ["admin", "editor", "viewer"] },
  { href: "/dashboard/approvals",  label: "Aprovações",     icon: "✅", roles: ["admin", "editor", "viewer"] },
  { href: "/dashboard/wallet",     label: "Carteira",       icon: "💰", roles: ["admin", "editor", "viewer"] },
  { href: "/dashboard/store",      label: "Loja",           icon: "🛍️", roles: ["admin", "editor", "viewer"] },
  { href: "/dashboard/settings",   label: "Configurações",  icon: "⚙️", roles: ["admin", "editor", "viewer"] },
  { href: "/dashboard/billing",    label: "Planos",         icon: "💳", roles: ["admin"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const role = user?.role || "viewer";
  const nav = allNav.filter((item) => item.roles.includes(role));
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    api.get("/stripe/subscription")
      .then((r) => { if (r.data.status === "suspended") setSuspended(true); })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await api.post("/auth/logout").catch(() => {});
    clearTokens();
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header
        className="text-white px-6 py-3.5 flex justify-between items-center shadow-lg flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1e1250 50%, #3b1f7a 100%)" }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 glass rounded-xl flex items-center justify-center text-base">
            🎯
          </div>
          <span className="font-extrabold text-base tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
            KidsTasks
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user?.email && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                {user.email[0]?.toUpperCase()}
              </div>
              <span className="text-white/60 text-xs">{user.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white/90 text-xs font-medium transition px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="w-56 bg-white border-r border-gray-100 hidden md:flex flex-col py-5 flex-shrink-0 shadow-sm">
          <nav className="flex-1 px-3 space-y-0.5">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-violet-50 text-violet-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-lg transition-transform ${active ? "scale-110" : ""}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="px-3 mt-4 pt-4 border-t border-gray-100">
            <div className="glass-dark rounded-xl p-3"
              style={{ background: "linear-gradient(135deg, #0f0a1e, #3b1f7a)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider mb-1">KidsTasks</p>
              <p className="text-white text-xs font-semibold">Gamificação para famílias</p>
            </div>
          </div>
        </aside>

        {/* ── Main content ────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
          {suspended && pathname !== "/dashboard/billing" && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-red-700 text-sm">Conta suspensa por falta de pagamento</p>
                <p className="text-red-500 text-xs mt-0.5">Regularize para continuar usando todos os recursos.</p>
              </div>
              <Link href="/dashboard/billing"
                className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-700 transition whitespace-nowrap">
                Regularizar
              </Link>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ───────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-40">
        <div className="flex overflow-x-auto no-scrollbar py-1 px-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 flex-shrink-0 px-3 py-1.5 rounded-xl transition-all text-center min-w-[60px] ${
                  active ? "text-violet-600" : "text-gray-400"
                }`}
              >
                <span className={`text-xl transition-transform ${active ? "scale-110" : ""}`}>{item.icon}</span>
                <span className="text-[9px] font-semibold leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
