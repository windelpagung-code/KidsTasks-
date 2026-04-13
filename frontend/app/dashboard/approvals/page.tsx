"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

interface Child { id: string; name: string }
interface Assignment {
  id: string; status: "pending" | "done" | "approved" | "not_done"; completedAt?: string;
  pointsEarned: number;
  task: { id: string; title: string; icon?: string; basePoints: number; difficulty: string };
  child: { id: string; name: string };
}

const difficultyColors: Record<string, string> = {
  easy: "text-emerald-600 bg-emerald-50", medium: "text-amber-600 bg-amber-50", hard: "text-red-600 bg-red-50"
};
const difficultyLabels: Record<string, string> = { easy: "Fácil", medium: "Médio", hard: "Difícil" };

const AVATAR_COLORS = ["from-violet-500 to-purple-600","from-blue-500 to-cyan-500","from-emerald-500 to-teal-500","from-orange-500 to-amber-500","from-pink-500 to-rose-500"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ApprovalsPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<string>("all");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);
  const [datePickerId, setDatePickerId] = useState<string | null>(null);
  const [pickedDate, setPickedDate] = useState<string>(todayISO());

  useEffect(() => { api.get("/children").then((r) => setChildren(r.data)).catch(() => {}); }, []);

  const loadAllAssignments = useCallback(async () => {
    if (selected !== "all") {
      setLoading(true);
      api.get(`/tasks/child/${selected}`).then((r) => setAssignments(Array.isArray(r.data) ? r.data : [])).catch(() => setAssignments([])).finally(() => setLoading(false));
      return;
    }
    setLoading(true);
    try {
      const childList = await api.get("/children").then((r) => r.data as Child[]);
      const results = await Promise.all(childList.map((c) => api.get(`/tasks/child/${c.id}`).then((r) => r.data).catch(() => [])));
      setAssignments(results.flat());
    } catch { setAssignments([]); } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadAllAssignments(); }, [loadAllAssignments]);

  async function markDone(assignmentId: string, completedAt: string) {
    setDatePickerId(null);
    setMarking(assignmentId);
    try {
      await api.post("/tasks/complete", { assignmentId, completedAt: new Date(completedAt).toISOString() });
      loadAllAssignments();
    }
    catch (err: unknown) { const e = err as { response?: { data?: { message?: string } } }; alert(e.response?.data?.message || "Erro ao marcar tarefa"); }
    finally { setMarking(null); }
  }

  function openDatePicker(assignmentId: string) {
    setPickedDate(todayISO());
    setDatePickerId(assignmentId);
  }
  async function markNotDone(assignmentId: string) {
    setMarking(assignmentId);
    try { await api.post("/tasks/bulk-complete", { assignmentIds: [assignmentId], done: false }); loadAllAssignments(); }
    catch { } finally { setMarking(null); }
  }

  async function markNotDonePenalize(assignmentId: string) {
    if (!confirm("Marcar como não feita irá debitar os pontos desta tarefa do saldo da criança. Confirmar?")) return;
    setMarking(assignmentId);
    try { await api.post("/tasks/bulk-complete", { assignmentIds: [assignmentId], done: false, penalize: true }); loadAllAssignments(); }
    catch { } finally { setMarking(null); }
  }

  const pending = assignments.filter((a) => a.status === "pending");
  const done = assignments.filter((a) => a.status === "done" || a.status === "approved");

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>Aprovações</h1>
        <p className="text-gray-400 text-sm mt-0.5">Marque tarefas como concluídas e aprove o esforço dos filhos</p>
      </div>

      {/* ── KPI bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Pendentes", value: pending.length, color: "text-amber-600", bg: "bg-amber-50 border-amber-100", dot: "bg-amber-400" },
          { label: "Concluídas", value: done.length,   color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", dot: "bg-emerald-400" },
          { label: "Total",     value: assignments.length, color: "text-violet-600", bg: "bg-violet-50 border-violet-100", dot: "bg-violet-400" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
            <div className={`text-2xl font-extrabold ${s.color} mb-0.5`} style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
            <div className="text-gray-500 text-xs flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Child filter ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[{ id: "all", name: "Todos os filhos" }, ...children].map((c, idx) => {
          const active = selected === c.id;
          const color = AVATAR_COLORS[(idx - 1) % AVATAR_COLORS.length];
          return (
            <button key={c.id} onClick={() => setSelected(c.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition flex-shrink-0 ${
                active ? "bg-violet-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300"
              }`}>
              {c.id !== "all" && (
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {c.name[0]}
                </div>
              )}
              {c.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="text-4xl animate-float">✅</div>
          <p className="text-gray-400 text-sm animate-pulse">Carregando aprovações...</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Pending */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pendentes</p>
              {pending.length > 0 && (
                <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
              )}
            </div>
            {pending.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-gray-400 text-sm font-medium">Nenhuma tarefa aguardando aprovação</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pending.map((a) => {
                  const childIdx = children.findIndex((c) => c.id === a.child?.id);
                  const color = AVATAR_COLORS[childIdx >= 0 ? childIdx % AVATAR_COLORS.length : 0];
                  return (
                    <div key={a.id} className="bg-white rounded-2xl border border-amber-100 p-4 flex items-center gap-3 hover:shadow-sm transition">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {a.task.icon || "📋"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">{a.task.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate">
                          {a.child?.name} · ⭐ {a.task.basePoints}pts
                          {a.task.difficulty && <> · <span className={difficultyColors[a.task.difficulty]}>{difficultyLabels[a.task.difficulty]}</span></>}
                        </div>
                      </div>
                        {datePickerId === a.id ? (
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <input
                            type="date"
                            value={pickedDate}
                            max={todayISO()}
                            onChange={(e) => setPickedDate(e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                          />
                          <button onClick={() => markDone(a.id, pickedDate)} disabled={marking === a.id}
                            className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50">
                            {marking === a.id ? "..." : "✓"}
                          </button>
                          <button onClick={() => setDatePickerId(null)}
                            className="text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition text-xs">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 flex items-center gap-1.5">
                          <button onClick={() => markNotDonePenalize(a.id)} disabled={marking === a.id}
                            className="border border-red-200 text-red-500 px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-50 transition disabled:opacity-50">
                            {marking === a.id ? "..." : <><span className="hidden sm:inline">✗ Não feita</span><span className="sm:hidden">✗</span></>}
                          </button>
                          <button onClick={() => openDatePicker(a.id)} disabled={marking === a.id}
                            className="bg-emerald-600 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50">
                            {marking === a.id ? "..." : <><span className="hidden sm:inline">✓ Feita</span><span className="sm:hidden">✓</span></>}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Done */}
          {done.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Concluídas ({done.length})</p>
              <div className="space-y-2">
                {done.map((a) => (
                  <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 opacity-60">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
                      {a.task.icon || "📋"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-700 text-sm">{a.task.title}</div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500">{a.child?.name}</span>
                        {a.pointsEarned > 0 && <span className="text-xs text-emerald-600 font-medium">+{a.pointsEarned} pts</span>}
                        {a.completedAt && <span className="text-xs text-gray-400">{new Date(a.completedAt).toLocaleDateString("pt-BR")}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                        {a.status === "approved" ? "Aprovada" : "Feita"}
                      </span>
                      {a.status === "done" && (
                        <button onClick={() => markNotDone(a.id)} disabled={marking === a.id}
                          className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition">
                          Desfazer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
