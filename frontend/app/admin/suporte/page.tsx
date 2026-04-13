"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface TRow {
  id: string; name: string; plan: string; createdAt: string;
  email?: string | null; lastLoginAt?: string | null;
  subscriptionStatus?: string | null; currentPeriodEnd?: string | null;
  childrenCount?: number; status?: string;
}
interface UserRow {
  name: string; email: string; lastLoginAt: string | null;
  tenant: { id: string; name: string; plan: string };
}
interface Data {
  suspended:  TRow[];
  pastDue:    TRow[];
  noChildren: TRow[];
  noTasks:    TRow[];
  noLogin30d: UserRow[];
}

const PLAN_CLS: Record<string, string> = {
  free:    "bg-slate-700 text-slate-300 border-slate-600",
  monthly: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  annual:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
};
const PLAN_LBL: Record<string, string> = { free: "Freemium", monthly: "Mensal", annual: "Anual" };

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtAgo(iso: string | null | undefined) {
  if (!iso) return "Nunca";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "hoje";
  if (days < 30)  return `${days}d atrás`;
  return `${Math.floor(days/30)}m atrás`;
}

function Section({ title, icon, accent, count, children }: {
  title: string; icon: string; accent: string; count: number; children: React.ReactNode;
}) {
  return (
    <div className={`bg-slate-900 border rounded-xl overflow-hidden ${accent}`}>
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <span>{icon}</span>
        <p className="text-slate-300 text-sm font-semibold">{title}</p>
        <span className="ml-auto text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{count}</span>
      </div>
      {children}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="px-5 py-8 text-center text-slate-600 text-sm">{msg}</div>;
}

export default function SuportePage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/suporte")
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center gap-3 py-24 justify-center"><div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" /><span className="text-slate-600 text-sm">Carregando...</span></div>;
  if (!data) return <div className="py-24 text-center text-red-400 text-sm">Falha ao carregar dados</div>;

  const total = data.suspended.length + data.pastDue.length + data.noChildren.length + data.noTasks.length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Suporte</h1>
          <p className="text-slate-500 text-sm mt-0.5">Alertas e contas que precisam de atenção</p>
        </div>
        {total > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-2 rounded-xl">
            ⚠️ {total} itens precisam de atenção
          </div>
        )}
      </div>

      <div className="space-y-4">

        {/* Suspended */}
        <Section title="Contas suspensas" icon="🔴" accent="border-red-800/40" count={data.suspended.length}>
          {data.suspended.length === 0 ? <Empty msg="Nenhuma conta suspensa" /> : (
            <div className="divide-y divide-slate-800/50">
              {data.suspended.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-medium">{t.name}</p>
                    <p className="text-slate-600 text-xs">{t.email ?? "—"}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md border font-medium flex-shrink-0 ${PLAN_CLS[t.plan] ?? PLAN_CLS.free}`}>{PLAN_LBL[t.plan] ?? t.plan}</span>
                  <span className="text-red-400 text-xs flex-shrink-0">Suspensa</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Past due */}
        <Section title="Pagamento pendente" icon="⚠️" accent="border-amber-800/40" count={data.pastDue.length}>
          {data.pastDue.length === 0 ? <Empty msg="Nenhum pagamento pendente" /> : (
            <div className="divide-y divide-slate-800/50">
              {data.pastDue.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-medium">{t.name}</p>
                    <p className="text-slate-600 text-xs">{t.email ?? "—"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-amber-400 text-xs font-semibold">past_due</p>
                    {t.currentPeriodEnd && <p className="text-slate-600 text-xs">Vence {fmtDate(t.currentPeriodEnd)}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* No children */}
        <Section title="Famílias sem filhos cadastrados" icon="👶" accent="border-slate-700" count={data.noChildren.length}>
          {data.noChildren.length === 0 ? <Empty msg="Todas as famílias têm filhos cadastrados" /> : (
            <div className="divide-y divide-slate-800/50">
              {data.noChildren.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-medium">{t.name}</p>
                    <p className="text-slate-600 text-xs">{t.email ?? "—"}</p>
                  </div>
                  <p className="text-slate-600 text-xs flex-shrink-0">Cadastro: {fmtDate(t.createdAt)}</p>
                  <p className="text-slate-600 text-xs flex-shrink-0">Acesso: {fmtAgo(t.lastLoginAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* No tasks */}
        <Section title="Famílias com filhos mas sem tarefas" icon="📋" accent="border-slate-700" count={data.noTasks.length}>
          {data.noTasks.length === 0 ? <Empty msg="Todas as famílias com filhos têm tarefas" /> : (
            <div className="divide-y divide-slate-800/50">
              {data.noTasks.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-medium">{t.name}</p>
                    <p className="text-slate-600 text-xs">{t.email ?? "—"}</p>
                  </div>
                  <p className="text-slate-500 text-xs flex-shrink-0">{t.childrenCount} {t.childrenCount === 1 ? "filho" : "filhos"}</p>
                  <p className="text-slate-600 text-xs flex-shrink-0">Acesso: {fmtAgo(t.lastLoginAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Dormant 30d */}
        <Section title="Inativos há mais de 30 dias" icon="💤" accent="border-slate-700" count={data.noLogin30d.length}>
          {data.noLogin30d.length === 0 ? <Empty msg="Todos os usuários acessaram recentemente" /> : (
            <div className="divide-y divide-slate-800/50">
              {data.noLogin30d.map((u, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-medium">{u.tenant.name}</p>
                    <p className="text-slate-600 text-xs">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md border font-medium flex-shrink-0 ${PLAN_CLS[u.tenant.plan] ?? PLAN_CLS.free}`}>{PLAN_LBL[u.tenant.plan] ?? u.tenant.plan}</span>
                  <p className="text-amber-400/80 text-xs flex-shrink-0">{fmtAgo(u.lastLoginAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}
