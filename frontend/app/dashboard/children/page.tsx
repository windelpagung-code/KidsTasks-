"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import api from "@/lib/api";

// Lazy load emoji picker (heavy component)
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false, loading: () => <div className="p-4 text-center text-gray-400 text-sm">Carregando emojis...</div> });

interface Child {
  id: string; name: string; nickname?: string; avatarUrl?: string;
  level: number; totalPoints: number; allowanceAmount: number;
  allowanceDay: number; allowanceFrequency: string;
}

const emptyForm = { name: "", nickname: "", birthdate: "", allowanceAmount: "0", allowanceFrequency: "monthly", allowanceDay: "5", pin: "", avatarUrl: "" };

const frequencyOptions = [
  { value: "monthly",   label: "Mensal" },
  { value: "biweekly",  label: "Quinzenal" },
  { value: "weekly",    label: "Semanal" },
];

const weekDays = [
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" },
  { value: "0", label: "Domingo" },
];

/** Resize an image File to max 200x200, return as base64 JPEG string */
async function resizeImage(file: File): Promise<string> {
  // Step 1: read file as data URL via FileReader (more compatible than createObjectURL on iOS)
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Step 2: load into an Image element
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  // Step 3: draw to canvas at max 200×200
  const MAX = 200;
  let { width, height } = img;
  if (width > height) { height = Math.round((height / width) * MAX); width = MAX; }
  else { width = Math.round((width / height) * MAX); height = MAX; }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl; // fallback: return original if canvas unavailable

  ctx.drawImage(img, 0, 0, width, height);

  // Try JPEG first; if toDataURL throws (rare), fall back to original
  try {
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return dataUrl;
  }
}

function isImageData(url?: string) {
  return !!url && (url.startsWith("data:image") || url.startsWith("http"));
}

