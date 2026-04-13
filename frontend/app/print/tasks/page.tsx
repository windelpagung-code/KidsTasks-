"use client";
import { useEffect, useState } from "react";
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
const recurrenceLabels: Record<string, string> = {
  daily: "Diária", weekly: "Semanal", biweekly: "Quinzenal",
  monthly: "Mensal", one_time: "Única vez", recurring: "Recorrente",
};
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
    Promise.all([api.get("/tasks"), api.get("/children")])
      .then(([t, c]) => { setTasks(t.data); setChildren(c.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeTasks = tasks.filter((t) => t.isActive);
  const filteredTasks = activeTasks.filter((task) => {
    if (recurrenceFilter !== "all" && task.recurrenceType !== recurrenceFilter) return false;
    if (childFilter !== "all") return task.assignments?.some((a) => a.childId === childFilter) ?? false;
    return true;
  });

  function getTasksForChild(childId: string) {
    return filteredTasks.filter((t) => t.assignments?.some((a) => a.childId === childId));
  }
  function getUnassignedTasks() {
    return filteredTasks.filter((t) => !t.assignments || t.assignments.length === 0);
  }

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: 40 }}>
        ⏳
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; background: white; color: #111827; }

        .controls {
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
          padding: 14px 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: flex-end;
        }
        .ctrl-field label { display: block; font-size: 11px; font-weight: 600; color: #6b7280; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.05em; }
        .ctrl-field input[type="text"],
        .ctrl-field select {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 13px;
          background: white;
          outline: none;
          color: #111827;
        }
        .ctrl-field input[type="text"] { width: 180px; }
        .checks label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #374151; cursor: pointer; margin-bottom: 3px; }
        .print-btn {
          background: #7c3aed; color: white; border: none;
          border-radius: 10px; padding: 9px 20px; font-size: 14px;
          font-weight: 700; cursor: pointer; margin-left: auto;
        }
        .back-link {
          background: white; color: #6b7280; border: 1px solid #d1d5db;
          border-radius: 8px; padding: 8px 14px; font-size: 13px;
          text-decoration: none; align-self: center;
        }
        .tag-count { font-size: 12px; color: #6b7280; background: #f3f4f6; border-radius: 20px; padding: 2px 10px; margin-left: 8px; }

        /* Document */
        .doc { padding: 28px 36px; max-width: 860px; margin: 0 auto; }
        .doc-header { border-bottom: 3px solid #111827; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .doc-header h1 { font-size: 24px; color: #111827; }
        .doc-header p { font-size: 12px; color: #6b7280; text-transform: capitalize; }

        .child-section { margin-bottom: 24px; page-break-inside: avoid; }
        .child-header { display: flex; align-items: center; gap: 10px; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 10px; }
        .child-avatar { width: 34px; height: 34px; border-radius: 50%; background: #ede9fe; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; color: #7c3aed; flex-shrink: 0; overflow: hidden; }
        .child-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .child-name { font-size: 17px; font-weight: 700; color: #111827; flex: 1; }

        .task-list { display: flex; flex-direction: column; gap: 5px; }
        .task-row { display: flex; align-items: center; gap: 10px; border: 1px solid #e5e7eb; border-radius: 9px; padding: 9px 12px; page-break-inside: avoid; }
        .task-cb { width: 20px; height: 20px; border: 2px solid #9ca3af; border-radius: 4px; flex-shrink: 0; margin-top: 2px; }
        .weekdays { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 2px; }
        .weekday-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .weekday-label { font-size: 9px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.02em; }
        .weekday-cb { width: 18px; height: 18px; border: 2px solid #9ca3af; border-radius: 3px; }
        .task-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .task-body { flex: 1; }
        .task-title { font-size: 13px; font-weight: 600; color: #111827; }
        .task-desc { font-size: 11px; color: #6b7280; margin-top: 2px; }
        .task-tags { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
        .task-tag { font-size: 11px; color: #6b7280; }
        .pts-box { flex-shrink: 0; text-align: center; }
        .pts-label { font-size: 9px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
        .pts-value { border: 2px dashed #c4b5fd; border-radius: 7px; padding: 4px 8px; font-size: 13px; font-weight: 700; color: #7c3aed; margin-top: 2px; }

        .empty { text-align: center; padding: 60px 0; color: #9ca3af; }
        .doc-footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; }

        @media print {
          .controls { display: none !important; }
          .doc { padding: 8mm 10mm; max-width: 100%; }
          .task-row { border-color: #ccc; }
        }
      `}</style>

      {/* Controls */}
      <div className="controls">
        <a href="/dashboard/tasks" className="back-link">← Voltar</a>
        <div className="ctrl-field">
          <label>Título</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="ctrl-field">
          <label>Recorrência</label>
          <select value={recurrenceFilter} onChange={(e) => setRecurrenceFilter(e.target.value)}>
            {RECURRENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="ctrl-field">
          <label>Filho</label>
          <select value={childFilter} onChange={(e) => setChildFilter(e.target.value)}>
            <option value="all">Todos</option>
            {children.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="checks">
          <label><input type="checkbox" checked={groupByChild} onChange={(e) => setGroupByChild(e.target.checked)} /> Agrupar por filho</label>
          <label><input type="checkbox" checked={showPoints} onChange={(e) => setShowPoints(e.target.checked)} /> Mostrar pontuação</label>
          <label><input type="checkbox" checked={showDifficulty} onChange={(e) => setShowDifficulty(e.target.checked)} /> Mostrar dificuldade</label>
        </div>
        <button className="print-btn" onClick={() => window.print()}>🖨️ Imprimir / PDF</button>
      </div>

      {/* Document */}
      <div className="doc">
        <div className="doc-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="KidsTasks" style={{ width: 34, height: 34, borderRadius: 7 }} />
            <div>
              <h1>{title}</h1>
              <p>{today}</p>
            </div>
          </div>
          <span className="tag-count">{filteredTasks.length} tarefa{filteredTasks.length !== 1 ? "s" : ""}</span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty">
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p>Nenhuma tarefa encontrada com os filtros selecionados.</p>
          </div>
        ) : groupByChild ? (
          <>
            {children
              .filter((c) => childFilter === "all" || c.id === childFilter)
              .map((child) => {
                const childTasks = getTasksForChild(child.id);
                if (childTasks.length === 0) return null;
                const isImage = child.avatarUrl && (child.avatarUrl.startsWith("data:") || child.avatarUrl.startsWith("http"));
                return (
                  <div key={child.id} className="child-section">
                    <div className="child-header">
                      <div className="child-avatar">
                        {isImage
                          ? <img src={child.avatarUrl} alt={child.name} />
                          : child.avatarUrl
                          ? child.avatarUrl
                          : child.name[0]}
                      </div>
                      <span className="child-name">{child.name}</span>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>{childTasks.length} tarefa{childTasks.length !== 1 ? "s" : ""}</span>
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
                  <div className="child-header">
                    <div className="child-avatar">📋</div>
                    <span className="child-name" style={{ color: "#6b7280" }}>Sem filho atribuído</span>
                  </div>
                  <TaskList tasks={unassigned} showPoints={showPoints} showDifficulty={showDifficulty} />
                </div>
              );
            })()}
          </>
        ) : (
          <TaskList tasks={filteredTasks} showPoints={showPoints} showDifficulty={showDifficulty} childrenMap={Object.fromEntries(children.map((c) => [c.id, c]))} />
        )}

        <div className="doc-footer">Gerado pelo KidsTasks • {today}</div>
      </div>
    </>
  );
}

function ChildBadge({ child }: { child: Child }) {
  const isImage = child.avatarUrl && (child.avatarUrl.startsWith("data:") || child.avatarUrl.startsWith("http"));
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#ede9fe", borderRadius: 20, padding: "2px 8px 2px 3px", fontSize: 11, color: "#6d28d9", fontWeight: 600 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#ddd6fe", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, overflow: "hidden", flexShrink: 0 }}>
        {isImage
          ? <img src={child.avatarUrl} alt={child.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : child.avatarUrl
          ? child.avatarUrl
          : child.name[0]}
      </span>
      {child.name}
    </span>
  );
}

function TaskList({ tasks, showPoints, showDifficulty, childrenMap }: {
  tasks: Task[];
  showPoints: boolean;
  showDifficulty: boolean;
  childrenMap?: Record<string, Child>;
}) {
  return (
    <div className="task-list">
      {tasks.map((task) => {
        const assignedChildren = childrenMap && task.assignments
          ? task.assignments.map((a) => childrenMap[a.childId]).filter(Boolean)
          : [];
        const showDays = task.recurrenceType === "daily" || task.recurrenceType === "weekly";
        let selectedDays: number[] = [];
        try { selectedDays = task.recurrenceDays ? JSON.parse(task.recurrenceDays) : []; } catch { selectedDays = []; }
        const DAYS = [{ v: 1, l: "Seg" },{ v: 2, l: "Ter" },{ v: 3, l: "Qua" },{ v: 4, l: "Qui" },{ v: 5, l: "Sex" },{ v: 6, l: "Sáb" },{ v: 0, l: "Dom" }];
        return (
          <div key={task.id} className="task-row">
            {showDays ? (
              <div className="weekdays">
                {DAYS.map((d) => {
                  const active = selectedDays.length === 0 || selectedDays.includes(d.v);
                  return (
                    <div key={d.v} className="weekday-item">
                      <span className="weekday-label" style={{ color: active ? "#7c3aed" : "#d1d5db" }}>{d.l}</span>
                      <div className="weekday-cb" style={{ borderColor: active ? "#7c3aed" : "#d1d5db", background: active && selectedDays.length > 0 ? "#ede9fe" : "white" }} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="task-cb" />
            )}
            <div className="task-icon">{task.icon || "📋"}</div>
            <div className="task-body">
              <div className="task-title">{task.title}</div>
              {task.description && <div className="task-desc">{task.description}</div>}
              <div className="task-tags">
                <span className="task-tag">🔄 {recurrenceLabels[task.recurrenceType]}</span>
                {showDifficulty && <span className="task-tag">⚡ {difficultyLabels[task.difficulty]}</span>}
                {showPoints && <span className="task-tag" style={{ color: "#7c3aed", fontWeight: 700 }}>⭐ {task.basePoints} pts</span>}
              </div>
              {assignedChildren.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
                  {assignedChildren.map((c) => <ChildBadge key={c.id} child={c} />)}
                </div>
              )}
            </div>
            {showPoints && (
              <div className="pts-box">
                <div className="pts-label">Pontos</div>
                <div className="pts-value">{task.basePoints}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
