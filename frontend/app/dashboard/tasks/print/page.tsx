"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";

interface Task {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  difficulty: string;
  basePoints: number;
  recurrenceType: string;
  recurrenceDays?: string;
  isActive: boolean;
  assignments?: { id: string; childId: string; child: { name: string } }[];
}
interface Child { id: string; name: string; avatarUrl?: string }

const difficultyLabels: Record<string, string> = { easy: "Fácil", medium: "Médio", hard: "Difícil" };
const recurrenceLabels: Record<string, string> = { daily: "Diária", weekly: "Semanal", biweekly: "Quinzenal", monthly: "Mensal", one_time: "Única vez", recurring: "Recorrente" };

const RECURRENCE_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "daily", label: "Diárias" },
  { value: "weekly", label: "Semanais" },
  { value: "biweekly", label: "Quinzenais" },
  { value: "monthly", label: "Mensais" },
];

export default function TasksPrintPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [recurrenceFilter, setRecurrenceFilter] = useState("all");
  const [childFilter, setChildFilter] = useState("all");
  const [groupByChild, setGroupByChild] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [title, setTitle] = useState("Lista de Tarefas");

  useEffect(() => {
    Promise.all([
      api.get("/tasks"),
      api.get("/children"),
    ]).then(([tasksRes, childrenRes]) => {
      setTasks(tasksRes.data);
      setChildren(childrenRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const activeTasks = tasks.filter((t) => t.isActive);

  const filteredTasks = activeTasks.filter((task) => {
    if (recurrenceFilter !== "all" && task.recurrenceType !== recurrenceFilter) return false;
    if (childFilter !== "all") {
      return task.assignments?.some((a) => a.childId === childFilter);
    }
    return true;
  });

  // Group by child
  function getTasksForChild(childId: string) {
    return filteredTasks.filter((t) => t.assignments?.some((a) => a.childId === childId));
  }

  function getUnassignedTasks() {
    return filteredTasks.filter((t) => !t.assignments || t.assignments.length === 0);
  }

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-4xl animate-bounce">📋</div>
    </div>
  );

  return (
    <>
      {/* Print controls — hidden when printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { padding: 0 !important; max-width: 100% !important; }
          body { font-size: 12pt; }
          .task-card { break-inside: avoid; }
          .child-section { break-inside: avoid-page; }
        }
      `}</style>

      <div className="no-print max-w-3xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Imprimir Tarefas 🖨️</h1>
            <p className="text-gray-500 text-sm mt-1">Configure e imprima o checklist de tarefas</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center gap-2"
          >
            🖨️ Imprimir PDF
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do documento</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Lista de Tarefas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recorrência</label>
            <select
              value={recurrenceFilter}
              onChange={(e) => setRecurrenceFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              {RECURRENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por filho</label>
            <select
              value={childFilter}
              onChange={(e) => setChildFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="all">Todos os filhos</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={groupByChild} onChange={(e) => setGroupByChild(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600" />
              <span className="text-sm text-gray-700">Agrupar por filho</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showPoints} onChange={(e) => setShowPoints(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600" />
              <span className="text-sm text-gray-700">Mostrar pontuação</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showDifficulty} onChange={(e) => setShowDifficulty(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600" />
              <span className="text-sm text-gray-700">Mostrar dificuldade</span>
            </label>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-3 text-center">
          {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? "s" : ""} encontrada{filteredTasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Printable content */}
      <div className="print-page max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-gray-800">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center justify-between mt-1">
            <p className="text-gray-500 text-sm capitalize">{today}</p>
            {recurrenceFilter !== "all" && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {RECURRENCE_OPTIONS.find((o) => o.value === recurrenceFilter)?.label}
              </span>
            )}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p>Nenhuma tarefa encontrada com os filtros selecionados.</p>
          </div>
        ) : groupByChild ? (
          <div className="space-y-8">
            {children
              .filter((c) => childFilter === "all" || c.id === childFilter)
              .map((child) => {
                const childTasks = getTasksForChild(child.id);
                if (childTasks.length === 0) return null;
                const isEmoji = child.avatarUrl && !child.avatarUrl.startsWith("http");
                return (
                  <div key={child.id} className="child-section">
                    <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-300">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-600 shrink-0">
                        {isEmoji ? child.avatarUrl : child.name[0]}
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">{child.name}</h2>
                      <span className="text-sm text-gray-400 ml-auto">{childTasks.length} tarefa{childTasks.length !== 1 ? "s" : ""}</span>
                    </div>
                    <TaskList tasks={childTasks} showPoints={showPoints} showDifficulty={showDifficulty} />
                  </div>
                );
              })}
            {childFilter === "all" && (() => {
              const unassigned = getUnassignedTasks();
              if (unassigned.length === 0) return null;
              return (
                <div className="child-section">
                  <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-300">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl text-gray-400 shrink-0">📋</div>
                    <h2 className="text-xl font-bold text-gray-600">Sem filho atribuído</h2>
                    <span className="text-sm text-gray-400 ml-auto">{unassigned.length} tarefa{unassigned.length !== 1 ? "s" : ""}</span>
                  </div>
                  <TaskList tasks={unassigned} showPoints={showPoints} showDifficulty={showDifficulty} />
                </div>
              );
            })()}
          </div>
        ) : (
          <TaskList tasks={filteredTasks} showPoints={showPoints} showDifficulty={showDifficulty} />
        )}

        {/* Footer */}
        <div className="no-print mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          Gerado pelo KidsTasks • {today}
        </div>
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          Gerado pelo KidsTasks • {today}
        </div>
      </div>
    </>
  );
}