function ChildAvatar({ child, size = "md" }: { child: { name: string; avatarUrl?: string }; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "w-10 h-10 text-xl" : size === "lg" ? "w-16 h-16 text-3xl" : "w-14 h-14 text-2xl";
  const showImage = isImageData(child.avatarUrl);
  return (
    <div className={`${s} rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 shrink-0 overflow-hidden`}>
      {showImage
        ? <img src={child.avatarUrl} alt={child.name} className="w-full h-full object-cover" />
        : child.avatarUrl
          ? <span>{child.avatarUrl}</span>
          : <span>{child.name[0]}</span>}
    </div>
  );
}

type AvatarTab = "emoji" | "photo";

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Child | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [avatarTab, setAvatarTab] = useState<AvatarTab>("emoji");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function loadChildren() {
    api.get("/children").then((r) => setChildren(r.data)).catch(() => {}).finally(() => setLoading(false));
  }
  useEffect(() => { loadChildren(); }, []);

  function openEdit(child: Child) {
    setEditing(child);
    setForm({ name: child.name, nickname: child.nickname || "", birthdate: "", allowanceAmount: String(child.allowanceAmount), allowanceFrequency: child.allowanceFrequency || "monthly", allowanceDay: String(child.allowanceDay || 5), pin: "", avatarUrl: child.avatarUrl || "" });
    setShowForm(true); setShowEmojiPicker(false); setError("");
    setAvatarTab(isImageData(child.avatarUrl) ? "photo" : "emoji");
  }

  function openNew() {
    setEditing(null); setForm(emptyForm); setShowForm(true); setShowEmojiPicker(false); setError(""); setAvatarTab("emoji");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await resizeImage(file);
      setForm((f) => ({ ...f, avatarUrl: base64 }));
    } catch {
      setError("Não foi possível carregar a imagem. Tente salvar como JPG/PNG antes de enviar.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const payload: Record<string, unknown> = {
        name: form.name, nickname: form.nickname || undefined,
        allowanceAmount: parseFloat(form.allowanceAmount),
        allowanceFrequency: form.allowanceFrequency,
        allowanceDay: parseInt(form.allowanceDay),
        pin: form.pin || undefined, avatarUrl: form.avatarUrl || undefined,
      };
      if (!editing) payload.birthdate = form.birthdate;
      if (editing) await api.put(`/children/${editing.id}`, payload);
      else await api.post("/children", payload);
      setShowForm(false); setEditing(null); loadChildren();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } };
      const msg = e.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || "Erro ao salvar");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este filho?")) return;
    await api.delete(`/children/${id}`).catch(() => {});
    loadChildren();
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="text-4xl animate-bounce">👧</div></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Filhos 👧👦</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os perfis dos seus filhos</p>
        </div>
        <button onClick={openNew} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 transition">
          + Adicionar filho
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{editing ? `Editar — ${editing.name}` : "Novo filho"}</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
              {error.toLowerCase().includes("upgrade") && (
                <Link href="/dashboard/billing" className="ml-2 underline font-semibold text-purple-600 hover:text-purple-800">Ver planos disponíveis →</Link>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Avatar section */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto / Avatar</label>

              {/* Preview */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl font-bold text-purple-600 border-2 border-purple-200 overflow-hidden shrink-0">
                  {form.avatarUrl
                    ? isImageData(form.avatarUrl)
                      ? <img src={form.avatarUrl} alt="preview" className="w-full h-full object-cover" />
                      : <span>{form.avatarUrl}</span>
                    : <span className="text-purple-400 text-2xl">{form.name[0] || "?"}</span>}
                </div>
                <div className="flex-1">
                  {form.avatarUrl && (
                    <button type="button" onClick={() => setForm({ ...form, avatarUrl: "" })}
                      className="mb-2 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                      ✕ Remover avatar
                    </button>
                  )}
                  <p className="text-xs text-gray-400">Escolha um emoji ou faça upload de uma foto do dispositivo</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-3">
                <button type="button" onClick={() => { setAvatarTab("emoji"); setShowEmojiPicker(false); }}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition ${avatarTab === "emoji" ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
                  😊 Emoji
                </button>
                <button type="button" onClick={() => { setAvatarTab("photo"); setShowEmojiPicker(false); }}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition ${avatarTab === "photo" ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
                  📷 Foto
                </button>
              </div>

              {/* Emoji tab */}
              {avatarTab === "emoji" && (
                <div>
                  <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition text-left">
                    {showEmojiPicker ? "▲ Fechar seletor de emoji" : "▼ Abrir seletor de emoji"}
                  </button>
                  {showEmojiPicker && (
                    <div className="mt-2 relative z-10">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setForm({ ...form, avatarUrl: emojiData.emoji });
                          setShowEmojiPicker(false);
                        }}
                        width="100%"
                        height={350}
                        searchPlaceholder="Buscar emoji..."
                        lazyLoadEmojis
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Photo tab */}
              {avatarTab === "photo" && (
                <div>
                  <label
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition ${uploading ? "border-gray-200 bg-gray-50 opacity-50 pointer-events-none" : "border-gray-300 text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50"}`}
                  >
                    <span className="text-sm font-medium">
                      {uploading ? "⏳ Processando foto..." : "📁 Selecionar foto do dispositivo"}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-1.5 text-center">
                    JPG, PNG, WEBP, HEIC • Redimensionado automaticamente
                  </p>
                </div>
              )}
            </div>

            {/* Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Maria" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apelido</label>
              <input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Mari" />
            </div>
            {!editing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento *</label>
                <input required type="date" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesada base (R$)</label>
              <input type="number" min="0" step="0.01" value={form.allowanceAmount} onChange={(e) => setForm({ ...form, allowanceAmount: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="50.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequência da mesada</label>
              <select value={form.allowanceFrequency}
                onChange={(e) => setForm({ ...form, allowanceFrequency: e.target.value, allowanceDay: e.target.value === "monthly" ? "5" : "1" })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500">
                {frequencyOptions.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.allowanceFrequency === "monthly" ? "Dia do mês para pagamento" : "Dia da semana para pagamento"}
              </label>
              {form.allowanceFrequency === "monthly" ? (
                <select value={form.allowanceDay} onChange={(e) => setForm({ ...form, allowanceDay: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (<option key={d} value={d}>Dia {d}</option>))}
                </select>
              ) : (
                <select value={form.allowanceDay} onChange={(e) => setForm({ ...form, allowanceDay: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {weekDays.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN (4 dígitos)</label>
              <input type="password" maxLength={4} value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder={editing ? "Deixe vazio para manter" : "1234"} />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
              <button type="submit" disabled={saving || uploading} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                {saving ? "Salvando..." : editing ? "Salvar alterações" : "Adicionar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {children.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">👧</div>
          <h3 className="text-lg font-semibold text-gray-700">Nenhum filho cadastrado</h3>
          <p className="text-gray-400 mt-1">Adicione o primeiro filho para começar!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {children.map((child) => (
            <div key={child.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <ChildAvatar child={child} size="lg" />
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-lg">{child.name}</div>
                {child.nickname && <div className="text-gray-400 text-sm">"{child.nickname}"</div>}
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  <span>⭐ Nível {child.level}</span>
                  <span>🏆 {child.totalPoints} pts</span>
                  <span>💰 R$ {Number(child.allowanceAmount).toFixed(2)}</span>
                  <span>🔄 {frequencyOptions.find((f) => f.value === child.allowanceFrequency)?.label ?? "Mensal"}</span>
                  <span>📅 {child.allowanceFrequency === "monthly"
                    ? `Dia ${child.allowanceDay || 5}`
                    : weekDays.find((d) => d.value === String(child.allowanceDay))?.label ?? `Dia ${child.allowanceDay}`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Link href={`/dashboard/children/${child.id}`} className="text-sm text-purple-600 hover:text-purple-800 font-medium px-3 py-1.5 rounded-lg hover:bg-purple-50 transition">Ver →</Link>
                <button onClick={() => openEdit(child)} className="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">Editar</button>
                <button onClick={() => handleDelete(child.id)} className="text-sm text-red-400 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
