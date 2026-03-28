"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

interface Tenant { name: string; plan: string }
interface SubInfo {
  plan: string;
  status: string;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  hasStripe: boolean;
}

const paidFeatures = [
  "Até 5 filhos cadastrados",
  "Tarefas ilimitadas com recorrência",
  "Carteira financeira completa",
  "Poupança com metas por filho",
  "Loja de pontos e resgates",
  "Badges e metas especiais",
  "Co-responsáveis (editor e leitor)",
  "Impressão de relatório de tarefas",
  "Suporte por e-mail",
];

const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "R$ 0",
    period: "",
    color: "border-gray-200",
    badge: "",
    priceId: null,
    features: [
      "1 filho cadastrado",
      "5 tarefas ativas",
      "Carteira financeira básica",
      "Gamificação: pontos e níveis",
    ],
    cta: "Começar grátis",
  },
  {
    id: "monthly",
    name: "Mensal",
    price: "R$ 19,90",
    period: "/mês",
    color: "border-purple-300",
    badge: "",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "price_1TFZouDoy9NpsPhd38URiaCJ",
    features: paidFeatures,
    cta: "Assinar mensal",
  },
  {
    id: "annual",
    name: "Anual",
    price: "R$ 118,80",
    period: "/ano · R$ 9,90/mês",
    color: "border-violet-500 ring-2 ring-violet-500",
    badge: "Mais popular · 50% off",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL || "price_1TFZqMDoy9NpsPhdTiCeUmv7",
    features: paidFeatures,
    cta: "Assinar anual",
  },
];

const planLabels: Record<string, string> = { free: "Gratuito", monthly: "Mensal", annual: "Anual" };

const subStatusLabel: Record<string, { label: string; color: string }> = {
  active:   { label: "Ativa", color: "text-green-600 bg-green-50 border-green-200" },
  trialing: { label: "Período de teste", color: "text-blue-600 bg-blue-50 border-blue-200" },
  past_due: { label: "Pagamento pendente", color: "text-orange-600 bg-orange-50 border-orange-200" },
  canceled: { label: "Cancelada", color: "text-gray-600 bg-gray-50 border-gray-200" },
  incomplete: { label: "Incompleta", color: "text-red-600 bg-red-50 border-red-200" },
};

function BillingContent() {
  const searchParams = useSearchParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [subInfo, setSubInfo] = useState<SubInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [openingPortal, setOpeningPortal] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/tenant/dashboard").then((r) => setTenant(r.data.tenant)),
      api.get("/stripe/subscription").then((r) => setSubInfo(r.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleCheckout(priceId: string, planId: string) {
    setCheckingOut(planId);
    try {
      const { data } = await api.post("/stripe/checkout", { priceId });
      window.location.href = data.url;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e.response?.data?.message || "Erro ao iniciar checkout");
      setCheckingOut(null);
    }
  }

  async function handlePortal() {
    setOpeningPortal(true);
    try {
      const { data } = await api.post("/stripe/portal");
      window.location.href = data.url;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e.response?.data?.message || "Erro ao abrir portal");
      setOpeningPortal(false);
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="text-4xl animate-bounce">💳</div></div>;

  const currentPlan = subInfo?.plan || tenant?.plan || "free";
  const isSuspended = subInfo?.status === "suspended";
  const statusInfo = subInfo?.subscriptionStatus ? subStatusLabel[subInfo.subscriptionStatus] : null;

  return (
    <div className="max-w-4xl mx-auto">

      {/* Payment success banner */}
      {searchParams.get("payment") === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-green-700">Assinatura ativada com sucesso!</p>
            <p className="text-green-600 text-sm">Seu plano já está ativo. Aproveite todos os recursos!</p>
          </div>
        </div>
      )}

      {/* Suspended banner */}
      {isSuspended && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5 mb-6 flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div className="flex-1">
            <p className="font-bold text-red-700 mb-1">Conta suspensa por falta de pagamento</p>
            <p className="text-red-600 text-sm mb-3">
              O acesso aos recursos está bloqueado. Regularize sua assinatura para reativar.
            </p>
            <button onClick={handlePortal} disabled={openingPortal}
              className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-700 transition disabled:opacity-50">
              {openingPortal ? "Abrindo portal..." : "Regularizar pagamento"}
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Planos e assinatura 💳</h1>
        <p className="text-gray-500 mt-1">
          Plano atual: <span className="font-semibold text-purple-700">{planLabels[currentPlan]}</span>
        </p>
      </div>

      {/* Subscription info card (paid users) */}
      {subInfo?.hasStripe && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">Status da assinatura</p>
              {statusInfo ? (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              ) : (
                <span className="text-sm text-gray-600">—</span>
              )}
            </div>
            {subInfo.currentPeriodEnd && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Próxima renovação</p>
                <p className="text-sm font-semibold text-gray-700">
                  {new Date(subInfo.currentPeriodEnd).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
            )}
          </div>
          <button onClick={handlePortal} disabled={openingPortal}
            className="bg-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-purple-700 transition disabled:opacity-50">
            {openingPortal ? "Abrindo..." : "⚙️ Gerenciar assinatura"}
          </button>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div key={plan.id} className={`bg-white rounded-2xl border p-6 flex flex-col relative ${
              isCurrent ? "border-green-400 ring-2 ring-green-400" : plan.color
            }`}>

              {/* Badge */}
              {isCurrent ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  ✓ Plano atual
                </div>
              ) : plan.badge ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              ) : null}

              <h2 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h2>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500 shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button disabled className="w-full py-2.5 rounded-xl font-semibold text-sm bg-green-100 text-green-700 cursor-default">
                  ✓ Ativo
                </button>
              ) : plan.priceId ? (
                <button
                  onClick={() => handleCheckout(plan.priceId!, plan.id)}
                  disabled={!!checkingOut}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {checkingOut === plan.id ? "Redirecionando..." : plan.cta}
                </button>
              ) : (
                <button disabled className="w-full py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-400 cursor-not-allowed">
                  {plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-yellow-800">
        <p className="font-semibold mb-1">💡 Segurança no pagamento</p>
        <p>Todos os pagamentos são processados com segurança pela <strong>Stripe</strong>, a plataforma de pagamentos mais utilizada do mundo. Seus dados do cartão nunca passam pelos nossos servidores.</p>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="text-4xl animate-bounce">💳</div></div>}>
      <BillingContent />
    </Suspense>
  );
}
