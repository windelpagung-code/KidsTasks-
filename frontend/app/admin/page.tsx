"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, LineChart, Line, AreaChart, Area,
} from "recharts";
import api from "@/lib/api";

interface Metrics {
  totalTenants: number; paidTenants: number; paidMonthly: number; paidAnnual: number;
  freeTenants: number; totalChildren: number; totalTasks: number; suspended: number;
  conversionRate: string; mrr: string; arr: string;
  newSignups30d: number; newConversions30d: number; signupGrowth: string;
  signupsByDay: { date: string; total: number; paid: number; free: number }[];
}

const PLAN_COLORS = ["#64748b", "#7c3aed", "#10b981", "#ef4444"];

const TT_STYLE = {
  background: "#1e293b",
  border: "1px solid rgba(148,163,184,0.1)",
  borderRadius: 8,
  color: "#e2e8f0",
  fontSize: 11,
};

function KPI({ label, value, sub, color = "text-slate-100" }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-slate-500 text-xs font-medium">{label}</span>
      <span className={`text-2xl font-bold tabular-nums ${color}`}>{value}</span>
      {sub && <span className="text-slate-600 text-xs">{sub}</span>}
    </div>
  );
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/metrics")
      .then((r) => setMetrics(r.data))
      .catch(() => setError("Falha ao carregar métricas"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-24">
      <div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      <span className="text-slate-500 text-sm">Carregando...</span>
    </div>
  );

  if (error || !metrics) return (
    <div className="py-24 text-center text-red-400 text-sm">{error || "Sem dados"}</div>
  );

  const mrr = Number(metrics.mrr) || 0;
  const arr = Number(metrics.arr) || 0;
  const growth = Number(metrics.signupGrowth) || 0;

  const pieData = [
    { name: "Freemium", value: metrics.freeTenants || 0 },
    { name: "Mensal",   value: metrics.paidMonthly || 0 },
    { name: "Anual",    value: metrics.paidAnnual || 0 },
    { name: "Suspenso", value: metrics.suspended || 0 },
  ].filter((d) => d.value > 0);

  const chartData = (metrics.signupsByDay || []).map((d) => ({
    ...d,
    date: d.date ? d.date.slice(5) : "",
    acumulado: 0, // filled below
  }));

  // Compute running total for area chart
  let acc = 0;
  const areaData = chartData.map((d) => {
    acc += d.total;
    return { date: d.date, total: d.total, acumulado: acc, paid: d.paid, free: d.free };
  });

  // MRR projection: repeat last 7 days avg
  const last7 = chartData.slice(-7);
  const avgPaidPerDay = last7.length > 0
    ? last7.reduce((s, d) => s + d.paid, 0) / last7.length
    : 0;
  const mrrProjection = Array.from({ length: 6 }, (_, i) => ({
    mes: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"][i],
    mrr: Math.round(mrr + avgPaidPerDay * 30 * (i + 1) * 19.9),
  }));
  // Prepend current month
  const mrrChart = [{ mes: "Atual", mrr: Math.round(mrr) }, ...mrrProjection];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Visão geral do negócio</p>
        </div>
        <span className="text-slate-600 text-xs">
          {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* KPIs row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI label="Total Famílias"  value={metrics.totalTenants} />
        <KPI label="Pagantes"        value={metrics.paidTenants}  color="text-emerald-400"
          sub={`${metrics.conversionRate}% conversão`} />
        <KPI label="Freemium"        value={metrics.freeTenants}  color="text-slate-300" />
        <KPI label="MRR"             value={`R$${mrr.toFixed(0)}`} color="text-violet-400"
          sub={`ARR R$${arr.toFixed(0)}`} />
        <KPI label="Novos 30d"       value={metrics.newSignups30d} color="text-blue-400"
          sub={`${growth >= 0 ? "+" : ""}${metrics.signupGrowth}% vs ant.`} />
        <KPI label="Suspensos"       value={metrics.suspended}
          color={metrics.suspended > 0 ? "text-red-400" : "text-slate-400"} />
      </div>

      {/* KPIs row 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPI label="Plano Mensal"  value={metrics.paidMonthly}  sub="R$19,90/mês" />
        <KPI label="Plano Anual"   value={metrics.paidAnnual}   sub="R$118,80/ano" />
        <KPI label="Total Filhos"  value={metrics.totalChildren} />
        <KPI label="Tarefas ativas" value={metrics.totalTasks} />
      </div>

      {/* Charts row 1: Pie + Cadastros diários */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {pieData.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-xs font-semibold mb-4">Distribuição de Planos</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} famílias`]} contentStyle={TT_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: PLAN_COLORS[i] }} />
                  {d.name} <span className="text-slate-200 font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {chartData.length > 0 && (
          <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 ${pieData.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}`}>
            <p className="text-slate-400 text-xs font-semibold mb-4">Cadastros por dia — últimos 30 dias</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TT_STYLE} cursor={{ fill: "rgba(148,163,184,0.05)" }} />
                <Bar dataKey="free" name="Freemium" fill="#475569" radius={[2,2,0,0]} stackId="a" />
                <Bar dataKey="paid" name="Pagantes" fill="#7c3aed" radius={[2,2,0,0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts row 2: Crescimento acumulado + Projeção MRR */}
      {areaData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Crescimento acumulado */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-xs font-semibold mb-4">Crescimento acumulado — 30 dias</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={areaData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="acGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TT_STYLE} cursor={{ stroke: "rgba(124,58,237,0.3)" }} />
                <Area type="monotone" dataKey="acumulado" name="Famílias" stroke="#7c3aed" strokeWidth={2} fill="url(#acGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Projeção MRR */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-xs font-semibold mb-1">Projeção MRR — próximos 6 meses</p>
            <p className="text-slate-600 text-xs mb-4">baseado na média de conversões dos últimos 7 dias</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={mrrChart} margin={{ top: 0, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false}
                  tickFormatter={(v) => `R$${v}`} />
                <Tooltip contentStyle={TT_STYLE} formatter={(v) => [`R$${v}`, "MRR proj."]} />
                <Line type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Revenue highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-950/50 border border-emerald-800/30 rounded-xl p-5">
          <p className="text-emerald-500 text-xs font-semibold mb-2">Taxa de Conversão</p>
          <p className="text-3xl font-bold text-emerald-400 tabular-nums">{metrics.conversionRate}%</p>
          <p className="text-slate-600 text-xs mt-1">freemium → pagante</p>
        </div>
        <div className="bg-violet-950/50 border border-violet-800/30 rounded-xl p-5">
          <p className="text-violet-400 text-xs font-semibold mb-2">MRR</p>
          <p className="text-3xl font-bold text-violet-400 tabular-nums">R${mrr.toFixed(2)}</p>
          <p className="text-slate-600 text-xs mt-1">receita mensal recorrente</p>
        </div>
        <div className="bg-blue-950/50 border border-blue-800/30 rounded-xl p-5">
          <p className="text-blue-400 text-xs font-semibold mb-2">ARR</p>
          <p className="text-3xl font-bold text-blue-400 tabular-nums">R${arr.toFixed(2)}</p>
          <p className="text-slate-600 text-xs mt-1">receita anual recorrente</p>
        </div>
      </div>
    </div>
  );
}
