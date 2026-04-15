import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Blog — KidsTasks",
  description: "Dicas de educação financeira, rotina familiar e desenvolvimento infantil para pais modernos.",
};

const posts = [
  {
    tag: "Educação financeira",
    title: "Como ensinar o valor do dinheiro para crianças de 6 a 12 anos",
    excerpt: "Crianças que aprendem sobre dinheiro cedo desenvolvem hábitos financeiros mais saudáveis na vida adulta. Veja como tornar esse aprendizado divertido.",
    readTime: "5 min",
    date: "10 abr 2025",
    emoji: "💰",
  },
  {
    tag: "Rotina familiar",
    title: "7 tarefas domésticas ideais para cada faixa etária",
    excerpt: "Delegar responsabilidades de acordo com a idade da criança é essencial. Confira nossa lista com sugestões práticas para toda a família.",
    readTime: "4 min",
    date: "02 abr 2025",
    emoji: "🏠",
  },
  {
    tag: "Gamificação",
    title: "Por que a gamificação funciona melhor do que punição",
    excerpt: "Estudos mostram que recompensas positivas são muito mais eficazes do que castigos. Entenda a ciência por trás do sistema de pontos do KidsTasks.",
    readTime: "6 min",
    date: "25 mar 2025",
    emoji: "🎮",
  },
  {
    tag: "Mesada",
    title: "Mesada: quanto dar e como estruturar para seu filho",
    excerpt: "Não existe um valor certo — mas existe uma estrutura certa. Veja como organizar a mesada do seu filho de forma que ela realmente ensine.",
    readTime: "5 min",
    date: "18 mar 2025",
    emoji: "🪙",
  },
  {
    tag: "Desenvolvimento",
    title: "Responsabilidade infantil: como desenvolver sem pressão",
    excerpt: "Criar filhos responsáveis exige equilíbrio entre autonomia e limites. Confira estratégias que funcionam na prática para famílias ocupadas.",
    readTime: "7 min",
    date: "10 mar 2025",
    emoji: "🌱",
  },
  {
    tag: "Poupança",
    title: "Metas de poupança para crianças: como tornar divertido",
    excerpt: "Quando a criança tem um objetivo claro — um brinquedo, uma viagem — ela aprende o valor de guardar dinheiro de forma natural e motivada.",
    readTime: "4 min",
    date: "03 mar 2025",
    emoji: "🎯",
  },
];

export default function BlogPage() {
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

      {/* Header */}
      <section className="py-16 px-6 text-center border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100">
            📚 Blog KidsTasks
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-5 mb-3">Família mais inteligente,<br />filhos mais felizes.</h1>
          <p className="text-gray-500 text-lg">Dicas práticas de educação financeira, rotina e desenvolvimento para pais modernos.</p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.title} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 h-36 flex items-center justify-center text-5xl">
                {post.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">{post.tag}</span>
                  <span className="text-xs text-gray-400">{post.readTime} de leitura</span>
                </div>
                <h2 className="font-bold text-gray-900 text-sm leading-snug mb-2">{post.title}</h2>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <span className="text-xs font-semibold text-violet-600">Ler artigo →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-3xl mb-4">✉️</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Receba novos artigos</h2>
          <p className="text-gray-500 text-sm mb-6">Uma vez por semana, dicas práticas direto na sua caixa de entrada.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <button className="px-5 py-3 rounded-xl text-white text-sm font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              Assinar
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← Voltar para o início</Link>
        <span className="mx-3">·</span>
        <span>© {new Date().getFullYear()} KidsTasks. Todos os direitos reservados.</span>
      </footer>
    </main>
  );
}
