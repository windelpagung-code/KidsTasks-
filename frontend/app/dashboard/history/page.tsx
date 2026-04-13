"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

interface Child { id: string; name: string }
interface HistoryEntry {
  id: string;
  completedAt: string;
  pointsEarned: number;
  status: "done" | "approved";
  task: { id: string; title: string; icon?: string; difficulty: string; basePoints: number; category?: string };
  child: { id: string; name: string };
}

const difficultyLabels: Record<string, string> = { easy: "Fácil", medium: "Médio", hard: "Difícil" };
const difficultyColors: Record<string, string> = {
  easy: "text-emerald-600 bg-emerald-50",
  medium: "text-amber-600 bg-amber-50",
  hard: "text-red-600 bg-red-50",
};
const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
];

function todayISO() {
  // Usa a data local do navegador (não UTC) para evitar que à noite no fuso
  // horário do usuário o histórico aponte para o dia seguinte em UTC
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/children").then((r) => setChildren(r.data)).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ date: selectedDate });
      if (selectedChild !== "all") params.set("childId", selectedChild);
      const r = await api.get(`/tasks/history?${params}`);
      setEntries(Array.isArray(r.data) ? r.data : []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedChild]);

  useEffect(() => { load(); }, [load]);

  // Group by child
  const grouped = entries.reduce<Record<string, HistoryEntry[]>>((acc, e) => {
    const key = e.child.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const totalPoints = entries.reduce((acc, e) => acc + e.pointsEarned, 0);
  const isToday = selectedDate === todayISO();

  function stepDate(delta: number) {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + delta);
    const next = d.toISOString().slice(0, 10);
    if (next <= todayISO()) setSelectedDate(next);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>
          📅 Histórico de atividades
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Veja tudo que seus filhos concluíram em cada dia
        </p>
      </div>

      {/* ── Date nav ── */}
      <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4">
        <button
          onClick={() => stepDate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition font-bold text-lg flex-shrink-0"
        >
          ‹
        </button>

        <div className="flex-1 text-center">
          <input
            type="date"
            value={selectedDate}
            max={todayISO()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm font-semibold text-gray-700 border-0 bg-transparent text-center focus:outline-none cursor-pointer w-full"
          />
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{formatDate(selectedDate + "T12:00:00")}</p>
        </div>

        <button
          onClick={() => stepDate(1)}
          disabled={isToday}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition font-bold text-lg flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>

      {/* ── Child filter ── */}
      {children.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[{ id: "all", name: "Todos os filhos" }, ...children].map((c, idx) => {
            const active = selectedChild === c.id;
            const color = AVATAR_COLORS[(idx - 1) % AVATAR_COLORS.length];
            return (
              <button
                key={c.id}
                onClick={() => setSelectedChild(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition flex-shrink-0 ${
                  active ? "bg-violet-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300"
                }`}
              >
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
      )}

      {/* ── Summary ── */}
      {!loading && entries.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
            <div className="text-2xl font-extrabold text-violet-700 mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>
              {entries.length}
            </div>
            <div className="text-xs text-gray-500">atividade{entries.length !== 1 ? "s" : ""} concluída{entries.length !== 1 ? "s" : ""}</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="text-2xl font-extrabold text-amber-700 mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>
              ⭐ {totalPoints}
            </div>
            <div className="text-xs text-gray-500">pontos conquistados</div>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="text-4xl animate-float">📅</div>
          <p className="text-gray-400 text-sm animate-pulse">Carregando histórico...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-semibold text-gray-700 mb-1">Nenhuma atividade neste dia</p>
          <p className="text-gray-400 text-sm">
            {isToday ? "Nenhuma tarefa foi concluída hoje ainda." : "Nenhuma tarefa foi concluída nesta data."}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([childId, items]) => {
            const childIdx = children.findIndex((c) => c.id === childId);
            const color = AVATAR_COLORS[childIdx >= 0 ? childIdx % AVATAR_COLORS.length : 0];
            const childName = items[0].child.name;
            const childPoints = items.reduce((acc, e) => acc + e.pointsEarned, 0);

            return (
              <div key={childId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Child header */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 bg-gray-50/60">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {childName[0]}
                  </div>
                  <span className="font-bold text-gray-900 text-sm flex-1">{childName}</span>
                  <span className="text-xs text-violet-600 font-bold">⭐ {childPoints} pts no dia</span>
                </div>

                {/* Tasks */}
                <div className="divide-y divide-gray-50">
                  {items.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                        {e.task.icon || "📋"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm">{e.task.title}</div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {e.task.difficulty && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${difficultyColors[e.task.difficulty] || ""}`}>
                              {difficultyLabels[e.task.difficulty]}
                            </span>
                          )}
                          {e.task.category && (
                            <span className="text-[10px] text-gray-400">{e.task.category}</span>
                          )}
                          <span className="text-[10px] text-gray-400">{formatTime(e.completedAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs font-bold text-emerald-600">+{e.pointsEarned} pts</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${e.status === "approved" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                          {e.status === "approved" ? "Aprovada" : "Feita"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
