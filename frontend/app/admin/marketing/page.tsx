"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface UserRow {
  name: string; email: string; lastLoginAt: string | null;
  tenant: { name: string; plan: string; createdAt: string; currentPeriodEnd?: string | null };
}
interface Segment { count: number; users: UserRow[] }
interface Data {
  segments: {
    freemium:    Segment;
    monthly:     Segment;
    annual:      Segment;
    inactive30d: Segment;
    neverLogged: Segment;
  };
}

type SegKey = "freemium" | "monthly" | "annual" | "inactive30d" | "neverLogged";

const SEG_META: Record<SegKey, { label: string; desc: string; color: string; icon: string }> = {
  freemium:    { label: "Freemium",             desc: "Usuários no plano gratuito — oportunidade de conversão", color: "border-slate-700 bg-slate-800/50",        icon: "🆓" },
  monthly:     { label: "Plano Mensal",         desc: "Clientes pagantes — candidatos a upgrade anual",          color: "border-violet-700/40 bg-violet-900/20",   icon: "💜" },
  annual:      { label: "Plano Anual",          desc: "Clientes mais comprometidos — foco em retenção",          color: "border-emerald-700/40 bg-emerald-900/20", icon: "🌟" },
  inactive30d: { label: "Inativos 30+ dias",   desc: "Não acessam há mais de 30 dias — risco de churn",         color: "border-amber-700/40 bg-amber-900/20",     icon: "⚠️" },
  neverLogged: { label: "Nunca acessaram",     desc: "Cadastraram mas nunca entraram — onboarding necessário",  color: "border-red-700/40 bg-red-900/20",         icon: "🔴" },
};

function downloadCSV(users: UserRow[], filename: string) {
  const bom = "\uFEFF";
  const header = "nome_familia,nome_usuario,email,plano,data_cadastro,ultimo_acesso";
  const lines = users.map((u) => [
    `"${u.tenant.name}"`,
    `"${u.name}"`,
    `"${u.email}"`,
    `"${u.tenant.plan}"`,
    `"${u.tenant.createdAt.slice(0, 10)}"`,
    `"${u.lastLoginAt ? u.lastLoginAt.slice(0, 10) : ""}"`,
  ].join(","));
  const csv = bom + [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

export default function MarketingPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<SegKey | null>(null);

  useEffect(() => {
    api.get("/admin/marketing")
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center gap-3 py-24 justify-center"><div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" /><span className="text-slate-600 text-sm">Carregando...</span></div>;
  if (!data) return <div className="py-24 text-center text-red-400 text-sm">Falha ao carregar dados</div>;

  const total = Object.values(data.segments).reduce((s, seg) => s + seg.count, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Marketing</h1>
        <p className="text-slate-500 text-sm mt-0.5">Segmentação de usuários para campanhas de email</p>
      </div>

      {/* Total */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
        <div>
          <p className="text-slate-500 text-xs">Total de contatos</p>
          <p className="text-3xl font-bold text-slate-100 tabular-nums">{total}</p>
        </div>
        <div className="h-10 w-px bg-slate-700" />
        <p className="text-slate-500 text-xs leading-relaxed">
          Selecione um segmento abaixo para ver os contatos e exportar o CSV para uso em ferramentas de email marketing (Mailchimp, Brevo, etc.)
        </p>
      </div>

      {/* Segments */}
      <div className="space-y-3">
        {(Object.entries(SEG_META) as [SegKey, typeof SEG_META[SegKey]][]).map(([key, meta]) => {
          const seg = data.segments[key];
          const isOpen = open === key;
          return (
            <div key={key} className={`border rounded-xl overflow-hidden transition-all ${meta.color}`}>
              {/* Header */}
              <button
                onClick={() => setOpen(isOpen ? null : key)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{meta.icon}</span>
                  <div>
                    <p className="text-slate-200 text-sm font-semibold">{meta.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{meta.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-2xl font-bold text-slate-200 tabular-nums">{seg.count}</span>
                  {seg.count > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadCSV(seg.users, `kidstasks-${key}-${new Date().toISOString().slice(0,10)}.csv`); }}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ↓ CSV
                    </button>
                  )}
                  <span className="text-slate-600 text-sm">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* List */}
              {isOpen && seg.count > 0 && (
                <div className="border-t border-white/5 divide-y divide-white/5 max-h-80 overflow-y-auto">
                  {seg.users.map((u, i) => (
                    <div key={i} className="px-5 py-2.5 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-300 text-xs font-medium truncate">{u.tenant.name}</p>
                        <p className="text-slate-600 text-xs truncate">{u.email}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-slate-500 text-xs">{u.tenant.createdAt.slice(0, 10)}</p>
                        {u.lastLoginAt && <p className="text-slate-700 text-xs">{u.lastLoginAt.slice(0, 10)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isOpen && seg.count === 0 && (
                <div className="border-t border-white/5 px-5 py-6 text-center text-slate-600 text-sm">
                  Nenhum usuário neste segmento
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
