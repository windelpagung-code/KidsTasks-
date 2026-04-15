import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Sobre nós — KidsTasks",
  description: "Conheça a história e a missão do KidsTasks: ajudar famílias brasileiras a criar filhos mais responsáveis.",
};

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "var(--font-jakarta, var(--font-geist-sans))" }}>
      {/* Navbar */}
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

      {/* Hero */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4c1d95 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-semibold text-violet-300 bg-violet-900/40 px-4 py-1.5 rounded-full border border-violet-700/50">
            Nossa história
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-6 leading-tight">
            Criado por pais,<br />para pais.
          </h1>
          <p className="text-lg text-violet-200 mt-6 leading-relaxed max-w-2xl mx-auto">
            O KidsTasks nasceu de uma necessidade real: tornar a educação financeira e a responsabilidade parte natural da rotina familiar — de um jeito que as crianças de hoje entendem.
          </p>
        </div>
      </section>

      {/* Missão */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Nossa missão</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Acreditamos que crianças responsáveis se tornam adultos realizados. Por isso, criamos uma plataforma que transforma tarefas domésticas em experiências de aprendizado — com gamificação, mesada virtual e educação financeira desde cedo.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Queremos que cada família brasileira tenha acesso a uma ferramenta simples, divertida e eficaz para criar filhos mais organizados, responsáveis e conscientes do valor do dinheiro.
              </p>
            </div>
            <div className="bg-violet-50 rounded-2xl p-8 border border-violet-100">
              <div className="space-y-5">
                {[
                  { icon: "🎯", title: "Propósito", text: "Formar crianças responsáveis e financeiramente conscientes" },
                  { icon: "❤️", title: "Valores", text: "Família, transparência, diversão e aprendizado contínuo" },
                  { icon: "🚀", title: "Visão", text: "Ser a principal plataforma de educação familiar do Brasil" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">KidsTasks em números</h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: "500+", label: "Famílias cadastradas" },
              { value: "12k+", label: "Tarefas completadas" },
              { value: "98%", label: "Satisfação dos pais" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <p className="text-3xl font-extrabold" style={{ color: "#7c3aed" }}>{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Faça parte dessa história</h2>
          <p className="text-gray-500 mb-8">Comece gratuitamente e transforme a rotina da sua família hoje mesmo.</p>
          <Link href="/register" className="inline-block px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            Começar gratuitamente
          </Link>
        </div>
      </section>

      {/* Footer simples */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← Voltar para o início</Link>
        <span className="mx-3">·</span>
        <span>© {new Date().getFullYear()} KidsTasks. Todos os direitos reservados.</span>
      </footer>
    </main>
  );
}
