"use client";
import { useEffect, useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/lib/api";

interface TenantRow { id: string; name: string; plan: string; createdAt: string; users: { email: string }[] }
interface MonthPoint { label: string; mrr: number; monthly: number; annual: number }
interface Data {
  mrrTrend: MonthPoint[];
  pastDue: TenantRow[];
  suspended: TenantRow[];
  cancelled: TenantRow[];
  mrr: number; arr: number;
  paidMonthly: number; paidAnnual: number;
}

const TT = { background: "#1e293b", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 11 };

function KPI({ label, value, sub, color = "text-slate-100" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="text-slate-600 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

function TenantList({ title, items, emptyMsg, badge }: { title: string; items: TenantRow[]; emptyMsg: string; badge?: string }) {
  if (items.length === 0) return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-slate-400 text-xs font-semibold mb-3">{title}</p>
      <p className="text-slate-600 text-sm text-center py-4">{emptyMsg}</p>
    </div>
  );
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <p className="text-slate-400 text-xs font-semibold">{title}</p>
        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="divide-y divide-slate-800">
        {items.map((t) => (
          <div key={t.id} className="px-5 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-slate-200 text-sm font-medium truncate">{t.name}</p>
              <p className="text-slate-600 text-xs truncate">{t.users[0]?.email ?? "—"}</p>
            </div>
            {badge && <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full whitespace-nowrap">{badge}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FinanceiroPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/financeiro")
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center gap-3 py-24 justify-center"><div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" /><span className="text-slate-600 text-sm">Carregando...</span></div>;
  if (!data) return <div className="py-24 text-center text-red-400 text-sm">Falha ao carregar dados</div>;

  const mrr = Number(data.mrr) || 0;
  const arr = Number(data.arr) || 0;
  const revenueByPlan = [
    { plano: "Mensal", receita: +(data.paidMonthly * 19.9).toFixed(2), clientes: data.paidMonthly },
    { plano: "Anual",  receita: +(data.paidAnnual  * (118.8/12)).toFixed(2), clientes: data.paidAnnual },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Financeiro</h1>
        <p className="text-slate-500 text-sm mt-0.5">Receita, planos e alertas de pagamento</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPI label="MRR" value={`R$${mrr.toFixed(2)}`} color="text-violet-400" sub="Receita mensal recorrente" />
        <KPI label="ARR" value={`R$${arr.toFixed(2)}`} color="text-emerald-400" sub="Receita anual recorrente" />
        <KPI label="Mensal" value={data.paidMonthly} sub={`R$ ${(data.paidMonthly * 19.9).toFixed(2)}/mês`} />
        <KPI label="Anual"  value={data.paidAnnual}  sub={`R$ ${(data.paidAnnual * (118.8/12)).toFixed(2)}/mês equiv.`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MRR Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-xs font-semibold mb-4">Evolução do MRR — 6 meses</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.mrrTrend} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip contentStyle={TT} formatter={(v) => [`R$${v}`, "MRR"]} />
              <Area type="monotone" dataKey="mrr" stroke="#7c3aed" strokeWidth={2} fill="url(#mrrGrad)" dot={{ r: 3, fill: "#7c3aed", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by plan */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-xs font-semibold mb-4">Receita por plano</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByPlan} margin={{ left: -20, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis dataKey="plano" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip contentStyle={TT} formatter={(v, n) => n === "receita" ? [`R$${v}`, "Receita MRR"] : [v, "Clientes"]} />
              <Bar dataKey="receita" name="receita" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            {revenueByPlan.map((r) => (
              <div key={r.plano} className="text-xs text-slate-500">
                {r.plano}: <span className="text-slate-300 font-semibold">{r.clientes} clientes · R${r.receita.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TenantList title="⚠️ Pagamento pendente" items={data.pastDue} emptyMsg="Nenhum pagamento pendente" badge="past_due" />
        <TenantList title="🔴 Suspensos" items={data.suspended} emptyMsg="Nenhuma conta suspensa" badge="suspensa" />
        <TenantList title="🚫 Cancelados" items={data.cancelled} emptyMsg="Nenhum cancelamento" badge="cancelado" />
      </div>
    </div>
  );
}
