"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useUser, isAdmin } from "@/lib/useUser";

interface TeamMember { id: string; name: string; email: string; role: string; createdAt: string; mustChangePassword?: boolean }

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  admin:  { label: "Admin",   color: "text-violet-700",  bg: "bg-violet-50 border-violet-200" },
  editor: { label: "Editor",  color: "text-blue-700",    bg: "bg-blue-50 border-blue-200" },
  viewer: { label: "Leitor",  color: "text-gray-600",    bg: "bg-gray-50 border-gray-200" },
};

const AVATAR_COLORS = ["from-violet-500 to-purple-600","from-blue-500 to-cyan-500","from-emerald-500 to-teal-500","from-orange-500 to-amber-500","from-pink-500 to-rose-500"];
const INPUT = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";

export default function SettingsPage() {
  const user = useUser();
  const admin = isAdmin(user?.role);

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "editor" });
  const [saving, setSaving] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ inviteUrl?: string; email?: string; message?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  function loadTeam() { api.get("/users/team").then((r) => setTeam(r.data)).catch(() => {}).finally(() => setLoading(false)); }
  useEffect(() => { loadTeam(); }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(""); setInviteResult(null);
    try { const r = await api.post("/users/invite", inviteForm); setInviteResult(r.data); setInviteForm({ name: "", email: "", role: "editor" }); loadTeam(); }
    catch (err: unknown) { const e = err as { response?: { data?: { message?: string | string[] } } }; const msg = e.response?.data?.message; setError(Array.isArray(msg) ? msg[0] : msg || "Erro ao gerar convite"); }
    finally { setSaving(false); }
  }

  async function handleRemove(memberId: string) {
    if (!confirm("Remover este responsável da família?")) return;
    setRemoving(memberId);
    try { await api.delete(`/users/team/${memberId}`); loadTeam(); }
    catch (err: unknown) { const e = err as { response?: { data?: { message?: string } } }; alert(e.response?.data?.message || "Erro ao remover"); }
    finally { setRemoving(null); }
  }

  function copyLink(url: string) {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="text-5xl animate-float">⚙️</div>
      <p className="text-gray-400 text-sm animate-pulse">Carregando configurações...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>Configurações</h1>
        <p className="text-gray-400 text-sm mt-0.5">Gerencie os responsáveis e sua conta</p>
      </div>

      {/* ── Role banner for non-admins ── */}
      {!admin && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">
              Seu nível de acesso: {roleConfig[user?.role || ""]?.label || user?.role}
            </p>
            <p className="text-xs text-blue-500 mt-0.5">
              {user?.role === "viewer"
                ? "Você tem acesso somente leitura. Não pode criar, editar ou excluir."
                : "Você pode gerenciar tarefas, filhos e aprovações, mas não pode convidar membros ou acessar configurações de plano."}
            </p>
          </div>
        </div>
      )}

      {/* ── Team members ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>Responsáveis da família</h2>
            <p className="text-gray-400 text-xs mt-0.5">{team.length} membro{team.length !== 1 ? "s" : ""}</p>
          </div>
          {admin && (
            <button onClick={() => { setShowInvite(!showInvite); setError(""); setInviteResult(null); setCopied(false); }}
              className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-sm font-bold transition active:scale-95"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              + Convidar
            </button>
          )}
        </div>

        {/* Invite form */}
        {admin && showInvite && (
          <div className="px-6 py-5 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>Gerar link de convite</h3>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

            {inviteResult?.inviteUrl && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4">
                <p className="text-emerald-700 text-sm font-semibold mb-1">✅ {inviteResult.message}</p>
                <p className="text-xs text-gray-500 mb-2">Link para <strong>{inviteResult.email}</strong> (válido 7 dias):</p>
                <div className="flex gap-2 items-center">
                  <input readOnly value={inviteResult.inviteUrl}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 font-mono" />
                  <button onClick={() => copyLink(inviteResult.inviteUrl!)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${copied ? "bg-emerald-600 text-white" : "bg-violet-600 text-white hover:bg-violet-700"}`}>
                    {copied ? "✓ Copiado" : "Copiar"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">O responsável clica no link, escolhe nome e senha, e já entra direto.</p>
              </div>
            )}

            <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <input required type="text" value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} className={INPUT} placeholder="Nome completo" />
              </div>
              <div className="sm:col-span-2">
                <input required type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} className={INPUT} placeholder="email@exemplo.com" />
              </div>
              <div>
                <select value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition">
                  <option value="editor">Editor</option>
                  <option value="viewer">Leitor</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex gap-3 justify-end">
                <button type="button" onClick={() => { setShowInvite(false); setInviteResult(null); }} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition">Cancelar</button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-white text-sm font-bold transition disabled:opacity-50" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                  {saving ? "Gerando..." : "Gerar convite"}
                </button>
              </div>
            </form>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { role: "editor", desc: "Pode criar, editar tarefas, aprovar, gerenciar carteira e loja" },
                { role: "viewer", desc: "Acesso somente leitura — visualiza tudo, mas não altera" },
              ].map((r) => {
                const rc = roleConfig[r.role];
                return (
                  <div key={r.role} className={`rounded-xl p-3 border ${rc.bg}`}>
                    <span className={`text-xs font-bold ${rc.color}`}>{rc.label}</span>
                    <p className="text-xs text-gray-500 mt-1">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Team list */}
        <div className="divide-y divide-gray-50">
          {team.map((member, idx) => {
            const rc = roleConfig[member.role] || roleConfig.viewer;
            const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return (
              <div key={member.id} className="flex items-center gap-3 px-6 py-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {member.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{member.name}</span>
                    {member.mustChangePassword && (
                      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">⏳ Pendente login</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{member.email}</div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${rc.bg} ${rc.color}`}>
                  {rc.label}
                </span>
                {admin && member.role !== "admin" && (
                  <button onClick={() => handleRemove(member.id)} disabled={removing === member.id}
                    className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50">
                    {removing === member.id ? "..." : "Remover"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Change password ── */}
      <ChangePasswordSection />
    </div>
  );
}

function ChangePasswordSection() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const INPUT = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { setError("As senhas não coincidem"); return; }
    if (form.newPassword.length < 6) { setError("Mínimo 6 caracteres"); return; }
    setSaving(true); setError(""); setSuccess(false);
    try {
      await api.patch("/auth/change-password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess(true); setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Erro ao alterar senha");
    } finally { setSaving(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-bold text-gray-900" style={{ fontFamily: "var(--font-jakarta)" }}>Segurança</h2>
        <p className="text-gray-400 text-xs mt-0.5">Altere sua senha de acesso</p>
      </div>
      <div className="px-6 py-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">✅ Senha alterada com sucesso!</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Senha atual</label>
            <input type="password" required value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className={INPUT} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nova senha</label>
            <input type="password" required value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className={INPUT} placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirmar</label>
            <input type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={INPUT} placeholder="Repita a senha" />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold transition disabled:opacity-50" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              {saving ? "Salvando..." : "Alterar senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
