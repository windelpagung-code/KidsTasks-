import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Política de Privacidade — KidsTasks",
  description: "Saiba como o KidsTasks coleta, usa e protege os dados da sua família.",
};

export default function PrivacidadePage() {
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
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100">🔒 Privacidade</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-5 mb-2">Política de Privacidade</h1>
            <p className="text-gray-400 text-sm">Última atualização: {updated}</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-sm leading-relaxed">

            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
              <p className="text-violet-800 font-medium text-sm">
                O KidsTasks valoriza a privacidade da sua família acima de tudo. Esta política explica de forma clara e objetiva quais dados coletamos, como os utilizamos e quais são seus direitos como titular.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Quem somos</h2>
              <p>O KidsTasks é uma plataforma digital de gestão familiar e educação financeira infantil, operada no Brasil em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. Dados que coletamos</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Dados de cadastro:</strong> nome, e-mail e senha (criptografada) dos responsáveis pela família.</li>
                <li><strong>Dados dos filhos:</strong> nome, idade e avatar (sem dados sensíveis ou documentos).</li>
                <li><strong>Dados de uso:</strong> tarefas criadas, pontos atribuídos, transações da carteira virtual e histórico de recompensas.</li>
                <li><strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo, navegador e logs de acesso para fins de segurança.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. Como usamos seus dados</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Prestar e melhorar os serviços da plataforma.</li>
                <li>Enviar comunicações relacionadas à conta (notificações, alertas de tarefas).</li>
                <li>Garantir a segurança da conta e prevenir fraudes.</li>
                <li>Cumprir obrigações legais e regulatórias.</li>
              </ul>
              <p className="mt-3">Jamais vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de publicidade.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Base legal para o tratamento</h2>
              <p>O tratamento dos seus dados é realizado com base em:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Execução de contrato (prestação do serviço).</li>
                <li>Consentimento do titular (quando aplicável).</li>
                <li>Legítimo interesse (segurança e melhoria da plataforma).</li>
                <li>Cumprimento de obrigação legal.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Compartilhamento de dados</h2>
              <p>Seus dados podem ser compartilhados apenas com:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Provedores de infraestrutura:</strong> servidores de hospedagem localizados no Brasil.</li>
                <li><strong>Processadores de pagamento:</strong> para gestão de assinaturas, mediante seus próprios termos de privacidade.</li>
                <li><strong>Autoridades:</strong> quando exigido por lei ou ordem judicial.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. Dados de crianças</h2>
              <p>O KidsTasks é uma plataforma destinada ao controle parental. Os dados de menores de 18 anos só são cadastrados pelos próprios responsáveis legais e são tratados com cuidado redobrado, sem coleta de informações desnecessárias ou sensíveis.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Segurança dos dados</h2>
              <p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Comunicação criptografada via SSL/TLS.</li>
                <li>Senhas armazenadas com hash seguro (bcrypt).</li>
                <li>Acesso restrito aos dados por nossa equipe.</li>
                <li>Monitoramento de segurança contínuo.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Seus direitos (LGPD)</h2>
              <p>Como titular dos dados, você tem direito a:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Confirmar a existência e acessar seus dados.</li>
                <li>Corrigir dados incompletos ou desatualizados.</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                <li>Revogar o consentimento a qualquer momento.</li>
                <li>Solicitar a portabilidade dos dados.</li>
              </ul>
              <p className="mt-3">Para exercer seus direitos, entre em contato: <strong>suporte@kidstasks.com.br</strong></p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. Retenção de dados</h2>
              <p>Seus dados são mantidos enquanto a conta estiver ativa. Após o encerramento, os dados são excluídos em até 90 dias, salvo obrigação legal de retenção maior.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">10. Alterações nesta política</h2>
              <p>Podemos atualizar esta política periodicamente. Notificaremos os usuários por e-mail em caso de alterações relevantes. O uso continuado da plataforma após a notificação implica aceitação das mudanças.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">11. Contato</h2>
              <p>Dúvidas sobre esta política? Fale com nosso Encarregado de Dados (DPO):</p>
              <p className="mt-2 font-medium text-gray-900">📧 suporte@kidstasks.com.br</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← Voltar para o início</Link>
        <span className="mx-3">·</span>
        <Link href="/termos" className="hover:text-gray-600">Termos de uso</Link>
        <span className="mx-3">·</span>
        <Link href="/lgpd" className="hover:text-gray-600">LGPD</Link>
      </footer>
    </main>
  );
}
