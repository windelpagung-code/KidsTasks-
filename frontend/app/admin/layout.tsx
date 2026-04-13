"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api, { clearTokens } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.get("/admin/metrics")
      .then(() => setChecking(false))
      .catch((err) => {
        if (err?.response?.status === 401) router.replace("/login?next=/admin");
        else if (err?.response?.status === 403) router.replace("/dashboard");
        else setChecking(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await api.post("/auth/logout").catch(() => {});
    clearTokens();
    router.push("/login");
  }

  if (checking) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-slate-500 text-sm">Verificando acesso...</p>
      </div>
    </div>
  );

  const nav = [
    { href: "/admin",             label: "Dashboard" },
    { href: "/admin/users",       label: "Usuários" },
    { href: "/admin/financeiro",  label: "Financeiro" },
    { href: "/admin/engajamento", label: "Engajamento" },
    { href: "/admin/marketing",   label: "Marketing" },
    { href: "/admin/suporte",     label: "Suporte" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="text-violet-400 font-bold text-sm">⚡</span>
              <span className="text-slate-200 font-semibold text-sm">Admin</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <nav className="flex gap-0.5">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? "bg-violet-600 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/dashboard"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all">
              ← Sistema
            </Link>
            <button onClick={handleLogout}
              className="text-xs text-slate-600 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all">
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
