"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: string;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
  email: string | null;
  userName: string | null;
  lastLoginAt: string | null;
  childrenCount: number;
}

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  free:    { label: "Freemium", cls: "bg-slate-700 text-slate-300 border-slate-600" },
  monthly: { label: "Mensal",   cls: "bg-violet-500/15 text-violet-300 border-violet-500/25" },
  annual:  { label: "Anual",    cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" },
};

const SUB_INFO: Record<string, { label: string; cls: string }> = {
  active:        { label: "Ativa",     cls: "text-emerald-400" },
  trialing:      { label: "Trial",     cls: "text-blue-400" },
  past_due:      { label: "Pendente",  cls: "text-amber-400" },
  canceled:      { label: "Cancelada", cls: "text-slate-500" },
  cancelled:     { label: "Cancelada", cls: "text-slate-500" },
  suspended:     { label: "Suspensa",  cls: "text-red-400" },
  active_tenant: { label: "Ativa",     cls: "text-emerald-400" },
};

function fmtDate(iso: string | null | undefined, short = false) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", short
      ? { day: "2-digit", month: "short" }
      : { day: "2-digit", month: "short", year: "numeric" });
  } catch { return "—"; }
}

function fmtRelative(iso: string | null | undefined): { text: string; recent: boolean } | null {
  if (!iso) return null;
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 2)   return { text: "agora",            recent: true };
    if (mins < 60)  return { text: `${mins}min atrás`, recent: true };
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return { text: `${hrs}h atrás`,    recent: true };
    const days = Math.floor(hrs / 24);
    const recent = days < 7;
    if (days < 30)  return { text: `${days}d atrás`,   recent };
    return { text: fmtDate(iso, true), recent: false };
  } catch { return null; }
}

function statusOf(t: Tenant) {
  const key = t.subscriptionStatus ?? (t.status === "suspended" ? "suspended" : "active_tenant");
  return SUB_INFO[key] ?? { label: String(key), cls: "text-slate-400" };
}

function planOf(t: Tenant) {
  return PLAN_BADGE[t.plan] ?? PLAN_BADGE.free;
}

export default function AdminUsersPage() {
  const [tenants, setTenants]     = useState<Tenant[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);
  const [plan, setPlan]           = useState("");
  const [search, setSearch]       = useState("");
  const [inputVal, setInputVal]   = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [acting, setActing]       = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    const q = new URLSearchParams({ page: String(page), limit: "20" });
    if (plan)   q.set("plan", plan);
    if (search) q.set("search", search);
    api.get(`/admin/tenants?${q}`)
      .then((r) => {
        setTenants(Array.isArray(r.data?.tenants) ? r.data.tenants : []);
        setTotal(Number(r.data?.total) || 0);
        setPages(Number(r.data?.pages) || 1);
      })
      .catch(() => { setError("Falha ao carregar usuários."); setTenants([]); })
      .finally(() => setLoading(false));
  }, [page, plan, search]);

  useEffect(() => { load(); }, [load]);

  async function handleSuspend(id: string) {
    if (!confirm("Suspender esta família?")) return;
    setActing(id);
    await api.put(`/admin/tenants/${id}/suspend`).catch(() => {});
    setActing(null); load();
  }

  async function handleActivate(id: string) {
    setActing(id);
    await api.put(`/admin/tenants/${id}/activate`).catch(() => {});
    setActing(null); load();
  }

  async function handleExport() {
    setExporting(true);
    try {
      const r = await api.get("/admin/export/emails");
      const csv: string = r.data?.csv ?? "";
      if (!csv) throw new Error("Sem dados");
      const bom = "\uFEFF";
      const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kidstasks-emails-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao exportar emails. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }

  function doSearch() { setPage(1); setSearch(inputVal.trim()); }

  const COLS = ["Família / Email", "Plano", "Status", "Filhos", "Cadastro", "Validade", "Último acesso", ""];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Usuários</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? "Carregando..." : `${total} famílias cadastradas`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
            {exporting
              ? <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
              : <span>↓</span>}
            Exportar CSV
          </button>
          <div className="flex gap-1">
            <input value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder="Nome ou email..."
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 w-48 transition-all"
            />
            <button onClick={doSearch}
              className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
              Buscar
            </button>
          </div>
          <select value={plan} onChange={(e) => { setPlan(e.target.value); setPage(1); }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all">
            <option value="">Todos</option>
            <option value="free">Freemium</option>
            <option value="monthly">Mensal</option>
            <option value="annual">Anual</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3 text-red-400 text-xs">
          {error}
          <button onClick={load} className="underline ml-4 hover:no-underline">Tentar novamente</button>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-800">
                {COLS.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    {[130, 70, 60, 30, 80, 70, 80, 50].map((w, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-3 rounded bg-slate-800 animate-pulse" style={{ width: w }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-600 text-sm">
                    Nenhum resultado encontrado
                  </td>
                </tr>
              ) : tenants.map((t) => {
                const pi = planOf(t);
                const si = statusOf(t);
                const rel = fmtRelative(t.lastLoginAt);
                const suspended = t.status === "suspended";

                return (
                  <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors group">
                    {/* Família / Email */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200 text-sm leading-tight">{t.name || "—"}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{t.email ?? "—"}</div>
                    </td>
                    {/* Plano */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${pi.cls}`}>
                        {pi.label}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${si.cls}`}>{si.label}</span>
                    </td>
                    {/* Filhos */}
                    <td className="px-4 py-3 text-slate-300 tabular-nums text-sm font-semibold">
                      {t.childrenCount}
                    </td>
                    {/* Cadastro */}
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                    {/* Validade */}
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {t.currentPeriodEnd
                        ? <span className={new Date(t.currentPeriodEnd) < new Date() ? "text-red-400" : "text-slate-400"}>
                            {fmtDate(t.currentPeriodEnd)}
                          </span>
                        : <span className="text-slate-700">—</span>}
                    </td>
                    {/* Último acesso */}
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {rel
                        ? <span className={rel.recent ? "text-emerald-400" : "text-slate-500"}>{rel.text}</span>
                        : <span className="text-slate-700">Nunca</span>}
                    </td>
                    {/* Ações */}
                    <td className="px-4 py-3">
                      {suspended ? (
                        <button onClick={() => handleActivate(t.id)} disabled={acting === t.id}
                          className="text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg hover:bg-emerald-400/10 transition-colors disabled:opacity-40">
                          {acting === t.id ? "..." : "Ativar"}
                        </button>
                      ) : (
                        <button onClick={() => handleSuspend(t.id)} disabled={acting === t.id}
                          className="text-xs text-slate-600 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-40 opacity-0 group-hover:opacity-100">
                          {acting === t.id ? "..." : "Suspender"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pages > 1 && !loading && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
            <span className="text-slate-600 text-xs tabular-nums">Página {page} de {pages} · {total} total</span>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors disabled:opacity-30">
                ← Anterior
              </button>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors disabled:opacity-30">
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
