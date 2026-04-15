import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "LGPD — KidsTasks",
  description: "Como o KidsTasks cumpre a Lei Geral de Proteção de Dados (LGPD) e garante os direitos dos titulares.",
};

export default function LgpdPage() {
  const updated = "15 de abril de 2025";

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "var(--font-jakarta, var(--font-geist-sans))" }}>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="KidsTasks" width={40} height={40} />
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">KidsTasks</span>
          </Link>
          <Link href="/login" className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            Entrar
          </Link>
        </div>
      </header>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">🇧🇷 Conformidade LGPD</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-5 mb-2">LGPD — Lei Geral de Proteção de Dados</h1>
            <p className="text-gray-400 text-sm">Última atualização: {updated}</p>
          </div>

          {/* Destaque */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-10">
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">✅</span>
              <div>
                <p className="font-bold text-emerald-900 mb-1">O KidsTasks é 100% compatível com a LGPD</p>
                <p className="text-emerald-700 text-sm leading-relaxed">
                  Seguimos rigorosamente a Lei nº 13.709/2018. Seus dados e os dados dos seus filhos são tratados com transparência, segurança e respeito à sua privacidade.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">O que é a LGPD?</h2>
              <p>A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) é a legislação brasileira que regula o tratamento de dados pessoais por empresas e organizações. Ela garante direitos fundamentais de privacidade e proteção de dados aos cidadãos brasileiros, seguindo padrões internacionais como o GDPR europeu.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Seus direitos como titular de dados</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: "🔍", right: "Acesso", desc: "Saber quais dados seus temos armazenados" },
                  { icon: "✏️", right: "Correção", desc: "Corrigir dados incompletos ou desatualizados" },
                  { icon: "🗑️", right: "Exclusão", desc: "Solicitar a remoção dos seus dados" },
                  { icon: "📦", right: "Portabilidade", desc: "Receber seus dados em formato estruturado" },
                  { icon: "🚫", right: "Oposição", desc: "Opor-se ao tratamento baseado em legítimo interesse" },
                  { icon: "🔓", right: "Revogação", desc: "Retirar o consentimento a qualquer momento" },
                  { icon: "ℹ️", right: "Informação", desc: "Saber com quem compartilhamos seus dados" },
                  { icon: "⚖️", right: "Revisão", desc: "Solicitar revisão de decisões automatizadas" },
                ].map((item) => (
                  <div key={item.right} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{item.right}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Como exercer seus direitos</h2>
              <p>Para exercer qualquer um dos direitos acima, basta entrar em contato conosco:</p>
              <div className="bg-violet-50 rounded-xl p-4 border border-violet-100 mt-3">
                <p className="font-bold text-violet-900 text-sm">📧 suporte@kidstasks.com.br</p>
                <p className="text-violet-600 text-xs mt-1">Respondemos em até 15 dias úteis, conforme prazo legal da LGPD.</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Bases legais que utilizamos</h2>
              <p className="mb-3">Todo tratamento de dados no KidsTasks possui base legal clara:</p>
              <div className="space-y-3">
                {[
                  { base: "Execução de contrato", desc: "Tratamento necessário para prestar o serviço contratado (art. 7º, V)." },
                  { base: "Consentimento", desc: "Quando solicitamos autorização expressa para tratar dados opcionais (art. 7º, I)." },
                  { base: "Legítimo interesse", desc: "Para fins de segurança, prevenção de fraudes e melhoria da plataforma (art. 7º, IX)." },
                  { base: "Cumprimento de obrigação legal", desc: "Quando exigido por lei ou autoridade competente (art. 7º, II)." },
                ].map((item) => (
                  <div key={item.base} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.base}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Proteção de dados de crianças</h2>
              <p>O KidsTasks aplica cuidados especiais ao tratar dados de menores:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>Dados de crianças só são cadastrados pelos responsáveis legais.</li>
                <li>Não coletamos dados desnecessários de menores (sem CPF, endereço, fotos reais).</li>
                <li>O acesso aos dados dos filhos é restrito aos responsáveis da família cadastrada.</li>
                <li>Seguimos o art. 14 da LGPD sobre tratamento de dados de crianças e adolescentes.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Medidas de segurança adotadas</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "🔐 Criptografia SSL/TLS em todas as comunicações",
                  "🔒 Senhas armazenadas com hash bcrypt",
                  "🛡️ Acesso interno restrito por função",
                  "🇧🇷 Dados armazenados em servidores no Brasil",
                  "📋 Logs de auditoria de acessos",
                  "🔄 Backups regulares e criptografados",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Encarregado de Dados (DPO)</h2>
              <p>Nomeamos um Encarregado de Proteção de Dados responsável por garantir o cumprimento da LGPD e atender solicitações dos titulares.</p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-3">
                <p className="text-sm text-gray-700"><strong>Contato do DPO:</strong> suporte@kidstasks.com.br</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Incidentes de segurança</h2>
              <p>Em caso de incidente que possa afetar seus dados, nos comprometemos a notificar a Autoridade Nacional de Proteção de Dados (ANPD) e os titulares afetados nos prazos previstos pela LGPD.</p>
            </div>

          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← Voltar para o início</Link>
        <span className="mx-3">·</span>
        <Link href="/privacidade" className="hover:text-gray-600">Privacidade</Link>
        <span className="mx-3">·</span>
        <Link href="/termos" className="hover:text-gray-600">Termos de uso</Link>
      </footer>
    </main>
  );
}
