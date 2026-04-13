"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useUser } from "@/lib/useUser";

const ADMIN_EMAIL = "windelpagung@gmail.com";

interface Child {
  id: string;
  name: string;
  avatarUrl?: string;
  level: number;
  totalPoints: number;
  pendingTasks: number;
}

function ChildAvatar({ child, colorClass, size = "lg" }: { child: { name: string; avatarUrl?: string }; colorClass: string; size?: "sm" | "lg" }) {
  const isEmoji = child.avatarUrl && !child.avatarUrl.startsWith("data:") && !child.avatarUrl.startsWith("http");
  const isImage = child.avatarUrl && (child.avatarUrl.startsWith("data:") || child.avatarUrl.startsWith("http"));
  const sizeClass = size === "lg" ? "w-12 h-12 text-2xl text-lg font-extrabold" : "w-9 h-9 text-base text-sm font-extrabold";
  if (isImage) {
    return <img src={child.avatarUrl} alt={child.name} className={`${sizeClass.split(" ").slice(0,2).join(" ")} rounded-2xl object-cover flex-shrink-0 shadow-sm`} />;
  }
  return (
    <div className={`${sizeClass.split(" ").slice(0,2).join(" ")} rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 shadow-sm`}>
      {isEmoji ? <span className={size === "lg" ? "text-2xl" : "text-base"}>{child.avatarUrl}</span> : <span className={`text-white ${size === "lg" ? "text-lg font-extrabold" : "text-sm font-extrabold"}`}>{child.name[0].toUpperCase()}</span>}
    </div>
  );
}

interface DashboardData {
  tenant: { id: string; name: string; plan: string };
  children: Child[];
  totalTasks: number;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function xpForLevel(level: number) {
  return level * 100;
}

function xpPercent(totalPoints: number, level: number) {
  const base = (level - 1) * 100;
  const next = level * 100;
  const pct = Math.min(100, Math.round(((totalPoints - base) / (next - base)) * 100));
  return Math.max(0, pct);
}

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
];

type RankingPeriod = "daily" | "weekly" | "monthly" | "all";

interface RankingEntry {
  child: { id: string; name: string; avatarUrl?: string; level: number };
  periodPoints: number;
  totalPoints: number;
}

const RANKING_PERIODS: { value: RankingPeriod; label: string }[] = [
  { value: "daily",   label: "Hoje" },
  { value: "weekly",  label: "Semana" },
  { value: "monthly", label: "Mês" },
  { value: "all",     label: "Geral" },
];

