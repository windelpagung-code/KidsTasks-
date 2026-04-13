"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface FamilyRow {
  id: string; name: string; plan: string; email: string | null;
  lastLoginAt: string | null; childrenCount: number; tasksCount: number;
}
interface Data {
  activeUsers7d: number; activeUsers30d: number;
  neverLoggedIn: number; dormant30d: number;
  tenantsWithNoChildren: number; tenantsWithNoTasks: number;
  totalTasks: number; approvedTasks: number; totalAssignments: number;
  completionRate: string;
  topFamilies: FamilyRow[];
}

const PLAN_CLS: Record<string, string> = {
  free:    "bg-slate-700 text-slate-300 border-slate-600",
  monthly: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  annual:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
};
const PLAN_LBL: Record<string, string> = { free: "Freemium", monthly: "Mensal", annual: "Anual" };

function fmtRelative(iso: string | null | undefined) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoje";
  if (days < 7)  return `${days}d atrás`;
  if (days < 30) return `${days}d atrás`;
  return `${Math.floor(days / 30)}m atrás`;
}

function Stat({ label, value, sub, color = "text-slate-100" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="text-slate-600 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

export default function EngajamentoPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/engajamento")
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center gap-3 py-24 justify-center"><div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" /><span className="text-slate-600 text-sm">Carregando...</span></div>;
  if (!data) return <div className="py-24 text-center text-red-400 text-sm">Falha ao carregar dados</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Engajamento</h1>
        <p className="text-slate-500 text-sm mt-0.5">Atividade dos usuários e saúde do produto</p>
      </div>

      {/* Activity KPIs */}
      <div>
        <p className="text-xs text-slate-600 uppercase tracking-widest mb-3">Atividade de usuários</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Ativos 7 dias" value={data.activeUsers7d} color="text-emerald-400" sub="logins recentes" />
          <Stat label="Ativos 30 dias" value={data.activeUsers30d} color="text-blue-400" sub="no último mês" />
          <Stat label="Inativos 30d" value={data.dormant30d} color="text-amber-400" sub="sem login recente" />
          <Stat label="Nunca logaram" value={data.neverLoggedIn} color="text-red-400" sub="desde o cadastro" />
        </div>
      </div>

      {/* Product health */}
      <div>
        <p className="text-xs text-slate-600 uppercase tracking-widest mb-3">Saúde do produto</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Taxa de conclusão" value={`${data.completionRate}%`} color="text-violet-400" sub="tarefas aprovadas" />
          <Stat label="Tarefas ativas" value={data.totalTasks} sub="no sistema" />
          <Stat label="Sem filhos" value={data.tenantsWithNoChildren} color={data.tenantsWithNoChildren > 0 ? "text-amber-400" : "text-slate-400"} sub="famílias vazias" />
          <Stat label="Sem tarefas" value={data.tenantsWithNoTasks} color={data.tenantsWithNoTasks > 0 ? "text-amber-400" : "text-slate-400"} sub="nunca criaram" />
        </div>
      </div>

      {/* Top families */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800">
          <p className="text-slate-400 text-xs font-semibold">🏆 Famílias mais ativas</p>
          <p className="text-slate-600 text-xs mt-0.5">ordenadas por número de tarefas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800">
                {["#", "Família", "Plano", "Filhos", "Tarefas", "Último acesso"].map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-left text-xs font-medium text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.topFamilies.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-600 text-sm">Nenhuma família encontrada</td></tr>
              ) : data.topFamilies.map((f, i) => {
                const rel = fmtRelative(f.lastLoginAt);
                const recent = f.lastLoginAt ? (Date.now() - new Date(f.lastLoginAt).getTime()) < 7 * 86400000 : false;
                return (
                  <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-600 text-xs tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-200 text-sm font-medium">{f.name}</div>
                      <div className="text-slate-600 text-xs">{f.email ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${PLAN_CLS[f.plan] ?? PLAN_CLS.free}`}>
                        {PLAN_LBL[f.plan] ?? f.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 tabular-nums text-sm">{f.childrenCount}</td>
                    <td className="px-4 py-3 text-slate-300 tabular-nums text-sm font-semibold">{f.tasksCount}</td>
                    <td className="px-4 py-3 text-xs">
                      {rel
                        ? <span className={recent ? "text-emerald-400" : "text-slate-500"}>{rel}</span>
                        : <span className="text-slate-700">Nunca</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
