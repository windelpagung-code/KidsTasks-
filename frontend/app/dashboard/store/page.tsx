"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useUser, canEdit } from "@/lib/useUser";

interface StoreItem { id: string; name: string; description?: string; icon?: string; pointsCost: number; stockLimit?: number; stockUsed: number; isActive: boolean }
interface Child { id: string; name: string; totalPoints: number }
interface Redemption {
  id: string; status: "pending" | "approved" | "rejected"; requestedAt: string;
  item: { name: string; icon?: string; pointsCost: number };
  child: { id: string; name: string };
}

const emptyForm = { name: "", description: "", icon: "🎁", pointsCost: "100", stockLimit: "" };
const INPUT = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";
const AVATAR_COLORS = ["from-violet-500 to-purple-600","from-blue-500 to-cyan-500","from-emerald-500 to-teal-500","from-orange-500 to-amber-500","from-pink-500 to-rose-500"];

export default function StorePage() {
  const user = useUser();
  const editor = canEdit(user?.role);
  const [redemptionChildFilter, setRedemptionChildFilter] = useState("all");
  const [items, setItems] = useState<StoreItem[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<StoreItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [redeemItem, setRedeemItem] = useState<StoreItem | null>(null);
  const [redeemChildId, setRedeemChildId] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState("");
  const [resolving, setResolving] = useState<string | null>(null);
  const [tab, setTab] = useState<"items" | "redemptions">("items");

  const loadAll = useCallback(() => {
    Promise.all([api.get("/store/items"), api.get("/children"), api.get("/store/redemptions")])
      .then(([itemsRes, childrenRes, redemptionsRes]) => { setItems(itemsRes.data); setChildren(childrenRes.data); setRedemptions(redemptionsRes.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

  function openNew() { setEditing(null); setForm(emptyForm); setShowForm(true); setError(""); }
  function openEdit(item: StoreItem) {
    setEditing(item);
    setForm({ name: item.name, description: item.description || "", icon: item.icon || "🎁", pointsCost: String(item.pointsCost), stockLimit: item.stockLimit ? String(item.stockLimit) : "" });
    setShowForm(true); setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { name: form.name, description: form.description || undefined, icon: form.icon, pointsCost: parseInt(form.pointsCost), stockLimit: form.stockLimit ? parseInt(form.stockLimit) : undefined };
      if (editing) await api.put(`/store/items/${editing.id}`, payload);
      else await api.post("/store/items", payload);
      setShowForm(false); setEditing(null); setForm(emptyForm); loadAll();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || "Erro ao salvar item");
    } finally { setSaving(false); }
  }

  async function handleToggle(item: StoreItem) { await api.put(`/store/items/${item.id}`, { isActive: !item.isActive }).catch(() => {}); loadAll(); }
  async function handleDelete(id: string) { if (!confirm("Excluir este item da loja?")) return; await api.delete(`/store/items/${id}`).catch(() => {}); loadAll(); }
  function openRedeem(item: StoreItem) { setRedeemItem(item); setRedeemChildId(children[0]?.id || ""); setRedeemError(""); }

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault(); setRedeeming(true); setRedeemError("");
    try { await api.post("/store/redeem", { childId: redeemChildId, itemId: redeemItem!.id }); setRedeemItem(null); setTab("redemptions"); loadAll(); }
    catch (err: unknown) { const e = err as { response?: { data?: { message?: string | string[] } } }; const msg = e.response?.data?.message; setRedeemError(Array.isArray(msg) ? msg[0] : msg || "Erro ao solicitar resgate"); }
    finally { setRedeeming(false); }
  }

  async function handleResolve(redemptionId: string, approved: boolean) {
    setResolving(redemptionId);
    try { await api.post(`/store/redemptions/${redemptionId}/resolve`, { approved }); loadAll(); }
    catch { alert("Erro ao processar resgate"); } finally { setResolving(null); }
  }

  const pendingCount = redemptions.filter((r) => r.status === "pending").length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="text-5xl animate-float">🛍️</div>
      <p className="text-gray-400 text-sm animate-pulse">Carregando loja...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* ── Header ── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>Loja de Recompensas</h1>
          <p className="text-gray-400 text-sm mt-0.5">Itens que os filhos podem resgatar com pontos conquistados</p>
        </div>
        {tab === "items" && editor && (
          <button onClick={openNew}
            className="text-white px-4 py-2.5 rounded-xl text-sm font-bold transition active:scale-95"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            + Novo item
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: "items", label: "Itens", icon: "🛍️" },
          { key: "redemptions", label: "Resgates", icon: "🎁", badge: pendingCount },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as "items" | "redemptions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t.icon} {t.label}
            {t.badge && t.badge > 0 && (
              <span className="bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── ITEMS TAB ── */}
      {tab === "items" && (
        <>
          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>
                  {editing ? `Editar — ${editing.name}` : "Novo item"}
                </h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600 transition text-lg">✕</button>
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT} placeholder="1h de videogame" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ícone</label>
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={INPUT} placeholder="🎮" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Custo em pontos *</label>
                  <input required type="number" min="1" value={form.pointsCost} onChange={(e) => setForm({ ...form, pointsCost: e.target.value })} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descrição</label>
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={INPUT} placeholder="Descrição opcional" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Limite de estoque</label>
                  <input type="number" min="1" value={form.stockLimit} onChange={(e) => setForm({ ...form, stockLimit: e.target.value })} className={INPUT} placeholder="Sem limite" />
                </div>
                <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition">Cancelar</button>
                  <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition disabled:opacity-50" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                    {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar item"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Redeem modal */}
          {redeemItem && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRedeemItem(null)}>
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>Resgatar recompensa</h2>
                <p className="text-gray-400 text-sm mb-4">Selecione o filho para resgatar este item</p>
                <div className="flex items-center gap-3 rounded-xl p-4 mb-4 border border-violet-100" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.05), rgba(99,102,241,0.05))" }}>
                  <span className="text-4xl">{redeemItem.icon || "🎁"}</span>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{redeemItem.name}</div>
                    <div className="text-violet-600 font-semibold text-sm">⭐ {redeemItem.pointsCost} pts</div>
                  </div>
                </div>
                {redeemError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 mb-3 text-sm">{redeemError}</div>}
                <form onSubmit={handleRedeem}>
                  <div className="grid gap-2 mb-5">
                    {children.map((c, idx) => {
                      const canAfford = c.totalPoints >= redeemItem.pointsCost;
                      const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                      return (
                        <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${redeemChildId === c.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-violet-300"} ${!canAfford ? "opacity-40 cursor-not-allowed" : ""}`}>
                          <input type="radio" name="child" value={c.id} checked={redeemChildId === c.id} onChange={() => setRedeemChildId(c.id)} disabled={!canAfford} className="sr-only" />
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {c.name[0]}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-sm">{c.name}</div>
                            <div className={`text-xs font-medium ${canAfford ? "text-emerald-600" : "text-red-500"}`}>
                              ⭐ {c.totalPoints} pts {!canAfford && "— insuficiente"}
                            </div>
                          </div>
                          {redeemChildId === c.id && <span className="text-violet-500 text-sm">✓</span>}
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setRedeemItem(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancelar</button>
                    <button type="submit" disabled={redeeming || !redeemChildId} className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition disabled:opacity-50" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                      {redeeming ? "..." : "Confirmar resgate"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Items grid */}
          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4 animate-float inline-block">🛍️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>Loja vazia</h3>
              <p className="text-gray-400 text-sm mb-5">Adicione recompensas que seus filhos podem conquistar com pontos</p>
              {editor && (
                <button onClick={openNew} className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                  + Criar primeiro item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item) => {
                const stockLeft = item.stockLimit ? item.stockLimit - item.stockUsed : null;
                return (
                  <div key={item.id} className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-sm ${!item.isActive ? "opacity-50 border-gray-100" : "border-gray-100 hover:border-violet-200"}`}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-3xl flex-shrink-0">
                        {item.icon || "🎁"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>{item.name}</div>
                        {item.description && <div className="text-gray-400 text-xs leading-relaxed">{item.description}</div>}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-violet-600 font-bold text-sm">⭐ {item.pointsCost} pts</span>
                          {stockLeft !== null && (
                            <span className={`text-xs font-medium ${stockLeft === 0 ? "text-red-500" : "text-gray-400"}`}>
                              {stockLeft === 0 ? "Esgotado" : `${stockLeft} restantes`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.isActive && children.length > 0 && (
                      <button onClick={() => openRedeem(item)}
                        className="w-full py-2.5 rounded-xl text-white text-xs font-bold transition active:scale-95 mb-2"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                        🎁 Resgatar para filho
                      </button>
                    )}

                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(item)} className="text-xs text-violet-600 hover:bg-violet-50 font-semibold px-3 py-1.5 rounded-lg transition">Editar</button>
                      <button onClick={() => handleToggle(item)} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${item.isActive ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}>
                        {item.isActive ? "Pausar" : "Ativar"}
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── REDEMPTIONS TAB ── */}
      {tab === "redemptions" && (
        <div className="space-y-4">
          {children.length > 0 && redemptions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {[{ id: "all", name: "Todos" }, ...children].map((c, idx) => (
                <button key={c.id} onClick={() => setRedemptionChildFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${redemptionChildFilter === c.id ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {redemptions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4 animate-float inline-block">🎁</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>Nenhum resgate ainda</h3>
              <p className="text-gray-400 text-sm">Os pedidos de resgate aparecerão aqui</p>
            </div>
          ) : (() => {
            const filtered = redemptionChildFilter === "all" ? redemptions : redemptions.filter((r) => r.child.id === redemptionChildFilter);
            if (filtered.length === 0) return (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm">Nenhum resgate para este filho</p>
              </div>
            );
            const groups: { child: string; items: Redemption[] }[] = [];
            if (redemptionChildFilter === "all") {
              const map: Record<string, Redemption[]> = {};
              filtered.forEach((r) => { if (!map[r.child.name]) map[r.child.name] = []; map[r.child.name].push(r); });
              Object.entries(map).forEach(([name, items]) => groups.push({ child: name, items }));
            } else {
              groups.push({ child: "", items: filtered });
            }
            return (
              <div className="space-y-5">
                {groups.map(({ child, items: groupItems }, gi) => {
                  const color = AVATAR_COLORS[gi % AVATAR_COLORS.length];
                  return (
                    <div key={child || "single"}>
                      {child && (
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold`}>{child[0]}</div>
                          <span className="font-bold text-gray-800 text-sm">{child}</span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{groupItems.length} resgate{groupItems.length !== 1 ? "s" : ""}</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        {groupItems.map((r) => (
                          <div key={r.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-3 transition ${r.status === "pending" ? "border-amber-100" : "border-gray-100"}`}>
                            <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                              {r.item.icon || "🎁"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 text-sm">{r.item.name}</div>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                {redemptionChildFilter === "all" && <span className="text-xs text-gray-500">{r.child.name} ·</span>}
                                <span className="text-xs text-violet-600 font-medium">⭐ {r.item.pointsCost} pts</span>
                                <span className="text-xs text-gray-400">{new Date(r.requestedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${r.status === "pending" ? "bg-amber-50 text-amber-700" : r.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                                {r.status === "pending" ? "Pendente" : r.status === "approved" ? "Aprovado" : "Rejeitado"}
                              </span>
                              {r.status === "pending" && editor && (
                                <div className="flex gap-1.5">
                                  <button onClick={() => handleResolve(r.id, true)} disabled={resolving === r.id}
                                    className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50">
                                    {resolving === r.id ? "..." : "✓"}
                                  </button>
                                  <button onClick={() => handleResolve(r.id, false)} disabled={resolving === r.id}
                                    className="border border-red-200 text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition disabled:opacity-50">
                                    ✕
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
