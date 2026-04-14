"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import api from "@/lib/api";

interface Child { id: string; name: string; allowanceAmount: number }
interface Balance { balance: number; totalPoints: number; credits: number; debits: number }
interface Transaction {
  id: string; type: "credit" | "debit"; amount: number;
  description: string; createdAt: string;
}
interface SavingsAccount { id: string; balance: number }
interface SavingsGoal {
  id: string; name: string; icon?: string;
  targetAmount: number; savedAmount: number;
  status: "active" | "completed"; completedAt?: string; createdAt: string;
}
interface SavingsTx {
  id: string; type: string; amount: number; description: string; createdAt: string;
  goal?: { id: string; name: string } | null;
}

type Preset = "7d" | "30d" | "thisMonth" | "lastMonth" | "thisYear" | "all";

const emptyForm = { type: "credit" as "credit" | "debit", amount: "", description: "" };
const emptyConvertForm = { points: "", rate: "" };
const emptyEditForm = { id: "", type: "credit" as "credit" | "debit", amount: "", description: "" };
const emptySavingsForm = { type: "deposit" as "deposit" | "withdraw", amount: "", description: "" };
const emptyGoalForm = { name: "", targetAmount: "", icon: "" };
const emptyAllocForm = { goalId: "", amount: "" };
const emptyEditSavingsTx = { id: "", description: "" };

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfLastMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() - 1, 1);
}
function endOfLastMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 0);
}
function toInputDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const today = new Date();
const PRESETS: Record<Preset, { label: string; from: string; to: string }> = {
  "7d":        { label: "7 dias",      from: toInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)), to: toInputDate(today) },
  "30d":       { label: "30 dias",     from: toInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29)), to: toInputDate(today) },
  thisMonth:   { label: "Este mês",    from: toInputDate(startOfMonth(today)), to: toInputDate(today) },
  lastMonth:   { label: "Mês anterior",from: toInputDate(startOfLastMonth(today)), to: toInputDate(endOfLastMonth(today)) },
  thisYear:    { label: "Este ano",    from: `${today.getFullYear()}-01-01`, to: toInputDate(today) },
  all:         { label: "Tudo",        from: "2000-01-01", to: toInputDate(today) },
};

