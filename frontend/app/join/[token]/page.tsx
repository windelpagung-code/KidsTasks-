"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api, { saveTokens } from "@/lib/api";

const roleLabels: Record<string, string> = { admin: "Administrador", editor: "Editor", viewer: "Leitor" };

export default function JoinPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [inviteInfo, setInviteInfo] = useState<{ email: string; role: string } | null>(null);
  const [form, setForm] = useState({ name: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    api.get(`/auth/invite/${token}`)
      .then((r) => setInviteInfo(r.data))
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("As senhas não coincidem"); return; }
    if (form.password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres"); return; }
    setSaving(true);
    setError("");
    try {
      const { data } = await api.post(`/auth/invite/${token}/register`, {
        name: form.name,
        password: form.password,
      });
      saveTokens(data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Erro ao criar conta");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-4xl animate-bounce">🎯</div>
      </div>
    );
  }

  if (invalid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Convite inválido ou expirado</h1>
          <p className="text-gray-500 text-sm">Este link de convite não é mais válido. Peça ao administrador para gerar um novo convite.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎯</div>
          <h1 className="text-2xl font-bold text-gray-800">Você foi convidado!</h1>
          <p className="text-gray-500 mt-1 text-sm">Complete seu cadastro para acessar o KidsTasks</p>
        </div>

        {inviteInfo && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-5">
            <p className="text-sm text-purple-700">
              <span className="font-semibold">Email:</span> {inviteInfo.email}
            </p>
            <p className="text-sm text-purple-700 mt-0.5">
              <span className="font-semibold">Papel:</span> {roleLabels[inviteInfo.role] || inviteInfo.role}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seu nome *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Como você quer ser chamado"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha *</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Repita a senha"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {saving ? "Criando conta..." : "Criar minha conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
