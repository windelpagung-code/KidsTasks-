"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Task {
  id: string; title: string; description?: string; icon?: string; category?: string;
  difficulty: string; basePoints: number; recurrenceType: string; recurrenceDays?: string; isActive: boolean;
  assignments?: { id: string; childId: string; child: { name: string }; status: string }[];
}
interface Child { id: string; name: string }

const difficultyConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  easy:   { label: "Fácil",   color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200",  dot: "bg-emerald-400" },
  medium: { label: "Médio",   color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",      dot: "bg-amber-400" },
  hard:   { label: "Difícil", color: "text-red-700",     bg: "bg-red-50 border-red-200",          dot: "bg-red-400" },
};
const recurrenceLabels: Record<string, string> = {
  daily: "Diária", weekly: "Semanal", biweekly: "Quinzenal",
  monthly: "Mensal", one_time: "Única vez", recurring: "Recorrente",
};

const WEEK_DAYS = [
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
];

const emptyForm = { title: "", description: "", icon: "📋", category: "", difficulty: "easy", basePoints: "10", recurrenceType: "weekly", recurrenceDays: [] as number[], childIds: [] as string[] };

const INPUT = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";
const SELECT = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragSrc = useRef<number | null>(null);

  function loadTasks() {
    api.get("/tasks").then((r) => setTasks(r.data)).catch(() => {}).finally(() => setLoading(false));
  }
  useEffect(() => { loadTasks(); api.get("/children").then((r) => setChildren(r.data)).catch(() => {}); }, []);

  function openNew() { setEditing(null); setForm(emptyForm); setShowForm(true); setError(""); }
  function openEdit(task: Task) {
    setEditing(task);
    let parsedDays: number[] = [];
    try { parsedDays = task.recurrenceDays ? JSON.parse(task.recurrenceDays) : []; } catch { parsedDays = []; }
    setForm({ title: task.title, description: task.description || "", icon: task.icon || "📋", category: task.category || "", difficulty: task.difficulty, basePoints: String(task.basePoints), recurrenceType: task.recurrenceType, recurrenceDays: parsedDays, childIds: task.assignments?.map((a) => a.childId) || [] });
    setShowForm(true); setError("");
  }
  function toggleChild(childId: string) {
    setForm((f) => ({ ...f, childIds: f.childIds.includes(childId) ? f.childIds.filter((id) => id !== childId) : [...f.childIds, childId] }));
  }
  function toggleDay(day: number) {
    setForm((f) => ({ ...f, recurrenceDays: f.recurrenceDays.includes(day) ? f.recurrenceDays.filter((d) => d !== day) : [...f.recurrenceDays, day] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, basePoints: parseInt(form.basePoints), description: form.description || undefined, category: form.category || undefined, childIds: form.childIds.length > 0 ? form.childIds : undefined, recurrenceDays: (form.recurrenceType === "weekly" && form.recurrenceDays.length > 0) ? form.recurrenceDays : undefined };
      if (editing) await api.put(`/tasks/${editing.id}`, payload);
      else await api.post("/tasks", payload);
      setShowForm(false); setEditing(null); loadTasks();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || "Erro ao salvar tarefa");
    } finally { setSaving(false); }
  }

  async function handleToggle(task: Task) {
    await api.put(`/tasks/${task.id}`, { isActive: !task.isActive }).catch(() => {});
    loadTasks();
  }
  async function handleDelete(id: string) {
    if (!confirm("Remover esta tarefa permanentemente?")) return;
    try { await api.delete(`/tasks/${id}`); loadTasks(); }
    catch { alert("Erro ao remover tarefa. Tente novamente."); }
  }
  function handleDragStart(index: number) { dragSrc.current = index; }
  function handleDragOver(e: React.DragEvent, index: number) { e.preventDefault(); setDragOver(index); }
  async function handleDrop(index: number) {
    const from = dragSrc.current;
    if (from === null || from === index) { setDragOver(null); return; }
    const reordered = [...tasks];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(index, 0, moved);
    setTasks(reordered); setDragOver(null); dragSrc.current = null;
    await api.patch("/tasks/reorder", { ids: reordered.map((t) => t.id) }).catch(() => {});
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="text-5xl animate-float">📋</div>
      <p className="text-gray-400 text-sm animate-pulse">Carregando tarefas...</p>
    </div>
  );

  const active = tasks.filter((t) => t.isActive);
  const inactive = tasks.filter((t) => !t.isActive);

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* ── Header ── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>
            Tarefas
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {active.length} ativa{active.length !== 1 ? "s" : ""}{inactive.length > 0 ? ` · ${inactive.length} inativa${inactive.length !== 1 ? "s" : ""}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/print/tasks"
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            🖨️ Imprimir
          </Link>
          <button onClick={openNew}
            className="flex items-center gap-1.5 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition active:scale-95"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            + Nova tarefa
          </button>
        </div>
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>
              {editing ? `Editar — ${editing.title}` : "Nova tarefa"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }}
              className="text-gray-400 hover:text-gray-600 transition text-lg">✕</button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
              {error.toLowerCase().includes("upgrade") && (
                <Link href="/dashboard/billing" className="ml-1 underline font-semibold text-violet-600">Ver planos →</Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Título *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={INPUT} placeholder="Arrumar o quarto" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descrição</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={INPUT} placeholder="Detalhes da tarefa..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ícone</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className={INPUT} placeholder="🏠" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Categoria</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={INPUT} placeholder="Casa, Escola, Higiene..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dificuldade</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className={SELECT}>
                <option value="easy">Fácil</option>
                <option value="medium">Médio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pontos base</label>
              <input type="number" min="1" value={form.basePoints} onChange={(e) => setForm({ ...form, basePoints: e.target.value })} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Recorrência</label>
              <select value={form.recurrenceType} onChange={(e) => setForm({ ...form, recurrenceType: e.target.value, recurrenceDays: [] })} className={SELECT}>
                <option value="daily">Diária</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quinzenal</option>
                <option value="monthly">Mensal</option>
                <option value="one_time">Única vez</option>
              </select>
            </div>
            {form.recurrenceType === "weekly" && (
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-600">Dias da semana</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setForm((f) => ({ ...f, recurrenceDays: [1,2,3,4,5] }))}
                      className="text-xs text-violet-600 hover:text-violet-700 font-semibold transition">Seg–Sex</button>
                    <button type="button" onClick={() => setForm((f) => ({ ...f, recurrenceDays: [1,2,3,4,5,6,0] }))}
                      className="text-xs text-gray-500 hover:text-gray-700 font-semibold transition">Todos</button>
                  </div>
                </div>
                <div className="flex gap-2">
                  {WEEK_DAYS.map((d) => {
                    const active = form.recurrenceDays.includes(d.value);
                    const isWeekend = d.value === 0 || d.value === 6;
                    return (
                      <button key={d.value} type="button" onClick={() => toggleDay(d.value)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                          active
                            ? isWeekend
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-gray-400 border-gray-200 hover:border-violet-300"
                        }`}>
                        {d.label}
                      </button>
                    );
                  })}
                </div>
                {form.recurrenceDays.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1.5">Nenhum dia selecionado — vale todos os dias da semana</p>
                )}
              </div>
            )}
            {children.length > 0 && (
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-600">Atribuir a</label>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, childIds: children.map((c) => c.id) }))}
                    className="text-xs text-violet-600 hover:text-violet-700 font-semibold transition">Todos</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {children.map((child) => (
                    <button key={child.id} type="button" onClick={() => toggleChild(child.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${form.childIds.includes(child.id) ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"}`}>
                      {child.name}
                    </button>
                  ))}
                </div>
                {form.childIds.length === 0 && <p className="text-xs text-gray-400 mt-1.5">Deixe em branco para não atribuir agora</p>}
              </div>
            )}
            <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancelar</button>
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar tarefa"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Task list ── */}
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4 animate-float inline-block">📋</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
            Nenhuma tarefa criada
          </h3>
          <p className="text-gray-400 text-sm mb-5">Crie a primeira tarefa para sua família!</p>
          <button onClick={openNew}
            className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            + Criar primeira tarefa
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Active tasks */}
          {active.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Ativas ({active.length})
              </p>
              <div className="space-y-2">
                {tasks.map((task, index) => {
                  if (!task.isActive) return null;
                  const diff = difficultyConfig[task.difficulty] || difficultyConfig.easy;
                  return (
                    <div key={task.id} draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                      onDragLeave={() => setDragOver(null)}
                      onDragEnd={() => setDragOver(null)}
                      className={`bg-white rounded-2xl border p-4 flex items-center gap-3 transition-all hover:shadow-sm ${
                        dragOver === index ? "border-violet-400 bg-violet-50 shadow-md" : "border-gray-100"
                      }`}>
                      <div className="text-gray-300 cursor-grab active:cursor-grabbing select-none px-1" title="Arrastar">⠿</div>
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                        {task.icon || "📋"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-gray-400 text-xs mt-0.5 truncate">{task.description}</div>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${diff.bg} ${diff.color}`}>
                            {diff.label}
                          </span>
                          <span className="text-xs text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full font-medium">
                            ⭐ {task.basePoints} pts
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                            🔄 {recurrenceLabels[task.recurrenceType]}
                          </span>
                          {task.category && (
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{task.category}</span>
                          )}
                        </div>
                        {task.assignments && task.assignments.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {task.assignments.map((a) => (
                              <span key={a.id} className="text-xs bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full">
                                {a.child?.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => openEdit(task)}
                          className="text-xs text-violet-600 hover:text-violet-800 font-semibold px-3 py-1.5 rounded-lg hover:bg-violet-50 transition">
                          Editar
                        </button>
                        <button onClick={() => handleToggle(task)}
                          className="text-xs text-amber-600 hover:bg-amber-50 font-medium px-3 py-1.5 rounded-lg transition">
                          Pausar
                        </button>
                        <button onClick={() => handleDelete(task.id)}
                          className="text-xs text-red-400 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition">
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inactive tasks */}
          {inactive.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                Pausadas ({inactive.length})
              </p>
              <div className="space-y-2">
                {tasks.map((task, index) => {
                  if (task.isActive) return null;
                  return (
                    <div key={task.id}
                      className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 opacity-50">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
                        {task.icon || "📋"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-700 text-sm">{task.title}</div>
                        <div className="text-gray-400 text-xs mt-0.5">⭐ {task.basePoints} pts · {recurrenceLabels[task.recurrenceType]}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleToggle(task)}
                          className="text-xs text-emerald-600 hover:bg-emerald-50 font-semibold px-3 py-1.5 rounded-lg transition">
                          Ativar
                        </button>
                        <button onClick={() => handleDelete(task.id)}
                          className="text-xs text-red-400 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition">
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
