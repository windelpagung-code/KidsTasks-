"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

interface Child {
  id: string; name: string; nickname?: string; avatarUrl?: string; level: number; totalPoints: number;
  allowanceAmount: number; allowanceDay: number;
}
interface Assignment {
  id: string; status: string; pointsEarned: number; completedAt?: string;
  task: { title: string; icon?: string; basePoints: number; difficulty: string };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:  { label: "Pendente",  color: "bg-amber-50 text-amber-700 border-amber-200" },
  done:     { label: "Feita",     color: "bg-blue-50 text-blue-700 border-blue-200" },
  approved: { label: "Aprovada",  color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  not_done: { label: "Não feita", color: "bg-red-50 text-red-600 border-red-200" },
};

const LEVELS = [
  { level: 1, min: 0,    max: 199,      title: "Aprendiz" },
  { level: 2, min: 200,  max: 499,      title: "Explorador" },
  { level: 3, min: 500,  max: 999,      title: "Aventureiro" },
  { level: 4, min: 1000, max: 2499,     title: "Campeão" },
  { level: 5, min: 2500, max: Infinity, title: "Lenda" },
];

function getLevelInfo(totalPoints: number) {
  return LEVELS.find((l) => totalPoints >= l.min && totalPoints <= l.max) ?? LEVELS[0];
}

function xpPercent(totalPoints: number) {
  const current = getLevelInfo(totalPoints);
  if (current.level === 5) return 100;
  const next = LEVELS[current.level]; // next level entry
  const range = next.min - current.min;
  return Math.max(0, Math.min(100, Math.round(((totalPoints - current.min) / range) * 100)));
}

function nextLevelXP(totalPoints: number) {
  const current = getLevelInfo(totalPoints);
  if (current.level === 5) return null;
  return LEVELS[current.level].min;
}

export default function ChildDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [penaltyForm, setPenaltyForm] = useState({ type: "points" as "points" | "allowance", amount: "", reason: "" });
  const [applyingPenalty, setApplyingPenalty] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);
  const [penaltyError, setPenaltyError] = useState("");
  const [marking, setMarking] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.get(`/children/${id}`), api.get(`/tasks/child/${id}`)])
      .then(([childRes, tasksRes]) => { setChild(childRes.data); setAssignments(tasksRes.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  async function markDone(assignmentId: string) {
    setMarking(assignmentId);
    try { await api.post("/tasks/complete", { assignmentId }); const r = await api.get(`/tasks/child/${id}`); setAssignments(r.data); }
    catch { } finally { setMarking(null); }
  }

  async function handlePenalty(e: React.FormEvent) {
    e.preventDefault(); setApplyingPenalty(true); setPenaltyError("");
    try {
      await api.post(`/children/${id}/penalty`, { type: penaltyForm.type, amount: parseFloat(penaltyForm.amount), reason: penaltyForm.reason });
      setPenaltyForm({ type: "points", amount: "", reason: "" }); setShowPenalty(false);
      const r = await api.get(`/children/${id}`); setChild(r.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setPenaltyError(Array.isArray(msg) ? msg[0] : msg || "Erro ao aplicar penalidade");
    } finally { setApplyingPenalty(false); }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="text-5xl animate-float">👦</div>
      <p className="text-gray-400 text-sm animate-pulse">Carregando perfil...</p>
    </div>
  );
  if (!child) return <div className="text-center py-16 text-gray-400">Filho não encontrado</div>;

  const pending = assignments.filter((a) => a.status === "pending");
  const done = assignments.filter((a) => a.status === "done" || a.status === "approved");
  const pct = xpPercent(child.totalPoints);
  const levelInfo = getLevelInfo(child.totalPoints);
  const nextXP = nextLevelXP(child.totalPoints);

  const showAvatar = child.avatarUrl && (child.avatarUrl.startsWith("data:image") || child.avatarUrl.startsWith("http"));
  const showEmoji = child.avatarUrl && !showAvatar;

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* ── Back ── */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm font-medium transition">
        ← Voltar para filhos
      </button>

      {/* ── Hero card ── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #0f0a1e 0%, #1e1250 40%, #3b1f7a 80%, #4c1d95 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        </div>
        <div className="relative z-10 flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-extrabold overflow-hidden flex-shrink-0 border-2 border-white/20"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            {showAvatar ? <img src={child.avatarUrl} alt={child.name} className="w-full h-full object-cover" /> : showEmoji ? <span>{child.avatarUrl}</span> : <span className="text-white">{child.name[0]}</span>}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white leading-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
              {child.name}
            </h1>
            {child.nickname && <p className="text-white/50 text-sm">"{child.nickname}"</p>}

            {/* Level badge */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                ⭐ Nível {levelInfo.level} · {levelInfo.title}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                🏆 {child.totalPoints} pts
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/70 text-xs px-3 py-1 rounded-full">
                💰 R${Number(child.allowanceAmount).toFixed(2)}/mês
              </span>
            </div>
          </div>

          <button onClick={() => setShowPenalty(!showPenalty)}
            className="flex-shrink-0 flex items-center gap-1.5 text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/50 px-3 py-2 rounded-xl text-xs font-semibold transition">
            ⚠️ Penalidade
          </button>
        </div>

        {/* XP bar */}
        <div className="relative z-10 mt-5">
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span>{child.totalPoints} XP</span>
            {nextXP !== null
              ? <span>Próximo nível: {nextXP} XP</span>
              : <span>🏆 Nível máximo!</span>
            }
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #fbbf24, #f472b6)" }} />
          </div>
          <p className="text-white/30 text-xs mt-1">
            {nextXP !== null
              ? `${pct}% para o próximo nível · faltam ${nextXP - child.totalPoints} pts`
              : "Você chegou ao topo! 🎉"}
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pendentes", value: pending.length, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          { label: "Concluídas", value: done.length, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Dia pagamento", value: `Dia ${child.allowanceDay || 5}`, color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.bg}`}>
            <div className={`text-xl font-extrabold ${s.color} mb-0.5`} style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
            <div className="text-gray-500 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Penalty form ── */}
      {showPenalty && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-red-700" style={{ fontFamily: "var(--font-jakarta)" }}>Aplicar penalidade</h2>
            <button onClick={() => setShowPenalty(false)} className="text-red-400 hover:text-red-600 transition">✕</button>
          </div>
          {penaltyError && <div className="bg-red-100 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">{penaltyError}</div>}
          <form onSubmit={handlePenalty} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-red-700 mb-1.5">Tipo</label>
              <select value={penaltyForm.type} onChange={(e) => setPenaltyForm({ ...penaltyForm, type: e.target.value as "points" | "allowance" })}
                className="w-full border border-red-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="points">Deduzir pontos</option>
                <option value="allowance">Deduzir mesada (R$)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-red-700 mb-1.5">{penaltyForm.type === "points" ? "Pontos a deduzir" : "Valor (R$)"} *</label>
              <input required type="number" min="1" step={penaltyForm.type === "allowance" ? "0.01" : "1"} value={penaltyForm.amount}
                onChange={(e) => setPenaltyForm({ ...penaltyForm, amount: e.target.value })}
                className="w-full border border-red-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-red-700 mb-1.5">Motivo *</label>
              <input required value={penaltyForm.reason} onChange={(e) => setPenaltyForm({ ...penaltyForm, reason: e.target.value })}
                className="w-full border border-red-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="Não fez a tarefa, mau comportamento..." />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowPenalty(false)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition">Cancelar</button>
              <button type="submit" disabled={applyingPenalty} className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition disabled:opacity-50">
                {applyingPenalty ? "Aplicando..." : "Aplicar penalidade"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Pending tasks ── */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Pendentes ({pending.length})
        </p>
        {pending.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-400 text-sm">Nenhuma tarefa pendente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl border border-amber-100 p-4 flex items-center gap-3 hover:shadow-sm transition">
                <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">{a.task.icon || "📋"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{a.task.title}</div>
                  <div className="text-xs text-violet-600 font-medium mt-0.5">⭐ {a.task.basePoints} pts base</div>
                </div>
                <button onClick={() => markDone(a.id)} disabled={marking === a.id}
                  className="flex-shrink-0 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50">
                  {marking === a.id ? "..." : "✓ Feita"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Done tasks ── */}
      {done.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Concluídas ({done.length})
          </p>
          <div className="space-y-2">
            {done.map((a) => {
              const sc = statusConfig[a.status] || statusConfig.done;
              return (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 opacity-65">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">{a.task.icon || "📋"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-700 text-sm">{a.task.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {a.pointsEarned > 0 && <span className="text-xs text-emerald-600 font-medium">+{a.pointsEarned} pts</span>}
                      {a.completedAt && <span className="text-xs text-gray-400">{new Date(a.completedAt).toLocaleDateString("pt-BR")}</span>}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${sc.color}`}>{sc.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