export default function WalletPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [payingAllowance, setPayingAllowance] = useState(false);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [tab, setTab] = useState<"wallet" | "savings">("wallet");
  // Savings state
  const [savingsAccount, setSavingsAccount] = useState<SavingsAccount | null>(null);
  const [savingsLoading, setSavingsLoading] = useState(false);
  const [savingsTxs, setSavingsTxs] = useState<SavingsTx[]>([]);
  const [savingsWalletBalance, setSavingsWalletBalance] = useState(0);
  const [savingsForm, setSavingsForm] = useState(emptySavingsForm);
  const [savingsOp, setSavingsOp] = useState(false);
  const [savingsError, setSavingsError] = useState("");
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [goalForm, setGoalForm] = useState(emptyGoalForm);
  const [savingGoal, setSavingGoal] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const [allocForm, setAllocForm] = useState(emptyAllocForm);
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [redeemingGoal, setRedeemingGoal] = useState<string | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<string | null>(null);
  const [editSavingsTx, setEditSavingsTx] = useState(emptyEditSavingsTx);
  const [editSavingsSaving, setEditSavingsSaving] = useState(false);
  const [deletingSavingsTx, setDeletingSavingsTx] = useState<string | null>(null);
  const [showConvertForm, setShowConvertForm] = useState(false);
  const [convertForm, setConvertForm] = useState(emptyConvertForm);
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ msg: string; onConfirm: () => Promise<void> } | null>(null);
  const [confirmRunning, setConfirmRunning] = useState(false);
  const [preset, setPreset] = useState<Preset>("thisMonth");
  const [dateFrom, setDateFrom] = useState(PRESETS.thisMonth.from);
  const [dateTo, setDateTo] = useState(PRESETS.thisMonth.to);
  const [showDateFilter, setShowDateFilter] = useState(false);

  useEffect(() => {
    api.get("/children").then((r) => {
      setChildren(r.data);
      if (r.data.length > 0) setSelected(r.data[0].id);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const loadWallet = useCallback(() => {
    if (!selected) return;
    api.get(`/wallet/${selected}/balance`).then((r) => setBalance(r.data)).catch(() => setBalance(null));
    api.get(`/wallet/${selected}/transactions`).then((r) => setTransactions(r.data)).catch(() => setTransactions([]));
  }, [selected]);

  const loadSavings = useCallback(() => {
    if (!selected) return;
    setSavingsLoading(true);
    api.get(`/savings/${selected}`).then((r) => {
      setSavingsAccount(r.data.account);
      setSavingsTxs(r.data.transactions);
      setSavingsWalletBalance(r.data.walletBalance);
      setGoals(r.data.goals || []);
    }).catch(() => {
      setSavingsAccount(null);
    }).finally(() => setSavingsLoading(false));
  }, [selected]);

  useEffect(() => { loadWallet(); loadSavings(); }, [loadWallet, loadSavings]);

  function applyPreset(p: Preset) {
    setPreset(p);
    setDateFrom(PRESETS[p].from);
    setDateTo(PRESETS[p].to);
  }

  function handleDateChange(field: "from" | "to", value: string) {
    if (field === "from") setDateFrom(value);
    else setDateTo(value);
    setPreset("all"); // deselect preset when manually editing
  }

  // Filtered transactions by date range
  const filtered = useMemo(() => {
    const from = new Date(dateFrom + "T00:00:00");
    const to = new Date(dateTo + "T23:59:59");
    return transactions.filter((tx) => {
      const d = new Date(tx.createdAt);
      return d >= from && d <= to;
    });
  }, [transactions, dateFrom, dateTo]);

  // Aggregated stats for filtered range
  const filteredStats = useMemo(() => {
    let credits = 0, debits = 0;
    filtered.forEach((tx) => {
      if (tx.type === "credit") credits += Number(tx.amount);
      else debits += Number(tx.amount);
    });
    return { credits, debits, net: credits - debits };
  }, [filtered]);

  // Chart data: wallet grouped by day + savings as cumulative running balance
  const chartData = useMemo(() => {
    const from = new Date(dateFrom + "T00:00:00");
    const to = new Date(dateTo + "T23:59:59");

    // Map keyed by ISO date string for stable sorting
    const map: Record<string, { date: string; isoDate: string; Receitas: number; Despesas: number; Poupança?: number }> = {};

    filtered.forEach((tx) => {
      const d = new Date(tx.createdAt);
      const iso = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
      if (!map[iso]) map[iso] = { date: label, isoDate: iso, Receitas: 0, Despesas: 0 };
      if (tx.type === "credit") map[iso].Receitas += Number(tx.amount);
      else map[iso].Despesas += Number(tx.amount);
    });

    // Build cumulative savings balance — sorted chronologically
    const sortedSavings = [...savingsTxs].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Balance accumulated before the period start
    let runningBalance = sortedSavings.reduce((acc, tx) => {
      if (new Date(tx.createdAt) < from) {
        return acc + (tx.type === "deposit" ? Number(tx.amount) : -Number(tx.amount));
      }
      return acc;
    }, 0);

    // For each savings tx within the period, set the cumulative balance at that day
    sortedSavings.forEach((tx) => {
      const d = new Date(tx.createdAt);
      if (d < from || d > to) return;
      runningBalance += tx.type === "deposit" ? Number(tx.amount) : -Number(tx.amount);
      const iso = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
      if (!map[iso]) map[iso] = { date: label, isoDate: iso, Receitas: 0, Despesas: 0 };
      map[iso].Poupança = runningBalance;
    });

    const sorted = Object.values(map).sort((a, b) => a.isoDate.localeCompare(b.isoDate));

    // Forward-fill: propagate last known savings balance to all subsequent points
    // so the line is continuous even on days without savings transactions
    let lastSavings: number | undefined = runningBalance > 0 ? runningBalance : undefined;
    // Walk backwards to find the correct starting value before forward-filling
    // Actually, recalculate: lastSavings at start of period
    const balanceAtPeriodStart = sortedSavings.reduce((acc, tx) => {
      if (new Date(tx.createdAt) < from) {
        return acc + (tx.type === "deposit" ? Number(tx.amount) : -Number(tx.amount));
      }
      return acc;
    }, 0);
    lastSavings = balanceAtPeriodStart > 0 || sortedSavings.some((tx) => new Date(tx.createdAt) < from)
      ? balanceAtPeriodStart
      : undefined;

    for (const point of sorted) {
      if (point.Poupança !== undefined) {
        lastSavings = point.Poupança;
      } else if (lastSavings !== undefined) {
        point.Poupança = lastSavings;
      }
    }

    return sorted;
  }, [filtered, savingsTxs, dateFrom, dateTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post(`/wallet/${selected}/transactions`, {
        type: form.type,
        amount: parseFloat(form.amount),
        description: form.description,
      });
      setShowForm(false);
      setForm(emptyForm);
      loadWallet();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || "Erro ao registrar transação");
    } finally {
      setSaving(false);
    }
  }

  function openEditTx(tx: Transaction) {
    setEditForm({ id: tx.id, type: tx.type, amount: String(tx.amount), description: tx.description });
    setEditError("");
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditSaving(true);
    setEditError("");
    try {
      await api.put(`/wallet/${selected}/transactions/${editForm.id}`, {
        type: editForm.type,
        amount: parseFloat(editForm.amount),
        description: editForm.description,
      });
      setEditForm(emptyEditForm);
      loadWallet();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setEditError(Array.isArray(msg) ? msg[0] : msg || "Erro ao editar transação");
    } finally {
      setEditSaving(false);
    }
  }

  function handleDeleteTx(txId: string) {
    setConfirmModal({
      msg: "Excluir este lançamento?",
      onConfirm: async () => {
        setDeleting(txId);
        try {
          await api.delete(`/wallet/${selected}/transactions/${txId}`);
          loadWallet();
        } catch {
          setError("Erro ao excluir lançamento");
        } finally {
          setDeleting(null);
        }
      },
    });
  }

  async function handleSavingsOp(e: React.FormEvent) {
    e.preventDefault();
    setSavingsOp(true);
    setSavingsError("");
    try {
      await api.post(`/savings/${selected}/${savingsForm.type}`, {
        amount: parseFloat(savingsForm.amount),
        description: savingsForm.description,
      });
      setSavingsForm(emptySavingsForm);
      loadWallet();
      loadSavings();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setSavingsError(Array.isArray(msg) ? msg[0] : msg || "Erro ao processar operação");
    } finally {
      setSavingsOp(false);
    }
  }

  async function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    setSavingGoal(true);
    try {
      await api.post(`/savings/${selected}/goals`, {
        name: goalForm.name,
        targetAmount: parseFloat(goalForm.targetAmount),
        icon: goalForm.icon || undefined,
      });
      setShowGoalForm(false);
      setGoalForm(emptyGoalForm);
      loadSavings();
    } catch {
      // ignore
    } finally {
      setSavingGoal(false);
    }
  }

  async function handleUpdateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!editGoal) return;
    setSavingGoal(true);
    try {
      await api.put(`/savings/${selected}/goals/${editGoal.id}`, {
        name: goalForm.name,
        targetAmount: parseFloat(goalForm.targetAmount),
        icon: goalForm.icon || undefined,
      });
      setEditGoal(null);
      setGoalForm(emptyGoalForm);
      loadSavings();
    } catch {
      // ignore
    } finally {
      setSavingGoal(false);
    }
  }

  function handleDeleteGoal(goal: SavingsGoal) {
    setConfirmModal({
      msg: `Excluir a meta "${goal.name}"? O saldo guardado (R$ ${Number(goal.savedAmount).toFixed(2)}) será devolvido ao saldo geral.`,
      onConfirm: async () => {
        setDeletingGoal(goal.id);
        try {
          await api.delete(`/savings/${selected}/goals/${goal.id}`);
          loadSavings();
        } catch {
          // ignore
        } finally {
          setDeletingGoal(null);
        }
      },
    });
  }

  async function handleAllocate(e: React.FormEvent) {
    e.preventDefault();
    setSavingsOp(true);
    setSavingsError("");
    try {
      await api.post(`/savings/${selected}/goals/${allocForm.goalId}/allocate`, {
        amount: parseFloat(allocForm.amount),
      });
      setShowAllocModal(false);
      setAllocForm(emptyAllocForm);
      loadSavings();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setSavingsError(Array.isArray(msg) ? msg[0] : msg || "Erro ao alocar");
    } finally {
      setSavingsOp(false);
    }
  }

  function handleRedeemGoal(goal: SavingsGoal) {
    setConfirmModal({
      msg: `Marcar meta "${goal.name}" como conquistada? 🎉`,
      onConfirm: async () => {
        setRedeemingGoal(goal.id);
        setSavingsError("");
        try {
          await api.post(`/savings/${selected}/goals/${goal.id}/redeem`);
          loadSavings();
        } catch (err: unknown) {
          const e = err as { response?: { data?: { message?: string | string[] } } };
          const msg = e.response?.data?.message;
          setSavingsError(Array.isArray(msg) ? msg[0] : msg || "Erro ao resgatar");
        } finally {
          setRedeemingGoal(null);
        }
      },
    });
  }

  async function handleEditSavingsTx(e: React.FormEvent) {
    e.preventDefault();
    setEditSavingsSaving(true);
    try {
      await api.put(`/savings/${selected}/transactions/${editSavingsTx.id}`, { description: editSavingsTx.description });
      setEditSavingsTx(emptyEditSavingsTx);
      loadSavings();
    } catch { /* ignore */ } finally { setEditSavingsSaving(false); }
  }

  function handleDeleteSavingsTx(txId: string) {
    setConfirmModal({
      msg: "Excluir este lançamento? O saldo da poupança e da carteira serão ajustados automaticamente.",
      onConfirm: async () => {
        setDeletingSavingsTx(txId);
        try {
          await api.delete(`/savings/${selected}/transactions/${txId}`);
          loadSavings();
          loadWallet();
        } catch { /* ignore */ } finally { setDeletingSavingsTx(null); }
      },
    });
  }

  async function handleConvertPoints(e: React.FormEvent) {
    e.preventDefault();
    setConverting(true);
    setConvertError("");
    try {
      await api.post(`/wallet/${selected}/convert-points`, {
        points: parseInt(convertForm.points),
        rate: parseFloat(convertForm.rate),
      });
      setShowConvertForm(false);
      setConvertForm(emptyConvertForm);
      loadWallet();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setConvertError(Array.isArray(msg) ? msg[0] : msg || "Erro ao converter pontos");
    } finally {
      setConverting(false);
    }
  }

  async function handlePayAllowance() {
    if (!selected) return;
    setPayingAllowance(true);
    try {
      await api.post(`/wallet/${selected}/pay-allowance`);
      loadWallet();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || "Erro ao registrar mesada");
    } finally {
      setPayingAllowance(false);
    }
  }

  const selectedChild = children.find((c) => c.id === selected);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="text-4xl animate-bounce">💰</div></div>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Carteira 💰</h1>
            <p className="text-gray-500 text-sm mt-1">Créditos, débitos e saldo dos filhos</p>
          </div>
        </div>
        {selected && (
          <div className="flex gap-2 mt-3 flex-wrap">
            <button onClick={handlePayAllowance} disabled={payingAllowance}
              className="flex-1 sm:flex-none bg-green-600 text-white px-3 py-2 rounded-xl font-semibold hover:bg-green-700 transition text-sm disabled:opacity-50 whitespace-nowrap">
              {payingAllowance ? "..." : "💸 Pagar mesada"}
            </button>
            <button onClick={() => { setShowConvertForm(!showConvertForm); setConvertError(""); }}
              className="flex-1 sm:flex-none bg-amber-500 text-white px-3 py-2 rounded-xl font-semibold hover:bg-amber-600 transition text-sm whitespace-nowrap">
              ⭐ Converter pontos
            </button>
            <button onClick={() => { setShowForm(!showForm); setError(""); }}
              className="flex-1 sm:flex-none bg-purple-600 text-white px-3 py-2 rounded-xl font-semibold hover:bg-purple-700 transition text-sm whitespace-nowrap">
              + Lançamento
            </button>
          </div>
        )}
      </div>

      {children.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-lg font-semibold text-gray-700">Nenhum filho cadastrado</h3>
          <p className="text-gray-400 mt-1">Adicione um filho primeiro</p>
        </div>
      ) : (
        <>
          {/* Child selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {children.map((c) => (
              <button key={c.id} onClick={() => setSelected(c.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${selected === c.id ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300"}`}>
                {c.name}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
            <button onClick={() => setTab("wallet")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === "wallet" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              💰 Carteira
            </button>
            <button onClick={() => setTab("savings")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === "savings" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              🐷 Poupança
            </button>
          </div>

          {/* ── SAVINGS TAB ── */}
          {tab === "savings" && (savingsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-4xl animate-bounce">🐷</div>
            </div>
          ) : savingsAccount === null ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-3">🐷</div>
              <p className="text-gray-500 text-sm">Não foi possível carregar a poupança</p>
              <button onClick={loadSavings} className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition">Tentar novamente</button>
            </div>
          ) : (() => {
            const generalBalance = Number(savingsAccount.balance);
            const activeGoals = goals.filter((g) => g.status === "active");
            const completedGoals = goals.filter((g) => g.status === "completed");

            const txTypeLabel: Record<string, string> = {
              deposit: "Depósito",
              withdraw: "Retirada",
              allocation: "Alocação para meta",
              goal_completed: "Meta conquistada",
              goal_deleted: "Meta excluída",
            };
            const txTypeIcon: Record<string, string> = {
              deposit: "🐷",
              withdraw: "↩️",
              allocation: "🎯",
              goal_completed: "🏆",
              goal_deleted: "🗑️",
            };
            const txIsCredit = (type: string) => ["withdraw", "goal_deleted"].includes(type);

            return (
            <div className="space-y-5">
              {/* ── General balance card ── */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Saldo geral disponível</p>
                    <p className="text-4xl font-bold">R$ {generalBalance.toFixed(2)}</p>
                    <p className="text-white/70 text-xs mt-2">💰 Carteira: R$ {savingsWalletBalance.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => { setShowGoalForm(!showGoalForm); setGoalForm(emptyGoalForm); setEditGoal(null); }}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                  >
                    + Nova meta
                  </button>
                </div>
              </div>

              {/* ── Create / Edit goal form ── */}
              {(showGoalForm || editGoal) && (
                <div className="bg-white rounded-2xl border border-emerald-200 p-5">
                  <h3 className="font-bold text-gray-800 mb-4">{editGoal ? "✏️ Editar meta" : "🎯 Nova meta de poupança"}</h3>
                  <form onSubmit={editGoal ? handleUpdateGoal : handleCreateGoal} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nome da meta *</label>
                      <input required value={goalForm.name} onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Bicicleta nova, videogame, viagem..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Valor alvo (R$) *</label>
                      <input required type="number" min="1" step="0.01" value={goalForm.targetAmount}
                        onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="200.00" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Ícone (emoji)</label>
                      <input value={goalForm.icon} onChange={(e) => setGoalForm({ ...goalForm, icon: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="🚲" maxLength={4} />
                    </div>
                    <div className="sm:col-span-2 flex gap-2 justify-end">
                      <button type="button" onClick={() => { setShowGoalForm(false); setEditGoal(null); setGoalForm(emptyGoalForm); }}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition">
                        Cancelar
                      </button>
                      <button type="submit" disabled={savingGoal}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
                        {savingGoal ? "..." : editGoal ? "Salvar alterações" : "Criar meta"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── Active goals ── */}
              {activeGoals.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Metas ativas</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeGoals.map((goal) => {
                      const saved = Number(goal.savedAmount);
                      const target = Number(goal.targetAmount);
                      const pct = target > 0 ? Math.min(100, (saved / target) * 100) : 0;
                      const reached = saved >= target;
                      return (
                        <div key={goal.id} className={`bg-white rounded-2xl border p-5 transition ${reached ? "border-amber-300 bg-amber-50/30" : "border-gray-200"}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{goal.icon || "🎯"}</span>
                              <div>
                                <p className="font-bold text-gray-800 text-sm leading-tight">{goal.name}</p>
                                <p className="text-xs text-gray-400">R$ {saved.toFixed(2)} / R$ {target.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => { setEditGoal(goal); setGoalForm({ name: goal.name, targetAmount: String(goal.targetAmount), icon: goal.icon || "" }); setShowGoalForm(false); }}
                                className="text-gray-400 hover:text-blue-500 transition text-sm px-1">✏️</button>
                              <button onClick={() => handleDeleteGoal(goal)} disabled={deletingGoal === goal.id}
                                className="text-gray-400 hover:text-red-500 transition text-sm px-1 disabled:opacity-40">🗑️</button>
                            </div>
                          </div>

                          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                            <div className={`rounded-full h-2.5 transition-all ${reached ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${pct.toFixed(1)}%` }} />
                          </div>
                          <p className="text-xs text-gray-400 mb-3">{pct.toFixed(0)}% · {reached ? "Meta atingida!" : `faltam R$ ${(target - saved).toFixed(2)}`}</p>

                          <div className="flex gap-2">
                            <button
                              onClick={() => { setAllocForm({ ...emptyAllocForm, goalId: goal.id }); setShowAllocModal(true); setSavingsError(""); }}
                              disabled={generalBalance <= 0}
                              className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-40"
                            >
                              Alocar
                            </button>
                            {reached && (
                              <button
                                onClick={() => handleRedeemGoal(goal)}
                                disabled={redeemingGoal === goal.id}
                                className="flex-1 py-2 rounded-xl bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                              >
                                {redeemingGoal === goal.id ? "..." : "🏆 Conquistar"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeGoals.length === 0 && !showGoalForm && !editGoal && (
                <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-gray-500 text-sm">Nenhuma meta criada ainda</p>
                  <button onClick={() => { setShowGoalForm(true); setGoalForm(emptyGoalForm); setEditGoal(null); }}
                    className="mt-3 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition">
                    Criar primeira meta
                  </button>
                </div>
              )}

              {/* ── Allocate modal ── */}
              {showAllocModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                    <h3 className="font-bold text-gray-800 mb-1">Alocar para meta</h3>
                    <p className="text-xs text-gray-400 mb-4">Saldo geral disponível: R$ {generalBalance.toFixed(2)}</p>
                    {savingsError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 mb-3 text-sm">{savingsError}</div>}
                    <form onSubmit={handleAllocate} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Meta *</label>
                        <select required value={allocForm.goalId} onChange={(e) => setAllocForm({ ...allocForm, goalId: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                          <option value="">Selecionar meta</option>
                          {activeGoals.map((g) => (
                            <option key={g.id} value={g.id}>{g.icon || "🎯"} {g.name} — faltam R$ {Math.max(0, Number(g.targetAmount) - Number(g.savedAmount)).toFixed(2)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Valor (R$) *</label>
                        <input required type="number" min="0.01" step="0.01" max={generalBalance} value={allocForm.amount}
                          onChange={(e) => setAllocForm({ ...allocForm, amount: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="10.00" />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={() => { setShowAllocModal(false); setAllocForm(emptyAllocForm); setSavingsError(""); }}
                          className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition">Cancelar</button>
                        <button type="submit" disabled={savingsOp}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
                          {savingsOp ? "..." : "Alocar"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ── Deposit / Withdraw form ── */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 mb-4">Movimentar saldo geral</h3>
                {savingsError && !showAllocModal && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{savingsError}</div>}
                <form onSubmit={handleSavingsOp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                    {(["deposit", "withdraw"] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setSavingsForm({ ...savingsForm, type: t })}
                        className={`py-3 rounded-xl font-semibold text-sm transition border-2 ${savingsForm.type === t ? (t === "deposit" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-orange-400 bg-orange-50 text-orange-700") : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {t === "deposit" ? "🐷 Depositar" : "↩️ Retirar"}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Valor (R$) *</label>
                    <input required type="number" min="0.01" step="0.01" value={savingsForm.amount} onChange={(e) => setSavingsForm({ ...savingsForm, amount: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="10.00" />
                    {savingsForm.type === "deposit" && (
                      <p className="text-xs text-gray-400 mt-1">Disponível na carteira: R$ {savingsWalletBalance.toFixed(2)}</p>
                    )}
                    {savingsForm.type === "withdraw" && (
                      <p className="text-xs text-gray-400 mt-1">Saldo geral: R$ {generalBalance.toFixed(2)}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Descrição *</label>
                    <input required value={savingsForm.description} onChange={(e) => setSavingsForm({ ...savingsForm, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Guardando para as férias..." />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button type="submit" disabled={savingsOp}
                      className={`px-6 py-2.5 rounded-xl text-white font-semibold transition disabled:opacity-50 ${savingsForm.type === "deposit" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-orange-500 hover:bg-orange-600"}`}>
                      {savingsOp ? "Processando..." : savingsForm.type === "deposit" ? "Depositar" : "Retirar"}
                    </button>
                  </div>
                </form>
              </div>

              {/* ── Completed goals ── */}
              {completedGoals.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">🏆 Metas conquistadas</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {completedGoals.map((goal) => (
                      <div key={goal.id} className="flex items-center gap-3 px-5 py-3.5">
                        <span className="text-2xl">{goal.icon || "🏆"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{goal.name}</p>
                          <p className="text-xs text-gray-400">
                            Conquistada em {goal.completedAt ? new Date(goal.completedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </p>
                        </div>
                        <p className="text-emerald-600 font-bold text-sm">R$ {Number(goal.targetAmount).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Full transaction history ── */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Histórico completo</h3>
                </div>
                {savingsTxs.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">Nenhuma movimentação ainda</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {savingsTxs.map((tx) => (
                      <div key={tx.id}>
                        <div className="flex items-center gap-3 px-5 py-3.5">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 bg-gray-100">
                            {txTypeIcon[tx.type] || "💳"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 text-sm truncate">{tx.description}</div>
                            <div className="text-xs text-gray-400 flex gap-2 flex-wrap">
                              <span>{txTypeLabel[tx.type] || tx.type}</span>
                              {tx.goal && <span className="text-emerald-600">· {tx.goal.name}</span>}
                              <span>· {new Date(tx.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                            </div>
                          </div>
                          <div className={`font-bold text-sm shrink-0 ${txIsCredit(tx.type) ? "text-emerald-600" : "text-orange-500"}`}>
                            {txIsCredit(tx.type) ? "+" : "−"} R$ {Number(tx.amount).toFixed(2)}
                          </div>
                          {["deposit", "withdraw"].includes(tx.type) && (
                            <>
                              <button
                                onClick={() => setEditSavingsTx(editSavingsTx.id === tx.id ? emptyEditSavingsTx : { id: tx.id, description: tx.description })}
                                className="text-gray-400 hover:text-blue-500 transition px-1 shrink-0 text-sm">✏️</button>
                              <button
                                onClick={() => handleDeleteSavingsTx(tx.id)}
                                disabled={deletingSavingsTx === tx.id}
                                className="text-gray-400 hover:text-red-500 transition px-1 shrink-0 text-sm disabled:opacity-40">🗑️</button>
                            </>
                          )}
                        </div>
                        {editSavingsTx.id === tx.id && (
                          <form onSubmit={handleEditSavingsTx} className="px-5 pb-3 flex gap-2">
                            <input
                              value={editSavingsTx.description}
                              onChange={(e) => setEditSavingsTx({ ...editSavingsTx, description: e.target.value })}
                              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Descrição" required />
                            <button type="submit" disabled={editSavingsSaving}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition">
                              {editSavingsSaving ? "..." : "Salvar"}
                            </button>
                            <button type="button" onClick={() => setEditSavingsTx(emptyEditSavingsTx)}
                              className="px-3 py-2 border border-gray-300 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition">✕</button>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            );
          })())}

          {/* ── WALLET TAB ── */}
          {tab === "wallet" && (
          <>

          {/* Transaction form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Novo lançamento — {selectedChild?.name}</h2>
              {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "credit" | "debit" })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="credit">Crédito (+)</option>
                    <option value="debit">Débito (−)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
                  <input required type="number" min="0.01" step="0.01" value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="10.00" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                  <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Mesada semanal, lanche, etc." />
                </div>
                <div className="sm:col-span-2 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
                  <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                    {saving ? "Salvando..." : "Registrar"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Convert points form */}
          {showConvertForm && balance && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-amber-800">⭐ Converter pontos em crédito</h3>
                <span className="text-sm text-amber-600 font-medium">{balance.totalPoints} pontos disponíveis</span>
              </div>
              <form onSubmit={handleConvertPoints} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">Pontos a converter</label>
                  <input
                    required type="number" min={1} max={balance.totalPoints}
                    value={convertForm.points}
                    onChange={(e) => setConvertForm({ ...convertForm, points: e.target.value })}
                    className="w-full border border-amber-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    placeholder="Ex: 100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">Taxa (R$ por ponto)</label>
                  <input
                    required type="number" min={0.01} step={0.01}
                    value={convertForm.rate}
                    onChange={(e) => setConvertForm({ ...convertForm, rate: e.target.value })}
                    className="w-full border border-amber-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    placeholder="Ex: 0,10"
                  />
                </div>
                <div className="flex flex-col justify-end gap-2">
                  {convertForm.points && convertForm.rate && (
                    <p className="text-sm font-semibold text-amber-700 text-center">
                      = R$ {(parseInt(convertForm.points || "0") * parseFloat(convertForm.rate || "0")).toFixed(2)} de crédito
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowConvertForm(false)} className="flex-1 px-3 py-2.5 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-100 transition text-sm">Cancelar</button>
                    <button type="submit" disabled={converting} className="flex-1 px-3 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition disabled:opacity-50 text-sm">
                      {converting ? "..." : "Converter"}
                    </button>
                  </div>
                </div>
              </form>
              {convertError && <p className="text-red-500 text-sm mt-2">{convertError}</p>}
            </div>
          )}

          {balance && (
            <>
              {/* Overall balance */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white mb-6">
                <p className="text-white/70 text-sm mb-1">Saldo total disponível</p>
                <p className="text-4xl font-bold">R$ {Number(balance.balance).toFixed(2)}</p>
                <p className="text-white/70 text-sm mt-2">⭐ {balance.totalPoints} pontos acumulados</p>
              </div>

              {/* Date filters */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {(Object.keys(PRESETS) as Preset[]).map((p) => (
                    <button key={p} onClick={() => { applyPreset(p); setShowDateFilter(false); }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${preset === p ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {PRESETS[p].label}
                    </button>
                  ))}
                  <button onClick={() => setShowDateFilter(!showDateFilter)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${showDateFilter ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    📅 Período
                  </button>
                </div>
                {showDateFilter && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-500">De</label>
                      <input type="date" value={dateFrom} onChange={(e) => handleDateChange("from", e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-500">até</label>
                      <input type="date" value={dateTo} onChange={(e) => handleDateChange("to", e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">{filtered.length} transaç{filtered.length !== 1 ? "ões" : "ão"}</p>
              </div>

              {/* Filtered stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-green-600 text-xs font-medium">Receitas no período</p>
                  <p className="text-xl font-bold text-green-700 mt-1">R$ {filteredStats.credits.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-red-600 text-xs font-medium">Despesas no período</p>
                  <p className="text-xl font-bold text-red-700 mt-1">R$ {filteredStats.debits.toFixed(2)}</p>
                </div>
                <div className={`rounded-2xl p-4 border ${filteredStats.net >= 0 ? "bg-violet-50 border-violet-200" : "bg-orange-50 border-orange-200"}`}>
                  <p className={`text-xs font-medium ${filteredStats.net >= 0 ? "text-violet-600" : "text-orange-600"}`}>Saldo do período</p>
                  <p className={`text-xl font-bold mt-1 ${filteredStats.net >= 0 ? "text-violet-700" : "text-orange-700"}`}>
                    {filteredStats.net >= 0 ? "+" : ""}R$ {filteredStats.net.toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-blue-600 text-xs font-medium">Saldo em poupança</p>
                  <p className="text-xl font-bold text-blue-700 mt-1">
                    R$ {savingsAccount ? Number(savingsAccount.balance).toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>

              {/* Line chart */}
              {chartData.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
                  <h2 className="font-bold text-gray-800 mb-4">Receitas, Despesas e Poupança</h2>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                        tickFormatter={(v) => `R$${v}`} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 13 }}
                        formatter={(value) => [`R$ ${Number(value).toFixed(2)}`]}
                      />
                      <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
                      <Line type="monotone" dataKey="Receitas" stroke="#16a34a" strokeWidth={2.5}
                        dot={{ r: 4, fill: "#16a34a" }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Despesas" stroke="#dc2626" strokeWidth={2.5}
                        dot={{ r: 4, fill: "#dc2626" }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Poupança" stroke="#2563eb" strokeWidth={2.5}
                        dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} strokeDasharray="5 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 text-center text-gray-400 text-sm">
                  Sem transações no período para exibir o gráfico
                </div>
              )}

              {/* Transaction history */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-800">Extrato do período</h2>
                  <span className="text-xs text-gray-400">{filtered.length} lançamento{filtered.length !== 1 ? "s" : ""}</span>
                </div>
                {filtered.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">Nenhuma transação no período selecionado</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {filtered.map((tx) => (
                      <div key={tx.id}>
                        <div className="flex items-center gap-4 px-5 py-3.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${tx.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                            {tx.type === "credit" ? "↑" : "↓"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 text-sm truncate">{tx.description}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(tx.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                          </div>
                          <div className={`font-bold text-sm shrink-0 ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                            {tx.type === "credit" ? "+" : "−"} R$ {Number(tx.amount).toFixed(2)}
                          </div>
                          <button onClick={() => openEditTx(tx)}
                            className="text-xs text-gray-400 hover:text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-50 transition shrink-0">
                            ✏️
                          </button>
                          <button onClick={() => handleDeleteTx(tx.id)} disabled={deleting === tx.id}
                            className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition shrink-0 disabled:opacity-40">
                            {deleting === tx.id ? "..." : "🗑️"}
                          </button>
                        </div>

                        {/* Inline edit form */}
                        {editForm.id === tx.id && (
                          <div className="bg-gray-50 border-t border-gray-100 px-5 py-4">
                            {editError && <div className="text-red-500 text-xs mb-3">{editError}</div>}
                            <form onSubmit={handleEditSubmit} className="flex flex-wrap gap-3 items-end">
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
                                <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "credit" | "debit" })}
                                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                  <option value="credit">Crédito (+)</option>
                                  <option value="debit">Débito (−)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Valor (R$)</label>
                                <input type="number" min="0.01" step="0.01" required value={editForm.amount}
                                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                              </div>
                              <div className="flex-1 min-w-40">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
                                <input required value={editForm.description}
                                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                              </div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => setEditForm(emptyEditForm)}
                                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-500 text-sm hover:bg-gray-100 transition">
                                  Cancelar
                                </button>
                                <button type="submit" disabled={editSaving}
                                  className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                                  {editSaving ? "..." : "Salvar"}
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          </> // end wallet tab
          )}
        </>
      )}

      {/* In-app confirm modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <p className="text-gray-800 text-sm font-medium leading-relaxed mb-6">{confirmModal.msg}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={confirmRunning}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  setConfirmRunning(true);
                  await confirmModal.onConfirm();
                  setConfirmRunning(false);
                  setConfirmModal(null);
                }}
                disabled={confirmRunning}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50"
              >
                {confirmRunning ? "..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