const WEEK_DAYS_PRINT = [{ v: 1, l: "Seg" },{ v: 2, l: "Ter" },{ v: 3, l: "Qua" },{ v: 4, l: "Qui" },{ v: 5, l: "Sex" },{ v: 6, l: "Sáb" },{ v: 0, l: "Dom" }];

function TaskList({ tasks, showPoints, showDifficulty }: { tasks: Task[]; showPoints: boolean; showDifficulty: boolean }) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const showDays = task.recurrenceType === "daily" || task.recurrenceType === "weekly";
        let selectedDays: number[] = [];
        try { selectedDays = task.recurrenceDays ? JSON.parse(task.recurrenceDays) : []; } catch { selectedDays = []; }
        return (
        <div key={task.id} className="task-card flex items-start gap-3 p-3 border border-gray-200 rounded-xl">
          {/* Checkbox or weekdays */}
          {showDays ? (
            <div className="flex gap-1 shrink-0 mt-0.5">
              {WEEK_DAYS_PRINT.map((d) => {
                const active = selectedDays.length === 0 || selectedDays.includes(d.v);
                return (
                  <div key={d.v} className="flex flex-col items-center gap-0.5">
                    <span style={{ fontSize: 8, fontWeight: 700, color: active ? "#7c3aed" : "#d1d5db", textTransform: "uppercase" }}>{d.l}</span>
                    <div style={{ width: 16, height: 16, border: `2px solid ${active ? "#7c3aed" : "#d1d5db"}`, borderRadius: 3, background: active && selectedDays.length > 0 ? "#ede9fe" : "white" }} />
                  </div>
                );
              })}
            </div>
          ) : (
          <div className="w-6 h-6 border-2 border-gray-400 rounded mt-0.5 shrink-0 flex items-center justify-center print:border-gray-600">
            <span className="no-print text-gray-300 text-xs">✓</span>
          </div>
          )}
          {/* Icon */}
          <div className="text-2xl shrink-0 leading-none mt-0.5">{task.icon || "📋"}</div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 text-base">{task.title}</div>
            {task.description && (
              <div className="text-gray-500 text-sm mt-0.5">{task.description}</div>
            )}
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-xs text-gray-400">🔄 {recurrenceLabels[task.recurrenceType]}</span>
              {showDifficulty && (
                <span className="text-xs text-gray-400">⚡ {difficultyLabels[task.difficulty]}</span>
              )}
              {showPoints && (
                <span className="text-xs font-semibold text-purple-600">⭐ {task.basePoints} pts</span>
              )}
            </div>
          </div>
          {/* Points box for children to fill in */}
          {showPoints && (
            <div className="shrink-0 text-right">
              <div className="text-xs text-gray-400 mb-1">Pontos</div>
              <div className="w-14 h-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm font-bold text-purple-600">
                {task.basePoints}
              </div>
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}
