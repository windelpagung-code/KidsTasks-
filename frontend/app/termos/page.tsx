import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Termos de Uso — KidsTasks",
  description: "Leia os termos de uso do KidsTasks e saiba seus direitos e obrigações como usuário da plataforma.",
};

export default function TermosPage() {
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
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100">📄 Legal</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-5 mb-2">Termos de Uso</h1>
            <p className="text-gray-400 text-sm">Última atualização: {updated}</p>
          </div>

          <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-amber-800 font-medium text-sm">
                Ao criar uma conta no KidsTasks, você concorda com estes Termos de Uso. Leia com atenção antes de utilizar a plataforma.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Aceitação dos termos</h2>
              <p>Ao acessar ou usar o KidsTasks, você confirma que leu, entendeu e concorda em se vincular a estes Termos de Uso e à nossa Política de Privacidade. Se não concordar com algum ponto, não utilize a plataforma.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. Descrição do serviço</h2>
              <p>O KidsTasks é uma plataforma de gestão familiar que oferece:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>Criação e atribuição de tarefas domésticas para filhos.</li>
                <li>Sistema de pontuação e gamificação de responsabilidades.</li>
                <li>Carteira virtual com controle de mesada e poupança.</li>
                <li>Loja de recompensas configurável pelos responsáveis.</li>
                <li>Painel de gestão para pais e responsáveis.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. Cadastro e conta</h2>
              <p>Para utilizar o KidsTasks você deve:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>Ter 18 anos ou mais (responsável legal pela família cadastrada).</li>
                <li>Fornecer informações verdadeiras e atualizadas.</li>
                <li>Manter a confidencialidade da sua senha.</li>
                <li>Ser responsável por todas as atividades realizadas com sua conta.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Planos e pagamentos</h2>
              <p>O KidsTasks oferece planos gratuito e pagos. Nos planos pagos:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>A cobrança é realizada mensalmente ou anualmente, conforme o plano escolhido.</li>
                <li>Os valores podem ser ajustados com aviso prévio de 30 dias.</li>
                <li>O cancelamento pode ser feito a qualquer momento, com acesso garantido até o fim do período já pago.</li>
                <li>Não realizamos reembolsos proporcionais por cancelamentos antecipados, exceto em casos de erro de cobrança.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Uso permitido</h2>
              <p>Você pode usar o KidsTasks para fins pessoais e familiares. É proibido:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>Revender ou sublicenciar o acesso à plataforma.</li>
                <li>Usar a plataforma para fins ilegais ou prejudiciais a terceiros.</li>
                <li>Tentar acessar áreas restritas ou dados de outras famílias.</li>
                <li>Realizar engenharia reversa ou extrair código da plataforma.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. Moeda virtual e carteira</h2>
              <p>Os pontos, moedas e saldos da carteira virtual do KidsTasks:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>São meramente virtuais, sem valor monetário real.</li>
                <li>Não podem ser convertidos em dinheiro real ou transferidos entre famílias.</li>
                <li>São gerenciados exclusivamente pelos responsáveis cadastrados como administradores.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Disponibilidade do serviço</h2>
              <p>Nos esforçamos para manter a plataforma disponível 24/7, mas não garantimos disponibilidade ininterrupta. Manutenções programadas serão comunicadas com antecedência sempre que possível.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Limitação de responsabilidade</h2>
              <p>O KidsTasks não se responsabiliza por:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-2">
                <li>Danos indiretos, incidentais ou consequenciais decorrentes do uso da plataforma.</li>
                <li>Perdas de dados por falha do usuário em manter seus dados de acesso seguros.</li>
                <li>Resultados educacionais ou comportamentais específicos em crianças.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. Encerramento de conta</h2>
              <p>Você pode encerrar sua conta a qualquer momento pelo painel de configurações. O KidsTasks pode suspender ou encerrar contas que violem estes termos, sem aviso prévio em casos graves.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">10. Alterações nos termos</h2>
              <p>Podemos atualizar estes termos a qualquer momento. Notificaremos por e-mail com antecedência mínima de 15 dias em caso de alterações relevantes. O uso continuado após esse prazo implica aceitação dos novos termos.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">11. Lei aplicável e foro</h2>
              <p>Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo/SP para resolução de conflitos, salvo disposição legal em contrário.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">12. Contato</h2>
              <p>Dúvidas sobre estes termos? Entre em contato: <strong>suporte@kidstasks.com.br</strong></p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← Voltar para o início</Link>
        <span className="mx-3">·</span>
        <Link href="/privacidade" className="hover:text-gray-600">Privacidade</Link>
        <span className="mx-3">·</span>
        <Link href="/lgpd" className="hover:text-gray-600">LGPD</Link>
      </footer>
    </main>
  );
}