export default function DashboardPage() {
  const user = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rankingPeriod, setRankingPeriod] = useState<RankingPeriod>("weekly");
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);

  useEffect(() => {
    api
      .get("/tenant/dashboard")
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadRanking = useCallback(() => {
    setRankingLoading(true);
    api.get(`/gamification/ranking?period=${rankingPeriod}`)
      .then((r) => setRanking(r.data))
      .catch(() => setRanking([]))
      .finally(() => setRankingLoading(false));
  }, [rankingPeriod]);

  useEffect(() => { loadRanking(); }, [loadRanking]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-5xl animate-float">🎯</div>
        <p className="text-gray-400 text-sm animate-pulse">Carregando sua família...</p>
      </div>
    );
  }

  const pendingApprovals =
    data?.children.reduce((acc, c) => acc + (c.pendingTasks || 0), 0) ?? 0;
  const totalPoints =
    data?.children.reduce((acc, c) => acc + c.totalPoints, 0) ?? 0;

  const planLabel =
    data?.tenant?.plan === "free"
      ? "Gratuito"
      : data?.tenant?.plan === "monthly"
      ? "Mensal"
      : "Anual";

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Greeting header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">
            {getGreeting()},{" "}
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1
            className="text-2xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Família {data?.tenant?.name || ""}! 👋
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {pendingApprovals > 0 && (
            <Link
              href="/dashboard/approvals"
              className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-amber-100 transition"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-dot" />
              {pendingApprovals} aprova{pendingApprovals > 1 ? "ções" : "ção"} pendente{pendingApprovals > 1 ? "s" : ""}
              <span>→</span>
            </Link>
          )}
          {user?.email === ADMIN_EMAIL && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 bg-gray-900 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition"
            >
              ⚡ Admin
            </Link>
          )}
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Filhos",
            value: data?.children?.length ?? 0,
            icon: "👧",
            href: "/dashboard/children",
            gradient: "from-violet-500 to-purple-600",
            bg: "bg-violet-50",
            border: "border-violet-100",
            text: "text-violet-700",
          },
          {
            label: "Tarefas ativas",
            value: data?.totalTasks ?? 0,
            icon: "📋",
            href: "/dashboard/tasks",
            gradient: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50",
            border: "border-blue-100",
            text: "text-blue-700",
          },
          {
            label: "Pts totais",
            value: totalPoints,
            icon: "⭐",
            href: "/dashboard/children",
            gradient: "from-amber-500 to-orange-500",
            bg: "bg-amber-50",
            border: "border-amber-100",
            text: "text-amber-700",
          },
          {
            label: "Aprovações",
            value: pendingApprovals,
            icon: "⏳",
            href: "/dashboard/approvals",
            gradient: "from-emerald-500 to-teal-500",
            bg: pendingApprovals > 0 ? "bg-amber-50" : "bg-emerald-50",
            border: pendingApprovals > 0 ? "border-amber-200" : "border-emerald-100",
            text: pendingApprovals > 0 ? "text-amber-700" : "text-emerald-700",
          },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group rounded-2xl border p-3 flex items-center gap-3 transition-all hover:shadow-sm ${s.bg} ${s.border}`}
          >
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-base flex-shrink-0 shadow-sm`}>
              {s.icon}
            </div>
            <div className="min-w-0">
              <div className={`text-xl font-extrabold ${s.text} leading-tight`} style={{ fontFamily: "var(--font-jakarta)" }}>
                {s.value}
              </div>
              <div className="text-gray-500 text-xs truncate">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Children cards ──────────────────────────────────── */}
      {data?.children && data.children.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Heróis da família
            </h2>
            <Link
              href="/dashboard/children"
              className="text-violet-600 text-sm font-medium hover:text-violet-700 transition"
            >
              Ver todos →
            </Link>
          </div>

          <div className="space-y-2">
            {data.children.map((child, idx) => {
              const pct = xpPercent(child.totalPoints, child.level);
              const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              return (
                <Link
                  key={child.id}
                  href={`/dashboard/children/${child.id}`}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm hover:border-violet-200 transition-all"
                >
                  <ChildAvatar child={child} colorClass={color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm truncate" style={{ fontFamily: "var(--font-jakarta)" }}>
                        {child.name}
                      </span>
                      <span className="text-[10px] bg-violet-100 text-violet-700 font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        Nv {child.level}
                      </span>
                      {child.pendingTasks > 0 && (
                        <span className="text-[10px] bg-amber-100 text-amber-600 font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                          {child.pendingTasks} ⏳
                        </span>
                      )}
                    </div>
                    <div className="xp-bar mt-1.5">
                      <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm flex-shrink-0">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="text-5xl mb-4 animate-float inline-block">👧</div>
          <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
            Adicione seu primeiro filho
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            Crie o perfil do seu filho e comece a distribuir tarefas e recompensas!
          </p>
          <Link
            href="/dashboard/children"
            className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-violet-700 transition"
          >
            ➕ Adicionar filho
          </Link>
        </div>
      )}

      {/* ── Ranking ─────────────────────────────────────────── */}
      {data?.children && data.children.length > 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>
                🏆 Ranking da família
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {rankingPeriod === "daily" && "Pontos conquistados hoje"}
                {rankingPeriod === "weekly" && "Pontos nos últimos 7 dias"}
                {rankingPeriod === "monthly" && "Pontos este mês"}
                {rankingPeriod === "all" && "Pontos acumulados no total"}
              </p>
            </div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {RANKING_PERIODS.map((p) => (
                <button key={p.value} onClick={() => setRankingPeriod(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${rankingPeriod === p.value ? "bg-white text-violet-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {rankingLoading ? (
            <div className="flex justify-center py-6"><div className="text-2xl animate-bounce">🏆</div></div>
          ) : (() => {
            const visible = rankingPeriod === "all"
              ? ranking
              : ranking.filter((e) => e.periodPoints > 0);
            if (visible.length === 0) return (
              <p className="text-center text-gray-400 text-sm py-6">Nenhuma atividade concluída neste período.</p>
            );
            return (
              <div className="space-y-2">
                {visible.map((entry, idx) => {
                  const dataChild = data.children.find((c) => c.id === entry.child.id);
                  const color = AVATAR_COLORS[(data.children.findIndex((c) => c.id === entry.child.id)) % AVATAR_COLORS.length];
                  const medals = ["🥇", "🥈", "🥉"];
                  const pct = dataChild ? xpPercent(dataChild.totalPoints, dataChild.level) : 0;
                  return (
                    <div key={entry.child.id} className={`flex items-center gap-3 p-3 rounded-xl ${idx === 0 ? "bg-amber-50 border border-amber-100" : "bg-gray-50"}`}>
                      <span className="text-xl w-7 text-center flex-shrink-0">{medals[idx] || `${idx + 1}º`}</span>
                      <ChildAvatar child={entry.child} colorClass={color} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm truncate">{entry.child.name}</span>
                          <span className="text-xs text-violet-600 font-bold whitespace-nowrap">⭐ {entry.periodPoints} pts</span>
                        </div>
                        {pct > 0 && <div className="xp-bar"><div className="xp-bar-fill" style={{ width: `${pct}%` }} /></div>}
                      </div>
                      <span className="text-xs bg-violet-100 text-violet-700 font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        Nv {entry.child.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Quick actions ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2
          className="text-base font-bold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Ações rápidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/dashboard/children", label: "Novo filho", icon: "👧", color: "bg-violet-50 hover:bg-violet-100 text-violet-700" },
            { href: "/dashboard/tasks",    label: "Nova tarefa", icon: "📋", color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
            { href: "/dashboard/wallet",   label: "Carteiras",  icon: "💰", color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700" },
            { href: "/dashboard/store",    label: "Loja",       icon: "🛍️", color: "bg-amber-50 hover:bg-amber-100 text-amber-700" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition text-center ${a.color}`}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-semibold">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Plan banner ─────────────────────────────────────── */}
      {data?.tenant?.plan === "free" ? (
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #3b1f7a 50%, #4c1d95 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
            />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Plano Gratuito
                </span>
              </div>
              <p
                className="text-white text-lg font-bold mt-1"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Desbloqueie o potencial completo da sua família
              </p>
              <p className="text-white/55 text-sm mt-1">
                Filhos ilimitados, loja de recompensas, badges e muito mais — por menos de R$0,65/dia.
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-5 py-3 rounded-xl text-sm transition shadow-lg"
            >
              ⚡ Fazer upgrade
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-emerald-800 text-sm">Plano {planLabel} ativo</p>
              <p className="text-emerald-600 text-xs">Todos os recursos desbloqueados para sua família</p>
            </div>
          </div>
          <Link href="/dashboard/billing" className="text-emerald-700 text-xs font-medium hover:underline">
            Gerenciar →
          </Link>
        </div>
      )}
    </div>
  );
}
